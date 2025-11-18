const db = require("../models");
const { Test, Lesson, CareerPath } = db;

class TestService {

  async create(data) {
    const { title, description, type, content, maxScore, lessonId, careerPathId } = data;

    if (type === "MINI" && !lessonId) throw new Error("Bài test MINI phải thuộc về một Lesson");
    if (type === "FINAL_PATH" && !careerPathId) throw new Error("Bài test FINAL_PATH phải thuộc về một CareerPath");

    if (lessonId) {
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) throw new Error("Lesson không tồn tại");
    }

    if (careerPathId) {
      const careerPath = await CareerPath.findByPk(careerPathId);
      if (!careerPath) throw new Error("CareerPath không tồn tại");
    }

    return await Test.create({
      title,
      description,
      type,
      content,
      maxScore,
      lessonId: lessonId || null,
      careerPathId: careerPathId || null
    });
  }

  async update(id, data) {
    const test = await Test.findByPk(id);
    if (!test) throw new Error("Bài test không tồn tại");

    const { title, description, type, content, maxScore, lessonId, careerPathId } = data;

    if (type === "MINI" && !lessonId) throw new Error("Bài test MINI phải thuộc về một Lesson");
    if (type === "FINAL_PATH" && !careerPathId) throw new Error("Bài test FINAL_PATH phải thuộc về một CareerPath");

    if (lessonId) {
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) throw new Error("Lesson không tồn tại");
    }

    if (careerPathId) {
      const careerPath = await CareerPath.findByPk(careerPathId);
      if (!careerPath) throw new Error("CareerPath không tồn tại");
    }

    await test.update({
      title,
      description,
      type,
      content,
      maxScore,
      lessonId: lessonId || null,
      careerPathId: careerPathId || null
    });

    return test;
  }

  async delete(id) {
    const test = await Test.findByPk(id);
    if (!test) throw new Error("Bài test không tồn tại");

    await test.destroy();
    return true;
  }

  // ---------------------
  // Helpers
  async getTestsByLesson(lessonId) {
    return await Test.findAll({ where: { lessonId, type: "MINI" } });
  }

  async getFinalTestByCareerPath(careerPathId) {
    return await Test.findOne({ where: { careerPathId, type: "FINAL_PATH" } });
  }
}

module.exports = new TestService();
