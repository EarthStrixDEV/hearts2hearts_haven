import { NextRequest, NextResponse } from 'next/server';
import { readJSON, updateJSON, generateId } from '@/lib/fs-json';
import { sanitizeContent, sanitizeSlug } from '@/lib/sanitize';
import { searchPosts } from '@/lib/search';
import { PostSchema, type Post } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const status = searchParams.get('status');
    const tag = searchParams.get('tag');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    let posts = await readJSON<Post[]>('data/posts.json');

    // Apply search
    if (query) {
      posts = searchPosts(posts, query);
    }

    // Apply filters
    if (status) {
      posts = posts.filter(p => p.status === status);
    }
    if (tag) {
      posts = posts.filter(p => p.tags.includes(tag));
    }
    if (category) {
      posts = posts.filter(p => p.categoryId === category);
    }

    // Sort by updatedAt (newest first)
    posts.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // Pagination
    const total = posts.length;
    const start = (page - 1) * pageSize;
    const paginatedPosts = posts.slice(start, start + pageSize);

    return NextResponse.json({
      success: true,
      data: paginatedPosts,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Note: Authentication is handled client-side
    // Server-side routes are now open but should be protected by middleware if needed

    const body = await request.json();
    
    // Sanitize content
    const sanitizedContent = sanitizeContent(body.content);
    const sanitizedSlug = sanitizeSlug(body.slug);

    // Create post
    const now = new Date().toISOString();
    const post: Post = {
      id: generateId('p'),
      title: body.title,
      slug: sanitizedSlug,
      excerpt: body.excerpt,
      content: sanitizedContent,
      status: body.status || 'DRAFT',
      authorId: (session.user as { id?: string }).id!,
      tags: body.tags || [],
      categoryId: body.categoryId,
      heroImage: body.heroImage,
      publishAt: body.publishAt || null,
      createdAt: now,
      updatedAt: now,
      ogImage: body.ogImage,
      ogDescription: body.ogDescription,
    };

    // Validate
    PostSchema.parse(post);

    // Save to database
    await updateJSON<Post[]>('data/posts.json', (posts) => {
      // Check for duplicate slug
      if (posts.some(p => p.slug === post.slug)) {
        throw new Error('Slug already exists');
      }
      posts.push(post);
      return posts;
    });

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create post' },
      { status: 500 }
    );
  }
}

