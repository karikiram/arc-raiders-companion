'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  LayoutDashboard,
  Package,
  Shirt,
  ScrollText,
  Building2,
  SlidersHorizontal,
  HelpCircle,
  Hammer,
  Recycle,
  ChevronsLeft,
  ChevronsRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui';
import { SidebarAd } from '@/components/subscription';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const SIDEBAR_COLLAPSED_KEY = 'sidebar-collapsed';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'stash', label: 'Raider Stash', icon: Package },
  { id: 'hoarding', label: 'Workshop Upgrades', icon: Hammer },
  { id: 'recyclables', label: 'Recycle & Sell', icon: Recycle },
  { id: 'loadouts', label: 'Loadouts', icon: Shirt },
  { id: 'quests', label: 'Quest Tracker', icon: ScrollText },
  { id: 'hideout', label: 'Hideout', icon: Building2 },
];

const bottomItems = [
  { id: 'settings', label: 'Settings', icon: SlidersHorizontal },
  { id: 'help', label: 'Help', icon: HelpCircle },
];

export function Sidebar({ activeTab = 'dashboard', onTabChange, isOpen = false, onClose, onCollapsedChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored !== null) {
      const collapsed = stored === 'true';
      setIsCollapsed(collapsed);
      onCollapsedChange?.(collapsed);
    }
    setMounted(true);
  }, [onCollapsedChange]);

  // Toggle collapsed state
  const toggleCollapsed = useCallback(() => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(newState));
    onCollapsedChange?.(newState);
  }, [isCollapsed, onCollapsedChange]);

  const handleTabClick = (tabId: string) => {
    onTabChange?.(tabId);
    // On mobile, close sidebar after selection
    if (window.innerWidth < 1024) {
      onClose?.();
    }
  };

  // Prevent hydration mismatch - render expanded by default on server
  const collapsed = mounted ? isCollapsed : false;

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

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 z-40 flex flex-col bg-zinc-900 border-r border-zinc-800 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out',
          // Desktop: show based on collapsed state
          'lg:translate-x-0',
          collapsed ? 'lg:w-14' : 'lg:w-56',
          // Mobile: slide in/out
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

        {/* Header with Logo and Collapse Toggle */}
        <div className={cn(
          'hidden lg:flex items-center p-2 border-b border-zinc-800',
          collapsed ? 'justify-center' : 'justify-between'
        )}>
          {collapsed ? (
            <button
              onClick={toggleCollapsed}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              title="Expand sidebar"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          ) : (
            <>
              <Logo size="sm" showText={false} className="px-1" />
              <button
                onClick={toggleCollapsed}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                title="Collapse sidebar"
              >
                <ChevronsLeft className="w-5 h-5" />
              </button>
            </>
          )}
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
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800',
                    collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
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
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800',
                    collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

  
          {/* Ad slot for free users - only in expanded sidebar */}
          {!collapsed && <SidebarAd />}
        </div>
      </aside>
    </>
  );
}
