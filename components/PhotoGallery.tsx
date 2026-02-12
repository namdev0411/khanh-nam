"use client";

import { useEffect, useRef, useState } from "react";

// Ảnh và video từ Google Drive
const photos = [
    {
        id: 1,
        fileId: "1HqIc09C_SFP2IjOFa_qwxVNMxph93fAn",
        type: "image",
        caption: "Tokyo City View",
    },
    {
        id: 3,
        fileId: "1mEXYDXyI0ZH9RINRkId-YrIrrO78l80s",
        type: "image",
        caption: "Khoảnh khắc nghệ cùng em",
    },
    {
        id: 2,
        fileId: "1OrUgc9leu4J3IFKOI_3cvj1AaxexbNAz",
        type: "image",
        caption: "Ngắm Tokyo cùng em",
    },
    {
        id: 6,
        fileId: "1a2LviU5AnovBoz77IVSNl5XlySYHf6va",
        type: "image",
        caption: "Kỷ niệm bên nhau",
        rotate: 90,
    },
    {
        id: 5,
        fileId: "1-j-OqEPlrIQY7TeTSezTipAI5xbW1MOA",
        type: "video",
        caption: "Kỷ niệm đáng nhớ",
    },
    {
        id: 7,
        fileId: "1eKUXj_oZZdj185zRr_B7hbXRNK8KMMdr",
        type: "video",
        caption: "Kawaiii bé oiii",
    },
];

export default function PhotoGallery() {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<typeof photos[0] | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [videoAutoOpened, setVideoAutoOpened] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

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

    //   // Auto open video on mobile when scrolled into view
    //   const videoItem = photos.find(p => p.type === "video");

    //   useEffect(() => {
    //     if (!isMobile || !videoRef.current || videoAutoOpened) return;

    //     const observer = new IntersectionObserver(
    //       ([entry]) => {
    //         if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
    //           if (videoItem) {
    //             setSelectedItem(videoItem);
    //             setVideoAutoOpened(true);
    //           }
    //         }
    //       },
    //       { threshold: 0.6 }
    //     );

    //     observer.observe(videoRef.current);

    //     return () => observer.disconnect();
    //   }, [isMobile, videoItem, videoAutoOpened]);

    // Đóng modal khi nhấn ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedItem(null);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (selectedItem) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [selectedItem]);


    return (
        <section
            ref={sectionRef}
            id="gallery"
            className="relative min-h-screen px-3 sm:px-4 py-12 sm:py-20 bg-valentine-gradient"
        >
            {/* Section header */}
            <div className={`text-center mb-8 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <span className="text-2xl sm:text-3xl mb-3 sm:mb-4 inline-block text-violet-400/60">✦</span>
                <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl md:text-4xl text-gradient-rose mb-3 sm:mb-4 px-2 tracking-wide">
                    Kỷ Niệm
                </h2>
                <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent mx-auto mt-4 sm:mt-6" />
            </div>

            {/* Photo grid */}
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {photos.map((item, index) => (
                        <div
                            key={item.id}
                            ref={item.type === "video" ? videoRef : undefined}
                            className={`gallery-item relative group cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                            onClick={() => setSelectedItem(item)}
                        >
                            {/* Photo/Video frame */}
                            <div className="relative aspect-[4/5] rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-violet-900/10 to-black/40 border border-violet-500/10">
                                {/* Iframe for Google Drive */}
                                <iframe
                                    src={`https://drive.google.com/file/d/${item.fileId}/preview`}
                                    className="absolute inset-0 w-full h-full border-0"
                                    allow="autoplay"
                                    style={{
                                        pointerEvents: 'none',
                                        transform: (item as any).rotate ? `rotate(${(item as any).rotate}deg)` : undefined,
                                        transformOrigin: 'center center',
                                        // Scale để fill container sau khi xoay
                                        ...(item as any).rotate === 90 || (item as any).rotate === -90 ? {
                                            width: '125%',
                                            height: '125%',
                                            left: '-12.5%',
                                            top: '-12.5%'
                                        } : {}
                                    }}
                                />

                                {/* Video indicator & play overlay */}
                                {item.type === "video" && (
                                    <>
                                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/60 rounded-full p-1.5 sm:p-2 z-20">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                        {/* Play button overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40 group-hover:bg-black/60 transition-colors">
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-500/30 transition-all">
                                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                        {/* Auto play hint on mobile */}
                                        <div className="sm:hidden absolute bottom-16 left-0 right-0 text-center z-20">
                                            <span className="bg-violet-600/70 text-white text-xs px-3 py-1 rounded-full animate-pulse">
                                                Nhấn để xem
                                            </span>
                                        </div>
                                        {/* Click hint on desktop */}
                                        <div className="hidden sm:block absolute bottom-16 left-0 right-0 text-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="bg-black/60 text-white text-xs sm:text-sm px-3 py-1 rounded-full">
                                                Nhấn để xem
                                            </span>
                                        </div>
                                    </>
                                )}

                                {/* Overlay */}
                                {item.type !== "video" && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent sm:from-black/80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-20" />
                                )}

                                {/* Caption */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 sm:transform sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300 z-20 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="font-['Cormorant_Garamond'] text-sm sm:text-base text-gray-200 text-center italic">
                                        {item.caption}
                                    </p>
                                </div>
                            </div>

                            {/* Tap hint on mobile */}
                            {item.type !== "video" && (
                                <div className="absolute top-2 left-2 sm:hidden bg-black/40 rounded-full px-2 py-1 z-20">
                                    <span className="text-white/60 text-xs">Tap</span>
                                </div>
                            )}

                            {/* Decorative corner */}
                            <div className="hidden sm:block absolute -top-1 -right-1 text-xs text-violet-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                ✦
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox modal - FULL SCREEN cho video trên mobile */}
            {selectedItem && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black ${selectedItem.type === "video" ? "p-0" : "p-2 sm:p-4 bg-black/98 backdrop-blur-sm"
                        }`}
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className={`relative animate-fadeInUp ${selectedItem.type === "video"
                                ? "w-full h-full"
                                : "w-full max-w-5xl"
                            }`}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            className={`absolute z-60 flex items-center gap-1 px-10 py-5 transition-colors ${selectedItem.type === "video"
                                    ? "top-4 right-40 bg-black/60 rounded-full text-white hover:bg-black/80"
                                    : "-top-10 sm:-top-12 right-0 text-gray-400 hover:text-white"
                                }`}
                            onClick={() => setSelectedItem(null)}
                        >
                            <span className="text-lg">✕</span>
                            <span className={selectedItem.type === "video" ? "text-lg" : "hidden sm:inline text-sm"}>Đóng</span>
                        </button>

                        {/* Video - FULL SCREEN */}
                        {selectedItem.type === "video" ? (
                            <div className="w-full h-full flex flex-col">
                                {/* Video container - full height */}
                                <div className="flex-1 relative bg-black">
                                    <iframe
                                        src={`https://drive.google.com/file/d/${selectedItem.fileId}/preview?resourcekey=&usp=embed_googleplus&hd=1`}
                                        className="absolute inset-0 w-full h-full border-0"
                                        allow="autoplay; fullscreen; accelerometer; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>

                                {/* Caption bar */}
                                <div className="bg-black/90 py-3 px-4 text-center">
                                    <p className="font-['Cormorant_Garamond'] text-base text-gray-300 italic">
                                        {selectedItem.caption}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        Nhấn ✕ hoặc bên ngoài để đóng
                                    </p>
                                </div>
                            </div>
                        ) : (
                            /* Image lightbox - giữ nguyên */
                            <>
                                <div className="rounded-lg sm:rounded-xl overflow-hidden bg-black/50 aspect-[3/4] sm:aspect-[4/5] max-w-sm sm:max-w-lg mx-auto">
                                    <iframe
                                        src={`https://drive.google.com/file/d/${selectedItem.fileId}/preview`}
                                        className="w-full h-full border-0"
                                        allow="autoplay; fullscreen"
                                        allowFullScreen
                                        style={{
                                            transform: (selectedItem as any).rotate ? `rotate(${(selectedItem as any).rotate}deg)` : undefined,
                                            transformOrigin: 'center center',
                                        }}
                                    />
                                </div>

                                {/* Caption */}
                                <p className="font-['Cormorant_Garamond'] text-base sm:text-lg text-gray-400 mt-3 sm:mt-4 text-center px-4 italic">
                                    {selectedItem.caption}
                                </p>

                                {/* Hint on mobile */}
                                <p className="sm:hidden text-center text-gray-600 text-xs mt-2">
                                    Nhấn bên ngoài để đóng
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
