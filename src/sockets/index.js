const { Server } = require('socket.io');
const messageHandler = require('./messageHandler');

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Gắn các handler vào từng socket connection
    try {
      messageHandler(io, socket);

    } catch (err) {
      console.error('Failed to attach socket handlers', err);
    }

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;  // Return để app dùng (set vào app nếu cần)
};
