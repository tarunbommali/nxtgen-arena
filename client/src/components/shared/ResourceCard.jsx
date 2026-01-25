import { ExternalLink, BookOpen, Video, FileText, Code, Wrench } from 'lucide-react';

const iconMap = {
    course: Video,
    docs: FileText,
    practice: Code,
    book: BookOpen,
    tool: Wrench,
    video: Video,
    ui: Code
};

export default function ResourceCard({ resource, compact = false }) {
    const Icon = iconMap[resource.type] || FileText;

    if (compact) {
        return (
            <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group"
            >
                <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm flex-1 group-hover:text-primary transition-colors">
                    {resource.name}
                </span>
                <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
        );
    }

    return (
        <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card rounded-lg p-4 hover:shadow-lg transition-all duration-300 group"
        >
            <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-1 group-hover:text-primary transition-colors">
                        {resource.name}
                    </h4>
                    <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-muted capitalize">
                        {resource.type}
                    </span>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
        </a>
    );
}
