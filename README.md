# 🌍 HolidaySelector

Eine kleine Website, auf der meine Freundin unseren nächsten Urlaub auswählt:

- **🎲 Zufall** – eines der Reiseziele wird zufällig gezogen
- **🗺️ Reiseziel wählen** – sie sucht sich selbst eines aus
- **🎁 Überraschung** – sie erfährt das Ziel gar nicht

Die Reiseziele (Hotel, Bild, Reisezeit, Flüge) stehen in [`site/destinations.js`](site/destinations.js),
eigene Bilder liegen in `site/images/`.

## Auswertung

Unter `http://<IP-vom-Pi>:8080/result` siehst du, was gewählt wurde: die letzte Auswahl,
eine Übersicht und den ganzen Verlauf. Die Daten liegen im Docker-Volume `holiday-data`
und bleiben bei Updates erhalten.

Die Website läuft dafür mit einem kleinen Node-Server ([`server.js`](server.js), ohne Abhängigkeiten).

## Wie das Deployment funktioniert

- **CI:** Bei jedem Push prüft die GitHub Action [`ci.yml`](.github/workflows/ci.yml) Skripte und
  JavaScript, baut das Docker-Image und testet Website, `/result` und die API.
- **Release:** `./release.sh` erhöht die Version und pusht einen Tag (z. B. `v1.0.1`).
  [`release.yml`](.github/workflows/release.yml) lässt dann die CI laufen und veröffentlicht nur
  bei Erfolg ein GitHub-Release.
- **CD:** Der Pi holt sich Releases selbst. Ein systemd-Timer ruft jede Minute
  `holiday.sh update` auf: Gibt es ein neueres Release, wechselt der Pi auf diese Version, baut
  das Image neu und startet die Website neu. Der Pi muss dafür nicht aus dem Internet
  erreichbar sein, und es braucht keinen GitHub-Runner.

Ein Push auf `main` allein ändert am Pi also nichts – erst ein Release.

```bash
./release.sh          # v1.0.0 → v1.0.1
./release.sh minor    # v1.0.1 → v1.1.0
./release.sh major    # v1.1.0 → v2.0.0
```

## Einmalige Einrichtung am Pi

Per SSH am Pi anmelden und diesen einen Befehl ausführen:

```bash
curl -fsSL https://raw.githubusercontent.com/TiefenbacherC/HolidaySelector/main/pi-setup.sh | bash
```

Das Skript [`pi-setup.sh`](pi-setup.sh) installiert Docker und git (falls nötig), klont das Repo
nach `~/HolidaySelector`, legt den Befehl `urlaub` an, richtet das Auto-Update ein und startet
die Website. Es kann gefahrlos mehrmals ausgeführt werden.

## Starten & Stoppen

```bash
urlaub start     # Website starten
urlaub stop      # Website stoppen
urlaub status    # läuft sie gerade? welche Version?
urlaub restart
urlaub logs
urlaub port 80   # Port dauerhaft ändern (ohne Zahl: aktuellen Port anzeigen)
urlaub update    # sofort nach einem neuen Release schauen, statt auf den Timer zu warten
```

Die Website ist dann unter `http://<IP-vom-Pi>:8080` erreichbar (Standard-Port 8080). Ein mit
`urlaub port` gesetzter Port wird gespeichert und bleibt auch bei Updates erhalten.

Mit `urlaub stop` gestoppt bleibt gestoppt: Updates bauen dann nur das Image neu, und beim
nächsten `urlaub start` läuft sofort der neueste Stand.

Was das Auto-Update gemacht hat, zeigt:

```bash
journalctl -u holiday-update -n 20
```

## Lokal ansehen

```bash
DATA_DIR=./data node server.js
```

Dann `http://localhost:8080` bzw. `http://localhost:8080/result` öffnen.
