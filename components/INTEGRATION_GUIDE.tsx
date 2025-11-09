/**
 * 🎀 STEP-BY-STEP INTEGRATION GUIDE
 * 
 * วิธีใช้ Hologram Components ใน page.tsx
 * แบบ Copy-Paste ได้เลย!
 */

"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import GlassBackground from "./GlassBackground";
import HologramCard from "./HologramCard";
import HologramButton from "./HologramButton";

// ============================================
// STEP 1: Import CSS in layout.tsx
// ============================================
/*
Add this line in app/layout.tsx:

import '@/styles/hologram.css';
*/

// ============================================
// STEP 2: Replace Hero Section
// ============================================
export function NewHeroSection() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background with member images */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://pbs.twimg.com/media/G4KZGz4WIAAqjFe?format=jpg&name=large')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Decorative hearts */}
      <div className="absolute top-10 left-10 text-blue-300 text-6xl opacity-20 z-10">
        💕
      </div>
      <div className="absolute bottom-20 right-20 text-blue-300 text-5xl opacity-20 z-10">
        💖
      </div>

      <div className="max-w-7xl mx-auto relative z-20">
        {/* Glass Background with Hologram Effect */}
        <GlassBackground blurLevel="high" tint="pink" borderGlow>
          <div className="p-8 md:p-12 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="text-holo-rainbow drop-shadow-lg">
                Welcome to Hearts2Hearts Haven!
              </span>
            </h1>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">💕</h1>
            <p className="text-xl md:text-2xl font-extrabold text-holo-pink-purple drop-shadow-md mb-4">
              ยินดีต้อนรับสู่บ้าน H2H!
            </p>
            <p className="text-lg font-bold text-gray-700 drop-shadow-md mb-8">
              Join S2U in celebrating our 8 talented girls ✨
            </p>

            {/* Hologram Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <HologramButton variant="pink" size="lg" href="/members">
                👭 Meet the Members
              </HologramButton>
              <HologramButton variant="blue" size="lg" href="/gallery">
                📸 Photo Gallery
              </HologramButton>
              <HologramButton variant="purple" size="lg" href="/music">
                🎵 Music & MVs
              </HologramButton>
            </div>
          </div>
        </GlassBackground>

        {/* Video Embed with Glass Background */}
        <div className="max-w-4xl mx-auto mt-12">
          <GlassBackground blurLevel="medium" tint="blue">
            <div className="overflow-hidden rounded-3xl">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/rfL21nFvEsc"
                  title="Hearts2Hearts - FOCUS Performance"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6 bg-white/80 backdrop-blur-sm text-center">
                <h3 className="text-2xl font-bold text-holo-pink-purple mb-2">
                  FOCUS - Music Core Performance 🎀
                </h3>
                <p className="text-gray-600">
                  Watch our girls shine on stage! (Oct 25, 2025)
                </p>
              </div>
            </div>
          </GlassBackground>
        </div>
      </div>
    </section>
  );
}

// ============================================
// STEP 3: Replace Member Cards Grid
// ============================================
export function NewMemberCardsGrid({ membersData }: { membersData: any[] }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (membersData.length > 0) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [membersData]);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-holo-rainbow mb-4">
            Meet All 8 Members
          </h2>
          <p className="text-gray-600 text-lg">
            Click any card to learn more about our talented girls!
          </p>
        </div>

        {/* Grid of Member Cards with Hologram Effect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {membersData.map((member, index) => (
            <Link key={member.name} href={member.profile}>
              <HologramCard
                intensity="medium"
                enableLightTrails
                className={`transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: `${index * 100 + 200}ms`,
                }}
              >
                <div className="p-6">
                  {/* Role Icon Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-br from-pink-400 to-purple-400 text-white text-2xl w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10">
                    {member.icon}
                  </div>

                  {/* Member Image */}
                  <div className="relative mb-4">
                    <Image
                      src={member.img}
                      alt={member.name}
                      width={200}
                      height={200}
                      className="w-64 h-64 rounded-full object-cover mx-auto shadow-xl ring-4 ring-pink-100"
                      unoptimized
                    />
                  </div>

                  {/* Member Info */}
                  <div className="text-center mt-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-2">{member.korean}</p>
                    <p className="text-holo-pink-purple font-semibold text-sm mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-500 text-xs mb-4">
                      Born {member.birth}
                    </p>

                    {/* Quick Fact */}
                    <div className="bg-pink-50 rounded-lg p-3 text-xs italic text-gray-600 mb-4 min-h-[60px] flex items-center justify-center">
                      {member.facts[0]}
                    </div>

                    {/* View Profile Button */}
                    <HologramButton variant="pink" size="sm" className="w-full">
                      View Profile →
                    </HologramButton>
                  </div>
                </div>
              </HologramCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// STEP 4: Replace News Cards
// ============================================
export function NewNewsSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold text-holo-rainbow">
            Latest Updates
          </h2>
          <Link
            href="/news"
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 group"
          >
            View All News
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* News Card 1 */}
          <HologramCard intensity="subtle" enableLightTrails>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  Performance
                </span>
                <span className="text-gray-500 text-sm">Oct 25, 2025</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                H2H Stuns at Music Core! 🎀
              </h3>
              <p className="text-gray-600 mb-4">
                The girls performed FOCUS in ethereal pink ballet outfits.
                Carmen&apos;s ending fairy had 376+ likes on X!
              </p>
              <HologramButton variant="pink" size="sm">
                View Fancam →
              </HologramButton>
            </div>
          </HologramCard>

          {/* News Card 2 */}
          <HologramCard intensity="subtle" enableLightTrails>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                  Comeback
                </span>
                <span className="text-gray-500 text-sm">Oct 20, 2025</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                FOCUS MV Released! 🎬
              </h3>
              <p className="text-gray-600 mb-4">
                Hearts2Hearts drops addictive house beat track &quot;FOCUS&quot;
                with dreamy flower cathedral aesthetics.
              </p>
              <HologramButton variant="purple" size="sm" href="/music">
                Watch MV →
              </HologramButton>
            </div>
          </HologramCard>

          {/* News Card 3 */}
          <HologramCard intensity="subtle" enableLightTrails>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                  Vote
                </span>
                <span className="text-gray-500 text-sm">Until Oct 30</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Vote for H2H at MAMA! 🏆
              </h3>
              <p className="text-gray-600 mb-4">
                Help H2H win at the MAMA Awards! Voting closes October 30th.
                Every vote counts, S2U!
              </p>
              <HologramButton variant="aqua" size="sm" href="https://mama.vote">
                Vote Now →
              </HologramButton>
            </div>
          </HologramCard>
        </div>
      </div>
    </section>
  );
}

// ============================================
// STEP 5: Replace CTA Section
// ============================================
export function NewCTASection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="max-w-4xl mx-auto">
        <GlassBackground blurLevel="high" tint="purple" borderGlow>
          <HologramCard intensity="intense" enableLightTrails>
            <div className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-6 text-holo-rainbow">
                Join the S2U Community! 💕
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Connect with fellow fans, share your love for H2H, and never miss
                an update!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <HologramButton
                  variant="rainbow"
                  size="lg"
                  href="https://weverse.io/hearts2hearts/highlight"
                >
                  Join Weverse
                </HologramButton>
                <HologramButton variant="pink" size="lg" href="/contact">
                  Submit Fanart 🎨
                </HologramButton>
                <HologramButton variant="blue" size="lg" href="/schedule">
                  View Schedule 📅
                </HologramButton>
              </div>
            </div>
          </HologramCard>
        </GlassBackground>
      </div>
    </section>
  );
}

// ============================================
// STEP 6: Replace Interactive Fun Section
// ============================================
export function NewFunActivitiesSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-purple-100 to-pink-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-holo-rainbow">
          Fun Activities for S2U! 🎮
        </h2>
        <p className="text-center text-gray-600 mb-12">
          เล่นเกม ทำแบบทดสอบ และร่วมกิจกรรมสนุกๆ กับ H2H!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quiz Card */}
          <Link href="/quiz">
            <HologramCard intensity="medium" enableLightTrails>
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-2xl font-bold text-holo-purple-blue mb-3">
                  H2H Quiz Game
                </h3>
                <p className="text-gray-600 mb-4">
                  ทดสอบความรู้เกี่ยวกับ H2H! คุณเป็นแฟนคลับตัวจริงหรือเปล่า? 🤔
                </p>
                <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
                  8 คำถาม
                </div>
                <HologramButton variant="purple" size="md" className="w-full">
                  Start Quiz
                </HologramButton>
              </div>
            </HologramCard>
          </Link>

          {/* Personality Test Card */}
          <Link href="/personality-test">
            <HologramCard intensity="medium" enableLightTrails>
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">💕</div>
                <h3 className="text-2xl font-bold text-holo-pink-purple mb-3">
                  Personality Test
                </h3>
                <p className="text-gray-600 mb-4">
                  คุณเหมือนสมาชิก H2H คนไหน? มาหาคำตอบกันเถอะ! ✨
                </p>
                <div className="inline-block px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold mb-4">
                  Which member are you?
                </div>
                <HologramButton variant="pink" size="md" className="w-full">
                  Take Test
                </HologramButton>
              </div>
            </HologramCard>
          </Link>

          {/* Bingo Card */}
          <Link href="/bingo">
            <HologramCard intensity="medium" enableLightTrails>
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-holo-blue-aqua mb-3">
                  Fan Bingo
                </h3>
                <p className="text-gray-600 mb-4">
                  ทำภารกิจแฟนคลับให้ครบและรับรางวัล Bingo! 🏆
                </p>
                <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                  25 ภารกิจ
                </div>
                <HologramButton variant="blue" size="md" className="w-full">
                  Play Bingo
                </HologramButton>
              </div>
            </HologramCard>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// COMPLETE EXAMPLE: Full Page with All Sections
// ============================================
export default function CompletePageExample() {
  const [membersData, setMembersData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch members data
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/members");
        if (response.ok) {
          const data = await response.json();
          setMembersData(data);
        }
      } catch (error) {
        console.error("Error loading members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <NewHeroSection />

      {/* Member Cards Grid */}
      {!isLoading && <NewMemberCardsGrid membersData={membersData} />}

      {/* News Section */}
      <NewNewsSection />

      {/* CTA Section */}
      <NewCTASection />

      {/* Fun Activities Section */}
      <NewFunActivitiesSection />
    </div>
  );
}

