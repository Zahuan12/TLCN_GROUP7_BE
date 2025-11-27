const db = require('../models');

module.exports = (io, socket) => {
  // User join room để nhận notification về comments
  socket.on('joinUserRoom', (userId) => {
    if (!userId) return;
    
    // Check if already in room to avoid duplicate joins
    const rooms = Array.from(socket.rooms);
    const roomName = `user_${userId}`;
    
    if (rooms.includes(roomName)) {
      console.log(`User ${userId} already in notification room, skipping...`);
      return;
    }
    
    socket.join(roomName);
    console.log(`User ${userId} joined notification room (socket: ${socket.id})`);
  });

  // Emit notification khi có comment mới
  const notifyNewComment = async (comment, blogAuthorId, parentCommentAuthorId) => {
    try {
      // Tạo notification trong DB
      const notifications = [];

      // Notify blog author (nếu không phải chính họ comment)
      if (blogAuthorId && blogAuthorId !== comment.authorId) {
        const blogNotif = await db.Notification.create({
          userId: blogAuthorId,
          type: 'NEW_COMMENT',
          content: `${comment.author?.fullName || 'Ai đó'} đã bình luận vào bài viết của bạn`,
          relatedId: comment.blogId,
          relatedType: 'BLOG',
          isRead: false
        });
        notifications.push({ userId: blogAuthorId, notification: blogNotif });
      }

      // Notify parent comment author (nếu là reply)
      if (comment.parentId && parentCommentAuthorId && parentCommentAuthorId !== comment.authorId) {
        const replyNotif = await db.Notification.create({
          userId: parentCommentAuthorId,
          type: 'COMMENT_REPLY',
          content: `${comment.author?.fullName || 'Ai đó'} đã trả lời bình luận của bạn`,
          relatedId: comment.id,
          relatedType: 'COMMENT',
          isRead: false
        });
        notifications.push({ userId: parentCommentAuthorId, notification: replyNotif });
      }

      // Emit qua socket
      notifications.forEach(({ userId, notification }) => {
        io.to(`user_${userId}`).emit('newNotification', {
          ...notification.toJSON(),
          comment: {
            id: comment.id,
            content: comment.content,
            author: comment.author
          }
        });
      });

    } catch (error) {
      console.error('[commentHandler] Error sending notification:', error);
    }
  };

  // Expose function để controller gọi
  socket.notifyNewComment = notifyNewComment;
};
