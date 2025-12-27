'use client';

import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, Video, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateFile, formatFileSize } from '@/lib/file-validation';
import { processImage, isHeicFile, formatFileSize as formatSize, extractExifDate } from '@/lib/image-processing';
import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_VIDEO_EXTENSIONS,
} from '@/types/admin';

interface FileDropzoneProps {
  onFileSelect: (file: File, type: 'image' | 'video', exifDate?: string | null, location?: string | null) => void;
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
  const [processing, setProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [optimizationInfo, setOptimizationInfo] = useState<string | null>(null);
  const [locationInfo, setLocationInfo] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setOptimizationInfo(null);
      setLocationInfo(null);

      const result = await validateFile(file);

      if (!result.valid) {
        setError(result.error || 'Fichier invalide');
        return;
      }

      let processedFile = file;
      let exifDate: string | null = null;
      let location: string | null = null;

      // Traitement automatique des images
      if (result.type === 'image') {
        const needsProcessing = isHeicFile(file) || file.size > 500 * 1024;

        if (needsProcessing) {
          setProcessing(true);
          setProcessingStatus('Analyse de l\'image...');

          try {
            const processed = await processImage(file, (status) => {
              setProcessingStatus(status);
            });

            processedFile = processed.file;
            exifDate = processed.exifDate;
            location = processed.location;

            // Afficher le lieu détecté
            if (location) {
              setLocationInfo(location);
            }

            // Afficher les infos d'optimisation
            const savings = processed.originalSize - processed.processedSize;
            if (savings > 0) {
              const percentSaved = Math.round((savings / processed.originalSize) * 100);
              const infos: string[] = [];

              if (processed.wasConverted) {
                infos.push('HEIC → JPEG');
              }
              if (processed.wasResized) {
                infos.push('redimensionné');
              }

              setOptimizationInfo(
                `Optimisé (${infos.join(', ')}): ${formatSize(processed.originalSize)} → ${formatSize(processed.processedSize)} (-${percentSaved}%)`
              );
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du traitement de l\'image');
            setProcessing(false);
            return;
          } finally {
            setProcessing(false);
            setProcessingStatus('');
          }
        } else {
          // Même pour les petites images, extraire la date EXIF
          exifDate = await extractExifDate(file);
        }

        // Générer un preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(processedFile);
      } else {
        setPreview(null);
      }

      onFileSelect(processedFile, result.type!, exifDate, location);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled || processing) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile, disabled, processing]
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
      // Reset input pour permettre de re-sélectionner le même fichier
      e.target.value = '';
    },
    [handleFile]
  );

  const handleClear = useCallback(() => {
    setPreview(null);
    setError(null);
    setOptimizationInfo(null);
    setLocationInfo(null);
    onClear();
  }, [onClear]);

  const acceptedExtensions = [
    ...ALLOWED_IMAGE_EXTENSIONS,
    ...ALLOWED_VIDEO_EXTENSIONS,
  ].join(',');

  // État de traitement en cours
  if (processing) {
    return (
      <div className="rounded-xl border-2 border-blue-500 bg-blue-500/10 p-8">
        <div className="text-center">
          <Loader2 size={40} className="mx-auto mb-4 text-blue-400 animate-spin" />
          <p className="text-white font-medium mb-1">{processingStatus}</p>
          <p className="text-slate-400 text-sm">Veuillez patienter...</p>
        </div>
      </div>
    );
  }

  // Affichage du fichier sélectionné
  if (selectedFile) {
    const isImage = selectedFile.type.startsWith('image/');

    return (
      <div className="space-y-2">
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

        {/* Info d'optimisation */}
        {optimizationInfo && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
            <span className="text-green-400 text-sm">{optimizationInfo}</span>
          </div>
        )}

        {/* Lieu détecté */}
        {locationInfo && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <span className="text-blue-400 text-sm">Lieu détecté : {locationInfo}</span>
          </div>
        )}
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
              JPG, PNG, WebP, HEIC (auto-optimisé)
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
