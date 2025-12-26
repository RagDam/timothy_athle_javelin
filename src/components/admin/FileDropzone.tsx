'use client';

import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, Video, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateFile, formatFileSize } from '@/lib/file-validation';
import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_VIDEO_EXTENSIONS,
} from '@/types/admin';

interface FileDropzoneProps {
  onFileSelect: (file: File, type: 'image' | 'video') => void;
  selectedFile: File | null;
  onClear: () => void;
  disabled?: boolean;
}

export function FileDropzone({
  onFileSelect,
  selectedFile,
  onClear,
  disabled = false,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      const result = await validateFile(file);

      if (!result.valid) {
        setError(result.error || 'Fichier invalide');
        return;
      }

      // Générer un preview pour les images
      if (result.type === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }

      onFileSelect(file, result.type!);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile, disabled]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleClear = useCallback(() => {
    setPreview(null);
    setError(null);
    onClear();
  }, [onClear]);

  const acceptedExtensions = [
    ...ALLOWED_IMAGE_EXTENSIONS,
    ...ALLOWED_VIDEO_EXTENSIONS,
  ].join(',');

  // Affichage du fichier sélectionné
  if (selectedFile) {
    const isImage = selectedFile.type.startsWith('image/');

    return (
      <div className="relative rounded-xl border-2 border-slate-600 bg-slate-800/50 p-4">
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled}
          className={cn(
            'absolute top-2 right-2 p-1.5 rounded-lg',
            'bg-slate-700 hover:bg-slate-600 text-slate-300',
            'transition-colors',
            'disabled:opacity-50'
          )}
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-4">
          {/* Preview ou icône */}
          <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-slate-700 flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : isImage ? (
              <ImageIcon size={32} className="text-pink-500" />
            ) : (
              <Video size={32} className="text-purple-500" />
            )}
          </div>

          {/* Infos fichier */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{selectedFile.name}</p>
            <p className="text-slate-400 text-sm mt-1">
              {formatFileSize(selectedFile.size)}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium',
                  isImage
                    ? 'bg-pink-500/20 text-pink-400'
                    : 'bg-purple-500/20 text-purple-400'
                )}
              >
                {isImage ? (
                  <>
                    <ImageIcon size={12} />
                    Image
                  </>
                ) : (
                  <>
                    <Video size={12} />
                    Vidéo
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative rounded-xl border-2 border-dashed p-8',
          'transition-colors cursor-pointer',
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-slate-600 hover:border-slate-500 bg-slate-800/30',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          type="file"
          accept={acceptedExtensions}
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="text-center">
          <Upload
            size={40}
            className={cn(
              'mx-auto mb-4',
              isDragging ? 'text-blue-400' : 'text-slate-500'
            )}
          />
          <p className="text-white font-medium mb-1">
            {isDragging ? 'Déposez le fichier ici' : 'Glissez un fichier ici'}
          </p>
          <p className="text-slate-400 text-sm mb-4">
            ou cliquez pour sélectionner
          </p>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ImageIcon size={14} className="text-pink-500" />
              JPG, PNG, WebP, HEIC (max 50 MB)
            </span>
            <span className="flex items-center gap-1">
              <Video size={14} className="text-purple-500" />
              MP4, MOV, WebM (max 200 MB)
            </span>
          </div>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
