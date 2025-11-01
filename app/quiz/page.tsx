"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "เพลงเดบิวต์ของ H2H คือเพลงอะไร?",
    options: ["FOCUS", "Style", "The Chase", "Pretty Please"],
    correct: 2,
    explanation: "H2H เดบิวต์ด้วยเพลง 'The Chase' เมื่อปี 2025!",
  },
  {
    id: 2,
    question: "H2H มีสมาชิกทั้งหมดกี่คน?",
    options: ["6 คน", "7 คน", "8 คน", "9 คน"],
    correct: 2,
    explanation: "H2H มีสมาชิกทั้งหมด 8 คน!",
  },
  {
    id: 3,
    question: "ใครคือลีดเดอร์ของ H2H?",
    options: ["Carmen", "Jiwoo", "Yuha", "Stella"],
    correct: 1,
    explanation: "Jiwoo เป็นลีดเดอร์ที่น่ารักของ H2H! 👑",
  },
  {
    id: 4,
    question: "เพลง 'FOCUS' มี concept อะไร?",
    options: [
      "Flower cathedral",
      "Street fashion",
      "Cyber punk",
      "School uniform",
    ],
    correct: 0,
    explanation: "FOCUS มี concept ดอกไม้และโบสถ์ที่สวยงามมาก!",
  },
  {
    id: 5,
    question: "แฟนคลับของ H2H เรียกว่าอะไร?",
    options: ["Heart", "S2U", "Chase", "Angel"],
    correct: 1,
    explanation: "แฟนคลับของ H2H คือ S2U (Sister To yoU)! 💕",
  },
  {
    id: 6,
    question: "H2H มาจากค่ายเพลงไหน?",
    options: ["JYP", "SM Entertainment", "YG", "HYBE"],
    correct: 1,
    explanation: "H2H มาจาก SM Entertainment ค่ายเดียวกับ aespa, NCT!",
  },
  {
    id: 7,
    question: "ใครคือ Main Vocal ของ H2H?",
    options: ["Yuha", "Carmen", "A-na", "Jiwoo"],
    correct: 1,
    explanation: "Carmen เป็น Main Vocal ที่มีเสียงสวยมากๆ! 🎤",
  },
  {
    id: 8,
    question: "สมาชิกคนไหนเป็น Maknae (น้องสุด)?",
    options: ["Ian", "Ye-on", "A-na", "Juun"],
    correct: 1,
    explanation: "Ye-on เป็น Maknae ที่น่ารักของกลุ่ม! 🎶",
  },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(quizQuestions.length).fill(false)
  );

  const handleAnswerSelect = (optionIndex: number) => {
    if (answeredQuestions[currentQuestion]) return;

    setSelectedAnswer(optionIndex);
    setShowExplanation(true);

    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = true;
    setAnsweredQuestions(newAnsweredQuestions);

    if (optionIndex === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setIsQuizComplete(false);
    setAnsweredQuestions(new Array(quizQuestions.length).fill(false));
  };

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage === 100) return "สุดยอด! คุณคือ S2U ตัวจริง! 🏆";
    if (percentage >= 80) return "เก่งมาก! คุณรู้จัก H2H ดีเลย! 💖";
    if (percentage >= 60)
      return "ดีมาก! แต่ยังต้องติดตาม H2H ให้มากกว่านี้! 💕";
    if (percentage >= 40) return "พอใช้! มาเรียนรู้เพิ่มเติมกันเถอะ! 🌟";
    return "ไม่เป็นไร! มาเริ่มต้นเป็นแฟนคลับกันใหม่! 💙";
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-linear-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            H2H Quiz Game 🎮
          </h1>
          <p className="text-xl text-gray-600">
            ทดสอบความรู้เกี่ยวกับ Hearts2Hearts!
          </p>
        </motion.div>

        {!isQuizComplete ? (
          <div className="card-pastel p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">
                  คำถามที่ {currentQuestion + 1} / {quizQuestions.length}
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  คะแนน: {score}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="bg-linear-to-r from-sky-400 to-blue-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      ((currentQuestion + 1) / quizQuestions.length) * 100
                    }%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
                  {quizQuestions[currentQuestion].question}
                </h2>

                {/* Options */}
                <div className="space-y-4 mb-6">
                  {quizQuestions[currentQuestion].options.map(
                    (option, index) => {
                      const isCorrect =
                        index === quizQuestions[currentQuestion].correct;
                      const isSelected = selectedAnswer === index;
                      const showResult = showExplanation;

                      let bgColor = "bg-white hover:bg-blue-50";
                      let borderColor = "border-gray-300";
                      let textColor = "text-gray-800";

                      if (showResult && isSelected && isCorrect) {
                        bgColor = "bg-green-100";
                        borderColor = "border-green-500";
                        textColor = "text-green-700";
                      } else if (showResult && isSelected && !isCorrect) {
                        bgColor = "bg-red-100";
                        borderColor = "border-red-500";
                        textColor = "text-red-700";
                      } else if (showResult && isCorrect) {
                        bgColor = "bg-green-50";
                        borderColor = "border-green-400";
                        textColor = "text-green-600";
                      }

                      return (
                        <motion.button
                          key={index}
                          whileHover={{ scale: showResult ? 1 : 1.02 }}
                          whileTap={{ scale: showResult ? 1 : 0.98 }}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={answeredQuestions[currentQuestion]}
                          className={`w-full p-4 rounded-xl border-2 ${bgColor} ${borderColor} ${textColor} font-semibold text-left transition-all duration-300 disabled:cursor-not-allowed`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {showResult && isCorrect && (
                              <span className="text-2xl">✓</span>
                            )}
                            {showResult && isSelected && !isCorrect && (
                              <span className="text-2xl">✗</span>
                            )}
                          </div>
                        </motion.button>
                      );
                    }
                  )}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-6"
                    >
                      <p className="text-blue-800 font-semibold">
                        💡 {quizQuestions[currentQuestion].explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Next Button */}
                {showExplanation && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleNextQuestion}
                    className="btn-pastel w-full"
                  >
                    {currentQuestion < quizQuestions.length - 1
                      ? "คำถามถัดไป →"
                      : "ดูผลคะแนน 🎯"}
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          /* Results */
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="card-pastel p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-8xl mb-6"
            >
              {score >= quizQuestions.length * 0.8
                ? "🏆"
                : score >= quizQuestions.length * 0.6
                ? "🌟"
                : "💙"}
            </motion.div>
            <h2 className="text-4xl font-bold gradient-text mb-4">
              ผลคะแนนของคุณ
            </h2>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="text-6xl font-bold text-blue-600 mb-4"
            >
              {score} / {quizQuestions.length}
            </motion.div>
            <p className="text-2xl text-gray-700 mb-8">{getScoreMessage()}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetQuiz}
                className="btn-pastel"
              >
                เล่นอีกครั้ง 🔄
              </motion.button>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-500 px-8 py-3 rounded-full font-semibold border-2 border-blue-300 hover:shadow-lg transition-all duration-300"
                >
                  กลับหน้าหลัก 🏠
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Decorative Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-10 text-6xl opacity-20"
        >
          💕
        </motion.div>
        <motion.div
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-10 text-5xl opacity-20"
        >
          🎮
        </motion.div>
      </div>
    </div>
  );
}
