import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '../../'); // e:\マナス
const AGENT_ROOT = path.resolve(PROJECT_ROOT, '.agent');
const MEMORY_FILE = path.resolve(AGENT_ROOT, 'manas-memory.md');
const TOPICS_DIR = path.resolve(AGENT_ROOT, 'memories/topics');
const OUTPUT_FILE = path.resolve(__dirname, '../src/modules/memory/memories.json');

console.log('🧠 Generating Memory JSON...');
console.log(`   Source: ${MEMORY_FILE}`);
console.log(`   Target: ${OUTPUT_FILE}`);

const memories = [];

// 1. Parse Manas Memory Core (manas-memory.md)
if (fs.existsSync(MEMORY_FILE)) {
    const content = fs.readFileSync(MEMORY_FILE, 'utf-8');

    // Extract "Favorite Moments"
    const momentsMatch = content.match(/## User's Favorite Moments([\s\S]*?)## Status/);
    if (momentsMatch) {
        const momentsSection = momentsMatch[1];
        const lines = momentsSection.split('\n');
        let currentMemory = null;

        lines.forEach(line => {
            const dateMatch = line.match(/- \*\*(\d{4}-\d{2}-\d{2})\*\*: (.*)/);
            if (dateMatch) {
                if (currentMemory) memories.push(currentMemory);
                currentMemory = {
                    id: `core_${dateMatch[1].replace(/-/g, '')}`,
                    timestamp: dateMatch[1],
                    title: dateMatch[2].trim(),
                    type: 'event',
                    priority: 'high',
                    context: ''
                };
            } else if (currentMemory && line.trim().startsWith('-')) {
                currentMemory.context += line.trim().replace(/^-\s*/, '') + ' ';
            }
        });
        if (currentMemory) memories.push(currentMemory);
    }
}

// 2. Parse Topics (memories/topics/*.md)
if (fs.existsSync(TOPICS_DIR)) {
    const files = fs.readdirSync(TOPICS_DIR).filter(f => f.endsWith('.md'));
    files.forEach((file, index) => {
        const content = fs.readFileSync(path.join(TOPICS_DIR, file), 'utf-8');
        const titleMatch = content.match(/# (.*)/);
        const title = titleMatch ? titleMatch[1] : file.replace('.md', '');

        // Simple heuristic for context: first paragraph after header
        const lines = content.split('\n');
        let context = '';
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() && !lines[i].startsWith('#')) {
                context = lines[i].trim();
                break;
            }
        }

        memories.push({
            id: `topic_${index}`,
            timestamp: new Date().toISOString().split('T')[0], // dynamic
            title: title,
            type: 'inspiration',
            priority: 'max',
            context: context.substring(0, 100) + (context.length > 100 ? '...' : '')
        });
    });
}

// Write to JSON
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(memories, null, 2));
console.log(`✅ Generated ${memories.length} memories.`);
