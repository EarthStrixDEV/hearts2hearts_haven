"use client";
import { ReactNode, useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface HologramCardProps {
  children: ReactNode;
  className?: string;
  intensity?: "subtle" | "medium" | "intense";
  enableLightTrails?: boolean;
  darkMode?: boolean;
  disableOnMobile?: boolean;
}

/**
 * 🌈 Hologram Interactive Card Component
 * 
 * การ์ดแบบ hologram ที่เปลี่ยนสีตามตำแหน่งเมาส์
 * เหมือน K-POP photocard hologram (aespa/NMIXX vibes)
 * 
 * Features:
 * - Mouse-reactive RGB gradient
 * - Neon light ridge shadows
 * - Light trails on hover
 * - Smooth animations with reduced-motion support
 * - Mobile-friendly (can disable heavy effects)
 * 
 * @example
 * <HologramCard intensity="intense" enableLightTrails>
 *   <YourContent />
 * </HologramCard>
 */
export default function HologramCard({
  children,
  className = "",
  intensity = "medium",
  enableLightTrails = true,
  darkMode = false,
  disableOnMobile = true,
}: HologramCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for mouse movement
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Disable heavy effects on mobile if requested
  const effectsEnabled = !(disableOnMobile && isMobile) && !prefersReducedMotion;

  // Handle mouse move for hologram effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!effectsEnabled || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (subtle 3D tilt)
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);

    // Update mouse position for gradient
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (effectsEnabled) {
      rotateX.set(0);
      rotateY.set(0);
    }
  };

  // Intensity levels for hologram effect
  const intensityValues = {
    subtle: { opacity: 0.3, blur: "blur-sm" },
    medium: { opacity: 0.5, blur: "blur-md" },
    intense: { opacity: 0.7, blur: "blur-lg" },
  };

  const currentIntensity = intensityValues[intensity];

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative
        rounded-3xl
        overflow-hidden
        transition-all
        duration-500
        ${className}
      `}
      style={
        effectsEnabled
          ? {
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              perspective: 1000,
            }
          : {}
      }
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={effectsEnabled ? { scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
    >
      {/* Base card with neon border */}
      <div
        className={`
          relative
          w-full
          h-full
          rounded-3xl
          border-2
          ${
            darkMode
              ? "bg-gray-900/80 border-pink-500/30"
              : "bg-white/90 border-pink-300/50"
          }
          shadow-2xl
          transition-all
          duration-500
        `}
        style={{
          boxShadow: isHovered && effectsEnabled
            ? darkMode
              ? "0 0 40px rgba(236, 72, 153, 0.6), 0 0 80px rgba(59, 130, 246, 0.4), inset 0 0 30px rgba(236, 72, 153, 0.1)"
              : "0 0 30px rgba(236, 72, 153, 0.4), 0 0 60px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(236, 72, 153, 0.1)"
            : darkMode
            ? "0 10px 40px rgba(0, 0, 0, 0.5)"
            : "0 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Holographic gradient overlay (mouse-reactive) */}
        {effectsEnabled && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              background: isHovered
                ? `radial-gradient(circle at ${mouseX.get()}px ${mouseY.get()}px, 
                    rgba(236, 72, 153, ${currentIntensity.opacity}) 0%, 
                    rgba(59, 130, 246, ${currentIntensity.opacity * 0.8}) 25%, 
                    rgba(168, 85, 247, ${currentIntensity.opacity * 0.6}) 50%, 
                    rgba(6, 182, 212, ${currentIntensity.opacity * 0.4}) 75%, 
                    transparent 100%)`
                : "none",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease-out",
            }}
          />
        )}

        {/* Holographic foil effect (static rainbow gradient) */}
        <div
          className={`
            absolute
            inset-0
            pointer-events-none
            rounded-3xl
            opacity-0
            hover:opacity-100
            transition-opacity
            duration-700
            ${currentIntensity.blur}
          `}
          style={{
            background: darkMode
              ? "linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(59,130,246,0.2) 25%, rgba(168,85,247,0.2) 50%, rgba(6,182,212,0.2) 75%, rgba(236,72,153,0.2) 100%)"
              : "linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(59,130,246,0.15) 25%, rgba(168,85,247,0.15) 50%, rgba(6,182,212,0.15) 75%, rgba(236,72,153,0.15) 100%)",
            backgroundSize: "200% 200%",
            animation: isHovered ? "hologram-shift 3s ease infinite" : "none",
          }}
        />

        {/* Light trails effect */}
        {enableLightTrails && effectsEnabled && isHovered && (
          <>
            {/* Trail 1 - Pink */}
            <motion.div
              className="absolute top-0 left-0 w-full h-1 pointer-events-none"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "100%", opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.5,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.8), transparent)",
                filter: "blur(4px)",
              }}
            />

            {/* Trail 2 - Blue */}
            <motion.div
              className="absolute bottom-0 right-0 w-full h-1 pointer-events-none"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: "-100%", opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.5,
                delay: 0.3,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.8), transparent)",
                filter: "blur(4px)",
              }}
            />

            {/* Trail 3 - Vertical Aqua */}
            <motion.div
              className="absolute top-0 right-0 w-1 h-full pointer-events-none"
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: "100%", opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.5,
                delay: 0.6,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.8), transparent)",
                filter: "blur(4px)",
              }}
            />
          </>
        )}

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes hologram-shift {
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

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
}

