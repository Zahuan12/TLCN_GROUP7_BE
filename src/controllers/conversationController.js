const db = require("../models");
const ConversationService = require("../services/conversationService");
const NotificationService = require('../services/notificationService');
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

  async listConversations(req, res) {
    try {
      const userId = req.user.id;
      const list = await ConversationService.listConversations(userId);
      return ApiResponse.success(res, 'OK', list);
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

      // load saved message with sender info for notification
      const messageWithSender = await db.Message.findByPk(msg.id, {
        include: [{ model: db.User, as: 'sender', attributes: ['id', 'username', 'fullName', 'avatar'] }]
      });

      // Emit to all connected sockets belonging to conversation participants
      try {
        const io = req.app && req.app.get && req.app.get('io');
        if (io) {
          // get participant ids from service
          const participants = await ConversationService.getParticipants(conversationId);
          const participantIds = participants.map((p) => String(p.id));

          // Create persistent notifications for participants except sender
          try {
            const recipients = participantIds.filter((pid) => pid !== String(senderId));
            if (recipients.length > 0) {
              const notifMessage = `${messageWithSender.sender.fullName || messageWithSender.sender.username}: ${messageWithSender.content}`;
              await NotificationService.createForRecipients(recipients, { message: notifMessage, type: 'SYSTEM' });
              // emit a notification socket event to the recipients' sockets
              const socketsMap = io.sockets && io.sockets.sockets;
              if (socketsMap && socketsMap.size >= 0) {
                socketsMap.forEach((s) => {
                  try {
                    const sid = s.id;
                    const sockUserId = s.userId ? String(s.userId) : null;
                    if (sockUserId && recipients.includes(sockUserId)) {
                      io.to(sid).emit('notification', { message: notifMessage });
                    }
                  } catch (inner) {
                    // ignore
                  }
                });
              }
            }
          } catch (notifErr) {
            console.error('Failed to create/emit notifications', notifErr);
          }

          // io.sockets.sockets is a Map in socket.io v4
          const socketsMap = io.sockets && io.sockets.sockets;
          if (socketsMap && socketsMap.size >= 0) {
            socketsMap.forEach((s) => {
              try {
                const sid = s.id;
                const sockUserId = s.userId ? String(s.userId) : null;
                if (sockUserId && participantIds.includes(sockUserId)) {
                  io.to(sid).emit('new_message', { conversationId, message: messageWithSender });
                }
              } catch (inner) {
                // ignore per-socket errors
              }
            });
          }
        }
      } catch (e) {
        console.error('Failed to emit new_message from controller', e);
      }

      return ApiResponse.success(res, "Sent", messageWithSender);
    } catch (err) {
      return ApiResponse.error(res, err.message, 400);
    }
  }
}

module.exports = new ConversationController();
