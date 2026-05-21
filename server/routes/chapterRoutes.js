const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes
router.post('/', protect, chapterController.createChapter);
router.get('/:id', chapterController.getChapter);
router.put('/:id', protect, chapterController.updateChapter);
router.delete('/:id', protect, chapterController.deleteChapter);
router.post('/:id/like', protect, chapterController.likeChapter);
router.delete('/:id/like', protect, chapterController.unlikeChapter);
router.post('/:id/auto-save', protect, chapterController.autoSaveChapter);
router.post('/:id/publish', protect, chapterController.publishChapter);

module.exports = router;
