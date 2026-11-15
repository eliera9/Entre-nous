/* Mes petits pas dans l’espace Psy. */
(() => {
  'use strict';

  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
  const icon = name => `<i data-lucide="${name}" aria-hidden="true"></i>`;
  const format = options => new Intl.DateTimeFormat('fr-FR', { ...options, timeZone: 'UTC' });
  const dateWithDay = format({ weekday: 'long', day: 'numeric', month: 'long' });
  const dayMonth = format({ day: 'numeric', month: 'long' });
  const shortDayMonth = format({ day: 'numeric', month: 'short' });
  const fullDate = format({ dateStyle: 'full' });
  const longDate = format({ dateStyle: 'long' });
  const monthYear = format({ month: 'long', year: 'numeric' });
  const frequencyOptions = [
    ['', 'À mon rythme'], ['une fois', 'Une fois'], ['chaque jour', 'Chaque jour'],
    ['chaque semaine', 'Chaque semaine'], ['jusqu’à la séance', 'Jusqu’à la séance'],
  ];
  const frequency = value => String(value ?? '').replace(/'/g, '’');
  const asDate = key => new Date(`${key}T00:00:00Z`);
  const dateKey = date => date.toISOString().slice(0, 10);
  const addDays = (key, offset) => {
    const date = asDate(key);
    date.setUTCDate(date.getUTCDate() + offset);
    return dateKey(date);
  };
  const today = (date = new Date()) => [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((value, index) => String(value).padStart(index === 0 ? 4 : 2, '0')).join('-');
  const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number.isFinite(asDate(value).getTime()) && dateKey(asDate(value)) === value;

  function plannedLabel(key, current = today()) {
    if (!validDate(key)) return '';
    if (key === current) return 'Aujourd’hui';
    if (key === addDays(current, 1)) return 'Demain';
    return dateWithDay.format(asDate(key)).replace(/\b1 /, '1er ');
  }

  function complete(step, feel, completedOn = today()) {
    Object.assign(step, { done: 1, feel, day: "AUJOURD'HUI", completedOn });
  }

  function groupCompleted(steps) {
    const months = new Map();
    const undated = [];
    const ordered = [...steps].sort((a, b) => String(b.completedOn ?? '').localeCompare(String(a.completedOn ?? '')));
    for (const step of ordered) {
      if (!validDate(step.completedOn)) {
        undated.push(step);
        continue;
      }
      const date = asDate(step.completedOn);
      const month = step.completedOn.slice(0, 7);
      const monday = addDays(step.completedOn, -((date.getUTCDay() + 6) % 7));
      if (!months.has(month)) months.set(month, new Map());
      const weeks = months.get(month);
      if (!weeks.has(monday)) weeks.set(monday, []);
      weeks.get(monday).push(step);
    }
    return { months, undated };
  }

  function weekLabel(monday) {
    const start = asDate(monday);
    const end = asDate(addDays(monday, 6));
    const from = start.getUTCMonth() === end.getUTCMonth() ? String(start.getUTCDate()) : dayMonth.format(start);
    return `Semaine du ${from.replace(/^1\b/, '1er')} au ${dayMonth.format(end).replace(/^1 /, '1er ')}`;
  }

  function row(step, { current, expanded } = {}) {
    const title = escape(step.t);
    const id = escape(step.id);
    const planned = plannedLabel(step.plannedDate, current);
    const dated = validDate(step.completedOn);
    const completion = dated ? `<time datetime="${step.completedOn}">${shortDayMonth.format(asDate(step.completedOn))}</time>` : '';
    const metadata = [completion, step.feel && `« ${escape(step.feel)} »`].filter(Boolean).join(' · ');
    const detail = step.done
      ? (metadata ? `<small class="psy-step-completion">${metadata}</small>` : '')
      : (planned ? `<small><time datetime="${step.plannedDate}">${escape(planned)}</time></small>` : '');
    return `<div class="psy-steps-row">
      ${step.done ? `<span class="psy-step-mark is-checked" aria-label="Terminé" role="img">${icon('check')}</span>` :
        `<button type="button" class="psy-step-check" data-a="pasck" data-i="${id}" aria-label="Marquer comme fait · ${title}" aria-expanded="${Boolean(expanded)}"><span class="psy-step-mark${expanded ? ' is-checked' : ''}" aria-hidden="true">${expanded ? icon('check') : ''}</span></button>`}
      <button type="button" class="psy-step-open" data-a="pasopen" data-i="${id}" aria-label="Modifier · ${title}">
        <span><span class="psy-step-title">${title}</span>${detail}</span>${step.done ? '' : icon('chevron-right')}
      </button>
    </div>`;
  }

  function completedRows(steps, order) {
    if (!steps.length) return '<p class="psy-steps-empty">Aucun petit pas terminé.</p>';
    const { months, undated } = groupCompleted(steps);
    const ordered = items => order === 'old' ? [...items].reverse() : items;
    return [...months].map(([month, weeks]) => `<section class="psy-steps-month">
      <h3>${monthYear.format(asDate(`${month}-01`))}</h3>
      ${[...weeks].map(([week, items]) => `<section class="psy-steps-week"><h4>${weekLabel(week)}</h4>${ordered(items).map(step => row(step)).join('')}</section>`).join('')}
    </section>`).join('') + (undated.length ? `<section class="psy-steps-month"><h3>Date non renseignée</h3>${undated.map(step => row(step)).join('')}</section>` : '');
  }

  function periodFor(step) {
    const date = step.done ? step.completedOn : step.plannedDate;
    return validDate(date) ? date.slice(0, 7) : '';
  }

  function periodOptions(items, selected = []) {
    const months = new Set([...items.map(periodFor), ...selected].filter(month => validDate(`${month}-01`)));
    return [...months].sort().reverse().map(month => {
      const label = monthYear.format(asDate(`${month}-01`));
      return [month, label[0].toLocaleUpperCase('fr-FR') + label.slice(1)];
    });
  }

  function matches(step, { periods = [], subjects = [] } = {}) {
    return (!periods.length || periods.includes(periodFor(step))) &&
      (!subjects.length || (Array.isArray(step.subjects) && step.subjects.some(subject => subjects.includes(subject))));
  }

  function renderContent({ items, tab, order, archive, expandedId, finish, intro = '', filters = {} }) {
    const hasFilters = Boolean(filters.periods?.length || filters.subjects?.length);
    const visible = items.filter(step => matches(step, filters));
    const steps = order === 'old' ? [...visible].reverse() : visible;
    const active = steps.filter(step => !step.done && archive[step.id] !== 'a');
    const done = steps.filter(step => step.done);
    const noMatches = '<p class="psy-steps-empty" role="status">Aucun petit pas pour ces filtres.</p>';
    const current = today();
    if (tab === 'done') return hasFilters && !done.length ? noMatches : completedRows(done, order);
    return `${hasFilters ? (!active.length ? noMatches : '') : intro}
      ${active.map(step => row(step, { current, expanded: expandedId === step.id }) + (expandedId === step.id ? finish(step) : '')).join('')}
      <button type="button" class="en-quiet en-add-bullet cursor-interaction" data-a="pasnew"><span class="en-plus" aria-hidden="true">+</span><span>Ajouter un petit pas</span></button>`;
  }

  function render(options) {
    const { tab } = options;
    const completed = tab === 'done';
    const tabs = [['current', 'En cours'], ['done', 'Terminés']].map(([key, label]) =>
      `<button type="button" data-a="steps-tab" data-k="${key}"${(key === 'done') === completed ? ' aria-current="page"' : ''}><span>${label}</span></button>`).join('');
    return `<section data-psy-steps-list>
      <nav class="psy-session-tabs psy-steps-tabs" aria-label="État des petits pas">${tabs}</nav>
      <div class="psy-steps-content">${renderContent(options)}</div>
    </section>`;
  }

  let mounted;
  function unmount() {
    mounted?.controller.abort();
    mounted?.wrapper.remove();
    mounted = null;
  }

  function mountSort(phone, root, { items, order, filters, onChange }) {
    const document = root.ownerDocument;
    const wrapper = document.createElement('div');
    const controller = new AbortController();
    const listener = { signal: controller.signal };
    mounted = { wrapper, controller };
    wrapper.className = 'psy-history-sort psy-steps-sort';
    const count = items.length;
    const countLabel = `${count} petit${count === 1 ? '' : 's'} pas`;
    const history = globalThis.__enPsyHistory;
    const disclosure = (name, label, glyph, options) => `
      <button type="button" class="psy-history-shortcut" data-steps-disclosure aria-expanded="false" aria-controls="psy-steps-${name}">${icon(glyph)}<span>${label}</span><span data-steps-filter-count hidden></span><i class="psy-history-chevron" data-lucide="chevron-right" aria-hidden="true"></i></button>
      <div id="psy-steps-${name}" class="psy-history-options" data-steps-filter="${name}" role="group" aria-label="${label}" hidden>${options.map(option => history.choice(option, filters[name]?.includes(option[0]))).join('') || '<p class="psy-steps-empty">Aucune période renseignée.</p>'}</div>`;
    wrapper.innerHTML = `<button type="button" class="psy-history-sort-button" aria-label="Trier par, ${countLabel}" aria-expanded="false" aria-controls="psy-steps-sort-menu">${icon('arrow-down-up')}<span aria-hidden="true">${count}</span></button>
      <div class="psy-history-sort-menu" id="psy-steps-sort-menu" role="group" aria-label="Options de tri" hidden>
        <div class="psy-history-menu-title"><span>Trier par</span><span>${countLabel}</span></div>
        <button type="button" class="psy-history-shortcut" data-steps-disclosure aria-expanded="false" aria-controls="psy-steps-sort-order">${icon('arrow-down-up')}<span>Ordre d’ajout</span><i class="psy-history-chevron" data-lucide="chevron-right" aria-hidden="true"></i></button>
        <div id="psy-steps-sort-order" hidden>${[['recent', 'Plus récents d’abord'], ['old', 'Plus anciens d’abord']].map(([key, label]) =>
          `<button type="button" class="psy-steps-order" data-order="${key}" aria-pressed="${key === (order || 'recent')}">${label}</button>`).join('')}</div>
        ${disclosure('periods', 'Période', 'calendar-days', periodOptions(items, filters.periods))}
        ${disclosure('subjects', 'Sujet', 'tag', history.subjects.map(label => [label, label]))}
      </div>`;
    const mode = phone.querySelector('.sbhas .psmsb');
    if (mode) mode.before(wrapper);
    else root.prepend(wrapper);
    globalThis.__enPsyIcons?.(wrapper);
    const trigger = wrapper.querySelector('.psy-history-sort-button');
    const menu = wrapper.querySelector('.psy-history-sort-menu');
    const disclosures = [...wrapper.querySelectorAll('[data-steps-disclosure]')];
    const choicesFor = button => document.getElementById(button.getAttribute('aria-controls'));
    function setDisclosure(button, open) {
      choicesFor(button).hidden = !open;
      button.setAttribute('aria-expanded', String(open));
    }
    function syncFilterCounts() {
      for (const button of disclosures) {
        const badge = button.querySelector('[data-steps-filter-count]');
        if (!badge) continue;
        const count = choicesFor(button).querySelectorAll('input:checked').length;
        badge.textContent = count;
        badge.hidden = count === 0;
      }
    }
    function setOpen(open) {
      menu.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
      if (open) disclosures[0].focus({ preventScroll: true });
      else for (const button of disclosures) setDisclosure(button, false);
    }
    syncFilterCounts();
    trigger.addEventListener('click', () => setOpen(menu.hidden), listener);
    menu.addEventListener('click', event => {
      const button = event.target.closest('[data-steps-disclosure]');
      if (button) setDisclosure(button, choicesFor(button).hidden);
      const choice = event.target.closest('[data-order]');
      if (!choice) return;
      for (const entry of menu.querySelectorAll('[data-order]')) entry.setAttribute('aria-pressed', String(entry === choice));
      onChange(choice.dataset.order);
      setOpen(false);
      trigger.focus({ preventScroll: true });
    }, listener);
    menu.addEventListener('change', event => {
      const group = event.target.closest('[data-steps-filter]');
      if (!group) return;
      filters[group.dataset.stepsFilter] = [...group.querySelectorAll('input:checked')].map(input => input.value);
      syncFilterCounts();
      onChange();
    }, listener);
    document.addEventListener('pointerdown', event => {
      if (!menu.hidden && !wrapper.contains(event.target)) setOpen(false);
    }, listener);
    wrapper.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || menu.hidden) return;
      event.stopPropagation();
      const expanded = disclosures.filter(button => !choicesFor(button).hidden);
      const active = expanded.find(button => button.contains(event.target) || choicesFor(button).contains(event.target)) || expanded.at(-1);
      if (active) {
        setDisclosure(active, false);
        active.focus({ preventScroll: true });
      } else {
        setOpen(false);
        trigger.focus({ preventScroll: true });
      }
    }, listener);
  }

  const twoDigits = number => String(number).padStart(2, '0');

  function reminderTime(value) {
    const match = /^\s*(\d{1,2})\s*(?:h\s*(\d{1,2})?|:\s*(\d{2}))\s*$/i.exec(String(value ?? ''));
    if (!match) return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2] ?? match[3] ?? 0);
    return hours < 24 && minutes < 60 ? { hours, minutes } : null;
  }

  function reminderStart(draft, original, now = new Date()) {
    const time = reminderTime(draft.r);
    if (!time) return '';
    if (validDate(draft.plannedDate)) return draft.plannedDate;
    const previous = reminderTime(original?.r);
    if (previous && previous.hours === time.hours && previous.minutes === time.minutes &&
      (original.plannedDate || '') === (draft.plannedDate || '') && frequency(original.rep) === frequency(draft.rep)) {
      return original.reminderStartsOn || '';
    }
    const day = today(now);
    const scheduled = new Date(now);
    scheduled.setHours(time.hours, time.minutes, 0, 0);
    return scheduled.getTime() > now.getTime() + 60000 ? day : addDays(day, 1);
  }

  function reminderSchedule(step, now, horizon, nextSession = '') {
    const time = reminderTime(step.r);
    const rep = frequency(step.rep);
    if (!time || (step.done && rep !== 'chaque jour')) return [];
    const day = today(now);
    const anchored = validDate(step.plannedDate) || validDate(step.reminderStartsOn);
    const start = validDate(step.plannedDate) ? step.plannedDate : (anchored ? step.reminderStartsOn : day);
    const recurring = rep === 'chaque jour' || (anchored && rep === 'chaque semaine');
    const untilSession = anchored && rep === 'jusqu’à la séance' && validDate(nextSession);
    const timestamps = [];
    for (let offset = 0; offset < horizon; offset += 1) {
      const key = addDays(day, offset);
      if (key < start || (untilSession && key >= nextSession)) continue;
      if (!recurring && !untilSession && key !== start) continue;
      if (recurring && rep === 'chaque semaine' && (asDate(key) - asDate(start)) % (7 * 86400000) !== 0) continue;
      const when = new Date(now);
      when.setDate(now.getDate() + offset);
      when.setHours(time.hours, time.minutes, 0, 0);
      timestamps.push(when.getTime());
    }
    return timestamps;
  }

  function editor(draft, isNew) {
    const { choice, subjects, validSubjects } = globalThis.__enPsyHistory;
    const selectedSubjects = validSubjects(draft.subjects);
    const selectedFrequency = frequencyOptions.find(([key]) => key === frequency(draft.rep)) || frequencyOptions[0];
    const date = validDate(draft.plannedDate) ? draft.plannedDate : '';
    const time = reminderTime(draft.r);
    return `<div class="ps-grab" aria-hidden="true"></div>
      <section class="psy-steps-form" data-psy-steps-editor role="dialog" aria-label="${isNew ? 'Un petit pas' : 'Mon petit pas'}">
        <div class="psy-steps-editor-header"><h2>${isNew ? 'Un petit pas' : 'Mon petit pas'}</h2><button class="psy-steps-icon-button" type="button" data-a="sclose" aria-label="Fermer le volet">${icon('x')}</button></div>
        <label class="psy-steps-field">Petit pas<textarea rows="2" data-f="ed.t" placeholder="Écris ton petit pas…">${escape(draft.t)}</textarea></label>
        <details class="psy-steps-editor-menu" name="psy-steps-editor-menu">
          <summary class="psy-steps-field-toggle">${icon('tag')}<span>Sujets principaux</span><span data-steps-subject-count${selectedSubjects.length ? '' : ' hidden'}>${selectedSubjects.length}</span><i class="psy-steps-chevron" data-lucide="chevron-down" aria-hidden="true"></i></summary>
          <div class="psy-history-options" data-steps-subject-picker role="group" aria-label="Choisir les sujets principaux">
            ${subjects.map(label => choice([label, label], selectedSubjects.includes(label))).join('')}
          </div>
        </details>
        <div class="psy-steps-field">
          <label for="psy-step-planned-date">Date prévue <small>facultative</small></label>
          <div class="psy-steps-date">
            <input type="date" id="psy-step-planned-date" value="${date}">
            <span data-steps-date-label aria-hidden="true"></span>
            <button type="button" class="psy-steps-icon-button psy-steps-date-clear" aria-label="Retirer la date"${date ? '' : ' hidden'}>${icon('x')}</button>
            <button type="button" class="psy-steps-icon-button psy-steps-date-trigger" aria-label="Calendrier de la date prévue" aria-haspopup="dialog" aria-expanded="false" aria-controls="psy-steps-calendar">${icon('calendar-days')}</button>
          </div>
        </div>
        <div class="psy-steps-field">
          <span id="psy-steps-frequency-label">Fréquence <small>facultative</small></span>
          <details class="psy-steps-editor-menu" name="psy-steps-editor-menu">
            <summary class="psy-steps-field-toggle" aria-labelledby="psy-steps-frequency-label psy-steps-frequency-value"><span id="psy-steps-frequency-value">${selectedFrequency[1]}</span><i class="psy-steps-chevron" data-lucide="chevron-down" aria-hidden="true"></i></summary>
            <div class="psy-history-options" data-steps-frequency role="group" aria-label="Choisir la fréquence">
              ${frequencyOptions.map(([key, label]) => `<label class="psy-history-option psy-steps-radio"><span>${label}</span><input type="radio" name="psy-step-frequency" value="${key}"${key === selectedFrequency[0] ? ' checked' : ''}></label>`).join('')}
            </div>
          </details>
        </div>
        <label class="psy-steps-reminder">${icon('bell')}<span>Rappel <small>facultatif</small></span><input type="checkbox" role="switch" aria-controls="psy-steps-reminder-options"${time ? ' checked' : ''}></label>
        <div class="psy-steps-field" id="psy-steps-reminder-options"${time ? '' : ' hidden'}>
          <span id="psy-steps-reminder-label">Heure du rappel</span>
          <div class="psy-steps-time" role="group" aria-labelledby="psy-steps-reminder-label">
            <span class="psy-steps-time-divider" aria-hidden="true">h</span>
            <div class="psy-steps-wheel" data-steps-time="hours" role="radiogroup" aria-label="Heures"></div>
            <div class="psy-steps-wheel" data-steps-time="minutes" role="radiogroup" aria-label="Minutes"></div>
          </div>
        </div>
        <button class="ps-btn psy-steps-save" type="button" data-a="edsave">${isNew ? 'Ajouter' : 'Enregistrer'}</button>
        ${isNew ? '' : '<button class="ps-del" type="button" data-a="eddel">retirer ce petit pas</button>'}
      </section>`;
  }

  function mountEditor(sheet, draft, onClose) {
    const doc = sheet.ownerDocument;
    const body = sheet.querySelector('.in');
    const root = body.querySelector('[data-psy-steps-editor]');
    const get = selector => root.querySelector(selector);
    const dateInput = get('#psy-step-planned-date');
    const dateLabel = get('[data-steps-date-label]');
    const dateTrigger = get('.psy-steps-date-trigger');
    const clearDate = get('.psy-steps-date-clear');
    const overlay = doc.createElement('div');
    overlay.className = 'psy-steps-calendar-overlay';
    overlay.hidden = true;
    overlay.innerHTML = `<div class="psy-steps-calendar" id="psy-steps-calendar" role="dialog" aria-modal="true" aria-label="Choisir une date">
      <div class="psy-steps-editor-header"><span>Choisir une date</span><button type="button" class="psy-steps-icon-button" data-calendar-close aria-label="Fermer le calendrier">${icon('x')}</button></div>
      <div class="psy-steps-calendar-month"><button type="button" class="psy-steps-icon-button" data-calendar-shift="-1" aria-label="Mois précédent">${icon('chevron-left')}</button><span aria-live="polite"></span><button type="button" class="psy-steps-icon-button" data-calendar-shift="1" aria-label="Mois suivant">${icon('chevron-right')}</button></div>
      <div class="psy-steps-calendar-week" aria-hidden="true">${['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => `<span>${day}</span>`).join('')}</div>
      <div class="psy-steps-calendar-days"></div>
    </div>`;
    sheet.classList.add('psy-steps-sheet');
    sheet.append(overlay);
    const calendar = overlay.firstElementChild;
    const days = calendar.querySelector('.psy-steps-calendar-days');
    const closeButton = calendar.querySelector('[data-calendar-close]');
    let month;

    function syncDate() {
      const key = validDate(dateInput.value) ? dateInput.value : '';
      draft.plannedDate = key;
      dateLabel.textContent = key ? longDate.format(asDate(key)) : 'Sans date';
      clearDate.hidden = !key;
    }

    function renderCalendar() {
      calendar.querySelector('[aria-live]').textContent = monthYear.format(month);
      const first = (month.getUTCDay() + 6) % 7;
      const last = new Date(month);
      last.setUTCMonth(last.getUTCMonth() + 1, 0);
      const date = new Date(month);
      const current = today();
      const buttons = Array.from({ length: last.getUTCDate() }, (_, index) => {
        date.setUTCDate(index + 1);
        const key = dateKey(date);
        return `<button type="button" data-calendar-day="${key}" aria-label="${fullDate.format(date)}" aria-pressed="${key === draft.plannedDate}"${key === current ? ' aria-current="date"' : ''}>${index + 1}</button>`;
      });
      days.innerHTML = '<span aria-hidden="true"></span>'.repeat(first) + buttons.join('');
    }

    function positionCalendar() {
      if (overlay.hidden) return;
      const outer = sheet.getBoundingClientRect(), inner = body.getBoundingClientRect();
      const bounds = calendar.getBoundingClientRect();
      const center = inner.top - outer.top + inner.height / 2;
      const top = Math.max(8, Math.min(outer.height - bounds.height - 8, center - bounds.height / 2));
      calendar.style.top = `${top}px`;
    }
    const calendarLayout = new ResizeObserver(positionCalendar);
    function closeCalendar(restoreFocus = false) {
      overlay.hidden = true;
      body.inert = false;
      dateTrigger.setAttribute('aria-expanded', 'false');
      calendarLayout.disconnect();
      if (restoreFocus) dateTrigger.focus({ preventScroll: true });
    }

    dateTrigger.addEventListener('click', () => {
      month = asDate(draft.plannedDate || today());
      month.setUTCDate(1);
      renderCalendar();
      body.inert = true;
      overlay.hidden = false;
      dateTrigger.setAttribute('aria-expanded', 'true');
      calendarLayout.observe(body);
      calendarLayout.observe(sheet);
      positionCalendar();
      closeButton.focus({ preventScroll: true });
    });
    dateInput.addEventListener('input', syncDate);
    clearDate.addEventListener('click', () => {
      dateInput.value = '';
      syncDate();
      dateInput.focus({ preventScroll: true });
    });
    overlay.addEventListener('click', event => {
      if (event.target === overlay || event.target.closest('[data-calendar-close]')) closeCalendar(true);
      const shift = event.target.closest('[data-calendar-shift]');
      if (shift) {
        month.setUTCMonth(month.getUTCMonth() + Number(shift.dataset.calendarShift), 1);
        renderCalendar();
      }
      const day = event.target.closest('[data-calendar-day]');
      if (day) {
        dateInput.value = day.dataset.calendarDay;
        syncDate();
        closeCalendar(true);
      }
    });
    overlay.addEventListener('keydown', event => {
      const movement = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key];
      const key = event.target.dataset.calendarDay;
      if (!movement || !key) return;
      event.preventDefault();
      const next = addDays(key, movement);
      if (key.slice(0, 7) !== next.slice(0, 7)) {
        month = asDate(`${next.slice(0, 7)}-01`);
        renderCalendar();
      }
      days.querySelector(`[data-calendar-day="${next}"]`)?.focus({ preventScroll: true });
    });

    get('[data-steps-subject-picker]').addEventListener('change', event => {
      draft.subjects = globalThis.__enPsyHistory.validSubjects([...event.currentTarget.querySelectorAll('input:checked')].map(input => input.value));
      const count = get('[data-steps-subject-count]');
      count.textContent = draft.subjects.length;
      count.hidden = !draft.subjects.length;
    });
    const frequencies = get('[data-steps-frequency]');
    frequencies.addEventListener('change', event => {
      draft.rep = event.target.value;
      get('#psy-steps-frequency-value').textContent = frequencyOptions.find(([value]) => value === draft.rep)[1];
    });
    frequencies.closest('details').addEventListener('toggle', event => {
      if (!event.currentTarget.open) return;
      const checked = frequencies.querySelector('input:checked').closest('label');
      frequencies.scrollTop = Math.max(0, checked.offsetTop - frequencies.firstElementChild.offsetTop + checked.offsetHeight - frequencies.clientHeight);
    });

    const switchControl = get('input[role="switch"]');
    const reminderOptions = get('#psy-steps-reminder-options');
    const wheels = [...reminderOptions.querySelectorAll('[data-steps-time]')];
    let clock = reminderTime(draft.r);
    function centered(wheel) {
      const index = Math.round(wheel.scrollTop / wheel.firstElementChild.offsetHeight);
      return wheel.children[Math.max(0, Math.min(index, wheel.children.length - 1))].querySelector('input');
    }
    function syncTime() {
      if (!switchControl.checked) return;
      const [hours, minutes] = wheels.map(wheel => centered(wheel).value);
      draft.r = hours ? `${hours} h ${minutes}` : '';
      clock = reminderTime(draft.r);
    }
    function selectNumber(wheel, input) {
      input.checked = true;
      wheel.scrollTop = input.closest('label').offsetTop - wheel.firstElementChild.offsetTop;
    }
    for (const wheel of wheels) {
      const hours = wheel.dataset.stepsTime === 'hours';
      const numbers = Array.from({ length: hours ? 25 : 60 }, (_, index) => {
        const n = hours ? index - 1 : index;
        const value = n < 0 ? '' : twoDigits(n);
        return `<label class="psy-steps-number"><span>${value || '—'}</span><input type="radio" name="psy-step-${wheel.dataset.stepsTime}" value="${value}" aria-label="${value ? `${value} ${hours ? 'heures' : 'minutes'}` : 'Sans heure'}"></label>`;
      });
      wheel.innerHTML = numbers.join('');
      wheel.addEventListener('change', event => {
        selectNumber(wheel, event.target);
        syncTime();
      });
      wheel.addEventListener('scroll', () => {
        if (!wheel.clientHeight) return;
        centered(wheel).checked = true;
        syncTime();
      }, { passive: true });
    }
    function showTime() {
      reminderOptions.hidden = !switchControl.checked;
      if (!switchControl.checked) return;
      const parts = clock ? [twoDigits(clock.hours), twoDigits(clock.minutes)] : ['', '00'];
      wheels.forEach((wheel, index) => selectNumber(wheel, wheel.querySelector(`input[value="${parts[index]}"]`)));
    }
    switchControl.addEventListener('change', () => {
      if (!switchControl.checked) draft.r = '';
      showTime();
      if (switchControl.checked) syncTime();
    });
    sheet.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      if (!overlay.hidden) closeCalendar(true);
      else {
        const disclosure = get('details[open]');
        if (disclosure) {
          disclosure.open = false;
          disclosure.querySelector('summary').focus({ preventScroll: true });
        } else onClose();
      }
    });
    syncDate();
    showTime();
    globalThis.__enPsyIcons?.(sheet);
    return { syncTime, cleanup: closeCalendar };
  }

  globalThis.__enPsySteps = { render, renderContent, mountSort, unmount, validDate, today, plannedLabel, complete, groupCompleted, matches, periodOptions, editor, mountEditor, reminderStart, reminderSchedule };
})();
