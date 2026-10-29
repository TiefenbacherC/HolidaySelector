# 🌍 HolidaySelector

Eine kleine Website, auf der meine Freundin unseren nächsten Urlaub auswählt:

- **🎲 Zufall** – eines der drei Reiseziele wird zufällig gezogen
- **🗺️ Reiseziel wählen** – sie sucht sich eines der drei selbst aus
- **🎁 Überraschung** – sie erfährt das Ziel gar nicht

Die Reiseziele stehen in [`site/destinations.js`](site/destinations.js).

## Wie das Deployment funktioniert

Bei jedem Push auf `main` startet die GitHub Action [`deploy.yml`](.github/workflows/deploy.yml).
Sie läuft auf einem **Self-hosted Runner direkt auf dem Raspberry Pi**, baut dort ein kleines
nginx-Docker-Image und startet den Container neu. Der Pi muss dafür nicht aus dem Internet
erreichbar sein – der Runner verbindet sich selbst zu GitHub.

## Einmalige Einrichtung am Pi

### 1. Docker installieren

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

Danach einmal ab- und wieder anmelden.

### 2. GitHub Runner installieren

Auf GitHub: **Repo → Settings → Actions → Runners → New self-hosted runner → Linux / ARM64**
(bzw. ARM bei 32-bit Raspberry Pi OS). Die dort angezeigten Befehle am Pi ausführen
(`mkdir actions-runner && cd actions-runner`, Download, `./config.sh --url … --token …`).

Danach den Runner als Dienst einrichten, damit er nach einem Neustart automatisch läuft:

```bash
cd ~/actions-runner
sudo ./svc.sh install
sudo ./svc.sh start
```

### 3. Ersten Deploy auslösen

Einfach auf `main` pushen – oder auf GitHub unter **Actions → Deploy auf den Pi → Run workflow**.

### 4. Kurzbefehl `urlaub` anlegen

```bash
chmod +x ~/actions-runner/_work/HolidaySelector/HolidaySelector/holiday.sh
sudo ln -sf ~/actions-runner/_work/HolidaySelector/HolidaySelector/holiday.sh /usr/local/bin/urlaub
```

## Starten & Stoppen

```bash
urlaub start     # Website starten
urlaub stop      # Website stoppen
urlaub status    # läuft sie gerade?
urlaub restart
urlaub logs
```

Die Website ist dann unter `http://<IP-vom-Pi>:8080` erreichbar.
Anderer Port? `PORT=80 urlaub start` (und in der Action `env: PORT: 80` setzen).

> Hinweis: Ein Push startet die Website automatisch neu – auch wenn sie vorher mit
> `urlaub stop` gestoppt wurde.

## Lokal ansehen

`site/index.html` einfach im Browser öffnen – es braucht keinen Server.
