const express = require("express");
const router = express.Router();
const CareerPathController = require("../controllers/careerPathController");
const LessonController = require("../controllers/lessonController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const RoleMiddleware = require("../middlewares/RoleMiddleware");

// Public
router.get("/", CareerPathController.getAll);
router.get("/:id", CareerPathController.getById); // chi tiết CareerPath kèm lessons + final test

// Protected routes
router.use(AuthMiddleware.verifyToken);
router.use(RoleMiddleware.checkRole(["COMPANY", "ADMIN"]));

router.post("/", CareerPathController.create);
router.put("/:id", CareerPathController.update);
router.delete("/:id", CareerPathController.delete);

// Create lesson under a career path
router.post("/:careerPathId/lessons", LessonController.create);

module.exports = router;
