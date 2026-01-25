const express = require('express');
const router = express.Router();
const adminEventController = require('../controllers/adminEventController');
const adminSubmissionController = require('../controllers/adminSubmissionController');
const adminAnalyticsController = require('../controllers/adminAnalyticsController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');
const { upload } = require('../services/uploadService');

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(isAdmin);

// ========================================
// EVENT MANAGEMENT
// ========================================

// Event CRUD
router.post('/events', upload.single('bannerImage'), adminEventController.createEvent);
router.put('/events/:id', upload.single('bannerImage'), adminEventController.updateEvent);
router.delete('/events/:id', adminEventController.deleteEvent);
router.get('/events', adminEventController.getAllEventsAdmin);

// Event participants & teams
router.get('/events/:id/participants', adminEventController.getEventParticipants);
router.get('/events/:id/teams', adminEventController.getEventTeamsAdmin);

// Event status management
router.patch('/events/:id/status', adminEventController.toggleEventStatus);
router.patch('/events/:id/close-registrations', adminEventController.closeRegistrations);

// ========================================
// SUBMISSION MANAGEMENT
// ========================================

// View submissions
router.get('/events/:id/submissions', adminSubmissionController.getEventSubmissions);
router.get('/submissions/:submissionId', adminSubmissionController.getSubmissionDetails);

// Evaluate submissions
router.patch('/submissions/:submissionId/evaluate', adminSubmissionController.evaluateSubmission);
router.post('/submissions/bulk-evaluate', adminSubmissionController.bulkEvaluate);

// Publish results
router.post('/events/:id/publish-results', adminSubmissionController.publishResults);

// Export submissions
router.get('/events/:id/submissions/export', adminSubmissionController.exportSubmissions);

// ========================================
// ANALYTICS
// ========================================

// Dashboard analytics
router.get('/analytics', adminAnalyticsController.getDashboardAnalytics);
router.get('/analytics/events', adminAnalyticsController.getEventAnalytics);
router.get('/analytics/revenue', adminAnalyticsController.getRevenueAnalytics);
router.get('/analytics/users', adminAnalyticsController.getUserAnalytics);
router.get('/analytics/categories', adminAnalyticsController.getCategoryStats);

// Export analytics
router.get('/analytics/export', adminAnalyticsController.exportAnalytics);

module.exports = router;
