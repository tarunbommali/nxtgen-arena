import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const ChallengeLeaderboard = ({ completedDays }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/20 rounded-lg">
                    <Trophy className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Challenge Leaderboard</h2>
            </div>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {/* Second Place */}
                <div className="flex flex-col items-center pt-8">
                    <div className="w-16 h-16 bg-gray-400/20 rounded-full flex items-center justify-center mb-3 border-2 border-gray-400/30">
                        <span className="text-2xl font-bold text-gray-400">2</span>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold mb-1">Sarah Johnson</div>
                        <div className="text-sm text-muted-foreground mb-2">28/30 days</div>
                        <div className="flex items-center justify-center gap-1 text-orange-400">
                            <span>🔥</span>
                            <span className="text-sm font-medium">12 day streak</span>
                        </div>
                    </div>
                </div>

                {/* First Place */}
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-3 border-2 border-yellow-500/30 relative">
                        <span className="text-3xl font-bold text-yellow-400">1</span>
                        <div className="absolute -top-2 -right-2 text-2xl">👑</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-lg mb-1">Alex Chen</div>
                        <div className="text-sm text-muted-foreground mb-2">30/30 days</div>
                        <div className="flex items-center justify-center gap-1 text-orange-400">
                            <span>🔥</span>
                            <span className="text-sm font-medium">15 day streak</span>
                        </div>
                    </div>
                </div>

                {/* Third Place */}
                <div className="flex flex-col items-center pt-12">
                    <div className="w-14 h-14 bg-orange-500/20 rounded-full flex items-center justify-center mb-3 border-2 border-orange-500/30">
                        <span className="text-xl font-bold text-orange-400">3</span>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold mb-1">Mike Rodriguez</div>
                        <div className="text-sm text-muted-foreground mb-2">25/30 days</div>
                        <div className="flex items-center justify-center gap-1 text-orange-400">
                            <span>🔥</span>
                            <span className="text-sm font-medium">10 day streak</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rest of Leaderboard */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">All Participants</h3>
                <div className="space-y-3">
                    {[
                        { rank: 1, name: 'Alex Chen', progress: 30, streak: 15, badge: '👑' },
                        { rank: 2, name: 'Sarah Johnson', progress: 28, streak: 12, badge: '🥈' },
                        { rank: 3, name: 'Mike Rodriguez', progress: 25, streak: 10, badge: '🥉' },
                        { rank: 4, name: 'Emily Davis', progress: 23, streak: 8, badge: '' },
                        { rank: 5, name: 'You', progress: completedDays.size, streak: 5, badge: '' },
                        { rank: 6, name: 'David Kim', progress: 20, streak: 7, badge: '' },
                        { rank: 7, name: 'Lisa Wang', progress: 18, streak: 6, badge: '' },
                        { rank: 8, name: 'James Brown', progress: 15, streak: 4, badge: '' },
                        { rank: 9, name: 'Maria Garcia', progress: 12, streak: 3, badge: '' },
                        { rank: 10, name: 'Tom Wilson', progress: 10, streak: 2, badge: '' },
                    ].map((user, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center justify-between p-4 rounded-lg transition-all ${user.name === 'You'
                                ? 'bg-primary/10 border border-primary/20'
                                : 'bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${user.rank === 1
                                        ? 'bg-yellow-500/20 text-yellow-400'
                                        : user.rank === 2
                                            ? 'bg-gray-400/20 text-gray-400'
                                            : user.rank === 3
                                                ? 'bg-orange-500/20 text-orange-400'
                                                : 'bg-white/10 text-muted-foreground'
                                        }`}
                                >
                                    {user.rank}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`font-semibold ${user.name === 'You' ? 'text-primary' : ''
                                                }`}
                                        >
                                            {user.name}
                                        </span>
                                        {user.badge && <span className="text-lg">{user.badge}</span>}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-sm text-muted-foreground">
                                            {user.progress}/30 days
                                        </span>
                                        <span className="text-sm text-orange-400">🔥 {user.streak}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold">
                                    {Math.round((user.progress / 30) * 100)}%
                                </div>
                                <div className="text-xs text-muted-foreground">Complete</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Leaderboard Info */}
            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-300">
                    💡 <strong>Leaderboard Updates:</strong> Rankings are updated in real-time based on completed days and current streaks. Keep learning daily to climb higher!
                </p>
            </div>
        </div>
    );
};

export default ChallengeLeaderboard;