# Q-TRACK — Quality Management (React + TypeScript + Vite)

Courte description
: Q-TRACK est une base de projet web (React + TypeScript + Vite) dédiée à la gestion des processus qualité et des non-conformités pour les entreprises modernes.

Principales caractéristiques
- Interface React + TypeScript rapide avec Vite (HMR)
- Tailwind CSS et composants UI (Radix / shadcn)
- Intégration Supabase et React Query prévue
- Configuration ESLint / TypeScript prête à l'emploi

Rapide — démarrage (local)
Prérequis :
- Node.js >= 18
- npm (ou yarn/pnpm)

Commandes utiles :
```bash
# installer les dépendances
npm ci

# démarrer le serveur de dev
npm run dev

# builder pour production
npm run build

# vérifier/linter le projet
npm run lint

# preview du build
npm run preview
```

Structure du dossier
- public/ — fichiers statiques (favicon, og images)
- src/ — code source (React)
- quality-management-secure/ — configuration spécifique
- package.json — scripts & dépendances

Bonnes pratiques pour publication rapide
- Ajouter une licence (MIT fournie)
- Ajouter un fichier CHANGELOG et un tag Git (ex: v0.1.0)
- Activer CI (workflow fourni) pour lint et build
- Compléter README avec captures d'écran et guide d'API si nécessaire

Contribuer
- Ouvrir une issue pour signaler un bug ou une amélioration
- Faire une branche par feature et soumettre une pull request

Licence
Ce projet est sous licence MIT — voir le fichier LICENSE.