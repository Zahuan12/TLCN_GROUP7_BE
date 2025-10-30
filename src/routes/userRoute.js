const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');
const checkEmailMiddleware = require('../middlewares/checkEmailMiddleware');

// CRUD routes
router.post('/',checkEmailMiddleware, UserController.create);


// áp dụng xác thực cho toàn bộ route.
router.use(AuthMiddleware.verifyToken); 

router.put('/:id', UserController.update);
router.put('/:id/role', UserController.updateRole);

// áp dụng phân quyền cho route bên dưới.
router.use(RoleMiddleware.checkRole("ADMIN"));

// router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.delete('/:id', UserController.delete);

module.exports = router;
