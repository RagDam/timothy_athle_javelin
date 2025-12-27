'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, Video, Play, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedSection } from '@/components/ui';
import type { UploadedMedia } from '@/types/admin';

export function UploadedMediaGallery() {
  const [medias, setMedias] = useState<UploadedMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<UploadedMedia | null>(null);

  // Navigation dans le modal - hooks toujours appelés
  const currentIndex = selectedMedia ? medias.findIndex(m => m.id === selectedMedia.id) : -1;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < medias.length - 1;

  const goToPrevious = useCallback(() => {
    if (hasPrevious && currentIndex > 0) {
      setSelectedMedia(medias[currentIndex - 1]);
    }
  }, [currentIndex, hasPrevious, medias]);

  const goToNext = useCallback(() => {
    if (hasNext && currentIndex < medias.length - 1) {
      setSelectedMedia(medias[currentIndex + 1]);
    }
  }, [currentIndex, hasNext, medias]);

  // Charger les médias
  useEffect(() => {
    async function loadMedias() {
      try {
        const response = await fetch('/api/medias');
        if (response.ok) {
          const data = await response.json();
          setMedias(data.medias || []);
        }
      } catch {
        // Erreur silencieuse - l'UI affiche un état vide
      } finally {
        setLoading(false);
      }
    }

    loadMedias();
  }, []);

  // Navigation au clavier
  useEffect(() => {
    if (!selectedMedia) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMedia(null);
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMedia, goToPrevious, goToNext]);

  // États de chargement et vide - après tous les hooks
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (medias.length === 0) {
    return null;
  }

  const photos = medias.filter((m) => m.type === 'image');
  const videos = medias.filter((m) => m.type === 'video');

  return (
    <>
      {/* Galerie photos uploadées */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {photos.map((photo, index) => (
            <AnimatedSection key={photo.id} animation="fadeUp" delay={0.05 * index}>
              <button
                type="button"
                onClick={() => setSelectedMedia(photo)}
                className="group relative aspect-square rounded-lg overflow-hidden bg-black w-full block"
              >
                <Image
                  src={photo.url}
                  alt={photo.title}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm font-medium line-clamp-1">{photo.title}</p>
                </div>
              </button>
            </AnimatedSection>
          ))}
        </div>
      )}

      {/* Galerie vidéos uploadées */}
      {videos.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {videos.map((video, index) => (
            <AnimatedSection key={video.id} animation="fadeUp" delay={0.1 * index}>
              <button
                type="button"
                onClick={() => setSelectedMedia(video)}
                className="group relative aspect-video rounded-xl overflow-hidden bg-slate-800 w-full"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video size={48} className="text-slate-600" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-purple-500/80 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                    <Play size={28} className="text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-medium">{video.title}</p>
                  {video.description && (
                    <p className="text-slate-300 text-sm mt-1 line-clamp-1">
                      {video.description}
                    </p>
                  )}
                </div>
              </button>
            </AnimatedSection>
          ))}
        </div>
      )}

      {/* Modal de visualisation */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={() => setSelectedMedia(null)}
        >
          {/* Bouton fermer */}
          <button
            type="button"
            onClick={() => setSelectedMedia(null)}
            className={cn(
              'absolute top-4 right-4 z-10',
              'p-3 rounded-full',
              'bg-white/10 hover:bg-white/20 backdrop-blur-sm',
              'text-white',
              'transition-colors'
            )}
            aria-label="Fermer"
          >
            <X size={24} />
          </button>

          {/* Bouton précédent */}
          {hasPrevious && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className={cn(
                'absolute left-4 top-1/2 -translate-y-1/2 z-10',
                'p-3 rounded-full',
                'bg-white/10 hover:bg-white/20 backdrop-blur-sm',
                'text-white',
                'transition-colors'
              )}
              aria-label="Précédent"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Bouton suivant */}
          {hasNext && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className={cn(
                'absolute right-4 top-1/2 -translate-y-1/2 z-10',
                'p-3 rounded-full',
                'bg-white/10 hover:bg-white/20 backdrop-blur-sm',
                'text-white',
                'transition-colors'
              )}
              aria-label="Suivant"
            >
              <ChevronRight size={28} />
            </button>
          )}

          <div
            className="relative max-w-5xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.type === 'image' ? (
              <Image
                src={selectedMedia.url}
                alt={selectedMedia.title}
                width={1920}
                height={1080}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            ) : (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="w-full max-h-[80vh] rounded-lg"
              />
            )}
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-white">{selectedMedia.title}</h3>
              {selectedMedia.description && (
                <p className="text-slate-400 mt-2">{selectedMedia.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
