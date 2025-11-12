const db = require("../models");

class LessonService {

  async createLesson(careerPathId, data) {
    if (!data.title) throw new Error("Lesson cần có tiêu đề");

    const t = await db.sequelize.transaction();
    try {
      const lesson = await db.Lesson.create({
        title: data.title,
        content: data.content || null,
        order: data.order || 0,
        careerPathId
      }, { transaction: t });

      await t.commit();
      return lesson;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async updateLesson(lessonId, data) {
    const lesson = await db.Lesson.findByPk(lessonId);
    if (!lesson) throw new Error("Lesson không tồn tại");

    const t = await db.sequelize.transaction();
    try {
      await lesson.update({
        title: data.title ?? lesson.title,
        content: data.content ?? lesson.content,
        order: data.order ?? lesson.order
      }, { transaction: t });

      await t.commit();
      return lesson;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async getAllLessons(careerPathId) {
    const lessons = await db.Lesson.findAll({
      where: { careerPathId },
      order: [["order", "ASC"]]
    });
    return lessons;
  }

  async getLessonById(lessonId) {
    const lesson = await db.Lesson.findByPk(lessonId, {
      include: [
        { model: db.Test, as: "Tests" }
      ]
    });
    if (!lesson) throw new Error("Lesson không tồn tại");
    return lesson;
  }

  async deleteLesson(lessonId) {
    const lesson = await db.Lesson.findByPk(lessonId);
    if (!lesson) throw new Error("Lesson không tồn tại");

    await db.Lesson.destroy({ where: { id: lessonId } });
  }
}

module.exports = new LessonService();
