#!/usr/bin/env bash
# Uploads the 1080p case films to R2 (bucket gm-robotiks-media, served at
# https://media.gmrobotiks.com/cases/). Usage: scripts/upload-media.sh <dir>
# where <dir> is the output of `scripts/build-videos.sh <source-dir> cases <dir>`.
#
# Objects get a one-year immutable cache header, so a re-encoded film needs a
# new file name (and the new URL in src/data/robots.ts).
set -euo pipefail

DIR=${1:?usage: scripts/upload-media.sh <dir>}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
export CLOUDFLARE_ACCOUNT_ID=${CLOUDFLARE_ACCOUNT_ID:-e1bfcc6137d9e70b5c5fe255ad321753}

for file in "$DIR"/*-1080p-*.mp4; do
  "$ROOT/node_modules/.bin/wrangler" r2 object put "gm-robotiks-media/cases/$(basename "$file")" \
    --file "$file" --content-type video/mp4 \
    --cache-control "public, max-age=31536000, immutable" --remote
done
