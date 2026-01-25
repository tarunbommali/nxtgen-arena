const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// All team routes require authentication
router.use(authenticateToken);

// Create team
router.post('/create', teamController.createTeam);

// Invite user to team (team leader only)
router.post('/:teamId/invite', teamController.inviteUser);

// Request to join team
router.post('/:teamId/request-join', teamController.requestJoin);

// Respond to team request (accept/reject)
router.patch('/:teamId/respond-request', teamController.respondToRequest);

// Get team details
router.get('/:teamId', teamController.getTeamDetails);

// Get team requests (received and sent)
router.get('/:teamId/requests', teamController.getTeamRequests);

// Delete team (leader only)
router.delete('/:teamId', teamController.deleteTeam);

// Leave team (members only, not leader)
router.post('/:teamId/leave', teamController.leaveTeam);

module.exports = router;
