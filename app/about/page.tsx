"use client";

import { useState } from "react";

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "warapon.jitsook@gmail.com",
          from: formData.email,
          name: formData.name,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            About Hearts2Hearts
          </h1>
          <p className="text-xl text-gray-600">
            Get to know H2H and the S2U fandom!
          </p>
        </div>

        {/* Group Introduction */}
        <div className="card-pastel p-8 mb-8">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-3xl font-bold text-blue-600">
              💖 Hearts2Hearts (H2H)
            </h2>
          </div>

          <div className="prose prose-pink max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              <strong className="text-blue-600">Hearts2Hearts</strong>{" "}
              (하츠투하츠), also known as{" "}
              <strong className="text-blue-600">H2H</strong>, is an 8-member
              South Korean girl group that debuted on{" "}
              <strong>February 24, 2025</strong> with the single &ldquo;The
              Chase&rdquo;.
            </p>

            <p className="text-gray-700 leading-relaxed mb-4">
              The group consists of{" "}
              <strong>
                Jiwoo, Carmen, Yuha, Stella, Juun, A-na, Ian, and Ye-on
              </strong>
              . Known for their dreamy aesthetics, heartfelt messages, and
              powerful performances, H2H captures the essence of youth,
              friendship, and dreams.
            </p>

            <p className="text-gray-700 leading-relaxed mb-4">
              After a leaked pre-debut in 2022 that left fans waiting anxiously,
              H2H finally made their official debut in 2025, and it was worth
              the wait! The group quickly gained attention for their diverse
              talents, international lineup, and the genuine bond between
              members.
            </p>
          </div>
        </div>

        {/* Fandom */}
        <div className="card-pastel p-8 mb-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
            S2U Fandom 🫶
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                What is S2U?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-blue-600">S2U</strong> stands for
                &ldquo;Shout 2 U&rdquo; - the official fandom name for
                Hearts2Hearts! It represents the message that H2H is always
                shouting their love and appreciation to their fans. S2U members
                are known for their dedication, creativity, and warm community
                spirit.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Fandom Colors
              </h3>
              <div className="flex gap-3 mb-3">
                <div className="flex-1 bg-gradient-to-br from-blue-300 to-blue-400 rounded-xl p-4 text-white text-center font-semibold">
                  Pastel Pink
                </div>
                <div className="flex-1 bg-gradient-to-br from-purple-300 to-purple-400 rounded-xl p-4 text-white text-center font-semibold">
                  Soft Purple
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                Official colors representing love, dreams, and unity! 💕💜
              </p>
            </div>
          </div>
        </div>

        {/* Group History */}
        <div className="card-pastel p-8 mb-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
            Group History 📅
          </h2>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-400 pl-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                2019 - 2023: Training Era
              </h3>
              <p className="text-gray-700">
                Members joined at different times, with Jiwoo training the
                longest (6 years) and Carmen & Ye-on training for 2 years.
                Through intense practice, language barriers, and personal
                challenges, the 8 girls formed an unbreakable bond.
              </p>
            </div>

            <div className="border-l-4 border-purple-400 pl-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                2022: The Leak
              </h3>
              <p className="text-gray-700">
                Pre-debut information was leaked, causing the debut to be
                postponed. Fans waited patiently for official news while
                supporting the trainees through this difficult period.
              </p>
            </div>

            <div className="border-l-4 border-blue-400 pl-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                February 24, 2025: Debut! 🎉
              </h3>
              <p className="text-gray-700">
                H2H finally debuted with &ldquo;The Chase&rdquo;! The single
                showcased their potential and introduced S2U to the world.
                Jiwoo&rsquo;s words at the showcase resonated with everyone:
                &ldquo;We&rsquo;ve all been waiting for today.&rdquo;
              </p>
            </div>

            <div className="border-l-4 border-purple-400 pl-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                June 18, 2025: Style Era
              </h3>
              <p className="text-gray-700">
                Released &ldquo;Style&rdquo; showing their growth and
                versatility. The summer vibes and chic concept won over new fans
                worldwide!
              </p>
            </div>

            <div className="border-l-4 border-blue-400 pl-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                September 24, 2025: Pretty Please Pre-release
              </h3>
              <p className="text-gray-700">
                Dropped a sweet pre-release single building anticipation for
                their first mini-album.
              </p>
            </div>

            <div className="border-l-4 border-purple-400 pl-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                October 20, 2025: FOCUS Mini-Album 💕
              </h3>
              <p className="text-gray-700">
                Their first mini-album featuring the addictive house track
                &ldquo;FOCUS&rdquo;! The flower cathedral MV aesthetic and pink
                ballet performance outfits captured hearts everywhere. Currently
                promoting and winning fans daily!
              </p>
            </div>
          </div>
        </div>

        {/* Discography Summary */}
        <div className="card-pastel p-8 mb-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
            Discography 💿
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl text-center">
              <div className="text-5xl mb-3">💽</div>
              <h3 className="text-xl font-bold text-blue-700 mb-2">FOCUS</h3>
              <p className="text-sm text-gray-700">Mini Album • Oct 2025</p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl text-center">
              <div className="text-5xl mb-3">💿</div>
              <h3 className="text-xl font-bold text-purple-700 mb-2">Style</h3>
              <p className="text-sm text-gray-700">Single • Jun 2025</p>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl text-center">
              <div className="text-5xl mb-3">🎵</div>
              <h3 className="text-xl font-bold text-blue-700 mb-2">
                The Chase
              </h3>
              <p className="text-sm text-gray-700">Debut Single • Feb 2025</p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="card-pastel p-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
            Achievements 🏆
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🎬</span>
                <h3 className="font-bold text-gray-800">15M+ Views</h3>
              </div>
              <p className="text-sm text-gray-600">
                &ldquo;The Chase&rdquo; MV reached 15 million views!
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🔥</span>
                <h3 className="font-bold text-gray-800">Viral Moments</h3>
              </div>
              <p className="text-sm text-gray-600">
                Carmen&rsquo;s ending fairy & Ian&rsquo;s predebut pics went
                viral!
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🌏</span>
                <h3 className="font-bold text-gray-800">Global Reach</h3>
              </div>
              <p className="text-sm text-gray-600">
                International lineup representing Korea, Indonesia, & Canada!
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">💝</span>
                <h3 className="font-bold text-gray-800">Growing S2U</h3>
              </div>
              <p className="text-sm text-gray-600">
                Dedicated fanbase supporting through voting & streaming!
              </p>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="mt-8 bg-gradient-to-r from-blue-100 to-blue-200 p-8 rounded-3xl">
          <h3 className="text-2xl font-bold text-center mb-6 gradient-text">
            Fun H2H Facts! 🎀
          </h3>

          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-500 mr-3">💕</span>
              <span className="text-gray-700">
                H2H has members aged 15-20 (as of 2025)
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-3">💕</span>
              <span className="text-gray-700">
                Carmen is the eldest but Jiwoo is the leader
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-3">💕</span>
              <span className="text-gray-700">
                Stella plays 3 instruments: guitar, bass, and drums!
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-3">💕</span>
              <span className="text-gray-700">
                Group concept: Dreamy schoolgirl + heartfelt messages
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-3">💕</span>
              <span className="text-gray-700">
                The FOCUS MV features a beautiful flower cathedral setting
              </span>
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <div className="mt-12 bg-gradient-to-br from-sky-50 to-blue-100 p-8 rounded-3xl shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-2">
              💌 Send us a Message
            </h2>
            <p className="text-gray-600">
              Share your thoughts about H2H or connect with fellow S2U members!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-blue-700 mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors bg-white/80 backdrop-blur-sm"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-blue-700 mb-2"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors bg-white/80 backdrop-blur-sm"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-semibold text-blue-700 mb-2"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors bg-white/80 backdrop-blur-sm"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-blue-700 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors bg-white/80 backdrop-blur-sm resize-none"
                placeholder="Share your thoughts, questions, or love for H2H..."
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message 💌"
                )}
              </button>
            </div>

            {submitStatus === "success" && (
              <div className="bg-green-100 border-2 border-green-300 text-green-700 px-6 py-4 rounded-xl text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">✅</span>
                  <span className="font-semibold">
                    Message sent successfully!
                  </span>
                </div>
                <p className="text-sm mt-1">
                  Thank you for reaching out to us!
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="bg-red-100 border-2 border-red-300 text-red-700 px-6 py-4 rounded-xl text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">❌</span>
                  <span className="font-semibold">Failed to send message</span>
                </div>
                <p className="text-sm mt-1">
                  Please try again later or contact us directly.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
