import { hash } from 'bcryptjs';
import { writeJSON } from '../lib/fs-json';
import type { User, Post } from '../lib/types';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create users
  const users: User[] = [
    {
      id: 'u1',
      email: 'admin@h2h.com',
      name: 'Admin User',
      passwordHash: await hash('admin123', 10),
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'u2',
      email: 'editor@h2h.com',
      name: 'Editor User',
      passwordHash: await hash('editor123', 10),
      role: 'EDITOR',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'u3',
      email: 'author@h2h.com',
      name: 'Author User',
      passwordHash: await hash('author123', 10),
      role: 'AUTHOR',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  await writeJSON('data/users.json', users);
  console.log('✅ Created users');

  // Create sample posts
  const posts: Post[] = [
    {
      id: 'p1',
      title: 'Hearts2Hearts Debuts with FOCUS',
      slug: 'hearts2hearts-debuts-focus',
      excerpt: 'The highly anticipated debut of Hearts2Hearts is finally here with their title track FOCUS.',
      content: '<h2>Hearts2Hearts Makes Their Debut</h2><p>Hearts2Hearts has officially debuted with their mini album "FOCUS", featuring the title track of the same name. The group showcases their powerful vocals and synchronized choreography.</p><p>The album includes 5 tracks that highlight the members\' diverse talents and musical range.</p>',
      status: 'PUBLISHED',
      authorId: 'u1',
      tags: ['t-kpop', 't-news'],
      categoryId: 'c-music',
      heroImage: '/media/art/focus.webp',
      publishAt: '2025-09-15T00:00:00Z',
      createdAt: '2025-09-10T00:00:00Z',
      updatedAt: '2025-09-15T00:00:00Z',
    },
    {
      id: 'p2',
      title: 'Behind the Scenes: FOCUS MV Filming',
      slug: 'behind-scenes-focus-mv',
      excerpt: 'Get an exclusive look at the making of Hearts2Hearts\' debut music video.',
      content: '<h2>Behind the Scenes</h2><p>The members of Hearts2Hearts share their experiences filming the FOCUS music video. From early morning calls to late night shoots, the dedication and hard work of the group shines through.</p>',
      status: 'PUBLISHED',
      authorId: 'u2',
      tags: ['t-kpop'],
      categoryId: 'c-music',
      publishAt: '2025-09-20T00:00:00Z',
      createdAt: '2025-09-18T00:00:00Z',
      updatedAt: '2025-09-20T00:00:00Z',
    },
    {
      id: 'p3',
      title: 'Upcoming Showcase Announcement',
      slug: 'upcoming-showcase-announcement',
      excerpt: 'Hearts2Hearts announces their first showcase event for fans.',
      content: '<h2>First Showcase Event</h2><p>Hearts2Hearts will be holding their first showcase event next month. Fans will have the opportunity to see the group perform live and participate in a Q&A session.</p>',
      status: 'DRAFT',
      authorId: 'u3',
      tags: ['t-news'],
      categoryId: 'c-music',
      publishAt: null,
      createdAt: '2025-10-01T00:00:00Z',
      updatedAt: '2025-10-01T00:00:00Z',
    },
  ];

  await writeJSON('data/posts.json', posts);
  console.log('✅ Created sample posts');

  console.log('');
  console.log('🎉 Seeding complete!');
  console.log('');
  console.log('📝 Test Accounts:');
  console.log('  Admin:  admin@h2h.com  / admin123');
  console.log('  Editor: editor@h2h.com / editor123');
  console.log('  Author: author@h2h.com / author123');
  console.log('');
}

seed().catch(console.error);

