import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Activity, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import { audioService } from '../core/AudioService';

export const SystemMonitorWidget = () => {
    const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');
    const [lastCheck, setLastCheck] = useState<string>('--:--:--');

    const checkStatus = async () => {
        // ... (fetch logic remains)
        try {
            await fetch('http://localhost:5174', { mode: 'no-cors', method: 'HEAD' });
            if (status !== 'online') audioService.playActive(); // Sound on status change
            setStatus('online');
        } catch (e) {
            if (status === 'online') audioService.playAlert();
            setStatus('offline');
        }
        setLastCheck(new Date().toLocaleTimeString());
    };

    // ... useEffect ...

    return (
        <div
            className="bg-black/40 backdrop-blur-md border border-cyber-cyan/30 p-4 rounded-sm neon-border-sm h-full flex flex-col justify-between hover:bg-white/5 transition-colors cursor-crosshair"
            onMouseEnter={() => audioService.playHover()}
            onClick={() => audioService.playClick()}
        >
            <div className="flex items-center justify-between border-b border-cyber-cyan/20 pb-2 mb-2">
                <div className="flex items-center gap-2 text-cyber-cyan">
                    <Server size={16} />
                    <span className="font-bold tracking-widest text-xs">NEXUS LINK</span>
                </div>
                <div className="flex items-center gap-1">
                    {status === 'checking' && <Activity size={14} className="text-yellow-400 animate-spin" />}
                    {status === 'online' && <Wifi size={14} className="text-green-400" />}
                    {status === 'offline' && <WifiOff size={14} className="text-red-500" />}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-cyber-cyan/60">TARGET:</span>
                    <span className="text-white font-mono">SHIFT-APP-ULTIMATE</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-cyber-cyan/60">PORT:</span>
                    <span className="text-cyber-magenta font-mono">5174</span>
                </div>

                <div className="bg-black/50 p-2 rounded border border-cyber-cyan/10 mt-1">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-cyber-cyan/50">STATUS</span>
                        <motion.span
                            key={status}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`text-xs font-bold font-mono ${status === 'online' ? 'text-green-400 shadow-green-500/50 text-shadow-sm' :
                                status === 'offline' ? 'text-red-500' : 'text-yellow-400'
                                }`}
                        >
                            {status.toUpperCase()}
                        </motion.span>
                    </div>
                    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                        {status === 'online' && (
                            <motion.div
                                className="h-full bg-green-500 box-shadow-[0_0_10px_#22c55e]"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="text-[10px] text-cyber-cyan/30 text-right mt-2 font-mono">
                LAST PING: {lastCheck}
            </div>
        </div>
    );
};
