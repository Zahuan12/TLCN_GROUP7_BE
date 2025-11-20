const ConversationService = require("../services/conversationService");
const ApiResponse = require("../utils/ApiResponse");

class ConversationController {

  async getOrCreateConversation(req, res) {
    try {
      const userId = req.user.id;
      const otherUserId = req.params.userId;

      const conversation = await ConversationService.getOrCreateConversation(
        userId,
        otherUserId
      );

      return ApiResponse.success(res, "OK", conversation);
    } catch (err) {
      return ApiResponse.error(res, err.message, 400);
    }
  }

  async getMessages(req, res) {
    try {
      const conversationId = req.params.id;
      const limit = parseInt(req.query.limit) || 20;
      const beforeId = req.query.beforeId || null;

      const messages = await ConversationService.getMessages(
        conversationId,
        limit,
        beforeId
      );

      return ApiResponse.success(res, "OK", messages);
    } catch (err) {
      return ApiResponse.error(res, err.message, 400);
    }
  }

  async sendMessage(req, res) {
    try {
      const senderId = req.user.id;
      const conversationId = req.params.id;
      const { content } = req.body;

      const msg = await ConversationService.sendMessage(
        conversationId,
        senderId,
        content
      );

      return ApiResponse.success(res, "Sent", msg);
    } catch (err) {
      return ApiResponse.error(res, err.message, 400);
    }
  }
}

module.exports = new ConversationController();
