"use client";

import { useEffect, useState } from "react";

// Tạo các điểm trên hình trái tim - đã normalize về 0-100%
const generateHeartPoints = (numPoints: number) => {
    const points: { x: number; y: number }[] = [];

    // Công thức trái tim: x = 16sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
    // Range: x từ -16 đến 16, y từ khoảng -17 đến 12

    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * Math.PI * 2;
        const rawX = 16 * Math.pow(Math.sin(t), 3);
        const rawY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        // Normalize về 10% - 90% để có padding
        const x = ((rawX + 16) / 32) * 80 + 10; // 10% to 90%
        const y = ((rawY + 17) / 30) * 75 + 12; // 12% to 87%

        points.push({ x, y });
    }

    return points;
};

interface Star {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
    color: string;
    shape: string;
}

const colors = [
    "#ffd700", // gold
    "#ffffff", // white
    "#ffec8b", // light gold
    "#fffacd", // lemon chiffon
    "#ffefd5", // papaya whip
    "#fff8dc", // cornsilk
    "#ffffe0", // light yellow
];

const shapes = ["✦", "★", "✧", "⋆", "✶"];

// Vị trí cố định cho extra sparkles
const extraSparklePositions = [
    { left: 8, top: 15 }, { left: 92, top: 12 }, { left: 5, top: 85 },
    { left: 95, top: 80 }, { left: 50, top: 3 }, { left: 3, top: 50 },
    { left: 97, top: 45 }, { left: 20, top: 95 }, { left: 80, top: 92 },
];

interface HeartStarsProps {
    className?: string;
}

export default function HeartStars({ className = "" }: HeartStarsProps) {
    const [stars, setStars] = useState<Star[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Tạo 24 ngôi sao trên hình trái tim
        const heartPoints = generateHeartPoints(24);

        const newStars: Star[] = heartPoints.map((point, index) => ({
            id: index,
            x: point.x,
            y: point.y,
            size: 18 + (index % 4) * 4, // 18-30px
            delay: (index / heartPoints.length) * 1.2,
            duration: 1.2 + (index % 3) * 0.4,
            color: colors[index % colors.length],
            shape: shapes[index % shapes.length],
        }));

        setStars(newStars);
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    return (
        <div className={`relative ${className}`}>
            {/* Container */}
            <div className="relative w-full h-full flex items-center justify-center">

                {/* Heart made of stars */}
                <div className="absolute inset-0">
                    {stars.map((star) => (
                        <div
                            key={star.id}
                            className="absolute"
                            style={{
                                left: `${star.x}%`,
                                top: `${star.y}%`,
                                transform: "translate(-50%, -50%)",
                                opacity: isVisible ? 1 : 0,
                                transition: `opacity 0.5s ease-out ${star.delay * 0.1}s`,
                            }}
                        >
                            <span
                                className="inline-block animate-pulse"
                                style={{
                                    fontSize: star.size,
                                    color: star.color,
                                    textShadow: `0 0 10px ${star.color}, 0 0 20px ${star.color}, 0 0 30px ${star.color}`,
                                    animationDelay: `${star.delay}s`,
                                    animationDuration: `${star.duration}s`,
                                }}
                            >
                                {star.shape}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Tên Khánh ở giữa */}
                <div
                    className={`relative z-10 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    style={{ transitionDelay: "0.3s", top: '20px' }}
                >
                    <h2
                        className="font-['Dancing_Script'] text-5xl sm:text-6xl md:text-7xl font-bold"
                        style={{
                            color: "#ffd700",
                            textShadow: "0 0 15px rgba(255, 215, 0, 0.9), 0 0 30px rgba(255, 215, 0, 0.7), 0 0 45px rgba(255, 215, 0, 0.5)",
                        }}
                    >
                        Khánh
                    </h2>
                    <p
                        className="font-['Cormorant_Garamond'] text-yellow-200 text-sm sm:text-base mt-2 italic"
                        style={{
                            opacity: isVisible ? 0.9 : 0,
                            transition: "opacity 1s ease-out 0.8s",
                            textShadow: "0 0 8px rgba(255, 215, 0, 0.6)",
                        }}
                    >
                        ✦ Người anh yêu ✦
                    </p>
                </div>
            </div>

            {/* Extra sparkles */}
            <div className="absolute inset-0 pointer-events-none">
                {extraSparklePositions.map((pos, i) => (
                    <div
                        key={`extra-${i}`}
                        className="absolute animate-pulse"
                        style={{
                            left: `${pos.left}%`,
                            top: `${pos.top}%`,
                            fontSize: 10 + (i % 3) * 4,
                            color: colors[i % colors.length],
                            textShadow: `0 0 10px ${colors[i % colors.length]}`,
                            animationDelay: `${(i * 0.25)}s`,
                            animationDuration: `${1.5 + (i % 2) * 0.5}s`,
                        }}
                    >
                        ✦
                    </div>
                ))}
            </div>
        </div>
    );
}
