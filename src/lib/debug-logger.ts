/**
 * Debug logger - désactivé en production
 * Réactiver en mettant DEBUG_LOGGING=true dans .env.local si nécessaire
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function debugLog(_context: string, _message: string, _data?: unknown) {
  // Logging désactivé en production
}

export function clearDebugLog() {
  // Désactivé en production
}
