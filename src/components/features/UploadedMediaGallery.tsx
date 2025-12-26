'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Video, Play, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedSection } from '@/components/ui';
import type { UploadedMedia } from '@/types/admin';

export function UploadedMediaGallery() {
  const [medias, setMedias] = useState<UploadedMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<UploadedMedia | null>(null);

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {photos.map((photo, index) => (
            <AnimatedSection key={photo.id} animation="fadeUp" delay={0.1 * index}>
              <button
                type="button"
                onClick={() => setSelectedMedia(photo)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-800 w-full"
              >
                <Image
                  src={photo.url}
                  alt={photo.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-medium">{photo.title}</p>
                  {photo.description && (
                    <p className="text-slate-300 text-sm mt-1 line-clamp-1">
                      {photo.description}
                    </p>
                  )}
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
