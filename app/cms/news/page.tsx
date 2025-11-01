"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

import { NewsArticle } from "@/app/types/news";

interface CMSNewsArticle extends NewsArticle {
  status: "draft" | "review" | "scheduled" | "published";
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CMSNewsPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<CMSNewsArticle[]>([]);
  const [filter, setFilter] = useState<
    "all" | "draft" | "published" | "scheduled"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem("cms_user");
    if (!user) {
      router.push("/cms/login");
      return;
    }

    loadArticles();
  }, [router]);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/news?pageSize=100'); // Get all articles for CMS
      if (response.ok) {
        const data = await response.json();
        // Convert NewsArticle to CMSNewsArticle by adding required CMS fields
        const cmsArticles: CMSNewsArticle[] = data.articles.map((article: NewsArticle) => ({
          ...article,
          status: (article as any).status || "published", // Default to published if not set
          createdAt: (article as any).createdAt || article.publishedAt,
          updatedAt: (article as any).updatedAt || article.publishedAt,
          scheduledFor: (article as any).scheduledFor,
          author: typeof article.author === 'string' ? article.author : article.author.name,
        }));
        setArticles(cmsArticles);
      } else {
        console.error('Failed to load articles');
        alert('ไม่สามารถโหลดข้อมูลบทความได้');
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesFilter = filter === "all" || article.status === filter;
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: "bg-yellow-100 text-yellow-800",
      review: "bg-blue-100 text-blue-800",
      scheduled: "bg-purple-100 text-purple-800",
      published: "bg-green-100 text-green-800",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      draft: "✏️",
      review: "👀",
      scheduled: "⏰",
      published: "✅",
    };
    return icons[status as keyof typeof icons] || "📄";
  };

  const handleDelete = async (id: string) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้?")) {
      try {
        const response = await fetch(`/api/news?id=${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setArticles(articles.filter((a) => a.id !== id));
          alert("ลบบทความสำเร็จ!");
        } else {
          alert("ไม่สามารถลบบทความได้");
        }
      } catch (error) {
        console.error('Error deleting article:', error);
        alert("เกิดข้อผิดพลาดในการลบบทความ");
      }
    }
  };

  const handleSave = async (article: CMSNewsArticle) => {
    try {
      // Convert CMSNewsArticle back to NewsArticle format for API
      const newsArticle: NewsArticle = {
        ...article,
        author: {
          name: typeof article.author === 'string' ? article.author : article.author,
          role: "Admin User"
        }
      };

      const response = await fetch('/api/news', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsArticle),
      });

      if (response.ok) {
        await loadArticles(); // Reload articles
        alert("บันทึกบทความสำเร็จ!");
      } else {
        alert("ไม่สามารถบันทึกบทความได้");
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert("เกิดข้อผิดพลาดในการบันทึกบทความ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
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
                📰 จัดการข่าวและบทความ
              </h1>
            </div>
            <Link
              href="/cms/news/new"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-lg"
            >
              + เขียนข่าวใหม่
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ทั้งหมด</p>
                <p className="text-2xl font-bold">{articles.length}</p>
              </div>
              <div className="text-3xl">📰</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ฉบับร่าง</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {articles.filter((a) => a.status === "draft").length}
                </p>
              </div>
              <div className="text-3xl">✏️</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">คิวปล่อย</p>
                <p className="text-2xl font-bold text-purple-600">
                  {articles.filter((a) => a.status === "scheduled").length}
                </p>
              </div>
              <div className="text-3xl">⏰</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">เผยแพร่แล้ว</p>
                <p className="text-2xl font-bold text-green-600">
                  {articles.filter((a) => a.status === "published").length}
                </p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="ค้นหาบทความ, แท็ก..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <div className="flex gap-2">
              {["all", "draft", "scheduled", "published"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filter === status
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status === "all"
                    ? "ทั้งหมด"
                    : status === "draft"
                    ? "ฉบับร่าง"
                    : status === "scheduled"
                    ? "คิวปล่อย"
                    : "เผยแพร่"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ไม่พบบทความ
            </h3>
            <p className="text-gray-600 mb-6">
              ลองเปลี่ยนตัวกรอง หรือสร้างบทความใหม่
            </p>
            <Link
              href="/cms/news/new"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              + สร้างบทความแรก
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="w-full md:w-48 h-48 relative shrink-0">
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                              article.status
                            )}`}
                          >
                            {getStatusIcon(article.status)} {article.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            {article.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {article.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>✍️ {typeof article.author === 'string' ? article.author : article.author.name}</span>
                          <span>
                            📅{" "}
                            {new Date(article.createdAt).toLocaleDateString(
                              "th-TH"
                            )}
                          </span>
                          {article.views && <span>👁️ {article.views}</span>}
                          {article.likes && <span>❤️ {article.likes}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                      <Link
                        href={`/cms/news/edit/${article.id}`}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                      >
                        ✏️ แก้ไข
                      </Link>
                      <Link
                        href={`/news/${article.slug}`}
                        target="_blank"
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                      >
                        👁️ ดูหน้าเว็บ
                      </Link>
                      <button
                        onClick={() => alert("คัดลอก URL แล้ว!")}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                      >
                        🔗 คัดลอกลิงก์
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="ml-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                      >
                        🗑️ ลบ
                      </button>
                    </div>
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
