import { NextRequest, NextResponse } from 'next/server';
import { readJSON, updateJSON } from '@/lib/fs-json';
import { sanitizeContent, sanitizeSlug } from '@/lib/sanitize';
// Authentication removed - handled client-side
import type { Post } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const posts = await readJSON<Post[]>('data/posts.json');
    const post = posts.find(p => p.id === id);

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updatedPost = await updateJSON<Post[]>('data/posts.json', (posts) => {
      const index = posts.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Post not found');
      }

      const post = posts[index];
      const userId = (session.user as { id?: string }).id!;
      const userRole = (session.user as { role?: string }).role!;

      // Check permissions
      if (!canEditPost(userId, post.authorId, userRole)) {
        throw new Error('Permission denied');
      }

      // Update fields
      if (body.title) post.title = body.title;
      if (body.slug) post.slug = sanitizeSlug(body.slug);
      if (body.excerpt) post.excerpt = body.excerpt;
      if (body.content) post.content = sanitizeContent(body.content);
      if (body.status) post.status = body.status;
      if (body.tags) post.tags = body.tags;
      if (body.categoryId) post.categoryId = body.categoryId;
      if (body.heroImage !== undefined) post.heroImage = body.heroImage;
      if (body.publishAt !== undefined) post.publishAt = body.publishAt;
      if (body.ogImage !== undefined) post.ogImage = body.ogImage;
      if (body.ogDescription !== undefined) post.ogDescription = body.ogDescription;

      post.updatedAt = new Date().toISOString();

      posts[index] = post;
      return posts;
    });

    const post = updatedPost.find(p => p.id === id);

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await updateJSON<Post[]>('data/posts.json', (posts) => {
      const index = posts.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Post not found');
      }

      const post = posts[index];
      const userId = (session.user as { id?: string }).id!;
      const userRole = (session.user as { role?: string }).role!;

      // Check permissions (only admin can delete)
      if (userRole !== 'ADMIN') {
        throw new Error('Permission denied');
      }

      posts.splice(index, 1);
      return posts;
    });

    return NextResponse.json({
      success: true,
      message: 'Post deleted',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete post' },
      { status: 500 }
    );
  }
}

