"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { swalConfirm, swalError, toastError, toastSuccess } from "@/app/cms/_utils/swal";

interface Member {
  id: string;
  name: string;
  koreanName: string;
  position: string;
  birthYear: number;
  nationality: string;
  traineeYears: string;
  emoji: string;
  color: string;
  backstory: string;
  facts: string[];
  quote: string;
  imageUrl: string;
  quickFact: string;
  icon: string;
}

export default function CMSMembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("cms_user");
    if (!user) {
      router.push("/cms/login");
      return;
    }

    loadMembers();
  }, [router]);

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/members');
      if (response.ok) {
        const membersData = await response.json();
        setMembers(membersData);
      } else {
        console.error('Failed to load members');
        await toastError('ไม่สามารถโหลดข้อมูลสมาชิกได้');
      }
    } catch (error) {
      console.error('Error loading members:', error);
      await toastError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editingMember) {
      try {
        const response = await fetch('/api/members', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingMember),
        });

        if (response.ok) {
          // Reload members data
          await loadMembers();
          await toastSuccess("บันทึกข้อมูลสมาชิกสำเร็จ!");
          setShowModal(false);
          setEditingMember(null);
        } else {
          await swalError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
      } catch (error) {
        console.error('Error saving member:', error);
        await swalError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (await swalConfirm("คุณแน่ใจหรือไม่ว่าต้องการลบสมาชิกนี้?", "ลบ")) {
      try {
        const response = await fetch(`/api/members?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Reload members data
          await loadMembers();
          await toastSuccess("ลบสมาชิกสำเร็จ!");
        } else {
          await swalError("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      } catch (error) {
        console.error('Error deleting member:', error);
        await swalError("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
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
                👭 จัดการสมาชิก (Members)
              </h1>
            </div>
            <button
              onClick={() => {
                setEditingMember({
                  id: Date.now().toString(),
                  name: "",
                  koreanName: "",
                  position: "",
                  birthYear: 2000,
                  nationality: "",
                  traineeYears: "",
                  emoji: "🎤",
                  color: "from-pink-400 to-purple-400",
                  backstory: "",
                  facts: [],
                  quote: "",
                  imageUrl: "",
                  quickFact: "",
                  icon: "🎤",
                });
                setShowModal(true);
              }}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-lg"
            >
              + เพิ่มสมาชิกใหม่
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">สมาชิกทั้งหมด</p>
                <p className="text-2xl font-bold">{members.length}</p>
              </div>
              <div className="text-3xl">👭</div>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="text-center">
                  <div className="relative mb-4">
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      width={120}
                      height={120}
                      className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg ring-4 ring-pink-100"
                      unoptimized
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-pink-400 to-purple-400 text-white text-2xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                      {member.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    {member.koreanName}
                  </p>
                  <p className="text-blue-600 font-semibold text-sm mb-3">
                    {member.position}
                  </p>
                  <p className="text-gray-500 text-xs mb-4">
                    Born {member.birthYear} • {member.nationality}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                    >
                      ✏️ แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
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
      {showModal && editingMember && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingMember.name ? "แก้ไขข้อมูลสมาชิก" : "เพิ่มสมาชิกใหม่"}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ชื่อ (อังกฤษ)
                  </label>
                  <input
                    type="text"
                    value={editingMember.name}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ชื่อ (เกาหลี)
                  </label>
                  <input
                    type="text"
                    value={editingMember.koreanName}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        koreanName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ตำแหน่ง (Position)
                </label>
                <input
                  type="text"
                  value={editingMember.position}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      position: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ปีเกิด
                  </label>
                  <input
                    type="number"
                    value={editingMember.birthYear}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        birthYear: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    สัญชาติ
                  </label>
                  <input
                    type="text"
                    value={editingMember.nationality}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        nationality: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL รูปภาพ
                </label>
                <input
                  type="text"
                  value={editingMember.imageUrl}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      imageUrl: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ไอคอน (Emoji)
                </label>
                <input
                  type="text"
                  value={editingMember.icon}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      icon: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="👑"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  คำพูดโปรด (Quote)
                </label>
                <textarea
                  value={editingMember.quote}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      quote: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เรื่องราว (Backstory)
                </label>
                <textarea
                  value={editingMember.backstory}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      backstory: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ระยะเวลาฝึกหัด
                  </label>
                  <input
                    type="text"
                    value={editingMember.traineeYears}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        traineeYears: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="6 years"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    สี (Color Class)
                  </label>
                  <input
                    type="text"
                    value={editingMember.color}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        color: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="from-pink-400 to-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ข้อเท็จจริงสั้น (Quick Fact)
                </label>
                <input
                  type="text"
                  value={editingMember.quickFact}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      quickFact: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Loves Japanese tongue-twisters! 🗣️"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ข้อเท็จจริงน่าสนใจ (Facts) - หนึ่งข้อต่อบรรทัด
                </label>
                <textarea
                  value={editingMember.facts.join('\n')}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      facts: e.target.value.split('\n').filter(fact => fact.trim() !== ''),
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Loves Japanese tongue-twisters&#10;Has a dog named Haneul&#10;Ballet background shines in choreography"
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
