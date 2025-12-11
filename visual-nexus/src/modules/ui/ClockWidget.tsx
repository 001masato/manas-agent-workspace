import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

export const ClockWidget: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'short'
        });
    };

    return (
        <div className="flex items-center gap-4 px-6 py-3 border-l border-r border-cyber-cyan/30 bg-black/40 backdrop-blur-sm">
            <ClockIcon className="text-cyber-cyan animate-pulse" size={24} />
            <div className="flex flex-col items-end">
                <div className="text-2xl font-mono font-bold text-white tracking-widest leading-none" style={{ textShadow: '0 0 10px rgba(0,240,255,0.5)' }}>
                    {formatTime(time)}
                </div>
                <div className="text-xs text-cyber-cyan/50 font-bold tracking-[0.2em] mt-1">
                    {formatDate(time)}
                </div>
            </div>
        </div>
    );
};
