"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  title: string;
  category: string;
  member: string | null;
  description: string;
  emoji: string;
  imageUrl: string;
  uploadDate: string;
  size: string;
}


export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMember, setSelectedMember] = useState("All");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load gallery images from API
  const loadGalleryImages = async () => {
    try {
      const response = await fetch("/api/gallery");
      if (response.ok) {
        const imagesData = await response.json();
        setGalleryImages(imagesData);
      } else {
        console.error("Failed to load gallery images");
      }
    } catch (error) {
      console.error("Error loading gallery images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load images on mount
  useEffect(() => {
    loadGalleryImages();
  }, []);

  const categories = [
    "All",
    "Predebut",
    "Teasers",
    "Music Shows",
    "Behind the Scenes",
  ];
  const memberNames = [
    "All",
    "Jiwoo",
    "Carmen",
    "Yuha",
    "Stella",
    "Juun",
    "A-na",
    "Ian",
    "Ye-on",
  ];

  const filteredImages = galleryImages.filter((img) => {
    const categoryMatch =
      selectedCategory === "All" || img.category === selectedCategory;
    const memberMatch =
      selectedMember === "All" || img.member === selectedMember;
    return categoryMatch && memberMatch;
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            Photo Gallery
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Collect memories with H2H! {galleryImages.length} photos ✨
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Category Filter */}
          <div className="card-pastel p-4">
            <h3 className="font-bold text-blue-600 mb-3 text-center">
              Filter by Category
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Member Filter */}
          <div className="card-pastel p-4">
            <h3 className="font-bold text-blue-600 mb-3 text-center">
              Filter by Member
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {memberNames.map((member) => (
                <button
                  key={member}
                  onClick={() => setSelectedMember(member)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedMember === member
                      ? "bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-lg"
                      : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                  }`}
                >
                  {member}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-bold text-blue-600">
              {filteredImages.length}
            </span>{" "}
            photos
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl text-gray-600">Loading gallery...</p>
          </div>
        ) : (
          <>
            {/* Masonry Grid Gallery */}
            <div className="masonry-grid">
          {filteredImages.map((image, index) => {
            return (
              <div
                key={image.id}
                className="mb-4 break-inside-avoid cursor-pointer group"
                onClick={() => setLightboxImage(image)}
              >
                <div className="card-pastel overflow-hidden">
                  {/* Real Image */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={image.imageUrl}
                      alt={image.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                    {/* Overlay with emoji and title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{image.emoji}</span>
                          <h3 className="font-bold text-white text-lg drop-shadow-lg">
                            {image.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {image.category}
                      </span>
                      {image.member && (
                        <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                          {image.member}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{image.description}</p>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>📅 {new Date(image.uploadDate).toLocaleDateString()}</span>
                      <span>📁 {image.size}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😢</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No photos found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters to see more photos!
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedMember("All");
              }}
              className="btn-pastel"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Download Note */}
        <div className="mt-12 text-center card-pastel p-6">
          <h3 className="text-xl font-bold text-blue-600 mb-3">
            💖 S2U Love Watermark
          </h3>
          <p className="text-gray-600">
            All downloadable photos include "S2U Love 💖" watermark to show our
            support! Click any photo to view in full size and download.
          </p>
        </div>
        </>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-blue-300 transition-colors z-10"
            onClick={() => setLightboxImage(null)}
          >
            ×
          </button>

          <div
            className="max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Large Image */}
            <div className="relative aspect-[4/3] rounded-3xl mb-6 overflow-hidden">
              <Image
                src={lightboxImage.imageUrl}
                alt={lightboxImage.title}
                fill
                className="object-cover"
                unoptimized
              />
              {/* Overlay with info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-6xl">{lightboxImage.emoji}</span>
                    <div>
                      <h2 className="text-4xl font-bold text-white drop-shadow-2xl mb-2">
                        {lightboxImage.title}
                      </h2>
                      <p className="text-xl text-white/90 drop-shadow-lg">
                        {lightboxImage.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info & Actions */}
            <div className="bg-white rounded-2xl p-6 flex justify-between items-center">
              <div>
                <div className="flex gap-2 mb-2">
                  <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    {lightboxImage.category}
                  </span>
                  {lightboxImage.member && (
                    <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                      {lightboxImage.member}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Photo #{lightboxImage.id} • S2U Love 💖</p>
                  <p>📅 {new Date(lightboxImage.uploadDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}</p>
                  <p>📁 {lightboxImage.size}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = lightboxImage.imageUrl;
                    link.download = `${lightboxImage.title.replace(/\s+/g, '_')}_S2U_Love.jpg`;
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="btn-pastel text-sm flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                  </svg>
                  Download
                </button>
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `${lightboxImage.title} - H2H Gallery`,
                        text: `Check out this photo: ${lightboxImage.description}`,
                        url: lightboxImage.imageUrl
                      });
                    } else {
                      navigator.clipboard.writeText(lightboxImage.imageUrl);
                      alert('Image URL copied to clipboard!');
                    }
                  }}
                  className="bg-white text-blue-500 px-4 py-2 rounded-full font-semibold border-2 border-blue-300 hover:bg-blue-50 transition-colors text-sm flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
