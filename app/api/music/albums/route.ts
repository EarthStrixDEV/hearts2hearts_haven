import { NextRequest, NextResponse } from 'next/server';
import { readJSON } from '@/lib/fs-json';
import { searchAlbums } from '@/lib/search';
import type { Album } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const type = searchParams.get('type');

    let albums = await readJSON<Album[]>('data/albums.json');

    // Apply search
    if (query) {
      albums = searchAlbums(albums, query);
    }

    // Filter by type
    if (type) {
      albums = albums.filter(a => a.type === type);
    }

    // Sort by release date (newest first)
    albums.sort((a, b) => 
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );

    return NextResponse.json({
      success: true,
      data: albums,
      count: albums.length,
    });
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch albums' },
      { status: 500 }
    );
  }
}

