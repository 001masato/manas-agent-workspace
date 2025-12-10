import { useEffect, useRef, useState } from 'react';
import { SkillService, type Skill } from '../skills/SkillService';

interface Node {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    label: string;
    category: string;
    radius: number;
    skill: Skill;
}
interface Props {
    onNodeSelect?: (skill: Skill) => void;
    searchQuery?: string;
    extraNodes?: Skill[];
}

export const LogicGraph = ({ onNodeSelect, searchQuery = '', extraNodes = [] }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [realSkills, setRealSkills] = useState<Skill[]>([]);
    const skills = [...realSkills, ...extraNodes]; // Merge real and simulated
    // const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null); // Removed unused state

    // Physics Config
    const REPULSION = 100;
    const CENTER_PULL = 0.005;
    const SEARCH_PULL = 0.02; // Stronger pull for search results

    useEffect(() => {
        SkillService.getSkills().then(setRealSkills);
    }, []);

    useEffect(() => {
        if (skills.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Init Nodes
        // Note: For simulated nodes, we want them to spawn in center
        const nodes: Node[] = skills.map((skill) => {
            const isSim = skill.tags?.includes('simulation');
            return {
                id: skill.id,
                x: isSim ? canvas.width / 2 + (Math.random() - 0.5) * 50 : Math.random() * canvas.width,
                y: isSim ? canvas.height / 2 + (Math.random() - 0.5) * 50 : Math.random() * canvas.height,
                vx: 0,
                vy: 0,
                label: skill.name,
                category: skill.category,
                radius: skill.category.includes('core') ? 14 : (isSim ? 10 : 6),
                skill
            };
        });

        let animationId: number;
        let mouseX = 0;
        let mouseY = 0;

        const resize = () => {
            canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            let cursor = 'default';

            const queryLower = searchQuery.toLowerCase();

            // Draw Connections (Draw *before* nodes)
            // Separate logic for Simulation vs Normal to handle layer order if needed
            // But simple loop is fine for performance
            nodes.forEach((node, i) => {
                const isNodeMatch = !searchQuery || node.label.toLowerCase().includes(queryLower);

                nodes.slice(i + 1).forEach(other => {
                    // Logic for linking
                    // 1. Distance check
                    const dist = Math.hypot(node.x - other.x, node.y - other.y);

                    // 2. Simulation Logic: Connect Sim nodes sequentially if possible (based on offset usually, but here based on id/index)
                    // If both are simulation, force link if close enough or sequential
                    const bothSim = node.skill.tags?.includes('simulation') && other.skill.tags?.includes('simulation');

                    // Link Threshold
                    if (dist < (bothSim ? 250 : 150)) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(other.x, other.y);

                        const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);

                        if (bothSim) {
                            // Simulation Link: Bright Yellow/Green
                            gradient.addColorStop(0, 'rgba(250, 204, 21, 0.8)');
                            gradient.addColorStop(1, 'rgba(250, 204, 21, 0.2)');
                            ctx.setLineDash([5, 5]); // Dashed line for "Construction"
                            ctx.lineWidth = 2;
                        } else if (searchQuery) {
                            // Search Match Link
                            const isOtherMatch = !searchQuery || other.label.toLowerCase().includes(queryLower);
                            if (isNodeMatch && isOtherMatch) {
                                gradient.addColorStop(0, 'rgba(0, 243, 255, 0.6)');
                                gradient.addColorStop(1, 'rgba(189, 0, 255, 0.6)');
                                ctx.setLineDash([]);
                                ctx.lineWidth = 2;
                            } else {
                                gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
                                ctx.setLineDash([]);
                                ctx.lineWidth = 0.5;
                            }
                        } else {
                            // Default Link
                            gradient.addColorStop(0, 'rgba(0, 243, 255, 0.1)');
                            gradient.addColorStop(1, 'rgba(189, 0, 255, 0.1)');
                            ctx.setLineDash([]);
                            ctx.lineWidth = 1;
                        }

                        ctx.strokeStyle = gradient;
                        ctx.stroke();
                        ctx.setLineDash([]); // Reset dash
                    }
                });

                // Physics Update
                const isMatch = searchQuery && (node.label.toLowerCase().includes(queryLower) || node.category.includes(queryLower));
                const isSim = node.skill.tags?.includes('simulation');

                const pullX = centerX;
                const pullY = centerY;
                // Strong pull for search results AND simulation nodes
                const currentPull = (isMatch || isSim) ? SEARCH_PULL : CENTER_PULL;

                node.vx += (pullX - node.x) * currentPull;
                node.vy += (pullY - node.y) * currentPull;

                // Repulsion
                nodes.forEach(other => {
                    if (node === other) return;
                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 200 && dist > 0) {
                        const force = REPULSION / (dist * dist);
                        node.vx += (dx / dist) * force;
                        node.vy += (dy / dist) * force;
                    }
                });

                // Mouse
                const dx = node.x - mouseX;
                const dy = node.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 25) cursor = 'pointer';
                if (dist < 200) {
                    const force = (200 - dist) / 2000;
                    node.vx -= (dx / dist) * force;
                    node.vy -= (dy / dist) * force;
                }

                node.vx *= 0.95;
                node.vy *= 0.95;
                node.x += node.vx;
                node.y += node.vy;

                // Bounce
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
            });

            canvas.style.cursor = cursor;

            // Draw Nodes
            nodes.forEach(node => {
                const isSim = node.skill.tags?.includes('simulation');
                const isMatch = !searchQuery || node.label.toLowerCase().includes(queryLower) || node.category.includes(queryLower);

                const opacity = (isMatch || isSim) ? 1 : 0.1;
                const scale = (isMatch || isSim) ? 1 : 0.8;

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius * scale, 0, Math.PI * 2);

                // Colors
                if (isSim) {
                    ctx.fillStyle = `rgba(250, 204, 21, ${opacity})`; // Yellow for Simulation
                    ctx.shadowColor = 'rgba(250, 204, 21, 0.8)';
                    ctx.shadowBlur = 20; // High glow for "New Idea"
                } else if (node.category.includes('core')) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`; // White for Core
                    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
                    ctx.shadowBlur = isMatch ? 15 : 0;
                } else if (node.category === 'template') {
                    ctx.fillStyle = `rgba(0, 243, 255, ${opacity})`;
                    ctx.shadowColor = 'rgba(0, 243, 255, 0.5)';
                    ctx.shadowBlur = isMatch ? 15 : 0;
                } else {
                    ctx.fillStyle = `rgba(189, 0, 255, ${opacity})`;
                    ctx.shadowColor = 'rgba(189, 0, 255, 0.5)';
                    ctx.shadowBlur = isMatch ? 15 : 0;
                }

                ctx.fill();

                // Label
                if (isMatch || isSim) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.font = isSim ? 'bold 12px monospace' : (node.category.includes('core') ? 'bold 12px monospace' : '10px monospace');

                    const labelX = node.x + (isSim ? 20 : 16);
                    ctx.fillText(node.label, labelX, node.y + 4);

                    if (isSim) {
                        ctx.fillStyle = 'rgba(250, 204, 21, 0.7)';
                        ctx.fillText('>> CONSTRUCTING...', labelX, node.y + 16);
                    }
                }
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        const handleClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Find clicked node
            const clickedNode = nodes.find(node => {
                const dist = Math.hypot(node.x - x, node.y - y);
                return dist < 30; // Hit radius
            });

            if (clickedNode && onNodeSelect) {
                onNodeSelect(clickedNode.skill);
            }
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('click', handleClick);
        };
    }, [skills, onNodeSelect]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full"
        />
    );
};
