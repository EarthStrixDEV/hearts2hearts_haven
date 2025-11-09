"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { swalSuccess, swalError } from "@/app/cms/_utils/swal";

export default function CMSNewsEditor() {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [imageInput, setImageInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("cms_user");
    if (!user) {
      router.push("/cms/login");
      return;
    }

    const userData = JSON.parse(user);
    setFormData((prev) => ({ ...prev, author: userData.name }));
  }, [router]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 60);
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, formData.slug]);

  const handleSave = async (status: typeof formData.status) => {
    if (!formData.title || !formData.slug || !formData.excerpt || !formData.content) {
      await swalError("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      const articleId = Date.now().toString(); // Generate unique ID
      
      const articleData = {
        id: articleId,
        title: formData.title,
        titleKo: formData.titleKo || undefined,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        coverImage: formData.coverImage,
        images: formData.images.length > 0 ? formData.images : undefined,
        author: {
          name: formData.author,
          role: "Admin User"
        },
        publishedAt: status === "published" ? now : formData.scheduledFor || now,
        featured: false,
        views: 0,
        likes: 0,
        readTime: Math.max(1, Math.ceil(formData.content.length / 200)), // Estimate read time
        status: status,
        createdAt: now,
        updatedAt: now,
        ...(formData.scheduledFor && { scheduledFor: formData.scheduledFor })
      };

      const response = await fetch("/api/news", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        await swalSuccess(
          `บทความถูก${
            status === "draft"
              ? "บันทึกเป็นฉบับร่าง"
              : status === "published"
              ? "เผยแพร่"
              : "ส่งตรวจสอบ"
          }แล้ว!`
        );
        router.push("/cms/news");
      } else {
        await swalError("ไม่สามารถบันทึกบทความได้");
      }
    } catch (error) {
      console.error("Error saving article:", error);
      await swalError("เกิดข้อผิดพลาดในการบันทึกบทความ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleAddImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput("");
    }
  };

  const handleRemoveImage = (image: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== image),
    }));
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', 'news');
      
      const response = await fetch('/api/media', {
        method: 'POST',
        body: formDataUpload,
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      await swalError('ไม่สามารถอัพโหลดรูปภาพได้');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await handleImageUpload(file);
      if (url) {
        setFormData((prev) => ({ ...prev, coverImage: url }));
      }
    }
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await handleImageUpload(file);
      if (url) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, url],
        }));
      }
    }
  };

  const categories = [
    { value: "latest-news", label: "Latest News", emoji: "🆕" },
    { value: "behind-the-scenes", label: "Behind the Scenes", emoji: "🎬" },
    { value: "fan-stories", label: "Fan Stories", emoji: "💕" },
    { value: "interviews", label: "Interviews", emoji: "🎤" },
    { value: "performances", label: "Performances", emoji: "💃" },
    { value: "announcements", label: "Announcements", emoji: "📢" },
  ];

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
                ← กลับไปรายการบทความ
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                ✏️ เขียนข่าว/บทความใหม่
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSave("draft")}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold disabled:opacity-50"
              >
                💾 บันทึกฉบับร่าง
              </button>
              <button
                onClick={() => handleSave("published")}
                disabled={isSaving || !formData.title || !formData.content}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:opacity-50"
              >
                ✅ เผยแพร่ทันที
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                หัวข้อข่าว (ภาษาอังกฤษ) *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-semibold"
                placeholder="Enter article title..."
                required
              />
            </motion.div>

            {/* Korean Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                หัวข้อข่าว (ภาษาเกาหลี)
              </label>
              <input
                type="text"
                value={formData.titleKo}
                onChange={(e) =>
                  setFormData({ ...formData, titleKo: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="한국어 제목..."
              />
            </motion.div>

            {/* Slug */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono text-sm"
                placeholder="article-url-slug"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                URL: /news/{formData.slug || "article-slug"}
              </p>
            </motion.div>

            {/* Excerpt */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                สรุปข่าว / Excerpt *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                placeholder="สรุปสั้นๆ ของบทความ (แสดงในรายการข่าว)"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                {formData.excerpt.length}/200 ตัวอักษร (แนะนำ)
              </p>
            </motion.div>

            {/* Content Editor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                เนื้อหาบทความ *
              </label>
              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
                  onClick={() => {
                    const textarea = document.getElementById(
                      "content"
                    ) as HTMLTextAreaElement;
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = formData.content;
                    setFormData({
                      ...formData,
                      content:
                        text.substring(0, start) +
                        "<strong></strong>" +
                        text.substring(end),
                    });
                  }}
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
                  onClick={() => {
                    const textarea = document.getElementById(
                      "content"
                    ) as HTMLTextAreaElement;
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = formData.content;
                    setFormData({
                      ...formData,
                      content:
                        text.substring(0, start) +
                        "<em></em>" +
                        text.substring(end),
                    });
                  }}
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      content: formData.content + '\n<img src="" alt="" />\n',
                    });
                  }}
                >
                  🖼️ รูปภาพ
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      content: formData.content + "\n<h2></h2>\n",
                    });
                  }}
                >
                  H2 หัวข้อย่อย
                </button>
              </div>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
                placeholder="เขียนเนื้อหาที่นี่ (รองรับ HTML)&#10;&#10;<p>ข้อความธรรมดา</p>&#10;<h2>หัวข้อย่อย</h2>&#10;<img src='url' alt='description' />"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                รองรับ HTML tags: &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;,
                &lt;strong&gt;, &lt;em&gt;, &lt;img&gt;, &lt;ul&gt;, &lt;li&gt;
              </p>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                สถานะบทความ
              </h3>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as typeof formData.status,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none mb-4"
              >
                <option value="draft">✏️ ฉบับร่าง (Draft)</option>
                <option value="review">👀 รอตรวจสอบ (Review)</option>
                <option value="scheduled">⏰ กำหนดเวลา (Scheduled)</option>
                <option value="published">✅ เผยแพร่ (Published)</option>
              </select>

              {formData.status === "scheduled" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    กำหนดเวลาเผยแพร่
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledFor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scheduledFor: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}
            </motion.div>

            {/* Category */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">หมวดหมู่</h3>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                แท็ก (Tags)
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                  placeholder="เพิ่มแท็ก..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Cover Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                รูปปก (Cover Image) *
              </h3>
              
              {/* Upload Button */}
              <div className="mb-4">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <div className="cursor-pointer bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:bg-blue-100 transition-colors">
                    {isUploading ? (
                      <div className="text-blue-600">
                        <div className="text-2xl mb-2">⏳</div>
                        <p>กำลังอัพโหลด...</p>
                      </div>
                    ) : (
                      <div className="text-blue-600">
                        <div className="text-2xl mb-2">📷</div>
                        <p>คลิกเพื่ออัพโหลดรูปภาพ</p>
                        <p className="text-sm text-gray-500">หรือลากไฟล์มาวางที่นี่</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
              
              {/* URL Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หรือใส่ URL รูปภาพ
                </label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData({ ...formData, coverImage: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              {/* Preview */}
              {formData.coverImage && (
                <div className="mb-4">
                  <img
                    src={formData.coverImage}
                    alt="Cover Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <p className="text-xs text-gray-500">
                แนะนำขนาด: 1200x630px สำหรับ Social Media
              </p>
            </motion.div>

            {/* Additional Images */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                รูปภาพเพิ่มเติม (Optional)
              </h3>
              
              {/* Upload Button */}
              <div className="mb-4">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAdditionalImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <div className="cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors">
                    {isUploading ? (
                      <div className="text-gray-600">
                        <span>⏳ กำลังอัพโหลด...</span>
                      </div>
                    ) : (
                      <div className="text-gray-600">
                        <span>📷 เพิ่มรูปภาพ</span>
                      </div>
                    )}
                  </div>
                </label>
              </div>
              
              {/* URL Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddImage()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                  placeholder="หรือใส่ URL รูปภาพ..."
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                >
                  เพิ่ม
                </button>
              </div>
              
              {/* Image Gallery */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Additional ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Author */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">ผู้เขียน</h3>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                placeholder="ชื่อผู้เขียน"
              />
            </motion.div>

            {/* SEO Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                🔍 SEO & Meta Tags
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, metaTitle: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                    placeholder="เว้นว่างไว้จะใช้ Title หลัก"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metaDescription: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm resize-none"
                    placeholder="เว้นว่างไว้จะใช้ Excerpt"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  👁️ ตัวอย่าง
                </h3>
                
                {/* Article Preview */}
                <div className="space-y-4">
                  {/* Cover Image Preview */}
                  {formData.coverImage && (
                    <div className="relative">
                      <img
                        src={formData.coverImage}
                        alt="Cover Preview"
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  {formData.category && (
                    <div>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        {categories.find(c => c.value === formData.category)?.emoji} {categories.find(c => c.value === formData.category)?.label}
                      </span>
                    </div>
                  )}
                  
                  {/* Title Preview */}
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg leading-tight">
                      {formData.title || "หัวข้อบทความ..."}
                    </h4>
                    {formData.titleKo && (
                      <p className="text-sm text-gray-500 mt-1">{formData.titleKo}</p>
                    )}
                  </div>
                  
                  {/* Excerpt Preview */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {formData.excerpt || "สรุปเนื้อหาบทความ..."}
                  </p>
                  
                  {/* Tags Preview */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                      {formData.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{formData.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                  
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                    <span>✍️ {formData.author}</span>
                    <span>⏱️ ~{Math.max(1, Math.ceil(formData.content.length / 200))} min</span>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">📊 สถิติ</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ความยาวเนื้อหา:</span>
                      <span className="font-medium">{formData.content.length} ตัวอักษร</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">เวลาอ่าน (ประมาณ):</span>
                      <span className="font-medium">{Math.max(1, Math.ceil(formData.content.length / 200))} นาที</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">จำนวนแท็ก:</span>
                      <span className="font-medium">{formData.tags.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">รูปภาพเพิ่มเติม:</span>
                      <span className="font-medium">{formData.images.length}</span>
                    </div>
                  </div>
                </div>
                
                {/* SEO Preview */}
                {(formData.title || formData.excerpt) && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                      🔍 Google Preview
                    </h4>
                    <div className="space-y-1">
                      <div className="text-blue-600 text-sm font-medium hover:underline cursor-pointer">
                        {formData.metaTitle || formData.title || "หัวข้อบทความ"}
                      </div>
                      <div className="text-green-600 text-xs">
                        hearts2hearts.com › news › {formData.slug || "article-slug"}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {formData.metaDescription || formData.excerpt || "สรุปเนื้อหาบทความ..."}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>📝 {formData.content.length} ตัวอักษร</span>
                <span>
                  ⏱️ ~{Math.ceil(formData.content.length / 1000)} นาทีอ่าน
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/cms/news"
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  ยกเลิก
                </Link>
                <button
                  onClick={() => handleSave("draft")}
                  disabled={isSaving}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold disabled:opacity-50"
                >
                  💾 บันทึกฉบับร่าง
                </button>
                <button
                  onClick={() => handleSave("published")}
                  disabled={isSaving || !formData.title || !formData.content}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:opacity-50"
                >
                  ✅ เผยแพร่
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for fixed bottom bar */}
        <div className="h-24"></div>
      </div>
    </div>
  );
}
