"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { swalSuccess } from "@/app/cms/_utils/swal";

interface Settings {
  siteName: string;
  siteUrl: string;
  description: string;
  logo: string;
  socialMedia: {
    twitter: string;
    instagram: string;
    youtube: string;
    weverse: string;
  };
  features: {
    comments: boolean;
    newsletter: boolean;
    multiLanguage: boolean;
  };
}

export default function CMSSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
    siteName: "Hearts2Hearts Haven",
    siteUrl: "https://h2hhaven.com",
    description: "Official fansite for Hearts2Hearts (H2H)",
    logo: "/images/h2h_logo.png",
    socialMedia: {
      twitter: "https://twitter.com/hearts2hearts",
      instagram: "https://instagram.com/hearts2hearts",
      youtube: "https://youtube.com/@hearts2hearts",
      weverse: "https://weverse.io/hearts2hearts",
    },
    features: {
      comments: false,
      newsletter: false,
      multiLanguage: false,
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("cms_user");
    if (!user) {
      router.push("/cms/login");
      return;
    }
  }, [router]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(async () => {
      await swalSuccess("บันทึกการตั้งค่าสำเร็จ!");
      setIsSaving(false);
    }, 1000);
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
                ⚙️ ตั้งค่าระบบ
              </h1>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold disabled:opacity-50"
            >
              {isSaving ? "กำลังบันทึก..." : "💾 บันทึกการตั้งค่า"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* General Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              ข้อมูลเว็บไซต์
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ชื่อเว็บไซต์
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL เว็บไซต์
                </label>
                <input
                  type="text"
                  value={settings.siteUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, siteUrl: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  คำอธิบาย
                </label>
                <textarea
                  value={settings.description}
                  onChange={(e) =>
                    setSettings({ ...settings, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              โซเชียลมีเดีย
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Twitter / X
                </label>
                <input
                  type="text"
                  value={settings.socialMedia.twitter}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialMedia: {
                        ...settings.socialMedia,
                        twitter: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  value={settings.socialMedia.instagram}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialMedia: {
                        ...settings.socialMedia,
                        instagram: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  YouTube
                </label>
                <input
                  type="text"
                  value={settings.socialMedia.youtube}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialMedia: {
                        ...settings.socialMedia,
                        youtube: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weverse
                </label>
                <input
                  type="text"
                  value={settings.socialMedia.weverse}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialMedia: {
                        ...settings.socialMedia,
                        weverse: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">ฟีเจอร์</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.features.comments}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      features: {
                        ...settings.features,
                        comments: e.target.checked,
                      },
                    })
                  }
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    เปิดใช้ความคิดเห็น
                  </p>
                  <p className="text-sm text-gray-500">
                    อนุญาตให้ผู้ใช้แสดงความคิดเห็นในบทความ
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.features.newsletter}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      features: {
                        ...settings.features,
                        newsletter: e.target.checked,
                      },
                    })
                  }
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <p className="font-semibold text-gray-900">Newsletter</p>
                  <p className="text-sm text-gray-500">
                    เปิดใช้การสมัครรับจดหมายข่าว
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.features.multiLanguage}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      features: {
                        ...settings.features,
                        multiLanguage: e.target.checked,
                      },
                    })
                  }
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <p className="font-semibold text-gray-900">หลายภาษา</p>
                  <p className="text-sm text-gray-500">
                    รองรับหลายภาษา (EN, KO, TH)
                  </p>
                </div>
              </label>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
