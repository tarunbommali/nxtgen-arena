import { motion } from 'framer-motion';
import {
    Calendar,
    Target,
    Trophy,
    Users
} from 'lucide-react';

const ChallengeSidebar = ({ challenge, completedDays, progressPercentage }) => {
    return (
        <div className="space-y-6">
            {/* Weekly Progress */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        Weekly Goal
                        <div className="w-4 h-4 bg-white/10 rounded-full flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">?</span>
                        </div>
                    </h3>
                    <div className="p-1.5 bg-orange-500/20 rounded-lg">
                        <Calendar className="w-4 h-4 text-orange-400" />
                    </div>
                </div>

                {/* Circular Progress */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative w-32 h-32 mb-4">
                        <svg className="transform -rotate-90 w-32 h-32">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-white/10"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={2 * Math.PI * 56}
                                strokeDashoffset={2 * Math.PI * 56 * (1 - (completedDays.size % 7) / 5)}
                                className="text-primary transition-all duration-500"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-1">
                                    <Target className="w-5 h-5 text-primary" />
                                </div>
                                <div className="text-xl font-bold">{(completedDays.size % 7)}/5</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Days of Week */}
                <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>This Week</span>
                        <span className="text-primary font-medium">{(completedDays.size % 7)}/5 Days</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
                            const isCompleted = index < (completedDays.size % 7);
                            return (
                                <div
                                    key={index}
                                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${isCompleted
                                        ? 'bg-primary/20 text-primary border border-primary/30'
                                        : 'bg-white/5 text-muted-foreground border border-white/10'
                                        }`}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Weekly Goal Reward */}
                <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg mb-4">
                    <span className="text-sm text-muted-foreground">Weekly Goal Reward</span>
                    <div className="flex items-center gap-1">
                        <div className="w-5 h-5 bg-yellow-500/20 rounded-full flex items-center justify-center">
                            <Trophy className="w-3 h-3 text-yellow-400" />
                        </div>
                        <span className="text-sm font-bold text-yellow-400">300</span>
                    </div>
                </div>

                {/* Achievement Stats */}
                <div className="text-center text-sm text-muted-foreground">
                    No. of Weekly Goals Achieved - <span className="text-primary font-semibold">{Math.floor(completedDays.size / 5)} Weeks</span>
                </div>
            </motion.div>

            {/* Challenge Stats */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
                <h3 className="text-lg font-semibold mb-4">Challenge Stats</h3>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Days</span>
                        <span className="font-medium">{challenge.totalDays}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Completed</span>
                        <span className="font-medium text-green-400">{completedDays.size}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Remaining</span>
                        <span className="font-medium">{challenge.totalDays - completedDays.size}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
                    </div>
                </div>
            </motion.div>

            {/* Community */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
                <h3 className="text-lg font-semibold mb-4">Community</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>1,234 participants</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Trophy className="w-4 h-4" />
                        <span>89% completion rate</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ChallengeSidebar;