"use client";

import { useEffect, useState } from "react";

interface Spark {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    trail: { x: number; y: number }[];
}

interface Firework {
    id: number;
    x: number;
    y: number;
    targetY: number;
    color: string;
    exploded: boolean;
    sparks: Spark[];
}

const colors = [
    "#c299c2", // violet-light
    "#8a2be2", // violet-glow
    "#ff69b4", // pink
    "#ffd700", // gold
    "#00ffff", // cyan
    "#ff6b6b", // coral
    "#e0b0ff", // mauve
];

interface FireworksProps {
    isActive: boolean;
    duration?: number;
}

export default function Fireworks({ isActive, duration = 5000 }: FireworksProps) {
    const [fireworks, setFireworks] = useState<Firework[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isActive) return;

        setIsVisible(true);
        const startTime = Date.now();
        let animationId: number;
        let fireworkId = 0;

        // Launch fireworks at intervals
        const launchInterval = setInterval(() => {
            if (Date.now() - startTime > duration - 1000) {
                clearInterval(launchInterval);
                return;
            }

            const newFirework: Firework = {
                id: fireworkId++,
                x: Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
                y: window.innerHeight,
                targetY: Math.random() * window.innerHeight * 0.4 + window.innerHeight * 0.1,
                color: colors[Math.floor(Math.random() * colors.length)],
                exploded: false,
                sparks: [],
            };

            setFireworks(prev => [...prev, newFirework]);
        }, 300);

        // Animation loop
        const animate = () => {
            const elapsed = Date.now() - startTime;

            if (elapsed >= duration) {
                setIsVisible(false);
                setFireworks([]);
                clearInterval(launchInterval);
                return;
            }

            setFireworks(prev => {
                return prev.map(fw => {
                    if (!fw.exploded) {
                        // Rising
                        const newY = fw.y - 12;
                        if (newY <= fw.targetY) {
                            // Explode!
                            const sparkCount = 60 + Math.floor(Math.random() * 40);
                            const sparks: Spark[] = [];

                            for (let i = 0; i < sparkCount; i++) {
                                const angle = (Math.PI * 2 * i) / sparkCount + Math.random() * 0.3;
                                const speed = 3 + Math.random() * 6;
                                sparks.push({
                                    id: i,
                                    x: fw.x,
                                    y: fw.targetY,
                                    color: fw.color,
                                    size: 2 + Math.random() * 3,
                                    speedX: Math.cos(angle) * speed,
                                    speedY: Math.sin(angle) * speed,
                                    opacity: 1,
                                    trail: [],
                                });
                            }

                            return { ...fw, exploded: true, sparks };
                        }
                        return { ...fw, y: newY };
                    } else {
                        // Update sparks
                        const updatedSparks = fw.sparks
                            .map(spark => ({
                                ...spark,
                                trail: [...spark.trail.slice(-5), { x: spark.x, y: spark.y }],
                                x: spark.x + spark.speedX,
                                y: spark.y + spark.speedY,
                                speedY: spark.speedY + 0.15, // Gravity
                                speedX: spark.speedX * 0.98,
                                opacity: spark.opacity - 0.015,
                            }))
                            .filter(spark => spark.opacity > 0);

                        return { ...fw, sparks: updatedSparks };
                    }
                }).filter(fw => !fw.exploded || fw.sparks.length > 0);
            });

            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationId);
            clearInterval(launchInterval);
        };
    }, [isActive, duration]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
            {fireworks.map(fw => (
                <div key={fw.id}>
                    {/* Rising firework */}
                    {!fw.exploded && (
                        <div
                            className="absolute w-2 h-4 rounded-full"
                            style={{
                                left: fw.x,
                                top: fw.y,
                                backgroundColor: fw.color,
                                boxShadow: `0 0 10px ${fw.color}, 0 10px 20px ${fw.color}`,
                            }}
                        />
                    )}

                    {/* Sparks */}
                    {fw.sparks.map(spark => (
                        <div key={spark.id}>
                            {/* Trail */}
                            {spark.trail.map((pos, i) => (
                                <div
                                    key={i}
                                    className="absolute rounded-full"
                                    style={{
                                        left: pos.x,
                                        top: pos.y,
                                        width: spark.size * (i / spark.trail.length) * 0.5,
                                        height: spark.size * (i / spark.trail.length) * 0.5,
                                        backgroundColor: spark.color,
                                        opacity: spark.opacity * (i / spark.trail.length) * 0.5,
                                    }}
                                />
                            ))}
                            {/* Spark */}
                            <div
                                className="absolute rounded-full"
                                style={{
                                    left: spark.x,
                                    top: spark.y,
                                    width: spark.size,
                                    height: spark.size,
                                    backgroundColor: spark.color,
                                    boxShadow: `0 0 ${spark.size * 2}px ${spark.color}`,
                                    opacity: spark.opacity,
                                }}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
