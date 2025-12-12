
import { Terminal, Github, Play, RefreshCw, Save } from 'lucide-react';
import { jobManager } from '../core/JobManager';

export interface Command {
    id: string;
    label: string;
    command: string;
    icon: any;
    xpReward: number;
    category: 'system' | 'git' | 'workflow';
    action?: () => Promise<any>;
}

export const CommandService = {
    getCommands: (): Command[] => [
        {
            id: 'dev_server',
            label: 'Start Dev Server',
            command: 'npm run dev',
            icon: Play,
            xpReward: 10,
            category: 'system'
        },
        {
            id: 'build_prod',
            label: 'Build Production',
            command: 'npm run build',
            icon: RefreshCw,
            xpReward: 50,
            category: 'system'
        },
        {
            id: 'git_status',
            label: 'Check Status',
            command: 'git status',
            icon: Github,
            xpReward: 5,
            category: 'git'
        },
        {
            id: 'git_save',
            label: 'Quick Save (WIP)',
            command: 'git add . && git commit -m "wip: progress update"',
            icon: Save,
            xpReward: 25,
            category: 'git'
        },
        {
            id: 'memory_sync',
            label: 'Sync Memory',
            command: 'npm run memory:sync',
            icon: Terminal,
            xpReward: 15,
            category: 'workflow',
            action: async () => {
                return jobManager.runJob('Memory Sync Protocol', async () => {
                    const res = await fetch('http://localhost:5174/api/sync', { method: 'POST' });
                    if (!res.ok) throw new Error('Bridge connection failed');
                    return await res.json();
                });
            }
        },
        {
            id: 'skills_sync',
            label: 'Sync Skills',
            command: 'npm run skills:sync',
            icon: Terminal,
            xpReward: 15,
            category: 'workflow',
            action: async () => {
                return jobManager.runJob('Skill Indexing', async () => {
                    // In a real app we might call an API. Here we simulate the delay.
                    await new Promise(r => setTimeout(r, 1500));
                    return { message: 'Use terminal to run: npm run skills:sync' };
                });
            }
        }
    ],

    // Placeholder for Project ALIVE XP System
    calculateXp: (commandId: string): number => {
        const cmd = CommandService.getCommands().find(c => c.id === commandId);
        return cmd ? cmd.xpReward : 0;
    },

    execute: async (cmd: Command) => {
        if (cmd.action) {
            return cmd.action();
        }
        return null;
    }
};
