import { useState, useEffect } from 'react';
import { Brain, FileDigit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const BrainLogWidget = () => {
    const [content, setContent] = useState<string>('Connecting to Neural Core...');
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchMemory = async () => {
            try {
                const res = await fetch('http://localhost:5174/api/brain');
                if (res.ok) {
                    const data = await res.json();
                    setContent(data.content);
                } else {
                    throw new Error('Failed to fetch');
                }
            } catch (e) {
                setError(true);
                setContent('// ERROR: CONNECTION TO NEURAL CORE LOST.\n// PLEASE ENSURE BRIDGE SERVER IS RUNNING.\n// > node server.js');
            }
        };

        fetchMemory();
        // Poll every 10 seconds
        const interval = setInterval(fetchMemory, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black/80 backdrop-blur-md border border-cyber-cyan/30 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-cyber-cyan/30 bg-cyber-cyan/5">
                <div className="flex items-center gap-2 text-cyber-cyan">
                    <Brain size={16} />
                    <span className="font-bold tracking-widest text-xs">NEURAL CORE DUMP</span>
                </div>
                {error && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                {!error && <div className="w-2 h-2 rounded-full bg-green-500" />}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 font-mono text-xs text-cyber-cyan/80 leading-relaxed">
                <div className="prose prose-invert prose-xs max-w-none prose-p:my-1 prose-headings:text-cyber-magenta prose-headings:my-2">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};
