const db = require('../models');
class commentService {
    async createComment(blogId, userId, content, parentId = null) {
        if (!blogId || !userId || !content) {
            throw new Error('Thiếu dữ liệu bắt buộc');
        }

        const blog = await db.Blog.findByPk(blogId);
        if (!blog) throw new Error('Blog không tồn tại');

        if (parentId) {
            const parent = await db.Comment.findByPk(parentId);
            if (!parent) throw new Error('Comment cha không tồn tại');
        }

        const comment = await db.Comment.create({
            content,
            userId,
            postId: blogId,
            parentId: parentId || null
        });

        return await db.Comment.findByPk(comment.id, {
            include: [
                { model: db.User, attributes: ['id', 'username'] }
            ]
        });
    }

    async getCommentsByBlogId(blogId, page = 1, limit = 10) {
        const blog = await db.Blog.findByPk(blogId);
        if (!blog) throw new Error('Blog không tồn tại');

        const offset = (page - 1) * limit;
        const { count, rows } = await db.Comment.findAndCountAll({
            where: { postId: blogId, parentId: null },
            offset,
            limit,
            order: [['createdAt', 'DESC']],
            include: [
                { model: db.User, attributes: ['id', 'username'] },
                { model: db.Comment, as: 'replies', include: [{ model: db.User, attributes: ['id', 'username'] }] }
            ]
        });

        return {
            total: count,
            comments: rows,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
        };
    }

    async updateComment(userId, commentId, content) {
        if (!content) throw new Error('Nội dung không được để trống');

        const comment = await db.Comment.findByPk(commentId);
        if (!comment) throw new Error('Comment không tồn tại');
        if (comment.userId !== userId) throw new Error('Không có quyền chỉnh sửa');

        await comment.update({ content });
        return comment;
    }

    async deleteComment(userId, commentId) {
        const comment = await db.Comment.findByPk(commentId);
        if (!comment) throw new Error('Comment không tồn tại');
        if (comment.userId !== userId) throw new Error('Không có quyền xoá');

        await comment.destroy(); // soft delete vì paranoid: true
        return true;
    }
}
module.exports = new commentService();