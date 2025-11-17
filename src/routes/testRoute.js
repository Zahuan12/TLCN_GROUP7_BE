const express = require("express");
const router = express.Router();
const TestController = require("../controllers/testController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const RoleMiddleware = require("../middlewares/RoleMiddleware");


// Lấy tất cả mini-tests của 1 lesson
router.get("/lesson/:lessonId", TestController.getByLesson);

// Lấy final test của 1 career path
router.get("/career-path/:careerPathId/final", TestController.getFinalByCareerPath);

// Lấy 1 test theo ID
router.get("/:id", TestController.getById);

router.use(AuthMiddleware.verifyToken);
router.use(RoleMiddleware.checkRole(["COMPANY"]));

// Tạo test (mini-test hoặc final-test đều dùng chung)
router.post("/", TestController.create);

// Cập nhật test
router.put("/:id", TestController.update);

// Xóa test
router.delete("/:id", TestController.delete);

module.exports = router;
