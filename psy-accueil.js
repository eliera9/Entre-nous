/* Accueil Psy · aperçu des séances et des petits pas du coffre. */
(() => {
  const labels = {
    upcoming: ['Prochain rendez-vous', 'Préparer ma séance', 'prep'],
    current: ['Ma séance en cours', 'Ouvrir ma séance', 'mode'],
    return: ['Mon retour sur la séance', 'Écrire sur ma séance', 'apres'],
  };
  const icon = name => `<i data-lucide="${name}" aria-hidden="true"></i>`;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const format = options => new Intl.DateTimeFormat('fr-FR', options);
  const dateOf = date => new Date(date + 'T12:00:00');
  const longDate = format({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const shortDate = format({ day: 'numeric', month: 'short' });
  const weekday = format({ weekday: 'short' });
  const month = format({ month: 'short' });
  const monthYear = format({ month: 'short', year: 'numeric' });
  const capitalize = text => text[0].toLocaleUpperCase('fr-FR') + text.slice(1);
  const newest = (a, b) => b.date.localeCompare(a.date) || (b.calendarTime || '').localeCompare(a.calendarTime || '');

  const hasModeNotes = session => Boolean(session?.modeDraft?.note?.trim());

  function cardsFor(sessions, next, today, time) {
    const upcoming = next && { id: next.session?.id || 'next', date: next.date, calendarTime: next.time, kind: 'upcoming' };
    const cards = [];
    for (const item of sessions) {
      if (item.completed || item.id === upcoming?.id) continue;
      if (hasModeNotes(item)) {
        cards.push({ ...item, kind: 'current' });
        continue;
      }
      const appointmentPassed = item.calendarKey && (item.date < today ||
        item.date === today && (!item.calendarTime || item.calendarTime <= time));
      if (item.fromMode || appointmentPassed || globalThis.__enPsyAfter.hasContent(item)) {
        cards.push({ ...item, kind: 'return' });
      }
    }
    cards.sort(newest);
    if (upcoming) cards.unshift(upcoming);
    return cards;
  }

  function historyRows(records) {
    if (!records.length) return '<p class="psy-home-empty">Tes séances terminées apparaîtront ici.</p>';
    const groups = new Map();
    for (const record of records) {
      const key = record.date.slice(0, 7);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(record);
    }
    return [...groups.values()].map(group => `<div class="history-month">
      <h4>${capitalize(monthYear.format(dateOf(group[0].date)))}</h4>
      <div class="history-month-rows">
        ${group.map(record => `<button type="button" class="history-preview" data-a="session-archive" data-i="${escape(record.id)}">
          <span>${escape(record.title || record.q || 'Séance du ' + shortDate.format(dateOf(record.date)))}</span>
          <time datetime="${record.date}" aria-label="${longDate.format(dateOf(record.date))}">${shortDate.format(dateOf(record.date))}</time>
          ${icon('chevron-right')}</button>`).join('')}
      </div>
      </div>`).join('');
  }

  function history(records) {
    return `<section class="history-block" aria-labelledby="psy-history-title">
      <div class="history-header"><h3 class="history-heading" id="psy-history-title">${icon('archive')} Historique des séances</h3>
        <button type="button" class="history-all" data-a="psy-page" data-k="seances"><span class="history-all-core">Tout voir ${icon('chevron-right')}</span></button></div>
      ${historyRows([...records].sort(newest).slice(0, 2))}</section>`;
  }

  function steps(items) {
    const done = items.filter(item => item.done).length;
    const next = items.find(item => !item.done);
    const marks = Array.from({ length: Math.min(items.length, 8) }, (_, index) => icon(index < done ? 'circle-check' : 'circle')).join('');
    return `<section class="steps-overview" aria-labelledby="psy-steps-title">
      <div class="steps-header"><h3 class="steps-heading" id="psy-steps-title">${icon('footprints')} Mes petits pas</h3>
        <button type="button" class="steps-view" data-a="psy-page" data-k="pas" aria-label="Ouvrir Mes petits pas"><span class="steps-view-core">Ouvrir ${icon('chevron-right')}</span></button></div>
      ${items.length ? `<p class="steps-overview-count">${done} pas ${done > 1 ? 'faits' : 'fait'} sur ${items.length}<span class="steps-count-checks" aria-hidden="true">${marks}</span></p>` : ''}
      ${next ? `<p class="steps-overview-next">${icon('circle')}<span>${escape(next.t)}</span></p>` : ''}
      ${items.length ? '' : '<p class="psy-home-empty">Tes petits pas apparaîtront ici.</p>'}</section>`;
  }

  function cardMarkup(card, hasUnfinished) {
    const date = card ? dateOf(card.date) : new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const caption = `${weekday.format(date)} ${month.format(date)}`;
    const time = card?.calendarTime;
    const [title, action, phase] = card ? labels[card.kind] : ['Aucune séance à poursuivre', 'Ajouter un rendez-vous'];
    const id = escape(card?.id);
    const open = card ? `data-a="session-open" data-i="${id}"` : 'data-a="enaddpsy"';
    const label = longDate.format(date);
    return `<div class="title-card-body">
      ${card ? `<button type="button" class="psy-card-hit" ${open} aria-label="${title}, ${label}"></button>` : ''}
      <div class="title-date">
        ${card ? '' : `<span class="psy-home-sr">Aujourd’hui, ${label}</span>`}
        <strong aria-hidden="true">${day}</strong><div class="date-caption-text" aria-hidden="true">${caption}</div>
        ${time ? `<time datetime="${time}"><span class="time-core">${icon('clock')} ${Number(time.slice(0, 2))} h ${time.slice(3)}</span></time>` : ''}</div>
      <div class="title-card-main"><h3><span class="title-text">${title}</span></h3><div class="action-row">
        <button type="button" class="session-action" ${open}${phase ? ` data-k="${phase}"` : ''}>
          <span class="action-core">${action} ${icon(card ? 'notebook-pen' : 'calendar-plus')}</span></button></div>
        ${card && !hasUnfinished ? '<p class="psy-card-status">Aucune séance à poursuivre</p>' : ''}</div></div>`;
  }

  function render({ records, items }) {
    return `<div class="psy-home">
      <section class="title-card" data-psy-carousel aria-label="Éphéméride des séances" aria-roledescription="carrousel"></section>
      ${history(records)}${steps(items)}
      <button type="button" class="evolution-button" data-a="psy-page" data-k="evol">${icon('route')}<span>Mon évolution</span>${icon('chevron-right')}</button>
      </div>`;
  }

  function mount(root, cards, position) {
    const carousel = root.querySelector('[data-psy-carousel]');
    const hasUnfinished = cards.some(card => card.kind !== 'upcoming');
    let index = Math.max(0, cards.findIndex(card => card.id === position.id));
    let touch;
    let swipedAt = -Infinity;
    function draw() {
      position.id = cards[index]?.id;
      carousel.innerHTML = `<div class="psy-card-panel" aria-live="polite">${cardMarkup(cards[index], hasUnfinished)}</div>` + (cards.length > 1 ? `
        <nav class="card-navigation" aria-label="Cartes de l’Éphéméride">
          <button type="button" class="pager-arrow" data-step="-1" aria-label="Carte précédente">${icon('chevron-left')}</button>
          <div class="pager-markers">${cards.map((card, i) => `<button type="button" class="pager-marker" data-card="${i}"
            aria-label="${labels[card.kind][0]}, ${longDate.format(dateOf(card.date))}, carte ${i + 1} sur ${cards.length}"${i === index ? ' aria-current="true"' : ''}><span></span></button>`).join('')}</div>
          <button type="button" class="pager-arrow" data-step="1" aria-label="Carte suivante">${icon('chevron-right')}</button></nav>` : '');
      globalThis.__enPsyIcons?.(carousel);
    }
    function turn(value, focus) {
      if (cards.length < 2) return;
      index = (value + cards.length) % cards.length;
      draw();
      if (focus) carousel.querySelector(focus)?.focus({ preventScroll: true });
    }
    carousel.addEventListener('click', event => {
      if (event.detail && performance.now() - swipedAt < 300) { event.stopPropagation(); return; }
      const step = event.target.closest('[data-step]');
      const marker = event.target.closest('[data-card]');
      if (step) turn(index + Number(step.dataset.step), `[data-step="${step.dataset.step}"]`);
      if (marker) turn(Number(marker.dataset.card), '[aria-current="true"]');
    });
    carousel.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || cards.length < 2) return;
      event.preventDefault();
      turn(index + (event.key === 'ArrowRight' ? 1 : -1), '[aria-current="true"]');
    });
    carousel.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch' && event.target.closest('.title-card-body')) touch = [event.pointerId, event.clientX, event.clientY];
    });
    carousel.addEventListener('pointercancel', () => { touch = null; });
    carousel.addEventListener('pointerup', event => {
      if (touch?.[0] !== event.pointerId) return;
      const x = event.clientX - touch[1], y = event.clientY - touch[2];
      touch = null;
      if (Math.abs(x) > 36 && Math.abs(x) > Math.abs(y) * 1.3 && cards.length > 1) {
        swipedAt = performance.now();
        turn(index + (x < 0 ? 1 : -1));
      }
    });
    draw();
  }

  globalThis.__enPsyHome = { render, mount, cardsFor, hasModeNotes };
})();
