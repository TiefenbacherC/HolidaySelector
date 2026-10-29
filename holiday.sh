#!/usr/bin/env bash
# Steuerung der Urlaubs-Website auf dem Pi.
#   ./holiday.sh start    – Website starten (baut das Image, falls nötig)
#   ./holiday.sh stop     – Website stoppen
#   ./holiday.sh restart  – neu starten
#   ./holiday.sh status   – läuft sie?
#   ./holiday.sh logs     – Logs anzeigen
#   ./holiday.sh deploy   – neu bauen und starten
#   ./holiday.sh update   – neue Commits von GitHub holen und ausrollen
#                           (läuft jede Minute automatisch, siehe pi-setup.sh)
set -euo pipefail

NAME="holiday-selector"
IMAGE="holiday-selector:latest"
PORT="${PORT:-8080}"
DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"

build() {
  docker build -q -t "$IMAGE" "$DIR" >/dev/null
  docker image prune -f >/dev/null
}

run() {
  docker rm -f "$NAME" >/dev/null 2>&1 || true
  docker run -d --name "$NAME" --restart unless-stopped -p "$PORT:80" "$IMAGE" >/dev/null
  echo "Website läuft auf http://$(hostname -I 2>/dev/null | awk '{print $1}'):$PORT"
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
      git -C "$DIR" fetch -q origin main
      if [ "$(git -C "$DIR" rev-parse HEAD)" = "$(git -C "$DIR" rev-parse origin/main)" ]; then
        exit 0
      fi
      git -C "$DIR" reset -q --hard origin/main
      echo "Update auf $(git -C "$DIR" log -1 --format='%h %s')"
      # neu einlesen, falls sich dieses Skript selbst geändert hat
      exec "$DIR/holiday.sh" rollout
      ;;
    rollout)
      # nach einem Update: neu bauen, aber nur starten, wenn die Website vorher lief
      if running; then
        main deploy
      else
        build
        echo "Website ist gestoppt – neues Image gebaut, aber nicht gestartet."
      fi
      ;;
    status)
      if running; then
        echo "Website läuft (Port $PORT), Stand: $(git -C "$DIR" log -1 --format='%h %s')"
      else
        echo "Website ist gestoppt."
      fi
      ;;
    logs)
      docker logs -f "$NAME"
      ;;
    *)
      echo "Verwendung: $0 {start|stop|restart|status|logs|deploy|update}"
      exit 1
      ;;
  esac
}

# erst die ganze Datei einlesen, dann ausführen – so stört ein git-Update dieses Skripts nicht
main "$@"
exit
