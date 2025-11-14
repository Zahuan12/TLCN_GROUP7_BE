const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

// Public routes (no authentication required)
router.get('/', blogController.getAll);
router.get('/:id', blogController.getById);

// Protected routes (authentication + COMPANY role required)
router.use(AuthMiddleware.verifyToken);
router.use(RoleMiddleware.checkRole("COMPANY"));

router.post('/', upload, blogController.create);
router.put('/:id', upload, blogController.update);
router.delete('/:id', blogController.delete);

module.exports = router
