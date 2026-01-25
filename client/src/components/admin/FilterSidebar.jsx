import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { skillsOptions } from '../../data/challenges';

export function FilterSidebar({
    selectedSkills,
    searchQuery,
    onSearchChange,
    onSkillToggle,
    onClearFilters
}) {
    return (
        <div className="w-80 border-r border-white/10 bg-black/20 p-6 flex flex-col h-full overflow-y-auto hidden lg:flex">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold flex items-center gap-2">
                    <SlidersHorizontal size={18} /> Filters
                </h2>
                {(selectedSkills.length > 0 || searchQuery) && (
                    <button
                        onClick={onClearFilters}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                        <X size={12} /> Clear
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Search</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Name or Email..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                </div>

                {/* Skills Filter */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tech Stack</label>
                    <div className="space-y-1">
                        {skillsOptions.map(skill => (
                            <label key={skill} className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedSkills.includes(skill)}
                                    onChange={() => onSkillToggle(skill)}
                                    className="rounded border-white/20 bg-white/5 checked:bg-primary"
                                />
                                <span className="text-sm text-gray-400 group-hover:text-white transition-colors truncate">{skill}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
