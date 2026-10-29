// Die Reiseziele – hier einfach anpassen, pushen, fertig.
// hotel: null  → es wird ein Hotel-Platzhalter angezeigt

// Booking zeigt ohne Reisedaten eine Fehlerseite, daher hängen sie an jedem Hotel-Link
const BOOKING_PARAMS = "?checkin=2027-06-08&checkout=2027-06-13&group_adults=2&group_children=0&no_rooms=1";

window.DESTINATIONS = [
  {
    name: "Gran Canaria",
    country: "Kanarische Inseln",
    emoji: "🏝️",
    description: "Dünen von Maspalomas, Sonne satt und der Atlantik direkt vor der Tür.",
    travelTime: "Reisezeit folgt",
    colors: ["#ffb347", "#ff6f61"],
    hotel: {
      name: "Paradisus by Meliá Gran Canaria – All Inclusive",
      location: "San Agustín",
      image: "https://r-xx.bstatic.com/xdata/images/hotel/1200x630/928511478.jpg?k=0a19e5a07ae19d24a5d18cab3cb5bd357c34b0dd502e9538a0fa605fb0f360d2&o=",
      url: "https://www.booking.com/hotel/es/hotel-es-paradisusgrancanaria.de.html" + BOOKING_PARAMS,
    },
  },
  {
    name: "Fuerteventura",
    country: "Kanarische Inseln",
    emoji: "🏄",
    description: "Endlose weiße Strände, türkises Wasser und ganz viel Ruhe.",
    travelTime: "Reisezeit folgt",
    colors: ["#4facfe", "#00c6a7"],
    hotel: {
      name: "Secrets Bahía Real Resort & Spa – Adults Only",
      location: "Corralejo",
      image: "https://q-xx.bstatic.com/xdata/images/hotel/1200x630/464900354.jpg?k=b969b0731fd2b23b920a7d6acf59e5502706838fb904d8ebb76921850ef5fddc&o=",
      url: "https://www.booking.com/hotel/es/secrets-bahia-real.de.html" + BOOKING_PARAMS,
    },
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
      url: "https://www.booking.com/hotel/es/paradisus-salinas-lanzarote.de.html" + BOOKING_PARAMS,
    },
  },
  {
    name: "Reiseziel 4",
    country: "Folgt bald",
    emoji: "✨",
    description: "Hier kommt noch ein viertes Ziel hin.",
    travelTime: "Reisezeit folgt",
    colors: ["#43e97b", "#2a9d8f"],
    hotel: null,
  },
];
