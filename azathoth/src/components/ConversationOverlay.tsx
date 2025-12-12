import React, { useState, useEffect } from 'react';

const ConversationOverlay: React.FC = () => {
    const [manasMessage, setManasMessage] = useState<string>("");
    // Placeholder for future interactivity
    // const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setManasMessage("我は潜む...何かを望むか？");
        }, 1000);
    }, []);

    return (
        <div style={{
            position: 'absolute',
            bottom: '10%',
            left: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 100,
            fontFamily: "'Noto Serif JP', serif",
            pointerEvents: 'none'
        }}>
            {/* Manas Message */}
            <div style={{
                color: '#d0f',
                fontSize: '2rem',
                textShadow: '0 0 10px #bf00ff',
                marginBottom: '1rem',
                textAlign: 'center',
                opacity: manasMessage ? 1 : 0,
                transition: 'opacity 1s',
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: '10px 20px',
                borderRadius: '4px'
            }}>
                {manasMessage}
            </div>
        </div>
    );
};

export default ConversationOverlay;
