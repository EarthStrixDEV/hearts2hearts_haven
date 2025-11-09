'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HologramButton from './HologramButton';

interface Member {
  name: string;
  korean: string;
  role: string;
  icon: string;
  img: string;
  birth: string;
  facts: string[];
  profile: string;
}

interface Enhanced3DMemberCardProps {
  member: Member;
  index: number;
  isVisible: boolean;
}

export default function Enhanced3DMemberCard({ 
  member, 
  index, 
  isVisible 
}: Enhanced3DMemberCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      // Calculate rotation values (limited range for subtle effect)
      const rotateX = (mouseY / rect.height) * -15; // Max 15 degrees
      const rotateY = (mouseX / rect.width) * 15;   // Max 15 degrees
      
      setMousePosition({ x: rotateY, y: rotateX });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      card.addEventListener('mousemove', handleMouseMove);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setMousePosition({ x: 0, y: 0 });
      card.removeEventListener('mousemove', handleMouseMove);
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <Link href={member.profile}>
      <div
        ref={cardRef}
        className={`
          relative group cursor-pointer
          transition-all duration-500 ease-out
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          ${isHovered ? "scale-105" : "scale-100"}
        `}
        style={{
          transitionDelay: `${index * 100 + 200}ms`,
          transform: `
            perspective(1000px) 
            rotateX(${mousePosition.y}deg) 
            rotateY(${mousePosition.x}deg)
            ${isHovered ? "translateZ(20px)" : "translateZ(0px)"}
          `,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Card Container with Glass Effect */}
        <div className="
          relative bg-white/90 backdrop-blur-sm 
          rounded-3xl p-6 shadow-2xl 
          border border-white/50
          overflow-hidden
          transition-all duration-500
          hover:shadow-3xl hover:bg-white/95
        ">
          
          {/* Holographic Border Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Role Icon Badge - Properly Positioned */}
          <div className="
            absolute top-4 right-4 
            bg-gradient-to-br from-pink-400 to-purple-500 
            text-white text-lg
            w-12 h-12 rounded-full 
            flex items-center justify-center 
            shadow-lg z-20
            transform transition-all duration-300
            group-hover:scale-110 group-hover:rotate-12
          ">
            <span className="text-xl leading-none">{member.icon}</span>
          </div>

          {/* Sparkle Effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute top-6 left-6 w-2 h-2 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" />
            <div className="absolute top-12 right-12 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500" />
            <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-700" />
          </div>

          {/* Member Image Container */}
          <div className="relative mb-6 flex justify-center">
            <div className="relative">
              {/* Image Glow Ring */}
              <div className="
                absolute inset-0 rounded-full 
                bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 
                opacity-0 group-hover:opacity-50 
                transition-opacity duration-500 
                blur-md scale-110
              " />
              
              {/* Main Image */}
              <div className="relative">
                <Image
                  src={member.img}
                  alt={member.name}
                  width={180}
                  height={180}
                  className="
                    w-44 h-44 rounded-full object-cover 
                    shadow-xl ring-4 ring-pink-100/50
                    transition-all duration-500
                    group-hover:ring-pink-200/70 group-hover:shadow-2xl
                  "
                  unoptimized
                />
                
                {/* Hover Overlay */}
                <div className="
                  absolute inset-0 rounded-full 
                  bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-blue-400/20 
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-500
                " />
              </div>

              {/* Floating Hearts - Better Positioned */}
              <div className="absolute inset-0 pointer-events-none">
                <span className="
                  absolute -top-2 left-1/4 text-pink-300 
                  opacity-0 group-hover:opacity-100 
                  transition-all duration-500 text-xl
                  group-hover:animate-bounce
                " style={{ animationDelay: '0ms' }}>
                  💕
                </span>
                <span className="
                  absolute top-2 -right-2 text-pink-400 
                  opacity-0 group-hover:opacity-100 
                  transition-all duration-500 text-lg
                  group-hover:animate-bounce
                " style={{ animationDelay: '200ms' }}>
                  💗
                </span>
                <span className="
                  absolute -bottom-2 left-1/3 text-pink-200 
                  opacity-0 group-hover:opacity-100 
                  transition-all duration-500 text-base
                  group-hover:animate-bounce
                " style={{ animationDelay: '400ms' }}>
                  💖
                </span>
              </div>
            </div>
          </div>

          {/* Member Info - Perfectly Centered and Symmetrical */}
          <div className="text-center space-y-3">
            {/* Name */}
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-gray-800 leading-tight">
                {member.name}
              </h3>
              <p className="text-gray-500 text-sm font-medium">
                {member.korean}
              </p>
            </div>

            {/* Role */}
            <div className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full inline-block">
              <p className="text-pink-600 font-semibold text-sm">
                {member.role}
              </p>
            </div>

            {/* Birth Info */}
            <p className="text-gray-400 text-xs">
              Born {member.birth}
            </p>

            {/* Quick Fact - Enhanced Design */}
            <div className="
              bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 
              rounded-xl p-4 mx-2
              border border-pink-100/50
              min-h-[70px] 
              flex items-center justify-center
              transition-all duration-300
              group-hover:shadow-md group-hover:scale-105
            ">
              <p className="text-xs italic text-gray-600 leading-relaxed text-center">
                {member.facts[0]}
              </p>
            </div>

            {/* View Profile Button */}
            <div className="pt-2">
              <HologramButton 
                variant="pink" 
                size="sm" 
                className="w-full transform transition-all duration-300 group-hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>View Profile</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </HologramButton>
            </div>
          </div>

          {/* 3D Depth Shadow */}
          <div 
            className="
              absolute inset-0 rounded-3xl 
              bg-gradient-to-br from-gray-900/5 to-gray-900/20 
              opacity-0 group-hover:opacity-100 
              transition-opacity duration-500
              pointer-events-none
            "
            style={{
              transform: 'translateZ(-10px)',
            }}
          />
        </div>
      </div>
    </Link>
  );
}
