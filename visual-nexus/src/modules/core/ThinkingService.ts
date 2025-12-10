export interface ThoughtLog {
    id: string;
    timestamp: string;
    message: string;
    type: 'info' | 'process' | 'analysis' | 'network' | 'search';
}

const PROCESS_VERBS = [
    'ANALYZING', 'OPTIMIZING', 'SYNCING', 'CALCULATING', 'DECRYPTING',
    'RENDERING', 'PARSING', 'COMPILING', 'SCANNING', 'INDEXING'
];

const TARGETS = [
    'NEURAL PATHWAYS', 'MEMORY SHARDS', 'GITHUB REPOSITORIES', 'VITE BUNDLER',
    'REACT COMPONENTS', 'USER CONTEXT', 'LOGIC GATES', 'QUANTUM STATES',
    'DEPENDENCY GRAPH', 'STYLESHEET TOKENS'
];

export const ThinkingService = {
    generateId: () => Math.random().toString(36).substr(2, 9),

    getRandomThought: (): ThoughtLog => {
        const verb = PROCESS_VERBS[Math.floor(Math.random() * PROCESS_VERBS.length)];
        const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
        const value = Math.floor(Math.random() * 100);

        return {
            id: ThinkingService.generateId(),
            timestamp: new Date().toLocaleTimeString(),
            message: `${verb} ${target}... [${value}%]`,
            type: 'process'
        };
    },

    getInsight: (context: string): ThoughtLog => {
        return {
            id: ThinkingService.generateId(),
            timestamp: new Date().toLocaleTimeString(),
            message: `INSIGHT DERIVED: ${context.toUpperCase()}`,
            type: 'analysis'
        };
    }
};
