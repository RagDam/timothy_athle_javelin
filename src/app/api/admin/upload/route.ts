import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { auth } from '@/lib/auth';
import { addMedia } from '@/lib/media-storage';
import { sanitizeFilename } from '@/lib/file-validation';
import { debugLog } from '@/lib/debug-logger';
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
} from '@/types/admin';
import type { UploadedMedia, MediaCategory } from '@/types/admin';

// Note: Cette route est gardée pour la compatibilité mais l'upload client
// via /api/admin/upload/token est préféré pour les gros fichiers

export async function POST(request: Request) {
  debugLog('UPLOAD', 'Starting upload request');
  try {
    // 1. Vérifier l'authentification
    const session = await auth();
    debugLog('UPLOAD', 'Auth check', { hasSession: !!session, email: session?.user?.email });
    if (!session?.user?.email) {
      debugLog('UPLOAD', 'Auth failed - no session');
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // 2. Récupérer les métadonnées depuis les headers (évite le parsing FormData)
    const metadataStr = request.headers.get('x-metadata');
    const filename = request.headers.get('x-filename') || 'file';
    const fileType = request.headers.get('x-file-type') || 'application/octet-stream';
    const fileSizeStr = request.headers.get('x-file-size') || '0';
    const fileSize = parseInt(fileSizeStr, 10);

    debugLog('UPLOAD', 'Headers received', { metadataStr: !!metadataStr, filename, fileType, fileSize });

    if (!metadataStr) {
      return NextResponse.json(
        { success: false, error: 'Métadonnées manquantes (header x-metadata)' },
        { status: 400 }
      );
    }

    // 3. Parser et valider les métadonnées
    let metadata: {
      title: string;
      description?: string;
      location?: string;
      category: MediaCategory;
      date: string;
    };

    try {
      metadata = JSON.parse(metadataStr);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Métadonnées invalides' },
        { status: 400 }
      );
    }

    if (!metadata.title || !metadata.category || !metadata.date) {
      return NextResponse.json(
        { success: false, error: 'Titre, catégorie et date sont requis' },
        { status: 400 }
      );
    }

    // 4. Valider le type de fichier
    const isImage = (ALLOWED_IMAGE_TYPES as readonly string[]).includes(fileType);
    const isVideo = (ALLOWED_VIDEO_TYPES as readonly string[]).includes(fileType);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          success: false,
          error: `Type de fichier non supporté: ${fileType}`,
        },
        { status: 400 }
      );
    }

    // 5. Valider la taille
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (fileSize > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      return NextResponse.json(
        {
          success: false,
          error: `Fichier trop volumineux. Maximum: ${maxSizeMB} MB`,
        },
        { status: 400 }
      );
    }

    // 6. Générer un nom de fichier sécurisé
    const safeFilename = sanitizeFilename(filename);
    const pathname = `medias/${metadata.category}/${safeFilename}`;
    debugLog('UPLOAD', 'Preparing blob upload', { pathname, fileSize, fileType });

    // 7. Upload vers Vercel Blob (lire le body complet d'abord)
    debugLog('UPLOAD', 'Reading request body...');
    const arrayBuffer = await request.arrayBuffer();
    debugLog('UPLOAD', 'Body read complete', { actualSize: arrayBuffer.byteLength, expectedSize: fileSize });

    if (arrayBuffer.byteLength !== fileSize) {
      debugLog('UPLOAD', 'Size mismatch!', { actualSize: arrayBuffer.byteLength, expectedSize: fileSize });
    }

    debugLog('UPLOAD', 'Starting Vercel Blob upload...');
    const blob = await put(pathname, arrayBuffer, {
      access: 'public',
      addRandomSuffix: false,
      contentType: fileType,
    });

    debugLog('UPLOAD', 'Blob upload success', { url: blob.url });

    // 8. Créer l'entrée média
    const mediaId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    const newMedia: UploadedMedia = {
      id: mediaId,
      type: isImage ? 'image' : 'video',
      url: blob.url,
      pathname: blob.pathname,
      title: metadata.title,
      description: metadata.description,
      location: metadata.location,
      category: metadata.category,
      date: metadata.date,
      uploadedBy: session.user.email,
      uploadedAt: new Date().toISOString(),
      size: fileSize,
    };

    // 9. Sauvegarder les métadonnées
    await addMedia(newMedia);
    debugLog('UPLOAD', 'Media saved successfully', { mediaId });

    return NextResponse.json({
      success: true,
      media: newMedia,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';
    debugLog('UPLOAD', 'ERROR', { message: errorMessage, stack: errorStack });
    return NextResponse.json(
      {
        success: false,
        error: `Erreur lors de l'upload: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
