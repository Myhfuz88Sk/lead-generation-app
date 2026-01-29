#!/bin/bash

echo "🚀 Starting Real Trust Application..."
echo ""
echo "This will start:"
echo "  1. Flask Backend (port 5000)"
echo "  2. Frontend Server (port 8000)"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Install requirements if needed
if [ ! -d "venv" ]; then
    echo "📦 Installing dependencies..."
    pip3 install -r requirements.txt --quiet
fi

# Start Flask backend in background
echo "🔧 Starting Flask backend on port 5000..."
python3 app.py &
FLASK_PID=$!

# Wait for Flask to start
sleep 2

# Start frontend server
echo "🌐 Starting frontend server on port 8000..."
echo ""
echo "✅ Application is running!"
echo ""
echo "📄 Open these URLs in your browser:"
echo "   Landing Page: http://localhost:8000/index.html"
echo "   Admin Panel:  http://localhost:8000/admin.html"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start frontend server
python3 -m http.server 8000

# Cleanup when stopped
kill $FLASK_PID 2>/dev/null
echo ""
echo "✅ Servers stopped"