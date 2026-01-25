const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

// Admin routes (protected)
router.use(authenticateToken);
router.use(isAdmin);

// Get participants for email
router.get('/events/:id/participants-email', communicationController.getParticipantsForEmail);

// Send bulk email to participants
router.post('/events/:id/send-email', communicationController.sendEventEmail);

// Send certificates
router.post('/events/:id/send-certificates', communicationController.sendCertificates);

// Get email logs
router.get('/events/:id/email-logs', communicationController.getEmailLogs);

// Public certificate verification (no auth)
router.get('/verify-certificate/:certificateId', communicationController.verifyCertificatePublic);

module.exports = router;
