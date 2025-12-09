
import { Terminal, Github, Play, RefreshCw, Save } from 'lucide-react';

export interface Command {
    id: string;
    label: string;
    command: string;
    icon: any;
    xpReward: number;
    category: 'system' | 'git' | 'workflow';
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
            category: 'workflow'
        },
        {
            id: 'skills_sync',
            label: 'Sync Skills',
            command: 'npm run skills:sync',
            icon: Terminal,
            xpReward: 15,
            category: 'workflow'
        }
    ],

    // Placeholder for Project ALIVE XP System
    calculateXp: (commandId: string): number => {
        const cmd = CommandService.getCommands().find(c => c.id === commandId);
        return cmd ? cmd.xpReward : 0;
    }
};
