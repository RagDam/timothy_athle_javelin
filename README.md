# Timothy Montavon - Site Personnel

Site web personnel de Timothy Montavon, jeune athlète français spécialisé dans le lancer de javelot.

## Projet

**Athlète** : Timothy Montavon (15 ans)
**Discipline** : Lancer de javelot
**Club** : ESA 72 / US Arnage

### Records personnels
- 🥇 **50.70m** (javelot 700g) - Coulaines, Décembre 2025
- 🥈 **50.16m** (javelot 600g) - Mayenne, Juin 2025
- 🥉 **31.88m** (javelot 500g) - Arnage, Avril 2023

### Palmarès
- Champion de France UGSEL 2025
- Vainqueur Coupe de France des Ligues 2025

## Stack technique

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS v4
- **Police** : Satoshi (Fontshare)
- **Animations** : Framer Motion
- **Graphiques** : Recharts

## Pages du site

| Page | Description |
|------|-------------|
| `/` | Accueil avec Hero et présentation |
| `/palmares` | Résultats, records et graphique de progression |
| `/a-propos` | Biographie et parcours |
| `/agenda` | Événements et compétitions à venir |
| `/medias` | Galerie photos et vidéos |
| `/decouvrir` | Liens partenaires et fédérations |
| `/contact` | Formulaire de contact |

## Structure du projet

```
src/
├── app/           # Pages Next.js (App Router)
├── components/    # Composants React
│   ├── ui/        # Composants génériques
│   ├── layout/    # Header, Footer
│   ├── sections/  # Sections de pages
│   └── features/  # Composants métier
├── config/        # Configuration centralisée
├── lib/           # Utilitaires
└── types/         # Types TypeScript

content/           # Contenu JSON/Markdown
├── palmares/      # Résultats sportifs
├── agenda/        # Événements
└── medias/        # Galerie
```

## Installation

```bash
# Cloner le repo
git clone https://github.com/RagDam/timothy_athle_javelin.git

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build production
npm run build
```

## Développement

Le serveur de développement se lance via `start-dev.bat` (Windows).

Voir [CLAUDE.md](./CLAUDE.md) pour les conventions de code et règles du projet.

## Auteur

Développé avec Claude Code pour Timothy Montavon.
