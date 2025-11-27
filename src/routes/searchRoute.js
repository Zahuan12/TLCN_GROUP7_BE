const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Search all (users, companies, courses)
// GET /api/search?q=query&type=all|users|companies|courses&limit=10
router.get('/', searchController.search);

// Search specific resources
router.get('/users', searchController.searchUsers);
router.get('/companies', searchController.searchCompanies);
router.get('/courses', searchController.searchCourses);

module.exports = router;
