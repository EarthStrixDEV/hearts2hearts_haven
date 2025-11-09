"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { NewsArticle } from "../../types/news";

export default function NewsArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      setIsLoading(true);
      try {
        // Fetch article from API by slug
        const response = await fetch(`/api/news/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setArticle(data.article);
          setLikes(data.article.likes || 0);
          setRelatedArticles(data.related || []);
        } else {
          console.error('Failed to load article');
          setArticle(null);
        }
      } catch (error) {
        console.error('Error loading article:', error);
        setArticle(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadArticle();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-2xl mb-8"></div>
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-8"></div>
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-8xl mb-4">😢</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Article Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The article you're looking for doesn't exist.
            </p>
            <Link href="/news">
              <button className="btn-pastel">Back to News</button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-[60vh] w-full"
      >
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Article Header */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-gray-800">
                  {article.category
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
                {article.featured && (
                  <span className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ Featured
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                {article.title}
              </h1>
              {article.titleKo && (
                <p className="text-xl text-white/90 mb-4">{article.titleKo}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✍️</span>
                  <span className="font-semibold">{article.author.name}</span>
                  <span className="text-sm opacity-75">
                    • {article.author.role}
                  </span>
                </div>
                <span>•</span>
                <span>📅 {formatDate(article.publishedAt)}</span>
                <span>•</span>
                <span>⏱️ {article.readTime} min read</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Article Content */}
      <article className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Excerpt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8"
          >
            <p className="text-lg text-gray-700 italic leading-relaxed">
              {article.excerpt}
            </p>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </motion.div>

          {/* Article Body */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
            style={{
              fontSize: "1.125rem",
              lineHeight: "1.8",
              color: "#374151",
            }}
          />

          {/* Additional Images */}
          {article.images && article.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 my-12"
            >
              {article.images.map((img, index) => (
                <div
                  key={index}
                  className="relative h-64 rounded-xl overflow-hidden shadow-lg"
                >
                  <Image
                    src={img}
                    alt={`${article.title} - Image ${index + 1}`}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                </div>
              ))}
            </motion.div>
          )}

          {/* Engagement Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="border-y border-gray-200 py-8 my-12"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-colors ${
                    hasLiked
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-pink-100"
                  }`}
                >
                  <span className="text-2xl">{hasLiked ? "❤️" : "🤍"}</span>
                  <span>{likes}</span>
                </motion.button>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-2xl">👁️</span>
                  <span className="font-semibold">
                    {article.views?.toLocaleString()}
                  </span>
                  <span className="text-sm">views</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors"
              >
                <span className="text-xl">🔗</span>
                <span>Share</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Author Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-linear-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {article.author.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {article.author.name}
                </h3>
                <p className="text-gray-600">{article.author.role}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold gradient-text mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related, index) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/news/${related.slug}`}>
                    <div className="card-pastel overflow-hidden group cursor-pointer h-full hover:shadow-xl transition-shadow">
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={related.coverImage}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          unoptimized
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {related.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to News Button */}
      <div className="text-center py-12">
        <Link href="/news">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-pastel"
          >
            ← Back to All News
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
