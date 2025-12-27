import { NextResponse } from 'next/server';
import { getAllMedias } from '@/lib/media-storage';
import { debugLog } from '@/lib/debug-logger';

// Désactiver le cache Next.js pour cette route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/medias - Récupère les médias uploadés (public)
 */
export async function GET() {
  debugLog('API_MEDIAS', 'GET /api/medias called');
  try {
    const medias = await getAllMedias();
    debugLog('API_MEDIAS', 'Medias retrieved', { count: medias.length });

    const response = NextResponse.json({
      success: true,
      medias,
    });

    // Headers anti-cache
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    debugLog('API_MEDIAS', 'ERROR', { error: errMsg });
    console.error('Erreur récupération médias:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
