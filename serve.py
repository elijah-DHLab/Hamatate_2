#!/usr/bin/env python3
"""Serve the package read-only on localhost; does not upload any source."""
import argparse, functools, http.server, webbrowser
from pathlib import Path
p=argparse.ArgumentParser(); p.add_argument('--port',type=int,default=8000); a=p.parse_args()
handler=functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(Path(__file__).resolve().parent))
server=http.server.ThreadingHTTPServer(('127.0.0.1',a.port),handler)
print('Open http://127.0.0.1:'+str(a.port)+'/')
try: server.serve_forever()
except KeyboardInterrupt: server.server_close()
