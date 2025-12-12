
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Copy, Check, FileText, Zap } from 'lucide-react';
import { audioService } from '../core/AudioService';

interface Skill {
    id: string;
    title: string;
    description: string;
    tags: string[];
    content: string;
    path: string;
}

export const SkillArsenal = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        fetch('/data/skills.json?t=' + Date.now())
            .then(res => res.json())
            .then(data => {
                setSkills(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Arsenal Error:", err);
                setLoading(false);
            });
    }, []);

    const filteredSkills = skills.filter(skill =>
        skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleCopy = (skill: Skill) => {
        navigator.clipboard.writeText(skill.content);
        setCopiedId(skill.id);
        audioService.playClick();

        // Visual feedback
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) return <div className="text-cyber-cyan animate-pulse p-4 font-mono">LOADING ARSENAL DATA...</div>;

    return (
        <div className="flex flex-col h-full bg-black/90 font-mono text-sm border border-cyber-cyan/30 overflow-hidden">
            {/* Header / Search */}
            <div className="shrink-0 bg-cyber-cyan/10 border-b border-cyber-cyan/20 p-2 flex items-center gap-2">
                <Zap size={14} className="text-yellow-400 animate-pulse" />
                <Search size={14} className="text-cyber-cyan" />
                <input
                    type="text"
                    placeholder="SEARCH SKILL DATABASE..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none outline-none text-cyber-cyan w-full placeholder-cyber-cyan/30 uppercase"
                    autoFocus
                />
                <div className="text-[10px] text-cyber-cyan/50 whitespace-nowrap">
                    {filteredSkills.length} MODULES
                </div>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto custom-scrollbar">
                <div className="flex flex-col">
                    {filteredSkills.map(skill => (
                        <motion.div
                            key={skill.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="group flex items-center justify-between p-3 border-b border-cyber-cyan/10 hover:bg-cyber-cyan/5 transition-colors cursor-pointer"
                            onClick={() => handleCopy(skill)}
                        >
                            <div className="flex flex-col gap-1 overflow-hidden">
                                <div className="flex items-center gap-2">
                                    <FileText size={14} className="text-cyber-magenta/70" />
                                    <span className="font-bold text-cyber-cyan truncate">{skill.title}</span>
                                </div>
                                <div className="flex gap-2">
                                    {skill.tags.map(tag => (
                                        <span key={tag} className="text-[10px] text-cyber-cyan/40 border border-cyber-cyan/10 px-1 rounded uppercase">
                                            {tag}
                                        </span>
                                    ))}
                                    <span className="text-[10px] text-cyber-cyan/30 truncate">{skill.path}</span>
                                </div>
                            </div>

                            <button
                                className={`shrink-0 p-2 rounded border transition-all ${copiedId === skill.id
                                    ? 'border-green-500 text-green-500 bg-green-500/10'
                                    : 'border-cyber-cyan/20 text-cyber-cyan/50 group-hover:text-cyber-cyan group-hover:border-cyber-cyan'
                                    }`}
                            >
                                {copiedId === skill.id ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </motion.div>
                    ))}

                    {filteredSkills.length === 0 && (
                        <div className="p-8 text-center text-cyber-cyan/30 italic">
                            NO MATCHING PROTOCOLS FOUND
                        </div>
                    )}
                </div>
            </div>

            <div className="shrink-0 p-1 bg-cyber-cyan/5 text-[10px] text-cyber-cyan/40 text-center border-t border-cyber-cyan/10">
                CLICK TO LOAD INTO CLIPBOARD BUFFER
            </div>
        </div>
    );
};
