'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Trash2,
  Pencil,
  Image as ImageIcon,
  Video,
  Calendar,
  Folder,
  MapPin,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MEDIA_CATEGORIES } from '@/types/admin';
import type { UploadedMedia } from '@/types/admin';

interface MediaCardProps {
  media: UploadedMedia;
  onDelete: (id: string) => void;
  onEdit: (media: UploadedMedia) => void;
}

export function MediaCard({ media, onDelete, onEdit }: MediaCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isImage = media.type === 'image';
  const categoryInfo = MEDIA_CATEGORIES.find((c) => c.id === media.category);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/media/${media.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete(media.id);
      } else {
        setIsDeleting(false);
        setShowConfirm(false);
      }
    } catch {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  }

  const formattedDate = new Date(media.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="group relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-slate-600 transition-colors">
      {/* Preview */}
      <div className="relative aspect-video bg-slate-700">
        {isImage && !imageError ? (
          <Image
            src={media.url}
            alt={media.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {isImage ? (
              <ImageIcon size={48} className="text-slate-600" />
            ) : (
              <Video size={48} className="text-slate-600" />
            )}
          </div>
        )}

        {/* Badge type */}
        <div
          className={cn(
            'absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium flex items-center gap-1',
            isImage
              ? 'bg-pink-500/80 text-white'
              : 'bg-purple-500/80 text-white'
          )}
        >
          {isImage ? <ImageIcon size={12} /> : <Video size={12} />}
          {isImage ? 'Photo' : 'Vidéo'}
        </div>

        {/* Boutons d'action */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
          {/* Bouton éditer */}
          <button
            type="button"
            onClick={() => onEdit(media)}
            className={cn(
              'p-2 rounded-lg',
              'bg-slate-900/80 text-slate-400 hover:text-blue-400 hover:bg-slate-900',
              'transition-colors'
            )}
          >
            <Pencil size={16} />
          </button>
          {/* Bouton supprimer */}
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={isDeleting}
            className={cn(
              'p-2 rounded-lg',
              'bg-slate-900/80 text-slate-400 hover:text-red-400 hover:bg-slate-900',
              'transition-colors',
              'disabled:opacity-50'
            )}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Infos */}
      <div className="p-4">
        <h3 className="font-medium text-white truncate" title={media.title}>
          {media.title}
        </h3>

        {media.description && (
          <p
            className="text-slate-400 text-sm mt-1 line-clamp-2"
            title={media.description}
          >
            {media.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Folder size={12} />
            {categoryInfo?.name || media.category}
          </span>
          {media.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {media.location}
            </span>
          )}
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showConfirm && (
        <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-4 z-10">
          <Trash2 size={32} className="text-red-400 mb-3" />
          <p className="text-white text-center font-medium mb-4">
            Supprimer ce média ?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium',
                'bg-slate-700 hover:bg-slate-600 text-white',
                'transition-colors',
                'disabled:opacity-50'
              )}
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium',
                'bg-red-600 hover:bg-red-700 text-white',
                'flex items-center gap-2',
                'transition-colors',
                'disabled:opacity-50'
              )}
            >
              {isDeleting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Suppression...
                </>
              ) : (
                'Supprimer'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
