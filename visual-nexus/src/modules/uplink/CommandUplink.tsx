
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, Activity, Shield, Wifi, Terminal as TerminalIcon, Check, Brain, Zap } from 'lucide-react';
import { XPService } from '../gamification/XPService';
import { CommandService, type Command } from './CommandService';
import { useOverdrive } from '../overdrive/OverdriveContext';
import { BrainLog } from './BrainLog';
import { SkillArsenal } from '../skills/SkillArsenal';
import { audioService } from '../core/AudioService';
import { jobManager, type Job } from '../core/JobManager';

export const CommandUplink = () => {
    const { triggerActivity } = useOverdrive();
    const [isActive, setIsActive] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [commands, setCommands] = useState<Command[]>([]);
    const terminalRef = useRef<HTMLDivElement>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'terminal' | 'brain' | 'skills'>('terminal');
    const [activeJobs, setActiveJobs] = useState<Job[]>([]);

    useEffect(() => {
        setCommands(CommandService.getCommands());

        // Job Subscription
        const unsubscribe = jobManager.subscribe((jobs) => {
            const running = jobs.filter(j => j.status === 'running');
            setActiveJobs(running);

            // Auto-log finished jobs
            const recent = jobs.filter(j => (j.status === 'success' || j.status === 'error') && j.endTime && (Date.now() - j.endTime < 1000));
            recent.forEach(j => {
                if (j.status === 'error') {
                    // addLog(`[ALERT] Job Failed: ${j.label}`); // Logging handled by executeCommand mostly, but this catches background ones
                }
            });
        });
        return () => unsubscribe();
    }, []);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-19), `[${new Date().toLocaleTimeString()}] ${msg}`]);
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
        audioService.playActive();

        const sequence = [
            { msg: "INITIALIZING UPLINK PROTOCOL...", delay: 0, speak: "システム、起動シーケンスを開始します。" },
            { msg: "ESTABLISHING SECURE CONNECTION...", delay: 800, speak: "セキュア接続、確立中。" },
            { msg: "VERIFYING BIOMETRICS... MATCH CONFIRMED.", delay: 1600, speak: "生体認証、確認。" },
            { msg: "SYSTEM ALL GREEN. READY FOR COMMAND.", delay: 2400, speak: "全システム、オールグリーン。コマンド入力待機中。" }
        ];

        sequence.forEach(({ msg, delay, speak }) => {
            setTimeout(() => {
                addLog(msg);
                if (speak) audioService.speak(speak);
            }, delay);
        });
    };

    const handleCommandClick = (cmd: Command) => {
        if (!isActive) {
            handleLaunch();
            setTimeout(() => executeCommand(cmd), 3000);
        } else {
            executeCommand(cmd);
        }
    };

    const executeCommand = async (cmd: Command) => {
        navigator.clipboard.writeText(cmd.command);
        setCopiedId(cmd.id);

        addLog(`COMMAND SELECTED: ${cmd.label}`);
        addLog(`> ${cmd.command}`);
        audioService.playClick();

        // Async Action Execution
        if (cmd.action) {
            addLog(`[SYSTEM] Initiating Asynchronous Protocol...`);
            try {
                // If it's a skill sync, maybe auto switch to skills view?
                if (cmd.id === 'skills_sync') {
                    // Optionally switch: setViewMode('skills');
                }
                await CommandService.execute(cmd);
                addLog(`[SYSTEM] Protocol Execution Started.`);
            } catch (e: any) {
                addLog(`[SYSTEM] Protocol Failed: ${e.message}`);
            }
        }

        triggerActivity(15);
        const { leveledUp, newLevel } = XPService.addXP(cmd.xpReward, `CMD: ${cmd.label}`);
        if (leveledUp) {
            addLog(`*** LEVEL UP! SYSTEM UPGRADED TO LEVEL ${newLevel} ***`);
            audioService.playSuccess();
        } else {
            addLog(`XP GAINED: +${cmd.xpReward} XP`);
        }

        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="w-full max-w-6xl mt-12 mb-24 glass-panel p-8 border-t-4 border-t-cyber-magenta bg-black/40 backdrop-blur-md">
            <h2 className="text-xl neon-text flex items-center gap-2 mb-8 justify-between">
                <span className="flex items-center gap-2">
                    <Activity className="animate-pulse" /> COMMAND UPLINK
                </span>

                <div className="flex items-center gap-4">
                    {/* Active Jobs Indicator */}
                    <AnimatePresence>
                        {activeJobs.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-2 text-yellow-400 border border-yellow-400/30 px-3 py-1 rounded bg-yellow-400/10"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                </span>
                                <span className="text-xs font-bold tracking-widest">{activeJobs.length} ACTIVE PROCESSES</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* View Switcher */}
                    <div className="flex bg-black/50 border border-cyber-cyan/30 rounded p-1 gap-1">
                        <button
                            onClick={() => setViewMode('terminal')}
                            className={`p-2 rounded transition-all ${viewMode === 'terminal' ? 'bg-cyber-cyan text-black shadow-[0_0_10px_rgba(0,255,255,0.5)]' : 'text-cyber-cyan hover:bg-cyber-cyan/10'}`}
                            title="Terminal View"
                        >
                            <TerminalIcon size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('brain')}
                            className={`p-2 rounded transition-all ${viewMode === 'brain' ? 'bg-cyber-magenta text-black shadow-[0_0_10px_rgba(255,0,255,0.5)]' : 'text-cyber-magenta hover:bg-cyber-magenta/10'}`}
                            title="Brain View"
                        >
                            <Brain size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('skills')}
                            className={`p-2 rounded transition-all ${viewMode === 'skills' ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(0,255,0,0.5)]' : 'text-green-500 hover:bg-green-500/10'}`}
                            title="Skill Arsenal"
                        >
                            <Zap size={16} />
                        </button>
                    </div>
                </div>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">

                {/* Left: Status & Commands */}
                <div className="flex flex-col gap-6 h-full overflow-hidden">
                    <div className="grid grid-cols-2 gap-4 shrink-0">
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

                    {!isActive ? (
                        <button
                            onClick={handleLaunch}
                            className="bg-cyber-dark text-cyber-cyan border border-cyber-cyan hover:bg-cyber-cyan/10 hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] py-6 px-8 font-bold text-xl tracking-widest transition-all duration-300 w-full"
                        >
                            <span className="flex items-center justify-center gap-3">
                                <Power size={24} /> SYSTEM LAUNCH
                            </span>
                        </button>
                    ) : (
                        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3">
                            <div className="text-xs text-cyber-cyan/50 tracking-widest border-b border-cyber-cyan/20 pb-1 shrink-0">I/O COMMANDS</div>
                            {commands.map(cmd => (
                                <button
                                    key={cmd.id}
                                    onClick={() => handleCommandClick(cmd)}
                                    className={`
                                        flex items-center justify-between p-3 border transition-all group text-left
                                        ${copiedId === cmd.id
                                            ? 'border-green-500 bg-green-500/10 text-green-400'
                                            : 'border-cyber-cyan/30 bg-cyber-cyan/5 hover:bg-cyber-cyan/20 text-cyber-cyan hover:border-cyber-cyan/60'}
                                    `}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <cmd.icon size={16} className={`shrink-0 ${copiedId === cmd.id ? 'text-green-400' : 'text-cyber-magenta group-hover:text-white'}`} />
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm font-bold truncate group-hover:text-white transition-colors">{cmd.label}</span>
                                            <span className="text-[10px] opacity-40 truncate font-mono">{cmd.command}</span>
                                        </div>
                                    </div>
                                    {copiedId === cmd.id ? (
                                        <Check size={14} className="text-green-500 shrink-0" />
                                    ) : (
                                        <div className="text-[10px] opacity-30 font-mono shrink-0">+{cmd.xpReward} XP</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Viewport */}
                <div className="col-span-1 lg:col-span-2 h-full bg-black/80 border border-cyber-cyan/30 flex flex-col overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                    <AnimatePresence mode="wait">
                        {/* TERMINAL VIEW */}
                        {viewMode === 'terminal' && (
                            <motion.div
                                key="terminal"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full flex flex-col"
                            >
                                <div className="absolute top-0 inset-x-0 h-6 bg-cyber-cyan/10 border-b border-cyber-cyan/20 flex items-center px-4 justify-between shrink-0 z-10">
                                    <span className="text-xs text-cyber-cyan flex items-center gap-2"><TerminalIcon size={12} /> TERMINAL OUTPUT</span>
                                    <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /><div className="w-2 h-2 rounded-full bg-yellow-500" /><div className="w-2 h-2 rounded-full bg-green-500" /></div>
                                </div>
                                <div ref={terminalRef} className="flex-grow p-4 pt-8 font-mono text-sm overflow-y-auto custom-scrollbar flex flex-col gap-1">
                                    {logs.length === 0 && !isActive && <div className="text-cyber-cyan/30 italic mt-4">System Standby...</div>}
                                    {logs.map((log, i) => (
                                        <div key={i} className="text-green-400 text-xs md:text-sm break-all leading-tight">
                                            <span className="text-cyber-magenta mr-2">{'>'}</span>{log}
                                        </div>
                                    ))}
                                </div>
                                {/* Input Line */}
                                {isActive && (
                                    <div className="shrink-0 p-2 border-t border-cyber-cyan/20 flex items-center gap-2 text-green-500 bg-black">
                                        <span className="text-cyber-magenta font-bold animate-pulse">{'>_'}</span>
                                        <input
                                            type="text"
                                            autoFocus
                                            className="bg-transparent border-none outline-none text-green-500 font-mono w-full h-6 text-sm"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const val = e.currentTarget.value.trim();
                                                    if (val) {
                                                        addLog(val);
                                                        if (val === 'clear') setLogs([]);
                                                        else if (val.includes('reboot')) window.location.reload();
                                                        else addLog(`ERROR: UNKNOWN COMMAND [${val}]`);
                                                        e.currentTarget.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* BRAIN VIEW */}
                        {viewMode === 'brain' && (
                            <motion.div
                                key="brain"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="h-full flex flex-col overflow-hidden"
                            >
                                <BrainLog />
                            </motion.div>
                        )}

                        {/* SKILLS VIEW */}
                        {viewMode === 'skills' && (
                            <motion.div
                                key="skills"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="h-full flex flex-col overflow-hidden"
                            >
                                <SkillArsenal />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};
