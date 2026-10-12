#!/usr/bin/env python3
"""Derive traceable knowledge categories from explicit 'אזכור ...' in source notes.
No source text is rewritten, no externally inferred language or topic is added.
"""
import argparse, collections, hashlib, json, re, unicodedata
from pathlib import Path
from lxml import etree

CATEGORY_SPEC = [
 ("tradition", "מסורת יהודית", "topic", "#945463"),
 ("consumption", "תרבות צריכה", "topic", "#B37335"),
 ("mass-media", "תקשורת המונים", "topic", "#287E88"),
 ("profession", "מקצוע", "entity-kind", "#5E8270"),
 ("concept", "מושג", "entity-kind", "#6B718A"),
 ("people-mentioned", "אישים", "entity-kind", "#6E639D"),
 ("places-plural", "מקומות", "entity-kind", "#538574"),
 ("place", "מקום", "entity-kind", "#497A69"),
 ("institution", "מוסד", "entity-kind", "#587E91"),
 ("cultural-reference", "תרבותי", "topic", "#9A784B"),
 ("culture", "תרבות", "topic", "#9E824E"),
 ("weapon", "נשק", "entity-kind", "#A56052"),
 ("current-affairs", "אקטואליה", "topic", "#75804C"),
]
SUBJECT_KINDS = {"מושג","אישים","מקום","מקומות","מוסד","מקצוע"}
def jread(p): return json.loads(p.read_text(encoding="utf-8"))
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def stable(s): return hashlib.sha256(s.encode()).hexdigest()[:16]
def normalize(s):
    return "".join(c for c in unicodedata.normalize("NFD",s)
                   if not ("\u0591" <= c <= "\u05c7") and c not in "\u200e\u200f\u202a\u202b\u202c\u2066\u2067\u2069").replace("־","-")
def normalized_map(s):
    chars=[]; offsets=[]
    for i,c in enumerate(s):
        for v in normalize(c):
            chars.append(v); offsets.append(i)
    return "".join(chars), offsets

def label_from_tail(s):
    s=re.split(r'https?://',s)[0].strip(" \t\n–—-:;,.")
    s=re.split(r'\s[–—]\s|\s-\s|\s*\(',s,maxsplit=1)[0]
    s=re.split(r'\.\s',s,maxsplit=1)[0].strip(" \t\n:;,.–—")
    if len(s)>65: return None  # long prose is not converted to a purported concept
    return s or None

def plain_context(s):
    s=re.sub(r'</?[A-Za-z0-9_.-]+>','',s)
    s=re.sub(r'\[\[.*?\]\]|/{4}','',s)
    return re.sub(r'\s+',' ',s).strip()

def anchor_of(p,offset,subject):
    # The footnoteReference position is authoritative; a lexical range is secondary.
    offset=min(max(0,int(offset)),len(p["text"]))
    text=p["text"]; prefix=text[:offset]; exact=None
    if subject:
        nt,om=normalized_map(prefix); query=normalize(subject)
        idx=nt.rfind(query,max(0,len(nt)-140))
        if idx>=0 and query:
            a,b=om[idx],om[idx+len(query)-1]+1
            if not re.search(r'<[^>]*$',text[:a]):
                exact={"start":a,"end":b,"exact":text[a:b],"status":"exact-subject-match"}
    visible=plain_context(prefix)
    context=" ".join(visible.split()[-5:])[-60:]
    return {
      "paragraphId":p["id"],"paragraphNumber":p["n"],"sourceParagraphId":p.get("paraId"),
      "unitId":p["t"],"offset":offset,
      "precision":"footnote-point",
      "contextBefore":context,
      "range":exact,
      "selectors":[
        {"type":"FragmentSelector","value":p["id"]},
        {"type":"TextPositionSelector","start":offset,"end":offset}
      ],
      "textCoordinateSystem":"Unicode code points in the immutable source paragraph; not rendered HTML"
    }

def main(root,prod):
    pr=root/"productions"/prod
    edition_file=pr/"data/edition.json"; d=jread(edition_file)
    xmlfile=pr/"sources/ki_tetze_23_9_26.xml"
    if not xmlfile.exists():
        xmls=list((pr/"sources").glob("*.xml"))
        xmlfile=xmls[0] if len(xmls)==1 else None
    paragraphs={p["n"]:p for p in d["paragraphs"]}
    cat_by_label={v[1]:v for v in CATEGORY_SPEC}
    pattern=re.compile(r'אזכור\s+('+'|'.join(re.escape(x) for x in sorted(cat_by_label,key=len,reverse=True))+r')(?=\s|$|[.:;,])')
    counts=collections.Counter(); categories={}; terms={}; observations=[]; notes={}; unknown=[]
    for f in d["footnotes"].values():
        text=f["text"]; matches=list(pattern.finditer(text)); labels=[]
        for m in matches:
            if m[1] not in labels:labels.append(m[1])
        spans=[]
        for m in matches:
            nxt=re.search(r'אזכור\s+',text[m.end():])
            stop=m.end()+nxt.start() if nxt else len(text)
            tail=label_from_tail(text[m.end():stop])
            spans.append({"label":m[1],"start":m.start(),"end":m.end(),"raw":m[0],"followingText":text[m.end():stop].strip(),"subject":tail if m[1] in SUBJECT_KINDS else None})
        recognized_starts={m.start() for m in matches}
        for m in re.finditer(r'אזכור\s+',text):
            if m.start() not in recognized_starts:
                unknown.append({"noteId":str(f["id"]),"offset":m.start(),"text":text[m.start():],"status":"unrecognized-category"})
        subjects=[s["subject"] for s in spans if s["subject"]]
        # Do not guess the subject when multiple explicit subjects share the note.
        primary=subjects[0] if len(set(subjects))==1 else None
        noteid=str(f["id"])
        notes[noteid]={"id":noteid,"displayNumber":f.get("display_number",f["id"]),"text":text,"internal":f.get("internal",False),"links":f.get("links",[]),"assignments":spans}
        for label in labels:
            slug,_,kind,color=cat_by_label[label]
            cid="note-category:"+slug
            categories.setdefault(cid,{"id":cid,"label":label,"sourceLabel":"אזכור "+label,"kind":kind,"color":color,"basis":"explicit-editorial-note","termIds":[],"observationIds":[]})
            for oi,o in enumerate(f.get("occurrences",[])):
                p=paragraphs.get(o["p"])
                if not p or p.get("t") not in d["text_records"]:continue
                anch=anchor_of(p,o["offset"],primary)
                if primary:
                    term_label=primary; term_kind="explicit-note-subject"
                else:
                    term_label=anch["contextBefore"] or ("הערה "+noteid)
                    term_kind="anchor-context"
                termid="term:"+stable(term_kind+"|"+term_label)
                terms.setdefault(termid,{"id":termid,"label":term_label,"kind":term_kind,"categoryIds":[]})
                if cid not in terms[termid]["categoryIds"]:terms[termid]["categoryIds"].append(cid)
                if termid not in categories[cid]["termIds"]:categories[cid]["termIds"].append(termid)
                oid=f"{prod}:note:{noteid}:{oi}:{slug}"
                observations.append({"id":oid,"productionId":prod,"noteId":noteid,"categoryId":cid,"termId":termid,"anchor":anch,
                  "basis":"explicit-editorial-note","assignment":next(s for s in spans if s["label"]==label),
                  "subjectStatus":term_kind,
                  "relationToSubject":"co-described-in-note" if primary else "context-of-reference",
                  "source":{"path":str(xmlfile.relative_to(root)) if xmlfile else None,"part":"/word/footnotes.xml","footnoteId":noteid}})
                categories[cid]["observationIds"].append(oid)
                counts[label]+=1
    # Validate retained note text against Word-XML footnote bodies; not just JSON extraction.
    verified=0; differences=[]
    if xmlfile:
        tree=etree.parse(str(xmlfile))
        ns={"pkg":"http://schemas.microsoft.com/office/2006/xmlPackage","w":"http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
        for f in tree.xpath('//pkg:part[@pkg:name="/word/footnotes.xml"]//w:footnote',namespaces=ns):
            fid=f.get("{"+ns["w"]+"}id")
            if fid not in notes:continue
            raw=" ".join("".join(p.xpath('.//w:t/text()|.//w:delText/text()',namespaces=ns)) for p in f.findall("w:p",ns))
            if re.sub(r"\s+"," ",raw).strip()==re.sub(r"\s+"," ",notes[fid]["text"]).strip(): verified+=1
            else: differences.append({"noteId":fid,"reason":"text-extraction-difference"})
    for c in categories.values():
        obs=[x for x in observations if x["categoryId"]==c["id"]]
        c["noteCount"]=len({x["noteId"] for x in obs})
        c["paragraphCount"]=len({x["anchor"]["paragraphId"] for x in obs})
        c["unitCount"]=len({x["anchor"]["unitId"] for x in obs})
    data={"schemaVersion":"hamatate.knowledge/1.0","productionId":prod,
          "source":{"edition":str(edition_file.relative_to(root)),"editionSha256":sha(edition_file),
                    "xml":str(xmlfile.relative_to(root)) if xmlfile else None,"xmlSha256":sha(xmlfile) if xmlfile else None},
          "categories":list(categories.values()),"terms":list(terms.values()),"observations":observations,"notes":notes,
          "diagnostics":{"noteCount":len(notes),"categorizedNotes":len({o["noteId"] for o in observations}),
                         "assignments":len(observations),"categoryCount":len(categories),"countsByExactLabel":dict(counts),
                         "unrecognized":unknown,"sourceNoteTextsVerified":verified,"sourceTextDifferences":differences,
                         "exactSubjectRanges":sum(bool(o["anchor"]["range"]) for o in observations),
                         "rules":"Longest exact category label wins; no collapsing of culture/consumption or place/places. Untyped prose is not a category."},
          "method":{"subjectExtraction":"Short explicit tail of concept/person/place/institution/profession label only; biographical prose remains in source note.",
                    "context":"When no explicit subject is given, displayed words are context before the footnote, not an asserted semantic span.",
                    "grouping":"Lexically identical note labels are grouped for navigation, not equated as historical people or concepts.",
                    "overlap":"Same footnote / paragraph / unit, explicitly selectable; never a proven conceptual relationship."}}
    out=pr/"data/knowledge.json";out.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding="utf-8")
    (pr/"data/knowledge-runtime.js").write_text("window.__KNOWLEDGE_DATA__="+json.dumps(data,ensure_ascii=False,separators=(",",":")).replace("</","<\\/")+";\n",encoding="utf-8")
    print(json.dumps(data["diagnostics"],ensure_ascii=False,indent=2))
    return data

if __name__=="__main__":
    ap=argparse.ArgumentParser();ap.add_argument("--root",type=Path,default=Path(__file__).resolve().parents[1]);ap.add_argument("--production",default="A228401")
    args=ap.parse_args();main(args.root,args.production)
