import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const win={};
new Function('window',fs.readFileSync(new URL('../ma-vie-validee.js',import.meta.url),'utf8'))(win);
new Function('window',fs.readFileSync(new URL('../ma-vie-pages.js',import.meta.url),'utf8'))(win);
const tools=win.__enGroupedLifeStore;
const make=()=>{const data=tools.clone(win.__enGroupedLifeData),model=tools.clone(win.__enApprovedLifeTools.model);tools.installModel(data,model);return {data,model};};
test('23 pages couvrent exactement les 132 formulations retenues, sans les 43 retirées',()=>{
 const {data}=make(),pages=data.chapters.flatMap(chapter=>chapter.pages),numbers=pages.flatMap(page=>page.questionNumbers);
 assert.equal(pages.length,23);assert.equal(data.chapters.length,5);assert.equal(numbers.length,132);assert.equal(new Set(numbers).size,132);assert.equal(data.excludedNumbers.length,43);
 assert.deepEqual(numbers.filter(number=>data.excludedNumbers.includes(number)),[]);
 assert.equal(data.questions['007'].q,'En ce moment, tu travailles, tu étudies, ou tu es dans une autre situation ?');
 assert.equal(data.questions['048'].q,'Comment te décrirais-tu à quelqu’un qui ne te connaît pas encore ?');
 assert.equal(data.questions['161'].q,'Qu’est-ce qui crée parfois des tensions ou des incompréhensions entre vous ?');
});
test('la migration distingue dates, durées et textes sans écraser les anciens brouillons',()=>{
 const {data,model}=make(),stored={answers:{ville:{selected:[],detail:'Texte validé',rows:[{place:'Lyon',since:'2020',why:'Un déménagement'}]},job:{selected:[],detail:'',rows:[{title:'Libraire',since:'6 mois'}]}},drafts:{ville:{selected:[],detail:'Correction en cours',rows:[{place:'Rennes',since:'2020',why:'Un déménagement'}]}}};
 const original=tools.clone(stored),state=tools.prepare(stored,data,model);
 assert.equal(state.answers['001'].text,'Correction en cours');assert.equal(state.answers['001'].fields.place,'Rennes');assert.equal(state.answers['001'].time.year,'2020');assert.equal(state.answers['008'].time.amount,'6');
 assert.deepEqual(state.migrationArchive.answers,original.answers);assert.deepEqual(state.migrationArchive.drafts,original.drafts);
 state.answers['001'].text='Une nouvelle précision';tools.writeGeneric(stored,state,data,'001');assert.equal(stored.answers.ville.detail,'Texte validé');assert.equal(stored.drafts.ville.rows[0].why,'Un déménagement');
});
test('les noms ne servent pas à deviner un lien familial et une amie d’enfance peut rester actuelle',()=>{
 const {data,model}=make(),stored={answers:{pr_maman:{rows:[{name:'Alex',bond:'Un lien important'}]},pr_amie_nom:{rows:[{name:'Camille',bond:'Une amie d’enfance que je vois souvent'},{name:'Sam',bond:'Amitié passée — de beaux souvenirs'}]}},drafts:{}};
 const state=tools.prepare(stored,data,model);assert.equal(state.people.family.pools.other[0].name,'Alex');assert.equal(state.people.family.pools.mother,undefined);assert.equal(state.people.friends.pools.friend[0].name,'Camille');assert.equal(state.people.friends.pools['past-friend'][0].name,'Sam');
});
test('les corrections, l’âge libre et la photo d’une fiche survivent à une réouverture',()=>{
 const {data,model}=make(),stored={answers:{pr_maman:{rows:[{name:'Parent test',role:'Ma mère',bond:'Un lien important'}]}},drafts:{}};
 let state=tools.prepare(stored,data,model),person=state.people.family.pools.mother[0];person.name='Nom corrigé';person.age='La cinquantaine';person.photo='data:image/png;base64,fixture';person.responses.portrait.text='Texte corrigé';
 const restored=JSON.parse(JSON.stringify(stored));state=tools.prepare(restored,data,model);person=state.people.family.pools.mother[0];assert.equal(person.name,'Nom corrigé');assert.equal(person.age,'La cinquantaine');assert.equal(person.photo,'data:image/png;base64,fixture');assert.equal(person.responses.portrait.text,'Texte corrigé');assert.equal(state.migrationArchive.answers.pr_maman.rows[0].name,'Parent test');
});
test('une date d’histoire conserve son événement, sa précision et sa période libre',()=>{
 const {data,model}=make(),stored={answers:{hi_dates:{selected:[],detail:'',rows:[{event:'Rencontre',when:'2020-06',precision:'Un mois et une année'},{event:'Voyage',when:'Un été',precision:'Une période, avec mes mots'}]}},drafts:{}};
 const state=tools.prepare(stored,data,model);assert.equal(state.answers['168'].records[0].place,'Rencontre');assert.equal(state.answers['168'].records[0].time.month,'6');tools.writeGeneric(stored,state,data,'168');assert.equal(stored.drafts.hi_dates.rows[1].event,'Voyage');assert.equal(stored.drafts.hi_dates.rows[1].when,'Un été');assert.equal(stored.answers.hi_dates.rows[0].when,'2020-06');
});
test('les quatre nouvelles questions restent importables avec leurs identifiants stables',()=>{
 const {data,model}=make();
 for(const number of ['N02','N03','N06','N07']){const id=data.modelIds[number];assert.ok(model.steps[id]);assert.equal(model.canonical[id],id);assert.ok(model.steps[id].ideas.length);}
 const raw='=== REPONSES_ENTRE_NOUS_V1 ===\n'+JSON.stringify({version:1,answers:[{id:data.modelIds.N02,detail:'La peur du conflit'}]})+'\n=== FIN_REPONSES_ENTRE_NOUS_V1 ===';
 const result=win.__enApprovedLifeTools.createApprovedImport(model,raw,'',win.__enLifeTools.parsePortrait,'',[]);assert.equal(result.proposals[data.modelIds.N02].detail,'La peur du conflit');assert.equal(result.proposals[data.modelIds.N02].verified,false);
});
test('les nouveaux fichiers sont chargés avant le contrôleur et inclus dans le cache et la construction',()=>{
 const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),build=fs.readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8'),sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');
 assert.ok(html.indexOf('src="ma-vie-pages.js"')<html.indexOf('src="ma-vie-validee.js"'));
 for(const filename of ['ma-vie-pages.js','ma-vie-pages.css']){assert.ok(build.includes(filename));assert.ok(sw.includes(filename));assert.ok(html.includes(filename));}
});
