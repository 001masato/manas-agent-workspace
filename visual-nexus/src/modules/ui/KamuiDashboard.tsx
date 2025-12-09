
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface Props {
    onBack: () => void;
}

export const KamuiDashboard = ({ onBack }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Audio Visualizer Simulation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = 300;

        const bars = 50;
        const barWidth = canvas.width / bars;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < bars; i++) {
                const height = Math.random() * canvas.height * 0.8;
                const hue = Math.random() * 60 + 340; // Red to Orange range
                ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
            }
        };

        const interval = setInterval(draw, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full bg-[#1a0505] text-[#ff2a2a] relative overflow-hidden flex flex-col">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff0000]/10 to-transparent pointer-events-none" />

            <header className="p-8 flex justify-between items-center z-10 border-b border-[#ff2a2a]/30">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="text-sm border border-[#ff2a2a] px-4 py-2 hover:bg-[#ff2a2a] hover:text-[#1a0505] transition-colors"
                    >
                        ◀ RETURN TO MANAS
                    </button>
                    <h1 className="text-4xl font-black italic tracking-tighter">KAMUI // VIRAL CORE</h1>
                </div>
                <div className="flex gap-8 text-sm font-bold">
                    <div className="animate-pulse">● LIVE BROADCAST</div>
                    <div>VIEWERS: 12,403</div>
                    <div>ENGAGEMENT: 98.2%</div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Featured Media */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="col-span-2 row-span-2 border-2 border-[#ff2a2a] relative group h-[400px] bg-black/50"
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-6xl group-hover:scale-125 transition-transform">▶</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#ff2a2a] text-black font-bold">
                            FEATURED CONTENT: PROJECT TRINITY LAUNCH
                        </div>
                    </motion.div>

                    {/* Stats Panel */}
                    <div className="border border-[#ffaa00] p-6 bg-[#ffaa00]/5">
                        <h3 className="text-[#ffaa00] font-bold mb-4 text-xl">VIRAL VELOCITY</h3>
                        <div className="text-6xl font-black mb-2">88.4</div>
                        <div className="w-full bg-[#330000] h-2">
                            <div className="bg-[#ffaa00] h-full w-[88%]" />
                        </div>
                    </div>

                    {/* Visualizer Panel */}
                    <div className="col-span-1 border border-[#ff2a2a] relative bg-black/30">
                        <canvas ref={canvasRef} className="w-full h-full opacity-70" />
                        <div className="absolute top-2 left-2 text-xs font-bold bg-[#ff2a2a] text-black px-2">AUDIO OUT</div>
                    </div>

                    {/* Quick Actions */}
                    <div className="border-t-4 border-[#ff2a2a] bg-[#1a0000] p-6 flex flex-col justify-between">
                        <h3 className="font-bold mb-4">DEPLOY STRATEGY</h3>
                        <div className="space-y-4">
                            <button className="w-full py-3 bg-[#ff2a2a] text-black font-bold hover:bg-white hover:text-black transition-colors">
                                GENERATE THUMBNAIL
                            </button>
                            <button className="w-full py-3 border border-[#ffaa00] text-[#ffaa00] font-bold hover:bg-[#ffaa00] hover:text-black transition-colors">
                                ANALYZE TRENDS
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
