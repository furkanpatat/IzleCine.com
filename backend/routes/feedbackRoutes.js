const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const adminAuth = require('../middleware/adminAuth');

// Public route - Kullanıcı feedback gönderir
router.post('/submit', feedbackController.submitFeedback);

// Admin routes - Admin authentication gerekli
router.get('/admin/all', adminAuth, feedbackController.getAllFeedback);
router.get('/admin/stats', adminAuth, feedbackController.getFeedbackStats);
router.put('/admin/:id/read', adminAuth, feedbackController.markAsRead);
router.put('/admin/:id/resolved', adminAuth, feedbackController.markAsResolved);
router.delete('/admin/:id', adminAuth, feedbackController.deleteFeedback);

module.exports = router; 