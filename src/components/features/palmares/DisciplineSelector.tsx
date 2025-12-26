'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Trophy, Timer, MoveHorizontal, MoveVertical, ArrowUp, Circle, Disc, Layers, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS = {
  target: Trophy,
  timer: Timer,
  'move-horizontal': MoveHorizontal,
  'move-vertical': MoveVertical,
  'arrow-up': ArrowUp,
  circle: Circle,
  disc: Disc,
  layers: Layers,
  clock: Clock,
  users: Users,
};

export interface Discipline {
  id: string;
  name: string;
  icon: keyof typeof ICONS;
  isPrimary: boolean;
  color: 'amber' | 'blue' | 'purple';
}

interface DisciplineSelectorProps {
  disciplines: Discipline[];
  selected: string;
  onSelect: (id: string) => void;
}

export function DisciplineSelector({ disciplines, selected, onSelect }: DisciplineSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const getColorClasses = (discipline: Discipline, isSelected: boolean) => {
    if (!isSelected) {
      return 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300';
    }

    switch (discipline.color) {
      case 'amber':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'purple':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  return (
    <div className="relative">
      {/* Flèche gauche */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-slate-900/90 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors shadow-lg"
          aria-label="Défiler vers la gauche"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Container scrollable */}
      <div
        ref={scrollRef}
        onScroll={checkScrollButtons}
        className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {disciplines.map((discipline) => {
          const Icon = ICONS[discipline.icon];
          const isSelected = selected === discipline.id;

          return (
            <motion.button
              key={discipline.id}
              onClick={() => onSelect(discipline.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 whitespace-nowrap flex-shrink-0',
                isSelected ? 'border-current' : 'border-transparent',
                getColorClasses(discipline, isSelected)
              )}
            >
              <Icon size={16} />
              <span className="font-medium text-sm">{discipline.name}</span>
              {discipline.isPrimary && (
                <span className="text-xs opacity-60">(spécialité)</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Flèche droite */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-slate-900/90 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors shadow-lg"
          aria-label="Défiler vers la droite"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Gradient fade sur les bords */}
      {showLeftArrow && (
        <div className="absolute left-8 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none" />
      )}
      {showRightArrow && (
        <div className="absolute right-8 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none" />
      )}
    </div>
  );
}
