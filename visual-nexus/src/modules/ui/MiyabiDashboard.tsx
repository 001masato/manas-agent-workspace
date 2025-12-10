import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogicGraph } from './LogicGraph';
import { type Skill } from '../skills/SkillService';
import { XPService } from '../gamification/XPService';
import { LogicSimulator } from './LogicSimulator';
import { Copy, Terminal, X, Database, Search, Zap } from 'lucide-react';

interface Props {
    onBack: () => void;
}

export const MiyabiDashboard = ({ onBack }: Props) => {
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [simulatedSkills, setSimulatedSkills] = useState<Skill[]>([]);

    const handleNodeSelect = (skill: Skill) => {
        setSelectedSkill(skill);
        if (skill.tags?.includes('simulation')) {
            XPService.addXP(5, 'LOGIC CONSTRUCTED');
        } else {
            XPService.addXP(2, 'DATA NODE SCANNED');
        }
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery) {
            const newNodes = LogicSimulator.simulate(searchQuery);
            if (newNodes.length > 0) {
                setSimulatedSkills(newNodes);
                XPService.addXP(10, 'LOGIC SIMULATION RUN');
            } else {
                setSimulatedSkills([]);
            }
        }
    };

    // reset simulation on clear
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (e.target.value === '') setSimulatedSkills([]);
    };

    const handleCopy = () => {
        if (!selectedSkill) return;
        navigator.clipboard.writeText(selectedSkill.path);
        const { leveledUp, newLevel } = XPService.addXP(5, 'HYPERLINK EXTRACTED');
        if (leveledUp) window.dispatchEvent(new CustomEvent('level-up', { detail: { level: newLevel } }));
    };

    return (
        <div className="w-full h-full bg-[#050510] text-[#e0e0e0] relative overflow-hidden flex flex-col font-serif">
            {/* Elegant Background - Deep Indigo & Aurora */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050510] to-[#050510]" />
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(100, 100, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 100, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />

            <header className="p-8 flex justify-between items-start z-10 relative">
                <div>
                    <button
                        onClick={onBack}
                        className="text-xs tracking-[0.2em] text-cyan-400/50 hover:text-cyan-400 transition-colors mb-4 flex items-center gap-2"
                    >
                        ◀ RETURN TO MANAS
                    </button>
                    <h1 className="text-5xl font-light text-white tracking-tight">
                        MIYABI <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-3xl font-normal ml-2">LOGIC SYNTHESIS</span>
                    </h1>
                </div>

                {/* Search Interface */}
                <div className="flex flex-col items-end gap-2">
                    <div className="relative group">
                        <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-500 ${simulatedSkills.length > 0 ? 'opacity-100 animate-pulse' : ''}`}></div>
                        <div className="relative flex items-center bg-[#0a0a1a] rounded-lg p-1 w-80 border border-white/10">
                            {simulatedSkills.length > 0 ? <Zap className="text-yellow-400 ml-2 animate-bounce" size={18} /> : <Search className="text-white/30 ml-2" size={18} />}
                            <input
                                type="text"
                                placeholder="ENTER CONCEPT >> GENERATE LOGIC"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={handleSearchKeyDown}
                                className="bg-transparent border-none outline-none text-white px-3 py-2 text-sm w-full font-mono placeholder-white/20"
                            />
                        </div>
                    </div>
                    <div className="text-xs text-cyan-400/30 font-mono tracking-widest">{simulatedSkills.length > 0 ? 'LOGIC CHAIN GENERATED' : searchQuery ? 'PRESS ENTER TO CONSTRUCT' : 'AWAITING INPUT'}</div>
                </div>
            </header>

            <div className="flex-1 p-8 grid grid-cols-12 gap-8 z-10 relative">

                {/* Intent Resolution - Updated Styling */}
                <div className="col-span-3 border-r border-white/5 pr-8 flex flex-col justify-center">
                    <h3 className="text-cyan-400 mb-8 border-l-2 border-cyan-400 pl-4 tracking-widest text-sm">COGNITIVE PROCESS</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'AMBIGUITY RESOLUTION', status: 'COMPLETE', color: 'text-green-400' },
                            { label: 'CONTEXT CLARIFICATION', status: 'IDLE', color: 'text-white/30' },
                            { label: 'DEPENDENCY MAPPING', status: 'ACTIVE', color: 'text-purple-400 animate-pulse' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 p-4 rounded border border-white/5 backdrop-blur-sm">
                                <div className="text-[10px] text-white/50 mb-1">{item.label}</div>
                                <div className={`text-sm font-mono ${item.color}`}>{item.status}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Logic Graph Area */}
                <div className="col-span-6 flex flex-col justify-center items-center relative h-full">
                    <div className="absolute inset-0 border border-white/10 bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden relative w-full h-full shadow-[0_0_50px_rgba(0,0,0,0.5)_inset]">
                        <LogicGraph
                            onNodeSelect={handleNodeSelect}
                            searchQuery={searchQuery}
                            extraNodes={simulatedSkills}
                        />

                        {/* Overlay Stats */}
                        <div className="absolute bottom-6 right-6 text-right pointer-events-none">
                            <div className="text-[10px] text-cyan-400/50 tracking-widest mb-1">SYNAPSE COUNT</div>
                            <div className="text-3xl font-light text-white font-mono">
                                {simulatedSkills.length > 0 ? <span className="text-yellow-400">SIMULATING</span> : (searchQuery ? <span className="text-purple-400">FILTERED</span> : '42')}
                            </div>
                        </div>
                        {/* SKILL DETAIL OVERLAY (Right Side Slide-in) */}
                        <AnimatePresence>
                            {selectedSkill && (
                                <motion.div
                                    initial={{ x: '100%', opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: '100%', opacity: 0 }}
                                    className="absolute inset-y-0 right-0 w-2/3 bg-[#0a051a]/95 border-l border-[#bd00ff] p-8 shadow-2xl backdrop-blur-xl flex flex-col z-20"
                                >
                                    <div className="flex justify-between items-start mb-8 border-b border-[#bd00ff]/30 pb-4">
                                        <div className="flex items-center gap-3">
                                            <Database className="text-[#bd00ff]" />
                                            <div>
                                                <div className="text-xs text-white/50 tracking-widest">DATA NODE IDENTIFIED</div>
                                                <h2 className="text-2xl text-white font-bold">{selectedSkill.name}</h2>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedSkill(null)} className="text-white/50 hover:text-white">
                                            <X />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto font-mono text-sm space-y-4">
                                        <div className="p-4 bg-[#bd00ff]/10 rounded border border-[#bd00ff]/30 text-[#d8b4fe]">
                                            <span className="text-[#bd00ff] mr-2">path:</span>
                                            {selectedSkill.path}
                                        </div>
                                        <div className="text-white/80 leading-relaxed">
                                            <span className="text-[#bd00ff] block mb-2">// DESCRIPTION</span>
                                            {selectedSkill.description}
                                        </div>
                                        <div className="text-white/80">
                                            <span className="text-[#bd00ff] block mb-2">// METADATA</span>
                                            Category: {selectedSkill.category}<br />
                                            ID: {selectedSkill.id}
                                        </div>
                                    </div>

                                    <div className="mt-8 grid grid-cols-2 gap-4">
                                        <button
                                            onClick={handleCopy}
                                            className="flex items-center justify-center gap-2 p-3 border border-[#bd00ff] text-[#bd00ff] hover:bg-[#bd00ff] hover:text-white transition-colors uppercase tracking-widest text-xs font-bold"
                                        >
                                            <Copy size={16} /> Copy DNA
                                        </button>
                                        <button className="flex items-center justify-center gap-2 p-3 bg-[#bd00ff] text-white hover:bg-white hover:text-[#bd00ff] transition-colors uppercase tracking-widest text-xs font-bold">
                                            <Terminal size={16} /> Inject Logic
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Command Stack Column */}
                <div className="col-span-3 border-l border-[#bd00ff]/30 pl-8">
                    <h3 className="text-white mb-8 text-right border-r-2 border-[#bd00ff] pr-4">COMMAND STACK</h3>
                    <div className="space-y-4">
                        {['Architectural Review', 'Dependency Graph', 'Risk Assessment'].map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-[#bd00ff]/10">
                                <span className="text-white/70">{item}</span>
                                <span className="text-[#bd00ff]">● PENDING</span>
                            </div>
                        ))}
                        <button className="w-full mt-8 border border-[#bd00ff] text-[#bd00ff] py-3 hover:bg-[#bd00ff] hover:text-white transition-all text-xs tracking-widest">
                            EXECUTE SEQUENCE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
