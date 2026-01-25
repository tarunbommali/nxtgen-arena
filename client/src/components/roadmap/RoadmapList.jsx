import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, Target, TrendingUp } from 'lucide-react';
import AppLayout from '../shared/AppLayout';
import ProgressBar from '../shared/ProgressBar';
import roadmapsData from '../../data/roadmaps.json';

export default function RoadmapList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRoadmaps = roadmapsData.filter(roadmap =>
        roadmap.roadmapName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadmap.careerOutcome.some(career => career.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AppLayout>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold mb-2">Learning Roadmaps</h1>
                <p className="text-muted-foreground">
                    Structured learning paths to master different tech skills and domains
                </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl p-6 mb-8"
            >
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search roadmaps by name or career outcome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                    {filteredRoadmaps.length} of {roadmapsData.length} roadmaps
                </div>
            </motion.div>

            {/* Roadmaps Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredRoadmaps.map((roadmap, index) => {
                    // Mock progress (in production, fetch from user data)
                    const completedPhases = 0;
                    const totalPhases = roadmap.levels.reduce((sum, level) => sum + level.phases.length, 0);

                    return (
                        <motion.div
                            key={roadmap.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => navigate(`/roadmaps/${roadmap.id}`)}
                            className="glass-card rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                        {roadmap.roadmapName}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{roadmap.totalDurationMonths} months</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Target className="w-4 h-4" />
                                            <span>{roadmap.levels.length} levels</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Levels */}
                            <div className="mb-4">
                                <div className="flex gap-2 mb-3">
                                    {roadmap.levels.map((level, i) => (
                                        <span
                                            key={i}
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${i === 0
                                                ? 'bg-green-500/10 text-green-500'
                                                : i === 1
                                                    ? 'bg-yellow-500/10 text-yellow-500'
                                                    : 'bg-red-500/10 text-red-500'
                                                }`}
                                        >
                                            {level.level}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Progress */}
                            {completedPhases > 0 && (
                                <div className="mb-4">
                                    <ProgressBar
                                        current={completedPhases}
                                        total={totalPhases}
                                        size="sm"
                                        showLabel={false}
                                    />
                                </div>
                            )}

                            {/* Career Outcomes */}
                            <div className="mb-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="font-medium">Career Outcomes:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {roadmap.careerOutcome.map((career, i) => (
                                        <span key={i} className="px-2 py-1 bg-muted text-xs rounded">
                                            {career}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Button */}
                            <button className="w-full px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors">
                                {completedPhases > 0 ? 'Continue Learning' : 'Start Learning'}
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredRoadmaps.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No roadmaps found</h3>
                    <p className="text-muted-foreground">
                        Try adjusting your search term
                    </p>
                </motion.div>
            )}
        </AppLayout>
    );
}
