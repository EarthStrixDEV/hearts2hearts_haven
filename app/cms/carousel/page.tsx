"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DataTable, { Column } from "@/app/cms/_components/DataTable";
import { swalConfirm, swalError, toastSuccess } from "@/app/cms/_utils/swal";

interface CarouselImage {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CMSCarouselPage() {
  const router = useRouter();
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingImage, setEditingImage] = useState<CarouselImage | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("cms_user");
    if (!user) {
      router.push("/cms/login");
      return;
    }
    loadImages();
  }, [router]);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/carousel");
      if (response.ok) {
        const carouselData = await response.json();
        setImages(carouselData);
      } else {
        console.error("Failed to load carousel images");
        await swalError("ไม่สามารถโหลดข้อมูลรูปภาพได้");
      }
    } catch (error) {
      console.error("Error loading carousel images:", error);
      await swalError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (image: CarouselImage) => {
    setEditingImage(image);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingImage({
      id: Date.now().toString(),
      title: "",
      imageUrl: "",
      description: "",
      category: "Performance",
      order: images.length + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editingImage) {
      try {
        const isNewImage = !images.find(img => img.id === editingImage.id);
        const method = isNewImage ? "POST" : "PUT";
        
        const response = await fetch("/api/carousel", {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingImage),
        });

        if (response.ok) {
          await loadImages();
          await toastSuccess(
            isNewImage ? "เพิ่มรูปภาพใหม่สำเร็จ!" : "อัปเดตรูปภาพสำเร็จ!"
          );
          setShowModal(false);
          setEditingImage(null);
        } else {
          await swalError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
      } catch (error) {
        console.error("Error saving carousel image:", error);
        await swalError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (await swalConfirm("คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพนี้?", "ลบ")) {
      try {
        const response = await fetch(`/api/carousel?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await loadImages();
          await toastSuccess("ลบรูปภาพสำเร็จ!");
        } else {
          await swalError("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      } catch (error) {
        console.error("Error deleting carousel image:", error);
        await swalError("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await Promise.all(
        ids.map((id) => fetch(`/api/carousel?id=${id}`, { method: "DELETE" }))
      );
      await loadImages();
    } catch (error) {
      console.error("Error bulk deleting carousel images:", error);
      throw error;
    }
  };

  const columns: Column<CarouselImage>[] = [
    {
      key: "imageUrl",
      label: "รูปภาพ",
      width: "120px",
      render: (_, image) => (
        <div className="relative">
          <Image
            src={image.imageUrl}
            alt={image.title}
            width={80}
            height={60}
            className="w-20 h-15 object-cover rounded-lg shadow-sm"
            unoptimized
          />
          {!image.isActive && (
            <div className="absolute inset-0 bg-gray-500 bg-opacity-50 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">ปิดใช้งาน</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "ชื่อรูปภาพ",
      sortable: true,
      render: (_, image) => (
        <div>
          <p className="font-semibold text-gray-900">{image.title}</p>
          <p className="text-sm text-gray-500 line-clamp-2">{image.description}</p>
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
      key: "order",
      label: "ลำดับ",
      sortable: true,
      width: "80px",
      render: (order) => (
        <span className="text-sm font-mono text-gray-600">#{order}</span>
      ),
    },
    {
      key: "isActive",
      label: "สถานะ",
      sortable: true,
      width: "100px",
      render: (isActive) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "อัปเดตล่าสุด",
      sortable: true,
      render: (date) => (
        <span className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString("th-TH")}
        </span>
      ),
    },
  ];

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
                🎠 จัดการ Gallery Carousel
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                จัดการรูปภาพที่แสดงใน Gallery Showcase Carousel บนหน้าแรก
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DataTable
          data={images}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          onAdd={handleAdd}
          loading={isLoading}
          title="จัดการ Gallery Carousel"
          icon="🎠"
          addButtonText="เพิ่มรูปภาพใหม่"
          emptyMessage="ยังไม่มีรูปภาพใน Carousel"
          emptyIcon="🖼️"
          searchPlaceholder="ค้นหารูปภาพ..."
          getItemId={(image) => image.id}
          searchFields={["title", "description", "category"]}
        />
      </div>

      {/* Edit Modal */}
      {showModal && editingImage && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingImage.title ? "แก้ไขรูปภาพ Carousel" : "เพิ่มรูปภาพใหม่"}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ชื่อรูปภาพ *
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="เช่น Style Moment 🎤"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL รูปภาพ *
                  </label>
                  <input
                    type="url"
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Performance">Performance</option>
                    <option value="Promotional">Promotional</option>
                    <option value="Event">Event</option>
                    <option value="Fan Event">Fan Event</option>
                    <option value="Behind the Scenes">Behind the Scenes</option>
                    <option value="Music Video">Music Video</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ลำดับการแสดง
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editingImage.order}
                      onChange={(e) =>
                        setEditingImage({
                          ...editingImage,
                          order: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      สถานะ
                    </label>
                    <select
                      value={editingImage.isActive ? "true" : "false"}
                      onChange={(e) =>
                        setEditingImage({
                          ...editingImage,
                          isActive: e.target.value === "true",
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="true">เปิดใช้งาน</option>
                      <option value="false">ปิดใช้งาน</option>
                    </select>
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
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                    placeholder="คำอธิบายเกี่ยวกับรูปภาพนี้..."
                  />
                </div>
              </div>

              {/* Preview Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ตัวอย่างรูปภาพ
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {editingImage.imageUrl ? (
                      <div className="relative">
                        <Image
                          src={editingImage.imageUrl}
                          alt={editingImage.title || "Preview"}
                          width={400}
                          height={300}
                          className="w-full h-64 object-cover rounded-lg"
                          unoptimized
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                          <h3 className="text-white text-lg font-bold">
                            {editingImage.title || "ชื่อรูปภาพ"}
                          </h3>
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-6xl mb-2">🖼️</div>
                          <p>ใส่ URL รูปภาพเพื่อดูตัวอย่าง</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Carousel Preview Info */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    ข้อมูล Carousel
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">หมวดหมู่:</span>
                      <span className="font-medium">{editingImage.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">ลำดับ:</span>
                      <span className="font-medium">#{editingImage.order}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">สถานะ:</span>
                      <span className={`font-medium ${editingImage.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {editingImage.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
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
