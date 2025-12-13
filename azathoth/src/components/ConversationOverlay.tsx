import React, { useEffect, useState, useRef } from 'react';

interface ConversationOverlayProps {
    text: string;
}

export const ConversationOverlay: React.FC<ConversationOverlayProps> = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    // Charset for decoding effect
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789アァカサタナハマヤャラワガザダバパイィキシチニヒミリギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";

    useEffect(() => {
        if (!text) {
            setIsVisible(false);
            return;
        }

        setIsVisible(true);
        let iteration = 0;
        let finalOutput = "";

        const interval = setInterval(() => {
            setDisplayedText(prev => {
                return text
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("");
            });

            if (iteration >= text.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3; // Slow down the reveal
        }, 30);

        // Auto hide
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, Math.max(4000, text.length * 200 + 2000));

        return () => {
            clearInterval(interval);
            clearTimeout(hideTimer);
        };
    }, [text]);

    return (
        <div
            style={{
                position: 'absolute',
                bottom: '15%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90%',
                textAlign: 'center',
                pointerEvents: 'none',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.5s ease',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <div style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '0.8rem',
                color: 'cyan',
                letterSpacing: '0.3em',
                marginBottom: '8px',
                opacity: 0.8,
                textTransform: 'uppercase'
            }}>
                Incoming Message // MANAS_SYSTEM
            </div>

            <div style={{
                fontFamily: '"Noto Serif JP", serif',
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontWeight: 900,
                color: '#fff',
                textShadow: '0 0 10px rgba(191,0,255,0.8), 0 0 20px rgba(0,0,0,1)',
                background: 'linear-gradient(to bottom, #ffffff, #e0c0ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.1em',
                lineHeight: '1.4',
                padding: '10px 20px',
                background: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(4px)',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {displayedText}
            </div>

            <div style={{
                marginTop: '5px',
                height: '2px',
                width: isVisible ? '60%' : '0%',
                background: 'linear-gradient(90deg, transparent, #bf00ff, transparent)',
                transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1)',
                boxShadow: '0 0 10px #bf00ff'
            }}></div>
        </div>
    );
};
