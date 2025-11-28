const kafkaModule = require('../kafka');
const db = require("../models");
const LessonService = require("./lessonService");
const TestService = require("./testService");

class CareerPathService {

  async createCareerPath(companyId, data, files) {

    const company = await db.Company.findOne({ where: { userId: companyId } });
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
      publicId: null,
      status: data.status || 'DRAFT'
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
      description: data.description ?? course.description,
      status: data.status ?? course.status
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

    const company = await db.Company.findOne({ where: { userId: companyId } });
    if (!company) {
      throw new Error('không tìm thấy công ty của bạn');
    }

    if (role === "COMPANY" && course.companyId !== company.id) {
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
      where: { status: 'PUBLISHED' },
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
  async getCourseById(courseId, userId = null) {
    const course = await db.CareerPath.findByPk(courseId, {
      include: [{ model: db.Company, as: 'company', attributes: ['id', 'userId'] }]
    });
    if (!course) throw new Error("Course không tồn tại");

    // Check quyền xem: Owner (company) hoặc Admin có thể xem tất cả status
    const isOwner = userId && course.company?.userId === userId;

    console.log('[CareerPathService.getCourseById] Debug:', {
      courseId,
      courseStatus: course.status,
      requestUserId: userId,
      courseOwnerUserId: course.company?.userId,
      isOwner
    });

    // Nếu không phải owner và course chưa published -> không cho xem
    if (!isOwner && course.status !== 'PUBLISHED') {
      throw new Error("Course chưa được xuất bản");
    }

    // Lấy lessons thuộc course
    const lessons = await LessonService.getAllLessons(courseId);

    // Gắn miniTests vào từng lesson
    for (let lesson of lessons) {
      lesson.miniTests = await TestService.getTestsByLesson(lesson.id);
    }

    // Lấy final test của course
    const finalTest = await TestService.getFinalTestByCareerPath(courseId);

    // Gắn vào instance course
    course.lessons = lessons;
    course.finalTest = finalTest;

    return course;
  }

  async getCoursesByCompany(companyId, page = 1, limit = 10) {
    const company = await db.Company.findOne({ where: { userId: companyId } });
    if (!company) {
      throw new Error('Không tìm thấy công ty của bạn');
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await db.CareerPath.findAndCountAll({
      where: { companyId: company.id },
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

  async updateCourseStatus(companyId, courseId, status) {
    const course = await db.CareerPath.findByPk(courseId);
    if (!course) throw new Error("Course không tồn tại");

    const company = await db.Company.findOne({ where: { userId: companyId } });
    if (!company) throw new Error('Không tìm thấy công ty của bạn');

    if (course.companyId !== company.id) throw new Error("Không có quyền chỉnh sửa");

    await course.update({ status });
    return course;
  }
}

module.exports = new CareerPathService();
