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

  // async getAll(req, res) {
  //   try {
  //     const users = await UserService.getUsers();
  //     return ApiResponse.success(res, 'Lấy danh sách user thành công', users);
  //   } catch (error) {
  //     return ApiResponse.error(res, error.message, 500);
  //   }
  // }

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
}

module.exports = new UserController();
