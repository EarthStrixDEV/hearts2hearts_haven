# H2H News/Blog System Documentation 📰

## ภาพรวม (Overview)

สร้างระบบข่าวสาร/บล็อกที่สมบูรณ์สำหรับ H2H พร้อมการแยกหมวดหมู่ ระบบค้นหา และโครงสร้าง API ที่พร้อมสำหรับการเชื่อมต่อ Backend ในอนาคต

A complete News/Blog system for H2H with categories, search functionality, and API structure ready for future backend integration.

---

## 📁 ไฟล์ที่สร้าง (Files Created)

### 1. Type Definitions
**`/app/types/news.ts`**
- TypeScript interfaces สำหรับ News articles
- Database schema comments สำหรับอนาคต
- Types สำหรับ filters และ pagination

### 2. Mock Data & Utilities
**`/app/lib/mockNewsData.ts`**
- Mock data สำหรับ 8 บทความ
- Helper functions สำหรับ filtering และ search
- Related articles logic

### 3. API Routes
**`/app/api/news/route.ts`**
- GET `/api/news` - รายการข่าวทั้งหมด
- รองรับ query parameters: category, tag, search, featured, page, pageSize
- Includes example code สำหรับ database integration

**`/app/api/news/[slug]/route.ts`**
- GET `/api/news/[slug]` - ข่าวแต่ละเรื่อง
- Related articles included
- Includes example code สำหรับ database queries

### 4. Pages
**`/app/news/page.tsx`**
- หน้าแสดงรายการข่าวทั้งหมด
- Category filters
- Search functionality
- Featured articles section

**`/app/news/[slug]/page.tsx`**
- หน้าแสดงข่าวแต่ละเรื่อง (individual article)
- Full article content
- Like & Share functionality
- Related articles
- Author information

### 5. Navigation Update
**`/app/components/Navigation.tsx`**
- เพิ่ม "News" ในเมนูหลัก

### 6. Home Page Integration
**`/app/page.tsx`**
- เพิ่มลิงก์ "View All News" ในส่วน Latest Updates

---

## 🎨 Features

### หน้าหลัก News (`/news`)
✅ **Hero Section** พร้อม search bar
✅ **Featured Articles** แสดงข่าวเด่น 3 อันดับแรก
✅ **Category Filters** 7 หมวดหมู่:
  - All News
  - Latest 🆕
  - Behind the Scenes 🎬
  - Fan Stories 💕
  - Interviews 🎤
  - Performances 💃
  - Announcements 📢
✅ **Search Functionality** ค้นหาจาก title, excerpt, tags
✅ **Responsive Grid** 1-3 columns ตามขนาดหน้าจอ
✅ **Loading States** skeleton screens
✅ **Empty States** เมื่อไม่มีผลลัพธ์

### หน้าแสดงข่าว (`/news/[slug]`)
✅ **Hero Image** พร้อม gradient overlay
✅ **Article Metadata** author, date, read time, views
✅ **Tags System** แสดงและ link ไป tags
✅ **Rich Content** HTML content rendering
✅ **Image Gallery** additional images grid
✅ **Engagement**:
  - Like button (animated heart)
  - View counter
  - Share functionality (Web Share API + fallback)
✅ **Author Card** information
✅ **Related Articles** 3 บทความที่เกี่ยวข้อง
✅ **Back Navigation** กลับไปหน้า News

---

## 🎭 Animation Effects (Framer Motion)

### Page Animations:
- **Fade & Slide** - Hero section และ headers
- **Stagger Children** - Featured articles grid
- **Scale on Hover** - Category filter buttons
- **Page Transitions** - AnimatePresence สำหรับ filtering
- **Like Button** - Scale animation เมื่อกด
- **Floating Elements** - Decorative emojis

### Micro-interactions:
- Image zoom on hover (scale 1.1)
- Button press feedback (scale 0.95)
- Smooth color transitions
- Loading skeletons

---

## 📊 Data Structure

### NewsArticle Interface:
```typescript
{
  id: string;
  slug: string;
  title: string;
  titleKo?: string;
  category: NewsCategory;
  excerpt: string;
  content: string; // HTML content
  coverImage: string;
  images?: string[];
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  featured: boolean;
  views?: number;
  likes?: number;
  readTime?: number;
}
```

---

## 🗄️ Database Schema (For Future Implementation)

พร้อม SQL schema ใน `/app/types/news.ts`:

```sql
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
```

---

## 🔌 API Endpoints

### GET `/api/news`
**Query Parameters:**
- `category` - Filter by category
- `tag` - Filter by tag
- `search` - Search in title/excerpt
- `featured` - true/false
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 9)

**Response:**
```json
{
  "articles": [...],
  "total": 8,
  "page": 1,
  "pageSize": 9,
  "hasMore": false
}
```

### GET `/api/news/[slug]`
**Response:**
```json
{
  "article": {...},
  "related": [...]
}
```

---

## 📰 Mock Articles (8 บทความ)

1. **H2H Music Core Comeback** - Latest News
2. **Behind Scenes FOCUS MV** - Behind-the-Scenes
3. **Fan's First Concert** - Fan Stories
4. **Carmen Interview** - Interviews
5. **FOCUS Dance Practice** - Performances
6. **MAMA Awards Nomination** - Announcements
7. **Jiwoo Leadership** - Interviews
8. **Stella Producer Credits** - Latest News

---

## 🎯 Categories & Color Coding

| Category | Color | Use Case |
|----------|-------|----------|
| Latest News | Blue | ข่าวสารล่าสุด |
| Behind-the-Scenes | Purple | เบื้องหลังการผลิต |
| Fan Stories | Pink | เรื่องราวจากแฟนคลับ |
| Interviews | Green | สัมภาษณ์สมาชิก |
| Performances | Orange | การแสดงและคอนเสิร์ต |
| Announcements | Red | ประกาศสำคัญ |

---

## 🚀 การใช้งาน (Usage)

### การเข้าถึง:
- **รายการข่าว**: http://localhost:3000/news
- **ข่าวแต่ละเรื่อง**: http://localhost:3000/news/[slug]
- **API**: http://localhost:3000/api/news

### ตัวอย่างการค้นหา:
```
/news?category=interviews
/news?search=Carmen
/news?featured=true
/news?tag=FOCUS
```

---

## 🔧 Customization

### เพิ่มบทความใหม่:
แก้ไขใน `/app/lib/mockNewsData.ts` array `mockNewsArticles`

```typescript
{
  id: "9",
  slug: "new-article-slug",
  title: "Your Title Here",
  category: "latest-news",
  excerpt: "Short description...",
  content: `<p>HTML content here</p>`,
  coverImage: "https://...",
  author: {
    name: "Author Name",
    role: "Role",
  },
  tags: ["Tag1", "Tag2"],
  publishedAt: "2025-10-28T10:00:00Z",
  featured: false,
  views: 0,
  likes: 0,
  readTime: 5,
}
```

### เพิ่มหมวดหมู่ใหม่:
1. แก้ไข `NewsCategory` type ใน `/app/types/news.ts`
2. เพิ่มใน `categories` array ใน `/app/news/page.tsx`
3. เพิ่มสีใน `getCategoryColor()` function

---

## 🌐 Integration with Backend (Future)

### Step 1: Setup Database
ใช้ SQL schema ที่มีอยู่ใน `/app/types/news.ts`

### Step 2: Replace Mock Data
แทนที่ mock functions ด้วย database queries:
```typescript
// Before (Mock)
const articles = getFilteredNews(filters);

// After (Real DB)
const articles = await db.select().from(newsArticles)
  .where(eq(newsArticles.category, category))
  .orderBy(desc(newsArticles.publishedAt));
```

### Step 3: Update API Routes
Uncomment example code ใน:
- `/app/api/news/route.ts`
- `/app/api/news/[slug]/route.ts`

### Step 4: Add Admin Panel
สร้าง CMS สำหรับจัดการบทความ:
- Create/Edit/Delete articles
- Upload images
- Manage categories and tags
- Analytics dashboard

---

## 📱 Responsive Design

- **Mobile** (< 768px): 1 column, simplified filters
- **Tablet** (768-1023px): 2 columns
- **Desktop** (1024px+): 3 columns, full features

---

## ⚡ Performance Optimizations

- ✅ **Image Optimization** - Next.js Image component
- ✅ **Lazy Loading** - Images และ content
- ✅ **Caching Headers** - API responses cached
- ✅ **Skeleton Screens** - Better perceived performance
- ✅ **Pagination** - Limit data transfer

---

## 🎨 Design System

### Colors:
- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple (#A855F7)
- **Accent**: Pink (#EC4899)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Danger**: Red (#EF4444)

### Typography:
- **Headings**: Bold, Gradient text
- **Body**: 1.125rem, line-height 1.8
- **Small**: 0.875rem

### Spacing:
- **Section**: py-16
- **Card**: p-6 to p-8
- **Gap**: 4-8 units

---

## 🔍 SEO Considerations (Future Enhancements)

```typescript
// Add to article pages:
export async function generateMetadata({ params }) {
  const article = await getArticle(params.slug);
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      images: [article.coverImage],
    },
  };
}
```

---

## 📊 Analytics Tracking (Future)

Track:
- Page views per article
- Reading time
- Scroll depth
- Like/Share actions
- Popular categories
- Search queries

---

## 🛡️ Security Considerations

### For Production:
- ✅ Sanitize HTML content (use DOMPurify)
- ✅ Rate limiting on API endpoints
- ✅ Input validation
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ Image upload validation

---

## 🚧 Future Enhancements

### Phase 1: Basic CMS
- [ ] Admin dashboard
- [ ] Article CRUD operations
- [ ] Image upload
- [ ] Draft/Publish workflow

### Phase 2: Advanced Features
- [ ] Comments system
- [ ] User reactions (beyond likes)
- [ ] Social media auto-posting
- [ ] Email notifications
- [ ] RSS feed

### Phase 3: Community Features
- [ ] User-submitted stories (moderation required)
- [ ] Fan contributions
- [ ] Voting/polling on articles
- [ ] Newsletter integration

### Phase 4: Advanced Analytics
- [ ] Real-time analytics dashboard
- [ ] A/B testing headlines
- [ ] Personalized recommendations
- [ ] Reading behavior analysis

---

## 🐛 Troubleshooting

### Images not loading?
- Check URL accessibility
- Use `unoptimized` prop on Image component
- Verify CORS settings

### API returning 404?
- Check slug matches exactly
- Verify mock data exists
- Check route file naming

### Styles not applying?
- Verify Tailwind v4 syntax (`bg-linear-*`)
- Check purge settings
- Restart dev server

---

## 📚 Dependencies

```json
{
  "next": "16.0.0",
  "react": "19.2.0",
  "framer-motion": "latest",
  "typescript": "^5"
}
```

---

## 🎯 Performance Metrics

Target metrics:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

---

## 📝 Content Guidelines

### Title:
- Maximum 60 characters
- Include keywords
- Both English & Korean versions

### Excerpt:
- 120-160 characters
- Compelling summary
- Include call to action

### Content:
- Use semantic HTML
- Include images every 2-3 paragraphs
- Add quotes and callouts
- Proper heading hierarchy

### Tags:
- 3-5 relevant tags
- Use existing tags when possible
- Title case

---

## 🌟 Best Practices

1. **Always provide alt text** for images
2. **Use featured flag** sparingly (3-4 articles max)
3. **Keep read time accurate** (avg 200 words/min)
4. **Update timestamps** when editing
5. **Test on mobile** before publishing
6. **Optimize images** before upload
7. **Proofread** all content

---

## 📞 Support & Contribution

For questions or contributions:
- Check existing documentation
- Test locally first
- Follow code style guidelines
- Submit detailed PRs

---

**Built with ❤️ for H2H & S2U Community**

**Last Updated**: October 28, 2025

