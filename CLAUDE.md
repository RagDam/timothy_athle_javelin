# Timothy Montavon - Site Personnel

## Contexte

**Timothy Montavon** - Athlète français, lanceur de javelot, catégorie Cadet (U18)
- Localisation : Poitiers / Le Mans, France
- Clubs : US Arnage (Sarthe) + Pôle Espoir Poitiers (sport-études)
- Palmarès : Double Champion de France Minime 2025, Record 50.70m (700g)
- Instagram : @timothy_athletisme

## Stack

Next.js 16 + TypeScript + Tailwind CSS + Framer Motion | Langue : Français

## Services Externes (à maintenir à jour)

| Service | URL | Rôle | Variables .env |
|---------|-----|------|----------------|
| **Vercel** | vercel.com | Hébergement + déploiement | - |
| **Resend** | resend.com | Envoi emails contact | `RESEND_API_KEY`, `CONTACT_EMAIL` |
| **Vercel Blob** | vercel.com/storage | Stockage médias admin | `BLOB_READ_WRITE_TOKEN` |
| **NextAuth** | authjs.dev | Auth admin panel | `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `ADMIN_*` |

**Note** : Lors de l'ajout d'un nouveau service externe, documenter ici avec URL + variables requises.

## Règles Critiques

- **JAMAIS** lancer `npm run dev` (l'utilisateur a `start-dev.bat`)
- **Commits unitaires** : 1 commit = 1 feature/fix, jamais grouper
- **HEIC → JPEG** : Convertir auto avec `heic-convert` (qualité 0.9)
- **Résultats sportifs** : Vérifier doublons avant ajout (date + lieu + perf)
- **Services externes** : Si ajout d'un nouveau service/API, mettre à jour la section "Services Externes" + `.env.example`
- **Nouvelles idées/fonctionnalités** : Toujours documenter dans `SPECIFICATIONS.md` (section "Idées & Fonctionnalités Futures")
- **OBLIGATOIRE avant /clean-commit** : Vérifier l'API FFA pour l'année en cours et afficher un rapport de vérification :
  1. Récupérer TOUS les résultats de l'année via `https://www.athle.fr/ajax/fiche-athlete-resultats.aspx?seq=2035277&annee=YYYY`
  2. Comparer avec les fichiers locaux (`resultats.json` + `polyvalence.json`)
  3. Afficher dans le rapport :
     - ✅ Nombre total de résultats FFA (année courante)
     - ✅ Nombre de résultats locaux (grep `"date": "YYYY-"`)
     - ✅ Liste des résultats manquants avec date/épreuve/perf/lieu (ou "Aucun")
     - ✅ Note : L'API FFA compte séparément séries/finales et épreuves composant les combinés

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

### Javelot
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

### Polyvalence (autres disciplines)
Fichier : `content/palmares/polyvalence.json`

Disciplines : Sprint, Demi-fond, Relais, Cross, Haies, Longueur, Hauteur, Perche, Poids, Disque, Triathlon, Combinés

### API FFA (source officielle)
URL : `https://www.athle.fr/ajax/fiche-athlete-resultats.aspx?seq=2035277&annee=YYYY`

Remplacer `YYYY` par l'année souhaitée (2020-2025). Cette API retourne tous les résultats officiels FFA de l'athlète.

**Règles** :
- Surlignage jaune = 1ère place uniquement (pas les records)
- Anti-doublon : vérifier date + lieu + perf avant ajout

## Agenda & Événements

Fichier : `content/agenda/events.json`

**Niveaux d'importance** (COHÉRENCE OBLIGATOIRE entre EventCard, MiniCalendar et events.json) :
| Valeur | Label | Exemples |
|--------|-------|----------|
| `local` | Départemental | Championnats départementaux |
| `regional` | Régional | Championnats régionaux, interclubs |
| `national` | National | Stages FFA, championnats nationaux qualificatifs |
| `major` | Championnat de France | France UGSEL, Coupe de France des Ligues |

**Règle** : Toute nouvelle valeur d'importance doit être ajoutée dans :
1. `EventCard.tsx` → type `Event['importance']` + `importanceLabels`
2. `MiniCalendar.tsx` → `IMPORTANCE_COLORS` + priorité + légende

## Pages du site

| Route | Description |
|-------|-------------|
| `/` | Accueil |
| `/a-propos` | Parcours et présentation |
| `/palmares` | Résultats sportifs |
| `/medias` | Photos et vidéos (Instagram, galerie) |
| `/presse` | Articles de presse et interviews |
| `/agenda` | Calendrier des compétitions |
| `/decouvrir` | Découverte du javelot |
| `/contact` | Formulaire de contact |

## Articles de Presse & Interviews

Fichier : `content/medias/presse.json` (affiché sur `/presse`)

```json
{
  "articles": [{
    "id": "source-YYYY-MM-DD",
    "title": "Titre de l'article",
    "source": "Nom du média",
    "date": "YYYY-MM-DD",
    "url": "https://...",
    "excerpt": "Court résumé (optionnel)",
    "tag": "Nom de la compétition (optionnel)"
  }],
  "interviews": [{
    "id": "media-YYYY-MM-DD",
    "title": "Titre de l'interview",
    "media": "Nom du média",
    "date": "YYYY-MM-DD",
    "url": "https://... (MP3/vidéo directe)",
    "sourceUrl": "https://... (page source, optionnel)",
    "type": "video|audio|article"
  }]
}
```

**Règles** :
- Anti-doublon : vérifier URL avant ajout
- Tri automatique par date (plus récent en premier) dans le code
- ID format : `source-YYYY-MM-DD` (ex: `ouest-france-2025-06-17`)
