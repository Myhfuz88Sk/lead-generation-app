# #!/usr/bin/env python3
# """
# Simple HTTP Server to serve the frontend files
# Run this in the same directory as your HTML files
# """

# import http.server
# import socketserver
# import os

# PORT = 8000
# DIRECTORY = "."

# class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, directory=DIRECTORY, **kwargs)
    
#     def end_headers(self):
#         # Add CORS headers
#         self.send_header('Access-Control-Allow-Origin', '*')
#         self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
#         self.send_header('Access-Control-Allow-Headers', 'Content-Type')
#         super().end_headers()

# if __name__ == '__main__':
#     with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
#         print(f"🌐 Frontend server running at http://localhost:{PORT}/")
#         print(f"📄 Landing page: http://localhost:{PORT}/index.html")
#         print(f"⚙️  Admin panel: http://localhost:{PORT}/admin.html")
#         print("\nPress Ctrl+C to stop the server")
#         try:
#             httpd.serve_forever()
#         except KeyboardInterrupt:
#             print("\n\n✅ Server stopped")