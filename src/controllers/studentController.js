const ApiResponse = require('../utils/ApiResponse');
const studentService = require('../services/studentService');
class StudentController {


    async joinCareerPath(req, res) {
    try {
      const studentId = req.user.id;   // lấy từ token
      const { careerPathId } = req.body;

      if (!careerPathId) {
        return ApiResponse.error(res, "Thiếu careerPathId", 400);
      }

      const result = await studentService.joinCareerPath(studentId, careerPathId);
      return ApiResponse.success(res, "Tham gia CareerPath thành công", result, 201);
    } catch (error) {
      console.error("[StudentController.joinCareerPath]", error);
      return ApiResponse.error(res, error.message || "Lỗi tham gia CareerPath", 400);
    }
  }

  
  // Học sinh submit bài test
   
  async submitTest(req, res) {
    try {
      const studentId = req.user.id;
      const { testId, score } = req.body;

      if (!testId || score === undefined) {
        return ApiResponse.error(res, "Thiếu testId hoặc score", 400);
      }

      const result = await studentService.submitTest(studentId, testId, score);

      return ApiResponse.success(res, "Nộp bài test thành công", result, 201);
    } catch (error) {
      console.error("[StudentController.submitTest]", error);
      return ApiResponse.error(res, error.message || "Lỗi nộp bài test", 400);
    }
  }


   // Lấy tiến độ học của học sinh trong CareerPath

  async getCareerPathProgress(req, res) {
    try {
      const studentId = req.user.id;
      const { careerPathId } = req.params;

      const result = await studentService.getCareerPathProgress(studentId, careerPathId);

      return ApiResponse.success(res, "Lấy tiến độ thành công", result);
    } catch (error) {
      console.error("[StudentController.getCareerPathProgress]", error);
      return ApiResponse.error(res, error.message || "Không lấy được tiến độ", 400);
    }
  }
  
}

module.exports = new StudentController();
