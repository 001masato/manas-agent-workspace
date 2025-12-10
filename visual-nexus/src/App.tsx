import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MemoryHoloDeck } from './modules/memory/MemoryHoloDeck';
import { SkillArsenal } from './modules/skills/SkillArsenal';
import { MemoryService, type Memory } from './modules/memory/MemoryService';
import { CommandUplink } from './modules/uplink/CommandUplink';
import { SystemDreaming } from './modules/dream/SystemDreaming';
import { KamuiDashboard } from './modules/ui/KamuiDashboard';
import { MiyabiDashboard } from './modules/ui/MiyabiDashboard';
import { LevelBadge } from './modules/gamification/LevelBadge';
import { LevelUpNotification } from './modules/gamification/LevelUpNotification';
import { BackgroundEffect } from './modules/ui/BackgroundEffect';
import { GreetingOverlay } from './modules/ui/GreetingOverlay';
import { ThoughtStream } from './modules/ui/ThoughtStream';
import { CalendarWidget } from './modules/ui/CalendarWidget';
import { ActivityVisualizer } from './modules/ui/ActivityVisualizer';

type CoreType = 'MANAS' | 'KAMUI' | 'MIYABI';

function App() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [activeCore, setActiveCore] = useState<CoreType>('MANAS');
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    if (isLaunched) {
      MemoryService.getMemories().then(setMemories);
    }
  }, [isLaunched]);

  return (
    <div className={`min-h-screen bg-black text-white font-mono overflow-x-hidden relative ${isLaunched ? 'scanline' : ''}`}>

      {/* Global UI Elements */}
      <AnimatePresence>
        {isLaunched && <LevelBadge key="level-badge" />}
      </AnimatePresence>
      <LevelUpNotification />
      <BackgroundEffect activeCore={activeCore} />

      {/* Startup Sequence */}
      <AnimatePresence>
        {!isLaunched && (
          <GreetingOverlay onComplete={() => setIsLaunched(true)} />
        )}
      </AnimatePresence>

      {/* HUD Elements */}
      <AnimatePresence>
        {isLaunched && <ThoughtStream />}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* KAMUI CORE */}
        {activeCore === 'KAMUI' && (
          <motion.div
            key="kamui"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            className="absolute inset-0 z-50"
          >
            <KamuiDashboard onBack={() => setActiveCore('MANAS')} />
          </motion.div>
        )}

        {/* MIYABI CORE */}
        {activeCore === 'MIYABI' && (
          <motion.div
            key="miyabi"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            className="absolute inset-0 z-50"
          >
            <MiyabiDashboard onBack={() => setActiveCore('MANAS')} />
          </motion.div>
        )}

        {/* MANAS CORE (Default) */}
        {activeCore === 'MANAS' && isLaunched && (
          <motion.div
            key="manas"
            className="absolute inset-0 flex flex-col items-center justify-center bg-cyber-dark text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, rgba(0,243,255,0.05) 0%, rgba(0,0,0,0.8) 100%)'
              }}
            />

            <SystemDreaming />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-6xl z-10 p-8 h-full flex flex-col gap-6"
            >
              <header className="flex justify-between items-end border-b border-cyber-cyan/20 pb-4 mb-2 shrink-0">
                <div>
                  <h2 className="text-3xl font-bold neon-text">COCKPIT ACTIVE</h2>
                  <p className="text-sm text-cyber-cyan/50 tracking-widest">UNIT: MANAS-01 // STATUS: GREEN</p>
                </div>
                {/* XP display moved to LevelBadge, but considering keeping a header summary or handled by LevelBadge */}
              </header>


              <div className="grid grid-cols-12 gap-8 grow min-h-0">
                {/* Left Column: Memory (5/12) */}
                <div className="col-span-12 lg:col-span-5 h-full min-h-0 overflow-hidden flex flex-col gap-4">
                  <div className="grow overflow-hidden flex flex-col">
                    <MemoryHoloDeck memories={memories} />
                  </div>
                  <div className="shrink-0 h-48 hidden lg:block">
                    <ActivityVisualizer />
                  </div>
                </div>

                {/* Right Column: Skills (5/12) + Calendar (2/12) ?? No, let's keep 2 columns but split */}
                <div className="col-span-12 lg:col-span-7 h-full min-h-0 overflow-hidden flex flex-col gap-4">
                  <div className="grow overflow-hidden flex flex-col">
                    <SkillArsenal onActivateCore={(core) => setActiveCore(core as CoreType)} />
                  </div>
                  <div className="shrink-0 flex gap-4 h-48 hidden lg:flex">
                    <div className="w-64 shrink-0">
                      <CalendarWidget />
                    </div>
                    <div className="grow">
                      {/* Potentially another widget or expand ActivityVisualizer here? 
                               Let's actually put ActivityVisualizer here for more width 
                           */}
                      <ActivityVisualizer />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Widget Support */}
              <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CalendarWidget />
                <ActivityVisualizer />
              </div>


              <div className="shrink-0 mt-4">
                <CommandUplink />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
