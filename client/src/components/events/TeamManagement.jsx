import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Trash2, CheckCircle, XCircle, AlertCircle, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TeamManagement({ eventId, event }) {
    const { currentUser } = useAuth();
    const [team, setTeam] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('requests-received');
    const [loading, setLoading] = useState(true);
    const [isLeader, setIsLeader] = useState(false);

    useEffect(() => {
        fetchTeamData();
    }, [eventId, currentUser]);

    const fetchTeamData = async () => {
        setLoading(true);
        try {
            // Fetch user's team for this event
            const teamRes = await fetch(`/api/teams/my-team/${eventId}`, {
                headers: { 'Authorization': `Bearer ${currentUser.token}` }
            });

            if (teamRes.ok) {
                const teamData = await teamRes.json();
                setTeam(teamData);
                setIsLeader(teamData.teamLeaderId === currentUser.uid);

                // Fetch team members
                const membersRes = await fetch(`/api/teams/${teamData.id}/members`);
                const membersData = await membersRes.json();
                setTeamMembers(membersData);

                // Fetch requests if leader
                if (teamData.teamLeaderId === currentUser.uid) {
                    const requestsRes = await fetch(`/api/teams/${teamData.id}/join-requests`);
                    const requestsData = await requestsRes.json();
                    setReceivedRequests(requestsData.filter(r => r.requestType === 'sent' && r.status === 'pending'));
                    setSentRequests(requestsData.filter(r => r.requestType === 'received' && r.status === 'pending'));
                }
            }
        } catch (error) {
            console.error('Error fetching team data:', error);
        }
        setLoading(false);
    };

    const handleRespondRequest = async (requestId, action) => {
        try {
            const res = await fetch(`/api/teams/respond-request/${requestId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                },
                body: JSON.stringify({ action }) // 'accept' or 'reject'
            });

            if (res.ok) {
                fetchTeamData(); // Refresh data
            }
        } catch (error) {
            console.error('Error responding to request:', error);
        }
    };

    const handleDeleteTeam = async () => {
        if (!confirm('Once you delete the team, there is no going back. Please be certain!')) {
            return;
        }

        try {
            const res = await fetch(`/api/teams/${team.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${currentUser.token}` }
            });

            if (res.ok) {
                alert('Team deleted successfully');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error deleting team:', error);
        }
    };

    const isTeamFormationEnded = event.teamFormationDeadline && new Date() > new Date(event.teamFormationDeadline);

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    if (!team) {
        return (
            <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">You are not part of any team yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold mb-2">Team Management</h2>
                <p className="text-muted-foreground">
                    Build your dream team! Onboard like-minded individuals and pave your path to success with efficient team management tools
                </p>
            </div>

            {/* Team Formation Status */}
            {isTeamFormationEnded && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3"
                >
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                        <p className="font-medium text-yellow-500">Team formation round has ended.</p>
                        <p className="text-sm text-muted-foreground mt-1">No further actions can be performed.</p>
                    </div>
                </motion.div>
            )}

            {/* Team Members */}
            <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Team Members</h3>
                <div className="space-y-3">
                    {teamMembers.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {member.user.fullName}
                                        {member.isLeader && (
                                            <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                                                Leader
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{member.user.email}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {isLeader && !isTeamFormationEnded && teamMembers.length < event.minTeamSize && (
                    <p className="text-sm text-yellow-500 mt-4">
                        ⚠️ Your team needs at least {event.minTeamSize} members to be complete
                    </p>
                )}
            </div>

            {/* Request Management (Only for Team Leader) */}
            {isLeader && (
                <div className="glass-card rounded-xl p-6">
                    {/* Tab Navigation */}
                    <div className="flex gap-2 mb-6 border-b border-white/10">
                        <button
                            onClick={() => setActiveTab('requests-received')}
                            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'requests-received'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Manage Requests Received
                            {receivedRequests.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                                    {receivedRequests.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('requests-sent')}
                            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'requests-sent'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Manage Requests Sent
                            {sentRequests.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                                    {sentRequests.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Requests Received Tab */}
                    {activeTab === 'requests-received' && (
                        <div>
                            {receivedRequests.length === 0 ? (
                                <p className="text-center py-8 text-muted-foreground">
                                    No pending join requests
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {receivedRequests.map((request) => (
                                        <motion.div
                                            key={request.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                                        >
                                            <div>
                                                <p className="font-medium">{request.user.fullName}</p>
                                                <p className="text-sm text-muted-foreground">{request.user.email}</p>
                                                {request.message && (
                                                    <p className="text-sm text-muted-foreground mt-1 italic">
                                                        "{request.message}"
                                                    </p>
                                                )}
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRespondRequest(request.id, 'accept')}
                                                    disabled={isTeamFormationEnded}
                                                    className="px-4 py-2 bg-green-500/20 text-green-500 hover:bg-green-500/30 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleRespondRequest(request.id, 'reject')}
                                                    disabled={isTeamFormationEnded}
                                                    className="px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Requests Sent Tab */}
                    {activeTab === 'requests-sent' && (
                        <div>
                            {sentRequests.length === 0 ? (
                                <p className="text-center py-8 text-muted-foreground">
                                    No pending invitations sent
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {sentRequests.map((request) => (
                                        <motion.div
                                            key={request.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                                        >
                                            <div>
                                                <p className="font-medium">{request.user.fullName}</p>
                                                <p className="text-sm text-muted-foreground">{request.user.email}</p>
                                                <p className="text-xs text-yellow-500 mt-1">Pending</p>
                                            </div>
                                            <button
                                                onClick={() => handleRespondRequest(request.id, 'cancel')}
                                                disabled={isTeamFormationEnded}
                                                className="px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Cancel
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Delete Team (Only for Leader, before deadline) */}
            {isLeader && !isTeamFormationEnded && (
                <div className="glass-card rounded-xl p-6 border border-red-500/20">
                    <h3 className="text-lg font-bold text-red-500 mb-2">Delete This Team</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Once you delete the team, there is no going back. Please be certain!
                    </p>
                    <button
                        onClick={handleDeleteTeam}
                        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Team
                    </button>
                </div>
            )}

            {/* Reminder */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-400">
                    <strong>Reminder:</strong> Make sure the members you invite are not already part of another team.
                    They will not be able to accept your invitation if they are.
                </p>
            </div>
        </div>
    );
}
