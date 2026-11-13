/* Une séance garde son identifiant lorsque son rendez-vous change de date. */
(() => {
  'use strict';
  const iso = date => [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part, index) => String(part).padStart(index === 0 ? 4 : 2, '0')).join('-');
  const eventDate = event => iso(new Date(event.y, event.m, event.d));
  const day = date => new Date(date + 'T00:00:00');
  const utcDay = date => Date.parse(date + 'T00:00:00Z') / 86400000;
  const valid = date => /^\d{4}-\d{2}-\d{2}$/.test(date || '') && Number.isFinite(+day(date)) && iso(day(date)) === date;
  const shortTime = (hour, minute = 0) => hour == null ? '' : String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');

  function occurs(event, date) {
    const origin = eventDate(event);
    if (origin === date) return true;
    if (!event.rep || origin > date) return false;
    if (event.rep === 3) return Number(date.slice(-2)) === Number(event.d);
    const interval = event.rep === 1 ? 7 : event.rep === 2 ? 14 : 0;
    return interval > 0 && (utcDay(date) - utcDay(origin)) % interval === 0;
  }

  function occurrence(event, originalDate, override = {}) {
    return { ...event, ...override, originalDate, date: override.date || originalDate };
  }

  function onDate(calendar, date) {
    const result = [];
    for (const event of calendar) {
      if (event?.t !== 'psy') continue;
      if (occurs(event, date) && !event.psyMoves?.[date]) result.push(occurrence(event, date));
      if (!event.rep) continue;
      for (const [originalDate, override] of Object.entries(event.psyMoves || {})) {
        if (override.date === date) result.push(occurrence(event, originalDate, override));
      }
    }
    return result;
  }

  function linked(calendar, item, next) {
    if (next) {
      const original = next.e.originalDate || iso(next.dt);
      return { event: calendar.find(entry => entry.id === next.e.id), original };
    }
    if (!item?.calendarKey) return {};
    const [, id, original] = item.calendarKey.split(':');
    return { event: calendar.find(entry => entry.t === 'psy' && String(entry.id) === id), original };
  }

  function proposal(value, originalDate) {
    const date = value.date;
    const start = value.start ? value.start.split(':').map(Number) : [];
    const end = value.end ? value.end.split(':').map(Number) : [];
    return { date, originalDate, h: start[0] ?? null, mi: start[1] ?? 0, hf: end[0] ?? null, mf: end[1] ?? 0 };
  }
  function minutes(h, m) {
    return Number.isInteger(h) && h >= 0 && h < 24 ? h * 60 + (m || 0) : null;
  }
  function overlaps(calendar, candidate, event) {
    const start = minutes(candidate.h, candidate.mi);
    const end = minutes(candidate.hf, candidate.mf);
    if (start == null || end == null || end <= start) return false;
    return onDate(calendar, candidate.date).some(other => {
      if (other.id === event?.id && (!event.rep || other.originalDate === candidate.originalDate)) return false;
      const otherStart = minutes(other.h, other.mi);
      const otherEnd = minutes(other.hf, other.mf);
      return otherStart != null && otherEnd != null && otherEnd > otherStart && start < otherEnd && otherStart < end;
    });
  }

  function calendarChange(event, newValues, candidate) {
    if (event.rep && candidate.originalDate) {
      const moves = { ...event.psyMoves };
      const { date, h, mi, hf, mf } = candidate;
      const changes = date !== candidate.originalDate || h !== (newValues.h ?? null) ||
        mi !== (newValues.mi ?? 0) || hf !== (newValues.hf ?? null) || mf !== (newValues.mf ?? 0);
      if (changes) moves[candidate.originalDate] = { date, h, mi, hf, mf };
      else delete moves[candidate.originalDate];
      return { ...newValues, id: event.id, psyMoves: moves };
    }
    const [y, m, d] = candidate.date.split('-').map(Number);
    const { h, mi, hf, mf } = candidate;
    return { ...newValues, id: event.id, y, m: m - 1, d, h, mi, hf, mf };
  }

  function open(root, opener, { item, next, calendar, history, onSave }) {
    const { event, original } = linked(calendar, item, next);
    const oldDate = item?.date || (next && iso(next.dt));
    if (!oldDate) return;
    const old = event?.psyMoves?.[original] || event;
    edit(root, opener, { oldDate, old, original, event, calendar,
      consequence: event ? (event.rep ? 'Ce rendez-vous sera déplacé dans le calendrier. Les autres dates de la série resteront à leur place.' :
        'Le rendez-vous sera mis à jour dans le calendrier.') : 'La date de la séance sera corrigée dans ton espace Psy.',
      async onApply(candidate) {
        if (event && calendar.find(entry => entry.id === event.id) !== event) throw new Error('Le rendez-vous a changé. Ferme ce volet et rouvre-le pour voir sa dernière version.');
        const session = item || globalThis.__enPsyAfter.appointment(next, true, false);
        if (!session || item && item.date !== oldDate) throw new Error('Cette séance a changé. Ferme ce volet et rouvre-le.');
        const previousEvent = event && { ...event };
        const previousDate = session.date;
        const previousCalendar = { calendarDate: session.calendarDate, calendarTime: session.calendarTime };
        if (event) Object.assign(event, calendarChange(event,event,candidate));
        globalThis.__enPsyAfter.setDate(session, candidate.date, history, event ? {
          calendarDate: candidate.date, calendarTime: shortTime(candidate.h,candidate.mi) || null,
        } : {});
        try { await globalThis.__vaultPushNow?.(); }
        catch (error) {
          if (event) {
            for (const key of Object.keys(event)) if (!Object.hasOwn(previousEvent,key)) delete event[key];
            Object.assign(event,previousEvent);
          }
          globalThis.__enPsyAfter.setDate(session,previousDate,history,previousCalendar);
          throw error;
        }
        globalThis.__enCalRefresh?.();
      }, onSave,
    });
  }

  function edit(root, opener, { oldDate, old, initial = old, original, event, calendar, consequence, onApply, onSave, onSeries }) {
    const dialog = document.createElement('dialog');
    dialog.className = 'en-avant-dialog en-psy-date-dialog';
    dialog.setAttribute('aria-labelledby','psy-date-dialog-title');
    const times = Boolean(event);
    dialog.innerHTML = `<header><h3 id="psy-date-dialog-title">Modifier la date</h3>
      <button type="button" data-close aria-label="Fermer le volet"><i data-lucide="x" aria-hidden="true"></i></button></header>
      <p>Ancienne date <strong data-old-date></strong></p>
      <form>
        <label>Nouvelle date <input type="date" name="date" required min="0001-01-01" max="9999-12-31"></label>
        ${times ? '<div class="en-psy-date-times"><label>Début <input type="time" name="start"></label><label>Fin <input type="time" name="end"></label></div>' : ''}
        <p data-new-date></p><p data-consequence></p>
        <p data-conflict role="status" hidden>Ce créneau chevauche un autre rendez-vous Psy.</p>
        <p data-error role="alert"></p>
        <div class="en-psy-date-actions">
          <button type="button" data-dismiss>Annuler</button>
          <button type="button" data-adjust hidden>Revoir l’horaire</button>
          <button type="submit" data-confirm>Confirmer</button>
          ${onSeries ? '<button type="button" data-series>Modifier la série</button>' : ''}
        </div>
      </form>`;
    const get = selector => dialog.querySelector(selector);
    const form = get('form');
    const { date, start, end } = form.elements;
    const confirm = get('[data-confirm]');
    const adjust = get('[data-adjust]');
    const conflict = get('[data-conflict]');
    const error = get('[data-error]');
    const label = value => globalThis.__enPsyAvant.labelDate(value);
    get('[data-old-date]').textContent = label(oldDate) + (shortTime(old?.h,old?.mi) ? ' · ' + shortTime(old.h,old.mi) : '');
    get('[data-consequence]').textContent = consequence + ' Tes notes seront conservées.';
    date.value = initial?.date || oldDate;
    if (times) {
      start.value = shortTime(initial?.h,initial?.mi);
      end.value = shortTime(initial?.hf,initial?.mf);
    }
    const values = () => proposal({ date: date.value, start: start?.value, end: end?.value }, original);
    function display() {
      const candidate = values();
      const good = valid(candidate.date);
      const badEnd = candidate.hf != null && (candidate.h == null || minutes(candidate.h,candidate.mi) >= minutes(candidate.hf,candidate.mf));
      get('[data-new-date]').textContent = good ? label(candidate.date) : '';
      error.textContent = badEnd ? 'Indique une heure de fin après le début, ou laisse la fin vide.' : '';
      const over = good && !badEnd && overlaps(calendar,candidate,event);
      conflict.hidden = adjust.hidden = !over;
      confirm.textContent = over ? 'Maintenir les deux rendez-vous' : 'Confirmer';
      confirm.disabled = !good || badEnd;
    }
    let pending = false;
    form.addEventListener('input', () => { if (!pending) display(); });
    get('[data-dismiss]').addEventListener('click', () => dialog.close());
    adjust.addEventListener('click', () => start?.focus());
    get('[data-series]')?.addEventListener('click', () => {
      dialog.addEventListener('close', onSeries, { once: true });
      dialog.close();
    });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (pending || confirm.disabled) return;
      pending = true;
      confirm.disabled = true;
      const candidate = values();
      dialog.addEventListener('cancel', blockClose);
      for (const field of form.elements) field.disabled = true;
      get('[data-close]').disabled = true;
      try {
        await onApply(candidate);
        dialog.close();
        onSave?.();
      } catch (failure) {
        error.textContent = failure.message || 'La modification n’a pas pu être enregistrée.';
      } finally {
        pending = false;
        dialog.removeEventListener('cancel', blockClose);
        for (const field of form.elements) field.disabled = false;
        get('[data-close]').disabled = false;
      }
    });
    function blockClose(event) { event.preventDefault(); }
    display();
    globalThis.__enPsyAvant.showDialog(root,dialog,opener);
  }

  globalThis.__enPsyDate = { iso, eventDate, valid, onDate, calendarChange, overlaps, edit, open };
})();
