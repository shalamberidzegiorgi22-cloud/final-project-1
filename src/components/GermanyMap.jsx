import { useState } from 'react';
import { Star } from 'lucide-react';

const VIEW_WIDTH = 360;
const VIEW_HEIGHT = 390;
const MIN_LONGITUDE = 5.7;
const MAX_LONGITUDE = 15.2;
const MIN_LATITUDE = 47;
const MAX_LATITUDE = 55.2;
const MAP_PADDING = 14;

const germanyBoundary = [
  [9.921906, 54.983104], [9.93958, 54.596642], [10.950112, 54.363607], [10.939467, 54.008693],
  [11.956252, 54.196486], [12.51844, 54.470371], [13.647467, 54.075511], [14.119686, 53.757029],
  [14.353315, 53.248171], [14.074521, 52.981263], [14.4376, 52.62485], [14.685026, 52.089947],
  [14.607098, 51.745188], [15.016996, 51.106674], [14.570718, 51.002339], [14.307013, 51.117268],
  [14.056228, 50.926918], [13.338132, 50.733234], [12.966837, 50.484076], [12.240111, 50.266338],
  [12.415191, 49.969121], [12.521024, 49.547415], [13.031329, 49.307068], [13.595946, 48.877172],
  [13.243357, 48.416115], [12.884103, 48.289146], [13.025851, 47.637584], [12.932627, 47.467646],
  [12.62076, 47.672388], [12.141357, 47.703083], [11.426414, 47.523766], [10.544504, 47.566399],
  [10.402084, 47.302488], [9.896068, 47.580197], [9.594226, 47.525058], [8.522612, 47.830828],
  [8.317301, 47.61358], [7.466759, 47.620582], [7.593676, 48.333019], [8.099279, 49.017784],
  [6.65823, 49.201958], [6.18632, 49.463803], [6.242751, 49.902226], [6.043073, 50.128052],
  [6.156658, 50.803721], [5.988658, 51.851616], [6.589397, 51.852029], [6.84287, 52.22844],
  [7.092053, 53.144043], [6.90514, 53.482162], [7.100425, 53.693932], [7.936239, 53.748296],
  [8.121706, 53.527792], [8.800734, 54.020786], [8.572118, 54.395646], [8.526229, 54.962744],
  [9.282049, 54.830865], [9.921906, 54.983104],
];

function project([longitude, latitude]) {
  return [
    MAP_PADDING + ((longitude - MIN_LONGITUDE) / (MAX_LONGITUDE - MIN_LONGITUDE)) * (VIEW_WIDTH - 2 * MAP_PADDING),
    MAP_PADDING + ((MAX_LATITUDE - latitude) / (MAX_LATITUDE - MIN_LATITUDE)) * (VIEW_HEIGHT - 2 * MAP_PADDING),
  ];
}

const germanyPath = germanyBoundary
  .map((coordinate, index) => {
    const [x, y] = project(coordinate);
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  })
  .join(' ') + ' Z';

const berlinCoordinates = project([13.405, 52.52]);

const neighbouringCountryLines = [
  'M8 72 42 65 73 68 88 83 91 107 79 129 88 153',
  'M300 86 324 95 337 115 349 124',
  'M292 193 325 190 348 207 350 230 331 244 306 245',
  'M240 335 260 349 292 352 324 367 349 368',
  'M22 263 49 279 67 307 87 329 105 353',
  'M135 29 147 42 153 57 176 69',
];

const mapLabels = [
  { text: 'Denmark', x: 184, y: 24 },
  { text: 'Netherlands', x: 44, y: 172 },
  { text: 'Belgium', x: 38, y: 220 },
  { text: 'Luxembourg', x: 69, y: 272 },
  { text: 'France', x: 68, y: 321 },
  { text: 'Switzerland', x: 143, y: 363 },
  { text: 'Czechia', x: 291, y: 230 },
  { text: 'Poland', x: 328, y: 153 },
  { text: 'Austria', x: 240, y: 348 },
];

const cityLabels = [
  { text: 'Hamburg', coordinates: [9.9937, 53.5511], dx: 8, dy: -7 },
  { text: 'Köln', coordinates: [6.9603, 50.9375], dx: -22, dy: -10 },
  { text: 'Frankfurt', coordinates: [8.6821, 50.1109], dx: -29, dy: 17 },
  { text: 'Leipzig', coordinates: [12.3731, 51.3397], dx: -31, dy: -9 },
  { text: 'Dresden', coordinates: [13.7373, 51.0504], dx: 8, dy: 12 },
  { text: 'München', coordinates: [11.582, 48.1351], dx: 8, dy: 14 },
  { text: 'Erfurt', coordinates: [11.0299, 50.9848], dx: -25, dy: -10 },
  { text: 'Mainz', coordinates: [8.2473, 49.9929], dx: -25, dy: 15 },
];

function getMarkerPosition(inspector) {
  if (
    Number.isFinite(inspector.coords?.top)
    && Number.isFinite(inspector.coords?.left)
  ) {
    return [
      (inspector.coords.left / 100) * VIEW_WIDTH,
      (inspector.coords.top / 100) * VIEW_HEIGHT,
    ];
  }

  if (Number.isFinite(inspector.longitude) && Number.isFinite(inspector.latitude)) {
    return project([inspector.longitude, inspector.latitude]);
  }

  return [
    (Number(inspector.x) / 100) * VIEW_WIDTH,
    (Number(inspector.y) / 100) * VIEW_HEIGHT,
  ];
}

export default function GermanyMap({
  inspectors = [],
  selectedId,
  onSelect,
  mapLabel,
  onLocationSelect,
  selectedCoords,
}) {
  const [hoveredId, setHoveredId] = useState(null);
  const activeInspector = inspectors.find((inspector) => inspector.id === (hoveredId ?? selectedId));
  const locationPosition = selectedCoords
    ? [(selectedCoords.left / 100) * VIEW_WIDTH, (selectedCoords.top / 100) * VIEW_HEIGHT]
    : null;

  return (
    <div className="relative isolate mx-auto aspect-[360/390] w-full max-w-lg overflow-hidden rounded-3xl border border-blue-300/35 bg-[#0e3338] shadow-inner shadow-black/20">
      <svg
        aria-label={mapLabel}
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="group"
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      >
        <defs>
          <linearGradient id="germany-map-fill" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#0f383e" />
            <stop offset="100%" stopColor="#0a2e34" />
          </linearGradient>
          <filter height="140%" id="germany-map-shadow" width="140%" x="-20%" y="-20%">
            <feDropShadow dx="0" dy="3" floodColor="#020617" floodOpacity="0.55" stdDeviation="5" />
          </filter>
        </defs>

        <rect fill="#0e3338" height={VIEW_HEIGHT} pointerEvents="none" width={VIEW_WIDTH} />
        {neighbouringCountryLines.map((line) => (
          <path
            d={line}
            fill="none"
            key={line}
            opacity="0.72"
            pointerEvents="none"
            stroke="#94a3b8"
            strokeWidth="1.1"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <path
          d={germanyPath}
          fill="url(#germany-map-fill)"
          filter="url(#germany-map-shadow)"
          id="germany-border"
          onClick={(event) => {
            if (!onLocationSelect) return;
            const svgBounds = event.currentTarget.ownerSVGElement.getBoundingClientRect();
            const left = Math.max(0, Math.min(100, ((event.clientX - svgBounds.left) / svgBounds.width) * 100));
            const top = Math.max(0, Math.min(100, ((event.clientY - svgBounds.top) / svgBounds.height) * 100));
            onLocationSelect({ top: Number(top.toFixed(2)), left: Number(left.toFixed(2)) });
          }}
          pointerEvents={onLocationSelect ? 'visiblePainted' : 'none'}
          stroke="white"
          strokeLinejoin="round"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          style={onLocationSelect ? { cursor: 'crosshair' } : undefined}
        />

        {mapLabels.map(({ text, x, y }) => (
          <text
            className="pointer-events-none fill-slate-300/75"
            fontSize="8"
            key={text}
            letterSpacing="0.3"
            textAnchor="middle"
            x={x}
            y={y}
          >
            {text}
          </text>
        ))}

        <text
          className="pointer-events-none fill-white/90"
          fontSize="14"
          fontWeight="700"
          letterSpacing="1"
          textAnchor="middle"
          x="177"
          y="190"
        >
          Germany
        </text>
        <circle cx={berlinCoordinates[0]} cy={berlinCoordinates[1]} fill="#f8fafc" r="3.2" stroke="#0f172a" strokeWidth="1.2" />
        <text
          className="pointer-events-none fill-white"
          fontSize="8"
          fontWeight="600"
          x={berlinCoordinates[0] + 6}
          y={berlinCoordinates[1] + 3}
        >
          Berlin
        </text>
        {cityLabels.map(({ text, coordinates, dx, dy }) => {
          const [x, y] = project(coordinates);
          return (
            <text
              className="pointer-events-none fill-slate-100/80"
              fontSize="6.5"
              key={text}
              x={x + dx}
              y={y + dy}
            >
              {text}
            </text>
          );
        })}

        {inspectors.map((inspector) => {
          const [x, y] = getMarkerPosition(inspector);
          const selected = selectedId === inspector.id;
          const hovered = hoveredId === inspector.id;
          const markerColor = selected || inspector.featured ? '#f59e0b' : '#60a5fa';

          return (
            <g
              aria-label={`${inspector.name}, ${inspector.city}, ${inspector.rating.toFixed(1)} stars`}
              className="cursor-pointer"
              key={inspector.id}
              onClick={(event) => {
                event.stopPropagation();
                onSelect?.(inspector.id);
              }}
              onMouseEnter={() => setHoveredId(inspector.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(inspector.id)}
              onBlur={() => setHoveredId(null)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect?.(inspector.id);
                }
              }}
              role="button"
              tabIndex="0"
              transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
            >
              <title>{`${inspector.name} · ${inspector.city} · ${inspector.rating.toFixed(1)} stars`}</title>
              {(selected || hovered) && (
                <circle
                  className={selected ? 'animate-ping' : ''}
                  cx="0"
                  cy="-5"
                  fill={markerColor}
                  fillOpacity="0.42"
                  r="8"
                />
              )}
              <path
                d="M0 -15C-5.2 -15 -9 -11 -9 -6C-9 0 0 9 0 9S9 0 9 -6C9 -11 5.2 -15 0 -15Z"
                fill={markerColor}
                stroke="#e0f2fe"
                strokeWidth="1.2"
              />
              <circle cx="0" cy="-6" fill="#eff6ff" r="2.5" />
              {inspector.featured && (
                <g transform="translate(7 -18)">
                  <circle fill="#fef3c7" r="5.5" stroke="#f59e0b" strokeWidth="1" />
                  <text
                    fill="#78350f"
                    fontSize="6"
                    fontWeight="700"
                    textAnchor="middle"
                    x="0"
                    y="2"
                  >
                    ★
                  </text>
                </g>
              )}
            </g>
          );
        })}
        {locationPosition && (
          <g
            aria-label={`Selected location: ${selectedCoords.top}% top, ${selectedCoords.left}% left`}
            className="pointer-events-none"
            transform={`translate(${locationPosition[0].toFixed(1)} ${locationPosition[1].toFixed(1)})`}
          >
            <circle className="animate-ping" cx="0" cy="-5" fill="#f59e0b" fillOpacity="0.45" r="9" />
            <path
              d="M0 -15C-5.2 -15 -9 -11 -9 -6C-9 0 0 9 0 9S9 0 9 -6C9 -11 5.2 -15 0 -15Z"
              fill="#f59e0b"
              stroke="white"
              strokeWidth="1.5"
            />
            <circle cx="0" cy="-6" fill="#fff7ed" r="2.5" />
          </g>
        )}
      </svg>

      {activeInspector && (() => {
        const [x, y] = getMarkerPosition(activeInspector);
        return (
          <div
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-xl border border-white/20 bg-slate-950/90 px-3 py-2 text-white shadow-xl backdrop-blur-md"
            style={{
              left: `${(x / VIEW_WIDTH) * 100}%`,
              top: `${(y / VIEW_HEIGHT) * 100}%`,
            }}
          >
            <p className="whitespace-nowrap text-xs font-semibold">{activeInspector.name}</p>
            <p className="mt-0.5 flex items-center justify-center gap-1 whitespace-nowrap text-[10px] text-slate-300">
              {activeInspector.city}
              <span aria-label={`${activeInspector.rating.toFixed(1)} stars`} className="inline-flex items-center gap-0.5 text-amber-300">
                <Star aria-hidden="true" fill="currentColor" size={10} />
                {activeInspector.rating.toFixed(1)}
              </span>
            </p>
          </div>
        );
      })()}
    </div>
  );
}
