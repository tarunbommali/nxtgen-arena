import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, trend, color = 'primary' }) {
    const colorClasses = {
        primary: 'bg-primary/10 text-primary',
        success: 'bg-green-500/10 text-green-500',
        warning: 'bg-yellow-500/10 text-yellow-500',
        info: 'bg-blue-500/10 text-blue-500',
        danger: 'bg-red-500/10 text-red-500'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6 hover:shadow-lg transition-all duration-300"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-3`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{label}</p>
                    <p className="text-3xl font-bold">{value}</p>
                    {trend && (
                        <p className={`text-sm mt-2 ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                            {trend.positive ? '↑' : '↓'} {trend.value}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
