import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitCommit, Activity } from 'lucide-react';

// This interface matches the JSON we will generate
interface CommitActivity {
    date: string;
    count: number;
    intensity: number; // 0-4
}

interface Props {
    data?: CommitActivity[];
}

export const ActivityVisualizer = ({ data = [] }: Props) => {
    const [activities, setActivities] = useState<CommitActivity[]>(data);

    useEffect(() => {
        if (data.length === 0) {
            // Load from JSON
            import('../data/activity.json')
                .then((module) => {
                    const loadedData = module.default as CommitActivity[];
                    if (loadedData && loadedData.length > 0) {
                        setActivities(loadedData);
                    } else {
                        // Fallback Mock if JSON is empty/missing
                        generateMock();
                    }
                })
                .catch(() => generateMock());
        } else {
            setActivities(data);
        }
    }, [data]);

    const generateMock = () => {
        const mockData = Array.from({ length: 14 }).map((_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 10),
            intensity: Math.floor(Math.random() * 5)
        })).reverse();
        setActivities(mockData);
    };

    return (
        <div className="bg-black/40 backdrop-blur-md border border-cyber-magenta/30 p-4 rounded-sm neon-border-sm-pink h-full flex flex-col">
            <div className="flex items-center gap-2 text-cyber-magenta mb-4 border-b border-cyber-magenta/20 pb-2">
                <Activity size={16} className="animate-pulse" />
                <span className="font-bold tracking-widest">NEURAL ACTIVITY</span>
            </div>

            <div className="flex items-end justify-between gap-1 h-32 w-full px-2">
                {activities.map((day, i) => (
                    <motion.div
                        key={day.date}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(10, day.intensity * 25)}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="w-full bg-cyber-magenta/20 relative group"
                    >
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 bg-cyber-magenta"
                            initial={{ height: 0 }}
                            animate={{ height: '100%' }}
                            transition={{ delay: i * 0.05 + 0.2, duration: 0.5 }}
                            style={{ opacity: 0.3 + (day.intensity * 0.15) }}
                        />

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black border border-cyber-magenta text-cyber-magenta text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                            {day.date}: {day.count} OPS
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-auto pt-4 flex items-center justify-between text-[10px] text-cyber-magenta/50 font-mono">
                <div className="flex items-center gap-1">
                    <GitCommit size={10} />
                    <span>GIT.LOG.SYNC</span>
                </div>
                <div>Last 14 Cycles</div>
            </div>
        </div>
    );
};
