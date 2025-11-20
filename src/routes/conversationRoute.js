const express = require("express");
const router = express.Router();
const ConversationController = require("../controllers/conversationController");
const Auth = require("../middlewares/AuthMiddleware");

// Tất cả require login
router.use(Auth.verifyToken);

// 1. Lấy hoặc tạo conversation
router.get("/:userId", ConversationController.getOrCreateConversation);

// 2. Lấy tin nhắn
router.get("/messages/:id", ConversationController.getMessages);

// 3. Gửi tin nhắn
router.post("/messages/:id", ConversationController.sendMessage);

module.exports = router;
