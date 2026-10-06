// 1. Define your different base tile layers FIRST
const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
});

const googleSatellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Tiles &copy; Google'
});

const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
});

// 2. Initialize Leaflet map focused over Western Russia & Occupied Territories ONCE
const map = L.map('map', {
  center: [48.5, 38.0],
  zoom: 7,
  minZoom: 3,
  maxZoom: 18,
  maxBounds: [
    [-90, -180],
    [90, 180]
  ],
  maxBoundsViscosity: 1.0,
  zoomControl: false,
  layers: [esriSatellite] // Set your default imagery here
});

// 3. Group your base maps for the control toggle
const baseMaps = {
    "Esri World Imagery": esriSatellite,
    "Google Satellite": googleSatellite,
    "OpenStreetMap": openStreetMap
};

// 4. Add the layer control to the map
L.control.layers(baseMaps).addTo(map);

// 5. Boundaries & City Labels Layer (Overlay)
const bordersAndLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Labels &copy; Esri',
  maxZoom: 18,
  pane: 'overlayPane'
}).addTo(map);

// --- Layer Groups ---
const layerGroups = {
  military: L.layerGroup().addTo(map),
  industrial: L.layerGroup().addTo(map),
  petroleum: L.layerGroup().addTo(map),
  naval: L.layerGroup().addTo(map),
  training: L.layerGroup().addTo(map),
  hybrid: L.layerGroup().addTo(map),
  leadership: L.layerGroup().addTo(map),
  biochemical: L.layerGroup().addTo(map),
  palace: L.layerGroup().addTo(map) 
};

function loadStrategicLandmarks() {
  // Clear existing markers from all layer groups
  Object.values(layerGroups).forEach(group => group.clearLayers());

  if (map.getZoom() < 5) return;
  if (typeof STRATEGIC_LANDMARKS === 'undefined') return;

  const bounds = map.getBounds();

  // Filter visible markers
  const visibleLandmarks = STRATEGIC_LANDMARKS.filter(site => bounds.contains([site.lat, site.lon]));

  visibleLandmarks.forEach(site => {
    let iconEmoji = '🪖';
    if (site.type === 'airfield') iconEmoji = '🛫';
    else if (site.type === 'intel') iconEmoji = '👁️';
    else if (site.type === 'security') iconEmoji = '🛡️';
    else if (site.type === 'industrial') iconEmoji = '🏭';
    else if (site.type === 'petroleum') iconEmoji = '🛢️';
    else if (site.type === 'naval') iconEmoji = '⚓';
    else if (site.type === 'training') iconEmoji = '🎯';
    else if (site.type === 'hybrid') iconEmoji = '⚙️';
    else if (site.type === 'leadership') iconEmoji = '🏛️';
    else if (site.type === 'biochemical') iconEmoji = '☣️';
    else if (site.type === 'palace') iconEmoji = '🏰'; 

    const icon = L.divIcon({
      className: 'landmark-marker',
      html: iconEmoji,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const tooltipContent = `<strong>${site.name}</strong><br/><em>${site.status || 'Strategic Facility'}</em>`;

    const marker = L.marker([site.lat, site.lon], { icon })
      .bindTooltip(tooltipContent, { permanent: false, direction: 'top' });

    marker.on('click', () => {
      map.flyTo([site.lat, site.lon], 14, {
        animate: true,
        duration: 1.2
      });

      const coordsInput = document.getElementById('gps-coords');
      if (coordsInput) {
        coordsInput.value = `${site.lat.toFixed(5)}, ${site.lon.toFixed(5)}`;
      }
    });

    // Assign to corresponding group based on site.type
    let targetGroup = layerGroups.military;
    if (layerGroups[site.type]) {
      targetGroup = layerGroups[site.type];
    } else if (site.type === 'airfield' || site.type === 'intel' || site.type === 'security') {
      targetGroup = layerGroups.military;
    }

    targetGroup.addLayer(marker);
  });
}

// --- Category Panel Controls ---
function setAllLayers(state) {
    // Select all checkboxes used for map layers
    const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="toggle-"]');
    
    checkboxes.forEach(box => {
        // Only trigger an update if the checkbox is actually changing
        if (box.checked !== state) {
            box.checked = state;
            
            // Extract the category name from the ID
            const layerType = box.id.replace('toggle-', '');
            
            // Call your existing layer toggle function
            if (typeof toggleLayer === 'function') {
                toggleLayer(layerType);
            }
        }
    });
}

window.setAllLayers = setAllLayers;

// Map Click Listener - Populates GPS field with clicked coordinates
map.on('click', (e) => {
  const lat = e.latlng.lat.toFixed(5);
  const lng = e.latlng.lng.toFixed(5);
  
  const coordsInput = document.getElementById('gps-coords');
  if (coordsInput) {
    coordsInput.value = `${lat}, ${lng}`;
  }
});

// HUD Minimize/Maximize Toggle Handler
function toggleHudPanel() {
  const controls = document.getElementById('hud-controls');
  const toggleBtn = document.getElementById('hud-toggle-btn');
  
  if (controls) {
    controls.classList.toggle('minimized');
    const isMinimized = controls.classList.contains('minimized');
    if (toggleBtn) {
      toggleBtn.innerText = isMinimized ? '+' : '−';
    }
  }
}

// Toggle Handler
function toggleLayer(layerType) {
  if (layerType === 'borders') {
    map.hasLayer(bordersAndLabels) ? map.removeLayer(bordersAndLabels) : map.addLayer(bordersAndLabels);
    return;
  }

  const group = layerGroups[layerType];
  if (group) {
    if (map.hasLayer(group)) {
      map.removeLayer(group);
    } else {
      map.addLayer(group);
    }
  }
}

// Map Configuration Constants
const INITIAL_CENTER = [48.5, 38.0];
const INITIAL_ZOOM = 7;

function resetMapView() {
  map.flyTo(INITIAL_CENTER, INITIAL_ZOOM, {
    animate: true,
    duration: 1.2
  });
}

// Copy GPS coordinates to clipboard
function copyCoordinates() {
  const coordsInput = document.getElementById('gps-coords');
  const copyBtn = document.getElementById('copy-coords-btn');

  if (!coordsInput || !coordsInput.value || coordsInput.value.includes('Select point')) return;

  const rawCoords = coordsInput.value.trim();

  navigator.clipboard.writeText(rawCoords).then(() => {
    if (copyBtn) {
      const originalText = copyBtn.innerText;
      copyBtn.innerText = '✅';
      setTimeout(() => {
        copyBtn.innerText = originalText;
      }, 1500);
    }
  }).catch(err => {
    console.error('Failed to copy coordinates:', err);
  });
}

// --- Search Feature ---
async function handleSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    const query = searchInput.value.trim();
    if (!query) return;

    // 1. Check existing STRATEGIC_LANDMARKS first
    if (typeof STRATEGIC_LANDMARKS !== 'undefined') {
        const localMatch = STRATEGIC_LANDMARKS.find(site => 
            site.name.toLowerCase().includes(query.toLowerCase())
        );

        if (localMatch) {
            // Local match found! Fly to it.
            map.flyTo([localMatch.lat, localMatch.lon], 14, { animate: true, duration: 1.2 });
            return; 
        }
    }

    // 2. Fallback to OpenStreetMap Nominatim API for actual map search
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);

            // Fly to the searched coordinates
            map.flyTo([lat, lon], 12, { animate: true, duration: 1.2 });
        } else {
            console.warn("Location not found.");
            alert("Location not found locally or globally.");
        }
    } catch (error) {
        console.error("Geocoding search error:", error);
        alert("Search failed. Please try again later.");
    }
}

window.handleSearch = handleSearch;

// Global Exports
window.toggleHudPanel = toggleHudPanel;
window.resetMapView = resetMapView;
window.toggleLayer = toggleLayer;
window.copyCoordinates = copyCoordinates;

// Event Listeners
map.on('moveend', loadStrategicLandmarks);

const searchBox = document.getElementById('search-input');
if (searchBox) {
    searchBox.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

// Initial Load Execution
loadStrategicLandmarks();
