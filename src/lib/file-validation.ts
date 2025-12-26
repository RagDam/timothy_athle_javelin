import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
} from '@/types/admin';

/**
 * Résultat de validation d'un fichier
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  type?: 'image' | 'video';
}

/**
 * Signatures magiques des fichiers (premiers bytes)
 */
const MAGIC_BYTES: Record<string, number[]> = {
  // Images
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF header
  'image/heic': [0x00, 0x00, 0x00], // ftyp box (vérification partielle)
  // Videos
  'video/mp4': [0x00, 0x00, 0x00], // ftyp box
  'video/quicktime': [0x00, 0x00, 0x00], // ftyp box
  'video/webm': [0x1a, 0x45, 0xdf, 0xa3], // EBML header
};

/**
 * Vérifie les magic bytes d'un fichier
 */
async function checkMagicBytes(file: File): Promise<boolean> {
  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Pour les fichiers MP4/MOV/HEIC, vérifier le ftyp box
  if (
    file.type === 'video/mp4' ||
    file.type === 'video/quicktime' ||
    file.type === 'image/heic'
  ) {
    // Les fichiers ftyp ont "ftyp" aux bytes 4-7
    const ftypSignature = [0x66, 0x74, 0x79, 0x70]; // "ftyp"
    const hasFtyp =
      bytes[4] === ftypSignature[0] &&
      bytes[5] === ftypSignature[1] &&
      bytes[6] === ftypSignature[2] &&
      bytes[7] === ftypSignature[3];
    return hasFtyp;
  }

  // Pour les autres types, vérifier les premiers bytes
  const expectedBytes = MAGIC_BYTES[file.type];
  if (!expectedBytes) {
    return true; // Type non vérifié, on fait confiance au MIME
  }

  for (let i = 0; i < expectedBytes.length; i++) {
    if (bytes[i] !== expectedBytes[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Valide un fichier pour l'upload
 */
export async function validateFile(file: File): Promise<ValidationResult> {
  // 1. Vérifier le type MIME
  const isImage = (ALLOWED_IMAGE_TYPES as readonly string[]).includes(
    file.type
  );
  const isVideo = (ALLOWED_VIDEO_TYPES as readonly string[]).includes(
    file.type
  );

  if (!isImage && !isVideo) {
    return {
      valid: false,
      error: `Type de fichier non supporté: ${file.type || 'inconnu'}. Formats acceptés: JPG, PNG, WebP, HEIC pour les images; MP4, MOV, WebM pour les vidéos.`,
    };
  }

  // 2. Vérifier la taille
  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
  const maxSizeMB = maxSize / (1024 * 1024);

  if (file.size > maxSize) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Fichier trop volumineux (${fileSizeMB} MB). Maximum: ${maxSizeMB} MB pour les ${isImage ? 'images' : 'vidéos'}.`,
    };
  }

  // 3. Vérifier les magic bytes (sécurité supplémentaire)
  try {
    const magicBytesValid = await checkMagicBytes(file);
    if (!magicBytesValid) {
      return {
        valid: false,
        error:
          'Le contenu du fichier ne correspond pas à son extension. Fichier potentiellement corrompu ou malveillant.',
      };
    }
  } catch {
    // En cas d'erreur de lecture, on continue (la validation côté serveur fera une 2e vérification)
  }

  return {
    valid: true,
    type: isImage ? 'image' : 'video',
  };
}

/**
 * Génère un nom de fichier sécurisé
 */
export function sanitizeFilename(filename: string): string {
  // Extraire l'extension
  const lastDot = filename.lastIndexOf('.');
  const name = lastDot > 0 ? filename.slice(0, lastDot) : filename;
  const ext = lastDot > 0 ? filename.slice(lastDot) : '';

  // Nettoyer le nom
  const sanitized = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9-_]/g, '-') // Remplacer les caractères spéciaux
    .replace(/-+/g, '-') // Éviter les tirets multiples
    .replace(/^-|-$/g, '') // Supprimer les tirets en début/fin
    .slice(0, 50); // Limiter la longueur

  // Ajouter un timestamp pour l'unicité
  const timestamp = Date.now().toString(36);

  return `${sanitized}-${timestamp}${ext.toLowerCase()}`;
}

/**
 * Formate la taille d'un fichier pour l'affichage
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
