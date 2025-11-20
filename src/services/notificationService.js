const db = require('../models');

class NotificationService {
  /**
   * Create a notification for a single user
   * @param {String} userId
   * @param {{ message: String, type?: String }} payload
   */
  static async createNotification(userId, payload) {
    const { message, type = 'SYSTEM' } = payload;
    const notif = await db.Notification.create({
      userId,
      message,
      type,
      isRead: false
    });
    return notif;
  }

  /**
   * Create notifications for multiple recipients
   * @param {String[]} userIds
   * @param {{ message: String, type?: String }} payload
   */
  static async createForRecipients(userIds = [], payload) {
    const { message, type = 'SYSTEM' } = payload;
    const rows = userIds.map((uid) => ({ userId: uid, message, type, isRead: false }));
    const created = await db.Notification.bulkCreate(rows);
    return created;
  }

  static async listNotificationsForUser(userId, limit = 20, offset = 0) {
    const list = await db.Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    return list;
  }

  static async markAsRead(notificationIds = []) {
    if (!notificationIds || notificationIds.length === 0) return 0;
    const [count] = await db.Notification.update({ isRead: true }, { where: { id: notificationIds } });
    return count;
  }
}

module.exports = NotificationService;
