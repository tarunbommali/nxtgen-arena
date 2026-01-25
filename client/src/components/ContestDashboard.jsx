import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Users, Flame, Award, TrendingUp, Target } from 'lucide-react';
import AppLayout from './shared/AppLayout';

export default function ContestDashboard() {
    const { challengeId } = useParams();
    const { userData, currentUser } = useAuth();
    const navigate = useNavigate();

    const [streak, setStreak] = useState(0);
    const [leaderboard, setLeaderboard] = useState([]);
    const [winners, setWinners] = useState([]);
    const [myApplications, setMyApplications] = useState([]);

    // Calculate 30-day streak
    useEffect(() => {
        if (!userData?.completedDays) return;

        const sortedDays = [...userData.completedDays].sort((a, b) => b - a);
        let currentStreak = 0;
        let expectedDay = sortedDays[0];

        for (const day of sortedDays) {
            if (day === expectedDay) {
                currentStreak++;
                expectedDay--;
            } else {
                break;
            }
        }

        setStreak(currentStreak);
    }, [userData]);

    // Mock data - replace with API calls
    useEffect(() => {
        // Fetch leaderboard
        setLeaderboard([
            { rank: 1, name: 'Raj Kumar', score: 2850, streak: 30, avatar: null },
            { rank: 2, name: 'Priya Sharma', score: 2720, streak: 28, avatar: null },
            { rank: 3, name: 'Arjun Patel', score: 2680, streak: 27, avatar: null },
            { rank: 4, name: currentUser?.displayName || 'You', score: 2450, streak: streak, avatar: currentUser?.photoURL },
            { rank: 5, name: 'Neha Singh', score: 2380, streak: 25, avatar: null },
        ]);

        // Fetch winners
        setWinners([
            { position: '1st Place', name: 'Raj Kumar', prize: '₹50,000', event: 'Winter Code Fest 2025' },
            { position: '2nd Place', name: 'Priya Sharma', prize: '₹30,000', event: 'Winter Code Fest 2025' },
            { position: '3rd Place', name: 'Arjun Patel', prize: '₹20,000', event: 'Winter Code Fest 2025' },
        ]);

        // Fetch my applications
        setMyApplications([
            { id: 1, name: 'Spring Hackathon 2026', status: 'approved', appliedOn: '2026-01-15', round: 'Round 2' },
            { id: 2, name: 'AI Challenge March', status: 'pending', appliedOn: '2026-01-20', round: 'Round 1' },
            { id: 3, name: 'Web Dev Contest', status: 'rejected', appliedOn: '2026-01-10', round: 'Round 1' },
        ]);
    }, [currentUser, streak]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <AppLayout>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold mb-2">My Applications</h1>
                <p className="text-muted-foreground">Track your event applications and status</p>
            </motion.div>

            {/* My Applications */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6"
            >
                <h2 className="text-2xl font-bold mb-6">My Applications</h2>

                <div className="space-y-4">
                    {myApplications.map((app, index) => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                            onClick={() => navigate('/events')}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-lg">{app.name}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)} capitalize`}>
                                    {app.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Applied: {app.appliedOn}</span>
                                <span>{app.round}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {myApplications.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No applications yet</p>
                        <button
                            onClick={() => navigate('/events')}
                            className="mt-4 px-6 py-2 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors"
                        >
                            Browse Events
                        </button>
                    </div>
                )}
            </motion.div>
        </AppLayout>
    );
}
