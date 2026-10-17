#!/usr/bin/env bash
# Rebuilds the site's videos from Pudu Robotics' original files.
#
#   scripts/build-videos.sh <source-dir> home
#     Home montage (public/media/hero), showcase loops (public/media/loops) and
#     their posters. Every shot is cut once to a lossless intermediate and
#     encoded once per codec: AV1 (Chrome, Firefox, Edge, Safari on recent Apple
#     chips) and H.264 for everything else. Each file stays under 5 MB
#     (tests/catalog.test.mjs).
#
#   scripts/build-videos.sh <source-dir> cases <out-dir>
#     The six case films at 1080p as AV1 and HEVC (Safari on Apple devices
#     without AV1 decoding), written to <out-dir> for the R2 bucket. They are
#     too large for the Worker's 25 MiB static-file limit, so they are served
#     from https://media.gmrobotiks.com (bucket gm-robotiks-media); upload with
#     scripts/upload-media.sh. The older H.264 files in public/media/cases stay
#     as the last fallback.
#
# The source dir must hold these files, downloaded unchanged:
#   Pudu website (https://cdn.pudutech.com/<name>):
#     _6b8c9d04f2.mp4                       KettyBot Pro, café (4K)
#     ET_1_En_cb773c5eee.mp4                ET1 product film (1080p)
#     pudu_t600_series_en_25f62f37d8.mp4    T600 product film (1080p)
#     PUDU_GT_5_EN_1080p_bda11133cc.mp4     GT5 product film (1080p)
#     PUDU_GT_7_EN_1080_P_24d21e241a.mp4    GT7 product film (1080p)
#   Pudu Robotics YouTube channel (yt-dlp -f bv* https://youtu.be/<id>, saved as <id>.mp4):
#     6PxnJNilbKw.mp4   CC1 in a factory workshop (1080p)
#     QjjCul7hAAM.mp4   PuduBot 2 at Shaw Lab Group, Canada (1080p)
#     Jo9HmSl6Q34.mp4   PuduBot 2, CC1 and T300 in a battery plant (1080p)
#     pSnU7ChHDFo.mp4   MT1 Max in semi-outdoor scenarios (4K)
set -euo pipefail

SRC=${1:?usage: scripts/build-videos.sh <source-dir> home|cases [out-dir]}
MODE=${2:?usage: scripts/build-videos.sh <source-dir> home|cases [out-dir]}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
HERO="$ROOT/public/media/hero"
LOOPS="$ROOT/public/media/loops"

cut() { # source start duration filter out.mkv
  ffmpeg -v error -y -ss "$2" -i "$SRC/$1" -t "$3" -an -vf "fps=25,$4,format=yuv420p" -c:v ffv1 "$5"
}

encode() { # in.mkv out-base [av1-crf] [h264-crf] (writes out-base-av1.mp4 and out-base-h264.mp4)
  ffmpeg -v error -y -i "$1" -an -c:v libsvtav1 -preset 3 -crf "${3:-30}" -g 50 -pix_fmt yuv420p10le \
    -svtav1-params tune=0 -movflags +faststart "$2-av1.mp4"
  ffmpeg -v error -y -i "$1" -an -c:v libx264 -preset veryslow -tune film -crf "${4:-25}" -g 50 \
    -pix_fmt yuv420p -profile:v high -movflags +faststart "$2-h264.mp4"
}

still() { # in.mkv seconds out (lossless frame)
  ffmpeg -v error -y -ss "$2" -i "$1" -frames:v 1 -update 1 "$3"
}

if [ "$MODE" = cases ]; then
  OUT=${3:?usage: scripts/build-videos.sh <source-dir> cases <out-dir>}
  mkdir -p "$OUT"
  # Case films: name|file. CRFs give VMAF about 96 against the source for both
  # codecs; peak caps (AV1 4 Mbps, HEVC 5 Mbps) keep the wireframe and particle
  # shots in the ET1 film from stalling playback on mobile connections.
  # Keyframes every 5 s keep seeking quick.
  cases=(
    "et1|ET_1_En_cb773c5eee.mp4"
    "gt5|PUDU_GT_5_EN_1080p_bda11133cc.mp4"
    "cc1-factory|6PxnJNilbKw.mp4"
    "t300|Jo9HmSl6Q34.mp4"
    "pudubot2|QjjCul7hAAM.mp4"
    "mt1max|pSnU7ChHDFo.mp4"
  )
  for c in "${cases[@]}"; do
    IFS='|' read -r name file <<<"$c"
    ffmpeg -v error -y -i "$SRC/$file" -an -vf "fps=25,scale=1920:1080:flags=lanczos" \
      -c:v libsvtav1 -preset 5 -crf 36 -g 125 -pix_fmt yuv420p10le -svtav1-params tune=0:mbr=4000 \
      -movflags +faststart "$OUT/$name-1080p-av1.mp4"
    ffmpeg -v error -y -i "$SRC/$file" -an -vf "fps=25,scale=1920:1080:flags=lanczos" \
      -c:v libx265 -preset slow -crf 27 -g 125 -pix_fmt yuv420p -tag:v hvc1 \
      -x265-params log-level=error:vbv-maxrate=5000:vbv-bufsize=10000 \
      -movflags +faststart "$OUT/$name-1080p-hevc.mp4"
  done
  ls -l "$OUT"
  exit 0
fi

mkdir -p "$HERO" "$LOOPS" "$ROOT/src/assets/hero"

# Home montage: file|start|duration|portrait centre (0–1 of the frame width).
# Shot start times in the montage are listed in src/components/Hero.astro.
shots=(
  "_6b8c9d04f2.mp4|0.3|2.6|0.50"
  "ET_1_En_cb773c5eee.mp4|37.0|1.45|0.62"
  "pudu_t600_series_en_25f62f37d8.mp4|38.6|2.05|0.50"
  "PUDU_GT_5_EN_1080p_bda11133cc.mp4|3.1|2.0|0.55"
  "PUDU_GT_7_EN_1080_P_24d21e241a.mp4|11.0|1.9|0.55"
)
: >"$WORK/landscape.txt"
: >"$WORK/portrait.txt"
for i in "${!shots[@]}"; do
  IFS='|' read -r file start dur cx <<<"${shots[$i]}"
  cut "$file" "$start" "$dur" "scale=1920:1080:flags=lanczos" "$WORK/s$i-l.mkv"
  cut "$file" "$start" "$dur" "scale=-2:1280:flags=lanczos,crop=720:1280:'max(0,min(iw-720,iw*$cx-360))':0" "$WORK/s$i-p.mkv"
  echo "file 's$i-l.mkv'" >>"$WORK/landscape.txt"
  echo "file 's$i-p.mkv'" >>"$WORK/portrait.txt"
done
for o in landscape portrait; do
  ffmpeg -v error -y -f concat -safe 0 -i "$WORK/$o.txt" -c copy "$WORK/$o.mkv"
  encode "$WORK/$o.mkv" "$HERO/montage-$o"
  still "$WORK/$o.mkv" 1.6 "$WORK/poster-$o.png"
done
# Posters are near-lossless masters; astro:assets makes the AVIF/WebP sizes.
(cd "$ROOT" && node -e "
  const sharp = require('sharp');
  for (const o of ['landscape', 'portrait'])
    sharp(process.argv[1] + '/poster-' + o + '.png').webp({ quality: 95, smartSubsample: true, effort: 6 })
      .toFile('src/assets/hero/poster-' + o + '.webp');
" "$WORK")

# Showcase loops: name|file|start|duration|AV1 CRF|H.264 CRF. The handheld lab
# footage is grainy, so it takes higher CRFs to stay under budget (VMAF 99 / 97).
loops=(
  "limpieza|6PxnJNilbKw.mp4|4.28|7.72|30|25"
  "entrega|QjjCul7hAAM.mp4|11.0|7.0|38|27"
  "logistica|Jo9HmSl6Q34.mp4|30.0|8.0|30|25"
)
for l in "${loops[@]}"; do
  IFS='|' read -r name file start dur av1 h264 <<<"$l"
  cut "$file" "$start" "$dur" "scale=1920:1080:flags=lanczos" "$WORK/$name.mkv"
  encode "$WORK/$name.mkv" "$LOOPS/$name" "$av1" "$h264"
  still "$WORK/$name.mkv" 0 "$WORK/$name.png"
  (cd "$ROOT" && node -e "
    require('sharp')(process.argv[1]).webp({ quality: 80, smartSubsample: true, effort: 6 }).toFile(process.argv[2]);
  " "$WORK/$name.png" "$LOOPS/$name-poster.webp")
done

ls -l "$HERO" "$LOOPS"
