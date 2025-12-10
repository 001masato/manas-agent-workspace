import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SkillService, type Skill } from './SkillService';
import { XPService } from '../gamification/XPService';
import { Copy, Terminal, FileText, Cpu, Zap, Activity, Music, Sparkles } from 'lucide-react';

interface Props {
    onActivateCore?: (coreName: string) => void;
}

const SYSTEMS = [
    { id: 'sys_miyabi', name: 'MIYABI CORE', description: 'Advanced Logic Synthesis & Intent Resolution Engine.', type: 'MIYABI' },
    { id: 'sys_kamui', name: 'KAMUI CORE', description: 'Viral Auditory Processing & Chaos Visualization.', type: 'KAMUI' }
];

export const SkillArsenal = ({ onActivateCore }: Props) => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    useEffect(() => {
        SkillService.getSkills().then(setSkills);
    }, []);

    const handleCopy = (path: string) => {
        navigator.clipboard.writeText(path);
        const { leveledUp, newLevel } = XPService.addXP(5, 'COPIED SKILL PATH');
        if (leveledUp) {
            window.dispatchEvent(new CustomEvent('level-up', { detail: { level: newLevel } }));
        }
    };

    const getIcon = (category: string) => {
        return category === 'template' ? FileText : Cpu;
    };

    return (
        <div className="w-full max-w-4xl p-8">
            <h2 className="text-2xl mb-8 neon-text tracking-widest border-b border-cyber-cyan/30 pb-2 flex items-center gap-4">
                SKILL ARSENAL <span className="text-xs border border-cyber-cyan px-2 py-0.5 bg-cyber-cyan/10">ACTIVE</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {SYSTEMS.map(sys => (
                    <motion.div
                        key={sys.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => {
                            if (onActivateCore) {
                                onActivateCore(sys.type);
                                XPService.addXP(100, `CORE ACTIVATION: ${sys.type}`);
                                window.dispatchEvent(new CustomEvent('level-up', { detail: { level: 2 } })); // Quick gratification
                            }
                        }}
                        className={`relative p-6 border cursor-pointer overflow-hidden group ${sys.type === 'MIYABI' ? 'border-[#bd00ff]/50 bg-[#bd00ff]/5 hover:bg-[#bd00ff]/10' : 'border-[#ff2a2a]/50 bg-[#ff2a2a]/5 hover:bg-[#ff2a2a]/10'
                            }`}
                    >
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <div className={`text-xs font-bold tracking-widest mb-1 ${sys.type === 'MIYABI' ? 'text-[#bd00ff]' : 'text-[#ff2a2a]'}`}>
                                    SYSTEM // {sys.type}
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2">{sys.name}</h3>
                                <p className="text-white/60 text-sm">{sys.description}</p>
                            </div>
                            {sys.type === 'MIYABI' ? <Sparkles className="text-[#bd00ff]" /> : <Music className="text-[#ff2a2a]" />}
                        </div>

                        <div className={`absolute bottom-0 right-0 p-2 text-xs font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity ${sys.type === 'MIYABI' ? 'text-[#bd00ff]' : 'text-[#ff2a2a]'}`}>
                            CLICK TO ENGAGE &gt;&gt;
                        </div>
                    </motion.div>
                ))}
            </div>

            <h2 className="text-xl mb-4 text-cyber-cyan/50 tracking-widest border-b border-cyber-cyan/20 pb-2 flex items-center gap-4">
                INSTALLED SKILLS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map((skill) => {
                    const Icon = getIcon(skill.category);
                    const isCore = skill.name.includes('Kamui') || skill.name.includes('Miyabi');

                    return (
                        <motion.div
                            key={skill.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            onHoverStart={() => setHoveredId(skill.id)}
                            onHoverEnd={() => setHoveredId(null)}
                            className={`group relative h-48 perspective-1000 cursor-pointer ${isCore ? 'border-yellow-400' : ''}`}
                        >
                            {/* Card Body */}
                            <div className={`absolute inset-0 bg-cyber-glass p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 ${isCore
                                ? 'border border-yellow-400/50 group-hover:border-yellow-400 group-hover:shadow-[0_0_20px_rgba(252,211,77,0.2)]'
                                : 'border border-cyber-cyan/30 group-hover:border-cyber-cyan group-hover:shadow-[0_0_20px_rgba(0,243,255,0.2)]'
                                }`}>

                                {/* Background Grid Effect */}
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2 rounded-md ${isCore ? 'bg-yellow-400/10 border border-yellow-400/20' : 'bg-cyber-cyan/10 border border-cyber-cyan/20'}`}>
                                            <Icon size={24} className={isCore ? 'text-yellow-400' : 'text-cyber-cyan'} />
                                        </div>
                                        <span className={`text-xs font-mono tracking-wider uppercase ${isCore ? 'text-yellow-400/70' : 'text-cyber-cyan/50'}`}>{skill.category}</span>
                                    </div>

                                    <h3 className={`text-xl font-bold text-white mb-2 transition-colors truncate ${isCore ? 'group-hover:text-yellow-400' : 'group-hover:text-cyber-cyan'}`}>{skill.name}</h3>
                                    <p className="text-sm text-gray-400 line-clamp-2">{skill.description}</p>
                                </div>

                                {/* Actions Layer */}
                                <motion.div
                                    initial={{ opacity: isCore ? 1 : 0, y: isCore ? 0 : 20 }}
                                    animate={{ opacity: (isCore || hoveredId === skill.id) ? 1 : 0, y: (isCore || hoveredId === skill.id) ? 0 : 20 }}
                                    className={`absolute bottom-0 left-0 right-0 p-4 border-t flex gap-2 justify-end ${isCore
                                        ? 'bg-yellow-900/90 border-yellow-400/30'
                                        : 'bg-cyber-dark/95 border-cyber-cyan/30'
                                        }`}
                                >
                                    {isCore && onActivateCore ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onActivateCore(skill.name.includes('Kamui') ? 'KAMUI' : 'MIYABI');
                                                const { leveledUp, newLevel } = XPService.addXP(50, `ACTIVATED CORE: ${skill.name}`);
                                                if (leveledUp) {
                                                    window.dispatchEvent(new CustomEvent('level-up', { detail: { level: newLevel } }));
                                                }
                                            }}
                                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-yellow-400 text-black font-black tracking-widest hover:bg-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                                        >
                                            <Zap size={16} fill="currentColor" /> ACTIVATE CORE (+50 XP)
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleCopy(skill.path || ''); }}
                                                className="flex items-center gap-2 px-3 py-1.5 text-xs bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50 hover:bg-cyber-cyan hover:text-black transition-colors"
                                            >
                                                <Copy size={12} /> PATH (+5 XP)
                                            </button>
                                            <button className="flex items-center gap-2 px-3 py-1.5 text-xs bg-cyber-magenta/20 text-cyber-magenta border border-cyber-magenta/50 hover:bg-cyber-magenta hover:text-white transition-colors">
                                                <Terminal size={12} /> EXECUTE
                                            </button>
                                        </>
                                    )}
                                </motion.div>
                            </div>

                            {/* Corner Accents */}
                            <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${isCore ? 'border-yellow-400' : 'border-cyber-cyan'} opacity-50 group-hover:opacity-100 transition-opacity`} />
                            <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 ${isCore ? 'border-yellow-400' : 'border-cyber-cyan'} opacity-50 group-hover:opacity-100 transition-opacity`} />
                        </motion.div>
                    )
                })}
            </div>
        </div>
    );
};
