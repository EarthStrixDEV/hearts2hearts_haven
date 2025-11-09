"use client";
import { ReactNode } from "react";

interface GlassBackgroundProps {
  children: ReactNode;
  className?: string;
  blurLevel?: "low" | "medium" | "high";
  tint?: "pink" | "blue" | "purple" | "aqua" | "none";
  borderGlow?: boolean;
  darkMode?: boolean;
}

/**
 * 🎀 Glassmorphism Background Component
 * 
 * พื้นหลังแบบกระจกใส พร้อมเอฟเฟกต์เบลอและ tint สี
 * รองรับ Next.js SSR/CSR และ dark/light mode
 * 
 * @example
 * <GlassBackground blurLevel="high" tint="pink" borderGlow>
 *   <YourContent />
 * </GlassBackground>
 */
export default function GlassBackground({
  children,
  className = "",
  blurLevel = "medium",
  tint = "pink",
  borderGlow = true,
  darkMode = false,
}: GlassBackgroundProps) {
  // Blur levels
  const blurClasses = {
    low: "backdrop-blur-sm",
    medium: "backdrop-blur-md",
    high: "backdrop-blur-xl",
  };

  // Tint overlays with K-POP futuristic colors
  const tintClasses = {
    pink: darkMode
      ? "bg-pink-500/10 border-pink-400/30"
      : "bg-pink-100/40 border-pink-300/50",
    blue: darkMode
      ? "bg-blue-500/10 border-blue-400/30"
      : "bg-blue-100/40 border-blue-300/50",
    purple: darkMode
      ? "bg-purple-500/10 border-purple-400/30"
      : "bg-purple-100/40 border-purple-300/50",
    aqua: darkMode
      ? "bg-cyan-500/10 border-cyan-400/30"
      : "bg-cyan-100/40 border-cyan-300/50",
    none: darkMode
      ? "bg-white/5 border-white/10"
      : "bg-white/30 border-white/50",
  };

  // Border glow effect
  const glowClass = borderGlow
    ? darkMode
      ? "shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:shadow-[0_0_40px_rgba(236,72,153,0.5)]"
      : "shadow-[0_0_20px_rgba(236,72,153,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]"
    : "";

  return (
    <div
      className={`
        relative
        ${blurClasses[blurLevel]}
        ${tintClasses[tint]}
        ${glowClass}
        border-2
        rounded-3xl
        transition-all
        duration-500
        ease-out
        ${className}
      `}
      style={{
        // CSS variables for custom gradients
        // @ts-ignore
        "--glass-gradient": darkMode
          ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 100%)",
      }}
    >
      {/* Glass overlay gradient */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-50"
        style={{
          background: "var(--glass-gradient)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Optional: Animated border shimmer */}
      {borderGlow && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-700"
          style={{
            background: darkMode
              ? "linear-gradient(90deg, transparent, rgba(236,72,153,0.3), transparent)"
              : "linear-gradient(90deg, transparent, rgba(236,72,153,0.2), transparent)",
            animation: "shimmer 3s infinite",
          }}
        />
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

