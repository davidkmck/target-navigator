// Russian & Russian-Occupied Strategic Landmarks Dataset
const STRATEGIC_LANDMARKS = [
  // ================= RUSSIAN-OCCUPIED UKRAINE & CRIMEA =================
  // Crimea
  { name: "Belbek Air Base (Sevastopol)", lat: 44.6914, lon: 33.5739, type: "airfield", status: "Occupied Crimea" },
  { name: "Saky Air Base (Novofedorivka)", lat: 45.0922, lon: 33.5908, type: "airfield", status: "Occupied Crimea" },
  { name: "Dzhankoi Air Base", lat: 45.7008, lon: 34.4189, type: "airfield", status: "Occupied Crimea" },
  { name: "Gvardeyskoye Air Base", lat: 45.1161, lon: 33.9767, type: "airfield", status: "Occupied Crimea" },
  { name: "Kacha Naval Air Station", lat: 44.7797, lon: 33.5714, type: "naval", status: "Occupied Crimea" },
  { name: "Simferopol International Airport (Military Use)", lat: 45.0522, lon: 33.9753, type: "airfield", status: "Occupied Crimea" },

  // Occupied Zaporizhzhia & Kherson
  { name: "Melitopol Air Base", lat: 46.8800, lon: 35.3050, type: "airfield", status: "Occupied Zaporizhzhia" },
  { name: "Berdyansk Airfield / Port Logistics Base", lat: 46.8142, lon: 36.7583, type: "naval", status: "Occupied Zaporizhzhia" },
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
  { name: "Yeysk Naval Air Base (Krasnodar)", lat: 46.6800, lon: 38.2511, type: "naval", status: "Russian Federation" },
  { name: "Kursk Vostochny Air Base", lat: 51.7514, lon: 36.2956, type: "airfield", status: "Russian Federation" },
  { name: "Voronezh Malshevo Air Base (Baltimor)", lat: 51.6236, lon: 39.1528, type: "airfield", status: "Russian Federation" },
  { name: "Morozovsk Air Base (Rostov)", lat: 48.3128, lon: 41.7897, type: "airfield", status: "Russian Federation" },
  { name: "Krymsk Air Base", lat: 44.9628, lon: 37.9803, type: "airfield", status: "Russian Federation" },
  { name: "Armavir Air Base", lat: 44.9786, lon: 41.1114, type: "airfield", status: "Russian Federation" },
  { name: "Taganrog-Central Air Base", lat: 47.2008, lon: 38.8475, type: "airfield", status: "Russian Federation" },

  // Leadership, Intelligence & Security Facilities
  { name: "FSB Regional Directorate (Belgorod)", lat: 50.5975, lon: 36.5882, type: "leadership", status: "Russian Federation" },
  { name: "FSB Border Guard Center (Bryansk)", lat: 53.2435, lon: 34.3636, type: "leadership", status: "Russian Federation" },
  { name: "FSB Regional Directorate (Kursk)", lat: 51.7303, lon: 36.1925, type: "leadership", status: "Russian Federation" },
  { name: "FSB Directorate (Rostov-on-Don)", lat: 47.2225, lon: 39.7150, type: "leadership", status: "Russian Federation" },
  { name: "Rosgvardiya Southern District HQ (Rostov)", lat: 47.2357, lon: 39.7015, type: "leadership", status: "Russian Federation" },
  { name: "Rosgvardiya Center (Voronezh)", lat: 51.6617, lon: 39.2003, type: "leadership", status: "Russian Federation" },
  { name: "GRU 22nd Spetsnaz Brigade Base (Stepnoy)", lat: 47.3072, lon: 39.8731, type: "training", status: "Russian Federation" },
  { name: "GRU 10th Spetsnaz Brigade Base (Molkino)", lat: 44.6292, lon: 39.1350, type: "training", status: "Russian Federation" },

  // ================= MILITARY-INDUSTRIAL & HYBRID LANDMARKS =================
  { name: "Votkinsk Machine Building Plant (Iskander/ICBM)", lat: 57.0506, lon: 54.0017, type: "industrial", status: "Missile Production" },
  { name: "Uralvagonzavod (Nizhny Tagil - Tank Production)", lat: 57.9069, lon: 60.0864, type: "industrial", status: "Armor Manufacturing" },
  { name: "Kurganmashzavod (Kurgan - BMP Production)", lat: 55.4514, lon: 65.3211, type: "industrial", status: "Armored Vehicles" },
  { name: "Almaz-Antey Avangard Plant (Moscow - SAM Missiles)", lat: 55.8344, lon: 37.5028, type: "hybrid", status: "Air Defense Assembly" },
  { name: "Kazan Aviation Plant (Tupolev Bomber Production)", lat: 55.8561, lon: 49.1239, type: "industrial", status: "Aerospace Assembly" },
  { name: "Ulan-Ude Aviation Plant (Helicopter Production)", lat: 51.8386, lon: 107.7289, type: "industrial", status: "Helicopter Assembly" },
  { name: "Sevmash Shipyard (Severodvinsk - Nuclear Submarines)", lat: 64.5772, lon: 39.8281, type: "naval", status: "Naval Shipyard" },
  { name: "Admiralty Shipyards (St. Petersburg - Submarines)", lat: 59.9189, lon: 30.2811, type: "naval", status: "Naval Shipyard" },
  { name: "State Research Institute Kristall (Dzerzhinsk - Explosives)", lat: 56.2411, lon: 43.4356, type: "hybrid", status: "Explosives & Munitions" },

  // ================= SIBERIA & CENTRAL RUSSIA =================
  { name: "Ukrainka Strategic Air Base (Amur Region)", lat: 51.1683, lon: 128.4467, type: "airfield", status: "Tu-95MS Bomber Base" },
  { name: "Belaya Air Base (Irkutsk)", lat: 52.9150, lon: 103.5750, type: "airfield", status: "Tu-22M3 Bomber Base" },
  { name: "Tolmachevo Airfield (Novosibirsk)", lat: 55.0125, lon: 82.6506, type: "airfield", status: "Siberian Air Hub" },
  { name: "Kansk Air Base (Krasnoyarsk)", lat: 56.1242, lon: 95.6603, type: "airfield", status: "Interceptor Base" },
  { name: "Dombarovsky Air Base (Orenburg)", lat: 51.0928, lon: 59.8517, type: "training", status: "ICBM Silo Base" },
  { name: "Uzhur ICBM Base (Krasnoyarsk)", lat: 55.2811, lon: 89.8256, type: "training", status: "RS-28 Sarmat Base" },

  // ================= RUSSIAN FAR EAST & PACIFIC =================
  { name: "Petropavlovsk-Kamchatsky Naval Base (Vilyuchinsk)", lat: 52.9231, lon: 158.4839, type: "naval", status: "Pacific Submarine Fleet HQ" },
  { name: "Yelizovo Air Base (Kamchatka)", lat: 53.1678, lon: 158.4539, type: "naval", status: "Pacific Naval Aviation" },
  { name: "Komsomolsk-on-Amur Aircraft Plant (KnAAZ)", lat: 50.5925, lon: 137.0817, type: "hybrid", status: "Su-57/Su-35 Production" },
  { name: "Fokino Naval Base (Primorsky Krai)", lat: 42.9739, lon: 132.4042, type: "naval", status: "Pacific Fleet Surface Base" },
  { name: "Anadyr Ugolny Airport (Chukotka)", lat: 64.7350, lon: 177.7411, type: "airfield", status: "Arctic Strategic Base" },

  // ================= PETROLEUM-INDUSTRIAL LANDMARKS =================
  { name: "Omsk Oil Refinery (Gazprom Neft)", lat: 55.0811, lon: 73.2389, type: "petroleum", status: "Major Oil Refinery" },
  { name: "Kirishi Oil Refinery (Surgutneftegas)", lat: 59.4883, lon: 32.0625, type: "petroleum", status: "Northwest Refinery Hub" },
  { name: "Ryazan Oil Refining Company (Rosneft)", lat: 54.5514, lon: 39.8125, type: "petroleum", status: "Central Russia Refinery" },
  { name: "Nizhny Novgorod Refinery (Lukoil - Kstovo)", lat: 56.1261, lon: 44.1839, type: "petroleum", status: "Petrochemical Complex" },
  { name: "Volgograd Oil Refinery (Lukoil)", lat: 48.4981, lon: 44.6050, type: "petroleum", status: "Southern Fuel Refinery" },
  { name: "Tuapse Oil Refinery & Marine Terminal", lat: 44.0931, lon: 39.0833, type: "petroleum", status: "Black Sea Export Terminal" },
  { name: "Novorossiysk Oil Terminal (Sheskharis)", lat: 44.7214, lon: 37.8281, type: "petroleum", status: "Major Black Sea Terminal" },
  { name: "Ust-Luga Oil Terminal & Complex", lat: 59.6833, lon: 28.4000, type: "petroleum", status: "Baltic Sea Export Terminal" },
  { name: "Yaroslavl Oil Refinery (Slavneft)", lat: 57.5483, lon: 39.8167, type: "petroleum", status: "Strategic Fuel Production" },
  { name: "Ilsky Oil Refinery (Krasnodar)", lat: 44.8625, lon: 38.5639, type: "petroleum", status: "Regional Fuel Processing" },
  { name: "Feodosia Oil Depot (Crimea)", lat: 45.0411, lon: 35.3850, type: "petroleum", status: "Occupied Crimea Fuel Hub" }
];
