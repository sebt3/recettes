# Recettes

Un petit projet pour stocker et afficher mes recettes de produits ménagers

> Warning: Aucune authentification ! Un middleware d'authentification (type authelia) sera requis 

## Technos
- Typescript
- eslint
- Prisma
- GraphQL
- Bulma
- Prometheus
- k8s & Docker

## Develop

First, build the front:
```shell
yarn front:install
yarn front:dev
```

Then same thing for the backend:
```shell
yarn install
yarn prisma:gen
yarn prisma:deploy
yarn dev
```
