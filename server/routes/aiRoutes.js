const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes (AI features require authentication)
router.post('/generate-ideas', protect, aiController.generateStoryIdeas);
router.post('/generate-summary', protect, aiController.generateSummary);
router.post('/grammar-check', protect, aiController.checkGrammar);
router.post('/improve-writing', protect, aiController.improveWriting);
router.post('/generate-cover', protect, aiController.generateCoverImage);
router.post('/generate-title', protect, aiController.generateTitle);
router.post('/voice-read', protect, aiController.generateVoiceReading);
router.get('/usage', protect, aiController.getAIUsage);

module.exports = router;
