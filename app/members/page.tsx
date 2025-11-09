"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import VectorBackground from "@/components/VectorBackground";
import MemberCard3D from "@/components/MemberCard3D";

interface Member {
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

export default function MembersPage() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize bias from localStorage (client-side only to avoid hydration mismatch)
  const [biasName, setBiasName] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Load bias from localStorage after component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
    const savedBias = localStorage.getItem("h2h_bias");
    if (savedBias) {
      setBiasName(savedBias);
    }
  }, []);

  // Load members from API
  const loadMembers = async () => {
    try {
      const response = await fetch("/api/members");
      if (response.ok) {
        const membersData = await response.json();
        setMembers(membersData);
      } else {
        console.error("Failed to load members");
      }
    } catch (error) {
      console.error("Error loading members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger animation on mount and load members
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    loadMembers();
    return () => clearTimeout(timer);
  }, []);

  // Save bias to localStorage
  const toggleBias = (name: string) => {
    if (biasName === name) {
      setBiasName(null);
      localStorage.removeItem("h2h_bias");
    } else {
      setBiasName(name);
      localStorage.setItem("h2h_bias", name);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.birthYear.toString().includes(searchQuery)
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 relative ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-50"
      } py-12 px-4`}
    >
      {/* Vector Background */}
      <VectorBackground darkMode={darkMode} />

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-20 right-4 z-40 p-3 rounded-full shadow-lg transition-all duration-300 ${
          darkMode
            ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
            : "bg-gray-800 text-yellow-300 hover:bg-gray-700"
        }`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className={`text-5xl md:text-6xl font-bold mb-4 gradient-text transition-opacity duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            Meet Hearts2Hearts
          </h1>
          <p
            className={`text-xl mb-8 transition-opacity duration-1000 delay-200 ${
              isVisible ? "opacity-100" : "opacity-0"
            } ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Get to know our 8 talented members!
          </p>

          {/* Search Bar */}
          <div
            className={`max-w-md mx-auto transition-opacity duration-1000 delay-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <input
              type="text"
              placeholder="Search by name or birth year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-6 py-3 rounded-full border-2 focus:outline-none transition-colors ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                  : "bg-white border-blue-200 text-gray-900 focus:border-blue-400"
              }`}
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p
              className={`text-xl ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Loading members...
            </p>
          </div>
        ) : (
          /* Members Grid with 3D Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {filteredMembers.map((member, index) => (
              <MemberCard3D
                key={member.name}
                member={member}
                biasName={biasName}
                darkMode={darkMode}
                onToggleBias={toggleBias}
                onViewProfile={setSelectedMember}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        )}

        {/* Timeline Section */}
        <div
          className={`rounded-3xl p-8 mb-8 shadow-lg ${
            darkMode
              ? "bg-gray-800 border-2 border-gray-700"
              : "bg-white border-2 border-blue-100"
          }`}
        >
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text">
            H2H Journey Timeline
          </h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="shrink-0 w-32 text-blue-500 font-bold">
                2019-2023
              </div>
              <div>
                <h3
                  className={`font-bold text-lg mb-2 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Trainee Days
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Members were scouted and trained from 2-6 years, preparing for
                  their debut with intense practice sessions.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="shrink-0 w-32 text-blue-500 font-bold">
                Feb 24, 2025
              </div>
              <div>
                <h3
                  className={`font-bold text-lg mb-2 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Debut! 🎉
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Hearts2Hearts officially debuted with &ldquo;The Chase&rdquo;
                  after years of anticipation (and a 2022 leak that made fans
                  wait even longer!).
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="shrink-0 w-32 text-blue-500 font-bold">
                Jun 18, 2025
              </div>
              <div>
                <h3
                  className={`font-bold text-lg mb-2 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Style Era
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Released their follow-up single &ldquo;Style&rdquo; showcasing
                  versatility.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="shrink-0 w-32 text-blue-500 font-bold">
                Oct 20, 2025
              </div>
              <div>
                <h3
                  className={`font-bold text-lg mb-2 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  FOCUS Comeback 💖
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Latest mini-album with the addictive house track
                  &ldquo;FOCUS&rdquo; featuring dreamy flower cathedral
                  aesthetics!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for detailed member info */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl animate-slideUp`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMember(null)}
              className={`absolute top-4 right-4 text-3xl transition-colors ${
                darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              ×
            </button>

            <div className="text-center mb-6">
              <div className="relative mb-4 inline-block">
                <Image
                  src={selectedMember.imageUrl}
                  alt={selectedMember.name}
                  width={144}
                  height={144}
                  className="w-36 h-36 rounded-full mx-auto object-cover shadow-xl ring-4 ring-pink-200"
                />
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-pink-400 to-purple-400 text-white text-3xl w-14 h-14 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
                  {selectedMember.icon}
                </div>
              </div>
              <h2 className="text-4xl font-bold gradient-text mb-2 mt-6">
                {selectedMember.name}
              </h2>
              <p
                className={`text-xl mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {selectedMember.koreanName}
              </p>
              <p className="text-blue-500 font-semibold mb-4">
                {selectedMember.position}
              </p>
              <div
                className={`flex justify-center gap-4 text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <span>🎂 Born {selectedMember.birthYear}</span>
                <span>🌏 {selectedMember.nationality}</span>
                <span>⏱️ Trained {selectedMember.traineeYears}</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-blue-500 mb-3">
                  Backstory 📖
                </h3>
                <p
                  className={`leading-relaxed ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {selectedMember.backstory}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-500 mb-3">
                  Fun Facts ✨
                </h3>
                <ul className="space-y-2">
                  {selectedMember.facts.map((fact, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-pink-400 mr-2">💕</span>
                      <span
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        {fact}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={`p-6 rounded-2xl ${
                  darkMode
                    ? "bg-gradient-to-r from-purple-900/50 to-pink-900/50"
                    : "bg-gradient-to-r from-blue-100 to-purple-100"
                }`}
              >
                <h3
                  className={`text-lg font-bold mb-2 ${
                    darkMode ? "text-pink-300" : "text-blue-600"
                  }`}
                >
                  Favorite Quote 💬
                </h3>
                <p
                  className={`italic ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  &ldquo;{selectedMember.quote}&rdquo;
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl ${
                    darkMode
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Share on X
                </button>
                <button
                  className={`px-6 py-3 rounded-full font-semibold border-2 transition-colors flex items-center gap-2 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                      : "bg-white text-blue-500 border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                  </svg>
                  Download Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
