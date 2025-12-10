export class AudioAnalysisService {
    private context: AudioContext | null = null;
    private source: AudioBufferSourceNode | null = null;
    private analyser: AnalyserNode | null = null;
    private isPlaying: boolean = false;

    constructor() {
        // Init happens on user interaction to comply with browser autoplay policies
    }

    private initContext() {
        if (!this.context) {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.analyser = this.context.createAnalyser();
            this.analyser.fftSize = 256; // Defines resolution (128 bars)
        }
    }

    async loadFile(file: File): Promise<void> {
        this.initContext();
        if (!this.context || !this.analyser) return;

        // Stop previous if playing
        this.stop();

        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

        this.source = this.context.createBufferSource();
        this.source.buffer = audioBuffer;

        // Connect: Source -> Analyser -> Destination (Speakers)
        this.source.connect(this.analyser);
        this.analyser.connect(this.context.destination);

        this.source.start(0);
        this.isPlaying = true;

        this.source.onended = () => {
            this.isPlaying = false;
        };
    }

    getFrequencyData(): Uint8Array {
        if (!this.analyser) return new Uint8Array(0);
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
        return dataArray;
    }

    stop() {
        if (this.source) {
            try {
                this.source.stop();
            } catch (e) {
                // Ignore if already stopped
            }
            this.source.disconnect();
            this.source = null;
        }
        this.isPlaying = false;
    }

    isActive() {
        return this.isPlaying;
    }

    // Resume context if suspended (common browser policy issue)
    resume() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }
}

export const audioService = new AudioAnalysisService();
