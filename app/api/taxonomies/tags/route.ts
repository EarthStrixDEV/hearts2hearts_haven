import { NextRequest, NextResponse } from 'next/server';
import { readJSON } from '@/lib/fs-json';
import type { Tag } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const tags = await readJSON<Tag[]>('data/tags.json');

    return NextResponse.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

