# CLAUDE.md - Règles de Développement

> Ce fichier définit les règles et conventions pour Claude Code sur ce projet.

## Projet

**Site personnel** : Timothy Montavon - Athlète Javelot
**Stack** : Next.js 16 + TypeScript + Tailwind CSS + Framer Motion

---

## RÈGLES IMPORTANTES

### Serveur de développement

**INTERDIT** : Ne JAMAIS lancer le serveur de développement (`npm run dev`) par toi-même.
L'utilisateur dispose d'un fichier `start-dev.bat` qu'il lance lui-même.

### Commits Git

**OBLIGATOIRE** : Les commits doivent être **unitaires**.
- Un commit = une seule feature ou un seul fix
- Ne jamais regrouper plusieurs fonctionnalités dans un même commit
- Granularité fine pour un historique clair et des reverts faciles

### Conversion d'images Apple (HEIC)

**OBLIGATOIRE** : Convertir automatiquement les fichiers HEIC en JPEG sans demander à l'utilisateur.

Utiliser le package `heic-convert` (déjà installé) :

```javascript
const convert = require('heic-convert');
const fs = require('fs');

async function convertHeicToJpg(inputPath, outputPath) {
  const inputBuffer = fs.readFileSync(inputPath);
  const outputBuffer = await convert({
    buffer: inputBuffer,
    format: 'JPEG',
    quality: 0.9
  });
  fs.writeFileSync(outputPath, outputBuffer);
}
```

---

## Architecture

### Structure des dossiers

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── api/               # API Routes
│   ├── globals.css        # UNIQUE fichier CSS (design tokens)
│   └── (pages)/           # Pages du site
├── components/
│   ├── ui/                # Composants génériques (Button, Card...)
│   ├── layout/            # Header, Footer, Navigation
│   ├── sections/          # Sections de pages (Hero, Stats...)
│   └── features/          # Composants métier par domaine
├── fonts/                 # Polices locales (Satoshi)
├── lib/                   # Utilitaires et helpers
├── hooks/                 # Custom hooks React
├── types/                 # Types TypeScript globaux
└── config/                # Configuration centralisée

content/                   # Contenu Markdown et JSON
├── pages/                 # Contenu des pages statiques
├── palmares/              # Résultats sportifs
├── agenda/                # Événements
├── medias/                # Métadonnées galerie
└── decouvrir/             # Liens partenaires

public/images/             # Images du site
├── hero/                  # Image principale accueil
├── profile/               # Photos de profil
├── gallery/               # Galerie médias
├── competitions/          # Photos compétitions
└── partners/              # Logos partenaires
```

### Organisation des images

| Dossier | Usage | Nommage |
|---------|-------|---------|
| `hero/` | Image page d'accueil | `timothy-lancer.jpg` |
| `profile/` | Portrait officiel | `timothy-portrait.jpg` |
| `gallery/` | Galerie médias | `YYYY-MM-DD-description.jpg` |
| `competitions/` | Photos palmarès | `YYYY-nom-competition.jpg` |
| `partners/` | Logos partenaires | `logo-nom.png` |

### Organisation du contenu

| Fichier | Usage |
|---------|-------|
| `content/pages/accueil.md` | Textes page d'accueil |
| `content/pages/a-propos.md` | Bio et parcours |
| `content/palmares/records.md` | Records personnels |
| `content/palmares/YYYY.md` | Résultats par année |
| `content/agenda/events.json` | Événements à venir |
| `content/medias/gallery.json` | Photos et vidéos |
| `content/decouvrir/partners.json` | Liens partenaires |

---

## Règles CSS & Styles (OBLIGATOIRE)

### Police

**Police officielle** : **Satoshi** (Fontshare)
- Fichiers dans `src/fonts/`
- Variable CSS : `--font-satoshi`
- NE JAMAIS utiliser une autre police sans autorisation

### Architecture CSS centralisée

**OBLIGATOIRE** : Toutes les valeurs de design sont dans `src/app/globals.css`.

```
src/app/globals.css     # UNIQUE fichier CSS - Design tokens + utilities
src/fonts/              # Polices locales (Satoshi)
```

### Variables CSS (Design Tokens)

**INTERDIT** : Utiliser des couleurs hex directement dans les composants.
**OBLIGATOIRE** : Utiliser les variables CSS définies dans `globals.css`.

| Variable | Usage |
|----------|-------|
| `--color-bg-primary` | Fond principal (#0F172A) |
| `--color-bg-secondary` | Fond secondaire (#1E293B) |
| `--color-text-primary` | Texte principal (#F8FAFC) |
| `--color-text-muted` | Texte atténué (#94A3B8) |
| `--color-primary` | Bleu principal (#3B82F6) |
| `--color-primary-light` | Bleu clair (#60A5FA) |
| `--color-accent` | Amber accent (#F59E0B) |
| `--color-accent-light` | Amber clair (#FBBF24) |
| `--color-success` | Vert succès (#22C55E) |
| `--color-danger` | Rouge erreur (#EF4444) |

### Règles de style

**DO (À faire)** :
- Utiliser Tailwind CSS pour tous les styles
- Utiliser la fonction `cn()` pour composer les classes
- Utiliser les classes utilitaires de `globals.css` : `.text-gradient`, `.icon-box`, `.focus-ring`
- Toujours utiliser les variables CSS pour les couleurs dans le CSS custom

**DON'T (À éviter)** :
- Couleurs hex hardcodées (`#3B82F6`) → Utiliser `var(--color-primary)`
- CSS inline sauf cas dynamiques (Recharts)
- Créer de nouveaux fichiers CSS
- Modifier les couleurs sans mettre à jour les variables

### Classes utilitaires disponibles

| Classe | Usage |
|--------|-------|
| `.text-gradient` | Dégradé bleu sur texte |
| `.text-gradient-accent` | Dégradé amber sur texte |
| `.icon-box` | Container 48x48 pour icônes |
| `.focus-ring` | Focus ring standardisé |
| `.gradient-overlay` | Overlay sombre sur images |
| `.card-interactive` | Card avec hover effect |
| `.animate-fade-up` | Animation fade + slide up |
| `.animate-fade-in` | Animation fade simple |

### Couleurs par catégorie

| Catégorie | Couleur | Variable |
|-----------|---------|----------|
| Primary (actions) | Bleu | `--color-primary` |
| Accent (highlights) | Amber | `--color-accent` |
| Success | Vert | `--color-success` |
| Danger | Rouge | `--color-danger` |
| Info (events) | Cyan | `--color-info` |
| Purple (passions) | Violet | `--color-category-purple` |
| Pink (Instagram) | Rose | `--color-category-pink` |

---

## Règles TypeScript

### Obligatoire

- `strict: true` dans tsconfig.json
- Pas de `any` explicite (utiliser `unknown` si nécessaire)
- Tous les paramètres de fonction doivent être typés
- Toutes les fonctions exportées doivent avoir un type de retour

### Conventions de nommage

| Type | Convention | Exemple |
|------|------------|---------|
| Composants | PascalCase | `HeroSection.tsx` |
| Hooks | camelCase + 'use' | `useScrollProgress.ts` |
| Utilitaires | camelCase | `formatDate.ts` |
| Types/Interfaces | PascalCase | `EventType`, `UserProps` |
| Constantes | SCREAMING_SNAKE_CASE | `MAX_ITEMS` |
| Fichiers CSS | kebab-case | `hero-section.css` |

---

## Règles de Code

### DO (À faire)

- Un composant = Un fichier = Une responsabilité
- Barrel exports (index.ts) pour chaque dossier
- Utiliser les imports absolus `@/...`
- Commenter uniquement le code complexe
- Utiliser Tailwind pour le styling
- Images optimisées avec next/image

### DON'T (À éviter)

- Variables déclarées mais jamais utilisées
- Fonctions définies mais jamais appelées
- Imports inutilisés
- Code mort ou commenté
- Fichiers orphelins non utilisés
- `console.log` en production
- CSS inline (sauf cas exceptionnels)

---

## Composants

### Structure d'un composant

```tsx
// 1. Imports
import { type FC } from 'react';
import { cn } from '@/lib/utils';

// 2. Types
interface ComponentProps {
  title: string;
  className?: string;
}

// 3. Composant
export const Component: FC<ComponentProps> = ({ title, className }) => {
  return (
    <div className={cn('base-styles', className)}>
      {title}
    </div>
  );
};
```

### Props optionnelles

- Toujours fournir des valeurs par défaut ou gérer undefined
- `className` doit toujours être optionnel et mergeable

---

## Git & Versioning

### Commits

Format: `type(scope): description`

Types:
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `style`: Changements de style (CSS, formatage)
- `refactor`: Refactoring sans changement fonctionnel
- `docs`: Documentation
- `chore`: Maintenance, dépendances

### Branches

- `main`: Production
- `develop`: Développement
- `feature/*`: Nouvelles fonctionnalités
- `fix/*`: Corrections

---

## Performance

- Lazy loading pour les images below the fold
- Composants dynamiques avec `next/dynamic` si nécessaire
- Éviter les re-renders inutiles (memo, useMemo, useCallback)
- Bundle size: surveiller avec `npm run build`

---

## SEO

Chaque page doit avoir:
- `title` unique (< 60 caractères)
- `description` (< 160 caractères)
- Open Graph meta tags
- Images avec alt text descriptif

---

## Tests (Future)

- Tests unitaires avec Jest/Vitest
- Tests de composants avec Testing Library
- Tests E2E avec Playwright (si nécessaire)

---

## Gestion des Résultats Sportifs

### Fichier de données

Les résultats de compétitions sont stockés dans `content/palmares/resultats.json`.

### Structure d'un résultat

```json
{
  "id": "YYYY-MM-DD-lieu-perf",
  "date": "YYYY-MM-DD",
  "competition": "Nom de la compétition",
  "lieu": "Ville",
  "perf": 50.70,
  "engin": "700g",
  "classement": 1,
  "isRecord": true,
  "notes": "Commentaire optionnel"
}
```

### Règle anti-doublon

**IMPORTANT** : Avant d'ajouter un nouveau résultat, TOUJOURS vérifier qu'il n'existe pas déjà en comparant :
- `date` + `lieu` + `perf`

L'ID est généré automatiquement : `{date}-{lieu}-{perf sans virgule}`

### Mise à jour des résultats

Quand Timothy fournit de nouveaux résultats par copier-coller :
1. Parser les données fournies
2. Vérifier les doublons (date + lieu + perf)
3. Ajouter uniquement les nouveaux résultats
4. Mettre à jour les records si nécessaire
5. Mettre à jour `metadata.lastUpdated`

### Affichage des résultats

- **Surlignage jaune** : Uniquement pour les 1ères places (classement === 1)
- Ne PAS surligner les records personnels (isRecord) en jaune
