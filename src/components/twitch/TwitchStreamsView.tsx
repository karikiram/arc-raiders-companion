'use client';

import { TwitchStreams } from './TwitchStreams';

export function TwitchStreamsView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Live Streams</h1>
        <p className="text-zinc-400">
          Watch top Arc Raiders streamers live on Twitch. Learn from the best and stay updated with the latest gameplay.
        </p>
      </div>

      {/* Streams Grid */}
      <TwitchStreams limit={20} showHeader={false} compact={false} />

      {/* Info Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-3">About Live Streams</h3>
        <div className="space-y-2 text-sm text-zinc-400">
          <p>
            • Streams are sorted by viewer count and updated every 2 minutes
          </p>
          <p>
            • Click any stream to watch live on Twitch
          </p>
          <p>
            • Learn strategies, discover new tactics, and see the current meta in action
          </p>
          <p>
            • Support your favorite Arc Raiders content creators
          </p>
        </div>
      </div>
    </div>
  );
}
