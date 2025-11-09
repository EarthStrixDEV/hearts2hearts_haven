'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Play, Clock } from 'lucide-react';
import { formatTime } from '@/lib/lyrics';
import type { Album, Track } from '@/lib/types';

interface AlbumData {
  album: Album & {
    tracks: Track[];
  };
}

export default function AlbumPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<AlbumData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAlbum();
  }, [slug]);

  const loadAlbum = async () => {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/music/albums/${slug}`);
      if (!res.ok) throw new Error('Album not found');
      
      const albumData = await res.json();
      setData({ album: albumData.data });
    } catch (error) {
      console.error('Error loading album:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading album...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-2">Album not found</h1>
          <Link href="/music-streaming" className="text-blue-400 hover:text-blue-300">
            Back to library
          </Link>
        </div>
      </div>
    );
  }

  const { album } = data;
  const totalDuration = album.tracks.reduce((sum, track) => sum + track.durationSec, 0);
  const releaseYear = new Date(album.releaseDate).getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/music-streaming"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition"
        >
          <ArrowLeft size={20} />
          Back to Library
        </Link>

        {/* Album Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Cover */}
          <div className="lg:col-span-1">
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={album.cover}
                alt={album.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Album Info */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            {album.type && (
              <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">
                {album.type}
              </p>
            )}
            <h1 className="text-5xl font-bold mb-4">{album.title}</h1>
            <p className="text-2xl text-gray-400 mb-6">Hearts2Hearts</p>

            <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
              <span>{releaseYear}</span>
              <span>•</span>
              <span>{album.tracks.length} tracks</span>
              <span>•</span>
              <span>{formatTime(totalDuration)}</span>
            </div>

            {album.description && (
              <p className="text-gray-300 mb-6">{album.description}</p>
            )}

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2 transition w-fit">
              <Play size={24} fill="white" />
              Play All
            </button>
          </div>
        </div>

        {/* Track List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Tracks</h2>
          <div className="space-y-2">
            {album.tracks.map((track, index) => (
              <Link
                key={track.id}
                href={`/music-streaming/track/${track.slug}`}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-700 transition group"
              >
                <span className="text-gray-400 w-8 text-center">{index + 1}</span>
                
                <div className="flex-1">
                  <h3 className="font-medium group-hover:text-blue-400 transition">
                    {track.title}
                  </h3>
                  {track.tags && track.tags.length > 0 && (
                    <div className="flex gap-2 mt-1">
                      {track.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs text-gray-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={16} />
                  <span className="text-sm">{formatTime(track.durationSec)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

