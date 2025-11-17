const db = require('../models');
const cloudinary = require('../configs/cloudinary');

class BlogMediaHandler {

  async uploadAndUpdate(blogMediaId, bufferBase64, type, blogId, removeOldPublicId = null) {
    try {
      // Xóa ảnh cũ nếu có
      if (removeOldPublicId) {
        try {
          await cloudinary.uploader.destroy(removeOldPublicId, { resource_type: type === 'file' ? 'raw' : 'image' });
          console.log(`[BlogMediaHandler] Deleted old media ${removeOldPublicId}`);
        } catch (err) {
          console.error(`[BlogMediaHandler] Failed to delete old media ${removeOldPublicId}:`, err.message);
        }
      }

      // Upload media mới
      const buffer = Buffer.from(bufferBase64, 'base64');
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'blogs',
            resource_type: type === 'file' ? 'auto' : 'image'
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
      });

      // Cập nhật DB
      await db.BlogMedia.update(
        { url: uploadResult.secure_url, publicId: uploadResult.public_id, status: 'uploaded' },
        { where: { id: blogMediaId } }
      );

      // Kiểm tra tất cả media, publish blog nếu tất cả upload xong
      const mediaList = await db.BlogMedia.findAll({ where: { blogId } });
      const allUploaded = mediaList.every(m => m.status === 'uploaded');

      if (allUploaded) {
        await db.Blog.update({ status: 'published' }, { where: { id: blogId } });
        console.log(`[BlogMediaHandler] Blog ${blogId} published.`);
      }

      return uploadResult.secure_url;

    } catch (error) {
      console.error(`[BlogMediaHandler] Upload failed blogId=${blogId}: ${error.message}`);
      await db.BlogMedia.update({ status: 'error' }, { where: { id: blogMediaId } });
      await db.Blog.destroy({ where: { id: blogId } });
      throw error;
    }
  }
}

module.exports = new BlogMediaHandler();
