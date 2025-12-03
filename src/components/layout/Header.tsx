'use client';

import { User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button, Logo } from '@/components/ui';
import { ProBadgeInline } from '@/components/subscription';
import { cn } from '@/lib/utils';

interface HeaderProps {
  user?: {
    displayName: string;
    email: string;
  } | null;
  onLogin?: () => void;
  onLogout?: () => void;
  onToggleSidebar?: () => void;
}

export function Header({ user, onLogin, onLogout, onToggleSidebar }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo size="md" />

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg">
                  <User className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm text-zinc-300">
                    {user.displayName}
                    <ProBadgeInline />
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button variant="primary" size="sm" onClick={onLogin}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-200',
            mobileMenuOpen ? 'max-h-32 pb-4' : 'max-h-0'
          )}
        >
          <nav className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => {
                onToggleSidebar?.();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors text-left"
            >
              Open Menu
            </button>
            {user ? (
              <button
                onClick={onLogout}
                className="px-3 py-2 text-sm text-red-400 hover:bg-zinc-800 rounded-lg transition-colors text-left"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="px-3 py-2 text-sm text-accent hover:bg-zinc-800 rounded-lg transition-colors text-left"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
