import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { auth } from '@/lib/auth';
import { addMedia } from '@/lib/media-storage';
import { sanitizeFilename } from '@/lib/file-validation';
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
} from '@/types/admin';
import type { UploadedMedia, MediaCategory } from '@/types/admin';

export async function POST(request: Request) {
  try {
    // 1. Vérifier l'authentification
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // 2. Parser le form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const metadataStr = formData.get('metadata') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    if (!metadataStr) {
      return NextResponse.json(
        { success: false, error: 'Métadonnées manquantes' },
        { status: 400 }
      );
    }

    // 3. Parser et valider les métadonnées
    let metadata: {
      title: string;
      description?: string;
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
    const isImage = (ALLOWED_IMAGE_TYPES as readonly string[]).includes(
      file.type
    );
    const isVideo = (ALLOWED_VIDEO_TYPES as readonly string[]).includes(
      file.type
    );

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          success: false,
          error: `Type de fichier non supporté: ${file.type}`,
        },
        { status: 400 }
      );
    }

    // 5. Valider la taille
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
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
    const safeFilename = sanitizeFilename(file.name);
    const pathname = `medias/${metadata.category}/${safeFilename}`;

    // 7. Upload vers Vercel Blob
    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    // 8. Créer l'entrée média
    const mediaId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    const newMedia: UploadedMedia = {
      id: mediaId,
      type: isImage ? 'image' : 'video',
      url: blob.url,
      pathname: blob.pathname,
      title: metadata.title,
      description: metadata.description,
      category: metadata.category,
      date: metadata.date,
      uploadedBy: session.user.email,
      uploadedAt: new Date().toISOString(),
      size: file.size,
    };

    // 9. Sauvegarder les métadonnées
    await addMedia(newMedia);

    return NextResponse.json({
      success: true,
      media: newMedia,
    });
  } catch (error) {
    console.error('Erreur upload:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de l\'upload',
      },
      { status: 500 }
    );
  }
}
