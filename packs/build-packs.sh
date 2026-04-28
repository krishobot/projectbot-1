#!/usr/bin/env bash
# Build pack zips for Gumroad upload.
#
# Usage: ./packs/build-packs.sh
# Outputs: packs/dist/*.zip
#
# Re-run after content updates; upload the new zip to Gumroad (Gumroad
# supports versioned files via the "Update file" button on the product).

set -euo pipefail

# Resolve repo root regardless of where the script is invoked from.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PACKS_DIR="$REPO_ROOT/packs"
DIST_DIR="$PACKS_DIR/dist"

mkdir -p "$DIST_DIR"
rm -f "$DIST_DIR"/*.zip

# Read version from each pack.yaml so the zip name matches the manifest.
get_version() {
  local pack="$1"
  if [ -f "$PACKS_DIR/$pack/pack.yaml" ]; then
    grep '^version:' "$PACKS_DIR/$pack/pack.yaml" | sed -E 's/version: *"?([^"]+)"?.*/\1/' | head -n1
  else
    echo "v1"
  fi
}

# Pick a zipper. Native `zip` on Linux/Mac; PowerShell Compress-Archive on
# Windows (where Git Bash often lacks `zip`).
HAS_ZIP=0
if command -v zip >/dev/null 2>&1; then HAS_ZIP=1; fi

zip_dir() {
  local src_parent="$1"   # parent dir; we'll cd into here
  local src_name="$2"     # name of dir inside src_parent to zip
  local out="$3"          # absolute output zip path

  if [ "$HAS_ZIP" = "1" ]; then
    ( cd "$src_parent" && zip -qr "$out" "$src_name" -x '*.DS_Store' '*/.git/*' )
  else
    # Convert paths to Windows form for PowerShell.
    local win_src
    local win_out
    win_src="$(cygpath -w "$src_parent/$src_name" 2>/dev/null || echo "$src_parent/$src_name")"
    win_out="$(cygpath -w "$out" 2>/dev/null || echo "$out")"
    powershell.exe -NoProfile -Command \
      "Compress-Archive -Path '$win_src' -DestinationPath '$win_out' -Force" >/dev/null
  fi
}

build_pack() {
  local pack="$1"
  local version
  version="$(get_version "$pack")"
  local out="$DIST_DIR/${pack}-${version}.zip"
  echo "→ Building $out"
  zip_dir "$PACKS_DIR" "$pack" "$out"
}

build_bundle() {
  local out="$DIST_DIR/specialty-bundle-v1.zip"
  echo "→ Building $out (agency-pack + technical-founder-pack)"
  local tmp
  tmp="$(mktemp -d)"
  trap "rm -rf '$tmp'" EXIT

  mkdir -p "$tmp/specialty-bundle"
  cp -r "$PACKS_DIR/agency-pack" "$tmp/specialty-bundle/"
  cp -r "$PACKS_DIR/technical-founder-pack" "$tmp/specialty-bundle/"

  # Bundle gets its own README explaining what it is and how to install both.
  cat > "$tmp/specialty-bundle/README.md" <<'EOF'
# specialty bundle (agency-pack + technical-founder-pack)

Both specialty packs in one download. Save $20 vs buying separately.

This bundle ships two complete packs as sibling directories:

```
specialty-bundle/
├── agency-pack/             ← see agency-pack/README.md
└── technical-founder-pack/  ← see technical-founder-pack/README.md
```

## Install

Each pack installs independently. From your astack workspace root:

```bash
cp -r ./agency-pack ~/.astack/packs/agency-pack
cp -r ./technical-founder-pack ~/.astack/packs/technical-founder-pack
```

Or if you only want one for now, install the other later.

## Discord

Both packs share the same buyer Discord. The invite link in either pack's
README gets you in.

## License + refunds

Same terms as each individual pack. See the pack-specific READMEs.
EOF

  zip_dir "$tmp" "specialty-bundle" "$out"
}

build_pack "agency-pack"
build_pack "technical-founder-pack"
build_bundle

echo ""
echo "Done. Built artifacts:"
ls -lh "$DIST_DIR"
echo ""
echo "Next step: upload each .zip to its Gumroad listing's Files section."
