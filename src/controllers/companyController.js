const ApiResponse = require('../utils/ApiResponse');
const UserService = require('../services/userService');
const CompanyService = require('../services/companyService');

class CompanyController {
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await UserService.getUserById(userId);
      return ApiResponse.success(res, "Lấy hồ sơ doanh nghiệp thành công", user);
    } catch (error) {
      console.error("[CompanyController.getProfile]", error);
      return ApiResponse.error(res, error.message || "Không lấy được hồ sơ", 400);
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;

      const body = req.body || {};

      const userPayload = {};
      for (const key of ['email', 'username', 'fullName', 'isActive']) {
        if (body[key] !== undefined) userPayload[key] = body[key];
      }
      if (Object.keys(userPayload).length > 0) {
        await UserService.updateUser(userId, userPayload);
      }

      const { companyName, taxCode, industry, website, description } = body;
      await CompanyService.updateProfile(userId, { companyName, taxCode, industry, website, description });

      const updated = await UserService.getUserById(userId);
      return ApiResponse.success(res, "Cập nhật hồ sơ doanh nghiệp thành công", updated);
    } catch (error) {
      console.error("[CompanyController.updateProfile]", error);
      return ApiResponse.error(res, error.message || "Không cập nhật được hồ sơ", 400);
    }
  }
}

module.exports = new CompanyController();