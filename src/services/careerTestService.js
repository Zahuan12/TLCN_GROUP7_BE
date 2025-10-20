// services/careerTestService.js
const db = require('../models');

class CareerTestService {
  /**
   * Lấy bài test duy nhất trong hệ thống
   */
  async getCareerTest() {
    const test = await db.CareerTest.findOne();

    if (!test) {
      throw new Error('Chưa có bài trắc nghiệm nghề nghiệp nào trong hệ thống');
    }

    return test;
  }
}

module.exports = new CareerTestService();
