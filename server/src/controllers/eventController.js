const prisma = require('../utils/prismaClient');

// Public: Get all events with filters
exports.getAllEvents = async (req, res) => {
    try {
        const {
            category,
            type,
            status,
            isPaid,
            mode,
            search,
            page = 1,
            limit = 10
        } = req.query;

        const where = {
            status: { in: ['published', 'active'] } // Show both published and active events
        };

        // Apply filters
        if (category) where.categoryId = category;
        if (type) where.eventType = type;
        if (status) where.status = status;
        if (isPaid !== undefined) where.isPaid = isPaid === 'true';
        if (mode) where.mode = mode;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where,
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            icon: true,
                            color: true
                        }
                    },
                    _count: {
                        select: {
                            registrations: true,
                            teams: true
                        }
                    }
                },
                orderBy: { eventStart: 'asc' },
                skip,
                take
            }),
            prisma.event.count({ where })
        ]);

        const eventsWithCounts = events.map(event => ({
            ...event,
            participantCount: event._count.registrations,
            teamCount: event._count.teams,
            _count: undefined
        }));

        res.json({
            success: true,
            data: {
                events: eventsWithCounts,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get all events error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get events' }
        });
    }
};

// Public: Get event by ID with full details
exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id; // Optional auth

        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                category: true,
                creator: {
                    select: {
                        id: true,
                        fullName: true
                    }
                },
                _count: {
                    select: {
                        registrations: true,
                        teams: true,
                        submissions: true
                    }
                }
            }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Event not found' }
            });
        }

        const response = {
            ...event,
            registrationCount: event._count.registrations,
            teamCount: event._count.teams,
            submissionCount: event._count.submissions,
            _count: undefined
        };

        // If user is authenticated, check their registration status
        if (userId) {
            const userRegistration = await prisma.eventRegistration.findFirst({
                where: {
                    eventId: id,
                    userId
                },
                include: {
                    team: {
                        include: {
                            members: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            email: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            response.currentUserRegistration = userRegistration;
        }

        res.json({
            success: true,
            data: { event: response }
        });

    } catch (error) {
        console.error('Get event by ID error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get event' }
        });
    }
};

// Public: Get event teams (for browsing)
exports.getEventTeams = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.query;

        const where = { eventId: id };

        if (status === 'incomplete') where.isComplete = false;
        if (status === 'complete') where.isComplete = true;
        if (status === 'registered') {
            where.registrations = {
                some: {}
            };
        }

        const teams = await prisma.team.findMany({
            where,
            include: {
                leader: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        members: true,
                        registrations: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const teamsWithCounts = teams.map(team => ({
            id: team.id,
            teamName: team.teamName,
            leader: team.leader,
            memberCount: team._count.members,
            isComplete: team.isComplete,
            isLocked: team.isLocked,
            isRegistered: team._count.registrations > 0,
            createdAt: team.createdAt
        }));

        res.json({
            success: true,
            data: { teams: teamsWithCounts }
        });

    } catch (error) {
        console.error('Get event teams error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get teams' }
        });
    }
};

// Protected: Register for event
exports.registerForEvent = async (req, res) => {
    try {
        const { id: eventId } = req.params;
        const { participationType, teamId } = req.body;
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

        // Check if event is published
        if (event.status !== 'published') {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Event is not open for registration' }
            });
        }

        // Check registration dates
        const now = new Date();
        if (now < event.registrationStart) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Registration has not started yet' }
            });
        }
        if (now > event.registrationEnd) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Registration has closed' }
            });
        }

        // Check max participants
        if (event.maxParticipants) {
            const currentRegistrations = await prisma.eventRegistration.count({
                where: { eventId }
            });
            if (currentRegistrations >= event.maxParticipants) {
                return res.status(400).json({
                    success: false,
                    error: { code: 'VALIDATION_ERROR', message: 'Event is full' }
                });
            }
        }

        // Check if already registered
        const existingRegistration = await prisma.eventRegistration.findFirst({
            where: { userId, eventId }
        });

        if (existingRegistration) {
            return res.status(409).json({
                success: false,
                error: { code: 'CONFLICT', message: 'Already registered for this event' }
            });
        }

        // Handle team event logic
        if (event.isTeamEvent && participationType === 'team') {
            if (!teamId) {
                return res.status(400).json({
                    success: false,
                    error: { code: 'VALIDATION_ERROR', message: 'Team ID required for team events' }
                });
            }

            // Verify team
            const team = await prisma.team.findUnique({
                where: { id: teamId },
                include: { members: true }
            });

            if (!team || team.eventId !== eventId) {
                return res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Team not found for this event' }
                });
            }

            // Check if user is in team
            const isMember = team.members.some(m => m.userId === userId);
            if (!isMember) {
                return res.status(403).json({
                    success: false,
                    error: { code: 'FORBIDDEN', message: 'You are not a member of this team' }
                });
            }

            // Check team size requirements
            if (team.members.length < event.minTeamSize) {
                return res.status(400).json({
                    success: false,
                    error: { code: 'VALIDATION_ERROR', message: `Team must have at least ${event.minTeamSize} members` }
                });
            }

            if (team.members.length > event.maxTeamSize) {
                return res.status(400).json({
                    success: false,
                    error: { code: 'VALIDATION_ERROR', message: `Team cannot exceed ${event.maxTeamSize} members` }
                });
            }

            // Only team leader can register the team
            if (team.teamLeaderId !== userId) {
                return res.status(403).json({
                    success: false,
                    error: { code: 'FORBIDDEN', message: 'Only team leader can register the team' }
                });
            }
        } else if (event.isTeamEvent && participationType === 'individual') {
            // Check if individual participation is allowed
            if (!event.allowIndividual) {
                return res.status(400).json({
                    success: false,
                    error: { code: 'VALIDATION_ERROR', message: 'Individual participation not allowed for this event' }
                });
            }
        }

        // For paid events, return payment order details instead of creating registration
        if (event.isPaid) {
            return res.json({
                success: true,
                data: {
                    requiresPayment: true,
                    amount: parseFloat(event.registrationFee),
                    currency: event.currency,
                    message: 'Payment required. Use payment API to complete registration.'
                }
            });
        }

        // For free events, create registration immediately
        const registration = await prisma.eventRegistration.create({
            data: {
                eventId,
                userId,
                teamId: participationType === 'team' ? teamId : null,
                participationType,
                paymentStatus: 'n/a',
                status: 'confirmed'
            }
        });

        // If team registration, lock the team
        if (teamId) {
            await prisma.team.update({
                where: { id: teamId },
                data: { isLocked: true }
            });

            // Create registration for all team members
            const team = await prisma.team.findUnique({
                where: { id: teamId },
                include: { members: true }
            });

            const memberRegistrations = team.members
                .filter(m => m.userId !== userId) // Exclude leader (already registered)
                .map(m => ({
                    eventId,
                    userId: m.userId,
                    teamId,
                    participationType: 'team',
                    paymentStatus: 'n/a',
                    status: 'confirmed'
                }));

            if (memberRegistrations.length > 0) {
                await prisma.eventRegistration.createMany({
                    data: memberRegistrations
                });
            }
        }

        res.status(201).json({
            success: true,
            data: { registration }
        });

    } catch (error) {
        console.error('Register for event error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to register for event' }
        });
    }
};

// Protected: Cancel registration
exports.cancelRegistration = async (req, res) => {
    try {
        const { id: eventId } = req.params;
        const userId = req.user.id;

        const registration = await prisma.eventRegistration.findFirst({
            where: { userId, eventId },
            include: { event: true }
        });

        if (!registration) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Registration not found' }
            });
        }

        // Check if event has already started
        if (new Date() >= registration.event.eventStart) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Cannot cancel registration after event has started' }
            });
        }

        // Delete registration
        await prisma.eventRegistration.delete({
            where: { id: registration.id }
        });

        // TODO: Handle refund for paid events

        res.json({
            success: true,
            message: 'Registration cancelled successfully'
        });

    } catch (error) {
        console.error('Cancel registration error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to cancel registration' }
        });
    }
};

// Public: Get upcoming events
exports.getUpcomingEvents = async (req, res) => {
    try {
        const now = new Date();

        const events = await prisma.event.findMany({
            where: {
                status: 'published',
                eventStart: { gte: now }
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            },
            orderBy: { eventStart: 'asc' },
            take: 10
        });

        res.json({
            success: true,
            data: { events }
        });

    } catch (error) {
        console.error('Get upcoming events error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get upcoming events' }
        });
    }
};

// Public: Get live events
exports.getLiveEvents = async (req, res) => {
    try {
        const now = new Date();

        const events = await prisma.event.findMany({
            where: {
                status: 'published',
                eventStart: { lte: now },
                eventEnd: { gte: now }
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            },
            orderBy: { eventStart: 'asc' }
        });

        res.json({
            success: true,
            data: { events }
        });

    } catch (error) {
        console.error('Get live events error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get live events' }
        });
    }
};

// Public: Get past events
exports.getPastEvents = async (req, res) => {
    try {
        const now = new Date();

        const events = await prisma.event.findMany({
            where: {
                status: 'published',
                eventEnd: { lt: now }
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            },
            orderBy: { eventStart: 'desc' },
            take: 20
        });

        res.json({
            success: true,
            data: { events }
        });

    } catch (error) {
        console.error('Get past events error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get past events' }
        });
    }
};

// Public: Get featured events
exports.getFeaturedEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            where: {
                status: 'published',
                isFeatured: true
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            },
            orderBy: { eventStart: 'asc' },
            take: 6
        });

        res.json({
            success: true,
            data: { events }
        });

    } catch (error) {
        console.error('Get featured events error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get featured events' }
        });
    }
};
