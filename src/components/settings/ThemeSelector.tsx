'use client';

import { Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSubscription } from '@/context';
import { THEMES } from '@/types';

export function ThemeSelector() {
  const { currentTheme, setTheme } = useSubscription();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Palette className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-white">Theme</h3>
      </div>
      <p className="text-sm text-zinc-400">
        Customize the accent color of the app.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {THEMES.map((theme) => {
          const isSelected = currentTheme === theme.id;

          return (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={cn(
                'relative p-4 rounded-xl border-2 transition-all text-left',
                isSelected
                  ? 'border-current ring-2 ring-current/20'
                  : 'border-zinc-700 hover:border-zinc-600'
              )}
              style={{
                borderColor: isSelected ? theme.colors.accent : undefined,
                '--tw-ring-color': isSelected ? `${theme.colors.accent}33` : undefined,
              } as React.CSSProperties}
            >
              {/* Color preview */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg shadow-lg"
                  style={{ backgroundColor: theme.colors.accent }}
                />
                <div className="flex-1">
                  <span className="font-medium text-white">{theme.name}</span>
                  <p className="text-xs text-zinc-500">{theme.description}</p>
                </div>
              </div>

              {/* Color swatches */}
              <div className="flex gap-1.5">
                <div
                  className="h-2 flex-1 rounded-full"
                  style={{ backgroundColor: theme.colors.accentDark }}
                />
                <div
                  className="h-2 flex-1 rounded-full"
                  style={{ backgroundColor: theme.colors.accent }}
                />
                <div
                  className="h-2 flex-1 rounded-full"
                  style={{ backgroundColor: theme.colors.accentLight }}
                />
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.colors.accent }}
                >
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
