'use client';

import { useState } from 'react';
import { X, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MEDIA_CATEGORIES } from '@/types/admin';
import type { UploadedMedia, MediaCategory } from '@/types/admin';

interface EditMediaModalProps {
  media: UploadedMedia;
  onClose: () => void;
  onSuccess: (media: UploadedMedia) => void;
}

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

export function EditMediaModal({ media, onClose, onSuccess }: EditMediaModalProps) {
  // Métadonnées éditables
  const [title, setTitle] = useState(media.title);
  const [description, setDescription] = useState(media.description || '');
  const [location, setLocation] = useState(media.location || '');
  const [category, setCategory] = useState<MediaCategory>(media.category);
  const [date, setDate] = useState(media.date);

  // État de la sauvegarde
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }

    setStatus('saving');
    setError('');

    try {
      const response = await fetch(`/api/admin/media/${media.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          location: location.trim() || undefined,
          category,
          date,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }

      const data = await response.json();
      setStatus('success');

      // Attendre un peu pour montrer le succès, puis fermer
      setTimeout(() => {
        onSuccess(data.media);
      }, 800);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  const isSubmitDisabled = !title.trim() || status === 'saving' || status === 'success';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={status !== 'saving' ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Modifier le média</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={status === 'saving'}
            className={cn(
              'p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700',
              'transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <X size={20} />
          </button>
        </div>

        {/* Corps */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Aperçu du média */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/50">
            {media.type === 'image' ? (
              <img
                src={media.url}
                alt={media.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-slate-600 flex items-center justify-center">
                <span className="text-2xl">🎬</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-slate-400 text-sm truncate">{media.url.split('/').pop()}</p>
              <p className="text-slate-500 text-xs mt-1">
                Uploadé le {new Date(media.uploadedAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          {/* Titre */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Titre <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={status === 'saving' || status === 'success'}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg',
                'bg-slate-700 border border-slate-600',
                'text-white placeholder-slate-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'disabled:opacity-50'
              )}
              placeholder="Titre du média"
            />
          </div>

          {/* Lieu */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Lieu{' '}
              <span className="text-slate-500 font-normal">(optionnel)</span>
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={status === 'saving' || status === 'success'}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg',
                'bg-slate-700 border border-slate-600',
                'text-white placeholder-slate-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'disabled:opacity-50'
              )}
              placeholder="Ex: Poitiers, France"
            />
          </div>

          {/* Date et Catégorie */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Date <span className="text-red-400">*</span>
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={status === 'saving' || status === 'success'}
                className={cn(
                  'w-full px-4 py-2.5 rounded-lg',
                  'bg-slate-700 border border-slate-600',
                  'text-white',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'disabled:opacity-50'
                )}
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Catégorie <span className="text-red-400">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as MediaCategory)}
                disabled={status === 'saving' || status === 'success'}
                className={cn(
                  'w-full px-4 py-2.5 rounded-lg',
                  'bg-slate-700 border border-slate-600',
                  'text-white',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'disabled:opacity-50'
                )}
              >
                {MEDIA_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Description{' '}
              <span className="text-slate-500 font-normal">(optionnel)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={status === 'saving' || status === 'success'}
              rows={3}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg resize-none',
                'bg-slate-700 border border-slate-600',
                'text-white placeholder-slate-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'disabled:opacity-50'
              )}
              placeholder="Description du média..."
            />
          </div>

          {/* Erreur */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={status === 'saving'}
              className={cn(
                'flex-1 px-4 py-2.5 rounded-lg font-medium',
                'bg-slate-700 hover:bg-slate-600 text-white',
                'transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={cn(
                'flex-1 px-4 py-2.5 rounded-lg font-medium',
                'flex items-center justify-center gap-2',
                'transition-colors',
                status === 'success'
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {status === 'saving' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sauvegarde...
                </>
              ) : status === 'success' ? (
                <>
                  <Check size={18} />
                  Sauvegardé !
                </>
              ) : (
                'Enregistrer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
