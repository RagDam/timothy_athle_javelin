import { type InstagramPost, type InstagramOEmbedResponse } from '@/types/instagram';

const OEMBED_URL = 'https://graph.facebook.com/v22.0/instagram_oembed';

/**
 * Extrait l'ID d'un post Instagram depuis son URL
 */
export function extractPostId(url: string): string {
  const match = url.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
  return match ? match[2] : '';
}

/**
 * Détermine le type de post (reel ou image)
 */
export function getPostType(url: string): 'reel' | 'post' {
  return url.includes('/reel/') ? 'reel' : 'post';
}

/**
 * Récupère les métadonnées d'un post Instagram via oEmbed
 */
export async function fetchInstagramOEmbed(
  url: string,
  accessToken: string
): Promise<InstagramOEmbedResponse | null> {
  try {
    const params = new URLSearchParams({
      url: url,
      access_token: accessToken,
      omitscript: 'true',
    });

    const response = await fetch(`${OEMBED_URL}?${params}`, {
      next: { revalidate: 3600 }, // Cache 1 heure
    });

    if (!response.ok) {
      console.error(`Instagram oEmbed error for ${url}:`, response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch Instagram oEmbed for ${url}:`, error);
    return null;
  }
}

/**
 * Transforme une URL Instagram en objet InstagramPost
 * Si pas de token, retourne un post basique (mode fallback)
 */
export async function fetchInstagramPost(
  url: string,
  accessToken?: string
): Promise<InstagramPost> {
  const id = extractPostId(url);
  const type = getPostType(url);

  // Mode fallback : pas de token, on retourne juste les infos de base
  if (!accessToken) {
    return {
      url,
      id,
      type,
      isValid: true,
    };
  }

  const oembedData = await fetchInstagramOEmbed(url, accessToken);

  if (!oembedData) {
    return {
      url,
      id,
      type,
      isValid: false,
    };
  }

  return {
    url,
    id,
    type,
    thumbnailUrl: oembedData.thumbnail_url,
    caption: oembedData.title,
    authorName: oembedData.author_name,
    html: oembedData.html,
    isValid: true,
  };
}

/**
 * Récupère tous les posts Instagram depuis la liste d'URLs
 */
export async function fetchAllInstagramPosts(
  urls: string[],
  accessToken?: string
): Promise<InstagramPost[]> {
  const posts = await Promise.all(
    urls.map((url) => fetchInstagramPost(url, accessToken))
  );

  // Filtre les posts invalides et retourne les valides
  return posts.filter((post) => post.isValid);
}

/**
 * Charge les URLs depuis le fichier JSON
 */
export function loadInstagramUrls(): string[] {
  // Import statique pour éviter les problèmes avec dynamic import
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require('@/../content/medias/instagram.json');
  return data.posts || [];
}

/**
 * Génère l'URL d'embed Instagram pour un post
 */
export function getInstagramEmbedUrl(url: string): string {
  return `${url}embed/`;
}
