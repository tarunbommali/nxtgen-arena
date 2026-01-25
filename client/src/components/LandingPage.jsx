import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
    Rocket, Map, Code, Trophy, Target, TrendingUp, Users, Zap,
    Calendar, CheckCircle, ArrowRight, Sparkles, Award, BookOpen
} from 'lucide-react';
import Navbar from './Navbar';
import eventsData from '../data/events.json';
import roadmapsData from '../data/roadmaps.json';

export default function LandingPage() {
    const { currentUser, login } = useAuth();
    const navigate = useNavigate();

    // Get active and upcoming events
    const upcomingEvents = eventsData.filter(e => e.status === 'active' || e.status === 'upcoming').slice(0, 6);
    const topRoadmaps = roadmapsData.slice(0, 4);

    const handleCTA = () => {
        if (currentUser) {
            navigate('/dashboard');
        } else {
            login();
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px]" />
                <div className="absolute top-[30%] -right-[10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-[20%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[150px]" />
            </div>

            <Navbar />

            <main className="relative z-10">
                {/* HERO SECTION */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary mb-4">
                            <Sparkles className="w-4 h-4" />
                            <span>🚀 Nxtgen Arena - Engineering Platform for College Students</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                            Build. Compete. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-blue-500">Evolve.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                            Hackathons, Roadmaps, and Engineering Challenges for College Students
                        </p>

                        <p className="text-sm text-muted-foreground/70">
                            Developed by <span className="text-primary font-semibold">Nxtgen Labs</span>
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <button
                                onClick={() => navigate('/events')}
                                className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/30 flex items-center gap-2 transition-all hover:scale-105"
                            >
                                Explore Events
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => navigate('/roadmaps')}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 font-semibold rounded-xl transition-all"
                            >
                                View Roadmaps
                            </button>
                        </div>
                    </motion.div>
                </section>

                {/* WHAT YOU CAN DO HERE */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {[
                            {
                                icon: Trophy,
                                title: 'Compete in Hackathons',
                                description: 'Participate in exciting hackathons and coding contests',
                                color: 'from-yellow-500 to-orange-500'
                            },
                            {
                                icon: Map,
                                title: 'Follow Roadmaps',
                                description: 'Structured learning paths for Full Stack, DSA, DevOps & AI',
                                color: 'from-blue-500 to-cyan-500'
                            },
                            {
                                icon: Code,
                                title: 'Practice DSA',
                                description: 'Solve 200+ concept-focused problems with detailed explanations',
                                color: 'from-purple-500 to-pink-500'
                            },
                            {
                                icon: Rocket,
                                title: 'Build Projects',
                                description: 'Create real-world projects and showcase your portfolio',
                                color: 'from-green-500 to-emerald-500'
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <item.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                                <p className="text-muted-foreground text-sm">{item.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* ACTIVE & UPCOMING EVENTS */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-2">Active & Upcoming Events</h2>
                                <p className="text-muted-foreground">Join hackathons, contests, and challenges happening now</p>
                            </div>
                            <button
                                onClick={() => navigate('/events')}
                                className="hidden md:flex items-center gap-2 text-primary hover:gap-3 transition-all"
                            >
                                View All
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingEvents.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => navigate(`/events/${event.id}`)}
                                    className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.status === 'active'
                                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                            : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                            }`}>
                                            {event.status === 'active' ? 'Active Now' : 'Upcoming'}
                                        </span>
                                        <span className="text-xs text-muted-foreground capitalize">{event.type.replace('_', ' ')}</span>
                                    </div>

                                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {event.name}
                                    </h3>

                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {event.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {event.tags.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="px-2 py-1 bg-muted text-xs rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{event.totalParticipants}+</span>
                                        </div>
                                        <button className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                            View Event
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate('/events')}
                            className="md:hidden mx-auto flex items-center gap-2 text-primary border border-primary/20 px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                            View All Events
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                </section>

                {/* LEARNING ROADMAPS */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-2">Learning Roadmaps</h2>
                                <p className="text-muted-foreground">Structured paths to master tech skills</p>
                            </div>
                            <button
                                onClick={() => navigate('/roadmaps')}
                                className="hidden md:flex items-center gap-2 text-primary hover:gap-3 transition-all"
                            >
                                View All
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {topRoadmaps.map((roadmap, index) => (
                                <motion.div
                                    key={roadmap.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => navigate(`/roadmaps/${roadmap.id}`)}
                                    className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Map className="w-6 h-6 text-white" />
                                    </div>

                                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                                        {roadmap.roadmapName.replace('Roadmap', '').trim()}
                                    </h3>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <span>{roadmap.totalDurationMonths} months</span>
                                        </div>
                                        <div className="flex gap-2">
                                            {roadmap.levels.map((level, i) => (
                                                <span key={i} className={`px-2 py-0.5 text-xs rounded ${i === 0 ? 'bg-green-500/10 text-green-500' :
                                                    i === 1 ? 'bg-yellow-500/10 text-yellow-500' :
                                                        'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {level.level}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <button className="w-full px-4 py-2 bg-primary/20 hover:bg-primary text-primary hover:text-white font-medium rounded-lg transition-colors">
                                        Start Learning
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* DSA PRACTICE SYSTEM */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-card rounded-2xl p-8 md:p-12"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Master DSA Through Practice</h2>
                                    <p className="text-muted-foreground text-lg">
                                        200+ concept-focused problems with detailed explanations. Track your progress across 6 major categories.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Arrays & Strings', count: 50 },
                                        { label: 'Trees & Graphs', count: 45 },
                                        { label: 'Dynamic Programming', count: 40 },
                                        { label: 'Linked Lists', count: 35 }
                                    ].map((category, i) => (
                                        <div key={i} className="p-4 bg-white/5 rounded-lg border border-white/10">
                                            <div className="text-2xl font-bold text-primary mb-1">{category.count}</div>
                                            <div className="text-sm text-muted-foreground">{category.label}</div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => navigate('/dsa-sheet')}
                                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg flex items-center gap-2 transition-all"
                                >
                                    Open DSA Sheet
                                    <Code className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="relative">
                                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/10 p-8 flex items-center justify-center">
                                    <div className="text-center space-y-4">
                                        <div className="text-6xl font-bold text-primary">0/200</div>
                                        <div className="text-muted-foreground">Problems Solved</div>
                                        <div className="flex items-center justify-center gap-4 pt-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-500">0</div>
                                                <div className="text-xs text-muted-foreground">Easy</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-yellow-500">0</div>
                                                <div className="text-xs text-muted-foreground">Medium</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-red-500">0</div>
                                                <div className="text-xs text-muted-foreground">Hard</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* WHY NXTGENLABS */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center space-y-12"
                    >
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Nxtgen Arena?</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Built by Nxtgen Labs for students who want to stand out
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: Target, title: 'Learn by Doing', description: 'Hands-on projects, not just theory' },
                                { icon: Users, title: 'Compete with Peers', description: 'Leaderboards and rankings' },
                                { icon: Award, title: 'Build Real Projects', description: 'Portfolio-worthy work' },
                                { icon: TrendingUp, title: 'Become Industry-Ready', description: 'Skills that companies want' }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center space-y-3"
                                >
                                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                                        <item.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* STUDENT JOURNEY */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-card rounded-2xl p-8 md:p-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Your Engineering Journey</h2>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                            {[
                                { step: '01', title: 'Join', description: 'Sign up and create your profile', icon: Users },
                                { step: '02', title: 'Learn', description: 'Follow structured roadmaps', icon: BookOpen },
                                { step: '03', title: 'Build', description: 'Create real-world projects', icon: Rocket },
                                { step: '04', title: 'Compete', description: 'Join hackathons and challenges', icon: Trophy },
                                { step: '05', title: 'Get Placed', description: 'Land your dream job', icon: Zap }
                            ].map((item, index) => (
                                <div key={index} className="relative text-center">
                                    {index < 4 && (
                                        <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-transparent" />
                                    )}
                                    <div className="relative z-10 space-y-3">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mx-auto">
                                            <item.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="text-sm font-mono text-primary">{item.step}</div>
                                        <h3 className="text-xl font-bold">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* FINAL CTA */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center space-y-8 relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl" />
                        <div className="relative glass-card rounded-3xl p-12 md:p-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                Start Your Engineering Journey Today
                            </h2>
                            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Join thousands of students building, competing, and evolving their careers
                            </p>
                            <button
                                onClick={handleCTA}
                                className="px-10 py-5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-2xl shadow-primary/40 flex items-center gap-3 mx-auto transition-all hover:scale-105"
                            >
                                {currentUser ? 'Go to Dashboard' : 'Get Started Free'}
                                <ArrowRight className="w-6 h-6" />
                            </button>
                        </div>
                    </motion.div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="border-t border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h4 className="font-semibold mb-4">Platform</h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="hover:text-foreground cursor-pointer transition-colors">Events</div>
                                <div className="hover:text-foreground cursor-pointer transition-colors">Roadmaps</div>
                                <div className="hover:text-foreground cursor-pointer transition-colors">DSA Sheet</div>
                                <div className="hover:text-foreground cursor-pointer transition-colors">Dashboard</div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Learn</h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="hover:text-foreground cursor-pointer transition-colors">Full Stack</div>
                                <div className="hover:text-foreground cursor-pointer transition-colors">DevOps</div>
                                <div className="hover:text-foreground cursor-pointer transition-colors">DSA</div>
                                <div className="hover:text-foreground cursor-pointer transition-colors">AI/ML</div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Compete</h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="hover:text-foreground cursor-pointer transition-colors">Hackathons</div>
                                <div className="hover:text-foreground cursor-pointer transition-colors">Contests</div>
                                <div className="hover:text-foreground cursor-pointer transition-colors">Challenges</div>
                                <div className="hover:text-foreground cursor-pointer transition-colors">Workshops</div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="hover:text-foreground cursor-pointer transition-colors">About</div>
                                <div className="hover:text-foreground cursor-pointer transition-colors">Contact</div>
                                <div className="hover:text-foreground cursor-pointer transition-colors">Careers</div>
                                <div className="hover:text-foreground cursor-pointer transition-colors">Blog</div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
                        <p>&copy; 2026 <span className="text-primary font-semibold">Nxtgen Arena</span>. All rights reserved.</p>
                        <p className="text-xs mt-2">Developed by <span className="text-primary">Nxtgen Labs</span> - Built for students, by students.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
