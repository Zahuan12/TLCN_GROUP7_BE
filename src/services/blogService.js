const db = require('../models');
const cloudinary = require('../configs/cloudinary');
const { blogMediaProducer } = require('../kafka/producers');
require('dotenv').config();

class BlogService {
  /**
   * Gửi sự kiện upload qua Kafka
   */
  async sendUploadEvents(blogId, createdMedia, allFiles) {
    for (let i = 0; i < createdMedia.length; i++) {
      const media = createdMedia[i];
      const file = allFiles[i];
      if (!file) continue;

      await blogMediaProducer.sendMediaUploadEvent({
        blogMediaId: media.id,
        blogId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        type: media.type,
        bufferBase64: file.buffer.toString('base64'),
      });

      console.log(`[Kafka] Sent upload event for blogId=${blogId}, mediaId=${media.id}`);
    }
  }

  /**
   * 🆕 Tạo blog mới
   */
  async createBlog(authorId, data, files) {
    const { content, category, status } = data;
    if (!content && (!files || Object.keys(files).length === 0))
      throw new Error('Bài viết cần có nội dung hoặc file đính kèm');

    const t = await db.sequelize.transaction();

    try {
      // Tạo blog mới
      const newBlog = await db.Blog.create(
        {
          content,
          category: category || null,
          status: status || 'published',
          authorId,
        },
        { transaction: t }
      );

      // Gom file upload
      const allFiles = [...(files?.images || []), ...(files?.files || [])];

      const mediaRecords = allFiles.map((f) => ({
        blogId: newBlog.id,
        url: null,
        type: f.fieldname === 'files' ? 'file' : 'image',
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
        status: 'pending',
      }));

      const createdMedia = mediaRecords.length
        ? await db.BlogMedia.bulkCreate(mediaRecords, { returning: true, transaction: t })
        : [];

      await t.commit();

      // Sau khi commit, gửi event Kafka
      if (createdMedia.length) {
        await this.sendUploadEvents(newBlog.id, createdMedia, allFiles);
      }

      return await db.Blog.findByPk(newBlog.id, {
        include: [
          { model: db.BlogMedia, as: 'media' },
          { model: db.User, as: 'author', attributes: ['id', 'username'] },
        ],
      });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * ✏️ Cập nhật blog
   */
  async updateBlog(authorId, blogId, data, files) {
    const blog = await db.Blog.findByPk(blogId);
    if (!blog) throw new Error('Blog không tồn tại');
    if (blog.authorId !== authorId) throw new Error('Không có quyền chỉnh sửa');

    const t = await db.sequelize.transaction();

    try {
      const updateData = {
        content: data.content ?? blog.content,
        category: data.category ?? blog.category,
        status: data.status ?? blog.status,
      };

      await blog.update(updateData, { transaction: t });

      const allFiles = [...(files?.images || []), ...(files?.files || [])];

      const mediaRecords = allFiles.map((f) => ({
        blogId: blog.id,
        url: null,
        type: f.fieldname === 'files' ? 'file' : 'image',
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
        status: 'pending',
      }));

      const createdMedia = mediaRecords.length
        ? await db.BlogMedia.bulkCreate(mediaRecords, { returning: true, transaction: t })
        : [];

      await t.commit();

      if (createdMedia.length) {
        await this.sendUploadEvents(blog.id, createdMedia, allFiles);
      }

      return await this.getBlogById(blog.id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * 📤 Upload và cập nhật media (Kafka Consumer)
   */
  async uploadAndUpdateBlogMedia(blogMediaId, bufferBase64, type, blogId) {
    try {
      const buffer = Buffer.from(bufferBase64, 'base64');
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'blogs',
            resource_type: type === 'file' ? 'auto' : 'image',
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
      });

      await db.BlogMedia.update(
        {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          status: 'uploaded',
        },
        { where: { id: blogMediaId } }
      );

      console.log(`[BlogService] ✅ Uploaded blogId=${blogId}, mediaId=${blogMediaId}`);
      return uploadResult.secure_url;
    } catch (error) {
      console.error(`[BlogService] ❌ Upload failed blogId=${blogId}: ${error.message}`);
      await db.BlogMedia.update({ status: 'error' }, { where: { id: blogMediaId } });
      throw error;
    }
  }

  /**
   * 🧭 Lấy danh sách và chi tiết
   */
  async getAllBlogs(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const { count, rows } = await db.Blog.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
      include: [
        { model: db.BlogMedia, as: 'media' },
        { model: db.User, as: 'author', attributes: ['id', 'username'] },
      ],
    });
    return {
      total: count,
      blogs: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getBlogById(id) {
    const blog = await db.Blog.findByPk(id, {
      include: [
        { model: db.BlogMedia, as: 'media' },
        { model: db.User, as: 'author', attributes: ['id', 'username'] },
      ],
    });
    if (!blog) throw new Error('Không tìm thấy blog');
    return blog;
  }

  async deleteBlog(authorId, blogId) {
    const blog = await db.Blog.findByPk(blogId);
    if (!blog) throw new Error('Blog không tồn tại');
    if (blog.authorId !== authorId) throw new Error('Không có quyền xoá');
    await db.Blog.destroy({ where: { id: blogId } });
  }
}

module.exports = new BlogService();
