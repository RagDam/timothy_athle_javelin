'use client';

import { type FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { type InstagramPost as InstagramPostType } from '@/types/instagram';
import { InstagramPost } from './InstagramPost';
import { InstagramModal } from './InstagramModal';
import { AnimatedSection } from '@/components/ui';

interface InstagramFeedProps {
  posts: InstagramPostType[];
  maxPosts?: number;
  className?: string;
}

export const InstagramFeed: FC<InstagramFeedProps> = ({
  posts,
  maxPosts = 12,
  className,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const displayedPosts = posts.slice(0, maxPosts);
  const selectedPost = selectedIndex !== null ? displayedPosts[selectedIndex] : null;

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < displayedPosts.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <Instagram className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">Aucune publication à afficher</p>
      </div>
    );
  }

  return (
    <>
      <AnimatedSection className={className}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.05 },
            },
          }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-2"
        >
          {displayedPosts.map((post, index) => (
            <InstagramPost
              key={post.id}
              post={post}
              index={index}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </motion.div>
      </AnimatedSection>

      <InstagramModal
        post={selectedPost}
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={selectedIndex !== null && selectedIndex > 0}
        hasNext={selectedIndex !== null && selectedIndex < displayedPosts.length - 1}
      />
    </>
  );
};
