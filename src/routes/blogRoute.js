const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Define blog routes here (e.g., create, read, update, delete blogs)
// áp dụng xác thực cho toàn bộ route.
router.use(AuthMiddleware.verifyToken); 

router.get('/', blogController.getAll);
router.get('/:id', blogController.getById);
router.post('/', upload, blogController.create); // upload handles images/files
router.put('/:id', upload, blogController.update);
router.delete('/:id', blogController.delete);

module.exports = router 
