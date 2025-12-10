
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
// Adjust paths relative to script location: visual-nexus/scripts/sync-memory.js
const MEMORY_FILE_PATH = path.resolve(__dirname, '../../.agent/manas-memory.md');
const OUTPUT_FILE_PATH = path.resolve(__dirname, '../src/modules/memory/memories.json');

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
    if (!fs.existsSync(MEMORY_FILE_PATH)) {
        throw new Error(`Memory file not found at ${MEMORY_FILE_PATH}`);
    }

    const content = fs.readFileSync(MEMORY_FILE_PATH, 'utf-8');
    const memories = [];

    // 1. Parse "User's Favorite Moments"
    // Format: - **YYYY-MM-DD**: Title
    //           - User said: "..."
    //           - Key success: ...
    const momentsRegex = /- \*\*(\d{4}-\d{2}-\d{2})\*\*: (.*)\r?\n\s*- (.*)\r?\n\s*- (.*)/g;

    // We can also use a simpler line-by-line parser for robustness
    const lines = content.split('\n');
    let currentSection = '';
    let currentMemory = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Detect Section
        if (line.startsWith('## ')) {
            currentSection = line.replace('## ', '').trim();
            continue;
        }

        if (currentSection === "User's Favorite Moments") {
            // Start of a new memory item
            const dateMatch = line.match(/- \*\*(\d{4}-\d{2}-\d{2})\*\*: (.*)/);
            if (dateMatch) {
                // Save previous if exists
                if (currentMemory) {
                    memories.push(currentMemory);
                }

                const [_, date, title] = dateMatch;

                // Determine tags based on content
                const tags = determineTags(title + " " + (currentMemory?.context || ""));

                currentMemory = {
                    id: `mem_${date.replace(/-/g, '')}_${Math.random().toString(36).substr(2, 5)}`, // Generate stable-ish ID
                    timestamp: date,
                    title: title.trim(),
                    type: tags.includes('system') ? 'system' : 'event',
                    priority: 'high',
                    context: '',
                    tags: tags // Add tags
                };
            }
            // Append details to context
            else if (currentMemory && line.startsWith('- ')) {
                const detail = line.replace('- ', '').trim();
                // Clean up common prefixes for cleaner UI
                const cleanDetail = detail.replace(/User said: |Key success: /g, '');
                currentMemory.context += (currentMemory.context ? ' ' : '') + cleanDetail;
            }
        }
    }
    // Push last memory
    if (currentMemory) {
        // Determine tags for the last memory
        currentMemory.tags = determineTags(currentMemory.title, currentMemory.context);
        memories.push(currentMemory);
    }

    // 2. Add System Entry (Inspirations) - This is effectively a "Pinned" memory
    // In a real scenario, we might parse this from another file or section
    memories.push({
        id: "sys_inspiration_link",
        timestamp: new Date().toISOString().split('T')[0],
        title: "🌌 Inspiration & Future Hints",
        type: "inspiration",
        priority: "max",
        context: "User's collection of future concepts and project references."
    });

    // Write to JSON
    fs.writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(memories, null, 2), 'utf-8');

    console.log(`✅ Synchronization Complete!`);
    console.log(`   - Parsed ${memories.length} memories`);
    console.log(`   - Wrote to ${OUTPUT_FILE_PATH}`);

} catch (error) {
    console.error('❌ Memory Synchronization Failed:', error);
    process.exit(1);
}
