#!/usr/bin/env bash
# Neue Version veröffentlichen:
#   ./release.sh          – Patch-Version erhöhen (v1.0.0 → v1.0.1)
#   ./release.sh minor    – v1.0.1 → v1.1.0
#   ./release.sh major    – v1.1.0 → v2.0.0
# Pusht main und einen neuen Tag. GitHub prüft dann den Stand, erstellt das Release,
# und der Pi rollt es innerhalb einer Minute aus.
set -euo pipefail

BUMP="${1:-patch}"

if [ -n "$(git status --porcelain)" ]; then
  echo "Es gibt nicht committete Änderungen – bitte erst committen." >&2
  exit 1
fi
if [ "$(git rev-parse --abbrev-ref HEAD)" != "main" ]; then
  echo "Releases bitte nur von main aus." >&2
  exit 1
fi

git fetch -q --tags origin
LAST="$(git tag -l 'v*' --sort=-v:refname | head -1)"
IFS=. read -r MAJOR MINOR PATCH <<< "${LAST#v}"
MAJOR="${MAJOR:-0}" MINOR="${MINOR:-0}" PATCH="${PATCH:-0}"

case "$BUMP" in
  major) NEXT="v$((MAJOR + 1)).0.0" ;;
  minor) NEXT="v$MAJOR.$((MINOR + 1)).0" ;;
  patch) NEXT="v$MAJOR.$MINOR.$((PATCH + 1))" ;;
  v*) NEXT="$BUMP" ;;
  *) echo "Verwendung: $0 [patch|minor|major|vX.Y.Z]" >&2; exit 1 ;;
esac

echo "Release ${LAST:-(keins)} → $NEXT"
git push -q origin main
git tag -a "$NEXT" -m "$NEXT"
git push -q origin "$NEXT"
echo "Tag $NEXT gepusht. Fortschritt: https://github.com/TiefenbacherC/HolidaySelector/actions"
