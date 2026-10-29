const destinations = window.DESTINATIONS;

function show(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function gradient(d) {
  return `linear-gradient(135deg, ${d.colors[0]}, ${d.colors[1]})`;
}

// Hotelbild – oder ein Platzhalter, wenn (noch) kein Hotel eingetragen ist
// bzw. das Bild nicht geladen werden kann
function thumbnail(d) {
  const placeholder = `<div class="thumb placeholder" style="background:${gradient(d)}"><span>🏨</span><small>Hotel folgt</small></div>`;
  if (!d.hotel?.image) return placeholder;
  return `<img class="thumb" src="${d.hotel.image}" alt="${d.hotel.name}" loading="lazy"
    onerror="this.outerHTML = this.dataset.fallback" data-fallback='${placeholder}'>`;
}

function infoButton(d, cls = "") {
  return `<button class="btn ${cls}" data-action="info" data-index="${destinations.indexOf(d)}">ℹ️ Infos</button>`;
}

// Bildergalerie fürs Info-Fenster: Hauptbild + hotel.gallery, durchblättern per
// Pfeil, Wischen (scroll-snap) oder Pfeiltasten. Bilder, die nicht laden, fliegen raus.
function gallery(d) {
  const images = [...new Set([d.hotel?.image, ...(d.hotel?.gallery ?? [])].filter(Boolean))];
  if (images.length < 2) return thumbnail(d);
  return `
    <div class="gallery">
      <div class="gallery-track">
        ${images
          .map(
            (src, i) => `<img src="${src}" alt="${d.hotel.name} – Bild ${i + 1}"
              loading="${i === 0 ? "eager" : "lazy"}" onerror="this.remove(); updateGallery()">`
          )
          .join("")}
      </div>
      <button class="gallery-nav prev" data-action="gallery" data-step="-1" aria-label="Vorheriges Bild">‹</button>
      <button class="gallery-nav next" data-action="gallery" data-step="1" aria-label="Nächstes Bild">›</button>
      <span class="gallery-count"></span>
    </div>`;
}

function galleryTrack() {
  return document.querySelector("#info .gallery-track");
}

function updateGallery() {
  const track = galleryTrack();
  if (!track) return;
  const count = track.children.length;
  const index = Math.round(track.scrollLeft / track.clientWidth);
  track.parentElement.querySelector(".gallery-count").textContent = `${index + 1} / ${count}`;
  track.parentElement.querySelector(".prev").disabled = index === 0;
  track.parentElement.querySelector(".next").disabled = index >= count - 1;
}

// Zielbild merken, damit schnelles Mehrfachklicken auch mehrere Bilder weiterblättert
let galleryTarget = 0;

function stepGallery(step) {
  const track = galleryTrack();
  if (!track) return;
  const current = Math.round(track.scrollLeft / track.clientWidth);
  const from = track.dataset.scrolling ? galleryTarget : current;
  galleryTarget = Math.max(0, Math.min(track.children.length - 1, from + step));
  track.dataset.scrolling = "1";
  track.scrollTo({ left: galleryTarget * track.clientWidth, behavior: "smooth" });
  clearTimeout(stepGallery.timer);
  stepGallery.timer = setTimeout(() => delete track.dataset.scrolling, 600);
}

function showInfo(d) {
  const hotel = d.hotel
    ? `<h3>🏨 ${d.hotel.name}</h3>
       <p class="muted">${d.hotel.location}</p>
       <a class="btn primary" href="${d.hotel.url}" target="_blank" rel="noopener">Hotel auf Booking.com ansehen ↗</a>`
    : `<h3>🏨 Hotel</h3><p class="muted">Wird noch verraten …</p>`;

  const flights = d.flights
    ? `<h3>✈️ Flüge</h3>
       <ul class="flights">
         ${d.flights
           .map(
             (f) => `<li>
               <span class="flight-label">${f.label} · ${f.date}</span>
               <strong>${f.route}</strong>
               <span>${f.time}</span>
               <small class="muted">${f.flight}</small>
             </li>`
           )
           .join("")}
       </ul>`
    : "";

  document.getElementById("info-content").innerHTML = `
    ${gallery(d)}
    <div class="info-body">
      ${d.country ? `<p class="eyebrow">${d.country}</p>` : ""}
      <h2>${d.name}</h2>
      <p class="travel">📅 ${d.travelTime}</p>
      ${flights}
      ${hotel}
    </div>`;
  document.getElementById("info").showModal();
  galleryTrack()?.addEventListener("scroll", updateGallery, { passive: true });
  updateGallery();
}

const EYEBROWS = {
  random: "Der Zufall hat entschieden",
  choose: "Deine Wahl",
  surprise: "Überraschung",
};

// Auswahl speichern. Gewählt werden kann nur einmal – gibt es schon eine Auswahl,
// liefert der Server die bestehende zurück, und die wird angezeigt.
async function record(mode, d) {
  const choice = { mode, destination: d ? d.name : null };
  try {
    const res = await fetch("/api/choice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(choice),
    });
    return (await res.json()).choice ?? choice;
  } catch {
    return choice;
  }
}

function showChoice(choice, celebrate) {
  if (choice.mode === "surprise") return showSurprise(celebrate);
  const d = destinations.find((x) => x.name === choice.destination);
  if (d) showDestination(d, EYEBROWS[choice.mode], celebrate);
}

async function choose(mode, d) {
  showChoice(await record(mode, d), true);
}

function showDestination(d, eyebrow, celebrate) {
  document.getElementById("result-eyebrow").textContent = eyebrow;
  const card = document.getElementById("result-card");
  card.style.background = gradient(d);
  card.innerHTML = `
    ${thumbnail(d)}
    <h2>${d.name}</h2>
    <p class="travel">📅 ${d.travelTime}</p>
    ${infoButton(d, "light")}
    <p class="cheer">Pack die Koffer! 🧳</p>`;
  show("result");
  if (celebrate) confetti();
}

function showSurprise(celebrate) {
  document.getElementById("result-eyebrow").textContent = EYEBROWS.surprise;
  const card = document.getElementById("result-card");
  card.style.background = "linear-gradient(135deg, #f093fb, #f5576c)";
  card.innerHTML = `
    <div class="big-emoji wiggle">🎁</div>
    <h2>Lass dich überraschen!</h2>
    <p>Wohin es geht, bleibt mein Geheimnis – bis wir am Flughafen stehen.</p>
    <p class="cheer">Ich freu mich auf dich ❤️</p>`;
  show("result");
  if (celebrate) confetti();
}

function startRandom() {
  show("random");
  const slot = document.getElementById("slot-text");
  const pick = destinations[Math.floor(Math.random() * destinations.length)];
  // sofort speichern – Neuladen während der Animation bringt also kein neues Ergebnis
  const saved = record("random", pick);
  // ein paar volle Runden, damit die Anzeige am Ende genau auf "pick" stehen bleibt
  const spins = destinations.length * 6 + destinations.indexOf(pick);
  let i = 0;
  let delay = 60;

  function tick() {
    const d = destinations[i % destinations.length];
    slot.textContent = d.name;
    i++;
    if (i <= spins) {
      delay *= 1.1;
      setTimeout(tick, delay);
    } else {
      setTimeout(() => saved.then((choice) => showChoice(choice, true)), 700);
    }
  }
  tick();
}

function renderCards() {
  document.getElementById("cards").innerHTML = destinations
    .map(
      (d, i) => `
      <div class="card" style="background:${gradient(d)}">
        ${thumbnail(d)}
        <div class="card-body">
          <span class="name">${d.name}</span>
          <span class="travel">📅 ${d.travelTime}</span>
          <div class="card-actions">
            ${infoButton(d, "light")}
            <button class="btn primary" data-action="pick" data-index="${i}">Das wird's! ❤️</button>
          </div>
        </div>
      </div>`
    )
    .join("");
}

function confetti() {
  const box = document.getElementById("confetti");
  const colors = ["#ff6f61", "#ffd166", "#06d6a0", "#118ab2", "#f093fb"];
  for (let i = 0; i < 80; i++) {
    const p = document.createElement("span");
    p.style.left = Math.random() * 100 + "vw";
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = Math.random() * 0.6 + "s";
    p.style.animationDuration = 2 + Math.random() * 1.5 + "s";
    box.appendChild(p);
    setTimeout(() => p.remove(), 4500);
  }
}

const infoDialog = document.getElementById("info");

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  const d = destinations[el?.dataset.index];
  const action = el?.dataset.action;
  if (action === "random") startRandom();
  if (action === "choose") show("choose");
  if (action === "surprise") choose("surprise", null);
  if (action === "home") show("home");
  if (action === "info") showInfo(d);
  if (action === "pick") choose("choose", d);
  if (action === "close-info") infoDialog.close();
  if (action === "gallery") stepGallery(Number(el.dataset.step));
});

// Klick neben das Info-Fenster schließt es
infoDialog.addEventListener("click", (e) => {
  if (e.target === infoDialog) infoDialog.close();
});

infoDialog.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") stepGallery(-1);
  if (e.key === "ArrowRight") stepGallery(1);
});

renderCards();

// Wurde schon gewählt, bleibt diese Auswahl angezeigt (bis sie unter /result zurückgesetzt wird)
fetch("/api/choice", { cache: "no-store" })
  .then((res) => res.json())
  .then(({ choice }) => choice && showChoice(choice, false))
  .catch(() => {})
  .finally(() => document.body.classList.add("ready"));
