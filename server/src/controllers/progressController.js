const UserProgress = require('../models/userProgressModel');

// Roadmap Progress
exports.saveRoadmapProgress = async (req, res) => {
    try {
        const { roadmapId, completedItems } = req.body;
        await UserProgress.saveRoadmapProgress(req.user.id, roadmapId, completedItems);
        res.json({ success: true, message: 'Progress saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getRoadmapProgress = async (req, res) => {
    try {
        const progress = await UserProgress.getRoadmapProgress(req.user.id, req.params.roadmapId);
        res.json({ success: true, data: progress });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getAllRoadmapProgress = async (req, res) => {
    try {
        const progress = await UserProgress.getAllUserRoadmapProgress(req.user.id);
        res.json({ success: true, data: progress });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// DSA Progress
exports.toggleProblemSolved = async (req, res) => {
    try {
        const { problemId, isSolved } = req.body;
        await UserProgress.toggleProblemSolved(req.user.id, problemId, isSolved);
        res.json({ success: true, message: 'Problem status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getDSAProgress = async (req, res) => {
    try {
        const progress = await UserProgress.getDSAProgress(req.user.id);
        res.json({ success: true, data: progress });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getDSAStats = async (req, res) => {
    try {
        const stats = await UserProgress.getDSAStats(req.user.id);
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Event Registration
exports.registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        await UserProgress.registerForEvent(req.user.id, eventId);
        res.json({ success: true, message: 'Successfully registered for event' });
    } catch (error) {
        if (error.message === 'Already registered for this event') {
            return res.status(400).json({ success: false, message: error.message });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getUserEvents = async (req, res) => {
    try {
        const events = await UserProgress.getUserEvents(req.user.id);
        res.json({ success: true, data: events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.checkEventRegistration = async (req, res) => {
    try {
        const isRegistered = await UserProgress.isRegisteredForEvent(req.user.id, req.params.eventId);
        res.json({ success: true, data: { isRegistered } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
