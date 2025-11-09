/**
 * MagazineGrid Component - Usage Examples
 * 
 * A luxury magazine-style asymmetrical grid component
 * Perfect for K-POP comeback teasers, fashion editorials, and premium photo showcases
 */

import MagazineGrid from "./MagazineGrid";

// Example 1: Basic Usage with Cream Background (Default)
export function Example1() {
  const images = [
    {
      id: "1",
      imageUrl: "/images/hero.jpg",
      title: "HEARTS2HEARTS",
      caption: "2025 Comeback",
      member: "Group",
    },
    {
      id: "2",
      imageUrl: "/images/medium1.jpg",
      title: "Concept Photo 1",
      member: "Jiwoo",
    },
    {
      id: "3",
      imageUrl: "/images/medium2.jpg",
      title: "Concept Photo 2",
      member: "Carmen",
    },
    {
      id: "4",
      imageUrl: "/images/small1.jpg",
      title: "Behind the Scenes",
    },
    {
      id: "5",
      imageUrl: "/images/small2.jpg",
      title: "Teaser 1",
    },
    {
      id: "6",
      imageUrl: "/images/small3.jpg",
      title: "Teaser 2",
    },
    {
      id: "7",
      imageUrl: "/images/small4.jpg",
      title: "Teaser 3",
    },
  ];

  return (
    <MagazineGrid
      hero={images[0]}
      medium={[images[1], images[2]]}
      small={images.slice(3, 7)}
      backgroundColor="cream"
      showCaptions={true}
      showGradientOverlay={true}
    />
  );
}

// Example 2: Black Background (Dark Mode / Night Concept)
export function Example2_DarkMode() {
  const images = [
    {
      id: "1",
      imageUrl: "/images/dark-hero.jpg",
      title: "MIDNIGHT CONCEPT",
      caption: "Special Album",
      member: "H2H",
    },
    {
      id: "2",
      imageUrl: "/images/dark-medium1.jpg",
      title: "Shadow & Light",
      member: "Yuha",
    },
    {
      id: "3",
      imageUrl: "/images/dark-medium2.jpg",
      title: "Noir Aesthetic",
      member: "Stella",
    },
    {
      id: "4",
      imageUrl: "/images/dark-small1.jpg",
      title: "Mood 1",
    },
    {
      id: "5",
      imageUrl: "/images/dark-small2.jpg",
      title: "Mood 2",
    },
    {
      id: "6",
      imageUrl: "/images/dark-small3.jpg",
      title: "Mood 3",
    },
    {
      id: "7",
      imageUrl: "/images/dark-small4.jpg",
      title: "Mood 4",
    },
  ];

  return (
    <MagazineGrid
      hero={images[0]}
      medium={[images[1], images[2]]}
      small={images.slice(3, 7)}
      backgroundColor="black"
      showCaptions={true}
      showGradientOverlay={true}
    />
  );
}

// Example 3: White Background (Clean / Minimalist)
export function Example3_Minimalist() {
  const images = [
    {
      id: "1",
      imageUrl: "/images/white-hero.jpg",
      title: "PURE",
      caption: "Spring Collection",
    },
    {
      id: "2",
      imageUrl: "/images/white-medium1.jpg",
      title: "Fresh Start",
    },
    {
      id: "3",
      imageUrl: "/images/white-medium2.jpg",
      title: "New Beginning",
    },
    {
      id: "4",
      imageUrl: "/images/white-small1.jpg",
      title: "Detail 1",
    },
    {
      id: "5",
      imageUrl: "/images/white-small2.jpg",
      title: "Detail 2",
    },
    {
      id: "6",
      imageUrl: "/images/white-small3.jpg",
      title: "Detail 3",
    },
    {
      id: "7",
      imageUrl: "/images/white-small4.jpg",
      title: "Detail 4",
    },
  ];

  return (
    <MagazineGrid
      hero={images[0]}
      medium={[images[1], images[2]]}
      small={images.slice(3, 7)}
      backgroundColor="white"
      showCaptions={false}
      showGradientOverlay={false}
    />
  );
}

// Example 4: Dynamic Data from API
export function Example4_DynamicData({ galleryImages }: { galleryImages: any[] }) {
  // Take first 7 images from your gallery
  const magazineImages = galleryImages.slice(0, 7).map(img => ({
    id: img.id,
    imageUrl: img.imageUrl,
    title: img.title,
    caption: img.category,
    member: img.member || undefined,
  }));

  // Only show if we have enough images
  if (magazineImages.length < 7) {
    return null;
  }

  return (
    <MagazineGrid
      hero={magazineImages[0]}
      medium={[magazineImages[1], magazineImages[2]]}
      small={magazineImages.slice(3, 7)}
      backgroundColor="cream"
      showCaptions={true}
      showGradientOverlay={true}
    />
  );
}

// Example 5: With 5 Small Images (Maximum)
export function Example5_MaxImages() {
  const images = [
    {
      id: "1",
      imageUrl: "/images/hero.jpg",
      title: "MAIN CONCEPT",
      caption: "Full Album",
      member: "HEARTS2HEARTS",
    },
    {
      id: "2",
      imageUrl: "/images/medium1.jpg",
      title: "Track 1",
      member: "Jiwoo",
    },
    {
      id: "3",
      imageUrl: "/images/medium2.jpg",
      title: "Track 2",
      member: "Carmen",
    },
    {
      id: "4",
      imageUrl: "/images/small1.jpg",
      title: "Track 3",
    },
    {
      id: "5",
      imageUrl: "/images/small2.jpg",
      title: "Track 4",
    },
    {
      id: "6",
      imageUrl: "/images/small3.jpg",
      title: "Track 5",
    },
    {
      id: "7",
      imageUrl: "/images/small4.jpg",
      title: "Track 6",
    },
    {
      id: "8",
      imageUrl: "/images/small5.jpg",
      title: "Track 7",
    },
  ];

  return (
    <MagazineGrid
      hero={images[0]}
      medium={[images[1], images[2]]}
      small={images.slice(3, 8)} // Can pass up to 5 small images
      backgroundColor="cream"
      showCaptions={true}
      showGradientOverlay={true}
    />
  );
}

/**
 * LAYOUT STRUCTURE:
 * 
 * Desktop (5 columns):
 * [   HERO LARGE   ][   MEDIUM 1   ]
 * [   HERO LARGE   ][ small ][ small ]
 * [ Medium 2 ][ small ][ small ][ small ]
 * 
 * Tablet (4 columns):
 * [   HERO   ][  MEDIUM 1  ]
 * [   HERO   ][ sm ][ sm ]
 * [ Medium 2 ][ sm ][ sm ]
 * 
 * Mobile:
 * [ HERO (3:4) ]
 * [ Medium 1 (4:3) ]
 * [ Medium 2 (4:3) ]
 * [ small ][ small ]
 * [ small ][ small ]
 * 
 * STYLE VIBES:
 * - aespa "Supernova" luxury concept
 * - NewJeans "OMG" editorial aesthetic
 * - LE SSERAFIM high-fashion comeback
 * - Vogue/Harper's Bazaar magazine layout
 */

