# TaskFlow

Application web de gestion de projets collaboratifs realisee dans le cadre du module JavaScript / Express / MongoDB / Docker.

## Etat actuel

Ce depot contient la base du projet et la branche `feature/authentification` :

- structure de base du repository
- regles Git de l'equipe
- fichier `.gitignore`
- base `docker-compose.yml`
- dossiers `backend/` et `frontend/`
- authentification utilisateur
- stockage du token dans `localStorage`
- restauration de session
- envoi automatique du token JWT dans Axios

### Fichiers de la fonctionnalite 1

- `frontend/index.html` : formulaire de connexion, inscription et affichage de session
- `frontend/css/style.css` : styles de la page d'authentification
- `frontend/js/token.js` : ajoute automatiquement `Authorization: Bearer <token>` a Axios
- `frontend/js/auth.js` : gere connexion, inscription, restauration de session et deconnexion
- `backend/models/User.js` : schema utilisateur et hash bcryptjs
- `backend/routes/auth.js` : routes d'inscription et de connexion JWT
- `backend/middleware/auth.js` : protection des routes authentifiees

Le vrai code metier sera ajoute ensuite par l'equipe, fonctionnalite par fonctionnalite.

## Workflow Git

- `main` : branche stable
- `develop` : branche d'integration
- une branche par fonctionnalite
- merge vers `develop` uniquement via Pull Request
- chaque membre doit avoir ses propres commits visibles
- messages de commit au format Conventional Commits : `feat:`, `fix:`, `docs:`, `refactor:`

## Fichiers d'environnement

- `.env` : contient les vraies valeurs locales et ne doit jamais etre versionne

## Demarrage vise

L'objectif du projet est de pouvoir lancer l'application avec :

```bash
docker compose up --build
```

## Structure

- `backend/`
- `frontend/`

## Consigne equipe

- ne pas travailler directement sur `main`
- partir de `develop` pour creer une branche de travail
- ne pas mettre de secrets dans GitHub
- garder MongoDB dans Docker conformement a la consigne du PDF
