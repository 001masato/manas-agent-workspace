
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const MEMORY_FILE_PATH = path.resolve(__dirname, '../../.agent/manas-memory.md');
const TASK_SOURCE = path.resolve(__dirname, '../../.agent/current_task.md');
const OUTPUT_FILE_PATH = path.resolve(__dirname, '../public/brain_dump.json');

const TAGS_MAP = {
    'joy': ['happy', 'fun', 'excited', 'good', 'great', 'success'],
    'achievement': ['completed', 'done', 'finished', 'won', 'deployed', 'shipped'],
    'learning': ['learned', 'studied', 'read', 'understood', 'found', 'research'],
    'system': ['update', 'upgrade', 'fix', 'bug', 'error', 'setup', 'config'],
    'social': ['user', 'friend', 'meet', 'talk', 'discuss']
};

const determineTags = (content) => {
    const lower = content.toLowerCase();
    const tags = new Set();
    Object.entries(TAGS_MAP).forEach(([tag, keywords]) => {
        if (keywords.some(k => lower.includes(k))) tags.add(tag);
    });
    return Array.from(tags);
};

console.log(`🔍 Scanning Memory Core at: ${MEMORY_FILE_PATH}`);

try {
    // --- MEMORIES PARSING ---
    let memories = [];
    if (fs.existsSync(MEMORY_FILE_PATH)) {
        const content = fs.readFileSync(MEMORY_FILE_PATH, 'utf-8');
        const lines = content.split('\n');
        let currentSection = '';
        let currentMemory = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('## ')) {
                currentSection = line.replace('## ', '').trim();
                continue;
            }

            if (currentSection === "User's Favorite Moments") {
                const dateMatch = line.match(/- \*\*(\d{4}-\d{2}-\d{2})\*\*: (.*)/);
                if (dateMatch) {
                    if (currentMemory) memories.push(currentMemory);
                    const [_, date, title] = dateMatch;
                    const tags = determineTags(title + " " + (currentMemory?.context || ""));
                    currentMemory = {
                        id: `mem_${date.replace(/-/g, '')}_${Math.random().toString(36).substr(2, 5)}`,
                        timestamp: date,
                        title: title.trim(),
                        type: tags.includes('system') ? 'system' : 'event',
                        tags: tags,
                        context: ''
                    };
                } else if (currentMemory && line.startsWith('- ')) {
                    const detail = line.replace('- ', '').trim().replace(/User said: |Key success: /g, '');
                    currentMemory.context += (currentMemory.context ? ' ' : '') + detail;
                }
            }
        }
        if (currentMemory) {
            currentMemory.tags = determineTags(currentMemory.title + " " + currentMemory.context);
            memories.push(currentMemory);
        }
    } else {
        console.warn(`⚠️ Memory file not found at ${MEMORY_FILE_PATH}`);
    }

    // --- TASKS PARSING ---
    let tasks = [];

    if (fs.existsSync(TASK_SOURCE)) {
        console.log(`📝 Parsing Tasks from: ${TASK_SOURCE}`);
        const content = fs.readFileSync(TASK_SOURCE, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
            const trimmed = line.trim();
            const match = trimmed.match(/- \[(.| )\] (.*)/);
            if (match) {
                const marker = match[1];
                const text = match[2];
                let status = 'pending';
                if (marker === 'x' || marker === 'X') status = 'completed';
                if (marker === '/') status = 'in_progress';

                const indent = line.search(/\S|$/);

                tasks.push({
                    id: `task_${index}`,
                    text: text.replace(/<!--.*-->/, '').trim(),
                    status: status,
                    indent: indent
                });
            }
        });
    } else {
        console.log(`ℹ️ No active task file found at ${TASK_SOURCE}`);
    }

    // Final Payload
    const payload = {
        lastSync: new Date().toLocaleString(),
        memories,
        tasks,
        stats: {
            memoryCount: memories.length,
            taskCount: tasks.length,
            completedTasks: tasks.filter(t => t.status === 'completed').length
        }
    };

    const publicDir = path.dirname(OUTPUT_FILE_PATH);
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(payload, null, 2), 'utf-8');

    console.log(`✅ Synchronization Complete!`);
    console.log(`   - Wrote to ${OUTPUT_FILE_PATH}`);

} catch (error) {
    console.error('❌ Memory Synchronization Failed:', error);
    process.exit(1);
}
