import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { deleteMedia, updateMedia } from '@/lib/media-storage';
import { debugLog } from '@/lib/debug-logger';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * DELETE /api/admin/media/[id] - Supprime un média
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  debugLog('DELETE', 'Starting delete request');
  try {
    // Vérifier l'authentification
    const session = await auth();
    debugLog('DELETE', 'Auth check', { hasSession: !!session });
    if (!session?.user) {
      debugLog('DELETE', 'Auth failed');
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    debugLog('DELETE', 'Media ID', { id });

    if (!id) {
      return NextResponse.json(
        { error: 'ID média manquant' },
        { status: 400 }
      );
    }

    debugLog('DELETE', 'Calling deleteMedia...');
    const success = await deleteMedia(id);
    debugLog('DELETE', 'deleteMedia result', { success });

    if (!success) {
      return NextResponse.json(
        { error: 'Média non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    debugLog('DELETE', 'ERROR', { message: errorMessage });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/media/[id] - Met à jour les métadonnées d'un média
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID média manquant' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, location, category, date } = body;

    const updatedMedia = await updateMedia(id, {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(location !== undefined && { location }),
      ...(category && { category }),
      ...(date && { date }),
    });

    if (!updatedMedia) {
      return NextResponse.json(
        { error: 'Média non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      media: updatedMedia,
    });
  } catch (error) {
    console.error('Erreur mise à jour média:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
