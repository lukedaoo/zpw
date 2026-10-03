#!/usr/bin/env bash
set -euo pipefail

BUMP="${1:-patch}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VERSION_FILE="$ROOT/VERSION"

last=$(tr -d '[:space:]' < "$VERSION_FILE")
IFS=. read -r major minor patch <<< "${last#v}"

case "$BUMP" in
    major) major=$((major + 1)); minor=0; patch=0 ;;
    minor) minor=$((minor + 1)); patch=0 ;;
    patch) patch=$((patch + 1)) ;;
    *) echo "usage: $0 [major|minor|patch]" >&2; exit 1 ;;
esac

next="v$major.$minor.$patch"

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
    echo "working tree dirty" >&2
    exit 1
fi

echo "$next" > "$VERSION_FILE"

if ! make -C "$ROOT" release > /dev/null; then
    git checkout -- "$VERSION_FILE"
    echo "make release failed, version not bumped" >&2
    exit 1
fi

git add "$VERSION_FILE"
git commit -q -m "chore: release $next"
git tag -a "$next" -m "$next"
echo "$last -> $next, built in dist-release/ (not pushed: git push origin HEAD $next)"
