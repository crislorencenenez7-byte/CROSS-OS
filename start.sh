#!/data/data/com.termux/files/usr/bin/sh
cd "$(dirname "$0")" || exit 1
python backend/server.py
