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
import { SystemMonitorWidget } from './modules/ui/SystemMonitorWidget';
import { audioService } from './modules/core/AudioService';
import { Volume2, VolumeX } from 'lucide-react';
import { OverdriveProvider } from './modules/overdrive/OverdriveContext';
import { PhaseShiftOverlay } from './modules/overdrive/PhaseShiftOverlay';
import { SyncRateMonitor } from './modules/overdrive/SyncRateMonitor';
import { SonicVisualizer } from './modules/overdrive/SonicVisualizer';
import { ClockWidget } from './modules/ui/ClockWidget';
import { SyncButton } from './modules/system/SyncButton';
import { BrainLogWidget } from './modules/ui/BrainLogWidget';

type CoreType = 'MANAS' | 'KAMUI' | 'MIYABI';

function App() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCore, setActiveCore] = useState<CoreType>('MANAS');
  const [memories, setMemories] = useState<Memory[]>([]);



  const toggleMute = () => {
    audioService.toggleMute();
    setIsMuted(prev => !prev);
    if (!isMuted) audioService.playClick();
  };

  // Initialize audio on first click anywhere if needed, or rely on specific buttons
  useEffect(() => {
    const initAudio = () => {
      // audioService.init(); // Exposed method if needed, but play* calls handle it
    };
    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);

  useEffect(() => {
    if (isLaunched) {
      MemoryService.getMemories().then(setMemories);
    }
  }, [isLaunched]);

  // Listen for core activation events (from CommandUplink or other sources)
  useEffect(() => {
    const handleCoreActivation = (e: CustomEvent<{ core: CoreType }>) => {
      setActiveCore(e.detail.core);
    };
    window.addEventListener('activate-core', handleCoreActivation as EventListener);
    return () => window.removeEventListener('activate-core', handleCoreActivation as EventListener);
    return () => window.removeEventListener('activate-core', handleCoreActivation as EventListener);
  }, []);

  return (
    <OverdriveProvider>
      <AppContent
        isLaunched={isLaunched}
        setIsLaunched={setIsLaunched}
        isMuted={isMuted}
        toggleMute={toggleMute}
        activeCore={activeCore}
        setActiveCore={setActiveCore}
        memories={memories}
      />
    </OverdriveProvider>
  );
}

// Extracted for cleaner Context usage if needed, though mostly visual components use it directly.
// But we need OverdriveProvider to wrap everything, including the UI components that use useOverdrive.
function AppContent({
  isLaunched, setIsLaunched, isMuted, toggleMute, activeCore, setActiveCore, memories
}: {
  isLaunched: boolean;
  setIsLaunched: (v: boolean) => void;
  isMuted: boolean;
  toggleMute: () => void;
  activeCore: CoreType;
  setActiveCore: (c: CoreType) => void;
  memories: Memory[];
}) {

  const handleLaunchComplete = () => {
    setIsLaunched(true);
    audioService.playActive(); // Play sound on launch
    setTimeout(() => {
      audioService.speak("Visual Nexus Online. Welcome back, Architect.");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-y-auto overflow-x-hidden relative selection:bg-cyber-magenta/30">

      {/* Audio Control (Absolute Top Right) */}
      <button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 text-cyber-cyan/50 hover:text-cyber-cyan transition-colors p-2"
        title="Toggle Audio"
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* Background Gradients */}
      <AnimatePresence>
        {isLaunched && <LevelBadge key="level-badge" />}
      </AnimatePresence>
      <LevelUpNotification />
      <BackgroundEffect activeCore={activeCore} />

      {/* Startup Sequence */}
      <AnimatePresence>
        {!isLaunched && (
          <GreetingOverlay onComplete={handleLaunchComplete} />
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
            className="relative min-h-screen flex flex-col items-center justify-start bg-cyber-dark text-white pt-20 pb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 pointer-events-none fixed"
              style={{
                background: 'radial-gradient(circle at center, rgba(0,243,255,0.05) 0%, rgba(0,0,0,0.8) 100%)'
              }}
            />

            <SystemDreaming />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-6xl z-10 px-8 flex flex-col gap-8"
            >
              <header className="flex justify-between items-end border-b border-cyber-cyan/20 pb-4 shrink-0">
                <div>
                  <h2 className="text-3xl font-bold neon-text">COCKPIT ACTIVE</h2>
                  <p className="text-sm text-cyber-cyan/50 tracking-widest">UNIT: MANAS-01 // STATUS: GREEN</p>
                </div>
                <div className="hidden lg:flex items-center gap-4">
                  <SyncButton />
                  <ClockWidget />
                </div>
              </header>


              <div className="grid grid-cols-12 gap-8">
                {/* Left Column: Memory (5/12) */}
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
                  <div className="h-[600px]">
                    <MemoryHoloDeck memories={memories} />
                  </div>
                  <div className="h-48 hidden lg:block">
                    <ActivityVisualizer />
                  </div>
                </div>

                {/* Right Column: Skills (5/12) + Calendar (2/12) ?? No, let's keep 2 columns but split */}
                <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
                  <div>
                    <SkillArsenal onActivateCore={(core) => setActiveCore(core as CoreType)} />
                  </div>
                  <div className="flex gap-4 h-48 hidden lg:flex">
                    <div className="w-64 shrink-0">
                      <CalendarWidget />
                    </div>
                    <div className="w-64 shrink-0">
                      <SystemMonitorWidget />
                    </div>
                    <div className="grow">
                      {/* Replaced ActivityVisualizer with BrainLog for more utility, moving ActivityVisualizer elsewhere or stacking */}
                      <BrainLogWidget />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Widget Support */}
              <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CalendarWidget />
                <SystemMonitorWidget />
                <ActivityVisualizer />
              </div>


              <div className="mt-4">
                <CommandUplink />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <PhaseShiftOverlay />
      <SonicVisualizer />
      {isLaunched && <SyncRateMonitor />}

    </div>
  );
}

export default App;
