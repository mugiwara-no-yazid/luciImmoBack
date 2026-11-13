# API Immobilier

API REST de gestion de biens immobiliers (annonces, photos, commentaires, favoris, administration), construite avec **Node.js**, **Express 5** et **Sequelize** sur **MariaDB**.

Référence complète des routes et de leurs réponses : voir [`API.md`](./API.md).

## Stack

| Élément | Technologie |
|---|---|
| Runtime / framework | Node.js, Express 5 |
| ORM / base | Sequelize 6, MariaDB (`mariadb`) |
| Authentification | JWT (`jsonwebtoken`, validité 24 h), mots de passe hashés avec `bcrypt` |
| E-mail | `nodemailer` (confirmation de compte, envoi pas encore actif) |
| Dev | `nodemon` |

## Installation

```bash
npm install
```

### Base de données

La connexion est définie dans `source/db/sequilize.js` :

- base : `immobilier`, hôte `localhost`, utilisateur `root`, sans mot de passe
- dialecte : `mariadb`, fuseau `Etc/GMT-2`

Crée la base `immobilier` avant le premier lancement : les tables sont créées automatiquement au démarrage (`sequelize.sync()`).

### Lancement

```bash
npm start     # nodemon app.js
```

Le serveur écoute sur `http://localhost:2000`. `GET /` renvoie `"hello world"`.

## Structure

```
.
├── app.js                      # Point d'entrée : middlewares, routes, 404
├── auth
│   ├── auth.js                 # Middleware JWT (non branché pour l'instant)
│   └── privatekey.js           # Clé de signature JWT
└── source
    ├── db/sequilize.js         # Connexion, modèles, associations, initDb()
    ├── models                  # Utilisateurs, Biens_Imobiliers, Medias_Biens,
    │                           # Commentaires, Favoris, Paiements, Notes
    └── routes                  # Un fichier par endpoint
```

Chaque fichier de `source/routes` exporte une fonction qui reçoit `app` et déclare sa route.

## Modèle de données

| Table | Champs principaux |
|---|---|
| `Utilisateurs` | id_utilisateur, nom, email (unique), mot_de_passe, telephone, photo_profil, role, code_verification, etat, date_inscription |
| `Biens_Imobiliers` | id_bien, id_proprietaire, titre, description, type_bien, adresse, ville, note, statut, prix, surface, nb_pieces, date_ajout |
| `Medias_Biens` | id_image, id_bien, url_image, is_principale |
| `Commentaires` | id_commentaire, id_bien, id_utilisateur, contenu, date_post |
| `Favoris` | id_favori, id_utilisateur, id_bien, date_ajout |
| `Paiements` | id_paiement, id_locataire, id_bien, montant, moyen_paiement, statut, reference, date_paiement (aucune route) |
| `Notes` | id_bien, id_proprietaire, valeur (aucune route) |

Relations : un utilisateur possède des biens ; un bien a des photos, des commentaires et des favoris ; la suppression d'un utilisateur ou d'un bien supprime ses dépendances (`ON DELETE CASCADE`).

## Sécurité : à traiter avant la mise en production

- Appliquer le middleware `auth/auth.js` sur les routes sensibles et protéger les routes `/api/admin/*` par rôle.
- Sortir les secrets du code (clé JWT, accès base de données, identifiants Gmail) vers des variables d'environnement.
- Ne plus renvoyer `mot_de_passe` ni `code_verification` dans les réponses.
- Restreindre CORS (`origin: '*'`) au domaine du front.

La liste complète des points à corriger est à la fin de [`API.md`](./API.md).

## Auteur

SOUMANOU Yazid, [github.com/mugiwara-no-yazid](https://github.com/mugiwara-no-yazid)
