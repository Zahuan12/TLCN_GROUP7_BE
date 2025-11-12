const db = require('../models');
const { Test, Lesson, CareerPath } = db;

class TestService {
  async create(companyId, data) {
    const { title, description, type, content, maxScore, lessonId, careerPathId } = data;

    // Kiểm tra logic ràng buộc
    if (type === 'MINI' && !lessonId) {
      throw new Error('Bài test MINI phải thuộc về một Lesson.');
    }
    if (type === 'FINAL_PATH' && !careerPathId) {
      throw new Error('Bài test FINAL_PATH phải thuộc về một CareerPath.');
    }

    // Kiểm tra Lesson hoặc CareerPath có tồn tại không
    if (lessonId) {
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) throw new Error('Lesson không tồn tại.');
    }
    if (careerPathId) {
      const careerPath = await CareerPath.findByPk(careerPathId);
      if (!careerPath) throw new Error('CareerPath không tồn tại.');
    }

    const test = await Test.create({
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

  async getAll(page, limit) {
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

  async update(companyId, id, data) {
    const test = await Test.findByPk(id);
    if (!test) throw new Error('Bài test không tồn tại.');

    const { title, description, type, content, maxScore, lessonId, careerPathId } = data;

    // Kiểm tra lại tính hợp lệ
    if (type === 'MINI' && !lessonId) {
      throw new Error('Bài test MINI phải thuộc về một Lesson.');
    }
    if (type === 'FINAL_PATH' && !careerPathId) {
      throw new Error('Bài test FINAL_PATH phải thuộc về một CareerPath.');
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

  async delete(companyId, id) {
    const test = await Test.findByPk(id);
    if (!test) throw new Error('Bài test không tồn tại.');

    await test.destroy();
    return true;
  }
}

module.exports = new TestService();
