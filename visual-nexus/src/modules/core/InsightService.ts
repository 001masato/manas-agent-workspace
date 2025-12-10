export interface Insight {
    greeting: string;
    mission: string;
    subtext: string;
}

export const InsightService = {
    getDailyInsight: (): Insight => {
        const hour = new Date().getHours();

        let greeting = 'SYSTEM ONLINE.';
        if (hour < 5) greeting = 'EARLY_BIRD PROTOCOL INITIATED.';
        else if (hour < 12) greeting = 'GOOD MORNING, 001MASATO.';
        else if (hour < 18) greeting = 'OPERATIONS NOMINAL. GOOD AFTERNOON.';
        else greeting = 'NIGHT_SHIFT MODE ACTIVE.';

        const missions = [
            "TODAY'S OBJECTIVE: ACCELERATE PROJECT VELOCITY.",
            "EXPANDING NEURAL NETWORK CAPACITY.",
            "OPTIMIZING WORKFLOW EFFICIENCY.",
            "SYNCHRONIZING CREATIVE POTENTIAL.",
            "ANALYZING FUTURE POSSIBILITIES."
        ];

        return {
            greeting,
            mission: missions[Math.floor(Math.random() * missions.length)],
            subtext: `SYSTEM VERSION 2.0 // SINGULARITY UPDATE`
        };
    }
};
