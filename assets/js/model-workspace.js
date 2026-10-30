/* Shared data-model workspace, migrated intact from the original model.
   Shadow DOM isolates its diagrams and inspectors from the edition UI. */
(function(){
'use strict';
let root, activeTab='relationModel';
const tabs=['relationModel','exampleModel','editionModel','sheetModel'];
const originals=new WeakMap();
let pending=false;
function english(){return window.HAMATATE_I18N?.lang==='en'}
function localize(){
 if(!root)return;
 const en=english(),map=window.MODEL_EN||{};
 root.querySelectorAll('.model-page-tab').forEach(b=>b.setAttribute('aria-selected',String(b.classList.contains('on'))));
 root.querySelector('.model-root').dir=en?'ltr':'rtl';
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 let n;while(n=walker.nextNode()){
  if(n.parentElement?.closest('style,script'))continue;
  if(!originals.has(n))originals.set(n,n.textContent);
  const raw=originals.get(n),key=raw.trim();
  const next=en&&map[key]?raw.replace(key,map[key]):raw;
  if(n.textContent!==next)n.textContent=next;
 }
 root.querySelectorAll('[title],[aria-label]').forEach(el=>{
  for(const attr of ['title','aria-label']){if(!el.hasAttribute(attr))continue;const key='modelOriginal'+attr.replace('-','');if(!el.dataset[key])el.dataset[key]=el.getAttribute(attr);const raw=el.dataset[key];el.setAttribute(attr,en?(map[raw]||raw):raw);}
 });
 root.querySelectorAll('svg text[direction]').forEach(n=>n.setAttribute('direction',en?'ltr':'rtl'));
 // Fit translated node labels within their original diagram geometry.
 root.querySelectorAll('.kg-node,.sg-node').forEach(g=>{const width=Number(g.querySelector('rect')?.getAttribute('width'))-16;g.querySelectorAll('text').forEach(t=>{t.removeAttribute('textLength');if(t.getComputedTextLength?.()>width){t.setAttribute('textLength',String(width));t.setAttribute('lengthAdjust','spacingAndGlyphs')}})});
}
function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;localize()})}
function openExample(view){const tid=root?.querySelector('[data-model-focus=king].on')?'A228401-T11':'A228401-T16';if(view==='stage'){ST.tid=tid;ST.lens='surface';ST.zoom='unit';}v21OpenView(view);if(view==='read'){STATE.selectedT=tid;render();setHash();jump(tid)}}
function renderWorkspace(){
 if(typeof OBS!=='undefined')OBS?.disconnect();
 if(typeof V22!=='undefined')V22.notesObserver?.disconnect();
 if(typeof v2Stop==='function')v2Stop();
 document.body.classList.add('v21-at-global');document.body.classList.remove('v21-at-production');
 document.querySelectorAll('[data-v21-global]').forEach(b=>b.classList.toggle('active',b.dataset.v21Global==='model'));
 const main=document.getElementById('content');main.innerHTML='<section id="modelWorkspaceHost" aria-label="Data model / מודל הנתונים"></section>';
 root=main.firstElementChild.attachShadow({mode:'open'});
 root.innerHTML='<style>'+MODEL_WORKSPACE.css+'</style><div class="model-root">'+MODEL_WORKSPACE.html+'</div>';
 const scoped={querySelectorAll:s=>root.querySelectorAll(s),querySelector:s=>root.querySelector(s),getElementById:id=>root.getElementById(id),createElementNS:(...a)=>document.createElementNS(...a)};
 window.mountModelWorkspace(scoped,openExample);
 root.querySelectorAll('[data-go-view]').forEach(b=>b.onclick=()=>openExample('read'));
 root.querySelectorAll('.model-page-tab').forEach(b=>b.addEventListener('click',()=>{activeTab=b.dataset.modelView;history.replaceState(null,'','#model/'+activeTab);schedule()}));
 const requested=location.hash.split('/')[1];if(tabs.includes(requested))activeTab=requested;
 root.querySelector('[data-model-view="'+activeTab+'"]').click();
 root.querySelectorAll('.model-page-tab').forEach(b=>{b.setAttribute('role','tab');b.setAttribute('aria-controls',b.dataset.modelView)});
 root.querySelector('.model-page-tabs').setAttribute('role','tablist');
 root.querySelectorAll('.model-panel').forEach(p=>p.setAttribute('role','tabpanel'));
 root.querySelectorAll('.kg-edge-group,.sg-edge-group').forEach(g=>{g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',g.dataset.edge);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();g.dispatchEvent(new MouseEvent('click',{bubbles:true}))}})});
 root.addEventListener('click',schedule,true);root.addEventListener('keydown',schedule,true);
 localize();
}
const previousRender=render;
render=function(){if(STATE.view==='model'||(STATE.view==='about'&&V22.aboutTab==='knowledge')){STATE.view='model';renderWorkspace();return}root=null;previousRender()};
const previousOpen=v21OpenView;
v21OpenView=function(view,id){if(view==='model'){STATE.view='model';render();window.scrollTo({top:0});return}previousOpen(view,id)};
const priorSetHash=setHash;
setHash=function(){if(STATE.view==='model'){history.replaceState(null,'','#model/'+activeTab);return}priorSetHash()};
const previousHash=readHash;
readHash=function(){if(location.hash==='#about'){STATE.view='about';V22.aboutTab='matate';return}if(/^#(?:model|data-model|about\/knowledge)(?:\/|$)/.test(location.hash)){STATE.view='model';return}previousHash()};
new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
window.HAMATATE_MODEL={get root(){return root},refresh:localize};
if(typeof D!=='undefined'&&D){readHash();render();}
})();
