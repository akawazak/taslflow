# TaskFlow

Application web fullstack de gestion de projets collaboratifs.

## Structure cible

Ce depot suit une structure unique pour tout le projet :

- `backend/server.js`
- `backend/models/`
- `backend/routes/`
- `backend/middleware/`
- `frontend/index.html`
- `frontend/css/style.css`
- `frontend/js/api.js`
- `frontend/js/app.js`
- `frontend/js/auth.js`
- `frontend/js/projects.js`
- `frontend/js/tasks.js`
- `frontend/js/dashboard.js`
- `frontend/js/notifications.js`

## Fonction 1 en place

La branche `feature/authentification` contient uniquement la partie authentification :

- inscription
- connexion
- mot de passe hache avec `bcryptjs` et 10 rounds
- token JWT genere avec une cle definie dans `.env`
- token stocke dans `localStorage`
- restauration automatique de session
- deconnexion
- envoi automatique du token dans Axios
- middleware Express pour proteger les routes authentifiees

### Fichiers de la fonctionnalite 1

- `frontend/index.html` : ecran de connexion, inscription et session
- `frontend/css/style.css` : styles de l'authentification
- `frontend/js/api.js` : ajoute automatiquement `Authorization: Bearer <token>` a Axios
- `frontend/js/app.js` : initialisation de l'application
- `frontend/js/auth.js` : logique de connexion, inscription et deconnexion
- `backend/models/User.js` : schema utilisateur et hash bcryptjs
- `backend/routes/auth.js` : routes d'inscription et de connexion JWT
- `backend/middleware/auth.js` : protection des routes authentifiees
- `backend/server.js` : point d'entree backend et montage des routes auth

## Workflow Git

- `main` : branche stable
- `develop` : branche d'integration
- `feature/*` : une branche par fonctionnalite
- merge vers `develop` via Pull Request

## Fichiers d'environnement

- `.env` : valeurs locales seulement, jamais versionne

## Demarrage vise

L'objectif du projet est de pouvoir lancer l'application avec :

```bash
docker compose up --build
```

## Consigne equipe

- ne pas travailler directement sur `main`
- partir de `develop` pour creer une branche de travail
- garder une seule structure de projet pour toutes les fonctionnalites
