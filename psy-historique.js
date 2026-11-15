/* Historique Psy : sujets principaux, filtres et favoris du coffre. */
(() => {
  'use strict';

  const normalize = value => String(value ?? '').normalize('NFD').replace(/\p{M}/gu, '')
    .toLocaleLowerCase('fr-FR').replace(/œ/g, 'oe').replace(/[^a-z0-9]+/g, ' ').trim();
  const subjects = Object.freeze([
    'Famille', 'Amour', 'Travail', 'Amitiés', 'Émotions', 'Santé', 'Confiance en soi',
    'Limites personnelles', 'Intimité', 'Deuil et pertes', 'Changements de vie',
  ]);
  const sessionDateFormat = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' });
  const icon = name => `<i data-lucide="${name}" aria-hidden="true"></i>`;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const monthFormat = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const dayFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', timeZone: 'UTC' });
  const dateOf = date => new Date(date + 'T12:00:00Z');
  const monthLabel = month => {
    const label = monthFormat.format(dateOf(month + '-01'));
    return label[0].toLocaleUpperCase('fr-FR') + label.slice(1);
  };
  const countLabel = count => `${count} séance${count === 1 ? '' : 's'}`;
  let currentMount;
  let saved;

  function sourceTopics(record) {
    return [...new Set([...(Array.isArray(record.suj) ? record.suj : []),
      ...(Array.isArray(record.prev) ? record.prev : [])]
      .filter(topic => typeof topic === 'string' && topic.trim()).map(topic => topic.trim()))];
  }

  function preferences() {
    saved ||= globalThis.__enKeep('psy-history-v1', { favorites: [], subjectsBySession: {} });
    if (!Array.isArray(saved.favorites)) saved.favorites = [];
    if (!saved.subjectsBySession || typeof saved.subjectsBySession !== 'object' || Array.isArray(saved.subjectsBySession)) {
      saved.subjectsBySession = {};
    }
    return saved;
  }

  const subjectKey = id => 'session:' + id;
  const validSubjects = values => Array.isArray(values) ? subjects.filter(label => values.includes(label)) : [];

  async function saveSubjects(id, values) {
    const registry = preferences().subjectsBySession;
    const key = subjectKey(id);
    const previous = registry[key];
    const next = validSubjects(values);
    registry[key] = next;
    try {
      await (globalThis.__vaultAutosave?.() ?? globalThis.__vaultPushNow?.());
    } catch (error) {
      if (registry[key] === next) {
        if (previous === undefined) delete registry[key];
        else registry[key] = previous;
      }
      throw error;
    }
  }

  function prepare(records, dateFor, subjectsBySession = {}) {
    return records.map(record => {
      const date = dateFor(record) || '';
      const selection = validSubjects(subjectsBySession[subjectKey(record.id)]);
      const phrase = [record.displayTitle, record.title, record.q]
        .find(value => typeof value === 'string' && value.trim())?.trim() || 'Ma séance';
      return {
        record, date, month: date.slice(0, 7), phrase, subjects: selection,
        search: normalize([phrase, record.q, ...(record.recapPhrases || []), ...sourceTopics(record), ...selection].join(' ')),
      };
    }).sort((a, b) => b.date.localeCompare(a.date));
  }

  function filtered(entries, state, favorites) {
    if (state.favoritesOnly) return entries.filter(({ record }) => favorites.includes(record.id));
    const query = normalize(state.query);
    return entries.filter(entry =>
      (!query || entry.search.includes(query)) &&
      (!state.periods.length || state.periods.some(period => entry.month.startsWith(period))) &&
      (!state.subjects.length || entry.subjects.some(subject => state.subjects.includes(subject))));
  }

  function periodChoices(entries) {
    const years = new Map();
    for (const { month } of entries) {
      if (!month) continue;
      const year = month.slice(0, 4);
      if (!years.has(year)) years.set(year, new Set());
      years.get(year).add(month);
    }
    return [...years].flatMap(([year, months]) => [
      ...[...months].map(month => [month, monthLabel(month)]), [year, 'Année ' + year],
    ]);
  }

  const choice = ([value, caption], checked = false) => `<label class="psy-history-option cursor-interaction">
    <span>${escape(caption)}</span><input type="checkbox" value="${escape(value)}"${checked ? ' checked' : ''}>
    <i class="psy-history-check" data-lucide="check" aria-hidden="true"></i>
  </label>`;

  function subjectPicker() {
    return `<section class="psy-session-subjects" data-session-subjects aria-label="Sujets principaux">
      <button type="button" class="psy-session-subject-toggle cursor-interaction" data-subject-toggle
        aria-expanded="false" aria-controls="psy-session-subject-form">
        ${icon('tag')}<span class="psy-session-subject-text"><strong>Sujets principaux</strong><span data-subject-current></span></span>
        <i class="psy-history-chevron" data-lucide="chevron-right" aria-hidden="true"></i>
      </button>
      <div id="psy-session-subject-form" data-subject-form hidden>
        <div class="psy-history-options" data-subject-options role="group" aria-label="Choix des sujets principaux">
          ${subjects.map(label => choice([label, label])).join('')}
        </div>
        <div class="psy-session-subject-actions">
          <button type="button" class="cursor-interaction" data-subject-cancel>Annuler</button>
          <button type="button" class="psy-session-subject-save cursor-interaction" data-subject-save>Enregistrer</button>
        </div>
      </div>
      <p class="psy-session-subject-status" data-subject-status role="status" hidden></p>
    </section>`;
  }

  function sessionLead(editableDate = '') {
    return `<div class="psy-session-identity" data-session-identity>
      ${editableDate || '<time data-session-identity-date hidden></time>'}
      <p data-session-identity-title hidden></p>
    </div>${subjectPicker()}`;
  }

  function updateSessionLead(body, session) {
    const lead = body.querySelector('[data-session-identity]');
    if (!lead || !session) return;
    const time = lead.querySelector('[data-session-identity-date]');
    if (time) {
      const date = dateOf(session.date);
      time.hidden = !Number.isFinite(+date);
      if (!time.hidden) {
        time.dateTime = session.date;
        time.textContent = sessionDateFormat.format(date);
      }
    }
    const title = lead.querySelector('[data-session-identity-title]');
    title.textContent = session.title?.trim() || '';
    title.hidden = !title.textContent;
  }

  function mountSubjectPicker(root, id, state) {
    const registry = preferences().subjectsBySession;
    const get = selector => root.querySelector(selector);
    const toggle = get('[data-subject-toggle]');
    const current = get('[data-subject-current]');
    const form = get('[data-subject-form]');
    const options = get('[data-subject-options]');
    const cancel = get('[data-subject-cancel]');
    const save = get('[data-subject-save]');
    const status = get('[data-subject-status]');
    const checks = [...options.querySelectorAll('input')];

    function sync() {
      const savedSubjects = validSubjects(registry[subjectKey(id)]);
      const selection = state.draft || savedSubjects;
      current.textContent = savedSubjects.join(' · ') || 'Choisir les sujets';
      form.hidden = !state.open;
      toggle.setAttribute('aria-expanded', String(Boolean(state.open)));
      toggle.disabled = save.disabled = cancel.disabled = Boolean(state.pending);
      for (const check of checks) {
        check.checked = selection.includes(check.value);
        check.disabled = Boolean(state.pending);
      }
      status.textContent = state.feedback || '';
      status.hidden = !state.feedback;
    }
    function closePicker(focus = true) {
      state.open = false;
      delete state.draft;
      delete state.feedback;
      sync();
      if (focus) toggle.focus({ preventScroll: true });
    }
    toggle.addEventListener('click', () => {
      if (state.open) closePicker();
      else {
        state.open = true;
        delete state.feedback;
        sync();
        options.scrollTop = 0;
      }
    });
    cancel.addEventListener('click', () => closePicker());
    options.addEventListener('change', () => {
      state.draft = checks.filter(check => check.checked).map(check => check.value);
    });
    root.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !state.open || state.pending) return;
      event.stopPropagation();
      closePicker();
    });
    save.addEventListener('click', async () => {
      if (state.pending) return;
      state.pending = true;
      delete state.feedback;
      sync();
      try {
        await saveSubjects(id, state.draft || validSubjects(registry[subjectKey(id)]));
        state.open = false;
        delete state.draft;
      } catch {
        state.feedback = 'Les sujets n’ont pas pu être enregistrés. Réessaie.';
      } finally {
        state.pending = false;
        state.sync?.();
        if (root.isConnected && !state.open) toggle.focus({ preventScroll: true });
      }
    });

    state.sync = sync;
    sync();
    globalThis.__enPsyIcons?.(root);
  }

  function disclosure(name, label, glyph, choices, selected) {
    return `<button type="button" class="psy-history-shortcut" data-disclosure="${name}" aria-expanded="false" aria-controls="psy-history-${name}">
        ${icon(glyph)}<span>${label}</span><i class="psy-history-chevron" data-lucide="chevron-right" aria-hidden="true"></i>
      </button>
      <div class="psy-history-options" data-filter="${name}" id="psy-history-${name}" role="group" aria-label="${label}" hidden>
        ${choice(['', name === 'periods' ? 'Toutes les périodes' : 'Tous les sujets'], !selected.length)}
        ${choices.map(option => choice(option, selected.includes(option[0]))).join('')}
      </div>`;
  }

  function render(beforeApp) {
    return `<section class="psy-history" data-psy-history aria-label="Historique des séances">
      <label class="psy-history-search">${icon('search')}<input type="search" data-history-search
        placeholder="chercher un mot, un sujet…" aria-label="Rechercher une séance"></label>
      <p class="psy-history-favorites-title" data-history-favorites-title hidden>${icon('star')} Mes favoris</p>
      <p class="psy-home-sr" role="status" data-history-count></p>
      <div data-history-results></div>
      <div data-history-before-app>${beforeApp}</div>
    </section>`;
  }

  function resultRows(entries, favorites, pearl, state, hasSessions) {
    if (!entries.length) {
      const message = state.favoritesOnly ? 'Aucune séance en favori.' :
        hasSessions ? 'Aucune séance ne correspond.' : 'Ton fil de séances commencera ici.';
      return `<p class="psy-history-empty">${message}</p>`;
    }
    const groups = new Map();
    for (const entry of entries) {
      if (!groups.has(entry.month)) groups.set(entry.month, []);
      groups.get(entry.month).push(entry);
    }
    return [...groups].map(([month, group]) => `<section class="psy-history-month">
      <h3>${month ? monthLabel(month) : 'Date non renseignée'}</h3>
      <div class="psy-history-rows">${group.map(({ record, date, subjects, phrase }) => {
        const favorite = favorites.includes(record.id);
        const label = favorite ? 'Retirer des favoris' : 'Ajouter aux favoris';
        const id = escape(record.id);
        return `<div class="psy-history-row">
          <span class="psy-history-pearl" aria-hidden="true">${pearl(record)}</span>
          <button type="button" class="psy-history-session" data-a="session-archive" data-i="${id}">
            ${date ? `<time datetime="${date}">${dayFormat.format(dateOf(date))}</time>` : ''}
            <span class="psy-history-phrase">${escape(phrase)}</span>
            ${subjects.length ? `<span class="psy-history-subject-line">${escape(subjects.join(' · '))}</span>` : ''}
          </button>
          <button type="button" class="psy-history-star" data-history-star="${id}" aria-pressed="${favorite}"
            aria-label="${escape(label + ' · ' + phrase)}">${icon('star')}</button>
        </div>`;
      }).join('')}</div>
    </section>`).join('');
  }

  function unmount() {
    currentMount?.abort.abort();
    currentMount?.wrapper?.remove();
    currentMount = undefined;
  }

  function mount(phone, root, { records, dateFor, pearl, state }) {
    const { subjectsBySession } = preferences();
    state.periods ||= [];
    state.subjects ||= [];

    const entries = prepare(records, dateFor, subjectsBySession);
    const controller = new AbortController();
    const listener = { signal: controller.signal };
    const search = root.querySelector('[data-history-search]');
    const results = root.querySelector('[data-history-results]');
    const status = root.querySelector('[data-history-count]');
    const beforeApp = root.querySelector('[data-history-before-app]');
    const favoritesTitle = root.querySelector('[data-history-favorites-title]');
    const doc = root.ownerDocument;
    const wrapper = doc.createElement('div');
    wrapper.className = 'psy-history-sort';
    currentMount = { abort: controller, wrapper };
    wrapper.innerHTML = `<button type="button" class="psy-history-sort-button" aria-expanded="false"
        aria-controls="psy-history-sort-menu" aria-label="Trier par, ${countLabel(entries.length)}">
        ${icon('arrow-down-up')}<span aria-hidden="true">${entries.length}</span>
      </button>
      <div id="psy-history-sort-menu" class="psy-history-sort-menu" role="group" aria-label="Options de tri et de filtre" hidden>
        <div class="psy-history-menu-title"><span>Trier par</span><span>${countLabel(entries.length)}</span></div>
        <button type="button" class="psy-history-shortcut" data-history-favorites>${icon('star')}<span>Mes favoris</span></button>
        <div class="psy-history-filters">
          ${disclosure('periods', 'Périodes', 'calendar-days', periodChoices(entries), state.periods)}
          ${disclosure('subjects', 'Sujets', 'tag', subjects.map(label => [label, label]), state.subjects)}
        </div>
        <button type="button" class="psy-history-done" data-history-done>Voir les résultats</button>
      </div>`;
    const mode = phone.querySelector('.sbhas .psmsb');
    if (mode) mode.before(wrapper);
    else root.prepend(wrapper);
    globalThis.__enPsyIcons?.(wrapper);
    globalThis.__enPsyIcons?.(root);

    const trigger = wrapper.querySelector('.psy-history-sort-button');
    const menu = wrapper.querySelector('.psy-history-sort-menu');
    const favorites = wrapper.querySelector('[data-history-favorites]');
    const filters = wrapper.querySelector('.psy-history-filters');
    const done = wrapper.querySelector('[data-history-done]');
    const disclosures = [...filters.querySelectorAll('[data-disclosure]')];
    const optionsFor = button => filters.querySelector('[data-filter="' + button.dataset.disclosure + '"]');
    search.value = state.query || '';

    function showDisclosure(button, open) {
      button.setAttribute('aria-expanded', String(open));
      optionsFor(button).hidden = !open;
    }
    function showMenu(open, restoreFocus = false) {
      menu.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
      if (open) favorites.focus({ preventScroll: true });
      else {
        disclosures.forEach(button => showDisclosure(button, false));
        if (restoreFocus) trigger.focus({ preventScroll: true });
      }
    }
    function updateResults() {
      const visible = filtered(entries, state, saved.favorites);
      results.innerHTML = resultRows(visible, saved.favorites, pearl, state, entries.length > 0);
      globalThis.__enPsyIcons?.(results);
      status.textContent = state.favoritesOnly
        ? countLabel(visible.length) + (visible.length === 1 ? ' en favori' : ' en favoris')
        : countLabel(visible.length) + (visible.length === 1 ? ' trouvée' : ' trouvées');
    }
    function updateView() {
      search.closest('label').hidden = Boolean(state.favoritesOnly);
      beforeApp.hidden = Boolean(state.favoritesOnly);
      favoritesTitle.hidden = !state.favoritesOnly;
      filters.hidden = done.hidden = Boolean(state.favoritesOnly);
      favorites.querySelector('span').textContent = state.favoritesOnly ? 'Retour à mes séances' : 'Mes favoris';
      updateResults();
    }
    trigger.addEventListener('click', () => showMenu(menu.hidden), listener);
    favorites.addEventListener('click', () => {
      state.favoritesOnly = !state.favoritesOnly;
      updateView();
      showMenu(false, true);
    }, listener);
    done.addEventListener('click', () => showMenu(false, true), listener);
    disclosures.forEach(button => button.addEventListener('click', () =>
      showDisclosure(button, optionsFor(button).hidden), listener));
    filters.addEventListener('change', event => {
      const list = event.target.closest('[data-filter]');
      if (!list) return;
      const [all, ...choices] = list.querySelectorAll('input');
      if (event.target === all) choices.forEach(input => { input.checked = false; });
      state[list.dataset.filter] = choices.filter(input => input.checked).map(input => input.value);
      all.checked = !state[list.dataset.filter].length;
      updateResults();
    }, listener);
    search.addEventListener('input', () => {
      state.query = search.value;
      updateResults();
    }, listener);
    results.addEventListener('click', event => {
      const button = event.target.closest('[data-history-star]');
      if (!button) return;
      const entry = entries.find(({ record }) => String(record.id) === button.dataset.historyStar);
      if (!entry) return;
      const id = entry.record.id;
      saved.favorites = saved.favorites.includes(id) ? saved.favorites.filter(value => value !== id) : [...saved.favorites, id];
      globalThis.__vaultAutosave?.();
      updateResults();
      const replacement = [...results.querySelectorAll('[data-history-star]')].find(control => control.dataset.historyStar === button.dataset.historyStar);
      (replacement || trigger).focus({ preventScroll: true });
    }, listener);
    doc.addEventListener('pointerdown', event => {
      if (!menu.hidden && !wrapper.contains(event.target)) showMenu(false);
    }, listener);
    phone.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || menu.hidden) return;
      event.preventDefault();
      event.stopPropagation();
      const expanded = disclosures.filter(button => !optionsFor(button).hidden);
      const active = expanded.find(button => button.contains(event.target) || optionsFor(button).contains(event.target)) || expanded.at(-1);
      if (!active) showMenu(false, true);
      else {
        showDisclosure(active, false);
        active.focus({ preventScroll: true });
      }
    }, listener);
    updateView();
  }

  globalThis.__enPsyHistory = { render, mount, unmount, prepare, filtered, periodChoices, subjectPicker, sessionLead, updateSessionLead, mountSubjectPicker, saveSubjects, subjects, validSubjects, choice };
})();
