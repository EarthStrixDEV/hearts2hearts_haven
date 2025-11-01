"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { swalError, swalSuccess, swalWarning } from "@/app/cms/_utils/swal";

interface ScheduleEvent {
  id: string;
  title: string;
  type: "performance" | "fanmeet" | "broadcast" | "release" | "other";
  date: string;
  time: string;
  location: string;
  description: string;
  emoji: string;
  priority: "high" | "medium" | "low";
  isPublic: boolean;
  ticketUrl?: string;
  streamUrl?: string;
}

export default function CreateSchedulePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ScheduleEvent>({
    id: Date.now().toString(),
    title: "",
    type: "performance",
    date: new Date().toISOString().split('T')[0],
    time: "19:00",
    location: "",
    description: "",
    emoji: "🎤",
    priority: "medium",
    isPublic: true,
    ticketUrl: "",
    streamUrl: "",
  });

  const handleSave = async () => {
    if (!formData.title || !formData.date || !formData.time) {
      await swalWarning("กรุณากรอกข้อมูลที่จำเป็น (ชื่อกิจกรรม, วันที่, และเวลา)");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await swalSuccess("เพิ่มกิจกรรมสำเร็จ!");
        router.push("/cms/schedule");
      } else {
        await swalError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error('Error saving schedule event:', error);
      await swalError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const eventTypes = [
    { 
      value: "performance", 
      emoji: "🎤", 
      label: "Performance", 
      color: "from-purple-500 to-violet-500",
      description: "การแสดงสด"
    },
    { 
      value: "fanmeet", 
      emoji: "💝", 
      label: "Fan Meeting", 
      color: "from-pink-500 to-rose-500",
      description: "งานพบปะแฟน"
    },
    { 
      value: "broadcast", 
      emoji: "📺", 
      label: "Broadcast", 
      color: "from-blue-500 to-cyan-500",
      description: "รายการโทรทัศน์"
    },
    { 
      value: "release", 
      emoji: "🎵", 
      label: "Release", 
      color: "from-green-500 to-emerald-500",
      description: "เปิดตัวเพลงใหม่"
    },
    { 
      value: "other", 
      emoji: "📅", 
      label: "Other", 
      color: "from-gray-500 to-slate-500",
      description: "กิจกรรมอื่นๆ"
    },
  ];

  const priorityLevels = [
    { value: "high", label: "สูง", color: "from-red-500 to-red-600", emoji: "🔥" },
    { value: "medium", label: "ปานกลาง", color: "from-yellow-500 to-orange-500", emoji: "⚡" },
    { value: "low", label: "ต่ำ", color: "from-green-500 to-green-600", emoji: "🌱" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-yellow-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/cms/schedule"
                className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 mb-3 font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                กลับไปจัดการกำหนดการ
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center text-2xl">
                  📅
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    สร้างกิจกรรมใหม่
                  </h1>
                  <p className="text-gray-600 text-sm">เพิ่มกิจกรรมและกำหนดการใหม่</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/cms/schedule")}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-all duration-300 font-semibold"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white px-8 py-3 rounded-2xl hover:from-orange-600 hover:to-yellow-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    บันทึกกิจกรรม
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    ชื่อกิจกรรม *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all bg-gray-50/50"
                    placeholder="ใส่ชื่อกิจกรรม..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      วันที่ *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all bg-gray-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      เวลา *
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all bg-gray-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    สถานที่
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all bg-gray-50/50"
                    placeholder="ใส่สถานที่จัดงาน..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                    รายละเอียด
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all bg-gray-50/50 resize-none"
                    placeholder="เขียนรายละเอียดเกี่ยวกับกิจกรรมนี้..."
                  />
                </div>
              </div>
            </motion.div>

            {/* Event Type Selection */}
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
                <h2 className="text-2xl font-bold text-gray-900">ประเภทกิจกรรม</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, type: type.value as any, emoji: type.emoji })}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      formData.type === type.value
                        ? `bg-gradient-to-br ${type.color} text-white border-transparent shadow-lg scale-105`
                        : "bg-white/50 border-gray-200 hover:border-gray-300 hover:bg-white/80"
                    }`}
                  >
                    <div className="text-3xl mb-3">{type.emoji}</div>
                    <div className={`font-bold mb-1 ${
                      formData.type === type.value ? "text-white" : "text-gray-900"
                    }`}>
                      {type.label}
                    </div>
                    <div className={`text-sm ${
                      formData.type === type.value ? "text-white/80" : "text-gray-600"
                    }`}>
                      {type.description}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Additional Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white">
                  🔗
                </div>
                <h2 className="text-2xl font-bold text-gray-900">ลิงก์เพิ่มเติม</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-lg">🎫</span>
                    ลิงก์ซื้อตั้ว
                  </label>
                  <input
                    type="url"
                    value={formData.ticketUrl}
                    onChange={(e) => setFormData({ ...formData, ticketUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all bg-gray-50/50"
                    placeholder="https://tickets.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-lg">📺</span>
                    ลิงก์ถ่ายทอดสด
                  </label>
                  <input
                    type="url"
                    value={formData.streamUrl}
                    onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all bg-gray-50/50"
                    placeholder="https://stream.example.com"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">👁️</span>
                ตัวอย่าง
              </h3>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        formData.type === 'performance' ? 'bg-purple-100 text-purple-700' :
                        formData.type === 'fanmeet' ? 'bg-pink-100 text-pink-700' :
                        formData.type === 'broadcast' ? 'bg-blue-100 text-blue-700' :
                        formData.type === 'release' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {eventTypes.find(t => t.value === formData.type)?.label}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span>{formData.emoji}</span>
                      {formData.title || "ชื่อกิจกรรม"}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <span>📅</span>
                        {new Date(formData.date).toLocaleDateString("th-TH")} • 🕐 {formData.time}
                      </p>
                      {formData.location && (
                        <p className="flex items-center gap-2">
                          <span>📍</span>
                          {formData.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {formData.description && (
                  <p className="text-sm text-gray-600 mb-4">{formData.description}</p>
                )}
                <div className="flex gap-2">
                  {formData.ticketUrl && (
                    <div className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-semibold text-center">
                      🎫 ซื้อตั๋ว
                    </div>
                  )}
                  {formData.streamUrl && (
                    <div className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-xs font-semibold text-center">
                      📺 ดูสด
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Priority & Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">⚙️</span>
                การตั้งค่า
              </h3>
              
              <div className="space-y-6">
                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ระดับความสำคัญ
                  </label>
                  <div className="space-y-2">
                    {priorityLevels.map((priority) => (
                      <button
                        key={priority.value}
                        onClick={() => setFormData({ ...formData, priority: priority.value as any })}
                        className={`w-full p-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 ${
                          formData.priority === priority.value
                            ? `bg-gradient-to-r ${priority.color} text-white border-transparent shadow-lg`
                            : "bg-white/50 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-lg">{priority.emoji}</span>
                        <span className={`font-semibold ${
                          formData.priority === priority.value ? "text-white" : "text-gray-700"
                        }`}>
                          {priority.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Public/Private */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      <span className="text-lg">🌍</span>
                      เผยแพร่สาธารณะ
                    </div>
                    <p className="text-sm text-gray-600">แสดงในหน้าเว็บไซต์</p>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isPublic ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isPublic ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Emoji */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    อีโมจิ
                  </label>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all bg-gray-50/50"
                    placeholder="📅"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
