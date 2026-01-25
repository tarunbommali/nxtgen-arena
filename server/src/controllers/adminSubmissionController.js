const prisma = require('../utils/prismaClient');

// Get all submissions for an event
exports.getEventSubmissions = async (req, res) => {
    try {
        const { id: eventId } = req.params;
        const { status, sortBy = 'submittedAt', order = 'desc', page = 1, limit = 50 } = req.query;

        const where = { eventId };
        if (status) where.status = status;

        const orderByMap = {
            submittedAt: { submittedAt: order },
            score: { score: order },
            rank: { rank: order }
        };

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const [submissions, total] = await Promise.all([
            prisma.eventSubmission.findMany({
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
                            teamName: true,
                            members: {
                                include: {
                                    user: {
                                        select: {
                                            fullName: true,
                                            email: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: orderByMap[sortBy] || { submittedAt: 'desc' },
                skip,
                take
            }),
            prisma.eventSubmission.count({ where })
        ]);

        res.json({
            success: true,
            data: {
                submissions,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get event submissions error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get submissions' }
        });
    }
};

// Get single submission details
exports.getSubmissionDetails = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const submission = await prisma.eventSubmission.findUnique({
            where: { id: submissionId },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        whatsapp: true
                    }
                },
                team: {
                    include: {
                        members: {
                            include: {
                                user: {
                                    select: {
                                        fullName: true,
                                        email: true,
                                        whatsapp: true
                                    }
                                }
                            }
                        }
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
        console.error('Get submission details error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get submission details' }
        });
    }
};

// Evaluate submission
exports.evaluateSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { score, feedback } = req.body;

        if (score !== undefined && (score < 0 || score > 100)) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Score must be between 0 and 100' }
            });
        }

        const submission = await prisma.eventSubmission.findUnique({
            where: { id: submissionId }
        });

        if (!submission) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Submission not found' }
            });
        }

        const updatedSubmission = await prisma.eventSubmission.update({
            where: { id: submissionId },
            data: {
                score,
                feedback,
                status: 'evaluated',
                evaluatedAt: new Date()
            }
        });

        // Recalculate ranks for this event
        await recalculateRanks(submission.eventId);

        res.json({
            success: true,
            data: { submission: updatedSubmission },
            message: 'Submission evaluated successfully'
        });

    } catch (error) {
        console.error('Evaluate submission error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to evaluate submission' }
        });
    }
};

// Bulk evaluate submissions
exports.bulkEvaluate = async (req, res) => {
    try {
        const { evaluations } = req.body; // Array of { submissionId, score, feedback }

        if (!Array.isArray(evaluations) || evaluations.length === 0) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Evaluations array required' }
            });
        }

        const results = [];
        let eventId = null;

        for (const evaluation of evaluations) {
            try {
                const submission = await prisma.eventSubmission.update({
                    where: { id: evaluation.submissionId },
                    data: {
                        score: evaluation.score,
                        feedback: evaluation.feedback,
                        status: 'evaluated',
                        evaluatedAt: new Date()
                    }
                });

                eventId = submission.eventId;
                results.push({ submissionId: evaluation.submissionId, success: true });
            } catch (error) {
                results.push({ submissionId: evaluation.submissionId, success: false, error: error.message });
            }
        }

        // Recalculate ranks
        if (eventId) {
            await recalculateRanks(eventId);
        }

        res.json({
            success: true,
            data: { results },
            message: 'Bulk evaluation completed'
        });

    } catch (error) {
        console.error('Bulk evaluate error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to bulk evaluate' }
        });
    }
};

// Publish results
exports.publishResults = async (req, res) => {
    try {
        const { id: eventId } = req.params;
        const { winners } = req.body; // Array of { position, submissionId }

        if (!Array.isArray(winners) || winners.length === 0) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Winners array required' }
            });
        }

        // Update submission ranks based on winners
        for (const winner of winners) {
            await prisma.eventSubmission.update({
                where: { id: winner.submissionId },
                data: { rank: winner.position }
            });
        }

        // Mark event as completed
        const event = await prisma.event.update({
            where: { id: eventId },
            data: { status: 'completed' }
        });

        // Get winner details
        const winnerSubmissions = await prisma.eventSubmission.findMany({
            where: {
                eventId,
                rank: { in: winners.map(w => w.position) }
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
            },
            orderBy: { rank: 'asc' }
        });

        res.json({
            success: true,
            data: {
                event,
                winners: winnerSubmissions
            },
            message: 'Results published successfully'
        });

        // TODO: Send notification emails to winners

    } catch (error) {
        console.error('Publish results error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to publish results' }
        });
    }
};

// Get event results (Public)
exports.getEventResults = async (req, res) => {
    try {
        const { id: eventId } = req.params;

        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Event not found' }
            });
        }

        if (event.status !== 'completed') {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Results not published yet' }
            });
        }

        // Get top submissions
        const results = await prisma.eventSubmission.findMany({
            where: {
                eventId,
                status: 'evaluated',
                rank: { not: null }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true
                    }
                },
                team: {
                    select: {
                        id: true,
                        teamName: true
                    }
                }
            },
            orderBy: { rank: 'asc' },
            take: 10 // Top 10
        });

        res.json({
            success: true,
            data: {
                event: {
                    id: event.id,
                    title: event.title,
                    prizes: event.prizes
                },
                results
            }
        });

    } catch (error) {
        console.error('Get event results error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get results' }
        });
    }
};

// Helper function to recalculate ranks
async function recalculateRanks(eventId) {
    try {
        // Get all evaluated submissions for this event, ordered by score
        const submissions = await prisma.eventSubmission.findMany({
            where: {
                eventId,
                status: 'evaluated',
                score: { not: null }
            },
            orderBy: { score: 'desc' }
        });

        // Update ranks
        for (let i = 0; i < submissions.length; i++) {
            await prisma.eventSubmission.update({
                where: { id: submissions[i].id },
                data: { rank: i + 1 }
            });
        }
    } catch (error) {
        console.error('Recalculate ranks error:', error);
    }
}

// Export submissions data
exports.exportSubmissions = async (req, res) => {
    try {
        const { id: eventId } = req.params;

        const submissions = await prisma.eventSubmission.findMany({
            where: { eventId },
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
            },
            orderBy: { rank: 'asc' }
        });

        // Convert to CSV
        const headers = [
            'Rank',
            'Name/Team',
            'Email',
            'Score',
            'MVP Link',
            'GitHub URL',
            'Status',
            'Submitted At'
        ];

        const rows = submissions.map(s => [
            s.rank || '-',
            s.team ? s.team.teamName : s.user.fullName,
            s.user.email,
            s.score || '-',
            s.mvpLink || '-',
            s.githubRepoUrl || '-',
            s.status,
            s.submittedAt.toISOString()
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        res.header('Content-Type', 'text/csv');
        res.attachment(`submissions_${eventId}.csv`);
        res.send(csv);

    } catch (error) {
        console.error('Export submissions error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to export submissions' }
        });
    }
};
