# TaskFlow

Application web de gestion de projets collaboratifs realisee dans le cadre du module JavaScript / Express / MongoDB / Docker.

## Etat actuel

Ce depot contient uniquement l'initialisation du projet :

- structure de base du repository
- regles Git de l'equipe
- fichier `.gitignore`
- base `docker-compose.yml`
- dossiers `backend/` et `frontend/`

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
