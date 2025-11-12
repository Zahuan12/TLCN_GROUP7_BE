const express = require("express");
const router = express.Router();
const testController = require('../controllers/testController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');


router.use(AuthMiddleware.verifyToken);

module.exports = router;