// routes/careerTestRoutes.js
const express = require('express');
const router = express.Router();
const CareerTestController = require('../controllers/careerTestController');

// Không cần xác thực — ai cũng có thể xem bài test
router.get('/', CareerTestController.getTest);

module.exports = router;
