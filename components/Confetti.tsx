"use client";

import { useEffect, useState } from "react";

interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
    shape: "circle" | "star" | "heart" | "square";
    opacity: number;
}

const colors = [
    "#c299c2", // violet-light
    "#8a2be2", // violet-glow
    "#4a0e4e", // violet-deep
    "#ffd700", // gold
    "#ff69b4", // pink
    "#ffffff", // white
    "#e0b0ff", // mauve
];

const shapes: Particle["shape"][] = ["circle", "star", "heart", "square"];

interface ConfettiProps {
    isActive: boolean;
    duration?: number; // ms
    particleCount?: number;
}

export default function Confetti({ isActive, duration = 4000, particleCount = 150 }: ConfettiProps) {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isActive) return;

        setIsVisible(true);

        // Tạo particles từ trung tâm màn hình
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const newParticles: Particle[] = [];
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
            const speed = 8 + Math.random() * 15;

            newParticles.push({
                id: i,
                x: centerX,
                y: centerY,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 6 + Math.random() * 12,
                speedX: Math.cos(angle) * speed * (0.5 + Math.random()),
                speedY: Math.sin(angle) * speed * (0.5 + Math.random()) - 5, // Bias upward initially
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 20,
                shape: shapes[Math.floor(Math.random() * shapes.length)],
                opacity: 1,
            });
        }
        setParticles(newParticles);

        // Animation loop
        let animationId: number;
        let startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress >= 1) {
                setIsVisible(false);
                setParticles([]);
                return;
            }

            setParticles(prev => prev.map(p => ({
                ...p,
                x: p.x + p.speedX,
                y: p.y + p.speedY,
                speedY: p.speedY + 0.3, // Gravity
                speedX: p.speedX * 0.99, // Air resistance
                rotation: p.rotation + p.rotationSpeed,
                opacity: 1 - progress * 0.8,
            })));

            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [isActive, duration, particleCount]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute"
                    style={{
                        left: p.x,
                        top: p.y,
                        transform: `rotate(${p.rotation}deg)`,
                        opacity: p.opacity,
                    }}
                >
                    {p.shape === "circle" && (
                        <div
                            className="rounded-full"
                            style={{
                                width: p.size,
                                height: p.size,
                                backgroundColor: p.color,
                                boxShadow: `0 0 ${p.size}px ${p.color}`,
                            }}
                        />
                    )}
                    {p.shape === "star" && (
                        <div
                            style={{
                                fontSize: p.size,
                                color: p.color,
                                textShadow: `0 0 ${p.size}px ${p.color}`,
                            }}
                        >
                            ✦
                        </div>
                    )}
                    {p.shape === "heart" && (
                        <div
                            style={{
                                fontSize: p.size,
                                color: p.color,
                                textShadow: `0 0 ${p.size}px ${p.color}`,
                            }}
                        >
                            💜
                        </div>
                    )}
                    {p.shape === "square" && (
                        <div
                            style={{
                                width: p.size * 0.8,
                                height: p.size * 0.8,
                                backgroundColor: p.color,
                                boxShadow: `0 0 ${p.size}px ${p.color}`,
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
