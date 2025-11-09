'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Clock } from 'lucide-react';
import { formatTime } from '@/lib/lyrics';
import type { Track } from '@/lib/types';

interface TrackCardProps {
  track: Track;
  onPlay?: () => void;
}

export function TrackCard({ track, onPlay }: TrackCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition group">
      <Link href={`/music/track/${track.slug}`}>
        <div className="relative aspect-square">
          <Image
            src={track.artwork}
            alt={track.title}
            fill
            className="object-cover"
          />
          {onPlay && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onPlay();
              }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition"
              aria-label={`Play ${track.title}`}
            >
              <div className="bg-blue-600 rounded-full p-4">
                <Play size={32} fill="white" />
              </div>
            </button>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/music/track/${track.slug}`}>
          <h3 className="font-bold text-white hover:text-blue-400 transition truncate">
            {track.title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
          <Clock size={14} />
          <span>{formatTime(track.durationSec)}</span>
        </div>

        {track.tags && track.tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {track.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

