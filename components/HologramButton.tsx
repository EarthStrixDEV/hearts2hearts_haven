"use client";
import { ReactNode, useState } from "react";
import { motion } from "framer-motion";

interface HologramButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "pink" | "blue" | "purple" | "aqua" | "rainbow";
  size?: "sm" | "md" | "lg";
  darkMode?: boolean;
  className?: string;
}

/**
 * 🎮 Hologram Button Component
 * 
 * ปุ่มแบบ hologram พร้อมเอฟเฟกต์แสง RGB
 * เหมาะสำหรับ CTA buttons ในธีม K-POP futuristic
 * 
 * @example
 * <HologramButton variant="rainbow" size="lg" onClick={handleClick}>
 *   Click Me!
 * </HologramButton>
 */
export default function HologramButton({
  children,
  onClick,
  href,
  variant = "pink",
  size = "md",
  darkMode = false,
  className = "",
}: HologramButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Size variants
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Color variants with holographic effect
  const variantStyles = {
    pink: {
      base: darkMode
        ? "bg-gradient-to-r from-pink-600 to-pink-500 border-pink-400"
        : "bg-gradient-to-r from-pink-500 to-pink-400 border-pink-300",
      glow: "shadow-[0_0_20px_rgba(236,72,153,0.5),0_0_40px_rgba(236,72,153,0.3)]",
      hoverGlow: "shadow-[0_0_30px_rgba(236,72,153,0.7),0_0_60px_rgba(236,72,153,0.5)]",
    },
    blue: {
      base: darkMode
        ? "bg-gradient-to-r from-blue-600 to-blue-500 border-blue-400"
        : "bg-gradient-to-r from-blue-500 to-blue-400 border-blue-300",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.5),0_0_40px_rgba(59,130,246,0.3)]",
      hoverGlow: "shadow-[0_0_30px_rgba(59,130,246,0.7),0_0_60px_rgba(59,130,246,0.5)]",
    },
    purple: {
      base: darkMode
        ? "bg-gradient-to-r from-purple-600 to-purple-500 border-purple-400"
        : "bg-gradient-to-r from-purple-500 to-purple-400 border-purple-300",
      glow: "shadow-[0_0_20px_rgba(168,85,247,0.5),0_0_40px_rgba(168,85,247,0.3)]",
      hoverGlow: "shadow-[0_0_30px_rgba(168,85,247,0.7),0_0_60px_rgba(168,85,247,0.5)]",
    },
    aqua: {
      base: darkMode
        ? "bg-gradient-to-r from-cyan-600 to-cyan-500 border-cyan-400"
        : "bg-gradient-to-r from-cyan-500 to-cyan-400 border-cyan-300",
      glow: "shadow-[0_0_20px_rgba(6,182,212,0.5),0_0_40px_rgba(6,182,212,0.3)]",
      hoverGlow: "shadow-[0_0_30px_rgba(6,182,212,0.7),0_0_60px_rgba(6,182,212,0.5)]",
    },
    rainbow: {
      base: "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 border-pink-400",
      glow: "shadow-[0_0_20px_rgba(236,72,153,0.5),0_0_40px_rgba(168,85,247,0.3)]",
      hoverGlow: "shadow-[0_0_30px_rgba(236,72,153,0.7),0_0_60px_rgba(168,85,247,0.5)]",
    },
  };

  const currentVariant = variantStyles[variant];

  const ButtonContent = (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative
        ${sizeClasses[size]}
        ${currentVariant.base}
        ${isHovered ? currentVariant.hoverGlow : currentVariant.glow}
        text-white
        font-bold
        rounded-full
        border-2
        overflow-hidden
        transition-all
        duration-300
        transform
        hover:scale-105
        active:scale-95
        ${className}
      `}
      whileTap={{ scale: 0.95 }}
      style={{
        backgroundSize: variant === "rainbow" ? "200% 200%" : "100% 100%",
        animation: variant === "rainbow" && isHovered ? "rainbow-shift 2s ease infinite" : "none",
      }}
    >
      {/* Holographic shimmer overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ x: "-100%" }}
        animate={isHovered ? { x: "100%" } : { x: "-100%" }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
        }}
      />

      {/* Button content */}
      <span className="relative z-10 drop-shadow-lg">{children}</span>

      {/* Particle effects on hover */}
      {isHovered && (
        <>
          <motion.span
            className="absolute top-1/2 left-1/4 w-1 h-1 bg-white rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: -20 }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.2 }}
          />
          <motion.span
            className="absolute top-1/2 right-1/4 w-1 h-1 bg-white rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: -20 }}
            transition={{ duration: 0.8, delay: 0.3, repeat: Infinity, repeatDelay: 0.2 }}
          />
        </>
      )}

      <style jsx>{`
        @keyframes rainbow-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </motion.button>
  );

  // If href is provided, wrap in anchor tag
  if (href) {
    return (
      <a href={href} className="inline-block">
        {ButtonContent}
      </a>
    );
  }

  return ButtonContent;
}

