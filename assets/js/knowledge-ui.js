/* V2.4: graph-first distant reading; compact, synchronized reading overlays.
 * Immutable source data + explicit note categories + separate lexical queries.
 * UI consumes HamatateKnowledge's normalized contract, not XML/Excel internals.
 */
"use strict";
const K24={
 ready:false,error:null,data:null,roots:new Map(),children:new Map(),observations:new Map(),byP:new Map(),
 expanded:new Set(),excluded:new Set(),showNetworks:true,showWriting:false,showSpeakers:true,readSelectionOpen:false,disclosures:new Map(),
 view:"graph",words:false,metric:"coverage",scope:"paragraph",wordLimit:6,
 focus:null,evidencePage:0,cursor:-1,positions:new Map(),transform:{x:0,y:0,k:1},timer:null,
 writing:new Set(["hand","dram_del","text_del","within_deleted","stage","heading","editorial","music"]),
 viewFilter:"",initialized:false
};
const k24Esc=x=>esc(String(x??""));
const k24RootId=slug=>"knowledge:"+slug;
const k24CP=(s,i)=>Array.from(s).slice(0,i).join("").length;
const k24Compare=(a,b)=>(a.t||"").localeCompare(b.t||"")||(a.p-b.p)||((a.a||0)-(b.a||0));
function k24NormMap(text){
 let s="",map=[],cu=0;
 for(const ch of text){
  const norm=ch.normalize("NFD").replace(/[\u0591-\u05bd\u05bf-\u05c2\u05c4-\u05c5\u05c7\u200e\u200f\u202a-\u202c\u2066-\u2069]/g,"").replace(/־/g,"-");
  for(const c of norm){s+=c;map.push(cu);}
  cu+=ch.length;
 }
 return {text:s,map};
}
function k24LiteralHits(root){
 const hits=[], rxEscape=x=>x.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
 for(const p of D.paragraphs){
  if(!D.text_records[p.t])continue;
  const nm=k24NormMap(p.text);
  for(const term of root.terms||[]){
   const norm=k24NormMap(term).text;if(!norm)continue;
   const rx=new RegExp("(?<![\\p{L}\\p{N}])"+rxEscape(norm)+"(?![\\p{L}\\p{N}])","gu");
   for(const m of nm.text.matchAll(rx)){
    const a=nm.map[m.index],b=nm.map[m.index+m[0].length-1]+1;
    if(a===undefined||b===undefined)continue;
    const id=root.id+":p"+p.n+":"+a+":"+term;
    hits.push({id,evidenceKey:"literal:"+p.id+":"+a+":"+b,t:p.t,p:p.n,paragraphId:p.id,a,b,
      term,termKey:"term:"+root.id.slice(8)+":"+term,surface:p.text.slice(a,b),
      excerpt:p.text.slice(Math.max(0,a-50),Math.min(p.text.length,b+65)),
      basis:"literal-query",root:root.id});
   }
  }
 }
 return hits;
}
function k24InjectRegistry(){
 const registry=v2Data();if(!registry.groups.knowledge)registry.groups.knowledge=[];
 if(!v2Kinds.some(x=>x[0]==="knowledge"))v2Kinds.unshift(["knowledge","גופי ידע מהערות"]);
 const colors=K24.data.categories;
 for(const c of colors){
  const slug=c.id.split(":")[1],id=k24RootId(slug),raw=K24.data.observations.filter(o=>o.categoryId===c.id);
  const terms=Object.fromEntries(K24.data.terms.map(t=>[t.id,t]));
  const hits=raw.map(o=>{
   const p=D.paragraphs.find(p=>p.id===o.anchor.paragraphId);if(!p)return null;
   const q=o.anchor.range;
   return {id:o.id,evidenceKey:"note:"+o.noteId+":"+p.id+":"+o.anchor.offset,
    root:id,noteId:o.noteId,fn_id:o.noteId,t:p.t,p:p.n,paragraphId:p.id,
    a:q?k24CP(p.text,q.start):null,b:q?k24CP(p.text,q.end):null,
    offset:k24CP(p.text,o.anchor.offset),term:terms[o.termId].label,
    termKey:id+"|"+o.termId,termKind:terms[o.termId].kind,
    excerpt:p.text.slice(Math.max(0,k24CP(p.text,o.anchor.offset)-80),k24CP(p.text,o.anchor.offset)+45),
    basis:"explicit-editorial-note",source:o.source,assignment:o.assignment,annotation:o};
  }).filter(Boolean);
  const r={id,title:c.label,sourceLabel:c.sourceLabel,color:c.color,hits,
   basis:"סימון מפורש בהערת המהדירים; ההפניה המדויקת נשמרת",kind:"knowledge",group:"knowledge",terms:[]};
  for(const tid of c.termIds){
   const term=terms[tid],key=id+"|"+tid;
   const child={id:key,title:term.label,parent:id,color:c.color,hits:hits.filter(h=>h.termKey===key),basis:r.basis,kind:term.kind,group:"knowledge"};
   r.terms.push({id:key,label:term.label,kind:term.kind,hits:child.hits});
   K24.children.set(key,child);registry.all[key]=child;
   if(!registry.groups.knowledge.includes(key))registry.groups.knowledge.push(key);
  }
  K24.roots.set(id,r);registry.all[id]=r;if(!registry.groups.knowledge.includes(id))registry.groups.knowledge.push(id);
 }
 // Existing research vocabularies remain queries; do not relabel them as editor annotations.
 for(const r0 of Object.values(registry.all).filter(x=>x.group==="networks"&&!x.parent)){
  const r={...r0,kind:"query"};r.hits=k24LiteralHits(r);
  r.terms=(r0.terms||[]).map(term=>{
   const id="term:"+r.id.slice(8)+":"+term;
   const child={...registry.all[id],id,parent:r.id,title:term,color:r.color,
     hits:r.hits.filter(x=>x.term===term),kind:"literal-term",group:"networks"};
   K24.children.set(id,child);registry.all[id]=child;
   return {id,label:term,kind:"literal-term",hits:child.hits};
  });
  K24.roots.set(r.id,r);registry.all[r.id]={...r,terms:(r0.terms||[])};
 }
 // Do not alter cached source footnotes/categories. Register added knowledge in a new namespace.
}
function k24LayerHits(root){
 if(V2.selected.has(root.id))return root.hits.filter(h=>!K24.excluded.has(h.termKey));
 const picked=root.terms.filter(t=>V2.selected.has(t.id)).flatMap(t=>t.hits);
 return [...new Map(picked.map(h=>[h.id,h])).values()];
}
function k24Active(){
 const out=[];
 for(const r of K24.roots.values()){
  const hs=k24LayerHits(r);
  if(V2.selected.has(r.id)||r.terms.some(t=>V2.selected.has(t.id)))out.push({...r,hits:hs});
 }
 // V2's independent actors, writing marks and script layers stay available.
 for(const id of V2.selected){
  if(K24.roots.has(id)||K24.children.has(id))continue;
  const d=v2Data().all[id];if(!d)continue;
  const hs=d.hits.map((h,i)=>({...h,id:id+":"+i,root:id,paragraphId:h.paragraphId||D.paragraphs.find(p=>p.n===h.p)?.id,
   evidenceKey:h.fn_id?"note:"+h.fn_id+":"+h.p:id+":"+i,
   noteId:h.fn_id||null,basis:d.basis,term:h.term||h.surface||d.title}));
  out.push({...d,kind:"other",terms:[],hits:hs});
 }
 return out;
}
function k24RootState(r){
 const selected=V2.selected.has(r.id),children=r.terms.filter(t=>V2.selected.has(t.id));
 const excluded=r.terms.filter(t=>K24.excluded.has(t.id));
 return {checked:selected&&!excluded.length,mixed:(selected&&excluded.length>0)||(!selected&&children.length>0)};
}
function k24ToggleRoot(id){
 const r=K24.roots.get(id);
 if(!r)return;
 const st=k24RootState(r);
 if(st.checked||st.mixed){
  V2.selected.delete(id);for(const t of r.terms){V2.selected.delete(t.id);K24.excluded.delete(t.id);}
 }else{V2.selected.add(id);for(const t of r.terms)K24.excluded.delete(t.id);}
 k24Changed();
}
function k24ToggleTerm(id){
 const c=K24.children.get(id);if(!c)return;
 if(V2.selected.has(c.parent)){
  if(K24.excluded.has(id))K24.excluded.delete(id);else K24.excluded.add(id);
 }else{
  if(V2.selected.has(id))V2.selected.delete(id);else V2.selected.add(id);
 }
 k24Changed();
}
function k24TermChecked(t,parent){
 return V2.selected.has(parent)?!K24.excluded.has(t.id):V2.selected.has(t.id);
}
function k24Reindex(){
 K24.byP=new Map();K24.observations=new Map();
 for(const r of k24Active())for(const h of r.hits){
  const hit={...h,color:r.color,root:r.id,rootTitle:r.title,rootKind:r.kind};
  K24.observations.set(hit.id,hit);
  if(!K24.byP.has(hit.p))K24.byP.set(hit.p,[]);
  K24.byP.get(hit.p).push(hit);
 }
}
function k24Save(){try{localStorage.setItem("hamatate-knowledge-v24",JSON.stringify({selected:[...V2.selected],excluded:[...K24.excluded]}));}catch{}}
function k24Changed(){
 K24.focus=null;K24.evidencePage=0;K24.cursor=-1;k24Reindex();k24Save();
 const y=scrollY;
 if(STATE.view==="read")renderRead();else if(STATE.view==="distant")renderDistant();else render();
 requestAnimationFrame(()=>window.scrollTo({top:y,behavior:"instant"}));
}
function k24PaletteRow(r,compact=false){
 const st=k24RootState(r),open=K24.expanded.has(r.id);
 const count=new Set(r.hits.map(h=>h.evidenceKey)).size;
 return `<div class="k24-root ${st.checked||st.mixed?"selected":""}" style="--k-color:${r.color}">
 <div class="k24-root-line"><label><input type="checkbox" data-k24-root="${k24Esc(r.id)}" ${st.checked?"checked":""} ${st.mixed?'data-k24-mixed="true"':""}><span>${k24Esc(r.title)}</span></label><small title="מספר ראיות בשכבה">${count}</small>
 <button class="k24-chevron" data-k24-expand="${k24Esc(r.id)}" aria-expanded="${open}" aria-label="מילים והפניות: ${k24Esc(r.title)}">${open?"▾":"▸"}</button></div>
 ${open?`<div class="k24-words" role="group" aria-label="מילים והפניות ברשת"><small>${r.kind==="query"?"מילים בחיפוש המילולי":"כינויים מפורשים בהערה או מילים הסמוכות להפניה. הקשר אינו טווח תיוג מאומת."}</small>${r.terms.slice().sort((a,b)=>b.hits.length-a.hits.length).map(t=>`<div class="k24-word-row"><label><input type="checkbox" data-k24-term="${k24Esc(t.id)}" ${k24TermChecked(t,r.id)?"checked":""}><span title="${k24Esc(t.label)}">${k24Esc(t.label)}</span></label><button data-k24-term-evidence="${k24Esc(t.id)}" title="הצגת המופעים וקפיצה לטקסט">${t.hits.length} ↗</button></div>`).join("")}</div>`:""}</div>`;
}
function k24Palette(compact=false){
 const source=[...K24.roots.values()].filter(r=>r.kind==="knowledge").sort((a,b)=>{
  const preferred=["knowledge:tradition","knowledge:consumption","knowledge:mass-media"];
  const ai=preferred.indexOf(a.id),bi=preferred.indexOf(b.id);
  return (ai<0?99:ai)-(bi<0?99:bi)||a.title.localeCompare(b.title,"he");
 });
 const query=[...K24.roots.values()].filter(r=>r.kind==="query");
 const top=source.slice(0,3),rest=source.slice(3);
 return `<div class="k24-palette ${compact?"compact":""}"><div class="k24-palette-title"><b>בחרו רשתות — גם וגם</b><div><button data-k24-command="all" title="כל גופי הידע וכל רשתות החיפוש">הכול</button><button data-k24-command="clear">ניקוי</button></div></div>
 <div class="k24-kind">גופי ידע מסומנים בהערות <span>מן המקור</span></div>
 <div class="k24-roots">${(compact?top:source).map(r=>k24PaletteRow(r,compact)).join("")}</div>
 ${compact?`<details class="k24-more" data-k24-disclosure="${STATE.view}:categories" ${K24.disclosures.get(STATE.view+":categories")?"open":""}><summary>עוד סיווגים מן ההערות · ${rest.length}</summary>${rest.map(r=>k24PaletteRow(r,true)).join("")}</details>`:""}
 <details class="k24-more" data-k24-disclosure="${STATE.view}:queries" ${(K24.disclosures.get(STATE.view+":queries")??!compact)?"open":""}><summary>רשתות חיפוש מילולי · ${query.length}</summary><p>עדשות חיפוש, לא תיוגי שיח מאושרים.</p>${query.map(r=>k24PaletteRow(r,compact)).join("")}</details>
 <details class="k24-more" data-k24-disclosure="${STATE.view}:extras" ${K24.disclosures.get(STATE.view+":extras")?"open":""}><summary>שחקנים, כתיבה וסוגי כתב</summary><div class="k24-extra">${Object.values(v2Data().all).filter(x=>["people","edits","scripts"].includes(x.group)&&!x.parent).map(x=>`<label><input type="checkbox" data-k24-extra="${k24Esc(x.id)}" ${V2.selected.has(x.id)?"checked":""}>${k24Esc(x.title)}</label>`).join("")}</div></details></div>`;
}
function k24InitControls(){
 document.querySelectorAll("[data-k24-mixed]").forEach(x=>x.indeterminate=true);
}
function k24ReadEntry(){
 const active=k24Active();
 return `<section class="k24-read-entry" aria-label="שכבות על הטקסט"><div class="k24-read-tools"><div class="k24-inline-switches">
 <label><input type="checkbox" data-k24-switch="showNetworks" ${K24.showNetworks?"checked":""}>רשתות התוכן</label>
 <label><input type="checkbox" data-k24-switch="showWriting" ${K24.showWriting?"checked":""}>שכבות הכתיבה</label>
 <label><input type="checkbox" data-k24-switch="showSpeakers" ${K24.showSpeakers?"checked":""}>דוברים</label></div>
 <button class="k24-primary" data-k24-command="distant">מפת הרשתות והזרימה ↗</button></div>
 <details class="k24-read-selection" ${K24.readSelectionOpen?"open":""}><summary>בחירת הרשתות והמילים <span>${active.length} שכבות פעילות</span></summary>${k24Palette(true)}</details>
 <div class="k24-selected-chips">${active.map(r=>`<button data-k24-focus="${k24Esc(r.id)}" style="--k-color:${r.color}" title="הצגת המילים, ההערות וההופעות">${k24Esc(r.title)} <small>${new Set(r.hits.map(h=>h.evidenceKey)).size}</small></button>`).join("")||'<span>אפשר לבחור כמה רשתות במקביל.</span>'}</div>
 <div id="k24ReadingLocator">${k24LocatorHTML()}</div>
 <details class="k24-small-help"><summary>מה מסומן כאן?</summary><p>גופי הידע מבוססים על „אזכור…” בהערות; רשתות החיפוש מבוססות על מילים. צבע על מילה מסמן התאמה מדויקת. כאשר ידוע רק מיקום ההערה, מסומנת ההפניה ולא טווח מילים משוער. המחיקות וההערות המקוריות נשארות עצמאיות.</p></details></section>`;
}
function k24EvidencePool(){
 let hits=[...K24.observations.values()];
 if(K24.focus?.kind==="root")hits=hits.filter(h=>h.root===K24.focus.id);
 if(K24.focus?.kind==="term"){
  const c=K24.children.get(K24.focus.id);if(c)hits=c.hits.map(h=>({...h,color:K24.roots.get(c.parent)?.color,rootTitle:K24.roots.get(c.parent)?.title}));
 }
 if(K24.focus?.kind==="unit")hits=hits.filter(h=>h.t===K24.focus.id);
 if(K24.focus?.kind==="pair"){
  const {a,b}=K24.focus, roots=k24Active(),aa=roots.find(r=>r.id===a),bb=roots.find(r=>r.id===b);
  const common=new Set(HamatateKnowledge.intersection(aa?.hits||[],bb?.hits||[],K24.scope));
  const key=h=>K24.scope==="note"?String(h.noteId):K24.scope==="unit"?h.t:h.paragraphId;
  hits=hits.filter(h=>(h.root===a||h.root===b)&&common.has(key(h)));
 }
 const visible=new Set(k24Seq().flatMap(t=>k24Sources(t)));
 if(V2.units.size)hits=hits.filter(h=>[...V2.units].some(t=>k24Sources(t).includes(h.t)));
 hits=hits.filter(h=>visible.has(h.t));
 return [...new Map(hits.map(h=>[h.evidenceKey||h.id,h])).values()].sort((a,b)=>{
  const seq=k24Seq();return seq.indexOf(v2DisplayT(a.t))-seq.indexOf(v2DisplayT(b.t))||a.p-b.p||(a.offset??a.a??0)-(b.offset??b.a??0);
 });
}
function k24LocatorHTML(){
 const pool=k24EvidencePool(),i=K24.cursor;
 return `<div class="k24-locator"><span>מופעים בטקסט <b>${pool.length}</b> ${i>=0?"· "+(i+1)+"/"+pool.length:""}</span>
 <button data-k24-step="-1" ${!pool.length?"disabled":""} aria-label="למופע הקודם">הקודם ↑</button><button data-k24-step="1" ${!pool.length?"disabled":""}>הבא ↓</button>
 ${K24.focus?'<button data-k24-command="unfocus">כל הבחירה</button>':""}<button data-k24-command="evidence">רשימת המקורות</button></div>`;
}
function k24SpeakerRanges(p){
 const out=[];if(!K24.showSpeakers)return out;
 for(const r of p.role_refs||[]){
  const after=p.text.slice(r.b),m=after.match(/^\s*([^<>:\n]{1,55}):/);
  if(m&&D.roles[r.id]){
   const a=r.b+m.index+m[0].indexOf(m[1]);out.push({a,b:a+m[1].length,role:r.id});
  }
 }
 return out;
}
function k24RoleColor(id){
 const n=parseInt((id.match(/R(\d+)$/)||[])[1]||"0",10);
 return ["#23648B","#7F4267","#507344","#996225","#68559C","#317E78"][n%6];
}
const K24_TOKEN_ORIGINAL=tokenHTML;
tokenHTML=function(t,p){
 if(!K24.ready||STATE.mode==="code")return K24_TOKEN_ORIGINAL(t,p);
 const hits=K24.showNetworks?(K24.byP.get(p.n)||[]):[];
 if(t.kind==="footnote"){
  const cats=hits.filter(h=>String(h.noteId)===String(t.id));
  if(!cats.length)return K24_TOKEN_ORIGINAL(t,p);
  const colors=[...new Set(cats.map(h=>h.color))];
  return `<span class="k24-note-anchor" style="--k-color:${colors[0]};border-image:linear-gradient(90deg,${colors.length>1?colors.join(","):colors[0]+","+colors[0]}) 1" title="${k24Esc([...new Set(cats.map(h=>h.rootTitle))].join(" · "))}">${K24_TOKEN_ORIGINAL(t,p)}</span>`;
 }
 if(t.kind!=="text")return K24_TOKEN_ORIGINAL(t,p);
 const hs=hits.filter(h=>Number.isInteger(h.a)&&h.b>t.a&&h.a<t.b);
 const speakers=k24SpeakerRanges(p).filter(r=>r.b>t.a&&r.a<t.b);
 if(!hs.length&&!speakers.length)return K24_TOKEN_ORIGINAL(t,p);
 const boundaries=[...new Set([t.a,t.b,...hs.flatMap(h=>[Math.max(t.a,h.a),Math.min(t.b,h.b)]),...speakers.flatMap(h=>[Math.max(t.a,h.a),Math.min(t.b,h.b)])])].sort((a,b)=>a-b);
 let html="";
 for(let i=0;i<boundaries.length-1;i++){
  const a=boundaries[i],b=boundaries[i+1],text=p.text.slice(a,b),over=hs.filter(h=>h.a<=a&&h.b>=b),sp=speakers.find(r=>r.a<=a&&r.b>=b);
  if(over.length){
   const colors=[...new Set(over.map(h=>h.color))],bg=colors.length===1?colors[0]+"26":`linear-gradient(180deg,${colors.map((c,j)=>c+"30 "+100*j/colors.length+"%,"+c+"30 "+100*(j+1)/colors.length+"%").join(",")})`;
   html+=`<mark class="k24-word sem ${(t.sem||[]).join(" ")} ${sp?"k24-speaker-text":""}" ${sp?`style="background:${bg};--k-color:${colors[0]};color:${k24RoleColor(sp.role)}"`:`style="background:${bg};--k-color:${colors[0]}"`} tabindex="0" role="button" data-k24-hit="${k24Esc(over[0].id)}" data-k24-paragraph="${p.n}" title="${k24Esc([...new Set(over.map(h=>h.rootTitle))].join(" · "))}">${esc(text)}</mark>`;
  }else if(sp){
   html+=`<button class="k24-speaker-text sem ${(t.sem||[]).join(" ")}" style="color:${k24RoleColor(sp.role)}" data-action="role" data-value="${sp.role}" title="דמות: ${k24Esc(D.roles[sp.role].character)} · גילם/ה: ${k24Esc(D.roles[sp.role].actor||"לא מזוהה")}">${esc(text)}</button>`;
  }else html+=K24_TOKEN_ORIGINAL({...t,a,b,text},p);
 }
 return html;
};
const K24_READ_ORIGINAL=renderRead;
renderRead=function(){
 K24_READ_ORIGINAL();if(!K24.ready)return;
 const content=document.getElementById("content"),entry=content.querySelector(".v22-reading-entry");
 if(entry)entry.outerHTML=k24ReadEntry();else content.querySelector(".read-bar")?.insertAdjacentHTML("beforebegin",k24ReadEntry());
 content.querySelector(".v2-global-dock")?.remove(); // compact synchronized dock replaces it only in this view
 content.classList.toggle("k24-writing",K24.showWriting||STATE.mode==="linked");
 content.classList.toggle("k24-network-on",K24.showNetworks);
 if(K24.showNetworks)for(const [pn,hs] of K24.byP){
  const el=document.getElementById("p-"+pn);if(!el||el.classList.contains("raw-code"))continue;
  const roots=[...new Map(hs.map(h=>[h.root,{title:h.rootTitle,color:h.color,id:h.root}])).values()];
  const lane=document.createElement("span");lane.className="k24-paragraph-tags";
  lane.innerHTML=roots.map(r=>`<button data-k24-focus="${k24Esc(r.id)}" style="--k-color:${r.color}" title="${k24Esc(r.title)}">${k24Esc(r.title)}</button>`).join("");
  el.prepend(lane);
 }
 k24InitControls();
 if(K24.focus?.kind==="hit")requestAnimationFrame(()=>k24HighlightHit(K24.focus.hit));
};
function k24HighlightHit(h){
 const p=document.getElementById("p-"+h.p);if(!p)return;
 document.querySelectorAll(".k24-current-hit").forEach(e=>e.classList.remove("k24-current-hit"));
 const marked=p.querySelector(`[data-k24-hit="${CSS.escape(h.id)}"]`);
 (marked||p).classList.add("k24-current-hit");
 if(h.noteId&&V22.showNotes)v22NoteDetail(String(h.noteId));
}
// Retain both navigation arguments; the old V2 wrapper discarded paragraphNumber.
jump=function(tid,paragraphNumber=null){
 if(V2.collapse)document.querySelector(`[data-v2-preface="${CSS.escape(String(tid))}"]`)?.setAttribute("open","");
 return v2BaseJump(tid,paragraphNumber);
};
function k24JumpHit(h){
 if(!h)return;
 if(STATE.order==="compare"|| (STATE.order==="program"&&!psFor(D.text_records[h.t]?.target).length))STATE.order="source";
 if(V2.collapse&&v2HeadingMap()[h.t])V2.collapse=false;
 STATE.hideDeleted=false;STATE.view="read";K24.showNetworks=true;
 v21OpenView("read");
 requestAnimationFrame(()=>{
  jump(h.t,h.p);k24HighlightHit(h);
  document.getElementById("k24ReadingLocator").innerHTML=k24LocatorHTML();
  requestAnimationFrame(()=>{
   const para=document.getElementById("p-"+h.p),header=document.querySelector("header.top"),bar=document.querySelector(".read-bar");
   if(para)window.scrollTo({top:Math.max(0,scrollY+para.getBoundingClientRect().top-(header?.offsetHeight||115)-(bar?.offsetHeight||120)-18),behavior:"instant"});
  });
 });
}
function k24Step(delta){
 const pool=k24EvidencePool();if(!pool.length)return;
 K24.cursor=K24.cursor<0?(delta<0?pool.length-1:0):(K24.cursor+delta+pool.length)%pool.length;
 k24JumpHit(pool[K24.cursor]);
}

function k24Seq(order=ST.mapOrder){
 let seq=sourceOrder();
 if(order==="program"){
  const listed=[...new Set(programOrder().flatMap(p=>txts(p.target).map(t=>t.id)))];
  seq=[...listed,...seq.filter(t=>!listed.includes(t))]; // residuals visibly labelled; never silently discarded
 }
 if(V2.collapse)seq=seq.filter(t=>!v2HeadingMap()[t]);
 return seq;
}
function k24Sources(t){return V2.collapse?[t,...Object.entries(v2HeadingMap()).filter(([,b])=>b===t).map(([a])=>a)]:[t]}
function k24Eligible(tids){
 const set=new Set(tids);
 return D.paragraphs.filter(p=>set.has(p.t)&&p.text.trim()&&!/^\s*(<\/?[^>]+>|<\d+>\d*|\[\[.*\]\])\s*$/.test(p.text));
}
function k24HitsIn(r,t){const ts=new Set(k24Sources(t));return r.hits.filter(h=>ts.has(h.t))}
function k24VisibleHits(r){
 const ts=new Set((V2.units.size?[...V2.units]:k24Seq()).flatMap(k24Sources));
 return r.hits.filter(h=>ts.has(h.t));
}
function k24Value(r,t){
 const hits=k24HitsIn(r,t);
 return K24.metric==="coverage"?HamatateKnowledge.coverage(hits,k24Eligible(k24Sources(t))).percent:
 new Set(hits.map(h=>h.evidenceKey)).size;
}
function k24RootValue(r){
 const hits=k24VisibleHits(r),ts=(V2.units.size?[...V2.units]:k24Seq()).flatMap(k24Sources);
 return K24.metric==="coverage"?HamatateKnowledge.coverage(hits,k24Eligible(ts)).percent:new Set(hits.map(h=>h.evidenceKey)).size;
}
function k24ValLabel(v){return K24.metric==="coverage"?v.toFixed(1)+"%":String(v)}
function k24MetricName(){return K24.metric==="coverage"?"אחוז הפסקאות שיש בהן ראיה לשכבה":"מספר ראיות ייחודיות בשכבה"}
function k24SelectionDock(){
 const active=k24Active();
 return `<div class="k24-selection-status"><b>${active.length} רשתות ושכבות</b><span>${V2.units.size?V2.units.size+" יחידות בבחירה":"כל המחזה"}</span>${V2.units.size?'<button data-k24-command="clear-units">חזרה לכל היחידות</button>':""}
 <span>בחירה מצטברת · לחיצה על הגרף פותחת ראיות, ואינה מבטלת רשתות אחרות</span></div>`;
}
function k24Toolbar(){
 return `<div class="k24-graph-toolbar"><div class="k24-tabs" role="group" aria-label="צורת המחקר">
 ${[["graph","מפת הקשרים"],["flow","זרימה לאורך המחזה"],["surface","הטקסט כמשטח"],["overlap","חפיפות"]].map(([v,t])=>`<button data-k24-view="${v}" aria-pressed="${K24.view===v}" class="${K24.view===v?"on":""}">${t}</button>`).join("")}</div>
 <label><input type="checkbox" data-k24-switch="words" ${K24.words?"checked":""}>מילים על הגרף</label>
 <details class="k24-viz-options"><summary>דיוק התצוגה</summary><label>מדד <select data-k24-setting="metric"><option value="coverage" ${K24.metric==="coverage"?"selected":""}>כיסוי פסקאות (%)</option><option value="hits" ${K24.metric==="hits"?"selected":""}>ראיות ייחודיות</option></select></label>
 <label>מילים לכל רשת <select data-k24-setting="wordLimit">${[3,6,12,24].map(n=>`<option ${K24.wordLimit===n?"selected":""}>${n}</option>`).join("")}</select></label>
 <label><input type="checkbox" data-k24-collapse ${V2.collapse?"checked":""}>קיבוץ כותרות T עם תוכנן</label>
 <button data-k24-command="export-json">ייצוא הראיות JSON</button><button data-k24-command="export-svg">שמירת התרשים SVG</button></details></div>
 <div class="k24-orderbar"><span>רצף התצוגה</span>${[["source","סדר הטקסט"],["program","לפי התכנייה"]].map(([v,t])=>`<button data-k24-order="${v}" class="${ST.mapOrder===v?"on":""}">${t}</button>`).join("")}
 <button data-k24-command="compare">השוואת שני הסדרים ↗</button><small>${ST.mapOrder==="program"?"יחידות ללא שיוך בתכנייה מוצגות בסוף ומסומנות בנפרד.":"הציר הוא סדר יחידות העד, לא זמן ביצוע."}</small></div>`;
}
function k24Dominance(){
 const layers=k24Active().map(r=>({r,v:k24RootValue(r)})).sort((a,b)=>b.v-a.v),max=Math.max(1,...layers.map(x=>x.v));
 return `<section class="k24-dominance"><div><b>נוכחות בבחירה</b><small>${k24MetricName()} · לא מדד לחשיבות היסטורית</small></div><div class="k24-dominance-items">${layers.map(({r,v})=>`<button data-k24-focus="${k24Esc(r.id)}" style="--k-color:${r.color};--k-width:${100*v/max}%"><span>${k24Esc(r.title)}</span><strong>${k24ValLabel(v)}</strong><i></i></button>`).join("")||'<span>בחרו רשת מן הרשימה.</span>'}</div></section>`;
}
function k24EvidenceHTML(){
 const pool=k24EvidencePool(),page=K24.evidencePage,limit=8,display=pool.slice(page*limit,(page+1)*limit);
 let title="מן המפה אל המילים וההערות";
 if(K24.focus?.kind==="root")title=K24.roots.get(K24.focus.id)?.title||title;
 if(K24.focus?.kind==="term")title=K24.children.get(K24.focus.id)?.title||title;
 if(K24.focus?.kind==="pair")title="הראיות לחפיפה הנבחרת";
 if(K24.focus?.kind==="unit")title=D.text_records[K24.focus.id]?.title||title;
 return `<section class="k24-evidence" id="k24Evidence"><header><div><small>כל נקודה חוזרת לעד</small><h2>${k24Esc(title)}</h2><p>${pool.length} ראיות ייחודיות לאחר הסרת כפילויות של אותה הפניה. מילה והערה אינן אותה יחידת ספירה.</p></div><div>${K24.focus?'<button data-k24-command="unfocus">כל הבחירה</button>':""}<button data-k24-command="read">לקריאה הרציפה ↗</button></div></header>
 <div class="k24-evidence-grid">${display.map(h=>{
  const f=h.noteId?K24.data.notes[h.noteId]:null;
  return `<article class="k24-evidence-card" style="--k-color:${h.color||"#53757c"}"><small>${k24Esc(h.rootTitle||"")} · ${k24Esc(short(h.t))} · פסקה ${h.p}</small><h3>${k24Esc(h.term||h.surface||"סימון מקור")}</h3>
  ${h.termKind==="anchor-context"?'<span class="k24-context-label">מילים סמוכות להפניה — לא זיהוי מושג מאושר</span>':""}
  <blockquote>${k24Esc(plain24(h.excerpt||""))}</blockquote>
  ${f?`<details><summary>הערה ${k24Esc(f.displayNumber)} · נוסח מלא</summary><p>${linkify(f.text)}</p></details>`:""}
  <footer><span>${f?"סיווג מפורש בהערה":h.basis==="literal-query"?"חיפוש מילולי":"שכבת מקור"}</span><button data-k24-jump="${k24Esc(h.id)}">אל המופע בטקסט ←</button></footer></article>`;
 }).join("")||'<div class="k24-empty">אין ראיות בתחום הבחירה הנוכחי. אפשר לצרף רשת אחרת או להחזיר את כל היחידות; אין כאן נתונים לדוגמה.</div>'}</div>
 <nav class="k24-pagination"><button data-k24-page="-1" ${page<=0?"disabled":""}>הקודמות</button><span>${pool.length?`${page*limit+1}–${Math.min((page+1)*limit,pool.length)} מתוך ${pool.length}`:"0"}</span><button data-k24-page="1" ${(page+1)*limit>=pool.length?"disabled":""}>הבאות</button></nav></section>`;
}
function k24LegacyLinks(){
 return `<details class="k24-legacy"><summary>כל כלי המחקר הקיימים</summary><div>
 <button data-k24-legacy="lives">חיי כל התגים — משטח, זרימה וחפיפות</button>
 <button data-k24-legacy="content">מפת התוכן הפרטנית</button>
 <button data-k24-legacy="actors">רשת השחקנים והתפקידים</button>
 <button data-k24-legacy="surface">משטח שכבות ה־XML</button>
 <button data-k24-command="legacy-distant">כלי הערות, כתיבה וסוגי כתב</button>
 <button data-action="materialsTab" data-value="scenarios">השוואת עדים ותרחישים</button>
 </div></details>`;
}
const K24_DISTANT_ORIGINAL=renderDistant;
renderDistant=function(){
 if(!K24.ready){K24_DISTANT_ORIGINAL();return;}
 v2Stop();stStopPlay();
 const title=D.production.title||"ההצגה";
 document.getElementById("content").innerHTML=`<div class="k24-research">
 <header class="k24-research-header"><div><span class="k24-eyebrow">המחזה · הרשתות · המילים</span><h1>רשתות על פני ${k24Esc(title)}</h1><p>הוסיפו רשתות זו לצד זו, חשפו את המילים שמחברות אותן, וחזרו מכל קשר אל ההערה ואל הטקסט.</p></div><button class="k24-secondary" data-k24-command="read">חזרה לקריאה ←</button></header>
 ${k24SelectionDock()}
 <div class="k24-workspace"><aside class="k24-selection-panel">${k24Palette(false)}</aside><section class="k24-visual-panel">
 ${k24Toolbar()}<div class="k24-visual" id="k24Visual"></div><div class="k24-visual-caption" id="k24Caption"></div>
 ${k24Dominance()}</section></div>
 ${k24EvidenceHTML()}
 <details class="k24-method"><summary>כיצד „אזכור…” הופך לגוף ידע?</summary>
 <p>המהדורה כוללת ${K24.data.diagnostics.categorizedNotes} הערות עם סיווג מפורש, ובהן ${K24.data.diagnostics.assignments} שיוכים ל־${K24.data.categories.length} כותרות סיווג שונות. הערה אחת יכולה להשתייך לכמה גופים. „תרבותי” ו„תרבות צריכה”, וכן „מקום” ו„מקומות”, נשמרים כשמות שונים כפי שנכתבו במקור.</p>
 <p>מושג קצר נלקח מן הניסוח שאחרי הסיווג, רק כאשר הוא מפורש. כשאין מושג כזה, מוצגות המילים הסמוכות להפניה ומעמדן מסומן. סמיכות אינה טווח תיוג מוכח. הערה ${K24.data.diagnostics.unrecognized.map(x=>x.noteId).join(", ")} נשארה לבירור משום שסוג האזכור אינו ברור.</p>
 <p>גודל העיגול משקף את המדד הנבחר, עם גודל מינימום לקריאות; לקריאת יחסים מספריים מדויקים השתמשו במספרים ובפסי הנוכחות. קו אל יחידה מציין שהראיה מעוגנת בה; קו חפיפה מציין מקור משותף לפי ההגדרה שנבחרה, לא השפעה רעיונית. שכבות חיפוש וסיווגי מהדירים נשארים נבדלים.</p></details>
 ${k24LegacyLinks()}</div>`;
 k24InitControls();k24Draw();
};
function k24SvgBase(w=1080,h=560){
 return `<div class="k24-zoom-tools"><button data-k24-zoom="in" aria-label="הגדלה">+</button><button data-k24-zoom="out" aria-label="הקטנה">−</button><button data-k24-zoom="reset">התאמה למסך</button></div><svg class="k24-svg" id="k24Svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="רשתות התוכן ומופעיהן במחזה" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="k24PaperLines" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M 0 18 L 18 18" stroke="#87795f" opacity=".05"/></pattern></defs><rect width="${w}" height="${h}" fill="url(#k24PaperLines)"/><g id="k24Plot"></g></svg>`;
}
function k24NodeElement(n){
 const active=K24.focus?.id===n.layer||K24.focus?.id===n.child||K24.focus?.id===n.t;
 if(n.kind==="unit")return `<g class="k24-node k24-unit ${V2.units.size&&!V2.units.has(n.t)?"outside-scope":""} ${V2.units.has(n.t)?"chosen":""}" data-k24-node="${k24Esc(n.id)}" data-k24-unit="${k24Esc(n.t)}" tabindex="0" role="button" transform="translate(${n.x},${n.y})"><rect x="-17" y="-17" width="34" height="34" rx="7"/><text y="4" text-anchor="middle">${k24Esc(short(n.t))}</text><title>${k24Esc(n.title)} · לחיצה בוחרת/מסירה יחידה; הראיות מתעדכנות למטה</title></g>`;
 if(n.kind==="term")return `<g class="k24-node k24-term ${n.context?"context":""} ${active?"focus":""}" data-k24-node="${k24Esc(n.id)}" data-k24-wordnode="${k24Esc(n.child)}" tabindex="0" role="button" transform="translate(${n.x},${n.y})" style="--k-color:${n.color}"><rect x="${-n.w/2}" y="-15" width="${n.w}" height="30" rx="14"/><text text-anchor="middle" y="4">${k24Esc(n.title.length>21?n.title.slice(0,20)+"…":n.title)}</text><title>${k24Esc(n.title)} · ${n.hits.length} ראיות${n.context?" · מילים ליד ההפניה; לא מושג שזוהה בידי המהדירים":""}</title></g>`;
 return `<g class="k24-node k24-rootnode ${active?"focus":""}" data-k24-node="${k24Esc(n.id)}" data-k24-focus="${k24Esc(n.layer)}" tabindex="0" role="button" transform="translate(${n.x},${n.y})" style="--k-color:${n.color}"><circle r="${n.r+5}" class="k24-halo"/><circle r="${n.r}" fill="${n.color}"/><text y="${-n.r-10}" text-anchor="middle" class="k24-root-title">${k24Esc(n.title)}</text><text y="5" text-anchor="middle" class="k24-root-count">${k24ValLabel(n.value)}</text><text y="${n.r+16}" text-anchor="middle" class="k24-source-label">${n.basis}</text><title>${k24Esc(n.title)} · ${k24MetricName()}: ${k24ValLabel(n.value)}</title></g>`;
}
function k24EdgePath(e){
 const a=e.a,b=e.b;
 const y1=a.y+(a.kind==="root"?a.r:a.kind==="term"?15:0),y2=b.y-(b.kind==="unit"?18:b.kind==="term"?15:b.r||0);
 return `M${a.x},${y1} C${a.x},${(y1+y2)/2} ${b.x},${(y1+y2)/2} ${b.x},${y2}`;
}
let K24_GRAPH={nodes:[],edges:[]};
function k24Graph(){
 const roots=k24Active(),seq=k24Seq(),w=1080;
 if(!roots.length){document.getElementById("k24Visual").innerHTML='<div class="k24-empty k24-empty-large">בחרו רשתות מן הרשימה. הגרף יצמח מן המקורות שלהן.</div>';return;}
 const columns=Math.min(5,roots.length),rows=Math.ceil(roots.length/columns);
 const termsShown=K24.words?roots.flatMap(r=>{
   const selectedHits=k24VisibleHits(r), eligible=r.terms.map(t=>({...t,hits:selectedHits.filter(h=>h.termKey===t.id)})).filter(t=>t.hits.length);
   const pinned=t=>K24.focus?.id===t.id||V2.selected.has(t.id);
   eligible.sort((a,b)=>(+pinned(b))-(+pinned(a))||b.hits.length-a.hits.length);
   const keep=eligible.filter(pinned), other=eligible.filter(t=>!pinned(t));
   return [...keep,...other.slice(0,Math.max(0,K24.wordLimit-keep.length))].map(t=>({...t,root:r}));
 }):[];
 const termRows=Math.max(1,Math.ceil(termsShown.length/7));
 const termTop=105+rows*115,unitsY=K24.words?termTop+termRows*53+65:termTop+160,h=Math.max(560,unitsY+90);
 document.getElementById("k24Visual").innerHTML=k24SvgBase(w,h);
 const nodes=[],edges=[],max=Math.max(1,...roots.map(k24RootValue)),unitNodes=new Map();
 roots.forEach((r,i)=>{
  const col=i%columns,row=Math.floor(i/columns),x=w-90-(col+.5)*(w-180)/columns,y=80+row*115;
  const n={id:r.id,kind:"root",layer:r.id,title:r.title,color:r.color,value:k24RootValue(r),
     r:27+Math.sqrt(k24RootValue(r)/max)*19,x,y,
     basis:r.kind==="knowledge"?"סיווג מפורש בהערה":r.kind==="query"?"חיפוש מילולי":"שכבת מקור"};
  nodes.push(n);
 });
 seq.forEach((t,i)=>{
  const n={id:"u:"+t,kind:"unit",t,title:D.text_records[t].title,x:w-48-i*(w-96)/Math.max(1,seq.length-1),y:unitsY};
  nodes.push(n);unitNodes.set(t,n);
 });
 if(K24.words){
  termsShown.forEach((t,i)=>{
   const col=i%7,row=Math.floor(i/7),n={id:"w:"+t.id,child:t.id,kind:"term",title:t.label,color:t.root.color,
    hits:t.hits,context:t.kind==="anchor-context",x:w-92-col*(w-180)/6,y:termTop+row*53,w:Math.min(143,Math.max(58,t.label.length*6.2+22))};
   nodes.push(n);const rn=nodes.find(x=>x.id===t.root.id);
   edges.push({a:rn,b:n,color:rn.color,count:t.hits.length,kind:"membership",term:t.id,root:rn.layer});
   for(const tid of seq){
    const hits=t.hits.filter(o=>k24Sources(tid).includes(o.t));if(!hits.length)continue;
    edges.push({a:n,b:unitNodes.get(tid),color:rn.color,count:hits.length,kind:"occurrence",term:t.id,t:tid});
   }
  });
  // Keep complete root-to-unit totals as faint paths: truncating word labels never truncates the measured data.
  for(const rn of nodes.filter(n=>n.kind==="root"))for(const t of seq){
   const hs=k24HitsIn(roots.find(r=>r.id===rn.layer),t);if(hs.length)edges.push({a:rn,b:unitNodes.get(t),color:rn.color,count:hs.length,kind:"aggregate",root:rn.layer,t});
  }
 }else for(const rn of nodes.filter(n=>n.kind==="root"))for(const t of seq){
  const hs=k24HitsIn(roots.find(r=>r.id===rn.layer),t);if(hs.length)edges.push({a:rn,b:unitNodes.get(t),color:rn.color,count:hs.length,kind:"occurrence",root:rn.layer,t});
 }
 // Node positions can be changed by the reader, without changing relations or counts.
 for(const n of nodes){const old=K24.positions.get(n.id);if(old&&old.y<h-35){n.x=old.x;n.y=old.y;}}
 K24_GRAPH={nodes,edges,w,h};
 const grid=seq.map((t,i)=>{
  const x=unitNodes.get(t).x;
  const p=k24Eligible(k24Sources(t)).slice(0,5).map(p=>plain24(p.text).slice(0,18));
  return `<g opacity=".12"><path d="M${x},${unitsY-92} V${unitsY-23}" stroke="#7b7566"/>${p.map((t,j)=>`<text x="${x}" y="${unitsY-83+j*10}" text-anchor="middle" font-size="5.5">${esc(t)}</text>`).join("")}</g>`;
 }).join("");
 document.getElementById("k24Plot").innerHTML=`${grid}<g class="k24-edges">${edges.map((e,i)=>`<path class="k24-edge ${e.kind} ${e.t&&V2.units.size&&!V2.units.has(e.t)?"outside-scope":""}" data-k24-edge="${i}" d="${k24EdgePath(e)}" stroke="${e.color}" stroke-width="${e.kind==="aggregate"?.6:Math.min(7,.9+Math.sqrt(e.count))}" tabindex="0" role="button"><title>${e.count} ראיות · לחצו למקור</title></path>`).join("")}</g><g>${nodes.map(k24NodeElement).join("")}</g><text x="${w-20}" y="${unitsY+57}" text-anchor="end" class="k24-band-label">${ST.mapOrder==="source"?"סדר הטקסט":"סדר תכנייה + יחידות ללא שיוך בסוף"} ← יחידות T</text>`;
 const totalWords=roots.reduce((n,r)=>n+r.terms.filter(t=>k24VisibleHits(r).some(h=>h.termKey===t.id)).length,0);
 document.getElementById("k24Caption").innerHTML=`<b>רשת ← מילה/הפניה ← יחידה בטקסט.</b> ${K24.words?`מוצגות ${termsShown.length} מתוך ${totalWords} כותרות מילים והקשרים; כל הראיות נכללות בספירות וברשימה. `:"סמנו „מילים על הגרף” כדי לפרוש את המילים וההפניות. "}אפשר לגרור צמתים, להגדיל, לבחור כמה יחידות ולפתוח ראיות. מסגרת מקווקוות מציינת מילים מהקשר ההפניה, ולא מושג שזוהה. המיקום החזותי אינו מרחק רעיוני.`;
 k24WireGraph();
}
function plain24(s){return s.replace(/<\/?[A-Za-z0-9_.-]+>/g,"").replace(/\[\[.*?\]\]|\/{4}/g,"").replace(/\s+/g," ").trim();}
function k24Flow(){
 const roots=k24Active(),seq=k24Seq(),w=1080,h=490,left=60,right=35,top=40,bottom=110;
 document.getElementById("k24Visual").innerHTML=k24SvgBase(w,h);
 const max=Math.max(1,...roots.flatMap(r=>seq.map(t=>k24Value(r,t)))),x=i=>w-right-i*(w-left-right)/Math.max(1,seq.length-1),y=v=>h-bottom-v/max*(h-bottom-top);
 let s=Array.from({length:5},(_,i)=>{
  const v=max*i/4;return `<line x1="${left}" x2="${w-right}" y1="${y(v)}" y2="${y(v)}" stroke="#dfd9cc"/><text x="${left-8}" y="${y(v)+4}" text-anchor="end" font-size="11">${K24.metric==="coverage"?v.toFixed(0)+"%":v.toFixed(0)}</text>`;
 }).join("");
 for(const r of roots){
  const points=seq.map((t,i)=>`${x(i)},${y(k24Value(r,t))}`).join(" ");
  s+=`<polyline points="${points}" fill="none" stroke="${r.color}" stroke-width="2.4" opacity=".85" data-k24-focus="${k24Esc(r.id)}" tabindex="0" role="button"/>`;
  seq.forEach((t,i)=>{
   const val=k24Value(r,t);if(val===0)return;
   const hs=k24HitsIn(r,t),words=[...new Set(hs.map(h=>h.term||h.surface).filter(Boolean))];
   s+=`<g data-k24-flowpoint="${k24Esc(r.id)}|${t}" tabindex="0" role="button" class="k24-point"><circle cx="${x(i)}" cy="${y(val)}" r="5" fill="${r.color}" stroke="#fffdf8" stroke-width="1.5"/><title>${k24Esc(r.title)} · ${short(t)} · ${k24ValLabel(val)} · ${k24Esc(words.slice(0,10).join(" / "))}</title>${K24.words?`<text x="${x(i)}" y="${y(val)-10}" font-size="10" text-anchor="middle" fill="${r.color}">${k24Esc((words[0]||"").length>18?(words[0]||"").slice(0,17)+"…":words[0]||"")}</text>`:""}</g>`;
  });
 }
 s+=seq.map((t,i)=>`<g class="k24-node k24-unit ${V2.units.has(t)?"chosen":""}" data-k24-unit="${t}" tabindex="0" role="button" transform="translate(${x(i)},${h-bottom+30})"><rect x="-17" y="-15" width="34" height="30" rx="6"/><text text-anchor="middle" y="4">${short(t)}</text><title>${k24Esc(D.text_records[t].title)}</title></g>`).join("");
 document.getElementById("k24Plot").innerHTML=s;
 document.getElementById("k24Caption").innerHTML=`<b>${k24MetricName()} בכל יחידה.</b> כל קו הוא שכבה אחת; קטעי הקו מחברים מדידות נפרדות, ולא מתארים ביצוע רציף. אפס פירושו שלא נמצאה התאמה בחומר הזמין.`;
 k24WireZoom();
}
function k24Surface(){
 const roots=k24Active(),seq=k24Seq(),w=Math.max(1080,seq.length*66),h=640,x=i=>w-38-i*(w-76)/Math.max(1,seq.length-1),top=75,fh=480;
 document.getElementById("k24Visual").innerHTML=k24SvgBase(w,h);
 let s="";
 seq.forEach((t,i)=>{
  const ps=k24Eligible(k24Sources(t)),width=(w-76)/Math.max(1,seq.length)-9,cx=x(i);
  s+=`<g class="k24-substrate ${V2.units.has(t)?"chosen":""}"><rect x="${cx-width/2}" y="55" width="${width}" height="${fh+30}" rx="7" fill="#fffdfa" stroke="#d9d1c0"/>`;
  ps.forEach((p,j)=>{
   const y=top+j*fh/Math.max(1,ps.length),words=plain24(p.text);
   s+=`<text x="${cx+width/2-4}" y="${y}" text-anchor="end" font-size="${Math.max(2.7,Math.min(5.2,fh/Math.max(1,ps.length)))}" opacity=".27">${k24Esc(words.slice(0,34))}</text>`;
  });
  roots.forEach((r,ri)=>{
   const hits=k24HitsIn(r,t);
   for(const hit of hits){
    const pi=ps.findIndex(p=>p.n===hit.p);if(pi<0)continue;
    const cy=top+pi*fh/Math.max(1,ps.length),mx=cx-width/2+4+ri*3.2;
    s+=`<circle class="k24-surface-dot" data-k24-hit="${k24Esc(hit.id)}" cx="${mx}" cy="${cy}" r="${Math.min(3.4,Math.max(1.6,width/(roots.length*5)))}" fill="${r.color}" tabindex="0" role="button"><title>${k24Esc(r.title)} · ${k24Esc(hit.term||"")} · פסקה ${hit.p}</title></circle>`;
   }
  });
  s+=`</g><g class="k24-node k24-unit ${V2.units.has(t)?"chosen":""}" data-k24-unit="${t}" tabindex="0" role="button" transform="translate(${cx},600)"><rect x="-18" y="-16" width="36" height="32" rx="6"/><text text-anchor="middle" y="4">${short(t)}</text><title>${k24Esc(D.text_records[t].title)}</title></g>`;
 });
 document.getElementById("k24Plot").innerHTML=s;
 document.getElementById("k24Caption").innerHTML="<b>כל סימון נשען על פסקה ממשית.</b> נקודות הצבע מסודרות לפי מיקומי המקור. רוחב עמודות שווה לצורכי השוואה; אינו מייצג משך במה. הגדילו או לחצו על נקודה כדי להגיע למילים ולהערה.";
 k24WireZoom();
}
function k24Overlap(){
 const roots=k24Active(),w=1080,h=560,cx=w/2,cy=275,rx=330,ry=183;
 document.getElementById("k24Visual").innerHTML=`<div class="k24-scope"><span>משותף באותו…</span>${[["note","הערה"],["paragraph","פסקה"],["unit","T"]].map(([s,t])=>`<button data-k24-setting-click="scope" data-value="${s}" class="${K24.scope===s?"on":""}">${t}</button>`).join("")}</div>`+k24SvgBase(w,h);
 const nodes=roots.map((r,i)=>({...r,x:cx+Math.cos(-Math.PI/2+i*2*Math.PI/Math.max(1,roots.length))*rx,y:cy+Math.sin(-Math.PI/2+i*2*Math.PI/Math.max(1,roots.length))*ry}));
 let edges="",ns="";
 for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
  const a=nodes[i],b=nodes[j],common=HamatateKnowledge.intersection(k24VisibleHits(a),k24VisibleHits(b),K24.scope);
  if(!common.length)continue;
  const pair=JSON.stringify([a.id,b.id]);
  edges+=`<g data-k24-pair="${k24Esc(pair)}" tabindex="0" role="button" class="k24-overlap-edge"><path d="M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}" fill="none" stroke="#8b8194" stroke-width="${Math.min(15,1+Math.sqrt(common.length))}" opacity=".45"/><title>${k24Esc(a.title)} × ${k24Esc(b.title)} · ${common.length} ${K24.scope==="note"?"הערות":K24.scope==="unit"?"יחידות":"פסקאות"} משותפות</title></g>`;
 }
 nodes.forEach(r=>ns+=`<g class="k24-node k24-rootnode" data-k24-focus="${k24Esc(r.id)}" tabindex="0" role="button" transform="translate(${r.x},${r.y})"><circle r="38" fill="${r.color}"/><text class="k24-root-title" text-anchor="middle" y="-50">${k24Esc(r.title)}</text><text text-anchor="middle" y="5" fill="#fff" font-size="18">${new Set(k24VisibleHits(r).map(h=>h.evidenceKey)).size}</text></g>`);
 document.getElementById("k24Plot").innerHTML=edges+ns+(edges?"":'<text x="540" y="286" text-anchor="middle" font-size="16" fill="#647174">אין מקורות משותפים לפי תחום החפיפה שנבחר</text>');
 document.getElementById("k24Caption").innerHTML="<b>חפיפה היא הגדרה מפורשת, לא קשר רעיוני שהוכח.</b> בחרו קו כדי לראות את כל המקורות המשותפים. במצב „הערה” נספרות רק שכבות שיש להן הפניות להערות; רשתות חיפוש אינן הופכות להערות.";
 k24WireZoom();
}
function k24Draw(){
 if(!document.getElementById("k24Visual"))return;
 if(K24.view==="graph")k24Graph();else if(K24.view==="flow")k24Flow();else if(K24.view==="surface")k24Surface();else k24Overlap();
 k24InitControls();
}
function k24WireZoom(){
 const svg=document.getElementById("k24Svg");if(!svg)return;
 const apply=()=>document.getElementById("k24Plot")?.setAttribute("transform",`translate(${K24.transform.x},${K24.transform.y}) scale(${K24.transform.k})`);
 apply();
 svg.addEventListener("wheel",e=>{
  if(!e.ctrlKey)return;e.preventDefault();
  K24.transform.k=Math.min(4,Math.max(.45,K24.transform.k*(e.deltaY<0?1.1:.9)));apply();
 },{passive:false});
 let panning=null;
 svg.addEventListener("pointerdown",e=>{
  if(e.target.closest(".k24-node,.k24-edge,.k24-surface-dot,.k24-point"))return;
  panning={x:e.clientX,y:e.clientY,start:{...K24.transform}};svg.setPointerCapture(e.pointerId);
 });
 svg.addEventListener("pointermove",e=>{
  if(!panning)return;
  const scale=svg.viewBox.baseVal.width/svg.getBoundingClientRect().width;
  K24.transform.x=panning.start.x+(e.clientX-panning.x)*scale;
  K24.transform.y=panning.start.y+(e.clientY-panning.y)*scale;apply();
 });
 svg.addEventListener("pointerup",()=>panning=null);
 svg.addEventListener("pointercancel",()=>panning=null);
}
function k24WireGraph(){
 k24WireZoom();
 const svg=document.getElementById("k24Svg");
 let drag=null;
 svg.querySelectorAll("[data-k24-node]").forEach(el=>{
  if(el.classList.contains("k24-unit"))return;
  el.addEventListener("pointerdown",e=>{
   const n=K24_GRAPH.nodes.find(x=>x.id===el.dataset.k24Node);if(!n)return;
   drag={n,el,x:e.clientX,y:e.clientY,moved:false};el.setPointerCapture(e.pointerId);
  });
  el.addEventListener("pointermove",e=>{
   if(!drag||drag.el!==el)return;
   if(Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y)<6&&!drag.moved)return;
   drag.moved=true;
   const point=new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse());
   drag.n.x=Math.max(20,Math.min(K24_GRAPH.w-20,(point.x-K24.transform.x)/K24.transform.k));
   drag.n.y=Math.max(25,Math.min(K24_GRAPH.h-30,(point.y-K24.transform.y)/K24.transform.k));
   el.setAttribute("transform",`translate(${drag.n.x},${drag.n.y})`);
   svg.querySelectorAll("[data-k24-edge]").forEach(p=>p.setAttribute("d",k24EdgePath(K24_GRAPH.edges[+p.dataset.k24Edge])));
  });
  el.addEventListener("pointerup",e=>{
   if(drag?.moved){K24.positions.set(drag.n.id,{x:drag.n.x,y:drag.n.y});K24.suppressClick=Date.now()+150;}
   drag=null;
  });
  el.addEventListener("pointercancel",()=>drag=null);
 });
}

function k24Focus(kind,id){
 K24.focus={kind,id};K24.evidencePage=0;K24.cursor=-1;
 if(STATE.view==="read"){
  document.getElementById("k24ReadingLocator").innerHTML=k24LocatorHTML();
  k24EvidenceModal();
 }else{
  if(kind==="term"&&K24.view==="graph")k24Draw();
  const evidence=document.getElementById("k24Evidence");if(evidence)evidence.outerHTML=k24EvidenceHTML();
  document.querySelectorAll(".k24-rootnode,.k24-term").forEach(n=>n.classList.toggle("focus",n.dataset.k24Focus===id||n.dataset.k24Wordnode===id));
  document.getElementById("k24Evidence")?.scrollIntoView({block:"nearest",behavior:"smooth"});
 }
}
function k24EvidenceModal(){
 pop("רשתות התוכן · מקורות הבחירה",`<div class="k24-modal-evidence">${k24EvidenceHTML()}</div>`);
}
function k24OpenHit(id){
 const h=K24.observations.get(id)||k24EvidencePool().find(x=>x.id===id);if(!h)return;
 const f=h.noteId?K24.data.notes[String(h.noteId)]:null;
 const all=(K24.byP.get(h.p)||[]).filter(x=>h.noteId?x.noteId===h.noteId:x.a===h.a&&x.b===h.b);
 pop("מיקום בעד · לא השערת שיוך חדשה",`<h2>${k24Esc(h.term||h.surface||"מופע בטקסט")}</h2>
 <div class="k24-source-tags">${[...new Map(all.map(x=>[x.root,x])).values()].map(x=>`<span style="--k-color:${x.color}">${k24Esc(x.rootTitle)}</span>`).join("")}</div>
 <p>${k24Esc(short(h.t))} · פסקה ${h.p}${h.termKind==="anchor-context"?" · המילים מוצגות כהקשר של ההפניה בלבד":""}</p>
 <blockquote>${k24Esc(plain24(h.excerpt||""))}</blockquote>
 ${f?`<h3>הערה ${f.displayNumber} — הנוסח המקורי</h3><p class="k24-original-note">${linkify(f.text)}</p>`:`<p>זהו מופע מילולי או סימון מקור, לא סיווג חדש שהוסיף הממשק.</p>`}
 <p class="small">סוג העיגון: ${h.noteId?"הפניית הערת שוליים ממוקמת"+(h.a!==null?" + התאמת מונח מפורשת":""):"מופע בטקסט"}.</p>
 <div class="k24-modal-actions"><button class="k24-primary" data-k24-jump="${k24Esc(id)}">אל המקום בקריאה ←</button><button data-action="xmlpara" data-value="${h.p}">קידוד פסקת המקור</button></div>`);
}
function k24Download(name,content,type){
 const blob=new Blob([content],{type}),a=document.createElement("a"),u=URL.createObjectURL(blob);
 a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);
}
function k24ExportSVG(){
 const svg=document.getElementById("k24Svg");if(!svg)return;
 const clone=svg.cloneNode(true),orig=svg.querySelectorAll("*"),els=clone.querySelectorAll("*");
 ["fill","stroke","stroke-width","opacity","font-size","font-family","font-weight","text-anchor"].forEach(attr=>orig.forEach((el,i)=>{
  const value=getComputedStyle(el).getPropertyValue(attr);if(value)els[i].style.setProperty(attr,value);
 }));
 const title=document.createElementNS("http://www.w3.org/2000/svg","title");title.textContent=D.production.title+" — רשתות: "+k24Active().map(x=>x.title).join(", ");clone.prepend(title);
 k24Download("hamatate-networks.svg",new XMLSerializer().serializeToString(clone),"image/svg+xml;charset=utf-8");
}
function k24HandleCommand(cmd){
 if(cmd==="distant"){K24.view="graph";v21OpenView("distant");return;}
 if(cmd==="read"){closePop();v21OpenView("read");return;}
 if(cmd==="compare"){STATE.order="compare";closePop();v21OpenView("read");return;}
 if(cmd==="clear"){
  V2.selected.clear();K24.excluded.clear();K24.focus=null;k24Changed();return;
 }
 if(cmd==="all"){
  K24.roots.forEach(r=>V2.selected.add(r.id));K24.excluded.clear();k24Changed();return;
 }
 if(cmd==="clear-units"){V2.units.clear();k24Changed();return;}
 if(cmd==="unfocus"){
  K24.focus=null;K24.cursor=-1;K24.evidencePage=0;
  if(STATE.view==="read"){document.getElementById("k24ReadingLocator").innerHTML=k24LocatorHTML();if(document.getElementById("detail").open)k24EvidenceModal();}
  else renderDistant();return;
 }
 if(cmd==="evidence"){k24EvidenceModal();return;}
 if(cmd==="legacy-distant"){K24_DISTANT_ORIGINAL();document.getElementById("content").insertAdjacentHTML("afterbegin",'<button class="k24-return-graph" data-k24-command="distant">חזרה למפת הרשתות והזרימה ←</button>');return;}
 if(cmd==="export-svg"){k24ExportSVG();return;}
 if(cmd==="export-json"){
  k24Download("hamatate-selected-evidence.json",JSON.stringify({schemaVersion:"hamatate.selection/1.0",productionId:D.production.id,
   source:K24.data.source,selection:[...V2.selected],excludedTerms:[...K24.excluded],units:[...V2.units],
   order:ST.mapOrder,metric:K24.metric,scope:K24.scope,observations:k24EvidencePool(),
   explanation:"An export of source-bound evidence, not an assertion that a lexical query is a verified discourse annotation."},null,2),"application/json;charset=utf-8");return;
 }
}
document.addEventListener("click",e=>{
 const el=e.target.closest("[data-k24-command],[data-k24-expand],[data-k24-focus],[data-k24-term-evidence],[data-k24-wordnode],[data-k24-hit],[data-k24-jump],[data-k24-step],[data-k24-view],[data-k24-order],[data-k24-unit],[data-k24-edge],[data-k24-pair],[data-k24-flowpoint],[data-k24-page],[data-k24-zoom],[data-k24-setting-click],[data-k24-legacy]");
 if(!el)return;
 if(K24.suppressClick&&Date.now()<K24.suppressClick){e.preventDefault();e.stopImmediatePropagation();return;}
 e.preventDefault();e.stopImmediatePropagation();
 if(el.dataset.k24Command){k24HandleCommand(el.dataset.k24Command);return;}
 if(el.dataset.k24Expand){
  const id=el.dataset.k24Expand;
  if(K24.expanded.has(id))K24.expanded.delete(id);else K24.expanded.add(id);
  const row=el.closest(".k24-root"),r=K24.roots.get(id);if(row&&r)row.outerHTML=k24PaletteRow(r,STATE.view==="read");
  k24InitControls();return;
 }
 if(el.dataset.k24Focus){k24Focus("root",el.dataset.k24Focus);return;}
 if(el.dataset.k24TermEvidence||el.dataset.k24Wordnode){
  const id=el.dataset.k24TermEvidence||el.dataset.k24Wordnode,c=K24.children.get(id);
  if(c&&!V2.selected.has(c.parent))V2.selected.add(id);K24.excluded.delete(id);k24Reindex();k24Save();
  if(STATE.view==="distant"){K24.words=true;K24.view="graph";}
  k24Focus("term",id);return;
 }
 if(el.dataset.k24Hit){k24OpenHit(el.dataset.k24Hit);return;}
 if(el.dataset.k24Jump){
  const h=K24.observations.get(el.dataset.k24Jump)||k24EvidencePool().find(h=>h.id===el.dataset.k24Jump);
  if(h){K24.cursor=k24EvidencePool().findIndex(x=>x.id===h.id);closePop();k24JumpHit(h);}return;
 }
 if(el.dataset.k24Step){k24Step(+el.dataset.k24Step);return;}
 if(el.dataset.k24View){K24.view=el.dataset.k24View;K24.transform={x:0,y:0,k:1};renderDistant();return;}
 if(el.dataset.k24Order){ST.mapOrder=el.dataset.k24Order;K24.evidencePage=0;K24.transform={x:0,y:0,k:1};renderDistant();return;}
 if(el.dataset.k24Unit){
  const t=el.dataset.k24Unit;if(V2.units.has(t))V2.units.delete(t);else V2.units.add(t);
  ST.tid=t;K24.evidencePage=0;K24.focus=null;renderDistant();return;
 }
 if(el.dataset.k24Edge){
  const edge=K24_GRAPH.edges[+el.dataset.k24Edge];
  if(edge.term)k24Focus("term",edge.term);else k24Focus("root",edge.root);return;
 }
 if(el.dataset.k24Pair){
  const [a,b]=JSON.parse(el.dataset.k24Pair);K24.focus={kind:"pair",a,b};K24.evidencePage=0;
  document.getElementById("k24Evidence").outerHTML=k24EvidenceHTML();
  document.getElementById("k24Evidence").scrollIntoView({block:"nearest",behavior:"smooth"});return;
 }
 if(el.dataset.k24Flowpoint){
  const [rootid,t]=el.dataset.k24Flowpoint.split("|");
  K24.focus={kind:"root",id:rootid};V2.units.add(t);K24.evidencePage=0;renderDistant();return;
 }
 if(el.dataset.k24Page){
  K24.evidencePage=Math.max(0,K24.evidencePage+(+el.dataset.k24Page));
  if(document.getElementById("detail").open)k24EvidenceModal();else document.getElementById("k24Evidence").outerHTML=k24EvidenceHTML();return;
 }
 if(el.dataset.k24Zoom){
  if(el.dataset.k24Zoom==="reset"){K24.transform={x:0,y:0,k:1};}
  else K24.transform.k=Math.min(4,Math.max(.45,K24.transform.k*(el.dataset.k24Zoom==="in"?1.2:1/1.2)));
  document.getElementById("k24Plot")?.setAttribute("transform",`translate(${K24.transform.x},${K24.transform.y}) scale(${K24.transform.k})`);return;
 }
 if(el.dataset.k24SettingClick){K24[el.dataset.k24SettingClick]=el.dataset.value;K24.focus=null;K24.evidencePage=0;renderDistant();return;}
 if(el.dataset.k24Legacy){ST.lens=el.dataset.k24Legacy;v21OpenView("stage");return;}
},true);
document.addEventListener("change",e=>{
 const el=e.target;
 if(el.dataset.k24Root){e.stopImmediatePropagation();k24ToggleRoot(el.dataset.k24Root);return;}
 if(el.dataset.k24Term){e.stopImmediatePropagation();k24ToggleTerm(el.dataset.k24Term);return;}
 if(el.dataset.k24Extra){e.stopImmediatePropagation();el.checked?V2.selected.add(el.dataset.k24Extra):V2.selected.delete(el.dataset.k24Extra);k24Changed();return;}
 if(el.dataset.k24Switch){
  e.stopImmediatePropagation();K24[el.dataset.k24Switch]=el.checked;
  const y=scrollY;if(STATE.view==="read")renderRead();else renderDistant();
  requestAnimationFrame(()=>window.scrollTo({top:y,behavior:"instant"}));return;
 }
 if(el.dataset.k24Setting){e.stopImmediatePropagation();K24[el.dataset.k24Setting]=el.dataset.k24Setting==="wordLimit"?+el.value:el.value;renderDistant();return;}
 if(el.hasAttribute("data-k24-collapse")){
  e.stopImmediatePropagation();V2.collapse=el.checked;V2.units=new Set([...V2.units].map(v2DisplayT));K24.evidencePage=0;
  K24.positions.clear();K24.transform={x:0,y:0,k:1};renderDistant();return;
 }
},true);
document.addEventListener("keydown",e=>{
 if((e.key==="Enter"||e.key===" ")&&e.target.matches("svg [tabindex],mark[data-k24-hit]")){
  e.preventDefault();e.target.dispatchEvent(new MouseEvent("click",{bubbles:true}));
 }
},true);
// Cross-view selection changes stay synchronized with legacy maps.
const K24_OLD_TOGGLE=v2Toggle;
v2Toggle=function(id){K24_OLD_TOGGLE(id);if(K24.ready){k24Reindex();k24Save();}};
const K24_OLD_RENDER=render;
render=function(){
 if(K24.ready)k24Reindex();K24_OLD_RENDER();
 if(K24.ready&&["read","distant"].includes(STATE.view))document.querySelector("#content > .v2-global-dock")?.remove();
 if(K24.ready&&STATE.view==="stage"){
  document.getElementById("content")?.insertAdjacentHTML("afterbegin",'<div class="k24-prominent-return"><button data-k24-command="distant">מפת הרשתות, המילים והזרימה ←</button><span>כל הבחירות נשמרות גם בכלי המחקר שלמטה</span></div>');
 }
};
function k24SourceGuard(data){
 if(data.productionId!==D.production.id)throw new Error("Knowledge/text production mismatch");
 if(data.source.xmlSha256!==D.provenance.sha256.xml)throw new Error("Knowledge belongs to a different source revision");
 for(const o of data.observations){
  const p=D.paragraphs.find(p=>p.id===o.anchor.paragraphId);
  if(!p||p.t!==o.anchor.unitId)throw new Error("Knowledge anchor not present in loaded edition: "+o.id);
  const chars=Array.from(p.text),a=o.anchor;
  if(a.offset<0||a.offset>chars.length)throw new Error("Source anchor is outside paragraph: "+o.id);
  if(a.range&&(a.range.start<0||a.range.end>chars.length||a.range.start>=a.range.end||chars.slice(a.range.start,a.range.end).join("")!==a.range.exact))throw new Error("Source quotation does not match anchor: "+o.id);
 }
}
async function k24Boot(){
 for(let i=0;i<240&&(typeof D==="undefined"||!D?.paragraphs);i++)await new Promise(r=>setTimeout(r,50));
 if(typeof D==="undefined"||!D?.paragraphs)throw new Error("Edition was not loaded");
 const id=D.production.id;
 let provider;
 if(!window.__HAMATATE_STANDALONE__&&/^https?:$/.test(location.protocol)){
  const manifest=await fetch("manifest.json").then(r=>{if(!r.ok)throw new Error("No root manifest");return r.json()});
  const conf=manifest.knowledgeProvider||{mode:"static"};
  provider=conf.mode==="api"?new HamatateKnowledge.ApiProvider(conf.baseUrl,conf):new HamatateKnowledge.StaticProvider(".",conf.registry||{});
 }else provider=new HamatateKnowledge.EmbeddedProvider(window.__KNOWLEDGE_DATA__);
 const data=await provider.loadProduction(id);
 k24SourceGuard(data);K24.data=data;k24InjectRegistry();
 let saved=null;try{saved=JSON.parse(localStorage.getItem("hamatate-knowledge-v24"));}catch{}
 if(saved){
  V2.selected=new Set((saved.selected||[]).filter(id=>v2Data().all[id]));K24.excluded=new Set((saved.excluded||[]).filter(id=>K24.children.has(id)));
 }else{
  // Transparent initial view of source-tagged knowledge, not invented topic assignments.
  V2.selected=new Set(["knowledge:tradition","knowledge:consumption","knowledge:mass-media"].filter(id=>K24.roots.has(id)));
 }
 K24.ready=true;k24Reindex();
 window.HAMATATE_KNOWLEDGE={
  state:K24,provider,active:k24Active,evidence:k24EvidencePool,guard:k24SourceGuard,
  async setProvider(nextProvider){
   const data=await nextProvider.loadProduction(D.production.id);k24SourceGuard(data);
   HamatateKnowledge.validate(data,D.production.id);
   const registry=v2Data();
   for(const [id,d] of Object.entries(registry.all))if(d.group==="knowledge")delete registry.all[id];
   registry.groups.knowledge=[];
   K24.data=data;K24.roots.clear();K24.children.clear();k24InjectRegistry();
   V2.selected=new Set([...V2.selected].filter(id=>registry.all[id]));
   K24.excluded=new Set([...K24.excluded].filter(id=>K24.children.has(id)));
   K24.focus=null;K24.evidencePage=0;K24.cursor=-1;k24Reindex();render();this.provider=nextProvider;
  },
  open:()=>{K24.view="graph";v21OpenView("distant");}
 };
 render();
}
k24Boot().catch(error=>{
 K24.error=String(error);console.error("Knowledge layer did not load:",error);
 const el=document.createElement("div");el.className="k24-load-error";
 el.textContent="שכבת הרשתות לא נטענה: "+error.message+". הטקסט וכלי המהדורה נשארים זמינים; אין שימוש שקט בנתוני רשת מגרסה אחרת.";
 document.getElementById("content").prepend(el);
});

document.addEventListener("toggle",e=>{
 if(e.target.matches?.(".k24-read-selection"))K24.readSelectionOpen=e.target.open;
 if(e.target.dataset?.k24Disclosure)K24.disclosures.set(e.target.dataset.k24Disclosure,e.target.open);
},true);

// A note remains source text; its explicit labels link to knowledge without rewriting the note.
function k24NoteLinks(noteId){
 if(!K24.ready)return "";
 const roots=[...new Set(K24.data.observations.filter(o=>o.noteId===String(noteId)).map(o=>k24RootId(o.categoryId.split(":")[1])))];
 if(!roots.length)return "";
 return `<div class="k24-note-bodies"><small>גופי ידע שסומנו בהערה</small>${roots.map(id=>{const r=K24.roots.get(id);return r?`<button data-k24-note-body="${k24Esc(id)}" style="--k-color:${r.color}">${k24Esc(r.sourceLabel)} ↗</button>`:""}).join("")}<small>פתיחה מוסיפה לבחירה הקיימת, לא מחליפה אותה.</small></div>`;
}
const K24_NOTE_SIDE=v22NoteDetail;
v22NoteDetail=function(id){K24_NOTE_SIDE(id);document.querySelector(".v22-open-note")?.insertAdjacentHTML("beforeend",k24NoteLinks(id));};
const K24_NOTE_POPUP=openNote;
openNote=function(id){K24_NOTE_POPUP(id);document.querySelector("#detail .detail-links")?.insertAdjacentHTML("beforebegin",k24NoteLinks(id));};
document.addEventListener("click",e=>{
 const el=e.target.closest("[data-k24-note-body]");
 if(!el)return;
 e.preventDefault();e.stopImmediatePropagation();const id=el.dataset.k24NoteBody;
 V2.selected.add(id);k24Reindex();k24Save();K24.focus={kind:"root",id};K24.view="graph";K24.evidencePage=0;
 closePop();v21OpenView("distant");
},true);
