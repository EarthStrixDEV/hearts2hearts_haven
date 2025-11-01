"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

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

export default function CMSMusicPage() {
  const router = useRouter();
  const [items, setItems] = useState<MusicVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<MusicVideo | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("cms_user");
    if (!user) {
      router.push("/cms/login");
      return;
    }
    loadItems();
  }, [router]);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/music');
      if (response.ok) {
        const musicData = await response.json();
        setItems(musicData);
      } else {
        console.error('Failed to load music videos');
        alert('ไม่สามารถโหลดข้อมูลเพลงและวิดีโอได้');
      }
    } catch (error) {
      console.error('Error loading music videos:', error);
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (video: MusicVideo) => {
    setEditingVideo(video);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editingVideo) {
      try {
        const response = await fetch('/api/music', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingVideo),
        });

        if (response.ok) {
          // Reload music data
          await loadItems();
          alert("บันทึกข้อมูลวิดีโอสำเร็จ!");
          setShowModal(false);
          setEditingVideo(null);
        } else {
          alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
      } catch (error) {
        console.error('Error saving video:', error);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบวิดีโอนี้?")) {
      try {
        const response = await fetch(`/api/music?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Reload music data
          await loadItems();
          alert("ลบวิดีโอสำเร็จ!");
        } else {
          alert("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      } catch (error) {
        console.error('Error deleting video:', error);
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    }
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
                🎵 จัดการเพลงและวิดีโอ
              </h1>
            </div>
            <Link
              href="/cms/music/new"
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              เพิ่มวิดีโอใหม่
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{item.artist}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <span>👁️ {item.views}</span>
                    <span>
                      📅{" "}
                      {new Date(item.releaseDate).toLocaleDateString("th-TH")}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.featured 
                        ? "bg-yellow-100 text-yellow-800" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {item.featured ? "⭐ Featured" : "Regular"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold"
                    >
                      ✏️ แก้ไข
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && editingVideo && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingVideo.title ? "แก้ไขข้อมูลวิดีโอ" : "เพิ่มวิดีโอใหม่"}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ชื่อเพลง/วิดีโอ
                  </label>
                  <input
                    type="text"
                    value={editingVideo.title}
                    onChange={(e) =>
                      setEditingVideo({
                        ...editingVideo,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ศิลปิน
                  </label>
                  <input
                    type="text"
                    value={editingVideo.artist}
                    onChange={(e) =>
                      setEditingVideo({
                        ...editingVideo,
                        artist: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ประเภท
                  </label>
                  <select
                    value={editingVideo.type}
                    onChange={(e) =>
                      setEditingVideo({
                        ...editingVideo,
                        type: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Music Video">Music Video</option>
                    <option value="Performance">Performance</option>
                    <option value="Dance Practice">Dance Practice</option>
                    <option value="Behind the Scenes">Behind the Scenes</option>
                    <option value="Showcase">Showcase</option>
                    <option value="Trailer">Trailer</option>
                    <option value="Practice">Practice</option>
                    <option value="Variety Show">Variety Show</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    วันที่เผยแพร่
                  </label>
                  <input
                    type="date"
                    value={editingVideo.releaseDate}
                    onChange={(e) =>
                      setEditingVideo({
                        ...editingVideo,
                        releaseDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    YouTube ID
                  </label>
                  <input
                    type="text"
                    value={editingVideo.youtubeId}
                    onChange={(e) =>
                      setEditingVideo({
                        ...editingVideo,
                        youtubeId: e.target.value,
                        thumbnail: `https://img.youtube.com/vi/${e.target.value}/maxresdefault.jpg`,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="dQw4w9WgXcQ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    จำนวนวิว
                  </label>
                  <input
                    type="text"
                    value={editingVideo.views}
                    onChange={(e) =>
                      setEditingVideo({
                        ...editingVideo,
                        views: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="1M+"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    อีโมจิ
                  </label>
                  <input
                    type="text"
                    value={editingVideo.emoji}
                    onChange={(e) =>
                      setEditingVideo({
                        ...editingVideo,
                        emoji: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="🎵"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Featured
                  </label>
                  <select
                    value={editingVideo.featured ? "true" : "false"}
                    onChange={(e) =>
                      setEditingVideo({
                        ...editingVideo,
                        featured: e.target.value === "true",
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="false">Regular</option>
                    <option value="true">Featured</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  คำอธิบาย
                </label>
                <textarea
                  value={editingVideo.description}
                  onChange={(e) =>
                    setEditingVideo({
                      ...editingVideo,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                💾 บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
