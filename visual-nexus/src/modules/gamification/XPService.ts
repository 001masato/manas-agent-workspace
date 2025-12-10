export interface XPData {
    currentXP: number;
    level: number;
    totalCommands: number;
    lastAction: string;
}

const STORAGE_KEY = 'manas_xp_data';

// XP Calculation: Level = floor(sqrt(XP / 100))
// Level 1: 100 XP
// Level 2: 400 XP
// Level 3: 900 XP
// Level 10: 10,000 XP

export const XPService = {
    getData: (): XPData => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            currentXP: 0,
            level: 0,
            totalCommands: 0,
            lastAction: 'System Initialized',
        };
    },

    saveData: (data: XPData) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        // Dispatch custom event for UI updates
        window.dispatchEvent(new Event('xp-update'));
    },

    addXP: (amount: number, actionName: string): { leveledUp: boolean, newLevel: number } => {
        const data = XPService.getData();
        const oldLevel = data.level;

        data.currentXP += amount;
        data.totalCommands += 1;
        data.lastAction = actionName;

        // Calculate new level
        const newLevel = Math.floor(Math.sqrt(data.currentXP / 100));
        data.level = newLevel;

        // Check for Level Up
        if (newLevel > oldLevel) {
            window.dispatchEvent(new CustomEvent('level-up', { detail: { level: newLevel } }));
        }

        XPService.saveData(data);

        return {
            leveledUp: newLevel > oldLevel,
            newLevel
        };
    },

    // Helper to get progress to next level (0-100%)
    getProgress: (): number => {
        const data = XPService.getData();
        const currentLevelXP = Math.pow(data.level, 2) * 100;
        const nextLevelXP = Math.pow(data.level + 1, 2) * 100;

        const needed = nextLevelXP - currentLevelXP;
        const earned = data.currentXP - currentLevelXP;

        return Math.min(100, Math.max(0, (earned / needed) * 100));
    }
};
