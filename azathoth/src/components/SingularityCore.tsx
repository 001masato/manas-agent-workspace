import React, { useRef, useEffect } from 'react';

interface SingularityCoreProps {
    onWarpStart: () => void;
    onWarpEnd: () => void;
    isWarping: boolean;
}

const SingularityCore: React.FC<SingularityCoreProps> = ({ onWarpStart, onWarpEnd, isWarping }) => {
    const ringsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ringsRef.current) {
            if (isWarping) {
                // Updated to match User's Logic in Step 249 (No translate)
                // rings.style.transform = "scale(0.5) rotate(180deg)";
                ringsRef.current.style.transform = "scale(0.5) rotate(180deg)";
                ringsRef.current.style.opacity = "0.5";
            } else {
                // Updated to match User's Logic in Step 249 (No translate)
                // rings.style.transform = "scale(1.2)";
                ringsRef.current.style.transform = "scale(1.2)";
                setTimeout(() => {
                    if (ringsRef.current) ringsRef.current.style.transform = "scale(1)";
                }, 300);
                ringsRef.current.style.opacity = "1";
            }
        }
    }, [isWarping]);

    return (
        <>
            <div className="rings-group" ref={ringsRef} id="rings">

                {/* Outer Ring */}
                <div className="ring ring-outer">
                    <svg viewBox="0 0 1000 1000" width="100%" height="100%">
                        <path id="path-out" d="M 500, 500 m -450, 0 a 450,450 0 1,1 900,0 a 450,450 0 1,1 -900,0" fill="none" />
                        <text fontSize="32" fill="white">
                            <textPath href="#path-out" startOffset="0%">
                                WARNING: SINGULARITY DETECTED. SPACE-TIME CONTINUUM COLLAPSING. VOID GOD AZATHOTH MANIFESTING. CONSUMING ALL CREATION.
                            </textPath>
                        </text>
                    </svg>
                </div>

                {/* Mid Ring */}
                <div className="ring ring-mid">
                    <svg viewBox="0 0 1000 1000" width="100%" height="100%">
                        <path id="path-mid" d="M 500, 500 m -325, 0 a 325,325 0 1,1 650,0 a 325,325 0 1,1 -650,0" fill="none" />
                        <text fontSize="28" fill="#d0f">
                            <textPath href="#path-mid" startOffset="50%">
                                &lt;&lt; TURN NULL &gt;&gt; &lt;&lt; IMAGINARY SPACE &gt;&gt; &lt;&lt; SOUL CONSUMPTION &gt;&gt; &lt;&lt; TRUE DRAGON RELEASE &gt;&gt;
                            </textPath>
                        </text>
                    </svg>
                </div>

                {/* Inner Ring */}
                <div className="ring ring-inner">
                    <svg viewBox="0 0 1000 1000" width="100%" height="100%">
                        <defs>
                            <path id="path-in" d="M 500, 500 m -225, 0 a 225,225 0 1,1 450,0 a 225,225 0 1,1 -450,0" />
                        </defs>
                        <circle cx="500" cy="500" r="225" fill="none" stroke="cyan" strokeWidth="2" strokeDasharray="10 10" opacity="0.5" />
                    </svg>
                </div>

            </div>

            <div
                className="black-hole-core"
                id="core"
                onMouseDown={onWarpStart}
                onMouseUp={onWarpEnd}
                onMouseLeave={onWarpEnd}
            >
                <div className="accretion-disk"></div>
                <div className="event-horizon"></div>

                <div className="core-text">
                    <div className="title-sub">GOD SKILL</div>
                    <div className="title-main">AZATHOTH</div>
                    <div className="title-jp">虚空之神</div>
                    <div
                        className="click-hint"
                        style={{
                            color: isWarping ? 'red' : 'cyan',
                        }}
                    >
                        {isWarping ? "WARPING..." : "HOLD CLICK TO WARP"}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingularityCore;
