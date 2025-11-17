const db = require('../models');
const { Test, Lesson, CareerPath } = db;

class TestService {
  // ---------------- CREATE TEST ----------------
  async create(data) {
    const { title, description, type, content, maxScore, lessonId, careerPathId } = data;

    // Validate logic
    if (type === 'MINI' && !lessonId) {
      throw new Error('Bài test MINI phải thuộc về một Lesson.');
    }

    if (type === 'FINAL_PATH' && !careerPathId) {
      throw new Error('Bài test FINAL_PATH phải thuộc về một CareerPath.');
    }

    // Kiểm tra tồn tại Lesson
    if (lessonId) {
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) throw new Error('Lesson không tồn tại.');
    }

    // Kiểm tra tồn tại CareerPath
    if (careerPathId) {
      const careerPath = await CareerPath.findByPk(careerPathId);
      if (!careerPath) throw new Error('CareerPath không tồn tại.');
    }

    return Test.create({
      title,
      description,
      type,
      content,
      maxScore,
      lessonId: lessonId || null,
      careerPathId: careerPathId || null
    });
  }

  // ---------------- GET ALL TESTS ----------------
  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Test.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Lesson, attributes: ['id', 'title'] },
        { model: CareerPath, attributes: ['id', 'title'] }
      ]
    });

    return {
      total: count,
      page,
      limit,
      data: rows
    };
  }

  // ---------------- GET TEST BY ID ----------------
  async getById(id) {
    const test = await Test.findByPk(id, {
      include: [
        { model: Lesson, attributes: ['id', 'title'] },
        { model: CareerPath, attributes: ['id', 'title'] }
      ]
    });

    if (!test) throw new Error('Không tìm thấy bài test.');
    return test;
  }

  // ---------------- UPDATE TEST ----------------
  async update(id, data) {
    const test = await Test.findByPk(id);
    if (!test) throw new Error('Bài test không tồn tại.');

    const { title, description, type, content, maxScore, lessonId, careerPathId } = data;

    // Validate loại test
    if (type === 'MINI' && !lessonId) {
      throw new Error('Bài test MINI phải thuộc về một Lesson.');
    }

    if (type === 'FINAL_PATH' && !careerPathId) {
      throw new Error('Bài test FINAL_PATH phải thuộc về một CareerPath.');
    }

    // Validate lesson
    if (lessonId) {
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) throw new Error('Lesson không tồn tại.');
    }

    // Validate careerPath
    if (careerPathId) {
      const careerPath = await CareerPath.findByPk(careerPathId);
      if (!careerPath) throw new Error('CareerPath không tồn tại.');
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

  // ---------------- DELETE TEST ----------------
  async delete(id) {
    const test = await Test.findByPk(id);
    if (!test) throw new Error('Bài test không tồn tại.');

    await test.destroy();
    return true;
  }
}

module.exports = new TestService();
