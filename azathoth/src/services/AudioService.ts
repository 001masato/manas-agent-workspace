class AudioService {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private isMuted: boolean = false;

    constructor() { }

    private init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.3;
            this.masterGain.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
    }

    public speak(text: string) {
        if (this.isMuted) return;
        this.init();

        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.volume = 0.5;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v =>
                v.name === 'Google 日本語' ||
                v.name.includes('Nanami') ||
                v.name.includes('Haruka') ||
                v.name.toLowerCase().includes('female') ||
                v.name.includes('Kyoko')
            );

            const fallbackJpVoice = voices.find(v => v.lang === 'ja-JP');

            if (preferredVoice) {
                utterance.voice = preferredVoice;
            } else if (fallbackJpVoice) {
                utterance.voice = fallbackJpVoice;
                utterance.pitch = 1.2;
            }

            window.speechSynthesis.speak(utterance);
        }
    }

    // Simple FX
    public playWarpSound() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Deep wobble
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(50, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 1.0);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.0);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.0);
    }
}

export const audioService = new AudioService();
