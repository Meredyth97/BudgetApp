# Finova

Finova est une application web de suivi de dépenses, inspirée de l'interface de Finary. Elle fonctionne entièrement dans le navigateur, sans serveur : le code est hébergé gratuitement sur GitHub Pages, et tes données sont enregistrées dans ton navigateur et, si tu le souhaites, synchronisées dans un dépôt GitHub **privé**.

Ce guide explique comment la mettre en place pour toi, étape par étape.

## Sommaire

1. [Ce qu'il te faut](#1-ce-quil-te-faut)
2. [Créer l'application sur GitHub](#2-créer-lapplication-sur-github)
3. [Créer le dépôt de données (privé)](#3-créer-le-dépôt-de-données-privé)
4. [Créer le token d'accès](#4-créer-le-token-daccès)
5. [Connecter le token à l'application](#5-connecter-le-token-à-lapplication)
6. [Renouveler le token](#6-renouveler-le-token)
7. [Fonctionnement de l'application](#7-fonctionnement-de-lapplication)
8. [Sécurité](#8-sécurité)
9. [Problèmes fréquents](#9-problèmes-fréquents)

---

## 1. Ce qu'il te faut

- Un compte GitHub gratuit.
- Les trois fichiers de l'application : `index.html`, `style.css` et `app.js`.
- Environ 10 minutes.

L'application utilise **deux dépôts GitHub** séparés :

| Dépôt | Visibilité | Rôle |
|---|---|---|
| `finova` (nom au choix) | **Public** | Contient le code de l'app, servi par GitHub Pages |
| `finova-data` (nom au choix) | **Privé** | Contient le fichier `data.json` avec tes dépenses |

Le dépôt public ne contient jamais tes données ni ton token.

---

## 2. Créer l'application sur GitHub

### Option A : forker ce dépôt

1. Clique sur **Fork** en haut à droite de la page du dépôt.
2. Choisis ton compte comme destination.

### Option B : créer ton propre dépôt

1. Sur GitHub, clique sur **+** puis **New repository**.
2. Nom : `finova` (ou ce que tu veux).
3. Visibilité : **Public** (GitHub Pages est gratuit uniquement pour les dépôts publics).
4. Crée le dépôt, puis clique sur **uploading an existing file** et dépose les trois fichiers `index.html`, `style.css` et `app.js` **à la racine**, au même niveau.
5. Clique sur **Commit changes**.

### Activer GitHub Pages

1. Dans le dépôt, va dans **Settings > Pages**.
2. Sous **Build and deployment**, choisis **Deploy from a branch**.
3. Branche : `main`, dossier : `/ (root)`. Clique sur **Save**.
4. Attends environ une minute. L'adresse de ton site apparaît en haut de la page :
   `https://ton-pseudo.github.io/finova/`

Ouvre cette adresse : tu dois voir l'application, vide.

---

## 3. Créer le dépôt de données (privé)

1. Sur GitHub, clique sur **+** puis **New repository**.
2. Nom : par exemple `finova-data`.
3. Visibilité : **Private**.
4. Coche **Add a README file**. C'est important : un dépôt totalement vide fait échouer l'écriture via l'API.
5. Clique sur **Create repository**.

**Ne crée pas toi-même le fichier de données.** L'application crée `data.json` automatiquement lors de la première synchronisation.

---

## 4. Créer le token d'accès

Le token est une clé qui autorise l'application à lire et écrire dans ton dépôt de données, et nulle part ailleurs.

1. Clique sur ta photo de profil en haut à droite, puis **Settings**.
2. Dans le menu de gauche, descends tout en bas et clique sur **Developer settings**.
3. Clique sur **Personal access tokens**, puis **Fine-grained tokens**.
4. Clique sur **Generate new token**.
   (Raccourci : `https://github.com/settings/personal-access-tokens/new`)
5. Remplis le formulaire :
   - **Token name** : `finova`
   - **Expiration** : choisis une durée, par exemple 1 an. **Note la date d'expiration dans ton agenda.**
   - **Repository access** : **Only select repositories**, puis choisis uniquement ton dépôt privé `finova-data`.
   - **Permissions** : déplie **Repository permissions**, cherche **Contents** et passe-le sur **Read and write**. Laisse tout le reste sur « No access ».
6. Clique sur **Generate token**.

### ⚠️ Copie et sauvegarde le token immédiatement

GitHub **n'affiche le token qu'une seule fois**. Si tu quittes la page sans l'avoir copié, tu devras en recréer un.

- Le token commence par `github_pat_` et est très long.
- Copie-le **en entier et sans modification** : pas d'espace avant ou après, aucun caractère manquant. Une seule erreur et GitHub répondra « Token refusé ».
- Sauvegarde-le dans un endroit sûr, par exemple un gestionnaire de mots de passe.
- Ne le colle jamais dans un fichier du dépôt public, ni dans un message, ni dans une capture d'écran.

---

## 5. Connecter le token à l'application

1. Ouvre ton application (`https://ton-pseudo.github.io/finova/`).
2. Va dans l'onglet **Synchro**.
3. Remplis :
   - **Dépôt** : `ton-pseudo/finova-data` (le nom exact de ton dépôt privé)
   - **Fichier** : `data.json` (valeur par défaut)
   - **Token** : colle le token copié à l'étape précédente
4. Clique sur **Enregistrer et synchroniser**.

L'état s'affiche en haut à droite : « Synchronisé à 14:32 ». Dans ton dépôt privé, un fichier `data.json` est apparu.

**Sur un autre appareil** (téléphone, deuxième ordinateur) : ouvre la même adresse, onglet Synchro, et saisis les mêmes trois informations. Tes données arrivent automatiquement.

Le token est stocké dans le navigateur de chaque appareil. Il faut donc le saisir une fois sur chacun.

---

## 6. Renouveler le token

Un token a une date d'expiration, celle que tu as choisie à l'étape 4. **Passé cette date, la synchronisation s'arrête** et l'application affiche « Token refusé ». Tes données restent intactes dans le navigateur et dans le dépôt.

Pour le renouveler, **avant la date d'expiration** de préférence :

1. Recrée un token en suivant exactement l'[étape 4](#4-créer-le-token-daccès).
2. **Copie-le précisément et sauvegarde-le**.
3. Dans l'application, onglet **Synchro**, remplace l'ancien token par le nouveau et clique sur **Enregistrer et synchroniser**.
4. Fais la même chose sur chacun de tes appareils.
5. Tu peux supprimer l'ancien token dans GitHub (Settings > Developer settings > Fine-grained tokens > Delete).

Conseil : mets un rappel dans ton agenda quelques jours avant la date d'expiration.

---

## 7. Fonctionnement de l'application

Tout se passe dans ton navigateur. Le sélecteur de mois en haut à droite change le mois affiché dans tous les onglets.

### Tableau de bord

- Trois cartes : **revenus**, **dépenses** et **épargne du mois**, avec le taux d'épargne.
- Un **anneau** qui répartit les dépenses par catégorie.
- Un **graphique en barres** qui compare revenus et dépenses sur les 6 derniers mois.
- La progression de chaque **budget** défini pour le mois.

### Transactions

- **Saisie manuelle** : date, libellé, montant, type (dépense ou revenu) et catégorie.
- **Import CSV** : importe l'export de ta banque. L'application cherche l'en-tête avec les colonnes date, libellé, montant (ou débit et crédit), et gère les libellés sur plusieurs lignes. Les opérations déjà importées ne sont pas dupliquées si tu réimportes le même fichier.
- **Export CSV** : télécharge toutes tes transactions.
- **Sauvegarde JSON** : télécharge toutes tes données (transactions, budgets, abonnements, règles). Tu peux aussi réimporter ce fichier, ce qui **remplace** les données actuelles après confirmation.

### Catégories et mémorisation

- À l'import, l'application attribue une catégorie d'après des mots-clés (supermarchés, transports, etc.). Les revenus sont classés en « Revenu ».
- Tu peux **changer la catégorie** d'une dépense avec le petit menu sous son libellé. L'application propose alors de **mémoriser** ce commerce et de l'appliquer aux opérations similaires, déjà importées ou à venir.
- À la saisie manuelle, la catégorie se sélectionne automatiquement quand le libellé est déjà connu.
- Le bloc **Catégories mémorisées** (repliable) liste les règles et permet de les supprimer.

### Budgets

Définis une limite mensuelle par catégorie. Elle apparaît ensuite sur le tableau de bord, en rouge si elle est dépassée.

### Abonnements

Enregistre tes charges récurrentes (nom, montant, jour du mois, catégorie). L'onglet affiche le total mensuel et annuel. Le bouton **Ajouter** crée les opérations pour le mois affiché, sans doublon si tu le cliques plusieurs fois.

### Synchro

Voir les étapes [3 à 5](#3-créer-le-dépôt-de-données-privé). Au fonctionnement :

- Au démarrage, et quand tu reviens sur l'onglet du navigateur, l'application compare tes données locales avec celles de GitHub et garde les plus récentes.
- Après chaque modification, elle envoie le fichier environ 1,5 seconde plus tard.
- Hors connexion, l'application continue de fonctionner avec les données locales et se resynchronise ensuite.
- Si deux appareils modifient en même temps, les transactions des deux côtés sont fusionnées. Dans ce cas, une suppression peut réapparaître.

---

## 8. Sécurité

- Le dépôt de données doit rester **privé**. Un dépôt public rendrait tes dépenses lisibles par tout le monde.
- Le token n'est pas dans le code de l'application : il est saisi par toi et stocké dans le navigateur (`localStorage`). Un visiteur de ton site public ne voit ni ton token, ni ton dépôt de données, ni tes dépenses.
- Ne mets **jamais** le token dans `app.js`, `index.html` ou n'importe quel fichier du dépôt public.
- Utilise l'application avec ton token uniquement sur **tes propres appareils**. Toute personne qui accède à ton navigateur peut lire le token.
- Tous tes sites GitHub Pages partagent le même domaine (`ton-pseudo.github.io`) et donc le même stockage navigateur. Ne publie sur ce compte que du code de confiance.
- Si le token fuit, supprime-le immédiatement dans GitHub (Settings > Developer settings > Fine-grained tokens > Delete) et crée-en un nouveau. Il n'a accès qu'au dépôt de données.

---

## 9. Problèmes fréquents

| Symptôme | Cause probable | Solution |
|---|---|---|
| « Token refusé » | Token mal copié, expiré ou supprimé | Recrée un token et colle-le en entier |
| « Dépôt introuvable ou token sans accès » | Nom du dépôt incorrect, ou token non autorisé sur ce dépôt | Vérifie `pseudo/depot` et le périmètre du token |
| « Droits insuffisants sur le dépôt » | Permission Contents sur « Read-only » | Mets **Read and write** |
| La première synchro échoue | Dépôt de données totalement vide | Ajoute un fichier README au dépôt |
| La page s'affiche sans style ou ne répond pas | Les trois fichiers ne sont pas tous en ligne, ou cache du navigateur | Vérifie qu'ils sont à la racine, puis recharge avec Ctrl+Maj+R |
| Une mise à jour n'apparaît pas | Cache du navigateur | Change le numéro de version dans `index.html` (`app.js?v=5`, etc.) |
| « Colonnes introuvables » à l'import | Le CSV n'a pas de colonne date ou montant reconnaissable | Vérifie l'en-tête affiché dans le message d'erreur |

### Mettre à jour l'application

Quand un fichier change, remplace-le dans ton dépôt et **augmente son numéro de version** dans `index.html` (par exemple `app.js?v=4` devient `app.js?v=5`). Cela force le navigateur à recharger la nouvelle version au lieu de garder l'ancienne en cache.
