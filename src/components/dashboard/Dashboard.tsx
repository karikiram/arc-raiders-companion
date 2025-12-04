'use client';

import {
  Recycle,
  Hammer,
  Database,
  Package,
  Shirt,
  ArrowRight,
  Users,
  Clock,
  Star
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section with Background Image */}
      <div className="relative -mx-6 -mt-6 lg:-mx-8 lg:-mt-8 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images8.alphacoders.com/140/thumb-1920-1402588.png)',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/80 to-zinc-950" />

        {/* Hero Content */}
        <div className="relative px-6 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Plan Your Raid
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 mb-8 max-w-2xl">
              Your ultimate companion for Arc Raiders. Know exactly what to keep, sell, or recycle — and never miss a workshop upgrade.
            </p>

            {/* Primary CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('recyclables')}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-all hover:scale-105 cursor-pointer"
              >
                <Recycle className="w-5 h-5" />
                Recycle & Sell Guide
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('hoarding')}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-all hover:scale-105 cursor-pointer"
              >
                <Hammer className="w-5 h-5" />
                Workshop Upgrades
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards - Main Value Props */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recycle & Sell Card */}
        <button
          onClick={() => onNavigate('recyclables')}
          className="group relative p-6 bg-gradient-to-br from-emerald-900/30 to-zinc-900 border border-emerald-700/30 rounded-xl text-left hover:border-emerald-500/50 transition-all cursor-pointer"
        >
          <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Recycle className="w-24 h-24 text-emerald-400" />
          </div>
          <div className="relative">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
              <Recycle className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Recycle & Sell Guide</h3>
            <p className="text-zinc-400 mb-4">
              Know exactly which items to recycle for materials and which to sell for maximum value. Never waste an item again.
            </p>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium group-hover:gap-2 transition-all">
              View Guide <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </button>

        {/* Workshop Upgrades Card */}
        <button
          onClick={() => onNavigate('hoarding')}
          className="group relative p-6 bg-gradient-to-br from-amber-900/30 to-zinc-900 border border-amber-700/30 rounded-xl text-left hover:border-amber-500/50 transition-all cursor-pointer"
        >
          <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Hammer className="w-24 h-24 text-amber-400" />
          </div>
          <div className="relative">
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
              <Hammer className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Workshop Upgrades</h3>
            <p className="text-zinc-400 mb-4">
              Track which items you need to hoard for workshop upgrades. Never accidentally sell or recycle critical materials.
            </p>
            <span className="inline-flex items-center gap-1 text-amber-400 font-medium group-hover:gap-2 transition-all">
              View Guide <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </button>
      </div>

      {/* Secondary Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('items')}
          className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-zinc-800/50 transition-all text-left cursor-pointer"
        >
          <Database className="w-6 h-6 text-blue-400 mb-2" />
          <p className="font-medium text-white">Items Database</p>
          <p className="text-xs text-zinc-500 mt-1">400+ items</p>
        </button>
        <button
          onClick={() => onNavigate('stash')}
          className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-zinc-800/50 transition-all text-left cursor-pointer"
        >
          <Package className="w-6 h-6 text-violet-400 mb-2" />
          <p className="font-medium text-white">Raider Stash</p>
          <p className="text-xs text-zinc-500 mt-1">Smart advice</p>
        </button>
        <button
          onClick={() => onNavigate('loadouts')}
          className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-zinc-800/50 transition-all text-left cursor-pointer"
        >
          <Shirt className="w-6 h-6 text-rose-400 mb-2" />
          <p className="font-medium text-white">Loadouts</p>
          <p className="text-xs text-zinc-500 mt-1">Plan your gear</p>
        </button>
        <button
          onClick={() => onNavigate('hoarding')}
          className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-zinc-800/50 transition-all text-left cursor-pointer"
        >
          <Star className="w-6 h-6 text-yellow-400 mb-2" />
          <p className="font-medium text-white">Coming Soon</p>
          <p className="text-xs text-zinc-500 mt-1">Tierlists & more</p>
        </button>
      </div>

      {/* Community Stats / Recent Updates Section */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Growing</p>
              <p className="text-xs text-zinc-500">Community</p>
            </div>
          </div>
          <p className="text-sm text-zinc-400">
            Join raiders using this companion to optimize their gameplay.
          </p>
        </div>

        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">400+</p>
              <p className="text-xs text-zinc-500">Items Tracked</p>
            </div>
          </div>
          <p className="text-sm text-zinc-400">
            Complete database with recycle values, sell prices, and crafting recipes.
          </p>
        </div>

        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Updated</p>
              <p className="text-xs text-zinc-500">Regularly</p>
            </div>
          </div>
          <p className="text-sm text-zinc-400">
            Data updated with each game patch to keep recommendations accurate.
          </p>
        </div>
      </div>

      {/* Art Attribution */}
      <p className="text-center text-xs text-zinc-600">
        Background art © Embark Studios. Arc Raiders Companion is a fan-made tool.
      </p>
    </div>
  );
}
