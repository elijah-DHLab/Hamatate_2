/* V2.5: source-grounded many-to-many vocabulary, readable relations and safe reading surface.
   Existing edition data, original notes and all earlier views remain unchanged. */
'use strict';
const K25={scope:'shared',filter:'',page:0,pageSize:20,focus:null,zoom:1};
const k25Esc=x=>esc(String(x??''));
function k25Catalog(){
 const categories=new Map(K24.data.categories.map(c=>[c.id,c]));
 const items=K24.data.terms.filter(t=>t.kind==='explicit-note-subject').map(t=>{
  const links=t.categoryIds.map(id=>categories.get(id)).filter(Boolean);
  const observations=K24.data.observations.filter(o=>o.termId===t.id);
  return {...t,links,observations,count:new Set(observations.map(o=>o.noteId)).size};
 });
 // Lexical-query vocabularies belong to a different evidentiary class. We never
 // equate a query word and an annotated concept by spelling alone.
 return {categories,items};
}
function k25Filtered(){
 const {items}=k25Catalog(),q=K25.filter.trim().normalize('NFC');
 return items.filter(t=>(K25.scope==='shared'?t.links.length>1:K25.scope==='selected'?t.links.some(c=>V2.selected.has('knowledge:'+c.id.split(':')[1])||V2.selected.has('knowledge:'+c.id.split(':')[1]+'|'+t.id)):true)&&(!q||(t.label+' '+t.links.map(c=>c.label).join(' ')).includes(q)))
 .sort((a,b)=>b.links.length-a.links.length||b.count-a.count||a.label.localeCompare(b.label,'he'));
}
function k25IsTermChosen(t){
 return t.links.some(c=>{let id='knowledge:'+c.id.split(':')[1],cid=id+'|'+t.id;return V2.selected.has(id)&&!K24.excluded.has(cid)||V2.selected.has(cid);});
}
function k25RelationSurface(){
 const list=k25Filtered(),pages=Math.max(1,Math.ceil(list.length/K25.pageSize));K25.page=Math.min(K25.page,pages-1);
 const page=list.slice(K25.page*K25.pageSize,(K25.page+1)*K25.pageSize);
 const cats=K24.data.categories.filter(c=>page.some(t=>t.categoryIds.includes(c.id)));
 const rowH=54,top=53,h=Math.max(300,top+page.length*rowH+28),w=1080;
 const cy=new Map(cats.map((c,i)=>[c.id,top+(i+.5)*Math.max(rowH,Math.min(760,page.length*rowH))/Math.max(1,cats.length)]));
 let edges='',right='',left='';
 page.forEach((t,i)=>{
  const y=top+i*rowH,chosen=k25IsTermChosen(t);
  const label=t.label.length>32?t.label.slice(0,31)+'…':t.label;
  left+=`<g class="k25-term-node ${chosen?'chosen':''}" role="button" tabindex="0" data-k25-term="${k25Esc(t.id)}"><rect x="746" y="${y-20}" rx="8" width="290" height="41"/><text x="1012" y="${y+6}" text-anchor="end">${k25Esc(label)}</text><title>${k25Esc(t.label)} · ${t.links.length} סיווגים מפורשים · ${t.count} הערות</title></g>`;
  for(const c of t.links){
   const y2=cy.get(c.id);if(y2===undefined)continue;
   edges+=`<path class="k25-membership-edge" d="M746 ${y} C650 ${y} 475 ${y2} 370 ${y2}" stroke="${c.color}" stroke-width="${chosen?2.9:1.7}" opacity="${chosen?.84:.38}" fill="none"><title>${k25Esc(t.label)} ← ${k25Esc(c.label)} · שיוך מפורש בהערה</title></path>`;
  }
 });
 cats.forEach(c=>{
  const id='knowledge:'+c.id.split(':')[1];
  right+=`<g class="k25-category-node ${V2.selected.has(id)?'chosen':''}" data-k25-category="${k25Esc(id)}" tabindex="0" role="button" style="--k-color:${c.color}"><rect x="30" y="${cy.get(c.id)-20}" width="340" height="40" rx="7"/><rect x="358" y="${cy.get(c.id)-20}" width="12" height="40" rx="2" fill="${c.color}"/><text x="346" y="${cy.get(c.id)+6}" text-anchor="end">${k25Esc(c.label)}</text><title>${k25Esc(c.sourceLabel)} · בחירה מצטברת</title></g>`;
 });
 const q=K25.filter;
 const focus=K25.focus&&K24.data.terms.find(t=>t.id===K25.focus);
 return `<section class="k25-relations" aria-label="מפת מונחים ורשתות">
  <div class="k25-head"><span class="k25-overline">אטלס מושגים / תיעוד ההערות</span><h2>אותו מונח. כמה גופי ידע.</h2><p>הקווים מחברים <b>מונח מפורש בהערה</b> לסיווגים שהמהדירים הצמידו לו. בניגוד לעץ רגיל, המונח אינו משוכפל כאשר יש לו כמה שיוכים.</p></div>
  <div class="k25-toolbar"><div class="k25-switches" role="group" aria-label="סינון סוגי מונחים">${[['shared','מונחים רב־רשתיים'],['all','כל המונחים'],['selected','ברשתות שנבחרו']].map(([v,l])=>`<button data-k25-scope="${v}" aria-pressed="${K25.scope===v}" class="${K25.scope===v?'active':''}">${l}</button>`).join('')}</div><label class="k25-search-label">חיפוש מונח או רשת <input data-k25-search placeholder="שם המונח…" value="${k25Esc(q)}" dir="rtl"/></label></div>
  <div class="k25-scope-info"><b>${list.length}</b> מונחים בתחום הנבחר · <b>${k25Catalog().items.filter(t=>t.links.length>1).length}</b> מונחים עם שיוך מפורש לכמה סיווגים · ${cats.length} סיווגים המופיעים בעמוד</div>
  <div class="k26-relations-zoom" role="group" aria-label="הגדלה של מפת המונחים"><b>גודל תרשים</b><button data-k25-zoom="out" aria-label="הקטנה">−</button><output aria-live="polite">${Math.round(K25.zoom*100)}%</output><button data-k25-zoom="in" aria-label="הגדלה">+</button><button data-k25-zoom="reset">התאמה למסך</button><span>ניתן גם לגלול בתוך המפה</span></div><div class="k25-diagram-scroll"><svg class="k25-diagram" style="--k26-relation-zoom:${K25.zoom}" viewBox="0 0 ${w} ${h}" role="img" aria-label="מפת קשרים רב־ערכית בין מונחים ובין סיווגי ההערות" xmlns="http://www.w3.org/2000/svg"><text x="345" y="28" text-anchor="end" class="k25-axis-label">סיווגים מהערות · נושא / סוג אזכור</text><text x="1020" y="28" text-anchor="end" class="k25-axis-label">מונחים מפורשים</text>${edges}${right}${left}</svg></div>
  <div class="k25-pages"><span>עמוד ${K25.page+1} מתוך ${pages} · ${page.length} מונחים</span><button data-k25-page="prev" ${K25.page===0?'disabled':''}>הקודם</button><button data-k25-page="next" ${K25.page===pages-1?'disabled':''}>הבא</button></div>
  ${focus?`<div class="k25-focus" id="k25Focus"><b>המונח שנבחר: ${k25Esc(focus.label)}</b><span>${focus.categoryIds.map(id=>K24.data.categories.find(c=>c.id===id)?.label).filter(Boolean).map(k25Esc).join(' · ')}</span><button data-k25-evidence="${k25Esc(focus.id)}">הופעות, הערות ומעבר לטקסט ↗</button></div>`:''}
  <div class="k25-evidence-note"><b>שתי שיטות שונות:</b> תרשים זה מציג סיווגים <em>מפורשים בהערות המקור</em>; רשתות החיפוש המילולי נשארות בחלונית הבחירה, ואינן מאושרות כתיוגים באמצעות דמיון במילה. מילות הקשר ליד הפניה אינן מונחים מאומתים.</div>
 </section>`;
}
function k25RenderRelation(){
 const target=document.getElementById('k24Visual');if(!target)return;
 target.innerHTML=k25RelationSurface();
 document.getElementById('k24Caption').innerHTML='<b>רשת ← מונח ← הפניה ממוקמת.</b> לחצו על רשת או מונח כדי להוסיף אותם לבחירה. כל מונח מוצג פעם אחת, גם אם הוא שייך לכמה רשתות. אפשר לפתוח את ההופעות המדויקות בטקסט.';
}
const K25_OLD_DRAW=k24Draw;
k24Draw=function(){if(K24.view==='relations'){k25RenderRelation();k24InitControls();}else K25_OLD_DRAW();};
const K25_OLD_TOOLBAR=k24Toolbar;
k24Toolbar=function(){return K25_OLD_TOOLBAR().replace('data-k24-view="overlap"', 'data-k24-view="overlap"').replace('</button></div>\n <label><input type="checkbox" data-k24-switch="words"','</button><button data-k24-view="relations" aria-pressed="'+(K24.view==='relations')+'" class="'+(K24.view==='relations'?'on':'')+'">מונחים ↔ רשתות</button></div>\n <label><input type="checkbox" data-k24-switch="words"');};
function k25ChooseTerm(tid,openEvidence=false){
 const term=K24.data.terms.find(t=>t.id===tid);if(!term)return;
 const keys=term.categoryIds.map(id=>'knowledge:'+id.split(':')[1]+'|'+tid).filter(id=>K24.children.has(id));
 const already=keys.every(k=>{const p=K24.children.get(k).parent;return V2.selected.has(p)?!K24.excluded.has(k):V2.selected.has(k)});
 for(const id of keys){const p=K24.children.get(id).parent;
  if(already&&!openEvidence){if(V2.selected.has(p))K24.excluded.add(id);else V2.selected.delete(id);}
  else{if(V2.selected.has(p))K24.excluded.delete(id);else V2.selected.add(id);}
 }
 K25.focus=tid;K24.focus=null;K24.cursor=-1;K24.evidencePage=0;k24Reindex();k24Save();
 if(STATE.view==='read')renderRead();else renderDistant();
 if(openEvidence){const selected=K24.data.observations.filter(o=>o.termId===tid);
  const h=selected.map(o=>K24.observations.get(o.id)).find(Boolean);
  if(h)k24OpenHit(h.id);
 }
}
function k25RelChips(p){
 const hs=K24.byP.get(p.n)||[],tidMap=new Map();
 for(const h of hs){if(h.basis!=='explicit-editorial-note'||h.termKind!=='explicit-note-subject')continue;
  const t=K24.data.terms.find(t=>t.id===h.annotation?.termId);if(t)tidMap.set(t.id,t);
 }
 if(!tidMap.size)return '';
 return `<div class="k25-text-terms" aria-label="מונחים מתוך ההערות לצד הפסקה"><small>מונחים בהערות</small>${[...tidMap.values()].slice(0,10).map(t=>`<button data-k25-term="${k25Esc(t.id)}" title="${k25Esc(t.label)} · ${t.categoryIds.length} סיווגים מפורשים" class="${t.categoryIds.length>1?'multi':''}">${k25Esc(t.label)} <sup>${t.categoryIds.length>1?t.categoryIds.length+' רשתות':'↗'}</sup></button>`).join('')}</div>`;
}
function k25FixDoubleEscapedEntities(container){
 // Repairs display-only double-escaped HTML entity artifacts; the source text is immutable.
 if(!container||!document.createTreeWalker)return 0;
 const walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT),fix=[];
 while(walker.nextNode()){
  const node=walker.currentNode;if(!node.nodeValue||!/&(?:amp;)?(?:#(?:0*39|x0*27|0*34|x0*22);|apos;|quot;)/i.test(node.nodeValue))continue;
  if(node.parentElement?.closest('.raw-code,code,pre,.markup'))continue;
  fix.push(node);
 }
 for(const node of fix)node.nodeValue=node.nodeValue.replace(/&(?:amp;)?(?:#(?:0*39|x0*27);|apos;)/gi,"'").replace(/&(?:amp;)?(?:#(?:0*34|x0*22);|quot;)/gi,'"');
 return fix.length;
}
/** Correct entity sequences cut across successive Word-run DOM nodes.
 * For instance "גב&" + "#" + "39;" is one apostrophe that must be shown
 * as a real character. Operate only on rendered paragraph spans, never data.
 */
function k25FixSplitEntities(root){
 if(!root)return 0;
 let total=0;
 for(const para of root.querySelectorAll('[id^="p-"]')){
  const walker=document.createTreeWalker(para,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  let text='',map=[];
  for(const n of nodes){const str=n.nodeValue||'';
   for(let i=0;i<str.length;i++){text+=str[i];map.push({node:n,offset:i});}
  }
  const matches=[...text.matchAll(/&(?:amp;)?(?:#(?:0*39|x0*27|0*34|x0*22);|apos;|quot;)/gi)];
  for(const m of matches.reverse()){
   const a=map[m.index],b=map[m.index+m[0].length-1];if(!a||!b)continue;
   const r=document.createRange();r.setStart(a.node,a.offset);r.setEnd(b.node,b.offset+1);
   r.deleteContents();r.insertNode(document.createTextNode(/39|27|apos/i.test(m[0])?"'":'"'));
   total++;
  }
 }
 return total;
}
const K25_OLD_READ=renderRead;
renderRead=function(){
 K25_OLD_READ();if(!K24.ready)return;
 const content=document.getElementById('content');
 const toolbar=content.querySelector('.k24-read-tools');
 toolbar?.insertAdjacentHTML('beforeend','<button class="k25-relation-shortcut" data-k25-open="relations" aria-label="מפת מונחים ורשתות">מפת המונחים ↗</button>');
 for(const [pn] of K24.byP){
  const para=document.getElementById('p-'+pn);if(para&&!para.classList.contains('raw-code')){
   const source=D.paragraphs.find(p=>p.n===pn);if(!source)continue;
   const html=k25RelChips(source);if(html)para.querySelector('.k24-paragraph-tags')?.insertAdjacentHTML('afterend',html);
  }
 }
 k25FixDoubleEscapedEntities(content.querySelector('.reading-layout')||content);
 k25FixSplitEntities(content.querySelector('.reading-layout')||content);
};
const K25_OLD_GRAPH_NODE=k24NodeElement;
k24NodeElement=function(n){return K25_OLD_GRAPH_NODE(n);};
// Contextual labels remain readable at any zoom. Membership browsing is a
// dedicated diagram instead of duplicating small labels along every edge.
// In the reading view and footnote dialog, labels are always real DOM text.
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-k25-term],[data-k25-category],[data-k25-scope],[data-k25-page],[data-k25-open],[data-k25-evidence],[data-k25-zoom]');
 if(!t)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(t.dataset.k25Zoom){K25.zoom=t.dataset.k25Zoom==="reset"?1:Math.min(2.6,Math.max(.75,Math.round(K25.zoom*(t.dataset.k25Zoom==="in"?1.25:.8)*100)/100));document.querySelector(".k25-diagram")?.style.setProperty("--k26-relation-zoom",K25.zoom);const out=document.querySelector(".k26-relations-zoom output");if(out)out.textContent=Math.round(K25.zoom*100)+"%";return;}
 if(t.dataset.k25Open){K24.view='relations';v21OpenView('distant');return;}
 if(t.dataset.k25Scope){K25.scope=t.dataset.k25Scope;K25.page=0;renderDistant();return;}
 if(t.dataset.k25Page){K25.page=Math.max(0,K25.page+(t.dataset.k25Page==='next'?1:-1));renderDistant();return;}
 if(t.dataset.k25Category){k24ToggleRoot(t.dataset.k25Category);return;}
 if(t.dataset.k25Term){k25ChooseTerm(t.dataset.k25Term);return;}
 if(t.dataset.k25Evidence){k25ChooseTerm(t.dataset.k25Evidence,true);return;}
},true);
document.addEventListener('input',e=>{
 if(!e.target.matches('[data-k25-search]'))return;
 K25.filter=e.target.value;K25.page=0;
 const position=e.target.selectionStart;k25RenderRelation();
 const fresh=document.querySelector('[data-k25-search]');fresh?.focus();fresh?.setSelectionRange(position,position);
},true);
const K25_OLD_NOTE_SIDE=v22NoteDetail;
v22NoteDetail=function(id){K25_OLD_NOTE_SIDE(id);k25FixDoubleEscapedEntities(document.querySelector('.v22-open-note'));};
const K25_OLD_NOTE_POPUP=openNote;
openNote=function(id){K25_OLD_NOTE_POPUP(id);k25FixDoubleEscapedEntities(document.querySelector('#detailBody'));};
// Footnote margin preview: keep the prose, replace full URLs with brief link
// markers that are real anchors. These are not topic/concept network marks.
function k25MarginLinks(){
 const list=document.getElementById('v22NoteList');if(!list)return;
 list.querySelectorAll('.k25-note-links').forEach(el=>el.remove());
 for(const button of list.querySelectorAll('button[data-v22-note]')){
  const f=D.footnotes[String(button.dataset.v22Note)];if(!f)continue;
  const span=button.querySelector('span');
  if(span){const shortNote=String(f.text).replace(/https?:\/\/[^\s<>"\u200e\u200f]+/gi,'↗ מקור חיצוני');span.textContent=shortNote.slice(0,270)+(shortNote.length>270?'…':'');}
  const urls=[...String(f.text).matchAll(/https?:\/\/[^\s<>"\u200e\u200f]+/gi)].map(m=>m[0].replace(/[),.;:!?\]\}]+$/g,'').replace(/&amp;/gi,'&'));
  const links=[...new Set(urls)].filter(url=>{try{return /^https?:$/.test(new URL(url).protocol);}catch{return false;}});
  if(!links.length)continue;
  const wrapper=document.createElement('span');wrapper.className='k25-note-links';
  for(const [i,url] of links.entries()){
   const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.className='source-link-short';
   a.title=url;a.textContent='↗ מקור '+(i+1);wrapper.append(a);
  }
  button.insertAdjacentElement('afterend',wrapper);
 }
}
const K25_OLD_UPDATE_NOTES=v22UpdateNotes;
v22UpdateNotes=function(tid){K25_OLD_UPDATE_NOTES(tid);k25MarginLinks();};
