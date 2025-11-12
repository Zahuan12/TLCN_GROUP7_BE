const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentControler');
const AuthMiddleware = require('../middlewares/AuthMiddleware');

// áp dụng xác thực cho toàn bộ route.
router.use(AuthMiddleware.verifyToken); 

router.post('/', commentController.createComment);
router.get('/:blogId', commentController.getCommentsByBlogId); 
router.delete('/:commentId', commentController.deleteComment); 
router.put('/:commentId', commentController.updateComment); 

module.exports = router;