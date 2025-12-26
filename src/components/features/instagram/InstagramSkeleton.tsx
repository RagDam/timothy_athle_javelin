'use client';

import { type FC } from 'react';

interface InstagramSkeletonProps {
  count?: number;
}

export const InstagramSkeleton: FC<InstagramSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="aspect-square rounded-lg bg-slate-800 animate-pulse"
        />
      ))}
    </div>
  );
};
