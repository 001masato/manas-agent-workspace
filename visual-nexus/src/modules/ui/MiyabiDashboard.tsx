
import { motion } from 'framer-motion';

interface Props {
    onBack: () => void;
}

export const MiyabiDashboard = ({ onBack }: Props) => {
    return (
        <div className="w-full h-full bg-[#0a051a] text-[#bd00ff] relative overflow-hidden flex flex-col font-serif">
            {/* Geometric Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(30deg, #bd00ff 1px, transparent 1px), linear-gradient(150deg, #bd00ff 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <header className="p-8 flex justify-between items-start z-10">
                <div>
                    <button
                        onClick={onBack}
                        className="text-xs tracking-[0.2em] border-b border-[#bd00ff] pb-1 mb-4 hover:text-white transition-colors"
                    >
                        RETURN TO MANAS
                    </button>
                    <h1 className="text-5xl font-light text-white">MIYABI <span className="text-[#bd00ff] text-2xl align-top">LOGIC CORE</span></h1>
                </div>
                <div className="text-right opacity-70">
                    <div className="text-2xl font-mono">A(Input, World₀) = World_∞</div>
                    <div className="text-xs tracking-widest mt-1">UNIFIED AGENT FORMULA v2.0</div>
                </div>
            </header>

            <div className="flex-1 p-8 grid grid-cols-12 gap-8 z-10">
                {/* Intent Resolution Column */}
                <div className="col-span-3 border-r border-[#bd00ff]/30 pr-8">
                    <h3 className="text-white mb-8 border-l-2 border-[#bd00ff] pl-4">INTENT RESOLUTION</h3>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#bd00ff]/5 p-4 rounded border border-[#bd00ff]/20 hover:border-[#bd00ff] transition-colors"
                            >
                                <div className="text-xs text-white/50 mb-2">PHASE {i}: CLARIFICATION</div>
                                <div className="text-sm text-white/90">Analyzing ambiguity in user request structure...</div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Main Logic / Chat Area */}
                <div className="col-span-6 flex flex-col justify-center items-center">
                    <div className="w-[600px] h-[400px] rounded-full border border-[#bd00ff]/20 flex items-center justify-center relative">
                        <div className="absolute inset-0 animate-[spin_20s_linear_infinite] border-t border-b border-[#bd00ff]/30 rounded-full" />
                        <div className="absolute inset-[40px] animate-[spin_15s_linear_infinite_reverse] border-r border-l border-[#bd00ff]/50 rounded-full" />
                        <div className="absolute inset-[80px] animate-[pulse_4s_infinite] bg-[#bd00ff]/5 rounded-full backdrop-blur-sm" />

                        <div className="relative text-center z-10">
                            <h2 className="text-3xl text-white font-light tracking-[0.5em] mb-4">PHILOSOPHY</h2>
                            <p className="text-[#bd00ff] text-sm max-w-xs mx-auto leading-relaxed">
                                "The world is a flickering scenery. We define our reality through the logic we impose upon it."
                            </p>
                        </div>
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
