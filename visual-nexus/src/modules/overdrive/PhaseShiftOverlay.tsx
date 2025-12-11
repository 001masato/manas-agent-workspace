import React from 'react';
import { useOverdrive } from './OverdriveContext';
import { motion, AnimatePresence } from 'framer-motion';

export const PhaseShiftOverlay: React.FC = () => {
    const { phase } = useOverdrive();

    // Effect variants
    const overlayVariants = {
        NORMAL: {
            opacity: 0,
            background: 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,240,255,0) 100%)'
        },
        ACTIVE: {
            opacity: 0.2,
            background: 'radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(255,170,0,0.3) 100%)'
        },
        OVERDRIVE: {
            opacity: 0.4,
            background: 'radial-gradient(circle, rgba(0,0,0,0) 30%, rgba(255,0,0,0.5) 100%)'
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            <AnimatePresence>
                {/* Color Grading Overlay */}
                <motion.div
                    key="grading"
                    className="absolute inset-0"
                    variants={overlayVariants}
                    initial="NORMAL"
                    animate={phase}
                    transition={{ duration: 1 }}
                />

                {/* Overdrive Particles (Simplified as floating specks) */}
                {phase === 'OVERDRIVE' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0"
                    >
                        {/* Simple dust particles via CSS or multiple divs could go here. 
                             Keeping it clean for now with just a scanline effect. */}
                        <div className="w-full h-full bg-[url('/scanline.png')] opacity-10 animate-pulse"
                            style={{ backgroundSize: '100% 4px' }} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
