import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Trophy, TrendingUp, CheckCircle, BookOpen, Code } from 'lucide-react';
import AppLayout from '../shared/AppLayout';
import dsaData from '../../data/dsaSheet.json';

export default function DSASheet() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [solvedProblems] = useState({}); // This would come from user data in production

    // Calculate statistics
    const totalProblems = dsaData.categories.reduce((acc, cat) => acc + cat.problems.length, 0);
    const solvedCount = Object.values(solvedProblems).filter(Boolean).length;
    const progress = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

    // Filter categories based on search
    const filteredCategories = dsaData.categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.problems.some(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getDifficultyDistribution = (problems) => {
        const dist = { easy: 0, medium: 0, hard: 0 };
        problems.forEach(p => {
            if (dist[p.difficulty] !== undefined) dist[p.difficulty]++;
        });
        return dist;
    };

    return (
        <AppLayout>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold mb-2">DSA Practice Sheet</h1>
                <p className="text-muted-foreground">
                    Master Data Structures & Algorithms with curated problem sets
                </p>
            </motion.div>

            {/* Overall Progress Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6 mb-8"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-lg font-semibold mb-1">Your Progress</div>
                        <div className="text-3xl font-bold text-primary mb-2">{progress}%</div>
                        <div className="text-sm text-muted-foreground">
                            {solvedCount} / {totalProblems} problems solved
                        </div>
                    </div>
                    <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-white/10"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 40}`}
                                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                                className="text-primary transition-all duration-500"
                                strokeLinecap="round"
                            />
                        </svg>
                        <Trophy className="w-10 h-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                </div>
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
                        placeholder="Search topics or problems..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                    {filteredCategories.length} of {dsaData.categories.length} topics
                </div>
            </motion.div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category, index) => {
                    const categoryProgress = category.problems.filter(p => solvedProblems[p.id]).length;
                    const categoryTotal = category.problems.length;
                    const categoryPercent = Math.round((categoryProgress / categoryTotal) * 100);
                    const difficulty = getDifficultyDistribution(category.problems);

                    return (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => navigate(`/dsa-sheet/${category.id}`)}
                            className="glass-card rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group"
                        >
                            {/* Category Icon & Name */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {categoryTotal} problems
                                    </p>
                                </div>
                                <Code className="w-8 h-8 text-primary/50 group-hover:text-primary transition-colors" />
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">{categoryPercent}%</span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500"
                                        style={{ width: `${categoryPercent}%` }}
                                    />
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {categoryProgress} / {categoryTotal} solved
                                </div>
                            </div>

                            {/* Difficulty Distribution */}
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-muted-foreground">Easy: {difficulty.easy}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    <span className="text-muted-foreground">Med: {difficulty.medium}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span className="text-muted-foreground">Hard: {difficulty.hard}</span>
                                </div>
                            </div>

                            {/* CTA */}
                            <button className="w-full mt-4 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors">
                                {categoryProgress > 0 ? 'Continue Practice' : 'Start Practice'}
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredCategories.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No topics found</h3>
                    <p className="text-muted-foreground">
                        Try adjusting your search term
                    </p>
                </motion.div>
            )}
        </AppLayout>
    );
}
