import React, { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react';
import { audioService } from '../media/AudioAnalysisService';

export type OverdrivePhase = 'NORMAL' | 'ACTIVE' | 'OVERDRIVE';

interface OverdriveContextType {
    syncRate: number; // 0 - 100
    phase: OverdrivePhase;
    audioData: Uint8Array;
    triggerActivity: (intensity?: number) => void;
    registerAudioSource: (file: File) => Promise<void>;
}

const OverdriveContext = createContext<OverdriveContextType | undefined>(undefined);

export const OverdriveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [syncRate, setSyncRate] = useState(0);
    const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(0));
    const rafRef = useRef<number>();

    // Phase calculation
    const phase: OverdrivePhase = syncRate > 80 ? 'OVERDRIVE' : syncRate > 40 ? 'ACTIVE' : 'NORMAL';

    // Decay Logic
    useEffect(() => {
        const decayLoop = () => {
            setSyncRate(prev => {
                if (prev <= 0) return 0;
                // Decay faster in higher phases to require maintenance
                const decayAmount = prev > 80 ? 0.3 : prev > 40 ? 0.15 : 0.05;
                return Math.max(0, prev - decayAmount);
            });
            rafRef.current = requestAnimationFrame(decayLoop);
        };
        rafRef.current = requestAnimationFrame(decayLoop);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    // Audio Analysis Loop
    useEffect(() => {
        let audioLoopId: number;
        const updateAudio = () => {
            if (audioService.isActive()) {
                setAudioData(audioService.getFrequencyData());
            }
            audioLoopId = requestAnimationFrame(updateAudio);
        };
        updateAudio();
        return () => cancelAnimationFrame(audioLoopId);
    }, []);

    const triggerActivity = (intensity: number = 5) => {
        setSyncRate(prev => Math.min(100, prev + intensity));
    };

    const registerAudioSource = async (file: File) => {
        await audioService.loadFile(file);
    };

    return (
        <OverdriveContext.Provider value={{ syncRate, phase, audioData, triggerActivity, registerAudioSource }}>
            {children}
        </OverdriveContext.Provider>
    );
};

export const useOverdrive = () => {
    const context = useContext(OverdriveContext);
    if (!context) throw new Error('useOverdrive must be used within OverdriveProvider');
    return context;
};
