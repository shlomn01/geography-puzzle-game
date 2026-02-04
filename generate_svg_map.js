const topology = require('world-atlas/countries-110m.json');
const topojson = require('topojson-client');
const fs = require('fs');

// Convert TopoJSON to GeoJSON
const countries = topojson.feature(topology, topology.objects.countries);
const land = topojson.feature(topology, topology.objects.land);

// ISO 3166-1 numeric codes for our countries
const countryCodeMap = {
    '076': 'brazil',
    '818': 'egypt',
    '356': 'india',
    '156': 'china',
    '840': 'usa',
    '643': 'russia',
    '036': 'australia-country',
    '124': 'canada',
    '032': 'argentina',
    '392': 'japan',
    '250': 'france',
    '826': 'uk',
    '276': 'germany',
    '724': 'spain',
    '380': 'italy',
    '484': 'mexico',
    '710': 'south-africa',
    '682': 'saudi-arabia',
    '792': 'turkey',
    '170': 'colombia'
};

// Continent membership by country code (ISO numeric)
// Deduplicated: each code in only one continent. Quiz countries forced to match GeoData.
const continentMap = {
    'north-america': ['124','840','484','044','052','084','188','192','212','214','222','308','320','332','340','388','474','558','591','630','659','662','670','304','060','028','533','136','531','534','535','652','654','663','666'],
    'south-america': ['032','068','076','152','170','218','238','254','328','600','604','740','858','862'],
    'europe': ['008','020','040','056','070','100','112','191','196','203','208','233','246','250','276','300','348','352','372','380','428','440','442','492','498','499','528','578','616','620','642','674','688','703','705','724','752','756','804','826','831','832','833'],
    'africa': ['012','024','072','086','108','120','132','140','148','174','175','178','180','204','226','231','232','262','266','270','288','324','384','404','426','430','434','450','454','466','478','480','504','508','516','562','566','624','638','646','678','686','694','706','710','716','728','729','732','748','768','788','800','818','854','894'],
    'asia': ['004','031','048','050','051','064','096','104','116','144','156','158','162','166','275','344','356','360','364','368','376','392','398','400','408','410','414','417','418','422','446','458','462','496','512','524','586','608','634','643','682','702','760','762','764','784','792','795','860','887'],
    'australia': ['036','090','242','296','520','540','548','554','570','574','580','583','584','585','598','776','798','876','882']
};

// Map projection: Equirectangular (simple lat/lon to x/y)
const SVG_WIDTH = 1200;
const SVG_HEIGHT = 700;
const PADDING = 30;

function projectLon(lon) {
    // Map -180..180 to PADDING..(SVG_WIDTH-PADDING)
    return PADDING + ((lon + 180) / 360) * (SVG_WIDTH - 2 * PADDING);
}

function projectLat(lat) {
    // Map 90..-90 to PADDING..(SVG_HEIGHT-PADDING)  (flip Y)
    return PADDING + ((90 - lat) / 180) * (SVG_HEIGHT - 2 * PADDING);
}

function coordsToPath(coords) {
    // coords is an array of [lon, lat] pairs
    if (coords.length === 0) return '';
    let d = '';
    coords.forEach((pt, i) => {
        const x = projectLon(pt[0]).toFixed(1);
        const y = projectLat(pt[1]).toFixed(1);
        d += (i === 0 ? 'M' : 'L') + x + ',' + y;
    });
    d += 'Z';
    return d;
}

function geometryToPath(geometry) {
    let d = '';
    if (geometry.type === 'Polygon') {
        geometry.coordinates.forEach(ring => {
            d += coordsToPath(ring);
        });
    } else if (geometry.type === 'MultiPolygon') {
        geometry.coordinates.forEach(polygon => {
            polygon.forEach(ring => {
                d += coordsToPath(ring);
            });
        });
    }
    return d;
}

// Build continent paths by merging countries
function getCountriesInContinent(continentName) {
    const codes = continentMap[continentName] || [];
    return countries.features.filter(f => codes.includes(f.id));
}

// Generate SVG
let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" preserveAspectRatio="xMidYMid meet" id="worldMapSVG">
  <defs>
    <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1a5276"/>
      <stop offset="50%" style="stop-color:#2980b9"/>
      <stop offset="100%" style="stop-color:#1a5276"/>
    </linearGradient>
    <linearGradient id="landGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#52be80"/>
      <stop offset="100%" style="stop-color:#27ae60"/>
    </linearGradient>
    <style>
      .country-path { fill: #27ae60; stroke: #1e8449; stroke-width: 0.5; cursor: pointer; transition: fill 0.3s; }
      .country-path:hover { fill: #2ecc71; }
      .continent-group { pointer-events: none; }
      .highlight-flash { animation: svgFlash 1s ease-in-out infinite; }
      @keyframes svgFlash {
        0%, 100% { fill: #ff4444; opacity: 0.5; }
        50% { fill: #ff0000; opacity: 0.9; }
      }
    </style>
  </defs>

  <!-- Ocean background -->
  <rect width="${SVG_WIDTH}" height="${SVG_HEIGHT}" fill="url(#oceanGrad)"/>

  <!-- Decorative frame -->
  <rect x="5" y="5" width="${SVG_WIDTH - 10}" height="${SVG_HEIGHT - 10}" fill="none" stroke="#8B4513" stroke-width="8" rx="5"/>
  <rect x="15" y="15" width="${SVG_WIDTH - 30}" height="${SVG_HEIGHT - 30}" fill="none" stroke="#D4A574" stroke-width="2" rx="3"/>

  <!-- Grid lines (subtle) -->
  <g opacity="0.08" stroke="#fff" stroke-width="0.5">
`;

// Add subtle grid lines
for (let lon = -150; lon <= 180; lon += 30) {
    const x = projectLon(lon).toFixed(1);
    svg += `    <line x1="${x}" y1="${PADDING}" x2="${x}" y2="${SVG_HEIGHT - PADDING}"/>\n`;
}
for (let lat = -60; lat <= 90; lat += 30) {
    const y = projectLat(lat).toFixed(1);
    svg += `    <line x1="${PADDING}" y1="${y}" x2="${SVG_WIDTH - PADDING}" y2="${y}"/>\n`;
}
svg += `  </g>\n\n`;

// Draw ALL land as a base layer (neutral color)
svg += `  <!-- Base land layer -->\n`;
svg += `  <g id="base-land" opacity="0.3">\n`;
land.features.forEach(feature => {
    const d = geometryToPath(feature.geometry);
    if (d) {
        svg += `    <path d="${d}" fill="#888" stroke="none"/>\n`;
    }
});
svg += `  </g>\n\n`;

// Draw continents as groups
const continentNames = ['north-america', 'south-america', 'europe', 'africa', 'asia', 'australia'];
const continentColors = {
    'north-america': '#3498db',
    'south-america': '#27ae60',
    'europe': '#9b59b6',
    'africa': '#f39c12',
    'asia': '#e74c3c',
    'australia': '#1abc9c'
};

svg += `  <!-- Continent groups -->\n`;
continentNames.forEach(contName => {
    const contCountries = getCountriesInContinent(contName);
    const color = continentColors[contName];

    svg += `  <g id="continent-${contName}" class="continent-group" data-continent="${contName}">\n`;

    contCountries.forEach(feature => {
        const d = geometryToPath(feature.geometry);
        if (!d) return;

        const countryId = countryCodeMap[feature.id];
        if (countryId) {
            // This is one of our quiz countries - give it its own ID
            svg += `    <path id="country-${countryId}" class="country-path" d="${d}" fill="${color}" stroke="#fff" stroke-width="0.8" data-country="${countryId}"/>\n`;
        } else {
            // Generic country in this continent
            svg += `    <path class="country-path" d="${d}" fill="${color}" stroke="#fff" stroke-width="0.3"/>\n`;
        }
    });

    svg += `  </g>\n\n`;
});

// Add Antarctica manually (it's often missing from 110m data)
svg += `  <!-- Antarctica -->\n`;
svg += `  <g id="continent-antarctica" class="continent-group" data-continent="antarctica">\n`;
// Check if Antarctica exists in the data
const antarcticaFeature = countries.features.find(f => f.id === '010');
if (antarcticaFeature) {
    const d = geometryToPath(antarcticaFeature.geometry);
    svg += `    <path class="country-path" d="${d}" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="0.5"/>\n`;
} else {
    // Draw a simplified Antarctica
    const y = projectLat(-80).toFixed(1);
    const y2 = projectLat(-90).toFixed(1);
    svg += `    <rect x="${PADDING}" y="${y}" width="${SVG_WIDTH - 2 * PADDING}" height="${y2 - y}" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="0.5" rx="5"/>\n`;
}
svg += `  </g>\n\n`;

// Add city markers
const cities = [
    { id: 'new-york', lon: -74.0, lat: 40.7 },
    { id: 'london', lon: -0.1, lat: 51.5 },
    { id: 'tokyo', lon: 139.7, lat: 35.7 },
    { id: 'paris', lon: 2.3, lat: 48.9 },
    { id: 'sydney', lon: 151.2, lat: -33.9 },
    { id: 'cairo', lon: 31.2, lat: 30.0 },
    { id: 'mumbai', lon: 72.9, lat: 19.1 },
    { id: 'rio', lon: -43.2, lat: -22.9 },
    { id: 'moscow', lon: 37.6, lat: 55.8 },
    { id: 'beijing', lon: 116.4, lat: 39.9 },
    { id: 'berlin', lon: 13.4, lat: 52.5 },
    { id: 'rome', lon: 12.5, lat: 41.9 },
    { id: 'madrid', lon: -3.7, lat: 40.4 },
    { id: 'istanbul', lon: 29.0, lat: 41.0 },
    { id: 'mexico-city', lon: -99.1, lat: 19.4 },
    { id: 'buenos-aires', lon: -58.4, lat: -34.6 },
    { id: 'cape-town', lon: 18.4, lat: -34.0 },
    { id: 'dubai', lon: 55.3, lat: 25.3 },
    { id: 'sao-paulo', lon: -46.6, lat: -23.5 },
    { id: 'washington', lon: -77.0, lat: 38.9 },
    { id: 'bogota', lon: -74.1, lat: 4.7 },
    { id: 'riyadh', lon: 46.7, lat: 24.6 }
];

svg += `  <!-- City markers -->\n`;
svg += `  <g id="city-markers">\n`;
cities.forEach(city => {
    const x = projectLon(city.lon).toFixed(1);
    const y = projectLat(city.lat).toFixed(1);
    svg += `    <circle id="city-${city.id}" cx="${x}" cy="${y}" r="3" fill="none" stroke="none" data-city="${city.id}"/>\n`;
});
svg += `  </g>\n\n`;

// Decorative elements
svg += `  <!-- Compass Rose -->
  <g transform="translate(${SVG_WIDTH - 60}, ${SVG_HEIGHT - 60})">
    <circle cx="0" cy="0" r="25" fill="#D4A574" stroke="#8B4513" stroke-width="2" opacity="0.8"/>
    <polygon points="0,-22 3,-8 0,-12 -3,-8" fill="#8B4513"/>
    <polygon points="0,22 3,8 0,12 -3,8" fill="#D4A574" stroke="#8B4513"/>
    <polygon points="-22,0 -8,3 -12,0 -8,-3" fill="#D4A574" stroke="#8B4513"/>
    <polygon points="22,0 8,3 12,0 8,-3" fill="#D4A574" stroke="#8B4513"/>
    <text x="-3" y="-26" fill="#8B4513" font-size="8" font-weight="bold">N</text>
    <text x="-3" y="33" fill="#8B4513" font-size="8" font-weight="bold">S</text>
  </g>

  <!-- Title -->
  <text x="${SVG_WIDTH / 2}" y="${SVG_HEIGHT - 15}" fill="#D4A574" font-size="11" font-family="serif" text-anchor="middle" opacity="0.6">World Map</text>
`;

svg += `</svg>`;

// Write SVG file
fs.writeFileSync('world_map.svg', svg);
console.log('Generated world_map.svg');

// Also compute city positions as normalized coordinates (0-1) relative to SVG viewBox
console.log('\n// City positions (normalized 0-1):');
cities.forEach(city => {
    const x = (projectLon(city.lon) / SVG_WIDTH).toFixed(4);
    const y = (projectLat(city.lat) / SVG_HEIGHT).toFixed(4);
    console.log(`  '${city.id}': { x: ${x}, y: ${y} },`);
});

// List which country codes were found
console.log('\n// Country ID mapping results:');
let found = 0, missing = 0;
for (const [code, name] of Object.entries(countryCodeMap)) {
    const feature = countries.features.find(f => f.id === code);
    if (feature) {
        found++;
        console.log(`  ✓ ${name} (${code})`);
    } else {
        missing++;
        console.log(`  ✗ ${name} (${code}) - NOT FOUND`);
    }
}
console.log(`\nFound: ${found}, Missing: ${missing}`);
console.log(`Total countries in data: ${countries.features.length}`);
