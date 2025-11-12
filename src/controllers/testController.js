const TestService = require('../services/testService');
const ApiResponse = require('../utils/ApiResponse');

class TestController {
  async create(req, res) {
    try {
      const companyId = req.user.companyId;
      const data = req.body;

      const result = await TestService.create(companyId, data);
      return ApiResponse.success(res, 'Tạo bài test thành công', result, 201);
    } catch (error) {
      return ApiResponse.error(res, error.message || 'Lỗi tạo bài test', 400);
    }
  }

  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await TestService.getAll(page, limit);
      return ApiResponse.success(res, 'Lấy danh sách bài test thành công', result);
    } catch (error) {
      return ApiResponse.error(res, error.message || 'Lỗi server', 500);
    }
  }

  async getById(req, res) {
    try {
      const testId = req.params.id;
      const result = await TestService.getById(testId);
      return ApiResponse.success(res, 'Lấy bài test thành công', result);
    } catch (error) {
      return ApiResponse.error(res, error.message || 'Không tìm thấy bài test', 404);
    }
  }

  async update(req, res) {
    try {
      const companyId = req.user.companyId;
      const testId = req.params.id;
      const data = req.body;

      const result = await TestService.update(companyId, testId, data);
      return ApiResponse.success(res, 'Cập nhật bài test thành công', result);
    } catch (error) {
      return ApiResponse.error(res, error.message || 'Lỗi cập nhật', 400);
    }
  }

  async delete(req, res) {
    try {
      const companyId = req.user.companyId;
      const testId = req.params.id;

      await TestService.delete(companyId, testId);
      return ApiResponse.success(res, 'Xoá bài test thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message || 'Không tìm thấy bài test', 404);
    }
  }
}

module.exports = new TestController();
