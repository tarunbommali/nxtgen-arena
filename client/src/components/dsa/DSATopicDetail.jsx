import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronRight, CheckCircle, Circle, ExternalLink,
    BookOpen, Trophy, Video, FileText
} from 'lucide-react';
import AppLayout from '../shared/AppLayout';
import TabNavigation from '../shared/TabNavigation';
import dsaData from '../../data/dsaSheet.json';

export default function DSATopicDetail() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('problems');
    const [solvedProblems, setSolvedProblems] = useState({}); // This would come from user data

    const topic = dsaData.categories.find(cat => cat.id === topicId);

    if (!topic) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Topic not found</h2>
                    <button onClick={() => navigate('/dsa-sheet')} className="text-primary hover:underline">
                        ← Back to DSA Sheet
                    </button>
                </div>
            </div>
        );
    }

    const toggleSolved = (problemId) => {
        setSolvedProblems(prev => ({
            ...prev,
            [problemId]: !prev[problemId]
        }));
    };

    const solvedCount = topic.problems.filter(p => solvedProblems[p.id]).length;
    const totalCount = topic.problems.length;
    const progress = Math.round((solvedCount / totalCount) * 100);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'hard': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    const tabs = [
        { id: 'problems', label: 'Problems', count: totalCount },
        { id: 'resources', label: 'Resources' }
    ];

    // Mock resources data - in production this would come from the topic
    const resources = [
        {
            id: 1,
            type: 'video',
            title: 'Array Fundamentals - Complete Guide',
            author: 'NeetCode',
            duration: '45 min',
            url: 'https://youtube.com'
        },
        {
            id: 2,
            type: 'article',
            title: 'Master Arrays in 30 Minutes',
            author: 'GeeksforGeeks',
            readTime: '15 min',
            url: 'https://geeksforgeeks.org'
        },
        {
            id: 3,
            type: 'video',
            title: 'Two Pointer Technique Explained',
            author: 'Abdul Bari',
            duration: '30 min',
            url: 'https://youtube.com'
        }
    ];

    return (
        <AppLayout>
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-muted-foreground mb-6">
                <button onClick={() => navigate('/dashboard')} className="hover:text-primary transition-colors">
                    Home
                </button>
                <ChevronRight className="w-4 h-4 mx-2 text-white/20" />
                <button onClick={() => navigate('/dsa-sheet')} className="hover:text-primary transition-colors">
                    DSA Sheet
                </button>
                <ChevronRight className="w-4 h-4 mx-2 text-white/20" />
                <span className="text-foreground font-medium truncate">{topic.name}</span>
            </nav>

            {/* Topic Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-8 mb-6 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10" />

                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-4">{topic.name}</h1>

                    {/* Progress Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <Trophy className="w-8 h-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Progress</p>
                                <p className="text-2xl font-bold">{progress}%</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Solved</p>
                                <p className="text-2xl font-bold">{solvedCount} / {totalCount}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Circle className="w-8 h-8 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Remaining</p>
                                <p className="text-2xl font-bold">{totalCount - solvedCount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tabbed Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6"
            >
                <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="mb-6" />

                {/* Problems Tab */}
                {activeTab === 'problems' && (
                    <div className="space-y-2">
                        {topic.problems.map((problem, index) => {
                            const isSolved = solvedProblems[problem.id];

                            return (
                                <motion.div
                                    key={problem.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg transition-all ${isSolved ? 'bg-green-500/5 border border-green-500/20' : 'hover:bg-white/5 border border-transparent'
                                        }`}
                                >
                                    <div className="flex items-start gap-3 flex-1">
                                        <button
                                            onClick={() => toggleSolved(problem.id)}
                                            className="mt-1 sm:mt-0 flex-shrink-0"
                                        >
                                            {isSolved ? (
                                                <CheckCircle className="w-6 h-6 text-green-500" />
                                            ) : (
                                                <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                                            )}
                                        </button>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm text-muted-foreground">#{index + 1}</span>
                                                <div className={`font-medium ${isSolved ? 'line-through text-muted-foreground' : ''}`}>
                                                    {problem.title}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className={`text-xs px-2 py-1 rounded-full border uppercase tracking-wider ${getDifficultyColor(problem.difficulty)}`}>
                                                    {problem.difficulty}
                                                </span>
                                                {problem.tags.map(tag => (
                                                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/5 text-muted-foreground">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pl-9 sm:pl-0">
                                        {problem.leetcodeUrl ? (
                                            <a
                                                href={problem.leetcodeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-orange-500/10 hover:text-orange-500 border border-white/10 hover:border-orange-500/20 rounded-lg text-sm font-medium transition-all"
                                            >
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png"
                                                    alt="LC"
                                                    className="w-4 h-4 grayscale"
                                                />
                                                <span>Solve</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ) : (
                                            <span className="px-4 py-2 bg-white/5 text-muted-foreground rounded-lg text-sm cursor-not-allowed opacity-50">
                                                Coming Soon
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Resources Tab */}
                {activeTab === 'resources' && (
                    <div className="space-y-4">
                        {resources.map((resource, index) => (
                            <motion.a
                                key={resource.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition-all group"
                            >
                                <div className={`p-3 rounded-lg ${resource.type === 'video'
                                    ? 'bg-red-500/10 text-red-500'
                                    : 'bg-blue-500/10 text-blue-500'
                                    }`}>
                                    {resource.type === 'video' ? (
                                        <Video className="w-6 h-6" />
                                    ) : (
                                        <FileText className="w-6 h-6" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                                        {resource.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        By {resource.author}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        {resource.type === 'video' ? (
                                            <span>{resource.duration}</span>
                                        ) : (
                                            <span>{resource.readTime} read</span>
                                        )}
                                    </div>
                                </div>

                                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </motion.a>
                        ))}

                        {resources.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>No resources available yet</p>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        </AppLayout>
    );
}
