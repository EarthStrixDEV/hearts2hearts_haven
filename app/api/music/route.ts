import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MUSIC_FILE_PATH = path.join(process.cwd(), 'cms-data', 'music.json');

export interface MusicVideo {
  id: string;
  title: string;
  artist: string;
  type: string;
  youtubeId: string;
  releaseDate: string;
  views: string;
  thumbnail: string;
  description: string;
  emoji: string;
  featured: boolean;
}

// GET - Read all music videos
export async function GET() {
  try {
    if (!fs.existsSync(MUSIC_FILE_PATH)) {
      return NextResponse.json([], { status: 200 });
    }

    const fileContent = fs.readFileSync(MUSIC_FILE_PATH, 'utf-8');
    const musicVideos: MusicVideo[] = JSON.parse(fileContent);
    
    return NextResponse.json(musicVideos, { status: 200 });
  } catch (error) {
    console.error('Error reading music videos:', error);
    return NextResponse.json(
      { error: 'Failed to read music videos data' },
      { status: 500 }
    );
  }
}

// POST - Create or update music videos
export async function POST(request: NextRequest) {
  try {
    const musicVideos: MusicVideo[] = await request.json();
    
    // Ensure the directory exists
    const dir = path.dirname(MUSIC_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the data to file
    fs.writeFileSync(MUSIC_FILE_PATH, JSON.stringify(musicVideos, null, 2), 'utf-8');
    
    return NextResponse.json(
      { message: 'Music videos data saved successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving music videos:', error);
    return NextResponse.json(
      { error: 'Failed to save music videos data' },
      { status: 500 }
    );
  }
}

// PUT - Update a single music video
export async function PUT(request: NextRequest) {
  try {
    const updatedVideo: MusicVideo = await request.json();
    
    if (!fs.existsSync(MUSIC_FILE_PATH)) {
      return NextResponse.json(
        { error: 'Music videos data file not found' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(MUSIC_FILE_PATH, 'utf-8');
    let musicVideos: MusicVideo[] = JSON.parse(fileContent);
    
    const videoIndex = musicVideos.findIndex(v => v.id === updatedVideo.id);
    
    if (videoIndex === -1) {
      // Add new video
      musicVideos.push(updatedVideo);
    } else {
      // Update existing video
      musicVideos[videoIndex] = updatedVideo;
    }
    
    fs.writeFileSync(MUSIC_FILE_PATH, JSON.stringify(musicVideos, null, 2), 'utf-8');
    
    return NextResponse.json(
      { message: 'Music video updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating music video:', error);
    return NextResponse.json(
      { error: 'Failed to update music video' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a music video
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('id');
    
    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    if (!fs.existsSync(MUSIC_FILE_PATH)) {
      return NextResponse.json(
        { error: 'Music videos data file not found' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(MUSIC_FILE_PATH, 'utf-8');
    let musicVideos: MusicVideo[] = JSON.parse(fileContent);
    
    const initialLength = musicVideos.length;
    musicVideos = musicVideos.filter(v => v.id !== videoId);
    
    if (musicVideos.length === initialLength) {
      return NextResponse.json(
        { error: 'Music video not found' },
        { status: 404 }
      );
    }
    
    fs.writeFileSync(MUSIC_FILE_PATH, JSON.stringify(musicVideos, null, 2), 'utf-8');
    
    return NextResponse.json(
      { message: 'Music video deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting music video:', error);
    return NextResponse.json(
      { error: 'Failed to delete music video' },
      { status: 500 }
    );
  }
}
