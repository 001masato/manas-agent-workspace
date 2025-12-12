import React, { useEffect, useRef } from 'react';

interface StarfieldProps {
    isCharging: boolean; // Mouse Down (Hold) -> Warp
    mode: 'CHAOS' | 'GALAXY' | 'ATOM' | 'VOID'; // Retain props for API compatibility
    triggerBigBang: number;
}

const Starfield: React.FC<StarfieldProps> = ({ isCharging, triggerBigBang }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);

    // Star data: [x, y, z, size, speedOffset]
    const starsRef = useRef<Float32Array | null>(null);
    // Track warp speed for inertia (acceleration/deceleration)
    const warpSpeedRef = useRef<number>(0);

    // Spec: 2000 particles (matched to HTML reference)
    const numStars = 2000;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const initCanvas = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        initCanvas();

        if (!starsRef.current) {
            starsRef.current = new Float32Array(numStars * 5);
            for (let i = 0; i < numStars; i++) {
                const i5 = i * 5;
                starsRef.current[i5] = (Math.random() - 0.5) * width * 3; // x
                starsRef.current[i5 + 1] = (Math.random() - 0.5) * height * 3; // y
                starsRef.current[i5 + 2] = Math.random() * width; // z
                starsRef.current[i5 + 3] = Math.random() * 1.5 + 0.5; // size
                starsRef.current[i5 + 4] = Math.random(); // speed factor
            }
        }

        const stars = starsRef.current;
        let centerX = width / 2;
        let centerY = height / 2;
        const baseSpeed = 2; // HTML reference speed

        const animate = () => {
            // Updated center in case of resize
            centerX = width / 2;
            centerY = height / 2;

            // --- Inertia Logic (Match HTML) ---
            if (isCharging) {
                if (warpSpeedRef.current < 100) warpSpeedRef.current += 2; // Accelerate
            } else {
                if (warpSpeedRef.current > 0.1) warpSpeedRef.current *= 0.9; // Decelerate
                else warpSpeedRef.current = 0;
            }

            // Trail effect (Match HTML reference: always 0.4)
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.fillRect(0, 0, width, height);

            // Set color based on state (HTML uses white for dots, bluish for lines)
            ctx.fillStyle = "white";

            for (let i = 0; i < numStars; i++) {
                const i5 = i * 5;

                // Update Z (move towards camera)
                // Speed = base + warp + individual_variance
                stars[i5 + 2] -= (baseSpeed + warpSpeedRef.current) + (stars[i5 + 4] * (isCharging ? 10 : 0.5));

                // Reset if passed camera (z <= 1)
                if (stars[i5 + 2] <= 1) {
                    stars[i5 + 2] = width; // Reset to back
                    stars[i5] = (Math.random() - 0.5) * width * 3;
                    stars[i5 + 1] = (Math.random() - 0.5) * height * 3;
                }

                const x = stars[i5];
                const y = stars[i5 + 1];
                const z = stars[i5 + 2];
                const sz = stars[i5 + 3];

                // Perspective Projection
                const fov = height;
                const scale = fov / z;

                const sx = x * scale + centerX;
                const sy = y * scale + centerY;

                // Warp lines are long, stars are dots
                // Logic: if warping OR moving fast enough to stretch
                if (isCharging || warpSpeedRef.current > 5) {
                    // Warp Line
                    const dx = sx - centerX;
                    const dy = sy - centerY;
                    const len = Math.sqrt(dx * dx + dy * dy) * 0.1 * (1 + warpSpeedRef.current * 0.05); // Stretch based on speed
                    const angle = Math.atan2(dy, dx);

                    if (sx > -100 && sx < width + 100 && sy > -100 && sy < height + 100) {
                        // HTML Color: rgba(200, 200, 255, alpha)
                        // Alpha based on depth (1 - z/width)
                        const alpha = Math.max(0, 1 - z / width);
                        ctx.strokeStyle = `rgba(200, 200, 255, ${alpha})`;
                        ctx.lineWidth = sz * scale * 0.5;
                        ctx.beginPath();
                        ctx.moveTo(sx, sy);
                        // Draw line pointing to center
                        ctx.lineTo(sx - Math.cos(angle) * len, sy - Math.sin(angle) * len);
                        ctx.stroke();
                    }
                } else {
                    if (sx > 0 && sx < width && sy > 0 && sy < height) {
                        const r = sz * scale * 0.5;
                        ctx.beginPath();
                        ctx.arc(sx, sy, r, 0, Math.PI * 2);
                        // ctx.fillStyle = "white"; // Already set
                        ctx.fill();
                    }
                }
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            initCanvas();
        };
        window.addEventListener('resize', handleResize);

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isCharging]);

    // Handle Big Bang: Reset stars for effect
    useEffect(() => {
        if (triggerBigBang > 0 && starsRef.current) {
            const stars = starsRef.current;
            // Push all stars away or reset?
            // Reset z to random to create a "fresh" feeling
            for (let i = 0; i < numStars; i++) {
                const i5 = i * 5;
                stars[i5 + 2] = Math.random() * window.innerWidth;
            }
        }
    }, [triggerBigBang]);

    return <canvas ref={canvasRef} id="starfield" />;
};

export default Starfield;
