"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface ScheduleEvent {
  id: string;
  title: string;
  type: "performance" | "fanmeet" | "broadcast" | "release" | "other";
  date: string;
  time: string;
  location: string;
  description: string;
}

export default function CMSSchedulePage() {
  const router = useRouter();
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("cms_user");
    if (!user) {
      router.push("/cms/login");
      return;
    }
    loadEvents();
  }, [router]);

  const loadEvents = () => {
    setTimeout(() => {
      const mockData: ScheduleEvent[] = [
        {
          id: "1",
          title: "Music Core Performance",
          type: "performance",
          date: "2025-11-01",
          time: "17:00",
          location: "MBC Music Core Studio",
          description: "FOCUS comeback stage",
        },
      ];
      setEvents(mockData);
      setIsLoading(false);
    }, 500);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      performance: "bg-purple-100 text-purple-700",
      fanmeet: "bg-pink-100 text-pink-700",
      broadcast: "bg-blue-100 text-blue-700",
      release: "bg-green-100 text-green-700",
      other: "bg-gray-100 text-gray-700",
    };
    return colors[type] || colors.other;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/cms"
                className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block"
              >
                ← กลับไป Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                📅 จัดการกำหนดการ
              </h1>
            </div>
            <Link
              href="/cms/schedule/new"
              className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white px-8 py-4 rounded-2xl hover:from-orange-600 hover:to-yellow-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              เพิ่มกิจกรรม
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                          event.type
                        )}`}
                      >
                        {event.type}
                      </span>
                      <span className="text-sm text-gray-600">
                        📅 {new Date(event.date).toLocaleDateString("th-TH")} •
                        🕐 {event.time}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-2">📍 {event.location}</p>
                    <p className="text-sm text-gray-500">{event.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold">
                      ✏️ แก้ไข
                    </button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold">
                      🗑️
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
