const MODES = {
  random: "🎲 Zufall",
  choose: "🗺️ Selbst gewählt",
  surprise: "🎁 Überraschung",
  reset: "↺ Zurückgesetzt",
};

// gespeicherte Werte kommen über die API von außen – nie ungeprüft als HTML einsetzen
function esc(s) {
  return String(s).replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
}

function formatTime(iso) {
  return new Date(iso).toLocaleString("de-AT", { dateStyle: "medium", timeStyle: "short" });
}

function outcome(c) {
  if (c.mode === "reset") return "Sie kann neu wählen";
  return c.mode === "surprise" ? "Überraschung – Ziel bleibt geheim" : esc(c.destination);
}

function renderLatest(c) {
  const box = document.getElementById("latest");
  document.getElementById("reset-choice").hidden = !c;
  if (!c) {
    box.style.background = "";
    box.innerHTML = `<p class="muted">Noch keine Auswahl – sie kann jetzt wählen.</p>`;
    return;
  }
  const d = window.DESTINATIONS.find((x) => x.name === c.destination);
  box.style.background = d
    ? `linear-gradient(135deg, ${d.colors[0]}, ${d.colors[1]})`
    : "linear-gradient(135deg, #f093fb, #f5576c)";
  box.innerHTML = `
    <p class="latest-label">Aktuelle Auswahl · ${formatTime(c.time)}</p>
    <h2>${outcome(c)}</h2>
    <p>${MODES[c.mode] ?? ""}</p>
    ${d?.travelTime ? `<p class="travel">📅 ${d.travelTime}</p>` : ""}`;
}

function renderSummary(choices) {
  const counts = {};
  choices.filter((c) => c.mode !== "reset").forEach((c) => {
    const key = c.mode === "surprise" ? "🎁 Überraschung" : c.destination;
    counts[key] = (counts[key] || 0) + 1;
  });
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  document.getElementById("summary").innerHTML = rows.length
    ? rows
        .map(([name, n]) => `<div class="summary-item"><span>${esc(name)}</span><strong>${n}×</strong></div>`)
        .join("")
    : `<p class="muted">–</p>`;
}

function renderHistory(choices) {
  document.getElementById("history").innerHTML = choices
    .slice()
    .reverse()
    .map((c) => `<tr><td>${formatTime(c.time)}</td><td>${MODES[c.mode] ?? ""}</td><td>${outcome(c)}</td></tr>`)
    .join("");
}

async function load() {
  const res = await fetch("/api/choices", { cache: "no-store" });
  const { version, current, choices } = await res.json();
  renderLatest(current);
  renderSummary(choices);
  renderHistory(choices);
  document.getElementById("version").textContent = `Version ${version}`;
}

document.getElementById("reset-choice").addEventListener("click", async () => {
  if (!confirm("Auswahl zurücksetzen? Danach kann sie neu wählen.")) return;
  await fetch("/api/choice", { method: "DELETE" });
  load();
});

document.getElementById("reset-history").addEventListener("click", async () => {
  if (!confirm("Wirklich den ganzen Verlauf löschen? Die aktuelle Auswahl wird dabei auch zurückgesetzt.")) return;
  await fetch("/api/choices", { method: "DELETE" });
  load();
});

load().catch(() => {
  document.getElementById("latest").innerHTML = `<p class="muted">Ergebnisse konnten nicht geladen werden.</p>`;
});
setInterval(() => load().catch(() => {}), 10_000);
