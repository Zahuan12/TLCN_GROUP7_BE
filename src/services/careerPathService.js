class CareerPathService {

  // Tạo course
  async createCourse(companyId, data) {
    if (!data.title) throw new Error("Course cần có tiêu đề");

    // Tạo course
    const course = await db.CareerPath.create({
      title: data.title,
      description: data.description || null,
      companyId,
      image: null,
      publicId: null
    });

    // Xử lý file upload nếu có
    if (data.fileBase64) {
      try {
        await courseImageProducer.sendUploadEvent({
          courseId: course.id,
          bufferBase64: data.fileBase64,
          originalName: data.originalName,
          mimeType: data.mimeType,
          size: data.size,
          type: "CREATE"
        });
      } catch (error) {
        console.error("Lỗi upload ảnh: ", error);
        // Có thể tùy chỉnh thông báo lỗi ở đây nếu cần
        throw new Error("Lỗi upload ảnh course");
      }
    }

    return course;
  }

  // Cập nhật course
  async updateCourse(companyId, courseId, data) {
    const course = await db.CareerPath.findByPk(courseId);
    if (!course) throw new Error("Course không tồn tại");
    if (course.companyId !== companyId) throw new Error("Không có quyền chỉnh sửa");

    // Cập nhật thông tin
    await course.update({
      title: data.title ?? course.title,
      description: data.description ?? course.description
    });

    // Xử lý file upload nếu có
    if (data.fileBase64) {
      try {
        await courseImageProducer.sendUploadEvent({
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
        // Có thể tùy chỉnh thông báo lỗi ở đây nếu cần
        throw new Error("Lỗi upload ảnh course");
      }
    }

    return course;
  }

  // Xóa course
  async deleteCourse(companyId, courseId, role) {
    const course = await db.CareerPath.findByPk(courseId);
    if (!course) throw new Error("Course không tồn tại");

    if (role === "COMPANY" && course.companyId !== companyId) {
      throw new Error("Không có quyền xoá");
    }

    if (role !== "ADMIN" && role !== "COMPANY") {
      throw new Error("Bạn không có quyền xoá course");
    }

    // Gửi event xóa ảnh
    if (course.publicId) {
      try {
        await courseImageProducer.sendUploadEvent({
          courseId: course.id,
          type: "DELETE",
          oldPublicId: course.publicId
        });
      } catch (error) {
        console.error("Lỗi xóa ảnh: ", error);
        throw new Error("Lỗi xóa ảnh course");
      }
    }

    // Xóa course
    await db.CareerPath.destroy({ where: { id: course.id } });
    return true;
  }
}


module.exports = new CareerPathService();
