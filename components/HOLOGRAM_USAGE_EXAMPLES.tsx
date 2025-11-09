/**
 * 🎀 HOLOGRAM VFX COMPONENTS - USAGE EXAMPLES
 * 
 * วิธีใช้งาน Components แบบ K-POP Futuristic
 * สำหรับ Hearts2Hearts Landing Page
 * 
 * Components:
 * 1. GlassBackground - พื้นหลังแบบกระจกใส
 * 2. HologramCard - การ์ดแบบ hologram interactive
 * 3. HologramButton - ปุ่มแบบ hologram
 */

"use client";
import GlassBackground from "./GlassBackground";
import HologramCard from "./HologramCard";
import HologramButton from "./HologramButton";
import Image from "next/image";

// ============================================
// EXAMPLE 1: Basic Glass Background
// ============================================
export function Example1_BasicGlass() {
  return (
    <GlassBackground blurLevel="medium" tint="pink">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to H2H! 💕
        </h2>
        <p className="text-gray-600">
          This content is inside a glassmorphism background
        </p>
      </div>
    </GlassBackground>
  );
}

// ============================================
// EXAMPLE 2: Hologram Card with Member Info
// ============================================
export function Example2_MemberCard() {
  return (
    <HologramCard intensity="medium" enableLightTrails>
      <div className="p-6">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-4xl">
            👑
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Jiwoo</h3>
          <p className="text-gray-600">Leader • Main Vocalist</p>
        </div>
      </div>
    </HologramCard>
  );
}

// ============================================
// EXAMPLE 3: Glass + Hologram Combined
// ============================================
export function Example3_CombinedEffect() {
  return (
    <GlassBackground blurLevel="high" tint="purple" borderGlow>
      <HologramCard intensity="intense" enableLightTrails={false}>
        <div className="p-8">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Latest Comeback: FOCUS 🎵
          </h3>
          <p className="text-gray-700 mb-6">
            Stream our new single now on all platforms!
          </p>
          <HologramButton variant="rainbow" size="lg">
            Listen Now
          </HologramButton>
        </div>
      </HologramCard>
    </GlassBackground>
  );
}

// ============================================
// EXAMPLE 4: Hero Section with Glass Background
// ============================================
export function Example4_HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://pbs.twimg.com/media/G4KZGz4WIAAqjFe?format=jpg&name=large')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Glass overlay */}
      <div className="relative z-10 max-w-4xl">
        <GlassBackground blurLevel="high" tint="pink" borderGlow>
          <div className="p-12 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Hearts2Hearts
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              8 Angels • Infinite Hearts • One Dream 💕
            </p>
            <div className="flex gap-4 justify-center">
              <HologramButton variant="pink" size="lg">
                Meet the Members
              </HologramButton>
              <HologramButton variant="blue" size="lg">
                Watch MVs
              </HologramButton>
            </div>
          </div>
        </GlassBackground>
      </div>
    </section>
  );
}

// ============================================
// EXAMPLE 5: Member Grid with Hologram Cards
// ============================================
export function Example5_MemberGrid() {
  const members = [
    { name: "Jiwoo", role: "Leader", icon: "👑", color: "pink" },
    { name: "Carmen", role: "Main Dancer", icon: "💃", color: "blue" },
    { name: "Yuha", role: "Vocalist", icon: "🎤", color: "purple" },
    { name: "Mina", role: "Rapper", icon: "🎵", color: "aqua" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
      {members.map((member, index) => (
        <HologramCard
          key={member.name}
          intensity="medium"
          enableLightTrails
          className="transform hover:scale-105 transition-transform"
        >
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">{member.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {member.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{member.role}</p>
            <HologramButton
              variant={member.color as any}
              size="sm"
              className="w-full"
            >
              View Profile
            </HologramButton>
          </div>
        </HologramCard>
      ))}
    </div>
  );
}

// ============================================
// EXAMPLE 6: Dark Mode Support
// ============================================
export function Example6_DarkMode({ darkMode = false }: { darkMode?: boolean }) {
  return (
    <div className={darkMode ? "bg-gray-900 min-h-screen p-8" : "bg-white min-h-screen p-8"}>
      <GlassBackground blurLevel="medium" tint="blue" darkMode={darkMode}>
        <HologramCard intensity="intense" darkMode={darkMode}>
          <div className="p-8">
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
              Dark Mode Example 🌙
            </h2>
            <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Both components support dark mode automatically!
            </p>
            <HologramButton variant="purple" size="md" darkMode={darkMode}>
              Toggle Theme
            </HologramButton>
          </div>
        </HologramCard>
      </GlassBackground>
    </div>
  );
}

// ============================================
// EXAMPLE 7: News/Update Card
// ============================================
export function Example7_NewsCard() {
  return (
    <HologramCard intensity="subtle" enableLightTrails>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-semibold">
            Performance
          </span>
          <span className="text-gray-500 text-sm">Oct 25, 2025</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          H2H Stuns at Music Core! 🎀
        </h3>
        <p className="text-gray-600 mb-4">
          The girls performed FOCUS in ethereal pink ballet outfits.
        </p>
        <HologramButton variant="pink" size="sm">
          Read More →
        </HologramButton>
      </div>
    </HologramCard>
  );
}

// ============================================
// EXAMPLE 8: CTA Section with All Effects
// ============================================
export function Example8_CTASection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        <GlassBackground blurLevel="high" tint="purple" borderGlow>
          <div className="p-12">
            <HologramCard intensity="intense" enableLightTrails>
              <div className="p-8 text-center">
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Join the S2U Community! 💕
                </h2>
                <p className="text-gray-700 text-lg mb-8">
                  Connect with fellow fans and never miss an update!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <HologramButton variant="rainbow" size="lg">
                    Join Weverse
                  </HologramButton>
                  <HologramButton variant="pink" size="lg">
                    Follow on Twitter
                  </HologramButton>
                  <HologramButton variant="blue" size="lg">
                    Subscribe
                  </HologramButton>
                </div>
              </div>
            </HologramCard>
          </div>
        </GlassBackground>
      </div>
    </section>
  );
}

// ============================================
// EXAMPLE 9: Mobile-Friendly (Disabled Effects)
// ============================================
export function Example9_MobileFriendly() {
  return (
    <HologramCard
      intensity="subtle"
      enableLightTrails={false}
      disableOnMobile={true}
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Mobile Optimized ✨
        </h3>
        <p className="text-gray-600">
          Heavy effects are disabled on mobile for better performance!
        </p>
      </div>
    </HologramCard>
  );
}

// ============================================
// EXAMPLE 10: Integration in page.tsx
// ============================================
export function Example10_PageIntegration() {
  return (
    <>
      {/* Replace existing hero section */}
      <section className="relative py-20 px-4">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://pbs.twimg.com/media/G4KZGz4WIAAqjFe?format=jpg&name=large')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <GlassBackground blurLevel="high" tint="pink" borderGlow>
            <div className="p-12 text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to Hearts2Hearts Haven! 💕
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Join S2U in celebrating our 8 talented girls ✨
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <HologramButton variant="pink" size="lg" href="/members">
                  Meet the Members
                </HologramButton>
                <HologramButton variant="blue" size="lg" href="/music">
                  Watch MVs
                </HologramButton>
                <HologramButton variant="purple" size="lg" href="/gallery">
                  Photo Gallery
                </HologramButton>
              </div>
            </div>
          </GlassBackground>
        </div>
      </section>

      {/* Wrap member cards in HologramCard */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Meet All 8 Members
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Wrap each member card */}
            <HologramCard intensity="medium" enableLightTrails>
              {/* Your existing member card content */}
              <div className="p-6">
                {/* ... member content ... */}
              </div>
            </HologramCard>
          </div>
        </div>
      </section>
    </>
  );
}

