import { useState } from 'react';
import { RefreshCw, Check, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const SyncButton = () => {
    const [status, setStatus] = useState<'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR'>('IDLE');

    const handleSync = async () => {
        if (status === 'SYNCING') return;
        setStatus('SYNCING');

        try {
            const res = await fetch('http://localhost:5174/api/sync', { method: 'POST' });
            if (res.ok) {
                setStatus('SUCCESS');
                setTimeout(() => setStatus('IDLE'), 3000);
            } else {
                setStatus('ERROR');
                setTimeout(() => setStatus('IDLE'), 3000);
            }
        } catch (e) {
            console.error(e);
            setStatus('ERROR');
            setTimeout(() => setStatus('IDLE'), 3000);
        }
    };

    return (
        <button
            onClick={handleSync}
            disabled={status === 'SYNCING'}
            className={`
                relative overflow-hidden group px-6 py-2 font-bold font-mono text-sm tracking-widest transition-all duration-300 clip-path-polygon
                ${status === 'ERROR' ? 'bg-red-500/10 border border-red-500 text-red-500' :
                    status === 'SUCCESS' ? 'bg-green-500/10 border border-green-500 text-green-500' :
                        'bg-cyber-magenta/10 border border-cyber-magenta text-cyber-magenta hover:bg-cyber-magenta/30'}
                border-l-4
            `}
        >
            <div className="flex items-center gap-2 relative z-10">
                {status === 'IDLE' && <><RefreshCw size={16} /> SYSTEM.SYNC</>}
                {status === 'SYNCING' && <><RefreshCw size={16} className="animate-spin" /> EXECUTING...</>}
                {status === 'SUCCESS' && <><Check size={16} /> SYNC COMPLETE</>}
                {status === 'ERROR' && <><AlertTriangle size={16} /> CONNECTION FAILED</>}
            </div>

            {/* Background Fill Effect */}
            {status === 'SYNCING' && (
                <motion.div
                    className="absolute inset-0 bg-cyber-magenta/20"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                />
            )}
        </button>
    );
};
