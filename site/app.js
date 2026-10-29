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
    ${thumbnail(d)}
    <div class="info-body">
      <h2>${d.name}</h2>
      <p class="travel">📅 ${d.travelTime}</p>
      ${flights}
      ${hotel}
    </div>`;
  document.getElementById("info").showModal();
}

function showDestination(d, eyebrow) {
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
  confetti();
}

function showSurprise() {
  document.getElementById("result-eyebrow").textContent = "Überraschung";
  const card = document.getElementById("result-card");
  card.style.background = "linear-gradient(135deg, #f093fb, #f5576c)";
  card.innerHTML = `
    <div class="big-emoji wiggle">🎁</div>
    <h2>Lass dich überraschen!</h2>
    <p>Wohin es geht, bleibt mein Geheimnis – bis wir am Flughafen stehen.</p>
    <p class="cheer">Ich freu mich auf dich ❤️</p>`;
  show("result");
  confetti();
}

function startRandom() {
  show("random");
  const slot = document.getElementById("slot-text");
  const pick = destinations[Math.floor(Math.random() * destinations.length)];
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
      setTimeout(() => showDestination(pick, "Der Zufall hat entschieden"), 700);
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
  if (action === "surprise") showSurprise();
  if (action === "home") show("home");
  if (action === "info") showInfo(d);
  if (action === "pick") showDestination(d, "Deine Wahl");
  if (action === "close-info") infoDialog.close();
});

// Klick neben das Info-Fenster schließt es
infoDialog.addEventListener("click", (e) => {
  if (e.target === infoDialog) infoDialog.close();
});

renderCards();
