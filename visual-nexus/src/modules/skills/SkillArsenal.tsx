import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SkillService, type Skill } from './SkillService';
import { Copy, Terminal } from 'lucide-react';

export const SkillArsenal = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    useEffect(() => {
        SkillService.getSkills().then(setSkills);
    }, []);

    const handleCopy = (path: string) => {
        navigator.clipboard.writeText(path);
        // In a real app, show a toast here
    };

    return (
        <div className="w-full max-w-4xl p-8">
            <h2 className="text-2xl mb-8 neon-text tracking-widest border-b border-cyber-cyan/30 pb-2 flex items-center gap-4">
                SKILL ARSENAL <span className="text-xs border border-cyber-cyan px-2 py-0.5 bg-cyber-cyan/10">ACTIVE</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map((skill) => (
                    <motion.div
                        key={skill.id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        onHoverStart={() => setHoveredId(skill.id)}
                        onHoverEnd={() => setHoveredId(null)}
                        className="group relative h-48 perspective-1000"
                    >
                        {/* Card Body */}
                        <div className="absolute inset-0 bg-cyber-glass border border-cyber-cyan/30 p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 group-hover:border-cyber-cyan group-hover:shadow-[0_0_20px_rgba(0,243,255,0.2)]">

                            {/* Background Grid Effect */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-cyber-cyan/10 rounded-md border border-cyber-cyan/20">
                                        <skill.icon size={24} className="text-cyber-cyan" />
                                    </div>
                                    <span className="text-xs font-mono text-cyber-cyan/50 tracking-wider uppercase">{skill.category}</span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors">{skill.name}</h3>
                                <p className="text-sm text-gray-400 line-clamp-2">{skill.description}</p>
                            </div>

                            {/* Actions Layer (Visible on Hover) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: hoveredId === skill.id ? 1 : 0, y: hoveredId === skill.id ? 0 : 20 }}
                                className="absolute bottom-0 left-0 right-0 p-4 bg-cyber-dark/95 border-t border-cyber-cyan/30 flex gap-2 justify-end"
                            >
                                <button
                                    onClick={() => handleCopy(skill.path)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-xs bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50 hover:bg-cyber-cyan hover:text-black transition-colors"
                                >
                                    <Copy size={12} /> COPY PATH
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1.5 text-xs bg-cyber-magenta/20 text-cyber-magenta border border-cyber-magenta/50 hover:bg-cyber-magenta hover:text-white transition-colors">
                                    <Terminal size={12} /> EXECUTE
                                </button>
                            </motion.div>
                        </div>

                        {/* Corner Accents */}
                        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyber-cyan opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyber-cyan opacity-50 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
