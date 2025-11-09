import { NextRequest, NextResponse } from 'next/server';
import { readJSON } from '@/lib/fs-json';
import { searchTracks, filterTracks, sortTracks } from '@/lib/search';
import type { Track } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const album = searchParams.get('album') || '';
    const mood = searchParams.get('mood') || '';
    const tag = searchParams.get('tag') || '';
    const year = searchParams.get('year');
    const sort = searchParams.get('sort') as 'title' | 'releaseDate' | 'duration' || 'releaseDate';
    const order = searchParams.get('order') as 'asc' | 'desc' || 'desc';

    let tracks = await readJSON<Track[]>('data/tracks.json');

    // Apply search
    if (query) {
      tracks = searchTracks(tracks, query);
    }

    // Apply filters
    tracks = filterTracks(tracks, {
      album: album || undefined,
      mood: mood || undefined,
      tag: tag || undefined,
      year: year ? parseInt(year) : undefined,
    });

    // Apply sorting
    tracks = sortTracks(tracks, sort, order);

    return NextResponse.json({
      success: true,
      data: tracks,
      count: tracks.length,
    });
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tracks' },
      { status: 500 }
    );
  }
}

