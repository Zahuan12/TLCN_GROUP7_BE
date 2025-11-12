const express = require("express");
const router = express.Router();
const CareerPathController = require("../controllers/careerPathContoller");
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

// Tất cả route dưới đây yêu cầu người dùng phải đăng nhập
router.use(AuthMiddleware.verifyToken);
router.use(RoleMiddleware.checkRole("COMPANY"));

// Tạo course mới
router.post("/", CareerPathController.create);

// Lấy danh sách course
router.get("/", CareerPathController.getAll);

// Lấy course theo id
router.get("/:id", CareerPathController.getById);

// Cập nhật course
router.put("/:id", CareerPathController.update);

// Xoá course
router.delete("/:id", CareerPathController.delete);
module.exports = router;    