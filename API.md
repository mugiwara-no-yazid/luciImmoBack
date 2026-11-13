# Référence de l'API : Immobilier

Document destiné au développeur front. Il décrit chaque route, ce qu'elle attend et ce qu'elle renvoie **telle qu'elle est codée aujourd'hui**.

- **Base URL** : `http://localhost:2000`
- **Format** : JSON (`Content-Type: application/json`)
- **CORS** : toutes origines, méthodes `GET`, `POST`, `PUT`, `DELETE`

## Lire cette section en premier

1. **Aucune route n'est protégée pour l'instant.** Le middleware `auth/auth.js` existe mais n'est branché sur aucune route. Envoie quand même le token (`Authorization: Bearer <token>`), ce sera exigé plus tard.
2. **Teste toujours `success` dans le corps, pas seulement le statut HTTP.** Certains cas d'erreur renvoient un statut `200` avec `success: false` (mot de passe incorrect au login, par exemple).
3. **La forme des réponses n'est pas uniforme.** Selon la route, `success` ou `data` peuvent être absents. Chaque route ci-dessous indique ce qui existe réellement.
4. **Les réponses utilisateur contiennent `mot_de_passe` (hash) et `code_verification`.** Ne les affiche ni ne les stocke côté front. Ils seront retirés côté back.

### Format général

Succès :

```json
{ "message": "…", "success": true, "data": { } }
```

Erreur :

```json
{ "message": "…", "success": false, "data": { } }
```

| Statut | Signification |
|---|---|
| `400` | Données invalides (validation Sequelize, code incorrect, rôle invalide) |
| `401` | Action non autorisée |
| `404` | Ressource introuvable |
| `500` | Erreur serveur |

Une URL inconnue renvoie `404` avec un simple texte JSON : `"Impossible de trouver cette page essayer une autre Url..."`.

### Valeurs autorisées (enums)

| Champ | Valeurs |
|---|---|
| `role` | `admin`, `proprietaire`, `locataire` |
| `etat` (utilisateur) | `actif`, `suspendu`, `bannis` |
| `type_bien` | `appartement`, `maison`, `studio`, `terrain` |
| `statut` (bien) | `disponible`, `réservé`, `occupé` |

### Objets renvoyés

**Utilisateur**

```json
{
  "id_utilisateur": 1,
  "nom": "Yazid",
  "email": "a@b.com",
  "mot_de_passe": "<hash, à ignorer>",
  "telephone": "97000000",
  "photo_profil": "https://…",
  "role": "proprietaire",
  "code_verification": "<à ignorer>",
  "etat": "actif",
  "date_inscription": "2026-11-13T10:00:00.000Z"
}
```

**Bien**

```json
{
  "id_bien": 1,
  "id_proprietaire": 1,
  "titre": "Villa à Cotonou",
  "description": "…",
  "type_bien": "maison",
  "adresse": "Sekandji",
  "ville": "Cotonou",
  "note": 0,
  "statut": "disponible",
  "prix": 150000,
  "surface": 120,
  "nb_pieces": 4,
  "date_ajout": "…",
  "updatedAt": "…"
}
```

**Media** (photo d'un bien) : `{ "id_image": 1, "id_bien": 1, "url_image": "https://…", "is_principale": true }`

**Commentaire** : `{ "id_commentaire": 1, "id_bien": 1, "id_utilisateur": 2, "contenu": "…", "date_post": "…" }`

**Favori** : `{ "id_favori": 1, "id_utilisateur": 2, "id_bien": 1, "date_ajout": "…" }`

---

## Authentification

### `POST /api/auth/register`

Crée un compte. Le compte est créé avec `etat: "suspendu"` et doit être confirmé.

**Body**

| Champ | Requis | Remarque |
|---|---|---|
| `nom` | oui | |
| `email` | oui | unique, format email |
| `mot_de_passe` | oui | hashé côté serveur |
| `role` | oui | `locataire` ou `proprietaire` uniquement (`admin` refusé) |
| `telephone` | non | |
| `photo_profil` | non | URL (chaîne) |

**Réponses**

| Statut | Corps |
|---|---|
| `200` | `{ message: "l'utilisateur <nom> à été créer", data: <Utilisateur>, success: true }` |
| `400` | rôle invalide : `{ message: "Votre role ne peut etre que \"locataire\" ou \"proprietaire\"", success: false }` |
| `400` | email déjà pris : `{ message: "Ce mail est deja pris.", data, success: false }` |
| `400` | autre erreur de validation : `{ message: "Vous avez soumis des information incorrecte. Veuillez reesayer.", data, success: false }` |
| `500` | `{ message: "L'utilisateur n'as pas été ajouté. Veuillez reesayer plus tard...", data, success: false }` |

> L'e-mail de confirmation n'est **pas réellement envoyé** pour l'instant (le code prépare le message mais n'appelle jamais l'envoi). Le lien prévu est `localhost:3000/api/auth/confirm/<email>/<code>`.

### `POST /api/auth/login`

**Body** : `email`, `mot_de_passe`

| Statut | Corps |
|---|---|
| `200` | `{ message: "Utilisateur connecté", user: <Utilisateur>, token: "<JWT 24h>", success: true }` |
| `404` | email inconnu : `{ message: "Les identifiants entré sont incorecte", success: false }` |
| **`200`** | mot de passe faux : `{ message: "Le mot de passe entré est incorrecte", success: false }` |
| `500` | `{ message: "Le serveur est indisponible…", e, success: false }` |

Attention : ici l'utilisateur est dans `user` (pas `data`). L'état du compte n'est pas vérifié : un compte `suspendu` peut se connecter. À toi de tester `user.etat` côté front en attendant.

### `POST /api/auth/confirm/:mail/:codeverif`

Active le compte (`etat` passe à `actif`). C'est un **POST**, pas un GET : la page ouverte depuis le lien du mail doit appeler cette route.

| Statut | Corps |
|---|---|
| `200` | `{ message: "Le compte de l'utilisateur a été activé", data: [1], success: true }` |
| `404` | `{ message: "L'utilisateur avec le mail : <mail> est introuvable", success: false }` |
| `400` | `{ message: "Le code de verification est incorrecte", success: false }` |

---

## Utilisateurs

### `PUT /api/users/:id`

Modifie le profil. `:id` = `id_utilisateur`. **Body** : les champs à modifier.

| Statut | Corps |
|---|---|
| `200` | `{ message: "Les information ont été modifier", user: <Utilisateur>, success: true }` |
| `404` | `{ message: "Cet utilisateur n'existe pas", success: false }` |
| `400` | `{ message: <détail>, data, success: false }` (validation, email déjà pris) |

Utilisateur dans `user` (pas `data`). Ne modifie pas le mot de passe par cette route : il ne serait pas hashé.

### `DELETE /api/users/:id`

| Statut | Corps |
|---|---|
| `200` | `{ message: "L'utilisateur avec l'email <email> a bien été supprimé.", data: <Utilisateur>, success: true }` |
| `404` | `{ message: "Cet utilisateur n'existe pas", success: false }` |

La suppression entraîne celle de ses biens, commentaires et favoris (cascade).

---

## Biens immobiliers

### `GET /api/biens`

Liste de tous les biens, avec leurs photos.

```json
{
  "message": "La liste des biens enregistré a bien été envoyer",
  "success": true,
  "data": [ { "...Bien": "", "photos": [ <Media> ] } ]
}
```

Liste vide : `data: []` avec le message `"Il n'y a aucun bien enregistré sur le site"`. Pas de pagination ni de filtre.

### `GET /api/biens/:id`

Détail d'un bien avec ses photos et ses commentaires (chaque commentaire embarque le `nom` de l'auteur).

```json
{
  "message": "Le bien a bien été envoyé",
  "success": true,
  "data": {
    "...Bien": "",
    "photos": [ <Media> ],
    "Commentaires": [ { "...Commentaire": "", "<objet auteur>": { "nom": "Awa" } } ]
  }
}
```

La clé exacte de l'objet auteur et de la liste de commentaires est à vérifier avec une vraie réponse (probablement `Commentaires` et `Utilisateur`). Inexistant : `404` `{ message: "Ce bien n'existe pas", success: false }`.

### `POST /api/biens`

**Body**

| Champ | Requis |
|---|---|
| `id_proprietaire` | oui (doit être un utilisateur de rôle `proprietaire`) |
| `titre` | oui |
| `type_bien` | oui |
| `adresse` | oui |
| `ville` | oui |
| `statut` | oui (pas de valeur par défaut) |
| `prix` | oui |
| `description`, `surface`, `nb_pieces` | non |

| Statut | Corps |
|---|---|
| `200` | `{ message: "Le bien a été ajouter avec succès", data: <Bien> }` (**pas de `success`**) |
| `404` | `{ message: "Cet utilisateur n'existe pas", success: false }` |
| `401` | `{ message: "Vous n'etes pas autoriser a effectuer cette action", success: false }` |
| `400` | `{ message: <détail>, data, success: false }` |

### `PUT /api/biens/:id`

**Body** : champs à modifier.

| Statut | Corps |
|---|---|
| `200` | `{ message: "Les informations du bien ont été modifier", data: <Bien> }` (**pas de `success`**) |
| `404` | `{ message: "Le bien n'existe pas", success: false }` |

### `DELETE /api/biens/:id`

| Statut | Corps |
|---|---|
| `200` | `{ message: "Le bien à été supprimer", data: <Bien>, success: true }` |
| `404` | `{ message: "Cet bien n'existe pas", success: false }` |

Supprime aussi ses photos, commentaires et favoris.

---

## Photos

Les photos sont enregistrées par **URL** : il n'y a pas d'upload de fichier. Le front doit d'abord héberger l'image (Cloudinary, Firebase Storage…) puis envoyer son URL.

### `POST /api/biens/images`

**Body** : `id_bien` (oui), `url_image` (oui), `is_principale` (oui, booléen)

| Statut | Corps |
|---|---|
| `200` | `{ message: "La photo a bien été ajouter", success: true, data: <Media> }` |
| `400` | `{ message: <détail>, data, success: false }` |

### `DELETE /api/images/:id`

`:id` = `id_image`.

| Statut | Corps |
|---|---|
| `200` | `{ message: "Le media a bien été supprimer", success: true, data: <Media> }` |
| `404` | `{ message: "Le media n'existe pas" }` (**pas de `success`**) |

---

## Commentaires

### `GET /api/biens/:id/commentaires`

`:id` = `id_bien`.

| Statut | Corps |
|---|---|
| `200` | `{ message: "La liste des commentaire relatif a cet poste", success: true, data: [ <Commentaire> ] }` |
| `200` (liste vide) | `{ message: "Il n'y a aucun commentaire sur cet poste", success: true }` (**pas de `data`**) |

Penser à `data ?? []` côté front. Les commentaires de cette route ne contiennent pas le nom de l'auteur (utilise `GET /api/biens/:id` si tu en as besoin).

### `POST /api/biens/commentaires`

**Body** : `id_bien`, `id_utilisateur`, `contenu` (tous requis)

| Statut | Corps |
|---|---|
| `200` | `{ message: "le commentaire a bien été ajouter", data: <Commentaire>, success: true }` |
| `400` | `{ message: <détail>, data, success: false }` |

### `DELETE /api/commentaires/:id`

| Statut | Corps |
|---|---|
| `200` | `{ message: "Le commentaire à bien été supprimer", success: true }` |
| `404` | `{ message: "Le commentaire n'existe pas", success: false }` |

---

## Favoris

### `GET /api/favoris/:id`

`:id` = `id_utilisateur`.

| Statut | Corps |
|---|---|
| `200` | `{ message: "La liste des biens mis en favoris par l'utilisateur <id>", success: true, data: [ <Favori> ] }` |
| `200` (vide) | `{ message: "Cet utilisateur n'as aucun bien en favoris", success: true }` (**pas de `data`**) |

Ne renvoie que des identifiants (`id_bien`), pas les biens eux-mêmes : il faut ensuite appeler `GET /api/biens/:id` (ou croiser avec `GET /api/biens`).

### `POST /api/favoris`

**Body** : `id_utilisateur`, `id_bien`

| Statut | Corps |
|---|---|
| `200` | `{ message: "L'article a bien été ajouté parmis les favoris", data: <Favori>, success: true }` |

Pas de contrôle de doublon : le front doit empêcher d'ajouter deux fois le même bien.

### `DELETE /api/favoris/:id`

`:id` = `id_favori` (pas `id_bien`).

| Statut | Corps |
|---|---|
| `200` | `{ message: "Le favoris à bien été supprimer", success: true }` |
| `404` | `{ message: "Cet favoris n'existe pas", success: false }` |

---

## Administration

### `GET /api/admin/utilisateurs`

`{ message: "La listes des <N> utilisateurs", data: [ <Utilisateur> ], success: true }`

### `PUT /api/admin/utilisateurs/:id/suspendre`

Change l'état d'un utilisateur. **Body** : `{ "etat": "actif" | "suspendu" | "bannis" }`

| Statut | Corps |
|---|---|
| `200` | `{ message: "L'utilisateur <email> à été <etat>", data: <Utilisateur avec le nouvel etat>, success: true }` |
| `404` | `{ message: "Cet utilisateur n'existe pas", success: false }` |
| `400` | `{ message: <détail>, data, success: false }` (état invalide) |

### `GET /api/statistique`

```json
{
  "message": "les statistiques du sites et les biens premiums ont été envoyé",
  "success": true,
  "data": {
    "maisonLouees": 12,
    "maisonDispo": 30,
    "croissanceAnuelle": "12.50",
    "maisonPremium": [ <Bien>, <Bien>, "… 5 biens max" ]
  }
}
```

- `maisonLouees` : nombre de biens `occupé`; `maisonDispo` : nombre de biens `disponible`.
- `croissanceAnuelle` : **en pourcentage**, parfois un nombre (`100`), parfois une chaîne (`"12.50"`) : convertis avec `Number()`.
- `maisonPremium` : pour l'instant les 5 premiers biens, sans photos et sans logique de « premium ».
- La valeur de `croissanceAnuelle` n'est **pas fiable** (le calcul des dates de l'année est faux).

---

## À corriger côté back (impacte le front)

| Priorité | Problème |
|---|---|
| Haute | `mot_de_passe` (hash) et `code_verification` renvoyés dans les réponses utilisateur |
| Haute | Middleware `auth` non appliqué : routes admin et modification/suppression ouvertes à tous |
| Haute | Le JWT est signé avec `user.id`, qui n'existe pas (la clé primaire est `id_utilisateur`) : le token ne contient probablement pas l'id |
| Haute | Secrets en dur dans le code : clé JWT (`auth/privatekey.js`), accès MariaDB (`root`, sans mot de passe), identifiants Gmail dans `register.js` |
| Moyenne | E-mail de confirmation jamais envoyé ; `login` ne vérifie pas `etat` |
| Moyenne | `PUT /api/biens/:id` : `ValidationError` non importée, une donnée invalide fait planter la route au lieu de renvoyer un `400` |
| Moyenne | `addFavoris.js` : import de `ValidationError` incorrect, même risque dans le `catch` |
| Moyenne | `GET /api/statistique` : `new Date(currentYear-01-01)` fait une soustraction, pas une date |
| Basse | Réponses non uniformes (`success` / `data` parfois absents, `200` avec `success:false` au login) |
| Basse | `deleteComment` et `deleteFavoris` répondent « supprimé » avant la fin de la suppression (`.then(res.json(...))`) |

Les modèles `Paiements` et `Notes` existent en base mais n'ont **aucune route** pour l'instant.
