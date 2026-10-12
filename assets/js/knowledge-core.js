/* Hamatate knowledge layer: schema, providers, metrics. UI-independent. */
(function(global){
"use strict";
const SCHEMA="hamatate.knowledge/1.0";
const uniq=a=>[...new Set(a)];
function validate(data,expectedId){
 if(!data||data.schemaVersion!==SCHEMA)throw new Error("Unsupported knowledge schema");
 if(expectedId&&data.productionId!==expectedId)throw new Error("Production identifier mismatch");
 if(!Array.isArray(data.categories)||!Array.isArray(data.terms)||!Array.isArray(data.observations)||!data.notes)throw new Error("Missing knowledge collections");
 if(!data.source||typeof data.source.xmlSha256!=="string"||!data.productionId)throw new Error("Missing source revision");
 for(const list of [data.categories,data.terms]){
  const keys=new Set();for(const x of list){if(!x.id||keys.has(x.id)||typeof x.label!=="string")throw new Error("Invalid or duplicate knowledge entity");keys.add(x.id);}
 }
 for(const c of data.categories){if(!/^#[0-9a-fA-F]{6}$/.test(c.color))throw new Error("Invalid category color");}
 const cats=new Set(data.categories.map(x=>x.id)),terms=new Set(data.terms.map(x=>x.id)),ids=new Set();
 for(const c of data.categories){if(!Array.isArray(c.termIds)||c.termIds.some(id=>!terms.has(id)))throw new Error("Category has missing terms");}
 for(const o of data.observations){
  if(ids.has(o.id))throw new Error("Duplicate observation: "+o.id);ids.add(o.id);
  if(!cats.has(o.categoryId)||!terms.has(o.termId)||!data.notes[o.noteId])throw new Error("Broken observation references: "+o.id);
  if(!o.anchor?.paragraphId||!o.anchor?.unitId||!Number.isInteger(o.anchor.offset))throw new Error("Missing source anchor");
 }
 return data;
}
async function requestJSON(url,signal){
 const r=await fetch(url,{signal,credentials:"same-origin",headers:{Accept:"application/json"}});
 if(!r.ok)throw new Error("Data request failed ("+r.status+"): "+url);
 return r.json();
}
class StaticProvider{
 constructor(base=".",registry={}){this.base=new URL(base.endsWith("/")?base:base+"/",location.href);this.registry=registry;this.cache=new Map();}
 async loadProduction(id,{signal}={}){
  if(this.cache.has(id))return this.cache.get(id);
  const path=this.registry[id]||`productions/${encodeURIComponent(id)}/data/knowledge.json`;
  const data=validate(await requestJSON(new URL(path,this.base),signal),id);
  this.cache.set(id,data);return data;
 }
}
class ApiProvider{
 constructor(base,{endpoint="productions/{id}/knowledge",pageLimit=100}={}){this.base=new URL(base.endsWith("/")?base:base+"/",location.href);this.endpoint=endpoint;this.pageLimit=pageLimit;this.cache=new Map();}
 async loadProduction(id,{signal}={}){
  if(this.cache.has(id))return this.cache.get(id);
  let url=new URL(this.endpoint.replace("{id}",encodeURIComponent(id)),this.base),seen=new Set(),data=null;
  for(let page=0;url&&page<this.pageLimit;page++){
   if(seen.has(url.href))throw new Error("Repeated API page");seen.add(url.href);
   const part=await requestJSON(url,signal);validate(part,id);
   if(!data)data={...part,observations:[...part.observations]};
   else{
    if(data.source?.xmlSha256!==part.source?.xmlSha256)throw new Error("Mixed source revisions in API pagination");
    const merge=(a,b)=>[...new Map([...a,...b].map(v=>[v.id,v])).values()];
    data.categories=merge(data.categories,part.categories);data.terms=merge(data.terms,part.terms);
    data.notes={...data.notes,...part.notes};data.observations.push(...part.observations);
   }
   if(part.next){
    const next=new URL(part.next,url);
    if(next.origin!==this.base.origin)throw new Error("API pagination changed origin");
    url=next;
   }else url=null;
  }
  if(url)throw new Error("API pagination limit exceeded");
  delete data.next;validate(data,id);this.cache.set(id,data);return data;
 }
}
class EmbeddedProvider{
 constructor(data){this.data=data;}
 async loadProduction(id){return validate(this.data,id);}
}
function categoryIndex(data){
 const terms=Object.fromEntries(data.terms.map(x=>[x.id,x]));
 return data.categories.map(c=>({...c,terms:c.termIds.map(id=>terms[id]).filter(Boolean),
   observations:data.observations.filter(o=>o.categoryId===c.id)}));
}
function deduplicate(obs){return [...new Map(obs.map(h=>[h.evidenceKey||h.id,h])).values()];}
function coverage(hits,paragraphs){
 const set=new Set(paragraphs.map(p=>typeof p==="string"?p:p.id));
 const eligible=hits.filter(h=>set.has(h.paragraphId||h.anchor?.paragraphId));
 const n=new Set(eligible.map(h=>h.paragraphId||h.anchor.paragraphId)).size;
 return {paragraphs:n,denominator:set.size,percent:set.size?100*n/set.size:0};
}
function intersection(a,b,scope="paragraph"){
 const key=h=>scope==="note"?(h.noteId?String(h.noteId):null):scope==="unit"?(h.t||h.anchor?.unitId):(h.paragraphId||h.anchor?.paragraphId);
 const aa=new Set(a.map(key).filter(x=>x!==null)), bb=new Set(b.map(key).filter(x=>x!==null));
 return [...aa].filter(x=>bb.has(x));
}
global.HamatateKnowledge={SCHEMA,validate,StaticProvider,ApiProvider,EmbeddedProvider,categoryIndex,deduplicate,coverage,intersection,uniq};
if(typeof module!=="undefined")module.exports=global.HamatateKnowledge;
})(typeof window!=="undefined"?window:globalThis);
