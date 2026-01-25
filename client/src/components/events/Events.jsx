import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, MapPin, Users, Trophy, Loader2 } from 'lucide-react';
import AppLayout from '../shared/AppLayout';
import { eventAPI } from '../../services/api';

export default function Events() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');

    // API State
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEvents();
    }, [filterStatus, filterType]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filterStatus !== 'all') params.status = filterStatus;

            const { data } = await eventAPI.getAll(params);

            if (data.success) {
                setEvents(data.data.events);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load events. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || event.eventType === filterType;
        return matchesSearch && matchesType;
    });

    const eventTypes = ['all', 'hackathon', 'coding_contest', 'workshop', 'ctf'];
    const eventStatuses = ['all', 'active', 'upcoming', 'completed', 'cancelled'];

    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-green-500/10 text-green-500 border-green-500/20',
            upcoming: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            completed: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
            cancelled: 'bg-red-500/10 text-red-500 border-red-500/20'
        };
        return colors[status] || colors.active;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <AppLayout>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold mb-2">Events</h1>
                <p className="text-muted-foreground">
                    Participate in hackathons, workshops, and tech events
                </p>
            </motion.div>

            {/* Search and Filter Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl p-6 mb-8"
            >
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary capitalize text-white"
                        >
                            {eventStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary capitalize text-white"
                        >
                            {eventTypes.map(type => (
                                <option key={type} value={type}>{type.replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-4 text-sm text-muted-foreground">
                    Showing {filteredEvents.length} events
                </div>
            </motion.div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="text-center py-20 text-red-500">
                    {error}
                </div>
            ) : (
                /* Events Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => navigate(`/events/${event.id}`)}
                            className="glass-card rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group hover:border-primary/30"
                        >
                            {/* Status Badge */}
                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)} capitalize`}>
                                    {event.status}
                                </span>
                                <span className="text-xs text-muted-foreground capitalize">
                                    {(event.eventType || 'Unknown').replace('_', ' ')}
                                </span>
                            </div>

                            {/* Event Banner (if enabled)
                            {event.bannerUrl && (
                                <div className="h-32 mb-4 bg-gray-800 rounded-lg overflow-hidden">
                                     <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
                                </div>
                            )} */}

                            {/* Event Title */}
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                {event.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {event.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className={`px-2 py-1 text-xs rounded ${event.isPaid ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                                    {event.isPaid ? 'Paid' : 'Free'}
                                </span>
                                {event.isTeamEvent && (
                                    <span className="px-2 py-1 bg-purple-500/10 text-purple-500 text-xs rounded">Team Event</span>
                                )}
                            </div>

                            {/* Event Details */}
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(event.eventStart)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="w-4 h-4" />
                                    <span>{event.maxParticipants ? `${event.maxParticipants} max` : 'Open seats'}</span>
                                </div>
                            </div>

                            {/* Prizes */}
                            {event.prizes && event.prizes.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-yellow-500">
                                        <Trophy className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            Click for Prizes
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* CTA Button */}
                            <button className="w-full mt-4 px-4 py-2 bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white rounded-lg font-medium transition-colors">
                                View Details
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredEvents.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <Filter className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No events found</h3>
                    <p className="text-muted-foreground">
                        Try adjusting your filters or search term
                    </p>
                </motion.div>
            )}
        </AppLayout>
    );
}
