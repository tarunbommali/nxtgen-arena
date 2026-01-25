import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Rocket, CheckCircle, Calendar, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import StatCard from './shared/StatCard';
import TabNavigation from './shared/TabNavigation';
import eventsData from '../data/events.json';

export default function UserDashboard() {
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('my-initiatives');

    // Mock user statistics (in production, fetch from Firebase)
    const stats = {
        activeInitiatives: eventsData.filter(e => e.status === 'active').length,
        submitted: 5,
        completed: userData?.completedDays?.length || 3,
        upcoming: eventsData.filter(e => e.status === 'upcoming').length
    };

    // User's initiatives (registered events)
    const myInitiatives = eventsData.slice(0, 3); // Mock: first 3 events
    const recommendedInitiatives = eventsData.filter(e => e.status !== 'completed');

    const tabs = [
        { id: 'my-initiatives', label: 'My Initiatives', count: myInitiatives.length },
        { id: 'recommended', label: 'Recommended Initiatives', count: recommendedInitiatives.length },
        { id: 'applications', label: 'My Applications', count: stats.submitted }
    ];

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { color: 'bg-green-500/10 text-green-500', label: 'Active' },
            upcoming: { color: 'bg-blue-500/10 text-blue-500', label: 'Upcoming' },
            completed: { color: 'bg-gray-500/10 text-gray-500', label: 'Completed' },
            open: { color: 'bg-green-500/10 text-green-500', label: 'Registration' }
        };
        const config = statusConfig[status] || statusConfig.open;
        return (
            <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
                {config.label}
            </span>
        );
    };

    const renderInitiativesTable = (initiatives) => (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border">
                        <th className="text-left py-4 px-4 font-medium text-muted-foreground">Initiative Name</th>
                        <th className="text-left py-4 px-4 font-medium text-muted-foreground">Tags</th>
                        <th className="text-left py-4 px-4 font-medium text-muted-foreground">Ongoing Round</th>
                        <th className="text-left py-4 px-4 font-medium text-muted-foreground">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {initiatives.map((event, index) => (
                        <motion.tr
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b border-border/50 hover:bg-white/5 transition-colors"
                        >
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Rocket className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{event.name}</p>
                                        <p className="text-sm text-muted-foreground">{event.organizer}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex gap-2 flex-wrap">
                                    {event.tags.map((tag, i) => (
                                        <span key={i} className="px-2 py-1 text-xs rounded bg-muted">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                {getStatusBadge(event.rounds[0]?.status || event.registrationStatus)}
                            </td>
                            <td className="py-4 px-4">
                                <button
                                    onClick={() => navigate(`/events/${event.id}`)}
                                    className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors"
                                >
                                    DASHBOARD
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
            {initiatives.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No initiatives found. Explore recommended initiatives to get started!
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section with User Profile */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-8 mb-8 relative overflow-hidden"
                >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 opacity-50" />

                    <div className="relative z-10 flex items-start gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-3xl font-bold">
                            {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">
                                {currentUser?.displayName || 'Student'}
                            </h1>
                            <p className="text-muted-foreground mb-3">{currentUser?.email}</p>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium">
                                    Level {userData?.currentDay ? Math.floor(userData.currentDay / 5) + 1 : 1}
                                </span>
                                <span className="px-3 py-1  bg-blue-500/10 text-blue-500 rounded-full text-sm font-medium">
                                    INNOVATOR
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={Rocket}
                        label="Active Initiatives"
                        value={stats.activeInitiatives}
                        color="primary"
                    />
                    <StatCard
                        icon={Calendar}
                        label="Submitted"
                        value={stats.submitted}
                        color="info"
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="Completed"
                        value={stats.completed}
                        color="success"
                    />
                    <StatCard
                        icon={Trophy}
                        label="Upcoming Events"
                        value={stats.upcoming}
                        color="warning"
                    />
                </div>

                {/* Initiatives Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">My Initiatives</h2>
                            <p className="text-muted-foreground text-sm">
                                Access a comprehensive listing of all initiatives you have registered for and participated.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/events')}
                            className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                            View All →
                        </button>
                    </div>

                    <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="mb-6" />

                    {activeTab === 'my-initiatives' && renderInitiativesTable(myInitiatives)}
                    {activeTab === 'recommended' && renderInitiativesTable(recommendedInitiatives)}
                    {activeTab === 'applications' && (
                        <div className="text-center py-12 text-muted-foreground">
                            You have {stats.submitted} submitted applications. Check your email for updates.
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
