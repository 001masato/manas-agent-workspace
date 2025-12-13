import React, { useEffect, useRef } from 'react';

interface StarfieldProps {
    isWarping: boolean;
}

export const Starfield: React.FC<StarfieldProps> = ({ isWarping }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isWarpingRef = useRef(isWarping);

    // Keep the ref updated with the latest prop
    useEffect(() => {
        isWarpingRef.current = isWarping;
    }, [isWarping]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', resize);
        resize();

        // Star Logic
        const numStars = 2000;
        let speed = 2;
        let warpSpeed = 0;
        let animationFrameId: number;

        class Star {
            x: number = 0;
            y: number = 0;
            z: number = 0;
            pz: number = 0;

            constructor() {
                this.init();
            }

            init() {
                this.x = (Math.random() - 0.5) * width * 2;
                this.y = (Math.random() - 0.5) * height * 2;
                this.z = Math.random() * width;
                this.pz = this.z;
            }

            update(activeWarp: boolean) {
                // Update speed based on warp state (global warpSpeed handled in animate loop)
                this.z -= (speed + warpSpeed);

                if (this.z < 1) {
                    this.init();
                    this.z = width;
                    this.pz = this.z;
                }
            }

            draw(activeWarp: boolean) {
                const sx = (this.x / this.z) * width / 2 + width / 2;
                const sy = (this.y / this.z) * height / 2 + height / 2;

                const px = (this.x / this.pz) * width / 2 + width / 2;
                const py = (this.y / this.pz) * height / 2 + height / 2;

                this.pz = this.z;

                if (sx < 0 || sx > width || sy < 0 || sy > height) return;

                const r = (1 - this.z / width) * 4 * (activeWarp ? 0.5 : 1);

                ctx!.beginPath();
                if (activeWarp) {
                    ctx!.moveTo(px, py);
                    ctx!.lineTo(sx, sy);
                    ctx!.strokeStyle = `rgba(200, 200, 255, ${1 - this.z / width})`;
                    ctx!.lineWidth = r;
                    ctx!.stroke();
                } else {
                    ctx!.arc(sx, sy, r, 0, Math.PI * 2);
                    ctx!.fillStyle = "white";
                    ctx!.fill();
                }
            }
        }

        const stars: Star[] = [];
        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }

        const animate = () => {
            const activeWarp = isWarpingRef.current;

            // Background clear with trail effect during warp? User code says:
            // ctx.fillStyle = "rgba(0, 0, 0, 0.4)"; // 少し軌跡を残す
            // ctx.fillRect(0, 0, width, height);
            // Wait, clearing with opaque black creates black background, but we want transparency over the underlying body background if needed?
            // Actually, body has bg var(--void-black).
            // User code: "ctx.fillStyle = "rgba(0, 0, 0, 0.4)"; ... fillRect"
            // This is "trailing" effect.

            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.fillRect(0, 0, width, height);

            // Warp speed inertia
            if (activeWarp) {
                if (warpSpeed < 100) warpSpeed += 2;
            } else {
                if (warpSpeed > 0) warpSpeed *= 0.9;
            }

            stars.forEach(star => {
                star.update(activeWarp);
                star.draw(activeWarp);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas id="starfield" ref={canvasRef} />;
};
