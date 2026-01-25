const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { upload } = require('../services/uploadService');

// All submission routes require authentication
router.use(authenticateToken);

// Submit or update project (with file upload)
router.post(
    '/events/:id/submit',
    upload.single('projectDeck'),
    submissionController.submitProject
);

// Get my submission for an event
router.get('/events/:id/submission', submissionController.getMySubmission);

// Delete my submission
router.delete('/events/:id/submission', submissionController.deleteSubmission);

// Get submission template URL
router.get('/events/:id/submission-template', submissionController.getSubmissionTemplate);

module.exports = router;
