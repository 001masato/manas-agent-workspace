import React, { useRef, useEffect } from 'react';
import { useOverdrive } from './OverdriveContext';

export const SonicVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { audioData, phase } = useOverdrive();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize
        canvas.width = window.innerWidth;
        canvas.height = 200; // Bottom strip

        const draw = () => {
            if (!ctx) return;
            const w = canvas.width;
            const h = canvas.height;
            const bufferLength = audioData.length;
            const barWidth = (w / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < bufferLength; i++) {
                barHeight = audioData[i] / 2; // scale

                // Color based on phase
                const hue = phase === 'OVERDRIVE' ? 0 : phase === 'ACTIVE' ? 30 : 180;
                const saturation = 100;
                const lightness = 50;

                ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.5)`;
                ctx.fillRect(x, h - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        requestAnimationFrame(draw);
    }, [audioData, phase]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed bottom-0 left-0 w-full h-[200px] pointer-events-none z-0 opacity-50"
        />
    );
};
