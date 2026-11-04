/* Parcours Ma vie — contenu du cahier des charges, chapitres v2.
   Ce fichier ne contient aucune réponse personnelle. */
globalThis.__enVieChapters = function ({ P, A }) {
  const nodes = {};
  const q = (id, text, choices, more = {}) => {
    nodes[id] = { q: text, ...(choices ? { c: choices } : {}), ...more };
    return id;
  };
  const yes = a => /^oui\b/i.test(a);
  const no = a => /^(non|pas vraiment|pas maintenant|je préfère)/i.test(a);
  const opt = (a, re, ids) => re.test(a) ? ids : [];
  const partner = () => P.partenaire || 'ton ou ta partenaire';
  const chapters = {};
  const chapter = (id, title, intro, names, themes, end) => {
    chapters[id] = { title, intro, names, themes, end };
  };

  chapter('proches', 'MES PROCHES',
    'Maintenant, j’aimerais rencontrer les gens de ta vie. Ceux qui sont là, ceux qui sont loin, et ceux qui te manquent.',
    ['ta famille', 'tes amis', 'l’amour', 'ceux qui manquent', 'ton cercle aujourd’hui', 'ce que tu donnes aux autres'], [
      [q('pr_famille', 'Tu viens d’une famille plutôt comment ?', ['petite et soudée', 'grande et bruyante', 'recomposée', 'un peu éparpillée', 'c’est compliqué'], { r: a => /compliqué/i.test(a) ? 'Tu me raconteras seulement ce que tu veux.' : null }),
       q('pr_fratrie', 'Tu as des frères et sœurs ?', ['oui', 'non, enfant unique', 'des demi-frères ou sœurs'], { then: a => /unique/i.test(a) ? ['pr_unique'] : no(a) ? [] : ['pr_noms', 'pr_place', 'pr_lien'] }),
       q('pr_maman', 'Et ta maman, tu es proche d’elle ?', ['très', 'ça dépend des jours', 'pas vraiment', 'c’est compliqué', 'elle n’est plus là'], { then: a => /plus là/i.test(a) ? ['pr_maman_souv'] : /compliqué/i.test(a) ? ['pr_maman_choix'] : /^très/i.test(a) ? ['pr_maman_aime'] : [] }),
       q('pr_papa', 'Et ton papa, tu es proche de lui ?', ['très', 'ça dépend des jours', 'pas vraiment', 'c’est compliqué', 'il n’est plus là'], { then: a => /plus là/i.test(a) ? ['pr_papa_souv'] : /compliqué/i.test(a) ? ['pr_papa_choix'] : /^très/i.test(a) ? ['pr_papa_aime'] : [] }),
       q('pr_autre', 'Il y a quelqu’un d’autre dans ta famille qui compte beaucoup ?', ['ma grand-mère', 'mon grand-père', 'une tante ou un oncle', 'un cousin ou une cousine', 'pas pour le moment'], { then: a => no(a) || /^pas pour/i.test(a) ? [] : ['pr_autre_nom', 'pr_autre_role', 'pr_autre_voit'] })],
      [q('pr_amis', 'Il y a quelqu’un sur qui tu peux toujours compter ?', ['ma meilleure amie', 'un petit groupe', 'des amis un peu partout', 'pas vraiment en ce moment'], { then: a => /meilleure/i.test(a) ? ['pr_amie_nom', 'pr_amie_depuis', 'pr_amie_compte', 'pr_amie_voit'] : /partout/i.test(a) ? ['pr_amis_loin', 'pr_amis_lien'] : no(a) ? ['pr_rencontrer'] : [] }),
       q('pr_amitie_perdue', 'Et une amitié perdue en route, que tu regrettes parfois ?', ['oui', 'non', 'je préfère passer'], { then: a => yes(a) ? ['pr_amitie_recit'] : [] })],
      [q('pr_amour', () => P.partenaire ? 'Tu veux parler de votre histoire avec ' + partner() + ' dans « Notre histoire » ?' : 'Il y a eu des histoires d’amour qui ont compté ?', ['oui', 'plus tard', 'non merci'], { then: a => yes(a) && !P.partenaire ? ['pr_amour_recit'] : [], r: a => yes(a) && P.partenaire ? 'Votre chapitre reste disponible, à ton rythme.' : null })],
      [q('pr_manque', 'Il y a quelqu’un qui te manque, en ce moment ?', ['oui', 'non', 'je préfère passer'], { then: a => yes(a) ? ['pr_manque_qui', 'pr_manque_raison'] : [] })],
      [q('pr_nouvelle', 'Quand tu as une bonne nouvelle, tu l’annonces à qui en premier ?', () => [P.partenaire, 'ma famille', 'une amie', 'je la garde pour moi'].filter(Boolean)),
       q('pr_soutien', 'Et quand ça ne va pas, tu vas vers qui ?', () => [P.partenaire, 'une amie', 'ma famille', 'personne pour le moment'].filter(Boolean)),
       q('pr_complique', 'Il y a quelqu’un avec qui c’est compliqué, en ce moment ?', ['oui', 'non', 'je préfère passer'], { then: a => yes(a) ? ['pr_pese'] : [] })],
      [q('pr_amie', 'Et toi, tu es quel genre d’amie ?', ['celle qui écoute', 'celle qui fait rire', 'celle qui organise tout', 'celle qui disparaît un peu parfois']),
       q('pr_savoir', 'Qu’est-ce que tu aimerais que les gens sachent sur toi, sans avoir à le dire ?')],
    ], 'Merci. Je sais un peu mieux qui t’entoure, et qui tu es pour eux.');
  q('pr_unique', 'Et tu aimais ça, être enfant unique ?', ['oui', 'ça dépendait', 'pas vraiment']);
  q('pr_noms', 'Comment s’appellent tes frères et sœurs ?');
  q('pr_place', 'Et toi, tu es l’aînée, la petite dernière, au milieu ?', ['l’aînée', 'la petite dernière', 'au milieu']);
  q('pr_lien', 'Vous êtes proches ?', ['très', 'ça dépend', 'on s’est éloignés', 'c’est compliqué'], { then: a => /éloign/i.test(a) ? ['pr_fratrie_manque'] : [] });
  q('pr_fratrie_manque', 'Ça te manque, d’être plus proche ?', ['oui', 'parfois', 'non']);
  for (const [id, pronoun] of [['maman', 'elle'], ['papa', 'lui']]) {
    q('pr_' + id + '_aime', 'Qu’est-ce que tu aimes le plus chez ' + pronoun + ' ?');
    q('pr_' + id + '_choix', 'Tu veux me dire ce qui est compliqué, ou on passe ?', ['j’ai envie d’en parler', 'on passe'], { then: a => /envie/i.test(a) ? ['pr_' + id + '_recit'] : [] });
    q('pr_' + id + '_recit', 'Qu’est-ce que tu as envie de me confier ?');
    q('pr_' + id + '_souv', 'Tu veux me parler un peu de ' + pronoun + ' ? Un prénom, un souvenir…', null, { r: () => 'Merci de me confier ce souvenir.' });
  }
  q('pr_autre_nom', 'Comment s’appelle cette personne ?');
  q('pr_autre_role', 'Qu’est-ce qu’elle représente pour toi ?', ['un refuge', 'un modèle', 'mon enfance', 'ma confidente']);
  q('pr_autre_voit', 'Tu la vois souvent ?', ['souvent', 'de temps en temps', 'rarement']);
  q('pr_amie_nom', 'Comment s’appelle ta meilleure amie ?');
  q('pr_amie_depuis', 'Vous vous connaissez depuis quand ?', ['depuis l’enfance', 'le lycée', 'quelques années', 'depuis peu']);
  q('pr_amie_compte', 'Qu’est-ce qui fait qu’elle compte autant ?', ['elle me comprend', 'on rit tout le temps', 'elle était là au pire moment', 'on peut tout se dire']);
  q('pr_amie_voit', 'Vous vous voyez souvent ?', ['tout le temps', 'on s’appelle surtout', 'rarement, elle est loin']);
  q('pr_amis_loin', 'Ils te manquent, ceux de là-bas ?', ['oui', 'parfois', 'pas vraiment']);
  q('pr_amis_lien', 'Tu arrives à garder le lien ?', ['oui', 'un peu', 'c’est difficile']);
  q('pr_rencontrer', () => 'Tu aimerais rencontrer du monde' + (P.villeNom ? ', à ' + P.villeNom : '') + ' ?', ['oui', 'peut-être', 'pas pour le moment']);
  q('pr_amitie_recit', 'Tu veux m’en parler un peu ?');
  q('pr_amour_recit', 'Tu veux m’en parler un peu ?');
  q('pr_manque_qui', 'Qui te manque ?');
  q('pr_manque_raison', 'C’est la distance, une dispute, ou cette personne n’est plus là ?', ['la distance', 'une dispute', 'elle n’est plus là', 'je préfère passer'], { then: a => opt(a, /dispute/i, ['pr_renouer']), r: a => /plus là/i.test(a) ? 'Je suis désolé. Tu pourras lui écrire ici un jour, si tu en as envie.' : null });
  q('pr_renouer', 'Tu aimerais renouer ?', ['oui', 'peut-être', 'non']);
  q('pr_pese', 'Ça te pèse beaucoup ?', ['beaucoup', 'un peu', 'ça dépend'], { r: a => /beaucoup/i.test(a) ? 'On pourra en parler dans Guider, quand tu veux.' : null });

  chapter('passe', 'MON PASSÉ',
    'On remonte un peu le temps ? Doucement. Tu me racontes seulement ce que tu as envie de partager, et on s’arrête quand tu veux.',
    ['là où tu as grandi', 'la petite toi', 'l’école et les amitiés', 'l’adolescence', 'les grands moments', 'les épreuves', 'ce qui t’a construite'], [
      [q('pa_lieu', 'Tu as grandi où ?', ['en ville', 'à la campagne', 'au bord de la mer', 'on a souvent déménagé'], { then: a => opt(a, /déménag/i, ['pa_lieu_pref']) }),
       q('pa_maison', 'Et la maison de ton enfance, tu t’en souviens ? Une pièce, une odeur, un coin à toi ?', ['ma chambre', 'le jardin', 'la cuisine', 'une cabane'])],
      [q('pa_petite', () => A('Petit, tu étais comment ?', 'Petite, tu étais comment ?'), () => [A('rêveur', 'rêveuse'), 'pleine d’énergie', 'timide', 'toujours dans les livres', 'très câline']),
       q('pa_jeux', 'Tu jouais à quoi, des heures entières ?', ['aux poupées', 'dehors', 'à dessiner', 'à inventer des histoires', 'aux jeux vidéo']),
       q('pa_metier', 'Tu rêvais de devenir quoi, quand tu serais grande ?'),
       q('pa_sourire', 'Un souvenir d’enfance qui te fait encore sourire ?', ['des vacances', 'un anniversaire', 'chez mes grands-parents', 'un Noël', 'une bêtise'], { then: a => no(a) ? [] : ['pa_sourire_recit'] }),
       q('pa_objet', 'Un objet de ton enfance que tu as gardé, ou qui te manque ?', ['un doudou', 'un livre', 'une photo', 'un bijou']),
       q('pa_enfance', 'Ton enfance, si tu devais la résumer en un mot ?', ['douce', 'joyeuse', 'compliquée', 'solitaire', 'un peu de tout', 'je préfère ne pas en parler'], { r: a => /compliqu|solitaire/i.test(a) ? 'Merci de me le confier. Tu n’as pas besoin d’en dire plus.' : null })],
      [q('pa_ecole', 'Et l’école, tu aimais ça ?', ['j’adorais', 'ça dépendait des années', 'pas vraiment', 'c’était dur'], { then: a => opt(a, /dur/i, ['pa_ecole_dur']) }),
       q('pa_amie', 'Tu avais une amie d’enfance inséparable ?', ['oui', 'non', 'je préfère passer'], { then: a => yes(a) ? ['pa_amie_nom', 'pa_amie_lien'] : [] }),
       q('pa_adulte', 'Un professeur ou un adulte qui t’a marquée ?', ['en bien', 'en mal', 'pas vraiment'])],
      [q('pa_ado', 'Ton adolescence, tu l’as vécue comment ?', ['plutôt bien', 'je cherchais ma place', 'c’était intense', 'c’était dur']),
       q('pa_musique', 'Tu écoutais quoi, à l’époque ?'),
       q('pa_musique_effet', 'Ça te fait quoi, de le réécouter aujourd’hui ?'),
       q('pa_amour', 'Ton premier amour, tu t’en souviens ?', ['oui, tendrement', 'oui, c’était compliqué', 'pas vraiment', 'je préfère ne pas en parler']),
       q('pa_ado_regard', 'Qu’est-ce que l’ado que tu étais penserait de toi aujourd’hui ?', ['elle serait fière', 'elle serait surprise', 'elle ne me reconnaîtrait pas', 'je ne sais pas'])],
      [q('pa_moments', 'Quels grands moments ont compté dans ta vie ?', ['une rencontre', 'un départ', 'un diplôme', 'un voyage', 'une naissance', 'une perte'], { then: a => no(a) ? [] : ['pa_moments_recit'], r: a => /perte/i.test(a) ? 'Prends ton temps. Tu peux raconter seulement ce que tu veux.' : null })],
      [q('pa_epreuves', 'Il y a eu des moments difficiles ? Tu peux juste me dire oui ou non, ça suffit.', ['oui', 'non', 'je préfère passer'], { then: a => yes(a) ? ['pa_epreuves_choix'] : [] })],
      [q('pa_construite', 'Avec le recul, qu’est-ce qui a fait de toi la personne que tu es ?', ['une personne', 'une épreuve', 'une passion', 'un lieu', 'une décision']),
       q('pa_petite_mot', 'Si tu pouvais dire une chose à la petite toi, ce serait quoi ?')],
    ], 'Merci pour ce voyage dans le temps. Ce que tu m’as confié compte beaucoup.');
  q('pa_lieu_pref', 'Tu as un endroit préféré parmi eux ?');
  q('pa_sourire_recit', 'Raconte-moi ?');
  q('pa_ecole_dur', 'Qu’est-ce qui était le plus dur ?', ['les autres élèves', 'les notes', 'je ne trouvais pas ma place', 'je préfère ne pas en parler']);
  q('pa_amie_nom', 'Comment s’appelait cette amie ?');
  q('pa_amie_lien', 'Vous êtes toujours en contact ?', ['oui', 'de temps en temps', 'non']);
  q('pa_moments_recit', 'Raconte-moi un ou deux de ces moments ?');
  q('pa_epreuves_choix', 'Tu veux m’en dire un peu, ou on garde ça pour plus tard ?', ['un peu', 'pour plus tard'], { then: a => /un peu/i.test(a) ? ['pa_epreuves_aide'] : [] });
  q('pa_epreuves_aide', 'Qu’est-ce qui t’a aidée à tenir ?', ['une personne', 'moi-même', 'écrire', 'le temps', 'je ne sais pas']);

  chapter('int', 'MON INTÉRIEUR',
    'Ici, c’est un peu plus intime. Il n’y a pas de bonne réponse. Prends ton temps, et réponds seulement si tu en as envie.',
    ['ta météo intérieure', 'ce qui pèse', 'tes peurs', 'la confiance en toi', 'ton corps', 'tes besoins et limites', 'tes émotions', 'ce qui apaise', 'tes rêves et valeurs', 'être accompagnée'], [
      [q('in_meteo', 'Ta météo intérieure, en ce moment, ce serait quoi ?', ['grand soleil', 'éclaircies', 'un peu nuageux', 'pluie fine', 'orage'], { r: a => /pluie|orage/i.test(a) ? 'Merci de me le dire. On va y aller doucement.' : null }),
       q('in_depuis', 'Tu te sens comme ça depuis quand ?', ['quelques jours', 'quelques semaines', 'des mois', 'je ne sais plus'])],
      [q('in_pese', 'Qu’est-ce qui te pèse en ce moment ?', ['le travail', 'la solitude', 'la fatigue', 'l’avenir', 'une relation', 'moi-même']),
       q('in_parle', 'Tu en as déjà parlé à quelqu’un ?', ['oui', 'un peu', 'non, jamais'])],
      [q('in_peur', 'Qu’est-ce qui te fait peur ?', ['l’avenir', 'être seule', 'décevoir', 'l’échec', 'perdre quelqu’un', 'ne pas être à la hauteur']),
       q('in_peur_origine', 'Elle vient d’où, d’après toi ?', ['je ne sais pas', 'de mon enfance', 'd’une expérience', 'des autres'])],
      [q('in_confiance', 'Tu as confiance en toi ?', ['oui', 'ça dépend des jours', 'pas beaucoup', 'très peu'], { then: a => opt(a, /pas beaucoup|très peu/i, ['in_doute']) }),
       q('in_qualite', 'Une qualité que tu te reconnais, même du bout des lèvres ?', ['je suis gentille', 'créative', 'loyale', 'je ne lâche rien', 'j’écoute bien'])],
      [q('in_corps', 'Et ton corps, comment tu te sens dedans, en ce moment ?', ['bien', 'ça va', 'fatiguée', 'pas très bien', 'je préfère ne pas en parler']),
       q('in_corps_bien', 'Qu’est-ce qui lui fait du bien ?', ['bouger', 'dormir', 'un bain chaud', 'bien manger', 'un câlin'], { skip: () => /préfère/i.test(P.in_corps || '') })],
      [q('in_besoins', 'De quoi tu aurais le plus besoin ?', ['de repos', 'd’être écoutée', 'de changement', 'de tendresse', 'de temps pour moi']),
       q('in_non', 'Tu arrives à dire non ?', ['oui', 'ça dépend', 'très difficilement'])],
      [q('in_emotion', 'Quelle émotion revient souvent ?', ['l’anxiété', 'la tristesse', 'la colère', 'la joie', 'la nostalgie', 'le vide']),
       q('in_emotion_arrive', 'Et quand elle arrive, ça se passe comment ?', ['ça monte d’un coup', 'je la garde pour moi', 'je pleure', 'j’écris', 'je m’occupe'])],
      [q('in_apaise', 'Qu’est-ce qui t’apaise vraiment ?', () => [P.animal ? 'un câlin de ' + P.animal : 'un câlin', 'lire', 'la musique', 'être au calme', 'écrire'])],
      [q('in_reves', 'Ta vie idéale dans cinq ans, elle ressemblerait à quoi ?', ['un métier qui me plaît', 'une maison à moi', 'une famille', 'voyager', 'être en paix avec moi']),
       q('in_valeurs', 'Qu’est-ce qui compte le plus pour toi ?', ['l’amour', 'la liberté', 'la famille', 'la sincérité', 'la créativité', 'la paix'])],
      [q('in_psy', 'Tu vois quelqu’un pour en parler, comme un psy ?', ['oui', 'non', 'j’y pense'], { skip: () => !!P.psy || !!globalThis.__enGet?.('rg')?.psy })],
    ], 'Merci de m’avoir ouvert cette porte. Tout ce que tu as choisi de raconter reste dans ton carnet.');
  q('in_doute', 'Qu’est-ce qui te fait douter le plus ?');

  chapter('histoire', 'NOTRE HISTOIRE', () => 'Alors… raconte-moi votre histoire, à toi et ' + partner() + '. Depuis le début, ou par le bout que tu veux.',
    ['la rencontre', 'les débuts', 'le grand saut', 'le quotidien', 'ce que tu aimes', 'les moments plus durs', 'vos souvenirs', 'vos projets', 'les dates qui comptent'], [
      [q('hi_impression', 'Ta première impression ?', ['coup de cœur', 'son humour', 'je n’étais pas sûre', 'on a parlé des heures', 'je ne m’en souviens plus']), q('hi_premier_message', 'Qui a écrit en premier ?', ['moi', 'mon ou ma partenaire', 'on ne sait plus']), q('hi_rdv', 'Votre premier rendez-vous, c’était comment ?'), q('hi_rdv_detail', 'Tu te souviens de ce que tu portais, ou de ce que vous vous êtes dit ?')],
      [q('hi_serieux', 'À quel moment tu as su que c’était sérieux ?', ['un regard', 'une phrase', 'un geste', 'petit à petit']), q('hi_aime', 'Le premier « je t’aime », tu t’en souviens ?', ['oui', 'c’était drôle', 'c’était maladroit', 'je préfère le garder pour moi']), q('hi_familles', 'Vos familles se sont rencontrées ?', ['oui', 'pas encore', 'c’est compliqué'])],
      [q('hi_decision', 'Votre décision de vous rapprocher, comment vous l’avez prise ?', null, { skip: () => !/amour|rejoindre|copain|copine/i.test(P.ville_why || '') }), q('hi_saut_ressenti', 'Tu ressens quoi, quand tu y repenses ?', ['aucun regret', 'un peu de peur', 'de la fierté', 'un peu de tout']), q('hi_ensemble', 'Vivre ensemble, ça a changé quoi ?', ['on est plus proches', 'on a dû s’ajuster', 'c’est doux', 'c’est parfois compliqué'], { skip: () => P.avec !== 'en couple' })],
      [q('hi_rituels', 'Vous avez des petits rituels à deux ?', ['le café du matin', 'nos séries', 'les câlins du soir', 'les balades', 'les repas']), q('hi_rire', 'Qu’est-ce qui vous fait rire ?'), q('hi_surnoms', 'Vous avez des surnoms, si tu veux les raconter ?')],
      [q('hi_aime_chez', 'Qu’est-ce que tu aimes chez ton ou ta partenaire ?', ['sa douceur', 'son humour', 'sa façon de me rassurer', 'son regard sur moi']), q('hi_apporte', 'Et qu’est-ce que tu penses lui apporter, toi ?')],
      [q('hi_dur', 'Les moments plus durs, c’est plutôt quoi ?', ['les disputes', 'le quotidien', 'la fatigue', 'nos différences', 'rien de spécial']), q('hi_retrouver', 'Quand ça arrive, vous faites comment pour vous retrouver ?', null, { skip: () => /rien de spécial/i.test(P.hi_dur || '') }), q('hi_perdre', 'Il y a eu un moment où vous avez failli vous perdre ?', ['oui', 'non', 'je préfère ne pas en parler'])],
      [q('hi_souvenir', 'Un souvenir à deux que tu veux garder ?', ['un voyage', 'un fou rire', 'une soirée', 'un petit rien']), q('hi_recit', 'Raconte-moi ?'), q('hi_chanson', 'Une chanson qui est un peu la vôtre ?')],
      [q('hi_projets', 'Quels projets vous font envie ?', ['un voyage', 'un appart', 'un animal', 'une famille', 'se marier']), q('hi_avenir', 'Où tu vous vois, dans quelques années ?')],
      [q('hi_dates', 'Quelles dates comptent pour vous ?', ['le jour de la rencontre', 'le premier rendez-vous', 'le jour où on s’est mis ensemble']), q('hi_date_valeur', 'Quelle date veux-tu garder en mémoire ?')],
    ], 'Merci de m’avoir confié votre histoire. Elle continue de s’écrire.');
  return { nodes, chapters };
};
