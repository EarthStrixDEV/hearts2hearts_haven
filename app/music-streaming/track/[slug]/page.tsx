'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Music } from 'lucide-react';
import { AudioPlayer } from '@/components/music/AudioPlayer';
import { LyricsDisplay } from '@/components/music/LyricsDisplay';
import { TrackCard } from '@/components/music/TrackCard';
import type { Track, Lyrics, Credits } from '@/lib/types';

interface TrackData {
  track: Track & {
    lyrics: Lyrics[];
    credits: Credits;
  };
  similarTracks: Track[];
}

export default function TrackPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<TrackData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    loadTrack();
  }, [slug]);

  const loadTrack = async () => {
    try {
      setIsLoading(true);

      // Fetch track with lyrics and credits
      const trackRes = await fetch(`/api/music/tracks/${slug}`);
      if (!trackRes.ok) throw new Error('Track not found');
      
      const trackData = await trackRes.json();
      const track = trackData.data;

      // Fetch similar tracks
      const similarRes = await fetch(`/api/music/similar/${track.id}`);
      const similarData = await similarRes.json();

      setData({
        track,
        similarTracks: similarData.data || [],
      });

      // Send telemetry
      await fetch('/api/music/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'play_start',
          data: { trackId: track.id, trackSlug: slug },
        }),
      });
    } catch (error) {
      console.error('Error loading track:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading track...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Music size={64} className="text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Track not found</h1>
          <Link href="/music-streaming" className="text-blue-400 hover:text-blue-300">
            Back to library
          </Link>
        </div>
      </div>
    );
  }

  const { track, similarTracks } = data;

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

        {/* Track Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Artwork */}
          <div className="lg:col-span-1">
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={track.artwork}
                alt={track.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Track Info */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <h1 className="text-5xl font-bold mb-4">{track.title}</h1>
            <p className="text-2xl text-gray-400 mb-6">Hearts2Hearts</p>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 mb-6">
              {track.explicit && (
                <span className="bg-red-600 px-3 py-1 rounded text-sm font-bold">
                  EXPLICIT
                </span>
              )}
              {track.mood?.map(mood => (
                <span key={mood} className="bg-gray-700 px-3 py-1 rounded text-sm">
                  {mood}
                </span>
              ))}
              {track.bpm && (
                <span className="bg-gray-700 px-3 py-1 rounded text-sm">
                  {track.bpm} BPM
                </span>
              )}
            </div>

            {/* Credits */}
            {track.credits && (
              <div className="bg-gray-800 rounded-lg p-6 space-y-3">
                <h3 className="font-bold text-lg mb-4">Credits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Composer:</span>
                    <p className="text-white">{track.credits.composer.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Lyricist:</span>
                    <p className="text-white">{track.credits.lyricist.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Arranger:</span>
                    <p className="text-white">{track.credits.arranger.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Producer:</span>
                    <p className="text-white">{track.credits.producer.join(', ')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Audio Player */}
        <div className="mb-12">
          <AudioPlayer
            track={track}
            onTimeUpdate={handleTimeUpdate}
          />
        </div>

        {/* Lyrics */}
        {track.lyrics && track.lyrics.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Lyrics</h2>
            <LyricsDisplay
              lyrics={track.lyrics}
              track={track}
              currentTime={currentTime}
            />
          </div>
        )}

        {/* Similar Tracks */}
        {similarTracks.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Similar Tracks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarTracks.map(similarTrack => (
                <TrackCard key={similarTrack.id} track={similarTrack} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

