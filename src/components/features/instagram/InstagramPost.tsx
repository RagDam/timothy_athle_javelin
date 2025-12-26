'use client';

import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { type InstagramPost as InstagramPostType } from '@/types/instagram';
import { cn } from '@/lib/utils';

interface InstagramPostProps {
  post: InstagramPostType;
  index: number;
  onClick: () => void;
}

export const InstagramPost: FC<InstagramPostProps> = ({ post, index, onClick }) => {
  // Génère l'URL de la thumbnail via l'embed Instagram
  const thumbnailUrl = post.thumbnailUrl || `https://instagram.com/p/${post.id}/media/?size=m`;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onClick}
      className={cn(
        'group relative aspect-square w-full overflow-hidden rounded-lg',
        'bg-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-slate-900'
      )}
    >
      {/* Thumbnail avec iframe Instagram embed */}
      <div className="absolute inset-0">
        <iframe
          src={`${post.url}embed/captioned/`}
          className="absolute inset-0 w-[300%] h-[300%] -top-[100%] -left-[100%] pointer-events-none scale-[0.34] origin-center"
          frameBorder="0"
          scrolling="no"
          loading="lazy"
        />
      </div>

      {/* Overlay au hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

      {/* Icône Play pour les reels */}
      {post.type === 'reel' && (
        <div className="absolute top-3 right-3 bg-black/60 rounded-full p-1.5">
          <Play className="w-4 h-4 text-white fill-white" />
        </div>
      )}

      {/* Overlay hover avec icône */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
          <Play className="w-8 h-8 text-white fill-white" />
        </div>
      </div>
    </motion.button>
  );
};
