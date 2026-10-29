// Kleiner Webserver ohne Abhängigkeiten: liefert die Website aus und speichert,
// was ausgewählt wurde, damit es unter /result ausgewertet werden kann.
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8080;
const SITE = path.join(__dirname, "site");
const DATA_DIR = process.env.DATA_DIR || "/data";
const DATA_FILE = path.join(DATA_DIR, "choices.json");
const VERSION = process.env.VERSION || "dev";
const MODES = ["random", "choose", "surprise"];

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function loadChoices() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveChoices(choices) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE + ".tmp", JSON.stringify(choices, null, 2));
  fs.renameSync(DATA_FILE + ".tmp", DATA_FILE);
}

// Es gilt immer nur eine Auswahl – bis sie unter /result zurückgesetzt wird.
// Zurücksetzen hängt einen "reset"-Eintrag an, damit der Verlauf erhalten bleibt.
function currentChoice(choices) {
  const last = choices[choices.length - 1];
  return last && last.mode !== "reset" ? last : null;
}

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 10_000) req.destroy();
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

async function handleApi(req, res, url) {
  if (url === "/api/choices" && req.method === "GET") {
    const choices = loadChoices();
    return json(res, 200, { version: VERSION, current: currentChoice(choices), choices });
  }

  if (url === "/api/choice" && req.method === "GET") {
    return json(res, 200, { choice: currentChoice(loadChoices()) });
  }

  if (url === "/api/choice" && req.method === "DELETE") {
    const choices = loadChoices();
    if (currentChoice(choices)) {
      choices.push({ time: new Date().toISOString(), mode: "reset", destination: null });
      saveChoices(choices);
    }
    return json(res, 200, { ok: true });
  }

  if (url === "/api/choices" && req.method === "DELETE") {
    saveChoices([]);
    return json(res, 200, { ok: true });
  }

  if (url === "/api/choice" && req.method === "POST") {
    let data;
    try {
      data = JSON.parse(await readBody(req));
    } catch {
      return json(res, 400, { error: "Ungültiges JSON" });
    }
    const destination = typeof data.destination === "string" ? data.destination.slice(0, 100) : null;
    if (!MODES.includes(data.mode) || (data.mode !== "surprise" && !destination)) {
      return json(res, 400, { error: "Ungültige Auswahl" });
    }
    const choices = loadChoices();
    const current = currentChoice(choices);
    if (current) {
      return json(res, 409, { error: "Es wurde bereits gewählt", choice: current });
    }
    const choice = { time: new Date().toISOString(), mode: data.mode, destination };
    choices.push(choice);
    saveChoices(choices);
    return json(res, 201, { choice });
  }

  json(res, 404, { error: "Nicht gefunden" });
}

function serveStatic(req, res, url) {
  if (url === "/") url = "/index.html";
  if (url === "/result" || url === "/result/") url = "/result.html";

  const file = path.normalize(path.join(SITE, decodeURIComponent(url)));
  if (!file.startsWith(SITE + path.sep)) {
    res.writeHead(403);
    return res.end();
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Nicht gefunden");
    }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}

http
  .createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url.startsWith("/api/")) {
      handleApi(req, res, url).catch((err) => {
        console.error(err);
        json(res, 500, { error: "Serverfehler" });
      });
    } else {
      serveStatic(req, res, url);
    }
  })
  .listen(PORT, () => console.log(`HolidaySelector ${VERSION} läuft auf Port ${PORT}`));
