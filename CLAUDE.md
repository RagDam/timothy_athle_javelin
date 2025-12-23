# CLAUDE.md - Règles de Développement

> Ce fichier définit les règles et conventions pour Claude Code sur ce projet.

## Projet

**Site personnel** : Timothy Montavon - Athlète Javelot
**Stack** : Next.js 16 + TypeScript + Tailwind CSS + Framer Motion

---

## Architecture

### Structure des dossiers

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── api/               # API Routes
│   └── (pages)/           # Pages du site
├── components/
│   ├── ui/                # Composants génériques (Button, Card...)
│   ├── layout/            # Header, Footer, Navigation
│   ├── sections/          # Sections de pages (Hero, Stats...)
│   └── features/          # Composants métier par domaine
├── lib/                   # Utilitaires et helpers
├── hooks/                 # Custom hooks React
├── types/                 # Types TypeScript globaux
├── styles/                # CSS global et animations
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
