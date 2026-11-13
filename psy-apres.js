/* Espace Psy · retours de séance, dans le coffre existant. */
(() => {
  'use strict';
  const richWriting = globalThis.__enPsyWriting;
  const templates = {
    home: `<section class="en-home en-home-page" data-view="home" aria-labelledby="psy-after-home-title">
  <h3 class="en-home-heading" id="psy-after-home-title" tabindex="-1">Mes mots après la séance</h3>
  <p class="en-home-empty" data-empty>Aucune séance à noter</p>
  <ul class="en-session-list" data-session-list aria-label="Séances à noter"></ul>
  <button class="en-add-session cursor-interaction" type="button" data-add-session aria-expanded="false" aria-controls="psy-after-add-form">
    <span aria-hidden="true">+</span> Ajouter une séance
  </button>
  <form class="en-add-form" id="psy-after-add-form" data-add-form hidden>
    <label for="psy-after-add-date">Date de la séance</label>
    <input class="en-date" id="psy-after-add-date" type="date" data-add-date min="0001-01-01" required>
    <div class="en-add-form-actions">
      <button class="en-main-action cursor-interaction" type="submit">Ajouter la séance</button>
      <button class="en-quiet-action cursor-interaction" type="button" data-cancel-add>Annuler</button>
    </div>
  </form>
</section>`,
    card: `<li>
  <article class="en-session-leaf">
    <div class="en-leaf-meta">
      <span class="en-leaf-calendar"><i data-lucide="calendar-days" aria-hidden="true"></i><time data-session-date></time></span>
      <span class="en-leaf-status">
        <span class="en-session-status" data-session-status>À écrire</span>
        <button type="button" class="en-delete-session" data-delete-session aria-label="Supprimer la séance" aria-expanded="false">
          <i data-lucide="trash-2" aria-hidden="true"></i>
        </button>
      </span>
    </div>
    <h4 class="en-session-title">Revenir sur ma séance</h4>
    <button type="button" class="en-leaf-action cursor-interaction" data-open-return>
      <span data-return-label>Commencer à écrire</span><i data-lucide="arrow-right" aria-hidden="true"></i>
    </button>
    <div class="en-delete-confirm" data-delete-confirm hidden>
      <p>Supprimer cette séance et les mots qui lui sont associés dans Après ?</p>
      <button type="button" class="en-quiet-action" data-cancel-delete>Annuler</button>
      <button type="button" class="en-quiet-action en-confirm-remove" data-confirm-delete>Supprimer</button>
    </div>
  </article>
</li>`,
    editor: `<div data-session-editor hidden>
      <div data-view="write" hidden>
      <header class="en-return-heading">
        <div class="en-date-row">
          <div class="en-session-date">
            <button type="button" class="en-date-toggle cursor-interaction" data-date-toggle aria-expanded="false" aria-controls="psy-after-date-editor">
              <i data-lucide="calendar-days" aria-hidden="true"></i><time data-date-caption></time>
            </button>
            <div class="en-date-editor" id="psy-after-date-editor" data-date-editor hidden>
              <label class="en-sr" for="psy-after-date">Date de la séance</label>
              <input class="en-date" type="date" id="psy-after-date" data-date required>
            </div>
          </div>
        </div>
        <h3 class="en-heading" id="psy-after-entry-title"><span class="en-heading-label">Mon retour sur la séance<button type="button" class="en-help cursor-interaction" aria-label="À propos des deux façons d’écrire" aria-expanded="false" aria-controls="psy-after-information"><span aria-hidden="true">i</span></button></span></h3>
        <aside class="en-help-panel" id="psy-after-information" aria-label="Les deux façons d’écrire" aria-live="polite" hidden><p>Je peux utiliser les deux.</p></aside>
      </header>
      <section class="en-entry-composition" aria-labelledby="psy-after-entry-title">
        <div class="en-ways" aria-label="Ma façon de garder une trace">
          <button type="button" class="en-way cursor-interaction" data-mode="free" aria-pressed="false" aria-controls="psy-after-free"><i data-lucide="pen-line" aria-hidden="true"></i><span class="en-way-name">Écriture libre</span></button>
          <button type="button" class="en-way cursor-interaction" data-mode="guided" aria-pressed="false" aria-controls="psy-after-guided"><i data-lucide="list" aria-hidden="true"></i><span class="en-way-name">Par rubriques</span></button>
        </div>
      </section>
      <div class="en-writing" data-writing hidden>
        <div class="en-personal-meta">
          <div class="en-personal-row">
            <div class="en-title-centered">
              <label class="en-sr" for="psy-after-personal-title">Un titre pour ma séance</label>
              <input class="en-personal-title" id="psy-after-personal-title" data-personal-title placeholder="Un titre pour ma séance" maxlength="160">
              <span class="en-empty-title" aria-hidden="true"><i data-lucide="pen-line"></i><span>Un titre pour ma séance</span></span>
            </div>
            <button type="button" class="en-format-toggle cursor-interaction" data-format-toggle aria-label="Outils d’écriture" aria-expanded="false" aria-controls="psy-after-format-tools-panel" data-tooltip="Outils d’écriture">
              <span class="en-format-aa" aria-hidden="true">Aa</span>
              <i data-lucide="x" aria-hidden="true"></i>
            </button>
          </div>
          <div data-format-controls>
            <div data-format-tools></div>
            <p class="en-format-feedback" data-format-feedback role="status"></p>
          </div>
        </div>
        <div id="psy-after-free" data-pane="free" hidden>
          <div class="en-free-box" data-format-anchor>
            <div class="en-text" id="psy-after-free-text"></div>
          </div>
        </div>
        <div id="psy-after-guided" data-pane="guided" hidden>
          <nav class="en-rubric-nav" aria-label="Parcourir les rubriques">
            <button type="button" class="en-arrow cursor-interaction" data-rubric-prev aria-label="Rubrique précédente"><span><i data-lucide="chevron-left" aria-hidden="true"></i></span></button>
            <div class="en-rubric-title" data-format-anchor>
              <h4 data-rubric-title></h4><span class="en-count" data-rubric-count aria-live="polite" aria-atomic="true"></span>
            </div>
            <button type="button" class="en-arrow cursor-interaction" data-rubric-next aria-label="Rubrique suivante"><span><i data-lucide="chevron-right" aria-hidden="true"></i></span></button>
          </nav>
          <div data-rubric-editors></div>
        </div>
      </div>
      <div class="en-actions">
        <button type="button" class="en-main-action cursor-interaction" data-review>Mes mots à revoir</button>
        <button type="button" class="en-quiet-action cursor-interaction" data-later>Reprendre plus tard</button>
      </div>
      </div>
      <section class="en-reading en-recap" data-view="review" aria-labelledby="psy-after-recap-title" hidden>
        <header class="en-recap-header">
          <p class="en-recap-date-line"><i data-lucide="calendar-days" aria-hidden="true"></i><time data-reading-date></time></p>
          <div class="en-recap-title-row">
            <h3 class="en-heading" id="psy-after-recap-title" tabindex="-1">Récap de ma séance</h3>
            <button type="button" class="en-edit-return cursor-interaction" data-edit aria-label="Modifier" data-tooltip="Modifier"><i data-lucide="pen-line" aria-hidden="true"></i></button>
          </div>
          <details class="en-recap-title-wrap" data-reading-title-wrap hidden>
            <summary class="en-recap-return-title"><span data-reading-title></span></summary>
            <p class="en-recap-full-title" data-full-title></p>
          </details>
        </header>
        <section class="en-recap-return" data-recap-return hidden>
          <div data-reading-content></div>
        </section>
        <div class="en-actions en-review-actions">
          <button type="button" class="en-main-action en-confirm-session cursor-interaction" data-finish hidden><span>Confirmer ma séance</span><i data-lucide="house" aria-hidden="true"></i></button>
        </div>
      </section>
</div>`,
    format: `<section class="en-format-panel" data-format-panel id="psy-after-format-tools-panel" aria-label="Outils d’écriture" hidden>
      <div class="en-format-categories" role="group" aria-label="Catégories d’outils">
        <button type="button" class="cursor-interaction" data-category="text" aria-pressed="true">Texte</button>
        <button type="button" class="cursor-interaction" data-category="color" aria-pressed="false">Couleurs</button>
        <button type="button" class="cursor-interaction" data-category="paragraph" aria-pressed="false">Paragraphes</button>
        <button type="button" class="cursor-interaction" data-category="insert" aria-pressed="false">Insérer</button>
      </div>

      <div class="en-format-content" data-tools="text">
        <div class="en-format-marks" role="group" aria-label="Styles de texte">
          <button type="button" class="cursor-interaction" data-cmd="bold" aria-pressed="false" aria-label="Gras" data-tooltip="Gras"><strong>G</strong></button>
          <button type="button" class="cursor-interaction" data-cmd="italic" aria-pressed="false" aria-label="Italique" data-tooltip="Italique"><em>I</em></button>
          <button type="button" class="cursor-interaction" data-cmd="underline" aria-pressed="false" aria-label="Souligner" data-tooltip="Souligner"><u>S</u></button>
          <button type="button" class="cursor-interaction" data-cmd="strikeThrough" aria-pressed="false" aria-label="Barrer" data-tooltip="Barrer"><s>B</s></button>
          <button type="button" class="cursor-interaction" data-special="smallcaps" aria-label="Petites capitales" data-tooltip="Petites capitales"><span class="en-format-smallcaps">Aa</span></button>
        </div>
        <div class="en-format-settings">
          <label>Police
            <select aria-label="Police" data-change="fontName">
              <option value="" selected disabled>Choisir</option>
              <option value="EN Cormorant Garamond">Cormorant Garamond</option>
              <option value="Entre nous Newsreader">Newsreader</option>
              <option value="Caveat">Caveat</option>
            </select>
          </label>
          <label>Taille
            <select aria-label="Taille" data-change="fontSize">
              <option value="" selected disabled>Choisir</option>
              <option value="2">Petite</option>
              <option value="3">Normale</option>
              <option value="4">Grande</option>
              <option value="5">Très grande</option>
            </select>
          </label>
        </div>
        <button type="button" class="en-format-quiet cursor-interaction" data-cmd="removeFormat"><i data-lucide="eraser" aria-hidden="true"></i> Effacer la mise en forme</button>
      </div>

      <div class="en-format-content" data-tools="color" hidden>
        <div class="en-format-color-group">
          <p>Couleur du texte</p>
          <div class="en-format-swatches" role="group" aria-label="Couleur du texte">
            <button type="button" class="cursor-interaction" data-special="default-ink" data-value="default" style="--tone:var(--en-response-ink)" aria-label="Couleur d’origine" data-tooltip="Couleur d’origine"></button>
            <button type="button" class="cursor-interaction" data-cmd="foreColor" data-value="#ddb2ba" style="--tone:#ddb2ba" aria-label="Rose boisé" data-tooltip="Rose boisé"></button>
            <button type="button" class="cursor-interaction" data-cmd="foreColor" data-value="#c9b9e2" style="--tone:#c9b9e2" aria-label="Lilas" data-tooltip="Lilas"></button>
            <button type="button" class="cursor-interaction" data-cmd="foreColor" data-value="#e4c797" style="--tone:#e4c797" aria-label="Sable doré" data-tooltip="Sable doré"></button>
            <label class="en-format-custom" data-tooltip="Couleur personnalisée">
              <i data-lucide="pipette" aria-hidden="true"></i>
              <input type="color" value="#ddb2ba" aria-label="Couleur personnalisée" data-change="foreColor">
            </label>
          </div>
        </div>
        <div class="en-format-color-group">
          <p>Surligneur</p>
          <div class="en-format-swatches" role="group" aria-label="Surligneur">
            <button type="button" class="cursor-interaction" data-cmd="hiliteColor" data-value="#724657" style="--tone:#a2657d" aria-label="Rose poudré" data-tooltip="Rose poudré"></button>
            <button type="button" class="cursor-interaction" data-cmd="hiliteColor" data-value="#514262" style="--tone:#8c75a9" aria-label="Mauve" data-tooltip="Mauve"></button>
            <button type="button" class="cursor-interaction" data-cmd="hiliteColor" data-value="#5e4b32" style="--tone:#ab8756" aria-label="Miel" data-tooltip="Miel"></button>
            <button type="button" class="cursor-interaction" data-cmd="hiliteColor" data-value="#38534e" style="--tone:#65998e" aria-label="Sauge" data-tooltip="Sauge"></button>
            <button type="button" class="en-format-clear cursor-interaction" data-cmd="hiliteColor" data-value="transparent" aria-label="Retirer le surlignage" data-tooltip="Retirer le surlignage"><i data-lucide="eraser" aria-hidden="true"></i></button>
          </div>
        </div>
      </div>

      <div class="en-format-content" data-tools="paragraph" hidden>
        <div class="en-format-settings">
          <label>Style du paragraphe
            <select aria-label="Style du paragraphe" data-change="formatBlock">
              <option value="" selected disabled>Choisir</option>
              <option value="p">Paragraphe</option>
              <option value="h4">Titre</option>
              <option value="h5">Sous-titre</option>
              <option value="blockquote">Citation</option>
            </select>
          </label>
        </div>
        <div class="en-format-marks" role="group" aria-label="Alignement et retrait">
          <button type="button" class="cursor-interaction" data-cmd="justifyLeft" aria-label="Aligner à gauche" data-tooltip="Aligner à gauche"><i data-lucide="align-left" aria-hidden="true"></i></button>
          <button type="button" class="cursor-interaction" data-cmd="justifyCenter" aria-label="Centrer" data-tooltip="Centrer"><i data-lucide="align-center" aria-hidden="true"></i></button>
          <button type="button" class="cursor-interaction" data-cmd="justifyRight" aria-label="Aligner à droite" data-tooltip="Aligner à droite"><i data-lucide="align-right" aria-hidden="true"></i></button>
          <button type="button" class="cursor-interaction" data-cmd="outdent" aria-label="Réduire le retrait" data-tooltip="Réduire le retrait"><i data-lucide="indent-decrease" aria-hidden="true"></i></button>
          <button type="button" class="cursor-interaction" data-cmd="indent" aria-label="Augmenter le retrait" data-tooltip="Augmenter le retrait"><i data-lucide="indent-increase" aria-hidden="true"></i></button>
        </div>
        <div class="en-format-list-tools" role="group" aria-label="Listes">
          <button type="button" class="cursor-interaction" data-cmd="insertUnorderedList"><i data-lucide="list" aria-hidden="true"></i> Puces</button>
          <button type="button" class="cursor-interaction" data-cmd="insertOrderedList"><i data-lucide="list-ordered" aria-hidden="true"></i> Numéros</button>
          <button type="button" class="cursor-interaction" data-special="checklist"><i data-lucide="list-checks" aria-hidden="true"></i> À cocher</button>
        </div>
      </div>

      <div class="en-format-content" data-tools="insert" hidden>
        <div class="en-format-insert">
          <button type="button" class="cursor-interaction" data-reveal="link" aria-expanded="false" aria-controls="psy-after-format-link-form"><i data-lucide="link" aria-hidden="true"></i> Lien</button>
          <button type="button" class="cursor-interaction" data-special="date"><i data-lucide="calendar-days" aria-hidden="true"></i> Date</button>
          <button type="button" class="cursor-interaction" data-cmd="insertHorizontalRule"><i data-lucide="minus" aria-hidden="true"></i> Séparateur</button>
          <button type="button" class="cursor-interaction" data-reveal="emoji" aria-expanded="false" aria-controls="psy-after-format-symbols"><i data-lucide="smile" aria-hidden="true"></i> Symboles</button>
        </div>
        <form class="en-format-link" data-format-link id="psy-after-format-link-form" data-extra="link" hidden>
          <label>Adresse du lien<input name="address" type="url" inputmode="url" required placeholder="https://…"></label>
          <div>
            <button type="submit" class="en-format-quiet cursor-interaction">Insérer le lien</button>
            <button type="button" class="en-format-quiet cursor-interaction" data-cmd="unlink">Retirer le lien</button>
          </div>
          <p data-link-error role="alert" hidden>Utilise une adresse qui commence par https:// ou http://.</p>
        </form>
        <div class="en-format-marks" id="psy-after-format-symbols" data-extra="emoji" role="group" aria-label="Symboles à insérer" hidden>
          <button type="button" class="cursor-interaction" data-cmd="insertText" data-value="♡" aria-label="Cœur">♡</button>
          <button type="button" class="cursor-interaction" data-cmd="insertText" data-value="✦" aria-label="Étoile">✦</button>
          <button type="button" class="cursor-interaction" data-cmd="insertText" data-value="☾" aria-label="Lune">☾</button>
          <button type="button" class="cursor-interaction" data-cmd="insertText" data-value="🌿" aria-label="Branche">🌿</button>
          <button type="button" class="cursor-interaction" data-cmd="insertText" data-value="✨" aria-label="Étincelles">✨</button>
        </div>
      </div>

      <footer class="en-format-history">
        <output aria-label="Nombre de mots" data-word-count></output>
        <button type="button" class="cursor-interaction" data-cmd="undo" aria-label="Annuler la dernière modification" data-tooltip="Annuler"><i data-lucide="undo-2" aria-hidden="true"></i></button>
        <button type="button" class="cursor-interaction" data-cmd="redo" aria-label="Rétablir la modification" data-tooltip="Rétablir"><i data-lucide="redo-2" aria-hidden="true"></i></button>
      </footer>
    </section>`,
    reperes: `<fieldset class="en-reperes">
    <legend data-prompt></legend>
    <div class="en-choices" data-choices></div>
  </fieldset>`,
    choice: `<label class="en-choice cursor-interaction">
    <input type="checkbox">
    <span class="en-marker" aria-hidden="true"></span>
    <span data-choice-label></span>
  </label>`,
    list: `<div class="en-writing">
    <ul class="en-bullets" role="list" data-bullets></ul>
    <button type="button" class="en-quiet en-add-bullet cursor-interaction" data-new-bullet>
      <span class="en-plus" aria-hidden="true">+</span><span data-add-label></span>
    </button>
  </div>`,
    prose: `<div class="en-writing en-reflection">
    <div class="en-prose" data-response></div>
  </div>`,
    source: `<div class="en-note-tools" data-note-tools>
    <button type="button" class="en-quiet en-sheet-toggle cursor-interaction" data-notes-toggle aria-expanded="false">
      <span class="en-book" aria-hidden="true"><i data-lucide="book-open"></i></span>
      <span data-source-title></span>
      <span class="en-chevron" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
    </button>
    <div class="en-note-sheet" data-note-pane hidden>
      <div data-groups></div>
      <button type="button" class="en-quiet en-import cursor-interaction" data-import disabled>Ajouter aux puces</button>
    </div>
    <div class="en-status" role="status" data-status></div>
  </div>`,
  };

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  const rubrics = [
    {
      id: 'aborde',
      title: 'Ce que nous avons abordé',
      placeholder: 'Les sujets dont nous avons parlé…',
      list: { add: 'Ajouter un sujet', item: 'Sujet', next: 'Un autre sujet dont nous avons parlé…' },
      source: { kind: 'prepared', title: 'Mes sujets préparés' }
    },
    {
      id: 'mots',
      title: 'Les mots qui m’ont marquée',
      placeholder: 'Une phrase, une question, des mots qui résonnent encore…',
      choices: { prompt: 'Qu’est-ce qui t’est resté ?', labels: ['Un mot', 'Une phrase', 'Une question', 'Une métaphore'] },
      list: { add: 'Ajouter une puce', item: 'Puce', next: 'D’autres mots qui me reviennent…', label: 'Les mots que je garde' },
      source: { kind: 'notes', title: 'Mes notes de séance' }
    },
    {
      id: 'pendant',
      title: 'Comment je me suis sentie pendant la séance',
      placeholder: 'Ce qui m’a aidée à parler et les moments où c’était plus difficile…',
      choices: { prompt: 'Pendant l’échange, je me suis sentie…', labels: ['Écoutée', 'En confiance', 'Sur la retenue', 'Tendue'] }
    },
    {
      id: 'apres',
      title: 'Mon ressenti après la séance',
      placeholder: 'Ce que je ressens, même si c’est encore difficile à nommer…',
      choices: { prompt: 'Après la séance, je me sens…', labels: ['Apaisée', 'Soulagée', 'Remuée', 'Fatiguée', 'Un peu perdue'] }
    },
    {
      id: 'compris',
      title: 'Ce que je comprends mieux',
      placeholder: 'Ce qui est devenu plus clair pour moi…',
      list: { add: 'Ajouter une idée', item: 'Idée', next: 'Autre chose qui s’est éclaircie…' }
    },
    {
      id: 'flou',
      title: 'Ce qui reste difficile ou flou',
      placeholder: 'Ce qui me travaille encore après cette séance…',
      choices: { prompt: 'Ce qui reste pour moi…', labels: ['Difficile à vivre', 'Difficile à comprendre', 'Encore difficile à nommer'] }
    },
    {
      id: 'de-cote',
      title: 'Ce que je n’ai pas abordé',
      placeholder: 'Un sujet resté de côté, une question que je n’ai pas posée…',
      list: { add: 'Ajouter un sujet', item: 'Sujet', next: 'Un autre sujet resté de côté…' },
      source: { kind: 'remaining', title: 'Mes sujets préparés' }
    },
    {
      id: 'suite',
      title: 'Ce que j’aimerais explorer ensuite',
      placeholder: 'Un sujet que j’aimerais approfondir à mon rythme…',
      list: { add: 'Ajouter une piste', item: 'Piste', next: 'Une autre piste à explorer…' },
      source: { kind: 'follow-up', title: 'Reprendre une piste', action: 'Ajouter à mes pistes' }
    }
  ];
  const longDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' });
  const weekdayDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeZone: 'UTC' });
  const shortDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function mountGuided(scope, prefix, excerpts, prepared, saved, onChange) {
    const get = selector => scope.querySelector(selector);
    const panelsContainer = get('[data-rubric-editors]');
    const title = get('[data-rubric-title]');
    const count = get('[data-rubric-count]');
    const previous = get('[data-rubric-prev]');
    const next = get('[data-rubric-next]');
    function clone(name) {
      return template(name);
    }

    function textKey(text) {
      return text.normalize('NFC').trim().toLocaleLowerCase('fr');
    }

    function fillChoices(panel, choices, selected) {
      panel.append(clone('reperes'));
      panel.querySelector('[data-prompt]').textContent = choices.prompt;
      const container = panel.querySelector('[data-choices]');
      const labels = [...choices.labels, ...selected.filter(value =>
        !choices.labels.some(label => textKey(value) === textKey(label)))];
      for (const label of labels) {
        const choice = clone('choice');
        choice.querySelector('[data-choice-label]').textContent = label;
        const savedLabel = selected.find(value => textKey(value) === textKey(label));
        const input = choice.querySelector('input');
        input.value = savedLabel || label;
        input.checked = Boolean(savedLabel);
        container.append(choice);
      }
    }

    function wireReflection(panel, rubric) {
      panel.append(clone('prose'));
      const field = panel.querySelector('[data-response]');
      richWriting.prepareField(field, rubric.placeholder, rubric.title);
      return {
        entries: () => [richWriting.read(field)].filter(entry => entry.text.trim()),
        restore: (paragraphs, rich) => richWriting.write(field, paragraphs[0], rich?.[0]),
      };
    }

    function wireBullets(panel, rubric) {
      panel.append(clone('list'));
      const list = panel.querySelector('[data-bullets]');
      const add = panel.querySelector('[data-new-bullet]');
      panel.querySelector('[data-add-label]').textContent = rubric.list.add;
      list.setAttribute('aria-label', rubric.list.label ?? rubric.title);
      const fields = [];

      function appendBullet(value = '', html = '') {
        const index = fields.length;
        const item = element('li', 'en-bullet');
        const field = element('div');
        richWriting.prepareField(field, index === 0 ? rubric.placeholder : rubric.list.next,
          rubric.list.item + ' ' + (index + 1));
        richWriting.write(field, value, html);
        item.append(field);
        list.append(item);
        fields.push(field);
        return field;
      }

      appendBullet();
      add.addEventListener('click', () => {
        const last = fields.at(-1);
        const field = richWriting.read(last).text.trim() ? appendBullet() : last;
        field.focus();
      });

      function entries() {
        return fields.map(richWriting.read).filter(entry => entry.text.trim());
      }

      function appendTexts(texts) {
        const existing = new Set(entries().map(entry => textKey(entry.text)));
        const additions = [];
        for (const text of texts) {
          const key = textKey(text);
          if (existing.has(key)) continue;
          existing.add(key);
          additions.push(text);
        }
        const addedCount = additions.length;
        const last = fields.at(-1);
        if (addedCount && !richWriting.read(last).text.trim()) richWriting.write(last, additions.shift());
        for (const text of additions) appendBullet(text);
        return addedCount;
      }
      function restore(paragraphs, rich) {
        if (!paragraphs.length) return;
        richWriting.write(fields[0], paragraphs[0], rich?.[0]);
        for (let i = 1; i < paragraphs.length; i++) appendBullet(paragraphs[i], rich?.[i]);
      }
      return { entries, appendTexts, restore };
    }

    function wireSource(panel, rubric, writing, getGroups) {
      panel.append(clone('source'));
      const tools = panel.querySelector('[data-note-tools]');
      tools.dataset.sourceKind = rubric.source.kind;
      const pane = tools.querySelector('[data-note-pane]');
      const toggle = tools.querySelector('[data-notes-toggle]');
      const status = tools.querySelector('[data-status]');
      const groupsContainer = pane.querySelector('[data-groups]');
      const add = pane.querySelector('[data-import]');
      tools.querySelector('[data-source-title]').textContent = rubric.source.title;
      if (rubric.source.action) add.textContent = rubric.source.action;
      pane.id = prefix + '-' + rubric.id + '-source';
      toggle.setAttribute('aria-controls', pane.id);

      const passages = [];
      let rendered = '';
      const isSelected = passage => passage.getAttribute('aria-pressed') === 'true';

      function setOpen(open) {
        pane.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        if (open) status.textContent = '';
      }

      toggle.addEventListener('click', () => setOpen(pane.hidden));
      add.addEventListener('click', () => {
        const selected = passages.filter(isSelected);
        if (!selected.length) return;
        const added = writing.appendTexts(selected.map(passage => passage.textContent));
        if (added) onChange();
        for (const passage of selected) passage.setAttribute('aria-pressed', 'false');
        add.disabled = true;
        setOpen(false);
        toggle.focus();
        const messages = ['Ces mots figurent déjà dans les puces.', 'Une puce ajoutée.'];
        status.textContent = messages[added] ?? added + ' puces ajoutées.';
      });

      return () => {
        const seen = new Set();
        const groups = getGroups().map(({ title, values }) => ({
          title,
          values: values.filter(value => {
            const key = textKey(value);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
        })).filter(group => group.values.length);
        tools.hidden = groups.length === 0;
        if (tools.hidden) setOpen(false);
        const signature = JSON.stringify(groups);
        if (signature === rendered) return;
        rendered = signature;

        const marked = new Set(passages.filter(isSelected).map(passage => textKey(passage.textContent)));
        groupsContainer.replaceChildren();
        passages.length = 0;
        for (const group of groups) {
          const block = document.createElement('div');
          const heading = document.createElement('p');
          const list = document.createElement('ul');
          block.className = 'en-source-group';
          heading.className = 'en-notes-label';
          heading.textContent = group.title;
          list.className = 'en-passages';
          list.setAttribute('role', 'list');
          block.append(heading, list);
          for (const value of group.values) {
            const item = document.createElement('li');
            const passage = document.createElement('button');
            const text = document.createElement('span');
            passage.type = 'button';
            passage.className = 'en-passage cursor-interaction';
            passage.setAttribute('aria-pressed', String(marked.has(textKey(value))));
            text.textContent = value;
            passage.append(text);
            item.append(passage);
            list.append(item);
            passages.push(passage);
            passage.addEventListener('click', () => {
              passage.setAttribute('aria-pressed', String(!isSelected(passage)));
              add.disabled = !passages.some(isSelected);
            });
          }
          groupsContainer.append(block);
        }
        add.disabled = !passages.some(isSelected);
      };
    }

    function createPanel(rubric) {
      const panel = document.createElement('div');
      panel.hidden = true;
      panelsContainer.append(panel);
      if (rubric.choices) fillChoices(panel, rubric.choices, saved[rubric.id]?.choices || []);
      const writing = rubric.list ? wireBullets(panel, rubric) : wireReflection(panel, rubric);
      return { panel, rubric, writing };
    }

    const panels = rubrics.map(createPanel);
    const entries = new Map(panels.map(entry => [entry.rubric.id, entry]));
    function fromRubric(id) {
      const entry = entries.get(id);
      return { title: entry.rubric.title, values: entry.writing.entries().map(item => item.text) };
    }

    const sources = {
      notes: () => [{ title: 'Mes notes de séance', values: excerpts }],
      prepared: () => [{ title: 'Mes sujets préparés', values: prepared.map(topic => topic.text) }],
      remaining: () => {
        const discussed = new Set(entries.get('aborde').writing.entries().map(item => textKey(item.text)));
        return [{ title: 'Mes sujets préparés', values: prepared
          .filter(topic => !topic.checked && !discussed.has(textKey(topic.text))).map(topic => topic.text) }];
      },
      'follow-up': () => [fromRubric('flou'), fromRubric('de-cote')]
    };
    for (const entry of panels) {
      const { panel, rubric, writing } = entry;
      const record = saved[rubric.id];
      if (record) writing.restore(record.paragraphs || [], record.rich);
      if (rubric.source) entry.refresh = wireSource(panel, rubric, writing, sources[rubric.source.kind]);
    }

    let activeIndex = 0;
    function showRubric(index) {
      if (index < 0 || index >= panels.length) return;
      panels[activeIndex].panel.hidden = true;
      activeIndex = index;
      const entry = panels[index];
      entry.panel.hidden = false;
      entry.refresh?.();
      title.textContent = entry.rubric.title;
      count.textContent = (index + 1) + '/' + panels.length;
      previous.disabled = index === 0;
      next.disabled = index === panels.length - 1;
    }
    previous.addEventListener('click', () => { showRubric(activeIndex - 1); onChange(); });
    next.addEventListener('click', () => { showRubric(activeIndex + 1); onChange(); });
    showRubric(Number.isInteger(saved.index) ? Math.min(panels.length - 1, Math.max(0, saved.index)) : 0);

    function sections() {
      return panels.map(({ panel, rubric, writing }) => {
        const contents = writing.entries();
        const html = contents.map(entry => entry.html);
        return {
          id: rubric.id,
          title: rubric.title,
          bullets: Boolean(rubric.list),
          paragraphs: contents.map(entry => entry.text),
          choices: [...panel.querySelectorAll('[data-choices] input:checked')].map(input => input.value),
          rich: html.some(Boolean) ? html : undefined,
        };
      }).filter(entry => entry.paragraphs.length || entry.choices.length);
    }
    return { sections, index: () => activeIndex };
  }

  function template(name, prefix = 'psy-after') {
    const node = document.createElement('template');
    node.innerHTML = templates[name].replaceAll('psy-after-', prefix + '-');
    return node.content.cloneNode(true);
  }

  const dayKey = date => [
    String(date.getFullYear()).padStart(4, '0'), String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
  const dayValue = date => new Date(date + 'T12:00:00Z');
  const validDay = date => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    Number.isFinite(+dayValue(date)) && dayValue(date).toISOString().slice(0, 10) === date;
  const fullLabel = date => {
    const label = weekdayDate.format(dayValue(date));
    return label[0].toLocaleUpperCase('fr-FR') + label.slice(1);
  };
  const newId = () => globalThis.crypto.randomUUID();
  const strings = values => values.filter(value => typeof value === 'string' && value.trim());
  const words = (session, key) => session.rubrics[key]?.paragraphs || [];
  const calendarKey = (event, date) => 'cal:' + event.id + (event.rep ? ':' + (event.originalDate || date) : '');
  const calendarTime = event => event.h == null ? null :
    String(event.h).padStart(2, '0') + ':' + String(event.mi || 0).padStart(2, '0');
  const occurrenceOf = (event, date) => ({ date, key: calendarKey(event, date), time: calendarTime(event) });
  function newSession(date, fields = {}) {
    return { id: newId(), date, title: '', free: '', rubrics: {}, mode: 'guided', index: 0,
      notes: [], topics: [], extras: [], ...fields };
  }

  function calendarOccurrences(calendar, now) {
    const out = [];
    for (const event of calendar) {
      if (event?.t !== 'psy') continue;
      const [year, monthIndex, day] = [event.y, event.m, event.d].map(Number);
      const start = new Date(year, monthIndex, day, event.h ?? 0, event.mi ?? 0);
      if (!Number.isFinite(+start) || start.getDate() !== day) continue;
      const add = date => {
        const original = dayKey(date);
        const move = event.psyMoves?.[original];
        if (move && dayValue(move.date) > now) return;
        out.push(occurrenceOf({ ...event, ...move, originalDate: original }, move?.date || original));
      };
      if (event.rep === 3) {
        for (let offset = 0; ; offset++) {
          const month = new Date(year, monthIndex + offset, 1);
          if (month > now) break;
          const date = new Date(year, monthIndex + offset, day, event.h ?? 0, event.mi ?? 0);
          if (date <= now && date.getMonth() === month.getMonth()) add(date);
        }
      } else if (event.rep === 1 || event.rep === 2) {
        for (const date = new Date(start); date <= now; date.setDate(date.getDate() + 7 * event.rep)) add(date);
      } else if (start <= now) add(start);
      for (const [original, move] of Object.entries(event.psyMoves || {})) {
        if (dayValue(original) > now && dayValue(move.date) <= now)
          out.push(occurrenceOf({ ...event, ...move, originalDate: original }, move.date));
      }
    }
    return out;
  }

  function legacyDate(record) {
    if (validDay(record.date)) return record.date;
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const match = String(record.jl || '').toLowerCase().match(/\b(\d{1,2})\s+([\p{L}]+)(?:\s+(\d{4}))?/u);
    const month = match && months.indexOf(match[2]);
    const year = match && Number(match[3] || record.y || String(record.mo || '').match(/\b\d{4}\b/)?.[0]);
    if (!match || month < 0 || !year) return null;
    const date = dayKey(new Date(year, month, Number(match[1])));
    return validDay(date) ? date : null;
  }

  function modeContext(legacy) {
    const subjects = legacy.msSubjects || [];
    return {
      topics: subjects.filter(subject => subject.t?.trim()).map(subject => ({
        text: subject.t, checked: Boolean(legacy.msCk?.[subject.id]),
      })),
      notes: Object.entries(legacy.msNotes || {}).flatMap(([id, entries]) =>
        (Array.isArray(entries) ? entries : []).filter(row => row[1]?.trim()).map(([time, text]) => ({
          label: subjects.find(subject => String(subject.id) === id)?.t || '', time, text,
        }))),
    };
  }

  function legacyReturn(ap = {}) {
    const by = (values, choices = []) => ({ paragraphs: strings(values), choices });
    return {
      free: typeof ap.vrac === 'string' ? ap.vrac : '',
      rubrics: {
        aborde: by([...Object.values(ap.parler?.txt || {}), ap.parler?.plus, ...(ap.parler?.extra || [])]),
        mots: by([ap.retiens?.a]),
        compris: by([ap.retiens?.b, ap.retiens?.c]),
        apres: by([ap.ressens?.mots], Array.isArray(ap.ressens?.sel) ? ap.ressens.sel : []),
      },
      extras: strings((ap.pasAdded || []).map(item => item.t)),
    };
  }

  function hasContent(session) {
    return Boolean(session.free?.trim() || session.extras?.length ||
      Object.values(session.rubrics || {}).some(section => section.paragraphs?.length || section.choices?.length));
  }

  function migrate(state, history, legacy) {
    if (state.migrated) return false;
    for (const old of history) {
      const date = legacyDate(old);
      if (!date) continue;
      const checked = new Set(old.afterId ? [] : old.suj || []);
      const session = newSession(date, {
        ...(old.afterId ? { id: old.afterId } : {}),
        title: old.q === 'Mon retour sur la séance' ? '' : old.q || '',
        historyId: old.id, completed: true,
        topics: [...new Set([...(old.prev || []), ...checked])].map(text => ({ text, checked: checked.has(text) })),
        notes: (old.notes || []).map(([label, time, text]) => ({ label, time, text })),
        rubrics: {
          aborde: { paragraphs: strings(old.afterId && old.suj?.length ? old.suj : [old.apres?.parler]), choices: [] },
          compris: { paragraphs: strings([old.apres?.retiens]), choices: [] },
          apres: { paragraphs: strings([old.apres?.ressens]), choices: [] },
        },
        extras: strings([old.apres?.pas]),
      });
      state.sessions.push(session);
    }
    const date = legacy.sessionDate || legacy.ap?.date;
    const before = legacyReturn(legacy.ap);
    if (validDay(date) && (legacy.msDone || hasContent(before))) {
      const existing = legacy.ap?.saved && state.sessions.find(item => item.historyId === legacy.ap.sessionId);
      if (existing) {
        if (before.free.trim()) existing.free = before.free;
        for (const [key, value] of Object.entries(before.rubrics)) {
          if (value.paragraphs.length || value.choices.length) existing.rubrics[key] = value;
        }
        if (before.extras.length) existing.extras = before.extras;
      } else {
        state.sessions.push(newSession(date, { ...before, ...modeContext(legacy),
          mode: before.free.trim() ? 'free' : 'guided', completed: Boolean(legacy.ap?.saved), fromMode: true }));
      }
    }
    state.migrated = true;
    return true;
  }

  function syncCalendar(state, calendar, now, history = []) {
    const occurrences = calendarOccurrences(calendar, now);
    const active = new Set(occurrences.map(item => item.key));
    for (const item of state.sessions) {
      if (!item.calendarKey || active.has(item.calendarKey)) continue;
      const [, id, original] = item.calendarKey.split(':');
      const event = calendar.find(entry => entry.t === 'psy' && String(entry.id) === id);
      if (!event) continue;
      const nominal = original || item.calendarDate;
      const day = new Date(nominal + 'T23:59:59');
      const eventDay = new Date(event.y, event.m, event.d);
      const move = event.psyMoves?.[original];
      const occurrence = event.rep ? move ? occurrenceOf({ ...event, ...move, originalDate: original }, move.date) :
        calendarOccurrences([event], day).find(entry => entry.key === item.calendarKey) :
        Number.isFinite(+eventDay) && eventDay.getDate() === Number(event.d) && occurrenceOf(event, dayKey(eventDay));
      if (occurrence) {
        occurrences.push(occurrence);
        active.add(occurrence.key);
      }
    }
    const deleted = new Set(state.deletedCalendarKeys || []);
    const occurrenceCounts = new Map();
    for (const { date } of occurrences) occurrenceCounts.set(date, (occurrenceCounts.get(date) || 0) + 1);
    let changed = false;
    for (const { date, key, time } of occurrences) {
      if (deleted.has(key)) continue;
      const current = state.sessions.find(item => item.calendarKey === key);
      if (current) {
        if (current.calendarDate !== date) {
          setDate(current, date, history, { calendarDate: date });
          changed = true;
        }
        if (current.calendarTime !== time) { current.calendarTime = time; changed = true; }
        continue;
      }
      const candidates = occurrenceCounts.get(date) === 1 ?
        state.sessions.filter(item => item.date === date && !item.calendarKey && (item.fromMode || item.historyId)) : [];
      const match = candidates.length === 1 && candidates[0];
      if (match) Object.assign(match, { calendarKey: key, calendarDate: date, calendarTime: time });
      else state.sessions.push(newSession(date, { calendarKey: key, calendarDate: date, calendarTime: time }));
      changed = true;
    }
    const filtered = state.sessions.filter(item => !item.calendarKey || active.has(item.calendarKey) ||
      item.completed || item.title.trim() || hasContent(item) || item.fromMode || item.modeDraft || item.preparation);
    if (filtered.length !== state.sessions.length) {
      state.sessions = filtered;
      changed = true;
    }
    return changed;
  }

  let state;
  let controller;
  function save() {
    return globalThis.__vaultAutosave?.() ?? globalThis.__vaultPushNow?.();
  }
  function prepare(legacy, history, calendar) {
    state ||= globalThis.__enKeep('psy-after-v1', { version: 1, sessions: [], migrated: false });
    let changed = migrate(state, history, legacy);
    for (const session of state.sessions) {
      if (!session.completed || history.some(record => record.id === session.historyId || record.afterId === session.id)) continue;
      updateHistory(history, session);
      changed = true;
    }
    if (syncCalendar(state, calendar, new Date(), history) || changed) save();
    return state.sessions;
  }

  function appointment(next, create = false, persist = true) {
    if (!next) return null;
    const date = dayKey(next.dt);
    const key = calendarKey(next.e, date);
    if (state.deletedCalendarKeys?.includes(key)) return null;
    const existing = state.sessions.find(item => item.calendarKey === key);
    if (existing || !create) return existing || null;
    const fields = { calendarKey: key, calendarDate: date, calendarTime: calendarTime(next.e) };
    const session = newSession(date, fields);
    state.sessions.push(session);
    if (persist) save();
    return session;
  }

  function migrateModeDraft(draft) {
    if (!draft) return null;
    const date = validDay(draft.date) ? draft.date : dayKey(new Date());
    const candidates = state.sessions.filter(item => item.date === date && !item.completed && !item.fromMode && !item.modeDraft);
    const session = candidates.length === 1 ? candidates[0] : newSession(date);
    if (candidates.length !== 1) state.sessions.push(session);
    session.modeDraft = { ...draft, date };
    return session;
  }

  function createModeSession(date) {
    const session = newSession(date);
    state.sessions.push(session);
    return session;
  }

  function restoreArchive(record) {
    if (!record) return null;
    const existing = state.sessions.find(item => item.id === record.afterId || item.historyId === record.id);
    if (existing) return existing.completed ? existing : null;
    const recovered = { sessions: [] };
    migrate(recovered, [record], {});
    const [session] = recovered.sessions;
    if (session) { state.sessions.push(session); save(); }
    return session;
  }

  function recordMode(previous, current, history, calendar, id, draft) {
    prepare(previous, history, calendar);
    const date = current.sessionDate;
    const session = id ? state.sessions.find(item => item.id === id) :
      state.sessions.find(item => item.date === date && item.calendarKey && !item.fromMode && !item.completed);
    const context = { ...modeContext(current), fromMode: true };
    if (session) {
      if (draft && session.fromMode) {
        const topics = new Map(session.topics.map(topic => [topic.text, topic]));
        for (const topic of context.topics) topics.set(topic.text, topic);
        context.topics = [...topics.values()];
        const previousNote = session.finishedModeDraft?.note?.trim();
        const notes = [...session.notes];
        if (previousNote) {
          const index = notes.findLastIndex(note => note.text === previousNote);
          if (index !== -1) notes.splice(index, 1);
        }
        context.notes = [...notes, ...context.notes.filter(note => !notes.some(existing => existing.text === note.text))];
      }
      Object.assign(session, context);
      if (draft) session.finishedModeDraft = draft;
    }
    else state.sessions.push(newSession(date, context));
    save();
  }

  function toHistory(session) {
    const [year, , day] = session.date.split('-').map(Number);
    const locale = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    const emotion = session.rubrics.apres?.choices || [];
    return {
      id: session.historyId || 'apres-' + session.id, afterId: session.id, date: session.date,
      y: year, mo: locale.format(dayValue(session.date)).toUpperCase(),
      j: fullLabel(session.date).split(' ')[0].toUpperCase() + ' ' + day, jl: fullLabel(session.date),
      q: session.title.trim() || words(session, 'mots')[0] || 'Mon retour sur la séance',
      emo: emotion.map(text => text.toLocaleLowerCase('fr-FR')), star: emotion[0]?.toLocaleLowerCase('fr-FR') || '',
      suj: words(session, 'aborde'), prev: session.topics.map(topic => topic.text),
      notes: session.notes.map(note => ['MES NOTES', note.time || '', note.text]),
      apres: { parler: words(session, 'aborde').join('\n'), retiens: words(session, 'compris').join('\n'),
        ressens: [...emotion, ...words(session, 'apres')].join('\n'), pas: session.extras.join('\n') },
    };
  }

  function updateHistory(history, session) {
    const record = toHistory(session);
    const index = history.findIndex(item => item.id === record.id);
    if (index < 0) history.unshift(record);
    else history[index] = record;
  }

  function setDate(session, date, history, fields = {}) {
    if (!validDay(date)) return;
    Object.assign(session, fields, { date });
    if (session.modeDraft) session.modeDraft.date = date;
    if (session.finishedModeDraft) session.finishedModeDraft.date = date;
    if (session.completed) {
      const existing = history.find(record => record.id === session.historyId || record.afterId === session.id);
      if (existing) {
        const { y, mo, j, jl } = toHistory(session);
        Object.assign(existing, { date, y, mo, j, jl });
      } else updateHistory(history, session);
    }
  }

  function deleteSession(state, history, session) {
    const index = state.sessions.findIndex(item => item.id === session.id);
    if (index === -1) return false;
    if (session.calendarKey) {
      state.deletedCalendarKeys ||= [];
      if (!state.deletedCalendarKeys.includes(session.calendarKey)) state.deletedCalendarKeys.push(session.calendarKey);
    }
    state.sessions.splice(index, 1);
    const historyId = session.historyId || 'apres-' + session.id;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].id === historyId || history[i].afterId === session.id) history.splice(i, 1);
    }
    return true;
  }

  function mountEditor(host, session, onHome, onFinish, onConfirm, onViewChange, archive) {
    const prefix = 'psy-after-' + session.id;
    const editor = template('editor', prefix).firstElementChild;
    const get = selector => editor.querySelector(selector);
    const modeButtons = [...editor.querySelectorAll('[data-mode]')];
    const dateInput = get('[data-date]');
    const dateToggle = get('[data-date-toggle]');
    const dateEditor = get('[data-date-editor]');
    const personalTitle = get('[data-personal-title]');
    const free = get('[data-pane="free"] .en-text');
    const formatToggle = get('[data-format-toggle]');
    const formatControls = get('[data-format-controls]');
    const edit = get('[data-edit]');
    const finish = get('[data-finish]');
    const later = get('[data-later]');
    const review = get('[data-review]');
    const help = get('.en-help');
    const helpPanel = get('.en-help-panel');
    let view = 'write';
    dateInput.max = [session.date, dayKey(new Date())].sort().at(-1);
    dateInput.value = session.date;
    personalTitle.value = session.title;
    richWriting.prepareField(free, 'Ce que j’ai envie de garder de cette séance…', 'Mon retour sur la séance');
    richWriting.write(free, session.free, session.freeHtml);
    get('[data-format-tools]').append(template('format', prefix));

    const guided = mountGuided(get('[data-pane="guided"]'), prefix,
      session.notes.map(note => note.text), session.topics,
      { ...session.rubrics, index: session.index }, update);
    const formatting = richWriting.mount(editor, update);

    function dateDisplay() {
      const display = dayValue(session.date);
      for (const [selector, label] of [['[data-date-caption]', shortDate], ['[data-reading-date]', longDate]]) {
        const time = get(selector);
        time.setAttribute('datetime', session.date);
        time.textContent = label.format(display);
      }
      dateToggle.setAttribute('aria-label', 'Modifier la date de la séance du ' + longDate.format(display));
    }
    function controls() {
      personalTitle.closest('.en-title-centered').classList.toggle('en-has-title', Boolean(session.title.trim()));
      finish.hidden = !session.completed && !hasContent(session);
      later.textContent = session.completed ? 'Revenir au récapitulatif' : 'Reprendre plus tard';
      later.hidden = archive;
      review.textContent = archive ? 'Enregistrer' : 'Mes mots à revoir';
    }
    function update() {
      const sections = guided.sections();
      const next = Object.fromEntries(sections.map(({ id, paragraphs, choices, rich }) => [id, { paragraphs, choices, rich }]));
      const current = JSON.stringify([session.title, session.free, session.freeHtml || '', session.rubrics]);
      const freeContent = richWriting.read(free);
      session.title = personalTitle.value;
      session.free = freeContent.text;
      if (freeContent.html) session.freeHtml = freeContent.html;
      else delete session.freeHtml;
      session.rubrics = next;
      session.index = guided.index();
      if (current !== JSON.stringify([session.title, session.free, freeContent.html, next])) {
        if (archive) onFinish(session);
        else session.completed = false;
      }
      formatting.refresh();
      controls();
      save();
    }
    function selectMode(mode) {
      session.mode = mode;
      get('[data-writing]').hidden = false;
      for (const button of modeButtons) button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
      for (const pane of editor.querySelectorAll('[data-pane]')) pane.hidden = pane.dataset.pane !== mode;
      formatting.close();
      const pane = get('[data-pane]:not([hidden])');
      pane.querySelector('[data-format-anchor]').append(formatToggle);
      (mode === 'guided' ? pane.querySelector('.en-rubric-nav') : pane.querySelector('.en-free-box')).after(formatControls);
      formatting.refresh();
    }
    function setHelp(open) {
      helpPanel.hidden = !open;
      help.setAttribute('aria-expanded', String(open));
    }
    function setDate(open) {
      dateEditor.hidden = !open;
      dateToggle.setAttribute('aria-expanded', String(open));
      if (open) dateInput.focus();
      else dateInput.value = session.date;
    }
    function show(next) {
      view = next;
      onViewChange(next);
      for (const panel of editor.querySelectorAll('[data-view]')) panel.hidden = panel.dataset.view !== next;
      setHelp(false);
      setDate(false);
      formatting.close();
      host.closest('.phone')?.scrollTo({ top: 0 });
    }
    function showRecap() {
      const sections = guided.sections();
      if (session.free.trim()) sections.unshift({ title: 'Écriture libre', paragraphs: [session.free], choices: [], rich: [session.freeHtml] });
      if (session.extras.length) sections.push({ title: 'Mes petits pas', paragraphs: session.extras, choices: [], bullets: true });
      const content = get('[data-reading-content]');
      content.replaceChildren();
      const title = session.title.trim();
      const titleWrap = get('[data-reading-title-wrap]');
      titleWrap.hidden = !title;
      titleWrap.open = false;
      get('[data-recap-return]').hidden = !sections.length;
      get('[data-reading-title]').textContent = title || 'Mon retour sur la séance';
      get('[data-full-title]').textContent = title || 'Mon retour sur la séance';
      for (const entry of sections) {
        const section = element('section', 'en-recap-rubric');
        const heading = element('h4');
        const numeral = romanNumerals[rubrics.findIndex(rubric => rubric.id === entry.id)];
        if (numeral) {
          heading.className = 'en-recap-numbered-heading';
          const number = element('span', 'en-recap-rubric-number', numeral);
          number.setAttribute('aria-hidden', 'true');
          heading.append(number, element('span', '', entry.title));
        } else {
          heading.textContent = entry.title;
        }
        section.append(heading);
        if (entry.choices.length) {
          const choices = element('ul', 'en-recap-reperes');
          choices.setAttribute('aria-label', 'Repères retenus');
          choices.setAttribute('role', 'list');
          for (const choice of entry.choices) {
            const item = element('li');
            item.append(element('span', 'en-recap-repere-label', choice));
            choices.append(item);
          }
          section.append(choices);
        }
        const body = entry.bullets ? element('ul', 'en-recap-words') : section;
        if (entry.bullets) body.setAttribute('role', 'list');
        entry.paragraphs.forEach((paragraph, index) => {
          const html = entry.rich?.[index];
          const node = element(entry.bullets ? 'li' : html ? 'div' : 'p', entry.bullets ? '' : 'en-recap-words');
          if (html) node.classList.add('en-formatted');
          richWriting.write(node, paragraph, html, true);
          body.append(node);
        });
        if (entry.bullets && entry.paragraphs.length) section.append(body);
        content.append(section);
      }
      show('review');
      get('.en-recap-header .en-heading').focus({ preventScroll: true });
    }
    function changeDate() {
      if (!dateInput.validity.valid || !validDay(dateInput.value) || dateInput.value === session.date) return;
      session.date = dateInput.value;
      if (archive) onFinish(session);
      else session.completed = false;
      dateDisplay();
      controls();
      save();
    }
    personalTitle.addEventListener('input', update);
    editor.addEventListener('change', event => {
      if (event.target.matches('[data-choices] input')) update();
    });
    editor.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      if (!dateEditor.hidden) { setDate(false); dateToggle.focus(); }
      else if (!helpPanel.hidden) { setHelp(false); help.focus(); }
    });
    dateInput.addEventListener('change', changeDate);
    dateInput.addEventListener('input', changeDate);
    dateToggle.addEventListener('click', () => setDate(dateEditor.hidden));
    help.addEventListener('click', () => setHelp(helpPanel.hidden));
    for (const button of modeButtons) button.addEventListener('click', () => { selectMode(button.dataset.mode); save(); });
    async function saveRecap() {
      try { await save(); if (editor.isConnected) showRecap(); }
      catch { /* Le coffre affiche l’erreur et laisse l’édition ouverte. */ }
    }
    review.addEventListener('click', archive ? saveRecap : showRecap);
    edit.addEventListener('click', () => { show('write'); modeButtons.find(button => button.dataset.mode === session.mode)?.focus(); });
    finish.addEventListener('click', async () => {
      if (view !== 'review' || finish.hidden || finish.disabled) return;
      finish.disabled = edit.disabled = true;
      if (!session.completed) {
        session.completed = true;
        onFinish(session);
      }
      try { await onConfirm(); }
      finally { finish.disabled = edit.disabled = false; }
    });
    later.addEventListener('click', onHome);
    editor.hidden = false;
    host.replaceChildren(editor);
    globalThis.__enPsyIcons?.(editor);
    selectMode(session.mode);
    dateDisplay();
    controls();
    show('write');
    return { showRecap, backToRecap() { if (!archive || view !== 'write') return false; saveRecap(); return true; } };
  }

  function mount(host, { legacy, history, calendar, sessionId, review = false, onSelect, onExit, onConfirm = onExit, onViewChange = () => {} }) {
    prepare(legacy, history, calendar);
    let active;
    function home(focusId) {
      active = null;
      host.replaceChildren(template('home'));
      host.querySelector('[data-editors]')?.remove();
      const get = selector => host.querySelector(selector);
      const list = get('[data-session-list]');
      const form = get('[data-add-form]');
      const date = get('[data-add-date]');
      const add = get('[data-add-session]');
      date.max = dayKey(new Date());
      let focus;
      let closeDelete;
      const sessions = state.sessions.filter(item => item.date <= dayKey(new Date()) || item.completed || item.fromMode || item.modeDraft)
        .sort((a, b) => b.date.localeCompare(a.date));
      get('[data-empty]').hidden = Boolean(sessions.length);
      list.hidden = !sessions.length;
      for (const [index, session] of sessions.entries()) {
        const card = template('card').firstElementChild;
        const time = card.querySelector('[data-session-date]');
        const button = card.querySelector('[data-open-return]');
        const started = hasContent(session) || session.title.trim();
        time.id = 'psy-after-card-' + session.id;
        time.setAttribute('datetime', session.date);
        time.textContent = fullLabel(session.date);
        button.setAttribute('aria-describedby', time.id);
        card.querySelector('[data-session-status]').textContent = session.completed ? 'Retour terminé' : started ? 'Retour commencé' : 'À écrire';
        card.querySelector('[data-return-label]').textContent = session.completed ? 'Mes mots à revoir' : started ? 'Reprendre mon retour' : 'Commencer à écrire';
        button.addEventListener('click', () => onSelect ? onSelect(session.id, 'apres') : open(session.id, session.completed));
        const remove = card.querySelector('[data-delete-session]');
        const confirm = card.querySelector('[data-delete-confirm]');
        const cancel = confirm.querySelector('[data-cancel-delete]');
        confirm.id = time.id + '-delete';
        remove.setAttribute('aria-controls', confirm.id);
        remove.setAttribute('aria-label', 'Supprimer la séance du ' + time.textContent.toLocaleLowerCase('fr-FR'));
        function dismiss(restoreFocus) {
          confirm.hidden = true;
          remove.setAttribute('aria-expanded', 'false');
          closeDelete = undefined;
          if (restoreFocus) remove.focus();
        }
        remove.addEventListener('click', () => {
          if (!confirm.hidden) { dismiss(true); return; }
          closeDelete?.(false);
          confirm.hidden = false;
          remove.setAttribute('aria-expanded', 'true');
          closeDelete = dismiss;
          cancel.focus();
        });
        cancel.addEventListener('click', () => dismiss(true));
        confirm.addEventListener('keydown', event => { if (event.key === 'Escape') dismiss(true); });
        confirm.querySelector('[data-confirm-delete]').addEventListener('click', () => {
          if (!deleteSession(state, history, session)) return;
          save();
          home(sessions[index + 1]?.id || sessions[index - 1]?.id || 'add');
        });
        list.append(card);
        if (focusId === session.id) focus = button;
      }
      function setForm(open) {
        form.hidden = !open;
        add.setAttribute('aria-expanded', String(open));
        if (!open) date.value = '';
        (open ? date : add).focus();
      }
      add.addEventListener('click', () => setForm(form.hidden));
      get('[data-cancel-add]').addEventListener('click', () => setForm(false));
      form.addEventListener('keydown', event => { if (event.key === 'Escape') setForm(false); });
      form.addEventListener('submit', event => {
        event.preventDefault();
        if (!date.validity.valid || !validDay(date.value)) return;
        const session = newSession(date.value);
        state.sessions.push(session);
        save();
        home(session.id);
      });
      globalThis.__enPsyIcons?.(host);
      (focusId === 'add' ? add : focus)?.focus({ preventScroll: true });
    }
    function open(id, recap = false) {
      const session = state.sessions.find(item => item.id === id);
      if (!session || !host.isConnected) return false;
      let leaving = false;
      async function leave(destination) {
        if (leaving) return;
        leaving = true;
        try {
          await save();
          if (active?.session === session && host.isConnected) {
            if (destination) destination();
            else home(id);
          }
        } catch {
          // Le coffre signale l’échec. Le retour reste ouvert pour réessayer.
        } finally {
          leaving = false;
        }
      }
      const exit = () => leave(onExit);
      active = { session, exit, editor: mountEditor(host, session, exit, item => updateHistory(history, item),
        () => leave(onConfirm), onViewChange, Boolean(session.completed)) };
      if (recap) active.editor.showRecap();
      else host.closest('.phone')?.scrollTo({ top: 0 });
      return true;
    }
    controller = { host, open, back() { if (!active) return false; if (!active.editor.backToRecap()) active.exit(); return true; } };
    if (!sessionId || !open(sessionId, review || state.sessions.find(item => item.id === sessionId)?.completed)) home();
  }

  globalThis.__enPsyAfter = {
    mount, recordMode, prepare, appointment, migrateModeDraft, createModeSession, restoreArchive, legacyDate, hasContent, setDate,
    formatTemplate: prefix => template('format', prefix),
    find: id => state?.sessions.find(item => item.id === id),
    isDeleted: next => Boolean(state?.deletedCalendarKeys?.includes(calendarKey(next.e, dayKey(next.dt)))),
    open: (id, recap) => controller?.host.isConnected && controller.open(id, recap),
    back: () => controller?.host.isConnected && controller.back(),
  };
})();
