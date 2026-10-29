const destinations = window.DESTINATIONS;

function show(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function gradient(d) {
  return `linear-gradient(135deg, ${d.colors[0]}, ${d.colors[1]})`;
}

function showDestination(d, eyebrow) {
  document.getElementById("result-eyebrow").textContent = eyebrow;
  const card = document.getElementById("result-card");
  card.style.background = gradient(d);
  card.innerHTML = `
    <div class="big-emoji">${d.emoji}</div>
    <p class="country">${d.country}</p>
    <h2>${d.name}</h2>
    <p>${d.description}</p>
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
    slot.textContent = `${d.emoji} ${d.name}`;
    i++;
    if (i <= spins) {
      delay *= 1.12;
      setTimeout(tick, delay);
    } else {
      setTimeout(() => showDestination(pick, "Der Zufall hat entschieden"), 700);
    }
  }
  tick();
}

function renderCards() {
  const container = document.getElementById("cards");
  container.innerHTML = "";
  destinations.forEach((d) => {
    const btn = document.createElement("button");
    btn.className = "card";
    btn.style.background = gradient(d);
    btn.innerHTML = `
      <span class="big-emoji">${d.emoji}</span>
      <span class="country">${d.country}</span>
      <span class="name">${d.name}</span>
      <span class="desc">${d.description}</span>`;
    btn.addEventListener("click", () => showDestination(d, "Deine Wahl"));
    container.appendChild(btn);
  });
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

document.addEventListener("click", (e) => {
  const action = e.target.closest("[data-action]")?.dataset.action;
  if (action === "random") startRandom();
  if (action === "choose") show("choose");
  if (action === "surprise") showSurprise();
  if (action === "home") show("home");
});

renderCards();
