# Parcours Psy — version intégrée du 9 novembre 2026

Les deux parcours validés sont publiés ensemble : première séance et suivi déjà commencé. La page principale « Mon chemin avec ma psy » est conservée. Les formulaires, relances conditionnelles, progressions et récapitulatifs utilisent les décisions validées et le contexte réellement déclaré dans Faire connaissance.

## Sources actives

- `psy-approved.js` : raccordement au coffre et migration des réponses existantes.
- `psy-premiere-validee.js` : préparation de la première séance et récapitulatif.
- `psy-suivi-valide.js`, `psy-suivi-recap.js` : quatre rubriques du suivi et récapitulatif modifiable.
- `psy-approved.css`, `fonts/psy-valides`, `illus/psy-valides` : présentation validée.

Les anciens fichiers `psy-preparation*` restent dans le dépôt pour historique et tests de compatibilité ; ils ne sont plus chargés par l’application. Les réponses de `psy-preparation-v1` sont reprises sans changer leurs identifiants : choix, relances, questions ajoutées, textes et repères. Une archive complète ainsi que le stockage précédent sont conservés dans le coffre. Les réponses plus récentes du nouveau parcours restent prioritaires. Une note associée à une personne conserve le libellé de sa relance d’origine.

Les proches ajoutés depuis Psy rejoignent les fiches canoniques de Faire connaissance. Aucune réponse n’est déduite d’un profil fictif.

## Inscription et identité

Les inscriptions commencées avec cette version reprennent après fermeture, sans code jusqu’à la fin du parcours ou au choix « Plus tard ». Le brouillon reste chiffré localement et lié au compte. Les carnets déjà terminés gardent leur verrouillage. Chaque page dispose d’un retour. Les icônes d’information ont été retirées des questions de Faire connaissance.

La date d’anniversaire utilise les menus déroulants de l’application. La saisie du prénom et du surnom conserve la ligne fine sans encadrement rectangulaire.

## Publication

- GitHub Pages : https://eliera9.github.io/Entre-nous/
- Entre nous privé : https://entre-nous.elisa9sounard.chatgpt.site

Les modifications doivent être synchronisées sur les deux destinations. GitHub Pages sert les sources statiques à la racine de `main` via son déploiement existant. `npm run build` actualise aussi la version de `sw.js` à la racine pour remplacer le cache précédent.

## Vérifications

`npm test`, `npm run build` et `git diff --check`. Les contrôles DOM avec données fictives couvrent les deux parcours, les récapitulatifs, la reprise de la version GitHub précédente, les questions personnelles et les relances associées aux personnes. Les contrôles natifs iPhone et Face ID restent à confirmer sur appareil.
