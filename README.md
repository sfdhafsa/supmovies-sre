# SUPCONTENT / SUPMOVIES

Ce dépôt contient la copie applicative contrôlée de SUPCONTENT/SUPMOVIES utilisée pour le projet SRE/DevOps.

Le code de l'application et son guide détaillé se trouvent dans [`SUPCONTENT/`](SUPCONTENT/README.md). Consultez ce guide pour les fonctionnalités, les prérequis, la configuration et le démarrage local avec Docker.

## Dépôts du projet

| Dépôt | Rôle |
| --- | --- |
| [supmovies-sre](https://github.com/sfdhafsa/supmovies-sre) | Code source contrôlé de l'application |
| [movies-on-distribution](https://github.com/sfdhafsa/movies-on-distribution) | Projet SRE/DevOps : livraison, infrastructure, GitOps, observabilité et exploitation |

Pour le projet SRE, ce dépôt est la source de code applicative. Les futurs workflows de CI/CD construiront une image à partir d'un commit de ce dépôt. L'infrastructure et la configuration de déploiement sont maintenues dans [movies-on-distribution](https://github.com/sfdhafsa/movies-on-distribution) ; leur état d'avancement y est documenté.
