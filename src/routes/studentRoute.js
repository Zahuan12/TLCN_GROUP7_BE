const express = require("express");
const router = express.Router();
const studentController = require('../controllers/studentController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

// Áp dụng xác thực cho tất cả các route bên dưới
router.use(AuthMiddleware.verifyToken);
router.use(RoleMiddleware.checkRole("STUDENT"));

module.exports = router;