const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Search routes
router.get('/', searchController.globalSearch);
router.get('/books', searchController.searchBooks);
router.get('/writers', searchController.searchWriters);
router.get('/advanced', searchController.advancedSearch);
router.get('/suggestions', searchController.getSearchSuggestions);

module.exports = router;
