#!/usr/bin/env python3
"""Create a self-contained preview and a root-level GitHub Pages ZIP.
The ZIP keeps the provider-based file structure; the preview embeds the same snapshots.
"""
from pathlib import Path
import argparse,base64,json,mimetypes,re,zipfile
from bs4 import BeautifulSoup

def build(root,preview,zip_path=None):
 html=(root/"index.html").read_text(encoding="utf-8")
 soup=BeautifulSoup(html,"html.parser")
 for tag in list(soup.find_all("link",rel="stylesheet")):
  path=root/tag["href"]
  style=soup.new_tag("style")
  style.string=path.read_text(encoding="utf-8")
  tag.replace_with(style)
 for tag in list(soup.find_all("script",src=True)):
  script=soup.new_tag("script")
  script.string=(root/tag["src"]).read_text(encoding="utf-8").replace("</script","<\\/script")
  tag.replace_with(script)
 # Explicit embedding mode does not claim a live network connection.
 flag=soup.new_tag("script");flag.string="window.__HAMATATE_STANDALONE__=true;"
 soup.head.insert(0,flag)
 text=str(soup)
 for pattern in ["assets/branding/*","productions/*/media/*"]:
  for p in root.glob(pattern):
   if p.suffix.lower() not in [".png",".jpg",".jpeg",".webp",".svg",".mp3",".ogg"]:continue
   mime=mimetypes.guess_type(str(p))[0] or "application/octet-stream"
   text=text.replace(p.relative_to(root).as_posix(),"data:"+mime+";base64,"+base64.b64encode(p.read_bytes()).decode())
 preview.write_text(text,encoding="utf-8")
 if zip_path:
  with zipfile.ZipFile(zip_path,"w",zipfile.ZIP_DEFLATED) as z:
   for p in sorted(root.rglob("*")):
    if p.is_file() and "__pycache__" not in str(p):
     z.write(p,p.relative_to(root).as_posix())
 return preview.stat().st_size
if __name__=="__main__":
 ap=argparse.ArgumentParser();ap.add_argument("--root",type=Path,default=Path(__file__).resolve().parents[1]);ap.add_argument("--preview",type=Path,required=True);ap.add_argument("--zip",type=Path)
 a=ap.parse_args();print(build(a.root,a.preview,a.zip))
