const prisma = require('../utils/prismaClient');

// Get dashboard analytics
exports.getDashboardAnalytics = async (req, res) => {
    try {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Get overview stats
        const [
            totalEvents,
            totalUsers,
            totalRegistrations,
            totalRevenue,
            monthlyEvents,
            monthlyUsers,
            monthlyRegistrations,
            monthlyRevenue
        ] = await Promise.all([
            // Total counts
            prisma.event.count(),
            prisma.user.count(),
            prisma.eventRegistration.count(),
            prisma.eventRegistration.aggregate({
                where: {
                    paymentStatus: 'completed'
                },
                _sum: {
                    amountPaid: true
                }
            }),

            // Monthly counts
            prisma.event.count({
                where: {
                    createdAt: { gte: firstDayOfMonth }
                }
            }),
            prisma.user.count({
                where: {
                    createdAt: { gte: firstDayOfMonth }
                }
            }),
            prisma.eventRegistration.count({
                where: {
                    registeredAt: { gte: firstDayOfMonth }
                }
            }),
            prisma.eventRegistration.aggregate({
                where: {
                    paymentStatus: 'completed',
                    paidAt: { gte: firstDayOfMonth }
                },
                _sum: {
                    amountPaid: true
                }
            })
        ]);

        // Get recent activity
        const recentRegistrations = await prisma.eventRegistration.findMany({
            where: {
                registeredAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                }
            },
            include: {
                user: {
                    select: {
                        fullName: true
                    }
                },
                event: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                registeredAt: 'desc'
            },
            take: 10
        });

        const recentActivity = recentRegistrations.map(reg => ({
            type: 'registration',
            user: reg.user.fullName,
            event: reg.event.title,
            timestamp: reg.registeredAt
        }));

        res.json({
            success: true,
            data: {
                overview: {
                    totalEvents,
                    totalUsers,
                    totalRegistrations,
                    totalRevenue: parseFloat(totalRevenue._sum.amountPaid || 0)
                },
                monthly: {
                    events: monthlyEvents,
                    users: monthlyUsers,
                    registrations: monthlyRegistrations,
                    revenue: parseFloat(monthlyRevenue._sum.amountPaid || 0)
                },
                recentActivity
            }
        });

    } catch (error) {
        console.error('Get dashboard analytics error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get dashboard analytics' }
        });
    }
};

// Get event-wise analytics
exports.getEventAnalytics = async (req, res) => {
    try {
        const { startDate, endDate, status } = req.query;

        const where = {};
        if (status) where.status = status;
        if (startDate && endDate) {
            where.eventStart = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        const events = await prisma.event.findMany({
            where,
            include: {
                category: {
                    select: {
                        name: true
                    }
                },
                _count: {
                    select: {
                        registrations: true,
                        teams: true,
                        submissions: true
                    }
                }
            },
            orderBy: {
                eventStart: 'desc'
            }
        });

        // Calculate revenue for each event
        const eventsWithAnalytics = await Promise.all(
            events.map(async (event) => {
                const revenue = await prisma.eventRegistration.aggregate({
                    where: {
                        eventId: event.id,
                        paymentStatus: 'completed'
                    },
                    _sum: {
                        amountPaid: true
                    }
                });

                return {
                    id: event.id,
                    title: event.title,
                    category: event.category.name,
                    date: event.eventStart,
                    status: event.status,
                    participantCount: event._count.registrations,
                    teamCount: event._count.teams,
                    submissionCount: event._count.submissions,
                    revenue: parseFloat(revenue._sum.amountPaid || 0),
                    isPaid: event.isPaid,
                    registrationFee: event.isPaid ? parseFloat(event.registrationFee) : 0
                };
            })
        );

        res.json({
            success: true,
            data: {
                events: eventsWithAnalytics
            }
        });

    } catch (error) {
        console.error('Get event analytics error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get event analytics' }
        });
    }
};

// Get revenue analytics
exports.getRevenueAnalytics = async (req, res) => {
    try {
        const { period = 'month' } = req.query; // month, quarter, year

        let startDate;
        const now = new Date();

        switch (period) {
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'quarter':
                const quarter = Math.floor(now.getMonth() / 3);
                startDate = new Date(now.getFullYear(), quarter * 3, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        // Get revenue by event
        const revenueByEvent = await prisma.eventRegistration.groupBy({
            by: ['eventId'],
            where: {
                paymentStatus: 'completed',
                paidAt: { gte: startDate }
            },
            _sum: {
                amountPaid: true
            },
            _count: {
                _all: true
            }
        });

        // Get event details
        const eventsWithRevenue = await Promise.all(
            revenueByEvent.map(async (item) => {
                const event = await prisma.event.findUnique({
                    where: { id: item.eventId },
                    select: {
                        title: true,
                        eventStart: true
                    }
                });

                return {
                    eventId: item.eventId,
                    eventTitle: event?.title || 'Unknown',
                    eventDate: event?.eventStart,
                    registrationCount: item._count._all,
                    revenue: parseFloat(item._sum.amountPaid || 0)
                };
            })
        );

        // Total revenue
        const totalRevenue = eventsWithRevenue.reduce((sum, e) => sum + e.revenue, 0);

        // Payment method breakdown
        const paymentMethodBreakdown = await prisma.eventRegistration.groupBy({
            by: ['paymentStatus'],
            where: {
                paidAt: { gte: startDate }
            },
            _count: {
                _all: true
            },
            _sum: {
                amountPaid: true
            }
        });

        res.json({
            success: true,
            data: {
                period,
                totalRevenue,
                eventsWithRevenue: eventsWithRevenue.sort((a, b) => b.revenue - a.revenue),
                paymentMethodBreakdown: paymentMethodBreakdown.map(item => ({
                    status: item.paymentStatus,
                    count: item._count._all,
                    amount: parseFloat(item._sum.amountPaid || 0)
                }))
            }
        });

    } catch (error) {
        console.error('Get revenue analytics error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get revenue analytics' }
        });
    }
};

// Get user analytics
exports.getUserAnalytics = async (req, res) => {
    try {
        // User growth over time
        const usersByMonth = await prisma.$queryRaw`
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                COUNT(*) as count
            FROM users
            GROUP BY month
            ORDER BY month DESC
            LIMIT 12
        `;

        // Most active users
        const activeUsers = await prisma.user.findMany({
            select: {
                id: true,
                fullName: true,
                email: true,
                _count: {
                    select: {
                        eventRegistrations: true,
                        teamMemberships: true,
                        submissions: true
                    }
                }
            },
            orderBy: {
                eventRegistrations: {
                    _count: 'desc'
                }
            },
            take: 10
        });

        const activeUsersWithStats = activeUsers.map(user => ({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            eventsParticipated: user._count.eventRegistrations,
            teamsJoined: user._count.teamMemberships,
            submissionsMade: user._count.submissions
        }));

        res.json({
            success: true,
            data: {
                userGrowth: usersByMonth,
                activeUsers: activeUsersWithStats
            }
        });

    } catch (error) {
        console.error('Get user analytics error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get user analytics' }
        });
    }
};

// Get category-wise stats
exports.getCategoryStats = async (req, res) => {
    try {
        const categories = await prisma.eventCategory.findMany({
            include: {
                _count: {
                    select: {
                        events: true
                    }
                }
            }
        });

        const categoryStats = await Promise.all(
            categories.map(async (category) => {
                const events = await prisma.event.findMany({
                    where: { categoryId: category.id },
                    select: { id: true }
                });

                const eventIds = events.map(e => e.id);

                const [registrations, revenue] = await Promise.all([
                    prisma.eventRegistration.count({
                        where: {
                            eventId: { in: eventIds }
                        }
                    }),
                    prisma.eventRegistration.aggregate({
                        where: {
                            eventId: { in: eventIds },
                            paymentStatus: 'completed'
                        },
                        _sum: {
                            amountPaid: true
                        }
                    })
                ]);

                return {
                    categoryId: category.id,
                    categoryName: category.name,
                    eventCount: category._count.events,
                    totalRegistrations: registrations,
                    totalRevenue: parseFloat(revenue._sum.amountPaid || 0)
                };
            })
        );

        res.json({
            success: true,
            data: {
                categoryStats: categoryStats.sort((a, b) => b.eventCount - a.eventCount)
            }
        });

    } catch (error) {
        console.error('Get category stats error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get category stats' }
        });
    }
};

// Export analytics
exports.exportAnalytics = async (req, res) => {
    try {
        const { type = 'events' } = req.query; // events, users, revenue

        if (type === 'events') {
            const events = await prisma.event.findMany({
                include: {
                    category: {
                        select: { name: true }
                    },
                    _count: {
                        select: {
                            registrations: true,
                            teams: true,
                            submissions: true
                        }
                    }
                },
                orderBy: {
                    eventStart: 'desc'
                }
            });

            const eventsWithRevenue = await Promise.all(
                events.map(async (event) => {
                    const revenue = await prisma.eventRegistration.aggregate({
                        where: {
                            eventId: event.id,
                            paymentStatus: 'completed'
                        },
                        _sum: {
                            amountPaid: true
                        }
                    });

                    return [
                        event.title,
                        event.category.name,
                        event.eventStart.toISOString().split('T')[0],
                        event.status,
                        event._count.registrations,
                        event._count.teams,
                        event._count.submissions,
                        parseFloat(revenue._sum.amountPaid || 0)
                    ];
                })
            );

            const headers = ['Event', 'Category', 'Date', 'Status', 'Participants', 'Teams', 'Submissions', 'Revenue'];
            const csv = [
                headers.join(','),
                ...eventsWithRevenue.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');

            res.header('Content-Type', 'text/csv');
            res.attachment('event-analytics.csv');
            res.send(csv);
        } else {
            res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Invalid export type' }
            });
        }

    } catch (error) {
        console.error('Export analytics error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to export analytics' }
        });
    }
};
