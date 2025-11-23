const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const { uploadAny, validateMagicBytes } = require("../middlewares/uploadMiddleware");
const RoleMiddleware = require('../middlewares/RoleMiddleware');

router.get('/', blogController.getAll);
router.get('/:id', blogController.getById);

router.use(AuthMiddleware.verifyToken);
router.use(RoleMiddleware.checkRole(["ADMIN", "COMPANY"]));
router.post('/', uploadAny, validateMagicBytes, blogController.create); // Chấp nhận bất kỳ field name
router.put('/:id', uploadAny, validateMagicBytes, blogController.update);
router.delete('/:id', blogController.delete);

module.exports = router
