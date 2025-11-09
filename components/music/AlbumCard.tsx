'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Album } from '@/lib/types';

interface AlbumCardProps {
  album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
  const releaseYear = new Date(album.releaseDate).getFullYear();

  return (
    <Link href={`/music/album/${album.slug}`}>
      <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition group">
        <div className="relative aspect-square">
          <Image
            src={album.cover}
            alt={album.title}
            fill
            className="object-cover group-hover:scale-105 transition"
          />
        </div>

        <div className="p-4">
          <h3 className="font-bold text-white group-hover:text-blue-400 transition truncate">
            {album.title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
            {album.type && (
              <span className="bg-gray-700 px-2 py-0.5 rounded text-xs">
                {album.type}
              </span>
            )}
            <span>{releaseYear}</span>
            <span>•</span>
            <span>{album.tracks.length} tracks</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

