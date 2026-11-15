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
  const monthYear = format({ month: 'long', year: 'numeric' });
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
    const completion = dated ? `Fait le ${dayMonth.format(asDate(step.completedOn))}` : '';
    const metadata = [completion, step.feel && `« ${step.feel} »`].filter(Boolean).join(' · ');
    const detail = step.done
      ? (metadata ? `<small>${escape(metadata)}</small>` : '')
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

  function render({ items, tab, order, archive, expandedId, finish, intro = '' }) {
    const steps = order === 'old' ? [...items].reverse() : items;
    const active = steps.filter(step => !step.done && archive[step.id] !== 'a');
    const done = steps.filter(step => step.done);
    const current = today();
    const completed = tab === 'done';
    const tabs = [['current', 'En cours'], ['done', 'Terminés']].map(([key, label]) =>
      `<button type="button" data-a="steps-tab" data-k="${key}"${(key === 'done') === completed ? ' aria-current="page"' : ''}><span>${label}</span></button>`).join('');
    return `<section data-psy-steps-list>
      <nav class="psy-session-tabs psy-steps-tabs" aria-label="État des petits pas">${tabs}</nav>
      <div class="psy-steps-content">${completed ? completedRows(done, order) : `${intro}
        ${active.map(step => row(step, { current, expanded: expandedId === step.id }) + (expandedId === step.id ? finish(step) : '')).join('')}
        <button type="button" class="en-quiet en-add-bullet cursor-interaction" data-a="pasnew"><span class="en-plus" aria-hidden="true">+</span><span>Ajouter un petit pas</span></button>`}</div>
    </section>`;
  }

  let mounted;
  function unmount() {
    mounted?.controller.abort();
    mounted?.wrapper.remove();
    mounted = null;
  }

  function mountSort(phone, root, { count, order, onOrder }) {
    const document = root.ownerDocument;
    const wrapper = document.createElement('div');
    const controller = new AbortController();
    const listener = { signal: controller.signal };
    mounted = { wrapper, controller };
    wrapper.className = 'psy-history-sort psy-steps-sort';
    const countLabel = `${count} petit${count === 1 ? '' : 's'} pas`;
    wrapper.innerHTML = `<button type="button" class="psy-history-sort-button" aria-label="Trier par, ${countLabel}" aria-expanded="false" aria-controls="psy-steps-sort-menu">${icon('arrow-down-up')}<span aria-hidden="true">${count}</span></button>
      <div class="psy-history-sort-menu" id="psy-steps-sort-menu" role="group" aria-label="Options de tri" hidden>
        <div class="psy-history-menu-title"><span>Trier par</span><span>${countLabel}</span></div>
        <button type="button" class="psy-history-shortcut" aria-expanded="false" aria-controls="psy-steps-sort-order">${icon('arrow-down-up')}<span>Ordre d’ajout</span><i class="psy-history-chevron" data-lucide="chevron-right" aria-hidden="true"></i></button>
        <div id="psy-steps-sort-order" hidden>${[['recent', 'Plus récents d’abord'], ['old', 'Plus anciens d’abord']].map(([key, label]) =>
          `<button type="button" class="psy-steps-order" data-order="${key}" aria-pressed="${key === (order || 'recent')}">${label}</button>`).join('')}</div>
      </div>`;
    const mode = phone.querySelector('.sbhas .psmsb');
    if (mode) mode.before(wrapper);
    else root.prepend(wrapper);
    globalThis.__enPsyIcons?.(wrapper);
    const trigger = wrapper.querySelector('.psy-history-sort-button');
    const menu = wrapper.querySelector('.psy-history-sort-menu');
    const disclosure = wrapper.querySelector('.psy-history-shortcut');
    const choices = wrapper.querySelector('#psy-steps-sort-order');
    function setOpen(open) {
      menu.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
      if (open) disclosure.focus({ preventScroll: true });
      else {
        choices.hidden = true;
        disclosure.setAttribute('aria-expanded', 'false');
      }
    }
    trigger.addEventListener('click', () => setOpen(menu.hidden), listener);
    disclosure.addEventListener('click', () => {
      choices.hidden = !choices.hidden;
      disclosure.setAttribute('aria-expanded', String(!choices.hidden));
    }, listener);
    choices.addEventListener('click', event => {
      const choice = event.target.closest('[data-order]');
      if (choice) onOrder(choice.dataset.order);
    }, listener);
    document.addEventListener('pointerdown', event => {
      if (!menu.hidden && !wrapper.contains(event.target)) setOpen(false);
    }, listener);
    wrapper.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || menu.hidden) return;
      event.stopPropagation();
      setOpen(false);
      trigger.focus({ preventScroll: true });
    }, listener);
  }

  globalThis.__enPsySteps = { render, mountSort, unmount, validDate, plannedLabel, complete, groupCompleted };
})();
