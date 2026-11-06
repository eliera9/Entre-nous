# Accueil — décisions validées et intégration

Eli a donné son signal explicite : « Parfait tu peux intégrer tout ce qu’on a décidé pour cette page ». L’intégration reprend la version GitHub vérifiée : `eliera9/Entre-nous`, `main`, `e77bf3d495f19a2e15234e1ac20bae1b40606040`.

## En-tête

- Garder la présentation actuelle. Centrer verticalement le bloc de droite (salutation et événement) par rapport au bloc complet de la date (chiffre, jour et mois).
- Reproduire fidèlement le bouton latéral et la bulle du compagnon de la maquette approuvée.
- Supprimer la démarcation supérieure revenue sur les pages. Sa jonction exacte avec la barre système iPhone reste à vérifier sur téléphone.
- Référence de maquette : `/workspace/accueil-zone-centree.html`.

## Humeur et transition vers l’écriture

- Avant saisie : écrin lumineux compact, barre veloutée lavande/rose, bouton « Noter mon humeur » dessous. Employer les fichiers de polices et graisses de l’app, sans généraliser l’italique : question Cormorant Garamond italique 500 24px, humeur Cormorant SC 12,5px, bouton Cormorant SC 13px.
- Ornement : étoile du Nord générée, petites étoiles autour, affichée 72 × 36px, traits fins de 32px de chaque côté bien centrés sur l’étoile. Source : `/workspace/scratch/3be81c638cfb/generated_images/exec-a11f1192-af5c-45dd-87b4-6de43362dab3.png`, aussi conservée comme « Ornement céleste de l’étoile polaire.png » (`libfile_f8235db61420819186e8dce0fd294680`).
- Jour : carte ton sur ton avec le fond, bouton de la proposition « Crème rosée ». Fond du bouton discret/translucide ; ne pas réduire l’opacité du texte. Nuit : conserver la version approuvée. Référence : `/workspace/humeur-ton-sur-ton-creme-rosee.html`.
- Après validation : masquer le curseur ; titre « Ton humeur du moment », pastille douce avec perle, légèrement rapprochée du titre. Hiérarchie « Humeur dominante » : titre plus doux, humeur plus soutenue.
- Phrase discrète avec les guillemets fins de « Citation fine » : « Prends ton temps. Tu peux me raconter ce qui te vient. »
- Aucun bouton d’écriture supplémentaire dans ce bloc : il introduit les trois cartes. Transition retenue « Suite naturelle » : cartes rapprochées et fondu doux, sans ajouter de phrase ou de flèche entre les zones.

## Trois cartes d’écriture

- Conserver les illustrations de l’app. Les trois familles d’illustrations générées ensuite ont été rejetées ; ne pas les intégrer.
- Garder les « Écrins assortis », restaurés après une demande de reprise du style de l’app : halo et double contour délicat, rayon extérieur 25px, intérieur 20px, hauteur minimale 148px. La restauration des écrins est la dernière décision sur cette forme.
- Typographie exacte des cartes actuelles : titres Cormorant SC 500 10px, interlettrage .03em ; sous-titres Cormorant Garamond italique 500 11,5px. Centrer images, titres et sous-titres sur des rangées de hauteur identique dans les trois cartes.
- Jour : titres vieux rose `#82475d`, sous-titres rose grisé plus clair `#8c6b78`. Garder le mode nuit approuvé.
- « Me raconter » / « Tout ce qui vient » ; « Être guidée » / « Pas à pas » ; « Vider mon sac » / « Sans filtre ».
- Après chaque validation d’humeur : soulèvement léger et halo des trois cartes en cascade, quatre passages puis arrêt. Référence : `/workspace/cartes-animation-quatre-passages.html` (cycle 1800ms, décalages 0/140/280ms, environ 7,48s au total). Respecter la réduction des animations ; ne pas déclencher cet effet lors de la restauration d’une humeur enregistrée. Garder l’ordre des cartes.
- Supprimer le lien « Visite guidée » sous les cartes. Cette seule correction de l’accueil est déjà préparée localement dans `ma-vie-validee.js` et `ma-vie-validee.css`, sans publication. Syntaxe et tests de routage existants vérifiés.

## Mot du jour

- Garder le feuillet actuel et ses proportions, avec son coin replié. Référence : `/workspace/accueil-mot-du-jour.html`, proposition « Feuillet actuel ». Aucun autre changement demandé pour ce bloc.

## Petits pas du jour et volet après réalisation

- Sur l’accueil : carte actuelle et proportions actuelles conservées. Référence : `/workspace/accueil-petits-pas.html`, proposition « Carte actuelle ».
- Après une coche : conserver le principe du volet bas actuel. Message du compagnon « Voilà un petit pas de fait. » ; police du compagnon Newsreader droite comme dans l’app.
- Question « Comment tu te sens, maintenant ? ». « Si tu veux. » dans un petit i à côté de la question, à ouvrir/fermer au toucher, avec accès clavier et Escape.
- Réponses : « soulagée », « fière », « apaisée », « mitigée », « fatiguée », « pas grand-chose ». Présentation combinée : pastilles veloutées avec petite coche, deux par ligne. Plusieurs ressentis possibles ; « pas grand-chose » est exclusif des autres.
- Champ libre : ligne actuelle, indication « Avec tes mots… ».
- Fermer : croix en haut à droite. Footer : bouton « Confirmer » pleine largeur, style 3, et « Plus tard » dessous. Confirmer valide le ressenti ; la croix et Plus tard ferment sans annuler le petit pas réalisé. Aucune validation obligatoire du ressenti.
- Transition retenue : coche qui s’active, délai bref, volet glissant du bas et fondu de l’arrière-plan. Fermeture douce ; réduction des animations respectée ; protéger les transitions rapides contre les callbacks périmés.
- Couleur du bouton retenue : « Prune veloutée », jour `#8b657b` / texte `#fff0f4`, nuit `#b493ae` / texte `#2a1e26`.
- Maquette consolidée : `/workspace/petits-pas-volet-valide.html`. Elle contient l’étoile/illustration du compagnon, les polices, les états, les interactions et les paramètres visuels utiles.

## Navigation du bas

- Garder la barre actuelle, légèrement abaissée avec moins d’espace décoratif en dessous ; conserver la place nécessaire au geste système du téléphone.
- Indicateur actif : trait de 23 × 2 px. Bouton + actuel de 52 × 52 px, signe vectoriel de 20 px exactement centré, traits latéraux centrés sur son axe horizontal.
- Conserver les quatre dessins d’origine adaptés en line art : maison et feuillage, carnet et stylo, cœur et silhouette, bougie et feuillage. Les illustrations mesurent 29 × 29 px dans la barre.
- Les onglets principaux partagent ces mêmes illustrations. Les couleurs du jour et de la nuit viennent de la palette de chaque écran.

## Bulle du compagnon

- Message habituel : « Une pensée qui tourne, quelque chose à raconter, ou juste un petit passage… je suis là. »
- Première arrivée seulement : « Bienvenue dans ton petit espace. Tu veux que je te fasse découvrir les lieux ? On fait le tour ensemble, tranquillement. » Deux choix : « Oui, montre-moi » et « Plus tard ».
- La visite démarre uniquement après acceptation. Une visite terminée n’est plus proposée ni relançable. Aucun bouton « Faire le tour ensemble » dans la bulle quotidienne.
- Messages contextuels validés par la dernière maquette : après une humeur difficile, neutre ou agréable, après un petit pas accompli, et pour un rendez-vous à venir réellement présent dans le calendrier.
- Garder Newsreader droite, l’avatar du compagnon choisi et les versions jour/nuit. Fermeture par la croix ; la bulle quotidienne peut être rouverte au toucher du compagnon.
- L’état de première arrivée et de visite terminée est conservé dans le coffre existant, avec le reste du journal.

## Intégration et vérification

Les styles et interactions sont regroupés dans `accueil-valide.css` et `accueil-valide.js`. Les nouvelles images sont dans `illus/accueil-valide/`. L’humeur utilise le moteur de sauvegarde existant ; les réponses aux petits pas conservent la compatibilité avec le champ `feel` et ajoutent les choix séparés et le texte libre.

Le contrôle visuel utilise exclusivement des données fictives dans une page locale de vérification, absente de la construction et de la publication. Les contrôles couvrent la visite, son retrait après achèvement, les modes jour/nuit, l’humeur, l’ordre stable des cartes, les ressentis multiples et le maintien du petit pas réalisé après fermeture.

## Contraintes conservées

Ne pas publier de données du journal. Préserver les réponses et brouillons existants, ainsi que l’audience du Site. L’autorisation actuelle porte sur toute cette page ; les autres parties du formulaire validé restent inchangées.
