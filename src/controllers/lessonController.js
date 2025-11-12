const LessonService = require('../services/lessonService');
const ApiResponse = require('../utils/ApiResponse');

class LessonController {

  async create(req, res) {
    try {
      const careerPathId = req.params.careerPathId;
      const data = req.body;

      const lesson = await LessonService.createLesson(careerPathId, data);
      return ApiResponse.success(res, "Tạo lesson thành công", lesson, 201);
    } catch (error) {
      console.error("Error in create lesson:", error);
      return ApiResponse.error(res, error.message || "Lỗi tạo lesson", 400);
    }
  }

  async update(req, res) {
    try {
      const lessonId = req.params.id;
      const data = req.body;

      const lesson = await LessonService.updateLesson(lessonId, data);
      return ApiResponse.success(res, "Cập nhật lesson thành công", lesson);
    } catch (error) {
      console.error("Error in update lesson:", error);
      return ApiResponse.error(res, error.message || "Lỗi cập nhật lesson", 400);
    }
  }

  async getAll(req, res) {
    try {
      const careerPathId = req.params.careerPathId;

      const lessons = await LessonService.getAllLessons(careerPathId);
      return ApiResponse.success(res, "Lấy danh sách lesson thành công", lessons);
    } catch (error) {
      console.error("Error in getAll lessons:", error);
      return ApiResponse.error(res, error.message || "Lỗi server", 500);
    }
  }

  async getById(req, res) {
    try {
      const lessonId = req.params.id;

      const lesson = await LessonService.getLessonById(lessonId);
      return ApiResponse.success(res, "Lấy lesson thành công", lesson);
    } catch (error) {
      console.error("Error in get lesson by id:", error);
      return ApiResponse.error(res, error.message || "Lesson không tồn tại", 404);
    }
  }

  async delete(req, res) {
    try {
      const lessonId = req.params.id;

      await LessonService.deleteLesson(lessonId);
      return ApiResponse.success(res, "Xoá lesson thành công");
    } catch (error) {
      console.error("Error in delete lesson:", error);
      return ApiResponse.error(res, error.message || "Lesson không tồn tại", 404);
    }
  }
}

module.exports = new LessonController();
