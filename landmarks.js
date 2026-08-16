// Russian & Russian-Occupied Strategic Landmarks Dataset
const STRATEGIC_LANDMARKS = [
  // ================= RUSSIAN-OCCUPIED UKRAINE & CRIMEA =================
  // Crimea
  { name: "Belbek Air Base (Sevastopol)", lat: 44.6914, lon: 33.5739, type: "airfield", status: "Occupied Crimea" },
  { name: "Saky Air Base (Novofedorivka)", lat: 45.0922, lon: 33.5908, type: "airfield", status: "Occupied Crimea" },
  { name: "Dzhankoi Air Base", lat: 45.7008, lon: 34.4189, type: "airfield", status: "Occupied Crimea" },
  { name: "Gvardeyskoye Air Base", lat: 45.1161, lon: 33.9767, type: "airfield", status: "Occupied Crimea" },
  { name: "Kacha Naval Air Station", lat: 44.7797, lon: 33.5714, type: "airfield", status: "Occupied Crimea" },
  { name: "Simferopol International Airport (Military Use)", lat: 45.0522, lon: 33.9753, type: "airfield", status: "Occupied Crimea" },

  // Occupied Zaporizhzhia & Kherson
  { name: "Melitopol Air Base", lat: 46.8800, lon: 35.3050, type: "airfield", status: "Occupied Zaporizhzhia" },
  { name: "Berdyansk Airfield / Port Logistics Base", lat: 46.8142, lon: 36.7583, type: "airfield", status: "Occupied Zaporizhzhia" },
  { name: "Chornobaivka / Kherson Airport Hub", lat: 46.6739, lon: 32.5064, type: "military", status: "Occupied Kherson Hub" },

  // Occupied Donbas (Donetsk & Luhansk)
  { name: "Donetsk International Airport (Ru Base Ops)", lat: 48.0736, lon: 37.7397, type: "military", status: "Occupied Donetsk" },
  { name: "Luhansk International Airport / Garrison", lat: 48.4164, lon: 39.3842, type: "military", status: "Occupied Luhansk" },

  // ================= WESTERN RUSSIA =================
  // Strategic Air Bases
  { name: "Engels-2 Strategic Airbase", lat: 51.4812, lon: 46.2132, type: "airfield", status: "Russian Federation" },
  { name: "Dyagilevo Strategic Air Base (Ryazan)", lat: 54.6464, lon: 39.5714, type: "airfield", status: "Russian Federation" },
  { name: "Seshcha Strategic Air Base (Bryansk)", lat: 53.7125, lon: 33.3442, type: "airfield", status: "Russian Federation" },
  { name: "Shatalovo Air Base (Smolensk)", lat: 54.3375, lon: 32.4744, type: "airfield", status: "Russian Federation" },
  { name: "Millerovo Air Base (Rostov)", lat: 48.9536, lon: 40.3014, type: "airfield", status: "Russian Federation" },
  { name: "Yeysk Naval Air Base (Krasnodar)", lat: 46.6800, lon: 38.2511, type: "airfield", status: "Russian Federation" },
  { name: "Kursk Vostochny Air Base", lat: 51.7514, lon: 36.2956, type: "airfield", status: "Russian Federation" },
  { name: "Voronezh Malshevo Air Base (Baltimor)", lat: 51.6236, lon: 39.1528, type: "airfield", status: "Russian Federation" },
  { name: "Morozovsk Air Base (Rostov)", lat: 48.3128, lon: 41.7897, type: "airfield", status: "Russian Federation" },
  { name: "Krymsk Air Base", lat: 44.9628, lon: 37.9803, type: "airfield", status: "Russian Federation" },
  { name: "Armavir Air Base", lat: 44.9786, lon: 41.1114, type: "airfield", status: "Russian Federation" },
  { name: "Taganrog-Central Air Base", lat: 47.2008, lon: 38.8475, type: "airfield", status: "Russian Federation" },

  // Intelligence & Security Facilities
  { name: "FSB Regional Directorate (Belgorod)", lat: 50.5975, lon: 36.5882, type: "intel", status: "Russian Federation" },
  { name: "FSB Border Guard Center (Bryansk)", lat: 53.2435, lon: 34.3636, type: "intel", status: "Russian Federation" },
  { name: "FSB Regional Directorate (Kursk)", lat: 51.7303, lon: 36.1925, type: "intel", status: "Russian Federation" },
  { name: "FSB Directorate (Rostov-on-Don)", lat: 47.2225, lon: 39.7150, type: "intel", status: "Russian Federation" },
  { name: "Rosgvardiya Southern District HQ (Rostov)", lat: 47.2357, lon: 39.7015, type: "security", status: "Russian Federation" },
  { name: "Rosgvardiya Center (Voronezh)", lat: 51.6617, lon: 39.2003, type: "security", status: "Russian Federation" },
  { name: "GRU 22nd Spetsnaz Brigade Base (Stepnoy)", lat: 47.3072, lon: 39.8731, type: "military", status: "Russian Federation" },
  { name: "GRU 10th Spetsnaz Brigade Base (Molkino)", lat: 44.6292, lon: 39.1350, type: "military", status: "Russian Federation" }
];
