'use client';

import { useState } from 'react';
import { Image as ImageIcon, Video, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MediaCard } from './MediaCard';
import { MEDIA_CATEGORIES } from '@/types/admin';
import type { UploadedMedia, MediaCategory } from '@/types/admin';

interface MediaGridProps {
  medias: UploadedMedia[];
  onDelete: (id: string) => void;
  onEdit: (media: UploadedMedia) => void;
}

type FilterType = 'all' | 'image' | 'video';
type FilterCategory = 'all' | MediaCategory;

export function MediaGrid({ medias, onDelete, onEdit }: MediaGridProps) {
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');

  // Appliquer les filtres
  const filteredMedias = medias.filter((media) => {
    if (typeFilter !== 'all' && media.type !== typeFilter) {
      return false;
    }
    if (categoryFilter !== 'all' && media.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter size={18} />
          <span className="text-sm">Filtrer :</span>
        </div>

        {/* Filtre par type */}
        <div className="flex gap-1 p-1 bg-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setTypeFilter('all')}
            className={cn(
              'px-3 py-1.5 rounded text-sm font-medium transition-colors',
              typeFilter === 'all'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white'
            )}
          >
            Tous
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('image')}
            className={cn(
              'px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5',
              typeFilter === 'image'
                ? 'bg-pink-500/20 text-pink-400'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <ImageIcon size={14} />
            Photos
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('video')}
            className={cn(
              'px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5',
              typeFilter === 'video'
                ? 'bg-purple-500/20 text-purple-400'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <Video size={14} />
            Vidéos
          </button>
        </div>

        {/* Filtre par catégorie */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as FilterCategory)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm',
            'bg-slate-800 border border-slate-700 text-white',
            'focus:outline-none focus:ring-2 focus:ring-blue-500'
          )}
        >
          <option value="all">Toutes catégories</option>
          {MEDIA_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Compteur */}
        <span className="text-slate-500 text-sm ml-auto">
          {filteredMedias.length} média{filteredMedias.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Grille */}
      {filteredMedias.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p>Aucun média correspondant aux filtres</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMedias.map((media) => (
            <MediaCard key={media.id} media={media} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
}
