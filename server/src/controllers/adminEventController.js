const prisma = require('../utils/prismaClient');
const { saveFile, deleteFile } = require('../services/uploadService');

// Create event
exports.createEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const eventData = req.body;

        // Generate slug from title
        const slug = eventData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Check slug uniqueness
        const existingEvent = await prisma.event.findUnique({
            where: { slug }
        });

        if (existingEvent) {
            return res.status(409).json({
                success: false,
                error: { code: 'CONFLICT', message: 'Event with this title already exists' }
            });
        }

        // Handle banner image upload
        let bannerImage = eventData.bannerImage;
        if (req.file) {
            const uploadResult = await saveFile(req.file, 'banners');
            bannerImage = uploadResult.url;
        }

        const event = await prisma.event.create({
            data: {
                ...eventData,
                slug,
                bannerImage,
                createdBy: userId,
                status: eventData.status || 'draft'
            }
        });

        res.status(201).json({
            success: true,
            data: { event }
        });

    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to create event' }
        });
    }
};

// Update event
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const event = await prisma.event.findUnique({
            where: { id }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Event not found' }
            });
        }

        // Handle banner image upload
        let bannerImage = updates.bannerImage;
        if (req.file) {
            const uploadResult = await saveFile(req.file, 'banners');
            bannerImage = uploadResult.url;

            // Delete old banner if exists
            if (event.bannerImage) {
                await deleteFile(event.bannerImage);
            }
        }

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                ...updates,
                ...(bannerImage && { bannerImage })
            }
        });

        res.json({
            success: true,
            data: { event: updatedEvent }
        });

    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to update event' }
        });
    }
};

// Delete event
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                registrations: true,
                submissions: true
            }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Event not found' }
            });
        }

        // Check if event has registrations
        if (event.registrations.length > 0) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Cannot delete event with registrations. Cancel all registrations first or mark as cancelled.'
                }
            });
        }

        // Delete banner image
        if (event.bannerImage) {
            await deleteFile(event.bannerImage);
        }

        // Delete event (cascades will handle related records)
        await prisma.event.delete({
            where: { id }
        });

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });

    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to delete event' }
        });
    }
};

// Get all events (Admin view with more details)
exports.getAllEventsAdmin = async (req, res) => {
    try {
        const { status, category, page = 1, limit = 20 } = req.query;

        const where = {};
        if (status) where.status = status;
        if (category) where.categoryId = category;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where,
                include: {
                    category: true,
                    _count: {
                        select: {
                            registrations: true,
                            teams: true,
                            submissions: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take
            }),
            prisma.event.count({ where })
        ]);

        const eventsWithStats = events.map(event => ({
            ...event,
            registrationCount: event._count.registrations,
            teamCount: event._count.teams,
            submissionCount: event._count.submissions,
            _count: undefined
        }));

        res.json({
            success: true,
            data: {
                events: eventsWithStats,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get all events admin error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get events' }
        });
    }
};

// Get event participants
exports.getEventParticipants = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus, participationType, page = 1, limit = 50 } = req.query;

        const where = { eventId: id };
        if (paymentStatus) where.paymentStatus = paymentStatus;
        if (participationType) where.participationType = participationType;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const [participants, total] = await Promise.all([
            prisma.eventRegistration.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            whatsapp: true,
                            regNumber: true
                        }
                    },
                    team: {
                        select: {
                            id: true,
                            teamName: true,
                            _count: {
                                select: {
                                    members: true
                                }
                            }
                        }
                    }
                },
                orderBy: { registeredAt: 'desc' },
                skip,
                take
            }),
            prisma.eventRegistration.count({ where })
        ]);

        res.json({
            success: true,
            data: {
                participants,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get event participants error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get participants' }
        });
    }
};

// Get event teams
exports.getEventTeamsAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const teams = await prisma.team.findMany({
            where: { eventId: id },
            include: {
                leader: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                                whatsapp: true
                            }
                        }
                    }
                },
                registrations: {
                    select: {
                        id: true,
                        status: true,
                        paymentStatus: true,
                        registeredAt: true
                    },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const teamsWithDetails = teams.map(team => ({
            ...team,
            memberCount: team.members.length,
            isRegistered: team.registrations.length > 0,
            registration: team.registrations[0] || null
        }));

        res.json({
            success: true,
            data: { teams: teamsWithDetails }
        });

    } catch (error) {
        console.error('Get event teams admin error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get teams' }
        });
    }
};

// Publish/Unpublish event
exports.toggleEventStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['draft', 'published', 'ongoing', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Invalid status' }
            });
        }

        const event = await prisma.event.update({
            where: { id },
            data: { status }
        });

        res.json({
            success: true,
            data: { event },
            message: `Event ${status} successfully`
        });

    } catch (error) {
        console.error('Toggle event status error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to update event status' }
        });
    }
};

// Close registrations
exports.closeRegistrations = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await prisma.event.update({
            where: { id },
            data: {
                registrationEnd: new Date() // Set to now to close
            }
        });

        res.json({
            success: true,
            data: { event },
            message: 'Registrations closed successfully'
        });

    } catch (error) {
        console.error('Close registrations error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to close registrations' }
        });
    }
};
