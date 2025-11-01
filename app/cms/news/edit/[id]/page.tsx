"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { NewsArticle } from "@/app/types/news";

interface CMSNewsArticle extends NewsArticle {
  status: "draft" | "review" | "scheduled" | "published";
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CMSNewsEditor() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    titleKo: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "latest-news",
    tags: [] as string[],
    coverImage: "",
    images: [] as string[],
    author: "Admin User",
    status: "draft" as "draft" | "review" | "scheduled" | "published",
    scheduledFor: "",
    publishedAt: "",
    featured: false,
    views: 0,
    likes: 0,
    readTime: 3,
    createdAt: "",
    updatedAt: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("cms_user");
    if (!user) {
      router.push("/cms/login");
      return;
    }

    loadArticle();
  }, [router, articleId]);

  const loadArticle = async () => {
    if (!articleId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/news?pageSize=100`);
      if (response.ok) {
        const data = await response.json();
        const article = data.articles.find((a: NewsArticle) => a.id === articleId);
        
        if (article) {
          setFormData({
            id: article.id,
            title: article.title,
            titleKo: article.titleKo || "",
            slug: article.slug,
            excerpt: article.excerpt,
            content: article.content,
            category: article.category,
            tags: article.tags,
            coverImage: article.coverImage,
            images: article.images || [],
            author: typeof article.author === 'string' ? article.author : article.author.name,
            status: (article as any).status || "published",
            scheduledFor: (article as any).scheduledFor || "",
            publishedAt: article.publishedAt,
            featured: article.featured,
            views: article.views || 0,
            likes: article.likes || 0,
            readTime: article.readTime || 3,
            createdAt: (article as any).createdAt || article.publishedAt,
            updatedAt: (article as any).updatedAt || article.publishedAt,
          });
        } else {
          alert("ไม่พบบทความที่ต้องการแก้ไข");
          router.push("/cms/news");
        }
      } else {
        alert("ไม่สามารถโหลดข้อมูลบทความได้");
        router.push("/cms/news");
      }
    } catch (error) {
      console.error("Error loading article:", error);
      alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      router.push("/cms/news");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput("");
    }
  };

  const removeImage = (imageToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageToRemove),
    }));
  };

  const handleSave = async (status?: "draft" | "review" | "scheduled" | "published") => {
    if (!formData.title || !formData.slug || !formData.excerpt || !formData.content) {
      alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      const articleData: NewsArticle = {
        id: formData.id,
        title: formData.title,
        titleKo: formData.titleKo || undefined,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category as any,
        tags: formData.tags,
        coverImage: formData.coverImage,
        images: formData.images.length > 0 ? formData.images : undefined,
        author: {
          name: formData.author,
          role: "Admin User"
        },
        publishedAt: formData.publishedAt || now,
        featured: formData.featured,
        views: formData.views,
        likes: formData.likes,
        readTime: formData.readTime,
        // Add CMS-specific fields
        ...(status && { status }),
        ...(formData.scheduledFor && { scheduledFor: formData.scheduledFor }),
        createdAt: formData.createdAt,
        updatedAt: now,
      };

      const response = await fetch("/api/news", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        alert("บันทึกบทความสำเร็จ!");
        router.push("/cms/news");
      } else {
        alert("ไม่สามารถบันทึกบทความได้");
      }
    } catch (error) {
      console.error("Error saving article:", error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">กำลังโหลดข้อมูลบทความ...</p>
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
              <Link
                href="/cms/news"
                className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block"
              >
                ← กลับไปหน้าจัดการข่าว
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                ✏️ แก้ไขบทความ
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleSave("draft")}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                💾 บันทึกร่าง
              </button>
              <button
                onClick={() => handleSave("published")}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 font-semibold"
              >
                {isSaving ? "กำลังบันทึก..." : "🚀 เผยแพร่"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📝 ข้อมูลพื้นฐาน
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    หัวข้อบทความ *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                    placeholder="หัวข้อบทความ..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    หัวข้อภาษาเกาหลี
                  </label>
                  <input
                    type="text"
                    name="titleKo"
                    value={formData.titleKo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="제목..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono text-sm"
                    placeholder="article-slug-here"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL: /news/{formData.slug}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    สรุปบทความ *
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                    placeholder="สรุปสั้นๆ ของบทความ..."
                  />
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📄 เนื้อหาบทความ
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เนื้อหา (HTML) *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono text-sm resize-none"
                  placeholder="<p>เนื้อหาบทความ...</p>"
                />
                <p className="text-xs text-gray-500 mt-1">
                  รองรับ HTML tags: h2, h3, p, ul, li, strong, em, blockquote, a
                </p>
              </div>
            </motion.div>

            {/* Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                🖼️ รูปภาพ
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    รูปปก *
                  </label>
                  <input
                    type="url"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.coverImage && (
                    <div className="mt-2">
                      <img
                        src={formData.coverImage}
                        alt="Cover preview"
                        className="w-32 h-20 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    รูปภาพเพิ่มเติม
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={addImage}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      เพิ่ม
                    </button>
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Additional ${index + 1}`}
                              className="w-20 h-16 object-cover rounded border"
                            />
                            <button
                              onClick={() => removeImage(image)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                🚀 การเผยแพร่
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    สถานะ
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="draft">ฉบับร่าง</option>
                    <option value="review">รอตรวจสอบ</option>
                    <option value="scheduled">กำหนดเวลา</option>
                    <option value="published">เผยแพร่แล้ว</option>
                  </select>
                </div>

                {formData.status === "scheduled" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      กำหนดเวลาเผยแพร่
                    </label>
                    <input
                      type="datetime-local"
                      name="scheduledFor"
                      value={formData.scheduledFor}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    วันที่เผยแพร่
                  </label>
                  <input
                    type="datetime-local"
                    name="publishedAt"
                    value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    บทความเด่น (Featured)
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Category & Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                🏷️ หมวดหมู่และแท็ก
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    หมวดหมู่
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="latest-news">ข่าวล่าสุด</option>
                    <option value="behind-the-scenes">เบื้องหลัง</option>
                    <option value="fan-stories">เรื่องราวแฟน</option>
                    <option value="interviews">สัมภาษณ์</option>
                    <option value="performances">การแสดง</option>
                    <option value="announcements">ประกาศ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    แท็ก
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="เพิ่มแท็ก..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      เพิ่ม
                    </button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                          >
                            #{tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📊 สถิติ
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    จำนวนวิว
                  </label>
                  <input
                    type="number"
                    name="views"
                    value={formData.views}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    จำนวนไลค์
                  </label>
                  <input
                    type="number"
                    name="likes"
                    value={formData.likes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    เวลาอ่าน (นาที)
                  </label>
                  <input
                    type="number"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ผู้เขียน
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
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
