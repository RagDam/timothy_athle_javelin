import { list, put, del } from '@vercel/blob';
import type { MediaMetadataStore, UploadedMedia } from '@/types/admin';
import { debugLog } from './debug-logger';

// Utiliser un préfixe pour les fichiers de métadonnées
const METADATA_PREFIX = 'medias-metadata-';

/**
 * Récupère les métadonnées des médias depuis Vercel Blob
 * Utilise un système de fichiers versionnés pour éviter les problèmes de cache CDN
 */
export async function getMediaMetadata(): Promise<MediaMetadataStore> {
  debugLog('STORAGE', 'getMediaMetadata called');
  try {
    // Lister tous les fichiers de métadonnées (versionnés)
    debugLog('STORAGE', 'Listing blobs with prefix:', { prefix: METADATA_PREFIX });
    const { blobs } = await list({ prefix: METADATA_PREFIX });
    debugLog('STORAGE', 'Blobs found:', { count: blobs.length, urls: blobs.map(b => b.url) });

    if (blobs.length === 0) {
      debugLog('STORAGE', 'No metadata file exists, returning empty store');
      return {
        lastUpdated: new Date().toISOString(),
        medias: [],
      };
    }

    // Trier par date de création (plus récent en premier) pour prendre le dernier fichier
    const sortedBlobs = [...blobs].sort((a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    const latestBlob = sortedBlobs[0];
    debugLog('STORAGE', 'Using latest metadata file:', {
      url: latestBlob.url,
      uploadedAt: latestBlob.uploadedAt,
      totalFiles: blobs.length
    });

    // Récupérer le contenu du fichier le plus récent
    const urlWithCacheBust = `${latestBlob.url}?t=${Date.now()}`;
    debugLog('STORAGE', 'Fetching metadata file:', { url: urlWithCacheBust });
    const response = await fetch(urlWithCacheBust, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    debugLog('STORAGE', 'Fetch response:', { ok: response.ok, status: response.status });

    if (!response.ok) {
      throw new Error(`Erreur lecture métadonnées: ${response.status}`);
    }

    const data = await response.json();
    debugLog('STORAGE', 'Metadata parsed successfully:', { mediaCount: data.medias?.length });
    return data as MediaMetadataStore;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    debugLog('STORAGE', 'getMediaMetadata ERROR:', { error: errMsg });
    console.error('Erreur récupération métadonnées:', error);
    return {
      lastUpdated: new Date().toISOString(),
      medias: [],
    };
  }
}

/**
 * Sauvegarde les métadonnées des médias dans Vercel Blob
 * Crée un nouveau fichier avec timestamp unique pour éviter le cache CDN
 */
export async function saveMediaMetadata(
  store: MediaMetadataStore
): Promise<void> {
  debugLog('STORAGE', 'saveMediaMetadata called', { mediaCount: store.medias.length });
  try {
    // Mettre à jour le timestamp
    store.lastUpdated = new Date().toISOString();
    debugLog('STORAGE', 'Timestamp updated:', { lastUpdated: store.lastUpdated });

    const jsonContent = JSON.stringify(store, null, 2);
    debugLog('STORAGE', 'JSON content prepared', {
      length: jsonContent.length,
      mediaIds: store.medias.map(m => m.id)
    });

    // Créer un nouveau fichier avec timestamp unique (évite le cache CDN)
    const timestamp = Date.now();
    const newFilename = `${METADATA_PREFIX}${timestamp}.json`;
    debugLog('STORAGE', 'Creating new metadata file...', { filename: newFilename });

    const result = await put(newFilename, jsonContent, {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    });
    debugLog('STORAGE', 'saveMediaMetadata SUCCESS', { url: result.url });

    // Nettoyer les anciens fichiers de métadonnées (garder seulement le nouveau)
    debugLog('STORAGE', 'Cleaning up old metadata files...');
    try {
      const { blobs } = await list({ prefix: METADATA_PREFIX });
      const oldBlobs = blobs.filter(b => b.url !== result.url);

      if (oldBlobs.length > 0) {
        debugLog('STORAGE', 'Deleting old files', { count: oldBlobs.length });
        await Promise.all(oldBlobs.map(b => del(b.url)));
        debugLog('STORAGE', 'Old files deleted successfully');
      }
    } catch (cleanupError) {
      // Ne pas faire échouer la sauvegarde si le nettoyage échoue
      debugLog('STORAGE', 'Cleanup warning (non-fatal)', {
        error: cleanupError instanceof Error ? cleanupError.message : String(cleanupError)
      });
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    debugLog('STORAGE', 'saveMediaMetadata ERROR', { error: errMsg });
    console.error('Erreur sauvegarde métadonnées:', error);
    throw new Error('Impossible de sauvegarder les métadonnées');
  }
}

/**
 * Ajoute un média aux métadonnées
 */
export async function addMedia(media: UploadedMedia): Promise<void> {
  debugLog('STORAGE', '=== addMedia START ===', { mediaId: media.id, title: media.title });

  debugLog('STORAGE', 'Fetching current metadata...');
  const store = await getMediaMetadata();
  debugLog('STORAGE', 'Current store state', {
    existingCount: store.medias.length,
    existingIds: store.medias.map(m => m.id)
  });

  // Ajouter le nouveau média au début
  store.medias.unshift(media);
  debugLog('STORAGE', 'Media added to array', { newCount: store.medias.length });

  await saveMediaMetadata(store);
  debugLog('STORAGE', '=== addMedia COMPLETE ===');
}

/**
 * Supprime un média (fichier + métadonnées)
 */
export async function deleteMedia(id: string): Promise<boolean> {
  debugLog('STORAGE', '=== deleteMedia START ===', { id });

  try {
    debugLog('STORAGE', 'Fetching metadata...');
    const store = await getMediaMetadata();
    debugLog('STORAGE', 'Got metadata', {
      mediaCount: store.medias.length,
      mediaIds: store.medias.map(m => m.id)
    });

    // Trouver le média
    const mediaIndex = store.medias.findIndex((m) => m.id === id);
    debugLog('STORAGE', 'Search result', { mediaIndex, found: mediaIndex !== -1 });

    if (mediaIndex === -1) {
      debugLog('STORAGE', 'Media NOT found - returning false');
      return false;
    }

    const media = store.medias[mediaIndex];
    debugLog('STORAGE', 'Media found', {
      url: media.url,
      pathname: media.pathname,
      title: media.title
    });

    // Supprimer le fichier de Vercel Blob
    debugLog('STORAGE', 'Attempting blob deletion...');
    try {
      await del(media.url);
      debugLog('STORAGE', 'Blob deleted OK');
    } catch (blobError) {
      const errMsg = blobError instanceof Error ? blobError.message : String(blobError);
      const errStack = blobError instanceof Error ? blobError.stack : '';
      debugLog('STORAGE', 'Blob delete FAILED (continuing anyway)', {
        error: errMsg,
        stack: errStack
      });
      // Continuer même si la suppression du fichier échoue
    }

    // Supprimer des métadonnées
    debugLog('STORAGE', 'Removing from metadata array...');
    store.medias.splice(mediaIndex, 1);
    debugLog('STORAGE', 'Array updated, new count:', { count: store.medias.length });

    debugLog('STORAGE', 'Saving metadata...');
    await saveMediaMetadata(store);
    debugLog('STORAGE', 'Metadata saved successfully');

    debugLog('STORAGE', '=== deleteMedia SUCCESS ===');
    return true;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const errStack = error instanceof Error ? error.stack : '';
    debugLog('STORAGE', '=== deleteMedia FAILED ===', {
      error: errMsg,
      stack: errStack
    });
    return false;
  }
}

/**
 * Met à jour les métadonnées d'un média
 */
export async function updateMedia(
  id: string,
  updates: Partial<Pick<UploadedMedia, 'title' | 'description' | 'category' | 'date'>>
): Promise<UploadedMedia | null> {
  try {
    const store = await getMediaMetadata();

    const mediaIndex = store.medias.findIndex((m) => m.id === id);
    if (mediaIndex === -1) {
      return null;
    }

    // Appliquer les mises à jour
    store.medias[mediaIndex] = {
      ...store.medias[mediaIndex],
      ...updates,
    };

    await saveMediaMetadata(store);

    return store.medias[mediaIndex];
  } catch (error) {
    console.error('Erreur mise à jour média:', error);
    return null;
  }
}

/**
 * Récupère tous les médias pour affichage public
 */
export async function getAllMedias(): Promise<UploadedMedia[]> {
  const store = await getMediaMetadata();
  // Trier par date (plus récent en premier)
  return store.medias.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Récupère les médias par catégorie
 */
export async function getMediasByCategory(
  category: string
): Promise<UploadedMedia[]> {
  const store = await getMediaMetadata();
  return store.medias
    .filter((m) => m.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
