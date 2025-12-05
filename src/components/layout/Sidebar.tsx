'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Shirt,
  SlidersHorizontal,
  HelpCircle,
  Hammer,
  Recycle,
  X,
  Database,
  Trophy,
  Tv,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui';
import type { TabId } from '@/hooks/useTabNavigation';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: TabId) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onHoverChange?: (isHovered: boolean) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'items', label: 'Items Database', icon: Database },
  { id: 'tier-lists', label: 'Tier Lists', icon: Trophy },
  { id: 'twitch', label: 'Live Streams', icon: Tv },
  { id: 'stash', label: 'Raider Stash', icon: Package },
  { id: 'hoarding', label: 'Workshop Upgrades', icon: Hammer },
  { id: 'recyclables', label: 'Recycle & Sell', icon: Recycle },
  { id: 'loadouts', label: 'Loadouts', icon: Shirt },
];

const bottomItems = [
  { id: 'settings', label: 'Settings', icon: SlidersHorizontal },
  { id: 'help', label: 'Help', icon: HelpCircle },
];

export function Sidebar({ activeTab = 'dashboard', onTabChange, isOpen = false, onClose, onHoverChange }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange?.(false);
  };

  const handleTabClick = (tabId: string) => {
    onTabChange?.(tabId as TabId);
    // On mobile, close sidebar after selection
    if (window.innerWidth < 1024) {
      onClose?.();
    }
  };

  // Sidebar is expanded when hovered on desktop
  const isExpanded = isHovered;

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Sidebar - collapses on desktop, expands on hover */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'fixed top-16 left-0 z-40 flex flex-col bg-zinc-900 border-r border-zinc-800 h-[calc(100vh-4rem)] transition-all duration-200 ease-in-out',
          // Desktop: collapsed by default, expanded on hover
          'lg:translate-x-0',
          isExpanded ? 'lg:w-56' : 'lg:w-14',
          // Mobile: slide in/out (full width)
          isOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 lg:translate-x-0'
        )}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-3 right-3 p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Logo */}
        <div className={cn(
          'hidden lg:flex items-center p-2 border-b border-zinc-800',
          isExpanded ? 'justify-start' : 'justify-center'
        )}>
          <Logo size="sm" showText={false} className="px-1" />
          {isExpanded && (
            <div className="ml-2 overflow-hidden">
              <p className="text-sm font-semibold text-white whitespace-nowrap">ARC</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider whitespace-nowrap">Companion</p>
            </div>
          )}
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center p-4 border-b border-zinc-800">
          <Logo size="sm" showText={true} />
        </div>

        <nav className="flex-1 p-2 overflow-y-auto overflow-x-hidden">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  title={!isExpanded ? item.label : undefined}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800',
                    isExpanded ? 'px-3 py-2.5' : 'lg:justify-center p-2.5'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className={cn(
                    'whitespace-nowrap',
                    isExpanded ? 'block' : 'lg:hidden'
                  )}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-2 border-t border-zinc-800">
          <div className="space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  title={!isExpanded ? item.label : undefined}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800',
                    isExpanded ? 'px-3 py-2.5' : 'lg:justify-center p-2.5'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className={cn(
                    'whitespace-nowrap',
                    isExpanded ? 'block' : 'lg:hidden'
                  )}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
