'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { Rarity, RecommendAction } from '@/types';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'rarity' | 'action';
  rarity?: Rarity | null;
  action?: RecommendAction;
}

const rarityColors: Record<Rarity, string> = {
  common: 'bg-zinc-600 text-zinc-200',
  uncommon: 'bg-green-700 text-green-100',
  rare: 'bg-blue-700 text-blue-100',
  epic: 'bg-purple-700 text-purple-100',
  legendary: 'bg-amber-600 text-amber-100',
};

const actionColors: Record<RecommendAction, string> = {
  keep: 'bg-emerald-700 text-emerald-100',
  sell: 'bg-amber-700 text-amber-100',
  recycle: 'bg-cyan-700 text-cyan-100',
  use: 'bg-violet-700 text-violet-100',
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', rarity, action, children, ...props }, ref) => {
    let colorClass = 'bg-zinc-700 text-zinc-200';

    if (variant === 'rarity' && rarity) {
      colorClass = rarityColors[rarity];
    } else if (variant === 'action' && action) {
      colorClass = actionColors[action];
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide',
          colorClass,
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
