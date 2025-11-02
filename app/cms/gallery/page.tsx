"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import DataTable, { Column } from "@/app/cms/_components/DataTable";
import { swalConfirm, swalError, toastError, toastSuccess } from "@/app/cms/_utils/swal";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  member: string | null;
  description: string;
  emoji: string;
  imageUrl: string;
  uploadDate: string;
  size: string;
}

export default function CMSGalleryPage() {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingImage, setEditingImage] = useState<GalleryItem | null>(null);
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
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const galleryData = await response.json();
        setItems(galleryData);
      } else {
        console.error('Failed to load gallery images');
        await toastError('ไม่สามารถโหลดข้อมูลแกลเลอรีได้');
      }
    } catch (error) {
      console.error('Error loading gallery images:', error);
      await toastError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (image: GalleryItem) => {
    setEditingImage(image);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editingImage) {
      try {
        const response = await fetch('/api/gallery', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingImage),
        });

        if (response.ok) {
          // Reload gallery data
          await loadItems();
          await toastSuccess("บันทึกข้อมูลรูปภาพสำเร็จ!");
          setShowModal(false);
          setEditingImage(null);
        } else {
          await swalError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
      } catch (error) {
        console.error('Error saving image:', error);
        await swalError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (await swalConfirm("คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพนี้?", "ลบ")) {
      try {
        const response = await fetch(`/api/gallery?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Reload gallery data
          await loadItems();
          await toastSuccess("ลบรูปภาพสำเร็จ!");
        } else {
          await swalError("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        await swalError("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      // Delete multiple gallery items
      await Promise.all(
        ids.map(id => 
          fetch(`/api/gallery?id=${id}`, { method: "DELETE" })
        )
      );
      await loadItems();
    } catch (error) {
      console.error("Error bulk deleting gallery items:", error);
      throw error;
    }
  };

  const handleAdd = () => {
    setEditingImage({
      id: Date.now().toString(),
      title: "",
      category: "Teasers",
      member: null,
      description: "",
      emoji: "📸",
      imageUrl: "",
      uploadDate: new Date().toISOString().split('T')[0],
      size: "0 MB",
    });
    setShowModal(true);
  };

  const columns: Column<GalleryItem>[] = [
    {
      key: "imageUrl",
      label: "รูปภาพ",
      width: "80px",
      render: (_, item) => (
        <Image
          src={item.imageUrl}
          alt={item.title}
          width={60}
          height={45}
          className="w-15 h-11 object-cover rounded-lg shadow-sm"
          unoptimized
        />
      ),
    },
    {
      key: "title",
      label: "ชื่อรูปภาพ",
      sortable: true,
      render: (_, item) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{item.emoji}</span>
            <p className="font-semibold text-gray-900">{item.title}</p>
          </div>
          <p className="text-sm text-gray-500">{item.description}</p>
        </div>
      ),
    },
    {
      key: "category",
      label: "หมวดหมู่",
      sortable: true,
      render: (category) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
          {category}
        </span>
      ),
    },
    {
      key: "member",
      label: "สมาชิก",
      sortable: true,
      render: (member) => (
        member ? (
          <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-semibold">
            {member}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        )
      ),
    },
    {
      key: "uploadDate",
      label: "วันที่อัปโหลด",
      sortable: true,
      render: (date) => (
        <span className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString("th-TH")}
        </span>
      ),
    },
    {
      key: "size",
      label: "ขนาดไฟล์",
      sortable: true,
      render: (size) => (
        <span className="text-sm text-gray-600">{size}</span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/cms"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-3 font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                กลับไป Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                  📸
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    จัดการแกลเลอรี
                  </h1>
                  <p className="text-gray-600 text-sm">อัปโหลดและจัดการรูปภาพทั้งหมด</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => {
                setEditingImage({
                  id: Date.now().toString(),
                  title: "",
                  category: "Teasers",
                  member: null,
                  description: "",
                  emoji: "📸",
                  imageUrl: "",
                  uploadDate: new Date().toISOString().split('T')[0],
                  size: "0 MB",
                });
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              อัปโหลดรูปภาพ
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DataTable
          data={items}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          onAdd={handleAdd}
          loading={isLoading}
          title="จัดการแกลเลอรี"
          icon="📸"
          addButtonText="อัปโหลดรูปภาพ"
          emptyMessage="ยังไม่มีรูปภาพ"
          emptyIcon="📸"
          searchPlaceholder="ค้นหารูปภาพ..."
          getItemId={(item) => item.id}
          searchFields={["title", "category", "member", "description"]}
        />
      </div>

      {/* Edit Modal */}
      {showModal && editingImage && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white/95 backdrop-blur-md rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-8 py-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-xl">
                    📸
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      {editingImage.title ? "แก้ไขข้อมูลรูปภาพ" : "เพิ่มรูปภาพใหม่"}
                    </h2>
                    <p className="text-sm text-gray-600">จัดการข้อมูลรูปภาพในแกลเลอรี</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-8">

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    ชื่อรูปภาพ
                  </label>
                  <input
                    type="text"
                    value={editingImage.title}
                    onChange={(e) =>
                      setEditingImage({
                        ...editingImage,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all bg-gray-50/50"
                    placeholder="ใส่ชื่อรูปภาพ..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    หมวดหมู่
                  </label>
                  <select
                    value={editingImage.category}
                    onChange={(e) =>
                      setEditingImage({
                        ...editingImage,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all bg-gray-50/50"
                  >
                    <option value="Predebut">Predebut</option>
                    <option value="Teasers">Teasers</option>
                    <option value="Music Shows">Music Shows</option>
                    <option value="Behind the Scenes">Behind the Scenes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    สมาชิก (ถ้ามี)
                  </label>
                  <select
                    value={editingImage.member || ""}
                    onChange={(e) =>
                      setEditingImage({
                        ...editingImage,
                        member: e.target.value || null,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">ไม่ระบุ</option>
                    <option value="Jiwoo">Jiwoo</option>
                    <option value="Carmen">Carmen</option>
                    <option value="Yuha">Yuha</option>
                    <option value="Stella">Stella</option>
                    <option value="Juun">Juun</option>
                    <option value="A-na">A-na</option>
                    <option value="Ian">Ian</option>
                    <option value="Ye-on">Ye-on</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    อีโมจิ
                  </label>
                  <input
                    type="text"
                    value={editingImage.emoji}
                    onChange={(e) =>
                      setEditingImage({
                        ...editingImage,
                        emoji: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="📸"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL รูปภาพ
                </label>
                <input
                  type="text"
                  value={editingImage.imageUrl}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      imageUrl: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    วันที่อัปโหลด
                  </label>
                  <input
                    type="date"
                    value={editingImage.uploadDate}
                    onChange={(e) =>
                      setEditingImage({
                        ...editingImage,
                        uploadDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ขนาดไฟล์
                  </label>
                  <input
                    type="text"
                    value={editingImage.size}
                    onChange={(e) =>
                      setEditingImage({
                        ...editingImage,
                        size: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="2.3 MB"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  คำอธิบาย
                </label>
                <textarea
                  value={editingImage.description}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200/50">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-all duration-300 font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                บันทึกข้อมูล
              </button>
            </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
