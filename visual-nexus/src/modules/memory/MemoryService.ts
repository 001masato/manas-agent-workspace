
import memories from './memories.json';

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
        return memories as Memory[];
    }
};
