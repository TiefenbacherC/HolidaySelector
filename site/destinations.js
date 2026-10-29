// Die Reiseziele – hier einfach anpassen, pushen, fertig.
// hotel: null  → es wird ein Hotel-Platzhalter angezeigt
// flights      → optional, wird im Info-Fenster angezeigt

// Booking zeigt ohne Reisedaten eine Fehlerseite, daher hängen sie an jedem Hotel-Link
function booking(path, checkin = "2027-06-08", checkout = "2027-06-13") {
  return `https://www.booking.com/hotel/${path}.de.html?checkin=${checkin}&checkout=${checkout}&group_adults=2&group_children=0&no_rooms=1`;
}

window.DESTINATIONS = [
  {
    name: "Gran Canaria",
    country: "Kanarische Inseln",
    emoji: "🏝️",
    description: "Dünen von Maspalomas, Sonne satt und der Atlantik direkt vor der Tür.",
    travelTime: "2.–9. Juni 2027 · 7 Nächte",
    colors: ["#ffb347", "#ff6f61"],
    hotel: {
      name: "Paradisus by Meliá Gran Canaria – All Inclusive",
      location: "San Agustín",
      image: "images/gran-canaria.webp",
      url: booking("es/hotel-es-paradisusgrancanaria", "2027-06-02", "2027-06-09"),
    },
    flights: [
      { label: "Hinflug", date: "Mi, 2. Juni", route: "München → Gran Canaria", time: "12:10 – 16:05", flight: "Condor 1522 · Nonstop" },
      { label: "Rückflug", date: "Mi, 9. Juni", route: "Gran Canaria → München", time: "17:05 – 22:30", flight: "Condor 1523 · Nonstop" },
    ],
  },
  {
    name: "Fuerteventura",
    country: "Kanarische Inseln",
    emoji: "🏄",
    description: "Endlose weiße Strände, türkises Wasser und ganz viel Ruhe.",
    travelTime: "1.–8. Juni 2027 · 7 Nächte",
    colors: ["#4facfe", "#00c6a7"],
    hotel: {
      name: "Secrets Bahía Real Resort & Spa – Adults Only",
      location: "Corralejo",
      image: "images/fuerteventura.webp",
      url: booking("es/secrets-bahia-real", "2027-06-01", "2027-06-08"),
    },
    flights: [
      { label: "Hinflug", date: "Di, 1. Juni", route: "München → Fuerteventura", time: "6:00 – 9:40", flight: "Condor 1412 · Nonstop" },
      { label: "Rückflug", date: "Di, 8. Juni", route: "Fuerteventura → München", time: "10:35 – 15:55", flight: "Condor 1413 · Nonstop" },
    ],
  },
  {
    name: "Lanzarote",
    country: "Kanarische Inseln",
    emoji: "🌋",
    description: "Vulkanlandschaften, schwarze Strände und Kunst von César Manrique.",
    travelTime: "Reisezeit folgt",
    colors: ["#f7797d", "#7b61ff"],
    hotel: {
      name: "Paradisus by Meliá Salinas Lanzarote – All Inclusive – Adults Only",
      location: "Costa Teguise",
      image: "https://r-xx.bstatic.com/xdata/images/hotel/1200x630/921798238.jpg?k=9291153e866326b04aedf2feaabe84080b11c24f4abde3e90ba6829825d79c9b&o=",
      url: booking("es/paradisus-salinas-lanzarote"),
    },
  },
  {
    name: "Sizilien",
    country: "Italien",
    emoji: "🍋",
    description: "Barocke Städte, der Ätna, Cannoli und Granita – Dolce Vita am Mittelmeer.",
    travelTime: "Reisezeit folgt",
    colors: ["#43e97b", "#2a9d8f"],
    hotel: {
      name: "The Signature Level at Grand Palladium Sicilia Resort & Spa",
      location: "Campofelice di Roccella",
      image: "https://r-xx.bstatic.com/xdata/images/hotel/1200x630/221578930.jpg?k=6faaa12d676ff5a26b074f96f457975b2bbba714f1319c49bc0c4cd4411e16e5&o=",
      url: booking("it/the-signature-level-at-grand-palladium-sicilia-resort", "2027-06-01", "2027-06-06"),
    },
  },
];
