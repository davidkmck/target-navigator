// Initialize Leaflet map focused over Western Russia & Occupied Territories
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
  zoomControl: false
});

// Secondary High-Res Satellite Layer (Fallback for Esri 404 gaps)
const fallbackSatellite = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  attribution: 'Tiles &copy; Google'
}).addTo(map);

// Primary Esri World Imagery Layer
const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri',
  maxZoom: 18,
  maxNativeZoom: 15,
  errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
}).addTo(map);

// Boundaries & City Labels Layer
const bordersAndLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Labels &copy; Esri',
  maxZoom: 18,
  pane: 'overlayPane'
}).addTo(map);

// Create layer groups for targets
const militaryLandmarksGroup = L.layerGroup().addTo(map);
const industrialLandmarksGroup = L.layerGroup().addTo(map);
const petroleumLandmarksGroup = L.layerGroup().addTo(map);

function loadStrategicLandmarks() {
  militaryLandmarksGroup.clearLayers();
  industrialLandmarksGroup.clearLayers();
  petroleumLandmarksGroup.clearLayers();

  if (map.getZoom() < 5) return;
  if (typeof STRATEGIC_LANDMARKS === 'undefined') return;

  const bounds = map.getBounds();

  const visibleLandmarks = STRATEGIC_LANDMARKS.filter(site => bounds.contains([site.lat, site.lon]));
  const landmarksToRender = visibleLandmarks.slice(0, 24);

  landmarksToRender.forEach(site => {
    let iconEmoji = '🪖';
    if (site.type === 'airfield') iconEmoji = '🛫';
    else if (site.type === 'intel') iconEmoji = '👁️';
    else if (site.type === 'security') iconEmoji = '🛡️';
    else if (site.type === 'industrial') iconEmoji = '🏭';
    else if (site.type === 'petroleum') iconEmoji = '🛢️';

    const icon = L.divIcon({
      className: 'landmark-marker',
      html: iconEmoji,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const tooltipContent = `<strong>${site.name}</strong><br/><em>${site.status || 'Strategic Facility'}</em>`;

    const marker = L.marker([site.lat, site.lon], { icon })
      .bindTooltip(tooltipContent, { permanent: false, direction: 'top' });

    // Marker Click: Zooms into target site AND populates GPS field with exact coordinates
    marker.on('click', () => {
      map.flyTo([site.lat, site.lon], 10, {
        animate: true,
        duration: 1.2
      });

      const coordsInput = document.getElementById('gps-coords');
      if (coordsInput) {
        coordsInput.value = `${site.lat.toFixed(5)}, ${site.lon.toFixed(5)}`;
      }
    });

    // Add to specific group for toggling
    if (site.type === 'industrial') {
      industrialLandmarksGroup.addLayer(marker);
    } else if (site.type === 'petroleum') {
      petroleumLandmarksGroup.addLayer(marker);
    } else {
      militaryLandmarksGroup.addLayer(marker);
    }
  });
}

// Query Copernicus STAC API directly via POST request
async function fetchImageryDate(lat, lng) {
  const delta = 0.005;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta];

  const url = 'https://catalogue.dataspace.copernicus.eu/stac/search';

  const bodyData = {
    collections: ['SENTINEL-2'],
    bbox: bbox,
    limit: 1,
    sortby: [
      {
        field: 'properties.datetime',
        direction: 'desc'
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const rawDate = data.features[0].properties.datetime;
      if (rawDate) {
        return rawDate.split('T')[0]; // Returns clean YYYY-MM-DD date
      }
    }
  } catch (err) {
    console.error("Copernicus STAC catalog error:", err);
  }
  return "Date Unavailable";
}

// Map Click Listener
map.on('click', async (e) => {
  const lat = e.latlng.lat.toFixed(5);
  const lng = e.latlng.lng.toFixed(5);
  
  const coordsInput = document.getElementById('gps-coords');
  const dateInput = document.getElementById('imagery-date');

  if (coordsInput) {
    coordsInput.value = `${lat}, ${lng}`;
  }

  if (dateInput) {
    dateInput.value = "Fetching Copernicus date...";
  }

  const captureDate = await fetchImageryDate(e.latlng.lat, e.latlng.lng);

  if (dateInput) {
    dateInput.value = captureDate;
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
  } else if (layerType === 'military') {
    map.hasLayer(militaryLandmarksGroup) ? map.removeLayer(militaryLandmarksGroup) : map.addLayer(militaryLandmarksGroup);
  } else if (layerType === 'industrial') {
    map.hasLayer(industrialLandmarksGroup) ? map.removeLayer(industrialLandmarksGroup) : map.addLayer(industrialLandmarksGroup);
  } else if (layerType === 'petroleum') {
    map.hasLayer(petroleumLandmarksGroup) ? map.removeLayer(petroleumLandmarksGroup) : map.addLayer(petroleumLandmarksGroup);
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

// Global Exports
window.toggleHudPanel = toggleHudPanel;
window.resetMapView = resetMapView;
window.toggleLayer = toggleLayer;
window.copyCoordinates = copyCoordinates;

// Event Listeners
map.on('moveend', loadStrategicLandmarks);

// Initial Load Execution
loadStrategicLandmarks();
