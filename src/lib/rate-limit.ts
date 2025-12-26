/**
 * Rate limiter en mémoire pour les tentatives de connexion
 *
 * Limite : 5 tentatives par 15 minutes par IP
 * Reset automatique après succès
 */

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  blocked: boolean;
  blockExpires: number;
}

// Store en mémoire (reset au redémarrage du serveur)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes de blocage

/**
 * Nettoie les entrées expirées (appelé périodiquement)
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();

  for (const [ip, entry] of rateLimitStore.entries()) {
    // Supprimer si la fenêtre est expirée et pas bloqué
    if (!entry.blocked && now - entry.firstAttempt > WINDOW_MS) {
      rateLimitStore.delete(ip);
    }
    // Supprimer si le blocage est expiré
    if (entry.blocked && now > entry.blockExpires) {
      rateLimitStore.delete(ip);
    }
  }
}

// Nettoyage toutes les 5 minutes
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

/**
 * Vérifie si une IP peut tenter une connexion
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  retryAfter: number; // secondes
} {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  // Pas d'entrée = première tentative
  if (!entry) {
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfter: 0 };
  }

  // Vérifier si bloqué
  if (entry.blocked) {
    if (now > entry.blockExpires) {
      // Blocage expiré, réinitialiser
      rateLimitStore.delete(ip);
      return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfter: 0 };
    }
    // Encore bloqué
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.blockExpires - now) / 1000),
    };
  }

  // Vérifier si la fenêtre est expirée
  if (now - entry.firstAttempt > WINDOW_MS) {
    // Réinitialiser
    rateLimitStore.delete(ip);
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfter: 0 };
  }

  // Vérifier le nombre de tentatives
  if (entry.attempts >= MAX_ATTEMPTS) {
    // Bloquer l'IP
    entry.blocked = true;
    entry.blockExpires = now + BLOCK_DURATION_MS;
    rateLimitStore.set(ip, entry);
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil(BLOCK_DURATION_MS / 1000),
    };
  }

  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - entry.attempts,
    retryAfter: 0,
  };
}

/**
 * Enregistre une tentative de connexion
 */
export function recordLoginAttempt(ip: string, success: boolean): void {
  const now = Date.now();

  if (success) {
    // Réinitialiser après succès
    rateLimitStore.delete(ip);
    return;
  }

  const entry = rateLimitStore.get(ip);

  if (!entry) {
    // Première tentative échouée
    rateLimitStore.set(ip, {
      attempts: 1,
      firstAttempt: now,
      blocked: false,
      blockExpires: 0,
    });
    return;
  }

  // Incrémenter les tentatives
  entry.attempts += 1;

  // Vérifier si on doit bloquer
  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.blocked = true;
    entry.blockExpires = now + BLOCK_DURATION_MS;
  }

  rateLimitStore.set(ip, entry);
}

/**
 * Récupère les stats de rate limit pour une IP (pour debug/monitoring)
 */
export function getRateLimitStats(ip: string): RateLimitEntry | null {
  return rateLimitStore.get(ip) || null;
}

/**
 * Réinitialise le rate limit pour une IP (admin only)
 */
export function resetRateLimit(ip: string): void {
  rateLimitStore.delete(ip);
}
