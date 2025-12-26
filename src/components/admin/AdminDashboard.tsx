'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import {
  Upload,
  LogOut,
  Image as ImageIcon,
  Video,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadModal } from './UploadModal';
import { MediaGrid } from './MediaGrid';
import type { UploadedMedia } from '@/types/admin';

interface AdminDashboardProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [medias, setMedias] = useState<UploadedMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Charger les médias
  async function loadMedias() {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/media');
      if (response.ok) {
        const data = await response.json();
        setMedias(data.medias || []);
      }
    } catch {
      // Erreur silencieuse - l'UI affiche déjà un état vide
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedias();
  }, []);

  // Callback après upload réussi
  function handleUploadSuccess(media: UploadedMedia) {
    setMedias((prev) => [media, ...prev]);
    setShowUploadModal(false);
  }

  // Callback après suppression
  function handleDelete(id: string) {
    setMedias((prev) => prev.filter((m) => m.id !== id));
  }

  // Stats
  const imageCount = medias.filter((m) => m.type === 'image').length;
  const videoCount = medias.filter((m) => m.type === 'video').length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">
              Gestion des Médias
            </h1>
            <p className="text-sm text-slate-400">
              Connecté en tant que {user.name || user.email}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg',
              'text-slate-400 hover:text-white hover:bg-slate-700',
              'transition-colors'
            )}
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats et actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          {/* Stats */}
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-slate-400">
              <ImageIcon size={20} className="text-pink-500" />
              <span className="text-white font-medium">{imageCount}</span>
              <span>photos</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Video size={20} className="text-purple-500" />
              <span className="text-white font-medium">{videoCount}</span>
              <span>vidéos</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={loadMedias}
              disabled={loading}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg',
                'bg-slate-700 hover:bg-slate-600 text-white',
                'transition-colors',
                'disabled:opacity-50'
              )}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Actualiser
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg',
                'bg-blue-600 hover:bg-blue-700 text-white',
                'transition-colors'
              )}
            >
              <Plus size={18} />
              Ajouter un média
            </button>
          </div>
        </div>

        {/* Grille des médias */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <RefreshCw
                size={32}
                className="animate-spin text-blue-500 mx-auto mb-4"
              />
              <p className="text-slate-400">Chargement des médias...</p>
            </div>
          </div>
        ) : medias.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <Upload size={48} className="text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Aucun média uploadé
            </h3>
            <p className="text-slate-400 text-center mb-6 max-w-md">
              Commencez par ajouter des photos et vidéos de vos compétitions et
              entraînements.
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-lg',
                'bg-blue-600 hover:bg-blue-700 text-white',
                'transition-colors'
              )}
            >
              <Plus size={20} />
              Ajouter mon premier média
            </button>
          </div>
        ) : (
          <MediaGrid medias={medias} onDelete={handleDelete} />
        )}
      </main>

      {/* Modal d'upload */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
