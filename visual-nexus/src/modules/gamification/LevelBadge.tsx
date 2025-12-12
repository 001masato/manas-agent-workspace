import { useState, useEffect } from 'react';
import { XPService, type XPData } from './XPService';
import { motion, AnimatePresence } from 'framer-motion';

export const LevelBadge = () => {
    const [data, setData] = useState<XPData>(XPService.getData());
    const [progress, setProgress] = useState(0);

    const updateState = () => {
        setData(XPService.getData());
        setProgress(XPService.getProgress());
    };

    useEffect(() => {
        // Initial load
        updateState();

        // Listen for updates
        window.addEventListener('xp-update', updateState);
        return () => window.removeEventListener('xp-update', updateState);
    }, []);

    return (
        <div className="fixed top-6 right-6 z-50 flex flex-col items-end pointer-events-none select-none">
            {/* Level Hexagon */}
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className="text-[10px] text-cyber-cyan/70 tracking-widest font-mono">OPERATOR LEVEL</div>
                    <div className="text-sm font-bold text-white tracking-wider font-mono">{data.totalCommands} OPS</div>
                </div>

                <div className="relative group">
                    <div className="w-16 h-16 bg-cyber-dark/90 border-2 border-cyber-cyan flex flex-col items-center justify-center relative overflow-hidden transform rotate-45 shadow-[0_0_20px_rgba(0,243,255,0.3)]">
                        <div className="transform -rotate-45 flex flex-col items-center">
                            <span className="text-xs text-cyber-cyan font-bold">LVL</span>
                            <span className="text-2xl font-black text-white leading-none">{data.level}</span>
                        </div>

                        {/* Progress Fill (Background) */}
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-cyber-cyan/20 transition-all duration-1000 transform -rotate-45 origin-bottom scale-150"
                            style={{ height: `${progress}%`, width: '200%' }}
                        />
                    </div>

                    {/* Level Up Flash Effect */}
                    <AnimatePresence>
                        <motion.div
                            key={data.level}
                            initial={{ opacity: 0, scale: 2 }}
                            animate={{ opacity: 0, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white rounded-full"
                        />
                    </AnimatePresence>
                </div>
            </div>

            {/* XP Bar */}
            <div className="w-48 h-1 bg-gray-800 mt-2 relative overflow-hidden rounded-full">
                <div
                    className="h-full bg-gradient-to-r from-cyber-cyan to-blue-500 shadow-[0_0_10px_rgba(0,243,255,0.8)] transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="text-[10px] text-gray-500 font-mono mt-1">
                NEXT LEVEL: {Math.floor(100 - progress)}% REQUIRED
            </div>
        </div>
    );
};
