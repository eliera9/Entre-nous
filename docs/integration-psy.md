# Parcours Psy — préparation de l’intégration

Version de travail locale du 8 novembre 2026, branche `psy/integration-parcours-valide`.
Dépôt cible : `eliera9/Entre-nous`. Publication autorisée par Eli après validation du parcours.

La base locale est le commit `fb75118`. Le fichier principal de GitHub a été comparé avant modification : son blob `62835a25e35831f12698c3b26bcecebb25920459` correspond exactement à celui de cette base.

## Périmètre préparé

Le parcours « Je commence mon suivi » reprend la dernière maquette validée, `psy-parcours-plus-tard-centre.html` :

- entrée, introduction et deux cartes validées ; « Plus tard » en pilule centrée ;
- deuxième et troisième écrans réunis, sans « On regarde » ni l’instruction supprimée ;
- cinq rubriques, progressions en pourcentage et bouton Confirmer pleine largeur ;
- questions et réponses multiples, deux propositions par page de carrousel, repères rapprochés ;
- champs libres repliables, relances facultatives dans la page et conservation des brouillons ;
- adaptation aux seules réponses utilisables de « Faire connaissance » ;
- ajout d’un proche dans un volet compact, accès à droite des prénoms, recherche du lien familial ;
- récapitulatif organisé en onglets sur une ligne, dossiers par personne ou sujet et onglet Moi ;
- crayon unique pour modifier les mêmes champs ; bouton de retour en pilule sans flèche ;
- compagnon et navigation fournis par les composants actuels de l’application.

Le parcours « J’ai déjà un suivi » continue d’ouvrir le formulaire existant. Son contenu n’a pas été redessiné.

## Raccordements

| Élément | Emplacement et comportement |
| --- | --- |
| Modèles, adaptation, vues | `psy-preparation.js` |
| Styles validés, limités à Psy | `psy-preparation.css` |
| Migration additive | `psy-preparation-store.js` |
| Réponses de préparation | objet `psy-preparation-v1` enregistré par le coffre existant |
| Proches et contexte | objet canonique `lifeform-approved-v1.pagesV2` ; pas de copie autonome des proches |
| Sauvegarde | `__vaultPushNow`, mécanisme chiffré déjà présent dans l’application |
| Interface Ma vie | signal `en-life-people-changed` : synchronise les rôles et la fiche affichée pour éviter qu’une sauvegarde ultérieure efface l’ajout |
| Démarrage | attend l’initialisation de Ma vie avant de lire son contexte |
| Hors ligne | fichiers ajoutés au service worker, au build et au calcul de version du cache |

Les réponses et notes sont affichées comme du texte, sans interprétation HTML. Les données fictives et les contrôles de réglage de la maquette ne sont pas inclus dans le parcours de l’application.

Les notes déjà rédigées conservent le libellé de leur relance si le contexte affectif change : une note concernant une personne ne reçoit pas automatiquement le prénom d’une autre.

## Conservation des anciennes réponses

L’ancien objet `psy.first` demeure en place. Une archive intégrale supplémentaire est conservée dans `legacyArchive` du nouvel objet. Les anciens écrits sont repris avec leurs libellés, les repères gardent leurs textes et périodes, et les questions pratiques gardent leurs réponses. Aucun ancien choix n’est transformé par déduction en un nouveau thème.

Les brouillons des réponses désélectionnées restent enregistrés ; le récapitulatif montre uniquement les réponses actives. L’import volontaire d’un repère de Ma vie crée une entrée Psy indépendante : la modifier ou la retirer ne modifie pas sa source.

Un échec d’enregistrement laisse les écrits affichés et propose une nouvelle tentative. Les tests couvrent ce comportement ; ils ne remplacent pas un essai du coffre sur un appareil installé.

## Vérifications réalisées

- `npm test` : **149 tests passent**, dont 9 tests spécifiques ajoutés pour l’intégration Psy et sa synchronisation avec Ma vie.
- `npm run build` : réussit ; les nouveaux fichiers sont présents dans `dist/` ; l’étoile validée est intégrée dans la feuille de style.
- Compilation JavaScript et `git diff --check` : réussissent.
- Contrôle dans un navigateur sur un écran QA isolé : entrée, rubriques, sélection famille, recherche d’un lien, ajout et sélection du proche, note libre, progression, récapitulatif, modification globale, réouverture simulée, palettes jour et nuit.
- Correction observée pendant ce contrôle : les variantes de style portées par la racine sont correctement appliquées à la pilule de retour et à la présentation éditoriale.

Le contrôle navigateur utilise les vrais composants du nouveau parcours, avec des données de test en mémoire. Il ne constitue pas un essai de bout en bout de la connexion, du coffre chiffré, de la synchronisation distante ou de la PWA installée sur iPhone. Ces points restent à tester avant publication.

## Essai reproductible

```sh
npm test
npm run build
node scripts/preview-psy.mjs
```

Servir ensuite `dist/` avec le serveur de prévisualisation habituel et ouvrir `qa-psy.html`. Cette page est un outil QA : elle est créée à la demande et n’est pas ajoutée par le build normal. Ses boutons de réouverture et de thème ne font pas partie du produit. Le prochain build normal la retire.

Pour un essai dans l’application complète, utiliser un profil de test et vérifier :

1. préparer quelques réponses, confirmer et modifier via le crayon ;
2. ajouter un proche dans Psy, ouvrir Ma vie et retrouver la même fiche ;
3. modifier son prénom dans Ma vie, puis vérifier sa reprise dans Psy ;
4. fermer, déverrouiller et retrouver les réponses, notes et questions ajoutées ;
5. vérifier ces allers-retours hors ligne et sur la PWA mobile.

## Point fonctionnel restant à confirmer

La destination des boutons « Plus tard » n’avait pas été définie dans la maquette validée. Dans cette préparation, ils reprennent le comportement existant de l’application : ouvrir l’espace Psy sans suivi renseigné. La préparation reste sauvegardée. La destination doit être confirmée lors de l’essai intégré avant publication.

## Livraison

Les fichiers modifiés ont été comparés à la branche GitHub `main` avant publication : leurs versions de départ correspondent. La publication reprend le mécanisme GitHub Pages existant. Le comportement existant de « Plus tard » est conservé, conformément à la validation finale d’Eli.
