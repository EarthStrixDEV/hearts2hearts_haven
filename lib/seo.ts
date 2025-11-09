import type { Track, Album, Post } from './types';

/**
 * Generate SEO metadata for track page
 */
export function generateTrackSEO(track: Track) {
  const title = `${track.title} - Hearts2Hearts | Stream Now`;
  const description = `Listen to ${track.title} by Hearts2Hearts. ${track.mood?.join(', ')}. Released ${new Date(track.releaseDate).getFullYear()}.`;
  const url = `/music-streaming/track/${track.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'music.song',
      url,
      images: [
        {
          url: track.artwork,
          width: 512,
          height: 512,
          alt: track.title,
        },
      ],
      audio: track.audio.mp3_320,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [track.artwork],
    },
  };
}

/**
 * Generate SEO metadata for album page
 */
export function generateAlbumSEO(album: Album & { tracks: Track[] }) {
  const title = `${album.title} - Hearts2Hearts Album | Stream Now`;
  const description = `Listen to ${album.title} by Hearts2Hearts. ${album.tracks.length} tracks. Released ${new Date(album.releaseDate).getFullYear()}.`;
  const url = `/music-streaming/album/${album.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'music.album',
      url,
      images: [
        {
          url: album.cover,
          width: 512,
          height: 512,
          alt: album.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [album.cover],
    },
  };
}

/**
 * Generate SEO metadata for post page
 */
export function generatePostSEO(post: Post) {
  const title = post.title;
  const description = post.excerpt;
  const url = `/news/${post.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      images: post.heroImage ? [
        {
          url: post.heroImage,
          alt: post.title,
        },
      ] : undefined,
      article: {
        publishedTime: post.publishAt || post.createdAt,
        modifiedTime: post.updatedAt,
        authors: [post.authorId],
        tags: post.tags,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.heroImage ? [post.heroImage] : undefined,
    },
  };
}

/**
 * Generate Schema.org JSON-LD for track
 */
export function generateTrackSchema(track: Track, credits?: { composer: string[]; lyricist: string[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: track.title,
    byArtist: {
      '@type': 'MusicGroup',
      name: 'Hearts2Hearts',
    },
    duration: `PT${track.durationSec}S`,
    datePublished: track.releaseDate,
    image: track.artwork,
    audio: track.audio.mp3_320,
    inAlbum: {
      '@type': 'MusicAlbum',
      '@id': `/music-streaming/album/${track.albumId}`,
    },
    composer: credits?.composer.map(name => ({
      '@type': 'Person',
      name,
    })),
    lyricist: credits?.lyricist.map(name => ({
      '@type': 'Person',
      name,
    })),
  };
}

/**
 * Generate Schema.org JSON-LD for album
 */
export function generateAlbumSchema(album: Album & { tracks: Track[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    name: album.title,
    byArtist: {
      '@type': 'MusicGroup',
      name: 'Hearts2Hearts',
    },
    datePublished: album.releaseDate,
    image: album.cover,
    numTracks: album.tracks.length,
    track: album.tracks.map((track, index) => ({
      '@type': 'MusicRecording',
      position: index + 1,
      name: track.title,
      duration: `PT${track.durationSec}S`,
      url: `/music-streaming/track/${track.slug}`,
    })),
  };
}

/**
 * Generate Schema.org JSON-LD for article
 */
export function generateArticleSchema(post: Post, author: { name: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt,
    image: post.heroImage,
    datePublished: post.publishAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hearts2Hearts',
      logo: {
        '@type': 'ImageObject',
        url: '/images/h2h_logo.png',
      },
    },
  };
}

