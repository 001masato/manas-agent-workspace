
import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5174;

// Routes

// 1. SYNC: Run save_memory.ps1 AND sync-memory.js
app.post('/api/sync', (req, res) => {
    console.log('[BRIDGE] Initiating Memory Sync...');
    // Paths
    const saveScript = path.resolve(__dirname, '../.agent/save_memory.ps1');
    const jsonScript = path.resolve(__dirname, 'scripts/sync-memory.js');

    // 1. Run Git Save
    // We use a safe command execution pattern
    const cmdSave = `powershell -ExecutionPolicy Bypass -File "${saveScript}" -AutoPush $true`;

    // 2. Run JSON Gen
    const cmdJson = `node "${jsonScript}"`;

    // Chain execution
    exec(cmdSave, (err, stdout, stderr) => {
        if (err) {
            console.error('[BRIDGE] Git Save Error:', err);
            // Proceeding to JSON gen anyway as git might error if nothing to commit
        }
        console.log('[BRIDGE] Git Output:', stdout);

        exec(cmdJson, (err2, stdout2, stderr2) => {
            if (err2) {
                console.error('[BRIDGE] JSON Gen Error:', err2);
                return res.status(500).json({ error: 'JSON generation failed', details: stderr2 });
            }
            console.log('[BRIDGE] JSON Gen Output:', stdout2);
            res.json({ message: 'Sync Cycle Complete', output: stdout + '\n' + stdout2 });
        });
    });
});

// 2. READ MEMORY: Get .agent/manas-memory.md content
app.get('/api/brain', (req, res) => {
    const memoryPath = path.resolve(__dirname, '../.agent/manas-memory.md');
    try {
        const content = fs.readFileSync(memoryPath, 'utf-8');
        res.json({ content });
    } catch (e) {
        res.status(500).json({ error: 'Could not read memory core.' });
    }
});

app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║      VISUAL NEXUS - BRIDGE SERVER      ║
    ║        STATUS: ONLINE (PORT ${PORT})      ║
    ╚════════════════════════════════════════╝
    `);
});
