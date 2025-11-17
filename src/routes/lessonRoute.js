const express = require("express");
const router = express.Router();
const LessonController = require("../controllers/lessonController");
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');


// PUBLIC
router.get("/:careerPathId/lessons", LessonController.getAll);
router.get("/lessons/:id", LessonController.getById);


// AUTHORIZE
router.use(AuthMiddleware.verifyToken);
router.use(RoleMiddleware.checkRole(["COMPANY", "ADMIN"]));

router.post("/:careerPathId/lessons", LessonController.create);
router.put("/lessons/:id", LessonController.update);
router.delete("/lessons/:id", LessonController.delete);

module.exports = router;
