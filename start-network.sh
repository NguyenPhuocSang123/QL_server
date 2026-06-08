#!/bin/bash

# Quick start script for network access (Linux/Mac)

echo ""
echo "==============================================="
echo "   QUICK START - Network Access Setup"
echo "==============================================="
echo ""

# Get local IP
echo "[*] Finding machine IP address..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    ip=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
else
    # Linux
    ip=$(hostname -I | awk '{print $1}')
fi

if [ -z "$ip" ]; then
    echo "[!] Could not find IP address"
    echo "Try: ifconfig (Mac) or hostname -I (Linux)"
    exit 1
fi

echo "[+] Found IP: $ip"
echo ""

echo "[*] Installing dependencies..."
npm run install:all

echo ""
echo "[*] Starting backend on 0.0.0.0:5000..."
echo "[+] Access: http://$ip:5000/api/health"
cd backend && npm run dev &
BACKEND_PID=$!

sleep 3

echo ""
echo "[*] Starting frontend on 0.0.0.0:3000..."
echo "[+] Access: http://$ip:3000"
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "==============================================="
echo "   Access from another machine:"
echo "   http://$ip:3000"
echo ""
echo "Press Ctrl+C to stop"
echo "==============================================="
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
