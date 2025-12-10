import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = path.join(__dirname, '../src/modules/data/activity.json');
const REPO_ROOT = path.join(__dirname, '../..'); // e:\マナス

console.log('🔄 Syncing Neural Activity (Git Log)...');

try {
    // Ensure output dir exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Get git log dates
    const cmd = `git log --date=short --format="%ad" -n 1000`;
    console.log(`📂 Executing git log in ${REPO_ROOT}...`);

    const logs = execSync(cmd, { cwd: REPO_ROOT, encoding: 'utf-8' });
    const dates = logs.split('\n').filter(Boolean);

    // Aggregate
    const activityMap = {};
    dates.forEach(date => {
        activityMap[date] = (activityMap[date] || 0) + 1;
    });

    // Format for UI (Last 14 days + padding)
    const today = new Date();
    const activityList = [];

    for (let i = 0; i < 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        const count = activityMap[dateStr] || 0;
        let intensity = 0;
        if (count > 0) intensity = 1;
        if (count > 3) intensity = 2;
        if (count > 6) intensity = 3;
        if (count > 10) intensity = 4;

        activityList.push({
            date: dateStr,
            count,
            intensity
        });
    }

    activityList.reverse(); // Oldest to newest

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(activityList, null, 2));
    console.log(`✅ Activity data written to ${OUTPUT_FILE}`);

} catch (error) {
    console.error('❌ Failed to sync activity:', error.message);
    // Write empty fallback
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
}
