#!/usr/bin/env bash
# Steuerung der Urlaubs-Website auf dem Pi.
#   ./holiday.sh start    – Website starten (baut das Image, falls nötig)
#   ./holiday.sh stop     – Website stoppen
#   ./holiday.sh restart  – neu starten
#   ./holiday.sh status   – läuft sie?
#   ./holiday.sh logs     – Logs anzeigen
#   ./holiday.sh deploy   – neu bauen und starten (wird von der CI/CD-Pipeline aufgerufen)
set -euo pipefail

NAME="holiday-selector"
IMAGE="holiday-selector:latest"
PORT="${PORT:-8080}"
DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"

build() {
  docker build -t "$IMAGE" "$DIR"
}

run() {
  docker rm -f "$NAME" >/dev/null 2>&1 || true
  docker run -d --name "$NAME" --restart unless-stopped -p "$PORT:80" "$IMAGE" >/dev/null
  echo "Website läuft auf http://$(hostname -I 2>/dev/null | awk '{print $1}'):$PORT"
}

case "${1:-}" in
  start)
    docker image inspect "$IMAGE" >/dev/null 2>&1 || build
    run
    ;;
  stop)
    docker rm -f "$NAME" >/dev/null 2>&1 && echo "Website gestoppt." || echo "Website lief nicht."
    ;;
  restart)
    "$0" stop
    "$0" start
    ;;
  deploy)
    build
    run
    docker image prune -f >/dev/null
    ;;
  status)
    if [ "$(docker inspect -f '{{.State.Running}}' "$NAME" 2>/dev/null)" = "true" ]; then
      echo "Website läuft (Port $PORT)."
    else
      echo "Website ist gestoppt."
    fi
    ;;
  logs)
    docker logs -f "$NAME"
    ;;
  *)
    echo "Verwendung: $0 {start|stop|restart|status|logs|deploy}"
    exit 1
    ;;
esac
