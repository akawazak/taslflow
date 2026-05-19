# TaskFlow

Application web de gestion de projets collaboratifs realisee dans le cadre du module JavaScript / Express / MongoDB / Docker.

## Technologies:
Frontend: HTML,CSS,JS<br>
Backend: Express,JS<br>
Autres: MongoDB,Docker
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

## L'équipe

<table>
  <tr> 
    <th>Nom</th>
    <th>Fonctionnalités</th>
  </tr>
  <tr> 
    <td>Riyad MARRAKCHI</td>
    <td>Projets/Dashboard</td>
  </tr>
    <tr> 
    <td>Abdellah ELKARKRI </td>
    <td>Activité/Notifications</td>
  </tr>
  <tr> 
    <td>Mohamed EL HOUAOURI</td>
    <td>Filtrage/Brouillons</td>
  </tr>
  <tr>
    <td>Akram HAISSANE</td>
    <td>Authentification/Assignation</td>
  </tr>
  <tr>
    <td>Nasre-eddine EL HERAICHI</td>
    <td>Taches/Members</td>
  </tr>
</table>
