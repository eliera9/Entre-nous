let doc;
class E{
 constructor(tag='div',attrs={}){this.tag=tag;this.attrs={};this.dataset={};this.children=[];this.events={};this.style={setProperty:(k,v)=>this.style[k]=v};this._text='';this.value='';this.hidden=false;this.disabled=false;this.inert=false;for(const [k,v]of Object.entries(attrs))this.setAttribute(k,v);if(tag==='template')this.content=new E('#fragment')}
 set id(v){this.attrs.id=v}get id(){return this.attrs.id||''}set className(v){this.attrs.class=String(v)}get className(){return this.attrs.class||''}
 get classList(){const self=this;return{add(...names){self.className=[...new Set([...self.className.split(' ').filter(Boolean),...names])].join(' ')},remove(...names){self.className=self.className.split(' ').filter(n=>!names.includes(n)).join(' ')},contains(name){return self.className.split(' ').includes(name)},toggle(name,value){const use=value??!this.contains(name);if(use)this.add(name);else this.remove(name);return use}}}
 set textContent(v){this._text=String(v);this.children=[]}get textContent(){return this._text+this.children.map(n=>n.textContent).join('')}
 setAttribute(k,v){this.attrs[k]=String(v);if(k==='hidden')this.hidden=true;if(k==='disabled')this.disabled=true;if(k==='open')this.open=true;if(k==='value')this.value=String(v);if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=String(v)}
 getAttribute(k){return this.attrs[k]??null}removeAttribute(k){delete this.attrs[k];if(k==='hidden')this.hidden=false}
 append(...nodes){for(const n of nodes){if(typeof n==='string'){this._text+=n;continue}if(n.tag==='#fragment'){this.append(...[...n.children]);continue}n.remove();n.parent=this;this.children.push(n)}}
 prepend(...nodes){this.children=[...nodes,...this.children];nodes.forEach(n=>n.parent=this)}replaceChildren(...nodes){this.children=[];this._text='';this.append(...nodes)}
 remove(){if(this.parent){this.parent.children=this.parent.children.filter(n=>n!==this);this.parent=null}}
 replaceWith(n){const p=this.parent;if(!p)return;const index=p.children.indexOf(this);n.remove();p.children[index]=n;n.parent=p;this.parent=null}
 get firstElementChild(){return this.children[0]||null}get lastElementChild(){return this.children.at(-1)||null}
 cloneNode(deep){const n=new E(this.tag,{...this.attrs});n.dataset={...this.dataset};n.hidden=this.hidden;n.value=this.value;n._text=this._text;n.open=this.open;if(deep){if(this.content)n.content=this.content.cloneNode(true);else this.children.forEach(c=>n.append(c.cloneNode(true)))}return n}
 matches(s){for(const part of s.match(/\[[^\]]+\]|[#.][\w-]+|^[\w-]+/g)||[]){if(part[0]==='.'){if(!this.classList.contains(part.slice(1)))return false}else if(part[0]==='#'){if(this.id!==part.slice(1))return false}else if(part[0]==='['){const m=part.match(/^\[([^=]+)(?:=["']?([^"'\]]*)["']?)?\]$/),key=m[1],value=key.startsWith('data-')?this.dataset[key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]:this.attrs[key];if(value===undefined||(m[2]!==undefined&&String(value)!==m[2]))return false}else if(this.tag!==part)return false}return true}
 querySelectorAll(selector){const out=[],selectors=selector.split(',').map(s=>s.trim().match(/(?:\[[^\]]*\]|[^\s\[])+/g));const walk=node=>{for(const c of node.children){if(selectors.some(parts=>{if(!c.matches(parts.at(-1)))return false;let p=c.parent;for(let i=parts.length-2;i>=0;i--){while(p&&!p.matches(parts[i]))p=p.parent;if(!p)return false;p=p.parent}return true}))out.push(c);if(!c.content)walk(c)}};walk(this);return out}querySelector(s){return this.querySelectorAll(s)[0]||null}
 contains(n){return this===n||this.children.some(c=>c.contains(n))}addEventListener(t,f){(this.events[t]??=[]).push(f)}
 fire(type,values={}){const e={target:this,preventDefault(){this.defaultPrevented=true},stopPropagation(){this.stopped=true},stopImmediatePropagation(){this.stopped=true;this.immediate=true},...values};let n=this;while(n){for(const fn of n.events[type]||[]){fn(e);if(e.immediate)break}if(e.stopped)break;n=n.parent}return e}click(){this.fire('click')}focus(){doc.activeElement=this}scrollIntoView(){}getClientRects(){for(let n=this;n;n=n.parent)if(n.hidden)return[];return[{}]}
}
function fromTree(t){const n=new E(t.tag,t.attrs);n._text=t.text||'';const target=n.content||n;(t.children||[]).forEach(c=>target.append(fromTree(c)));return n}

const decode=text=>text.replace(/&(?:amp|lt|gt|quot|#39);/g,x=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"}[x]));
function parseHTML(source){
 const root=new E('#fragment'),stack=[root];
 for(const token of source.match(/<[^>]+>|[^<]+/g)||[]){
  if(token.startsWith('</')){stack.pop();continue}
  if(token.startsWith('<')){const tag=token.match(/^<([\w-]+)/)?.[1];if(!tag)continue;const attrs={};for(const match of token.slice(tag.length+1,-1).matchAll(/([^\s=]+)(?:="([^"]*)")?/g))attrs[match[1]]=decode(match[2]||'');const node=new E(tag,attrs);stack.at(-1).append(node);if(!['input','img','br','hr','link','meta'].includes(tag))stack.push(node.content||node);
  }else stack.at(-1)._text+=decode(token);
 }
 return root.firstElementChild;
}
function documentFor(root){doc={activeElement:null,createElement:tag=>new E(tag),createElementNS:(_,tag)=>new E(tag),getElementById:id=>root.id===id?root:root.querySelector('#'+id)};return doc;}
module.exports={E,parseHTML,documentFor};
