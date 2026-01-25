import { motion } from 'framer-motion';

export default function ProgressBar({
    current,
    total,
    showPercentage = true,
    showLabel = true,
    size = 'md',
    color = 'primary'
}) {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

    const sizeClasses = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3'
    };

    const colorClasses = {
        primary: 'bg-primary',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };

    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-muted-foreground">
                        Progress: {current} / {total}
                    </span>
                    {showPercentage && (
                        <span className="font-semibold">{percentage}%</span>
                    )}
                </div>
            )}
            <div className={`w-full bg-muted rounded-full overflow-hidden ${sizeClasses[size]}`}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
                />
            </div>
        </div>
    );
}
