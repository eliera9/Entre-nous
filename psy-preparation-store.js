/* Migration additive : l’ancienne préparation reste intégralement conservée. */
(()=>{
 const clone=value=>JSON.parse(JSON.stringify(value));
 function createPreparation(first={}){
  const p=first.p||{},questions={};
  const note=(key,lines)=>{const free=lines.filter(Boolean).join('\n');if(free)questions[key]={selected:[],drafts:{},free,page:0,customEntries:[]}};
  const fields=(pairs)=>pairs.map(([key,label])=>typeof p[key]==='string'&&p[key].trim()?label+' : '+p[key]:'');
  note('topics',[
   Array.isArray(p.pq_th)&&p.pq_th.length?'Les sujets que j’avais choisis : '+p.pq_th.join(', '):'',
   ...fields([['pq_a','Ce qui se passe en ce moment'],['pq_b','Depuis quand ça dure'],['pq_c','Ce qui m’a décidée à venir']])
  ]);
  note('attentes:attentes',[
   Array.isArray(p.at_th)&&p.at_th.length?'Ce que j’avais choisi : '+p.at_th.join(', '):'',
   ...fields([['at_a','Ce que j’espère de ce suivi'],['at_b','Comment je saurai que ça va mieux'],['at_c','Ce dont j’ai besoin d’elle']])
  ]);
  note('confort',[...fields([['pe_a','Ce qui est difficile à dire'],['pe_b','Ce qui me fait peur en le disant']]),typeof p.pe_j==='string'&&p.pe_j?'Le jour J : '+p.pe_j:'']);
  const practical=['Combien coûte une séance ?','Est-ce remboursé ?','Combien de temps dure une séance ?','Ce que je dis reste entre nous ?','Comment annuler un rendez-vous ?',...(p.pr_own||[])];
  const customEntries=practical.flatMap((answer,index)=>p[index<5?'pr_q'+(index+1):'pr_o'+(index-5)]?[{id:'custom:legacy:'+index,answer,prompt:answer}]:[]);
  if(customEntries.length){const drafts={};for(const entry of customEntries){const index=Number(entry.id.split(':').at(-1)),key=index<5?'q'+(index+1):'o'+(index-5);if(typeof p['prr_'+key]==='string')drafts[entry.id]=p['prr_'+key];}questions.pratique={selected:customEntries.map(entry=>entry.id),drafts,free:'',page:0,customEntries};}
  return {version:1,questions,history:(p.hi_tl||[]).map((entry,index)=>({id:'legacy:'+index,period:String(entry.y??''),label:String(entry.t??'')})),freeUnknown:'',confirmed:false,legacyArchive:clone(first)};
 }
 function ensureLife(stored){
  stored.pagesV2||={version:2,answers:{},people:{}};
  stored.pagesV2.answers||={};stored.pagesV2.people||={};
  stored.pagesV2.people.family||={selected:[],pools:{},activeId:null};
  return stored;
 }
 window.__enPsyPreparationStore={createPreparation,ensureLife};
})();
