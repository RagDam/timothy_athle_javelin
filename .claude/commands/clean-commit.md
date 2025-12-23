# Clean Commit - Quality Check & Push

Effectue un audit qualité complet avant de commiter et pousser vers GitHub.

## Checklist à vérifier

### 1. Règles CLAUDE.md
- [ ] Aucun lancement de serveur dans le code
- [ ] Commits unitaires (une seule feature/fix)

### 2. Qualité du code TypeScript
- [ ] Pas de variables déclarées mais non utilisées
- [ ] Pas de fonctions définies mais jamais appelées
- [ ] Pas d'imports inutilisés
- [ ] Pas de `any` explicite (utiliser `unknown`)
- [ ] Tous les paramètres de fonction sont typés
- [ ] Pas de `console.log` en production

### 3. Pas de valeurs hardcodées
- [ ] URLs en configuration (`src/config/`)
- [ ] Clés API en variables d'environnement (`.env`)
- [ ] Textes récurrents en constantes
- [ ] Pas de chemins absolus hardcodés

### 4. Architecture et structure
- [ ] Structure des dossiers respectée (`src/app`, `src/components`, etc.)
- [ ] Barrel exports (index.ts) présents dans chaque dossier de composants
- [ ] Imports absolus `@/...` utilisés
- [ ] Un composant = Un fichier

### 5. Fichiers temporaires et inutiles
- [ ] Pas de fichiers `.tmp`, `.bak`, `.old`
- [ ] Pas de scripts de test temporaires
- [ ] Pas de fichiers `test.ts`, `debug.ts` oubliés
- [ ] Pas de fichiers de configuration IDE personnels non ignorés
- [ ] `.gitignore` à jour

### 6. Documentation (CONTENU vérifié, pas juste l'existence)
- [ ] `README.md` : description du projet correspond au site actuel
- [ ] `README.md` : stack technique à jour (Next.js, TypeScript, Tailwind, etc.)
- [ ] `README.md` : instructions d'installation correctes
- [ ] `README.md` : liste des pages/fonctionnalités correspond au site
- [ ] `CLAUDE.md` : règles importantes à jour
- [ ] `CLAUDE.md` : structure des dossiers correspond à la réalité
- [ ] `CLAUDE.md` : conventions de nommage respectées dans le code
- [ ] `content/` : données JSON/MD à jour avec les infos affichées

### 7. Git
- [ ] Pas de fichiers sensibles (`.env`, credentials)
- [ ] Pas de `node_modules` ou `.next` dans le commit
- [ ] Message de commit descriptif et unitaire

---

## Instructions d'exécution

### Étape 1 : Vérifications automatiques
Exécuter les recherches suivantes :
- `git status` : fichiers modifiés
- `grep console.log` dans `src/`
- `grep ": any"` dans `src/`
- `glob **/*.{tmp,bak,old}` : fichiers temporaires
- `glob **/test.ts` et `**/debug.ts` : fichiers de debug

### Étape 2 : Vérifications manuelles
- Lire `README.md` et vérifier la cohérence avec le projet
- Lire `CLAUDE.md` et vérifier les règles
- Comparer la structure documentée vs la structure réelle

### Étape 3 : Lister les problèmes
Afficher tous les problèmes trouvés avec leur localisation exacte.

### Étape 4 : Proposer les corrections
Suggérer ou appliquer les fixes nécessaires.

### Étape 5 : Confirmation utilisateur
Attendre validation explicite avant de commiter.

### Étape 6 : Commits unitaires
Créer UN commit par changement logique distinct.

### Étape 7 : Push vers GitHub
Pousser après confirmation.

---

## RAPPORT DE PREUVE OBLIGATOIRE

**IMPORTANT** : Avant de proposer le commit, afficher un rapport de preuve complet au format suivant :

```
╔══════════════════════════════════════════════════════════════╗
║                    RAPPORT D'AUDIT QUALITÉ                   ║
╠══════════════════════════════════════════════════════════════╣

### 1. RÈGLES CLAUDE.md
| Règle                    | Statut | Preuve                    |
|--------------------------|--------|---------------------------|
| Pas de npm run dev       | ✅/❌  | [fichier:ligne] ou "RAS"  |
| Commits unitaires        | ✅/❌  | X commits proposés        |

### 2. QUALITÉ TYPESCRIPT
| Check                    | Statut | Preuve                    |
|--------------------------|--------|---------------------------|
| console.log              | ✅/❌  | X trouvés : [liste]       |
| any explicite            | ✅/❌  | X trouvés : [liste]       |
| imports inutilisés       | ✅/❌  | X trouvés : [liste]       |

### 3. VALEURS HARDCODÉES
| Check                    | Statut | Preuve                    |
|--------------------------|--------|---------------------------|
| URLs                     | ✅/❌  | [liste des URLs trouvées] |
| Clés API                 | ✅/❌  | [liste ou RAS]            |

### 4. ARCHITECTURE
| Check                    | Statut | Preuve                    |
|--------------------------|--------|---------------------------|
| Structure dossiers       | ✅/❌  | [dossiers vérifiés]       |
| Barrel exports           | ✅/❌  | X fichiers index.ts       |
| Imports @/               | ✅/❌  | Vérification OK/KO        |

### 5. FICHIERS TEMPORAIRES
| Check                    | Statut | Preuve                    |
|--------------------------|--------|---------------------------|
| .tmp/.bak/.old           | ✅/❌  | X trouvés : [liste]       |
| test.ts/debug.ts         | ✅/❌  | X trouvés : [liste]       |
| .gitignore               | ✅/❌  | Contenu vérifié           |

### 6. DOCUMENTATION (CONTENU)
| Document                 | Statut | Vérifications effectuées  |
|--------------------------|--------|---------------------------|
| README.md                | ✅/❌  | - Description: OK/KO      |
|                          |        | - Stack: OK/KO            |
|                          |        | - Pages listées: OK/KO    |
| CLAUDE.md                | ✅/❌  | - Règles: OK/KO           |
|                          |        | - Structure: OK/KO        |
| content/*.json           | ✅/❌  | - Données à jour: OK/KO   |

### 7. GIT
| Check                    | Statut | Preuve                    |
|--------------------------|--------|---------------------------|
| Fichiers sensibles       | ✅/❌  | .env dans .gitignore: OK  |
| node_modules/.next       | ✅/❌  | Dans .gitignore: OK       |

╠══════════════════════════════════════════════════════════════╣
║ RÉSULTAT GLOBAL : ✅ PRÊT À COMMITER / ❌ CORRECTIONS REQUISES ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Format du commit

```
type(scope): description courte

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

Types : `feat`, `fix`, `style`, `refactor`, `docs`, `chore`
