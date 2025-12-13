import React, { useEffect, useState } from 'react';

interface ConversationOverlayProps {
    text: string;
}

export const ConversationOverlay: React.FC<ConversationOverlayProps> = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (text) {
            setIsVisible(true);
            setDisplayedText('');

            // Typewriter effect
            let i = 0;
            const timer = setInterval(() => {
                setDisplayedText(text.substring(0, i + 1));
                i++;
                if (i === text.length) clearInterval(timer);
            }, 50); // Speed of typing

            // Auto-hide after some time (optional, but good for cleanliness)
            const hideTimer = setTimeout(() => {
                setIsVisible(false);
            }, Math.max(3000, text.length * 100 + 2000)); // Dynamic duration

            return () => {
                clearInterval(timer);
                clearTimeout(hideTimer);
            };
        } else {
            setIsVisible(false);
        }
    }, [text]);

    return (
        <div
            style={{
                position: 'absolute',
                bottom: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                textAlign: 'center',
                pointerEvents: 'none',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
                zIndex: 100,
                textShadow: '0 0 10px rgba(0,0,0,0.8), 0 0 20px black'
            }}
        >
            <div style={{
                fontFamily: '"Noto Serif JP", serif',
                fontSize: '2rem',
                fontWeight: 900,
                color: '#fff',
                background: 'linear-gradient(to right, #fff, #bbf, #fff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.1em',
                lineHeight: '1.5'
            }}>
                {displayedText}
                <span className="cursor" style={{ opacity: 0.5 }}>_</span>
            </div>
            <div style={{
                marginTop: '10px',
                height: '1px',
                width: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(191,0,255,0.5), transparent)'
            }}></div>
        </div>
    );
};
