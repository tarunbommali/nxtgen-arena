import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus, Search, Edit, Trash2, Eye, Calendar, MapPin,
    Users, Award, Filter, X
} from 'lucide-react';
import eventsData from '../../data/events.json';
import EventForm from './events/EventForm';

export default function EventManagement() {
    const [events, setEvents] = useState(eventsData);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isCreating, setIsCreating] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = (eventId) => {
        if (confirm('Are you sure you want to delete this event?')) {
            setEvents(events.filter(e => e.id !== eventId));
            // TODO: Call API to delete
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'upcoming': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'completed': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Event Management</h2>
                    <p className="text-sm text-muted-foreground">{filteredEvents.length} events total</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create Event
                </button>
            </div>

            {/* Search and Filters */}
            <div className="glass-card rounded-xl p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'active', 'upcoming', 'completed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors capitalize ${filterStatus === status
                                    ? 'bg-primary text-white'
                                    : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredEvents.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-card rounded-xl p-6 hover:bg-white/5 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold mb-2">{event.name}</h3>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)} capitalize`}>
                                        {event.status}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 capitalize">
                                        {event.type}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(event.eventStartDate).toLocaleDateString()} - {new Date(event.eventEndDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span>{event.totalParticipants} participants</span>
                            </div>
                            {event.prizes && event.prizes.length > 0 && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Award className="w-4 h-4" />
                                    <span>{event.prizes[0]}</span>
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        {event.tags && event.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {event.tags.slice(0, 3).map((tag, i) => (
                                    <span key={i} className="px-2 py-1 bg-muted text-xs rounded">
                                        {tag}
                                    </span>
                                ))}
                                {event.tags.length > 3 && (
                                    <span className="px-2 py-1 text-xs text-muted-foreground">
                                        +{event.tags.length - 3} more
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t border-border">
                            <button
                                onClick={() => setEditingEvent(event)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </button>
                            <button
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                                View
                            </button>
                            <button
                                onClick={() => handleDelete(event.id)}
                                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No events found</p>
                </div>
            )}

            {/* Create/Edit Modal */}
            {(isCreating || editingEvent) && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-6 shrink-0">
                            <h3 className="text-2xl font-bold">
                                {isCreating ? 'Create New Event' : 'Edit Event'}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsCreating(false);
                                    setEditingEvent(null);
                                }}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <EventForm
                                initialData={editingEvent}
                                onSubmit={(formData) => {
                                    if (isCreating) {
                                        setEvents([...events, { ...formData, id: Date.now().toString() }]);
                                    } else {
                                        setEvents(events.map(e => e.id === editingEvent.id ? { ...formData, id: e.id } : e));
                                    }
                                    setIsCreating(false);
                                    setEditingEvent(null);
                                }}
                                onCancel={() => {
                                    setIsCreating(false);
                                    setEditingEvent(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
