
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
// relative to visual-nexus/scripts/sync-skills.js
const PROMPTS_ROOT = path.resolve(__dirname, '../../.agent/prompts');
const TEMPLATES_DIR = path.join(PROMPTS_ROOT, 'templates');
const OUTPUT_FILE_PATH = path.resolve(__dirname, '../src/modules/skills/skills.json');

console.log(`🔍 Scanning Skills at: ${PROMPTS_ROOT}`);

const skills = [];

function parseFile(filePath, category) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const filename = path.basename(filePath, '.md');

        // Simple title extraction (First H1 or Filename)
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : filename.replace(/_/g, ' ').replace(/-/g, ' ');

        // Description extraction (First paragraph after title, or generic)
        const descMatch = content.match(/^(?!#)(.+)$/m);
        const description = descMatch ? descMatch[1].slice(0, 100) + '...' : 'Available prompt template.';

        return {
            id: filename,
            name: title,
            description: description,
            category: category,
            path: filePath // storing absolute path for reference, but UI might not need it
        };
    } catch (e) {
        console.warn(`Skipping ${filePath}:`, e.message);
        return null;
    }
}

// 1. Scan Templates
if (fs.existsSync(TEMPLATES_DIR)) {
    const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.md'));
    files.forEach(f => {
        const skill = parseFile(path.join(TEMPLATES_DIR, f), 'template');
        if (skill) skills.push(skill);
    });
}

// 2. Scan Root Prompts (excluding README)
if (fs.existsSync(PROMPTS_ROOT)) {
    const files = fs.readdirSync(PROMPTS_ROOT).filter(f => f.endsWith('.md') && !f.toLowerCase().includes('readme'));
    files.forEach(f => {
        const skill = parseFile(path.join(PROMPTS_ROOT, f), 'workflow');
        if (skill) skills.push(skill);
    });
}

// Write to JSON
fs.writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(skills, null, 2), 'utf-8');

console.log(`✅ Skill Synchronization Complete!`);
console.log(`   - Index ${skills.length} skills`);
console.log(`   - Wrote to ${OUTPUT_FILE_PATH}`);
