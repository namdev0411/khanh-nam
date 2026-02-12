"use client";

import { useEffect, useRef, useState } from "react";

// Câu hỏi và đáp án - BẠN CÓ THỂ CHỈNH SỬA TẠI ĐÂY
const questions = [
    {
        id: 1,
        question: "Món ăn Thái Lan yêu thích của em là gì?",
        options: ["Gỏi", "Mỳ Trộn", "Cơm gà", "Cơm Hàu"],
        correctAnswer: 2, // Index của đáp án đúng (0, 1, 2, 3)
        isScored: true, // Câu này tính điểm
    },
    {
        id: 2,
        question: "Em thích làm gì khi rảnh?",
        options: ["Chơi game", "Nghe nhạc", "Đọc sách", "Lướt tiktok"],
        correctAnswer: 3,
        isScored: true,
    },
    {
        id: 3,
        question: "Em thích màu gì?",
        options: ["Hồng", "Tím", "Xanh", "Trắng"],
        correctAnswer: 0,
        isScored: true,
    },
    {
        id: 4,
        question: "Đồ uống cả 2 đều thích là gì?",
        options: ["カシスオレンジ", "Trà Matcha", "Trà đào", "Soda"],
        correctAnswer: 0,
        isScored: true,
    },
    {
        id: 5,
        question: "Em nghĩ anh hiểu em bao nhiêu % ?",
        options: ["0%", "50%", "100%", "150%"],
        correctAnswer: null, // Không có đáp án đúng - chỉ ghi nhận
        isScored: false, // Câu này KHÔNG tính điểm
    },
    {
        id: 6,
        question: "Em thấy ai chủ động nhiều hơn?",
        options: ["Anh", "Em", "Cả 2", "Không biết"],
        correctAnswer: null,
        isScored: false,
    },
    {
        id: 7,
        question: "Nếu chấm điểm anh làm người yêu, em cho anh bao nhiêu điểm?",
        options: ["0 điểm", "50 điểm", "80 điểm", "100 điểm"],
        correctAnswer: null,
        isScored: false,
    },
];

export default function LoveQuiz() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
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

    const handleAnswer = (answerIndex: number) => {
        const newAnswers = [...selectedAnswers, answerIndex];
        setSelectedAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestion(currentQuestion + 1);
            }, 300);
        } else {
            setTimeout(() => {
                setShowResult(true);
            }, 300);
        }
    };

    // Chỉ tính điểm cho các câu có isScored = true
    const calculateScore = () => {
        let correct = 0;
        let totalScored = 0;
        selectedAnswers.forEach((answer, index) => {
            if (questions[index].isScored) {
                totalScored++;
                if (answer === questions[index].correctAnswer) {
                    correct++;
                }
            }
        });
        return { correct, totalScored };
    };

    const getResultMessage = () => {
        const { correct, totalScored } = calculateScore();
        const percentage = totalScored > 0 ? (correct / totalScored) * 100 : 0;

        if (percentage === 100) {
            return {
                title: "Hoàn hảo! 💜",
                message: "Anh hiểu em 100%! Có lẽ anh là người hiểu em nhất trên đời này rồi.",
                emoji: "✨"
            };
        } else if (percentage >= 75) {
            return {
                title: "Tuyệt vời!",
                message: "Anh hiểu em gần như hoàn toàn. Chỉ còn vài điều nhỏ anh cần học thêm thôi.",
                emoji: "💜"
            };
        } else if (percentage >= 50) {
            return {
                title: "Khá tốt!",
                message: "Anh hiểu em kha khá rồi đó. Nhưng vẫn còn nhiều điều anh muốn khám phá về em.",
                emoji: "✦"
            };
        } else if (percentage >= 25) {
            return {
                title: "Cần cố gắng hơn",
                message: "Có vẻ anh cần dành thêm thời gian để hiểu em hơn nữa nhỉ?",
                emoji: "🌙"
            };
        } else {
            return {
                title: "Hmm...",
                message: "Anh xin lỗi em, anh sẽ cố gắng hiểu em nhiều hơn. Cho anh cơ hội nhé!",
                emoji: "💫"
            };
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswers([]);
        setShowResult(false);
        setIsStarted(false);
    };

    const { correct, totalScored } = calculateScore();
    const result = getResultMessage();

    return (
        <section
            ref={sectionRef}
            id="quiz"
            className="relative min-h-screen px-3 sm:px-4 py-12 sm:py-20 bg-valentine-gradient"
        >
            {/* Section header */}
            <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <span className="text-2xl sm:text-3xl mb-3 sm:mb-4 inline-block text-violet-400/60">✦</span>
                <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl md:text-4xl text-gradient-rose mb-3 sm:mb-4 px-2 tracking-wide">
                    Anh Có Hiểu Em Không?
                </h2>
                <p className="font-['Cormorant_Garamond'] text-sm sm:text-base text-gray-500 px-4 italic">
                    Thử xem anh có thật sự hiểu em không nhé
                </p>
                <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent mx-auto mt-4 sm:mt-6" />
            </div>

            {/* Quiz container */}
            <div className={`max-w-lg mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                {/* Start screen */}
                {!isStarted && !showResult && (
                    <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-10 text-center">
                        <div className="text-4xl sm:text-5xl mb-6">✦</div>
                        <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl text-gray-200 mb-4">
                            Sẵn sàng chưa em?
                        </h3>
                        <p className="font-['Cormorant_Garamond'] text-gray-400 mb-8 text-sm sm:text-base">
                            {questions.length} câu hỏi để xem anh có hiểu em không
                        </p>
                        <button
                            onClick={() => setIsStarted(true)}
                            className="px-8 py-3 bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 rounded-full font-['Cormorant_Garamond'] text-gray-200 transition-all hover:scale-105"
                        >
                            Bắt đầu
                        </button>
                    </div>
                )}

                {/* Question screen */}
                {isStarted && !showResult && (
                    <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8">
                        {/* Progress */}
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-['Cormorant_Garamond'] text-gray-500 text-sm">
                                Câu {currentQuestion + 1}/{questions.length}
                            </span>
                            <div className="flex gap-1">
                                {questions.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-2 h-2 rounded-full transition-colors ${index < currentQuestion
                                                ? "bg-violet-500"
                                                : index === currentQuestion
                                                    ? "bg-violet-400"
                                                    : "bg-gray-700"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Question */}
                        <h3 className="font-['Playfair_Display'] text-lg sm:text-xl text-gray-200 mb-6 text-center">
                            {questions[currentQuestion].question}
                        </h3>

                        {/* Hint for non-scored questions */}
                        {!questions[currentQuestion].isScored && (
                            <p className="text-center text-violet-400/60 text-xs mb-4 font-['Cormorant_Garamond'] italic">
                                ✦ Câu hỏi dành cho em - không tính điểm ✦
                            </p>
                        )}

                        {/* Options */}
                        <div className="space-y-3">
                            {questions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    className="w-full p-4 text-left bg-black/30 hover:bg-violet-600/20 border border-violet-500/10 hover:border-violet-500/30 rounded-xl font-['Cormorant_Garamond'] text-gray-300 hover:text-gray-100 transition-all group"
                                >
                                    <span className="text-violet-400/60 mr-3 group-hover:text-violet-400">
                                        {String.fromCharCode(65 + index)}.
                                    </span>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Result screen */}
                {showResult && (
                    <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-10 text-center">
                        <div className="text-4xl sm:text-5xl mb-4">{result.emoji}</div>

                        {/* Score - chỉ hiển thị số câu tính điểm */}
                        <div className="mb-6">
                            <span className="font-['Playfair_Display'] text-5xl sm:text-6xl text-gradient-rose">
                                {correct}
                            </span>
                            <span className="font-['Cormorant_Garamond'] text-xl sm:text-2xl text-gray-400">
                                /{totalScored}
                            </span>
                        </div>

                        <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl text-gray-200 mb-3">
                            {result.title}
                        </h3>
                        <p className="font-['Cormorant_Garamond'] text-gray-400 mb-8 text-sm sm:text-base leading-relaxed">
                            {result.message}
                        </p>

                        {/* Show answers */}
                        <div className="text-left mb-8 space-y-3">
                            <p className="font-['Cormorant_Garamond'] text-gray-500 text-xs uppercase tracking-wider mb-4 text-center">
                                Kết quả chi tiết
                            </p>
                            {questions.map((q, index) => {
                                const isScored = q.isScored;
                                const isCorrect = isScored && selectedAnswers[index] === q.correctAnswer;
                                const selectedOption = q.options[selectedAnswers[index]];

                                return (
                                    <div
                                        key={q.id}
                                        className={`p-3 rounded-lg text-sm ${!isScored
                                                ? "bg-violet-900/20 border border-violet-500/20" // Câu không tính điểm - màu tím
                                                : isCorrect
                                                    ? "bg-green-900/20 border border-green-500/20"
                                                    : "bg-red-900/20 border border-red-500/20"
                                            }`}
                                    >
                                        <p className="font-['Cormorant_Garamond'] text-gray-400 text-xs mb-1">
                                            {q.question}
                                        </p>
                                        {isScored ? (
                                            // Câu tính điểm - hiển thị đúng/sai
                                            <p className={`font-['Cormorant_Garamond'] ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                                                {isCorrect ? "✓" : "✗"} Anh chọn: {q.options[q.correctAnswer!]}
                                                {!isCorrect && (
                                                    <span className="text-gray-500 ml-2">
                                                        (Em chọn: {selectedOption})
                                                    </span>
                                                )}
                                            </p>
                                        ) : (
                                            // Câu không tính điểm - chỉ hiển thị câu trả lời của em
                                            <p className="font-['Cormorant_Garamond'] text-violet-400">
                                                💜 Em trả lời: {selectedOption}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={resetQuiz}
                            className="px-8 py-3 bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 rounded-full font-['Cormorant_Garamond'] text-gray-200 transition-all hover:scale-105"
                        >
                            Chơi lại
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
