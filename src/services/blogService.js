const db = require('../models');
const kafkaModule = require('../kafka'); // import Kafka bình thường

class BlogService {

  // Tạo blog mới, status = hidden
  async createBlog(authorId, data, files) {
    const { content, category } = data;

    // Tạo blog (status = hidden)
    const newBlog = await db.Blog.create({
      content,
      category: category || null,
      status: 'hidden',
      authorId
    });

    // Tạo record media (status = pending)
    const allFiles = [...(files?.images || []), ...(files?.files || [])];
    const mediaRecords = allFiles.map(f => ({
      blogId: newBlog.id,
      url: null,
      type: f.fieldname === 'files' ? 'file' : 'image',
      originalName: f.originalname,
      mimeType: f.mimetype,
      size: f.size,
      status: 'pending'
    }));

    const createdMedia = mediaRecords.length
      ? await db.BlogMedia.bulkCreate(mediaRecords, { returning: true })
      : [];

    // Gửi event Kafka
    for (let i = 0; i < createdMedia.length; i++) {
      const media = createdMedia[i];
      const file = allFiles[i];
      if (!file) continue;

      await kafkaModule.producers.blogMediaProducer.sendMediaUploadEvent({
        blogMediaId: media.id,
        blogId: newBlog.id,
        type: media.type,
        mimeType: file.mimetype,
        bufferBase64: file.buffer.toString('base64')
      });
    }

    // Trả về thông tin blog
    return await db.Blog.findByPk(newBlog.id, {
      include: [
        { model: db.BlogMedia, as: 'media' },
        { model: db.User, as: 'author', attributes: ['id', 'username'] }
      ]
    });
  }

  // Lấy danh sách blog
 async getAllBlogs(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  // 1. Query nhẹ chỉ để lấy count
  const total = await db.Blog.count({
    where: { deletedAt: null }
  });

  // 2. Query dữ liệu riêng
  const blogs = await db.Blog.findAll({
    offset,
    limit,
    order: [['createdAt', 'DESC']],
    include: [
      { model: db.BlogMedia, as: 'media' },
      { model: db.User, as: 'author', attributes: ['id', 'username'] }
    ]
  });

  return {
    total,
    blogs,
    currentPage: page,
    totalPages: Math.ceil(total / limit)
  };
}

  // Lấy blog theo ID
  async getBlogById(id) {
    const blog = await db.Blog.findByPk(id, {
      include: [
        { model: db.BlogMedia, as: 'media' },
        { model: db.User, as: 'author', attributes: ['id', 'username'] }
      ]
    });
    if (!blog) throw new Error('Không tìm thấy blog');
    return blog;
  }

  // Cập nhật blog
  async updateBlog(authorId, blogId, data, files) {
    const blog = await db.Blog.findByPk(blogId, { include: [{ model: db.BlogMedia, as: 'media' }] });
    if (!blog) throw new Error('Blog không tồn tại');
    if (blog.authorId !== authorId) throw new Error('Không có quyền chỉnh sửa');

    const updateData = {
      content: data.content ?? blog.content,
      category: data.category ?? blog.category,
      status: blog.status === 'hidden' ? 'hidden' : (data.status ?? blog.status)
    };
    await blog.update(updateData);

    // Xử lý upload file mới và gửi event Kafka
    const allFiles = [...(files?.images || []), ...(files?.files || [])];
    for (let f of allFiles) {
      const newMedia = await db.BlogMedia.create({
        blogId: blog.id,
        url: null,
        type: f.fieldname === 'files' ? 'file' : 'image',
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
        status: 'pending'
      });

      await kafkaModule.producers.blogMediaProducer.sendMediaUploadEvent({
        blogMediaId: newMedia.id,
        blogId: blog.id,
        type: newMedia.type,
        mimeType: f.mimetype,
        bufferBase64: f.buffer.toString('base64')
      });
    }

    return await this.getBlogById(blog.id);
  }

  // Xóa blog
  async deleteBlog(userId, role, blogId) {
    const blog = await db.Blog.findByPk(blogId, {
      include: [{ model: db.BlogMedia, as: 'media' }]
    });

    if (!blog) {
      const error = new Error('Blog không tồn tại');
      error.statusCode = 404;
      throw error;
    }

    const isAdmin = role === 'ADMIN';
    if (!isAdmin && blog.authorId !== userId) {
      const error = new Error('Không có quyền xóa');
      error.statusCode = 403;
      throw error;
    }

    // Xóa media nếu có
    if (blog.media && blog.media.length) {
      for (const m of blog.media) {
        if (m.publicId) {
          try {
            await cloudinary.uploader.destroy(m.publicId);
          } catch (err) {
            console.error(`[BlogService] Xóa media lỗi: ${m.id}`, err.message);
          }
        }
      }

      // Xóa record media
      await db.BlogMedia.destroy({ where: { blogId } });
    }

    // Xóa blog
    await blog.destroy();
  }

}

module.exports = new BlogService();
