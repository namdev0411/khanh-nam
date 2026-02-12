"use client";

import { useEffect, useState } from "react";

interface Star {
    id: number;
    left: number;
    size: number;
    duration: number;
    delay: number;
    swayDuration: number;
    opacity: number;
    type: string;
}

const starTypes = ["✦", "✧", "⋆", "·", "°"];

export default function FallingHearts() {
    const [stars, setStars] = useState<Star[]>([]);

    useEffect(() => {
        const createStar = (): Star => ({
            id: Math.random(),
            left: Math.random() * 100,
            size: Math.random() * 12 + 6,
            duration: Math.random() * 8 + 10,
            delay: Math.random() * 5,
            swayDuration: Math.random() * 4 + 3,
            opacity: Math.random() * 0.4 + 0.2,
            type: starTypes[Math.floor(Math.random() * starTypes.length)],
        });

        // Tạo sao ban đầu
        const initialStars = Array.from({ length: 15 }, createStar);
        setStars(initialStars);

        // Thêm sao mới định kỳ
        const interval = setInterval(() => {
            setStars((prev) => {
                const newStars = [...prev, createStar()];
                if (newStars.length > 25) {
                    return newStars.slice(-25);
                }
                return newStars;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="heart-fall star"
                    style={{
                        left: `${star.left}%`,
                        fontSize: `${star.size}px`,
                        animationDuration: `${star.duration}s, ${star.swayDuration}s`,
                        animationDelay: `${star.delay}s, 0s`,
                        opacity: star.opacity,
                    }}
                >
                    {star.type}
                </div>
            ))}
        </div>
    );
}
