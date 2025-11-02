"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import DataTable, { Column } from "@/app/cms/_components/DataTable";
import { swalConfirm, swalError, toastSuccess } from "@/app/cms/_utils/swal";

interface ScheduleEvent {
  id: string;
  title: string;
  type: "performance" | "fanmeet" | "broadcast" | "release" | "other";
  date: string;
  time: string;
  location: string;
  description: string;
}

export default function CMSSchedulePage() {
  const router = useRouter();
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("cms_user");
    if (!user) {
      router.push("/cms/login");
      return;
    }
    loadEvents();
  }, [router]);

  const loadEvents = () => {
    setTimeout(() => {
      const mockData: ScheduleEvent[] = [
        {
          id: "1",
          title: "Music Core Performance",
          type: "performance",
          date: "2025-11-01",
          time: "17:00",
          location: "MBC Music Core Studio",
          description: "FOCUS comeback stage",
        },
        {
          id: "2",
          title: "Fan Meeting in Seoul",
          type: "fanmeet",
          date: "2025-11-15",
          time: "19:00",
          location: "Olympic Hall",
          description: "Special fan meeting event",
        },
        {
          id: "3",
          title: "New Single Release",
          type: "release",
          date: "2025-11-20",
          time: "18:00",
          location: "Digital Platforms",
          description: "New digital single release",
        },
      ];
      setEvents(mockData);
      setIsLoading(false);
    }, 500);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      performance: "bg-purple-100 text-purple-700",
      fanmeet: "bg-pink-100 text-pink-700",
      broadcast: "bg-blue-100 text-blue-700",
      release: "bg-green-100 text-green-700",
      other: "bg-gray-100 text-gray-700",
    };
    return colors[type] || colors.other;
  };

  const handleEdit = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingEvent({
      id: Date.now().toString(),
      title: "",
      type: "performance",
      date: new Date().toISOString().split('T')[0],
      time: "19:00",
      location: "",
      description: "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editingEvent) {
      // Simulate API call
      const existingIndex = events.findIndex(e => e.id === editingEvent.id);
      if (existingIndex >= 0) {
        // Update existing event
        const newEvents = [...events];
        newEvents[existingIndex] = editingEvent;
        setEvents(newEvents);
        await toastSuccess("อัปเดตกำหนดการสำเร็จ!");
      } else {
        // Add new event
        setEvents([...events, editingEvent]);
        await toastSuccess("เพิ่มกำหนดการใหม่สำเร็จ!");
      }
      setShowModal(false);
      setEditingEvent(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (await swalConfirm("คุณแน่ใจหรือไม่ว่าต้องการลบกำหนดการนี้?", "ลบ")) {
      setEvents(events.filter(e => e.id !== id));
      await toastSuccess("ลบกำหนดการสำเร็จ!");
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    setEvents(events.filter(e => !ids.includes(e.id)));
  };

  const columns: Column<ScheduleEvent>[] = [
    {
      key: "title",
      label: "ชื่อกิจกรรม",
      sortable: true,
      render: (_, event) => (
        <div>
          <p className="font-semibold text-gray-900">{event.title}</p>
          <p className="text-sm text-gray-500">{event.description}</p>
        </div>
      ),
    },
    {
      key: "type",
      label: "ประเภท",
      sortable: true,
      render: (type) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(type)}`}>
          {type}
        </span>
      ),
    },
    {
      key: "date",
      label: "วันที่",
      sortable: true,
      render: (date) => (
        <span className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString("th-TH")}
        </span>
      ),
    },
    {
      key: "time",
      label: "เวลา",
      sortable: true,
      render: (time) => (
        <span className="text-sm text-gray-600">{time}</span>
      ),
    },
    {
      key: "location",
      label: "สถานที่",
      sortable: true,
      render: (location) => (
        <span className="text-sm text-gray-600">{location}</span>
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
                📅 จัดการกำหนดการ
              </h1>
            </div>
            <Link
              href="/cms/schedule/new"
              className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white px-8 py-4 rounded-2xl hover:from-orange-600 hover:to-yellow-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              เพิ่มกิจกรรม
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DataTable
          data={events}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          onAdd={handleAdd}
          loading={isLoading}
          title="จัดการกำหนดการ"
          icon="📅"
          addButtonText="สร้างกำหนดการใหม่"
          emptyMessage="ยังไม่มีกำหนดการ"
          emptyIcon="📅"
          searchPlaceholder="ค้นหากิจกรรม..."
          getItemId={(event) => event.id}
          searchFields={["title", "type", "location", "description"]}
        />
      </div>

      {/* Edit Modal */}
      {showModal && editingEvent && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingEvent.title ? "แก้ไขกำหนดการ" : "เพิ่มกำหนดการใหม่"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ชื่อกิจกรรม
                </label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ประเภทกิจกรรม
                </label>
                <select
                  value={editingEvent.type}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      type: e.target.value as ScheduleEvent["type"],
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="performance">Performance</option>
                  <option value="fanmeet">Fan Meeting</option>
                  <option value="broadcast">Broadcast</option>
                  <option value="release">Release</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    วันที่
                  </label>
                  <input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        date: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    เวลา
                  </label>
                  <input
                    type="time"
                    value={editingEvent.time}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        time: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  สถานที่
                </label>
                <input
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      location: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  คำอธิบาย
                </label>
                <textarea
                  value={editingEvent.description}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
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
