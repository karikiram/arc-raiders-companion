'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 24, text: 'text-sm' },
  md: { icon: 32, text: 'text-base' },
  lg: { icon: 40, text: 'text-lg' },
  xl: { icon: 56, text: 'text-2xl' },
};

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const { icon, text } = sizes[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        style={{ '--accent': 'var(--color-accent)', '--accent-light': 'var(--color-accent-light)' } as React.CSSProperties}
      >
        {/* Outer circle with gap */}
        <path
          d="M32 6A26 26 0 1 1 6 32"
          stroke="url(#gradient1)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Letter A */}
        <path
          d="M32 14L46 50H40L37 42H27L24 50H18L32 14Z"
          fill="url(#gradient1)"
        />
        {/* A crossbar */}
        <path d="M29 36H35" stroke="#18181B" strokeWidth="2" />
        {/* Accent dots */}
        <circle cx="10" cy="20" r="2" fill="var(--color-accent)" opacity="0.6" />
        <circle cx="6" cy="32" r="2" fill="var(--color-accent)" />
        <defs>
          <linearGradient id="gradient1" x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--color-accent-light)" />
            <stop offset="1" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn('font-bold text-white tracking-tight', text)}>
            ARC
          </span>
          <span className={cn('font-medium text-accent tracking-widest uppercase', size === 'sm' ? 'text-[8px]' : size === 'md' ? 'text-[10px]' : size === 'lg' ? 'text-xs' : 'text-sm')}>
            Companion
          </span>
        </div>
      )}
    </div>
  );
}
