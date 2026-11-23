from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parent.parent
FRONTEND = ROOT / "frontend"
HOST = "127.0.0.1"
PORT = 8000

class CrossHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(FRONTEND), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

if __name__ == "__main__":
    if not (FRONTEND / "index.html").exists():
        raise SystemExit("ERROR: frontend/index.html not found")

    server = ThreadingHTTPServer((HOST, PORT), CrossHandler)
    print("CROSS OS Simulator is running.")
    print(f"Open this address in your Android browser: http://{HOST}:{PORT}")
    print("Press CTRL+C to stop the server.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nCROSS OS server stopped.")
        server.server_close()
