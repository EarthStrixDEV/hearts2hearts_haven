import { NextRequest, NextResponse } from "next/server";
import { NewsArticle } from "@/app/types/news";
import fs from 'fs';
import path from 'path';

const NEWS_FILE_PATH = path.join(process.cwd(), 'cms-data', 'news.json');

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

function getNewsArticleBySlug(slug: string): NewsArticle | undefined {
  const articles = getNewsFromJSON();
  return articles.find((article) => article.slug === slug);
}

function getRelatedNews(currentArticleId: string, limit: number = 3): NewsArticle[] {
  const articles = getNewsFromJSON();
  const currentArticle = articles.find((a) => a.id === currentArticleId);
  if (!currentArticle) return [];

  return articles
    .filter((article) => article.id !== currentArticleId)
    .filter(
      (article) =>
        article.category === currentArticle.category ||
        article.tags.some((tag) => currentArticle.tags.includes(tag))
    )
    .slice(0, limit);
}

// GET /api/news/[slug]
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const article = getNewsArticleBySlug(slug);

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // Get related articles
    const relatedArticles = getRelatedNews(article.id, 3);

    return NextResponse.json(
      {
        article,
        related: relatedArticles,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

// For future backend integration:
/*
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // Database query example:
  const article = await db.newsArticles
    .select()
    .where(eq(newsArticles.slug, slug))
    .limit(1);

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  // Increment view count
  await db.newsArticles
    .update({ views: article.views + 1 })
    .where(eq(newsArticles.id, article.id));

  // Get related articles
  const related = await db.newsArticles
    .select()
    .where(
      or(
        eq(newsArticles.category, article.category),
        // Add tag matching logic
      )
    )
    .where(ne(newsArticles.id, article.id))
    .limit(3);

  return NextResponse.json({ article, related });
}
*/

