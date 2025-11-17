const CareerPathService = require('../services/careerPathService');
const ApiResponse = require('../utils/ApiResponse');

class CareerPathController {

  async create(req, res) {
    try {
      const companyId = req.user.id;
      const data = { ...req.body };

      if (req.file) {
        data.fileBase64 = req.file.buffer.toString("base64");
        data.originalName = req.file.originalname;
        data.mimeType = req.file.mimetype;
        data.size = req.file.size;
      }

      const course = await CareerPathService.createCourse(companyId, data);
      return ApiResponse.success(res, 'Tạo course thành công', course, 201);
    } catch (error) {
      console.error('[CareerPathController.create]', error);
      return ApiResponse.error(res, error.message || 'Lỗi tạo course', 400);
    }
  }

  async update(req, res) {
    try {
      const companyId = req.user.id;
      const courseId = req.params.id;
      const data = { ...req.body };

      if (req.file) {
        data.fileBase64 = req.file.buffer.toString("base64");
        data.originalName = req.file.originalname;
        data.mimeType = req.file.mimetype;
        data.size = req.file.size;
      }

      const course = await CareerPathService.updateCourse(companyId, courseId, data);
      return ApiResponse.success(res, 'Cập nhật course thành công', course);
    } catch (error) {
      console.error('[CareerPathController.update]', error);
      return ApiResponse.error(res, error.message || 'Lỗi cập nhật', 400);
    }
  }

  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await CareerPathService.getAllCourses(page, limit);
      return ApiResponse.success(res, 'Lấy danh sách course thành công', result);
    } catch (error) {
      console.error('[CareerPathController.getAll]', error);
      return ApiResponse.error(res, error.message || 'Lỗi server', 500);
    }
  }

  async getById(req, res) {
    try {
      const courseId = req.params.id;
      const result = await CareerPathService.getCourseById(courseId);
      return ApiResponse.success(res, 'Lấy course thành công', result);
    } catch (error) {
      console.error('[CareerPathController.getById]', error);
      return ApiResponse.error(res, error.message || 'Không tìm thấy course', 404);
    }
  }

  async delete(req, res) {
    try {
      const companyId = req.user.id;
      const courseId = req.params.id;
      const role = req.user.role;
      await CareerPathService.deleteCourse(companyId, courseId, role);
      return ApiResponse.success(res, 'Xoá course thành công');
    } catch (error) {
      console.error('[CareerPathController.delete]', error);
      return ApiResponse.error(res, error.message || 'Không tìm thấy course', 404);
    }
  }
}

module.exports = new CareerPathController();
