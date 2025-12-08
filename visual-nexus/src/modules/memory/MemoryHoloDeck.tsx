import { motion } from 'framer-motion';
import type { Memory } from './MemoryService';

interface Props {
    memories: Memory[];
}

export const MemoryHoloDeck = ({ memories }: Props) => {
    return (
        <div className="w-full max-w-4xl p-8">
            <h2 className="text-2xl mb-8 neon-text tracking-widest border-b border-cyber-cyan/30 pb-2">
                MEMORY HOLO-DECK
            </h2>

            <div className="space-y-6 relative">
                {/* Central timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-cyber-cyan/20" />

                {memories.map((m, i) => (
                    <motion.div
                        key={m.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.2 }}
                        className="relative pl-12"
                    >
                        {/* Timeline node */}
                        <div className={`
              absolute left-[11px] top-1.5 w-3 h-3 rounded-full 
              ${m.priority === 'max' ? 'bg-cyber-magenta shadow-[0_0_10px_#ff00ff]' : 'bg-cyber-cyan shadow-[0_0_8px_#00f3ff]'}
            `} />

                        <div className="glass-panel p-4 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer border-l-4 border-l-transparent hover:border-l-cyber-cyan">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`font-bold text-lg ${m.priority === 'max' ? 'text-cyber-magenta' : 'text-cyber-cyan'}`}>
                                    {m.title}
                                </h3>
                                <span className="text-xs text-cyber-cyan/50 font-mono">{m.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                {m.context}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
