/* Espace Psy · retours de séance, dans le coffre existant. */
(() => {
  'use strict';
  const templates = {
    home: `<section class="en-home en-home-page" data-view="home" aria-labelledby="psy-after-home-title">
  <h3 class="en-home-heading" id="psy-after-home-title">Mes mots après la séance</h3>
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
      <span class="en-session-status" data-session-status>À écrire</span>
    </div>
    <h4 class="en-session-title">Revenir sur ma séance</h4>
    <button type="button" class="en-leaf-action cursor-interaction" data-open-return>
      <span data-return-label>Commencer à écrire</span><i data-lucide="arrow-right" aria-hidden="true"></i>
    </button>
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
      <aside class="en-context" data-context aria-label="Le fil de ma séance">
        <div class="en-context-content" data-context-content>
          <h4 class="en-context-title">Le fil de ma séance</h4>
            <details class="en-note-fold" data-notes>
              <summary class="cursor-interaction"><span class="en-row-label"><span class="en-row-art" aria-hidden="true"><i data-lucide="notebook"></i></span><span id="psy-after-notes-label">Mes notes</span></span><i data-lucide="chevron-down" aria-hidden="true"></i></summary>
              <ul class="en-source en-note-list" data-source>
                </ul>
            </details>
            <details class="en-topic-group" data-topics>
              <summary class="cursor-interaction"><span class="en-row-label"><span class="en-row-art" aria-hidden="true"><i data-lucide="list"></i></span><span id="psy-after-topics-label">Mes sujets préparés</span></span><i data-lucide="chevron-down" aria-hidden="true"></i></summary>
              <ul class="en-topics">
                </ul>
            </details>
        </div>
      </aside>
      <section class="en-entry-composition" aria-labelledby="psy-after-entry-title">
        <div class="en-ways" aria-label="Ma façon de garder une trace">
          <button type="button" class="en-way cursor-interaction" data-mode="free" aria-pressed="false" aria-controls="psy-after-free"><i data-lucide="pen-line" aria-hidden="true"></i><span class="en-way-name">Écriture libre</span></button>
          <button type="button" class="en-way cursor-interaction" data-mode="guided" aria-pressed="false" aria-controls="psy-after-guided"><i data-lucide="list" aria-hidden="true"></i><span class="en-way-name">Par rubriques</span></button>
        </div>
      </section>
      <div class="en-writing" data-writing hidden>
        <div class="en-personal-meta">
          <div class="en-title-centered">
            <label class="en-sr" for="psy-after-personal-title">Un titre pour ma séance</label>
            <input class="en-personal-title" id="psy-after-personal-title" data-personal-title placeholder="Un titre pour ma séance" maxlength="160">
            <span class="en-empty-title" aria-hidden="true"><i data-lucide="pen-line"></i><span>Un titre pour ma séance</span></span>
          </div>
        </div>
        <div id="psy-after-free" data-pane="free" hidden>
          <textarea class="en-text" id="psy-after-free-text" aria-label="Mon retour sur la séance" rows="4" placeholder="Ce que j’ai envie de garder de cette séance…"></textarea>
        </div>
        <div id="psy-after-guided" data-pane="guided" hidden>
          <nav class="en-rubric-nav" aria-label="Parcourir les rubriques">
            <button type="button" class="en-arrow cursor-interaction" data-rubric-prev aria-label="Rubrique précédente"><span><i data-lucide="chevron-left" aria-hidden="true"></i></span></button>
            <div class="en-rubric-title" aria-live="polite" aria-atomic="true"><h4 data-rubric-title></h4><span class="en-count" data-rubric-count></span></div>
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
          <p class="en-reading-date"><time data-reading-date></time></p>
          <h3 class="en-heading" id="psy-after-recap-title">Récap de ma séance</h3>
        </header>
        <div class="en-context en-recap-context" data-recap-context hidden>
          <section class="en-note-fold" data-recap-notes hidden>
            <h4 class="en-recap-caption">Mes notes</h4>
          </section>
          <section class="en-topic-group" data-recap-topics hidden>
            <h4 class="en-recap-caption">Mes sujets préparés</h4>
          </section>
        </div>
        <section class="en-recap-return" data-recap-return hidden>
          <h4 class="en-recap-return-title" data-reading-title>Mon retour sur la séance</h4>
          <div data-reading-content></div>
        </section>
        <div class="en-actions en-review-actions">
          <button type="button" class="en-main-action cursor-interaction" data-finish hidden>Terminer mon retour</button>
          <button type="button" class="en-main-action en-edit-return cursor-interaction" data-edit>Continuer à écrire</button>
        </div>
      </section>
</div>`,
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
    <textarea class="en-prose" data-response rows="4"></textarea>
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
    const needsResize = !CSS.supports('field-sizing', 'content');
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
      const text = panel.querySelector('[data-response]');
      text.placeholder = rubric.placeholder;
      text.setAttribute('aria-label', rubric.title);
      return { values: () => [text.value].filter(value => value.trim()), restore: values => { text.value = values[0] || ''; } };
    }

    function wireBullets(panel, rubric) {
      panel.append(clone('list'));
      const list = panel.querySelector('[data-bullets]');
      const add = panel.querySelector('[data-new-bullet]');
      panel.querySelector('[data-add-label]').textContent = rubric.list.add;
      list.setAttribute('aria-label', rubric.list.label ?? rubric.title);
      const fields = [];

      function fitBullet(text) {
        if (!needsResize || !text.clientWidth) return;
        text.style.height = '0px';
        text.style.height = text.scrollHeight + 'px';
      }

      function appendBullet(value = '') {
        const index = fields.length;
        const item = document.createElement('li');
        const text = document.createElement('textarea');
        item.className = 'en-bullet';
        text.rows = 2;
        text.placeholder = index === 0 ? rubric.placeholder : rubric.list.next;
        text.value = value;
        text.setAttribute('aria-label', rubric.list.item + ' ' + (index + 1));
        text.setAttribute('enterkeyhint', 'enter');
        if (needsResize) text.addEventListener('input', () => fitBullet(text));
        item.append(text);
        list.append(item);
        fields.push(text);
        fitBullet(text);
        return text;
      }

      appendBullet();
      add.addEventListener('click', () => {
        const last = fields.at(-1);
        const field = last.value.trim() ? appendBullet() : last;
        field.focus();
      });

      function values() {
        return fields.map(field => field.value).filter(value => value.trim());
      }

      function appendTexts(texts) {
        const existing = new Set(values().map(textKey));
        const additions = [];
        for (const text of texts) {
          const key = textKey(text);
          if (existing.has(key)) continue;
          existing.add(key);
          additions.push(text);
        }
        const addedCount = additions.length;
        const last = fields.at(-1);
        if (addedCount && !last.value.trim()) {
          last.value = additions.shift();
          fitBullet(last);
        }
        for (const text of additions) appendBullet(text);
        return addedCount;
      }
      function restore(values) {
        if (!values.length) return;
        fields[0].value = values[0];
        values.slice(1).forEach(appendBullet);
      }
      return { values, appendTexts, restore, fit: () => fields.forEach(fitBullet) };
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
      return { title: entry.rubric.title, values: entry.writing.values() };
    }

    const sources = {
      notes: () => [{ title: 'Mes notes de séance', values: excerpts }],
      prepared: () => [{ title: 'Mes sujets préparés', values: prepared }],
      remaining: () => {
        const discussed = new Set(entries.get('aborde').writing.values().map(textKey));
        return [{ title: 'Mes sujets préparés', values: prepared.filter(topic => !discussed.has(textKey(topic))) }];
      },
      'follow-up': () => [fromRubric('flou'), fromRubric('de-cote')]
    };
    for (const entry of panels) {
      const { panel, rubric, writing } = entry;
      const record = saved[rubric.id];
      if (record) writing.restore(record.paragraphs || []);
      if (rubric.source) entry.refresh = wireSource(panel, rubric, writing, sources[rubric.source.kind]);
    }

    let activeIndex = 0;
    function fitTitle() {
      panels[activeIndex].writing.fit?.();
      if (!title.clientWidth) return;
      let size = 16;
      title.style.fontSize = size + 'px';
      while (title.scrollWidth > title.clientWidth + 1 && size > 12) {
        size -= .5;
        title.style.fontSize = size + 'px';
      }
    }
    function showRubric(index) {
      if (index < 0 || index >= panels.length) return;
      panels[activeIndex].panel.hidden = true;
      activeIndex = index;
      const entry = panels[index];
      entry.panel.hidden = false;
      entry.refresh?.();
      title.textContent = entry.rubric.title;
      title.dataset.tooltip = entry.rubric.title;
      count.textContent = (index + 1) + ' / ' + panels.length;
      previous.disabled = index === 0;
      next.disabled = index === panels.length - 1;
      fitTitle();
    }
    previous.addEventListener('click', () => { showRubric(activeIndex - 1); onChange(); });
    next.addEventListener('click', () => { showRubric(activeIndex + 1); onChange(); });
    showRubric(Number.isInteger(saved.index) ? Math.min(panels.length - 1, Math.max(0, saved.index)) : 0);

    function sections() {
      return panels.map(({ panel, rubric, writing }) => ({
        id: rubric.id,
        title: rubric.title,
        bullets: Boolean(rubric.list),
        paragraphs: writing.values(),
        choices: [...panel.querySelectorAll('input[type="checkbox"]:checked')].map(input => input.value)
      })).filter(entry => entry.paragraphs.length || entry.choices.length);
    }
    return { sections, fitTitle, index: () => activeIndex };
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
      const add = date => out.push({ date: dayKey(date),
        key: 'cal:' + event.id + (event.rep ? ':' + dayKey(date) : '') });
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
    }
    return out;
  }

  function legacyDate(record) {
    if (validDay(record.date)) return record.date;
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const match = String(record.jl || '').toLowerCase().match(/\b(\d{1,2})\s+([\p{L}]+)(?:\s+(\d{4}))?/u);
    const month = match && months.indexOf(match[2]);
    const year = match && Number(match[3] || record.y);
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
    return Boolean(session.free.trim() || session.extras.length ||
      Object.values(session.rubrics).some(section => section.paragraphs?.length || section.choices?.length));
  }

  function migrate(state, history, legacy) {
    if (state.migrated) return false;
    for (const old of history) {
      const date = legacyDate(old);
      if (!date) continue;
      const checked = new Set(old.suj || []);
      const session = newSession(date, {
        historyId: old.id, completed: true,
        topics: [...new Set([...(old.prev || []), ...checked])].map(text => ({ text, checked: checked.has(text) })),
        notes: (old.notes || []).map(([label, time, text]) => ({ label, time, text })),
        rubrics: {
          aborde: { paragraphs: strings([old.apres?.parler]), choices: [] },
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

  function syncCalendar(state, calendar, now) {
    const occurrences = calendarOccurrences(calendar, now);
    const active = new Set(occurrences.map(item => item.key));
    let changed = false;
    for (const { date, key } of occurrences) {
      const current = state.sessions.find(item => item.calendarKey === key);
      if (current) {
        if (current.date === current.calendarDate && current.date !== date && !current.completed) {
          current.date = date;
          current.calendarDate = date;
          changed = true;
        }
        continue;
      }
      const match = state.sessions.find(item => item.date === date && !item.calendarKey && (item.fromMode || item.historyId));
      if (match) Object.assign(match, { calendarKey: key, calendarDate: date });
      else state.sessions.push(newSession(date, { calendarKey: key, calendarDate: date }));
      changed = true;
    }
    const filtered = state.sessions.filter(item => !item.calendarKey || active.has(item.calendarKey) ||
      item.completed || item.title.trim() || hasContent(item) || item.fromMode);
    if (filtered.length !== state.sessions.length) {
      state.sessions = filtered;
      changed = true;
    }
    return changed;
  }

  let state;
  let saveTimer;
  let controller;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = undefined;
    globalThis.__vaultPushNow?.()?.catch(() => {});
  }
  function saveSoon() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 500);
  }
  function prepare(legacy, history, calendar) {
    state ||= globalThis.__enKeep('psy-after-v1', { version: 1, sessions: [], migrated: false });
    const changed = migrate(state, history, legacy);
    if (syncCalendar(state, calendar, new Date()) || changed) saveSoon();
  }

  function recordMode(previous, current, history, calendar) {
    prepare(previous, history, calendar);
    const date = current.sessionDate;
    const session = state.sessions.find(item => item.date === date && item.calendarKey && !item.fromMode && !item.completed);
    const context = { ...modeContext(current), fromMode: true };
    if (session) Object.assign(session, context);
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

  function renderContext(editor, session) {
    const get = selector => editor.querySelector(selector);
    const sources = [
      [get('[data-notes]'), get('[data-recap-notes]'), get('[data-source]'),
        session.notes.filter(note => note.text?.trim()).map(note => element('li', '', note.text))],
      [get('[data-topics]'), get('[data-recap-topics]'), get('.en-topics'),
        session.topics.map(topic => {
          const item = element('li', 'en-topic');
          const text = element('span', 'en-topic-text', topic.text);
          text.append(element('span', 'en-sr', topic.checked ? ' — Coché pendant la séance.' : ' — Non coché pendant la séance.'));
          const mark = element('span', 'en-mark', topic.checked ? '✓' : '');
          mark.setAttribute('aria-hidden', 'true');
          item.append(text, mark);
          return item;
        })],
    ];
    let hasContext = false;
    for (const [fold, recap, list, items] of sources) {
      fold.hidden = !items.length;
      recap.hidden = !items.length;
      list.replaceChildren(...items);
      if (!items.length) continue;
      const copy = list.cloneNode(true);
      copy.removeAttribute('data-source');
      recap.append(copy);
      hasContext = true;
    }
    get('[data-context]').hidden = !hasContext;
    get('[data-recap-context]').hidden = !hasContext;
  }

  function mountEditor(host, session, onHome, onFinish) {
    const prefix = 'psy-after-' + session.id;
    const editor = template('editor', prefix).firstElementChild;
    const get = selector => editor.querySelector(selector);
    const modeButtons = [...editor.querySelectorAll('[data-mode]')];
    const dateInput = get('[data-date]');
    const dateToggle = get('[data-date-toggle]');
    const dateEditor = get('[data-date-editor]');
    const personalTitle = get('[data-personal-title]');
    const free = get('[data-pane="free"] textarea');
    const edit = get('[data-edit]');
    const finish = get('[data-finish]');
    const later = get('[data-later]');
    const help = get('.en-help');
    const helpPanel = get('.en-help-panel');
    let view = 'write';
    dateInput.max = dayKey(new Date());
    dateInput.value = session.date;
    personalTitle.value = session.title;
    free.value = session.free;
    renderContext(editor, session);

    const guided = mountGuided(get('[data-pane="guided"]'), prefix,
      session.notes.map(note => note.text), session.topics.map(topic => topic.text),
      { ...session.rubrics, index: session.index }, update);

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
      finish.hidden = Boolean(session.completed) || !hasContent(session);
      edit.textContent = session.completed ? 'Modifier mon retour' : 'Continuer à écrire';
      later.textContent = session.completed ? 'Retour à l’accueil Après' : 'Reprendre plus tard';
    }
    function update() {
      const sections = guided.sections();
      const next = Object.fromEntries(sections.map(({ id, paragraphs, choices }) => [id, { paragraphs, choices }]));
      const current = JSON.stringify([session.title, session.free, session.rubrics]);
      session.title = personalTitle.value;
      session.free = free.value;
      session.rubrics = next;
      session.index = guided.index();
      if (current !== JSON.stringify([session.title, session.free, next])) session.completed = false;
      controls();
      saveSoon();
    }
    function fitWriting() {
      guided.fitTitle();
      if (free.offsetWidth) {
        free.style.height = 'auto';
        free.style.height = Math.max(140, free.scrollHeight + 2) + 'px';
      }
    }
    function selectMode(mode) {
      session.mode = mode;
      get('[data-writing]').hidden = false;
      for (const button of modeButtons) button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
      for (const pane of editor.querySelectorAll('[data-pane]')) pane.hidden = pane.dataset.pane !== mode;
      fitWriting();
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
      for (const panel of editor.querySelectorAll('[data-view]')) panel.hidden = panel.dataset.view !== next;
      setHelp(false);
      setDate(false);
      if (next === 'write') fitWriting();
      host.closest('.phone')?.scrollTo({ top: 0 });
    }
    function showRecap() {
      const sections = guided.sections();
      if (session.free.trim()) sections.unshift({ title: 'Écriture libre', paragraphs: [session.free], choices: [] });
      if (session.extras.length) sections.push({ title: 'Mes petits pas', paragraphs: session.extras, choices: [], bullets: true });
      const content = get('[data-reading-content]');
      content.replaceChildren();
      get('[data-recap-return]').hidden = !sections.length && !session.title.trim();
      get('[data-reading-title]').textContent = session.title.trim() || 'Mon retour sur la séance';
      for (const entry of sections) {
        const section = element('section', 'en-reading-section');
        section.append(element('h5', '', entry.title));
        if (entry.choices.length) section.append(element('p', '', entry.choices.join(' · ')));
        if (entry.bullets && entry.paragraphs.length) {
          const list = element('ul', 'en-reading-bullets');
          for (const paragraph of entry.paragraphs) list.append(element('li', '', paragraph));
          section.append(list);
        } else {
          for (const paragraph of entry.paragraphs) section.append(element('p', '', paragraph));
        }
        content.append(section);
      }
      show('review');
    }
    function changeDate() {
      if (!dateInput.validity.valid || !validDay(dateInput.value) || dateInput.value === session.date) return;
      session.date = dateInput.value;
      session.completed = false;
      dateDisplay();
      controls();
      saveSoon();
    }
    editor.addEventListener('input', event => {
      if (event.target === free) fitWriting();
      if (event.target.matches('textarea,[data-personal-title],input[type="checkbox"]')) update();
    });
    editor.addEventListener('change', event => {
      if (event.target.matches('input[type="checkbox"]')) update();
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
    for (const button of modeButtons) button.addEventListener('click', () => { selectMode(button.dataset.mode); saveSoon(); });
    get('[data-review]').addEventListener('click', showRecap);
    edit.addEventListener('click', () => { show('write'); modeButtons.find(button => button.dataset.mode === session.mode)?.focus(); });
    finish.addEventListener('click', () => {
      if (view !== 'review' || !hasContent(session)) return;
      session.completed = true;
      onFinish(session);
      onHome();
    });
    later.addEventListener('click', onHome);
    editor.hidden = false;
    host.replaceChildren(editor);
    globalThis.__enPsyIcons?.(editor);
    selectMode(session.mode);
    dateDisplay();
    controls();
    show('write');
    return { showRecap };
  }

  function mount(host, { legacy, history, calendar }) {
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
      get('[data-empty]').hidden = Boolean(state.sessions.length);
      list.hidden = !state.sessions.length;
      let focus;
      for (const session of [...state.sessions].sort((a, b) => b.date.localeCompare(a.date))) {
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
        button.addEventListener('click', () => open(session.id, session.completed));
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
      focus?.focus({ preventScroll: true });
    }
    function open(id, recap = false) {
      const session = state.sessions.find(item => item.id === id);
      if (!session || !host.isConnected) return false;
      const exit = () => { save(); home(id); };
      active = { session, exit, editor: mountEditor(host, session, exit, item => updateHistory(history, item)) };
      if (recap) active.editor.showRecap();
      else host.closest('.phone')?.scrollTo({ top: 0 });
      return true;
    }
    home();
    controller = { host, open, back() { if (!active) return false; active.exit(); return true; } };
  }

  globalThis.__enPsyAfter = {
    mount, recordMode,
    open: (id, recap) => controller?.host.isConnected && controller.open(id, recap),
    back: () => controller?.host.isConnected && controller.back(),
  };
})();
