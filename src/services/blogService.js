// services/blogService.js
const db = require('../models');
const slugify = require('slugify');
const cloudinary = require('../configs/cloudinary');
const { blogMediaProducer } = require('../kafka/producers');
require('dotenv').config();

class BlogService {
  /**
   * 🧩 Helper: gửi event upload qua Kafka
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

      console.log(`[Kafka] 🚀 Sent upload event for blogId=${blogId}, mediaId=${media.id}`);
    }
  }

  /**
   * 📝 Tạo blog mới
   */
  async createBlog(authorId, data, files) {
    const { title, content, category, status } = data;
    if (!title || !content) throw new Error('Thiếu tiêu đề hoặc nội dung');

    const slug = slugify(title, { lower: true, strict: true });
    const t = await db.sequelize.transaction();

    try {
      // Tạo blog
      const newBlog = await db.Blog.create(
        { title, slug, content, category, status: status || 'published', authorId },
        { transaction: t }
      );

      // Gom tất cả file/ảnh
      const allFiles = [...(files?.images || []), ...(files?.files || [])];

      // Tạo record media
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

      // Sau khi commit mới gửi Kafka event
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
        title: data.title || blog.title,
        content: data.content || blog.content,
        category: data.category || blog.category,
        status: data.status || blog.status,
      };
      if (data.title && data.title !== blog.title) {
        updateData.slug = slugify(data.title, { lower: true, strict: true });
      }

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
   * 🌤 Upload và cập nhật media (dùng cho consumer)
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

      console.log(
        `[BlogService] ✅ Uploaded blogId=${blogId}, mediaId=${blogMediaId} → ${uploadResult.secure_url}`
      );
      return uploadResult.secure_url;
    } catch (error) {
      console.error(
        `[BlogService] ❌ Upload failed blogId=${blogId}, mediaId=${blogMediaId}:`,
        error.message
      );
      await db.BlogMedia.update({ status: 'error' }, { where: { id: blogMediaId } });
      throw error;
    }
  }

  /**
   * 🧭 Các hàm phụ trợ khác
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
