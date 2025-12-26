import { NextResponse } from 'next/server';
import { loadInstagramUrls, fetchAllInstagramPosts } from '@/lib/instagram';

export const revalidate = 3600; // Cache 1 heure

export async function GET() {
  try {
    const urls = loadInstagramUrls();

    // Récupère le token depuis les variables d'environnement
    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    const accessToken = appId && appSecret ? `${appId}|${appSecret}` : undefined;

    const posts = await fetchAllInstagramPosts(urls, accessToken);

    return NextResponse.json({
      posts,
      count: posts.length,
      hasToken: !!accessToken,
      lastFetched: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Instagram API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram posts' },
      { status: 500 }
    );
  }
}
