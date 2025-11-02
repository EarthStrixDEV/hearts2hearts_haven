"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface DashboardStats {
  totalNews: number;
  drafts: number;
  scheduled: number;
  totalViews: number;
  totalMembers: number;
  totalMusic: number;
  totalEvents: number;
  totalGalleryItems: number;
}

export default function CMSDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalNews: 0,
    drafts: 0,
    scheduled: 0,
    totalViews: 0,
    totalMembers: 8,
    totalMusic: 0,
    totalEvents: 0,
    totalGalleryItems: 0,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("cms_user");
    if (!user) {
      router.push("/cms/login");
      return;
    }
    setIsLoggedIn(true);

    // Load stats
    loadStats();
  }, [router]);

  const loadStats = async () => {
    // Simulate loading stats from JSON
    setStats({
      totalNews: 15,
      drafts: 3,
      scheduled: 2,
      totalViews: 12500,
      totalMembers: 8,
      totalMusic: 12,
      totalEvents: 8,
      totalGalleryItems: 150,
    });
  };

  const quickActions = [
    {
      title: "เขียนข่าวใหม่",
      icon: "📝",
      href: "/cms/news/new",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "จัดการสมาชิก",
      icon: "👥",
      href: "/cms/members",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "อัปโหลดเพลง/MV",
      icon: "🎵",
      href: "/cms/music/new",
      color: "from-pink-500 to-pink-600",
    },
    {
      title: "จัดการ Carousel",
      icon: "🎠",
      href: "/cms/carousel",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      title: "จัดการแกลเลอรี",
      icon: "📸",
      href: "/cms/gallery",
      color: "from-green-500 to-green-600",
    },
    {
      title: "สร้างกำหนดการ",
      icon: "📅",
      href: "/cms/schedule/new",
      color: "from-orange-500 to-orange-600",
    },
  ];

  const modules = [
    {
      name: "News & Articles",
      icon: "📰",
      count: stats.totalNews,
      drafts: stats.drafts,
      href: "/cms/news",
      color: "blue",
    },
    {
      name: "Members",
      icon: "👭",
      count: stats.totalMembers,
      href: "/cms/members",
      color: "purple",
    },
    {
      name: "Music & Videos",
      icon: "🎵",
      count: stats.totalMusic,
      href: "/cms/music",
      color: "pink",
    },
    {
      name: "Gallery Carousel",
      icon: "🎠",
      count: 10,
      href: "/cms/carousel",
      color: "indigo",
    },
    {
      name: "Schedule",
      icon: "📅",
      count: stats.totalEvents,
      href: "/cms/schedule",
      color: "orange",
    },
    {
      name: "Gallery",
      icon: "📸",
      count: stats.totalGalleryItems,
      href: "/cms/gallery",
      color: "green",
    },
    {
      name: "Users & Roles",
      icon: "🔐",
      count: 1,
      href: "/cms/users",
      color: "red",
    },
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">กำลังตรวจสอบ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Hearts2Hearts CMS
              </h1>
              <p className="text-sm text-gray-600">Content Management System</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ดูเว็บไซต์ →
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("cms_user");
                  router.push("/cms/login");
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ยินดีต้อนรับกลับมา! 👋
          </h2>
          <p className="text-gray-600">
            จัดการเนื้อหาและข้อมูลทั้งหมดของ Hearts2Hearts Haven
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">บทความทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalNews}
                </p>
              </div>
              <div className="text-4xl">📰</div>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <span className="text-yellow-600">{stats.drafts} ฉบับร่าง</span>
              <span className="text-blue-600">{stats.scheduled} คิวปล่อย</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">ยอดเข้าชมรวม</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="text-4xl">👁️</div>
            </div>
            <p className="mt-4 text-sm text-green-600">+12% จากเดือนที่แล้ว</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">เนื้อหาทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalNews +
                    stats.totalMusic +
                    stats.totalEvents +
                    stats.totalGalleryItems}
                </p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              ทุกโมดูล ({modules.length} โมดูล)
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-linear-to-br from-blue-500 to-purple-500 rounded-xl p-6 shadow-sm text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80 mb-1">สถานะระบบ</p>
                <p className="text-2xl font-bold">ทำงานปกติ</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
            <p className="mt-4 text-sm text-white/80">อัปเดตล่าสุด: วันนี้</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">การกระทำด่วน</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <Link key={action.title} href={action.href} className="group">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className={`bg-linear-to-br ${action.color} rounded-xl p-6 text-white text-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
                >
                  <div className="text-4xl mb-2">{action.icon}</div>
                  <p className="text-sm font-semibold">{action.title}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Modules Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">โมดูลทั้งหมด</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <Link key={module.name} href={module.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{module.icon}</div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">
                        {module.count}
                      </p>
                      {module.drafts && (
                        <p className="text-xs text-yellow-600">
                          {module.drafts} drafts
                        </p>
                      )}
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {module.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    จัดการและแก้ไขเนื้อหา →
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
