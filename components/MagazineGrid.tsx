"use client";

import Image from "next/image";
import { useState } from "react";

interface MagazineImage {
  id: string;
  imageUrl: string;
  title?: string;
  caption?: string;
  member?: string;
}

interface MagazineGridProps {
  hero: MagazineImage;
  medium: [MagazineImage, MagazineImage];
  small: MagazineImage[];
  backgroundColor?: "white" | "cream" | "black";
  showCaptions?: boolean;
  showGradientOverlay?: boolean;
}

export default function MagazineGrid({
  hero,
  medium,
  small,
  backgroundColor = "cream",
  showCaptions = true,
  showGradientOverlay = true,
}: MagazineGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const bgColors = {
    white: "bg-white",
    cream: "bg-[#FAF8F5]",
    black: "bg-black",
  };

  const textColors = {
    white: "text-gray-900",
    cream: "text-gray-900",
    black: "text-white",
  };

  return (
    <div className={`${bgColors[backgroundColor]} py-12 md:py-20 px-4 md:px-8`}>
      <div className="max-w-[1600px] mx-auto">
        {/* Desktop & Tablet: Asymmetrical Grid */}
        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5 auto-rows-[280px]">
          {/* HERO LARGE - Takes 2 columns and 2 rows */}
          <div
            className="md:col-span-2 lg:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden rounded-[20px]"
            onMouseEnter={() => setHoveredId(hero.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              className={`relative w-full h-full transition-all duration-700 ease-out ${
                hoveredId === hero.id
                  ? "scale-105"
                  : "scale-100"
              }`}
            >
              <Image
                src={hero.imageUrl}
                alt={hero.title || "Hero image"}
                fill
                className="object-cover"
                unoptimized
                priority
              />
              
              {/* Gradient Overlay */}
              {showGradientOverlay && (
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 ${
                    hoveredId === hero.id ? "opacity-90" : "opacity-60"
                  }`}
                />
              )}

              {/* Caption Overlay */}
              {showCaptions && (hero.title || hero.caption) && (
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 z-10">
                  {hero.member && (
                    <p className="text-white/80 text-xs lg:text-sm font-medium tracking-[0.2em] uppercase mb-2">
                      {hero.member}
                    </p>
                  )}
                  <h3 className="text-white text-2xl lg:text-4xl font-bold tracking-tight leading-tight drop-shadow-2xl">
                    {hero.title}
                  </h3>
                  {hero.caption && (
                    <p className="text-white/90 text-sm lg:text-base mt-2 font-light">
                      {hero.caption}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {/* Hover Shadow */}
            <div
              className={`absolute inset-0 rounded-[20px] transition-shadow duration-500 pointer-events-none ${
                hoveredId === hero.id
                  ? "shadow-2xl shadow-black/30"
                  : "shadow-none"
              }`}
            />
          </div>

          {/* MEDIUM 1 - Takes 2 columns, 1 row */}
          <div
            className="md:col-span-2 lg:col-span-3 md:row-span-1 relative group cursor-pointer overflow-hidden rounded-[20px]"
            onMouseEnter={() => setHoveredId(medium[0].id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              className={`relative w-full h-full transition-all duration-700 ease-out ${
                hoveredId === medium[0].id
                  ? "scale-105"
                  : "scale-100"
              }`}
            >
              <Image
                src={medium[0].imageUrl}
                alt={medium[0].title || "Medium image 1"}
                fill
                className="object-cover"
                unoptimized
              />
              
              {showGradientOverlay && (
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 ${
                    hoveredId === medium[0].id ? "opacity-80" : "opacity-50"
                  }`}
                />
              )}

              {showCaptions && (medium[0].title || medium[0].caption) && (
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 z-10">
                  {medium[0].member && (
                    <p className="text-white/80 text-xs font-medium tracking-[0.2em] uppercase mb-1">
                      {medium[0].member}
                    </p>
                  )}
                  <h4 className="text-white text-lg lg:text-2xl font-bold tracking-tight drop-shadow-xl">
                    {medium[0].title}
                  </h4>
                </div>
              )}
            </div>
            
            <div
              className={`absolute inset-0 rounded-[20px] transition-shadow duration-500 pointer-events-none ${
                hoveredId === medium[0].id
                  ? "shadow-2xl shadow-black/30"
                  : "shadow-none"
              }`}
            />
          </div>

          {/* SMALL 1 - 1 column, 1 row */}
          {small[0] && (
            <div
              className="md:col-span-1 lg:col-span-1 md:row-span-1 relative group cursor-pointer overflow-hidden rounded-[18px]"
              onMouseEnter={() => setHoveredId(small[0].id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={`relative w-full h-full transition-all duration-700 ease-out ${
                  hoveredId === small[0].id ? "scale-105" : "scale-100"
                }`}
              >
                <Image
                  src={small[0].imageUrl}
                  alt={small[0].title || "Small image 1"}
                  fill
                  className="object-cover"
                  unoptimized
                />
                
                {showGradientOverlay && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-500 ${
                      hoveredId === small[0].id ? "opacity-70" : "opacity-40"
                    }`}
                  />
                )}

                {showCaptions && small[0].title && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 z-10">
                    <h5 className="text-white text-sm lg:text-base font-semibold tracking-tight drop-shadow-lg">
                      {small[0].title}
                    </h5>
                  </div>
                )}
              </div>
              
              <div
                className={`absolute inset-0 rounded-[18px] transition-shadow duration-500 pointer-events-none ${
                  hoveredId === small[0].id
                    ? "shadow-xl shadow-black/25"
                    : "shadow-none"
                }`}
              />
            </div>
          )}

          {/* SMALL 2 - 1 column, 1 row */}
          {small[1] && (
            <div
              className="md:col-span-1 lg:col-span-1 md:row-span-1 relative group cursor-pointer overflow-hidden rounded-[18px]"
              onMouseEnter={() => setHoveredId(small[1].id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={`relative w-full h-full transition-all duration-700 ease-out ${
                  hoveredId === small[1].id ? "scale-105" : "scale-100"
                }`}
              >
                <Image
                  src={small[1].imageUrl}
                  alt={small[1].title || "Small image 2"}
                  fill
                  className="object-cover"
                  unoptimized
                />
                
                {showGradientOverlay && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-500 ${
                      hoveredId === small[1].id ? "opacity-70" : "opacity-40"
                    }`}
                  />
                )}

                {showCaptions && small[1].title && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 z-10">
                    <h5 className="text-white text-sm lg:text-base font-semibold tracking-tight drop-shadow-lg">
                      {small[1].title}
                    </h5>
                  </div>
                )}
              </div>
              
              <div
                className={`absolute inset-0 rounded-[18px] transition-shadow duration-500 pointer-events-none ${
                  hoveredId === small[1].id
                    ? "shadow-xl shadow-black/25"
                    : "shadow-none"
                }`}
              />
            </div>
          )}

          {/* MEDIUM 2 - Takes 2 columns, 1 row */}
          <div
            className="md:col-span-2 lg:col-span-2 md:row-span-1 relative group cursor-pointer overflow-hidden rounded-[20px]"
            onMouseEnter={() => setHoveredId(medium[1].id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              className={`relative w-full h-full transition-all duration-700 ease-out ${
                hoveredId === medium[1].id
                  ? "scale-105"
                  : "scale-100"
              }`}
            >
              <Image
                src={medium[1].imageUrl}
                alt={medium[1].title || "Medium image 2"}
                fill
                className="object-cover"
                unoptimized
              />
              
              {showGradientOverlay && (
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 ${
                    hoveredId === medium[1].id ? "opacity-80" : "opacity-50"
                  }`}
                />
              )}

              {showCaptions && (medium[1].title || medium[1].caption) && (
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 z-10">
                  {medium[1].member && (
                    <p className="text-white/80 text-xs font-medium tracking-[0.2em] uppercase mb-1">
                      {medium[1].member}
                    </p>
                  )}
                  <h4 className="text-white text-lg lg:text-2xl font-bold tracking-tight drop-shadow-xl">
                    {medium[1].title}
                  </h4>
                </div>
              )}
            </div>
            
            <div
              className={`absolute inset-0 rounded-[20px] transition-shadow duration-500 pointer-events-none ${
                hoveredId === medium[1].id
                  ? "shadow-2xl shadow-black/30"
                  : "shadow-none"
              }`}
            />
          </div>

          {/* SMALL 3 - 1 column, 1 row */}
          {small[2] && (
            <div
              className="md:col-span-1 lg:col-span-1 md:row-span-1 relative group cursor-pointer overflow-hidden rounded-[18px]"
              onMouseEnter={() => setHoveredId(small[2].id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={`relative w-full h-full transition-all duration-700 ease-out ${
                  hoveredId === small[2].id ? "scale-105" : "scale-100"
                }`}
              >
                <Image
                  src={small[2].imageUrl}
                  alt={small[2].title || "Small image 3"}
                  fill
                  className="object-cover"
                  unoptimized
                />
                
                {showGradientOverlay && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-500 ${
                      hoveredId === small[2].id ? "opacity-70" : "opacity-40"
                    }`}
                  />
                )}

                {showCaptions && small[2].title && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 z-10">
                    <h5 className="text-white text-sm lg:text-base font-semibold tracking-tight drop-shadow-lg">
                      {small[2].title}
                    </h5>
                  </div>
                )}
              </div>
              
              <div
                className={`absolute inset-0 rounded-[18px] transition-shadow duration-500 pointer-events-none ${
                  hoveredId === small[2].id
                    ? "shadow-xl shadow-black/25"
                    : "shadow-none"
                }`}
              />
            </div>
          )}

          {/* SMALL 4 - 1 column, 1 row */}
          {small[3] && (
            <div
              className="md:col-span-1 lg:col-span-1 md:row-span-1 relative group cursor-pointer overflow-hidden rounded-[18px]"
              onMouseEnter={() => setHoveredId(small[3].id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={`relative w-full h-full transition-all duration-700 ease-out ${
                  hoveredId === small[3].id ? "scale-105" : "scale-100"
                }`}
              >
                <Image
                  src={small[3].imageUrl}
                  alt={small[3].title || "Small image 4"}
                  fill
                  className="object-cover"
                  unoptimized
                />
                
                {showGradientOverlay && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-500 ${
                      hoveredId === small[3].id ? "opacity-70" : "opacity-40"
                    }`}
                  />
                )}

                {showCaptions && small[3].title && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 z-10">
                    <h5 className="text-white text-sm lg:text-base font-semibold tracking-tight drop-shadow-lg">
                      {small[3].title}
                    </h5>
                  </div>
                )}
              </div>
              
              <div
                className={`absolute inset-0 rounded-[18px] transition-shadow duration-500 pointer-events-none ${
                  hoveredId === small[3].id
                    ? "shadow-xl shadow-black/25"
                    : "shadow-none"
                }`}
              />
            </div>
          )}

          {/* SMALL 5 (Optional) - 1 column, 1 row */}
          {small[4] && (
            <div
              className="md:col-span-1 lg:col-span-1 md:row-span-1 relative group cursor-pointer overflow-hidden rounded-[18px]"
              onMouseEnter={() => setHoveredId(small[4].id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={`relative w-full h-full transition-all duration-700 ease-out ${
                  hoveredId === small[4].id ? "scale-105" : "scale-100"
                }`}
              >
                <Image
                  src={small[4].imageUrl}
                  alt={small[4].title || "Small image 5"}
                  fill
                  className="object-cover"
                  unoptimized
                />
                
                {showGradientOverlay && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-500 ${
                      hoveredId === small[4].id ? "opacity-70" : "opacity-40"
                    }`}
                  />
                )}

                {showCaptions && small[4].title && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 z-10">
                    <h5 className="text-white text-sm lg:text-base font-semibold tracking-tight drop-shadow-lg">
                      {small[4].title}
                    </h5>
                  </div>
                )}
              </div>
              
              <div
                className={`absolute inset-0 rounded-[18px] transition-shadow duration-500 pointer-events-none ${
                  hoveredId === small[4].id
                    ? "shadow-xl shadow-black/25"
                    : "shadow-none"
                }`}
              />
            </div>
          )}
        </div>

        {/* Mobile: Vertical Stack */}
        <div className="md:hidden space-y-4">
          {/* Hero */}
          <div className="relative aspect-[3/4] rounded-[20px] overflow-hidden group">
            <Image
              src={hero.imageUrl}
              alt={hero.title || "Hero image"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
              priority
            />
            {showGradientOverlay && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            )}
            {showCaptions && (hero.title || hero.caption) && (
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                {hero.member && (
                  <p className="text-white/80 text-xs font-medium tracking-[0.2em] uppercase mb-2">
                    {hero.member}
                  </p>
                )}
                <h3 className="text-white text-2xl font-bold tracking-tight leading-tight drop-shadow-2xl">
                  {hero.title}
                </h3>
                {hero.caption && (
                  <p className="text-white/90 text-sm mt-2 font-light">
                    {hero.caption}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Medium Images */}
          {medium.map((img, idx) => (
            <div
              key={img.id}
              className="relative aspect-[4/3] rounded-[18px] overflow-hidden group"
            >
              <Image
                src={img.imageUrl}
                alt={img.title || `Medium image ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              {showGradientOverlay && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              )}
              {showCaptions && img.title && (
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  {img.member && (
                    <p className="text-white/80 text-xs font-medium tracking-[0.2em] uppercase mb-1">
                      {img.member}
                    </p>
                  )}
                  <h4 className="text-white text-xl font-bold tracking-tight drop-shadow-xl">
                    {img.title}
                  </h4>
                </div>
              )}
            </div>
          ))}

          {/* Small Images - 2 column grid */}
          <div className="grid grid-cols-2 gap-3">
            {small.map((img, idx) => (
              <div
                key={img.id}
                className="relative aspect-square rounded-[16px] overflow-hidden group"
              >
                <Image
                  src={img.imageUrl}
                  alt={img.title || `Small image ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                {showGradientOverlay && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                )}
                {showCaptions && img.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                    <h5 className="text-white text-xs font-semibold tracking-tight drop-shadow-lg line-clamp-2">
                      {img.title}
                    </h5>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

