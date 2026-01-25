import { Code, Plus } from 'lucide-react';

export default function DSAManagement() {
    return (
        <div className="glass-card rounded-2xl p-8 text-center">
            <Code className="w-16 h-16 mx-auto mb-4 text-primary opacity-50" />
            <h3 className="text-2xl font-bold mb-2">DSA Problem Management</h3>
            <p className="text-muted-foreground mb-6">
                Add and manage DSA practice problems
            </p>
            <p className="text-sm text-muted-foreground mb-4">
                Currently DSA problems are managed via JSON files.<br />
                Full CRUD interface coming soon!
            </p>
            <button className="px-6 py-2 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Problem
            </button>
        </div>
    );
}
