"""Build verifiable, explicitly typed content exploration indexes.
No inferred language, concept tagging or discourse assignment is asserted.
"""
import json,re,collections,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
D=json.loads((root/'data/edition.json').read_text(encoding='utf-8'))
TAG=json.loads((root/'data/tagging_layer.json').read_text(encoding='utf-8'))
seq=sorted(D['text_records'],key=lambda s:int(s.rsplit('T',1)[1]))
PARAS=[p for p in D['paragraphs'] if p['t'] in seq]
# CURATED SEARCH PRESETS, NOT AUTHORITY-FILE / ANNOTATION NETWORKS.
# Exact whole Hebrew token (after removing niqqud), not substring roots that produce false hits.
PRESETS={
 'judaism':{'name':'יהדות ומסורת','color':'#8f666c','terms':['יהודי','יהודים','יהודיה','יהודייה','יהדות','שבת','מצוה','מצווה','אלהים','אלוהים','תורה','תפילה','רבי','רבנו','משיח','מקרא']},
 'war':{'name':'מלחמה וביטחון','color':'#bb8154','terms':['מלחמה','מלחמת','מלחמות','חייל','חיילים','החיילים','צבא','הצבא','התקפה','התקפת','התקפות','גז','גזים','הגזים','מקלט','המקלט','נשק','פצצה','טנדר','הטנדר','חזית']},
 'media':{'name':'תקשורת וחדשות','color':'#478b8b','terms':['רדיו','עתונים','עיתונים','עתון','עיתון','חדשות','רויטר','פלקור','שידור','משדר','תחנת','עיתונות']},
 'power':{'name':'שלטון ופוליטיקה','color':'#8575a7','terms':['היטלר','גרמניה','רוסיה','בריטניה','ממשלה','ממשלת','ממשלות','דיקטטור','מיניסטר','מיניסטרים','נאצי','נאצים','סטאלין','סטלין']},
 'place':{'name':'ארץ ומקום','color':'#638b68','terms':['ארץ','הארץ','ישראל','בארץ','עברית','ירושלים','תל־אביב','תל-אביב','קיבוץ','הקיבוץ','פלשתינה','ירדן','גליל','הגליל','עיר','העיר']},
}
# Strip only presentation/structural tokens. Keep original paragraph offsets and excerpts.
def clean_text(s):
 s=re.sub(r'</?A228401-[TR]\d+[^>]*>',' ',s)
 s=re.sub(r'\[\[(?:/?MOVE|/?SWAP|/?TARGET)[^\]]*\]\]',' ',s)
 s=s.replace('////',' ')
 return s

def nodiac(s): return ''.join(c for c in s if not ('\u0591'<=c<='\u05c7' and c not in ('־',)))
# Rule: lexical hit is textual evidence of an exact written form, not a manually assigned network.
# Word boundaries based on Hebrew script, including maqaf and geresh.
lex={k:[] for k in PRESETS}
for p in PARAS:
 if not p['text'].strip(): continue
 raw=clean_text(p['text']); norm=nodiac(raw)
 for k,config in PRESETS.items():
  for term in config['terms']:
   rx=r'(?<![\u0590-\u05ff])'+re.escape(nodiac(term))+r'(?![\u0590-\u05ff])'
   for m in re.finditer(rx,norm):
    lex[k].append({'t':p['t'],'p':p['n'],'term':term,'surface':m.group(0),'excerpt':raw[max(0,m.start()-42):m.end()+58].strip(),'basis':'literal_whole_word_search','source':'XML body paragraph'})

bycats=collections.defaultdict(list)
for fn in D['footnotes'].values():
 for occ in fn.get('occurrences',[]):
  for cat in fn.get('categories',[]):
   bycats[cat].append({'t':occ['t'],'p':occ['p'],'fn_id':fn['id'],'excerpt':fn['text'][:230],'basis':'explicit_editorial_footnote_category'})
# NOTE overlaps: same paragraph and two explicit categories, not conceptual association or co-referentiality.
cat_pairs=collections.defaultdict(list)
for p in PARAS:
 cats=sorted({cat for fn in p.get('footnotes',[]) for cat in (D['footnotes'].get(str(fn)) or {}).get('categories',[])})
 for i,a in enumerate(cats):
  for b in cats[i+1:]:cat_pairs[f'{a}|{b}'].append({'t':p['t'],'p':p['n']})

# Directionality of scripts: 'script spans' is not 'language'.
script_hits={'Latin':[],'Arabic':[],'Cyrillic':[],'Greek':[]}
script_regex={
 'Latin':re.compile(r'(?<![A-Za-z])[A-Za-z]{2,}(?![A-Za-z])'),
 'Arabic':re.compile(r'[\u0600-\u06FF]+'),
 'Cyrillic':re.compile(r'[\u0400-\u04FF]+'),
 'Greek':re.compile(r'[\u0370-\u03FF]+')
}
for p in PARAS:
 raw=clean_text(p['text'])
 for typ,rx in script_regex.items():
  for m in rx.finditer(raw):
   if typ=='Latin' and m.group(0) in ('MOVE','SWAP','TARGET'): continue
   script_hits[typ].append({'t':p['t'],'p':p['n'],'surface':m.group(0),'excerpt':raw[max(0,m.start()-30):m.end()+35],'basis':'Unicode script detection only'})

out={'version':'1.4','source':'XML + explicit footnote category annotations','provenance':D['provenance'],
  'annotation_source':{'status':TAG['status'],'counts':TAG['counts']},
  'units':seq,'presets':PRESETS,'literal_hits':lex,
  'footnote_category_hits':dict(bycats),'footnote_category_overlap':dict(cat_pairs),
  'script_hits':script_hits,'method':{
    'literal':'Exact whole-word occurrences in XML text. Preset term selection is a proposed research lens; NOT validated semantic tagging.',
    'category':'Categories explicitly stated in XML footnote records (annotation metadata), NOT a dedicated discourse network.',
    'overlap':'Two categories have notes anchored to the same XML paragraph; NOT causal or discursive relation.',
    'script':'Unicode script spans only; do not infer language or code-switch type.',
    'new':'Additional language/term/network annotation sheets are empty and contribute zero data.'}}
(root/'data/content_networks.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print('source explicit cats:',[(k,len(v)) for k,v in bycats.items()])
print('lexical hits:',[(k,len(v),len({h['t'] for h in v})) for k,v in lex.items()])
print('script:',[(k,len(v)) for k,v in script_hits.items()])
print('shared-paragraph category edges:',[(k,len(v)) for k,v in cat_pairs.items()])
