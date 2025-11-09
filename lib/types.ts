import { z } from 'zod';

// ============ User & Auth ============
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  passwordHash: z.string().optional(),
  role: z.enum(['AUTHOR', 'EDITOR', 'ADMIN']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;

// ============ CMS - Posts ============
export const PostStatusSchema = z.enum(['DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED']);

export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string(),
  status: PostStatusSchema,
  authorId: z.string(),
  tags: z.array(z.string()),
  categoryId: z.string(),
  heroImage: z.string().optional(),
  publishAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  ogImage: z.string().optional(),
  ogDescription: z.string().optional(),
});

export type Post = z.infer<typeof PostSchema>;
export type PostStatus = z.infer<typeof PostStatusSchema>;

// ============ CMS - Revisions ============
export const RevisionSchema = z.object({
  id: z.string(),
  postId: z.string(),
  content: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
});

export type Revision = z.infer<typeof RevisionSchema>;

// ============ CMS - Taxonomy ============
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;
export type Tag = z.infer<typeof TagSchema>;

// ============ CMS - Media ============
export const MediaSchema = z.object({
  id: z.string(),
  filename: z.string(),
  url: z.string(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  tags: z.array(z.string()).optional(),
  uploadedAt: z.string(),
  uploadedBy: z.string(),
});

export type Media = z.infer<typeof MediaSchema>;

// ============ Music - Track ============
export const TrackSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  albumId: z.string(),
  durationSec: z.number(),
  audio: z.object({
    hls: z.string(),
    mp3_160: z.string(),
    mp3_320: z.string(),
  }),
  artwork: z.string(),
  explicit: z.boolean(),
  bpm: z.number().optional(),
  mood: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  releaseDate: z.string(),
  territories: z.array(z.string()),
  creditsId: z.string(),
  lyricsIds: z.array(z.string()),
  membersParts: z.array(z.object({
    member: z.string(),
    from: z.number(),
    to: z.number(),
  })).optional(),
});

export type Track = z.infer<typeof TrackSchema>;

// ============ Music - Album ============
export const AlbumSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  type: z.enum(['ALBUM', 'EP', 'SINGLE']).optional(),
  releaseDate: z.string(),
  cover: z.string(),
  tracks: z.array(z.string()),
  description: z.string().optional(),
});

export type Album = z.infer<typeof AlbumSchema>;

// ============ Music - Lyrics ============
export const LyricsSchema = z.object({
  id: z.string(),
  trackId: z.string(),
  lang: z.string(),
  lines: z.array(z.object({
    t: z.number(), // timestamp in seconds
    l: z.string(), // lyric line
  })),
});

export type Lyrics = z.infer<typeof LyricsSchema>;

// ============ Music - Credits ============
export const CreditsSchema = z.object({
  id: z.string(),
  trackId: z.string(),
  composer: z.array(z.string()),
  lyricist: z.array(z.string()),
  arranger: z.array(z.string()),
  producer: z.array(z.string()),
  label: z.string(),
});

export type Credits = z.infer<typeof CreditsSchema>;

// ============ Music - Playlist ============
export const PlaylistSchema = z.object({
  id: z.string(),
  title: z.string(),
  owner: z.string(), // "official" or userId
  tracks: z.array(z.string()),
  public: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Playlist = z.infer<typeof PlaylistSchema>;

// ============ Analytics - Telemetry ============
export const TelemetryEventSchema = z.object({
  ts: z.string(),
  ipHash: z.string(),
  event: z.enum([
    'play_start',
    'play_progress',
    'seek',
    'complete',
    'like',
    'add_to_playlist',
    'error',
  ]),
  data: z.record(z.unknown()),
});

export type TelemetryEvent = z.infer<typeof TelemetryEventSchema>;

// ============ Audit Log ============
export const AuditLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  action: z.string(),
  resource: z.string(),
  resourceId: z.string(),
  timestamp: z.string(),
  metadata: z.record(z.unknown()).optional(),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;

