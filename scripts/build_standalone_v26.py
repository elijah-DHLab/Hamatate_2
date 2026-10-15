#!/usr/bin/env python3
"""Build one self-contained HTML document. Main GitHub artifact remains modular."""
from pathlib import Path
import re,base64,sys
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text(encoding='utf-8')
assert '<script src="assets/js/relations-v25.js"></script>' in html
for match in list(re.finditer(r'<link href="([^"]+\.css)" rel="stylesheet"/>',html)):
 path=root/match.group(1)
 html=html.replace(match.group(0),'<style>\n'+path.read_text(encoding='utf-8')+'\n</style>')
for match in list(re.finditer(r'<script src="([^"]+\.js)"></script>',html)):
 path=root/match.group(1)
 code=path.read_text(encoding='utf-8').replace('</script','<\\/script')
 html=html.replace(match.group(0),'<script>\n'+code+'\n</script>')
# image assets referenced from HTML
for match in list(re.finditer(r'(?<=src=")((?:assets|productions)/[^"<>]+\.(?:png|jpg|webp))',html)):
 img=root/match.group(0)
 if img.exists():
  mime='image/jpeg' if img.suffix.lower()=='.jpg' else 'image/png'
  html=html.replace(match.group(0),'data:'+mime+';base64,'+base64.b64encode(img.read_bytes()).decode())
# Preserve scanned program photos referenced from CSS or generated JS strings
for asset in ['productions/A228401/media/program1.jpg','productions/A228401/media/program2.jpg']:
 if (root/asset).exists():html=html.replace(asset,'data:image/jpeg;base64,'+base64.b64encode((root/asset).read_bytes()).decode())
# The data-backed source provider is embedded for offline use.
html=html.replace('</head>', '<script>window.__HAMATATE_STANDALONE__=true;</script></head>')
out=Path(sys.argv[1]) if len(sys.argv)>1 else root.parent/'hamatate_v2_6_standalone.html';out.write_text(html,encoding='utf-8');print(out,out.stat().st_size)
