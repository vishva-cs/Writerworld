const express = require('express');
const router = express.Router();
const writerController = require('../controllers/writerController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', writerController.getAllWriters);
router.get('/trending', writerController.getTrendingWriters);
router.get('/:id', writerController.getWriterProfile);
router.get('/:id/books', writerController.getWriterBooks);
router.get('/:id/stats', writerController.getWriterStats);

// Protected routes
router.post('/:id/follow', protect, writerController.followWriter);
router.delete('/:id/follow', protect, writerController.unfollowWriter);
router.get('/:id/followers', writerController.getFollowers);
router.get('/:id/following', writerController.getFollowing);

module.exports = router;
