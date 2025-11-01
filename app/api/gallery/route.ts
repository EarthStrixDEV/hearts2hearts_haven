import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const GALLERY_FILE_PATH = path.join(process.cwd(), 'cms-data', 'gallery.json');

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  member: string | null;
  description: string;
  emoji: string;
  imageUrl: string;
  uploadDate: string;
  size: string;
}

// GET - Read all gallery images
export async function GET() {
  try {
    if (!fs.existsSync(GALLERY_FILE_PATH)) {
      return NextResponse.json([], { status: 200 });
    }

    const fileContent = fs.readFileSync(GALLERY_FILE_PATH, 'utf-8');
    const galleryImages: GalleryImage[] = JSON.parse(fileContent);
    
    return NextResponse.json(galleryImages, { status: 200 });
  } catch (error) {
    console.error('Error reading gallery images:', error);
    return NextResponse.json(
      { error: 'Failed to read gallery images data' },
      { status: 500 }
    );
  }
}

// POST - Create or update gallery images
export async function POST(request: NextRequest) {
  try {
    const galleryImages: GalleryImage[] = await request.json();
    
    // Ensure the directory exists
    const dir = path.dirname(GALLERY_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the data to file
    fs.writeFileSync(GALLERY_FILE_PATH, JSON.stringify(galleryImages, null, 2), 'utf-8');
    
    return NextResponse.json(
      { message: 'Gallery images data saved successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving gallery images:', error);
    return NextResponse.json(
      { error: 'Failed to save gallery images data' },
      { status: 500 }
    );
  }
}

// PUT - Update a single gallery image
export async function PUT(request: NextRequest) {
  try {
    const updatedImage: GalleryImage = await request.json();
    
    if (!fs.existsSync(GALLERY_FILE_PATH)) {
      return NextResponse.json(
        { error: 'Gallery images data file not found' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(GALLERY_FILE_PATH, 'utf-8');
    let galleryImages: GalleryImage[] = JSON.parse(fileContent);
    
    const imageIndex = galleryImages.findIndex(img => img.id === updatedImage.id);
    
    if (imageIndex === -1) {
      // Add new image
      galleryImages.push(updatedImage);
    } else {
      // Update existing image
      galleryImages[imageIndex] = updatedImage;
    }
    
    fs.writeFileSync(GALLERY_FILE_PATH, JSON.stringify(galleryImages, null, 2), 'utf-8');
    
    return NextResponse.json(
      { message: 'Gallery image updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery image' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a gallery image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');
    
    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    if (!fs.existsSync(GALLERY_FILE_PATH)) {
      return NextResponse.json(
        { error: 'Gallery images data file not found' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(GALLERY_FILE_PATH, 'utf-8');
    let galleryImages: GalleryImage[] = JSON.parse(fileContent);
    
    const initialLength = galleryImages.length;
    galleryImages = galleryImages.filter(img => img.id !== imageId);
    
    if (galleryImages.length === initialLength) {
      return NextResponse.json(
        { error: 'Gallery image not found' },
        { status: 404 }
      );
    }
    
    fs.writeFileSync(GALLERY_FILE_PATH, JSON.stringify(galleryImages, null, 2), 'utf-8');
    
    return NextResponse.json(
      { message: 'Gallery image deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery image' },
      { status: 500 }
    );
  }
}
