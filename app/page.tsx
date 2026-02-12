"use client";

import { useState, useEffect } from "react";

import FallingHearts from "@/components/FallingHearts";
import HeroSection from "@/components/HeroSection";
import LoveLetter from "@/components/LoveLetter";
import PhotoGallery from "@/components/PhotoGallery";
import Footer from "@/components/Footer";
import QuizGate from "@/components/QuizGate";
import SparklingCursor from "@/components/SparklingCursor";

const STORAGE_KEY = "valentine_quiz_completed";

export default function Home() {
  const [quizCompleted, setQuizCompleted] = useState<boolean | null>(null); // null = đang check
  const [showQuiz, setShowQuiz] = useState(false); // Để chơi lại quiz

  // Check localStorage khi load trang
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "true") {
      setQuizCompleted(true);
    } else {
      setQuizCompleted(false);
    }
  }, []);

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    setShowQuiz(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const handlePlayAgain = () => {
    setShowQuiz(true);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
  };

  // Đang check localStorage
  if (quizCompleted === null) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-violet-400 animate-pulse text-2xl">✦</div>
      </div>
    );
  }

  return (
    <>
      {/* Sparkling cursor effect */}
      <SparklingCursor />

      {/* Quiz gate - hiển thị lần đầu hoặc khi chơi lại */}
      {(!quizCompleted || showQuiz) && (
        <QuizGate
          onComplete={handleQuizComplete}
          onClose={quizCompleted ? handleCloseQuiz : undefined}
          isReplay={showQuiz}
        />
      )}

      {/* Main content - hiển thị sau khi hoàn thành quiz */}
      {quizCompleted && !showQuiz && (
        <main className="relative min-h-screen bg-valentine-gradient overflow-hidden">
          {/* Falling stars effect */}
          <FallingHearts />

          {/* Hero section with title and animation */}
          <HeroSection />

          {/* Love letter section */}
          <LoveLetter />

          {/* Photo gallery */}
          <PhotoGallery />

          {/* Play quiz again button */}
          <div className="py-8 text-center">
            <button
              onClick={handlePlayAgain}
              className="px-6 py-3 bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 rounded-full font-['Cormorant_Garamond'] text-gray-300 hover:text-gray-100 transition-all hover:scale-105"
            >
              ✦ Chơi lại Quiz ✦
            </button>
          </div>

          {/* Footer with counter */}
          <Footer />
        </main>
      )}
    </>
  );
}
