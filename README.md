# Entre nous

Ton journal, rien qu’à toi. Application web en français pour téléphone, tablette et ordinateur, avec les illustrations et les polices du projet d’origine.

[Ouvrir l’application privée](https://entre-nous.elisa9sounard.chatgpt.site)

## Utilisation

Sur iPhone, ouvrir l’application dans Safari, toucher **Partager**, puis **Sur l’écran d’accueil**. L’application est une PWA ; elle ne nécessite pas l’App Store. Sur ordinateur, elle s’ouvre dans le navigateur.

Au premier lancement, choisir **Continuer en invité** pour un carnet local, ou utiliser le compte par e-mail. Choisir son code et conserver le code de secours dans un endroit sûr. Le carnet démarre vide.

Les espaces existants sont conservés : écriture libre, guidée ou rapide, journal, humeur, souvenirs, calendrier, espace personnel, espace psy et petits pas. Les pages gardent leurs variantes de jour et de nuit.

## Données

Le dépôt contient le code, les polices et les illustrations. Les pages créées dans l’application ne sont pas écrites dans GitHub.

Le coffre local est chiffré dans IndexedDB avec AES-GCM ; une clé de données aléatoire est enveloppée avec une clé dérivée du code par PBKDF2. Les sauvegardes locales sont exécutées dans l’ordre et un échec conserve les modifications à réessayer. Les archives lisibles proposées séparément dans les réglages sont en clair.

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
