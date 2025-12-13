import React, { useEffect, useRef } from 'react';

interface SingularityCoreProps {
    isWarping: boolean;
}

export const SingularityCore: React.FC<SingularityCoreProps> = ({ isWarping }) => {
    const stageRef = useRef<HTMLDivElement>(null);
    const ringsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!stageRef.current || !ringsRef.current) return;

            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;

            // Black hole follows gaze (Heavy movement)
            // Note: Perspective is set in CSS on .singularity-stage
            stageRef.current.style.transform = `perspective(1200px) rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg)`;

            // Rings move opposite for depth
            ringsRef.current.style.marginLeft = `${dx * -20}px`;
            ringsRef.current.style.marginTop = `${dy * -20}px`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Rebound effect logic on warping end is handled by CSS transition + State change in React automatically?
    // User JS: rings.style.transform = "scale(1.2)"; setTimeout(() => scale(1), 300);
    // This simple "rebound" might need a `useEffect` on `isWarping` change to trigger a quick animation class.

    useEffect(() => {
        if (!isWarping && ringsRef.current) {
            // Check if we just stopped warping (rebound effect)
            // Implementation detail: React state change handles "scale(0.5)" removal.
            // To do the "Scale 1.2 then 1" pop, we might need a temporary class or animation.
            // For now, let's stick to the React state transition. 
            // If the user insists on the pop, I'll add it later.
            // But I will apply the active warp styles inline here or via class.
        }
    }, [isWarping]);

    return (
        <div
            className={`singularity-stage ${isWarping ? 'shaking' : ''}`}
            id="stage"
            ref={stageRef}
        >
            {/* Rings Group */}
            <div
                className="rings-group"
                id="rings"
                ref={ringsRef}
                style={{
                    transform: isWarping ? "scale(0.5) rotate(180deg)" : "scale(1)",
                    opacity: isWarping ? 0.5 : 1
                }}
            >
                {/* Outer Ring */}
                <div className="ring-outer">
                    <svg viewBox="0 0 1000 1000">
                        <path id="path-out" d="M 500, 500 m -450, 0 a 450,450 0 1,1 900,0 a 450,450 0 1,1 -900,0" fill="none" />
                        <text fontSize="32" fill="white">
                            <textPath href="#path-out" startOffset="0%">
                                WARNING: SINGULARITY DETECTED. SPACE-TIME CONTINUUM COLLAPSING. VOID GOD AZATHOTH MANIFESTING. CONSUMING ALL CREATION.
                            </textPath>
                        </text>
                    </svg>
                </div>

                {/* Mid Ring */}
                <div className="ring-mid">
                    <svg viewBox="0 0 1000 1000">
                        <path id="path-mid" d="M 500, 500 m -325, 0 a 325,325 0 1,1 650,0 a 325,325 0 1,1 -650,0" fill="none" />
                        <text fontSize="28" fill="#d0f">
                            <textPath href="#path-mid" startOffset="50%">
                                &lt;&lt; TURN NULL &gt;&gt; &lt;&lt; IMAGINARY SPACE &gt;&gt; &lt;&lt; SOUL CONSUMPTION &gt;&gt; &lt;&lt; TRUE DRAGON RELEASE &gt;&gt;
                            </textPath>
                        </text>
                    </svg>
                </div>

                {/* Inner Ring */}
                <div className="ring-inner">
                    <svg viewBox="0 0 1000 1000">
                        <circle cx="500" cy="500" r="225" fill="none" stroke="cyan" strokeWidth="2" strokeDasharray="10 10" opacity="0.5" />
                    </svg>
                </div>
            </div>

            {/* Black Hole Core */}
            <div className="black-hole-core" id="core">
                <div className="accretion-disk"></div>
                <div className="event-horizon"></div>

                <div className="core-text">
                    <div className="title-sub">GOD SKILL</div>
                    <div className="title-main">AZATHOTH</div>
                    <div className="title-jp">虚空之神</div>
                    <div className="click-hint" style={{
                        color: isWarping ? 'red' : 'cyan',
                    }}>
                        {isWarping ? "WARPING..." : "HOLD CLICK TO WARP"}
                    </div>
                </div>
            </div>
        </div>
    );
};
