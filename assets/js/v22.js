 'use strict';
/* V2.2: archive-first scholarly reader; never transforms the underlying corpus or XML. */
const V22={aboutTab:'matate',showNotes:true,activeNote:null,activeTid:null,notesObserver:null};
function v22AboutMarkup(){const tabs=[['matate','אודות המטאטא'],['project','אודות הפרויקט'],['partners','שותפים'],['knowledge','מפת הידע והשיטה']];return `<div class="v22-about"><section class="v22-about-hero"><span class="v21-eyebrow">מאחורי הארכיון</span><h1>אודות המטאטא</h1><p>כאן יופיע מידע על התיאטרון, הפרויקט והשותפים. מפת הידע וההסבר על מבנה הנתונים הועברו למרחב זה כדי שיישארו משותפים לכל ההצגות.</p></section><nav class="v22-about-nav" aria-label="אודות האתר">${tabs.map(([k,t])=>`<button data-v22-about="${k}" class="${V22.aboutTab===k?'on':''}">${t}</button>`).join('')}</nav><div class="v22-about-inner" id="v22AboutInner"></div></div>`}
function v22RenderAbout(){const main=document.getElementById('content');main.innerHTML=v22AboutMarkup();if(V22.aboutTab==='knowledge'){renderModel();const md=main.innerHTML;main.innerHTML=v22AboutMarkup();document.getElementById('v22AboutInner').innerHTML=md;const hero=document.querySelector('#v22AboutInner>.hero');if(hero)hero.style.display='none';}else{const t=({matate:'אודות המטאטא',project:'אודות הפרויקט',partners:'שותפים'})[V22.aboutTab];document.getElementById('v22AboutInner').innerHTML=`<section class="v22-about-placeholder"><span class="v21-eyebrow">${t}</span><h2>${t}</h2><p>התוכן יתווסף בהמשך.</p></section>`;}}
const V22_RENDER=render;
render=function(){if(STATE.view==='model'){STATE.view='about';V22.aboutTab='knowledge';}
 if(STATE.view==='about'){v22RenderAbout();v21Header('about');document.body.classList.add('v21-at-global');document.body.classList.remove('v21-at-production');document.querySelectorAll('[data-v21-global]').forEach(b=>b.classList.toggle('active',b.dataset.v21Global==='about'));return;}
 V22_RENDER();};
const V22_READ=renderRead;
renderRead=function(){V22_READ();v22EnhanceRead();};
function v22EnhanceRead(){let main=document.getElementById('content');let hero=main.querySelector('.hero');if(!hero)return;let items=[];try{const d=v2Data();items=d.groups.networks.filter(k=>k.startsWith('network:')).map(k=>d.all[k]).filter(Boolean).slice(0,5)}catch(e){}
const html=`<section class="v22-reading-entry"><div><span class="v22-entry-brow">קריאה או מחקר — שתי נקודות כניסה אל אותו טקסט</span><h2>המחזה כמשטח של רשתות</h2><p>אפשר לקרוא את המחזה ברצף, או לראות עליו את חיי המושגים, האנשים והשכבות. הרשתות שנבחרות נשמרות גם במעבר למפה.</p><div class="v22-network-chips">${items.map(n=>`<button data-v22-network="${esc(n.id)}" style="--network-color:${n.color}" title="הצגת הופעות רשת זו על משטח המחזה">${esc(n.title)} <span>· ${n.hits.length}</span></button>`).join('')}</div></div><div class="v22-reading-actions"><button data-v22-map="content">רשתות התוכן על פני המחזה ←</button><button data-v22-map="surface">שכבות ה־XML על המשטח</button><button data-v22-map="actors">חיי השחקנים</button></div></section>`;
hero.insertAdjacentHTML('afterend',html);
const aside=main.querySelector('.reading-aside');if(aside){aside.insertAdjacentHTML('afterbegin',`<div class="panel v22-side-notes"><h3>הערות בשולי הקריאה</h3><label class="v22-aside-toggle"><input id="v22ShowNotes" type="checkbox" ${V22.showNotes?'checked':''}> הצגת הערות שוליים בטקסט ובשוליים</label><div class="v22-note-count" id="v22NoteCount"></div><div class="v22-note-list" id="v22NoteList"></div></div>`);}
main.classList.toggle('v22-notes-on',V22.showNotes);main.classList.toggle('v22-notes-off',!V22.showNotes);
main.querySelectorAll('[data-action="view"][data-value="model"]').forEach(b=>{b.textContent='כיצד בנוי מודל הידע? (אודות)'});
v22UpdateNotes(V22.activeTid||'A228401-T1');
if(V22.notesObserver)V22.notesObserver.disconnect();
V22.notesObserver=new IntersectionObserver(entries=>{const visible=entries.filter(x=>x.isIntersecting);if(visible.length){const tid=visible[0].target.dataset.tid;if(tid&&V22.activeTid!==tid){V22.activeTid=tid;v22UpdateNotes(tid);}}},{rootMargin:'-205px 0px -60% 0px',threshold:0});main.querySelectorAll('.text-segment[data-tid]').forEach(s=>V22.notesObserver.observe(s));}
function v22UpdateNotes(tid){const box=document.getElementById('v22NoteList'),count=document.getElementById('v22NoteCount');if(!box||!count)return;const fns=Object.values(D.footnotes).flatMap(f=>(f.occurrences||[]).filter(o=>o.t===tid).map(o=>({f,o}))).sort((a,b)=>a.o.p-b.o.p);count.textContent=`${D.text_records[tid]?.title||tid} · ${fns.length} הערות`;
if(!V22.showNotes){box.innerHTML='<div class="v22-note-off-help">הערות השוליים מוסתרות כרגע. הפעילו את המתג כדי להחזירן.</div>';return;}
box.innerHTML=fns.length?fns.map(({f,o})=>`<button class="v22-margin-note ${V22.activeNote===String(f.id)?'active':''}" data-v22-note="${esc(String(f.id))}" title="פתיחת ההערה ליד הטקסט"><b>${esc(String(f.display_number||f.id))}</b><span>${esc(f.text.slice(0,270))}${f.text.length>270?'…':''}</span></button>`).join(''):'<div class="v22-note-off-help">ביחידה זו אין הפניות להערות שוליים.</div>';
}
function v22GoView(which){if(which==='model'){V22.aboutTab='knowledge';which='about'}if(which==='about'){STATE.view='about';render();history.replaceState(null,'','#about');window.scrollTo({top:0,behavior:'smooth'});return;}v21OpenView(which);}
function v22NoteDetail(id){const f=D.footnotes[id];if(!f)return;V22.activeNote=String(id);const occ=f.occurrences?.[0];let tid=occ?.t||V22.activeTid;if(tid)V22.activeTid=tid;v22UpdateNotes(tid);const list=document.getElementById('v22NoteList');let el=list?.querySelector(`[data-v22-note="${CSS.escape(String(id))}"]`);if(el)el.scrollIntoView({block:'nearest',behavior:'smooth'});
const side=document.querySelector('.v22-side-notes');if(side){let prev=side.querySelector('.v22-open-note');if(prev)prev.remove();side.insertAdjacentHTML('beforeend',`<div class="v22-open-note"><b>הערה ${esc(String(f.display_number||id))}</b><div>${linkify(f.text)}</div><button data-v22-note-close>סגירת פירוט ההערה</button></div>`)}else openNote(id);}
// Accurate legend examples, not colored labels that fail to render the underlying phenomenon.
legend=function(){const samples=[
['hand','כתב יד','תוספת בכתב יד','כתב יד במקור; אין הבחנה מאומתת בין ידיים'],
['dram-del','מחוק דרמטורגית','מחיקה דרמטורגית','מחיקה דרמטורגית — חום וקו מחיקה'],
['text-del','מילה מחוקה','מחיקה טקסטואלית','מחיקה באמצעות קו חוצה'],
['hand-in-del','כתב יד מחוק','כתב יד בתוך מחיקה','שני מצבי העד נשמרים יחד'],
['stage','הוראת בימוי','הוראת בימוי','רקע ירוק וכתב נטוי'],
['heading','כותרת','כותרת פנימית','רקע טורקיז'],
['entity','שם אדם','זיהוי ישות','רקע צהוב — זיהוי מחקרי'],
['page','עמוד 24','מספור עמוד','רקע ורוד; עמוד דיגיטלי ונייר אינם תמיד זהים'],
['editorial','תיקון','הערת מהדיר','אפור — התערבות מחקרית'],
['music','תווים ♪','סימון מוזיקלי','אדום/ורוד במקור']
];pop('מפתח סימני המהדורה',`<h2>כך נראים הסימנים בטקסט</h2><p>כל דוגמה להלן מוצגת <b>כפי שהסימן מתבטא</b> בקריאה; הצבע אינו מחליף את משמעות הקוד.</p><div class="v22-legend-grid">${samples.map(([cl,sample,title,desc])=>`<div class="v22-legend-item"><span class="sample ${cl}">${sample}</span><b>${title}</b><small>${desc}</small></div>`).join('')}</div><div class="banner">T מציין גבול יחידת טקסט; R מציין תפקיד ולא אדם; MOVE/SWAP מתעדים פעולות עריכה. 529 ההערות מקושרות לפסקאות המקור, והצגתן נשלטת בנפרד מסימני העריכה.</div>`);};
const V22_OPEN=v21OpenView;
v21OpenView=function(which,id){if(which==='model'||which==='about'){v22GoView(which);return;}V22_OPEN(which,id);};
// About and network shortcuts run during capture, before older global handlers.
document.addEventListener('click',e=>{const b=e.target.closest('[data-v22-about],[data-v22-map],[data-v22-network],[data-v22-note],[data-v22-note-close]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
if(b.dataset.v22About){V22.aboutTab=b.dataset.v22About;v22GoView('about');return;}
if(b.dataset.v22Map){ST.lens=b.dataset.v22Map;v22GoView('stage');return;}
if(b.dataset.v22Network){V2.selected.add(b.dataset.v22Network);ST.lens='content';v22GoView('stage');return;}
if(b.dataset.v22Note){v22NoteDetail(b.dataset.v22Note);return;}
if(b.hasAttribute('data-v22-note-close')){b.closest('.v22-open-note')?.remove();return;}
},true);
document.addEventListener('change',e=>{if(e.target?.id==='v22ShowNotes'){V22.showNotes=e.target.checked;document.getElementById('content').classList.toggle('v22-notes-off',!V22.showNotes);document.getElementById('content').classList.toggle('v22-notes-on',V22.showNotes);v22UpdateNotes(V22.activeTid||'A228401-T1');}},true);
// Clicking a footnote marker takes the note to the side instead of replacing the reading with a modal.
document.addEventListener('click',e=>{const mark=e.target.closest('.reading-layout .fn[data-action="note"]');if(mark&&STATE.view==='read'&&V22.showNotes){e.preventDefault();e.stopImmediatePropagation();v22NoteDetail(mark.dataset.value);}},true);
// preserve older links to knowledge model: they now open the global About workspace.
const V22_SETHASH=setHash;setHash=function(){if(STATE.view==='about'){history.replaceState(null,'','#about'+(V22.aboutTab==='knowledge'?'/knowledge':''));return}V22_SETHASH();};
// Initial route handling: a prior #model link becomes the common knowledge model in About.
if(location.hash==='#about'||location.hash.startsWith('#about/')){V22.aboutTab=location.hash.includes('knowledge')?'knowledge':'matate';STATE.view='about';render();}
