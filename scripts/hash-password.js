#!/usr/bin/env node

/**
 * Script pour générer un hash bcrypt d'un mot de passe
 * Usage: node scripts/hash-password.js "votre-mot-de-passe"
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.js "votre-mot-de-passe"');
  console.error('');
  console.error('Le mot de passe doit être fourni en argument.');
  console.error('Utilisez des guillemets si le mot de passe contient des espaces ou caractères spéciaux.');
  process.exit(1);
}

// Générer le hash avec un cost factor de 10 (standard)
const hash = bcrypt.hashSync(password, 10);

console.log('');
console.log('Hash bcrypt généré :');
console.log('');
console.log(hash);
console.log('');
console.log('Copiez ce hash dans votre fichier .env.local pour ADMIN_USER_X_PASSWORD_HASH');
