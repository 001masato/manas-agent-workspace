
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIGURATION
const PROMPTS_DIR = path.resolve(__dirname, '../../.agent/prompts');
const OUTPUT_FILE = path.resolve(__dirname, '../public/data/skills.json');

console.log(`🚀 Skill Arsenal: Indexing Protocol Initiated...`);
console.log(`   Source: ${PROMPTS_DIR}`);

const getAllFiles = (dirPath, arrayOfFiles) => {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.md')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });
    return arrayOfFiles;
};

try {
    if (!fs.existsSync(PROMPTS_DIR)) {
        console.error(`❌ Error: Prompts directory not found at ${PROMPTS_DIR}`);
        process.exit(1);
    }

    const files = getAllFiles(PROMPTS_DIR);
    console.log(`   Found ${files.length} potential skill modules.`);

    const skills = files.map((filePath, index) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const relativePath = path.relative(PROMPTS_DIR, filePath).replace(/\\/g, '/');
        const filename = path.basename(filePath);

        // Simple Metadata Extraction
        // default title is filename without extension
        let title = filename.replace('.md', '');
        let description = 'No description available.';
        let tags = ['general'];

        // Try to infer tags from folder structure
        const folders = relativePath.split('/');
        if (folders.length > 1) {
            tags.push(folders[0]); // e.g. 'templates' or 'system'
        }

        // Try to read frontmatter or first line for title
        const lines = content.split('\n');
        if (lines[0].startsWith('# ')) {
            title = lines[0].replace('# ', '').trim();
        }

        return {
            id: `skill_${index}_${Math.random().toString(36).substr(2, 5)}`,
            title: title,
            file: filename,
            path: relativePath, // logical path for display
            fullPath: filePath,
            description: description,
            tags: tags,
            content: content // Include content for copy function
        };
    });

    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(skills, null, 2));

    console.log(`✅ Indexing Complete.`);
    console.log(`   - Generated ${skills.length} skill cards.`);
    console.log(`   - Output: ${OUTPUT_FILE}`);

} catch (error) {
    console.error('❌ Skill Indexing Failed:', error);
    process.exit(1);
}
