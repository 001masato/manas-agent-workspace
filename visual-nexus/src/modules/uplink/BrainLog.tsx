
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, Circle, Archive, Clock } from 'lucide-react';

interface BrainData {
    lastSync: string;
    memories: any[];
    tasks: any[];
    stats: any;
}

export const BrainLog = () => {
    const [data, setData] = useState<BrainData | null>(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'tasks' | 'memories'>('tasks');

    const fetchData = async () => {
        try {
            const res = await fetch('/brain_dump.json?t=' + new Date().getTime());
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (e) {
            console.error("Failed to fetch brain dump", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="text-cyber-cyan animate-pulse p-4">CONNECTING TO NEURAL ARCHIVE...</div>;
    if (!data) return <div className="text-red-500 p-4">SYSTEM ERROR: MEMORY CORE OFFLINE</div>;

    return (
        <div className="flex flex-col h-full bg-black/80 font-mono text-sm overflow-hidden relative border border-cyber-cyan/30">
            {/* Header */}
            <div className="shrink-0 bg-cyber-cyan/10 border-b border-cyber-cyan/20 p-2 flex justify-between items-center">
                <div className="flex gap-4">
                    <button
                        onClick={() => setView('tasks')}
                        className={`flex items-center gap-2 px-3 py-1 text-xs font-bold transition-colors ${view === 'tasks' ? 'bg-cyber-cyan text-black' : 'text-cyber-cyan hover:bg-cyber-cyan/20'}`}
                    >
                        <Brain size={12} /> ACTIVE OBJECTIVES
                    </button>
                    <button
                        onClick={() => setView('memories')}
                        className={`flex items-center gap-2 px-3 py-1 text-xs font-bold transition-colors ${view === 'memories' ? 'bg-cyber-magenta text-black' : 'text-cyber-magenta hover:bg-cyber-magenta/20'}`}
                    >
                        <Archive size={12} /> MEMORY BANK
                    </button>
                </div>
                <div className="text-[10px] text-cyber-cyan/50">
                    SYNC: {data.lastSync}
                </div>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-4">
                <AnimatePresence mode="wait">
                    {view === 'tasks' ? (
                        <motion.div
                            key="tasks"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col gap-2"
                        >
                            {data.tasks.map((task: any) => (
                                <div
                                    key={task.id}
                                    className={`flex items-start gap-2 p-2 border-l-2 ${task.status === 'completed' ? 'border-green-500/50 bg-green-500/5 text-green-500/70' :
                                            task.status === 'in_progress' ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500' :
                                                'border-cyber-cyan/30 text-cyber-cyan'
                                        }`}
                                    style={{ marginLeft: `${task.indent * 10}px` }}
                                >
                                    {task.status === 'completed' ? <CheckCircle size={14} className="shrink-0 mt-0.5" /> :
                                        task.status === 'in_progress' ? <Clock size={14} className="shrink-0 mt-0.5 animate-spin-slow" /> :
                                            <Circle size={14} className="shrink-0 mt-0.5 opacity-50" />}

                                    <span className={`${task.status === 'completed' ? 'line-through' : ''}`}>
                                        {task.text}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="memories"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col gap-4"
                        >
                            {data.memories.map((mem: any) => (
                                <div key={mem.id} className="border border-cyber-magenta/30 bg-cyber-magenta/5 p-3 relative group hover:bg-cyber-magenta/10 transition-colors">
                                    <div className="absolute top-0 right-0 p-1 bg-cyber-magenta text-black text-[10px] font-bold">
                                        {mem.timestamp}
                                    </div>
                                    <h4 className="text-cyber-magenta font-bold mb-1">{mem.title}</h4>
                                    <p className="text-cyber-magenta/80 text-xs">{mem.context}</p>
                                    <div className="flex gap-2 mt-2">
                                        {mem.tags.map((tag: string) => (
                                            <span key={tag} className="text-[10px] border border-cyber-magenta/50 px-1 rounded text-cyber-magenta/70">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Stats */}
            <div className="shrink-0 border-t border-cyber-cyan/20 p-2 bg-black/50 text-[10px] text-cyber-cyan/50 flex justify-between">
                <span>TASKS: {data.stats.taskCount} ({data.stats.completedTasks} DONE)</span>
                <span>MEMORIES: {data.stats.memoryCount}</span>
            </div>
        </div>
    );
};
