const db = require('../models');

class NotificationService {
  /**
   * Create a notification for a single user
   */
  static async createNotification(userId, payload) {
    const { 
      message, 
      type = 'SYSTEM',
      blogId = null,
      commentId = null,
      actorId = null,
      conversationId = null,
      messageId = null
    } = payload;
    
    const notif = await db.Notification.create({
      userId,
      message,
      type,
      blogId,
      commentId,
      actorId,
      conversationId,
      messageId,
      isRead: false
    });
    
    // Emit real-time notification
    const io = global.io;
    if (io) {
      const fullNotification = await db.Notification.findByPk(notif.id, {
        include: [
          {
            model: db.User,
            as: 'actor',
            attributes: ['id', 'username', 'fullName', 'avatar']
          },
          {
            model: db.Blog,
            as: 'blog',
            attributes: ['id', 'content']
          },
          {
            model: db.Conversation,
            as: 'conversation',
            attributes: ['id', 'type']
          },
          {
            model: db.Message,
            as: 'relatedMessage',
            attributes: ['id', 'content', 'createdAt']
          }
        ]
      });
      
      io.to(`user_${userId}`).emit('new_notification', fullNotification);
    }
    
    return notif;
  }

  /**
   * Create blog like notification
   */
  static async createLikeNotification(blogAuthorId, likerId, blogId) {
    console.log('Creating like notification:', { blogAuthorId, likerId, blogId });
    
    // Don't notify if user likes their own post
    if (blogAuthorId === likerId) {
      console.log('Skipping self-like notification');
      return null;
    }

    const actor = await db.User.findByPk(likerId);
    const blog = await db.Blog.findByPk(blogId);
    
    if (!actor) {
      console.log('Actor not found:', likerId);
      return null;
    }
    
    if (!blog) {
      console.log('Blog not found:', blogId);
      return null;
    }

    console.log('Creating notification for user:', blogAuthorId);
    return await this.createNotification(blogAuthorId, {
      message: `${actor.fullName || actor.username} liked your post: "${(blog.content || blog.title || 'your post').substring(0, 50)}..."`,
      type: 'LIKE',
      blogId,
      actorId: likerId
    });
  }

  /**
   * Create blog comment notification
   */
  static async createCommentNotification(blogAuthorId, commenterId, blogId, commentId) {
    console.log('Creating comment notification:', { blogAuthorId, commenterId, blogId, commentId });
    
    // Don't notify if user comments on their own post
    if (blogAuthorId === commenterId) {
      console.log('Skipping self-comment notification');
      return null;
    }

    const actor = await db.User.findByPk(commenterId);
    const blog = await db.Blog.findByPk(blogId);
    
    if (!actor) {
      console.log('Actor not found:', commenterId);
      return null;
    }
    
    if (!blog) {
      console.log('Blog not found:', blogId);
      return null;
    }

    return await this.createNotification(blogAuthorId, {
      message: `${actor.fullName || actor.username} commented on your post: "${(blog.content || blog.title || 'your post').substring(0, 50)}..."`,
      type: 'COMMENT',
      blogId,
      commentId,
      actorId: commenterId
    });
  }

  /**
   * Create comment reply notification
   */
  static async createReplyNotification(originalCommenterId, replierId, blogId, replyCommentId) {
    // Don't notify if user replies to their own comment
    if (originalCommenterId === replierId) return null;

    const actor = await db.User.findByPk(replierId);
    const blog = await db.Blog.findByPk(blogId);
    
    if (!actor || !blog) return null;

    const contentPreview = blog.content ? blog.content.substring(0, 50) + "..." : "a post";
    return await this.createNotification(originalCommenterId, {
      message: `${actor.fullName || actor.username} replied to your comment on "${contentPreview}"`,
      type: 'REPLY',
      blogId,
      commentId: replyCommentId,
      actorId: replierId
    });
  }

  /**
   * Create message notification (like Facebook - group messages from same person)
   */
  static async createMessageNotification(recipientId, senderId, conversationId, messageId, messageContent) {
    console.log('Creating message notification:', { recipientId, senderId, conversationId, messageId });
    
    // Don't notify if user messages themselves
    if (recipientId === senderId) {
      console.log('Skipping self-message notification');
      return null;
    }

    const actor = await db.User.findByPk(senderId);
    if (!actor) {
      console.log('Sender not found:', senderId);
      return null;
    }

    // Check if there's already an unread message notification from this sender
    const existingNotification = await db.Notification.findOne({
      where: {
        userId: recipientId,
        actorId: senderId,
        type: 'MESSAGE',
        conversationId: conversationId,
        isRead: false
      },
      order: [['createdAt', 'DESC']]
    });

    const actorName = actor.fullName || actor.username;
    const shortContent = messageContent.length > 50 ? 
      messageContent.substring(0, 50) + "..." : messageContent;

    if (existingNotification) {
      // Update existing notification with latest message
      await existingNotification.update({
        message: `${actorName}: ${shortContent}`,
        messageId: messageId,
        createdAt: new Date() // Update timestamp to show as latest
      });
      
      console.log('Updated existing message notification');
      return existingNotification;
    } else {
      // Create new notification
      const notification = await this.createNotification(recipientId, {
        message: `${actorName}: ${shortContent}`,
        type: 'MESSAGE',
        conversationId,
        messageId,
        actorId: senderId
      });
      
      console.log('Created new message notification');
      return notification;
    }
  }

  /**
   * Get notifications with full details
   */
  static async listNotificationsForUser(userId, limit = 20, offset = 0) {
    const notifications = await db.Notification.findAll({
      where: { userId },
      include: [
        {
          model: db.User,
          as: 'actor',
          attributes: ['id', 'username', 'fullName', 'avatar']
        },
        {
          model: db.Blog,
          as: 'blog',
          attributes: ['id', 'content']
        },
        {
          model: db.Comment,
          as: 'comment',
          attributes: ['id', 'content']
        },
        {
          model: db.Conversation,
          as: 'conversation',
          attributes: ['id', 'type']
        },
        {
          model: db.Message,
          as: 'relatedMessage',
          attributes: ['id', 'content', 'createdAt']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    return notifications;
  }

  static async markAsRead(notificationIds = []) {
    if (!notificationIds || notificationIds.length === 0) return 0;
    const [count] = await db.Notification.update(
      { isRead: true }, 
      { where: { id: notificationIds } }
    );
    return count;
  }

  /**
   * Get unread count
   */
  static async getUnreadCount(userId) {
    const count = await db.Notification.count({
      where: { 
        userId, 
        isRead: false 
      }
    });
    return count;
  }
}

module.exports = NotificationService;
