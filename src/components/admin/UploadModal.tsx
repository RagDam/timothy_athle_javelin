'use client';

import { useState, useCallback } from 'react';
import { upload } from '@vercel/blob/client';
import { X, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileDropzone } from './FileDropzone';
import { MEDIA_CATEGORIES } from '@/types/admin';
import type { UploadedMedia, MediaCategory } from '@/types/admin';

// Seuil pour utiliser l'upload client-side (10MB)
const CLIENT_UPLOAD_THRESHOLD = 10 * 1024 * 1024;

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
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<MediaCategory>('competitions');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // État de l'upload
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileSelect = useCallback((f: File, type: 'image' | 'video', exifDate?: string | null, detectedLocation?: string | null) => {
    setFile(f);
    setFileType(type);
    // Pré-remplir le titre avec le nom du fichier (sans extension)
    if (!title) {
      const name = f.name.replace(/\.[^/.]+$/, '');
      setTitle(name);
    }
    // Utiliser la date EXIF si disponible
    if (exifDate) {
      setDate(exifDate);
    }
    // Utiliser le lieu détecté si disponible
    if (detectedLocation) {
      setLocation(detectedLocation);
    }
  }, [title]);

  const handleClearFile = useCallback(() => {
    setFile(null);
    setFileType(null);
  }, []);

  // Sanitize filename pour éviter les problèmes
  const sanitizeFilename = (filename: string): string => {
    const ext = filename.split('.').pop() || '';
    const name = filename.replace(/\.[^/.]+$/, '');
    const safeName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase()
      .slice(0, 50);
    const timestamp = Date.now();
    return `${safeName}-${timestamp}.${ext}`;
  };

  // Upload serveur (petits fichiers < 10MB)
  const uploadViaServer = async (file: File, metadata: Record<string, unknown>): Promise<{ success: boolean; media?: UploadedMedia; error?: string }> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      });

      xhr.addEventListener('load', () => {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch {
          reject(new Error('Erreur de parsing de la réponse'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Erreur réseau'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload annulé'));
      });

      xhr.open('POST', '/api/admin/upload');
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.setRequestHeader('x-metadata', JSON.stringify(metadata));
      xhr.setRequestHeader('x-filename', file.name);
      xhr.setRequestHeader('x-file-type', file.type);
      xhr.setRequestHeader('x-file-size', file.size.toString());
      xhr.send(file);
    });
  };

  // Upload client-side pour gros fichiers (>= 10MB)
  // Utilise @vercel/blob/client pour upload directement vers Vercel Blob
  const uploadViaClient = async (
    file: File,
    metadata: { title: string; description?: string; location?: string; category: MediaCategory; date: string }
  ): Promise<{ success: boolean; media?: UploadedMedia; error?: string }> => {
    try {
      // Générer le pathname
      const safeFilename = sanitizeFilename(file.name);
      const pathname = `medias/${metadata.category}/${safeFilename}`;

      // Simuler la progression (Vercel Blob client ne supporte pas le progress natif)
      let progressInterval: NodeJS.Timeout | null = null;
      let simulatedProgress = 0;

      progressInterval = setInterval(() => {
        simulatedProgress = Math.min(simulatedProgress + 2, 95);
        setProgress(simulatedProgress);
      }, 200);

      // Upload via Vercel Blob client
      const blob = await upload(pathname, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload/token',
      });

      // Arrêter la simulation de progression
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setProgress(98);

      // Enregistrer les métadonnées via l'API register
      const registerResponse = await fetch('/api/admin/upload/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: blob.url,
          pathname: blob.pathname,
          contentType: file.type,
          size: file.size,
          metadata,
        }),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.error || 'Erreur lors de l\'enregistrement');
      }

      setProgress(100);
      const result = await registerResponse.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      return { success: false, error: errorMessage };
    }
  };

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
      const metadata = {
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        category,
        date,
      };

      // Choisir la méthode d'upload selon la taille du fichier
      const useClientUpload = file.size >= CLIENT_UPLOAD_THRESHOLD;

      const result = useClientUpload
        ? await uploadViaClient(file, metadata)
        : await uploadViaServer(file, metadata);

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de l\'upload');
      }

      setStatus('success');

      // Attendre un peu pour montrer le succès, puis fermer
      setTimeout(() => {
        if (result.media) {
          onSuccess(result.media);
        }
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

          {/* Lieu */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Lieu{' '}
              <span className="text-slate-500 font-normal">(optionnel, auto-détecté si GPS)</span>
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={status === 'uploading' || status === 'success'}
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
