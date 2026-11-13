/* Espace Psy · rédaction et aide à l’écriture avant une séance. */
(() => {
  'use strict';
  const writing = globalThis.__enPsyWriting;
  const groups = [
    ['depuis', 'Depuis la dernière séance', 'calendar-days', [
      ['evenements', 'Ce qui s’est passé depuis la dernière séance', [
        'Un événement important', 'Une conversation', 'Un moment difficile',
        'Un moment qui m’a fait du bien', 'Un imprévu',
      ]],
      ['essais', 'Ce que j’ai essayé depuis la dernière séance', [
        'Un exercice proposé en séance', 'Prendre un moment pour moi', 'Écrire ce que je ressentais',
        'Dire ce dont j’avais besoin', 'Réagir autrement',
      ]],
      ['reprendre', 'Ce que j’aimerais reprendre de la dernière séance', [
        'Un sujet laissé en suspens', 'Une phrase qui m’est restée', 'Une piste à approfondir',
        'Ce que j’ai compris après coup', 'Un point que j’aimerais préciser',
      ]],
    ]],
    ['aborder', 'Ce que j’aimerais aborder', 'message-circle', [
      ['ressenti', 'Comment je me sens en ce moment', [
        'Apaisée', 'Soulagée', 'Triste', 'Anxieuse', 'En colère', 'Fatiguée',
        'Un peu perdue', 'J’ai du mal à mettre des mots',
      ]],
      ['recurrence', 'Ce qui revient souvent', [
        'Une pensée qui tourne en boucle', 'Une émotion qui revient', 'Une réaction que je répète',
        'Une situation qui se répète avec les autres', 'Un souvenir qui resurgit',
      ]],
      ['commencer', 'Par quoi j’aimerais commencer', [
        'Ce qui me pèse le plus', 'Ce qui vient d’arriver', 'Ce que j’ai du mal à dire',
        'Une bonne nouvelle', 'Là où on s’était arrêtées',
      ]],
      ['sujets', 'Les sujets que j’aimerais aborder', [
        'Mes relations', 'Le travail ou les études', 'Ma confiance en moi', 'Mes besoins et mes limites',
        'Mon sommeil ou mon énergie', 'Un changement dans ma vie',
      ]],
    ]],
    ['eclaircir', 'Ce que je voudrais éclaircir', 'compass', [
      ['questions', 'Les questions que j’aimerais lui poser', [
        'Comment comprendre ma réaction ?', 'Par où commencer pour que ça change ?',
        'Qu’est-ce que je peux essayer d’ici la prochaine séance ?', 'Peut-on revenir sur ce qu’on s’est dit ?',
        'Comment savoir si j’avance ?',
      ]],
      ['attentes', 'Ce que j’attends de cette séance', [
        'Y voir plus clair', 'Me sentir écoutée', 'Déposer ce qui me pèse', 'Repartir avec une piste concrète',
        'Prendre du recul', 'Mettre des mots sur ce que je ressens',
      ]],
    ]],
  ];
  const rubrics = groups.flatMap(group => group[3]);
  const placeholders = {
    evenements: 'Un événement, une conversation ou un moment qui m’a marquée…',
    essais: 'Un exercice, une habitude ou une façon de réagir que j’ai testée…',
    reprendre: 'Un sujet laissé en suspens ou une idée qui m’est restée…',
    ressenti: 'Mon humeur, mon énergie ou ce que je ressens en arrivant…',
    recurrence: 'Une pensée, une émotion ou une situation qui se répète…',
    commencer: 'La première chose que j’aimerais lui dire…',
    sujets: 'Les sujets ou les situations dont j’aimerais lui parler…',
    questions: 'Ce que j’aimerais lui demander ou éclaircir…',
    attentes: 'Ce qui m’aiderait aujourd’hui…',
  };
  const shortDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const recapDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const fullDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeZone: 'UTC' });
  const labelDate = (date, short = false) => formatDate(date, short ? shortDate : fullDate);
  const formatDate = (date, formatter) => formatter.format(new Date(date + 'T12:00:00Z'));
  const icon = name => `<i data-lucide="${name}" aria-hidden="true"></i>`;
  const el = (tag, className, value) => {
    const node = document.createElement(tag);
    node.className = className;
    if (value != null) node.textContent = value;
    return node;
  };

  function dateLine(date, { short = false, editable = false, recap = false } = {}) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') || !Number.isFinite(Date.parse(date))) return '';
    const label = recap ? formatDate(date, recapDate) : labelDate(date, short);
    const stamp = `${icon('calendar-days')}<time datetime="${date}">${label}</time>`;
    if (recap) return `<p class="en-recap-date-line">${stamp}</p>`;
    if (short) return `<p class="en-avant-writing-date">${stamp}</p>`;
    return editable
      ? `<button type="button" class="en-avant-date" data-a="avant-date" aria-label="Modifier la date de la séance : ${label}">${stamp}</button>`
      : `<p class="en-avant-date">${stamp}</p>`;
  }

  function record(prep) {
    const draft = prep.writing;
    const free = { text: prep.gen || '', html: '', ...draft?.free };
    return {
      ...draft,
      mode: draft?.mode ?? (free.text?.trim() ? 'free' : 'guided'),
      free,
      answers: draft?.answers ?? {},
      positions: draft?.positions ?? {},
    };
  }

  const hasAnswer = ([, value]) => Boolean(value?.text?.trim() || value?.choices?.length);

  function legacyEntries(prep, draft) {
    const list = [];
    if (prep.start?.trim()) list.push(['Ma phrase pour commencer', { text: prep.start }]);
    if (prep.gen?.trim() && prep.writing && draft.free.text !== prep.gen) {
      list.push(['Mes mots précédents', { text: prep.gen }]);
    }
    for (const [id, text] of Object.entries(prep.by || {})) {
      if (typeof text === 'string' && text.trim()) list.push([id === 'gen' ? 'En général' : 'Mes notes par sujet', { text }]);
    }
    if (prep.quest?.length) list.push(['Mes questions préparées', { choices: prep.quest }]);
    return list.filter(hasAnswer);
  }

  function entries(prep) {
    prep ??= {};
    const draft = record(prep);
    return [['Écriture libre', draft.free], ...rubrics.map(([key, title]) => [title, draft.answers[key]])]
      .filter(hasAnswer).concat(legacyEntries(prep, draft));
  }


  function modeTopics(prep) {
    const topics = record(prep).answers.sujets;
    return [...(topics?.choices || []), ...(topics?.text?.split('\n') || [])]
      .filter(text => text.trim()).map((text,index) => ({ id: 'avant:sujet:' + index, t: text }));
  }

  const formatButton = `<button type="button" class="en-format-toggle" data-format-toggle aria-label="Outils d’écriture" aria-expanded="false" aria-controls="psy-avant-format-tools-panel"><span class="en-format-aa" aria-hidden="true">Aa</span>${icon('x')}</button>`;
  const arrow = (key, label, name) => `<button type="button" class="en-arrow" data-${key} aria-label="${label}"><span>${icon(name)}</span></button>`;
  function mount(host, { date, prep, save, review, later }) {
    const draft = record(prep);
    host.innerHTML = `<section data-session-editor aria-labelledby="psy-avant-writing-title">
      <header class="en-return-heading">${dateLine(date, { short: true })}
        <h3 class="en-heading" id="psy-avant-writing-title" tabindex="-1"><span>Ma préparation pour la séance</span></h3>
      </header>
      <div class="en-avant-modes" role="group" aria-label="Façon d’écrire">
        <button type="button" data-mode="free" aria-controls="psy-avant-free">${icon('pen-line')} Écriture libre</button>
        <button type="button" data-mode="guided" aria-controls="psy-avant-guided">${icon('list')} Par rubriques</button>
      </div>
      <div id="psy-avant-free" data-pane="free" hidden>
        <div class="en-free-box"><div class="en-text"></div><div data-tools-anchor></div></div>
      </div>
      <div id="psy-avant-guided" data-pane="guided" hidden></div>
      <div data-format-controls>${formatButton}<p class="en-format-feedback" data-format-feedback role="status"></p></div>
      <div class="en-actions">
        <button type="button" class="en-main-action" data-view-recap disabled>Voir le récap</button>
        <button type="button" class="en-quiet-action" data-later>Reprendre plus tard</button>
      </div>
    </section>`;
    const editor = host.firstElementChild;
    const get = selector => editor.querySelector(selector);
    const tools = get('[data-format-controls]');
    const toggle = get('[data-format-toggle]');
    const recapButton = get('[data-view-recap]');
    const laterButton = get('[data-later]');
    const toolbar = globalThis.__enPsyAfter.formatTemplate('psy-avant');
    const size = toolbar.querySelector('[data-change="fontSize"]');
    size?.closest('label')?.remove();
    tools.prepend(toolbar);
    const free = get('.en-text');
    writing.prepareField(free, 'Ce que j’aimerais lui dire pendant la séance…', 'Écriture libre');
    writing.write(free, draft.free.text, draft.free.html);
    const sections = {};
    const controls = new Map();
    const body = get('[data-pane="guided"]');

    for (const [key, title, symbol, items] of groups) {
      const group = el('section', 'en-avant-carousel');
      group.setAttribute('aria-labelledby', 'psy-avant-' + key);
      group.setAttribute('aria-roledescription', 'carrousel');
      group.innerHTML = `<h4 id="psy-avant-${key}">${icon(symbol)}<span>${title}</span></h4>
        <div class="en-rubric-nav" role="group" aria-label="Parcourir les rubriques">
          ${arrow('previous','Rubrique précédente','chevron-left')}
          <div class="en-rubric-title">
            <div class="en-rubric-progress" aria-live="polite" aria-atomic="true">
              <h5 data-question></h5><span class="en-count" data-count></span>
            </div><div data-tools-anchor></div>
          </div>
          ${arrow('next','Rubrique suivante','chevron-right')}
        </div><div data-questions></div>`;
      body.append(group);
      const questions = group.querySelector('[data-questions]');
      for (const [id, label, choices] of items) {
        const section = el('div', 'en-avant-answer');
        section.hidden = true;
        const options = el('fieldset', 'en-reperes');
        options.setAttribute('aria-label', 'Suggestions à cocher');
        const list = el('div', 'en-choices');
        const stored = draft.answers[id];
        for (const value of choices) {
          const choice = el('label', 'en-choice');
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.value = value;
          input.checked = stored?.choices?.includes(value) || false;
          input.addEventListener('change', () => rememberAnswer(id));
          const marker = el('span', 'en-marker');
          marker.setAttribute('aria-hidden', 'true');
          choice.append(input, marker, el('span', '', value));
          list.append(choice);
        }
        options.append(list);
        const box = el('div', 'en-free-box');
        const field = el('div', 'en-text');
        writing.prepareField(field, placeholders[id], label);
        writing.write(field, stored?.text || '', stored?.html || '');
        sections[id] = { section, field, list };
        box.append(field);
        section.append(options, box);
        questions.append(section);
        controls.set(field, { id, group });
      }
      const previous = group.querySelector('[data-previous]');
      const next = group.querySelector('[data-next]');
      const show = index => {
        for (const [id] of items) sections[id].section.hidden = id !== items[index][0];
        group.querySelector('[data-question]').textContent = items[index][1];
        group.querySelector('[data-count]').textContent = `${index + 1} / ${items.length}`;
        previous.disabled = index === 0;
        next.disabled = index === items.length - 1;
      };
      let index = Math.min(items.length - 1, Math.max(0, draft.positions[key] | 0));
      const step = offset => {
        const nextIndex = index + offset;
        if (nextIndex < 0 || nextIndex >= items.length) return;
        index = nextIndex;
        draft.positions[key] = index;
        formatting.close();
        show(index);
        activate(group);
        persist();
      };
      previous.addEventListener('click', () => step(-1));
      next.addEventListener('click', () => step(1));
      let touch;
      questions.addEventListener('touchstart', event => {
        touch = event.target.closest('[data-rich-field],label') ? null : event.changedTouches[0];
      }, { passive: true });
      questions.addEventListener('touchend', event => {
        if (!touch) return;
        const point = event.changedTouches[0];
        const delta = point.clientX - touch.clientX;
        if (Math.abs(delta) > 50 && Math.abs(delta) > Math.abs(point.clientY - touch.clientY) * 1.5) step(delta < 0 ? 1 : -1);
        touch = null;
      }, { passive: true });
      show(index);
    }

    const freePane = get('[data-pane="free"]');
    const modeButtons = [...editor.querySelectorAll('[data-mode]')];
    const formatting = writing.mount(editor, () => {
      if (!freePane.hidden) draft.free = writing.read(free);
      else {
        const focused = activeGroup?.querySelector('.en-avant-answer:not([hidden]) [data-rich-field]');
        if (focused) return rememberAnswer(controls.get(focused).id);
      }
      formatting.refresh();
      persist();
    });
    let activeGroup;
    let leaving = false;
    const updateActions = () => {
      const hasContent = entries({ ...prep, writing: draft }).length > 0;
      recapButton.disabled = leaving || !hasContent;
      laterButton.disabled = leaving;
    };
    function persist() {
      prep.writing = draft;
      updateActions();
      save();
    }
    function rememberAnswer(id) {
      const { field, list } = sections[id];
      draft.answers[id] = { ...writing.read(field), choices: [...list.querySelectorAll('input:checked')].map(input => input.value) };
      persist();
      formatting.refresh();
    }
    const anchors = [...body.querySelectorAll('[data-tools-anchor]')];
    for (const anchor of anchors) {
      const button = el('button', 'en-format-toggle avant-extra-aa');
      button.type = 'button';
      button.setAttribute('aria-label','Outils d’écriture');
      const label = el('span', 'en-format-aa', 'Aa');
      label.setAttribute('aria-hidden', 'true');
      button.append(label);
      button.addEventListener('click', () => {
        activate(anchor.closest('.en-avant-carousel'));
        toggle.click();
        toggle.focus({ preventScroll: true });
      });
      anchor.append(button);
    }
    function activate(group) {
      if (activeGroup !== group) {
        formatting.close();
        if (activeGroup) activeGroup.removeAttribute('data-format-active');
        activeGroup = group;
        group.toggleAttribute('data-format-active', true);
        group.querySelector('[data-tools-anchor]').prepend(toggle);
      }
      const fieldBox = group.querySelector('.en-avant-answer:not([hidden]) .en-free-box');
      if (fieldBox.nextElementSibling !== tools) fieldBox.after(tools);
      formatting.refresh();
    }
    body.addEventListener('focusin', event => {
      const field = controls.get(event.target);
      if (field) activate(field.group);
    }, true);
    function mode(selected) {
      draft.mode = selected;
      freePane.hidden = selected !== 'free';
      body.hidden = selected !== 'guided';
      for (const button of modeButtons) button.setAttribute('aria-pressed', String(button.dataset.mode === selected));
      formatting.close();
      if (selected === 'free') {
        if (activeGroup) activeGroup.removeAttribute('data-format-active');
        activeGroup = null;
        freePane.querySelector('[data-tools-anchor]').append(toggle);
        freePane.querySelector('.en-free-box').after(tools);
      } else activate(activeGroup || body.firstElementChild);
      formatting.refresh();
    }
    for (const button of modeButtons) button.addEventListener('click', () => { mode(button.dataset.mode); persist(); });
    mode(draft.mode);
    updateActions();
    async function exit(to) {
      leaving = true;
      updateActions();
      prep.writing = draft;
      try { await save(); if (host.isConnected) to(); }
      catch { /* Le coffre affiche l’erreur et conserve l’écran de rédaction. */ }
      finally { leaving = false; updateActions(); }
    }
    recapButton.addEventListener('click', () => exit(review));
    laterButton.addEventListener('click', () => exit(later));
    globalThis.__enPsyIcons?.(editor);
  }

  // Render the pencil with the button so it is visible before the icon library loads.
  function editButton(action) {
    return `<button type="button" class="en-avant-edit-writing" ${action} aria-label="Modifier">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 20h9"/>
        <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>
      </svg>
    </button>`;
  }

  function mountRecap(host, { date, prep, edit, save, confirm }) {
    prep ??= {};
    const draft = record(prep);
    host.innerHTML = `<section class="en-reading en-recap" aria-labelledby="psy-avant-recap-title">
      <header class="en-recap-header">
        ${dateLine(date, { recap: true })}
        <div class="en-recap-title-row">
          <h3 class="en-heading" id="psy-avant-recap-title" tabindex="-1">Récap de ma préparation</h3>
          ${editButton('data-edit')}
        </div>
      </header>
      <div data-avant-summary></div>
      <div class="en-actions en-review-actions">
        <button type="button" class="en-main-action en-confirm-session" data-confirm-preparation>
          <span>Confirmer ma préparation</span>${icon('house')}
        </button>
      </div>
    </section>`;
    const content = host.querySelector('[data-avant-summary]');
    function renderAnswer(parent, [title, value], numeral) {
      const section = el('section', 'en-recap-rubric');
      const heading = el(numeral ? 'h5' : 'h4', numeral ? 'en-recap-numbered-heading' : '');
      if (numeral) {
        const number = el('span', 'en-recap-rubric-number', numeral);
        number.setAttribute('aria-hidden', 'true');
        heading.append(number, el('span', '', title));
      } else heading.textContent = title;
      section.append(heading);
      if (value.choices?.length) {
        const list = el('ul', 'en-recap-reperes');
        list.setAttribute('role', 'list');
        list.setAttribute('aria-label', 'Idées cochées');
        for (const choice of value.choices) {
          const item = document.createElement('li');
          item.append(el('span', 'en-recap-repere-label', choice));
          list.append(item);
        }
        section.append(list);
      }
      if (value.text?.trim()) {
        const answer = el('div','en-recap-words en-formatted');
        writing.write(answer, value.text, value.html, true);
        section.append(answer);
      }
      parent.append(section);
    }
    const free = ['Écriture libre', draft.free];
    if (hasAnswer(free)) renderAnswer(content, free);
    const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    let index = 0;
    for (const [key, title, , items] of groups) {
      const answers = items.map(([id, title]) => [title, draft.answers[id]]).filter(hasAnswer);
      if (!answers.length) continue;
      const group = el('section', 'en-avant-recap-group');
      const heading = el('h4', 'en-avant-recap-group-title', title);
      heading.id = 'psy-avant-recap-' + key;
      group.setAttribute('aria-labelledby', heading.id);
      group.append(heading);
      for (const answer of answers) renderAnswer(group, answer, numerals[index++]);
      content.append(group);
    }
    for (const answer of legacyEntries(prep, draft)) renderAnswer(content, answer);
    const pencil = host.querySelector('[data-edit]');
    const button = host.querySelector('[data-confirm-preparation]');
    pencil.addEventListener('click', edit);
    button.hidden = !content.childElementCount;
    button.addEventListener('click', async () => {
      if (button.disabled) return;
      button.disabled = pencil.disabled = true;
      try {
        await save();
        if (host.isConnected) confirm();
      } catch {
        // Le coffre signale l’échec et le récap reste ouvert.
      } finally {
        button.disabled = pencil.disabled = false;
      }
    });
    globalThis.__enPsyIcons?.(host);
  }

  const aiPaths = [
    ['Avant', 'Préparer ma séance', 'feather', 'Aide-moi à préparer ma prochaine séance avec ma psy à partir de ce que je choisis de te raconter.', rubrics.map(item => item[1])],
    ['Pendant', 'Noter l’essentiel de la séance', 'notebook-pen', 'Aide-moi à noter l’essentiel pendant une séance avec ma psy, sous forme de notes très courtes.', ['Mes sujets à aborder', 'Mes notes']],
    ['Après', 'Écrire mon retour sur la séance', 'book-open', 'Aide-moi à écrire mon retour après une séance avec ma psy. Distingue ce dont je me souviens, ce que je ressens et ce que j’aimerais explorer ensuite.',
      ['Ce que nous avons abordé', 'Les mots qui m’ont marquée', 'Comment je me suis sentie pendant la séance', 'Mon ressenti après la séance', 'Ce que je comprends mieux', 'Ce qui reste difficile ou flou', 'Ce que je n’ai pas abordé', 'Ce que j’aimerais explorer ensuite']],
  ];
  function openAI(root, opener) {
    const dialog = el('dialog','en-avant-dialog en-avant-ai');
    dialog.setAttribute('aria-labelledby','psy-ai-title');
    dialog.innerHTML = `<header><h3 id="psy-ai-title"><span>Un coup de pouce pour écrire</span></h3>
      <button type="button" data-close aria-label="Fermer le volet">${icon('x')}</button></header>
      <ul class="en-avant-ai-paths">${aiPaths.map(([title, subtitle, symbol], i) => `
        <li><button type="button" data-path="${i}"><span class="en-avant-ai-icon">${icon(symbol)}</span>
          <span><strong>${title}</strong><small>${subtitle}</small></span>${icon('chevron-right')}</button></li>`).join('')}</ul>
      <section data-ai-detail hidden>
        <h4></h4><textarea aria-label="Prompt" rows="6" readonly></textarea>
        <div class="en-avant-ai-actions"><button type="button" data-copy>Copier le prompt</button><button type="button" data-paths>Trois parcours</button></div>
        <p role="status"></p>
        <div class="en-avant-ai-actions"><a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">Ouvrir ChatGPT</a>
        <a href="https://claude.ai/new" target="_blank" rel="noopener noreferrer">Ouvrir Claude</a></div>
      </section>`;
    const list = dialog.querySelector('ul');
    const detail = dialog.querySelector('[data-ai-detail]');
    const prompt = detail.querySelector('textarea');
    const status = detail.querySelector('[role="status"]');
    let active;
    for (const button of list.querySelectorAll('button')) button.addEventListener('click', () => {
      active = button;
      const [title, sub, , intro, topics] = aiPaths[button.dataset.path];
      detail.querySelector('h4').textContent = title + ' · ' + sub;
      prompt.value = [
        intro,
        'Propose-moi de choisir une rubrique parmi celles ci-dessous. Pose une question simple à la fois et attends ma réponse.',
        'Si je réponds « je ne sais pas », propose au plus une relance courte ou deux pistes neutres. Si je ne sais toujours pas ou si je veux passer, passe à la suite sans insister. Une rubrique peut rester vide.',
        'Quand je veux rédiger, reformule en une ou deux phrases à la première personne, en gardant mon sens et mes doutes. Si je n’ai pas répondu, laisse la rubrique vide. N’ajoute aucun fait, sentiment ni interprétation. Demande-moi si la formulation me convient.',
        'Rubriques\n' + topics.map(topic => '• ' + topic).join('\n'),
      ].join('\n\n');
      status.textContent = '';
      list.hidden = true;
      detail.hidden = false;
      prompt.focus();
    });
    detail.querySelector('[data-paths]').addEventListener('click', () => {
      detail.hidden = true;
      list.hidden = false;
      active.focus();
    });
    detail.querySelector('[data-copy]').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(prompt.value);
        status.textContent = 'Prompt copié.';
      } catch {
        prompt.focus();
        prompt.select();
        status.textContent = 'Le prompt est sélectionné. Tu peux le copier.';
      }
    });
    showDialog(root, dialog, opener);
    const heading = dialog.querySelector('h3');
    const caption = heading.firstElementChild;
    function fitTitle() {
      if (heading.clientWidth && caption.offsetWidth)
        heading.style.setProperty('--titre-echelle', Math.min(1, heading.clientWidth / caption.offsetWidth));
    }
    if (typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver(fitTitle);
      observer.observe(heading);
      observer.observe(caption);
      dialog.addEventListener('close', () => observer.disconnect(), { once: true });
    }
    fitTitle();
  }

  function showDialog(root, dialog, opener) {
    root.append(dialog);
    dialog.addEventListener('close', () => { dialog.remove(); opener?.focus({ preventScroll: true }); }, { once: true });
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog || dialog.querySelector('[data-close]').disabled) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    globalThis.__enPsyIcons?.(dialog);
    dialog.showModal();
  }

  globalThis.__enPsyAvant = { mount, mountRecap, editButton, dateLine, labelDate, entries, modeTopics, openAI, showDialog };
})();
