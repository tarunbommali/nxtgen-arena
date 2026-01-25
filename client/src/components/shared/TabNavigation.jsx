import { motion } from 'framer-motion';

export default function TabNavigation({ tabs, activeTab, onTabChange, className = '' }) {
    return (
        <div className={`flex gap-2 border-b border-border overflow-x-auto ${className}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`relative px-6 py-3 font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    {tab.label}
                    {tab.count !== undefined && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-muted">
                            {tab.count}
                        </span>
                    )}
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
}
