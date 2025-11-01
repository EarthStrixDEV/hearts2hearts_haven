// Types for News/Blog System
// This structure is ready for future database integration

export type NewsCategory = 
  | "latest-news"
  | "behind-the-scenes"
  | "fan-stories"
  | "interviews"
  | "performances"
  | "announcements";

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  titleKo?: string; // Korean title
  category: NewsCategory;
  excerpt: string;
  content: string; // HTML or Markdown content
  coverImage: string;
  images?: string[]; // Additional images
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  tags: string[];
  publishedAt: string; // ISO date string
  updatedAt?: string;
  featured: boolean; // For featured/hero articles
  views?: number;
  likes?: number;
  readTime?: number; // in minutes
}

export interface NewsListResponse {
  articles: NewsArticle[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface NewsFilters {
  category?: NewsCategory;
  tag?: string;
  search?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
}

// Database Schema (for future reference)
// This is the schema structure you would use with a real database
/*
CREATE TABLE news_articles (
  id VARCHAR(36) PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_ko TEXT,
  category VARCHAR(50) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  images JSON,
  author_name VARCHAR(255) NOT NULL,
  author_role VARCHAR(255),
  author_avatar TEXT,
  tags JSON,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  featured BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  read_time INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_slug (slug),
  INDEX idx_published (published_at),
  INDEX idx_featured (featured)
);
*/

