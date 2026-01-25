import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Map, Plus, Edit, Trash2, Save, X, ChevronDown, ChevronRight,
    Layers, GripVertical, Check, Video, BookOpen, Trophy, Clock, MoreVertical
} from 'lucide-react';
import fullStackData from '../../data/fullStackRoadmap.json';

// Helper to safely get value from event
const val = (e) => e.target.value;

export default function RoadmapManagement() {
    const [roadmap, setRoadmap] = useState(fullStackData);
    const [editingPhase, setEditingPhase] = useState(null);
    const [activeTab, setActiveTab] = useState('general'); // general, curriculum, playlists, projects
    const [isDirty, setIsDirty] = useState(false);

    const handleSave = () => {
        console.log("Saving Roadmap Data:", JSON.stringify(roadmap, null, 2));
        alert("Changes saved to console! (This would persist to backend in prod)");
        setIsDirty(false);
    };

    const updatePhase = (phaseId, updates) => {
        setRoadmap(prev => ({
            ...prev,
            phases: prev.phases.map(p => p.id === phaseId ? { ...p, ...updates } : p)
        }));
        setIsDirty(true);
        // Also update the local editing state if needed
        if (editingPhase?.id === phaseId) {
            setEditingPhase(prev => ({ ...prev, ...updates }));
        }
    };

    // --- Playlist Handlers ---
    const addPlaylist = (phaseId) => {
        const phases = [...roadmap.phases];
        const phase = phases.find(p => p.id === phaseId);
        if (!phase.playlists) phase.playlists = [];

        phase.playlists.push({
            title: "New Playlist",
            author: "Author Name",
            videoCount: 0,
            url: "https://youtube.com",
            thumbnail: "https://img.youtube.com/vi/placeholder/mqdefault.jpg"
        });

        updatePhase(phaseId, { playlists: phase.playlists });
    };

    const updatePlaylist = (phaseId, index, field, value) => {
        const phases = [...roadmap.phases];
        const phase = phases.find(p => p.id === phaseId);
        phase.playlists[index][field] = value;
        updatePhase(phaseId, { playlists: phase.playlists });
    };

    const removePlaylist = (phaseId, index) => {
        const phases = [...roadmap.phases];
        const phase = phases.find(p => p.id === phaseId);
        phase.playlists.splice(index, 1);
        updatePhase(phaseId, { playlists: phase.playlists });
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-20 py-4 border-b border-white/5">
                <div>
                    <h2 className="text-2xl font-bold">Roadmap Admin</h2>
                    <p className="text-sm text-muted-foreground">Manage Content & Resources</p>
                </div>
                <div className="flex items-center gap-3">
                    {isDirty && (
                        <span className="text-xs text-yellow-500 font-medium animate-pulse">
                            Unsaved changes
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isDirty
                            ? 'bg-primary text-white hover:bg-primary/90'
                            : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                            }`}
                    >
                        <Save className="w-4 h-4" />
                        Save
                    </button>
                </div>
            </div>

            {/* Phases List */}
            <div className="space-y-6">
                {roadmap.phases.map((phase, index) => (
                    <div key={phase.id} className="glass-card rounded-xl border border-white/5 overflow-hidden">
                        {/* Phase Header */}
                        <div className="p-4 flex items-center gap-4 bg-white/[0.02]">
                            <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-white/5 text-muted-foreground font-mono">
                                <span className="text-xs uppercase">P{phase.order}</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-lg">{phase.title}</h4>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span>{phase.level}</span>
                                    <span>•</span>
                                    <span>{phase.duration}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditingPhase(editingPhase?.id === phase.id ? null : phase)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${editingPhase?.id === phase.id
                                    ? 'bg-primary text-white'
                                    : 'bg-white/5 hover:bg-white/10'
                                    }`}
                            >
                                {editingPhase?.id === phase.id ? 'Close' : 'Edit'}
                            </button>
                        </div>

                        {/* Phase Editor */}
                        <AnimatePresence>
                            {editingPhase?.id === phase.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-white/5"
                                >
                                    <div className="p-4">
                                        {/* Tabs */}
                                        <div className="flex gap-1 mb-6 p-1 bg-black/20 rounded-lg w-max">
                                            {['general', 'curriculum', 'playlists', 'projects'].map(tab => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setActiveTab(tab)}
                                                    className={`px-4 py-1.5 rounded-md text-xs font-medium uppercase tracking-wide transition-colors ${activeTab === tab
                                                            ? 'bg-primary text-white'
                                                            : 'text-muted-foreground hover:text-white'
                                                        }`}
                                                >
                                                    {tab}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Tab Content */}
                                        <div className="bg-black/20 rounded-xl p-4 border border-white/5 min-h-[300px]">

                                            {/* GENERAL TAB */}
                                            {activeTab === 'general' && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="col-span-2">
                                                        <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                                                        <input
                                                            type="text"
                                                            value={phase.title}
                                                            onChange={(e) => updatePhase(phase.id, { title: val(e) })}
                                                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-muted-foreground mb-1 block">Level</label>
                                                        <input
                                                            type="text"
                                                            value={phase.level}
                                                            onChange={(e) => updatePhase(phase.id, { level: val(e) })}
                                                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-muted-foreground mb-1 block">Duration</label>
                                                        <input
                                                            type="text"
                                                            value={phase.duration}
                                                            onChange={(e) => updatePhase(phase.id, { duration: val(e) })}
                                                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm"
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                                                        <textarea
                                                            value={phase.description}
                                                            onChange={(e) => updatePhase(phase.id, { description: val(e) })}
                                                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm h-24 resize-none"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* PLAYLISTS TAB */}
                                            {activeTab === 'playlists' && (
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="text-sm font-semibold text-muted-foreground">
                                                            {phase.playlists?.length || 0} Playlists
                                                        </h4>
                                                        <button
                                                            onClick={() => addPlaylist(phase.id)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 text-primary rounded-lg text-xs font-bold hover:bg-primary/30"
                                                        >
                                                            <Plus className="w-3 h-3" /> Add Playlist
                                                        </button>
                                                    </div>

                                                    <div className="grid gap-4">
                                                        {phase.playlists?.map((playlist, idx) => (
                                                            <div key={idx} className="flex gap-4 p-3 rounded-lg bg-white/5 border border-white/5 group">
                                                                <div className="w-24 h-16 bg-black rounded overflow-hidden flex-shrink-0 relative">
                                                                    <img src={playlist.thumbnail} alt="" className="w-full h-full object-cover opacity-50" />
                                                                </div>
                                                                <div className="flex-1 grid grid-cols-2 gap-3">
                                                                    <div className="col-span-2 sm:col-span-1">
                                                                        <label className="text-[10px] text-muted-foreground block">Title</label>
                                                                        <input
                                                                            value={playlist.title}
                                                                            onChange={(e) => updatePlaylist(phase.id, idx, 'title', val(e))}
                                                                            className="w-full bg-transparent border-b border-white/10 focus:border-primary outline-none text-sm py-0.5"
                                                                        />
                                                                    </div>
                                                                    <div className="col-span-2 sm:col-span-1">
                                                                        <label className="text-[10px] text-muted-foreground block">URL</label>
                                                                        <input
                                                                            value={playlist.url}
                                                                            onChange={(e) => updatePlaylist(phase.id, idx, 'url', val(e))}
                                                                            className="w-full bg-transparent border-b border-white/10 focus:border-primary outline-none text-xs py-0.5 text-blue-400"
                                                                        />
                                                                    </div>
                                                                    <div className="col-span-2 sm:col-span-1">
                                                                        <label className="text-[10px] text-muted-foreground block">Author</label>
                                                                        <input
                                                                            value={playlist.author}
                                                                            onChange={(e) => updatePlaylist(phase.id, idx, 'author', val(e))}
                                                                            className="w-full bg-transparent border-b border-white/10 focus:border-primary outline-none text-xs py-0.5"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => removePlaylist(phase.id, idx)}
                                                                    className="self-start p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* CURRICULUM TAB (ReadOnly Placeholder for now to save space, user can expand later) */}
                                            {activeTab === 'curriculum' && (
                                                <div className="text-center py-10">
                                                    <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                                                    <p className="text-muted-foreground mb-4">Curriculum editing is complex.</p>
                                                    <p className="text-xs text-white/50 bg-black/30 p-2 rounded inline-block">
                                                        Edit 'sections' and 'items' in the JSON file directly for now <br />
                                                        or use the "General" tab for high-level changes.
                                                    </p>
                                                </div>
                                            )}

                                            {/* PROJECTS TAB (ReadOnly Placeholder) */}
                                            {activeTab === 'projects' && (
                                                <div className="text-center py-10">
                                                    <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                                                    <p className="text-muted-foreground">Projects editor coming soon.</p>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
