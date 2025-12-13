import { useState, useEffect, useCallback } from 'react';
import { Starfield } from './components/Starfield';
import { SingularityCore } from './components/SingularityCore';
import { ConversationOverlay } from './components/ConversationOverlay';
import { audioService } from './services/AudioService';
import './App.css';

function App() {
  const [isWarping, setIsWarping] = useState(false);
  const [whiteout, setWhiteout] = useState(false);
  const [conversationText, setConversationText] = useState('');

  // Helper to speak and show text
  const speak = useCallback((text: string) => {
    setConversationText(text);
    audioService.speak(text);
  }, []);

  // Initialization: Voice Greeting
  useEffect(() => {
    // Attempt to speak on load. Note: Browsers block auto-play audio without interaction.
    // However, if the user "called Manas", they might have interacted with the page or we hope for the best.
    // We will try.
    const timer = setTimeout(() => {
      speak("マナス、システム接続完了。貴方の意思のままに。");
    }, 1000);
    return () => clearTimeout(timer);
  }, [speak]);

  // Handle Global Mouse Interaction
  const handleMouseDown = () => {
    setIsWarping(true);
    speak("時空ワープ、起動。特異点へ突入します。");
  };

  const handleMouseUp = () => {
    if (isWarping) {
      setIsWarping(false);
      // Trigger whiteout explosion
      setWhiteout(true);
      speak("座標到達。通常空間へ復帰。");
      setTimeout(() => setWhiteout(false), 300);
    }
  };

  // Bind to window/document
  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isWarping, speak]);

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

      {/* 6. Conversation Overlay */}
      <ConversationOverlay text={conversationText} />
    </>
  );
}

export default App;
