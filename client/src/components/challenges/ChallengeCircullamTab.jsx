import { motion } from 'framer-motion';
import { BookOpen, CheckCircle } from 'lucide-react';

const ChallengeCircullamTab = ({ challenge, completedDays }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/20 rounded-lg">
                    <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">30-Day Curriculum</h2>
            </div>

            {/* Module Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {challenge.modules?.map((module, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                <span className="text-primary font-bold text-sm">{index + 1}</span>
                            </div>
                            <h3 className="font-semibold">{module.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                        <div className="text-xs text-primary">Days {module.days}</div>
                    </motion.div>
                ))}
            </div>

            {/* Daily Breakdown */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Daily Breakdown</h3>
                <div className="space-y-3">
                    {Array.from({ length: challenge.totalDays }, (_, i) => i + 1).map((day) => {
                        const isCompleted = completedDays.has(day);
                        const isLocked = day > 1 && !completedDays.has(day - 1);

                        return (
                            <motion.div
                                key={day}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: day * 0.02 }}
                                className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${isCompleted
                                    ? 'bg-green-500/10 border-green-500/20'
                                    : isLocked
                                        ? 'bg-white/5 border-white/10 opacity-50'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isCompleted
                                    ? 'bg-green-500/20 text-green-400'
                                    : isLocked
                                        ? 'bg-gray-500/20 text-gray-400'
                                        : 'bg-primary/20 text-primary'
                                    }`}>
                                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : day}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">
                                        {challenge.curriculum?.[day - 1]?.description || `Complete the tasks for day ${day}`}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ChallengeCircullamTab;