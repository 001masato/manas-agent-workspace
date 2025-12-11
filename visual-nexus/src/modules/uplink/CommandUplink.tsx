
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, Activity, Shield, Wifi, Terminal as TerminalIcon, Check, Brain } from 'lucide-react';
import { XPService } from '../gamification/XPService';
import { CommandService, type Command } from './CommandService';
import { useOverdrive } from '../overdrive/OverdriveContext';
import { BrainLog } from './BrainLog';

export const CommandUplink = () => {
    const { triggerActivity } = useOverdrive();
    const [isActive, setIsActive] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [commands, setCommands] = useState<Command[]>([]);
    const terminalRef = useRef<HTMLDivElement>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'terminal' | 'brain'>('terminal');

    useEffect(() => {
        setCommands(CommandService.getCommands());
    }, []);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${msg}`]);
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
            { msg: "SYSTEM ALL GREEN. READY FOR COMMAND.", delay: 2400 }
        ];

        sequence.forEach(({ msg, delay }) => {
            setTimeout(() => addLog(msg), delay);
        });
    };

    const handleCommandClick = (cmd: Command) => {
        if (!isActive) {
            handleLaunch();
            setTimeout(() => executeCommand(cmd), 3000); // Wait for boot if not active
        } else {
            executeCommand(cmd);
        }
    };

    const executeCommand = async (cmd: Command) => {
        navigator.clipboard.writeText(cmd.command);
        setCopiedId(cmd.id);

        addLog(`COMMAND SELECTED: ${cmd.label}`);
        addLog(`> ${cmd.command}`);

        // --- BRIDGE EXECUTION ---
        if (cmd.id === 'memory_sync') {
            addLog(`[BRIDGE] INITIATING SECURE SYNC PROTOCOL...`);
            try {
                const res = await fetch('http://localhost:5174/api/sync', { method: 'POST' });
                const data = await res.json();
                if (res.ok) {
                    addLog(`[BRIDGE] SUCCESS: SYNC COMPLETE.`);
                    addLog(`[BRIDGE] OUTPUT: ${data.message}`);
                } else {
                    addLog(`[BRIDGE] ERROR: ${data.error}`);
                }
            } catch (e) {
                addLog(`[BRIDGE] CONNECTION FAILED: Bridge Server Offline (Port 5174)`);
                addLog(`[HINT] Run 'node server.js' to enable Bridge capabilities.`);
            }
        } else {
            addLog(`SUCCESS: Copied to Clipboard. Ready to execute.`);
        }
        // ------------------------

        triggerActivity(15);

        // Add XP
        const { leveledUp, newLevel } = XPService.addXP(cmd.xpReward, `CMD: ${cmd.label}`);
        if (leveledUp) {
            addLog(`*** LEVEL UP! SYSTEM UPGRADED TO LEVEL ${newLevel} ***`);
        } else {
            addLog(`XP GAINED: +${cmd.xpReward} XP`);
        }

        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="w-full max-w-6xl mt-12 mb-24 glass-panel p-8 border-t-4 border-t-cyber-magenta">
            <h2 className="text-xl neon-text flex items-center gap-2 mb-8 justify-between">
                <span className="flex items-center gap-2"><Activity className="animate-pulse" /> COMMAND UPLINK</span>

                {/* View Switcher */}
                <div className="flex bg-black/50 border border-cyber-cyan/30 rounded p-1 gap-1">
                    <button
                        onClick={() => setViewMode('terminal')}
                        className={`p-2 rounded transition-all ${viewMode === 'terminal' ? 'bg-cyber-cyan text-black' : 'text-cyber-cyan hover:bg-cyber-cyan/10'}`}
                        title="Terminal View"
                    >
                        <TerminalIcon size={16} />
                    </button>
                    <button
                        onClick={() => setViewMode('brain')}
                        className={`p-2 rounded transition-all ${viewMode === 'brain' ? 'bg-cyber-magenta text-black' : 'text-cyber-magenta hover:bg-cyber-magenta/10'}`}
                        title="Brain View"
                    >
                        <Brain size={16} />
                    </button>
                </div>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Status Panel */}
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-4">
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
                            relative overflow-hidden group py-6 px-8 font-bold text-xl tracking-widest transition-all duration-300 w-full
                            ${isActive
                                ? 'bg-cyber-magenta/20 text-cyber-magenta border border-cyber-magenta cursor-not-allowed hidden' // Hide when active to show commands
                                : 'bg-cyber-dark text-cyber-cyan border border-cyber-cyan hover:bg-cyber-cyan/10 hover:shadow-[0_0_30px_rgba(0,243,255,0.3)]'}
                        `}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            <Power size={24} />
                            SYSTEM LAUNCH
                        </span>
                    </button>

                    {/* Quick Commands Grid (Shows when Active) */}
                    <AnimatePresence>
                        {isActive && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="grid grid-cols-1 gap-3"
                            >
                                <div className="text-xs text-cyber-cyan/50 tracking-widest mb-2 border-b border-cyber-cyan/20 pb-1">QUICK COMMANDS</div>
                                {commands.map(cmd => (
                                    <button
                                        key={cmd.id}
                                        onClick={() => handleCommandClick(cmd)}
                                        className="flex items-center justify-between p-3 border border-cyber-cyan/30 bg-cyber-cyan/5 hover:bg-cyber-cyan/20 transition-all group text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <cmd.icon size={16} className="text-cyber-cyan group-hover:text-white" />
                                            <span className="text-sm font-bold text-cyber-cyan group-hover:text-white">{cmd.label}</span>
                                        </div>
                                        {copiedId === cmd.id ? (
                                            <Check size={14} className="text-green-500" />
                                        ) : (
                                            <div className="text-[10px] text-cyber-cyan/30 group-hover:text-cyber-cyan/70 font-mono">+{cmd.xpReward} XP</div>
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Terminal / Brain Window */}
                <div className="col-span-1 lg:col-span-2 h-full min-h-[400px]">
                    {viewMode === 'brain' ? (
                        <BrainLog />
                    ) : (
                        <div className="h-full bg-black/80 border border-cyber-cyan/30 p-4 font-mono text-sm overflow-hidden relative flex flex-col">
                            <div className="absolute top-0 left-0 right-0 h-6 bg-cyber-cyan/10 border-b border-cyber-cyan/20 flex items-center px-4 justify-between shrink-0">
                                <span className="text-xs text-cyber-cyan flex items-center gap-2"><TerminalIcon size={12} /> TERMINAL OUTPUT</span>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                </div>
                            </div>

                            <div
                                ref={terminalRef}
                                className="mt-6 flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-1 px-1"
                            >
                                <AnimatePresence mode="popLayout">
                                    {logs.length === 0 && !isActive && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.5 }}
                                            className="text-cyber-cyan/50 italic"
                                        >
                                            System Standby... Initiate Uplink to access command protocols.
                                        </motion.div>
                                    )}
                                    {logs.map((log, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-green-400 font-mono text-xs md:text-sm break-all"
                                        >
                                            <span className="text-cyber-magenta mr-2">{'>'}</span>
                                            {log}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Input Area - Fixed at Bottom */}
                            {isActive && (
                                <div className="shrink-0 pt-2 mt-2 border-t border-cyber-cyan/20 flex items-center gap-2 text-green-500 bg-black/50">
                                    <span className="text-cyber-magenta font-bold animate-pulse">{'>_'}</span>
                                    <input
                                        type="text"
                                        autoFocus
                                        className="bg-transparent border-none outline-none text-green-500 font-mono w-full placeholder-green-500/30 h-8"
                                        placeholder="ENTER COMMAND..."
                                        onKeyDown={(e) => {
                                            triggerActivity(2); // Boost on type
                                            if (e.key === 'Enter') {
                                                const val = e.currentTarget.value.trim();
                                                if (val) {
                                                    addLog(val);

                                                    // Command Logic
                                                    const lower = val.toLowerCase();
                                                    if (lower.includes('access miyabi') || lower.includes('miyabi')) {
                                                        addLog('*** INITIATING TRANSFER TO MIYABI CORE ***');
                                                        window.dispatchEvent(new CustomEvent('activate-core', { detail: { core: 'MIYABI' } }));
                                                    } else if (lower.includes('access kamui') || lower.includes('kamui')) {
                                                        addLog('*** INITIATING TRANSFER TO KAMUI CORE ***');
                                                        window.dispatchEvent(new CustomEvent('activate-core', { detail: { core: 'KAMUI' } }));
                                                    } else if (lower.includes('system reboot')) {
                                                        window.location.reload();
                                                    } else if (lower === 'clear') {
                                                        setLogs([]);
                                                    } else {
                                                        setTimeout(() => addLog(`ERROR: UNKNOWN COMMAND PROTOCOL [${val}]`), 500);
                                                    }

                                                    e.currentTarget.value = '';
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
