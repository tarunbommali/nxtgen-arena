const Razorpay = require('razorpay');
const crypto = require('crypto');
const prisma = require('../utils/prismaClient');

// Initialize Razorpay (optional - only if credentials are provided)
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('✅ Razorpay initialized successfully');
} else {
    console.log('⚠️  Razorpay not configured. Payment features will be disabled.');
    console.log('   Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env to enable payments.');
}

// Create payment order
exports.createOrder = async (req, res) => {
    try {
        // Check if Razorpay is configured
        if (!razorpay) {
            return res.status(503).json({
                success: false,
                error: {
                    code: 'SERVICE_UNAVAILABLE',
                    message: 'Payment service is not configured. Please add Razorpay credentials to .env file.'
                }
            });
        }

        const { eventId, teamId } = req.body;
        const userId = req.user.id;

        // Get event details
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Event not found' }
            });
        }

        if (!event.isPaid) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Event is free, no payment required' }
            });
        }

        // Calculate amount
        let amount = parseFloat(event.registrationFee);
        let receiptDetails = `${userId.substring(0, 8)}`;

        // If team event, calculate for all team members
        if (teamId) {
            const team = await prisma.team.findUnique({
                where: { id: teamId },
                include: { members: true }
            });

            if (!team) {
                return res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Team not found' }
                });
            }

            // Only team leader can pay
            if (team.teamLeaderId !== userId) {
                return res.status(403).json({
                    success: false,
                    error: { code: 'FORBIDDEN', message: 'Only team leader can make payment' }
                });
            }

            amount = amount * team.members.length;
            receiptDetails = `team_${teamId.substring(0, 8)}`;
        }

        // Create Razorpay order
        const options = {
            amount: Math.round(amount * 100), // Convert to paise
            currency: event.currency,
            receipt: `${receiptDetails}_${Date.now()}`,
            notes: {
                eventId,
                userId,
                teamId: teamId || 'individual'
            }
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                eventTitle: event.title,
                keyId: process.env.RAZORPAY_KEY_ID
            }
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to create payment order' }
        });
    }
};

// Verify payment and create registration
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            eventId,
            teamId
        } = req.body;
        const userId = req.user.id;

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                error: { code: 'INVALID_SIGNATURE', message: 'Payment verification failed' }
            });
        }

        // Get payment details from Razorpay
        const payment = await razorpay.payments.fetch(razorpay_payment_id);

        if (payment.status !== 'captured' && payment.status !== 'authorized') {
            return res.status(400).json({
                success: false,
                error: { code: 'PAYMENT_NOT_CAPTURED', message: 'Payment not successful' }
            });
        }

        // Get event details
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        const amountPaid = payment.amount / 100; // Convert from paise

        if (teamId) {
            // Team registration
            const team = await prisma.team.findUnique({
                where: { id: teamId },
                include: { members: true }
            });

            if (!team) {
                return res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Team not found' }
                });
            }

            // Create registration for all team members
            const registrations = team.members.map(member => ({
                eventId,
                userId: member.userId,
                teamId,
                participationType: 'team',
                paymentStatus: 'completed',
                paymentId: razorpay_payment_id,
                amountPaid: amountPaid / team.members.length,
                paidAt: new Date(),
                status: 'confirmed'
            }));

            await prisma.eventRegistration.createMany({
                data: registrations
            });

            // Lock the team
            await prisma.team.update({
                where: { id: teamId },
                data: { isLocked: true }
            });

            // Get the created registrations
            const createdRegistrations = await prisma.eventRegistration.findMany({
                where: {
                    eventId,
                    teamId
                }
            });

            res.json({
                success: true,
                data: {
                    registrations: createdRegistrations,
                    paymentId: razorpay_payment_id,
                    amountPaid,
                    message: `Team registered successfully. All ${team.members.length} members are now registered.`
                }
            });

        } else {
            // Individual registration
            const registration = await prisma.eventRegistration.create({
                data: {
                    eventId,
                    userId,
                    participationType: 'individual',
                    paymentStatus: 'completed',
                    paymentId: razorpay_payment_id,
                    amountPaid,
                    paidAt: new Date(),
                    status: 'confirmed'
                }
            });

            res.json({
                success: true,
                data: {
                    registration,
                    paymentId: razorpay_payment_id,
                    amountPaid
                }
            });
        }

        // TODO: Send confirmation email

    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to verify payment' }
        });
    }
};

// Webhook handler for payment events
exports.handleWebhook = async (req, res) => {
    try {
        const webhookBody = JSON.stringify(req.body);
        const webhookSignature = req.headers['x-razorpay-signature'];

        // Verify webhook signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(webhookBody)
            .digest('hex');

        if (expectedSignature !== webhookSignature) {
            return res.status(400).json({ error: 'Invalid signature' });
        }

        const event = req.body.event;
        const paymentEntity = req.body.payload.payment.entity;

        switch (event) {
            case 'payment.captured':
                // Payment successful
                console.log('Payment captured:', paymentEntity.id);
                // Update registration status if needed
                break;

            case 'payment.failed':
                // Payment failed
                console.log('Payment failed:', paymentEntity.id);
                // Mark registration as failed or delete it
                await prisma.eventRegistration.updateMany({
                    where: { paymentId: paymentEntity.id },
                    data: {
                        paymentStatus: 'failed',
                        status: 'cancelled'
                    }
                });
                break;

            case 'refund.created':
                // Refund initiated
                console.log('Refund created:', paymentEntity.id);
                break;

            default:
                console.log('Unhandled webhook event:', event);
        }

        res.json({ success: true });

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};

// Get payment details
exports.getPaymentDetails = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const userId = req.user.id;

        // Get registration with this payment
        const registration = await prisma.eventRegistration.findFirst({
            where: {
                paymentId,
                userId
            },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        eventStart: true
                    }
                }
            }
        });

        if (!registration) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Payment not found' }
            });
        }

        // Get payment details from Razorpay
        const payment = await razorpay.payments.fetch(paymentId);

        res.json({
            success: true,
            data: {
                payment: {
                    id: payment.id,
                    amount: payment.amount / 100,
                    currency: payment.currency,
                    status: payment.status,
                    method: payment.method,
                    createdAt: new Date(payment.created_at * 1000)
                },
                registration,
                event: registration.event
            }
        });

    } catch (error) {
        console.error('Get payment details error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get payment details' }
        });
    }
};

// Refund payment (Admin only)
exports.refundPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { amount, reason } = req.body;

        // Get payment details
        const registration = await prisma.eventRegistration.findFirst({
            where: { paymentId }
        });

        if (!registration) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Payment not found' }
            });
        }

        // Create refund
        const refund = await razorpay.payments.refund(paymentId, {
            amount: amount ? Math.round(amount * 100) : undefined, // Full refund if no amount
            notes: { reason: reason || 'Requested by admin' }
        });

        // Update registration
        await prisma.eventRegistration.update({
            where: { id: registration.id },
            data: {
                paymentStatus: 'refunded',
                status: 'cancelled'
            }
        });

        res.json({
            success: true,
            data: {
                refund: {
                    id: refund.id,
                    amount: refund.amount / 100,
                    status: refund.status
                },
                message: 'Refund initiated successfully'
            }
        });

    } catch (error) {
        console.error('Refund payment error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to process refund' }
        });
    }
};
