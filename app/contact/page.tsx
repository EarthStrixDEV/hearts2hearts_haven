"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "fanart",
    message: "",
    image: null as File | null,
    youtubeUrl: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Create subject from type and message
      const subject = `[${formData.type.toUpperCase()}] H2H Fan Submission from ${
        formData.name
      }`;

      // Prepare form data for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("to", formData.email);
      formDataToSend.append("from", "warapon.jitsook@gmail.com");
      formDataToSend.append("name", formData.name);
      formDataToSend.append("subject", subject);

      let messageContent = `Submission Type: ${formData.type}\n\nMessage:\n${formData.message}`;

      if (formData.youtubeUrl) {
        messageContent += `\n\nYouTube Link: ${formData.youtubeUrl}`;
      }

      formDataToSend.append("message", messageContent);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (formData.youtubeUrl) {
        formDataToSend.append("youtubeUrl", formData.youtubeUrl);
      }

      const response = await fetch("/api/send-email", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          type: "fanart",
          message: "",
          image: null,
          youtubeUrl: "",
        });
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to send submission");
      }
    } catch {
      setError("Failed to send submission. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      image: file,
    });
  };

  const handleYouTubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      youtubeUrl: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            Fan Corner
          </h1>
          <p className="text-xl text-gray-600">
            Share your love with H2H! Submit fanart, fanfic, or just say hi! 💕
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <div className="card-pastel p-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-6">
              Submit Your Creation 🎨
            </h2>

            {submitted ? (
              <div className="bg-green-100 text-green-800 p-6 rounded-2xl text-center">
                <div className="text-5xl mb-3">✅</div>
                <h3 className="text-2xl font-bold mb-2">Thank you, S2U! 💕</h3>
                <p>
                  Your submission has been received! We will review it and
                  feature it on our social media!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Your Name / Username
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Submission Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none transition-colors"
                  >
                    <option value="fanart">🎨 Fanart</option>
                    <option value="fanfic">📝 Fanfiction</option>
                    <option value="cover">🎵 Song Cover</option>
                    <option value="message">💌 Message to H2H</option>
                    <option value="other">✨ Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Your Message / Link to Creation
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none transition-colors resize-none"
                    placeholder="Share your creation or message! Include links to your fanart/video if applicable."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    📸 Upload Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none transition-colors"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: JPG, PNG, GIF (Max 5MB)
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    🎥 YouTube Video Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleYouTubeChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none transition-colors"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Paste your YouTube video URL here
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-pastel w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                    "Submit 💕"
                  )}
                </button>

                {error && (
                  <div className="bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl text-center">
                    <p className="font-semibold">{error}</p>
                  </div>
                )}

                <p className="text-sm text-gray-500 text-center">
                  By submitting, you agree to let us feature your work on our
                  social media with credit!
                </p>
              </form>
            )}
          </div>

          {/* Social Media & Info */}
          <div className="space-y-6">
            {/* Official Social Media */}
            <div className="card-pastel p-8">
              <h2 className="text-2xl font-bold text-blue-600 mb-6">
                Connect with H2H 🌐
              </h2>

              <div className="space-y-4">
                <a
                  href="https://www.instagram.com/hearts2hearts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg
                      className="w-8 h-8"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Instagram</h3>
                    <p className="text-sm text-gray-600">@hearts2hearts</p>
                  </div>
                </a>

                <a
                  href="https://www.youtube.com/@hearts2hearts.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-100 to-blue-100 rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg
                      className="w-8 h-8"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">YouTube</h3>
                    <p className="text-sm text-gray-600">
                      @hearts2hearts.official
                    </p>
                  </div>
                </a>

                <a
                  href="https://twitter.com/Hearts2Hearts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg
                      className="w-8 h-8"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">X (Twitter)</h3>
                    <p className="text-sm text-gray-600">@Hearts2Hearts</p>
                  </div>
                </a>

                <a
                  href="https://weverse.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg
                      className="w-8 h-8"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Weverse</h3>
                    <p className="text-sm text-gray-600">Join S2U Community!</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Fan Community */}
            <div className="card-pastel p-8">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">
                Fan Communities 🫶
              </h2>
              <p className="text-gray-600 mb-4">
                Connect with fellow S2U fans worldwide!
              </p>

              <div className="space-y-3">
                <a
                  href="https://discord.gg/h2h"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <span className="font-semibold text-purple-700">
                    💬 Discord Server
                  </span>
                </a>
                <a
                  href="https://reddit.com/r/hearts2hearts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  <span className="font-semibold text-orange-700">
                    🔶 Reddit Community
                  </span>
                </a>
                <a
                  href="https://twitter.com/search?q=%23H2H"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <span className="font-semibold text-blue-700">
                    # #H2H Hashtag
                  </span>
                </a>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                💌 Submission Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">💕</span>
                  <span>Be respectful and kind</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">💕</span>
                  <span>Give proper credit if using others&rsquo; work</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">💕</span>
                  <span>Keep content appropriate for all ages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">💕</span>
                  <span>Tag us when posting on social media!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Featured Fan Creations */}
        <div className="card-pastel p-8">
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text">
            Featured Fan Creations
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl text-center">
              <div className="text-5xl mb-3">🎨</div>
              <h3 className="font-bold text-gray-800 mb-2">Amazing Fanart</h3>
              <p className="text-sm text-gray-600 mb-3">
                Beautiful drawings of Carmen & Jiwoo by @s2u_artist
              </p>
              <button className="text-blue-600 font-semibold text-sm hover:underline">
                View Gallery →
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl text-center">
              <div className="text-5xl mb-3">🎵</div>
              <h3 className="font-bold text-gray-800 mb-2">FOCUS Cover</h3>
              <p className="text-sm text-gray-600 mb-3">
                Stunning dance cover by S2U Indonesia!
              </p>
              <button className="text-blue-600 font-semibold text-sm hover:underline">
                Watch Video →
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl text-center">
              <div className="text-5xl mb-3">📝</div>
              <h3 className="font-bold text-gray-800 mb-2">
                Heartfelt Messages
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                S2U shares their favorite H2H moments!
              </p>
              <button className="text-blue-600 font-semibold text-sm hover:underline">
                Read More →
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">
            💕 This fan site is made with love by S2U for S2U
          </p>
          <p className="text-sm text-gray-500">
            Not officially affiliated with Hearts2Hearts or their agency
          </p>
        </div>
      </div>
    </div>
  );
}
