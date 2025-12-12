
import { v4 as uuidv4 } from 'uuid';
import { audioService } from './AudioService';

export type JobStatus = 'pending' | 'running' | 'success' | 'error';

export interface Job {
    id: string;
    type: string;
    label: string;
    status: JobStatus;
    result?: any;
    error?: string;
    startTime: number;
    endTime?: number;
}

type JobListener = (jobs: Job[]) => void;

class JobManager {
    private jobs: Job[] = [];
    private listeners: JobListener[] = [];

    // Start a new job
    public async runJob(label: string, task: () => Promise<any>): Promise<any> {
        const id = uuidv4();
        const job: Job = {
            id,
            type: 'async_task',
            label,
            status: 'running',
            startTime: Date.now()
        };

        this.jobs = [job, ...this.jobs].slice(0, 10); // Keep last 10
        this.notify();

        // Audio Feedback: Start
        audioService.speak(`Initiating protocol: ${label}`);

        try {
            const result = await task();

            // Update job success
            const jobIndex = this.jobs.findIndex(j => j.id === id);
            if (jobIndex !== -1) {
                this.jobs[jobIndex] = {
                    ...this.jobs[jobIndex],
                    status: 'success',
                    result,
                    endTime: Date.now()
                };
            }
            this.notify();

            // Audio Feedback: Success
            audioService.playSuccess();
            setTimeout(() => {
                audioService.speak(`Task complete: ${label}`);
            }, 500);

            return result;

        } catch (error: any) {
            // Update job error
            const jobIndex = this.jobs.findIndex(j => j.id === id);
            if (jobIndex !== -1) {
                this.jobs[jobIndex] = {
                    ...this.jobs[jobIndex],
                    status: 'error',
                    error: error.message || 'Unknown Error',
                    endTime: Date.now()
                };
            }
            this.notify();

            // Audio Feedback: Error
            audioService.playError();
            audioService.speak(`Alert. Task failed: ${label}`);
            throw error;
        }
    }

    public getJobs() {
        return this.jobs;
    }

    public subscribe(listener: JobListener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify() {
        this.listeners.forEach(l => l(this.jobs));
    }
}

export const jobManager = new JobManager();
