"""Import a layered tagging workbook and align it to a Word Flat OPC edition.

A location identifier alone is NOT a token-level anchor.  To align a span we
require a unique exact quote in a constrained context or an explicit verified
text offset. Ambiguous or unmatched rows remain in a review queue.
"""
from __future__ import annotations
import argparse, hashlib, json, re
from pathlib import Path
from openpyxl import load_workbook

BASE = Path(__file__).resolve().parents[1]
HEADERS={
 'תיוגי שפה':['מס\'','מיקום','סוג','שפות','טקסט','נכתב במקור','תרגום','הערה','נשמר','מזהה מיקום'],
 'הערות שוליים':['מס\'','מיקום','סוג','תוכן','נשמר','מזהה מיקום'],
 'מונחים':['מס\'','מיקום','מונח','טקסט','קטגוריות','רשתות','נשמר','מזהה מיקום'],
}

def normalize(s):
    return re.sub(r'\s+',' ',str(s or '')).strip()

def occurrences(text,quote):
    loc=[]; start=0
    if not quote:return loc
    while True:
        i=text.find(quote,start)
        if i<0:break
        loc.append((i,i+len(quote)));start=i+1
    return loc

def loc_paragraph(s,para_lookup,paraId_lookup):
    s=normalize(s)
    m=re.search(r'xml-p0*(\d+)',s,flags=re.I)
    if m:
        n=int(m.group(1)); return para_lookup.get(n)
    m=re.search(r'\b([0-9A-F]{8})\b',s,flags=re.I)
    if m:return paraId_lookup.get(m.group(1).upper())
    return None

def loc_segment(s):
    m=re.search(r'A228401-T\d+',normalize(s),re.I)
    return m.group(0).upper() if m else None

def align(row, paras, para_lookup, paraId_lookup, segment_lookup):
    raw=row['fields'];loc=raw.get('מזהה מיקום') or raw.get('מיקום')
    para=loc_paragraph(loc,para_lookup,paraId_lookup)
    seg=loc_segment(loc)
    quote=normalize(raw.get('טקסט'))
    if not quote and row['sheet']=='מונחים':quote=normalize(raw.get('מונח'))
    # Do not treat a full comment as an exact quote or fabricate one from a translation.
    scope=[para] if para is not None else segment_lookup.get(seg,[]) if seg else paras
    if not quote:
        if para is not None:
            return {'status':'paragraph_only','paragraph':para['n'],'t':para.get('t'),'start':None,'end':None,'reason':'location verified but no exact quote supplied'}
        if seg and seg in segment_lookup:
            return {'status':'segment_only','t':seg,'start':None,'end':None,'reason':'T identifier verified but no span-level quote supplied'}
        return {'status':'unresolved','reason':'no verifiable text quote or known structural anchor'}
    matched=[]
    for p in scope:
        for a,b in occurrences(p.get('text') or '',quote): matched.append({'paragraph':p['n'],'t':p.get('t'),'start':a,'end':b})
    if len(matched)==1:
        res=matched[0];res.update(status='anchored_exact',quote=quote,reason='unique exact string in the constrained source')
        return res
    if len(matched)>1:return {'status':'ambiguous','matches':matched[:30],'total_matches':len(matched),'reason':'multiple exact matches; no automatic choice'}
    # Never auto-accept fuzzy normalization as philologically verified.
    return {'status':'unresolved','reason':'quote was not found exactly in the specified source context','quote':quote,'location':loc}

def run(workbook,edition,out):
    data=json.loads(Path(edition).read_text(encoding='utf-8'))
    pars=data['paragraphs'];lookup={p['n']:p for p in pars};para_id={str(p.get('paraId') or '').upper():p for p in pars if p.get('paraId')}
    segs={}
    for p in pars:
        if p.get('t'):segs.setdefault(p['t'],[]).append(p)
    wb=load_workbook(workbook,read_only=True,data_only=True)
    outdata={'source':{'name':Path(workbook).name,'sha256':hashlib.sha256(Path(workbook).read_bytes()).hexdigest()},'schema':{},'records':[],'counts':{},'diagnostics':[],'status':'not_imported'}
    for sheet_name,header in HEADERS.items():
        if sheet_name not in wb.sheetnames:
            outdata['diagnostics'].append({'sheet':sheet_name,'severity':'error','message':'sheet is missing'});continue
        ws=wb[sheet_name];values=ws.iter_rows(values_only=True)
        heads=list(next(values,[]));outdata['schema'][sheet_name]=heads
        if heads!=header:
            outdata['diagnostics'].append({'sheet':sheet_name,'severity':'warning','message':'column headings differ from the expected schema'})
        nonempty=0
        for index,rr in enumerate(values,start=2):
            if not any(v is not None and str(v).strip() for v in rr):continue
            nonempty+=1
            row={'id':f'{sheet_name}:{index}','sheet':sheet_name,'row':index,'fields':{str(heads[j]):str(v) if v is not None else None for j,v in enumerate(rr[:len(heads)])},'source_cell':f'{sheet_name}!A{index}'}
            row['alignment']=align(row,pars,lookup,para_id,segs)
            outdata['records'].append(row)
        outdata['counts'][sheet_name]=nonempty
        if nonempty==0:outdata['diagnostics'].append({'sheet':sheet_name,'severity':'info','message':'only a header row; no annotation records'})
    from collections import Counter
    outdata['alignment_status_counts']=dict(Counter(x['alignment']['status'] for x in outdata['records']))
    outdata['status']='empty_source' if not outdata['records'] else 'aligned_with_review_queue' if any(x['alignment']['status'] not in ('anchored_exact','paragraph_only','segment_only') for x in outdata['records']) else 'aligned'
    Path(out).write_text(json.dumps(outdata,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'workbook_sheets':list(wb.sheetnames),'rows':outdata['counts'],'status':outdata['status'],'alignment':outdata['alignment_status_counts']},ensure_ascii=False,indent=2))
    return outdata

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--workbook',default=str(BASE/'sources/additional_tagging.xlsx'));parser.add_argument('--edition',default=str(BASE/'data/edition.json'));parser.add_argument('--out',default=str(BASE/'data/tagging_layer.json'))
    args=parser.parse_args();run(args.workbook,args.edition,args.out)
