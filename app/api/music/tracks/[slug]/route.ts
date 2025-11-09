import { NextRequest, NextResponse } from 'next/server';
import { readJSON } from '@/lib/fs-json';
import type { Track, Lyrics, Credits } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const tracks = await readJSON<Track[]>('data/tracks.json');
    const track = tracks.find(t => t.slug === slug);

    if (!track) {
      return NextResponse.json(
        { success: false, error: 'Track not found' },
        { status: 404 }
      );
    }

    // Fetch lyrics
    const allLyrics = await readJSON<Lyrics[]>('data/lyrics.json');
    const lyrics = allLyrics.filter(l => track.lyricsIds.includes(l.id));

    // Fetch credits
    const allCredits = await readJSON<Credits[]>('data/credits.json');
    const credits = allCredits.find(c => c.id === track.creditsId);

    return NextResponse.json({
      success: true,
      data: {
        ...track,
        lyrics,
        credits,
      },
    });
  } catch (error) {
    console.error('Error fetching track:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch track' },
      { status: 500 }
    );
  }
}

