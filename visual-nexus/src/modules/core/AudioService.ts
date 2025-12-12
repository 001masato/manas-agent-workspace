class AudioService {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private isMuted: boolean = false;

    constructor() {
        // Initialize on first user interaction to comply with autoplay policies
    }

    private init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.1; // Low volume by default
            this.masterGain.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
    }

    // High-pitched short beep for hover
    public playHover() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime); // Quieter
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    // Crisp mechanical click
    public playClick() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    // Low energetic hum for "Something happened"
    public playActive() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(300, this.ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    // Alert sound
    public playAlert() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }
    public speak(text: string) {
        if (this.isMuted) return;
        this.init();

        // Simple TTS
        if ('speechSynthesis' in window) {
            // Cancel any current speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.volume = 0.5; // Not too loud
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            // Try to find a diverse or sci-fi sounding voice if available
            // QUALITY FIRST: Prioritize Neural/Natural Voices and Female voices
            // User Request: "女性の声だよ" (It's a female voice)
            const voices = window.speechSynthesis.getVoices();
            console.log("Available voices:", voices.map(v => v.name));

            const preferredVoice = voices.find(v =>
                // 1. Google 日本語 (Usually female sounding high quality)
                v.name === 'Google 日本語' ||
                // 2. Microsoft Nanami (Female)
                v.name.includes('Nanami') ||
                // 3. Microsoft Haruka (Female)
                v.name.includes('Haruka') ||
                // 4. Any voice with "Female" or "Woman" in name if available
                v.name.toLowerCase().includes('female') ||
                // 5. Kyoko (Mac)
                v.name.includes('Kyoko')
            );

            // Fallback to any Japanese voice
            const fallbackJpVoice = voices.find(v => v.lang === 'ja-JP');
            // Fallback to English female
            const fallbackEnVoice = voices.find(v => v.lang === 'en-US' && (v.name.includes('Zira') || v.name.includes('Female')));

            if (preferredVoice) {
                utterance.voice = preferredVoice;
                utterance.pitch = 1.0;
                utterance.rate = 1.0;
            } else if (fallbackJpVoice) {
                utterance.voice = fallbackJpVoice;
                // Synthetically raise pitch if we can't confirm it's female, hoping it sounds lighter
                utterance.pitch = 1.2;
            } else if (fallbackEnVoice) {
                utterance.voice = fallbackEnVoice;
            }

            window.speechSynthesis.speak(utterance);
        }
    }

    private playTone(freq: number, type: OscillatorType, duration: number) {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    public playSuccess() {
        this.playTone(880, 'sine', 0.1);
        setTimeout(() => this.playTone(1760, 'sine', 0.2), 100);
    }

    public playError() {
        this.playTone(150, 'sawtooth', 0.3);
        setTimeout(() => this.playTone(100, 'sawtooth', 0.4), 150);
    }
}

export const audioService = new AudioService();
