import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const adminSecret = process.env.ADMIN_URL_SECRET || 'admin';
  const adminPath = `/${adminSecret}`;
  const pathname = req.nextUrl.pathname;

  // Vérifier si c'est une route admin
  const isAdminRoute = pathname.startsWith(adminPath);
  const isLoginPage = pathname === `${adminPath}/login`;
  const isApiAuthRoute = pathname.startsWith('/api/auth');

  // Laisser passer les routes d'auth API
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Si ce n'est pas une route admin, laisser passer
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // Pour les routes admin (sauf login), vérifier l'authentification
  if (!isLoginPage && !req.auth) {
    const loginUrl = new URL(`${adminPath}/login`, req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si connecté et sur la page login, rediriger vers le dashboard
  if (isLoginPage && req.auth) {
    return NextResponse.redirect(new URL(adminPath, req.url));
  }

  return NextResponse.next();
});

export const config = {
  // Matcher pour toutes les routes sauf les fichiers statiques
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|fonts/).*)',
  ],
};
