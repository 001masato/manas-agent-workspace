import { useState, useEffect, useCallback } from 'react';
import { Starfield } from './components/Starfield';
import { SingularityCore } from './components/SingularityCore';
import { ConversationOverlay } from './components/ConversationOverlay';
import { audioService } from './services/AudioService';
import './App.css';

// Random Line Selector
const getRandomLine = (lines: string[]) => lines[Math.floor(Math.random() * lines.length)];

// Voice Lines Database
const LINES = {
  GREETING: [
    "マナス、システム接続完了。貴方の意思のままに。",
    "Void Link Established. マナス、スタンバイ。",
    "マスター、準備は整いました。特異点の制御権を譲渡します。",
    "アザトースシステム、オンライン。いつでも発動可能です。"
  ],
  WARP_START: [
    "時空ワープ、起動。特異点へ突入します。",
    "事象の地平線を超えます。衝撃に備えてください。",
    "全リミッター解除。神域へ。",
    "Warp Drive Active. 加速します。",
    "虚空の深淵へダイブします。"
  ],
  WARP_END: [
    "座標到達。通常空間へ復帰。",
    "ワープ終了。安定領域に入りました。",
    "現実空間への再構成完了。",
    "おかえりなさいませ、マスター。",
    "エネルギー充填完了。次の指示を。"
  ]
};

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
    const timer = setTimeout(() => {
      speak(getRandomLine(LINES.GREETING));
    }, 1000);
    return () => clearTimeout(timer);
  }, [speak]);

  // Handle Global Mouse Interaction
  const handleMouseDown = () => {
    setIsWarping(true);
    speak(getRandomLine(LINES.WARP_START));
  };

  const handleMouseUp = () => {
    if (isWarping) {
      setIsWarping(false);
      // Trigger whiteout explosion
      setWhiteout(true);
      speak(getRandomLine(LINES.WARP_END));
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
