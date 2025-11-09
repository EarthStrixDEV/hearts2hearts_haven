import { NextRequest, NextResponse } from 'next/server';
import { readJSON } from '@/lib/fs-json';
import type { Playlist, Track } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const playlists = await readJSON<Playlist[]>('data/playlists.json');
    const playlist = playlists.find(p => p.id === id);

    if (!playlist) {
      return NextResponse.json(
        { success: false, error: 'Playlist not found' },
        { status: 404 }
      );
    }

    // Check if playlist is public or user has access
    if (!playlist.public) {
      // TODO: Add user authentication check
    }

    // Fetch tracks
    const allTracks = await readJSON<Track[]>('data/tracks.json');
    const tracks = playlist.tracks
      .map(trackId => allTracks.find(t => t.id === trackId))
      .filter(Boolean) as Track[];

    return NextResponse.json({
      success: true,
      data: {
        ...playlist,
        tracks,
      },
    });
  } catch (error) {
    console.error('Error fetching playlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch playlist' },
      { status: 500 }
    );
  }
}

