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
  // Renders a transparent pixel on 404s, letting the underlying fallback show through
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
const petroleumLandmarksGroup = L.layerGroup().addTo(map); // New Petroleum Group


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
    else if (site.type === 'petroleum') iconEmoji = '🛢️'; // Petroleum / Fuel Hub

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

// Map Canvas Click: Updates GPS field when clicking open terrain
map.on('click', (e) => {
  const lat = e.latlng.lat.toFixed(5);
  const lng = e.latlng.lng.toFixed(5);
  
  const coordsInput = document.getElementById('gps-coords');
  if (coordsInput) {
    coordsInput.value = `${lat}, ${lng}`;
  }
});

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

// Query Esri Imagery Metadata Endpoint for Capture Date
async function fetchImageryDate(lat, lng) {
  const url = `https://imagery.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/identify?` + 
    `geometry=${lng},${lat}&geometryType=esriGeometryPoint&sr=4326&layers=visible&returnGeometry=false&f=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const attributes = data.results[0].attributes;
      // Esri returns the date in 'DATE_ACQUIRED' or 'SRC_DATE' fields
      const dateStr = attributes.DATE_ACQUIRED || attributes.SRC_DATE || 'Unknown Date';
      return dateStr;
    }
  } catch (err) {
    console.error("Failed to retrieve tile metadata:", err);
  }
  return "Date Unavailable";
}

// Update Map Click Handler to Display Date
map.on('click', async (e) => {
  const lat = e.latlng.lat.toFixed(5);
  const lng = e.latlng.lng.toFixed(5);
  
  const coordsInput = document.getElementById('gps-coords');
  if (coordsInput) {
    coordsInput.value = `${lat}, ${lng} (Fetching date...)`;
  }

  const imageDate = await fetchImageryDate(e.latlng.lat, e.latlng.lng);

  if (coordsInput) {
    coordsInput.value = `${lat}, ${lng} | Date: ${imageDate}`;
  }
});


window.resetMapView = resetMapView;
window.toggleLayer = toggleLayer;

// Event Listeners
map.on('moveend', loadStrategicLandmarks);

// Initial Load Execution
loadStrategicLandmarks();
