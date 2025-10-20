// controllers/careerTestController.js
const CareerTestService = require('../services/careerTestService');
const ApiResponse = require('../utils/ApiResponse');

class CareerTestController {
  async getTest(req, res) {
    try {
      const test = await CareerTestService.getCareerTest();
      return ApiResponse.success(res, 'Lấy bài trắc nghiệm thành công', test);
    } catch (error) {
      return ApiResponse.error(res, error.message, 404);
    }
  }
}

module.exports = new CareerTestController();
