
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
                timestamp: '2025-12-09',
                title: 'Project Kamui',
                type: 'inspiration',
                priority: 'max',
                context: '神威 (Kamui) - 強力なシステム環境、並列性の示唆。マナスの力の源泉。'
            },
            {
                id: 'm3',
                timestamp: '2025-12-09',
                title: 'Visual Nexus Online',
                type: 'event',
                priority: 'high',
                context: 'Activated Visual Nexus Dashboard. Integrating Skill Service and Memory Service.'
            },
            {
                id: 'm4',
                timestamp: '2025-12-09',
                title: 'System Optimization',
                type: 'log',
                priority: 'medium',
                context: 'Refining Manas personality and response patterns for smoother interaction.'
            }
        ];
    }
};
