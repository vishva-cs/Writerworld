const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes
router.post('/profile-image', protect, uploadController.uploadProfileImage);
router.post('/cover-image', protect, uploadController.uploadCoverImage);
router.post('/multiple', protect, uploadController.uploadMultiple);
router.delete('/:imageId', protect, uploadController.deleteImage);

module.exports = router;
