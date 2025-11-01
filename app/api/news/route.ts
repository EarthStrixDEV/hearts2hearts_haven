import { NextRequest, NextResponse } from "next/server";
import { NewsListResponse, NewsArticle } from "@/app/types/news";
import fs from 'fs';
import path from 'path';

const NEWS_FILE_PATH = path.join(process.cwd(), 'cms-data', 'news.json');

// Helper function to read news from JSON
function getNewsFromJSON(): NewsArticle[] {
  try {
    if (!fs.existsSync(NEWS_FILE_PATH)) {
      return [];
    }
    const fileContent = fs.readFileSync(NEWS_FILE_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading news JSON:', error);
    return [];
  }
}

// Helper function to filter news
function getFilteredNews(filters: {
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
}): NewsArticle[] {
  let filtered = getNewsFromJSON();

  if (filters.category) {
    filtered = filtered.filter((article) => article.category === filters.category);
  }

  if (filters.tag) {
    filtered = filtered.filter((article) =>
      article.tags.some((tag) => tag.toLowerCase() === filters.tag?.toLowerCase())
    );
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (article) =>
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  if (filters.featured !== undefined) {
    filtered = filtered.filter((article) => article.featured === filters.featured);
  }

  // Sort by date (newest first)
  filtered.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return filtered;
}

// GET /api/news
// Query params: category, tag, search, featured, page, pageSize
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const category = searchParams.get("category") || undefined;
    const tag = searchParams.get("tag") || undefined;
    const search = searchParams.get("search") || undefined;
    const featuredParam = searchParams.get("featured");
    const featured = featuredParam ? featuredParam === "true" : undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "9");

    // Get filtered articles
    const allArticles = getFilteredNews({
      category,
      tag,
      search,
      featured,
    });

    // Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = allArticles.slice(startIndex, endIndex);

    const response: NewsListResponse = {
      articles: paginatedArticles,
      total: allArticles.length,
      page,
      pageSize,
      hasMore: endIndex < allArticles.length,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news articles" },
      { status: 500 }
    );
  }
}

// POST - Create or update news articles
export async function POST(request: NextRequest) {
  try {
    const newsArticles: NewsArticle[] = await request.json();
    
    // Ensure the directory exists
    const dir = path.dirname(NEWS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the data to file
    fs.writeFileSync(NEWS_FILE_PATH, JSON.stringify(newsArticles, null, 2), 'utf-8');
    
    return NextResponse.json(
      { message: 'News articles data saved successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving news articles:', error);
    return NextResponse.json(
      { error: 'Failed to save news articles data' },
      { status: 500 }
    );
  }
}

// PUT - Update a single news article
export async function PUT(request: NextRequest) {
  try {
    const updatedArticle: NewsArticle = await request.json();
    
    if (!fs.existsSync(NEWS_FILE_PATH)) {
      return NextResponse.json(
        { error: 'News articles data file not found' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(NEWS_FILE_PATH, 'utf-8');
    let newsArticles: NewsArticle[] = JSON.parse(fileContent);
    
    const articleIndex = newsArticles.findIndex(article => article.id === updatedArticle.id);
    
    if (articleIndex === -1) {
      // Add new article
      newsArticles.push(updatedArticle);
    } else {
      // Update existing article
      newsArticles[articleIndex] = updatedArticle;
    }
    
    fs.writeFileSync(NEWS_FILE_PATH, JSON.stringify(newsArticles, null, 2), 'utf-8');
    
    return NextResponse.json(
      { message: 'News article updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating news article:', error);
    return NextResponse.json(
      { error: 'Failed to update news article' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a news article
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('id');
    
    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    if (!fs.existsSync(NEWS_FILE_PATH)) {
      return NextResponse.json(
        { error: 'News articles data file not found' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(NEWS_FILE_PATH, 'utf-8');
    let newsArticles: NewsArticle[] = JSON.parse(fileContent);
    
    const initialLength = newsArticles.length;
    newsArticles = newsArticles.filter(article => article.id !== articleId);
    
    if (newsArticles.length === initialLength) {
      return NextResponse.json(
        { error: 'News article not found' },
        { status: 404 }
      );
    }
    
    fs.writeFileSync(NEWS_FILE_PATH, JSON.stringify(newsArticles, null, 2), 'utf-8');
    
    return NextResponse.json(
      { message: 'News article deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting news article:', error);
    return NextResponse.json(
      { error: 'Failed to delete news article' },
      { status: 500 }
    );
  }
}

// For future backend integration:
/*
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Parse query parameters
  const filters = {
    category: searchParams.get("category"),
    tag: searchParams.get("tag"),
    search: searchParams.get("search"),
    featured: searchParams.get("featured") === "true",
    page: parseInt(searchParams.get("page") || "1"),
    pageSize: parseInt(searchParams.get("pageSize") || "9"),
  };

  // Database query example (when you have a DB):
  const query = db.newsArticles
    .select()
    .where(filters.category ? eq(newsArticles.category, filters.category) : undefined)
    .where(filters.featured ? eq(newsArticles.featured, true) : undefined)
    .orderBy(desc(newsArticles.publishedAt))
    .limit(filters.pageSize)
    .offset((filters.page - 1) * filters.pageSize);

  const articles = await query;
  const total = await db.newsArticles.count();

  return NextResponse.json({
    articles,
    total,
    page: filters.page,
    pageSize: filters.pageSize,
    hasMore: (filters.page * filters.pageSize) < total,
  });
}
*/

