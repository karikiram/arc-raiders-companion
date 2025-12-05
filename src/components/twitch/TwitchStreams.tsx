'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink, Loader2, Tv, Users } from 'lucide-react';

interface TwitchStream {
  id: string;
  user_name: string;
  user_login: string;
  title: string;
  viewer_count: number;
  thumbnail_url: string;
  profile_image_url?: string;
  started_at: string;
}

interface TwitchStreamsProps {
  limit?: number;
  showHeader?: boolean;
  compact?: boolean;
}

export function TwitchStreams({ limit = 8, showHeader = true, compact = false }: TwitchStreamsProps) {
  const [streams, setStreams] = useState<TwitchStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchStreams();
    // Refresh every 2 minutes
    const interval = setInterval(fetchStreams, 120000);
    return () => clearInterval(interval);
  }, [limit, mounted]);

  const fetchStreams = async () => {
    try {
      const response = await fetch(`/api/twitch/streams?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch streams');
      }
      const data = await response.json();
      setStreams(data.streams || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching Twitch streams:', err);
      setError('Unable to load streams');
    } finally {
      setLoading(false);
    }
  };

  const formatViewerCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getThumbnailUrl = (url: string) => {
    return url.replace('{width}', '440').replace('{height}', '248');
  };

  // Prevent hydration errors by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (error || streams.length === 0) {
    return (
      <div className="text-center py-12">
        <Tv className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
        <p className="text-zinc-500">
          {error || 'No streams currently live'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Tv className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Live on Twitch</h2>
              <p className="text-sm text-zinc-500">Arc Raiders streams</p>
            </div>
          </div>
          <a
            href="https://www.twitch.tv/directory/category/arc-raiders"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-zinc-400 hover:text-purple-400 transition-colors"
          >
            View all <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      <div className={`grid gap-4 ${compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
        {streams.map((stream) => (
          <a
            key={stream.id}
            href={`https://www.twitch.tv/${stream.user_login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all hover:scale-[1.02]"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-zinc-800 overflow-hidden">
              <Image
                src={getThumbnailUrl(stream.thumbnail_url)}
                alt={`${stream.user_name}'s stream`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />

              {/* Live Badge */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>

              {/* Viewer Count */}
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-semibold rounded flex items-center gap-1">
                <Users className="w-3 h-3" />
                {formatViewerCount(stream.viewer_count)}
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
            </div>

            {/* Stream Info */}
            <div className="p-3">
              <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 group-hover:text-purple-400 transition-colors">
                {stream.title}
              </h3>
              <p className="text-xs text-zinc-500">{stream.user_name}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
