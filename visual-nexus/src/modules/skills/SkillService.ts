import { Terminal, PenTool, LayoutTemplate, FileJson, Mic, HeartHandshake, GitBranch, MessageSquare } from 'lucide-react';

export interface Skill {
    id: string;
    name: string;
    description: string;
    icon: any; // Lucide icon
    path: string;
    category: 'agent' | 'writing' | 'coding' | 'system';
}

export const SkillService = {
    getSkills: async (): Promise<Skill[]> => {
        return [
            {
                id: 's_record',
                name: 'Auto Record Conversation',
                description: 'Record and save conversation to GitHub.',
                icon: Mic,
                path: '/auto-record-conversation',
                category: 'system'
            },
            {
                id: 's_care',
                name: 'Care Plan Generator',
                description: 'Auto-generate care plans.',
                icon: HeartHandshake,
                path: '/care-plan',
                category: 'writing'
            },
            {
                id: 's_github',
                name: 'Easy GitHub',
                description: 'Simplify GitHub operations.',
                icon: GitBranch,
                path: '/easy-github',
                category: 'agent'
            },
            {
                id: 's_issue',
                name: 'GitHub Issues',
                description: 'Create GitHub issues automatically.',
                icon: MessageSquare,
                path: '/github-issues',
                category: 'agent'
            },
            {
                id: 's_note',
                name: 'Note Writing',
                description: 'Generate note.com articles.',
                icon: PenTool,
                path: '/note-writing',
                category: 'writing'
            },
            {
                id: 's1',
                name: 'Codex Agent Blueprint',
                description: 'YAML-based Context Engineering Agent definition.',
                icon: Terminal,
                path: '.agent/prompts/templates/codex_agent_blueprint.md',
                category: 'agent'
            },
            {
                id: 's3',
                name: 'GAS Slide Gen',
                description: 'Auto-generate Google Slides from text.',
                icon: LayoutTemplate,
                path: '.agent/prompts/templates/gas_slide_generation_prompt.md',
                category: 'coding'
            },
            {
                id: 's4',
                name: 'GAS Slide JSON',
                description: 'Pure JSON output for slide structures.',
                icon: FileJson,
                path: '.agent/prompts/templates/gas_slide_json_prompt.md',
                category: 'coding'
            }
        ];
    }
};
