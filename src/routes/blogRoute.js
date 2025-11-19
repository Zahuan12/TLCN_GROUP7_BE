const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const { uploadFields, validateMagicBytes } = require("../middlewares/uploadMiddleware");
const RoleMiddleware = require('../middlewares/RoleMiddleware');


// áp dụng xác thực cho toàn bộ route.
router.use(AuthMiddleware.verifyToken); 

router.get('/', blogController.getAll);
router.get('/:id', blogController.getById);

router.use(RoleMiddleware.checkRole(["ADMIN", "COMPANY"]));
router.post('/', uploadFields, validateMagicBytes, blogController.create); // upload handles images/files
router.put('/:id', uploadFields, validateMagicBytes, blogController.update);
router.delete('/:id', blogController.delete);

module.exports = router
