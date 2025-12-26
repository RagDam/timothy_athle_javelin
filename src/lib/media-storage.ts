import { list, put, del } from '@vercel/blob';
import type { MediaMetadataStore, UploadedMedia } from '@/types/admin';

const METADATA_FILENAME = 'medias-metadata.json';

/**
 * Récupère les métadonnées des médias depuis Vercel Blob
 */
export async function getMediaMetadata(): Promise<MediaMetadataStore> {
  try {
    // Lister les blobs pour trouver le fichier de métadonnées
    const { blobs } = await list({ prefix: METADATA_FILENAME });

    if (blobs.length === 0) {
      // Pas de fichier existant, retourner une structure vide
      return {
        lastUpdated: new Date().toISOString(),
        medias: [],
      };
    }

    // Récupérer le contenu du fichier
    const response = await fetch(blobs[0].url);
    if (!response.ok) {
      throw new Error('Erreur lecture métadonnées');
    }

    const data = await response.json();
    return data as MediaMetadataStore;
  } catch (error) {
    console.error('Erreur récupération métadonnées:', error);
    return {
      lastUpdated: new Date().toISOString(),
      medias: [],
    };
  }
}

/**
 * Sauvegarde les métadonnées des médias dans Vercel Blob
 */
export async function saveMediaMetadata(
  store: MediaMetadataStore
): Promise<void> {
  try {
    // Mettre à jour le timestamp
    store.lastUpdated = new Date().toISOString();

    // Sauvegarder dans Vercel Blob
    await put(METADATA_FILENAME, JSON.stringify(store, null, 2), {
      access: 'public',
      addRandomSuffix: false,
    });
  } catch (error) {
    console.error('Erreur sauvegarde métadonnées:', error);
    throw new Error('Impossible de sauvegarder les métadonnées');
  }
}

/**
 * Ajoute un média aux métadonnées
 */
export async function addMedia(media: UploadedMedia): Promise<void> {
  const store = await getMediaMetadata();

  // Ajouter le nouveau média au début
  store.medias.unshift(media);

  await saveMediaMetadata(store);
}

/**
 * Supprime un média (fichier + métadonnées)
 */
export async function deleteMedia(id: string): Promise<boolean> {
  try {
    const store = await getMediaMetadata();

    // Trouver le média
    const mediaIndex = store.medias.findIndex((m) => m.id === id);
    if (mediaIndex === -1) {
      return false;
    }

    const media = store.medias[mediaIndex];

    // Supprimer le fichier de Vercel Blob
    try {
      await del(media.url);
    } catch (error) {
      console.error('Erreur suppression fichier:', error);
      // Continuer même si la suppression du fichier échoue
    }

    // Supprimer des métadonnées
    store.medias.splice(mediaIndex, 1);
    await saveMediaMetadata(store);

    return true;
  } catch (error) {
    console.error('Erreur suppression média:', error);
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
