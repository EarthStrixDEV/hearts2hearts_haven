"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import h2hLogo from "../../public/images/h2h_logo.png";

interface Video {
  id: string;
  title: string;
  artist: string;
  type: string;
  youtubeId: string;
  releaseDate: string;
  views: string;
  thumbnail: string;
  description: string;
  emoji: string;
  featured: boolean;
}

interface CarouselImage {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const discography = [
  {
    album: "FOCUS",
    type: "Mini Album",
    date: "October 20, 2025",
    tracks: ["FOCUS", "Pretty Please", "Flutter", "Apple Pie", "Blue Moon"],
    coverColor: "from-purple-400 to-pink-400",
  },
  {
    album: "Style",
    type: "Single",
    date: "June 18, 2025",
    tracks: ["Style"],
    coverColor: "from-blue-400 to-cyan-400",
  },
  {
    album: "The Chase",
    type: "Debut Single",
    date: "February 24, 2025",
    tracks: ["The Chase", "Butterflies"],
    coverColor: "from-pink-400 to-rose-400",
  },
];

// YouTube Video Component with Auto-play
function YouTubeVideo({
  video,
  autoplay = false,
}: {
  video: Video;
  autoplay?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center rounded-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-blue-400 font-medium">Loading video...</p>
            <p className="text-sm text-gray-400 mt-1">{video.title}</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center rounded-xl">
          <div className="text-center p-4">
            <div className="text-4xl mb-2">😅</div>
            <p className="text-red-200 font-medium">Oops! Video unavailable</p>
            <p className="text-sm text-red-300 mt-1">Try refreshing the page</p>
          </div>
        </div>
      )}

      {/* YouTube Iframe */}
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-xl"
        src={`https://www.youtube.com/embed/${
          video.youtubeId
        }?rel=0&modestbranding=1${autoplay ? "&autoplay=1" : ""}`}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}

export default function MusicPage() {
  const [selectedType, setSelectedType] = useState("All");
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlaying, setCurrentPlaying] = useState<Video | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentCoverImage, setCurrentCoverImage] =
    useState<CarouselImage | null>(null);

  const nowPlayingRef = useRef<HTMLDivElement>(null);

  // Load carousel images and select daily random one
  const loadCarouselImage = async () => {
    try {
      const response = await fetch("/api/carousel");
      if (response.ok) {
        const images: CarouselImage[] = await response.json();
        if (images.length > 0) {
          // Get daily random image based on date
          const today = new Date();
          const dayOfYear = Math.floor(
            (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
              86400000
          );
          const index = dayOfYear % images.length;
          setCurrentCoverImage(images[index]);
        }
      }
    } catch (error) {
      console.error("Error loading carousel images:", error);
    }
  };

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("streamingTheme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
    loadCarouselImage();
  }, []);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("streamingTheme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Load videos from API
  const loadVideos = async () => {
    try {
      const response = await fetch("/api/music");
      if (response.ok) {
        const videosData = await response.json();
        setVideos(videosData);
        // Set first featured video as current playing
        const firstFeatured = videosData.find((v: Video) => v.featured);
        if (firstFeatured) setCurrentPlaying(firstFeatured);
      } else {
        console.error("Failed to load videos");
      }
    } catch (error) {
      console.error("Error loading videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load videos on mount
  useEffect(() => {
    loadVideos();
  }, []);

  const videoTypes = [
    "All",
    "Music Video",
    "Performance",
    "Dance Practice",
    "Showcase",
    "Trailer",
    "Behind the Scenes",
    "Practice",
    "Variety Show",
  ];

  // Separate featured and regular videos
  const featuredVideos = videos.filter((video) => video.featured);
  const allVideos = videos.filter((video) => !video.featured);

  const filteredAllVideos = allVideos.filter(
    (video) => selectedType === "All" || video.type === selectedType
  );

  // Handle video selection with auto-scroll
  const handleVideoSelect = (video: Video) => {
    setCurrentPlaying(video);

    // Auto-scroll to Now Playing section
    setTimeout(() => {
      nowPlayingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  // Show toast notification
  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle Follow button
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    showNotification(
      isFollowing ? "Unfollowed Hearts2Hearts" : "Following Hearts2Hearts! 💕"
    );
  };

  // Handle Share button
  const handleShare = async (video?: Video) => {
    const shareData = video
      ? {
          title: video.title,
          text: `Check out ${video.title} by Hearts2Hearts!`,
          url: `https://www.youtube.com/watch?v=${video.youtubeId}`,
        }
      : {
          title: "Hearts2Hearts",
          text: "Check out Hearts2Hearts on YouTube!",
          url: "https://www.youtube.com/@hearts2hearts.official",
        };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showNotification("Shared successfully! 🎉");
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: Copy to clipboard
      const url = shareData.url;
      navigator.clipboard.writeText(url);
      showNotification("Link copied to clipboard! 📋");
    }
  };

  // Handle Play All
  const handlePlayAll = () => {
    if (featuredVideos.length > 0) {
      handleVideoSelect(featuredVideos[0]);
      showNotification("Playing all popular tracks! 🎵");
    }
  };

  // Theme classes
  const bgPrimary = isDarkMode
    ? "bg-gradient-to-b from-gray-900 via-gray-800 to-black"
    : "bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50";

  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-300" : "text-gray-700";
  const textMuted = isDarkMode ? "text-gray-400" : "text-gray-600";

  const cardBg = isDarkMode
    ? "bg-gray-800/40 border-gray-700"
    : "bg-white/80 backdrop-blur-sm border-gray-200";

  const cardHover = isDarkMode
    ? "hover:bg-gray-700/60 hover:border-gray-600"
    : "hover:bg-white hover:shadow-lg hover:border-purple-300";

  const heroBg = isDarkMode
    ? "bg-gradient-to-b from-purple-600 via-purple-700 to-gray-900"
    : "bg-gradient-to-b from-purple-400 via-pink-400 to-blue-400";

  const buttonPrimary = isDarkMode
    ? "bg-white text-black hover:bg-gray-100"
    : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700";

  const buttonSecondary = isDarkMode
    ? "bg-transparent border-2 border-white hover:bg-white/10"
    : "bg-purple-600 border-2 border-purple-600 text-white hover:bg-purple-700 hover:border-purple-700";

  return (
    <div
      className={`min-h-screen ${bgPrimary} ${textPrimary} transition-colors duration-500`}
    >
      {showToast && (
        <div className="fixed top-24 right-6 z-50 animate-slide-in">
          <div
            className={`${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-purple-300"
            } border-2 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3`}
          >
            <span className="text-2xl">✨</span>
            <p className={`font-semibold ${textPrimary}`}>{toastMessage}</p>
          </div>
        </div>
      )}

      <div className="fixed top-20 right-6 z-40">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`${
            isDarkMode
              ? "bg-gray-800 border-gray-600"
              : "bg-white border-gray-300"
          } border-2 p-3 rounded-full shadow-xl hover:scale-110 transition-all duration-300 group`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <svg
              className="w-6 h-6 text-yellow-400 group-hover:rotate-180 transition-transform duration-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-purple-600 group-hover:rotate-180 transition-transform duration-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      {/* Hero Header Section */}
      <div className={`relative pb-8 pt-16 px-6 overflow-hidden`}>
        {/* Carousel Cover Image */}
        {currentCoverImage ? (
          <div className="absolute inset-0">
            <Image
              src={currentCoverImage.imageUrl}
              alt={currentCoverImage.title}
              className="w-full h-full object-cover"
              width={1920}
              height={1080}
              priority
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        ) : (
          <div className={`absolute inset-0 ${heroBg}`}>
            <div
              className={`absolute inset-0 ${
                isDarkMode ? "opacity-30" : "opacity-20"
              } bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]`}
            ></div>
          </div>
        )}

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Album Art / Profile - Logo */}
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transform hover:scale-105 transition-transform duration-300 overflow-hidden">
              <Image
                src={h2hLogo}
                alt="Hearts2Hearts Logo"
                width={300}
                height={300}
                className="w-full h-full object-contain p-4"
                priority
              />
            </div>

            {/* Artist Info */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-semibold uppercase tracking-wider mb-2 text-white/90">
                Artist
              </p>
              <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight text-white drop-shadow-lg">
                Hearts2Hearts
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6 drop-shadow">
                K-Pop&apos;s Girls Group Rising Stars • 8 Members • Debut 2025
              </p>

              <div className="flex flex-wrap gap-6 justify-center md:justify-start mb-6">
                <div>
                  <div className="text-2xl font-bold text-white">50M+</div>
                  <div className="text-sm text-white/80">Monthly Listeners</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {isFollowing ? "127K" : "126K"}
                  </div>
                  <div className="text-sm text-white/80">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">1</div>
                  <div className="text-sm text-white/80">Albums</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center md:justify-start flex-wrap">
                <button
                  onClick={handlePlayAll}
                  className={`${buttonPrimary} px-8 py-3.5 rounded-full font-bold hover:scale-105 transition-all flex items-center gap-2 shadow-lg`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play
                </button>
                <button
                  onClick={handleFollow}
                  className={`${buttonSecondary} px-8 py-3.5 rounded-full font-bold hover:scale-105 transition-all`}
                >
                  {isFollowing ? "✓ Following" : "Follow"}
                </button>
                <button
                  onClick={() => handleShare()}
                  className={`${buttonSecondary} px-5 py-3.5 rounded-full font-bold hover:scale-105 transition-all`}
                >
                  •••
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mb-4"></div>
            <p className={`text-xl ${textMuted}`}>Loading your music...</p>
          </div>
        ) : (
          <>
            {currentPlaying && (
              <section className="mb-16" ref={nowPlayingRef}>
                <h2
                  className={`text-3xl font-bold mb-6 flex items-center gap-3 ${textPrimary}`}
                >
                  <span className="text-green-500">●</span> Now Playing
                </h2>
                <div
                  className={`${
                    isDarkMode
                      ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                      : "bg-gradient-to-br from-white to-blue-50 border-purple-200"
                  } rounded-2xl p-6 shadow-2xl border`}
                >
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className="relative rounded-xl overflow-hidden shadow-2xl">
                      <YouTubeVideo video={currentPlaying} autoplay={true} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl">{currentPlaying.emoji}</span>
                        <div>
                          <h3
                            className={`text-3xl font-bold mb-1 ${textPrimary}`}
                          >
                            {currentPlaying.title}
                          </h3>
                          <p className={textMuted}>Hearts2Hearts</p>
                        </div>
                      </div>
                      <p className={`${textSecondary} mb-6 leading-relaxed`}>
                        {currentPlaying.description}
                      </p>
                      <div className="flex gap-3 mb-6 flex-wrap">
                        <span
                          className={`${
                            isDarkMode ? "bg-purple-600" : "bg-purple-500"
                          } px-4 py-2 rounded-full text-sm font-semibold text-white`}
                        >
                          {currentPlaying.type}
                        </span>
                        <span
                          className={`${
                            isDarkMode
                              ? "bg-gray-700"
                              : "bg-gray-200 text-gray-700"
                          } px-4 py-2 rounded-full text-sm font-semibold`}
                        >
                          {currentPlaying.views}
                        </span>
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        <a
                          href={`https://www.youtube.com/watch?v=${currentPlaying.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${
                            isDarkMode
                              ? "bg-purple-600 hover:bg-purple-700"
                              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          } text-white px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 shadow-lg hover:scale-105`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          Watch on YouTube
                        </a>
                        <button
                          onClick={() => handleShare(currentPlaying)}
                          className={`${
                            isDarkMode
                              ? "bg-gray-700 hover:bg-gray-600"
                              : "bg-white border-2 border-purple-300 hover:bg-purple-50 text-purple-600"
                          } px-6 py-3 rounded-full font-semibold transition-all hover:scale-105`}
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Popular Tracks - Featured Videos */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-3xl font-bold ${textPrimary}`}>
                  Popular Tracks
                </h2>
                <button
                  onClick={() => setSelectedType("All")}
                  className={`${textMuted} hover:${textPrimary} text-sm font-semibold transition-colors`}
                >
                  See all
                </button>
              </div>

              <div className="space-y-2">
                {featuredVideos.slice(0, 5).map((video, index) => (
                  <div
                    key={video.id}
                    onClick={() => handleVideoSelect(video)}
                    className={`group ${cardBg} ${cardHover} rounded-lg p-4 transition-all cursor-pointer border`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`${textMuted} group-hover:${textPrimary} font-semibold w-8 text-center transition-colors`}
                      >
                        {index + 1}
                      </div>
                      <div className="w-14 h-14 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg">
                        {video.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-semibold ${textPrimary} truncate group-hover:text-purple-500 transition-colors`}
                        >
                          {video.title}
                        </h3>
                        <p className={`text-sm ${textMuted} truncate`}>
                          Hearts2Hearts
                        </p>
                      </div>
                      <div className={`hidden md:block text-sm ${textMuted}`}>
                        {video.views}
                      </div>
                      <div className={`hidden md:block text-sm ${textMuted}`}>
                        {new Date(video.releaseDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </div>
                      <button
                        className={`opacity-0 group-hover:opacity-100 ${
                          isDarkMode
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        } text-white p-3 rounded-full transition-all shadow-lg`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Discography / Albums */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-3xl font-bold ${textPrimary}`}>
                  Discography
                </h2>
                <button
                  className={`${textMuted} hover:${textPrimary} text-sm font-semibold transition-colors`}
                >
                  Show all
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {discography.map((album, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      const albumVideo = videos.find((v) =>
                        v.title.includes(album.album)
                      );
                      if (albumVideo) handleVideoSelect(albumVideo);
                    }}
                    className="group cursor-pointer"
                  >
                    <div
                      className={`relative bg-gradient-to-br ${album.coverColor} rounded-xl aspect-square mb-4 shadow-lg overflow-hidden transform group-hover:scale-105 transition-all duration-300`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-5xl mb-2">
                            {index === 0 ? "💽" : index === 1 ? "💿" : "🎵"}
                          </div>
                          <div className="text-xs font-semibold opacity-75">
                            {album.type}
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                        <button className="opacity-0 group-hover:opacity-100 bg-white text-black p-4 rounded-full shadow-2xl transform scale-90 group-hover:scale-100 transition-all">
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <h3
                      className={`font-bold ${textPrimary} mb-1 group-hover:text-purple-500 transition-colors truncate`}
                    >
                      {album.album}
                    </h3>
                    <p className={`text-sm ${textMuted} truncate`}>
                      {album.date.split(",")[1]?.trim() || album.date}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Filter Bar */}
            <section className="mb-8">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {videoTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-5 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                      selectedType === type
                        ? isDarkMode
                          ? "bg-white text-black"
                          : "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : isDarkMode
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-white text-gray-700 hover:bg-purple-50 border border-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </section>

            {/* All Videos Grid */}
            <section className="mb-16">
              <h2 className={`text-3xl font-bold mb-6 ${textPrimary}`}>
                All Videos{" "}
                {filteredAllVideos.length > 0 &&
                  `(${filteredAllVideos.length})`}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredAllVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => handleVideoSelect(video)}
                    className="group cursor-pointer"
                  >
                    <div
                      className={`relative ${
                        isDarkMode ? "bg-gray-800" : "bg-gray-200"
                      } rounded-xl overflow-hidden mb-4 shadow-lg aspect-video transform group-hover:scale-105 transition-all duration-300`}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (
                            e.target as HTMLImageElement
                          ).src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <button
                          className={`opacity-0 group-hover:opacity-100 ${
                            isDarkMode
                              ? "bg-purple-600 hover:bg-purple-700"
                              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          } text-white p-3 rounded-full shadow-2xl transform scale-90 group-hover:scale-100 transition-all`}
                        >
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span
                          className={`${
                            isDarkMode
                              ? "bg-black/70"
                              : "bg-white/90 text-gray-800"
                          } backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold`}
                        >
                          {video.type}
                        </span>
                      </div>
                    </div>
                    <h3
                      className={`font-semibold ${textPrimary} mb-1 line-clamp-2 group-hover:text-purple-500 transition-colors`}
                    >
                      {video.title}
                    </h3>
                    <p className={`text-sm ${textMuted} line-clamp-1`}>
                      {video.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs ${textMuted}`}>
                        {video.views}
                      </span>
                      <span className={`text-xs ${textMuted}`}>•</span>
                      <span className={`text-xs ${textMuted}`}>
                        {new Date(video.releaseDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Streaming Platforms */}
            <section className="mb-16">
              <div
                className={`${
                  isDarkMode
                    ? "bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30"
                    : "bg-gradient-to-r from-purple-100 to-blue-100 border-purple-300"
                } rounded-2xl p-10 border`}
              >
                <h2
                  className={`text-3xl font-bold mb-6 text-center ${textPrimary}`}
                >
                  Stream Everywhere 🎧
                </h2>
                <p
                  className={`text-center ${textSecondary} mb-8 max-w-2xl mx-auto`}
                >
                  Listen to Hearts2Hearts on your favorite platform
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <a
                    href="https://open.spotify.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl text-center flex items-center justify-center gap-2"
                  >
                    <span className="text-2xl">🎵</span> Spotify
                  </a>
                  <a
                    href="https://music.apple.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl text-center flex items-center justify-center gap-2"
                  >
                    <span className="text-2xl">🍎</span> Apple
                  </a>
                  <a
                    href="https://www.youtube.com/@hearts2hearts.official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl text-center flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    YouTube
                  </a>
                  <a
                    href="https://www.melon.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl text-center flex items-center justify-center gap-2"
                  >
                    <span className="text-2xl">🎼</span> Melon
                  </a>
                </div>

                <div
                  className={`${
                    isDarkMode
                      ? "bg-gradient-to-r from-pink-900/30 to-blue-900/30 border-pink-500/20"
                      : "bg-gradient-to-r from-pink-200/50 to-blue-200/50 border-pink-300/50"
                  } p-6 rounded-xl border text-center`}
                >
                  <p className={`${textSecondary} font-medium`}>
                    💖 Every stream helps H2H chart higher! Support your girls,
                    S2U!
                  </p>
                </div>
              </div>
            </section>

            {/* Pro Tips */}
            <section className="text-center">
              <div
                className={`${
                  isDarkMode
                    ? "bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500/30"
                    : "bg-gradient-to-br from-blue-100 to-purple-100 border-blue-300"
                } p-8 rounded-2xl inline-block border`}
              >
                <div className="text-4xl mb-3">💡</div>
                <p className={`${textSecondary} font-medium max-w-lg`}>
                  <strong className={textPrimary}>Pro Tip:</strong> Create a
                  YouTube playlist with all H2H videos for continuous streaming!
                  Don&apos;t forget to vote on music shows!
                </p>
              </div>
            </section>
          </>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
