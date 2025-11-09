import { NextRequest, NextResponse } from 'next/server';
import { readJSON } from '@/lib/fs-json';
import type { Album, Track } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const albums = await readJSON<Album[]>('data/albums.json');
    const album = albums.find(a => a.slug === slug);

    if (!album) {
      return NextResponse.json(
        { success: false, error: 'Album not found' },
        { status: 404 }
      );
    }

    // Fetch tracks
    const allTracks = await readJSON<Track[]>('data/tracks.json');
    const tracks = album.tracks
      .map(trackId => allTracks.find(t => t.id === trackId))
      .filter(Boolean) as Track[];

    return NextResponse.json({
      success: true,
      data: {
        ...album,
        tracks,
      },
    });
  } catch (error) {
    console.error('Error fetching album:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch album' },
      { status: 500 }
    );
  }
}

