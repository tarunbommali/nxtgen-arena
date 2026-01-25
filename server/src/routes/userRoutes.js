const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const teamController = require('../controllers/teamController');
const prisma = require('../utils/prismaClient');

// All user routes require authentication
router.use(authenticateToken);

// Get my registrations
router.get('/me/registrations', async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;

        const where = { userId };

        // Filter by event status if provided
        if (status) {
            where.event = { status };
        }

        const registrations = await prisma.eventRegistration.findMany({
            where,
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        bannerImage: true,
                        eventStart: true,
                        eventEnd: true,
                        status: true,
                        mode: true,
                        venue: true,
                        meetingLink: true,
                        hasSubmission: true,
                        isTeamEvent: true
                    }
                },
                team: {
                    select: {
                        id: true,
                        teamName: true,
                        isComplete: true
                    }
                }
            },
            orderBy: {
                registeredAt: 'desc'
            }
        });

        res.json({
            success: true,
            data: { registrations }
        });

    } catch (error) {
        console.error('Get my registrations error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get registrations' }
        });
    }
});

// Get my teams
router.get('/me/teams', teamController.getMyTeams);

// Get my submissions
router.get('/me/submissions', async (req, res) => {
    try {
        const userId = req.user.id;

        const submissions = await prisma.eventSubmission.findMany({
            where: { userId },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                team: {
                    select: {
                        id: true,
                        teamName: true
                    }
                }
            },
            orderBy: {
                submittedAt: 'desc'
            }
        });

        res.json({
            success: true,
            data: { submissions }
        });

    } catch (error) {
        console.error('Get my submissions error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get submissions' }
        });
    }
});

// Get my stats
router.get('/me/stats', async (req, res) => {
    try {
        const userId = req.user.id;

        // Get counts in parallel
        const [
            registrationsCount,
            teamsCount,
            submissionsCount,
            user
        ] = await Promise.all([
            prisma.eventRegistration.count({ where: { userId } }),
            prisma.teamMember.count({ where: { userId } }),
            prisma.eventSubmission.count({ where: { userId } }),
            prisma.user.findUnique({
                where: { id: userId },
                select: {
                    totalPoints: true,
                    currentStreak: true,
                    level: true
                }
            })
        ]);

        res.json({
            success: true,
            data: {
                stats: {
                    eventsParticipated: registrationsCount,
                    teamsJoined: teamsCount,
                    submissionsMade: submissionsCount,
                    totalPoints: user.totalPoints,
                    currentStreak: user.currentStreak,
                    level: user.level
                }
            }
        });

    } catch (error) {
        console.error('Get my stats error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get stats' }
        });
    }
});

// Get my profile
router.get('/me', async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'User not found' }
            });
        }

        // Remove sensitive data
        const { ...userData } = user;

        res.json({
            success: true,
            data: { user: userData }
        });

    } catch (error) {
        console.error('Get my profile error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get profile' }
        });
    }
});

// Update my profile
router.put('/me', async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            fullName,
            whatsapp,
            gender,
            graduation,
            specialization,
            year,
            regNumber,
            skills,
            domain,
            githubUrl,
            codingUrl
        } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(fullName && { fullName }),
                ...(whatsapp && { whatsapp }),
                ...(gender && { gender }),
                ...(graduation && { graduation }),
                ...(specialization && { specialization }),
                ...(year && { year }),
                ...(regNumber && { regNumber }),
                ...(skills && { skills }),
                ...(domain && { domain }),
                ...(githubUrl && { githubUrl }),
                ...(codingUrl && { codingUrl })
            }
        });

        res.json({
            success: true,
            data: { user: updatedUser }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to update profile' }
        });
    }
});

module.exports = router;
