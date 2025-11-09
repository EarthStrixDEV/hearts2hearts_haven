"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MemberCard3DProps {
  member: {
    name: string;
    koreanName: string;
    position: string;
    birthYear: number;
    nationality: string;
    imageUrl: string;
    quickFact: string;
    icon: string;
  };
  biasName: string | null;
  darkMode: boolean;
  onToggleBias: (name: string) => void;
  onViewProfile: (member: any) => void;
  index: number;
  isVisible: boolean;
}

export default function MemberCard3D({
  member,
  biasName,
  darkMode,
  onToggleBias,
  onViewProfile,
  index,
  isVisible,
}: MemberCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const router = useRouter();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -15;
    const rotateYValue = ((x - centerX) / centerX) * 15;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleCardClick = () => {
    router.push(`/members/${member.name.toLowerCase()}`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
      } rounded-3xl p-6 cursor-pointer text-center group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 ${
        biasName === member.name
          ? "border-pink-400 ring-4 ring-pink-200"
          : darkMode
          ? "border-gray-700"
          : "border-transparent"
      } ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: `${index * 100 + 400}ms`,
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${
          rotateX !== 0 || rotateY !== 0 ? 1.05 : 1
        })`,
        transition: "transform 0.1s ease-out, box-shadow 0.3s ease",
      }}
    >
      {/* Bias Badge */}
      {biasName === member.name && (
        <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse z-10">
          My Bias 💖
        </div>
      )}

      {/* Profile Image with Floating Hearts Effect */}
      <div
        className="relative mb-4 group/profile"
        onClick={handleCardClick}
      >
        <div className="relative">
          <Image
            src={member.imageUrl}
            alt={member.name}
            width={112}
            height={112}
            className="w-28 h-28 rounded-full mx-auto object-cover group-hover/profile:scale-110 transition-transform duration-500 shadow-xl ring-4 ring-white/50"
          />
          {/* Floating hearts on hover */}
          <div className="absolute inset-0 pointer-events-none">
            <span className="absolute top-0 left-1/4 text-pink-300 opacity-0 group-hover/profile:opacity-100 group-hover/profile:animate-float-up-1 transition-opacity text-2xl">
              💕
            </span>
            <span className="absolute top-2 right-1/4 text-pink-400 opacity-0 group-hover/profile:opacity-100 group-hover/profile:animate-float-up-2 transition-opacity text-xl">
              💗
            </span>
            <span className="absolute top-4 left-1/3 text-pink-200 opacity-0 group-hover/profile:opacity-100 group-hover/profile:animate-float-up-3 transition-opacity text-lg">
              💖
            </span>
          </div>
        </div>

        {/* Icon Badge */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-pink-400 to-purple-400 text-white text-2xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white group-hover/profile:scale-110 transition-transform">
          {member.icon}
        </div>
      </div>

      {/* Member Info */}
      <div className="mt-6" onClick={handleCardClick}>
        <h3
          className={`text-2xl font-bold mb-1 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {member.name}
        </h3>
        <p
          className={`text-sm mb-3 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {member.koreanName}
        </p>

        {/* Position - Clear Line Break */}
        <p className="text-blue-500 font-semibold text-sm mb-3 leading-relaxed">
          {member.position}
        </p>

        {/* Birth Year & Nationality - Clear Separation */}
        <div
          className={`flex flex-col gap-1 text-xs mb-4 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <span>Born {member.birthYear}</span>
          <span>{member.nationality}</span>
        </div>

        {/* Quick Fact */}
        <div
          className={`text-xs italic mb-4 px-2 py-2 rounded-lg ${
            darkMode
              ? "bg-gray-700/50 text-gray-300"
              : "bg-pink-50 text-gray-600"
          }`}
        >
          {member.quickFact}
        </div>

        {/* View Profile Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile(member);
          }}
          className={`mt-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 mx-auto group-hover:gap-3 ${
            darkMode
              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
              : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
          } shadow-lg hover:shadow-xl`}
        >
          View Profile
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
        </button>
      </div>

      {/* Heart Toggle for Bias Selection */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleBias(member.name);
        }}
        className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-300 ${
          biasName === member.name
            ? "bg-pink-400 text-white scale-110"
            : darkMode
            ? "bg-gray-700 text-gray-400 hover:bg-pink-400 hover:text-white"
            : "bg-gray-100 text-gray-400 hover:bg-pink-400 hover:text-white"
        }`}
        aria-label="Set as bias"
      >
        <svg
          className="w-5 h-5"
          fill={biasName === member.name ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    </div>
  );
}

