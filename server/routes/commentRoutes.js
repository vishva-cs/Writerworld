const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/book/:bookId', commentController.getBookComments);
router.get('/chapter/:chapterId', commentController.getChapterComments);
router.get('/:id', commentController.getComment);

// Protected routes
router.post('/', protect, commentController.createComment);
router.put('/:id', protect, commentController.updateComment);
router.delete('/:id', protect, commentController.deleteComment);
router.post('/:id/like', protect, commentController.likeComment);
router.delete('/:id/like', protect, commentController.unlikeComment);
router.post('/:id/reply', protect, commentController.replyComment);

module.exports = router;
