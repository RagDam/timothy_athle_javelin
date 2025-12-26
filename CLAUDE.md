# Timothy Montavon - Site Personnel

## Contexte

**Timothy Montavon** - Athlète français, lanceur de javelot, catégorie Cadet (U18)
- Localisation : Poitiers / Le Mans, France
- Clubs : US Arnage (Sarthe) + Pôle Espoir Poitiers (sport-études)
- Palmarès : Double Champion de France Minime 2025, Record 50.70m (700g)
- Instagram : @timothy_athletisme

## Stack

Next.js 16 + TypeScript + Tailwind CSS + Framer Motion | Langue : Français

## Règles Critiques

- **JAMAIS** lancer `npm run dev` (l'utilisateur a `start-dev.bat`)
- **Commits unitaires** : 1 commit = 1 feature/fix, jamais grouper
- **HEIC → JPEG** : Convertir auto avec `heic-convert` (qualité 0.9)
- **Résultats sportifs** : Vérifier doublons avant ajout (date + lieu + perf)

## Architecture

```
src/app/           → Pages + globals.css (UNIQUE fichier CSS)
src/components/    → ui/ | layout/ | sections/ | features/
src/fonts/         → Satoshi (police officielle)
src/lib/           → Utilitaires (cn(), formatDate...)
content/           → pages/ | palmares/ | agenda/ | medias/
public/images/     → hero/ | profile/ | gallery/ | competitions/ | partners/
```

## Styles

**Police** : Satoshi uniquement (`--font-satoshi`)

**Couleurs** (TOUJOURS utiliser les variables, jamais hex) :
- `--color-bg-primary` / `--color-bg-secondary` → Fonds
- `--color-primary` / `--color-primary-light` → Bleu actions
- `--color-accent` / `--color-accent-light` → Amber highlights
- `--color-text-primary` / `--color-text-muted` → Textes

**Classes utilitaires** : `.text-gradient`, `.icon-box`, `.focus-ring`, `.card-interactive`

## Code

**TypeScript** : `strict: true`, pas de `any`, typer tous les params et retours

**Nommage** :
- Composants/Types : `PascalCase`
- Hooks : `useCamelCase`
- Constantes : `SCREAMING_SNAKE`

**Règles** :
- Imports absolus `@/...`
- Un composant = un fichier
- `cn()` pour composer les classes Tailwind
- `next/image` pour les images
- Pas de code mort, imports inutilisés, console.log

## Git

Format : `type(scope): description`
Types : `feat` | `fix` | `style` | `refactor` | `docs` | `chore`

## Résultats Sportifs

Fichier : `content/palmares/resultats.json`

```json
{
  "id": "YYYY-MM-DD-lieu-perf",
  "date": "YYYY-MM-DD",
  "competition": "Nom",
  "lieu": "Ville",
  "perf": 50.70,
  "engin": "700g",
  "classement": 1,
  "isRecord": true
}
```

- Surlignage jaune = 1ère place uniquement (pas les records)
- Anti-doublon : vérifier date + lieu + perf avant ajout
