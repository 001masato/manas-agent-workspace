// motion removed as it was unused
import { useEffect, useRef, useState } from 'react';
import { audioService } from '../media/AudioAnalysisService';
import { Music, Upload, StopCircle } from 'lucide-react';

interface Props {
    onBack: () => void;
}

export const KamuiDashboard = ({ onBack }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    // Initial Resume Context
    useEffect(() => {
        const handleInteraction = () => {
            audioService.resume();
        };
        window.addEventListener('click', handleInteraction, { once: true });
        return () => window.removeEventListener('click', handleInteraction);
    }, []);

    // Visualizer Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;

        const render = () => {
            animationId = requestAnimationFrame(render);

            const width = canvas.width = canvas.offsetWidth;
            const height = canvas.height = canvas.offsetHeight;
            const data = audioService.getFrequencyData();

            ctx.clearRect(0, 0, width, height);

            if (data.length === 0) {
                // Idle State - Pulsing Line
                ctx.beginPath();
                ctx.moveTo(0, height / 2);
                ctx.strokeStyle = '#ff2a2a';
                ctx.lineWidth = 2;
                for (let x = 0; x < width; x += 10) {
                    ctx.lineTo(x, height / 2 + Math.sin(x * 0.05 + Date.now() * 0.005) * 20);
                }
                ctx.stroke();
                return;
            }

            // Circular Visualizer
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) / 4;
            const bars = 100;
            const step = Math.ceil(data.length / bars);

            ctx.beginPath();
            for (let i = 0; i < bars; i++) {
                const value = data[i * step];
                const angle = (i / bars) * Math.PI * 2;
                const barHeight = (value / 255) * (radius * 1.5);

                const x1 = centerX + Math.cos(angle) * radius;
                const y1 = centerY + Math.sin(angle) * radius;
                const x2 = centerX + Math.cos(angle) * (radius + barHeight);
                const y2 = centerY + Math.sin(angle) * (radius + barHeight);

                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
            }
            ctx.strokeStyle = '#ffaa00';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Inner Beat Circle
            const average = data.reduce((a, b) => a + b, 0) / data.length;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.8 + (average / 255) * 20, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 0, 0, ${average / 255})`;
            ctx.fill();
            ctx.strokeStyle = '#ff2a2a';
            ctx.stroke();
        };

        render();

        return () => cancelAnimationFrame(animationId);
    }, []);

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('audio/')) {
            setFileName(file.name);
            audioService.loadFile(file).then(() => setIsPlaying(true));
        }
    };

    const handleStop = () => {
        audioService.stop();
        setIsPlaying(false);
        setFileName(null);
    };

    return (
        <div
            className="w-full h-full bg-[#1a0505] text-[#ff2a2a] relative overflow-hidden flex flex-col"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff0000]/10 to-transparent pointer-events-none" />

            <header className="p-8 flex justify-between items-center z-10 border-b border-[#ff2a2a]/30">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => { audioService.stop(); onBack(); }}
                        className="text-sm border border-[#ff2a2a] px-4 py-2 hover:bg-[#ff2a2a] hover:text-[#1a0505] transition-colors"
                    >
                        ◀ RETURN TO MANAS
                    </button>
                    <h1 className="text-4xl font-black italic tracking-tighter">KAMUI // VIRAL CORE</h1>
                </div>
                <div className="flex gap-8 text-sm font-bold items-center">
                    {fileName && (
                        <div className="flex items-center gap-2 text-[#ffaa00] animate-pulse">
                            <Music size={16} /> NOW PLAYING: {fileName}
                        </div>
                    )}
                    {isPlaying && (
                        <button onClick={handleStop} className="flex items-center gap-2 hover:text-white">
                            <StopCircle size={20} /> STOP AUDIO
                        </button>
                    )}
                </div>
            </header>

            <div className="flex-1 w-full h-full relative flex items-center justify-center">
                {/* Visualizer Canvas (Full Background) */}
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80" />

                {/* Drag Drop Instruction Overlay */}
                {!isPlaying && (
                    <div className="z-10 border-2 border-dashed border-[#ff2a2a]/50 p-12 rounded-xl flex flex-col items-center gap-4 text-[#ff2a2a]/50">
                        <Upload size={48} />
                        <div className="text-2xl font-black">DROP AUDIO FILE HERE</div>
                        <div className="text-sm">MP3 / WAV / OGG</div>
                    </div>
                )}

                {/* HUD Elements */}
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
                    <div className="border border-[#ffaa00] p-6 bg-[#ffaa00]/5 backdrop-blur-sm">
                        <h3 className="text-[#ffaa00] font-bold mb-4 text-xl">VIRAL VELOCITY</h3>
                        <div className="text-6xl font-black mb-2">{isPlaying ? (Math.random() * 10 + 85).toFixed(1) : '0.0'}</div>
                        <div className="w-64 bg-[#330000] h-2">
                            <div className="bg-[#ffaa00] h-full transition-all duration-100" style={{ width: isPlaying ? '88%' : '0%' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
