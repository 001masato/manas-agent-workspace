import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, Activity, Shield, Wifi } from 'lucide-react';

export const CommandUplink = () => {
    const [isActive, setIsActive] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const terminalRef = useRef<HTMLDivElement>(null);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs]);

    const handleLaunch = () => {
        if (isActive) return;
        setIsActive(true);
        setLogs([]);

        const sequence = [
            { msg: "INITIALIZING UPLINK PROTOCOL...", delay: 0 },
            { msg: "ESTABLISHING SECURE CONNECTION...", delay: 800 },
            { msg: "VERIFYING BIOMETRICS... MATCH CONFIRMED.", delay: 1600 },
            { msg: "SYNCING MEMORY BANKS to GITHUB...", delay: 2400 },
            { msg: "SCANNING FOR NEW SKILL VECTORS...", delay: 3200 },
            { msg: "SYSTEM ALL GREEN. READY FOR COMMAND.", delay: 4000 }
        ];

        sequence.forEach(({ msg, delay }) => {
            setTimeout(() => addLog(msg), delay);
        });

        setTimeout(() => setIsActive(false), 5000);
    };

    return (
        <div className="w-full max-w-6xl mt-12 mb-24 glass-panel p-8 border-t-4 border-t-cyber-magenta">
            <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Control Panel */}
                <div className="w-full md:w-1/3 flex flex-col gap-6">
                    <h2 className="text-xl neon-text flex items-center gap-2">
                        <Activity className="animate-pulse" /> COMMAND UPLINK
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-4 border border-cyber-cyan/30 bg-cyber-dark/50 flex flex-col items-center gap-2">
                            <Shield size={20} className="text-cyber-cyan" />
                            <span className="text-xs text-cyber-cyan/70">FIREWALL</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_#00ff00]" />
                        </div>
                        <div className="p-4 border border-cyber-cyan/30 bg-cyber-dark/50 flex flex-col items-center gap-2">
                            <Wifi size={20} className="text-cyber-cyan" />
                            <span className="text-xs text-cyber-cyan/70">NETWORK</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_#00ff00]" />
                        </div>
                    </div>

                    <button
                        onClick={handleLaunch}
                        disabled={isActive}
                        className={`
                            relative overflow-hidden group py-6 px-8 font-bold text-xl tracking-widest transition-all duration-300
                            ${isActive
                                ? 'bg-cyber-magenta/20 text-cyber-magenta border border-cyber-magenta cursor-not-allowed'
                                : 'bg-cyber-dark text-cyber-cyan border border-cyber-cyan hover:bg-cyber-cyan/10 hover:shadow-[0_0_30px_rgba(0,243,255,0.3)]'}
                        `}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            <Power size={24} />
                            {isActive ? 'PROCESSING...' : 'SYSTEM LAUNCH'}
                        </span>
                        {!isActive && (
                            <div className="absolute inset-0 bg-cyber-cyan/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        )}
                    </button>
                </div>

                {/* Terminal Window */}
                <div className="w-full md:w-2/3">
                    <div className="h-64 bg-black/80 border border-cyber-cyan/30 p-4 font-mono text-sm overflow-hidden relative">
                        <div className="absolute top-0 left-0 right-0 h-6 bg-cyber-cyan/10 border-b border-cyber-cyan/20 flex items-center px-4 justify-between">
                            <span className="text-xs text-cyber-cyan">TERMINAL OUTPUT</span>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                            </div>
                        </div>

                        <div
                            ref={terminalRef}
                            className="mt-6 h-full overflow-y-auto custom-scrollbar flex flex-col gap-1 pb-4"
                        >
                            <AnimatePresence>
                                {logs.length === 0 && !isActive && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.5 }}
                                        className="text-cyber-cyan/50 italic"
                                    >
                                        Waiting for command input...
                                    </motion.div>
                                )}
                                {logs.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-green-400"
                                    >
                                        <span className="text-cyber-magenta mr-2">{'>'}</span>
                                        {log}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {isActive && (
                                <motion.div
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className="w-2 h-4 bg-green-400"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
