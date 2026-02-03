import { motion } from 'framer-motion';
import {
    BookOpen,
    Target,
    CheckCircle,
    Calendar,
    Trophy
} from 'lucide-react';

const ChallengeAboutTab = ({ challenge }) => {
    return (
        <div className="space-y-8">
            {/* Challenge Overview */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">About This Challenge</h2>
                </div>

                <div className="prose prose-invert max-w-none">
                    <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                        {challenge.overview}
                    </p>

                    {/* Learning Outcomes */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            What You'll Master
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {challenge.learningOutcomes.map((outcome, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                    </div>
                                    <span className="text-muted-foreground leading-relaxed">{outcome}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Prerequisites */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            Prerequisites
                        </h3>
                        <div className="flex flex-wrap gap-3 mb-4">
                            {challenge.prerequisites.map((prereq, index) => (
                                <div key={index} className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 font-medium">
                                    {prereq}
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                            <p className="text-sm text-blue-300">
                                💡 <strong>Don't worry!</strong> If you're not familiar with all prerequisites, we'll guide you through everything step by step. Each day builds upon the previous one, ensuring you learn progressively.
                            </p>
                        </div>
                    </div>

                    {/* Challenge Structure */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Challenge Structure
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                        <span className="text-primary font-bold text-sm">30</span>
                                    </div>
                                    <span className="font-semibold">Daily Lessons</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Each day unlocks after completing the previous day's tasks
                                </p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                        <Target className="w-4 h-4 text-green-400" />
                                    </div>
                                    <span className="font-semibold">Hands-on Tasks</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Practical exercises and real-world projects
                                </p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                        <BookOpen className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <span className="font-semibold">Curated Resources</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Carefully selected tutorials, articles, and documentation
                                </p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                        <Trophy className="w-4 h-4 text-yellow-400" />
                                    </div>
                                    <span className="font-semibold">Submissions</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Submit your work to track progress and unlock next day
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Success Tips */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-primary" />
                            Tips for Success
                        </h3>
                        <div className="space-y-3">
                            {[
                                "Set aside 1-2 hours daily for consistent progress",
                                "Don't skip days - each lesson builds on the previous one",
                                "Join our community Discord for support and discussions",
                                "Document your learning journey for better retention",
                                "Practice beyond the daily tasks when possible"
                            ].map((tip, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                                    <div className="w-5 h-5 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-yellow-400 text-xs font-bold">{index + 1}</span>
                                    </div>
                                    <span className="text-muted-foreground text-sm">{tip}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChallengeAboutTab;