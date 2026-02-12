"use client";

import { useEffect, useState } from "react";

export default function Footer() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    // Tính số ngày yêu nhau
    const startDate = new Date("2025-11-06");
    const today = new Date();
    const daysTogether = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return (
        <footer className="relative py-12 sm:py-16 px-3 sm:px-4 bg-gradient-to-t from-black via-violet-950/10 to-transparent">
            {/* Counter section */}
            <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-xs sm:max-w-sm mx-auto">
                    <p className="font-['Cormorant_Garamond'] text-gray-500 text-sm sm:text-base mb-3">
                        Bên nhau đã
                    </p>
                    <div className="flex items-baseline justify-center gap-2">
                        <span className="font-['Playfair_Display'] text-4xl sm:text-5xl md:text-6xl text-gradient-rose">
                            {daysTogether > 0 ? daysTogether : "∞"}
                        </span>
                        <span className="font-['Cormorant_Garamond'] text-lg sm:text-xl text-gray-400">
                            ngày
                        </span>
                    </div>
                    <p className="font-['Cormorant_Garamond'] text-gray-600 text-xs sm:text-sm mt-4 italic">
                        và còn mãi về sau...
                    </p>
                </div>
            </div>

            {/* Final message */}
            <div className={`text-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="mb-4 sm:mb-6">
                    <span className="text-2xl sm:text-3xl text-violet-400/60 animate-pulse-glow inline-block">✦</span>
                </div>

                <p className="font-['Cormorant_Garamond'] text-gray-600 text-xs">
                    ✦
                </p>
            </div>
        </footer>
    );
}
