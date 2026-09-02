#!/usr/bin/env bash
set -e

# ─── Step 1: Build combined CSS bundle (styles.scss → dist/index.css) ─────────
rslib build

# rslib also emits a JS entry file we don't need – remove it
rm -f dist/index.js

# ─── Step 2: Compile JS with SWC ─────────────────────────────────────────────
swc src -d dist \
  --strip-leading-paths \
  --ignore '**/*.test.js' \
  --ignore '**/__tests__/**' \
  --ignore '**/config/form.js' \
  --ignore '**/config/langs.js' \
  --copy-files

# ─── Step 3: Rewrite .scss imports → .css in compiled JS ─────────────────────
find dist -name '*.js' -exec sed -i '' 's/\.scss/.css/g' {} \;

# ─── Step 4: Compile individual component SCSS files to CSS ──────────────────
# Skips partials (_*.scss) and the root styles.scss (already handled by rslib)
find src -name '*.scss' ! -name '_*' ! -name 'styles.scss' -exec sh -c '
  outfile="dist/${1#src/}"
  outfile="${outfile%.scss}.css"
  mkdir -p "$(dirname "$outfile")"
  sass "$1" "$outfile" --no-source-map 2>/dev/null || true
' _ {} \;

# ─── Step 5: Copy locale files ──────────────────────────────────────────────
cp -r src/locales dist/
