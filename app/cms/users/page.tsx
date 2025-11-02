"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import DataTable, { Column } from "@/app/cms/_components/DataTable";
import { swalConfirm, swalError, toastSuccess } from "@/app/cms/_utils/swal";

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "author";
  createdAt: string;
}

export default function CMSUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("cms_user");
    if (!user) {
      router.push("/cms/login");
      return;
    }
    loadUsers();
  }, [router]);

  const loadUsers = () => {
    setTimeout(() => {
      const mockData: User[] = [
        {
          id: "1",
          username: "admin",
          name: "Admin User",
          email: "admin@h2hhaven.com",
          role: "admin",
          createdAt: "2025-01-01",
        },
        {
          id: "2",
          username: "editor1",
          name: "Editor User",
          email: "editor@h2hhaven.com",
          role: "editor",
          createdAt: "2025-01-15",
        },
        {
          id: "3",
          username: "author1",
          name: "Author User",
          email: "author@h2hhaven.com",
          role: "author",
          createdAt: "2025-01-20",
        },
      ];
      setUsers(mockData);
      setIsLoading(false);
    }, 500);
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      admin: "bg-red-100 text-red-700",
      editor: "bg-blue-100 text-blue-700",
      author: "bg-green-100 text-green-700",
    };
    return badges[role] || "bg-gray-100 text-gray-700";
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingUser({
      id: Date.now().toString(),
      username: "",
      name: "",
      email: "",
      role: "author",
      createdAt: new Date().toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editingUser) {
      // Simulate API call
      const existingIndex = users.findIndex(u => u.id === editingUser.id);
      if (existingIndex >= 0) {
        // Update existing user
        const newUsers = [...users];
        newUsers[existingIndex] = editingUser;
        setUsers(newUsers);
        await toastSuccess("อัปเดตข้อมูลผู้ใช้สำเร็จ!");
      } else {
        // Add new user
        setUsers([...users, editingUser]);
        await toastSuccess("เพิ่มผู้ใช้ใหม่สำเร็จ!");
      }
      setShowModal(false);
      setEditingUser(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (await swalConfirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?", "ลบ")) {
      setUsers(users.filter(u => u.id !== id));
      await toastSuccess("ลบผู้ใช้สำเร็จ!");
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    setUsers(users.filter(u => !ids.includes(u.id)));
  };

  const columns: Column<User>[] = [
    {
      key: "name",
      label: "ผู้ใช้",
      sortable: true,
      render: (_, user) => (
        <div>
          <p className="font-semibold text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
      ),
    },
    {
      key: "role",
      label: "บทบาท",
      sortable: true,
      render: (role) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(role)}`}>
          {role}
        </span>
      ),
    },
    {
      key: "email",
      label: "อีเมล",
      sortable: true,
      render: (email) => (
        <span className="text-sm text-gray-600">{email}</span>
      ),
    },
    {
      key: "createdAt",
      label: "สร้างเมื่อ",
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
                🔐 จัดการผู้ใช้และสิทธิ์
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DataTable
          data={users}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          onAdd={handleAdd}
          loading={isLoading}
          title="จัดการผู้ใช้และสิทธิ์"
          icon="🔐"
          addButtonText="เชิญผู้ใช้ใหม่"
          emptyMessage="ยังไม่มีผู้ใช้ในระบบ"
          emptyIcon="👥"
          searchPlaceholder="ค้นหาผู้ใช้..."
          getItemId={(user) => user.id}
          searchFields={["name", "username", "email", "role"]}
        />
      </div>

      {/* Edit Modal */}
      {showModal && editingUser && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingUser.name ? "แก้ไขข้อมูลผู้ใช้" : "เพิ่มผู้ใช้ใหม่"}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ชื่อผู้ใช้
                  </label>
                  <input
                    type="text"
                    value={editingUser.username}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        username: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ชื่อจริง
                  </label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  อีเมล
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  บทบาท
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      role: e.target.value as "admin" | "editor" | "author",
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="author">Author</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
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
