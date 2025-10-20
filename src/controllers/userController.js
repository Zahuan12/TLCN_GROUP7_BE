const UserService = require('../services/userService');
const ApiResponse = require('../utils/ApiResponse');

class UserController {
  async create(req, res) {
    try {
      const result = await UserService.createUser(req.body);
      return ApiResponse.success(res, 'Tạo user thành công', result);
    } catch (error) {
      return ApiResponse.error(res, error.message, 400);
    }
  }

  async getById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      return ApiResponse.success(res, 'Lấy user thành công', user);
    } catch (error) {
      return ApiResponse.error(res, error.message, 404);
    }
  }

  async update(req, res) {
    try {
      const updatedUser = await UserService.updateUser(req.params.id, req.body);
      return ApiResponse.success(res, 'Cập nhật user thành công', updatedUser);
    } catch (error) {
      return ApiResponse.error(res, error.message, 400);
    }
  }

  async delete(req, res) {
    try {
      await UserService.deleteUser(req.params.id);
      return ApiResponse.success(res, 'Xoá user thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message, 404);
    }
  }

  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      console.log(`Updating role for user ${id} to ${role}`);

      // Validate role
      const validRoles = ['STUDENT', 'COMPANY'];
      if (!validRoles.includes(role)) {
        return ApiResponse.error(res, 'Invalid role. Must be STUDENT, COMPANY', 400);
      }

      const updatedUser = await UserService.updateRole(id, role);

      return ApiResponse.success(res, 'Role updated successfully', updatedUser);
    } catch (error) {
      console.error('Update role error:', error);
      return ApiResponse.error(res, error.message, 500);
    }
  }
}

module.exports = new UserController();
