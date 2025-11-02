import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CAROUSEL_FILE = path.join(process.cwd(), "cms-data", "carousel.json");

interface CarouselImage {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Helper function to read carousel data
function readCarouselData(): CarouselImage[] {
  try {
    if (!fs.existsSync(CAROUSEL_FILE)) {
      return [];
    }
    const data = fs.readFileSync(CAROUSEL_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading carousel data:", error);
    return [];
  }
}

// Helper function to write carousel data
function writeCarouselData(data: CarouselImage[]): void {
  try {
    const dir = path.dirname(CAROUSEL_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CAROUSEL_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing carousel data:", error);
    throw error;
  }
}

// GET - Fetch all carousel images
export async function GET() {
  try {
    const carouselImages = readCarouselData();
    // Sort by order and filter active images for public API
    const sortedImages = carouselImages
      .filter(img => img.isActive)
      .sort((a, b) => a.order - b.order);
    
    return NextResponse.json(sortedImages);
  } catch (error) {
    console.error("Error fetching carousel images:", error);
    return NextResponse.json(
      { error: "Failed to fetch carousel images" },
      { status: 500 }
    );
  }
}

// POST - Add new carousel image
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, imageUrl, description, category } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: "Title and image URL are required" },
        { status: 400 }
      );
    }

    const carouselImages = readCarouselData();
    
    // Get next order number
    const maxOrder = carouselImages.length > 0 
      ? Math.max(...carouselImages.map(img => img.order))
      : 0;

    const newImage: CarouselImage = {
      id: Date.now().toString(),
      title,
      imageUrl,
      description: description || "",
      category: category || "Performance",
      order: maxOrder + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    carouselImages.push(newImage);
    writeCarouselData(carouselImages);

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error("Error creating carousel image:", error);
    return NextResponse.json(
      { error: "Failed to create carousel image" },
      { status: 500 }
    );
  }
}

// PUT - Update carousel image
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, imageUrl, description, category, order, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    const carouselImages = readCarouselData();
    const imageIndex = carouselImages.findIndex(img => img.id === id);

    if (imageIndex === -1) {
      return NextResponse.json(
        { error: "Carousel image not found" },
        { status: 404 }
      );
    }

    // Update the image
    carouselImages[imageIndex] = {
      ...carouselImages[imageIndex],
      title: title ?? carouselImages[imageIndex].title,
      imageUrl: imageUrl ?? carouselImages[imageIndex].imageUrl,
      description: description ?? carouselImages[imageIndex].description,
      category: category ?? carouselImages[imageIndex].category,
      order: order ?? carouselImages[imageIndex].order,
      isActive: isActive ?? carouselImages[imageIndex].isActive,
      updatedAt: new Date().toISOString(),
    };

    writeCarouselData(carouselImages);

    return NextResponse.json(carouselImages[imageIndex]);
  } catch (error) {
    console.error("Error updating carousel image:", error);
    return NextResponse.json(
      { error: "Failed to update carousel image" },
      { status: 500 }
    );
  }
}

// DELETE - Delete carousel image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    const carouselImages = readCarouselData();
    const filteredImages = carouselImages.filter(img => img.id !== id);

    if (filteredImages.length === carouselImages.length) {
      return NextResponse.json(
        { error: "Carousel image not found" },
        { status: 404 }
      );
    }

    writeCarouselData(filteredImages);

    return NextResponse.json({ message: "Carousel image deleted successfully" });
  } catch (error) {
    console.error("Error deleting carousel image:", error);
    return NextResponse.json(
      { error: "Failed to delete carousel image" },
      { status: 500 }
    );
  }
}
