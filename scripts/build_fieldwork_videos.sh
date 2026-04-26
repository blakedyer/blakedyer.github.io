#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="/limestone/Presentations/reveal_presentations/videos"
VIDEO_DIR="$ROOT_DIR/assets/videos"
POSTER_DIR="$ROOT_DIR/assets/images/video-posters"

mkdir -p "$VIDEO_DIR" "$POSTER_DIR"

build_mp4() {
  local input="$1"
  local output="$2"
  local start="$3"
  local duration="$4"
  local width="$5"
  local crf="$6"
  local fps="$7"

  ffmpeg -y \
    -ss "$start" \
    -t "$duration" \
    -i "$input" \
    -an \
    -vf "fps=${fps},scale=${width}:-2:flags=lanczos,format=yuv420p" \
    -c:v libx264 \
    -preset slow \
    -profile:v high \
    -level 4.1 \
    -movflags +faststart \
    -crf "$crf" \
    "$output"
}

build_poster() {
  local input="$1"
  local output="$2"
  local time="$3"
  local width="$4"

  ffmpeg -y \
    -ss "$time" \
    -i "$input" \
    -frames:v 1 \
    -vf "scale=${width}:-2:flags=lanczos" \
    "$output"
}

build_mp4 "$SRC_DIR/web5.mp4" "$VIDEO_DIR/fieldwork-hero-loop.mp4" 0 14 960 29 24
build_poster "$VIDEO_DIR/fieldwork-hero-loop.mp4" "$POSTER_DIR/fieldwork-hero-loop.jpg" 4 960

build_mp4 "$SRC_DIR/seagrass.mp4" "$VIDEO_DIR/fieldwork-seagrass.mp4" 0 12 960 28 24
build_poster "$VIDEO_DIR/fieldwork-seagrass.mp4" "$POSTER_DIR/fieldwork-seagrass.jpg" 2 960

build_mp4 "$SRC_DIR/groovesand.mp4" "$VIDEO_DIR/fieldwork-groovesand.mp4" 0 12 960 28 24
build_poster "$VIDEO_DIR/fieldwork-groovesand.mp4" "$POSTER_DIR/fieldwork-groovesand.jpg" 2 960

build_mp4 "$SRC_DIR/beachrock.mp4" "$VIDEO_DIR/fieldwork-beachrock.mp4" 16 12 960 28 24
build_poster "$VIDEO_DIR/fieldwork-beachrock.mp4" "$POSTER_DIR/fieldwork-beachrock.jpg" 2 960

build_mp4 "$SRC_DIR/0300-3135.mkv" "$VIDEO_DIR/fieldwork-middle-caicos.mp4" 76 12 1120 27 24
build_poster "$VIDEO_DIR/fieldwork-middle-caicos.mp4" "$POSTER_DIR/fieldwork-middle-caicos.jpg" 2 1120
