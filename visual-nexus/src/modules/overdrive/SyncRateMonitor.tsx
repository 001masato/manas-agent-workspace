import React from 'react';
import { useOverdrive } from './OverdriveContext';
import { motion } from 'framer-motion';

export const SyncRateMonitor: React.FC = () => {
    const { syncRate, phase } = useOverdrive();

    // Color based on phase
    const getColor = () => {
        if (phase === 'OVERDRIVE') return '#ff3333'; // Red
        if (phase === 'ACTIVE') return '#ffaa00'; // Orange
        return '#00f0ff'; // Cyan
    };

    const color = getColor();

    return (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-4 pointer-events-none select-none">
            {/* EKG Line Container (Simplified visual) */}
            <div className="hidden md:flex flex-col items-end opacity-80">
                <div className="text-xs uppercase tracking-widest text-slate-400">Sync Rate</div>
                <div className="text-2xl font-mono font-bold" style={{ color, textShadow: `0 0 10px ${color}` }}>
                    {syncRate.toFixed(1)}%
                </div>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-16 h-16">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#1e293b"
                        strokeWidth="4"
                        fill="transparent"
                    />
                    {/* Foreground Circle */}
                    <motion.circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke={color}
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={175} // 2 * pi * 28 approx 175
                        strokeDashoffset={175 - (175 * syncRate) / 100}
                        strokeLinecap="round"
                        animate={{ stroke: color }}
                        style={{ filter: `drop-shadow(0 0 5px ${color})` }}
                    />
                </svg>

                {/* Center Pulse */}
                <motion.div
                    className="absolute inset-0 m-auto rounded-full"
                    style={{ backgroundColor: color, width: '10px', height: '10px' }}
                    animate={{
                        opacity: [0.2, 0.8, 0.2],
                        scale: phase === 'OVERDRIVE' ? [1, 1.2, 1] : [1, 1.05, 1],
                    }}
                    transition={{
                        duration: phase === 'OVERDRIVE' ? 0.4 : phase === 'ACTIVE' ? 0.8 : 1.5,
                        repeat: Infinity
                    }}

                />
            </div>
        </div>
    );
};
