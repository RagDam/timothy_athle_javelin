import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { addMedia } from '@/lib/media-storage';
import { debugLog } from '@/lib/debug-logger';
import { ALLOWED_IMAGE_TYPES } from '@/types/admin';
import type { UploadedMedia, MediaCategory } from '@/types/admin';

interface RegisterBody {
  url: string;
  pathname: string;
  contentType: string;
  size: number;
  metadata: {
    title: string;
    description?: string;
    location?: string;
    category: MediaCategory;
    date: string;
  };
}

export async function POST(request: Request) {
  debugLog('REGISTER', 'Starting media registration');

  try {
    // Vérifier l'authentification
    const session = await auth();
    if (!session?.user?.email) {
      debugLog('REGISTER', 'Auth failed');
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body: RegisterBody = await request.json();
    debugLog('REGISTER', 'Body received', body);

    const { url, pathname, contentType, size, metadata } = body;

    if (!url || !pathname || !metadata?.title || !metadata?.category || !metadata?.date) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Déterminer le type de média
    const isImage = (ALLOWED_IMAGE_TYPES as readonly string[]).includes(contentType);
    const mediaType = isImage ? 'image' : 'video';

    // Créer l'entrée média
    const mediaId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    const newMedia: UploadedMedia = {
      id: mediaId,
      type: mediaType,
      url,
      pathname,
      title: metadata.title,
      description: metadata.description,
      location: metadata.location,
      category: metadata.category,
      date: metadata.date,
      uploadedBy: session.user.email,
      uploadedAt: new Date().toISOString(),
      size,
    };

    // Sauvegarder les métadonnées
    await addMedia(newMedia);
    debugLog('REGISTER', 'Media registered successfully', { mediaId });

    return NextResponse.json({
      success: true,
      media: newMedia,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    debugLog('REGISTER', 'ERROR', { error: errMsg });
    return NextResponse.json(
      { error: `Erreur: ${errMsg}` },
      { status: 500 }
    );
  }
}
