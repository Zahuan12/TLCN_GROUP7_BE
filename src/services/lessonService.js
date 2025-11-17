const db = require("../models");

class LessonService {


  async createLesson(careerPathId, data) {
    if (!data.title) throw new Error("Lesson cần có tiêu đề");

    return await db.Lesson.create({
      title: data.title,
      content: data.content || null,
      order: data.order || 0,
      careerPathId
    });
  }


  async updateLesson(lessonId, data) {
    const lesson = await db.Lesson.findByPk(lessonId);
    if (!lesson) throw new Error("Lesson không tồn tại");

    await lesson.update({
      title: data.title ?? lesson.title,
      content: data.content ?? lesson.content,
      order: data.order ?? lesson.order
    });

    return lesson;
  }


  async getAllLessons(careerPathId) {
    return await db.Lesson.findAll({
      where: { careerPathId },
      order: [["order", "ASC"]],
    });
  }


  async getLessonById(lessonId) {
    const lesson = await db.Lesson.findByPk(lessonId, {
      include: [
        {
          model: db.Test,
          as: "Tests",
          where: { type: "MINI" },
          required: false
        }
      ]
    });

    if (!lesson) throw new Error("Lesson không tồn tại");
    return lesson;
  }

  async deleteLesson(lessonId) {
    const lesson = await db.Lesson.findByPk(lessonId);
    if (!lesson) throw new Error("Lesson không tồn tại");

    // MINI TEST sẽ tự xóa nhờ CASCADE (nếu migration đúng)
    await db.Lesson.destroy({ where: { id: lessonId } });
  }
}

module.exports = new LessonService();
