'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface ViewTransitionProps {
  children: ReactNode;
  transitionKey: string;
}

export function ViewTransition({ children, transitionKey }: ViewTransitionProps) {
  const [displayedKey, setDisplayedKey] = useState(transitionKey);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (transitionKey !== displayedKey) {
      setIsTransitioning(true);

      // Quick fade out, then update content
      const timeout = setTimeout(() => {
        setDisplayedKey(transitionKey);
        setIsTransitioning(false);
      }, 80);

      return () => clearTimeout(timeout);
    }
  }, [transitionKey, displayedKey]);

  return (
    <div
      className={`transition-opacity duration-150 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ willChange: 'opacity' }}
    >
      {children}
    </div>
  );
}
