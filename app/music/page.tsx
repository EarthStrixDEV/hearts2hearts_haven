"use client";

import { useState, useEffect } from "react";

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


const discography = [
  {
    album: "FOCUS",
    type: "Mini Album",
    date: "October 20, 2025",
    tracks: ["FOCUS", "Pretty Please", "Flutter", "Apple Pie", "Blue Moon"],
  },
  {
    album: "Style",
    type: "Single",
    date: "June 18, 2025",
    tracks: ["Style"],
  },
  {
    album: "The Chase",
    type: "Debut Single",
    date: "February 24, 2025",
    tracks: ["The Chase", "Butterfies"],
  },
];

// YouTube Video Component with Loading State
function YouTubeVideo({ video }: { video: Video }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-blue-600 font-medium">Loading video...</p>
            <p className="text-sm text-gray-500 mt-1">{video.title}</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center rounded-lg">
          <div className="text-center p-4">
            <div className="text-4xl mb-2">😅</div>
            <p className="text-red-600 font-medium">Oops! Video unavailable</p>
            <p className="text-sm text-gray-500 mt-1">
              Try refreshing the page
            </p>
          </div>
        </div>
      )}

      {/* YouTube Iframe */}
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
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

  // Load videos from API
  const loadVideos = async () => {
    try {
      const response = await fetch("/api/music");
      if (response.ok) {
        const videosData = await response.json();
        setVideos(videosData);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Stream Banner */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            Music & Videos
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Stream H2H on repeat! Support our girls 💕
          </p>

          {/* Stream for Win Banner */}
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-3xl shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-2">🏆 Stream for Win! 🏆</h2>
            <p className="text-lg">
              Help H2H win at Show Champion! Vote & stream FOCUS now!
            </p>
            <p className="text-sm mt-2 opacity-90">
              Voting ends October 30th • Every view counts, S2U!
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl text-gray-600">Loading videos...</p>
          </div>
        ) : (
          <>
            {/* Featured Videos Section */}
            <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              ⭐ Featured Videos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Must-watch content from Hearts2Hearts!
            </p>
          </div>

          {/* Featured Videos Grid - 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {featuredVideos.map((video) => (
              <div
                key={video.id}
                className="card-pastel overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
                {/* YouTube Embed with Loading */}
                <YouTubeVideo video={video} />

                {/* Video Info */}
                <div className="p-6 bg-white space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{video.emoji}</span>
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                        {video.title}
                      </h3>
                    </div>
                    {video.views && (
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1.5 rounded-full whitespace-nowrap ml-3">
                        {video.views}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1.5 rounded-full">
                      {video.type}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      📅 {new Date(video.releaseDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {video.description}
                  </p>

                  <div className="flex gap-3 pt-2">
                    <a
                      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pastel text-sm px-4 py-2.5 flex-1 text-center"
                    >
                      Watch →
                    </a>
                    <button className="bg-white text-blue-500 px-4 py-2.5 rounded-full font-semibold border-2 border-blue-300 hover:bg-blue-50 transition-colors text-sm">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filter */}
        <section className="mb-12">
          <div className="card-pastel p-6">
            <h3 className="font-bold text-blue-600 mb-6 text-center text-lg">
              Filter All Videos
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {videoTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${
                    selectedType === type
                      ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg transform scale-105"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* All Videos Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              🎬 All Videos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete collection of H2H content ({filteredAllVideos.length}{" "}
              videos)
            </p>
          </div>

          {/* All Videos Grid - 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredAllVideos.map((video) => (
              <div
                key={video.id}
                className="card-pastel overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                {/* YouTube Embed with Loading */}
                <YouTubeVideo video={video} />

                {/* Video Info */}
                <div className="p-5 bg-white space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5 flex-1">
                      <span className="text-xl">{video.emoji}</span>
                      <h3 className="text-base font-bold text-gray-800 line-clamp-2">
                        {video.title}
                      </h3>
                    </div>
                    {video.views && (
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full whitespace-nowrap ml-2.5">
                        {video.views}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2.5">
                    <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2.5 py-1 rounded-full">
                      {video.type}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      📅 {new Date(video.releaseDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {video.description}
                  </p>

                  <div className="flex gap-2.5 pt-1">
                    <a
                      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pastel text-sm px-4 py-2 flex-1 text-center"
                    >
                      Watch →
                    </a>
                    <button className="bg-white text-blue-500 px-4 py-2 rounded-full font-semibold border-2 border-blue-300 hover:bg-blue-50 transition-colors text-sm">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Discography Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Discography 💿
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete music releases from Hearts2Hearts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {discography.map((album, index) => (
              <div
                key={index}
                className="card-pastel p-8 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="text-6xl mb-6">
                  {index === 0 ? "💽" : index === 1 ? "💿" : "🎵"}
                </div>
                <h3 className="text-2xl font-bold text-blue-600 mb-3">
                  {album.album}
                </h3>
                <p className="text-gray-500 font-medium mb-2">{album.type}</p>
                <p className="text-gray-400 text-sm mb-6">{album.date}</p>

                <div className="border-t border-blue-100 pt-6">
                  <h4 className="font-semibold text-gray-700 mb-4">
                    Track List:
                  </h4>
                  <ol className="space-y-2 text-left">
                    {album.tracks.map((track, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-600 flex items-center"
                      >
                        <span className="text-blue-400 mr-3 font-medium">
                          {idx + 1}.
                        </span>
                        {track}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Streaming Platforms */}
        <section className="mb-16">
          <div className="card-pastel p-10 text-center">
            <h2 className="text-3xl font-bold mb-4 gradient-text">
              Stream H2H Everywhere! 🎧
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
              Listen to Hearts2Hearts on your favorite platform
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <a
                href="https://open.spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                🎵 Spotify
              </a>
              <a
                href="https://music.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                🍎 Apple Music
              </a>
              <a
                href="https://www.youtube.com/@hearts2hearts.official"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
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
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                🎼 Melon
              </a>
            </div>

            <div className="bg-gradient-to-r from-pink-100 to-blue-100 p-6 rounded-2xl">
              <p className="text-gray-700 font-medium">
                💖 Streaming helps H2H chart higher! Every listen counts!
              </p>
            </div>
          </div>
        </section>

        {/* Playlist Auto-play Note */}
        <div className="text-center">
          <div className="bg-blue-50 p-6 rounded-2xl inline-block">
            <p className="text-gray-600 font-medium">
              💡 <strong>Pro Tip:</strong> Create a YouTube playlist with all
              H2H videos for continuous streaming!
            </p>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
