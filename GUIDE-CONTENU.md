# Guide de Gestion du Contenu

> Ce guide t'explique comment ajouter et modifier le contenu de ton site.

---

## Structure des Fichiers

```
Timothy_AthleAndJavelin/
├── public/images/           ← TES IMAGES ICI
│   ├── hero/               ← Image principale page d'accueil
│   ├── profile/            ← Photos de profil/portrait
│   ├── gallery/            ← Photos pour la galerie médias
│   ├── competitions/       ← Photos de compétitions
│   └── partners/           ← Logos partenaires (FFA, clubs)
│
└── content/                 ← TES TEXTES ICI
    ├── pages/              ← Contenu des pages principales
    │   ├── accueil.md      ← Page d'accueil
    │   └── a-propos.md     ← Page À propos
    ├── palmares/           ← Résultats sportifs
    │   ├── records.md      ← Tes records personnels
    │   └── 2024.md         ← Résultats par année
    ├── agenda/
    │   └── events.json     ← Événements à venir
    ├── medias/
    │   └── gallery.json    ← Métadonnées galerie
    └── decouvrir/
        └── partners.json   ← Liens partenaires
```

---

## Comment Ajouter des Images

### 1. Image du Hero (Page d'accueil)

**Où la mettre** : `public/images/hero/`
**Nom suggéré** : `timothy-lancer.jpg`
**Taille recommandée** : 1920x1080 pixels minimum (format paysage)
**Format** : JPG ou WebP

### 2. Photo de Profil

**Où la mettre** : `public/images/profile/`
**Nom suggéré** : `timothy-portrait.jpg`
**Taille recommandée** : 800x800 pixels (carré)
**Format** : JPG ou WebP

### 3. Photos pour la Galerie

**Où les mettre** : `public/images/gallery/`
**Nommage** : `YYYY-MM-DD-description.jpg`
**Exemple** : `2024-06-15-championnats-france.jpg`
**Taille recommandée** : 1920x1280 pixels

### 4. Logos Partenaires

**Où les mettre** : `public/images/partners/`
**Nommage** : `logo-nom.png`
**Exemple** : `logo-ffa.png`, `logo-esa.png`
**Format** : PNG avec fond transparent de préférence

---

## Comment Modifier les Textes

### Format Markdown (.md)

Les fichiers `.md` utilisent le format Markdown. C'est simple :

```markdown
# Titre principal
## Sous-titre
### Petit titre

Texte normal en paragraphe.

**Texte en gras**
*Texte en italique*

- Liste à puces
- Élément 2
- Élément 3

1. Liste numérotée
2. Élément 2

[Texte du lien](https://url.com)
```

### Modifier ta Bio (page À propos)

1. Ouvre `content/pages/a-propos.md`
2. Remplace les zones `<!-- TODO: ... -->` par ton texte
3. Sauvegarde

### Ajouter un Résultat au Palmarès

1. Ouvre `content/palmares/2024.md` (ou crée `2025.md` pour l'année suivante)
2. Ajoute une ligne dans le tableau :

```markdown
| 2024-06-15 | Championnats France | Paris | 65.50 m | 3ème |
```

### Mettre à jour tes Records

1. Ouvre `content/palmares/records.md`
2. Modifie le tableau avec tes vraies performances

---

## Comment Modifier les Fichiers JSON

### Format JSON

Les fichiers `.json` ont un format strict. Respecte bien les virgules et guillemets :

```json
{
  "clé": "valeur",
  "nombre": 123,
  "liste": ["a", "b", "c"]
}
```

### Ajouter un Événement à l'Agenda

1. Ouvre `content/agenda/events.json`
2. Ajoute un nouvel objet dans le tableau `events` :

```json
{
  "id": "championnats-2025",
  "title": "Championnats de France 2025",
  "date": "2025-07-15",
  "location": {
    "venue": "Stade Charléty",
    "city": "Paris",
    "country": "France"
  },
  "type": "competition",
  "importance": "major",
  "description": "Championnats de France Elite",
  "status": "upcoming"
}
```

### Ajouter une Photo à la Galerie

1. Place l'image dans `public/images/gallery/`
2. Ouvre `content/medias/gallery.json`
3. Ajoute un objet dans `photos` :

```json
{
  "id": "photo-championnats-2024",
  "src": "/images/gallery/2024-06-15-championnats.jpg",
  "alt": "Timothy au lancer - Championnats 2024",
  "category": "competitions",
  "date": "2024-06-15",
  "featured": true,
  "width": 1920,
  "height": 1280
}
```

---

## Workflow : Ajouter du Contenu

### Étape par étape

1. **Prépare tes fichiers** (images, textes)
2. **Place les images** dans le bon dossier `public/images/...`
3. **Modifie les fichiers** `.md` ou `.json` dans `content/`
4. **Vérifie** sur http://localhost:3000 que ça fonctionne
5. **Commit** les changements avec Git

### Avec Claude Code

Tu peux aussi me demander :
- "Ajoute cette photo à ma galerie"
- "Mets à jour mon palmarès avec ce résultat"
- "Modifie ma bio avec ce texte"

Je m'occupe de tout !

---

## Checklist : Ce qu'il te faut

### Images à fournir

- [ ] **Hero** : 1 photo de toi en action (lancer)
- [ ] **Profil** : 1 portrait officiel
- [ ] **Galerie** : Quelques photos de compétitions/entraînement
- [ ] **Logos** : FFA, ESA, EC Poitiers (si disponibles)

### Textes à écrire

- [ ] **Bio** : Ta présentation personnelle
- [ ] **Parcours** : Ton histoire sportive
- [ ] **Records** : Tes meilleures performances
- [ ] **Résultats** : Liste de tes compétitions

### Informations à fournir

- [ ] **Réseaux sociaux** : Ton @ Instagram, etc.
- [ ] **Email** : Pour le formulaire de contact
- [ ] **URLs clubs** : Site ESA et EC Poitiers
