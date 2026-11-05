# Entre nous

Ton journal, rien qu’à toi. Application web en français pour téléphone, tablette et ordinateur, avec les illustrations et les polices du projet d’origine.

[Ouvrir l’application privée](https://entre-nous.elisa9sounard.chatgpt.site)

## Utilisation

Sur iPhone, ouvrir l’application dans Safari, toucher **Partager**, puis **Sur l’écran d’accueil**. L’application est une PWA ; elle ne nécessite pas l’App Store. Sur ordinateur, elle s’ouvre dans le navigateur.

Au premier lancement, choisir **Continuer en invité** pour un carnet local, ou utiliser le compte par e-mail. Choisir son code et conserver le code de secours dans un endroit sûr. Le carnet démarre vide.

Les espaces existants sont conservés : écriture libre, guidée ou rapide, journal, humeur, souvenirs, calendrier, espace personnel, espace psy et petits pas. Les pages gardent leurs variantes de jour et de nuit.

## Données

Le dépôt contient le code, les polices et les illustrations. Les pages créées dans l’application ne sont pas écrites dans GitHub.

### Accueil et connexion — 4 novembre 2026

L’accueil et le volet e-mail reprennent la maquette validée : carnet et plume dans le séparateur, couleurs de jour et de nuit, fond continu, dimensions adaptées au téléphone et à la tablette. Les trois accès ouvrent directement leur parcours. Le mode invité dispose d’une information à la demande et Google demande de choisir le compte.

Le volet s’ouvre sur « Nouveau carnet », avec e-mail, mot de passe et confirmation du mot de passe. « J’ai déjà un carnet » conserve la connexion et la récupération du mot de passe. L’inscription n’avance que si le serveur a réellement ouvert une session ; elle reste bloquée si le service exige encore une confirmation e-mail. La configuration publique du service indiquait la confirmation désactivée lors de la vérification. Aucun réglage administrateur n’a été changé.

Le formulaire affiche les erreurs près des champs, protège des doubles envois et conserve les saisies lors d’une erreur du service. Ses mots de passe, y compris lorsqu’ils sont affichés, sont exclus des brouillons. Un carnet existant est repris après connexion ; un compte sans carnet demande un choix explicite. Les contrôles automatisés comprennent désormais 37 tests. Le rendu a été examiné en navigateur à plusieurs largeurs et hauteurs, en jour et en nuit ; la barre d’état native et le clavier iOS restent à vérifier sur un iPhone réel.

Le coffre local est chiffré dans IndexedDB avec AES-GCM ; une clé de données aléatoire est enveloppée avec une clé dérivée du code par PBKDF2. Les sauvegardes locales sont exécutées dans l’ordre et un échec conserve les modifications à réessayer. Dans Réglages → Mon journal → Sauvegarde, **Mon carnet complet** exporte le coffre et les vocaux chiffrés. La restauration les écrit ensemble dans une transaction et conserve le carnet précédent ; l’écran « Code oublié ? » propose d’annuler la dernière restauration. Le code du fichier reste nécessaire.

Les archives lisibles proposées séparément dans les réglages sont en clair. Leur import récupère les brouillons seulement ; elles ne remplacent pas la sauvegarde complète.

Le compte Supabase, la synchronisation du coffre chiffré et les clés d’accès sont repris du code existant. Leur fonctionnement avec un vrai compte, plusieurs appareils et Face ID doit être vérifié sur les appareils concernés. Cette livraison ne constitue pas un audit des règles d’accès du serveur Supabase. Un code de quatre chiffres reste une protection limitée face à une copie volée du coffre.

L’utilisation hors ligne dépend d’un premier chargement complet et de la disponibilité du stockage du navigateur. Les domaines ont des stockages séparés : un carnet déjà créé sur GitHub Pages ne se transfère pas automatiquement vers cette adresse.

## Développement

Node.js 22 ou plus récent, sans dépendance à installer :

```sh
npm test
npm run build
```

Les sources restent à la racine. `scripts/build.mjs` prépare `dist/` et donne au cache hors ligne une version issue du contenu de l’application. La configuration de publication est dans `.openai/hosting.json`.

Les tests contrôlent les scripts, les actifs locaux, le chiffrement d’un journal de plusieurs Mo, les mauvais codes, les coffres altérés, les sauvegardes concurrentes, la reprise après erreur et l’isolation du cache. Les parcours d’écriture et de navigation ont été vérifiés avec des données fictives dans un aperçu local séparé.

## Restauration du code

La version précédente est conservée sur la branche `backup/avant-version-web-20261104`. Les changements du 4 novembre corrigent l’affichage sur ordinateur, les volets masqués, les trois actions d’écriture de l’accueil, la navigation au clavier et la sauvegarde des gros carnets.

### Correction du parcours Ma vie

Les quatre cartes de « Faire connaissance » ouvrent leur questionnaire. « Commencer » et « Continuer » utilisent le chapitre choisi. Les réponses, le brouillon, la question en attente et la progression sont conservés séparément par chapitre dans le coffre existant. Revenir aux chapitres ne réinitialise plus le profil. Les reprises ne dupliquent pas « Ce que je t’ai confié », et le bouton IA reçoit le chapitre ouvert.

Le contenu des chapitres complémentaires est regroupé dans `ma-vie-parcours.js`. Les essais locaux avec des réponses fictives couvrent les quatre ouvertures, l’envoi d’une réponse, le passage d’une question et la reprise après réouverture.

### Audit du mode invité — 4 novembre 2026

Les parcours accessibles ont été essayés avec un profil et des textes fictifs dans l’aperçu. **26 tests automatisés passent**, et la compilation réussit. Ces tests ne représentent pas une validation individuelle de chaque bouton ou de toutes les branches possibles.

Les corrections couvrent les dates du calendrier (sans décalage des rendez-vous enregistrés), les extraits tirés du vrai journal, les thèmes personnalisés, la sauvegarde du suivi et de la préparation Psy, le parcours après séance, les séances conservées sans doublon, le retour d’une page secrète au journal avec ses médias, et la sauvegarde complète chiffrée. Les menus fermés sont exclus de la navigation au clavier. Les interfaces de rappels et de connexion aux applications du téléphone indiquent désormais leurs limites réelles.

La vérification en navigateur du coffre, des téléchargements chiffrés et de la restauration n’a pas pu être menée dans l’aperçu HTTP, qui ne fournit pas Web Crypto. Les fonctions de chiffrement et les transformations des sauvegardes ont été testées sous Node. L’accès à la production est resté protégé : le compte du navigateur de test n’est pas autorisé à ouvrir le site. Aucun accès n’a été élargi.

Restent à terminer ou à vérifier séparément : remplissage automatique de la fiche depuis le portrait et le questionnaire, conservation de certaines personnalisations du profil, cohérence des petits pas entre Psy et Mon espace, conservation de la forme choisie pour le bilan guidé, rappels automatiques, parcours avec un vrai compte et plusieurs appareils, médias, Face ID et installation sur iPhone. Les éléments de la maquette encore présents dans le code ne constituent pas des intégrations natives actives.


### Faire connaissance, formulaires et retour IA — 5 novembre 2026

Le parcours utilise les 199 questions existantes et conserve leurs embranchements. La nouvelle présentation affiche une question ou un petit groupe de champs cohérents, des idées en lignes douces et une zone d’écriture repliable. Les brouillons, les choix et les reprises sont enregistrés dans le coffre existant, séparément par chapitre ; les anciennes sessions restent conservées. Les prénoms ne sont plus déduits des majuscules. Les réponses travail/études et les loisirs multiples gardent toutes leurs branches, et les animaux peuvent être renseignés sur plusieurs fiches actuelles ou anciennes.

Les avatars et la page des compagnons déjà intégrés sont conservés. Faire connaissance reprend les cartes avec progression, « Je reviendrai plus tard » et l’accès repliable aux IA. Les retours des nouveaux parcours rejoignent cette page.

« Préparer mon échange » ouvre le message IA complet dans un volet bas. Ses règles limitent les relances inutiles, respectent les informations connues, les refus et les inconnues ; la structure du portrait et les thèmes d’origine sont conservés. Le prénom est retiré du message préparé par défaut.

« J’en reviens » accepte un portrait collé ou un fichier texte, avec une discussion facultative distincte. Une relecture précède la sauvegarde réelle ; un portrait partiel ou libre reste accepté. Les textes originaux sont conservés. Une ancienne ligne du portrait est gardée par défaut ; son remplacement demande une sélection explicite. Le remplissage de la fiche conserve la protection existante des champs déjà renseignés manuellement.

La visite est accessible depuis l’accueil. Elle montre l’écriture, le Journal, Mon espace, Psy lorsqu’il est visible, puis le compagnon. Retour, fermeture, touche Échap et relance restent disponibles.

Vérification de cette livraison : contrôle syntaxique des scripts intégrés et des nouveaux modules, tests de lecture/fusion de portraits et de sélection, contrôle des branches et des actifs référencés. L’environnement local et le navigateur de vérification n’étant pas disponibles lors de cette intégration via l’API GitHub, la suite Node complète, le rendu mobile et les interactions réelles avec le coffre n’ont pas été exécutés dans cette session. Les nouveaux tests peuvent être lancés avec la suite habituelle.
