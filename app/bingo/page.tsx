"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface BingoCell {
  id: number;
  text: string;
  checked: boolean;
}

const bingoItems = [
  "ฟังเพลง FOCUS 100 ครั้ง",
  "ดู MV The Chase",
  "ติดตาม H2H บน X (Twitter)",
  "ซื้ออัลบั้ม H2H",
  "ดู Dance Practice วิดีโอ",
  "โหวตให้ H2H",
  "แชร์เพลง H2H ให้เพื่อน",
  "ดู Fancam ของสมาชิก",
  "เข้า Weverse ทุกวัน",
  "💕 FREE SPACE 💕",
  "รู้ชื่อสมาชิกทั้ง 8 คน",
  "ร้องเพลง Style ได้ครบ",
  "เต้นท่า Pretty Please ได้",
  "ดูรายการวาไรตี้ H2H",
  "ทำ Fan Art ให้ H2H",
  "ดูคอนเสิร์ต/แฟนมีต",
  "รู้วันเกิดสมาชิกทุกคน",
  "โพสต์แฟนอาร์ตบนโซเชียล",
  "ซื้อ Lightstick (ถ้ามี)",
  "ร่วม Streaming Party",
  "ดู Behind the Scenes",
  "ทำ Cover Dance",
  "สะสม Photocard",
  "เข้าร่วมกิจกรรมของ S2U",
  "รู้เนื้อเพลง FOCUS ทั้งหมด",
];

export default function BingoPage() {
  const [bingoBoard, setBingoBoard] = useState<BingoCell[]>([]);
  const [completedLines, setCompletedLines] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);

  // Initialize bingo board with shuffled items
  useEffect(() => {
    const shuffled = [...bingoItems].sort(() => Math.random() - 0.5);
    const board = shuffled.slice(0, 25).map((item, index) => ({
      id: index,
      text: item,
      checked: index === 12, // Free space in the middle
    }));
    setBingoBoard(board);
  }, []);

  const checkBingo = (board: BingoCell[]) => {
    let lines = 0;

    // Check rows
    for (let i = 0; i < 5; i++) {
      if (board.slice(i * 5, i * 5 + 5).every((cell) => cell.checked)) {
        lines++;
      }
    }

    // Check columns
    for (let i = 0; i < 5; i++) {
      if ([0, 1, 2, 3, 4].every((row) => board[row * 5 + i].checked)) {
        lines++;
      }
    }

    // Check diagonals
    if ([0, 6, 12, 18, 24].every((i) => board[i].checked)) {
      lines++;
    }
    if ([4, 8, 12, 16, 20].every((i) => board[i].checked)) {
      lines++;
    }

    return lines;
  };

  const handleCellClick = (id: number) => {
    const newBoard = bingoBoard.map((cell) =>
      cell.id === id ? { ...cell, checked: !cell.checked } : cell
    );
    setBingoBoard(newBoard);

    const lines = checkBingo(newBoard);
    setCompletedLines(lines);

    if (lines >= 5 && !showWinModal) {
      setShowWinModal(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const resetBoard = () => {
    const shuffled = [...bingoItems].sort(() => Math.random() - 0.5);
    const board = shuffled.slice(0, 25).map((item, index) => ({
      id: index,
      text: item,
      checked: index === 12,
    }));
    setBingoBoard(board);
    setCompletedLines(0);
    setShowWinModal(false);
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-linear-to-b from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: 360,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  ease: "linear",
                }}
                className="absolute text-2xl"
              >
                {["💕", "💖", "✨", "🎉", "🎊"][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            H2H Fan Bingo 🎯
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            ทำภารกิจแฟนคลับให้ครบและรับรางวัล Bingo!
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="bg-white px-6 py-3 rounded-full shadow-lg">
              <span className="font-bold text-purple-600">
                Bingo Lines: {completedLines}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetBoard}
              className="bg-linear-to-r from-pink-400 to-purple-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🔄 รีเซ็ตกระดาน
            </motion.button>
          </div>
        </motion.div>

        {/* Bingo Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="card-pastel p-4 md:p-8 mb-8"
        >
          <div className="grid grid-cols-5 gap-2 md:gap-4">
            {bingoBoard.map((cell, index) => {
              const isFreeSpace = cell.text.includes("FREE SPACE");
              return (
                <motion.button
                  key={cell.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ scale: cell.checked ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => !isFreeSpace && handleCellClick(cell.id)}
                  className={`
                    aspect-square p-2 md:p-4 rounded-xl font-semibold text-xs md:text-sm
                    transition-all duration-300 relative overflow-hidden
                    ${
                      cell.checked
                        ? isFreeSpace
                          ? "bg-linear-to-br from-pink-400 to-purple-500 text-white shadow-xl"
                          : "bg-linear-to-br from-green-400 to-blue-500 text-white shadow-xl"
                        : "bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400 text-gray-700"
                    }
                    ${isFreeSpace ? "cursor-default" : "cursor-pointer"}
                  `}
                >
                  <span className="relative z-10 flex items-center justify-center h-full text-center leading-tight">
                    {cell.text}
                  </span>
                  {cell.checked && !isFreeSpace && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="text-4xl md:text-6xl opacity-30">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-pastel p-6 mb-8"
        >
          <h2 className="text-2xl font-bold gradient-text mb-4">วิธีเล่น 📖</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-2xl">1️⃣</span>
              <span>คลิกที่ช่องเมื่อคุณทำภารกิจนั้นๆ เสร็จแล้ว</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <span>
                พยายามทำให้ได้ Bingo (5 ช่องติดกันในแนวนอน แนวตั้ง หรือแนวทแยง)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <span>ช่องตรงกลางคือ FREE SPACE ให้คะแนนอยู่แล้ว! 💕</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">4️⃣</span>
              <span>ทำให้ได้มากกว่า 5 Bingo เพื่อเป็น Ultimate S2U! 🏆</span>
            </li>
          </ul>
        </motion.div>

        {/* Progress Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div
            className={`card-pastel p-6 text-center ${
              completedLines >= 1 ? "bg-green-50 border-2 border-green-300" : ""
            }`}
          >
            <div className="text-4xl mb-2">
              {completedLines >= 1 ? "✅" : "⭕"}
            </div>
            <h3 className="font-bold text-lg mb-1">Beginner S2U</h3>
            <p className="text-sm text-gray-600">ทำ Bingo ได้ 1 เส้น</p>
          </div>
          <div
            className={`card-pastel p-6 text-center ${
              completedLines >= 3 ? "bg-blue-50 border-2 border-blue-300" : ""
            }`}
          >
            <div className="text-4xl mb-2">
              {completedLines >= 3 ? "✅" : "⭕"}
            </div>
            <h3 className="font-bold text-lg mb-1">Expert S2U</h3>
            <p className="text-sm text-gray-600">ทำ Bingo ได้ 3 เส้น</p>
          </div>
          <div
            className={`card-pastel p-6 text-center ${
              completedLines >= 5
                ? "bg-purple-50 border-2 border-purple-300"
                : ""
            }`}
          >
            <div className="text-4xl mb-2">
              {completedLines >= 5 ? "✅" : "⭕"}
            </div>
            <h3 className="font-bold text-lg mb-1">Ultimate S2U</h3>
            <p className="text-sm text-gray-600">ทำ Bingo ได้ 5 เส้น</p>
          </div>
        </motion.div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-500 px-8 py-3 rounded-full font-semibold border-2 border-purple-300 hover:shadow-lg transition-all duration-300"
            >
              กลับหน้าหลัก 🏠
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Win Modal */}
      <AnimatePresence>
        {showWinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 px-4"
            onClick={() => setShowWinModal(false)}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="card-pastel p-8 max-w-md text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="text-8xl mb-4"
              >
                🏆
              </motion.div>
              <h2 className="text-4xl font-bold gradient-text mb-4">
                ยินดีด้วย!
              </h2>
              <p className="text-xl text-gray-700 mb-2">
                คุณได้ {completedLines} Bingo Lines!
              </p>
              <p className="text-lg text-purple-600 font-semibold mb-6">
                {completedLines >= 8
                  ? "คุณคือ Ultimate S2U ตัวจริง! 🌟"
                  : "คุณเป็นแฟนคลับที่ยอดเยี่ยม! 💖"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWinModal(false)}
                className="btn-pastel"
              >
                เยี่ยมมาก! 🎉
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-10 text-6xl opacity-20"
      >
        🎯
      </motion.div>
      <motion.div
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 left-10 text-5xl opacity-20"
      >
        💖
      </motion.div>
    </div>
  );
}
