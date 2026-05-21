const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/trending', bookController.getTrendingBooks);
router.get('/featured', bookController.getFeaturedBooks);
router.get('/:id', bookController.getBookById);
router.get('/:id/chapters', bookController.getBookChapters);

// Protected routes
router.post('/', protect, bookController.createBook);
router.put('/:id', protect, bookController.updateBook);
router.delete('/:id', protect, bookController.deleteBook);
router.post('/:id/publish', protect, bookController.publishBook);
router.post('/:id/like', protect, bookController.likeBook);
router.delete('/:id/like', protect, bookController.unlikeBook);
router.post('/:id/bookmark', protect, bookController.bookmarkBook);
router.delete('/:id/bookmark', protect, bookController.removeBookmark);

module.exports = router;
