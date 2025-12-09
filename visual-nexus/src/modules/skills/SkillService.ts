
import skillsData from './skills.json';

export interface Skill {
    id: string;
    name: string;
    description: string;
    category: 'template' | 'workflow';
    path: string;
}

export const SkillService = {
    getSkills: async (): Promise<Skill[]> => {
        return skillsData as Skill[];
    }
};
