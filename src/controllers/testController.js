const TestService = require('../services/testService');
const ApiResponse = require('../utils/ApiResponse');

class TestController {
  // Tạo test
  async create(req, res) {
    try {
      const data = req.body;

      const result = await TestService.create(data);
      return ApiResponse.success(res, 'Tạo bài test thành công', result, 201);
    } catch (error) {
      return ApiResponse.error(res, error.message || 'Lỗi tạo bài test', 400);
    }
  }

  // Lấy tất cả test thuộc 1 lesson
  async getByLesson(req, res) {
    try {
      const lessonId = req.params.lessonId;

      const tests = await TestService.getTestsByLesson(lessonId);
      return ApiResponse.success(res, 'Lấy các bài test của lesson thành công', tests);
    } catch (error) {
      return ApiResponse.error(res, error.message || 'Không tìm thấy lesson', 404);
    }
  }

  // Lấy final test theo course (careerPath)
  async getFinalByCareerPath(req, res) {
    try {
      const careerPathId = req.params.careerPathId;

      const finalTest = await TestService.getFinalTestByCareerPath(careerPathId);
      return ApiResponse.success(res, 'Lấy bài test cuối của khóa học thành công', finalTest);
    } catch (error) {
      return ApiResponse.error(res, error.message || 'Không tìm thấy khóa học', 404);
    }
  }

  // Lấy test theo ID
  async getById(req, res) {
    try {
      const testId = req.params.id;

      const test = await TestService.getById(testId);
      return ApiResponse.success(res, 'Lấy bài test thành công', test);
    } catch (error) {
      return ApiResponse.error(res, error.message || 'Không tìm thấy bài test', 404);
    }
  }

  // Cập nhật test
  async update(req, res) {
    try {
      const testId = req.params.id;
      const data = req.body;

      const updatedTest = await TestService.update(testId, data);
      return ApiResponse.success(res, 'Cập nhật bài test thành công', updatedTest);
    } catch (error) {
      return ApiResponse.error(res, error.message || 'Lỗi cập nhật', 400);
    }
  }

  // Xóa test
  async delete(req, res) {
    try {
      const testId = req.params.id;

      await TestService.delete(testId);
      return ApiResponse.success(res, 'Xoá bài test thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message || 'Không tìm thấy bài test', 404);
    }
  }
}

module.exports = new TestController();
