/* Écriture et mise en forme des retours de séance. */
(() => {
  'use strict';
  const fieldSelector = '[data-rich-field]';
  const blocks = new Set(['div', 'p', 'h4', 'h5', 'blockquote', 'ul', 'ol', 'li', 'hr']);
  const inline = new Set(['span', 'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'a', 'br']);
  const discarded = new Set(['script', 'style', 'iframe', 'object', 'embed', 'template', 'svg', 'math']);
  const fonts = new Set(['EN Cormorant Garamond', 'Entre nous Newsreader', 'Caveat']);
  const snapshots = new WeakMap();
  const selectionHandlers = new WeakMap();

  function linkUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
    } catch {
      return '';
    }
  }

  function cleanStyle(source, target) {
    const style = source.style;
    if (!style) return;
    for (const property of ['color', 'backgroundColor']) {
      const value = style[property];
      if (/^(?:#[\da-f]{3,8}|rgba?\([\d.,%\s]+\)|transparent)$/i.test(value)) target.style[property] = value;
    }
    const font = style.fontFamily.replace(/^[\s'"]+|[\s'"]+$/g, '');
    if (fonts.has(font)) target.style.fontFamily = font;
    if (/^(?:small|medium|large|x-large|1[0-9]px|[23][0-9]px|40px)$/.test(style.fontSize)) target.style.fontSize = style.fontSize;
    if (/^(?:bold|normal|[4-7]00)$/.test(style.fontWeight)) target.style.fontWeight = style.fontWeight;
    if (/^(?:italic|normal)$/.test(style.fontStyle)) target.style.fontStyle = style.fontStyle;
    if (/^(?:small-caps|normal)$/.test(style.fontVariant)) target.style.fontVariant = style.fontVariant;
    const decoration = style.textDecorationLine || style.textDecoration;
    if (/^(?:none|(?:underline|line-through)(?: (?:underline|line-through))?)$/.test(decoration)) target.style.textDecorationLine = decoration;
    if (/^(?:left|right|center|start|end|justify)$/.test(style.textAlign)) target.style.textAlign = style.textAlign;
    for (const property of ['marginLeft', 'marginRight', 'marginInlineStart']) {
      const margin = style[property];
      if (/^(?:[0-9]{1,2}|1[0-5][0-9]|160)px$/.test(margin)) target.style[property] = margin;
    }
  }

  function checkBox(checked = false, reading = false) {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('data-en-check', '');
    input.setAttribute('contenteditable', 'false');
    input.setAttribute('aria-label', 'Cocher cet élément');
    input.defaultChecked = checked;
    input.disabled = reading;
    return input;
  }

  function cleanContent(source, target, reading = false) {
    for (const child of source.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        target.append(child.textContent);
        continue;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) continue;
      const tag = child.localName;
      if (discarded.has(tag)) continue;
      if (tag === 'input') {
        if (child.type === 'checkbox' && child.hasAttribute('data-en-check')) target.append(checkBox(child.checked, reading));
        continue;
      }
      const href = tag === 'a' ? linkUrl(child.getAttribute('href')) : '';
      if ((!blocks.has(tag) && !inline.has(tag)) || (tag === 'a' && !href)) {
        cleanContent(child, target, reading);
        continue;
      }
      const node = document.createElement(tag);
      if (href) {
        node.href = href;
        node.target = '_blank';
        node.rel = 'noopener noreferrer';
      }
      if (tag === 'ul' && child.classList.contains('en-format-checklist')) node.className = 'en-format-checklist';
      if (tag === 'ol' && /^[1-9]\d{0,5}$/.test(child.getAttribute('start') || '')) node.start = child.start;
      cleanStyle(child, node);
      cleanContent(child, node, reading);
      if (tag === 'span' && !node.hasAttribute('style')) target.append(...node.childNodes);
      else target.append(node);
    }
  }

  function plainText(root) {
    let text = '';
    let boundary = false;
    function append(value) {
      if (!value) return;
      if (boundary && text && !text.endsWith('\n')) text += '\n';
      boundary = false;
      text += value;
    }
    function walk(container) {
      for (const node of container.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          append(node.textContent);
          continue;
        }
        if (node.localName === 'br') { append('\n'); continue; }
        if (node.localName === 'input') { append(node.checked ? '☑ ' : '☐ '); continue; }
        const block = blocks.has(node.localName);
        if (block) boundary = true;
        if (node.localName === 'hr') append('—');
        else walk(node);
        if (block) boundary = true;
      }
    }
    walk(root);
    return text;
  }

  function write(node, text = '', html = '', reading = false) {
    if (typeof text !== 'string') text = '';
    node.textContent = text;
    if (node.matches(fieldSelector)) node.classList.toggle('en-rich-empty', !text.trim());
    if (typeof html !== 'string' || !html) return;
    const source = document.createElement('template');
    source.innerHTML = html;
    const clean = document.createDocumentFragment();
    cleanContent(source.content, clean, reading);
    if (plainText(clean) === text) node.replaceChildren(clean);
  }

  function read(field) {
    const source = field.innerHTML;
    const cached = snapshots.get(field);
    if (cached?.source === source) return cached.value;
    const clean = document.createElement('div');
    cleanContent(field, clean);
    const text = plainText(clean);
    const value = text.trim() ? { text, html: clean.firstElementChild ? clean.innerHTML : '' } : { text: '', html: '' };
    snapshots.set(field, { source, value });
    return value;
  }

  function prepareField(field, placeholder, name) {
    field.classList.add('en-rich-field');
    field.setAttribute('data-rich-field', '');
    field.setAttribute('contenteditable', 'true');
    field.setAttribute('role', 'textbox');
    field.setAttribute('aria-multiline', 'true');
    field.setAttribute('aria-label', name);
    field.setAttribute('aria-placeholder', placeholder);
    field.setAttribute('enterkeyhint', 'enter');
    field.dataset.placeholder = placeholder;
  }

  document.addEventListener('selectionchange', () => {
    const node = document.getSelection()?.anchorNode;
    const field = (node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement)?.closest(fieldSelector);
    if (field) selectionHandlers.get(field.closest('[data-session-editor]'))?.();
  });

  function mount(root, onChange) {
    const get = selector => root.querySelector(selector);
    const all = selector => [...root.querySelectorAll(selector)];
    const toggle = get('[data-format-toggle]');
    const panel = get('[data-format-panel]');
    const categories = all('[data-category]');
    const groups = all('[data-tools]');
    const extras = all('[data-extra]');
    const extraButtons = all('[data-reveal]');
    const marks = all('[data-cmd][aria-pressed]');
    const feedback = get('[data-format-feedback]');
    const count = get('[data-word-count]');
    const linkForm = get('[data-format-link]');
    const linkError = get('[data-link-error]');
    const remembered = new WeakMap();
    const activeFields = new WeakMap();

    function currentField() {
      const pane = get('[data-pane]:not([hidden])');
      const activeField = pane && activeFields.get(pane);
      const scope = pane?.querySelector('[data-format-active]') || pane;
      if (activeField && scope?.contains(activeField) && !activeField.closest('[hidden]')) return activeField;
      return scope && [...scope.querySelectorAll(fieldSelector)].find(field => !field.closest('[hidden]'));
    }

    function refresh() {
      const field = currentField();
      if (!field) return;
      const text = read(field).text.trim();
      field.classList.toggle('en-rich-empty', !text);
      const words = text.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length || 0;
      count.textContent = words + (words > 1 ? ' mots' : ' mot');
    }

    function remember() {
      const field = currentField();
      const selection = document.getSelection();
      if (!field || !selection?.rangeCount) return;
      const range = selection.getRangeAt(0);
      if (!field.contains(range.startContainer) || !field.contains(range.endContainer)) return;
      remembered.set(field, range.cloneRange());
      for (const mark of marks) mark.setAttribute('aria-pressed', String(document.queryCommandState(mark.dataset.cmd)));
    }
    selectionHandlers.set(root, remember);

    function restore(field) {
      const range = remembered.get(field) || document.createRange();
      if (!field.contains(range.startContainer) || !field.contains(range.endContainer)) {
        range.selectNodeContents(field);
        range.collapse(false);
      }
      field.focus({ preventScroll: true });
      const selection = document.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      return range;
    }

    function command(field, name, value = null) {
      restore(field);
      if (name !== 'undo' && name !== 'redo') document.execCommand('styleWithCSS', false, true);
      const applied = document.execCommand(name, false, value);
      if (!applied && name === 'hiliteColor') document.execCommand('backColor', false, value);
      remember();
      onChange();
    }

    function reveal(name) {
      for (const extra of extras) extra.hidden = extra.dataset.extra !== name;
      for (const button of extraButtons) button.setAttribute('aria-expanded', String(button.dataset.reveal === name));
      linkError.hidden = true;
    }

    function setOpen(open) {
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (!open) reveal();
      feedback.textContent = '';
      refresh();
    }

    function special(field, name) {
      if (name === 'default-ink') {
        command(field, 'foreColor', getComputedStyle(field).color);
        return;
      }
      const range = restore(field);
      if (name === 'date') {
        range.collapse(false);
        remembered.set(field, range);
        command(field, 'insertText', new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date()));
      } else if (name === 'smallcaps') {
        if (range.collapsed) {
          feedback.textContent = 'Sélectionne les mots à mettre en petites capitales.';
          return;
        }
        const span = document.createElement('span');
        span.style.fontVariant = 'small-caps';
        cleanContent(range.cloneContents(), span);
        command(field, 'insertHTML', span.outerHTML);
      } else if (name === 'checklist') {
        const list = document.createElement('ul');
        const item = document.createElement('li');
        list.className = 'en-format-checklist';
        item.append(checkBox(), ' ', range.toString());
        list.append(item);
        command(field, 'insertHTML', list.outerHTML);
      }
    }

    root.addEventListener('focusin', event => {
      const field = event.target.closest(fieldSelector);
      if (!field || field === currentField() && activeFields.get(field.closest('[data-pane]')) === field) return;
      activeFields.set(field.closest('[data-pane]'), field);
      for (const mark of marks) mark.setAttribute('aria-pressed', 'false');
      refresh();
    });
    root.addEventListener('input', event => {
      if (event.target.matches(fieldSelector)) onChange();
    });
    root.addEventListener('change', event => {
      const checkbox = event.target.closest('input[data-en-check]');
      if (!checkbox) return;
      checkbox.defaultChecked = checkbox.checked;
      onChange();
    });
    root.addEventListener('paste', event => {
      const field = event.target.closest(fieldSelector);
      if (!field || !event.clipboardData) return;
      event.preventDefault();
      remember();
      command(field, 'insertText', event.clipboardData.getData('text/plain'));
    });
    root.addEventListener('drop', event => {
      if (event.target.closest(fieldSelector)) event.preventDefault();
    });
    root.addEventListener('click', event => {
      if (event.target.closest(fieldSelector + ' a')) event.preventDefault();
    });
    root.addEventListener('pointerdown', event => {
      if (event.target.closest('[data-format-toggle], [data-format-panel] :is([data-cmd],[data-special],[data-reveal],[data-category])')) event.preventDefault();
    });

    toggle.addEventListener('click', () => {
      remember();
      setOpen(panel.hidden);
    });
    panel.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.dataset.category) {
        for (const tab of categories) tab.setAttribute('aria-pressed', String(tab === button));
        for (const group of groups) group.hidden = group.dataset.tools !== button.dataset.category;
        reveal();
        feedback.textContent = '';
        return;
      }
      if (button.dataset.reveal) {
        const open = button.getAttribute('aria-expanded') !== 'true';
        reveal(open ? button.dataset.reveal : undefined);
        if (open && button.dataset.reveal === 'link') linkForm.elements.address.focus();
        return;
      }
      const field = currentField();
      if (!field) return;
      feedback.textContent = '';
      if (button.dataset.cmd) command(field, button.dataset.cmd, button.dataset.value ?? null);
      if (button.dataset.special) special(field, button.dataset.special);
    });
    panel.addEventListener('change', event => {
      const control = event.target;
      const field = currentField();
      if (!control.dataset.change || !field) return;
      command(field, control.dataset.change, control.value);
      if (control.localName === 'select') control.selectedIndex = 0;
    });
    linkForm.addEventListener('submit', event => {
      event.preventDefault();
      const href = linkUrl(linkForm.elements.address.value);
      if (!href) {
        linkError.hidden = false;
        return;
      }
      const field = currentField();
      if (!field) return;
      const range = restore(field);
      if (range.collapsed) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = href;
        command(field, 'insertHTML', link.outerHTML);
      } else command(field, 'createLink', href);
      linkForm.reset();
      reveal();
    });
    root.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || panel.hidden) return;
      setOpen(false);
      toggle.focus();
      event.stopPropagation();
    });
    return { refresh, close: () => setOpen(false) };
  }

  globalThis.__enPsyWriting = { prepareField, read, write, mount };
})();
