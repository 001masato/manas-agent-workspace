import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InsightService, type Insight } from '../core/InsightService';
import { Sparkles } from 'lucide-react';

interface Props {
    onComplete: () => void;
}

export const GreetingOverlay = ({ onComplete }: Props) => {
    const [insight, setInsight] = useState<Insight | null>(null);

    useEffect(() => {
        setInsight(InsightService.getDailyInsight());

        // Auto dismiss after sequence
        const timer = setTimeout(() => {
            onComplete();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!insight) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center pointer-events-none"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyber-cyan/10 via-black to-black" />

            <div className="relative z-10 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <Sparkles className="w-16 h-16 text-cyber-cyan mx-auto mb-6 animate-spin-slow" />
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tighter"
                >
                    {insight.greeting}
                </motion.h1>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1, duration: 1 }}
                    className="h-px bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent mx-auto mb-6 max-w-2xl"
                />

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-xl text-cyber-magenta font-mono tracking-widest"
                >
                    {insight.mission}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 2.5 }}
                    className="mt-12 text-xs text-cyber-cyan/30 font-mono"
                >
                    {insight.subtext}
                </motion.div>
            </div>
        </motion.div>
    );
};
