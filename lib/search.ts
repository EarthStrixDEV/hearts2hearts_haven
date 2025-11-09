import Fuse from 'fuse.js';
import type { Post, Track, Album } from './types';

/**
 * Search posts
 */
export function searchPosts(posts: Post[], query: string): Post[] {
  if (!query) return posts;

  const fuse = new Fuse(posts, {
    keys: ['title', 'excerpt', 'content'],
    threshold: 0.3,
    includeScore: true,
  });

  const results = fuse.search(query);
  return results.map(result => result.item);
}

/**
 * Search tracks
 */
export function searchTracks(tracks: Track[], query: string): Track[] {
  if (!query) return tracks;

  const fuse = new Fuse(tracks, {
    keys: ['title', 'tags', 'mood'],
    threshold: 0.3,
    includeScore: true,
  });

  const results = fuse.search(query);
  return results.map(result => result.item);
}

/**
 * Search albums
 */
export function searchAlbums(albums: Album[], query: string): Album[] {
  if (!query) return albums;

  const fuse = new Fuse(albums, {
    keys: ['title', 'description'],
    threshold: 0.3,
    includeScore: true,
  });

  const results = fuse.search(query);
  return results.map(result => result.item);
}

/**
 * Filter tracks by criteria
 */
export function filterTracks(
  tracks: Track[],
  filters: {
    album?: string;
    mood?: string;
    tag?: string;
    year?: number;
  }
): Track[] {
  let filtered = tracks;

  if (filters.album) {
    filtered = filtered.filter(t => t.albumId === filters.album);
  }

  if (filters.mood) {
    filtered = filtered.filter(t => t.mood?.includes(filters.mood!));
  }

  if (filters.tag) {
    filtered = filtered.filter(t => t.tags?.includes(filters.tag!));
  }

  if (filters.year) {
    filtered = filtered.filter(t => {
      const year = new Date(t.releaseDate).getFullYear();
      return year === filters.year;
    });
  }

  return filtered;
}

/**
 * Sort tracks
 */
export function sortTracks(
  tracks: Track[],
  sortBy: 'title' | 'releaseDate' | 'duration' = 'releaseDate',
  order: 'asc' | 'desc' = 'desc'
): Track[] {
  const sorted = [...tracks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'releaseDate':
        comparison = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
        break;
      case 'duration':
        comparison = a.durationSec - b.durationSec;
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

