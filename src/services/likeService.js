const db = require('../models');

class LikeService {
  async toggleLikeBlog(userId, blogId) {
    const blog = await db.Blog.findByPk(blogId);
    if (!blog) throw new Error('Blog không tồn tại');

    const existing = await db.Like.findOne({
      where: { userId, postId: blogId, commentId: null }
    });

    if (existing) {
      await existing.destroy();
      const count = await db.Like.count({ where: { postId: blogId, commentId: null } });
      return { liked: false, count };
    } else {
      await db.Like.create({ userId, postId: blogId });
      const count = await db.Like.count({ where: { postId: blogId, commentId: null } });
      return { liked: true, count };
    }
  }

  async getLikesForBlog(blogId, userId) {
    const blog = await db.Blog.findByPk(blogId);
    if (!blog) throw new Error('Blog không tồn tại');

    const count = await db.Like.count({ where: { postId: blogId, commentId: null } });

    let liked = false;
    if (userId) {
      const existing = await db.Like.findOne({
        where: { userId, postId: blogId, commentId: null }
      });
      liked = !!existing;
    }

    return { liked, count };
  }
}

module.exports = new LikeService();