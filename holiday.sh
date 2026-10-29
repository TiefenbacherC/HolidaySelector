#!/usr/bin/env bash
# Steuerung der Urlaubs-Website auf dem Pi.
#   ./holiday.sh start    – Website starten (baut das Image, falls nötig)
#   ./holiday.sh stop     – Website stoppen
#   ./holiday.sh restart  – neu starten
#   ./holiday.sh status   – läuft sie? welche Version?
#   ./holiday.sh logs     – Logs anzeigen
#   ./holiday.sh port 80  – Port dauerhaft ändern (ohne Zahl: aktuellen Port anzeigen)
#   ./holiday.sh deploy   – neu bauen und starten
#   ./holiday.sh update   – neuestes GitHub-Release holen und ausrollen
#                           (läuft jede Minute automatisch, siehe pi-setup.sh)
set -euo pipefail

NAME="holiday-selector"
IMAGE="holiday-selector:latest"
VOLUME="holiday-data"
REPO="TiefenbacherC/HolidaySelector"
DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
# gespeicherter Port (urlaub port …) – liegt nicht in git, bleibt also bei Updates erhalten
PORT_FILE="$DIR/.port"
PORT="${PORT:-$(cat "$PORT_FILE" 2>/dev/null || echo 8080)}"

# git im Repo – auch wenn das Skript per sudo läuft
g() {
  git -c safe.directory="$DIR" -C "$DIR" "$@"
}

version() {
  g describe --tags --exact-match 2>/dev/null || g rev-parse --short HEAD
}

# Tag des neuesten veröffentlichten Releases – über die Weiterleitung von
# github.com/…/releases/latest, damit es kein API-Limit gibt. Der Zeitstempel
# umgeht GitHubs Zwischenspeicher, der sonst noch minutenlang das alte Release liefert.
latest_release() {
  curl -fsSI -H "Cache-Control: no-cache" "https://github.com/$REPO/releases/latest?t=$(date +%s)" \
    | tr -d '\r' | awk 'tolower($1) == "location:" { print $2 }' \
    | grep -o '/releases/tag/.*' | sed 's#/releases/tag/##' || true
}

build() {
  docker build -q --build-arg VERSION="$(version)" -t "$IMAGE" "$DIR" >/dev/null
  docker image prune -f >/dev/null
}

run() {
  docker rm -f "$NAME" >/dev/null 2>&1 || true
  docker run -d --name "$NAME" --restart unless-stopped \
    -p "$PORT:8080" -v "$VOLUME:/data" "$IMAGE" >/dev/null
  echo "Website läuft auf http://$(hostname -I 2>/dev/null | awk '{print $1}'):$PORT ($(version))"
}

running() {
  [ "$(docker inspect -f '{{.State.Running}}' "$NAME" 2>/dev/null)" = "true" ]
}

main() {
  case "${1:-}" in
    start)
      docker image inspect "$IMAGE" >/dev/null 2>&1 || build
      run
      ;;
    stop)
      docker rm -f "$NAME" >/dev/null 2>&1 && echo "Website gestoppt." || echo "Website lief nicht."
      ;;
    restart)
      main stop
      main start
      ;;
    deploy)
      build
      run
      ;;
    update)
      local tag
      tag="$(latest_release)"
      if [ -z "$tag" ] || [ "$tag" = "$(version)" ]; then
        exit 0
      fi
      g fetch -q --tags --force origin
      g checkout -q --force "tags/$tag"
      echo "Update auf $tag"
      # neu einlesen, falls sich dieses Skript selbst geändert hat
      exec "$DIR/holiday.sh" rollout
      ;;
    rollout)
      # nach einem Update: neu bauen, aber nur starten, wenn die Website vorher lief
      if running; then
        main deploy
      else
        build
        echo "Website ist gestoppt – $(version) gebaut, aber nicht gestartet."
      fi
      ;;
    status)
      if running; then
        echo "Website läuft (Port $PORT), Version $(version)."
      else
        echo "Website ist gestoppt (Version $(version))."
      fi
      ;;
    logs)
      docker logs -f "$NAME"
      ;;
    port)
      local new="${2:-}"
      if [ -z "$new" ]; then
        echo "Port: $PORT"
        exit 0
      fi
      if ! [[ "$new" =~ ^[0-9]+$ ]] || [ "$new" -lt 1 ] || [ "$new" -gt 65535 ]; then
        echo "Ungültiger Port: $new (erlaubt: 1–65535)" >&2
        exit 1
      fi
      echo "$new" > "$PORT_FILE"
      PORT="$new"
      echo "Port auf $PORT gesetzt."
      if running; then
        run
      fi
      ;;
    *)
      echo "Verwendung: $0 {start|stop|restart|status|logs|port [nummer]|deploy|update}"
      exit 1
      ;;
  esac
}

# Direkt nach der Einrichtung kennt die laufende Sitzung die docker-Gruppe noch nicht –
# dann einmal mit der Gruppe neu starten, statt mit "permission denied" abzubrechen
if ! docker info >/dev/null 2>&1 && id -nG "$(id -un)" | grep -qw docker && [ -z "${HOLIDAY_SG:-}" ]; then
  exec env HOLIDAY_SG=1 sg docker -c "$(printf "%q " "$DIR/holiday.sh" "$@")"
fi

# erst die ganze Datei einlesen, dann ausführen – so stört ein git-Update dieses Skripts nicht
main "$@"
exit
