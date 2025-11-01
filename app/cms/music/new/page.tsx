"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { swalError, swalSuccess, swalWarning } from "@/app/cms/_utils/swal";

interface MusicVideo {
  id: string;
  title: string;
  artist: string;
  type: string;
  youtubeId: string;
  releaseDate: string;
  views: string;
  thumbnail: string;
  description: string;
  emoji: string;
  featured: boolean;
}

export default function CreateMusicPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<MusicVideo>({
    id: Date.now().toString(),
    title: "",
    artist: "Hearts2Hearts",
    type: "Music Video",
    youtubeId: "",
    releaseDate: new Date().toISOString().split('T')[0],
    views: "0",
    thumbnail: "",
    description: "",
    emoji: "🎵",
    featured: false,
  });

  const handleSave = async () => {
    if (!formData.title || !formData.youtubeId) {
      await swalWarning("กรุณากรอกข้อมูลที่จำเป็น (ชื่อเพลงและ YouTube ID)");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await swalSuccess("เพิ่มเพลง/วิดีโอสำเร็จ!");
        router.push("/cms/music");
      } else {
        await swalError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error('Error saving music video:', error);
      await swalError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const musicTypes = [
    { value: "Music Video", emoji: "🎵", color: "from-pink-500 to-rose-500" },
    { value: "Performance", emoji: "🎤", color: "from-purple-500 to-violet-500" },
    { value: "Dance Practice", emoji: "💃", color: "from-blue-500 to-cyan-500" },
    { value: "Behind the Scenes", emoji: "🎬", color: "from-green-500 to-emerald-500" },
    { value: "Showcase", emoji: "✨", color: "from-yellow-500 to-orange-500" },
    { value: "Trailer", emoji: "🎞️", color: "from-red-500 to-pink-500" },
    { value: "Practice", emoji: "🎯", color: "from-indigo-500 to-purple-500" },
    { value: "Variety Show", emoji: "📺", color: "from-teal-500 to-cyan-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/cms/music"
                className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 mb-3 font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                กลับไปจัดการเพลง
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-2xl">
                  🎵
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    เพิ่มเพลง & วิดีโอใหม่
                  </h1>
                  <p className="text-gray-600 text-sm">สร้างเนื้อหาเพลงและวิดีโอใหม่</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/cms/music")}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-all duration-300 font-semibold"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-3 rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    บันทึกเพลง
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                  📝
                </div>
                <h2 className="text-2xl font-bold text-gray-900">ข้อมูลพื้นฐาน</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      ชื่อเพลง/วิดีโอ *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all bg-gray-50/50"
                      placeholder="ใส่ชื่อเพลงหรือวิดีโอ..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                      ศิลปิน
                    </label>
                    <input
                      type="text"
                      value={formData.artist}
                      onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all bg-gray-50/50"
                      placeholder="ชื่อศิลปิน..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      YouTube ID *
                    </label>
                    <input
                      type="text"
                      value={formData.youtubeId}
                      onChange={(e) => {
                        const youtubeId = e.target.value;
                        setFormData({ 
                          ...formData, 
                          youtubeId,
                          thumbnail: youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : ""
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all bg-gray-50/50"
                      placeholder="dQw4w9WgXcQ"
                    />
                    <p className="text-xs text-gray-500">ใส่ ID จาก URL ของ YouTube</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      วันที่เผยแพร่
                    </label>
                    <input
                      type="date"
                      value={formData.releaseDate}
                      onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all bg-gray-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    คำอธิบาย
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all bg-gray-50/50 resize-none"
                    placeholder="เขียนคำอธิบายเกี่ยวกับเพลงหรือวิดีโอนี้..."
                  />
                </div>
              </div>
            </motion.div>

            {/* Type Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                  🎭
                </div>
                <h2 className="text-2xl font-bold text-gray-900">ประเภทเนื้อหา</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {musicTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, type: type.value, emoji: type.emoji })}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                      formData.type === type.value
                        ? `bg-gradient-to-br ${type.color} text-white border-transparent shadow-lg scale-105`
                        : "bg-white/50 border-gray-200 hover:border-gray-300 hover:bg-white/80"
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.emoji}</div>
                    <div className={`text-sm font-semibold ${
                      formData.type === type.value ? "text-white" : "text-gray-700"
                    }`}>
                      {type.value}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">👁️</span>
                ตัวอย่าง
              </h3>
              
              {formData.youtubeId ? (
                <div className="space-y-4">
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <span>{formData.emoji}</span>
                      {formData.title || "ชื่อเพลง/วิดีโอ"}
                    </h4>
                    <p className="text-sm text-gray-600">{formData.artist}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {formData.type}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">🎵</div>
                    <p className="text-sm">ใส่ YouTube ID เพื่อดูตัวอย่าง</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">⚙️</span>
                การตั้งค่า
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    จำนวนวิว
                  </label>
                  <input
                    type="text"
                    value={formData.views}
                    onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all bg-gray-50/50"
                    placeholder="1M+"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    อีโมจิ
                  </label>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all bg-gray-50/50"
                    placeholder="🎵"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      <span className="text-lg">⭐</span>
                      Featured
                    </div>
                    <p className="text-sm text-gray-600">แสดงในหน้าแรก</p>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.featured ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.featured ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
