'use client';

import { useState, useCallback } from 'react';
import { X, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileDropzone } from './FileDropzone';
import { MEDIA_CATEGORIES } from '@/types/admin';
import type { UploadedMedia, MediaCategory } from '@/types/admin';

interface UploadModalProps {
  onClose: () => void;
  onSuccess: (media: UploadedMedia) => void;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export function UploadModal({ onClose, onSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);

  // Métadonnées
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MediaCategory>('competitions');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // État de l'upload
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileSelect = useCallback((f: File, type: 'image' | 'video') => {
    setFile(f);
    setFileType(type);
    // Pré-remplir le titre avec le nom du fichier (sans extension)
    if (!title) {
      const name = f.name.replace(/\.[^/.]+$/, '');
      setTitle(name);
    }
  }, [title]);

  const handleClearFile = useCallback(() => {
    setFile(null);
    setFileType(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }

    setStatus('uploading');
    setError('');
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'metadata',
        JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          category,
          date,
        })
      );

      // Simuler la progression (pas de vrai suivi pour fetch)
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90));
      }, 200);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de l\'upload');
      }

      setStatus('success');

      // Attendre un peu pour montrer le succès, puis fermer
      setTimeout(() => {
        onSuccess(data.media);
      }, 1000);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  const isSubmitDisabled =
    !file || !title.trim() || status === 'uploading' || status === 'success';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={status !== 'uploading' ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Ajouter un média</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={status === 'uploading'}
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
          {/* Zone de dépôt */}
          <FileDropzone
            onFileSelect={handleFileSelect}
            selectedFile={file}
            onClear={handleClearFile}
            disabled={status === 'uploading' || status === 'success'}
          />

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
              disabled={status === 'uploading' || status === 'success'}
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
                disabled={status === 'uploading' || status === 'success'}
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
                disabled={status === 'uploading' || status === 'success'}
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
              disabled={status === 'uploading' || status === 'success'}
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

          {/* Barre de progression */}
          {status === 'uploading' && (
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-slate-400 text-sm text-center">
                Upload en cours... {progress}%
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={status === 'uploading'}
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
              {status === 'uploading' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Upload...
                </>
              ) : status === 'success' ? (
                <>
                  <Check size={18} />
                  Uploadé !
                </>
              ) : (
                'Uploader'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
