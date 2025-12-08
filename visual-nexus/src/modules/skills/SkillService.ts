import { Terminal, PenTool, LayoutTemplate, FileJson } from 'lucide-react';

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
                id: 's1',
                name: 'Codex Agent Blueprint',
                description: 'YAML-based Context Engineering Agent definition.',
                icon: Terminal,
                path: '.agent/prompts/templates/codex_agent_blueprint.md',
                category: 'agent'
            },
            {
                id: 's2',
                name: 'Shunsuke Blog',
                description: 'SEO-optimized blog writing specialist.',
                icon: PenTool,
                path: '.agent/prompts/templates/shunsuke_blog_prompt.md',
                category: 'writing'
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
