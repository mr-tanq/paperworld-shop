#!/usr/bin/env bash
set -euo pipefail
WORK="${1:?work checkout required}"
RESULT="${2:?result file required}"
WORK="$(realpath "$WORK")"
RESULT="$(realpath -m "$RESULT")"
: > "$RESULT"
cd "$WORK"
npm ci --ignore-scripts --no-audit --no-fund
run_one() {
  local id="$1" file="$2"
  echo "Running trusted test: $id"
  if node --test "$file"; then
    printf '%s\tpassed\n' "$id" >> "$RESULT"
  else
    echo "Required test failed: $id" >&2
    exit 1
  fi
}
run_one catalog tests/catalog.test.mjs
run_one storefront tests/storefront.test.mjs
