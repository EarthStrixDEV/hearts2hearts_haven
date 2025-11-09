"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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
  detailedBackstory?: string;
  facts: string[];
  quote: string;
  imageUrl: string;
  coverImageUrl?: string;
  quickFact: string;
  icon: string;
}

export default function MemberBackgroundPage() {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  // Load member data
  useEffect(() => {
    const loadMember = async () => {
      try {
        const response = await fetch("/api/members");
        if (response.ok) {
          const members: Member[] = await response.json();
          const memberName = (params.name as string).toLowerCase();
          const foundMember = members.find(
            (m) => m.name.toLowerCase() === memberName
          );
          setMember(foundMember || null);
        }
      } catch (error) {
        console.error("Error loading member:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMember();
  }, [params.name]);

  // Load gallery images for this member
  useEffect(() => {
    const loadGalleryImages = async () => {
      if (!member) return;
      
      try {
        const response = await fetch("/api/gallery");
        if (response.ok) {
          const images = await response.json();
          const memberImages = images.filter(
            (img: any) => img.member === member.name
          );
          setGalleryImages(memberImages.slice(0, 6)); // Show first 6 images
        }
      } catch (error) {
        console.error("Error loading gallery images:", error);
      }
    };

    loadGalleryImages();
  }, [member]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Loading member profile...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Member Not Found
          </h1>
          <Link href="/members" className="btn-pastel inline-block">
            Back to Members
          </Link>
        </div>
      </div>
    );
  }

  // Generate detailed backstory if not available (1000+ characters)
  const getDetailedBackstory = () => {
    if (member.detailedBackstory) return member.detailedBackstory;
    
    return `${member.backstory}\n\n${member.name} has been an integral part of Hearts2Hearts since the beginning. Growing up with a passion for music and performance, ${member.name} spent ${member.traineeYears} as a trainee, honing their skills in singing, dancing, and stage presence. During this time, they faced numerous challenges but never gave up on their dream of becoming an idol.\n\nBorn in ${member.birthYear} in ${member.nationality}, ${member.name} showed exceptional talent from a young age. Their journey to becoming a member of H2H was filled with dedication, hard work, and countless hours of practice. As the ${member.position}, ${member.name} brings unique energy and charisma to the group that fans have come to love and admire.\n\nTheir personality shines both on and off stage, making them a beloved member among fans worldwide. ${member.name} is known for their ${member.quickFact}, which has become one of their most endearing traits. Beyond their professional achievements, ${member.name} values authenticity and connection with fans, often sharing personal stories and experiences through social media and fan meetings.\n\nAs Hearts2Hearts continues to grow and evolve, ${member.name} remains committed to delivering outstanding performances and creating meaningful music that resonates with listeners. Their favorite quote, "${member.quote}", reflects their philosophy and approach to both life and their career. With each comeback, ${member.name} continues to push boundaries and explore new artistic directions, solidifying their position as a key member of one of the most exciting groups in the industry today.\n\nLooking toward the future, ${member.name} has expressed interest in expanding their artistic horizons, potentially exploring solo projects, collaborations, and other creative endeavors. However, their dedication to Hearts2Hearts and their fellow members remains unwavering, as they continue to work together toward achieving their collective dreams and goals.`;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-50"
      }`}
    >
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

      {/* Hero Section with Large Cover Image */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image
          src={member.coverImageUrl || member.imageUrl}
          alt={member.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Member Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end gap-6">
              <div className="relative">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover ring-4 ring-white shadow-2xl"
                />
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-pink-400 to-purple-400 text-white text-4xl w-16 h-16 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
                  {member.icon}
                </div>
              </div>
              <div className="flex-1 pb-4">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 drop-shadow-2xl">
                  {member.name}
                </h1>
                <p className="text-2xl md:text-3xl text-white/90 mb-3 drop-shadow-lg">
                  {member.koreanName}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
                    {member.position}
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                    Born {member.birthYear}
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                    {member.nationality}
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                    Trained {member.traineeYears}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Detailed Backstory */}
            <div
              className={`rounded-3xl p-8 shadow-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2 className="text-3xl font-bold gradient-text mb-6 flex items-center gap-3">
                <span className="text-4xl">{member.emoji}</span>
                Background Story
              </h2>
              <div
                className={`prose prose-lg max-w-none ${
                  darkMode ? "prose-invert" : ""
                  }`}
                >
                  {getDetailedBackstory().split("\n\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className={`mb-4 leading-relaxed ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Fun Facts */}
            <div
              className={`rounded-3xl p-8 shadow-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2 className="text-3xl font-bold gradient-text mb-6">
                Fun Facts ✨
              </h2>
              <ul className="space-y-4">
                {member.facts.map((fact, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-2xl">💕</span>
                    <span
                      className={`text-lg ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {fact}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gallery Section */}
            {galleryImages.length > 0 && (
              <div
                className={`rounded-3xl p-8 shadow-lg ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold gradient-text">
                    Photo Gallery
                  </h2>
                  <Link
                    href={`/gallery?member=${member.name}`}
                    className="text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-2"
                  >
                    View All
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((image) => (
                    <Link
                      key={image.id}
                      href={`/gallery?member=${member.name}`}
                      className="relative aspect-square rounded-2xl overflow-hidden group"
                    >
                      <Image
                        src={image.imageUrl}
                        alt={image.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-semibold">
                          {image.category}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quote Card */}
            <div
              className={`rounded-3xl p-6 shadow-lg ${
                darkMode
                  ? "bg-gradient-to-br from-purple-900/50 to-pink-900/50"
                  : "bg-gradient-to-br from-blue-100 to-purple-100"
              }`}
            >
              <h3
                className={`text-lg font-bold mb-3 ${
                  darkMode ? "text-pink-300" : "text-blue-600"
                }`}
              >
                Favorite Quote 💬
              </h3>
              <p
                className={`italic text-lg ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                &ldquo;{member.quote}&rdquo;
              </p>
            </div>

            {/* Quick Info */}
            <div
              className={`rounded-3xl p-6 shadow-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="text-xl font-bold gradient-text mb-4">
                Quick Info
              </h3>
              <div className="space-y-3">
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Position
                  </p>
                  <p
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {member.position}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Birth Year
                  </p>
                  <p
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {member.birthYear}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Nationality
                  </p>
                  <p
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {member.nationality}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Training Period
                  </p>
                  <p
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {member.traineeYears}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Share */}
            <div
              className={`rounded-3xl p-6 shadow-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="text-xl font-bold gradient-text mb-4">
                Share Profile
              </h3>
              <div className="space-y-3">
                <button
                  className={`w-full px-4 py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${
                    darkMode
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Share on X
                </button>
                <button
                  className={`w-full px-4 py-3 rounded-full font-semibold transition-all border-2 flex items-center justify-center gap-2 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                  </svg>
                  Download Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

