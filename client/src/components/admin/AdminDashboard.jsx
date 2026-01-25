import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, Map, Code, Users, Plus, BarChart3, Settings,
    Trophy, BookOpen, Target, TrendingUp
} from 'lucide-react';
import AppLayout from '../shared/AppLayout';
import EventManagement from './EventManagement';
import RoadmapManagement from './RoadmapManagement';
import DSAManagement from './DSAManagement';
import RegistrationManagement from './RegistrationManagement';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');

    // Mock statistics - replace with actual API data
    const stats = {
        totalEvents: 6,
        activeEvents: 3,
        totalRegistrations: 342,
        pendingApprovals: 28,
        totalRoadmaps: 3,
        totalDSAProblems: 22,
        totalUsers: 1247,
        monthlyGrowth: 23
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'registrations', label: 'Registrations', icon: Users },
        { id: 'roadmaps', label: 'Roadmaps', icon: Map },
        { id: 'dsa', label: 'DSA Problems', icon: Code },
    ];

    return (
        <AppLayout>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage platform content and user registrations</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/30 rounded-full text-sm font-medium">
                        Admin Access
                    </span>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="glass-card rounded-2xl p-1 mb-6 inline-flex gap-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div>
                {activeTab === 'overview' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Statistics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="glass-card rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <span className="text-xs text-muted-foreground">Total</span>
                                </div>
                                <div className="text-3xl font-bold mb-1">{stats.totalEvents}</div>
                                <div className="text-sm text-muted-foreground">Events</div>
                                <div className="text-xs text-green-500 mt-2">{stats.activeEvents} active</div>
                            </div>

                            <div className="glass-card rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-green-500" />
                                    </div>
                                    <span className="text-xs text-muted-foreground">Total</span>
                                </div>
                                <div className="text-3xl font-bold mb-1">{stats.totalRegistrations}</div>
                                <div className="text-sm text-muted-foreground">Registrations</div>
                                <div className="text-xs text-yellow-500 mt-2">{stats.pendingApprovals} pending</div>
                            </div>

                            <div className="glass-card rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                                        <Map className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <span className="text-xs text-muted-foreground">Total</span>
                                </div>
                                <div className="text-3xl font-bold mb-1">{stats.totalRoadmaps}</div>
                                <div className="text-sm text-muted-foreground">Roadmaps</div>
                                <div className="text-xs text-primary mt-2">All published</div>
                            </div>

                            <div className="glass-card rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                                        <Code className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <span className="text-xs text-muted-foreground">Total</span>
                                </div>
                                <div className="text-3xl font-bold mb-1">{stats.totalDSAProblems}</div>
                                <div className="text-sm text-muted-foreground">DSA Problems</div>
                                <div className="text-xs text-primary mt-2">6 categories</div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="glass-card rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <button
                                    onClick={() => setActiveTab('events')}
                                    className="p-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all text-left group"
                                >
                                    <Plus className="w-6 h-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                                    <div className="font-semibold">Create Event</div>
                                    <div className="text-xs text-muted-foreground mt-1">Add new hackathon or contest</div>
                                </button>

                                <button
                                    onClick={() => setActiveTab('registrations')}
                                    className="p-4 rounded-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition-all text-left group"
                                >
                                    <Users className="w-6 h-6 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                                    <div className="font-semibold">Review Applications</div>
                                    <div className="text-xs text-muted-foreground mt-1">{stats.pendingApprovals} waiting approval</div>
                                </button>

                                <button
                                    onClick={() => setActiveTab('roadmaps')}
                                    className="p-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all text-left group"
                                >
                                    <Map className="w-6 h-6 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                                    <div className="font-semibold">Manage Roadmaps</div>
                                    <div className="text-xs text-muted-foreground mt-1">Update learning paths</div>
                                </button>

                                <button
                                    onClick={() => setActiveTab('dsa')}
                                    className="p-4 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 transition-all text-left group"
                                >
                                    <Code className="w-6 h-6 text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                                    <div className="font-semibold">Add DSA Problem</div>
                                    <div className="text-xs text-muted-foreground mt-1">Expand problem set</div>
                                </button>
                            </div>
                        </div>

                        {/* Platform Statistics */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="glass-card rounded-2xl p-6">
                                <h2 className="text-xl font-bold mb-4">Platform Growth</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Total Users</span>
                                        <span className="font-bold">{stats.totalUsers}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Monthly Growth</span>
                                        <span className="font-bold text-green-500">+{stats.monthlyGrowth}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Active This Week</span>
                                        <span className="font-bold">847</span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card rounded-2xl p-6">
                                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-muted-foreground">New registration for AI Challenge</span>
                                        <span className="text-xs ml-auto">2m ago</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span className="text-muted-foreground">Event "Spring Hackathon" published</span>
                                        <span className="text-xs ml-auto">1h ago</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                        <span className="text-muted-foreground">DSA problem added to Arrays</span>
                                        <span className="text-xs ml-auto">3h ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'events' && <EventManagement />}
                {activeTab === 'registrations' && <RegistrationManagement />}
                {activeTab === 'roadmaps' && <RoadmapManagement />}
                {activeTab === 'dsa' && <DSAManagement />}
            </div>
        </AppLayout>
    );
}
