"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { swalSuccess } from "@/app/cms/_utils/swal";

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
    author: "Admin User",
    status: "draft" as "draft" | "review" | "scheduled" | "published",
    scheduledFor: "",
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = (status: typeof formData.status) => {
    setIsSaving(true);
    setFormData((prev) => ({ ...prev, status }));

    // Simulate API call
    setTimeout(async () => {
      await swalSuccess(
        `บทความถูก${
          status === "draft"
            ? "บันทึกเป็นฉบับร่าง"
            : status === "published"
            ? "เผยแพร่"
            : "ส่งตรวจสอบ"
        }แล้ว!`
      );
      setIsSaving(false);
      router.push("/cms/news");
    }, 1000);
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
                รูปปก (Cover Image)
              </h3>
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm mb-3"
                placeholder="URL รูปภาพ"
              />
              {formData.coverImage && (
                <img
                  src={formData.coverImage}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              <p className="text-xs text-gray-500 mt-2">
                แนะนำขนาด: 1200x630px (OG Image)
              </p>
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
