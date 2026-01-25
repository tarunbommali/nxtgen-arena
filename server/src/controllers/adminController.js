const prisma = require('../utils/prismaClient');

// ==================== EVENTS ====================
exports.createEvent = async (req, res) => {
    try {
        const event = await prisma.event.create({ data: req.body });
        res.status(201).json({ success: true, data: event });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await prisma.event.update({
            where: { id: parseInt(req.params.id) },
            data: req.body
        });
        res.json({ success: true, data: event });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await prisma.event.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true, message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.listEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            include: { _count: { select: { registrations: true } } }
        });
        res.json({ success: true, data: events });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Event Registrations
exports.getEventRegistrations = async (req, res) => {
    try {
        const registrations = await prisma.eventRegistration.findMany({
            where: { event_id: parseInt(req.params.id) },
            include: { user: { select: { name: true, email: true, registration_number: true, college: true } } }
        });
        res.json({ success: true, data: registrations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateRegistrationStatus = async (req, res) => {
    try {
        const { status } = req.body; // PENDING, APPROVED, REJECTED
        const registration = await prisma.eventRegistration.update({
            where: { id: parseInt(req.params.regId) },
            data: { status }
        });
        res.json({ success: true, data: registration });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==================== ROADMAPS ====================

// Create Roadmap with full phase structure
exports.createRoadmap = async (req, res) => {
    try {
        // Expecting: { title, description, role_target, phases: [...] }
        const { title, description, role_target, phases } = req.body;

        const roadmap = await prisma.roadmap.create({
            data: {
                title,
                description,
                role_target,
                phases: {
                    create: phases.map(phase => ({
                        order: phase.order,
                        title: phase.title,
                        level: phase.level,
                        duration: phase.duration,
                        description: phase.description,
                        sections: {
                            create: (phase.sections || []).map((section, sIdx) => ({
                                title: section.title,
                                description: section.description,
                                order: sIdx,
                                items: {
                                    create: (section.items || []).map((item, iIdx) => ({
                                        title: item.title,
                                        order: iIdx,
                                        subItems: {
                                            create: (item.subItems || []).map((sub, subIdx) => ({
                                                title: sub.title,
                                                video_url: sub.videoUrl,
                                                duration: sub.duration,
                                                order: subIdx
                                            }))
                                        }
                                    }))
                                }
                            }))
                        },
                        playlists: {
                            create: (phase.playlists || []).map(pl => ({
                                title: pl.title,
                                author: pl.author,
                                video_count: pl.videoCount,
                                url: pl.url,
                                thumbnail: pl.thumbnail
                            }))
                        },
                        projects: {
                            create: (phase.projects || []).map(proj => ({
                                title: proj.title,
                                description: proj.description,
                                tags: proj.tags
                            }))
                        }
                    }))
                }
            },
            include: {
                phases: {
                    include: {
                        sections: { include: { items: { include: { subItems: true } } } },
                        playlists: true,
                        projects: true
                    }
                }
            }
        });

        res.status(201).json({ success: true, data: roadmap });
    } catch (err) {
        console.error('Roadmap creation error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update Roadmap (simplified - can be enhanced for granular updates)
exports.updateRoadmap = async (req, res) => {
    try {
        const { title, description, role_target } = req.body;
        const roadmap = await prisma.roadmap.update({
            where: { id: parseInt(req.params.id) },
            data: { title, description, role_target }
        });
        res.json({ success: true, data: roadmap });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update specific phase
exports.updatePhase = async (req, res) => {
    try {
        const phase = await prisma.roadmapPhase.update({
            where: { id: parseInt(req.params.phaseId) },
            data: req.body
        });
        res.json({ success: true, data: phase });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Add playlist to phase
exports.addPlaylist = async (req, res) => {
    try {
        const playlist = await prisma.phasePlaylist.create({
            data: {
                phase_id: parseInt(req.params.phaseId),
                ...req.body
            }
        });
        res.status(201).json({ success: true, data: playlist });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update playlist
exports.updatePlaylist = async (req, res) => {
    try {
        const playlist = await prisma.phasePlaylist.update({
            where: { id: parseInt(req.params.playlistId) },
            data: req.body
        });
        res.json({ success: true, data: playlist });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete playlist
exports.deletePlaylist = async (req, res) => {
    try {
        await prisma.phasePlaylist.delete({ where: { id: parseInt(req.params.playlistId) } });
        res.json({ success: true, message: 'Playlist deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteRoadmap = async (req, res) => {
    try {
        await prisma.roadmap.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true, message: 'Roadmap deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.listRoadmaps = async (req, res) => {
    try {
        const roadmaps = await prisma.roadmap.findMany({
            include: { _count: { select: { phases: true } } }
        });
        res.json({ success: true, data: roadmaps });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==================== DSA SHEETS ====================

exports.createDSASheet = async (req, res) => {
    try {
        // Expecting: { title, description, level, topics: [...] }
        const { title, description, level, topics } = req.body;

        const sheet = await prisma.dsaSheet.create({
            data: {
                title,
                description,
                level,
                topics: {
                    create: (topics || []).map((topic, tIdx) => ({
                        title: topic.title,
                        order: tIdx,
                        problems: {
                            create: (topic.problems || []).map((problem, pIdx) => ({
                                title: problem.title,
                                description: problem.description,
                                difficulty: problem.difficulty,
                                order: pIdx,
                                solutions: {
                                    create: (problem.solutions || []).map(sol => ({
                                        language: sol.language,
                                        code: sol.code
                                    }))
                                }
                            }))
                        }
                    }))
                }
            },
            include: {
                topics: { include: { problems: { include: { solutions: true } } } }
            }
        });

        res.status(201).json({ success: true, data: sheet });
    } catch (err) {
        console.error('DSA Sheet creation error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateDSASheet = async (req, res) => {
    try {
        const { title, description, level } = req.body;
        const sheet = await prisma.dsaSheet.update({
            where: { id: parseInt(req.params.id) },
            data: { title, description, level }
        });
        res.json({ success: true, data: sheet });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteDSASheet = async (req, res) => {
    try {
        await prisma.dsaSheet.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true, message: 'DSA Sheet deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.listDSASheets = async (req, res) => {
    try {
        const sheets = await prisma.dsaSheet.findMany({
            include: { _count: { select: { topics: true } } }
        });
        res.json({ success: true, data: sheets });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
