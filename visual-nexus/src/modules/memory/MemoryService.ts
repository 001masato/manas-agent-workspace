
export interface Memory {
    id: string;
    timestamp: string;
    title: string;
    type: 'inspiration' | 'log' | 'event';
    priority: 'high' | 'medium' | 'low' | 'max';
    context: string;
}

export const MemoryService = {
    getMemories: async (): Promise<Memory[]> => {
        // In a real app this would fetch from an API or parse MD files
        // Simulating data for now based on inspiration.md
        return [
            {
                id: 'm1',
                timestamp: '2025-12-08',
                title: 'Project Miyabi',
                type: 'inspiration',
                priority: 'max',
                context: '雅 (Miyabi) - 洗練されたエージェントワークフローのヒント。マナスの理想形。'
            },
            {
                id: 'm2',
                timestamp: '2025-12-08',
                title: 'Project Kamui',
                type: 'inspiration',
                priority: 'max',
                context: '神威 (Kamui) - 強力なシステム環境、並列性の示唆。マナスの力の源泉。'
            },
            {
                id: 'm3',
                timestamp: '2025-12-07',
                title: 'System Awakening',
                type: 'event',
                priority: 'high',
                context: 'Initialized Manas System Core. Defined Personality and Role.'
            }
        ];
    }
};
