const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { protect } = require('../middlewares/authMiddleware');

// All routes require authentication

// Roadmap Progress
router.post('/roadmap', protect, progressController.saveRoadmapProgress);
router.get('/roadmap/:roadmapId', protect, progressController.getRoadmapProgress);
router.get('/roadmaps', protect, progressController.getAllRoadmapProgress);

// DSA Progress
router.post('/dsa/toggle', protect, progressController.toggleProblemSolved);
router.get('/dsa', protect, progressController.getDSAProgress);
router.get('/dsa/stats', protect, progressController.getDSAStats);

// Event Registration
router.post('/event/register', protect, progressController.registerForEvent);
router.get('/events', protect, progressController.getUserEvents);
router.get('/event/:eventId/check', protect, progressController.checkEventRegistration);

module.exports = router;
