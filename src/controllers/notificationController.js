const NotificationService = require('../services/notificationService');
const ApiResponse = require('../utils/ApiResponse');

class NotificationController {
  async list(req, res) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;
      const list = await NotificationService.listNotificationsForUser(userId, limit, offset);
      return ApiResponse.success(res, 'OK', list);
    } catch (err) {
      return ApiResponse.error(res, err.message, 400);
    }
  }

  async markRead(req, res) {
    try {
      const userId = req.user.id;
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return ApiResponse.error(res, 'Invalid ids', 400);
      }
      // Optionally ensure notifications belong to user - simple approach
      const affected = await NotificationService.markAsRead(ids);
      return ApiResponse.success(res, 'Marked', { affected });
    } catch (err) {
      return ApiResponse.error(res, err.message, 400);
    }
  }
}

module.exports = new NotificationController();
