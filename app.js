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

// Esri World Imagery (Satellite Layer)
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri',
  maxZoom: 18,
  maxNativeZoom: 17, // Changed from 15 to 17 for crisp high-resolution detail
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

function loadStrategicLandmarks() {
  militaryLandmarksGroup.clearLayers();
  industrialLandmarksGroup.clearLayers();

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
    else if (site.type === 'industrial') iconEmoji = '🏭'; // Defense Industrial Plant

    const icon = L.divIcon({
      className: 'landmark-marker',
      html: iconEmoji,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const tooltipContent = `<strong>${site.name}</strong><br/><em>${site.status || 'Strategic Facility'}</em>`;

    const marker = L.marker([site.lat, site.lon], { icon })
      .bindTooltip(tooltipContent, { permanent: false, direction: 'top' });
/*
    marker.on('click', () => {
      map.flyTo([site.lat, site.lon], 13, { animate: true, duration: 1.2 });
    });
*/
    
marker.on('click', () => {
      map.flyTo([site.lat, site.lon], 10, { // Level 10 ensures sharp imagery and no missing tiles
        animate: true,
        duration: 1.2
      });
    });

    // Add to specific group for toggling
    if (site.type === 'industrial') {
      industrialLandmarksGroup.addLayer(marker);
    } else {
      militaryLandmarksGroup.addLayer(marker);
    }
  });
}


// Updated Toggle Handler
function toggleLayer(layerType) {
  if (layerType === 'borders') {
    map.hasLayer(bordersAndLabels) ? map.removeLayer(bordersAndLabels) : map.addLayer(bordersAndLabels);
  } else if (layerType === 'military') {
    map.hasLayer(militaryLandmarksGroup) ? map.removeLayer(militaryLandmarksGroup) : map.addLayer(militaryLandmarksGroup);
  } else if (layerType === 'industrial') {
    map.hasLayer(industrialLandmarksGroup) ? map.removeLayer(industrialLandmarksGroup) : map.addLayer(industrialLandmarksGroup);
  }
}

// Initial Map Configuration Constants
const INITIAL_CENTER = [48.5, 38.0];
const INITIAL_ZOOM = 7;

// Function to reset map back to initial starting position
function resetMapView() {
  map.flyTo(INITIAL_CENTER, INITIAL_ZOOM, {
    animate: true,
    duration: 1.2
  });
}

window.resetMapView = resetMapView;

window.toggleLayer = toggleLayer;


// Map Event Listeners
map.on('moveend', loadStrategicLandmarks);

