/* Mode séance · les sujets préparés et les notes du carnet. */
(function () {
  'use strict';

  const icon = path => '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + path + '"/></svg>';
  const check = icon('m5 12 4 4L19 6');
  const markup = `
    <section class="en-product">
      <header class="en-hbar en-hcompact">
        <h2 id="en-mode-session-title" class="en-hname">Mode séance</h2>
        <p class="en-hstate">En cours</p>
        <button type="button" class="en-hclose" data-close aria-label="Quitter pour le moment">${icon('M6 6l12 12M18 6 6 18')}</button>
      </header>
      <div class="en-body">
        <div class="en-title-group">
          <h3 class="en-title">Mes sujets à aborder</h3>
          <span class="en-title-ornament" aria-hidden="true"><span class="en-ornament-line"></span>✦<span class="en-ornament-line"></span></span>
        </div>
        <ul class="en-topics" aria-label="Sujets préparés pour la séance"></ul>
        <p class="en-empty" hidden>Aucun sujet préparé pour cette séance.</p>
        <details class="en-notes">
          <summary class="en-notes-summary"><span id="en-mode-note-label">Mes notes</span>${icon('m6 9 6 6 6-6')}</summary>
          <div class="en-note-content">
            <textarea class="en-note-field" rows="4" aria-labelledby="en-mode-note-label" placeholder="Quelques mots, si j’en ai envie…"></textarea>

          </div>
        </details>
        <footer class="en-footer">
          <button type="button" class="en-finish" data-finish>J’ai terminé ma séance</button>
          <button type="button" class="en-quiet" data-pause>Quitter pour le moment</button>
        </footer>
      </div>
    </section>`;

  function newDraft(notes, stars, first, questions) {
    const candidates = notes.slice().sort((a, b) => Number(stars.has(b.id)) - Number(stars.has(a.id)));
    const prepared = first?.questions || {};
    for (const [key, group] of Object.entries(prepared)) {
      if (key !== 'topics' && key !== 'pratique' && !/^(topic|person|family):/.test(key)) continue;
      const selected = new Set(group.selected || []);
      for (const entry of group.entries || []) {
        if (selected.has(entry.id)) candidates.push({ id: `first:${key}:${entry.id}`, t: entry.answer });
      }
      candidates.push({ id: `first:${key}:free`, t: group.free });
    }
    candidates.push(...questions);
    const seen = new Set();
    const subjects = [];
    for (const { id, t } of candidates) {
      const label = typeof t === 'string' ? t.trim() : '';
      if (!label || seen.has(label.toLocaleLowerCase('fr-FR'))) continue;
      seen.add(label.toLocaleLowerCase('fr-FR'));
      subjects.push({ id, t: label });
    }
    return { subjects, checked: [], note: '', notesOpen: false };
  }

  function mount(host, draft, { pause, finish, onChange }) {
    const doc = host.ownerDocument;
    host.setAttribute('role', 'dialog');
    host.setAttribute('aria-modal', 'true');
    host.setAttribute('aria-labelledby', 'en-mode-session-title');
    host.innerHTML = markup;

    const topics = host.querySelector('.en-topics');
    for (const subject of draft.subjects) {
      const row = doc.createElement('li');
      row.innerHTML = '<label class="en-topic"><span class="en-topic-name"></span><span class="en-selector"><input type="checkbox"><span class="en-check-mark" aria-hidden="true">' + check + '</span></span></label>';
      row.querySelector('.en-topic-name').textContent = subject.t;
      const input = row.querySelector('input');
      input.checked = draft.checked.includes(subject.id);
      input.setAttribute('aria-label', 'Sujet abordé : ' + subject.t);
      input.addEventListener('change', () => {
        draft.checked = draft.checked.filter(id => id !== subject.id);
        if (input.checked) draft.checked.push(subject.id);
        onChange?.();
      });
      topics.append(row);
    }
    topics.hidden = !draft.subjects.length;
    host.querySelector('.en-empty').hidden = !topics.hidden;

    const details = host.querySelector('details');
    const note = host.querySelector('textarea');
    note.value = draft.note;
    details.open = draft.notesOpen;
    details.addEventListener('toggle', () => {
      if (draft.notesOpen === details.open) return;
      draft.notesOpen = details.open;
      onChange?.();
    });
    note.addEventListener('input', () => {
      if (draft.note === note.value) return;
      draft.note = note.value;
      delete draft.noteHtml;
      onChange?.();
    });

    const close = host.querySelector('[data-close]');
    close.addEventListener('click', pause);
    host.querySelector('[data-pause]').addEventListener('click', pause);
    host.querySelector('[data-finish]').addEventListener('click', finish);
    host.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        pause();
      }
      if (event.key === 'Tab') {
        const controls = [...host.querySelectorAll('button, input, summary, textarea')].filter(control => control.getClientRects().length);
        const edge = event.shiftKey ? controls[0] : controls.at(-1);
        if (doc.activeElement === edge) {
          event.preventDefault();
          (event.shiftKey ? controls.at(-1) : controls[0]).focus();
        }
      }
    });
    close.focus({ preventScroll: true });
  }

  globalThis.__enPsyModeSession = { mount, newDraft };
})();
