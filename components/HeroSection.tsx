"use client";

import { useEffect, useState } from "react";
import HeartStars from "./HeartStars";

export default function HeroSection() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-20 bg-valentine-gradient overflow-hidden">
            {/* Decorative elements - mysterious orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-violet-900/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-violet-800/5 rounded-full blur-3xl animate-pulse delay-700" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-violet-950/20 rounded-full blur-3xl" />
            </div>

            {/* Main content */}
            <div className={`relative z-20 text-center px-2 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                {/* Heart Stars với tên Khánh - full width trên mobile */}
                <div className="relative w-[90vw] h-[90vw] max-w-[400px] max-h-[400px] sm:w-[400px] sm:h-[400px] md:w-[450px] md:h-[450px] mx-auto mb-4 sm:mb-6">
                    <HeartStars className="w-full h-full" />
                </div>

                {/* Title */}
                <h1
                    className="font-['Playfair_Display'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 animate-shimmer leading-tight tracking-wide"
                    style={{ animationDelay: '0.3s' }}
                >
                    Gửi Em Yêu
                </h1>

                {/* Subtitle */}
                <p
                    className={`font-['Cormorant_Garamond'] text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 mb-3 sm:mb-4 px-4 transition-all duration-1000 delay-500 italic ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                >
                    Có điều anh muốn nói với em
                </p>

                {/* Decorative line */}
                <div
                    className={`mt-4 sm:mt-6 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                >
                    <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent mx-auto" />
                </div>

                {/* Scroll indicator */}
                <div className={`mt-8 sm:mt-12 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <a
                        href="#letter"
                        className="inline-flex flex-col items-center text-gray-500 hover:text-violet-400 active:text-violet-400 transition-colors group"
                    >
                        <span className="text-xs sm:text-sm mb-2 font-['Cormorant_Garamond']">Cuộn xuống</span>
                        <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Background sparkles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-violet-400/30 animate-pulse"
                        style={{
                            left: `${5 + (i * 3.2) % 90}%`,
                            top: `${5 + (i * 7.3) % 90}%`,
                            animationDelay: `${(i * 0.2) % 3}s`,
                            animationDuration: `${2 + (i % 3)}s`,
                            fontSize: `${4 + (i % 8)}px`,
                        }}
                    >
                        ✦
                    </div>
                ))}
            </div>
        </section>
    );
}
