import { ArrowUpRight, Users, Clock, CheckCircle, XCircle } from 'lucide-react';

export function StatsCards({ data }) {
    const total = data.length;
    const approved = data.filter(d => d.status === 'approved' || d.status === 'active').length;
    const pending = data.filter(d => d.status === 'pending').length;
    const rejected = data.filter(d => d.status === 'rejected').length;

    const stats = [
        { label: "Total Applications", value: total, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
        { label: "Pending Review", value: pending, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
        { label: "Approved Students", value: approved, icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10" },
        { label: "Rejected", value: rejected, icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl border border-white/10 bg-card flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                        <stat.icon size={20} />
                    </div>
                </div>
            ))}
        </div>
    );
}
