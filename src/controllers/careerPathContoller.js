const CareerPathService = require('../services/careerPathService');
const { courseImageProducer } = require('../kafka/producers');
const ApiResponse = require('../utils/ApiResponse');

class CareerPathController {

  // Tạo course
  async create(req, res) {
    try {
      const companyId = req.user.companyId;
      const data = req.body;
      const file = req.file;

      //  Tạo course (chỉ DB)
      const course = await CareerPathService.createCourse(companyId, data);

      //  Nếu có file → gửi event Kafka
      if (file) {
        await courseImageProducer.sendUploadEvent({
          courseId: course.id,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          bufferBase64: file.buffer.toString("base64"),
        });
      }

      return ApiResponse.success(res, 'Tạo course thành công', course, 201);
    } catch (error) {
      console.error('[CareerPathController.create] ', error);
      return ApiResponse.error(res, error.message || 'Lỗi tạo course', 400);
    }
  }

  // Cập nhật course
  async update(req, res) {
    try {
      const companyId = req.user.companyId;
      const courseId = req.params.id;
      const data = req.body;
      const file = req.file;

      // 1️⃣ Cập nhật DB (title, description)
      const course = await CareerPathService.updateCourse(companyId, courseId, data);

      // 2️⃣ Nếu có file → gửi event Kafka để consumer upload ảnh
      if (file) {
        await courseImageProducer.sendUploadEvent({
          courseId: course.id,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          bufferBase64: file.buffer.toString("base64"),
        });
      }

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
      console.error('[CareerPathController.getAll] ', error);
      return ApiResponse.error(res, error.message || 'Lỗi server', 500);
    }
  }

  async getById(req, res) {
    try {
      const courseId = req.params.id;
      const result = await CareerPathService.getCourseById(courseId);
      return ApiResponse.success(res, 'Lấy course thành công', result);
    } catch (error) {
      console.error('[CareerPathController.getById] ', error);
      return ApiResponse.error(res, error.message || 'Không tìm thấy course', 404);
    }
  }

  async delete(req, res) {
    try {
      const companyId = req.user.companyId;
      const courseId = req.params.id;

      await CareerPathService.deleteCourse(companyId, courseId);
      return ApiResponse.success(res, 'Xoá course thành công');
    } catch (error) {
      console.error('[CareerPathController.delete] ', error);
      return ApiResponse.error(res, error.message || 'Không tìm thấy course', 404);
    }
  }
}

module.exports = new CareerPathController();
