const db = require("../models");
const { Op } = require("sequelize");

class ConversationService {

  // Tạo hoặc lấy conversation giữa 2 người
  async getOrCreateConversation(userId, otherUserId) {
    if (!otherUserId) throw new Error("otherUserId is required");

    // Kiểm tra đã có conversation PRIVATE giữa 2 người chưa
    const conversation = await db.Conversation.findOne({
      where: { type: "PRIVATE" },
      include: [
        {
          model: db.User,
          through: { attributes: [] },
          where: { id: { [Op.in]: [userId, otherUserId] } },
        },
      ],
      group: ["Conversation.id"],
      having: db.sequelize.literal("COUNT(User.id) = 2"),
    });

    if (conversation) return conversation;

    // Nếu chưa có → tạo mới
    const newConvo = await db.Conversation.create({ type: "PRIVATE" });

    await newConvo.addUsers([userId, otherUserId]);

    return newConvo;
  }

  // Lấy message (scroll)
  async getMessages(conversationId, limit = 20, beforeId = null) {
    const where = { conversationId };

    if (beforeId) {
      const beforeMsg = await db.Message.findByPk(beforeId);
      if (beforeMsg) {
        where.createdAt = { [Op.lt]: beforeMsg.createdAt };
      }
    }

    const messages = await db.Message.findAll({
      where,
      limit,
      order: [["createdAt", "DESC"]],
      include: [
        { model: db.User, as: "sender", attributes: ["id", "username", "avatar"] }
      ]
    });

    return messages.reverse(); 
  }

  // Gửi tin nhắn
  async sendMessage(conversationId, senderId, content) {
    if (!content || !content.trim()) {
      throw new Error("Tin nhắn không được rỗng");
    }

    return await db.Message.create({
      conversationId,
      senderId,
      content,
      type: "TEXT",
    });
  }
}

module.exports = new ConversationService();
