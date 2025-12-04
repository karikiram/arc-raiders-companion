'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Package } from 'lucide-react';

// Image sizes for different contexts
export type ItemImageSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<ItemImageSize, { width: number; height: number; className: string; iconSize: string }> = {
  xs: { width: 32, height: 32, className: 'w-8 h-8', iconSize: 'w-4 h-4' },
  sm: { width: 48, height: 48, className: 'w-12 h-12', iconSize: 'w-6 h-6' },
  md: { width: 64, height: 64, className: 'w-16 h-16', iconSize: 'w-8 h-8' },
  lg: { width: 96, height: 96, className: 'w-24 h-24', iconSize: 'w-12 h-12' },
  xl: { width: 128, height: 128, className: 'w-32 h-32', iconSize: 'w-16 h-16' },
};

interface ItemImageProps {
  itemId: string;
  name: string;
  size?: ItemImageSize;
  className?: string;
  priority?: boolean;
}

// Convert item ID to image filename
function getImagePath(itemId: string): string {
  // Convert snake_case to kebab-case for filename
  const filename = itemId.replace(/_/g, '-');
  return `/items-hq/${filename}.png`;
}

export function ItemImage({
  itemId,
  name,
  size = 'md',
  className = '',
  priority = false
}: ItemImageProps) {
  const [hasError, setHasError] = useState(false);
  const { width, height, className: sizeClassName, iconSize } = sizeMap[size];

  if (hasError) {
    // Show placeholder icon when image fails to load
    return (
      <div className={`relative ${sizeClassName} ${className} flex-shrink-0 flex items-center justify-center bg-zinc-800 rounded`}>
        <Package className={`${iconSize} text-zinc-500`} />
      </div>
    );
  }

  return (
    <div className={`relative ${sizeClassName} ${className} flex-shrink-0`}>
      <Image
        src={getImagePath(itemId)}
        alt={name}
        width={width}
        height={height}
        className="object-contain w-full h-full"
        onError={() => setHasError(true)}
        priority={priority}
      />
    </div>
  );
}

// Simple image component for when we just need the URL
export function getItemImageUrl(itemId: string): string {
  return getImagePath(itemId);
}

// Check if HQ image exists (for build-time checks)
export function hasHQImage(itemId: string): boolean {
  const filename = itemId.replace(/_/g, '-');
  // This would need to be updated with actual file checking logic
  // For now, assume all items have HQ images
  return true;
}
