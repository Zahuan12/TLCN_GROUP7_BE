const ApiResponse = require('../utils/ApiResponse');
const commentService = require('../services/commentService');
class commentController {
    async createComment(req, res) {
        try {
            const userId = req.user.id;
            const { blogId, content, parentId } = req.body;
            const newComment = await commentService.createComment(blogId, userId, content, parentId);
            return ApiResponse.success(res, 'Tạo comment thành công', newComment);
        } catch (error) {
            return ApiResponse.error(res, error.message || 'Tạo comment thất bại', 400);
        }
    }

    async getCommentsByBlogId(req, res) {
        try {
            const blogId = req.params.blogId;
            const { page = 1, limit = 10 } = req.query;
            const comments = await commentService.getCommentsByBlogId(blogId, Number(page), Number(limit));
            return ApiResponse.success(res, 'Lấy danh sách comment thành công', comments);
        } catch (error) {
            return ApiResponse.error(res, error.message || 'Không thể lấy danh sách comment', 404);
        }
    }

    async updateComment(req, res) {
        try {
            const userId = req.user.id;
            const commentId = req.params.commentId;
            const { content } = req.body;
            const updated = await commentService.updateComment(userId, commentId, content);
            return ApiResponse.success(res, 'Cập nhật comment thành công', updated);
        } catch (error) {
            return ApiResponse.error(res, error.message || 'Cập nhật comment thất bại', 400);
        }
    }

    async deleteComment(req, res) {
        try {
            const userId = req.user.id;
            const commentId = req.params.commentId;
            await commentService.deleteComment(userId, commentId);
            return ApiResponse.success(res, 'Xoá comment thành công', { deleted: true });
        } catch (error) {
            return ApiResponse.error(res, error.message || 'Xoá comment thất bại', 400);
        }
    }
}

module.exports = new commentController();
