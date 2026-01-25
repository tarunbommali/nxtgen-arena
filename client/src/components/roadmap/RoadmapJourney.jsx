import { useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Clock, BookOpen, Code, Trophy,
    Layout, Database, Cloud, Shield, Cpu, Rocket, Terminal, Layers, ChevronRight
} from 'lucide-react';
import Navbar from '../Navbar';
import TabNavigation from '../shared/TabNavigation';

// Import data sources
import fullStackData from '../../data/fullStackRoadmap.json';
import roadmapsData from '../../data/roadmaps.json';
import AppLayout from '../shared/AppLayout';

// ... (rest of the file remains the same until PhaseDetail)

// Icon mapping for phases
const phaseIcons = {
    "phase-1": Terminal,
    "phase-2": Database,
    "phase-3": Layout,
    "phase-4": Cloud,
    "phase-5": Cpu,
    "phase-6": Shield,
    "phase-7": Rocket
};

export default function RoadmapJourney() {
    const { roadmapId } = useParams();
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const [completedItems, setCompletedItems] = useState({});

    // 1. Determine which data to source and normalize it
    const roadmapData = useMemo(() => {
        // Case A: The special Full Stack JSON
        if (roadmapId === 'fullstack-backend-engineer-roadmap') {
            return fullStackData;
        }

        // Case B: Standard roadmaps from roadmaps.json -> Transform to new format
        const standardRoadmap = roadmapsData.find(r => r.id === roadmapId);

        if (!standardRoadmap) return null;

        // Transformation Logic: Flatten Levels -> Phases
        const textPhases = [];
        let orderCounter = 1;

        standardRoadmap.levels.forEach(level => {
            level.phases.forEach((phase) => {
                textPhases.push({
                    id: `phase-${orderCounter}`,
                    order: orderCounter,
                    title: phase.phase,
                    level: level.level,
                    duration: phase.durationWeeks + " weeks", // Append units if missing
                    description: phase.goals ? phase.goals[0] : `Master ${phase.phase} concepts.`,

                    // Transform "topics" array into "sections" -> "items" structure
                    sections: [
                        {
                            id: `sec-${orderCounter}-1`,
                            title: "Core Topics",
                            description: "Key concepts to master in this phase",
                            items: [
                                {
                                    id: `item-${orderCounter}-1`,
                                    title: "Curriculum",
                                    subItems: (phase.topics || []).map(topic => ({
                                        title: topic,
                                        videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + " tutorial")}`,
                                        duration: "10m"
                                    }))
                                }
                            ]
                        }
                    ],

                    // Add generic playlists for standard roadmaps
                    playlists: [
                        {
                            title: `${phase.phase} Essentials`,
                            author: "Tech Edu",
                            videoCount: 1,
                            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(phase.phase)}`,
                            thumbnail: "https://img.youtube.com/vi/bUCk642Wd78/mqdefault.jpg"
                        }
                    ],

                    // Transform projects
                    projects: (phase.projects || []).map((p, i) => ({
                        id: `proj-${orderCounter}-${i}`,
                        title: typeof p === 'string' ? p : p.name,
                        description: "Hands-on practice project",
                        tags: [level.level, "Project"]
                    }))
                });
                orderCounter++;
            });
        });

        return {
            id: standardRoadmap.id,
            title: standardRoadmap.roadmapName,
            description: `A comprehensive ${standardRoadmap.totalDurationMonths}-month journey to becoming a ${standardRoadmap.careerOutcome[0]}.`,
            targetRoles: standardRoadmap.careerOutcome,
            phases: textPhases
        };
    }, [roadmapId]);

    // Initial selected phase
    const [selectedPhase, setSelectedPhase] = useState(roadmapData?.phases?.[0]);

    // Update selected phase if data changes (e.g. navigation)
    useMemo(() => {
        if (roadmapData?.phases?.length > 0) {
            setSelectedPhase(roadmapData.phases[0]);
        }
    }, [roadmapData]);

    const toggleItem = (itemId) => {
        setCompletedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    if (!roadmapData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Roadmap Not Found</h2>
                    <button onClick={() => navigate('/roadmaps')} className="text-primary hover:underline flex items-center justify-center gap-2 mt-4">
                        <ChevronRight className="w-4 h-4 rotate-180" /> Back to Roadmaps
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center text-sm text-muted-foreground mb-6">
                    <button onClick={() => navigate('/dashboard')} className="hover:text-primary transition-colors">Home</button>
                    <ChevronRight className="w-4 h-4 mx-2 text-white/20" />
                    <button onClick={() => navigate('/roadmaps')} className="hover:text-primary transition-colors">Roadmaps</button>
                    <ChevronRight className="w-4 h-4 mx-2 text-white/20" />
                    <span className="text-foreground font-medium truncate">{roadmapData.title}</span>
                </nav>

                {/* Horizontal Phases Scroll */}
                <div className="mb-8 relative group">
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto pb-4 gap-4 snap-x hide-scrollbar px-1"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {roadmapData.phases.map((phase, index) => {
                            const Icon = phaseIcons[phase.id] || Layers; // Fallback icon
                            const isSelected = selectedPhase?.id === phase.id;

                            // Calculate phase progress (safe access)
                            const allSubItems = phase.sections?.flatMap(s => s.items?.flatMap(i => i.subItems || []) || []) || [];
                            const phaseItems = allSubItems.length;
                            const phaseCompleted = allSubItems
                                .filter(sub => completedItems[`${phase.id}-${sub.title}`]).length; // Updated to use sub.title
                            const phaseProgress = phaseItems > 0 ? Math.round((phaseCompleted / phaseItems) * 100) : 0;

                            return (
                                <motion.div
                                    key={phase.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setSelectedPhase(phase)}
                                    className={`flex-shrink-0 w-72 p-4 rounded-xl cursor-pointer transition-all border snap-center ${isSelected
                                        ? 'bg-white/10 border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)]'
                                        : 'glass-card border-white/5 hover:bg-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`p-2 rounded-lg transition-colors ${isSelected ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'
                                            }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-mono text-muted-foreground">
                                            PHASE {phase.order}
                                        </span>
                                    </div>

                                    <h3 className={`font-bold mb-1 truncate ${isSelected ? 'text-white' : 'text-muted-foreground'}`}>
                                        {phase.title}
                                    </h3>

                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {phase.duration}
                                        </span>
                                        <span>•</span>
                                        <span>{phase.sections?.length || 0} modules</span>
                                    </div>

                                    {/* Mini Progress Bar */}
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${phaseProgress === 100 ? 'bg-green-500' : 'bg-primary'}`}
                                            style={{ width: `${phaseProgress}%` }}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Fade gradients specifically for the scroll track */}
                    <div className="absolute top-0 bottom-4 left-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                    <div className="absolute top-0 bottom-4 right-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                </div>

                {/* Phase Detail Section */}
                <div className="min-h-[80vh]">
                    <AnimatePresence mode="wait">
                        {selectedPhase && (
                            <PhaseDetail
                                key={selectedPhase.id}
                                phase={selectedPhase}
                                completedItems={completedItems}
                                toggleItem={toggleItem}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function PhaseDetail({ phase, completedItems, toggleItem }) {
    const Icon = phaseIcons[phase.id] || Layers;
    const [activeTab, setActiveTab] = useState('curriculum');

    const tabs = [
        { id: 'curriculum', label: 'Curriculum' },
        { id: 'resources', label: 'Resources' },
        { id: 'projects', label: 'Projects' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
        >
            {/* Header Banner */}
            <div className="relative h-48 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 p-8 flex flex-col justify-end border-b border-white/5">
                <div className="absolute inset-0 bg-grid-white/[0.05]" />
                <div className="absolute top-6 right-6 p-3 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 hidden md:block">
                    <Icon className="w-10 h-10 text-primary" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20">
                            Phase {phase.order}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-white/30" />
                        <span className="text-sm text-white/70">
                            {phase.duration}
                        </span>
                        {phase.level && (
                            <>
                                <div className="h-1 w-1 rounded-full bg-white/30" />
                                <span className="text-sm text-yellow-500/80 font-medium">
                                    {phase.level}
                                </span>
                            </>
                        )}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{phase.title}</h2>
                    <p className="text-white/70 max-w-2xl">{phase.description}</p>
                </div>
            </div>

            {/* Content Area with Tabs */}
            <div className="p-6 md:p-8 space-y-8">
                <TabNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    className="mb-8"
                />

                <div className="mt-4">
                    {/* Curriculum Sections */}
                    {activeTab === 'curriculum' && (
                        <div>
                            {phase.sections && phase.sections.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {phase.sections.map((section) => (
                                            <div key={section.id} className="border border-white/10 rounded-xl overflow-hidden bg-black/20 flex flex-col">
                                                <div className="p-4 bg-white/5 border-b border-white/5 min-h-[60px] flex items-center">
                                                    <h4 className="font-semibold line-clamp-1 text-sm">{section.title}</h4>
                                                </div>

                                                <div className="p-4 space-y-3 flex-1">
                                                    {section.items.map((item) => (
                                                        <div key={item.id}>
                                                            {item.title !== "Curriculum" && item.title !== "Core Topics" && (
                                                                <h5 className="text-xs font-medium text-primary mb-2 uppercase tracking-wider opacity-80">
                                                                    {item.title}
                                                                </h5>
                                                            )}
                                                            <div className="space-y-2">
                                                                {item.subItems.map((sub, idx) => {
                                                                    const itemId = `${phase.id}-${sub.title}`;
                                                                    const isCompleted = completedItems[itemId];

                                                                    return (
                                                                        <div
                                                                            key={idx}
                                                                            className={`w-full flex items-center justify-between gap-3 p-2 rounded-lg transition-all group/item ${isCompleted
                                                                                ? 'bg-green-500/5'
                                                                                : 'hover:bg-white/5'
                                                                                }`}
                                                                        >
                                                                            <button
                                                                                onClick={() => toggleItem(itemId)}
                                                                                className="flex items-start gap-3 flex-1 text-left"
                                                                            >
                                                                                <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${isCompleted ? 'bg-green-500 border-green-500' : 'border-white/20 group-hover/item:border-primary'
                                                                                    }`}>
                                                                                    {isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
                                                                                </div>
                                                                                <div className="flex flex-col">
                                                                                    <span className={`text-sm leading-tight ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground/80'}`}>
                                                                                        {sub.title}
                                                                                    </span>
                                                                                </div>
                                                                            </button>

                                                                            {/* Video Link Button */}
                                                                            {sub.videoUrl && (
                                                                                <a
                                                                                    href={sub.videoUrl}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    title="Watch Video Tutorial"
                                                                                    className="flex-shrink-0 opacity-0 group-hover/item:opacity-100 p-1.5 rounded-md text-muted-foreground hover:bg-black/30 hover:text-red-400 transition-all"
                                                                                >
                                                                                    <div className="flex items-center gap-1.5">
                                                                                        <span className="text-[10px] font-medium hidden sm:block">Watch</span>
                                                                                        <svg
                                                                                            viewBox="0 0 24 24"
                                                                                            fill="none"
                                                                                            stroke="currentColor"
                                                                                            strokeWidth="2"
                                                                                            strokeLinecap="round"
                                                                                            strokeLinejoin="round"
                                                                                            className="w-3.5 h-3.5"
                                                                                        >
                                                                                            <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                                                                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                                                                        </svg>
                                                                                    </div>
                                                                                </a>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    No curriculum content available for this phase.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Resources (Playlists) Section */}
                    {activeTab === 'resources' && (
                        <div>
                            {phase.playlists && phase.playlists.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {phase.playlists.map((playlist, idx) => (
                                        <a
                                            key={idx}
                                            href={playlist.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-red-500/30 transition-all"
                                        >
                                            <div className="relative w-28 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-black/50">
                                                <img
                                                    src={playlist.thumbnail}
                                                    alt={playlist.title}
                                                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                                                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                        <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0 py-1">
                                                <h4 className="font-semibold text-sm text-white/90 mb-1 line-clamp-2 group-hover:text-red-400 transition-colors">
                                                    {playlist.title}
                                                </h4>
                                                <p className="text-xs text-muted-foreground mb-2">
                                                    By {playlist.author} • {playlist.videoCount} videos
                                                </p>
                                                <div className="flex items-center gap-1 text-[10px] text-white/50">
                                                    <span className="px-1.5 py-0.5 rounded bg-white/10">Free</span>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    No additional resources available for this phase.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Projects Section */}
                    {activeTab === 'projects' && (
                        <div>
                            {phase.projects && phase.projects.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {phase.projects.map((project, i) => (
                                        <div key={i} className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-white/5 hover:border-blue-500/30 transition-all group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                                                    <Trophy className="w-5 h-5" />
                                                </div>
                                                <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-white/5 text-muted-foreground border border-white/5">Active</span>
                                            </div>
                                            <h4 className="font-bold mb-2 text-white/90">{project.title}</h4>
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                {project.description}
                                            </p>
                                            {project.tags && (
                                                <div className="flex flex-wrap gap-2">
                                                    {project.tags.map((tag, i) => (
                                                        <span key={i} className="text-[10px] px-2 py-1 rounded bg-black/40 text-blue-300 font-mono border border-blue-500/20">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    No projects assigned for this phase yet.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// Keep the style injection for hide-scrollbar
const style = document.createElement('style');
style.textContent = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
if (!document.getElementById('scrollbar-style')) {
    style.id = 'scrollbar-style';
    document.head.appendChild(style);
}
