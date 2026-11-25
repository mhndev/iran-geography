const shapes = {
  countyFilter: 'M4 20V4m0 1h13l-3 4 3 4H4',
  cityFilter: 'M3 20h18M5 20V8h5v12m0 0V4h6v16m0 0v-9h3v9M7 11h.1M7 14h.1M13 7h.1M13 10h.1M13 13h.1',
  townFilter: 'm3 10 9-7 9 7M5 9v11h14V9m-9 11v-6h4v6',
  healthFilter: 'M9 4h6v5h5v6h-5v5H9v-5H4V9h5z',
  clinicFilter: 'M5 3v5a4 4 0 0 0 8 0V3M3 3h4m4 0h4M9 12v3a4 4 0 0 0 8 0v-2m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  shoppingFilter: 'M5 8h14l2 12H3L5 8zm4 1V6a3 3 0 0 1 6 0v3',
  marketFilter: 'M4 10v10h16V10M3 10l2-5h14l2 5a2.25 2.25 0 0 1-4.5 0 2.25 2.25 0 0 1-4.5 0 2.25 2.25 0 0 1-4.5 0A2.25 2.25 0 0 1 3 10zm6 10v-5h6v5',
  transportFilter: 'M12 3c1 0 1.5 1 1.5 2v4l6 4v2l-6-2v5l2 1v2l-3.5-1-3.5 1v-2l2-1v-5l-6 2v-2l6-4V5c0-1 .5-2 1.5-2z',
  metroFilter: 'M6 7c0-2 1-3 3-3h6c2 0 3 1 3 3v8c0 2-1 3-3 3H9c-2 0-3-1-3-3V7zm0 5h12M9 18l-2 3m8-3 2 3M9 15h.1m5.9 0h.1',
  bus_station: 'M5 6c0-1 1-2 2-2h10c1 0 2 1 2 2v12H5V6zm0 7h14m-12 5v3m10-3v3M8 16h.1m7.9 0h.1',
  cultureFilter: 'M3 9l9-5 9 5H3zm2 2v6m5-6v6m4-6v6m5-6v6M3 20h18',
  parkFilter: 'M12 3 6 11h3l-4 6h14l-4-6h3l-6-8zm0 14v4',
  foodFilter: 'M5 3v5c0 2 1 3 3 3s3-1 3-3V3M8 3v18m11 0V3c-3 2-4 5-4 8h4',
  cafeFilter: 'M4 8h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8zm13 1h2a2 2 0 0 1 0 4h-2M3 21h17M8 3v2m4-2v2',
  educationFilter: 'm3 9 9-5 9 5-9 5-9-5zm4 3v5c3 2 7 2 10 0v-5m4-3v7',
  streetsFilter: 'M9 3v6H3m12-6v6h6m0 6h-6v6m-6 0v-6H3',
};

export function layerIcon(layer, color) {
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('class', 'layer-icon');
  icon.setAttribute('aria-hidden', 'true');
  if (color) icon.style.color = color;
  const path = document.createElementNS(icon.namespaceURI, 'path');
  path.setAttribute('d', shapes[layer] ?? shapes.countyFilter);
  icon.append(path);
  return icon;
}
