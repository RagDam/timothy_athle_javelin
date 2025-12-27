import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getMediaMetadata } from '@/lib/media-storage';
import { debugLog } from '@/lib/debug-logger';

// Désactiver le cache Next.js pour cette route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/admin/media - Liste tous les médias
 */
export async function GET() {
  debugLog('API_ADMIN_MEDIA', 'GET /api/admin/media called');
  try {
    // Vérifier l'authentification
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer les médias
    const store = await getMediaMetadata();
    debugLog('API_ADMIN_MEDIA', 'Store retrieved', {
      mediaCount: store.medias.length,
      lastUpdated: store.lastUpdated
    });

    // Trier par date d'upload (plus récent en premier)
    const sortedMedias = [...store.medias].sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    const response = NextResponse.json({
      medias: sortedMedias,
      lastUpdated: store.lastUpdated,
    });

    // Headers anti-cache
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    debugLog('API_ADMIN_MEDIA', 'ERROR', { error: errMsg });
    console.error('Erreur récupération médias:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
