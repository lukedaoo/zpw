#!/usr/bin/env bash
set -euo pipefail

BUMP="${1:-patch}"

last=$(git tag --list 'v*' --sort=-v:refname | head -n1)
last="${last:-v0.0.0}"
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

git commit --allow-empty -q -m "chore: release $next"
git tag -a "$next" -m "$next"
echo "$last -> $next (not pushed: git push origin HEAD $next)"
