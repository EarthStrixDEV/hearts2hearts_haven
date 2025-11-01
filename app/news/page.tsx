"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { NewsArticle, NewsCategory } from "../types/news";

const categories: {
  value: NewsCategory | "all";
  label: string;
  emoji: string;
}[] = [
  { value: "all", label: "All News", emoji: "📰" },
  { value: "latest-news", label: "Latest", emoji: "🆕" },
  { value: "behind-the-scenes", label: "Behind the Scenes", emoji: "🎬" },
  { value: "fan-stories", label: "Fan Stories", emoji: "💕" },
  { value: "interviews", label: "Interviews", emoji: "🎤" },
  { value: "performances", label: "Performances", emoji: "💃" },
  { value: "announcements", label: "Announcements", emoji: "📢" },
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    NewsCategory | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      params.append("pageSize", "50"); // Get more articles for the main page

      const response = await fetch(`/api/news?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles);
      } else {
        console.error("Failed to load articles");
      }
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFeaturedArticles = async () => {
    try {
      const response = await fetch("/api/news?featured=true&pageSize=3");
      if (response.ok) {
        const data = await response.json();
        setFeaturedArticles(data.articles);
      } else {
        console.error("Failed to load featured articles");
      }
    } catch (error) {
      console.error("Error loading featured articles:", error);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    loadFeaturedArticles();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryColor = (category: NewsCategory) => {
    const colors: Record<NewsCategory, string> = {
      "latest-news": "bg-blue-100 text-blue-700",
      "behind-the-scenes": "bg-purple-100 text-purple-700",
      "fan-stories": "bg-pink-100 text-pink-700",
      interviews: "bg-green-100 text-green-700",
      performances: "bg-orange-100 text-orange-700",
      announcements: "bg-red-100 text-red-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-linear-to-r from-blue-100 to-purple-100 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto text-center relative z-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            H2H News & Stories
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            ข่าวสาร บทความ และเรื่องราวจาก Hearts2Hearts และแฟนคลับ S2U
          </p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาข่าว บทความ หรือหมวดหมู่..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-lg shadow-lg"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl">
                🔍
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 right-10 text-6xl opacity-20"
        >
          📰
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-20 left-10 text-5xl opacity-20"
        >
          💕
        </motion.div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold mb-8 gradient-text flex items-center gap-3"
            >
              <span>⭐</span> Featured Stories
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/news/${article.slug}`}>
                    <div className="card-pastel overflow-hidden group cursor-pointer h-full">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={article.coverImage}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          unoptimized
                        />
                        <div className="absolute top-4 right-4">
                          <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            ⭐ Featured
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                              article.category
                            )}`}
                          >
                            {
                              categories.find(
                                (c) => c.value === article.category
                              )?.emoji
                            }{" "}
                            {
                              categories.find(
                                (c) => c.value === article.category
                              )?.label
                            }
                          </span>
                          <span className="text-gray-500 text-sm">
                            {formatDate(article.publishedAt)}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>👁️ {article.views?.toLocaleString()}</span>
                          <span>❤️ {article.likes}</span>
                          <span>⏱️ {article.readTime} min read</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 px-4 bg-white/50 sticky top-16 z-40 backdrop-blur-sm border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <motion.button
                key={category.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.value)}
                className={`
                  px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all duration-300
                  ${
                    selectedCategory === category.value
                      ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-400"
                  }
                `}
              >
                <span className="mr-2">{category.emoji}</span>
                {category.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-pastel p-6 animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="text-8xl mb-4">😢</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No articles found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or category filter
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {articles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/news/${article.slug}`}>
                      <div className="card-pastel overflow-hidden group cursor-pointer h-full hover:shadow-2xl transition-shadow duration-300">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={article.coverImage}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            unoptimized
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                                article.category
                              )}`}
                            >
                              {
                                categories.find(
                                  (c) => c.value === article.category
                                )?.emoji
                              }{" "}
                              {
                                categories.find(
                                  (c) => c.value === article.category
                                )?.label
                              }
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          {article.titleKo && (
                            <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                              {article.titleKo}
                            </p>
                          )}
                          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{formatDate(article.publishedAt)}</span>
                            <span>⏱️ {article.readTime} min</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {article.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-linear-to-r from-purple-100 to-pink-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Share Your Story! 💕
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              มีเรื่องราวหรือประสบการณ์กับ H2H ที่อยากแชร์?
              ส่งเรื่องราวของคุณมาให้เราสิ!
            </p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-pastel"
              >
                Submit Your Story 📝
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
