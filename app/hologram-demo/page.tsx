"use client";
import { useState } from "react";
import GlassBackground from "@/components/GlassBackground";
import HologramCard from "@/components/HologramCard";
import HologramButton from "@/components/HologramButton";

/**
 * 🌈 HOLOGRAM VFX DEMO PAGE
 * 
 * หน้าทดสอบ Components ทั้งหมด
 * เข้าดูได้ที่: /hologram-demo
 */
export default function HologramDemoPage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      {/* Header */}
      <header className="py-8 px-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-holo-rainbow">
            Hologram VFX Demo 🌈
          </h1>
          <HologramButton
            variant="purple"
            size="md"
            onClick={() => setDarkMode(!darkMode)}
            darkMode={darkMode}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </HologramButton>
        </div>
      </header>

      {/* Demo Sections */}
      <div className="max-w-7xl mx-auto py-12 px-4 space-y-16">
        {/* Section 1: Glass Backgrounds */}
        <section>
          <h2 className={`text-3xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
            1. Glass Backgrounds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassBackground blurLevel="low" tint="pink" darkMode={darkMode}>
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Low Blur
                </h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  Pink tint with low blur level
                </p>
              </div>
            </GlassBackground>

            <GlassBackground blurLevel="medium" tint="blue" darkMode={darkMode}>
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Medium Blur
                </h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  Blue tint with medium blur level
                </p>
              </div>
            </GlassBackground>

            <GlassBackground blurLevel="high" tint="purple" borderGlow darkMode={darkMode}>
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  High Blur + Glow
                </h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  Purple tint with high blur and border glow
                </p>
              </div>
            </GlassBackground>
          </div>
        </section>

        {/* Section 2: Hologram Cards */}
        <section>
          <h2 className={`text-3xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
            2. Hologram Cards (Hover to see effects!)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <HologramCard intensity="subtle" enableLightTrails darkMode={darkMode}>
              <div className="p-6 text-center">
                <div className="text-5xl mb-4">✨</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Subtle Intensity
                </h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  Gentle hologram effect with light trails
                </p>
              </div>
            </HologramCard>

            <HologramCard intensity="medium" enableLightTrails darkMode={darkMode}>
              <div className="p-6 text-center">
                <div className="text-5xl mb-4">💫</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Medium Intensity
                </h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  Balanced hologram effect (recommended)
                </p>
              </div>
            </HologramCard>

            <HologramCard intensity="intense" enableLightTrails darkMode={darkMode}>
              <div className="p-6 text-center">
                <div className="text-5xl mb-4">🌟</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Intense Intensity
                </h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  Maximum hologram effect for impact
                </p>
              </div>
            </HologramCard>
          </div>
        </section>

        {/* Section 3: Hologram Buttons */}
        <section>
          <h2 className={`text-3xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
            3. Hologram Buttons
          </h2>
          
          {/* Size Variants */}
          <div className="mb-8">
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
              Size Variants
            </h3>
            <div className="flex flex-wrap gap-4 items-center">
              <HologramButton variant="pink" size="sm" darkMode={darkMode}>
                Small Button
              </HologramButton>
              <HologramButton variant="pink" size="md" darkMode={darkMode}>
                Medium Button
              </HologramButton>
              <HologramButton variant="pink" size="lg" darkMode={darkMode}>
                Large Button
              </HologramButton>
            </div>
          </div>

          {/* Color Variants */}
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
              Color Variants
            </h3>
            <div className="flex flex-wrap gap-4">
              <HologramButton variant="pink" size="md" darkMode={darkMode}>
                💕 Pink
              </HologramButton>
              <HologramButton variant="blue" size="md" darkMode={darkMode}>
                💙 Blue
              </HologramButton>
              <HologramButton variant="purple" size="md" darkMode={darkMode}>
                💜 Purple
              </HologramButton>
              <HologramButton variant="aqua" size="md" darkMode={darkMode}>
                💚 Aqua
              </HologramButton>
              <HologramButton variant="rainbow" size="md" darkMode={darkMode}>
                🌈 Rainbow
              </HologramButton>
            </div>
          </div>
        </section>

        {/* Section 4: Combined Effects */}
        <section>
          <h2 className={`text-3xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
            4. Combined Effects (Glass + Hologram)
          </h2>
          <GlassBackground blurLevel="high" tint="purple" borderGlow darkMode={darkMode}>
            <HologramCard intensity="intense" enableLightTrails darkMode={darkMode}>
              <div className="p-12 text-center">
                <h3 className="text-4xl font-bold text-holo-rainbow mb-4">
                  Ultimate K-POP Effect! 🎀
                </h3>
                <p className={`text-lg mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Glass background + Hologram card + Rainbow gradient text
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <HologramButton variant="pink" size="lg" darkMode={darkMode}>
                    Click Me
                  </HologramButton>
                  <HologramButton variant="rainbow" size="lg" darkMode={darkMode}>
                    Or Me!
                  </HologramButton>
                </div>
              </div>
            </HologramCard>
          </GlassBackground>
        </section>

        {/* Section 5: CSS Utility Classes */}
        <section>
          <h2 className={`text-3xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
            5. CSS Utility Classes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Text Gradients */}
            <div className={`p-6 rounded-2xl ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                Text Gradients
              </h3>
              <p className="text-holo-rainbow text-2xl font-bold mb-2">
                Rainbow Gradient
              </p>
              <p className="text-holo-pink-purple text-2xl font-bold mb-2">
                Pink-Purple Gradient
              </p>
              <p className="text-holo-blue-aqua text-2xl font-bold">
                Blue-Aqua Gradient
              </p>
            </div>

            {/* Background Gradients */}
            <div className={`p-6 rounded-2xl ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                Background Gradients
              </h3>
              <div className="space-y-2">
                <div className="bg-holo-rainbow p-4 rounded-lg text-white font-bold text-center">
                  Rainbow Background
                </div>
                <div className="bg-holo-pink-purple p-4 rounded-lg text-white font-bold text-center">
                  Pink-Purple Background
                </div>
                <div className="bg-holo-blue-aqua p-4 rounded-lg text-white font-bold text-center">
                  Blue-Aqua Background
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Real-World Examples */}
        <section>
          <h2 className={`text-3xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
            6. Real-World Examples
          </h2>
          
          {/* Member Card Example */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <HologramCard intensity="medium" enableLightTrails darkMode={darkMode}>
              <div className="p-6">
                <div className="w-full aspect-square bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mb-4 flex items-center justify-center text-6xl">
                  👑
                </div>
                <h3 className={`text-xl font-bold mb-2 text-center ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Jiwoo
                </h3>
                <p className="text-holo-pink-purple text-center font-semibold mb-4">
                  Leader • Main Vocalist
                </p>
                <HologramButton variant="pink" size="sm" className="w-full" darkMode={darkMode}>
                  View Profile
                </HologramButton>
              </div>
            </HologramCard>

            <HologramCard intensity="medium" enableLightTrails darkMode={darkMode}>
              <div className="p-6">
                <div className="w-full aspect-square bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full mb-4 flex items-center justify-center text-6xl">
                  💃
                </div>
                <h3 className={`text-xl font-bold mb-2 text-center ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Carmen
                </h3>
                <p className="text-holo-blue-aqua text-center font-semibold mb-4">
                  Main Dancer • Rapper
                </p>
                <HologramButton variant="blue" size="sm" className="w-full" darkMode={darkMode}>
                  View Profile
                </HologramButton>
              </div>
            </HologramCard>

            <HologramCard intensity="medium" enableLightTrails darkMode={darkMode}>
              <div className="p-6">
                <div className="w-full aspect-square bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mb-4 flex items-center justify-center text-6xl">
                  🎤
                </div>
                <h3 className={`text-xl font-bold mb-2 text-center ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Yuha
                </h3>
                <p className="text-holo-pink-purple text-center font-semibold mb-4">
                  Lead Vocalist • Visual
                </p>
                <HologramButton variant="purple" size="sm" className="w-full" darkMode={darkMode}>
                  View Profile
                </HologramButton>
              </div>
            </HologramCard>
          </div>

          {/* News Card Example */}
          <HologramCard intensity="subtle" enableLightTrails darkMode={darkMode}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-semibold">
                  Performance
                </span>
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Oct 25, 2025
                </span>
              </div>
              <h3 className={`text-2xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>
                H2H Stuns at Music Core! 🎀
              </h3>
              <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                The girls performed FOCUS in ethereal pink ballet outfits. Carmen's ending fairy had 376+ likes on X!
              </p>
              <HologramButton variant="pink" size="sm" darkMode={darkMode}>
                View Fancam →
              </HologramButton>
            </div>
          </HologramCard>
        </section>

        {/* Footer */}
        <footer className="text-center py-12 border-t border-gray-200">
          <p className="text-holo-rainbow text-2xl font-bold mb-4">
            Ready to use these components? 🎉
          </p>
          <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Check the documentation files for complete guides and examples!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <HologramButton variant="pink" size="lg" href="/" darkMode={darkMode}>
              Back to Home
            </HologramButton>
            <HologramButton variant="rainbow" size="lg" darkMode={darkMode}>
              View Docs
            </HologramButton>
          </div>
        </footer>
      </div>
    </div>
  );
}

