'use client';

import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { TrackCard } from '@/components/music/TrackCard';
import { AlbumCard } from '@/components/music/AlbumCard';
import type { Track, Album } from '@/lib/types';

export default function MusicStreamingPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [viewMode, setViewMode] = useState<'tracks' | 'albums'>('tracks');

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedMood, selectedYear]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Build query params
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (selectedMood) params.append('mood', selectedMood);
      if (selectedYear) params.append('year', selectedYear);

      // Fetch tracks
      const tracksRes = await fetch(`/api/music/tracks?${params}`);
      if (tracksRes.ok) {
        const tracksData = await tracksRes.json();
        setTracks(tracksData.data || []);
      }

      // Fetch albums
      const albumsRes = await fetch('/api/music/albums');
      if (albumsRes.ok) {
        const albumsData = await albumsRes.json();
        setAlbums(albumsData.data || []);
      }
    } catch (error) {
      console.error('Error loading music data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique moods and years
  const allMoods = Array.from(new Set(tracks.flatMap(t => t.mood || [])));
  const allYears = Array.from(new Set(tracks.map(t => new Date(t.releaseDate).getFullYear())));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            H2H Music Library
          </h1>
          <p className="text-xl text-gray-400">
            Stream Hearts2Hearts tracks with synced lyrics
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tracks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Mood Filter */}
            <div>
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Moods</option>
                {allMoods.map(mood => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Years</option>
                {allYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setViewMode('tracks')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                viewMode === 'tracks'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Tracks
            </button>
            <button
              onClick={() => setViewMode('albums')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                viewMode === 'albums'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Albums
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading music...</p>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <>
            {viewMode === 'tracks' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  {searchQuery || selectedMood || selectedYear ? 'Search Results' : 'All Tracks'}
                  <span className="text-gray-400 text-lg ml-2">({tracks.length})</span>
                </h2>
                
                {tracks.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    No tracks found
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tracks.map(track => (
                      <TrackCard key={track.id} track={track} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {viewMode === 'albums' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Albums
                  <span className="text-gray-400 text-lg ml-2">({albums.length})</span>
                </h2>
                
                {albums.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    No albums found
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {albums.map(album => (
                      <AlbumCard key={album.id} album={album} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

