import { NextResponse } from 'next/server';
import { list, del, put } from '@vercel/blob';
import { auth } from '@/lib/auth';
import { debugLog } from '@/lib/debug-logger';

const METADATA_PREFIX = 'medias-metadata-';

/**
 * POST /api/admin/media/reset - Réinitialise les métadonnées des médias
 * Supprime tous les fichiers de métadonnées et crée un fichier vide
 */
export async function POST() {
  debugLog('RESET', 'Reset request received');

  try {
    // Vérifier l'authentification
    const session = await auth();
    if (!session?.user?.email) {
      debugLog('RESET', 'Auth failed');
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Lister tous les fichiers de métadonnées (ancien et nouveau format)
    debugLog('RESET', 'Listing all metadata files...');
    const { blobs: newBlobs } = await list({ prefix: METADATA_PREFIX });
    const { blobs: oldBlobs } = await list({ prefix: 'medias-metadata.json' });
    const allBlobs = [...newBlobs, ...oldBlobs];

    debugLog('RESET', 'Found metadata files', {
      newFormat: newBlobs.length,
      oldFormat: oldBlobs.length,
      total: allBlobs.length
    });

    // Supprimer tous les fichiers de métadonnées
    if (allBlobs.length > 0) {
      debugLog('RESET', 'Deleting all metadata files...');
      await Promise.all(allBlobs.map(b => del(b.url)));
      debugLog('RESET', 'All metadata files deleted');
    }

    // Créer un nouveau fichier de métadonnées vide
    const emptyStore = {
      lastUpdated: new Date().toISOString(),
      medias: [],
    };

    const timestamp = Date.now();
    const newFilename = `${METADATA_PREFIX}${timestamp}.json`;

    debugLog('RESET', 'Creating fresh metadata file...', { filename: newFilename });
    const result = await put(newFilename, JSON.stringify(emptyStore, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    });

    debugLog('RESET', 'Reset complete', { newUrl: result.url });

    return NextResponse.json({
      success: true,
      message: 'Métadonnées réinitialisées',
      deletedFiles: allBlobs.length,
      newFile: result.url,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    debugLog('RESET', 'ERROR', { error: errMsg });
    return NextResponse.json(
      { error: `Erreur: ${errMsg}` },
      { status: 500 }
    );
  }
}
