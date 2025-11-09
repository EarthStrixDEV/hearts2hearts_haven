#!/bin/bash

# Create audio directory structure
mkdir -p public/media/audio/focus
mkdir -p public/media/audio/heartbeat
mkdir -p public/media/art

echo "📁 Created audio directories"

# Create placeholder files (you'll need to replace these with actual audio files)
touch public/media/audio/focus/index.m3u8
touch public/media/audio/focus/160.mp3
touch public/media/audio/focus/320.mp3

touch public/media/audio/heartbeat/index.m3u8
touch public/media/audio/heartbeat/160.mp3
touch public/media/audio/heartbeat/320.mp3

echo "📄 Created placeholder audio files"
echo ""
echo "⚠️  NOTE: Replace placeholder files with actual audio files:"
echo "   - public/media/audio/focus/*.mp3"
echo "   - public/media/audio/heartbeat/*.mp3"
echo "   - public/media/art/focus.webp (album artwork)"
echo ""

