# 🌍 HolidaySelector

Eine kleine Website, auf der meine Freundin unseren nächsten Urlaub auswählt:

- **🎲 Zufall** – eines der Reiseziele wird zufällig gezogen
- **🗺️ Reiseziel wählen** – sie sucht sich selbst eines aus
- **🎁 Überraschung** – sie erfährt das Ziel gar nicht

Die Reiseziele (Hotel, Bild, Reisezeit, Flüge) stehen in [`site/destinations.js`](site/destinations.js),
eigene Bilder liegen in `site/images/`.

## Wie das Deployment funktioniert

- **CI:** Bei jedem Push prüft die GitHub Action [`ci.yml`](.github/workflows/ci.yml), ob die Skripte
  gültig sind, das Docker-Image baut und die Website antwortet.
- **CD:** Der Raspberry Pi holt sich Updates selbst. Ein systemd-Timer ruft jede Minute
  `holiday.sh update` auf: Gibt es neue Commits auf `main`, zieht der Pi sie, baut das
  nginx-Docker-Image neu und startet die Website neu. Der Pi muss dafür nicht aus dem Internet
  erreichbar sein, und es braucht keinen GitHub-Runner.

Ein Push ist also spätestens nach etwa einer Minute live.

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
urlaub status    # läuft sie gerade? welcher Stand?
urlaub restart
urlaub logs
urlaub update    # sofort nach Updates schauen, statt auf den Timer zu warten
```

Die Website ist dann unter `http://<IP-vom-Pi>:8080` erreichbar.

Mit `urlaub stop` gestoppt bleibt gestoppt: Updates bauen dann nur das Image neu, und beim
nächsten `urlaub start` läuft sofort der neueste Stand.

Was das Auto-Update gemacht hat, zeigt:

```bash
journalctl -u holiday-update -n 20
```

## Lokal ansehen

`site/index.html` einfach im Browser öffnen – es braucht keinen Server.
