
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MemoryHoloDeck } from './modules/memory/MemoryHoloDeck';
import { SkillArsenal } from './modules/skills/SkillArsenal';
import { MemoryService, type Memory } from './modules/memory/MemoryService';
import { CommandUplink } from './modules/uplink/CommandUplink';
import { SystemDreaming } from './modules/dream/SystemDreaming';

function App() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    if (isLaunched) {
      MemoryService.getMemories().then(setMemories);
    }
  }, [isLaunched]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center relative bg-cyber-dark text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,243,255,0.05) 0%, rgba(0,0,0,0.8) 100%)'
        }}
      />
      <SystemDreaming />

      {!isLaunched ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10 relative"
        >
          <div className="absolute -inset-10 bg-cyber-cyan/5 blur-3xl rounded-full" />
          <h1 className="text-7xl font-bold mb-2 neon-text tracking-tighter relative">
            VISUAL NEXUS
          </h1>
          <p className="text-cyber-cyan/70 text-xl mb-12 tracking-[0.6em] font-light">
            SYSTEM ONLINE
          </p>

          <button
            onClick={() => setIsLaunched(true)}
            className="cyber-button text-xl px-16 py-5 group relative overflow-hidden"
          >
            <span className="relative z-10">INITIALIZE UPLINK</span>
            <div className="absolute inset-0 bg-cyber-cyan/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </motion.div>
      ) : (
        <div className="w-full h-full p-8 z-10 overflow-y-auto custom-scrollbar flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-6xl"
          >
            <header className="flex justify-between items-end border-b border-cyber-cyan/20 pb-4 mb-12">
              <div>
                <h2 className="text-3xl font-bold neon-text">COCKPIT ACTIVE</h2>
                <p className="text-sm text-cyber-cyan/50 tracking-widest">UNIT: MANAS-01 // STATUS: GREEN</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono text-cyber-magenta">LVL 36</div>
                <div className="text-xs text-cyber-magenta/70">XP: 5220</div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <MemoryHoloDeck memories={memories} />
              {/* SkillArsenal will go here */}
              <SkillArsenal />
            </div>

            <CommandUplink />
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default App;
