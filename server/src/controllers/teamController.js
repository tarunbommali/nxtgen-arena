const prisma = require('../utils/prismaClient');

// Create Team
exports.createTeam = async (req, res) => {
    try {
        const { eventId, teamName } = req.body;
        const userId = req.user.id;

        // Validate event exists and is a team event
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Event not found' }
            });
        }

        if (!event.isTeamEvent) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'This is not a team event' }
            });
        }

        // Check if registration is still open
        if (new Date() > event.registrationEnd) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Registration has closed' }
            });
        }

        // Check if user already has a team for this event
        const existingTeamMember = await prisma.teamMember.findFirst({
            where: {
                userId,
                team: { eventId }
            },
            include: { team: true }
        });

        if (existingTeamMember) {
            return res.status(409).json({
                success: false,
                error: {
                    code: 'CONFLICT',
                    message: 'You are already part of a team for this event',
                    details: { teamName: existingTeamMember.team.teamName }
                }
            });
        }

        // Check team name uniqueness for this event
        const existingTeam = await prisma.team.findFirst({
            where: {
                eventId,
                teamName
            }
        });

        if (existingTeam) {
            return res.status(409).json({
                success: false,
                error: { code: 'CONFLICT', message: 'Team name already taken for this event' }
            });
        }

        // Create team with leader as first member
        const team = await prisma.team.create({
            data: {
                eventId,
                teamName,
                teamLeaderId: userId,
                members: {
                    create: {
                        userId,
                        isLeader: true
                    }
                }
            },
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
                },
                event: {
                    select: {
                        id: true,
                        title: true,
                        minTeamSize: true,
                        maxTeamSize: true,
                        teamFormationDeadline: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            data: { team }
        });

    } catch (error) {
        console.error('Create team error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to create team' }
        });
    }
};

// Invite user to team
exports.inviteUser = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { userId: targetUserId, message } = req.body;
        const currentUserId = req.user.id;

        // Get team with event details
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: {
                event: true,
                members: true,
                joinRequests: true
            }
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Team not found' }
            });
        }

        // Check if current user is team leader
        if (team.teamLeaderId !== currentUserId) {
            return res.status(403).json({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Only team leader can invite members' }
            });
        }

        // Check if team is locked
        if (team.isLocked) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Team is locked, cannot add members' }
            });
        }

        // Check team formation deadline
        if (team.event.teamFormationDeadline && new Date() > team.event.teamFormationDeadline) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Team formation deadline has passed' }
            });
        }

        // Check if team is full
        if (team.members.length >= team.event.maxTeamSize) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Team is full' }
            });
        }

        // Check if target user exists
        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId }
        });

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'User not found' }
            });
        }

        // Check if target user is already in a team for this event
        const existingMembership = await prisma.teamMember.findFirst({
            where: {
                userId: targetUserId,
                team: { eventId: team.eventId }
            }
        });

        if (existingMembership) {
            return res.status(409).json({
                success: false,
                error: { code: 'CONFLICT', message: 'User is already in a team for this event' }
            });
        }

        // Check if request already exists
        const existingRequest = await prisma.teamJoinRequest.findFirst({
            where: {
                teamId,
                userId: targetUserId,
                status: 'pending'
            }
        });

        if (existingRequest) {
            return res.status(409).json({
                success: false,
                error: { code: 'CONFLICT', message: 'Invitation already sent to this user' }
            });
        }

        // Create invitation request
        const request = await prisma.teamJoinRequest.create({
            data: {
                teamId,
                userId: targetUserId,
                requestType: 'received', // User receives invitation from team
                status: 'pending',
                message
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });

        // TODO: Send notification/email to target user

        res.status(201).json({
            success: true,
            data: { request }
        });

    } catch (error) {
        console.error('Invite user error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to send invitation' }
        });
    }
};

// Request to join team
exports.requestJoin = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { message } = req.body;
        const userId = req.user.id;

        // Get team with event details
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: {
                event: true,
                members: true
            }
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Team not found' }
            });
        }

        // Check if team is locked
        if (team.isLocked) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Team is locked' }
            });
        }

        // Check team formation deadline
        if (team.event.teamFormationDeadline && new Date() > team.event.teamFormationDeadline) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Team formation deadline has passed' }
            });
        }

        // Check if team is full
        if (team.members.length >= team.event.maxTeamSize) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Team is full' }
            });
        }

        // Check if user is already in a team for this event
        const existingMembership = await prisma.teamMember.findFirst({
            where: {
                userId,
                team: { eventId: team.eventId }
            }
        });

        if (existingMembership) {
            return res.status(409).json({
                success: false,
                error: { code: 'CONFLICT', message: 'You are already in a team for this event' }
            });
        }

        // Check if request already exists
        const existingRequest = await prisma.teamJoinRequest.findFirst({
            where: {
                teamId,
                userId,
                status: 'pending'
            }
        });

        if (existingRequest) {
            return res.status(409).json({
                success: false,
                error: { code: 'CONFLICT', message: 'You have already sent a request to this team' }
            });
        }

        // Create join request
        const request = await prisma.teamJoinRequest.create({
            data: {
                teamId,
                userId,
                requestType: 'sent', // User sends request to team
                status: 'pending',
                message
            }
        });

        // TODO: Send notification to team leader

        res.status(201).json({
            success: true,
            data: { request }
        });

    } catch (error) {
        console.error('Request join error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to send join request' }
        });
    }
};

// Respond to team request (accept/reject)
exports.respondToRequest = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { requestId, action, responseMessage } = req.body;
        const userId = req.user.id;

        if (!['accept', 'reject'].includes(action)) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Action must be accept or reject' }
            });
        }

        // Get team
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: {
                event: true,
                members: true
            }
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Team not found' }
            });
        }

        // Get request
        const request = await prisma.teamJoinRequest.findUnique({
            where: { id: requestId }
        });

        if (!request || request.teamId !== teamId) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Request not found' }
            });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Request has already been processed' }
            });
        }

        // Check permissions based on request type
        if (request.requestType === 'sent') {
            // User sent request to join - team leader responds
            if (team.teamLeaderId !== userId) {
                return res.status(403).json({
                    success: false,
                    error: { code: 'FORBIDDEN', message: 'Only team leader can respond to join requests' }
                });
            }
        } else {
            // Team invited user - user responds
            if (request.userId !== userId) {
                return res.status(403).json({
                    success: false,
                    error: { code: 'FORBIDDEN', message: 'You can only respond to your own invitations' }
                });
            }
        }

        let teamMember = null;

        if (action === 'accept') {
            // Check if team is full
            if (team.members.length >= team.event.maxTeamSize) {
                return res.status(400).json({
                    success: false,
                    error: { code: 'VALIDATION_ERROR', message: 'Team is full' }
                });
            }

            // Add user to team
            teamMember = await prisma.teamMember.create({
                data: {
                    teamId,
                    userId: request.userId,
                    isLeader: false
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true
                        }
                    }
                }
            });

            // Check if team is now complete
            const memberCount = team.members.length + 1;
            if (memberCount >= team.event.minTeamSize && !team.isComplete) {
                await prisma.team.update({
                    where: { id: teamId },
                    data: { isComplete: true }
                });
            }
        }

        // Update request status
        const updatedRequest = await prisma.teamJoinRequest.update({
            where: { id: requestId },
            data: {
                status: action === 'accept' ? 'accepted' : 'rejected',
                responseMessage,
                respondedAt: new Date()
            }
        });

        // TODO: Send notification to user

        res.json({
            success: true,
            data: {
                request: updatedRequest,
                ...(teamMember && { teamMember })
            }
        });

    } catch (error) {
        console.error('Respond to request error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to respond to request' }
        });
    }
};

// Get team details
exports.getTeamDetails = async (req, res) => {
    try {
        const { teamId } = req.params;
        const userId = req.user.id;

        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        minTeamSize: true,
                        maxTeamSize: true,
                        teamFormationDeadline: true,
                        isTeamEvent: true
                    }
                },
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
                                profilePicture: true
                            }
                        }
                    },
                    orderBy: {
                        joinedAt: 'asc'
                    }
                },
                registrations: {
                    select: {
                        id: true,
                        status: true,
                        paymentStatus: true
                    }
                }
            }
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Team not found' }
            });
        }

        // Check if user is part of the team
        const isMember = team.members.some(m => m.userId === userId);
        if (!isMember) {
            return res.status(403).json({
                success: false,
                error: { code: 'FORBIDDEN', message: 'You are not a member of this team' }
            });
        }

        const response = {
            ...team,
            memberCount: team.members.length,
            isRegistered: team.registrations.length > 0
        };

        res.json({
            success: true,
            data: { team: response }
        });

    } catch (error) {
        console.error('Get team details error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get team details' }
        });
    }
};

// Get team requests
exports.getTeamRequests = async (req, res) => {
    try {
        const { teamId } = req.params;
        const userId = req.user.id;

        const team = await prisma.team.findUnique({
            where: { id: teamId }
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Team not found' }
            });
        }

        // Only team leader can view all requests
        if (team.teamLeaderId !== userId) {
            return res.status(403).json({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Only team leader can view team requests' }
            });
        }

        const requests = await prisma.teamJoinRequest.findMany({
            where: { teamId },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        profilePicture: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Separate by type
        const received = requests.filter(r => r.requestType === 'sent'); // Users requesting to join
        const sent = requests.filter(r => r.requestType === 'received'); // Team invitations

        res.json({
            success: true,
            data: { received, sent }
        });

    } catch (error) {
        console.error('Get team requests error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get team requests' }
        });
    }
};

// Delete team
exports.deleteTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const userId = req.user.id;

        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: {
                event: true,
                registrations: true
            }
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Team not found' }
            });
        }

        // Only team leader can delete
        if (team.teamLeaderId !== userId) {
            return res.status(403).json({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Only team leader can delete the team' }
            });
        }

        // Cannot delete if already registered
        if (team.registrations.length > 0) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Cannot delete registered team' }
            });
        }

        // Check team formation deadline
        if (team.event.teamFormationDeadline && new Date() > team.event.teamFormationDeadline) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Cannot delete team after formation deadline' }
            });
        }

        // Delete team (cascade will delete members and requests)
        await prisma.team.delete({
            where: { id: teamId }
        });

        res.json({
            success: true,
            message: 'Team deleted successfully'
        });

    } catch (error) {
        console.error('Delete team error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to delete team' }
        });
    }
};

// Leave team
exports.leaveTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const userId = req.user.id;

        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: {
                members: true,
                registrations: true
            }
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Team not found' }
            });
        }

        // Check if user is a member
        const member = team.members.find(m => m.userId === userId);
        if (!member) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'You are not a member of this team' }
            });
        }

        // Cannot leave if you're the leader
        if (member.isLeader) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Team leader cannot leave. Delete the team instead.' }
            });
        }

        // Cannot leave if team is registered
        if (team.registrations.length > 0) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Cannot leave a registered team' }
            });
        }

        // Remove user from team
        await prisma.teamMember.delete({
            where: { id: member.id }
        });

        // Update team completion status if needed
        const remainingMemberCount = team.members.length - 1;
        const event = await prisma.event.findUnique({
            where: { id: team.eventId },
            select: { minTeamSize: true }
        });

        if (remainingMemberCount < event.minTeamSize && team.isComplete) {
            await prisma.team.update({
                where: { id: teamId },
                data: { isComplete: false }
            });
        }

        res.json({
            success: true,
            message: 'Left team successfully'
        });

    } catch (error) {
        console.error('Leave team error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to leave team' }
        });
    }
};

// Get my teams
exports.getMyTeams = async (req, res) => {
    try {
        const userId = req.user.id;

        const memberships = await prisma.teamMember.findMany({
            where: { userId },
            include: {
                team: {
                    include: {
                        event: {
                            select: {
                                id: true,
                                title: true,
                                eventStart: true,
                                status: true
                            }
                        },
                        members: true,
                        registrations: {
                            select: {
                                id: true,
                                status: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                joinedAt: 'desc'
            }
        });

        const teams = memberships.map(m => ({
            id: m.team.id,
            teamName: m.team.teamName,
            event: m.team.event,
            memberCount: m.team.members.length,
            isLeader: m.isLeader,
            isComplete: m.team.isComplete,
            isRegistered: m.team.registrations.length > 0,
            joinedAt: m.joinedAt
        }));

        res.json({
            success: true,
            data: { teams }
        });

    } catch (error) {
        console.error('Get my teams error:', error);
        res.status(500).json({
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Failed to get teams' }
        });
    }
};
