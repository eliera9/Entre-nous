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

Le parcours utilise le modèle validé de 143 écrans, qui regroupe les 199 questions sources sans doublon. La présentation affiche une question ou un petit groupe de champs cohérents, des idées en lignes douces avec ronds fins et deux zones repliables sous un voile rosé persistant. Les bulles utilisent la même police Newsreader, la même taille et la même couleur que Faire connaissance. Toute la page défile ensemble. Les brouillons, choix et reprises sont enregistrés dans le coffre existant ; la migration conserve aussi les anciennes sessions. Travail et études peuvent être sélectionnés ensemble, tous les loisirs choisis gardent leurs branches, les fiches sont répétables et les dates s’adaptent à la précision connue. Les sujets sensibles restent facultatifs.

Les avatars et la page des compagnons déjà intégrés sont conservés. Faire connaissance reprend les cartes avec progression, « Je reviendrai plus tard » et l’accès repliable aux IA. Les retours des nouveaux parcours rejoignent cette page.

« Préparer mon échange » ouvre le message IA complet dans un volet bas. Ses règles limitent les relances inutiles, respectent les informations connues, les refus et les inconnues ; la structure du portrait et les thèmes d’origine sont conservés. Le prénom est retiré du message préparé par défaut.

« J’en reviens » accepte un portrait ou un échange collé, ou un fichier .txt, avec une discussion complémentaire facultative. Le lecteur local prépare les champs reconnus dans les portraits et les échanges questions/réponses. Le message IA complet demande aussi un bloc de réponses structuré pour les prochains retours : identifiants du formulaire, choix exacts et fiches. Aucun appel à une IA externe n’est effectué lors du collage.

Une relecture précède la sauvegarde. Réponses et brouillons existants restent conservés par défaut, ainsi que les refus, sauf remplacement choisi explicitement. Chaque proposition garde sa source et reste non vérifiée jusqu’à sa confirmation dans le formulaire ; le parcours de vérification rejoint directement les propositions, y compris les questions de suivi, puis passe au chapitre suivant. Les informations inconnues ne sont pas inventées. Les choix incompatibles sont laissés dans le texte à départager ; une date invalide est conservée comme période libre. Le texte complet reste archivé, même si certains passages ne peuvent être attribués avec assez de certitude. Le lecteur ne garantit pas l’interprétation de toute prose arbitraire.

La visite est accessible depuis l’accueil. Elle montre l’écriture, le Journal, Mon espace, Psy lorsqu’il est visible, puis le compagnon. Retour, fermeture, touche Échap et relance restent disponibles.

Vérification du 5 novembre : les 84 tests Node passent et la construction réussit. Dans une bêta locale isolée avec données fictives, les 143 écrans ont été ouverts, puis les interactions de choix multiples, repli, écriture, fiches, dates, import structuré, conflit avec un brouillon et vérification entre chapitres ont été essayées. Le défilement complet et l’absence de débordement horizontal ont été contrôlés aux formats 390 × 640, 320 × 568 et 640 × 320, avec variantes jour/nuit. Les documents d’exemple privés ont servi aux essais locaux du lecteur et ne figurent pas dans le dépôt. Ces vérifications ne constituent pas une garantie d’absence de défaut ; le clavier et les contrôles natifs sur iPhone ainsi que la synchronisation avec un vrai compte restent à éprouver sur les appareils concernés.

### Lecture des portraits développés — 5 novembre 2026

Le lecteur répartit maintenant les rubriques composites entre plusieurs questions : ville, date et motif du déménagement ; travail actuel, parcours passé et projet professionnel ; réveil et sommeil ; livres, séries, jeux et musique. Il garde les anciennes amitiés comme telles, reconnaît les liens contenant « sœur », et regroupe les fiches d’un même animal mentionné dans plusieurs rubriques. Il distingue les envies des activités pratiquées, les noms des surnoms et les dates des titres d’étapes. « Sans petit nom » laisse le nom vide. Les passages et chapitres avec séparateurs conservent leurs dates, lieux et récits dans les champs appropriés. Les phrases qui précisent un sujet à ne pas explorer restent conservées avec la personne concernée.

La relecture affiche la répartition par question. Pour les conflits, elle compare l’ancienne réponse à la nouvelle et permet de sélectionner explicitement les remplacements, individuellement ou ensemble. Rien n’est remplacé par défaut. Les champs narratifs des fiches deviennent des zones de texte extensibles. La suite comprend désormais 94 tests réussis ; la construction et les contrôles locaux sur le portrait développé passent. Les données privées de cet essai et le fichier personnel préparé pour l’import ne sont pas publiés dans le dépôt.

### Reprise de la vérification — 5 novembre 2026

Le parcours de vérification est conservé dans le coffre avec un ordre stable, un identifiant de question et le statut de chaque réponse. Les questions déjà vérifiées restent accessibles en revenant en arrière, y compris entre chapitres. Les corrections en cours, les choix et les zones repliées restent dans les brouillons. Faire connaissance propose « Reprendre la vérification », avec le nombre de réponses vérifiées ; une fois terminée, la même zone propose de relire les réponses importées. La reprise du formulaire utilise aussi un identifiant stable, même si ses embranchements ont changé.

La relecture qui précède l’import conserve son plan, les remplacements sélectionnés, le fournisseur, le chapitre et les volets ouverts. Revenir au texte sans le modifier conserve ces choix. Un texte modifié démarre une nouvelle comparaison. La validation d’une réponse attend la sauvegarde effective ; en cas d’échec, elle reste affichée et propose un réessai.

Les 100 tests passent, dont une sauvegarde chiffrée puis relue du parcours de vérification. Les essais en navigateur isolé couvrent le retour et le rechargement avant l’import, la conservation des remplacements, une correction interrompue, le retour aux réponses validées, les changements de chapitre, la relecture après la fin et un échec de sauvegarde suivi d’un réessai.

### Fond continu en haut des pages — 5 novembre 2026

La couleur de la zone haute suit désormais la page active sur le document, le corps, le cadre de l’app et la couleur système. La synchronisation tient compte des changements de thème sur la racine, du chargement des styles, de la navigation et du retour au premier plan. Les mises à jour sont regroupées par image pour éviter les boucles d’observation. Le décor existant du code s’étend dans la zone haute en conservant la place du clavier.

L’accueil du code garde « Bonjour / Bonsoir » suivi de l’appellation du carnet. Une appellation explicitement vérifiée dans le formulaire est reprise pour cet accueil lors de la sauvegarde du carnet.

Les 107 tests passent et la construction réussit. Le fond a été contrôlé en navigateur sur le formulaire et Faire connaissance, en jour et en nuit, avec une zone système simulée. Le rendu de la barre native de Safari ou de la PWA reste à confirmer sur un iPhone réel.

### Écran de code existant — 5 novembre 2026

Le clavier attend le chargement du compteur d’essais et conserve les délais déjà enregistrés. La vérification n’accepte qu’un envoi à la fois. Les erreurs asynchrones et les annulations biométriques rendent la saisie à nouveau disponible ; une erreur de stockage propose un réessai avant de poursuivre. Les échecs du code et du secours utilisent le même compteur. Les quatre repères annoncent uniquement le nombre de chiffres saisis ; la saisie au clavier et l’effacement sont disponibles.

Le volet « Code oublié ? » isole le clavier en arrière-plan, gère Échap, le retour du focus et le format du secours. Fermer le volet vide le champ et désarme la confirmation d’effacement. Les commandes de restauration disposent d’un état d’attente et d’un message en cas d’erreur. Le volet de nuit suit la palette existante et les longs contenus défilent sur petit écran. Les illustrations, la disposition et « Bonjour / Bonsoir » sont conservés.

Validation : 117 tests passent et la construction réussit. Les essais en navigateur utilisent le vrai contrôleur et le vrai écran dans une page locale isolée, avec stockage et authentification simulés : erreur technique, annulation biométrique, secours incorrect, Échap, secours valide, code valide, erreur de lecture avec réessai, délai conservé et affichage à 390 × 780 et 320 × 568. Aucun carnet personnel ni effacement réel n’a été utilisé. Face ID réel, le clavier natif d’iPhone et le verrouillage au niveau du système restent à confirmer sur appareil ; le déclenchement automatique du verrouillage n’est pas modifié par cette correction de l’écran.
