const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

// All routes require STUDENT role
router.use(AuthMiddleware.verifyToken);
router.use(RoleMiddleware.checkRole('STUDENT'));

/**
 * @route GET /chat/session
 * @desc Get or create single chat session for student
 * @access STUDENT
 */
router.get('/session', ChatController.getOrCreateSession);

/**
 * @route POST /chat/message
 * @desc Send message and get AI response
 * @access STUDENT
 * @body { message: string }
 */
router.post('/message', ChatController.sendMessage);

/**
 * @route DELETE /chat/history
 * @desc Clear chat history (reset messages)
 * @access STUDENT
 */
router.delete('/history', ChatController.clearHistory);

/**
 * @route GET /chat/assessment
 * @desc Generate personalized student assessment
 * @access STUDENT
 */
router.get('/assessment', ChatController.getAssessment);

module.exports = router;
