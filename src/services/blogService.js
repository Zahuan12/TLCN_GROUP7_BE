const db = require('../models');
const cloudinary = require('../configs/cloudinary');

class BlogService {

  // Tạo blog mới, upload song song với timeout
  async createBlog(authorId, data, files) {
    const startTime = Date.now();
    const { content, category } = data;

    // Tạo blog (status = hidden)
    const newBlog = await db.Blog.create({
      content,
      category: category || null,
      status: 'hidden',
      authorId
    });

    // Upload files song song (parallel)
    const allFiles = [...(files?.images || []), ...(files?.files || [])];
    
    if (allFiles.length === 0) {
      await newBlog.update({ status: 'published' });
      console.log(`[BlogService] Blog created (no files) in ${Date.now() - startTime}ms`);
      return await this.getBlogById(newBlog.id);
    }

    try {
      console.log(`[BlogService] Starting upload ${allFiles.length} files...`);
      const uploadStartTime = Date.now();

      // Upload tất cả files song song với timeout 30s/file
      const uploadPromises = allFiles.map(async (file, index) => {
        const type = file.fieldname === 'files' ? 'file' : 'image';
        
        // Upload to Cloudinary với timeout
        const uploadResult = await Promise.race([
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: 'blogs',
                resource_type: type === 'file' ? 'auto' : 'image',
                transformation: type === 'image' ? [
                  { quality: 'auto:good' }, // Auto quality optimization
                  { fetch_format: 'auto' }  // Auto format (webp if supported)
                ] : undefined
              },
              (err, result) => (err ? reject(err) : resolve(result))
            );
            stream.end(file.buffer);
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`Upload timeout for file ${index + 1}`)), 30000)
          )
        ]);

        console.log(`[BlogService] File ${index + 1}/${allFiles.length} uploaded: ${file.originalname}`);

        return {
          blogId: newBlog.id,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          type,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          status: 'uploaded'
        };
      });

      // Đợi tất cả upload xong
      const uploadedData = await Promise.all(uploadPromises);
      
      console.log(`[BlogService] All files uploaded in ${Date.now() - uploadStartTime}ms`);

      // Batch create media records (nhanh hơn từng cái)
      await db.BlogMedia.bulkCreate(uploadedData);

      // Set blog to published
      await newBlog.update({ status: 'published' });

      const totalTime = Date.now() - startTime;
      console.log(`[BlogService] Blog created successfully in ${totalTime}ms (${allFiles.length} files)`);
      console.log(`[BlogService] Average time per file: ${Math.round(totalTime / allFiles.length)}ms`);

    } catch (error) {
      // Rollback: delete blog and uploaded media if error
      console.error('[BlogService.createBlog] Upload error:', error);
      
      // Delete uploaded media from Cloudinary
      const uploadedMedia = await db.BlogMedia.findAll({ where: { blogId: newBlog.id } });
      const cleanupPromises = uploadedMedia
        .filter(m => m.publicId)
        .map(media => 
          cloudinary.uploader.destroy(media.publicId, { 
            resource_type: media.type === 'file' ? 'raw' : 'image' 
          }).catch(err => console.error('[BlogService] Cleanup error:', err))
        );
      
      await Promise.all(cleanupPromises);
      await db.BlogMedia.destroy({ where: { blogId: newBlog.id } });
      await newBlog.destroy();
      
      throw new Error('Lỗi upload media: ' + error.message);
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
    const startTime = Date.now();
    const blog = await db.Blog.findByPk(blogId, { include: [{ model: db.BlogMedia, as: 'media' }] });
    if (!blog) throw new Error('Blog không tồn tại');
    if (blog.authorId !== authorId) throw new Error('Không có quyền chỉnh sửa');

    const updateData = {
      content: data.content ?? blog.content,
      category: data.category ?? blog.category,
      status: data.status ?? blog.status
    };
    await blog.update(updateData);

    // Xử lý upload file mới song song
    const allFiles = [...(files?.images || []), ...(files?.files || [])];
    
    if (allFiles.length > 0) {
      try {
        console.log(`[BlogService] Updating blog with ${allFiles.length} new files...`);

        // Upload tất cả files song song với timeout
        const uploadPromises = allFiles.map(async (file, index) => {
          const type = file.fieldname === 'files' ? 'file' : 'image';
          
          // Upload to Cloudinary với timeout
          const uploadResult = await Promise.race([
            new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                {
                  folder: 'blogs',
                  resource_type: type === 'file' ? 'auto' : 'image',
                  transformation: type === 'image' ? [
                    { quality: 'auto:good' },
                    { fetch_format: 'auto' }
                  ] : undefined
                },
                (err, result) => (err ? reject(err) : resolve(result))
              );
              stream.end(file.buffer);
            }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error(`Upload timeout for file ${index + 1}`)), 30000)
            )
          ]);

          return {
            blogId: blog.id,
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            type,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            status: 'uploaded'
          };
        });

        // Đợi tất cả upload xong
        const uploadedData = await Promise.all(uploadPromises);
        
        // Batch create media records
        await db.BlogMedia.bulkCreate(uploadedData);

        console.log(`[BlogService] Blog updated in ${Date.now() - startTime}ms (${allFiles.length} files)`);

      } catch (error) {
        console.error('[BlogService.updateBlog] Upload error:', error);
        throw new Error('Lỗi upload media: ' + error.message);
      }
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
