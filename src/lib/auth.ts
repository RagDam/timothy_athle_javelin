import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { checkRateLimit, recordLoginAttempt } from './rate-limit';
import type { AdminUser } from '@/types/admin';

/**
 * Charge les utilisateurs admin depuis les variables d'environnement
 */
function getAdminUsers(): Array<AdminUser & { passwordHash: string }> {
  const users: Array<AdminUser & { passwordHash: string }> = [];

  for (let i = 1; i <= 3; i++) {
    const email = process.env[`ADMIN_USER_${i}_EMAIL`];
    const name = process.env[`ADMIN_USER_${i}_NAME`];
    const passwordHash = process.env[`ADMIN_USER_${i}_PASSWORD_HASH`];

    if (email && name && passwordHash) {
      users.push({
        id: `admin-${i}`,
        email,
        name,
        passwordHash,
      });
    }
  }

  return users;
}

/**
 * Vérifie les credentials d'un utilisateur
 */
async function verifyCredentials(
  email: string,
  password: string,
  ip: string
): Promise<AdminUser | null> {
  // Vérifier le rate limit
  const rateLimitResult = checkRateLimit(ip);
  if (!rateLimitResult.allowed) {
    throw new Error(
      `Trop de tentatives. Réessayez dans ${Math.ceil(rateLimitResult.retryAfter / 60)} minutes.`
    );
  }

  const users = getAdminUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    recordLoginAttempt(ip, false);
    return null;
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordValid) {
    recordLoginAttempt(ip, false);
    return null;
  }

  recordLoginAttempt(ip, true);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Récupérer l'IP depuis les headers
        const forwardedFor = request.headers.get('x-forwarded-for');
        const ip = forwardedFor?.split(',')[0]?.trim() || 'unknown';

        try {
          const user = await verifyCredentials(email, password, ip);
          return user;
        } catch (error) {
          // L'erreur contient le message de rate limit
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: `/${process.env.ADMIN_URL_SECRET}/login`,
    error: `/${process.env.ADMIN_URL_SECRET}/login`,
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 heure
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async authorized({ auth, request }) {
      const adminPath = `/${process.env.ADMIN_URL_SECRET}`;
      const isAdminRoute = request.nextUrl.pathname.startsWith(adminPath);
      const isLoginPage = request.nextUrl.pathname === `${adminPath}/login`;

      // Les routes admin (sauf login) nécessitent une authentification
      if (isAdminRoute && !isLoginPage) {
        return !!auth;
      }

      return true;
    },
  },
  trustHost: true,
});
