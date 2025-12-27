import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { debugLog } from '@/lib/debug-logger';

export async function POST(request: Request): Promise<NextResponse> {
  debugLog('UPLOAD-TOKEN', 'Token request received');

  try {
    // Vérifier l'authentification
    const session = await auth();
    if (!session?.user?.email) {
      debugLog('UPLOAD-TOKEN', 'Auth failed');
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = (await request.json()) as HandleUploadBody;
    debugLog('UPLOAD-TOKEN', 'Request body type', { type: body.type });

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        debugLog('UPLOAD-TOKEN', 'Generating token for', { pathname, email: session.user?.email });

        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4',
            'video/quicktime',
            'video/webm',
          ],
          maximumSizeInBytes: 200 * 1024 * 1024, // 200MB max
        };
      },
      onUploadCompleted: async ({ blob }) => {
        debugLog('UPLOAD-TOKEN', 'Upload completed', { url: blob.url, pathname: blob.pathname });
        // Le média sera enregistré via l'endpoint /register après l'upload
      },
    });

    debugLog('UPLOAD-TOKEN', 'Response generated');
    return NextResponse.json(jsonResponse);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    debugLog('UPLOAD-TOKEN', 'ERROR', { error: errMsg });
    return NextResponse.json({ error: errMsg }, { status: 400 });
  }
}
