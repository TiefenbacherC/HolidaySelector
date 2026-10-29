// Die Reiseziele – hier einfach anpassen, pushen, fertig.
// hotel: null  → es wird ein Hotel-Platzhalter angezeigt
// flights      → optional, wird im Info-Fenster angezeigt
// hotel.gallery → weitere Bilder, im Info-Fenster durchblätterbar

// Booking zeigt ohne Reisedaten eine Fehlerseite, daher hängen sie an jedem Hotel-Link
function booking(path, checkin = "2027-06-08", checkout = "2027-06-13") {
  return `https://www.booking.com/hotel/${path}.de.html?checkin=${checkin}&checkout=${checkout}&group_adults=2&group_children=0&no_rooms=1`;
}

// Hotelbild von Booking (max. 1024×768)
function bstatic(file) {
  return `https://cf.bstatic.com/xdata/images/hotel/max1024x768/${file}&o=`;
}

window.DESTINATIONS = [
  {
    name: "Gran Canaria",
    country: "Spanien",
    travelTime: "2.–9. Juni 2027 · 7 Nächte",
    colors: ["#ffb347", "#ff6f61"],
    hotel: {
      name: "Paradisus by Meliá Gran Canaria – All Inclusive",
      location: "San Agustín",
      image: "images/gran-canaria.webp",
      url: booking("es/hotel-es-paradisusgrancanaria", "2027-06-02", "2027-06-09"),
      gallery: [
        bstatic("928511478.jpg?k=0a19e5a07ae19d24a5d18cab3cb5bd357c34b0dd502e9538a0fa605fb0f360d2"),
        bstatic("930994577.jpg?k=3007265af75b94d53dcb75db486301d96742109d7cc10fb8a2f0e379dc7fe71c"),
        bstatic("930994578.jpg?k=58e05f9e70bc552034f5a26e742eb0ebcfa5f630246384b5e0db41a650fde786"),
        bstatic("930994580.jpg?k=a1ce74e2488a438aaead90eccc82b87da97dbe97464c26411c3a03f01dadcf15"),
        bstatic("930994581.jpg?k=91cb2e6726c9612a98caeb430ced35a618c2c2fb86a19b7a380ba9d54a904996"),
        bstatic("930994582.jpg?k=dfc4055895d02d0d250abec2807c5dcd5934d1018f19a6c4416b1e72515822a2"),
        bstatic("930994584.jpg?k=0bb9b478403a4b7c50a2747c0b15cd0da86d447a3d89b061b7ff3529b5b1d82e"),
        bstatic("930994587.jpg?k=cd225c6046edcef28429796c4e43aaea873dd2f2edd5fd063f6d43b4ffba4878"),
      ],
    },
    flights: [
      { label: "Hinflug", date: "Mi, 2. Juni", route: "München → Gran Canaria", time: "12:10 – 16:05", flight: "Condor 1522 · Nonstop" },
      { label: "Rückflug", date: "Mi, 9. Juni", route: "Gran Canaria → München", time: "17:05 – 22:30", flight: "Condor 1523 · Nonstop" },
    ],
  },
  {
    name: "Fuerteventura",
    country: "Spanien",
    travelTime: "1.–8. Juni 2027 · 7 Nächte",
    colors: ["#4facfe", "#00c6a7"],
    hotel: {
      name: "Secrets Bahía Real Resort & Spa – Adults Only",
      location: "Corralejo",
      image: "images/fuerteventura.webp",
      url: booking("es/secrets-bahia-real", "2027-06-01", "2027-06-08"),
      gallery: [
        bstatic("464900354.jpg?k=b969b0731fd2b23b920a7d6acf59e5502706838fb904d8ebb76921850ef5fddc"),
        bstatic("520013324.jpg?k=26e43951981c66aea0acd90ce16632b4fa2d90f37282c67b55fb242572c26524"),
        bstatic("520013331.jpg?k=9f97e8f02f4f76fc1c4d41002930bd080a27d45e82f63f0dcacbadec80fbbeab"),
        bstatic("520013338.jpg?k=cfadc79e209e8545d2761daa3b89d118e3396593b25682dff8945680317a5e7a"),
        bstatic("520013346.jpg?k=fb28fed334596c2aac7bf6b919a72315519a3aad6caca553138e7190ade599d1"),
        bstatic("520013359.jpg?k=50e4a0cd017d7890055dc019cf02684c0f2055f84471b6c341e06a8d8da33102"),
        bstatic("520013378.jpg?k=44e5d27982c508c299e002e071a12a0743b8e2172a619c012020aeb36c00c21f"),
        bstatic("520013389.jpg?k=51ba1149f7ccb7afbe610694d5bd6c29dac5f45884b3a9ea45efa6ec9581f99b"),
      ],
    },
    flights: [
      { label: "Hinflug", date: "Di, 1. Juni", route: "München → Fuerteventura", time: "6:00 – 9:40", flight: "Condor 1412 · Nonstop" },
      { label: "Rückflug", date: "Di, 8. Juni", route: "Fuerteventura → München", time: "10:35 – 15:55", flight: "Condor 1413 · Nonstop" },
    ],
  },
  {
    name: "Lanzarote",
    country: "Spanien",
    travelTime: "4.–10. Juni 2027 · 6 Nächte",
    colors: ["#f7797d", "#7b61ff"],
    hotel: {
      name: "Paradisus by Meliá Salinas Lanzarote – All Inclusive – Adults Only",
      location: "Costa Teguise",
      image: "https://r-xx.bstatic.com/xdata/images/hotel/1200x630/921798238.jpg?k=9291153e866326b04aedf2feaabe84080b11c24f4abde3e90ba6829825d79c9b&o=",
      url: booking("es/paradisus-salinas-lanzarote", "2027-06-04", "2027-06-10"),
      gallery: [
        bstatic("931771812.jpg?k=c902c3e4386d70e01569105da85d72443bdf29b37a1686a37507def72980cbe2"),
        bstatic("931771816.jpg?k=d77a19de40481551ff01a477b81b8d41d7a2c9f9ac75615dd077564cb32f3d77"),
        bstatic("931771818.jpg?k=005198ef3fa2c98d0b50e723a805f96496180afbc316d65837e13362add35c48"),
        bstatic("931771821.jpg?k=3ce2f11519cb3ffae2d8329f3c0743b52fd3f62da92136ad583c00d7d6f6f98a"),
        bstatic("931771822.jpg?k=04ff09d94454dc00bce25f4e079eb65d2370de96634722b4ebd589d0e95e8587"),
        bstatic("931771824.jpg?k=aff948b6e58a8ca31182059d3f290044c11b05170d1a84153e3272da45b786e9"),
        bstatic("931771825.jpg?k=de320c10fcd36dfe0d7bd8f5712f694c08cbf091561303954fb65acd4316b61b"),
      ],
    },
    flights: [
      { label: "Hinflug", date: "Fr, 4. Juni", route: "München → Lanzarote", time: "6:15 – 9:45", flight: "Condor 1400 · Nonstop" },
      { label: "Rückflug", date: "Do, 10. Juni", route: "Lanzarote → München", time: "11:15 – 19:05", flight: "Iberia 1502 + 1313 · Umstieg in Madrid" },
    ],
  },
  {
    name: "Sizilien",
    country: "Italien",
    travelTime: "2.–9. Juni 2027 · 7 Nächte",
    colors: ["#43e97b", "#2a9d8f"],
    hotel: {
      name: "The Signature Level at Grand Palladium Sicilia Resort & Spa",
      location: "Campofelice di Roccella",
      image: "https://r-xx.bstatic.com/xdata/images/hotel/1200x630/221578930.jpg?k=6faaa12d676ff5a26b074f96f457975b2bbba714f1319c49bc0c4cd4411e16e5&o=",
      url: booking("it/the-signature-level-at-grand-palladium-sicilia-resort", "2027-06-02", "2027-06-09"),
      gallery: [
        bstatic("429441772.jpg?k=20c89dd907286eb24c78c8b07d9681e01ae0365fbcc316bb4a7d9be37caf333e"),
        bstatic("429441764.jpg?k=51c4d225b4d63b48c468310d34839311754e254bcc604c3402c89eee3a101b0e"),
        bstatic("429442027.jpg?k=8b7d2a2d52fff248f2e3a63121bb526f423e30a0653b88341e16e50e137c4a60"),
        bstatic("436371301.jpg?k=f24a4101016e201688b322d22aaba9286e46f7c2e6320c2f6136d254b88f5af3"),
        bstatic("436369477.jpg?k=f9ba4a6900e61cc380df0fc2d6ec2b6bb3a123b781596bdd1d9d66fecc9d17ef"),
        bstatic("338105168.jpg?k=eb51481d557f69e01d99ec3e39489a2949a10b8e02f1065d41d4466e92945c27"),
      ],
    },
    flights: [
      { label: "Hinflug", date: "Mi, 2. Juni", route: "München → Palermo", time: "15:25 – 17:25", flight: "ITA Airways 7355 · Nonstop" },
      { label: "Rückflug", date: "Mi, 9. Juni", route: "Palermo → München", time: "18:15 – 20:15", flight: "ITA Airways 7346 · Nonstop" },
    ],
  },
];
