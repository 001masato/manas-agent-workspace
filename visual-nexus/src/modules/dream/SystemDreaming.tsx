import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkillService, type Skill } from '../skills/SkillService';
import { MemoryService, type Memory } from '../memory/MemoryService';
import { Sparkles, Brain, Code } from 'lucide-react';

interface DreamBubble {
    id: string;
    content: string;
    subContent: string;
    type: 'skill' | 'memory' | 'synthesis';
    x: number;
    delay: number;
    duration: number;
    scale: number;
}

export const SystemDreaming: React.FC = () => {
    const [bubbles, setBubbles] = useState<DreamBubble[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [memories, setMemories] = useState<Memory[]>([]);

    // Data Fetching
    useEffect(() => {
        const loadData = async () => {
            const s = await SkillService.getSkills();
            const m = await MemoryService.getMemories();
            setSkills(s);
            setMemories(m);
        };
        loadData();
    }, []);

    // Bubble Spawning Logic
    useEffect(() => {
        if (skills.length === 0 && memories.length === 0) return;

        const spawnInterval = setInterval(() => {
            if (bubbles.length > 8) return; // Limit concurrent bubbles

            const type = Math.random() > 0.7 ? 'synthesis' : (Math.random() > 0.5 ? 'skill' : 'memory');
            let content = '';
            let subContent = '';

            if (type === 'skill' && skills.length > 0) {
                const s = skills[Math.floor(Math.random() * skills.length)];
                content = s.name;
                subContent = 'SKILL MODULE';
            } else if (type === 'memory' && memories.length > 0) {
                const m = memories[Math.floor(Math.random() * memories.length)];
                content = m.title;
                subContent = 'MEMORY LOG';
            } else if (type === 'synthesis' && skills.length > 0 && memories.length > 0) {
                const s = skills[Math.floor(Math.random() * skills.length)];
                const m = memories[Math.floor(Math.random() * memories.length)];
                content = `${s.name} × ${m.title.substring(0, 15)}...`;
                subContent = 'DREAM SYNTHESIS';
            }

            if (!content) return;

            const newBubble: DreamBubble = {
                id: Math.random().toString(36),
                content,
                subContent,
                type,
                x: Math.random() * 80 + 10, // 10% to 90% width
                delay: 0,
                duration: Math.random() * 10 + 15, // 15-25s float duration
                scale: Math.random() * 0.4 + 0.8, // 0.8 - 1.2 scale
            };

            setBubbles(prev => [...prev, newBubble]);
        }, 3000); // Attempt spawn every 3s

        return () => clearInterval(spawnInterval);
    }, [skills, memories, bubbles.length]);

    // Cleanup bubbles that have floated up
    const removeBubble = (id: string) => {
        setBubbles(prev => prev.filter(b => b.id !== id));
    };

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <AnimatePresence>
                {bubbles.map(bubble => (
                    <motion.div
                        key={bubble.id}
                        initial={{ y: '110vh', opacity: 0, x: `${bubble.x}vw` }}
                        animate={{
                            y: '-20vh',
                            opacity: [0, 1, 1, 0],
                            x: [`${bubble.x}vw`, `${bubble.x + (Math.random() * 20 - 10)}vw`]
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: bubble.duration, ease: "easeInOut", delay: bubble.delay }}
                        onAnimationComplete={() => removeBubble(bubble.id)}
                        className={`absolute flex flex-col items-center justify-center p-4 rounded-full border backdrop-blur-sm
                            ${bubble.type === 'synthesis'
                                ? 'border-cyber-magenta/30 bg-cyber-magenta/5 shadow-[0_0_15px_rgba(255,0,255,0.2)]'
                                : 'border-cyber-cyan/30 bg-cyber-cyan/5 shadow-[0_0_15px_rgba(0,255,255,0.1)]'
                            }
                        `}
                        style={{ scale: bubble.scale }}
                    >
                        <div className="mb-1 text-cyber-glass">
                            {bubble.type === 'synthesis' ? <Sparkles size={16} /> : (bubble.type === 'skill' ? <Code size={16} /> : <Brain size={16} />)}
                        </div>
                        <span className="text-xs font-mono text-cyan-200/70 tracking-wider mb-1">{bubble.subContent}</span>
                        <span className="text-sm font-bold text-white/90 text-center whitespace-nowrap px-2">{bubble.content}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
