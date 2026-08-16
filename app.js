// Initialize Leaflet map focused over Western Russia & Occupied Territories
const map = L.map('map', {
  center: [48.5, 38.0], // Centered over Eastern Ukraine / Donbas / Western RU
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

// Satellite Imagery Layer
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri',
  maxZoom: 18
}).addTo(map);

// Boundaries & City Labels Layer
const bordersAndLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Labels &copy; Esri',
  maxZoom: 18,
  pane: 'overlayPane'
}).addTo(map);

// Strategic Landmarks Layer Group
const militaryLandmarksGroup = L.layerGroup().addTo(map);

// Render Strategic Landmarks (Max 24 on screen)
function loadStrategicLandmarks() {
  militaryLandmarksGroup.clearLayers();

  if (map.getZoom() < 5) return;

  if (typeof STRATEGIC_LANDMARKS === 'undefined') {
    console.warn("STRATEGIC_LANDMARKS dataset not loaded.");
    return;
  }

  const bounds = map.getBounds();

  // Filter visible targets within active viewport
  const visibleLandmarks = STRATEGIC_LANDMARKS.filter(site => {
    return bounds.contains([site.lat, site.lon]);
  });

  // Render cap: Max 24 landmarks on screen at once
  const landmarksToRender = visibleLandmarks.slice(0, 24);

  landmarksToRender.forEach(site => {
    let iconEmoji = '🪖';
    if (site.type === 'airfield') iconEmoji = '🛫';
    else if (site.type === 'intel') iconEmoji = '👁️';
    else if (site.type === 'security') iconEmoji = '🛡️';

    const icon = L.divIcon({
      className: 'landmark-marker',
      html: iconEmoji,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const tooltipContent = `<strong>${site.name}</strong><br/><em>${site.status || 'Strategic Site'}</em>`;

    const marker = L.marker([site.lat, site.lon], { icon })
      .bindTooltip(tooltipContent, { 
        permanent: false, 
        direction: 'top' 
      });

    // Tap/Click to smoothly animate and zoom into target coordinates
    marker.on('click', () => {
      map.flyTo([site.lat, site.lon], 13, {
        animate: true,
        duration: 1.2 // Animation speed in seconds
      });
    });
    
    militaryLandmarksGroup.addLayer(marker);
  });
}

// Map Event Listeners
map.on('moveend', loadStrategicLandmarks);
map.on('zoomend', loadStrategicLandmarks);

// Initial Load
loadStrategicLandmarks();

// Toggle Handler
function toggleLayer(layerType) {
  if (layerType === 'borders') {
    map.hasLayer(bordersAndLabels) ? map.removeLayer(bordersAndLabels) : map.addLayer(bordersAndLabels);
  } else if (layerType === 'military') {
    map.hasLayer(militaryLandmarksGroup) ? map.removeLayer(militaryLandmarksGroup) : map.addLayer(militaryLandmarksGroup);
  }
}

window.toggleLayer = toggleLayer;
