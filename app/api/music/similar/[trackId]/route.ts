import { NextRequest, NextResponse } from 'next/server';
import { readJSON } from '@/lib/fs-json';
import type { Track } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackId: string }> }
) {
  try {
    const { trackId } = await params;
    const tracks = await readJSON<Track[]>('data/tracks.json');
    const track = tracks.find(t => t.id === trackId);

    if (!track) {
      return NextResponse.json(
        { success: false, error: 'Track not found' },
        { status: 404 }
      );
    }

    // Find similar tracks based on mood, tags, and BPM
    const similarTracks = tracks
      .filter(t => t.id !== trackId)
      .map(t => {
        let score = 0;

        // Match mood
        const moodMatch = t.mood?.filter(m => track.mood?.includes(m)).length || 0;
        score += moodMatch * 3;

        // Match tags
        const tagMatch = t.tags?.filter(tag => track.tags?.includes(tag)).length || 0;
        score += tagMatch * 2;

        // Similar BPM (within 10)
        if (t.bpm && track.bpm && Math.abs(t.bpm - track.bpm) <= 10) {
          score += 1;
        }

        // Same album
        if (t.albumId === track.albumId) {
          score += 2;
        }

        return { track: t, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.track);

    return NextResponse.json({
      success: true,
      data: similarTracks,
    });
  } catch (error) {
    console.error('Error fetching similar tracks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch similar tracks' },
      { status: 500 }
    );
  }
}

