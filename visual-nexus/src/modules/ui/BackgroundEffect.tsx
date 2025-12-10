import { motion } from 'framer-motion';

interface Props {
    activeCore: 'MANAS' | 'KAMUI' | 'MIYABI';
}

export const BackgroundEffect = ({ activeCore }: Props) => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Base Noise */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Core Specific Ambience */}
            <motion.div
                className="absolute inset-0 transition-colors duration-1000"
                animate={{
                    background: activeCore === 'KAMUI'
                        ? 'radial-gradient(circle at center, rgba(255,50,0,0.1) 0%, rgba(0,0,0,1) 90%)'
                        : activeCore === 'MIYABI'
                            ? 'radial-gradient(circle at center, rgba(160,0,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                            : 'radial-gradient(circle at center, rgba(0,243,255,0.05) 0%, rgba(0,0,0,0.8) 100%)'
                }}
            />

            {/* Grid Lines (Generic) */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `linear-gradient(${activeCore === 'KAMUI' ? '#ff0000' : activeCore === 'MIYABI' ? '#aa00ff' : '#00f3ff'} 1px, transparent 1px), linear-gradient(90deg, ${activeCore === 'KAMUI' ? '#ff0000' : activeCore === 'MIYABI' ? '#aa00ff' : '#00f3ff'} 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            />
        </div>
    );
};
