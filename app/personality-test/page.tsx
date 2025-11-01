"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    member: string;
  }[];
}

interface Member {
  name: string;
  role: string;
  description: string;
  emoji: string;
  traits: string[];
  color: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "วันหยุดในฝันของคุณคือ?",
    options: [
      { text: "อ่านหนังสือในคาเฟ่เงียบๆ", member: "Yuha" },
      { text: "ไปช้อปปิ้งกับเพื่อนๆ", member: "Carmen" },
      { text: "ออกกำลังกายและกิจกรรมกลางแจ้ง", member: "Stella" },
      { text: "อยู่บ้านดูซีรีส์ทั้งวัน", member: "Ian" },
    ],
  },
  {
    id: 2,
    question: "เพื่อนๆ จะอธิบายคุณว่าเป็นคนแบบไหน?",
    options: [
      { text: "ผู้นำที่ดูแลทุกคน", member: "Jiwoo" },
      { text: "ศิลปินที่สร้างสรรค์", member: "A-na" },
      { text: "คนที่สนุกสนานและเป็นกันเอง", member: "Ian" },
      { text: "คนที่เท่และมีสไตล์", member: "Juun" },
    ],
  },
  {
    id: 3,
    question: "สีที่คุณชอบที่สุดคือ?",
    options: [
      { text: "สีฟ้าอ่อน - สงบและสบายๆ", member: "Yuha" },
      { text: "สีชมพู - น่ารักและหวาน", member: "Ye-on" },
      { text: "สีม่วง - ลึกลับและมีเสน่ห์", member: "Carmen" },
      { text: "สีดำ - เท่และโฉบเฉี่ยว", member: "Juun" },
    ],
  },
  {
    id: 4,
    question: "งานอดิเรกที่คุณชอบคือ?",
    options: [
      { text: "ร้องเพลงและฟังเพลง", member: "Carmen" },
      { text: "เต้นและออกแบบท่าเต้น", member: "A-na" },
      { text: "ถ่ายรูปและแต่งรูป", member: "Yuha" },
      { text: "เล่นเกมและดูอนิเมะ", member: "Ian" },
    ],
  },
  {
    id: 5,
    question: "ถ้าคุณได้เป็นไอดอล คุณอยากทำอะไรมากที่สุด?",
    options: [
      { text: "เขียนเพลงและแต่งเพลง", member: "Stella" },
      { text: "แร็ปและเขียนเนื้อร้อง", member: "Juun" },
      { text: "เป็น Center และ Visual", member: "Yuha" },
      { text: "ดูแลสมาชิกคนอื่นๆ", member: "Jiwoo" },
    ],
  },
  {
    id: 6,
    question: "คุณจัดการกับความเครียดยังไง?",
    options: [
      { text: "พูดคุยกับเพื่อนสนิท", member: "Jiwoo" },
      { text: "ออกกำลังกายหรือเต้น", member: "Stella" },
      { text: "ฟังเพลงหรือร้องเพลง", member: "Carmen" },
      { text: "นอนหลับให้เยอะๆ", member: "Ye-on" },
    ],
  },
  {
    id: 7,
    question: "บุคลิกที่เป็นตัวคุณมากที่สุดคือ?",
    options: [
      { text: "พลังบวก มีความสุขตลอด", member: "Ian" },
      { text: "ใจเย็น สงบเสงี่ยม", member: "Yuha" },
      { text: "สดใส ร่าเริง", member: "Ye-on" },
      { text: "ลึกซึ้ง ช่างคิด", member: "A-na" },
    ],
  },
  {
    id: 8,
    question: "ถ้าคุณไปทานข้าวกับน้องๆ H2H คุณจะทำอะไร?",
    options: [
      { text: "สั่งอาหารให้ทุกคน", member: "Jiwoo" },
      { text: "ถ่ายรูปอาหารสวยๆ", member: "Yuha" },
      { text: "เล่าเรื่องตลกให้ทุกคนหัวเราะ", member: "Ian" },
      { text: "นั่งฟังและสนุกไปกับบรรยากาศ", member: "A-na" },
    ],
  },
];

const members: { [key: string]: Member } = {
  Jiwoo: {
    name: "Jiwoo (지우)",
    role: "Leader",
    description:
      "คุณเป็นคนที่เป็นผู้นำโดยกำเนิด มีความรับผิดชอบสูง และห่วงใยคนรอบข้างเสมอ! คุณมีความสามารถในการรวมทุกคนเข้าด้วยกัน เหมือนจีวูที่เป็นแกนหลักของกลุ่ม 👑",
    emoji: "👑",
    traits: [
      "เป็นผู้นำที่ดี",
      "รับผิดชอบสูง",
      "ดูแลคนอื่น",
      "เป็นที่พึ่งพาได้",
    ],
    color: "from-purple-400 to-pink-400",
  },
  Carmen: {
    name: "Carmen (카르멘)",
    role: "Main Vocal",
    description:
      "คุณมีพรสวรรค์ด้านดนตรี มีเสน่ห์และความมั่นใจในตัวเอง! เสียงของคุณสามารถสัมผัสหัวใจคนได้ เหมือนคาร์เมนที่ร้องเพลงได้ไพเราะมาก 🎤",
    emoji: "🎤",
    traits: [
      "มีความสามารถด้านร้องเพลง",
      "มั่นใจในตัวเอง",
      "มีเสน่ห์",
      "อ่อนไหวต่อดนตรี",
    ],
    color: "from-pink-400 to-rose-400",
  },
  Yuha: {
    name: "Yuha (유하)",
    role: "Visual",
    description:
      "คุณมีความสวยงามทั้งภายนอกและภายใน สงบเสงี่ยม และมีรสนิยมที่ดี! คุณดึงดูดสายตาคนได้โดยไม่ต้องพูดอะไร เหมือนยูฮาที่เป็น Visual สุดปัง ✨",
    emoji: "✨",
    traits: ["สงบเสงี่ยม", "มีรสนิยม", "สวยงาม", "ละเอียดอ่อน"],
    color: "from-blue-400 to-cyan-400",
  },
  Stella: {
    name: "Stella (스텔라)",
    role: "All-rounder",
    description:
      "คุณทำได้ทุกอย่างที่ตั้งใจ! มีพลังงานสูง กระตือรือร้น และมีความสามารถหลากหลาย เหมือนสเตลล่าที่เป็น All-rounder ตัวจริง 🎸",
    emoji: "🎸",
    traits: ["เก่งรอบด้าน", "พลังงานสูง", "กระตือรือร้น", "มุ่งมั่น"],
    color: "from-orange-400 to-yellow-400",
  },
  Juun: {
    name: "Juun (준)",
    role: "Rapper",
    description:
      "คุณเท่ห์ มีสไตล์ และไม่กลัวที่จะแสดงออก! คุณมีความมั่นใจและเป็นตัวของตัวเอง เหมือนจูนที่แร็ปได้สุดเท่ 🎵",
    emoji: "🎵",
    traits: ["เท่ห์", "มีสไตล์", "มั่นใจ", "กล้าแสดงออก"],
    color: "from-gray-600 to-gray-800",
  },
  "A-na": {
    name: "A-na (아나)",
    role: "Lead Dancer, Vocalist",
    description:
      "คุณมีความสร้างสรรค์สูง ช่างคิดและช่างสังเกต! คุณแสดงออกผ่านศิลปะและการเคลื่อนไหว เหมือนอานาที่เต้นได้สวยงามและร้องเพลงได้ไพเราะ 🍭",
    emoji: "🍭",
    traits: ["สร้างสรรค์", "ช่างคิด", "ช่างสังเกต", "มีศิลปะในตัว"],
    color: "from-red-400 to-pink-400",
  },
  Ian: {
    name: "Ian (이안)",
    role: "Mood Maker",
    description:
      "คุณเป็นคนสนุกสนาน ร่าเริง และทำให้ทุกคนรอบข้างมีความสุข! คุณคือแสงสว่างในทุกๆ วัน เหมือนเอียนที่เป็น Mood Maker ของกลุ่ม 😊",
    emoji: "😊",
    traits: ["สนุกสนาน", "ร่าเริง", "ทำให้คนอื่นมีความสุข", "เป็นกันเอง"],
    color: "from-green-400 to-teal-400",
  },
  "Ye-on": {
    name: "Ye-on (예온)",
    role: "Maknae",
    description:
      "คุณน่ารัก สดใส และมีพลังบวกเสมอ! ทุกคนอยากดูแลคุณและคุณก็ทำให้ทุกคนยิ้มได้ง่ายๆ เหมือนเยอนที่เป็น Maknae สุดน่ารัก 🎶",
    emoji: "🎶",
    traits: ["น่ารัก", "สดใส", "พลังบวก", "ทำให้คนรอบข้างมีความสุข"],
    color: "from-pink-300 to-purple-300",
  },
};

export default function PersonalityTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<Member | null>(null);

  const handleAnswer = (memberName: string) => {
    const newAnswers = [...answers, memberName];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const counts: { [key: string]: number } = {};
      newAnswers.forEach((answer) => {
        counts[answer] = (counts[answer] || 0) + 1;
      });

      const maxMember = Object.keys(counts).reduce((a, b) =>
        counts[a] > counts[b] ? a : b
      );

      setResult(members[maxMember]);
      setShowResult(true);
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-linear-to-b from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            Which H2H Member Are You? 💕
          </h1>
          <p className="text-xl text-gray-600">
            ทำแบบทดสอบเพื่อดูว่าคุณเหมือนสมาชิก H2H คนไหน!
          </p>
        </motion.div>

        {!showResult ? (
          <div className="card-pastel p-8">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">
                  คำถามที่ {currentQuestion + 1} / {questions.length}
                </span>
                <span className="text-sm font-semibold text-purple-600">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="bg-linear-to-r from-pink-400 to-purple-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      ((currentQuestion + 1) / questions.length) * 100
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
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
                  {questions[currentQuestion].question}
                </h2>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAnswer(option.member)}
                      className="p-6 bg-white border-2 border-purple-200 rounded-2xl hover:border-purple-400 hover:shadow-xl transition-all duration-300 text-left group"
                    >
                      <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">
                        {members[option.member].emoji}
                      </span>
                      <p className="font-semibold text-gray-800 text-lg">
                        {option.text}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          /* Result */
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="card-pastel p-8 overflow-hidden relative"
          >
            <motion.div
              className={`absolute inset-0 bg-linear-to-br ${result?.color} opacity-10`}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 2, rotate: 180 }}
              transition={{ duration: 1 }}
            />

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-center mb-6"
              >
                <div className="text-8xl mb-4">{result?.emoji}</div>
                <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  You are {result?.name}!
                </h2>
                <p className="text-xl text-purple-600 font-semibold mb-6">
                  {result?.role}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 rounded-2xl p-6 mb-6"
              >
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {result?.description}
                </p>

                <div className="space-y-3">
                  <h3 className="font-bold text-purple-700 mb-3">
                    บุคลิกเด่นของคุณ:
                  </h3>
                  {result?.traits.map((trait, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-2xl">✨</span>
                      <span className="text-gray-700 font-medium">{trait}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetTest}
                  className="btn-pastel"
                >
                  ทำแบบทดสอบอีกครั้ง 🔄
                </motion.button>
                <Link href="/members">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-purple-500 px-8 py-3 rounded-full font-semibold border-2 border-purple-300 hover:shadow-lg transition-all duration-300"
                  >
                    ดูข้อมูลสมาชิก 👭
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Decorative Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-10 text-6xl opacity-20"
        >
          💖
        </motion.div>
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-10 text-5xl opacity-20"
        >
          ✨
        </motion.div>
      </div>
    </div>
  );
}
