const db = require("../models");
const cloudinary = require("../configs/cloudinary");

class CareerPathService {

  // Tạo course
  async createCourse(companyId, data, file) {
    if (!data.title) throw new Error("Course cần có tiêu đề");

    const t = await db.sequelize.transaction();
    try {
      const course = await db.CareerPath.create({
        title: data.title,
        description: data.description || null,
        companyId,
        image: null,
        publicId: null
      }, { transaction: t });

      await t.commit();
      return course;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  // Update course
  async updateCourse(companyId, courseId, data) {
    const course = await db.CareerPath.findByPk(courseId);
    if (!course) throw new Error("Course không tồn tại");
    if (course.companyId !== companyId) throw new Error("Không có quyền chỉnh sửa");

    const t = await db.sequelize.transaction();
    try {
      await course.update({
        title: data.title ?? course.title,
        description: data.description ?? course.description
      }, { transaction: t });

      await t.commit();
      return course;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  // Upload hoặc update ảnh
  async uploadAndUpdateCourseImage(courseId, bufferBase64) {
    const course = await db.CareerPath.findByPk(courseId);
    if (!course) throw new Error("Course không tồn tại");

    try {
      // Xóa ảnh cũ nếu có
      if (course.publicId) {
        await cloudinary.uploader.destroy(course.publicId);
      }

      // Upload ảnh mới
      const buffer = Buffer.from(bufferBase64, "base64");
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "courses", resource_type: "image" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
      });

      await course.update({
        image: uploadResult.secure_url,
        publicId: uploadResult.public_id
      });

      console.log(`[CareerPathService] Uploaded course image ${courseId}`);
      return uploadResult.secure_url;
    } catch (err) {
      console.error(`[CareerPathService] Upload failed ${courseId}:`, err.message);
      await course.update({ image: null, publicId: null });
      throw err;
    }
  }

  // Lấy tất cả courses
  async getAllCourses(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const { count, rows } = await db.CareerPath.findAndCountAll({
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });
    return {
      total: count,
      courses: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  }

  // Lấy course theo ID
  async getCourseById(courseId) {
    const course = await db.CareerPath.findByPk(courseId, {
      include: [
        { model: db.Lesson, as: "Lessons" },
        { model: db.Test, as: "Tests" }
      ]
    });
    if (!course) throw new Error("Không tìm thấy course");
    return course;
  }

  // Xóa course
  async deleteCourse(companyId, courseId) {
    const course = await db.CareerPath.findByPk(courseId);
    if (!course) throw new Error("Course không tồn tại");
    if (course.companyId !== companyId) throw new Error("Không có quyền xoá");

    if (course.publicId) {
      await cloudinary.uploader.destroy(course.publicId);
    }

    await db.CareerPath.destroy({ where: { id: courseId } });
  }
}

module.exports = new CareerPathService();
