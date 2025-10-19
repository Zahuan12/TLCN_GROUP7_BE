// controllers/blogController.js
const BlogService = require('../services/blogService');
const ApiResponse = require('../utils/ApiResponse');

class BlogController {
  async create(req, res) {
    try {
      // req.user.id expected from auth middleware
      const result = await BlogService.createBlog(req.user.id, req.body, req.files);
      return ApiResponse.success(res, 'Tạo blog thành công (media đang xử lý)', result, 201);
    } catch (error) {
      console.error(error);
      return ApiResponse.error(res, error.message || 'Lỗi tạo blog', 400);
    }
  }

  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await BlogService.getAllBlogs(page, limit);
      return ApiResponse.success(res, 'Lấy danh sách blog thành công', result);
    } catch (error) {
      return ApiResponse.error(res, error.message || 'Lỗi server', 500);
    }
  }

  async getById(req, res) {
    try {
      const result = await BlogService.getBlogById(req.params.id);
      return ApiResponse.success(res, 'Lấy blog thành công', result);
    } catch (error) {
      return ApiResponse.error(res, error.message || 'Không tìm thấy', 404);
    }
  }

  async update(req, res) {
    try {
      const result = await BlogService.updateBlog(req.user.id, req.params.id, req.body, req.files);
      return ApiResponse.success(res, 'Cập nhật blog thành công (media có thể đang xử lý)', result);
    } catch (error) {
      return ApiResponse.error(res, error.message || 'Lỗi cập nhật', 400);
    }
  }

  async delete(req, res) {
    try {
      await BlogService.deleteBlog(req.user.id, req.params.id);
      return ApiResponse.success(res, 'Xoá blog thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message || 'Không tìm thấy', 404);
    }
  }
}

module.exports = new BlogController();
