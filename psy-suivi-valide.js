(function(){'use strict';const TEMPLATE="\n<div id=\"psy-suivi-apercu\">\n\n<div id=\"psy-suivi-chronologique\" hidden class=\"\" aria-label=\"Mon chemin avec ma psy — organisation chronologique retenue\">\n<section id=\"psy-org-1\">\n\n  <div class=\"se-stage\">\n    <section class=\"se-app\" aria-label=\"Mon chemin avec ma psy — organisation chronologique\">\n      <header class=\"se-header\">\n        <div class=\"se-left\"><button class=\"se-icon cursor-interaction\" type=\"button\" aria-label=\"Ouvrir le menu\" aria-controls=\"psy-org-1-menu\" aria-expanded=\"false\" data-menu><i data-lucide=\"menu\" aria-hidden=\"true\"></i></button><button class=\"se-icon cursor-interaction\" type=\"button\" aria-label=\"Retour à mon espace psy\" data-back><i data-lucide=\"chevron-left\" aria-hidden=\"true\"></i></button></div>\n        <span class=\"se-avatar\" role=\"img\" aria-label=\"Compagnon actuel de l’application\"></span>\n        <div class=\"se-title-zone\" data-title-zone><p class=\"se-title\">MON CHEMIN AVEC MA PSY</p><div class=\"se-ornament\" aria-hidden=\"true\"><i></i>✦<i></i></div></div>\n      </header>\n      <nav id=\"psy-org-1-menu\" data-menu-panel aria-label=\"Menu latéral\" hidden><button type=\"button\" class=\"se-menu-close cursor-interaction\" data-menu-close>Fermer</button><button type=\"button\" class=\"cursor-interaction\" data-nav=\"Accueil\">Accueil</button><button type=\"button\" class=\"cursor-interaction\" data-nav=\"Mon journal\">Mon journal</button><button type=\"button\" class=\"cursor-interaction\" data-nav=\"Faire connaissance\">Faire connaissance</button><button type=\"button\" class=\"cursor-interaction\" data-nav=\"Psy\" aria-current=\"page\">Psy</button></nav>\n      <div data-ongoing-page>\n        <p class=\"se-question\">Comment aimerais-tu me raconter ce que tu as déjà abordé avec ta psy ?</p>\n        <div class=\"sp-chapters\" data-chapters aria-label=\"Les thèmes de mon suivi\"></div>\n        <div class=\"sp-alternative\" data-alternative><button type=\"button\" class=\"sp-ai-access sp-ai-link cursor-interaction\" data-ai-toggle aria-expanded=\"false\" aria-controls=\"psy-org-1-ai\">Avec ChatGPT ou Claude</button><div class=\"sp-ai-panel\" id=\"psy-org-1-ai\" data-ai-panel hidden>\n<p class=\"sp-ai-help\">Tu peux préparer ton récit avec ChatGPT ou Claude, puis revenir le déposer ici.</p>\n<div class=\"sp-providers\" role=\"group\" aria-label=\"Choisir une IA\"><button type=\"button\" class=\"cursor-interaction\" data-provider=\"ChatGPT\" aria-pressed=\"false\">ChatGPT</button><button type=\"button\" class=\"cursor-interaction\" data-provider=\"Claude\" aria-pressed=\"false\">Claude</button></div>\n<div data-ai-request hidden><label class=\"sp-label\">Ma demande<textarea rows=\"5\" readonly data-request-text></textarea></label><button type=\"button\" class=\"sp-copy cursor-interaction\" data-copy>Copier ma demande</button></div>\n<details class=\"sp-summary\"><summary class=\"cursor-interaction\">Déposer mon résumé</summary><label class=\"sp-label\">Mon résumé<textarea rows=\"4\" placeholder=\"Je colle mon résumé ici…\" data-summary-text></textarea></label><button type=\"button\" class=\"sp-copy cursor-interaction\" data-keep-summary>Garder ce résumé</button></details>\n</div></div>\n\n      </div>\n\n      <section class=\"sp-chapter-page\" data-chapter-page hidden>\n        <p class=\"sp-section-title\" data-chapter-title></p>\n        <p class=\"sp-scope\" data-chapter-scope></p>\n        <div data-fields></div>\n        <button type=\"button\" class=\"sp-return cursor-interaction\" data-chapter-return>Revenir aux thèmes</button>\n      </section>\n      <div data-entry-page hidden><p class=\"se-question\">Ton suivi, à ton rythme</p><p class=\"se-entry-text\">Ici, tu peux préparer tes séances, garder ce qui compte et voir le chemin parcouru.</p><button type=\"button\" class=\"se-row cursor-interaction\" data-return><span class=\"se-row-icon\"><i data-lucide=\"message-circle\" aria-hidden=\"true\"></i></span><span class=\"se-row-copy\"><span class=\"se-row-title\">J’ai déjà un suivi</span><span class=\"se-row-subtitle\">Raconter ce qu’on a déjà abordé.</span></span><i data-lucide=\"chevron-right\" aria-hidden=\"true\"></i></button></div>\n    </section>\n  </div>\n  <p class=\"se-preview-status\" role=\"status\" data-status hidden></p>\n\n</section>\n</div>\n\n\n\n\n\n<div id=\"psy-date-app\" class=\"\">\n  <section class=\"psyf-paper\" aria-label=\"Quand tout a commencé\">\n    <header>\n      <div class=\"psyf-tools\">\n        <div class=\"psyf-tools-left\">\n          <button class=\"psyf-icon\" data-approved-menu type=\"button\" aria-label=\"Ouvrir le menu\"><img class=\"psyf-menu-icon\" src=\"illus/psy-valides/7add0bb7b0a2cfb0.svg\" alt=\"\"></button>\n          <button type=\"button\" class=\"psyf-icon psyf-back-icon cursor-interaction\" data-header-back aria-label=\"Revenir aux thèmes\">‹</button>\n        </div>\n        <span class=\"psyf-plume\"><span class=\"psyf-avatar\" role=\"img\" aria-label=\"Plume\"></span></span>\n      </div>\n      <h2 class=\"psyf-name\">QUAND TOUT A COMMENCÉ</h2>\n      <div class=\"psyf-rule\" aria-hidden=\"true\">✦</div>\n    </header>\n    <div data-detail>\n     <div class=\"psyf-progress-row\">\n       <div class=\"psyf-progress-track\" role=\"progressbar\" aria-label=\"Progression de Quand tout a commencé\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"0\" aria-valuetext=\"Aucune question renseignée sur quatre\" data-progress-track><span class=\"psyf-progress-fill\" data-progress-fill></span></div>\n       <span class=\"psyf-progress-value\" data-progress-value aria-hidden=\"true\">0 %</span>\n     </div>\n     <p class=\"psyf-sr\" data-step-count aria-live=\"polite\">Questions 01 et 02</p>\n     <div data-step=\"1\">\n      <p class=\"psyf-period-question\" id=\"psyf-qtc-period\"><span class=\"psyf-number\">01</span>Quand as-tu commencé à voir ta psy&nbsp;?</p>\n      <div class=\"psyf-dates\" role=\"group\" aria-labelledby=\"psyf-qtc-period\">\n        <div class=\"psyf-month-field\">\n          <span class=\"psyf-label\" id=\"psyf-month-label\">Mois</span>\n          <input type=\"hidden\" id=\"psyf-qtc-month\" value=\"\">\n          <button type=\"button\" class=\"psyf-date-input psyf-month-trigger cursor-interaction\" id=\"psyf-month-trigger\" aria-labelledby=\"psyf-month-label psyf-month-value\" aria-controls=\"psyf-month-menu\" aria-expanded=\"false\">\n            <span id=\"psyf-month-value\">Le mois</span><i data-lucide=\"chevron-down\" aria-hidden=\"true\"></i>\n          </button>\n          <div class=\"psyf-month-menu\" id=\"psyf-month-menu\" role=\"group\" aria-label=\"Choisir un mois\" hidden><div class=\"psyf-month-options\" data-month-options></div></div>\n        </div>\n        <div class=\"psyf-year-field\">\n          <span class=\"psyf-label\" id=\"psyf-year-label\">Année</span>\n          <input type=\"hidden\" id=\"psyf-qtc-year\" value=\"\">\n          <button type=\"button\" class=\"psyf-date-input psyf-month-trigger cursor-interaction\" id=\"psyf-year-trigger\" aria-labelledby=\"psyf-year-label psyf-year-value\" aria-controls=\"psyf-year-menu\" aria-expanded=\"false\"><span id=\"psyf-year-value\">L’année</span><i data-lucide=\"chevron-down\" aria-hidden=\"true\"></i></button>\n          <div class=\"psyf-month-menu\" id=\"psyf-year-menu\" role=\"group\" aria-label=\"Choisir une année\" hidden><div class=\"psyf-month-options\" data-year-options></div></div>\n        </div>\n      </div>\n      <label class=\"psyf-check-label cursor-interaction\"><input type=\"checkbox\" id=\"psyf-qtc-unknown\" data-forgot><span>Je ne sais plus</span></label>\n      <section class=\"psyf-question\">\n        <label for=\"psyf-qtc-reason\"><span class=\"psyf-number\">02</span>Qu’est-ce qui t’a donné envie de consulter, au départ&nbsp;?</label>\n        <div class=\"psyf-reason-help\" data-reason-help>\n          <button type=\"button\" class=\"psyf-reason-trigger cursor-interaction\" id=\"psyf-reason-trigger\" aria-expanded=\"false\" aria-controls=\"psyf-reason-menu\"><span data-reason-trigger-label>Quelques idées pour t’aider</span><i data-lucide=\"chevron-down\" aria-hidden=\"true\"></i></button>\n          <div class=\"psyf-reason-menu\" id=\"psyf-reason-menu\" role=\"group\" aria-label=\"Pistes pour raconter ce qui m’a décidée à consulter\" hidden>\n            <p class=\"psyf-reason-hint\">Plusieurs choix possibles.</p>\n            <div class=\"psyf-reason-options\" data-reason-options></div>\n          </div>\n          <ul class=\"psyf-reason-summary\" data-reason-summary hidden></ul>\n        </div>\n        <details class=\"psyf-free-fold\"><summary class=\"cursor-interaction\"><span>Avec mes mots…</span><i data-lucide=\"chevron-down\" aria-hidden=\"true\"></i></summary><textarea class=\"psyf-answer\" id=\"psyf-qtc-reason\" rows=\"2\" placeholder=\"Avec mes mots…\"></textarea></details>\n        <div class=\"psyf-followups\" data-reason-followups role=\"group\" aria-label=\"Relances selon tes réponses à la question 02\" hidden></div>\n      </section>\n      <div class=\"psyf-footer\"><button type=\"button\" class=\"psyf-continue cursor-interaction\" data-continue>Continuer</button></div>\n     </div>\n     <div data-step=\"2\" hidden>\n      <section class=\"psyf-question\" id=\"psyf-question-03\">\n        <label for=\"psyf-qtc-hopes\"><span class=\"psyf-number\">03</span>Qu’espérais-tu en commençant ce suivi&nbsp;?</label>\n        <details class=\"psyf-free-fold\"><summary class=\"cursor-interaction\"><span>Avec mes mots…</span><i data-lucide=\"chevron-down\" aria-hidden=\"true\"></i></summary><textarea class=\"psyf-answer\" id=\"psyf-qtc-hopes\" rows=\"2\" placeholder=\"Avec mes mots…\"></textarea></details>\n      </section>\n      <section class=\"psyf-question\" id=\"psyf-question-04\">\n        <label for=\"psyf-qtc-feelings\"><span class=\"psyf-number\">04</span>Comment te sentais-tu lors de tes premières séances&nbsp;?</label>\n        <details class=\"psyf-free-fold\"><summary class=\"cursor-interaction\"><span>Avec mes mots…</span><i data-lucide=\"chevron-down\" aria-hidden=\"true\"></i></summary><textarea class=\"psyf-answer\" id=\"psyf-qtc-feelings\" rows=\"2\" placeholder=\"Avec mes mots…\"></textarea></details>\n      </section>\n      <div class=\"psyf-footer psyf-step-actions\"><button type=\"button\" class=\"psyf-continue cursor-interaction\" data-return>Terminer cette rubrique</button></div>\n     </div>\n    </div>\n    <div data-parcours-detail hidden>\n      <div class=\"psyf-progress-row\">\n        <div class=\"psyf-progress-track\" role=\"progressbar\" aria-label=\"Progression de Le chemin déjà parcouru\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"0\" aria-valuetext=\"Aucune question renseignée sur deux\" data-parcours-progress-track><span class=\"psyf-progress-fill\" data-parcours-progress-fill></span></div>\n        <span class=\"psyf-progress-value\" data-parcours-progress-value aria-hidden=\"true\">0 %</span>\n      </div>\n      <section class=\"psyf-question\" id=\"psyf-parcours-question-01\">\n        <label for=\"psyf-parcours-topics\"><span class=\"psyf-number\">01</span>De quoi as-tu déjà parlé avec ta psy&nbsp;?</label>\n        <details class=\"psyf-free-fold\"><summary class=\"cursor-interaction\"><span>Avec mes mots…</span><i data-lucide=\"chevron-down\" aria-hidden=\"true\"></i></summary><textarea class=\"psyf-answer\" id=\"psyf-parcours-topics\" rows=\"2\" placeholder=\"Avec mes mots…\"></textarea></details>\n      </section>\n      <section class=\"psyf-question\" id=\"psyf-parcours-question-02\">\n        <label for=\"psyf-parcours-moments\"><span class=\"psyf-number\">02</span>Quels moments de séance te restent en tête&nbsp;?</label>\n        <details class=\"psyf-free-fold\"><summary class=\"cursor-interaction\"><span>Avec mes mots…</span><i data-lucide=\"chevron-down\" aria-hidden=\"true\"></i></summary><textarea class=\"psyf-answer\" id=\"psyf-parcours-moments\" rows=\"2\" placeholder=\"Avec mes mots…\"></textarea></details>\n      </section>\n      <div class=\"psyf-footer psyf-step-actions\"><button type=\"button\" class=\"psyf-continue cursor-interaction\" data-return>Terminer cette rubrique</button></div>\n    </div>\n    <div data-present-detail hidden>\n      <div class=\"psyf-progress-row\">\n        <div class=\"psyf-progress-track\" role=\"progressbar\" aria-label=\"Progression de Là où j’en suis\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"0\" aria-valuetext=\"Aucune question renseignée sur deux\" data-present-progress-track><span class=\"psyf-progress-fill\" data-present-progress-fill></span></div>\n        <span class=\"psyf-progress-value\" data-present-progress-value aria-hidden=\"true\">0 %</span>\n      </div>\n      <section class=\"psyf-question\" id=\"psyf-present-question-01\">\n        <label for=\"psyf-present-feeling\"><span class=\"psyf-number\">01</span>Comment te sens-tu dans ton suivi aujourd’hui&nbsp;?</label>\n        <details class=\"psyf-free-fold\"><summary class=\"cursor-interaction\"><span>Avec mes mots…</span><i data-lucide=\"chevron-down\" aria-hidden=\"true\"></i></summary><textarea class=\"psyf-answer\" id=\"psyf-present-feeling\" rows=\"2\" placeholder=\"Avec mes mots…\"></textarea></details>\n      </section>\n      <section class=\"psyf-question\" id=\"psyf-present-question-02\">\n        <label for=\"psyf-present-changes\"><span class=\"psyf-number\">02</span>Qu’est-ce que tu remarques chez toi depuis le début du suivi&nbsp;?</label>\n        <details class=\"psyf-free-fold\"><summary class=\"cursor-interaction\"><span>Avec mes mots…</span><i data-lucide=\"chevron-down\" aria-hidden=\"true\"></i></summary><textarea class=\"psyf-answer\" id=\"psyf-present-changes\" rows=\"2\" placeholder=\"Avec mes mots…\"></textarea></details>\n      </section>\n      <div class=\"psyf-footer psyf-step-actions\"><button type=\"button\" class=\"psyf-continue cursor-interaction\" data-return>Terminer cette rubrique</button></div>\n    </div>\n    <div data-next-detail hidden>\n      <div class=\"psyf-progress-row\">\n        <div class=\"psyf-progress-track\" role=\"progressbar\" aria-label=\"Progression de Ce que j’aimerais pour la suite\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"0\" data-next-progress-track><span class=\"psyf-progress-fill\" data-next-progress-fill></span></div>\n        <span class=\"psyf-progress-value\" data-next-progress-value aria-hidden=\"true\">0 %</span>\n      </div>\n      <section class=\"psyf-question\" id=\"psyf-next-question-01\">\n        <label for=\"psyf-next-wishes\"><span class=\"psyf-number\">01</span>Qu’aimerais-tu poursuivre ou aborder avec ta psy maintenant&nbsp;?</label>\n        <details class=\"psyf-free-fold\"><summary class=\"cursor-interaction\"><span>Avec mes mots…</span><i data-lucide=\"chevron-down\" aria-hidden=\"true\"></i></summary><textarea class=\"psyf-answer\" id=\"psyf-next-wishes\" rows=\"2\" placeholder=\"Avec mes mots…\"></textarea></details>\n      </section>\n      <div class=\"psyf-footer psyf-step-actions\"><button type=\"button\" class=\"psyf-continue cursor-interaction\" data-return>Terminer cette rubrique</button></div>\n    </div>\n    <span class=\"psyf-sr\" aria-live=\"polite\" data-status></span>\n  </section>\n</div>\n\n\n</div>\n";window.__enMountFollowupPsy=function(container,config){const document=config.document;container.innerHTML=TEMPLATE;

function mount(id,chapters){
 const root=document.getElementById(id),menu=root.querySelector('[data-menu-panel]'),menuButton=root.querySelector('[data-menu]'),status=root.querySelector('[data-status]'),title=root.querySelector('.se-title'),overview=root.querySelector('[data-ongoing-page]'),entry=root.querySelector('[data-entry-page]'),chapterPage=root.querySelector('[data-chapter-page]'),fields=root.querySelector('[data-fields]'),rows=new Map(),drafts={};let screen='overview',current=null;
 const el=(tag,cls,text)=>{const node=document.createElement(tag);node.className=cls;if(text!==undefined)node.textContent=text;return node};
 const ico=name=>{const icon=el('i','');icon.dataset.lucide=name;icon.setAttribute('aria-hidden','true');return icon};
 const icons=()=>{globalThis.__enPsyIcons?.(root,16)};
 function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false')}
 function show(next){screen=next;closeMenu();overview.hidden=next!=='overview';entry.hidden=next!=='entry';chapterPage.hidden=next!=='chapter';title.textContent=next==='entry'?'MON ESPACE PSY':'MON CHEMIN AVEC MA PSY';if(next==='overview')refresh();}
 function refresh(){for(const chapter of chapters){const row=rows.get(chapter.id),percent=Number(row.dataset.actualProgress||0);row.querySelector('[data-fill]').style.width=percent+'%';row.querySelector('[data-track]').setAttribute('aria-valuenow',String(percent));row.querySelector('[data-percent]').textContent=percent+' %'}}
 function openChapter(chapter){current=chapter;root.querySelector('[data-chapter-title]').textContent=chapter.title;root.querySelector('[data-chapter-scope]').textContent=chapter.scope;fields.replaceChildren();chapter.fields.forEach(([key,question,placeholder],index)=>{const block=el('section','sp-field'),prompt=el('p','sp-field-question');prompt.append(el('span','sp-number',String(index+1).padStart(2,'0')),el('span','',question));const fold=el('details','sp-free-fold'),summary=el('summary','cursor-interaction','Avec mes mots…'),label=el('label','sp-label'),input=el('textarea','');input.rows=3;input.placeholder=placeholder;input.value=drafts[key]||'';input.setAttribute('aria-label',question);input.addEventListener('input',()=>{drafts[key]=input.value;refresh()});label.append(input);fold.append(summary,label);block.append(prompt,fold);fields.append(block)});show('chapter');status.textContent=chapter.title;}
 for(const chapter of chapters){const row=el('button','sp-chapter cursor-interaction');row.type='button';row.dataset.chapter=chapter.id;const star=el('span','sp-star');star.setAttribute('aria-hidden','true');const content=el('span',''),name=el('span','sp-chapter-title',chapter.title),progress=el('span','sp-progress-row'),track=el('span','sp-track'),fill=el('i',''),percent=el('span','sp-percent','0 %');track.dataset.track='';track.setAttribute('role','progressbar');track.setAttribute('aria-label','Progression de '+chapter.title);track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');track.setAttribute('aria-valuenow','0');fill.dataset.fill='';percent.dataset.percent='';track.append(fill);progress.append(track,percent);content.append(name,progress);row.append(star,content,ico('chevron-right'));root.querySelector('[data-chapters]').append(row);rows.set(chapter.id,row);}
 root.querySelector('[data-chapter-return]').addEventListener('click',()=>{show('overview');rows.get(current.id).focus();status.textContent='Tes mots sont conservés.'});
 menuButton.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));if(!menu.hidden)root.querySelector('[data-menu-close]').focus()});
 root.querySelector('[data-menu-close]').addEventListener('click',()=>{closeMenu();menuButton.focus()});
 root.querySelectorAll('[data-nav]').forEach(button=>button.addEventListener('click',()=>{closeMenu();if(button.dataset.nav==='Psy')config.onExit();else config.onNavigate(({Accueil:'home','Mon journal':'mj','Faire connaissance':'mvfiche'})[button.dataset.nav])}));
 root.querySelector('[data-back]').addEventListener('click',()=>config.onExit());
 root.querySelector('[data-return]').addEventListener('click',()=>show('overview'));
 const toggle=root.querySelector('[data-ai-toggle]'),ai=root.querySelector('[data-ai-panel]');if(toggle)toggle.addEventListener('click',()=>{ai.hidden=!ai.hidden;toggle.setAttribute('aria-expanded',String(!ai.hidden))});
 const request='J’aimerais faire le point sur le suivi que j’ai déjà commencé avec ma psy. Aide-moi à raconter, avec mes mots, le cadre de mon suivi, ce qu’on a déjà abordé, ce que j’en retiens, ce qui évolue ou reste difficile pour moi et ce que je souhaite poursuivre. Pose-moi une question à la fois, sans interpréter mes réponses ni inventer d’informations.';
 root.querySelectorAll('[data-provider]').forEach(button=>button.addEventListener('click',()=>{root.querySelectorAll('[data-provider]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));root.querySelector('[data-ai-request]').hidden=false;root.querySelector('[data-request-text]').value=request;status.textContent='Demande à copier dans '+button.dataset.provider+'.'}));
 root.querySelector('[data-copy]').addEventListener('click',async()=>{const textarea=root.querySelector('[data-request-text]');try{await navigator.clipboard.writeText(textarea.value);status.textContent='Demande copiée.'}catch{textarea.focus();textarea.select();status.textContent='Le texte est sélectionné : tu peux le copier.'}});
 root.querySelector('[data-keep-summary]').addEventListener('click',()=>{drafts.summary=root.querySelector('[data-summary-text]').value;if(drafts.summary.trim())config.onFinish(()=>{});status.textContent=drafts.summary.trim()?'Résumé enregistré.':'Tu peux coller ton résumé avant de le garder.'});
 root.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden){closeMenu();menuButton.focus()}});icons();refresh();show('overview');
}


mount("psy-org-1",[{"id": "commencement", "title": "Quand tout a commencé", "scope": "Le point de départ du suivi : ce qui t’a amenée à consulter et les premiers repères.", "fields": [["since", "Quand j’ai commencé", "Un mois, une année, une période…"], ["why", "Ce qui m’a amenée à consulter", "Ce qui se passait pour moi à ce moment-là…"]]}, {"id": "parcours", "title": "Le chemin déjà parcouru", "scope": "Les grands sujets, les périodes et les moments qui ont compté au fil des séances.", "fields": [["subjects", "Ce qu’on a déjà abordé", "Les sujets ou les périodes qui reviennent…"], ["moments", "Les moments de séance qui me restent", "Une discussion, une phrase, un moment important…"]]}, {"id": "present", "title": "Là où j’en suis", "scope": "Ton suivi aujourd’hui, ce qu’il t’apporte et ce qui reste difficile.", "fields": [["frame", "Comment se passe mon suivi aujourd’hui", "Le rythme, le lien avec ma psy, comment je me sens dans les séances…"], ["present", "Ce que je remarque aujourd’hui", "Ce qui m’aide, ce qui change, ou ce qui reste difficile…"]]}, {"id": "next", "title": "Ce que j’aimerais pour la suite", "scope": "Ce que tu souhaites poursuivre, reprendre ou aborder autrement.", "fields": [["next", "Mes envies pour la suite", "Ce sur quoi j’aimerais revenir ou avancer…"]]}]);


  const root = document.getElementById('psy-date-app');for(const [id,value] of Object.entries(config.state.fields||{})){const input=root.querySelector('#'+id);if(input)input.value=value;}const storedUnknown=root.querySelector('[data-forgot]');storedUnknown.checked=!!config.state.unknown;
  let recap=null;
  const detail = root.querySelector('[data-detail]');
  const parcoursDetail = root.querySelector('[data-parcours-detail]');
  const presentDetail = root.querySelector('[data-present-detail]');
  const nextDetail = root.querySelector('[data-next-detail]');
  const themes = document.getElementById('psy-suivi-chronologique');
  const month = root.querySelector('#psyf-qtc-month');
  const year = root.querySelector('#psyf-qtc-year');
  const forgot = root.querySelector('[data-forgot]');
  const status = root.querySelector('[data-status]');
  const yearField = root.querySelector('.psyf-year-field');
  const yearTrigger = root.querySelector('#psyf-year-trigger');
  const yearValue = root.querySelector('#psyf-year-value');
  const yearMenu = root.querySelector('#psyf-year-menu');
  const yearOptions = root.querySelector('[data-year-options]');
  const yearMaximum = new Date().getFullYear();
  const yearMinimum = 1900;
  const updateYear = () => {
    yearValue.textContent = year.value || 'L’année';
    yearTrigger.disabled = forgot.checked;
    yearOptions.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.year === year.value)));
  };
  const closeYear = (returnFocus = false) => {
    yearMenu.hidden = true;
    yearTrigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) yearTrigger.focus();
  };
  const openYear = (focusFirst = false) => {
    if (yearTrigger.disabled) return;
    closeMonth();
    closeReasons();
    closeFollowupMenus();
    yearMenu.hidden = false;
    yearTrigger.setAttribute('aria-expanded', 'true');
    if (focusFirst) (yearOptions.querySelector('[aria-pressed="true"]') || yearOptions.querySelector('button')).focus();
  };
  for (let value = yearMaximum; value >= yearMinimum; value--) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'psyf-month-option cursor-interaction';
    button.dataset.year = String(value);
    const label = document.createElement('span');
    label.textContent = String(value);
    const mark = document.createElement('span');
    mark.className = 'psyf-month-check';
    mark.textContent = '✓';
    mark.setAttribute('aria-hidden', 'true');
    button.append(label, mark);
    button.addEventListener('click', () => {
      year.value = year.value === String(value) ? '' : String(value);
      updateYear();
      closeYear(true);
      status.textContent = year.value ? 'Année choisie : ' + year.value + '.' : 'L’année reste à préciser.';
    });
    yearOptions.appendChild(button);
  }
  yearTrigger.addEventListener('click', () => { if (yearMenu.hidden) openYear(); else closeYear(); });
  yearTrigger.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); openYear(true); }
  });
  yearField.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !yearMenu.hidden) { event.preventDefault(); event.stopPropagation(); closeYear(true); }
  });
  yearOptions.addEventListener('keydown', event => {
    const buttons = [...yearOptions.querySelectorAll('button')];
    const index = buttons.indexOf(event.target);
    if (index < 0) return;
    const next = event.key === 'ArrowDown' ? (index + 1) % buttons.length : event.key === 'ArrowUp' ? (index - 1 + buttons.length) % buttons.length : event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : -1;
    if (next >= 0) { event.preventDefault(); buttons[next].focus(); }
  });
  document.addEventListener('click', event => { if (!yearField.contains(event.target)) closeYear(); });
  updateYear();
  const monthField = root.querySelector('.psyf-month-field');
  const monthTrigger = root.querySelector('#psyf-month-trigger');
  const monthValue = root.querySelector('#psyf-month-value');
  const monthMenu = root.querySelector('#psyf-month-menu');
  const monthOptions = root.querySelector('[data-month-options]');
  const months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const updateMonth = () => {
    monthValue.textContent = month.value || 'Le mois';
    monthOptions.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.month === month.value)));
  };
  const closeMonth = (returnFocus = false) => {
    monthMenu.hidden = true;
    monthTrigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) monthTrigger.focus();
  };
  const openMonth = (focusFirst = false) => {
    if (monthTrigger.disabled) return;
    closeYear();
    monthMenu.hidden = false;
    monthTrigger.setAttribute('aria-expanded', 'true');
    if (focusFirst) (monthOptions.querySelector('[aria-pressed="true"]') || monthOptions.querySelector('button')).focus();
  };
  months.forEach(name => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'psyf-month-option cursor-interaction';
    button.dataset.month = name;
    const label = document.createElement('span');
    label.textContent = name;
    const mark = document.createElement('span');
    mark.className = 'psyf-month-check';
    mark.textContent = '✓';
    mark.setAttribute('aria-hidden', 'true');
    button.append(label, mark);
    button.addEventListener('click', () => {
      month.value = month.value === name ? '' : name;
      updateMonth();
      closeMonth(true);
    });
    monthOptions.appendChild(button);
  });
  updateMonth();
  monthTrigger.addEventListener('click', () => { if (monthMenu.hidden) openMonth(); else closeMonth(); });
  monthTrigger.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openMonth(true);
    }
  });
  monthField.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !monthMenu.hidden) {
      event.preventDefault();
      event.stopPropagation();
      closeMonth(true);
    }
  });
  monthOptions.addEventListener('keydown', event => {
    const buttons = [...monthOptions.querySelectorAll('button')];
    const index = buttons.indexOf(event.target);
    if (index < 0) return;
    const next = event.key === 'ArrowDown' ? (index + 1) % buttons.length
      : event.key === 'ArrowUp' ? (index - 1 + buttons.length) % buttons.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : -1;
    if (next >= 0) { event.preventDefault(); buttons[next].focus(); }
  });
  monthField.addEventListener('focusout', event => { if (!monthField.contains(event.relatedTarget)) closeMonth(); });
  document.addEventListener('click', event => { if (!monthField.contains(event.target)) closeMonth(); });
  const remembered = {...(config.state.rememberedDates||{month:'',year:''})};
  forgot.addEventListener('change', () => {
    const selected = forgot.checked;
    if (selected) {
      if(month.value)remembered.month = month.value;
      if(year.value)remembered.year = year.value;
      month.value = '';
      year.value = '';
    } else {
      month.value = remembered.month;
      year.value = remembered.year;
    }
    month.disabled = selected;
    monthTrigger.disabled = selected;
    year.disabled = selected;yearTrigger.disabled=selected;
    closeMonth();
    closeYear();
    updateMonth();
    updateYear();
    status.textContent = selected ? 'La période reste à préciser.' : 'Tu peux renseigner le mois et l’année.';
  });
  const reasonHelp = root.querySelector('[data-reason-help]');
  const reasonTrigger = root.querySelector('#psyf-reason-trigger');
  const reasonTriggerLabel = root.querySelector('[data-reason-trigger-label]');
  const reasonMenu = root.querySelector('#psyf-reason-menu');
  const reasonOptions = root.querySelector('[data-reason-options]');
  const reasonSummary = root.querySelector('[data-reason-summary]');
  // Dans cette maquette, ces réponses reprennent le contexte déjà connu.
  // Pour l’intégration à l’app, ce profil provient du formulaire Faire connaissance.
  const faireConnaissanceAnswers = config.activity;
  function activityPisteFor(answers) {
    const activities = new Set(answers.activities || []);
    const works = activities.has('work');
    const studies = activities.has('studies');
    if (works && studies) return {
      reason: 'Mon quotidien entre le travail et les études me pesait.',
      q: 'Entre ton travail et tes études, qu’est-ce qui était difficile à vivre à cette période ?',
      placeholder: 'Entre mon travail et mes études, je vivais…',
      choices: ['J’avais du mal à concilier les deux.','La charge au travail me pesait.','Le rythme des études me demandait beaucoup.','Je ressentais beaucoup de pression.','Je manquais de temps pour moi.']
    };
    if (works) return {
      reason: 'Mon travail me pesait.',
      q: 'Quand tu repenses à ton travail à cette période, qu’est-ce qui était difficile à vivre pour toi ?',
      placeholder: 'Au travail, je vivais…',
      choices: ['Le rythme ou la charge de travail me pesait.','Je ressentais beaucoup de pression.','Je ne me retrouvais pas dans ce que je faisais.','L’ambiance ou certaines relations me pesaient.','J’avais du mal à garder de l’énergie pour moi.']
    };
    if (studies) return {
      reason: 'Mes études me pesaient.',
      q: 'Quand tu repenses à tes études à cette période, qu’est-ce qui était difficile à vivre pour toi ?',
      placeholder: 'Dans mes études, je vivais…',
      choices: ['Le rythme ou la charge des cours me pesait.','Je ressentais beaucoup de pression pour réussir.','Je ne me sentais pas à ma place dans cette voie.','L’ambiance ou certaines relations me pesaient.','J’avais du mal à garder du temps pour moi.']
    };
    return {
      reason: 'Ma situation ou mon avenir me préoccupait.',
      q: 'Quand tu repenses à ta situation à cette période, qu’est-ce qui te préoccupait le plus ?',
      placeholder: 'À cette période, ce qui me préoccupait, c’était…',
      choices: ['J’avais du mal à savoir ce que je voulais pour la suite.','Ma situation me laissait dans l’incertitude.','Les attentes des autres me pesaient.','Les questions financières me préoccupaient.','J’avais besoin de retrouver des repères.']
    };
  }
  const activityPiste = activityPisteFor(faireConnaissanceAnswers);
  const reasons = [
    'Je me sentais mal depuis quelque temps.',
    'J’avais du mal avec mon stress ou mes émotions.',
    'Une situation familiale me pesait.',
    'Mon couple ou une relation me faisait souffrir.',
    'Je traversais un deuil, une rupture ou un grand changement.',
    activityPiste.reason,
    'J’avais besoin d’être écoutée et soutenue.',
    'Je voulais mieux me comprendre.',
    'On m’avait conseillé ou encouragée à consulter.',
    'J’avais besoin d’aide sans savoir exactement pourquoi.'
  ];
  const refreshReasons = () => {
    const selected = [...reasonOptions.querySelectorAll('input:checked')].map(input => reasons[Number(input.value)]);
    reasonTriggerLabel.textContent = selected.length ? selected.length + (selected.length > 1 ? ' idées choisies' : ' idée choisie') : 'Quelques idées pour t’aider';
    reasonSummary.replaceChildren();
    selected.forEach(text => {
      const item = document.createElement('li');
      item.textContent = text;
      reasonSummary.appendChild(item);
    });
    reasonSummary.hidden = !selected.length || !reasonMenu.hidden;
    updateFollowups();
  };
  const closeReasons = (returnFocus = false) => {
    reasonMenu.hidden = true;
    reasonTrigger.setAttribute('aria-expanded', 'false');
    refreshReasons();
    if (returnFocus) reasonTrigger.focus();
  };
  reasons.forEach((text, index) => {
    const label = document.createElement('label');
    label.className = 'psyf-reason-option cursor-interaction';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = String(index);checkbox.checked=(config.state.menus?.['psyf-reason-menu']||[]).includes(text);
    const wording = document.createElement('span');
    wording.textContent = text;
    label.append(checkbox, wording);
    checkbox.addEventListener('change', () => {
      refreshReasons();
      const count = reasonOptions.querySelectorAll('input:checked').length;
      status.textContent = count + (count > 1 ? ' pistes sélectionnées.' : ' piste sélectionnée.');
    });
    reasonOptions.appendChild(label);
  });
  reasonTrigger.addEventListener('click', () => {
    if (!reasonMenu.hidden) closeReasons();
    else {
      closeMonth();
      closeYear();
      reasonMenu.hidden = false;
      reasonTrigger.setAttribute('aria-expanded', 'true');
      refreshReasons();
    }
  });
  reasonHelp.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !reasonMenu.hidden) {
      event.preventDefault();
      event.stopPropagation();
      closeReasons(true);
    }
  });
  document.addEventListener('click', event => { if (!reasonHelp.contains(event.target)) closeReasons(); });
  const followupHolder = root.querySelector('[data-reason-followups]');
  const reasonText = root.querySelector('#psyf-qtc-reason');
  const followupDefinitions = [
    {key:'0', q:'À cette période où tu te sentais mal, qu’est-ce qui était le plus difficile à vivre pour toi ?', placeholder:'À cette période, le plus difficile pour moi, c’était…', choices:['Le quotidien me demandait beaucoup d’efforts.','Je manquais de sommeil ou d’énergie.','Mes émotions me submergeaient.','Je me sentais seule ou peu comprise.','J’avais du mal à trouver ma place.']},
    {key:'1', q:'Quand le stress ou les émotions prenaient trop de place, comment cela se passait pour toi ?', placeholder:'Quand le stress ou les émotions montaient, je…', choices:['Mes pensées tournaient en boucle.','Je me sentais souvent tendue.','Mes émotions étaient difficiles à apaiser.','Je me sentais épuisée.','J’avais tendance à m’isoler.']},
    {key:'2', q:'Qu’est-ce qui était difficile à vivre pour toi dans ta famille, à cette période ?', placeholder:'Dans ma famille, je vivais…', choices:['Les conflits prenaient beaucoup de place.','Certaines paroles me blessaient.','J’avais du mal à poser mes limites.','Je ne me sentais pas vraiment comprise.','J’avais l’impression de devoir répondre aux attentes des autres.']},
    {key:'3', q:'Dans cette relation, qu’est-ce qui te manquait ou te faisait souffrir ?', placeholder:'Dans cette relation, j’aurais eu besoin de…', choices:['J’avais du mal à me faire entendre.','Mes besoins semblaient passer après ceux de l’autre.','Les tensions revenaient souvent.','La confiance était devenue difficile.','Je traversais une séparation ou beaucoup d’incertitude.']},
    {key:'4', q:'Qu’aimerais-tu me raconter de cet événement ou de ce changement ?', placeholder:'Ce qui avait changé pour moi, c’était…', choices:['J’avais perdu une personne importante.','Une relation s’était terminée.','Mes repères avaient changé.','Je devais reconstruire une partie de mon quotidien.','J’avais du mal à trouver ma place dans cette nouvelle situation.']},
    {key:'5', q:activityPiste.q, placeholder:activityPiste.placeholder, choices:activityPiste.choices},
    {key:'6', q:'Quand tu avais besoin d’être écoutée, qu’avais-tu surtout envie de partager ?', placeholder:'J’avais besoin de pouvoir parler de…', choices:['Des choses que je gardais pour moi.','Des émotions que j’avais du mal à exprimer.','Une situation qui me pesait.','Mes doutes et mes questions.','Je n’avais pas de sujet précis, surtout besoin d’une présence.']},
    {key:'7', q:'Qu’avais-tu envie de mieux comprendre dans ce que tu vivais ?', placeholder:'J’avais envie de comprendre…', choices:['Pourquoi je ressentais certaines émotions.','Ce qui se passait dans mes réactions.','La place que je prenais dans mes relations.','Mes besoins et mes limites.','Pourquoi certaines situations se répétaient.']},
    {key:'8', q:'Quand on t’a proposé de consulter, qu’est-ce que tu en pensais, toi ?', placeholder:'Quand on me l’a proposé, j’ai ressenti…', choices:['Je sentais que ce besoin venait aussi de moi.','J’étais soulagée qu’on me le propose.','J’avais envie d’essayer sans être très sûre.','J’avais du mal à savoir ce que j’en pensais.','J’hésitais ou je n’en avais pas vraiment envie.']},
    {key:'9', q:'Même si c’était encore flou, comment décrirais-tu ce que tu vivais ?', placeholder:'Même si c’était flou, je me sentais…', choices:['Je me sentais perdue.','J’étais fatiguée depuis longtemps.','Je ne me sentais plus vraiment moi-même.','J’avais besoin de faire le point.','Je n’arrivais pas encore à le mettre en mots.']},
    {key:'free', q:'Quand tu repenses à ce que tu viens d’écrire, comment le vivais-tu au quotidien ?', placeholder:'Dans mon quotidien, cela se traduisait par…', choices:['Cela prenait beaucoup de place dans mes pensées.','Mon énergie ou mon sommeil en pâtissait.','C’était difficile dans mes relations.','J’avais du mal à maintenir mon quotidien.','C’était surtout un besoin de mieux me connaître.']}
  ];
  const followupNodes = new Map();
  const followupMenus = [];
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  };
  const chevron = () => {
    const element = make('i');
    element.setAttribute('data-lucide', 'chevron-down');
    element.setAttribute('aria-hidden', 'true');
    return element;
  };
  const closeFollowupMenus = () => followupMenus.forEach(menu => menu.close());
  followupDefinitions.forEach(definition => {
    const section = make('section', 'psyf-followup');
    section.hidden = true;
    section.dataset.followupKey = definition.key;
    const header = make('div', 'psyf-followup-header');
    const toggle = make('button', 'psyf-followup-toggle cursor-interaction');
    toggle.type = 'button';
    const number = make('span', 'psyf-followup-number');
    number.setAttribute('aria-hidden', 'true');
    const wording = make('span', 'psyf-followup-question', definition.q.replace(/ \?$/, ' ?'));
    wording.id = 'psyf-followup-question-' + definition.key;
    const body = make('div', 'psyf-followup-body');
    body.id = 'psyf-followup-body-' + definition.key;
    body.hidden = true;
    body.setAttribute('role', 'region');
    body.setAttribute('aria-labelledby', wording.id);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', body.id);
    toggle.append(number, wording, chevron());
    header.append(toggle);
    const help = make('div', 'psyf-reason-help');
    const trigger = make('button', 'psyf-reason-trigger cursor-interaction');
    trigger.type = 'button';
    trigger.setAttribute('aria-expanded', 'false');
    const triggerLabel = make('span', '', 'Quelques idées pour t’aider');
    trigger.append(triggerLabel, chevron());
    const menu = make('div', 'psyf-reason-menu');
    menu.id = 'psyf-followup-menu-' + definition.key;
    menu.hidden = true;
    menu.setAttribute('role', 'group');
    menu.setAttribute('aria-label', 'Idées pour : ' + definition.q);
    trigger.setAttribute('aria-controls', menu.id);
    const hint = make('p', 'psyf-reason-hint', 'Plusieurs choix possibles.');
    const options = make('div', 'psyf-reason-options');
    const summary = make('ul', 'psyf-reason-summary');
    summary.hidden = true;
    const refresh = () => {
      const chosen = [...options.querySelectorAll('input:checked')];
      triggerLabel.textContent = chosen.length ? chosen.length + (chosen.length > 1 ? ' idées choisies' : ' idée choisie') : 'Quelques idées pour t’aider';
      summary.replaceChildren();
      chosen.forEach(input => summary.appendChild(make('li', '', definition.choices[Number(input.value)])));
      summary.hidden = !chosen.length || !menu.hidden;
    };
    const close = (returnFocus = false) => {
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      refresh();
      if (returnFocus) trigger.focus();
    };
    definition.choices.forEach((text, index) => {
      const label = make('label', 'psyf-reason-option cursor-interaction');
      const checkbox = make('input');
      checkbox.type = 'checkbox';
      checkbox.value = String(index);checkbox.checked=(config.state.menus?.[menu.id]||[]).includes(text);
      label.append(checkbox, make('span', '', text));
      checkbox.addEventListener('change', refresh);
      options.appendChild(label);
    });
    menu.append(hint, options);
    help.append(trigger, menu, summary);
    trigger.addEventListener('click', () => {
      const wasOpen = !menu.hidden;
      closeMonth();
      closeReasons();
      closeFollowupMenus();
      if (!wasOpen) {
        menu.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        refresh();
      }
    });
    help.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menu.hidden) {
        event.preventDefault();
        event.stopPropagation();
        close(true);
      }
    });
    followupMenus.push({help, close});
    const free = make('textarea', 'psyf-answer');
    free.rows = 3;free.dataset.psyNoteKey='reason:'+definition.key;free.value=config.state.notes?.[free.dataset.psyNoteKey]||'';
    free.placeholder = definition.placeholder || 'Avec mes mots…';
    free.setAttribute('aria-label', 'Ta réponse : ' + definition.q);
    const freeFold = make('details', 'psyf-free-fold');
    const freeSummary = make('summary', 'cursor-interaction');
    freeSummary.append(make('span', '', 'Avec mes mots…'), chevron());
    freeFold.append(freeSummary, free);
    body.append(help, freeFold);
    section.append(header, body);
    toggle.addEventListener('click', () => {
      body.hidden = !body.hidden;
      toggle.setAttribute('aria-expanded', String(!body.hidden));
      if (body.hidden) close();
      else body.querySelectorAll('textarea').forEach(answer => {
        answer.style.height = 'auto';
        answer.style.height = Math.max(48, answer.scrollHeight) + 'px';
      });
    });
    followupHolder.appendChild(section);
    followupNodes.set(definition.key, {section, number});
  });
  function updateFollowups() {
    if (!followupNodes) return;
    const active = [...reasonOptions.querySelectorAll('input:checked')].map(input => input.value);
    if (!active.length && reasonText.value.trim()) active.push('free');
    followupHolder.hidden = !active.length;
    followupNodes.forEach((entry, key) => {
      const index = active.indexOf(key);
      entry.section.hidden = index < 0;
      if (index >= 0) entry.number.textContent = '02.' + (index + 1);
    });
  }
  reasonText.addEventListener('input', updateFollowups);
  reasonTrigger.addEventListener('click', closeFollowupMenus);
  monthTrigger.addEventListener('click', closeFollowupMenus);
  yearTrigger.addEventListener('click', closeFollowupMenus);
  document.addEventListener('click', event => followupMenus.forEach(menu => { if (!menu.help.contains(event.target)) menu.close(); }));
  updateFollowups();

  const hopesDefinitions = [
    {key:'a', label:'Me sentir mieux au quotidien.', q:'Dans ton quotidien, qu’avais-tu surtout envie de retrouver ?', choices:['Plus de calme','De l’énergie','Des moments où je me sentais bien','Un meilleur sommeil']},
    {key:'b', label:'Mieux me comprendre.', q:'Qu’avais-tu envie de mieux comprendre chez toi ?', choices:['Mes réactions','Mes besoins','Mes émotions','Ce qui se répétait dans ma vie']},
    {key:'c', label:'Mieux vivre mon stress ou mes émotions.', q:'Quand le stress ou les émotions prenaient beaucoup de place, qu’aurais-tu aimé pouvoir faire autrement ?', choices:['Reconnaître ce que je ressentais','Réussir à m’apaiser','Exprimer mes émotions','Me sentir moins débordée']},
    {key:'d', label:'Me sentir mieux dans mes relations.', q:'Dans tes relations, qu’aurais-tu aimé voir changer pour te sentir mieux ?', choices:['Poser mes limites','Dire ce dont j’avais besoin','Me sentir davantage comprise','Moins culpabiliser']},
    {key:'f', label:'Traverser une période difficile.', q:'Dans ce que tu traversais, qu’est-ce qui t’aurait aidée à avancer un peu plus sereinement ?', choices:['Comprendre ce que je ressentais','Retrouver des repères','Prendre du recul','Avancer une chose après l’autre']},
    {key:'g', label:'Mieux vivre mon travail.', q:'Quand tu pensais à ton travail, qu’aurais-tu aimé que ce suivi t’aide à changer pour toi ?', choices:['Me sentir moins épuisée','Prendre du recul sur la pression','Comprendre ce qui ne me convenait plus','Réfléchir à ce que je voulais pour la suite']},
    {key:'h', label:'Je ne savais pas encore vraiment ce que j’en attendais.', q:'Même sans attente précise, qu’est-ce qui t’aurait fait du bien à ce moment-là ?', choices:['Pouvoir parler librement','Prendre du temps pour moi','Faire le point','Découvrir ce que les séances pouvaient m’apporter']}
  ].filter(definition => definition.key !== 'g' || (faireConnaissanceAnswers.activities || []).includes('work'));
  const feelingsDefinitions = [
    {key:'a', label:'J’étais stressée ou intimidée.', q:'Qu’est-ce qui t’inquiétait ou t’impressionnait le plus au début ?', choices:['Parler de moi','Ne pas savoir par où commencer','Avoir peur d’être jugée','Ne pas savoir comment une séance se déroulait']},
    {key:'b', label:'J’étais soulagée de pouvoir parler.', q:'Qu’est-ce qui t’a fait du bien dans ces premiers échanges ?', choices:['Être écoutée','Mettre des mots sur ce que je vivais','Me sentir moins seule','Avoir un espace pour moi']},
    {key:'c', label:'J’avais du mal à me confier.', q:'Qu’est-ce qui rendait difficile le fait de parler de toi ?', choices:['Je cherchais mes mots','J’avais besoin de temps pour faire confiance','Certains sujets étaient difficiles à aborder','Je ne savais pas ce que je pouvais raconter']},
    {key:'d', label:'Je me sentais en confiance.', q:'Qu’est-ce qui t’a aidée à te sentir en confiance avec ta psy ?', choices:['Sa façon de m’écouter','Ses paroles','Le sentiment de ne pas être jugée','Pouvoir avancer à mon rythme']},
    {key:'f', label:'J’avais des doutes sur ce que cela pouvait m’apporter.', q:'Qu’est-ce qui te faisait hésiter à ce moment-là ?', choices:['Je ne voyais pas comment parler pouvait m’aider','J’avais peur que rien ne change','Je ne savais pas si cette approche me convenait','J’attendais de voir au fil des séances']},
    {key:'g', label:'Je ne me sentais pas vraiment à l’aise ou comprise.', q:'Qu’est-ce qui t’aurait aidée à te sentir mieux accueillie ou comprise ?', choices:['Davantage d’écoute','Plus de temps pour m’exprimer','Des questions plus claires','Sentir que ce que je vivais était pris au sérieux']},
    {key:'h', label:'Je ne m’en souviens plus très bien.', q:'Même si les détails sont flous, te reste-t-il une impression de ces premières séances ?', optional:true, choices:['Plutôt rassurantes','Plutôt déstabilisantes','Un mélange des deux','Je ne sais plus']}
  ];

  const dynamicChoiceHelpers = [];
  function mountAssistedQuestion(number, mainText, definitions, freeFollowup, instanceKey = number) {
    const question = mainText.closest('.psyf-question');
    const mainFreeFold = mainText.closest('.psyf-free-fold');
    const holder = make('div', 'psyf-followups');
    holder.hidden = true;
    holder.setAttribute('role', 'group');
    holder.setAttribute('aria-label', 'Relances selon tes réponses à la question ' + number);
    question.appendChild(holder);
    const entries = new Map();

    function choiceHelp(id, labels, onChange, menuLabel) {
      const help = make('div', 'psyf-reason-help');
      const trigger = make('button', 'psyf-reason-trigger cursor-interaction');
      trigger.type = 'button';
      trigger.setAttribute('aria-expanded', 'false');
      const triggerLabel = make('span', '', 'Quelques idées pour t’aider');
      trigger.append(triggerLabel, chevron());
      const menu = make('div', 'psyf-reason-menu');
      menu.id = 'psyf-' + id + '-menu';
      menu.hidden = true;
      menu.setAttribute('role', 'group');
      menu.setAttribute('aria-label', menuLabel);
      trigger.setAttribute('aria-controls', menu.id);
      const hint = make('p', 'psyf-reason-hint', 'Plusieurs choix possibles.');
      const options = make('div', 'psyf-reason-options');
      const summary = make('ul', 'psyf-reason-summary');
      summary.hidden = true;
      const inputs = [];
      const labelsFor = typeof labels === 'function' ? labels : () => labels;
      const remembered = new Set(config.state.menus?.[menu.id]||[]);
      let currentLabels = [];
      let previousLabels;
      const refresh = () => {
        const selected = inputs.filter(input => input.checked);
        triggerLabel.textContent = selected.length ? selected.length + (selected.length > 1 ? ' idées choisies' : ' idée choisie') : 'Quelques idées pour t’aider';
        summary.replaceChildren();
        selected.forEach(input => summary.appendChild(make('li', '', currentLabels[Number(input.value)])));
        summary.hidden = !selected.length || !menu.hidden;
      };
      const close = (returnFocus = false) => {
        menu.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        refresh();
        if (returnFocus) trigger.focus();
      };
      const sync = () => {
        const nextLabels = [...new Set(labelsFor())];
        const signature = JSON.stringify(nextLabels);
        if (signature === previousLabels) return;
        inputs.forEach(input => {
          const text = currentLabels[Number(input.value)];
          if (input.checked) remembered.add(text); else remembered.delete(text);
        });
        previousLabels = signature;
        currentLabels = nextLabels;
        inputs.length = 0;
        options.replaceChildren();
        currentLabels.forEach((text, index) => {
          const label = make('label', 'psyf-reason-option cursor-interaction');
          const input = make('input');
          input.type = 'checkbox';
          input.value = String(index);
          input.checked = remembered.has(text);
          input.addEventListener('change', () => {
            if (input.checked) remembered.add(text); else remembered.delete(text);
            refresh();
            onChange();
            status.textContent = 'Question ' + number + ' : réponse mise à jour.';
          });
          inputs.push(input);
          label.append(input, make('span', '', text));
          options.appendChild(label);
        });
        help.hidden = typeof labels === 'function' && !currentLabels.length;
        refresh();
      };
      sync();
      if (typeof labels === 'function') dynamicChoiceHelpers.push(sync);
      menu.append(hint, options);
      help.append(trigger, menu, summary);
      trigger.addEventListener('click', () => {
        const wasOpen = !menu.hidden;
        closeMonth();
        closeYear();
        closeReasons();
        closeFollowupMenus();
        if (!wasOpen) {
          menu.hidden = false;
          trigger.setAttribute('aria-expanded', 'true');
          refresh();
        }
      });
      help.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !menu.hidden) {
          event.preventDefault();
          event.stopPropagation();
          close(true);
        }
      });
      followupMenus.push({help, close});
      return {help, inputs, close};
    }

    const main = choiceHelp('question-' + instanceKey, definitions.map(definition => definition.label), update, 'Idées pour la question ' + number);
    question.insertBefore(main.help, mainFreeFold);
    const allDefinitions = freeFollowup ? [...definitions, {key:'free', q:freeFollowup}] : definitions;
    allDefinitions.forEach(definition => {
      const section = make('section', 'psyf-followup');
      section.hidden = true;
      section.dataset.followupKey = definition.key;
      const header = make('div', 'psyf-followup-header');
      const toggle = make('button', 'psyf-followup-toggle cursor-interaction');
      toggle.type = 'button';
      const marker = make('span', 'psyf-followup-number');
      marker.setAttribute('aria-hidden', 'true');
      const wording = make('span', 'psyf-followup-question', definition.q.replace(/ \?$/, ' ?'));
      wording.id = 'psyf-question-' + instanceKey + '-followup-' + definition.key;
      const body = make('div', 'psyf-followup-body');
      body.id = wording.id + '-body';
      body.hidden = true;
      body.setAttribute('role', 'region');
      body.setAttribute('aria-labelledby', wording.id);
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', body.id);
      toggle.append(marker, wording, chevron());
      header.appendChild(toggle);
      let suggestions;
      if (definition.choices) {
        suggestions = choiceHelp('question-' + instanceKey + '-' + definition.key, definition.choices, () => {}, 'Idées pour : ' + definition.q);
        body.appendChild(suggestions.help);
      }
      if (definition.optional) body.appendChild(make('p', 'psyf-reason-hint', 'Tu peux aussi laisser cette question de côté.'));
      const fold = make('details', 'psyf-free-fold');
      const summary = make('summary', 'cursor-interaction');
      summary.append(make('span', '', 'Avec mes mots…'), chevron());
      const answer = make('textarea', 'psyf-answer');
      answer.rows = 3;answer.dataset.psyNoteKey=instanceKey+':'+definition.key;answer.value=config.state.notes?.[answer.dataset.psyNoteKey]||'';
      answer.placeholder = 'Avec mes mots…';
      answer.setAttribute('aria-label', 'Ta réponse : ' + definition.q);
      fold.append(summary, answer);
      body.appendChild(fold);
      section.append(header, body);
      holder.appendChild(section);
      toggle.addEventListener('click', () => {
        body.hidden = !body.hidden;
        toggle.setAttribute('aria-expanded', String(!body.hidden));
        if (body.hidden && suggestions) suggestions.close();
      });
      entries.set(definition.key, {section, marker, suggestions});
    });
    function update() {
      const active = main.inputs.filter(input => input.checked).map(input => definitions[Number(input.value)].key);
      if (!active.length && mainText.value.trim() && freeFollowup) active.push('free');
      holder.hidden = !active.length;
      entries.forEach((entry, key) => {
        const position = active.indexOf(key);
        entry.section.hidden = position < 0;
        if (position >= 0) entry.marker.textContent = number + '.' + (position + 1);
        else if (entry.suggestions) entry.suggestions.close();
      });
    }
    mainText.addEventListener('input', update);
    update();
    return {
      answered: () => main.inputs.some(input => input.checked) || Boolean(mainText.value.trim()),
      selectedKeys: () => main.inputs.filter(input => input.checked).map(input => definitions[Number(input.value)].key),
      freeText: () => mainText.value.trim()
    };
  }
  const hopesQuestion = mountAssistedQuestion('03', root.querySelector('#psyf-qtc-hopes'), hopesDefinitions, 'Quand tu repenses à cette attente, qu’aurais-tu aimé voir changer concrètement dans ta vie ?');
  const feelingsQuestion = mountAssistedQuestion('04', root.querySelector('#psyf-qtc-feelings'), feelingsDefinitions);

  const topicsDefinitions = [
    {key:'a', label:'Ma famille.', q:'Dans ce que tu vivais avec ta famille, qu’avez-vous surtout abordé ensemble ?', choices:['Les tensions ou les conflits','Ma place dans ma famille','Mes besoins et mes limites']},
    {key:'b', label:'Ma vie affective.', q:'Dans ta vie affective, qu’avez-vous essayé de mieux comprendre ?', choices:['Mes besoins dans mon couple','Ma façon de vivre les relations','Ce qui me rapproche ou m’éloigne de l’autre']},
    {key:'c', label:'Mes amitiés.', q:'Quels aspects de tes amitiés ont pris de la place dans vos échanges ?', choices:['La place que je prends dans mes relations','Les rapprochements ou les distances','Ce que j’attends d’une amitié']},
    {key:'d', label:'Mon travail.', q:'Concernant ton travail, quels sujets sont revenus dans vos échanges ?', choices:['Ce qui me pèse au quotidien','Ce qui me convient ou me manque','Mes envies pour la suite']},
    {key:'e', label:'Mes émotions ou mon stress.', q:'Qu’avez-vous essayé de comprendre dans ce que tu ressentais ?', choices:['Ce qui déclenche mes émotions','Ma manière de les exprimer','Ce qui m’aide à les traverser']},
    {key:'f', label:'La confiance que j’ai en moi.', q:'Quand vous parliez de confiance en toi, qu’est-ce qui comptait particulièrement pour toi ?', choices:['Le regard que je porte sur moi','La peur du jugement','Ma difficulté à m’affirmer']},
    {key:'g', label:'Un événement difficile.', q:'Autour de cet événement, qu’avez-vous pu aborder ensemble ?', choices:['Ce que j’avais vécu','Les conséquences dans mon quotidien','Ce qui restait sensible pour moi']},
    {key:'h', label:'Un changement dans ma vie.', q:'Dans ce changement, qu’avez-vous surtout exploré ensemble ?', choices:['Les repères que je cherchais','Mes doutes ou mes décisions','Ma façon de vivre cette nouvelle situation']},
    {key:'i', label:'Ma santé ou mon corps.', q:'Quand vous en avez parlé, quels aspects étaient importants pour toi ?', choices:['Le regard que je porte sur mon corps','Ce que cette situation me fait ressentir','Ses effets sur mon quotidien ou mes relations']},
    {key:'j', label:'J’ai du mal à retrouver les sujets.', q:'Est-ce qu’un mot, une phrase ou une impression te revient ?', optional:true, choices:['Une situation dont j’ai souvent parlé','Une question qu’elle m’a posée','Un ressenti qui me reste','Pour l’instant, rien ne me revient']}
  ].filter(definition => definition.key !== 'd' || (faireConnaissanceAnswers.activities || []).includes('work'));
  const momentsDefinitions = [
    {key:'a', label:'Une phrase ou une question de ma psy.', q:'Qu’a-t-elle dit, et comment l’as-tu reçu ?', choices:['Je me suis sentie comprise','Cela m’a fait réfléchir','Cela m’a surprise ou bousculée']},
    {key:'b', label:'Une prise de conscience.', q:'Qu’est-ce qui est devenu plus clair pour toi à ce moment-là ?', choices:['Un besoin que je ne reconnaissais pas','Un lien avec mon histoire','Une façon de réagir qui se répétait']},
    {key:'c', label:'Un moment où je me suis sentie comprise.', q:'Qu’est-ce qui t’a donné ce sentiment à cet instant ?', choices:['Sa façon de m’écouter','Les mots qu’elle a trouvés','Sentir que ce que je vivais était pris au sérieux']},
    {key:'d', label:'Un échange difficile ou déstabilisant.', q:'Qu’est-ce qui a été difficile à vivre pour toi dans cet échange ?', choices:['Un sujet sensible','Une parole qui m’a blessée','Une question qui m’a déstabilisée','Le sentiment de ne pas être comprise']},
    {key:'e', label:'Un exercice ou une piste proposée par ma psy.', q:'Que t’avait-elle proposé, et comment avais-tu accueilli cette idée ?', choices:['Cela me semblait utile','J’avais envie d’essayer, avec quelques hésitations','Je ne me sentais pas prête','Cela ne me correspondait pas']},
    {key:'f', label:'Avoir réussi à dire quelque chose d’important.', q:'Qu’as-tu pu exprimer à ce moment-là, avec les mots que tu avais ?', choices:['Un ressenti que je gardais pour moi','Un besoin ou une limite','Quelque chose de difficile à raconter']},
    {key:'g', label:'Plusieurs petits moments plutôt qu’un seul.', q:'Qu’est-ce qui donne de l’importance à ces moments pour toi ?', choices:['Un sujet qu’on a approfondi progressivement','Une confiance qui s’est installée','Des petits pas que j’ai remarqués au fil des séances']},
    {key:'h', label:'Aucun moment précis ne me revient.', q:'Te reste-t-il plutôt une impression générale de ces séances ?', optional:true, choices:['Elles me faisaient du bien','Elles me remuaient','Mon ressenti était partagé','Pour l’instant, je ne retrouve pas de souvenir précis']}
  ];
  const topicsQuestion = mountAssistedQuestion('01', root.querySelector('#psyf-parcours-topics'), topicsDefinitions);
  const momentsQuestion = mountAssistedQuestion('02', root.querySelector('#psyf-parcours-moments'), momentsDefinitions);

  const presentFeelingDefinitions = [
    {key:'a', label:'Je me sens en confiance avec ma psy.', q:'Qu’est-ce qui t’aide à te sentir en confiance avec elle aujourd’hui ?', choices:['Sa façon de m’écouter','Pouvoir parler sans me sentir jugée','Sentir que mon rythme est respecté']},
    {key:'b', label:'J’arrive de plus en plus à me confier.', q:'Qu’est-ce que tu arrives à partager plus facilement qu’au début ?', choices:['Mes émotions','Ce que je n’osais pas dire','Mes besoins et mes limites']},
    {key:'c', label:'Certains sujets restent difficiles à aborder.', q:'Qu’est-ce qui rend ces sujets délicats pour toi ?', choices:['Je ne trouve pas les mots','J’appréhende sa réaction','Je ne me sens pas encore prête','J’ai besoin de plus de temps']},
    {key:'d', label:'Je ne me sens pas toujours comprise ou à l’aise.', q:'Qu’est-ce qui te manque dans les échanges pour te sentir plus à l’aise ?', choices:['Davantage d’écoute','Plus de place pour m’exprimer','Des retours plus clairs','Sentir que ce que je vis est pris au sérieux']},
    {key:'g', label:'Mon ressenti varie selon les séances.', q:'Qu’est-ce qui fait le plus varier ton ressenti d’une séance à l’autre ?', choices:['Les sujets abordés','Mon état en arrivant','La façon dont nos échanges se passent','Le temps écoulé entre les séances']},
    {key:'h', label:'J’ai encore du mal à savoir comment je le vis.', q:'Si tu repenses à ta dernière séance, quelle impression te reste ?', optional:true, choices:['Plutôt rassurante','Plutôt déstabilisante','Un ressenti partagé','C’est encore flou pour moi']}
  ];
  const presentChangesDefinitions = [
    {key:'a', label:'Je comprends mieux ce que je ressens.', q:'Qu’est-ce que tu arrives à reconnaître ou à comprendre plus facilement aujourd’hui ?', choices:['Mettre des mots sur mes émotions','Repérer ce qui les déclenche','Comprendre mes réactions']},
    {key:'b', label:'J’identifie mieux mes besoins ou mes limites.', q:'Qu’est-ce qui est devenu plus clair pour toi concernant tes besoins ou tes limites ?', choices:['Ce qui me fait du bien','Ce qui ne me convient pas','Ce que je ne veux plus accepter','Ce dont j’ai besoin dans mes relations']},
    {key:'c', label:'Je réagis autrement dans certaines situations.', q:'Qu’est-ce qui est différent dans ta façon de réagir ?', choices:['Je prends davantage de recul','J’exprime plus facilement ce que je ressens','J’ose davantage poser mes limites','Je me laisse du temps avant de répondre']},
    {key:'d', label:'Je me sens un peu mieux au quotidien.', q:'À quoi reconnais-tu ce mieux-être, même s’il est discret ?', choices:['Des moments plus calmes','Davantage d’énergie','Moins de culpabilité','Plus de place pour ce qui me fait du bien']},
    {key:'e', label:'Certaines difficultés sont toujours là.', q:'Qu’est-ce qui reste difficile à vivre pour toi aujourd’hui ?', choices:['Certaines émotions','Des situations qui se répètent','Poser mes limites','Faire confiance à mon ressenti']},
    {key:'f', label:'Ce travail fait remonter des choses difficiles.', q:'Comment cela se manifeste-t-il pour toi entre les séances ?', choices:['Je repense beaucoup à certains échanges','Je me sens plus émotive','Certains souvenirs reviennent','J’ai besoin de temps pour retrouver mon calme']},
    {key:'g', label:'Je ne vois pas encore de changement.', q:'Qu’est-ce qui te donne cette impression aujourd’hui ?', choices:['Je rencontre toujours les mêmes difficultés','Je comprends certaines choses sans réussir à agir autrement','Je pense avoir besoin de davantage de temps','Les changements sont difficiles à repérer']},
    {key:'h', label:'C’est encore difficile à évaluer.', q:'Qu’est-ce qui rend ce bilan difficile à faire pour toi ?', optional:true, choices:['Mon ressenti change selon les jours','Je ne sais pas à quoi comparer','J’ai du mal à prendre du recul','Je préfère laisser cette question ouverte pour le moment']}
  ];
  const presentFeelingQuestion = mountAssistedQuestion('01', root.querySelector('#psyf-present-feeling'), presentFeelingDefinitions, undefined, 'present-01');
  const presentChangesQuestion = mountAssistedQuestion('02', root.querySelector('#psyf-present-changes'), presentChangesDefinitions, undefined, 'present-02');

  const knownTopicsForNext = () => {
    const selected = new Set(topicsQuestion.selectedKeys());
    const labels = topicsDefinitions.filter(definition => definition.key !== 'j' && selected.has(definition.key)).map(definition => definition.label);
    if (topicsQuestion.freeText()) labels.push('Le sujet raconté avec mes mots');
    return labels;
  };
  const nextDefinitions = [
    {key:'a', label:'Continuer à travailler sur un sujet déjà abordé.', q:'Parmi les sujets que vous avez déjà explorés, lesquels aimerais-tu poursuivre ?', choices:knownTopicsForNext},
    {key:'b', label:'Revenir sur quelque chose resté en suspens.', q:'Qu’est-ce que tu aimerais pouvoir reprendre ou éclaircir ?', choices:['Un échange qui me reste en tête','Une question sans réponse','Un ressenti que je n’ai pas réussi à exprimer']},
    {key:'c', label:'Parler de quelque chose que je n’ai pas encore abordé.', q:'Qu’aimerais-tu pouvoir lui confier, quand tu te sentiras prête ?', choices:['Une situation que je garde pour moi','Un ressenti difficile à expliquer','Un besoin dont je n’ai pas encore parlé']},
    {key:'d', label:'Approfondir quelque chose que j’ai commencé à comprendre.', q:'Qu’aurais-tu envie d’explorer davantage à partir de cette prise de conscience ?', choices:['Son lien avec mon histoire','Ce que cela signifie pour moi','Ce que j’aimerais en faire aujourd’hui']},
    {key:'e', label:'Trouver comment avancer concrètement au quotidien.', q:'Qu’aimerais-tu pouvoir faire ou essayer plus facilement dans ta vie quotidienne ?', choices:['Poser mes limites','Exprimer mes besoins','Traverser certaines émotions','Faire un choix important pour moi']},
    {key:'f', label:'Parler avec ma psy de la façon dont je vis le suivi.', q:'Qu’aimerais-tu pouvoir lui dire sur ce qui te convient ou te manque ?', choices:['Ce qui m’aide','Ce qui me met mal à l’aise','Ce que je ne comprends pas','Ce que j’aimerais vivre autrement dans nos échanges']},
    {key:'g', label:'Continuer à mon rythme, sans objectif précis pour le moment.', q:'Qu’aimerais-tu retrouver dans les prochaines séances ?', optional:true, choices:['Un espace pour parler librement','Du temps pour comprendre ce que je vis','La possibilité de laisser venir les sujets']},
    {key:'h', label:'Je ne sais pas encore ce que je veux pour la suite.', q:'Qu’est-ce qui t’aiderait à réfléchir à la suite, sans avoir à décider maintenant ?', optional:true, choices:['En parler avec ma psy','Me laisser du temps','Partir de ce que je vis actuellement','Laisser cette question ouverte']}
  ];
  const nextQuestion = mountAssistedQuestion('01', root.querySelector('#psyf-next-wishes'), nextDefinitions, undefined, 'next-01');

  // Les relances restent facultatives ; chacune des quatre questions compte une fois.
  const progressTrack = root.querySelector('[data-progress-track]');
  const progressFill = root.querySelector('[data-progress-fill]');
  const progressValue = root.querySelector('[data-progress-value]');
  const parcoursProgressTrack = root.querySelector('[data-parcours-progress-track]');
  const parcoursProgressFill = root.querySelector('[data-parcours-progress-fill]');
  const parcoursProgressValue = root.querySelector('[data-parcours-progress-value]');
  const presentProgressTrack = root.querySelector('[data-present-progress-track]');
  const presentProgressFill = root.querySelector('[data-present-progress-fill]');
  const presentProgressValue = root.querySelector('[data-present-progress-value]');
  const nextProgressTrack = root.querySelector('[data-next-progress-track]');
  const nextProgressFill = root.querySelector('[data-next-progress-fill]');
  const nextProgressValue = root.querySelector('[data-next-progress-value]');
  const syncMainProgress = (id, value) => {
    const card = themes.querySelector('[data-chapter="' + id + '"]');
    card.dataset.actualProgress = String(value);
    card.querySelector('[data-track]').setAttribute('aria-valuenow', String(value));
    card.querySelector('[data-fill]').style.width = value + '%';
    card.querySelector('[data-percent]').textContent = value + ' %';
  };
  function updateProgress() {
    dynamicChoiceHelpers.forEach(sync => sync());
    const answered = [
      forgot.checked || Boolean(month.value || year.value),
      Boolean(reasonOptions.querySelector('input:checked') || reasonText.value.trim()),
      hopesQuestion.answered(),
      feelingsQuestion.answered()
    ].filter(Boolean).length;
    const percent = answered * 25;
    progressTrack.setAttribute('aria-valuenow', String(percent));
    progressTrack.setAttribute('aria-valuetext', answered + (answered > 1 ? ' questions renseignées sur quatre' : ' question renseignée sur quatre'));
    progressFill.style.width = percent + '%';
    progressValue.textContent = percent + ' %';
    const parcoursAnswered = [topicsQuestion.answered(), momentsQuestion.answered()].filter(Boolean).length;
    const parcoursPercent = parcoursAnswered * 50;
    parcoursProgressTrack.setAttribute('aria-valuenow', String(parcoursPercent));
    parcoursProgressTrack.setAttribute('aria-valuetext', parcoursAnswered + (parcoursAnswered > 1 ? ' questions renseignées sur deux' : ' question renseignée sur deux'));
    parcoursProgressFill.style.width = parcoursPercent + '%';
    parcoursProgressValue.textContent = parcoursPercent + ' %';
    const presentAnswered = [presentFeelingQuestion.answered(), presentChangesQuestion.answered()].filter(Boolean).length;
    const presentPercent = presentAnswered * 50;
    presentProgressTrack.setAttribute('aria-valuenow', String(presentPercent));
    presentProgressTrack.setAttribute('aria-valuetext', presentAnswered + (presentAnswered > 1 ? ' questions renseignées sur deux' : ' question renseignée sur deux'));
    presentProgressFill.style.width = presentPercent + '%';
    presentProgressValue.textContent = presentPercent + ' %';
    const nextPercent = nextQuestion.answered() ? 100 : 0;
    nextProgressTrack.setAttribute('aria-valuenow', String(nextPercent));
    nextProgressTrack.setAttribute('aria-valuetext', nextPercent ? 'Question renseignée' : 'Question à renseigner');
    nextProgressFill.style.width = nextPercent + '%';
    nextProgressValue.textContent = nextPercent + ' %';
    syncMainProgress('commencement', percent);
    syncMainProgress('parcours', parcoursPercent);
    syncMainProgress('present', presentPercent);
    syncMainProgress('next', nextPercent);
  }
  root.addEventListener('input', updateProgress);
  root.addEventListener('change', updateProgress);
  root.addEventListener('click', updateProgress);

  globalThis.__enPsyIcons?.(root,12);
  root.querySelectorAll('.psyf-answer').forEach(answer => {
    const fit = () => {
      answer.style.height = 'auto';
      answer.style.height = Math.max(48, answer.scrollHeight) + 'px';
    };
    answer.addEventListener('input', fit);
  });
  root.querySelectorAll('.psyf-free-fold').forEach(fold => fold.addEventListener('toggle', () => {
    if (!fold.open) return;
    const answer = fold.querySelector('textarea');
    answer.style.height = 'auto';
    answer.style.height = Math.max(48, answer.scrollHeight) + 'px';
  }));
  const stepPanels = [...root.querySelectorAll('[data-step]')];
  const stepCount = root.querySelector('[data-step-count]');
  const headerBack = root.querySelector('[data-header-back]');
  const pageTitle = root.querySelector('.psyf-name');
  const paper = root.querySelector('.psyf-paper');
  let currentStep = 1;
  let activeChapter = 'next';
  const showStep = (step, moveFocus = true) => {
    currentStep = step === 2 ? 2 : 1;
    closeMonth();
    closeYear();
    closeReasons();
    closeFollowupMenus();
    stepPanels.forEach(panel => { panel.hidden = Number(panel.dataset.step) !== currentStep; });
    stepCount.textContent = currentStep === 1 ? 'Questions 01 et 02' : 'Questions 03 et 04';
    headerBack.setAttribute('aria-label', currentStep === 2 ? 'Revenir aux questions 01 et 02' : 'Revenir aux thèmes');
    const visiblePanel = stepPanels.find(panel => !panel.hidden);
    visiblePanel.querySelectorAll('textarea').forEach(answer => {
      answer.style.height = 'auto';
      answer.style.height = Math.max(48, answer.scrollHeight) + 'px';
    });
    if (moveFocus) {
      headerBack.focus({preventScroll:true});
      root.querySelector('header').scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    }
  };
  const returnToThemes = () => config.onFinish(()=>{

    closeMonth();
    closeYear();
    closeReasons();
    closeFollowupMenus();
    detail.hidden = true;
    parcoursDetail.hidden = true;
    presentDetail.hidden = true;
    nextDetail.hidden = true;
    themes.hidden = false;
    root.hidden = true;
    updateProgress();
    themes.querySelector('[data-chapter="' + activeChapter + '"]').focus();
  });
  const openCommencement = (moveFocus = true) => {
    activeChapter = 'commencement';
    root.hidden = false;
    themes.hidden = true;
    parcoursDetail.hidden = true;
    presentDetail.hidden = true;
    nextDetail.hidden = true;
    detail.hidden = false;
    pageTitle.textContent = 'QUAND TOUT A COMMENCÉ';
    paper.setAttribute('aria-label', 'Quand tout a commencé');
    showStep(1, moveFocus);
  };
  const openSingleChapter = (key, screen, title, moveFocus = true) => {
    activeChapter = key;
    root.hidden = false;
    closeMonth();
    closeYear();
    closeReasons();
    closeFollowupMenus();
    themes.hidden = true;
    detail.hidden = true;
    parcoursDetail.hidden = true;
    presentDetail.hidden = true;
    nextDetail.hidden = true;
    screen.hidden = false;
    pageTitle.textContent = title.toLocaleUpperCase('fr-FR');
    paper.setAttribute('aria-label', title);
    headerBack.setAttribute('aria-label', 'Revenir aux rubriques');
    screen.querySelectorAll('textarea').forEach(answer => {
      answer.style.height = 'auto';
      answer.style.height = Math.max(48, answer.scrollHeight) + 'px';
    });
    if (moveFocus) {
      headerBack.focus({preventScroll:true});
      root.querySelector('header').scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    }
  };
  const openParcours = (moveFocus = true) => openSingleChapter('parcours', parcoursDetail, 'Le chemin déjà parcouru', moveFocus);
  const openPresent = (moveFocus = true) => openSingleChapter('present', presentDetail, 'Là où j’en suis', moveFocus);
  const openNext = (moveFocus = true) => openSingleChapter('next', nextDetail, 'Ce que j’aimerais pour la suite', moveFocus);
  root.querySelector('[data-continue]').addEventListener('click', () => showStep(2));
  root.querySelectorAll('[data-return]').forEach(button => button.addEventListener('click', returnToThemes));
  headerBack.addEventListener('click', () => {
    if (!parcoursDetail.hidden || !presentDetail.hidden || !nextDetail.hidden) returnToThemes();
    else if (currentStep === 2) showStep(1);
    else returnToThemes();
  });
  themes.querySelector('[data-chapter="commencement"]').addEventListener('click', () => openCommencement());
  themes.querySelector('[data-chapter="parcours"]').addEventListener('click', () => openParcours());
  themes.querySelector('[data-chapter="present"]').addEventListener('click', () => openPresent());
  themes.querySelector('[data-chapter="next"]').addEventListener('click', () => openNext());
  if(config.initialPage==='main'){root.hidden=true;themes.hidden=false;}else if(config.initialPage==='commencement'){openCommencement(false);if(config.state.step===2)showStep(2,false);}else if(config.initialPage==='parcours')openParcours(false);else if(config.initialPage==='present')openPresent(false);else openNext(false);
  updateProgress();

function snapshot(){const fields={},notes={},menus={};for(const node of root.querySelectorAll('input[id],textarea[id]'))if(node.id&&node.type!=='checkbox')fields[node.id]=node.value;for(const node of root.querySelectorAll('[data-psy-note-key]'))notes[node.dataset.psyNoteKey]=node.value;for(const menu of root.querySelectorAll('.psyf-reason-menu[id]')){const inputs=[...menu.querySelectorAll('input')],label=input=>input.parentElement.querySelector('span')?.textContent||'',available=new Set(inputs.map(label));menus[menu.id]=[...inputs.filter(input=>input.checked).map(label),...(config.state.menus?.[menu.id]||[]).filter(text=>!available.has(text))];}return {fields,notes,menus,recapTab:recap?.tab||config.state.recapTab,unknown:forgot.checked,rememberedDates:{...remembered},step:currentStep,route:recap?.visible?'recap':themes.hidden?activeChapter:'main',aiSummary:themes.querySelector('[data-summary-text]')?.value||'',preferredAI:themes.querySelector('[data-provider][aria-pressed="true"]')?.dataset.provider||config.state.preferredAI||''};}
if(forgot.checked)forgot.dispatchEvent(new Event('change',{bubbles:true}));
root.querySelector('[data-approved-menu]')?.addEventListener('click',()=>config.onMenu());
const summaryInput=themes.querySelector('[data-summary-text]');if(summaryInput)summaryInput.value=config.state.aiSummary||'';
if(config.state.preferredAI)themes.querySelector('[data-provider="'+config.state.preferredAI+'"]')?.click();
recap=globalThis.__enMountFollowupRecap({document,root,paper,themes,forms:[detail,parcoursDetail,presentDetail,nextDetail],state:config.state,backButton:headerBack,saveThen:config.onFinish,onExit:config.onExit,onLater:config.onLater,onThemes(){root.hidden=true;themes.hidden=false;updateProgress();themes.querySelector('[data-open-followup-recap]').focus();},title(text){pageTitle.textContent=text;paper.setAttribute('aria-label',text);headerBack.setAttribute('aria-label','Revenir aux rubriques');},onViewChange(){}});
if(config.initialPage==='recap')recap.open(false);
return {snapshot,host:container,recap,show(page){if(page==='recap'){recap.open();return;}recap.close();if(page==='main'){root.hidden=true;themes.hidden=false;updateProgress();}else ({commencement:openCommencement,parcours:openParcours,present:openPresent,next:openNext}[page]||openNext)();}};

};})();
