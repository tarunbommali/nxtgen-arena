import { motion } from 'framer-motion';
import {
    Code,
    CheckCircle,
    Target,
    Trophy,
    BookOpen
} from 'lucide-react';

const ChallengePlaygroundTab = ({ challenge, completedDays, selectedDay, setSelectedDay }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        <Code className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Practice Playground</h2>
                </div>

                {/* Day Selector */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Select Day:</span>
                    <select
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(Number(e.target.value))}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                    >
                        {Array.from({ length: challenge.totalDays }, (_, i) => i + 1).map((day) => (
                            <option key={day} value={day} className="bg-background">
                                Day {day}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Day Quick Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {Array.from({ length: Math.min(challenge.totalDays, 10) }, (_, i) => i + 1).map((day) => {
                    const isCompleted = completedDays.has(day);
                    const isSelected = day === selectedDay;
                    return (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all ${isSelected
                                ? 'bg-primary text-white'
                                : isCompleted
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                                }`}
                        >
                            Day {day}
                        </button>
                    );
                })}
                {challenge.totalDays > 10 && (
                    <span className="text-sm text-muted-foreground px-2">...</span>
                )}
            </div>

            {/* Current Day Info */}
            <motion.div
                key={selectedDay}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-6"
            >
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold">Day {selectedDay}</h3>
                            {completedDays.has(selectedDay) && (
                                <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span className="text-sm text-green-400 font-medium">Completed</span>
                                </div>
                            )}
                        </div>
                        <p className="text-xl font-semibold mb-1">
                            {challenge.curriculum?.[selectedDay - 1]?.title || `Lesson ${selectedDay}`}
                        </p>
                        <p className="text-muted-foreground">
                            {challenge.curriculum?.[selectedDay - 1]?.description || `Complete the tasks for day ${selectedDay}`}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">Difficulty</div>
                        <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-medium">
                            {challenge.curriculum?.[selectedDay - 1]?.difficulty || 'Medium'}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tasks Section */}
            <div className="grid  gap-6">
                {/* Tasks List */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Tasks for Day {selectedDay}
                    </h4>
                    <div className="space-y-3">
                        {[
                            { id: 1, title: `Complete the ${challenge.title} basics`, points: 50 },
                            { id: 2, title: `Build a simple project`, points: 100 },
                            { id: 3, title: `Submit your solution`, points: 150 },
                        ].map((task, index) => (
                            <div
                                key={task.id}
                                className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-primary text-sm font-bold">{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium mb-1">{task.title}</div>
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-3 h-3 text-yellow-400" />
                                        <span className="text-sm text-yellow-400 font-medium">{task.points} pts</span>
                                    </div>
                                </div>
                                <button className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors">
                                    Start
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Resources & Code Editor Preview */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Resources & Tools
                    </h4>

                    {/* Code Editor Placeholder */}
                    <div className="bg-black/40 rounded-lg p-4 mb-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            <span className="text-sm text-muted-foreground ml-2">playground.js</span>
                        </div>
                        <pre className="text-sm text-green-400 font-mono">
                            <code>{`// Day ${selectedDay} - Start coding here\nfunction solve() {\n  // Your code here\n  return "Hello World";\n}\n\nsolve();`}</code>
                        </pre>
                    </div>

                    {/* Resources */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-400" />
                                <span className="text-sm">Documentation</span>
                            </div>
                            <span className="text-xs text-muted-foreground">→</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                            <div className="flex items-center gap-2">
                                <Code className="w-4 h-4 text-purple-400" />
                                <span className="text-sm">Code Examples</span>
                            </div>
                            <span className="text-xs text-muted-foreground">→</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm">Solution Guide</span>
                            </div>
                            <span className="text-xs text-muted-foreground">→</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        Complete all tasks to mark this day as done
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-colors">
                        Save Progress
                    </button>
                    <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Mark as Complete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChallengePlaygroundTab;