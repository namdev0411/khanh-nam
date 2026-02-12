"use client";

import { useEffect, useState, useCallback } from "react";

interface Sparkle {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    rotation: number;
    opacity: number;
    createdAt: number;
}

const colors = [
    "#c299c2", // violet-light
    "#8a2be2", // violet-glow
    "#a78bfa", // purple
    "#ffd700", // gold
    "#ffffff", // white
    "#e0b0ff", // mauve
    "#ff69b4", // pink
];

const shapes = ["✦", "✧", "⋆", "✶", "✷", "★"];

export default function SparklingCursor() {
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const createSparkle = useCallback((x: number, y: number): Sparkle => {
        return {
            id: Date.now() + Math.random(),
            x: x + (Math.random() - 0.5) * 30,
            y: y + (Math.random() - 0.5) * 30,
            size: 8 + Math.random() * 16,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            opacity: 1,
            createdAt: Date.now(),
        };
    }, []);

    useEffect(() => {
        let lastSparkleTime = 0;
        const sparkleInterval = 50; // ms between sparkles

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });

            const now = Date.now();
            if (now - lastSparkleTime > sparkleInterval) {
                lastSparkleTime = now;

                // Add 1-2 sparkles
                const newSparkles: Sparkle[] = [];
                const count = Math.random() > 0.5 ? 2 : 1;
                for (let i = 0; i < count; i++) {
                    newSparkles.push(createSparkle(e.clientX, e.clientY));
                }

                setSparkles(prev => [...prev, ...newSparkles].slice(-50)); // Keep max 50 sparkles
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [createSparkle]);

    // Animate and remove old sparkles
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setSparkles(prev =>
                prev
                    .map(s => ({
                        ...s,
                        opacity: Math.max(0, 1 - (now - s.createdAt) / 800),
                        y: s.y - 0.5, // Float up slightly
                        rotation: s.rotation + 2,
                    }))
                    .filter(s => s.opacity > 0)
            );
        }, 30);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Custom cursor */}
            <div
                className="fixed pointer-events-none z-[9999] hidden sm:block"
                style={{
                    left: mousePos.x,
                    top: mousePos.y,
                    transform: "translate(-50%, -50%)",
                }}
            >
                {/* Main cursor glow */}
                <div
                    className="relative"
                    style={{
                        width: 24,
                        height: 24,
                    }}
                >
                    {/* Outer glow */}
                    <div
                        className="absolute inset-0 rounded-full animate-pulse"
                        style={{
                            background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
                            transform: "scale(2)",
                        }}
                    />
                    {/* Inner star */}
                    <div
                        className="absolute inset-0 flex items-center justify-center text-violet-400 animate-spin"
                        style={{
                            fontSize: 16,
                            textShadow: "0 0 10px #8b5cf6, 0 0 20px #8b5cf6",
                            animationDuration: "3s",
                        }}
                    >
                        ✦
                    </div>
                </div>
            </div>

            {/* Sparkle trail */}
            <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
                {sparkles.map((sparkle, index) => (
                    <div
                        key={sparkle.id}
                        className="absolute transition-opacity"
                        style={{
                            left: sparkle.x,
                            top: sparkle.y,
                            transform: `translate(-50%, -50%) rotate(${sparkle.rotation}deg) scale(${sparkle.opacity})`,
                            opacity: sparkle.opacity,
                            fontSize: sparkle.size,
                            color: sparkle.color,
                            textShadow: `0 0 ${sparkle.size}px ${sparkle.color}`,
                        }}
                    >
                        {shapes[index % shapes.length]}
                    </div>
                ))}
            </div>

            {/* Hide default cursor on desktop */}
            <style jsx global>{`
        @media (min-width: 640px) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
        </>
    );
}
