import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LevelUpNotification = () => {
    const [show, setShow] = useState(false);
    const [level, setLevel] = useState(0);

    useEffect(() => {
        const handleLevelUp = (e: Event) => {
            const customEvent = e as CustomEvent;
            setLevel(customEvent.detail.level);
            setShow(true);

            // Auto hide after 5 seconds
            setTimeout(() => setShow(false), 5000);
        };

        window.addEventListener('level-up', handleLevelUp);
        return () => window.removeEventListener('level-up', handleLevelUp);
    }, []);

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, rotateX: 90 }}
                        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{ type: "spring", damping: 12 }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_0_25px_rgba(234,179,8,0.8)] filter">
                            LEVEL UP!
                        </h1>
                        <div className="text-4xl text-white font-mono mt-4 tracking-[1em] border-t border-b border-white/30 py-4">
                            LEVEL {level} REACHED
                        </div>
                        <div className="mt-8 text-cyber-cyan animate-pulse">
                            SYSTEM CAPABILITIES EXPANDED
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
