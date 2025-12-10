import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runScript = (scriptName) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, scriptName);
        console.log(`🚀 Running ${scriptName}...`);

        const child = spawn('node', [scriptPath], { stdio: 'inherit', shell: true });

        child.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ ${scriptName} completed successfully.`);
                resolve();
            } else {
                console.error(`❌ ${scriptName} failed with code ${code}.`);
                reject(new Error(`${scriptName} failed`));
            }
        });

        child.on('error', (err) => {
            console.error(`❌ Failed to start ${scriptName}:`, err);
            reject(err);
        });
    });
};

const main = async () => {
    console.log('🔄 Starting Visual Nexus Data Generation...');
    try {
        await runScript('sync-memory.js');
        await runScript('sync-skills.js');
        await runScript('sync-activity.js');
        console.log('✨ All data generation complete! Nexus is ready.');
    } catch (error) {
        console.error('💥 Data generation failed:', error);
        process.exit(1);
    }
};

main();
