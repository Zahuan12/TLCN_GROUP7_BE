const express = require("express");
const router = express.Router();
const TestController = require("../controllers/testController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const RoleMiddleware = require("../middlewares/RoleMiddleware");

// CRUD test cho admin/company
router.use(AuthMiddleware.verifyToken);
router.use(RoleMiddleware.checkRole(["COMPANY", "ADMIN"]));

router.post("/", TestController.create);
router.put("/:id", TestController.update);
router.delete("/:id", TestController.delete);

module.exports = router;
