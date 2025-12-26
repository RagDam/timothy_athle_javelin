/**
 * Types pour le système d'administration
 */

/**
 * Utilisateur admin
 */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

/**
 * Tentative de connexion (pour logs)
 */
export interface LoginAttempt {
  ip: string;
  timestamp: number;
  success: boolean;
  email: string;
  userAgent?: string;
}

/**
 * Catégorie de média
 */
export type MediaCategory = 'competitions' | 'training' | 'events';

/**
 * Type de média
 */
export type MediaType = 'image' | 'video';

/**
 * Média uploadé (stocké dans Vercel Blob)
 */
export interface UploadedMedia {
  id: string;
  type: MediaType;
  url: string;
  pathname: string;
  title: string;
  description?: string;
  category: MediaCategory;
  date: string;
  uploadedBy: string;
  uploadedAt: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number; // Pour les vidéos, en secondes
}

/**
 * Données de métadonnées stockées dans Vercel Blob
 */
export interface MediaMetadataStore {
  lastUpdated: string;
  medias: UploadedMedia[];
}

/**
 * Formulaire d'upload de média
 */
export interface MediaUploadFormData {
  title: string;
  description?: string;
  category: MediaCategory;
  date: string;
}

/**
 * Réponse API upload
 */
export interface UploadResponse {
  success: boolean;
  media?: UploadedMedia;
  error?: string;
}

/**
 * Types de fichiers acceptés
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
] as const;

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic'];
export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm'];

/**
 * Limites de taille
 */
export const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50 MB
export const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200 MB

/**
 * Configuration des catégories
 */
export const MEDIA_CATEGORIES: Array<{
  id: MediaCategory;
  name: string;
  description: string;
}> = [
  {
    id: 'competitions',
    name: 'Compétitions',
    description: 'Photos et vidéos en compétition',
  },
  {
    id: 'training',
    name: 'Entraînement',
    description: 'Séances d\'entraînement',
  },
  {
    id: 'events',
    name: 'Événements',
    description: 'Remises de prix, meetings',
  },
];
