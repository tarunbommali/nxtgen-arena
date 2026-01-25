const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

// User routes (protected)
router.post('/create-order', authenticateToken, paymentController.createOrder);
router.post('/verify', authenticateToken, paymentController.verifyPayment);
router.get('/:paymentId', authenticateToken, paymentController.getPaymentDetails);

// Webhook (no auth - verified by Razorpay signature)
router.post('/webhook', paymentController.handleWebhook);

// Admin routes
router.post('/:paymentId/refund', authenticateToken, isAdmin, paymentController.refundPayment);

module.exports = router;
