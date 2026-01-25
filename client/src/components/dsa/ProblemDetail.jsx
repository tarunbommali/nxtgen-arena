import { motion } from 'framer-motion';
import { X, CheckCircle, Circle, Clock, Zap, Lightbulb } from 'lucide-react';

export default function ProblemDetail({ problem, isSolved, onClose, onToggleSolved }) {
    const getDifficultyColor = (difficulty) => {
        const colors = {
            easy: 'text-green-500',
            medium: 'text-yellow-500',
            hard: 'text-red-500'
        };
        return colors[difficulty] || '';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getDifficultyColor(problem.difficulty)}`}>
                                {problem.difficulty}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {problem.tags.map((tag, i) => (
                                    <span key={i} className="px-2 py-1 bg-muted text-xs rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{problem.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        Problem Description
                    </h3>
                    <p className="text-muted-foreground">{problem.description}</p>
                </div>

                {/* Key Concept */}
                <div className="mb-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2 text-primary">💡 Key Concept</h3>
                    <p>{problem.concept}</p>
                </div>

                {/* Approaches */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Approaches</h3>
                    <div className="space-y-4">
                        {problem.approaches.map((approach, index) => (
                            <div key={index} className="glass-card rounded-lg p-4">
                                <h4 className="font-semibold mb-2">{approach.name}</h4>
                                <p className="text-sm text-muted-foreground mb-3">{approach.description}</p>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        <span>Time: <code className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded">{approach.timeComplexity}</code></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-purple-500" />
                                        <span>Space: <code className="px-2 py-0.5 bg-purple-500/10 text-purple-500 rounded">{approach.spaceComplexity}</code></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Key Insights */}
                {problem.keyInsights && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">🔑 Key Insights</h3>
                        <ul className="space-y-2">
                            {problem.keyInsights.map((insight, i) => (
                                <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                    <span className="text-sm">{insight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-border">
                    <button
                        onClick={onToggleSolved}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${isSolved
                                ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                                : 'bg-primary hover:bg-primary/90 text-white'
                            }`}
                    >
                        {isSolved ? (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Marked as Solved
                            </>
                        ) : (
                            <>
                                <Circle className="w-5 h-5" />
                                Mark as Solved
                            </>
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
