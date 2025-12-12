import { useState, useRef, useEffect } from 'react';
import './index.css';
import Starfield from './components/Starfield';
import SingularityCore from './components/SingularityCore';
import ConversationOverlay from './components/ConversationOverlay';
import { audioService } from './services/AudioService';

type PhysicsMode = 'CHAOS' | 'GALAXY' | 'ATOM' | 'VOID';

function App() {
  const [isWarping, setIsWarping] = useState(false);
  // Mode used for prop compatibility, though logic is now unified
  const [mode] = useState<PhysicsMode>('VOID');
  const [bigBangTrigger, setBigBangTrigger] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);

  // --- Interaction Logic ---
  const pressStartTime = useRef<number>(0);
  const isPressing = useRef<boolean>(false);

  const onDown = () => {
    isPressing.current = true;
    pressStartTime.current = Date.now();
    setIsWarping(true);
    // Voice/SFX
    audioService.playWarpSound();
  };

  const onUp = () => {
    isPressing.current = false;
    // const duration = Date.now() - pressStartTime.current; // Logic removed to match HTML immediate response

    if (isWarping) {
      // Trigger Big Bang / Release Effect
      setBigBangTrigger(prev => prev + 1);
      const whiteout = document.getElementById('whiteout');
      if (whiteout) {
        whiteout.style.opacity = "1";
        setTimeout(() => { whiteout.style.opacity = "0"; }, 300);
      }
      audioService.speak("天地創造");
    }

    // Always stop warping visual on release
    setIsWarping(false);
  };

  // --- Parallax Effect ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalize -1.0 to 1.0
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);

      if (stageRef.current) {
        // Rotate Stage for 3D depth feeling
        const rotateX = -y * 5; // Mild tilt
        const rotateY = x * 5;
        stageRef.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }

      // Pass parallax values to CSS for inner elements (Rings)
      document.documentElement.style.setProperty('--parallax-x', `${-x * 20}px`);
      document.documentElement.style.setProperty('--parallax-y', `${-y * 20}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      style={{ width: '100%', height: '100%', position: 'absolute' }}
      onMouseDown={onDown}
      onMouseUp={onUp}
      onMouseLeave={onUp} // Cancel if leave
      onTouchStart={onDown}
      onTouchEnd={onUp}
    >
      <Starfield isCharging={isWarping} mode={mode} triggerBigBang={bigBangTrigger} />
      <div className="gravity-well"></div>

      <div className="ui-layer">
        <div className="sys-msg" id="top-msg">System: VOID_GOD_AZATHOTH // Connected</div>
        <div className="warning-bar" id="warn-bar" style={{
          opacity: isWarping ? 1 : 0,
          animation: isWarping ? "blink 0.1s infinite" : "none"
        }}></div>
        <div className="sys-msg" style={{ textAlign: 'right' }}>
          Energy Density: <span id="energy-val">{isWarping ? "INFINITE" : "STABLE"}</span>
        </div>
      </div>

      <div className="whiteout" id="whiteout"></div>

      <ConversationOverlay />

      <div
        className={`singularity-stage ${isWarping ? 'shaking' : ''}`}
        id="stage"
        ref={stageRef}
      >
        <SingularityCore
          isWarping={isWarping}
          onWarpStart={() => { }} // Handled by container
          onWarpEnd={() => { }}
        />
      </div>

    </div>
  );
}

export default App;
