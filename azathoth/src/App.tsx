import { useState, useEffect } from 'react';
import { Starfield } from './components/Starfield';
import { SingularityCore } from './components/SingularityCore';
import './App.css';

function App() {
  const [isWarping, setIsWarping] = useState(false);
  const [whiteout, setWhiteout] = useState(false);

  // Handle Global Mouse Interaction
  const handleMouseDown = () => {
    setIsWarping(true);
  };

  const handleMouseUp = () => {
    if (isWarping) {
      setIsWarping(false);
      // Trigger whiteout explosion
      setWhiteout(true);
      setTimeout(() => setWhiteout(false), 300);
    }
  };

  // Bind to window/document to ensure we catch it even if mouse leaves elements
  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isWarping]);

  return (
    <>
      {/* 1. Canvas Background (Starfield) */}
      <Starfield isWarping={isWarping} />

      {/* 2. Gravity Well Vignette */}
      <div className="gravity-well"></div>

      {/* 3. UI Layer (System Messages & Warnings) */}
      <div className="ui-layer">
        <div className="sys-msg" id="top-msg">System: VOID_GOD_AZATHOTH // Connected</div>
        <div
          className="warning-bar"
          id="warn-bar"
          style={{
            opacity: isWarping ? 1 : 0,
            animation: isWarping ? "blink 0.1s infinite" : "none"
          }}
        ></div>
        <div className="sys-msg" style={{ textAlign: "right" }}>
          Energy Density: <span id="energy-val">Infinite</span>
        </div>
      </div>

      {/* 4. Explosion Effect */}
      <div
        className="whiteout"
        id="whiteout"
        style={{ opacity: whiteout ? 1 : 0 }}
      ></div>

      {/* 5. Main Stage (Singularity) */}
      <SingularityCore isWarping={isWarping} />
    </>
  );
}

export default App;
