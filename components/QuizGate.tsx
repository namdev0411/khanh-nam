"use client";

import { useEffect, useState, useMemo } from "react";
import Confetti from "./Confetti";
import Fireworks from "./Fireworks";

// Google Sheets Web App URL
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxtAWYuSj5mMtOG9TxlqIWrn-NNlFHTZRd_SgwxcKBzM1HeWpXOnr1uPSXvuwzr2E2q/exec";

// Câu hỏi và đáp án
const questions = [
    {
        id: 1,
        question: "Món ăn Thái Lan yêu thích của em là gì?",
        options: ["Gỏi", "Mỳ Trộn", "Cơm gà", "Cơm Hàu"],
        correctAnswer: 2,
        isScored: true,
    },
    {
        id: 2,
        question: "Em thích làm gì khi rảnh?",
        options: ["Chơi game", "Lướt tiktok", "Nghe nhạc", "Đọc sách"],
        correctAnswer: 1,
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
        correctAnswer: null,
        isScored: false,
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

// Vị trí cố định cho các ngôi sao (tránh hydration mismatch)
const starPositions = [
    { left: 5, top: 10, delay: 0.1, size: 12 },
    { left: 15, top: 25, delay: 0.5, size: 10 },
    { left: 25, top: 5, delay: 1.2, size: 14 },
    { left: 35, top: 45, delay: 0.8, size: 11 },
    { left: 45, top: 15, delay: 1.5, size: 13 },
    { left: 55, top: 35, delay: 0.3, size: 9 },
    { left: 65, top: 55, delay: 1.8, size: 15 },
    { left: 75, top: 20, delay: 0.6, size: 10 },
    { left: 85, top: 40, delay: 1.1, size: 12 },
    { left: 95, top: 8, delay: 2.0, size: 11 },
    { left: 10, top: 60, delay: 0.4, size: 13 },
    { left: 30, top: 75, delay: 1.3, size: 10 },
    { left: 50, top: 85, delay: 0.9, size: 14 },
    { left: 70, top: 70, delay: 1.6, size: 11 },
    { left: 90, top: 90, delay: 0.2, size: 12 },
    { left: 20, top: 95, delay: 1.0, size: 9 },
    { left: 40, top: 65, delay: 1.4, size: 13 },
    { left: 60, top: 50, delay: 0.7, size: 10 },
    { left: 80, top: 80, delay: 1.9, size: 15 },
    { left: 12, top: 42, delay: 2.2, size: 11 },
];

interface QuizGateProps {
    onComplete: () => void;
    onClose?: () => void; // Để đóng khi chơi lại
    isReplay?: boolean; // Đang chơi lại hay lần đầu
}

export default function QuizGate({ onComplete, onClose, isReplay }: QuizGateProps) {
    const [stage, setStage] = useState<"intro" | "quiz" | "result">("intro");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showFireworks, setShowFireworks] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    // Gửi kết quả lên Google Sheets
    const sendToGoogleSheets = async (answers: number[]) => {
        try {
            const answerTexts = answers.map((answerIndex, questionIndex) =>
                questions[questionIndex].options[answerIndex]
            );

            const { correct, totalScored } = calculateScoreFromAnswers(answers);

            const data = {
                score: `${correct}/${totalScored}`,
                answers: answerTexts,
            };

            // Gửi data lên Google Sheets
            await fetch(GOOGLE_SHEETS_URL, {
                method: "POST",
                mode: "no-cors", // Bypass CORS
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            console.log("Đã gửi kết quả lên Google Sheets!");
        } catch (error) {
            console.error("Lỗi khi gửi lên Google Sheets:", error);
        }
    };

    const calculateScoreFromAnswers = (answers: number[]) => {
        let correct = 0;
        let totalScored = 0;
        answers.forEach((answer, index) => {
            if (index < questions.length && questions[index].isScored) {
                totalScored++;
                if (answer === questions[index].correctAnswer) {
                    correct++;
                }
            }
        });
        return { correct, totalScored };
    };

    const handleAnswer = async (answerIndex: number) => {
        const newAnswers = [...selectedAnswers, answerIndex];
        setSelectedAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestion(currentQuestion + 1);
            }, 300);
        } else {
            // Đã trả lời hết - gửi lên Google Sheets
            setIsSending(true);
            await sendToGoogleSheets(newAnswers);
            setIsSending(false);

            setTimeout(() => {
                setStage("result");
                // Trigger confetti khi xem kết quả!
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 4000);
            }, 300);
        }
    };

    // Chỉ tính score khi đã có đủ câu trả lời
    const scoreData = useMemo(() => {
        if (selectedAnswers.length === 0) {
            return { correct: 0, totalScored: 4 }; // Default
        }
        return calculateScoreFromAnswers(selectedAnswers);
    }, [selectedAnswers]);

    const resultMessage = useMemo(() => {
        const { correct, totalScored } = scoreData;
        const percentage = totalScored > 0 ? (correct / totalScored) * 100 : 0;

        if (percentage === 100) {
            return {
                title: "Hoàn hảo! 💜",
                message: "Anh hiểu em 100%! Giờ em có thể đọc thư của anh rồi...",
                emoji: "✨"
            };
        } else if (percentage >= 75) {
            return {
                title: "Tuyệt vời!",
                message: "Anh hiểu em gần như hoàn toàn. Giờ em xem anh viết gì cho em nhé...",
                emoji: "💜"
            };
        } else if (percentage >= 50) {
            return {
                title: "Khá tốt!",
                message: "Anh cũng hiểu em kha khá đó. Giờ đọc thư anh viết nè...",
                emoji: "✦"
            };
        } else {
            return {
                title: "Hmm...",
                message: "Có vẻ anh cần học hiểu em nhiều hơn. Nhưng em vẫn đọc thư anh nhé...",
                emoji: "💫"
            };
        }
    }, [scoreData]);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4">
            {/* Background effects */}
            <div className="absolute inset-0 bg-valentine-gradient">
                <div className="absolute top-1/4 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-violet-900/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-violet-900/10 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            {/* Falling stars - sử dụng vị trí cố định */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {starPositions.map((star, i) => (
                    <div
                        key={i}
                        className="absolute text-violet-400/40 animate-pulse"
                        style={{
                            left: `${star.left}%`,
                            top: `${star.top}%`,
                            animationDelay: `${star.delay}s`,
                            fontSize: `${star.size}px`,
                        }}
                    >
                        ✦
                    </div>
                ))}
            </div>

            {/* Main content */}
            <div className={`relative z-10 w-full max-w-lg transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                {/* Intro stage */}
                {stage === "intro" && (
                    <div className="glass rounded-2xl p-6 sm:p-10 text-center">
                        <div className="text-5xl sm:text-6xl mb-6 animate-pulse">✦</div>

                        <h1 className="font-['Dancing_Script'] text-3xl sm:text-4xl text-gradient-rose mb-4">
                            {isReplay ? "Chơi lại Quiz" : "Gửi Em Yêu"}
                        </h1>

                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent mx-auto mb-6" />

                        {!isReplay && (
                            <p className="font-['Cormorant_Garamond'] text-gray-300 text-base sm:text-xl mb-4 leading-relaxed">
                                Hôm nay chưa tới 14 tháng 2...
                            </p>
                        )}

                        <p className="font-['Cormorant_Garamond'] text-gray-400 text-lg sm:text-base mb-8 leading-relaxed italic">
                            {isReplay
                                ? "Em muốn thử lại xem anh hiểu em bao nhiêu không? 💜"
                                : "Nhưng nếu em muốn đọc thư của anh sớm, em có dám chơi câu đố một chút với anh không? 💜"
                            }
                        </p>
                        {!isReplay && (
                            <p className="font-['Cormorant_Garamond'] text-gray-400 text-sm sm:text-base mb-8 leading-relaxed italic">
                                Kiểm tra xem anh có hiểu em không nhé
                            </p>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={() => setStage("quiz")}
                                className="w-full px-8 py-4 bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 rounded-xl font-['Cormorant_Garamond'] text-gray-100 text-lg transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20"
                            >
                                Chơi luôn! ✦
                            </button>

                            {/* Nút đóng khi chơi lại */}
                            {isReplay && onClose && (
                                <button
                                    onClick={onClose}
                                    className="w-full px-8 py-3 bg-transparent hover:bg-gray-800/30 border border-gray-600/30 rounded-xl font-['Cormorant_Garamond'] text-gray-400 hover:text-gray-300 transition-all"
                                >
                                    Quay lại
                                </button>
                            )}

                            <p className="font-['Cormorant_Garamond'] text-gray-500 text-sm">
                                {questions.length} câu hỏi nhỏ thôi...
                            </p>
                        </div>
                    </div>
                )}

                {/* Quiz stage */}
                {stage === "quiz" && (
                    <div className="glass rounded-2xl p-6 sm:p-8">
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
                                    disabled={isSending}
                                    className="w-full p-4 text-left bg-black/30 hover:bg-violet-600/20 border border-violet-500/10 hover:border-violet-500/30 rounded-xl font-['Cormorant_Garamond'] text-gray-300 hover:text-gray-100 transition-all group disabled:opacity-50"
                                >
                                    <span className="text-violet-400/60 mr-3 group-hover:text-violet-400">
                                        {String.fromCharCode(65 + index)}.
                                    </span>
                                    {option}
                                </button>
                            ))}
                        </div>

                        {/* Sending indicator */}
                        {isSending && (
                            <p className="text-center text-violet-400 text-sm mt-4 animate-pulse">
                                Chờ 1 chút để a lưu lại câu trả lời nhé bé... ✦
                            </p>
                        )}
                    </div>
                )}

                {/* Result stage */}
                {stage === "result" && (
                    <div className="glass rounded-2xl p-6 sm:p-10 text-center">
                        <div className="text-4xl sm:text-5xl mb-4">{resultMessage.emoji}</div>

                        {/* Score */}
                        <div className="mb-6">
                            <span className="font-['Playfair_Display'] text-5xl sm:text-6xl text-gradient-rose">
                                {scoreData.correct}
                            </span>
                            <span className="font-['Cormorant_Garamond'] text-xl sm:text-2xl text-gray-400">
                                /{scoreData.totalScored}
                            </span>
                        </div>

                        <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl text-gray-200 mb-3">
                            {resultMessage.title}
                        </h3>
                        <p className="font-['Cormorant_Garamond'] text-gray-400 mb-8 text-sm sm:text-base leading-relaxed">
                            {resultMessage.message}
                        </p>

                        {/* Show answers summary */}
                        <div className="text-left mb-8 space-y-2 max-h-48 overflow-y-auto">
                            {questions.map((q, index) => {
                                const isScored = q.isScored;
                                const isCorrect = isScored && selectedAnswers[index] === q.correctAnswer;
                                const selectedOption = selectedAnswers[index] !== undefined ? q.options[selectedAnswers[index]] : "";

                                return (
                                    <div
                                        key={q.id}
                                        className={`p-2 rounded-lg text-xs ${!isScored
                                            ? "bg-violet-900/20 border border-violet-500/20"
                                            : isCorrect
                                                ? "bg-green-900/20 border border-green-500/20"
                                                : "bg-red-900/20 border border-red-500/20"
                                            }`}
                                    >
                                        <p className="font-['Cormorant_Garamond'] text-gray-400 text-xs truncate">
                                            {q.question}
                                        </p>
                                        {isScored ? (
                                            <p className={`font-['Cormorant_Garamond'] ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                                                {isCorrect ? "✓" : "✗"} {q.options[q.correctAnswer!]}
                                                {!isCorrect && <span className="text-gray-500"> (Em: {selectedOption})</span>}
                                            </p>
                                        ) : (
                                            <p className="font-['Cormorant_Garamond'] text-violet-400">
                                                💜 {selectedOption}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => {
                                // Trigger fireworks khi nhấn đọc thư!
                                setShowFireworks(true);
                                setTimeout(() => {
                                    setShowFireworks(false);
                                    onComplete();
                                }, 2000);
                            }}
                            className="w-full px-8 py-4 bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 rounded-xl font-['Cormorant_Garamond'] text-gray-100 text-lg transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20"
                        >
                            Đọc thư của anh 💜
                        </button>
                    </div>
                )}
            </div>

            {/* Effects */}
            <Confetti isActive={showConfetti} duration={4000} particleCount={150} />
            <Fireworks isActive={showFireworks} duration={3000} />
        </div>
    );
}
