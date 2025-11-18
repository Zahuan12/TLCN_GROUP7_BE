const TestService = require("../services/testService");
const ApiResponse = require("../utils/ApiResponse");

class TestController {
  async create(req, res) {
    try {
      const result = await TestService.create(req.body);
      return ApiResponse.success(res, "Tạo bài test thành công", result, 201);
    } catch (err) {
      return ApiResponse.error(res, err.message || "Lỗi tạo bài test", 400);
    }
  }
  
   async getById(req, res) {
    try {
      const testId = req.params.id;
      const test = await TestService.getById(testId);
      return ApiResponse.success(res, "Lấy bài test thành công", test);
    } catch (error) {
      return ApiResponse.error(res, error.message || "Không tìm thấy bài test", 404);
    }
  }

  async update(req, res) {
    try {
      const result = await TestService.update(req.params.id, req.body);
      return ApiResponse.success(res, "Cập nhật bài test thành công", result);
    } catch (err) {
      return ApiResponse.error(res, err.message || "Lỗi cập nhật bài test", 400);
    }
  }

  async delete(req, res) {
    try {
      await TestService.delete(req.params.id);
      return ApiResponse.success(res, "Xoá bài test thành công");
    } catch (err) {
      return ApiResponse.error(res, err.message || "Bài test không tồn tại", 404);
    }
  }
}

module.exports = new TestController();
