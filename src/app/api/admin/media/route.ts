import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getMediaMetadata } from '@/lib/media-storage';

/**
 * GET /api/admin/media - Liste tous les médias
 */
export async function GET() {
  try {
    // Vérifier l'authentification
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer les médias
    const store = await getMediaMetadata();

    // Trier par date d'upload (plus récent en premier)
    const sortedMedias = [...store.medias].sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    return NextResponse.json({
      medias: sortedMedias,
      lastUpdated: store.lastUpdated,
    });
  } catch (error) {
    console.error('Erreur récupération médias:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
