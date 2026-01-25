const prisma = require('../utils/prismaClient');
const { saveFile, deleteFile, validateFile } = require('../services/uploadService');

// Submit project
exports.submitProject = async (req, res) => {
    try {
        const { id: eventId } = req.params;
        const userId = req.user.id;
        const {
            mvpLink,
            demoVideoUrl,
            githubRepoUrl,
            technologiesUsed,
            aiToolsIntegrated,
            solutionDescription
        } = req.body;

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

        // Check if submissions are enabled
        if (!event.hasSubmission) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Submissions not enabled for this event' }
            });
        }

        // Check submission deadline
        const now = new Date();
        if (event.submissionStart && now < event.submissionStart) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Submission period has not started yet' }
            });
        }
        if (event.submissionDeadline && now > event.submissionDeadline) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Submission deadline has passed' }
            });
        }

        // Check if user is registered
        const registration = await prisma.eventRegistration.findFirst({
            where: {
                eventId,
                userId,
                status: 'confirmed'
            },
            include: {
                team: true
            }
        });

        if (!registration) {
            return res.status(403).json({
                success: false,
                error: { code: 'FORBIDDEN', message: 'You must be registered for this event to submit' }
            });
        }

        // Check if already submitted
        const existingSubmission = await prisma.eventSubmission.findFirst({
            where: {
                eventId,
                userId
            }
        });

        if (existingSubmission && existingSubmission.status === 'evaluated') {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Cannot modify evaluated submission' }
            });
        }

        // Validate URLs
        const urlRegex = /^https?:\/\/.+/;
        if (mvpLink && !urlRegex.test(mvpLink)) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Invalid MVP link' }
            });
        }
        if (demoVideoUrl && !urlRegex.test(demoVideoUrl)) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Invalid demo video URL' }
            });
        }
        if (githubRepoUrl && !urlRegex.test(githubRepoUrl)) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Invalid GitHub URL' }
            });
        }

        // Handle file upload
        let projectDeckUrl = null;
        if (req.file) {
            validateFile(req.file);
            const uploadResult = await saveFile(req.file, 'submissions');
            projectDeckUrl = uploadResult.url;
        }

        const submissionData = {
            eventId,
            userId,
            teamId: registration.teamId,
            projectDeckUrl,
            mvpLink,
            demoVideoUrl,
            githubRepoUrl,
            technologiesUsed: technologiesUsed?.substring(0, 256),
            aiToolsIntegrated: aiToolsIntegrated?.substring(0, 256),
            solutionDescription: solutionDescription?.substring(0, 1000),
            status: 'submitted'
        };

        if (existingSubmission) {
            // Update existing submission
            const submission = await prisma.eventSubmission.update({
                where: { id: existingSubmission.id },
                data: {
                    ...submissionData,
                    updatedAt: new Date()
                }
            });

            // Delete old file if new one uploaded
            if (projectDeckUrl && existingSubmission.projectDeckUrl) {
                await deleteFile(existingSubmission.projectDeckUrl);
            }

            res.json({
                success: true,
                data: { submission },
                message: 'Submission updated successfully'
            });
        } else {
            // Create new submission
            const submission = await prisma.eventSubmission.create({
                data: submissionData
            });

            res.status(201).json({
                success: true,
                data: { submission },
                message: 'Submission created successfully'
            });
        }

    } catch (error) {
        console.error('Submit project error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to submit project' }
        });
    }
};

// Get my submission
exports.getMySubmission = async (req, res) => {
    try {
        const { id: eventId } = req.params;
        const userId = req.user.id;

        const submission = await prisma.eventSubmission.findFirst({
            where: {
                eventId,
                userId
            },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        submissionDeadline: true
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

        if (!submission) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Submission not found' }
            });
        }

        res.json({
            success: true,
            data: { submission }
        });

    } catch (error) {
        console.error('Get my submission error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get submission' }
        });
    }
};

// Delete submission
exports.deleteSubmission = async (req, res) => {
    try {
        const { id: eventId } = req.params;
        const userId = req.user.id;

        const submission = await prisma.eventSubmission.findFirst({
            where: {
                eventId,
                userId
            },
            include: {
                event: true
            }
        });

        if (!submission) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Submission not found' }
            });
        }

        // Check if already evaluated
        if (submission.status === 'evaluated') {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Cannot delete evaluated submission' }
            });
        }

        // Check deadline
        if (submission.event.submissionDeadline && new Date() > submission.event.submissionDeadline) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Cannot delete submission after deadline' }
            });
        }

        // Delete file if exists
        if (submission.projectDeckUrl) {
            await deleteFile(submission.projectDeckUrl);
        }

        // Delete submission
        await prisma.eventSubmission.delete({
            where: { id: submission.id }
        });

        res.json({
            success: true,
            message: 'Submission deleted successfully'
        });

    } catch (error) {
        console.error('Delete submission error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to delete submission' }
        });
    }
};

// Get submission template URL
exports.getSubmissionTemplate = async (req, res) => {
    try {
        const { id: eventId } = req.params;

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: {
                submissionTemplateUrl: true,
                hasSubmission: true
            }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Event not found' }
            });
        }

        if (!event.hasSubmission) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Submissions not enabled for this event' }
            });
        }

        res.json({
            success: true,
            data: {
                templateUrl: event.submissionTemplateUrl
            }
        });

    } catch (error) {
        console.error('Get submission template error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get submission template' }
        });
    }
};
