# SPECIFICATIONS.md - Recueil des Spécifications

> Document versionné traçant toutes les demandes et décisions du projet.

---

## Informations Projet

| Champ | Valeur |
|-------|--------|
| **Projet** | Site personnel athlète |
| **Client** | Timothy Montavon |
| **Sport** | Athlétisme - Javelot |
| **Localisation** | Le Mans / Arnage, France (actuellement à Poitiers) |
| **Version actuelle** | 0.1.0 |
| **Statut** | MVP en développement |

---

## Historique des Versions

### v0.1.0 - 2024-12-23 (Initial)
**Auteur**: Claude + Timothy

#### Décisions initiales
- Framework: Next.js 16 (App Router)
- Styling: Tailwind CSS v4
- Animations: Framer Motion
- Contenu: Fichiers Markdown
- Hébergement: Vercel (gratuit)
- Emails: Resend (100/jour gratuit)

#### Pages MVP définies
1. Accueil - Hero dynamique, stats, highlights
2. À propos - Bio, explication du javelot, parcours
3. Palmarès - Records personnels, résultats par année
4. Médias - Galerie photos, vidéos YouTube, embed Instagram
5. Agenda - Événements à venir, timeline
6. Découvrir - Liens écosystème (FFA, clubs, partenaires)
7. Contact - Formulaire fonctionnel + liens sociaux

#### Design validé
- Dark mode par défaut
- Palette: Slate (fond) + Blue (accent) + Amber (CTA)
- Police: Inter
- Mobile-first responsive

---

## Pages & Fonctionnalités

### Page Accueil
| Élément | Description | Statut |
|---------|-------------|--------|
| Hero Section | Image plein écran + titre animé | Planifié |
| Stats Section | Compteurs animés (records, médailles, etc.) | Planifié |
| Highlights | 3 cards mettant en avant les réussites | Planifié |
| CTA | Boutons vers Contact et Palmarès | Planifié |

### Page À Propos
| Élément | Description | Statut |
|---------|-------------|--------|
| Bio | Présentation personnelle | Planifié |
| Le Javelot | Explication du sport | Planifié |
| Parcours | Timeline carrière | Planifié |
| Photo profil | Portrait de Timothy | En attente (photo) |

### Page Palmarès
| Élément | Description | Statut |
|---------|-------------|--------|
| Records personnels | Meilleurs performances | Planifié |
| Résultats par année | Liste filtrable | Planifié |
| Médailles | Badges visuels | Planifié |

### Page Médias
| Élément | Description | Statut |
|---------|-------------|--------|
| Galerie photos | Grid avec lightbox | Planifié |
| Vidéos YouTube | Embed responsive | Planifié |
| Instagram embed | Widget simple | Planifié |

### Page Agenda
| Élément | Description | Statut |
|---------|-------------|--------|
| Prochain événement | Highlight avec countdown | Planifié |
| Timeline | Liste chronologique | Planifié |
| Événements passés | Archivage avec résultats | Planifié |

### Page Découvrir
| Élément | Description | Statut |
|---------|-------------|--------|
| FFA | Lien Fédération Française d'Athlétisme | Planifié |
| ESA | Entente Sarthe Athlétisme (ancien club) | En attente (URL) |
| EC Poitiers | Club actuel | En attente (URL) |
| Autres liens | À définir | Planifié |

### Page Contact
| Élément | Description | Statut |
|---------|-------------|--------|
| Formulaire | Nom, email, sujet, message | Planifié |
| API Resend | Envoi emails | Planifié |
| Liens sociaux | Instagram, etc. | En attente (liens) |

---

## Informations En Attente

### À fournir par Timothy

- [ ] **Photos**
  - Portrait/profil haute qualité
  - Photos de compétition
  - Photos d'entraînement

- [ ] **Palmarès**
  - Liste des résultats avec dates et lieux
  - Records personnels actuels

- [ ] **Liens**
  - Instagram: @...
  - Autres réseaux sociaux
  - URL ESA (Entente Sarthe Athlétisme)
  - URL EC Poitiers

- [ ] **Contact**
  - Email pour recevoir les messages du formulaire

- [ ] **Contenu texte**
  - Bio personnelle
  - Description de son parcours

### Décisions futures

- [ ] Nom de domaine (suggestions: timothy-montavon.fr, timothymontavon.com)
- [x] Compte Resend pour les emails ✅ Configuré
- [x] Compte Vercel pour l'hébergement ✅ Configuré

---

## Idées & Fonctionnalités Futures

### Newsletter / Notifications (En attente)
**Date**: 2025-12-27
**Statut**: En attente d'un domaine vérifié

**Description**: Permettre aux supporters de s'inscrire pour recevoir des notifications sur les résultats et compétitions à venir.

**Prérequis**:
- [ ] Achat d'un domaine personnalisé (ex: timothy-montavon.fr)
- [ ] Vérification du domaine sur Resend

**Options envisagées**:
1. Newsletter email via Resend (avec domaine vérifié)
2. Intégration Mailchimp (gratuit jusqu'à 500 contacts)
3. Buttondown (simple, gratuit jusqu'à 100 abonnés)

**Décision**: Reporter jusqu'à l'achat d'un domaine pour pouvoir envoyer depuis une adresse professionnelle (ex: newsletter@timothy-montavon.fr)

---

## Notes Techniques

### Variables d'environnement requises
```env
RESEND_API_KEY=         # Clé API Resend pour les emails
CONTACT_EMAIL=          # Email de réception des messages
NEXT_PUBLIC_SITE_URL=   # URL du site en production
```

### Dépendances principales
- next: ^16.1.1
- react: ^19.2.3
- tailwindcss: ^4
- framer-motion: (à installer)
- lucide-react: (à installer)
- gray-matter: (à installer)
- remark: (à installer)
- resend: (à installer)

---

## Changelog Détaillé

### 2024-12-23
- **[INIT]** Création du projet Next.js
- **[INIT]** Définition de l'architecture
- **[INIT]** Création CLAUDE.md et SPECIFICATIONS.md
- **[DECISION]** Framework: Next.js 16 + Tailwind v4
- **[DECISION]** Contenu géré via Markdown (MVP), Sanity possible plus tard
- **[DECISION]** Dark mode par défaut
- **[DECISION]** Page "Découvrir" ajoutée pour les liens partenaires
