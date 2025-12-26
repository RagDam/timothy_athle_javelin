import { NextResponse } from 'next/server';
import { getAllMedias } from '@/lib/media-storage';

/**
 * GET /api/medias - Récupère les médias uploadés (public)
 */
export async function GET() {
  try {
    const medias = await getAllMedias();

    return NextResponse.json({
      success: true,
      medias,
    });
  } catch (error) {
    console.error('Erreur récupération médias:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
