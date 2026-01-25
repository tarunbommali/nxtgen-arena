const prisma = require('../utils/prismaClient');
const { sendBulkEmails, templates, replacePlaceholders } = require('../services/emailService');
const {
    createCertificateRecord,
    generateAndSendCertificate,
    verifyCertificate
} = require('../services/certificateService');

// Get all participants for email
exports.getParticipantsForEmail = async (req, res) => {
    try {
        const { id: eventId } = req.params;

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { title: true, eventStart: true }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Event not found' }
            });
        }

        // Get all registered users
        const registrations = await prisma.eventRegistration.findMany({
            where: {
                eventId,
                status: 'confirmed'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                },
                team: {
                    select: {
                        id: true,
                        teamName: true
                    }
                }
            }
        });

        // Format participants
        const participants = registrations.map(reg => ({
            userId: reg.user.id,
            name: reg.user.fullName,
            email: reg.user.email,
            teamName: reg.team?.teamName,
            registrationId: reg.id
        }));

        res.json({
            success: true,
            data: {
                event: {
                    id: eventId,
                    title: event.title,
                    date: event.eventStart.toISOString().split('T')[0]
                },
                participants,
                count: participants.length
            }
        });

    } catch (error) {
        console.error('Get participants for email error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get participants' }
        });
    }
};

// Send bulk email to participants
exports.sendEventEmail = async (req, res) => {
    try {
        const { id: eventId } = req.params;
        const { subject, message, recipientIds } = req.body; // recipientIds = selected user IDs

        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Subject and message required' }
            });
        }

        // Get event details
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: {
                title: true,
                eventStart: true
            }
        });

        // Get recipients
        const where = {
            eventId,
            status: 'confirmed'
        };

        if (recipientIds && recipientIds.length > 0) {
            where.userId = { in: recipientIds };
        }

        const registrations = await prisma.eventRegistration.findMany({
            where,
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true
                    }
                },
                team: {
                    select: {
                        teamName: true
                    }
                }
            }
        });

        // Prepare recipients
        const recipients = registrations.map(reg => ({
            email: reg.user.email,
            name: reg.user.fullName,
            eventName: event.title,
            eventDate: event.eventStart.toISOString().split('T')[0],
            teamName: reg.team?.teamName,
            registrationId: reg.id
        }));

        // Send emails (batched)
        const emailHtml = templates.eventUpdate(event.title, message);

        // Start sending in background (async)
        sendBulkEmails(recipients, {
            subject,
            html: emailHtml
        }).then(results => {
            console.log(`Email sending completed. Success: ${results.filter(r => r.success).length}, Failed: ${results.filter(r => !r.success).length}`);
        }).catch(error => {
            console.error('Bulk email error:', error);
        });

        // Log email activity
        await prisma.emailLog.create({
            data: {
                eventId,
                sentBy: req.user.id,
                recipientCount: recipients.length,
                subject,
                message,
                sentAt: new Date()
            }
        });

        // Immediate response (emails sending in background)
        res.json({
            success: true,
            message: `Sending emails to ${recipients.length} participants. This may take a few minutes.`,
            data: {
                totalRecipients: recipients.length,
                status: 'processing'
            }
        });

    } catch (error) {
        console.error('Send event email error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to send emails' }
        });
    }
};

// Send certificates to participants
exports.sendCertificates = async (req, res) => {
    try {
        const { id: eventId } = req.params;
        const { recipientIds, includePosition } = req.body; // recipientIds = selected user IDs

        // Get event details
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: {
                title: true,
                eventStart: true,
                status: true
            }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Event not found' }
            });
        }

        // Only send certificates for completed events
        if (event.status !== 'completed') {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Certificates can only be sent for completed events' }
            });
        }

        // Get recipients
        const where = {
            eventId,
            status: 'confirmed'
        };

        if (recipientIds && recipientIds.length > 0) {
            where.userId = { in: recipientIds };
        }

        const registrations = await prisma.eventRegistration.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                },
                team: {
                    select: {
                        id: true,
                        teamName: true
                    }
                }
            }
        });

        // Get submissions with ranks (if includePosition)
        let submissionsMap = {};
        if (includePosition) {
            const submissions = await prisma.eventSubmission.findMany({
                where: {
                    eventId,
                    userId: { in: registrations.map(r => r.userId) },
                    rank: { not: null }
                },
                select: {
                    userId: true,
                    rank: true
                }
            });

            submissionsMap = submissions.reduce((map, sub) => {
                map[sub.userId] = sub.rank;
                return map;
            }, {});
        }

        // Process certificates (async in background)
        const certificatePromises = registrations.map(async (reg) => {
            try {
                // Create certificate record in DB (metadata only)
                const certificateRecord = await createCertificateRecord(
                    eventId,
                    reg.user.id,
                    reg.teamId,
                    includePosition ? getPositionText(submissionsMap[reg.user.id]) : null,
                    reg.user.fullName
                );

                // Generate certificate data
                const certificateData = {
                    certificateId: certificateRecord.certificateId,
                    participantName: reg.user.fullName,
                    eventName: event.title,
                    date: event.eventStart.toISOString().split('T')[0],
                    teamName: reg.team?.teamName,
                    position: includePosition ? getPositionText(submissionsMap[reg.user.id]) : null
                };

                // Generate PDF in memory and send email
                await generateAndSendCertificate(certificateData, reg.user.email);

                return {
                    email: reg.user.email,
                    certificateId: certificateRecord.certificateId,
                    success: true
                };
            } catch (error) {
                console.error(`Certificate generation failed for ${reg.user.email}:`, error);
                return {
                    email: reg.user.email,
                    success: false,
                    error: error.message
                };
            }
        });

        // Start processing in background
        Promise.allSettled(certificatePromises).then(results => {
            const successful = results.filter(r => r.value?.success).length;
            console.log(`Certificate sending completed. Success: ${successful}, Failed: ${results.length - successful}`);
        });

        // Immediate response
        res.json({
            success: true,
            message: `Generating and sending certificates to ${registrations.length} participants. This may take several minutes.`,
            data: {
                totalRecipients: registrations.length,
                status: 'processing'
            }
        });

    } catch (error) {
        console.error('Send certificates error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to send certificates' }
        });
    }
};

// Verify certificate (public)
exports.verifyCertificatePublic = async (req, res) => {
    try {
        const { certificateId } = req.params;

        const certificate = await verifyCertificate(certificateId);

        if (!certificate) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Certificate not found or invalid' }
            });
        }

        res.json({
            success: true,
            data: certificate
        });

    } catch (error) {
        console.error('Verify certificate error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to verify certificate' }
        });
    }
};

// Get email logs
exports.getEmailLogs = async (req, res) => {
    try {
        const { id: eventId } = req.params;

        const logs = await prisma.emailLog.findMany({
            where: { eventId },
            include: {
                sender: {
                    select: {
                        fullName: true,
                        email: true
                    }
                }
            },
            orderBy: { sentAt: 'desc' }
        });

        res.json({
            success: true,
            data: { logs }
        });

    } catch (error) {
        console.error('Get email logs error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get email logs' }
        });
    }
};

// Helper function to convert rank to position text
function getPositionText(rank) {
    if (!rank) return null;

    if (rank === 1) return '1st Place';
    if (rank === 2) return '2nd Place';
    if (rank === 3) return '3rd Place';
    return `${rank}th Place`;
}

module.exports = {
    getParticipantsForEmail,
    sendEventEmail,
    sendCertificates,
    verifyCertificatePublic,
    getEmailLogs
};
