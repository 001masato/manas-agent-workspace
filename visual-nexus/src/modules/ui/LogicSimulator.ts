import { type Skill } from '../skills/SkillService';

export const LogicSimulator = {
    simulate: (query: string): Skill[] => {
        const q = query.toLowerCase();
        const nodes: Skill[] = [];
        const timestamp = Date.now();

        const createNode = (name: string, category: string, desc: string, offset: number): Skill => ({
            id: `sim-${timestamp}-${offset}`,
            name: name,
            description: desc,
            category: category,
            path: `generated://${category}/${name.toLowerCase().replace(/\s/g, '-')}`,
            tags: ['simulation', 'generated']
        });

        if (q.includes('analyze') || q.includes('search') || q.includes('scan')) {
            nodes.push(createNode('Input Stream', 'logic/input', 'Raw data injection point', 1));
            nodes.push(createNode('Pattern Rec', 'logic/process', 'Identifying structural anomalies', 2));
            nodes.push(createNode('Synthesis', 'logic/process', 'Combinatorial logic generation', 3));
            nodes.push(createNode('Report', 'logic/output', 'Final analysis vector', 4));
        }
        else if (q.includes('create') || q.includes('generate') || q.includes('make')) {
            nodes.push(createNode('Concept Seed', 'creative/source', 'Initial idea vector', 1));
            nodes.push(createNode('Draft Protocol', 'creative/process', 'Rough structure generation', 2));
            nodes.push(createNode('Refinement', 'creative/process', 'Noise reduction and polishing', 3));
            nodes.push(createNode('Masterpiece', 'creative/output', 'Finalized artifact output', 4));
        }
        else if (q.includes('deploy') || q.includes('push') || q.includes('ship')) {
            nodes.push(createNode('Build Sequence', 'dev/ops', 'Compiling source assets', 1));
            nodes.push(createNode('Safety Check', 'dev/security', 'Running vulnerability scan', 2));
            nodes.push(createNode('Deploy Trigger', 'dev/ops', 'Pushing to remote environment', 3));
            nodes.push(createNode('Live Monitor', 'dev/monitor', 'Tracking system stability', 4));
        }

        return nodes;
    }
};
