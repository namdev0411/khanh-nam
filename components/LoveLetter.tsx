"use client";

import { useEffect, useRef, useState } from "react";

export default function LoveLetter() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="letter"
            className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 py-12 sm:py-20 bg-valentine-gradient"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-20 sm:h-32 bg-gradient-to-b from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-20 sm:h-32 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Letter card */}
            <div
                className={`relative max-w-2xl w-full mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                    }`}
            >
                {/* Main letter */}
                <div className="letter-card rounded-xl sm:rounded-2xl p-6 sm:p-10 md:p-14 shadow-2xl">
                    {/* Decorative corner */}
                    <div className="absolute top-3 sm:top-5 left-3 sm:left-5 text-sm sm:text-base text-violet-500/30">✦</div>
                    <div className="absolute top-3 sm:top-5 right-3 sm:right-5 text-sm sm:text-base text-violet-500/30">✦</div>
                    <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 text-sm sm:text-base text-violet-500/30">✦</div>
                    <div className="absolute bottom-3 sm:bottom-5 right-3 sm:right-5 text-sm sm:text-base text-violet-500/30">✦</div>

                    {/* Letter header */}
                    <div className="text-center mb-8 sm:mb-10">
                        <p className="font-['Cormorant_Garamond'] text-xs sm:text-sm text-gray-500 tracking-[0.3em] uppercase mb-2">
                            14 · 02 · 2026
                        </p>
                        <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent mx-auto" />
                    </div>

                    {/* Letter content */}
                    <div className="font-['Cormorant_Garamond'] text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed space-y-5 sm:space-y-6">
                        <p className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}>
                            <span className="text-gray-100 text-lg sm:text-xl font-['Playfair_Display'] italic">Dear em yêu ❤</span>
                        </p>

                        <p className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}>
                            Có những điều anh nghĩ mình không cần nói ra, nhưng hôm nay anh rất muốn nói với em.
                        </p>

                        <p className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}>
                            Trời lạnh như vậy mà em vẫn sang nấu cơm cho anh rồi lại vội đi học. Chỉ riêng việc đó thôi đã làm anh thấy mình may mắn rồi.
                        </p>

                        <p className={`transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}>
                            Có lúc anh giận nhẹ một chút. Em nhận ra điều đó, và em lại là người chủ động ôm anh trước. Anh không biết em có để ý không, nhưng cái ôm đó làm anh mềm ra ngay lập tức. Anh nhận ra mình giỏi suy nghĩ phức tạp, còn em thì giỏi làm mọi thứ trở nên đơn giản.
                        </p>

                        <p className={`transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}>
                            Anh trân trọng em nhiều hơn em nghĩ. Không phải vì bữa cơm, mà vì cách em quan tâm những điều nhỏ, cách em chọn làm lành và chọn ở bên anh.
                        </p>

                        <p className={`transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}>
                            Ở cạnh em, anh vừa muốn chêu em, vừa muốn che chở cho em. Muốn đưa em đi đâu đó thật vui để em được thoải mái nhảy nhót và cười nhiều hơn.
                        </p>

                        <p className={`transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'} text-violet-300/80 italic border-l-2 border-violet-500/30 pl-4`}>
                            Anh không giỏi nói những lời ngọt ngào. Anh chỉ biết là anh sẽ cố gắng nhiều hơn, yêu em tử tế hơn, và không để em phải một mình bước lại gần anh như lần đó nữa.
                        </p>

                        <p className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`} style={{ transitionDelay: '0.9s' }}>
                            Valentine này anh không thể ở bên em, nhưng anh mong tụi mình vẫn sẽ tiếp tục như vậy lúc thì em nấu, lúc thì anh nấu, nhưng luôn là vì muốn ở cạnh nhau.
                        </p>
                    </div>

                    {/* Signature */}
                    <div className={`text-right mt-10 sm:mt-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: '1s' }}>
                        <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent ml-auto mb-4" />
                        <p className="font-['Cormorant_Garamond'] text-gray-400 text-sm sm:text-base italic">
                            Yêu em,
                        </p>
                        <p className="font-['Playfair_Display'] text-lg sm:text-xl text-gray-200 mt-1">
                            Nam
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
