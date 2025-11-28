const ApiResponse = require('../utils/ApiResponse');
const FollowService = require('../services/followService');

class FollowController {
  async toggleFollow(req, res) {
    try {
      const followerId = req.user.id;
      const { targetUserId } = req.params;
      
      console.log('🔄 Toggle follow request:', { followerId, targetUserId });
      
      const result = await FollowService.toggleFollow(followerId, targetUserId);
      
      console.log('✅ Toggle follow result:', result);
      
      return ApiResponse.success(res, 'Cập nhật follow thành công', result);
    } catch (error) {
      console.error('❌ Toggle follow error:', error);
      return ApiResponse.error(res, error.message || 'Cập nhật follow thất bại', 400);
    }
  }

  async getFollowInfo(req, res) {
    try {
      const viewerUserId = req.user?.id;
      const { targetUserId } = req.params;
      const result = await FollowService.getFollowInfo(targetUserId, viewerUserId);
      return ApiResponse.success(res, 'Lấy thông tin follow thành công', result);
    } catch (error) {
      return ApiResponse.error(res, error.message || 'Không thể lấy thông tin follow', 404);
    }
  }

  async getFollowers(req, res) {
    try {
      const { targetUserId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const result = await FollowService.getFollowers(targetUserId, Number(page), Number(limit));
      return ApiResponse.success(res, 'Lấy danh sách followers thành công', result);
    } catch (error) {
      return ApiResponse.error(res, error.message || 'Không thể lấy danh sách followers', 404);
    }
  }

  async getFollowing(req, res) {
    try {
      const { targetUserId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const result = await FollowService.getFollowing(targetUserId, Number(page), Number(limit));
      return ApiResponse.success(res, 'Lấy danh sách following thành công', result);
    } catch (error) {
      return ApiResponse.error(res, error.message || 'Không thể lấy danh sách following', 404);
    }
  }
}

module.exports = new FollowController();