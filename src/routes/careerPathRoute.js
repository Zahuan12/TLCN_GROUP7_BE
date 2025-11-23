const express = require("express");
const router = express.Router();
const CareerPathController = require("../controllers/careerPathController");
const LessonController = require("../controllers/lessonController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const RoleMiddleware = require("../middlewares/RoleMiddleware");
const { uploadFields, validateMagicBytes } = require("../middlewares/uploadMiddleware");

// Public
router.get("/", CareerPathController.getAll);

// Protected routes
router.use(AuthMiddleware.verifyToken);
router.use(RoleMiddleware.checkRole(["COMPANY", "ADMIN"]));

// Company gets their own courses - MUST be before /:id route
router.get("/my-courses", CareerPathController.getMyCourses);

// Public route with ID param - after protected specific routes
router.get("/:id", CareerPathController.getById); // chi tiết CareerPath kèm lessons + final test

router.post("/", uploadFields, validateMagicBytes, CareerPathController.create);

router.put("/:id", CareerPathController.update);
router.patch("/:id/status", CareerPathController.updateStatus);
router.delete("/:id", CareerPathController.delete);

// Create lesson under a career path
router.post("/:careerPathId/lessons", LessonController.create);

module.exports = router;
