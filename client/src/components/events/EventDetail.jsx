import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Users, AlertCircle, ExternalLink, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import AppLayout from '../shared/AppLayout';
import TabNavigation from '../shared/TabNavigation';
import RegistrationModal from './RegistrationModal';
import { eventAPI, userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function EventDetail() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // State
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('roadmap');
    const [registrationStatus, setRegistrationStatus] = useState(null); // null, 'registered', 'pending'
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    useEffect(() => {
        fetchEventDetails();
    }, [eventId]);

    const fetchEventDetails = async () => {
        setLoading(true);
        try {
            // Fetch Event
            const { data } = await eventAPI.getById(eventId);
            if (data.success) {
                setEvent(data.data);
            }

            // Check Registration Status if logged in
            if (currentUser) {
                try {
                    // Optimized: In a real app, getById should return isRegistered flag
                    // For now, we fetch user registrations
                    const { data: regData } = await userAPI.getRegistrations();
                    const isRegistered = regData.data.registrations.some(r => r.eventId === eventId);
                    if (isRegistered) setRegistrationStatus('registered');
                } catch (e) {
                    console.log('Failed to check registration status', e);
                }
            }

        } catch (err) {
            console.error(err);
            setError('Failed to load event details');
        } finally {
            setLoading(false);
        }
    };

    const handleRegistrationSuccess = () => {
        setRegistrationStatus('registered');
        // Refresh API data just in case
        fetchEventDetails();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Event not found</h2>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <button onClick={() => navigate('/events')} className="text-primary hover:underline">
                        ← Back to Events
                    </button>
                </div>
            </div>
        );
    }

    // Dynamic Tabs based on event capabilities
    const tabs = [
        { id: 'roadmap', label: 'Roadmap' },
        { id: 'submissions', label: 'Submissions' },
        { id: 'resources', label: 'Resources' },
    ];

    if (event.isTeamEvent) tabs.push({ id: 'team', label: 'My Team' });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout>
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-muted-foreground mb-6">
                <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Home</button>
                <ChevronRight className="w-4 h-4 mx-2 text-white/20" />
                <button onClick={() => navigate('/events')} className="hover:text-primary transition-colors">Events</button>
                <ChevronRight className="w-4 h-4 mx-2 text-white/20" />
                <span className="text-foreground font-medium truncate">{event.title}</span>
            </nav>

            {/* Event Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-8 mb-6 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10" />

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-6">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium capitalize">
                                    {event.status}
                                </span>
                                <span className="px-3 py-1 bg-white/10 rounded-full text-sm capitalize">
                                    {(event.eventType || 'Unknown').replace('_', ' ')}
                                </span>
                                {event.isPaid && <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-sm font-medium">Paid</span>}
                                {event.isTeamEvent && <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-sm font-medium">Team</span>}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">{event.description}</p>
                        </div>

                        {/* Registration Action */}
                        <div className="flex flex-col gap-3 min-w-[200px]">
                            {registrationStatus === 'registered' ? (
                                <div className="px-6 py-3 bg-green-500/20 text-green-500 rounded-lg font-medium flex items-center justify-center gap-2 border border-green-500/20">
                                    <CheckCircle className="w-5 h-5" />
                                    Registered
                                </div>
                            ) : event.status === 'active' || event.status === 'upcoming' ? (
                                <button
                                    onClick={() => {
                                        if (!currentUser) {
                                            navigate('/login');
                                            // Ideally show auth modal, but login redirect is fine for now
                                            return;
                                        }
                                        setShowRegisterModal(true);
                                    }}
                                    className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-105"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    {event.isPaid ? `Register (₹${event.registrationFee})` : 'Register Now'}
                                </button>
                            ) : (
                                <button disabled className="px-6 py-3 bg-white/5 text-muted-foreground rounded-lg font-medium cursor-not-allowed text-center">
                                    Registration Closed
                                </button>
                            )}

                            {event.registrationDeadline && (
                                <p className="text-xs text-center text-muted-foreground">
                                    Closes: {new Date(event.registrationDeadline).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Event Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Event Starts</p>
                                <p className="font-medium">{formatDate(event.eventStart)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Participants</p>
                                <p className="font-medium">{event.maxParticipants ? `${event.maxParticipants} Max` : 'Unlimited'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Registration Deadline</p>
                                <p className="font-medium">{event.registrationDeadline ? formatDate(event.registrationDeadline) : 'TBA'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tabbed Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6"
            >
                <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="mb-6" />

                {/* Tab Content */}
                <div className="mt-6 min-h-[300px]">
                    {activeTab === 'roadmap' && (
                        <div>
                            <h3 className="text-xl font-bold mb-4">Event Roadmap</h3>
                            <p className="text-muted-foreground">
                                Details about the event schedule and milestones will be displayed here.
                            </p>
                        </div>
                    )}

                    {activeTab === 'submissions' && (
                        <div className="text-center py-12 text-muted-foreground bg-white/5 rounded-xl border border-dashed border-white/10">
                            {registrationStatus === 'registered' ? (
                                <div>
                                    <h4 className="text-lg font-semibold mb-2">Submit Your Project</h4>
                                    <p className="mb-4 text-sm">Upload your project files or add a GitHub link.</p>
                                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm">
                                        Open Submission Form
                                    </button>
                                </div>
                            ) : (
                                <p>Register for the event to access submissions.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'resources' && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Event Resources</h3>
                            {event.prizes && event.prizes.length > 0 && (
                                <div className="glass-card rounded-lg p-4 mb-4 border border-white/5">
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-yellow-500" /> Prizes & Rewards
                                    </h4>
                                    <ul className="space-y-2">
                                        {event.prizes.map((prize, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                                                {prize}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'team' && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>Team management details will be displayed here.</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Registration Modal */}
            <RegistrationModal
                event={event}
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSuccess={handleRegistrationSuccess}
            />
        </AppLayout>
    );
}

