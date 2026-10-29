#!/usr/bin/env bash
# Einmalige Einrichtung auf dem Raspberry Pi:
#   curl -fsSL https://raw.githubusercontent.com/TiefenbacherC/HolidaySelector/main/pi-setup.sh | bash
#
# Installiert Docker und git, klont das Repo nach ~/HolidaySelector, legt den Befehl
# "urlaub" an, startet die Website und richtet das Auto-Update ein: ein systemd-Timer
# schaut jede Minute auf GitHub nach neuen Commits und rollt sie aus.
set -euo pipefail

REPO="https://github.com/TiefenbacherC/HolidaySelector.git"
DIR="$HOME/HolidaySelector"
USER_NAME="$(id -un)"

echo "==> Pakete prüfen"
if ! command -v git >/dev/null; then
  sudo apt-get update -q
  sudo apt-get install -y -q git
fi
if ! command -v docker >/dev/null; then
  curl -fsSL https://get.docker.com | sudo sh
fi
sudo usermod -aG docker "$USER_NAME"

echo "==> Repo holen"
if [ -d "$DIR/.git" ]; then
  git -C "$DIR" fetch -q origin main
  git -C "$DIR" reset -q --hard origin/main
else
  git clone -q "$REPO" "$DIR"
fi
chmod +x "$DIR/holiday.sh"

echo "==> Befehl 'urlaub' anlegen"
sudo ln -sf "$DIR/holiday.sh" /usr/local/bin/urlaub

echo "==> Auto-Update einrichten"
sudo tee /etc/systemd/system/holiday-update.service >/dev/null <<EOF
[Unit]
Description=HolidaySelector: Updates von GitHub holen und ausrollen
After=network-online.target docker.service
Wants=network-online.target

[Service]
Type=oneshot
User=$USER_NAME
SupplementaryGroups=docker
ExecStart=$DIR/holiday.sh update
EOF

sudo tee /etc/systemd/system/holiday-update.timer >/dev/null <<EOF
[Unit]
Description=HolidaySelector: jede Minute nach Updates schauen

[Timer]
OnBootSec=1min
OnUnitActiveSec=1min

[Install]
WantedBy=timers.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now holiday-update.timer

echo "==> Website starten"
sudo "$DIR/holiday.sh" deploy

echo
echo "Fertig! Ab jetzt aktualisiert sich die Website automatisch bei jedem Push auf main."
echo "Befehle: urlaub start | stop | status | logs"
echo "(Nach dem nächsten Ab- und Anmelden geht 'urlaub' auch ohne sudo.)"
