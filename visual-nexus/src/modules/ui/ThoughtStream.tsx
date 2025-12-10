import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThinkingService, type ThoughtLog } from '../core/ThinkingService';
import { Activity, Cpu } from 'lucide-react';

export const ThoughtStream = () => {
    const [thoughts, setThoughts] = useState<ThoughtLog[]>([]);

    useEffect(() => {
        // Initial thoughts
        setThoughts([ThinkingService.getRandomThought()]);

        const interval = setInterval(() => {
            const newThought = ThinkingService.getRandomThought();
            setThoughts(prev => [newThought, ...prev].slice(0, 5)); // Keep last 5
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed top-24 right-8 w-80 font-mono text-xs z-30 pointer-events-none">
            <div className="flex items-center gap-2 text-cyber-cyan/50 mb-2 border-b border-cyber-cyan/20 pb-1">
                <Cpu size={14} className="animate-pulse" />
                <span className="tracking-widest">NEURAL STREAM</span>
            </div>

            <div className="flex flex-col gap-2">
                <AnimatePresence>
                    {thoughts.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: 20, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-black/40 backdrop-blur-md border-l-2 border-cyber-cyan/30 p-2"
                        >
                            <div className="flex justify-between text-[10px] text-cyber-cyan/40 mb-1">
                                <span>{log.timestamp}</span>
                                <span className="uppercase">{log.type}</span>
                            </div>
                            <div className="text-cyber-cyan/80 font-bold">
                                <span className="mr-2 text-cyber-magenta">{'>'}</span>{log.message}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
