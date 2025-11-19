const kafkaModule = require('../kafka');
const db = require("../models");
const LessonService = require("./lessonService");
const TestService = require("./testService");

class CareerPathService {

  async createCareerPath(companyId, data, files) {

    const company = await db.Company.findOne({ where: { userId: companyId} });
    if (!company) {
      throw new Error('không tìm thấy công ty của bạn');
}
    // Tạo CareerPath trước
    const careerPath = await db.CareerPath.create({
      title: data.title,
      description: data.description || null,
      category: data.category || null,
      companyId: company.id,
      image: null,
      publicId: null
    });

    // Nếu có upload ảnh
    if (files?.images?.length) {
      const file = files.images[0];

      await kafkaModule.producers.courseImageProducer.sendUploadEvent({
        courseId: careerPath.id,
        bufferBase64: file.buffer.toString('base64'),
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        type: "CREATE"
      });
    }

    return careerPath;
  }

  async updateCourse(companyId, courseId, data) {
    const course = await db.CareerPath.findByPk(courseId);
    if (!course) throw new Error("Course không tồn tại");
    if (course.companyId !== companyId) throw new Error("Không có quyền chỉnh sửa");

    await course.update({
      title: data.title ?? course.title,
      description: data.description ?? course.description
    });

    if (data.fileBase64) {
      try {
        await kafkaModule.producers.courseImageProducer.sendUploadEvent({
          courseId: course.id,
          bufferBase64: data.fileBase64,
          originalName: data.originalName,
          mimeType: data.mimeType,
          size: data.size,
          type: "UPDATE",
          oldPublicId: course.publicId
        });
      } catch (error) {
        console.error("Lỗi upload ảnh: ", error);
        throw new Error("Lỗi upload ảnh course");
      }
    }

    return course;
  }

  async deleteCourse(companyId, courseId, role) {
    const course = await db.CareerPath.findByPk(courseId);
    if (!course) throw new Error("Course không tồn tại");

    if (role === "COMPANY" && course.companyId !== companyId) {
      throw new Error("Không có quyền xoá");
    }

    if (!["ADMIN", "COMPANY"].includes(role)) {
      throw new Error("Bạn không có quyền xoá course");
    }

    if (course.publicId) {
      try {
        await kafkaModule.producers.courseImageProducer.sendUploadEvent({
          courseId: course.id,
          type: "DELETE",
          oldPublicId: course.publicId
        });
      } catch (error) {
        console.error("Lỗi xóa ảnh: ", error);
        throw new Error("Lỗi xóa ảnh course");
      }
    }

    await db.CareerPath.destroy({ where: { id: course.id } });
    return true;
  }

  async getAllCourses(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { rows, count } = await db.CareerPath.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]]
    });

    return {
      total: count,
      page,
      limit,
      data: rows
    };
  }

  // === CHỈNH PHẦN FOLLOW ===
  async getCourseById(courseId) {
    const course = await db.CareerPath.findByPk(courseId);
    if (!course) throw new Error("Course không tồn tại");

    // Lấy lessons thuộc course
    const lessons = await LessonService.getAllLessons(courseId);

    // Gắn miniTests vào từng lesson
    for (let lesson of lessons) {
      lesson.miniTests = await TestService.getMiniTestsByLesson(lesson.id);
    }

    // Lấy final test của course
    const finalTest = await TestService.getFinalTestByCareerPath(courseId);

    // Gắn vào instance course
    course.lessons = lessons;
    course.finalTest = finalTest;

    return course;
  }
}

module.exports = new CareerPathService();
