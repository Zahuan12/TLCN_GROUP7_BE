const express = require("express");
const router = express.Router();
const CareerPathController = require("../controllers/careerPathController");
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

// Public: lấy danh sách & chi tiết course (không yêu cầu login)
router.get("/", CareerPathController.getAll);
router.get("/:id", CareerPathController.getById);

// Private: cần login
router.use(AuthMiddleware.verifyToken);

// Chỉ COMPANY & ADMIN được tạo, sửa, xóa
router.use(RoleMiddleware.checkRole(["COMPANY", "ADMIN"]));

router.post("/", CareerPathController.create);
router.put("/:id", CareerPathController.update);
router.delete("/:id", CareerPathController.delete);

module.exports = router;
