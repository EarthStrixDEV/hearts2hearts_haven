'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Music, Image as ImageIcon, Users, TrendingUp } from 'lucide-react';
import AuthGuard, { useAuth } from '@/components/AuthGuard';

interface DashboardStats {
  posts: {
    total: number;
    draft: number;
    published: number;
    scheduled: number;
  };
  tracks: {
    total: number;
    recent: number;
  };
  media: {
    total: number;
  };
  telemetry: {
    totalPlays: number;
    topTrack: string;
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);

      // Fetch posts
      const postsRes = await fetch('/api/posts');
      const postsData = await postsRes.json();
      const posts = postsData.data || [];

      // Fetch tracks
      const tracksRes = await fetch('/api/music/tracks');
      const tracksData = await tracksRes.json();
      const tracks = tracksData.data || [];

      // Fetch media
      const mediaRes = await fetch('/api/media');
      const mediaData = await mediaRes.json();
      const media = mediaData.data || [];

      setStats({
        posts: {
          total: posts.length,
          draft: posts.filter((p: { status: string }) => p.status === 'DRAFT').length,
          published: posts.filter((p: { status: string }) => p.status === 'PUBLISHED').length,
          scheduled: posts.filter((p: { status: string }) => p.status === 'SCHEDULED').length,
        },
        tracks: {
          total: tracks.length,
          recent: tracks.filter((t: { releaseDate: string }) => {
            const date = new Date(t.releaseDate);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return date > thirtyDaysAgo;
          }).length,
        },
        media: {
          total: media.length,
        },
        telemetry: {
          totalPlays: 0,
          topTrack: 'N/A',
        },
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requiredRole="AUTHOR">
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name || 'User'}!
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Posts Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Posts</h3>
                <FileText className="text-blue-600" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.posts.total}</p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Draft: {stats.posts.draft}</p>
                <p>Published: {stats.posts.published}</p>
                <p>Scheduled: {stats.posts.scheduled}</p>
              </div>
            </div>

            {/* Tracks Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Tracks</h3>
                <Music className="text-purple-600" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.tracks.total}</p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Recent (30d): {stats.tracks.recent}</p>
              </div>
            </div>

            {/* Media Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Media</h3>
                <ImageIcon className="text-green-600" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.media.total}</p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Total files</p>
              </div>
            </div>

            {/* Analytics Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Analytics</h3>
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.telemetry.totalPlays}</p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Total plays</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/posts/new"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <FileText className="text-blue-600" size={24} />
              <div>
                <h3 className="font-medium text-gray-900">New Post</h3>
                <p className="text-sm text-gray-600">Create a new article</p>
              </div>
            </Link>

            <Link
              href="/admin/media"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition"
            >
              <ImageIcon className="text-green-600" size={24} />
              <div>
                <h3 className="font-medium text-gray-900">Upload Media</h3>
                <p className="text-sm text-gray-600">Add images or files</p>
              </div>
            </Link>

            <Link
              href="/music-streaming"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition"
            >
              <Music className="text-purple-600" size={24} />
              <div>
                <h3 className="font-medium text-gray-900">Music Library</h3>
                <p className="text-sm text-gray-600">Browse tracks</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/posts"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="font-medium text-gray-900 mb-1">Posts</h3>
              <p className="text-sm text-gray-600">Manage all posts and articles</p>
            </Link>

            <Link
              href="/admin/categories"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="font-medium text-gray-900 mb-1">Categories & Tags</h3>
              <p className="text-sm text-gray-600">Organize content taxonomy</p>
            </Link>

            <Link
              href="/admin/media"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="font-medium text-gray-900 mb-1">Media Library</h3>
              <p className="text-sm text-gray-600">View and manage media files</p>
            </Link>

            {user?.role === 'ADMIN' && (
              <Link
                href="/admin/users"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <h3 className="font-medium text-gray-900 mb-1">Users</h3>
                <p className="text-sm text-gray-600">Manage user accounts</p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}

