"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

// Member data interface
interface Member {
  name: string;
  korean: string;
  role: string;
  birth: string;
  quote: string;
  img: string;
  profile: string;
  koreanName: string;
  icon: string;
  position: string;
  birthYear: number;
  nationality: string;
  traineeYears: string;
  emoji: string;
  color: string;
  backstory: string;
  facts: string[];
  imageUrl: string;
  quickFact: string;
}

interface CarouselImage {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  category: string;
  order: number;
  isActive: boolean;
}

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [membersData, setMembersData] = useState<Member[]>([]);
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCarouselLoading, setIsCarouselLoading] = useState(true);

  // Fetch members data from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/members');
        if (response.ok) {
          const data = await response.json();
          // Transform API data to component format
          const transformedData: Member[] = data.map((member: Member) => ({
            name: member.name,
            korean: member.koreanName,
            role: member.position,
            birth: `${member.birthYear} • ${member.nationality}`,
            quote: member.quote,
            img: member.imageUrl,
            profile: "/members",
            icon: member.icon || member.emoji,
            facts: member.facts || [member.quickFact || ""],
          }));
          setMembersData(transformedData);
        } else {
          console.error('Failed to load members data');
        }
      } catch (error) {
        console.error('Error loading members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Fetch carousel images from API
  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const response = await fetch('/api/carousel');
        if (response.ok) {
          const data = await response.json();
          setCarouselImages(data);
        } else {
          console.error('Failed to load carousel images');
        }
      } catch (error) {
        console.error('Error loading carousel images:', error);
      } finally {
        setIsCarouselLoading(false);
      }
    };

    fetchCarouselImages();
  }, []);

  // Get member of the day based on date (computed once on mount)
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const memberIndex = membersData.length > 0 ? dayOfYear % membersData.length : 0;
  const todayMember = membersData[memberIndex] || null;
  const randomFactIndex = todayMember ? dayOfYear % todayMember.facts.length : 0; // Rotate through facts based on day

  // Trigger animation
  useEffect(() => {
    if (membersData.length > 0) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [membersData]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background with member images - blurred */}
        {/* 
          🎀 วิธีเปลี่ยนเป็นรูปน้องๆ H2H จริง:
          1. วางรูปกลุ่มน้องๆ ใน public/images/h2h-group.jpg
          2. เปลี่ยน URL ด้านล่างจาก unsplash เป็น '/images/h2h-group.jpg'
          3. ปรับค่า blur(3px) ตามต้องการ (2px-5px)
          4. ดูรายละเอียดใน CUSTOMIZE.md 💕
        */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              url('https://pbs.twimg.com/media/G4KZGz4WIAAqjFe?format=jpg&name=large')
            `,
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
        <div className="absolute top-40 right-10 text-blue-200 text-4xl opacity-20 z-10">
          💗
        </div>

        <div className="max-w-7xl mx-auto relative z-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-linear-to-r from-sky-400 to-sky-500 bg-clip-text text-transparent drop-shadow-lg drop-shadow-white">
              Welcome to Hearts2Hearts Haven!
            </h1>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">💕</h1>
            <p className="text-xl md:text-2xl font-extrabold bg-linear-to-r from-sky-400 to-sky-500 bg-clip-text text-transparent drop-shadow-md drop-shadow-white">
              ยินดีต้อนรับสู่บ้าน H2H!
            </p>
            <p className="text-lg font-extrabold bg-linear-to-r from-sky-400 to-sky-500 bg-clip-text text-transparent drop-shadow-md drop-shadow-white">
              Join S2U in celebrating our 8 talented girls ✨
            </p>
          </div>

          {/* Video Embed */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="card-pastel overflow-hidden shadow-2xl">
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/rfL21nFvEsc"
                  title="Hearts2Hearts - FOCUS Performance"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6 bg-white text-center">
                <h3 className="text-2xl font-bold text-blue-600 mb-2 drop-shadow-md">
                  FOCUS - Music Core Performance 🎀
                </h3>
                <p className="text-gray-600 drop-shadow-sm">
                  Watch our girls shine on stage! (Oct 25, 2025)
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Link
              href="/members"
              className="card-pastel p-8 text-center group shadow-xl"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">
                👭
              </div>
              <h3 className="text-xl font-bold text-blue-600 mb-2 drop-shadow-md">
                Meet the Members
              </h3>
              <p className="text-gray-600 drop-shadow-sm">
                Get to know Jiwoo, Carmen, Yuha & more!
              </p>
            </Link>

            <Link
              href="/gallery"
              className="card-pastel p-8 text-center group shadow-xl"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">
                📸
              </div>
              <h3 className="text-xl font-bold text-blue-600 mb-2 drop-shadow-md">
                Photo Gallery
              </h3>
              <p className="text-gray-600 drop-shadow-sm">
                100+ photos from shows & behind the scenes
              </p>
            </Link>

            <Link
              href="/music"
              className="card-pastel p-8 text-center group shadow-xl"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">
                🎵
              </div>
              <h3 className="text-xl font-bold text-blue-600 mb-2 drop-shadow-md">
                Music & MVs
              </h3>
              <p className="text-gray-600 drop-shadow-sm">
                Stream FOCUS, The Chase, Style & more!
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Member Spotlight Section */}
      <section className="py-16 px-4 bg-linear-to-br from-blue-100 via-pink-50 to-blue-100 relative overflow-hidden">
        {/* Flower Pattern Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 text-8xl">🌸</div>
          <div className="absolute top-40 right-20 text-6xl">💐</div>
          <div className="absolute bottom-20 left-1/4 text-7xl">🌺</div>
          <div className="absolute bottom-40 right-1/3 text-5xl">🌷</div>
          <div className="absolute top-1/3 right-10 text-6xl">🌹</div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                ⭐ Today&apos;s Star Member ⭐
              </h2>
              <p className="text-gray-600 text-lg">
                Rotating daily spotlight • Changes every 24 hours
              </p>
            </div>

            {/* Spotlight Card */}
            {isLoading ? (
              <div className="bg-linear-to-r from-blue-200 via-pink-100 to-blue-200 rounded-3xl p-8 md:p-12 shadow-2xl text-center">
                <div className="text-6xl mb-4 animate-pulse">⏳</div>
                <p className="text-gray-600 text-lg">กำลังโหลดข้อมูลสมาชิก...</p>
              </div>
            ) : todayMember ? (
              <div className="bg-linear-to-r from-blue-200 via-pink-100 to-blue-200 rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Member Image */}
                  <div className="relative group/spotlight shrink-0">
                    <div className="relative">
                      <Image
                        src={todayMember.img}
                        alt={todayMember.name}
                        width={300}
                        height={300}
                        className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-2xl ring-8 ring-white/70 group-hover/spotlight:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                      {/* Floating hearts on hover */}
                      <div className="absolute inset-0 pointer-events-none">
                        <span className="absolute top-10 left-10 text-pink-300 opacity-0 group-hover/spotlight:opacity-100 group-hover/spotlight:animate-float-up-1 transition-opacity text-4xl">
                          💕
                        </span>
                        <span className="absolute top-20 right-10 text-pink-400 opacity-0 group-hover/spotlight:opacity-100 group-hover/spotlight:animate-float-up-2 transition-opacity text-3xl">
                          💗
                        </span>
                        <span className="absolute bottom-20 left-20 text-pink-200 opacity-0 group-hover/spotlight:opacity-100 group-hover/spotlight:animate-float-up-3 transition-opacity text-3xl">
                          💖
                        </span>
                        <span
                          className="absolute bottom-10 right-20 text-pink-300 opacity-0 group-hover/spotlight:opacity-100 group-hover/spotlight:animate-float-up-1 transition-opacity text-4xl"
                          style={{ animationDelay: "0.2s" }}
                        >
                          💝
                        </span>
                      </div>
                    </div>
                    {/* Icon Badge */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-linear-to-br from-pink-400 to-purple-500 text-white text-4xl w-20 h-20 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white z-10">
                      {todayMember.icon}
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="mb-6">
                      <h3 className="text-4xl md:text-5xl font-bold mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {todayMember.name}
                      </h3>
                      <p className="text-2xl text-gray-700 mb-2">
                        {todayMember.korean}
                      </p>
                      <p className="text-lg font-semibold text-blue-600 mb-2">
                        {todayMember.role}
                      </p>
                      <p className="text-gray-600">Born {todayMember.birth}</p>
                    </div>

                    {/* Quote */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
                      <p className="text-xl italic text-gray-800 flex items-start gap-3">
                        <span className="text-3xl">💬</span>
                        <span>&ldquo;{todayMember.quote}&rdquo;</span>
                      </p>
                    </div>

                    {/* Random Fact */}
                    <div className="bg-linear-to-r from-pink-100 to-purple-100 rounded-2xl p-4 mb-6">
                      <p className="text-sm font-semibold text-purple-600 mb-1">
                        Quick Fact:
                      </p>
                      <p className="text-gray-700">
                        {todayMember.facts[randomFactIndex]}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <Link
                        href={todayMember.profile}
                        className="group bg-linear-to-r from-blue-500 to-blue-600 hover:from-pink-500 hover:to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        View Profile
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
                      <a
                        href="https://weverse.io/hearts2hearts/feed"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white hover:bg-pink-50 text-pink-600 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 border-2 border-pink-200"
                      >
                        Send Love 💖
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-linear-to-r from-blue-200 via-pink-100 to-blue-200 rounded-3xl p-8 md:p-12 shadow-2xl text-center">
                <p className="text-gray-600 text-lg">ไม่พบข้อมูลสมาชิก</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Member Cards Grid Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Meet All 8 Members
            </h2>
            <p className="text-gray-600 text-lg">
              Click any card to learn more about our talented girls!
            </p>
          </div>

          {/* Grid of Member Cards */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-pulse">⏳</div>
              <p className="text-gray-600 text-lg">กำลังโหลดข้อมูลสมาชิก...</p>
            </div>
          ) : membersData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {membersData.map((member, index) => (
              <Link
                key={member.name}
                href={member.profile}
                className={`relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group border-2 border-transparent hover:border-pink-200 hover:-translate-y-2 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: `${index * 100 + 200}ms`,
                }}
              >
                {/* Role Icon Badge */}
                <div className="absolute top-4 right-4 bg-linear-to-br from-pink-400 to-purple-400 text-white text-2xl w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10">
                  {member.icon}
                </div>

                {/* Member Image */}
                <div className="relative mb-4 group/card">
                  <div className="relative">
                    <Image
                      src={member.img}
                      alt={member.name}
                      width={200}
                      height={200}
                      className="w-64 h-64 rounded-full object-cover mx-auto group-hover:scale-105 transition-transform duration-500 shadow-xl ring-4 ring-pink-100"
                      unoptimized
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-pink-400 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

                    {/* Floating hearts on hover */}
                    <div className="absolute inset-0 pointer-events-none">
                      <span className="absolute top-5 left-1/4 text-pink-300 opacity-0 group-hover:opacity-100 group-hover:animate-float-up-1 transition-opacity text-2xl">
                        💕
                      </span>
                      <span className="absolute top-10 right-1/4 text-pink-400 opacity-0 group-hover:opacity-100 group-hover:animate-float-up-2 transition-opacity text-xl">
                        💗
                      </span>
                      <span className="absolute top-1/3 left-1/3 text-pink-200 opacity-0 group-hover:opacity-100 group-hover:animate-float-up-3 transition-opacity text-lg">
                        💖
                      </span>
                    </div>
                  </div>
                </div>

                {/* Member Info */}
                <div className="text-center mt-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">{member.korean}</p>
                  <p className="text-blue-600 font-semibold text-sm mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-500 text-xs mb-4">
                    Born {member.birth}
                  </p>

                  {/* Quick Fact */}
                  <div className="bg-pink-50 rounded-lg p-3 text-xs italic text-gray-600 mb-4 min-h-[60px] flex items-center justify-center">
                    {member.facts[0]}
                  </div>

                  {/* View Profile Link */}
                  <div className="text-blue-500 font-semibold text-sm group-hover:text-pink-500 transition-colors flex items-center justify-center gap-2">
                    View Profile
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
                  </div>
                </div>
              </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">ไม่พบข้อมูลสมาชิก</p>
            </div>
          )}
        </div>
      </section>

      {/* Image Carousel Section */}
      <section className="py-16 px-4 bg-linear-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text drop-shadow-lg">
            H2H Gallery Showcase
          </h2>
          <p className="text-center text-lg font-extrabold text-gray-600 mb-8 drop-shadow-md">
            รวมภาพสุดปังจากน้องๆ H2H 💕
          </p>

          <div className="max-w-5xl mx-auto">
            {isCarouselLoading ? (
              <div className="h-[500px] bg-gray-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-pulse">⏳</div>
                  <p className="text-gray-600">กำลังโหลดรูปภาพ...</p>
                </div>
              </div>
            ) : carouselImages.length > 0 ? (
              <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 2000,
                  disableOnInteraction: false,
                }}
                loop={true}
                className="rounded-2xl shadow-2xl overflow-hidden"
              >
                {carouselImages.map((image) => (
                  <SwiperSlide key={image.id}>
                    <div className="relative h-[500px] w-full">
                      <Image
                        src={image.imageUrl}
                        alt={image.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-6 z-10">
                        <h3 className="text-white text-2xl font-bold">
                          {image.title}
                        </h3>
                        {image.description && (
                          <p className="text-white/90 text-sm mt-2">
                            {image.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-gray-600">ไม่มีรูปภาพใน Gallery</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold gradient-text drop-shadow-lg">
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
            <div className="card-pastel p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  Performance
                </span>
                <span className="text-gray-500 text-sm">Oct 25, 2025</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 drop-shadow-md">
                H2H Stuns at Music Core! 🎀
              </h3>
              <p className="text-gray-600 mb-4 drop-shadow-sm">
                The girls performed FOCUS in ethereal pink ballet outfits.
                Carmen&apos;s ending fairy had 376+ likes on X!
              </p>
              <a
                href="https://twitter.com/search?q=H2H+Carmen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 font-semibold text-sm"
              >
                View Fancam →
              </a>
            </div>

            {/* News Card 2 */}
            <div className="card-pastel p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                  Comeback
                </span>
                <span className="text-gray-500 text-sm">Oct 20, 2025</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 drop-shadow-md">
                FOCUS MV Released! 🎬
              </h3>
              <p className="text-gray-600 mb-4 drop-shadow-sm">
                Hearts2Hearts drops addictive house beat track &quot;FOCUS&quot;
                with dreamy flower cathedral aesthetics.
              </p>
              <Link
                href="/music"
                className="text-blue-500 hover:text-blue-600 font-semibold text-sm"
              >
                Watch MV →
              </Link>
            </div>

            {/* News Card 3 */}
            <div className="card-pastel p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                  Vote
                </span>
                <span className="text-gray-500 text-sm">Until Oct 30</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 drop-shadow-md">
                Vote for H2H at MAMA! 🏆
              </h3>
              <p className="text-gray-600 mb-4 drop-shadow-sm">
                Help H2H win at the MAMA Awards! Voting closes October 30th.
                Every vote counts, S2U!
              </p>
              <a
                href="https://mama.vote"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 font-semibold text-sm"
              >
                Vote Now →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-linear-to-r from-blue-100 to-blue-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 gradient-text drop-shadow-lg">
            Join the S2U Community!
          </h2>
          <p className="text-lg text-gray-700 mb-8 drop-shadow-md">
            Connect with fellow fans, share your love for H2H, and never miss an
            update!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://weverse.io/hearts2hearts/highlight"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pastel flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Join Weverse
            </a>
            <Link href="/contact" className="btn-pastel inline-block">
              Submit Fanart 🎨
            </Link>
            <Link
              href="/schedule"
              className="bg-white text-blue-500 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 border-2 border-blue-300"
            >
              View Schedule 📅
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Fun Section */}
      <section className="py-16 px-4 bg-linear-to-r from-purple-100 to-pink-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 gradient-text drop-shadow-lg">
            Fun Activities for S2U! 🎮
          </h2>
          <p className="text-center text-gray-600 mb-12 drop-shadow-md">
            เล่นเกม ทำแบบทดสอบ และร่วมกิจกรรมสนุกๆ กับ H2H!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quiz Card */}
            <Link
              href="/quiz"
              className="card-pastel p-8 text-center group shadow-xl"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">
                🎮
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-3 drop-shadow-md">
                H2H Quiz Game
              </h3>
              <p className="text-gray-600 mb-4 drop-shadow-sm">
                ทดสอบความรู้เกี่ยวกับ H2H! คุณเป็นแฟนคลับตัวจริงหรือเปล่า? 🤔
              </p>
              <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                8 คำถาม
              </div>
            </Link>

            {/* Personality Test Card */}
            <Link
              href="/personality-test"
              className="card-pastel p-8 text-center group shadow-xl"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">
                💕
              </div>
              <h3 className="text-2xl font-bold text-pink-600 mb-3 drop-shadow-md">
                Personality Test
              </h3>
              <p className="text-gray-600 mb-4 drop-shadow-sm">
                คุณเหมือนสมาชิก H2H คนไหน? มาหาคำตอบกันเถอะ! ✨
              </p>
              <div className="inline-block px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold">
                Which member are you?
              </div>
            </Link>

            {/* Bingo Card */}
            <Link
              href="/bingo"
              className="card-pastel p-8 text-center group shadow-xl"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">
                🎯
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-3 drop-shadow-md">
                Fan Bingo
              </h3>
              <p className="text-gray-600 mb-4 drop-shadow-sm">
                ทำภารกิจแฟนคลับให้ครบและรับรางวัล Bingo! 🏆
              </p>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                25 ภารกิจ
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Members Preview */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 gradient-text drop-shadow-lg">
            Meet Our 8 Angels
          </h2>
          <p className="text-gray-600 mb-12 drop-shadow-md">
            {membersData.length > 0 ? membersData.map(m => m.name).join(" • ") : "Loading members..."}
          </p>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-pulse">⏳</div>
              <p className="text-gray-600">กำลังโหลดข้อมูลสมาชิก...</p>
            </div>
          ) : membersData.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {membersData.map((member) => (
                <div
                  key={member.name}
                  className="card-pastel p-4 text-center shadow-lg"
                >
                  <div className="text-4xl mb-2 drop-shadow-md">
                    {member.icon}
                  </div>
                  <h3 className="font-bold text-blue-600 drop-shadow-sm">
                    {member.name}
                  </h3>
                  <p className="text-xs text-gray-500 drop-shadow-sm">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">ไม่พบข้อมูลสมาชิก</p>
            </div>
          )}
          <Link href="/members" className="btn-pastel inline-block mt-8">
            Learn More About Members →
          </Link>
        </div>
      </section>
    </div>
  );
}