import { buildEntries, distanceKm, nearestStation, normalize, searchEntries } from './data.mjs';
import { layerIcon } from './icons.mjs';

const L = window.L;
const byId = id => document.getElementById(id);
const messages = {
  en: {
    repository: 'Repository', atlasLabel: 'IRAN GEOGRAPHY', explore: 'Explore Iran',
    searchLabel: 'Search places', searchPlaceholder: 'Search in Persian or English…', clear: 'Clear search',
    collections: 'Collections', categories: 'Map layers', provinces: 'Provinces', counties: 'Counties & places',
    places: 'Places', matches: 'Search results', more: 'Show more', mapLabel: 'MAP VIEW',
    overview: 'Iran overview', streetMap: 'Street map', iran: 'Iran', removeScope: 'Clear',
    loading: 'Loading the atlas…', empty: 'No matching places.', failed: 'The atlas could not load. Serve the repository root over HTTP and reload.',
    close: 'Close place details', source: 'View source', verified: 'Source checked', exactLocation: 'Coordinates',
    nearest: 'Nearest mapped metro station', straightLine: 'straight-line distance', line: 'Line',
    interchange: 'Interchange', entrance: 'Mapped entrance', entrances: 'Mapped entrances',
    airportPin: 'Airport reference point', sitePin: 'Site pin', stopPin: 'Station reference point',
    tehran: 'Tehran', mashhad: 'Mashhad', isfahan: 'Isfahan', shiraz: 'Shiraz', tabriz: 'Tabriz', unesco: 'UNESCO',
    province: 'Province', county: 'County', hospital: 'Hospital', airport: 'Airport', railway_station: 'Rail station',
    metro: 'Metro', landmark: 'Landmark', heritage_site: 'Heritage', market: 'Market',
    shopping_mall: 'Mall', restaurant: 'Restaurant', square: 'Square', intersection: 'Junction', park: 'Park',
    browseArea: 'Browse by area', allProvinces: 'All provinces', allCounties: 'All counties', allCities: 'All cities & towns', within: 'Within',
    listCategory: 'List category', allCategories: 'All categories', countyFilter: 'Counties',
    cityFilter: 'Cities', townFilter: 'Towns', marketFilter: 'Markets', parkFilter: 'Parks', cafeFilter: 'Cafés',
    clinicFilter: 'Clinics', educationFilter: 'Universities', city: 'City', town: 'Town',
    clinic: 'Clinic', museum: 'Museum', cafe: 'Café', university: 'University',
    bus_station: 'Bus terminal', department_store: 'Department store',
    cluster: 'places on map', layersOn: 'Show all', layersOff: 'Hide all', coverage: 'OSM snapshot',
    healthFilter: 'Hospitals', transportFilter: 'Transport', metroFilter: 'Metro', cultureFilter: 'Landmarks',
    shoppingFilter: 'Malls & department stores', foodFilter: 'Restaurants', streetsFilter: 'Squares & junctions',
  },
  fa: {
    repository: 'مخزن پروژه', atlasLabel: 'جغرافیای ایران', explore: 'ایران را بگردید',
    searchLabel: 'جست‌وجوی مکان‌ها', searchPlaceholder: 'جست‌وجو به فارسی یا انگلیسی…', clear: 'پاک کردن جست‌وجو',
    collections: 'مجموعه‌ها', categories: 'لایه‌های نقشه', provinces: 'استان‌ها', counties: 'شهرستان‌ها و مکان‌ها',
    places: 'مکان‌ها', matches: 'نتایج جست‌وجو', more: 'نمایش بیشتر', mapLabel: 'نمای نقشه',
    overview: 'نمای سراسر ایران', streetMap: 'نقشه خیابان‌ها', iran: 'ایران', removeScope: 'پاک کردن',
    loading: 'در حال بارگیری اطلس…', empty: 'مکانی پیدا نشد.', failed: 'اطلس بارگیری نشد. مخزن پروژه را با یک سرور محلی باز کنید.',
    close: 'بستن جزئیات مکان', source: 'مشاهده منبع', verified: 'تاریخ بررسی منبع', exactLocation: 'مختصات',
    nearest: 'نزدیک‌ترین ایستگاه مترو', straightLine: 'فاصله مستقیم', line: 'خط',
    interchange: 'ایستگاه تقاطعی', entrance: 'ورودی ثبت‌شده', entrances: 'ورودی‌های ثبت‌شده',
    airportPin: 'نقطه مرجع فرودگاه', sitePin: 'نقطه مکان', stopPin: 'نقطه مرجع ایستگاه',
    tehran: 'تهران', mashhad: 'مشهد', isfahan: 'اصفهان', shiraz: 'شیراز', tabriz: 'تبریز', unesco: 'یونسکو',
    province: 'استان', county: 'شهرستان', hospital: 'بیمارستان', airport: 'فرودگاه', railway_station: 'ایستگاه راه‌آهن',
    metro: 'مترو', landmark: 'دیدنی', heritage_site: 'میراث', market: 'بازار',
    shopping_mall: 'مرکز خرید', restaurant: 'رستوران', square: 'میدان', intersection: 'تقاطع', park: 'پارک',
    browseArea: 'مرور بر اساس منطقه', allProvinces: 'همه استان‌ها', allCounties: 'همه شهرستان‌ها', allCities: 'همه شهرها', within: 'در شعاع',
    listCategory: 'دسته‌بندی فهرست', allCategories: 'همه دسته‌ها', countyFilter: 'شهرستان‌ها',
    cityFilter: 'شهرها', townFilter: 'شهرهای کوچک', marketFilter: 'بازارها', parkFilter: 'پارک‌ها', cafeFilter: 'کافه‌ها',
    clinicFilter: 'درمانگاه‌ها', educationFilter: 'دانشگاه‌ها', city: 'شهر', town: 'شهر کوچک',
    clinic: 'درمانگاه', museum: 'موزه', cafe: 'کافه', university: 'دانشگاه',
    bus_station: 'پایانه اتوبوس', department_store: 'فروشگاه بزرگ',
    cluster: 'مکان روی نقشه', layersOn: 'نمایش همه', layersOff: 'پنهان کردن همه', coverage: 'نسخه دادهٔ نقشه باز',
    healthFilter: 'بیمارستان‌ها', transportFilter: 'حمل‌ونقل', metroFilter: 'مترو', cultureFilter: 'دیدنی‌ها',
    shoppingFilter: 'مراکز خرید و فروشگاه‌ها', foodFilter: 'رستوران‌ها', streetsFilter: 'میدان‌ها و تقاطع‌ها',
  },
};

const collections = ['tehran', 'mashhad', 'isfahan', 'shiraz', 'tabriz', 'unesco'];
const groups = [
  { label: 'countyFilter', color: '#306d53', kinds: ['county'] },
  { label: 'cityFilter', color: '#265b71', kinds: ['city'] },
  { label: 'townFilter', color: '#496741', kinds: ['town'] },
  { label: 'healthFilter', color: '#ae4a53', kinds: ['hospital'] },
  { label: 'clinicFilter', color: '#c17a8a', kinds: ['clinic'] },
  { label: 'shoppingFilter', color: '#39816f', kinds: ['shopping_mall', 'department_store'] },
  { label: 'marketFilter', color: '#617a30', kinds: ['market'] },
  { label: 'transportFilter', color: '#526b9e', kinds: ['airport', 'railway_station', 'bus_station'] },
  { label: 'metroFilter', color: '#755593', kinds: ['metro'] },
  { label: 'cultureFilter', color: '#946123', kinds: ['landmark', 'heritage_site', 'museum'] },
  { label: 'parkFilter', color: '#54863e', kinds: ['park'] },
  { label: 'foodFilter', color: '#b35731', kinds: ['restaurant'] },
  { label: 'cafeFilter', color: '#936948', kinds: ['cafe'] },
  { label: 'educationFilter', color: '#52768b', kinds: ['university'] },
  { label: 'streetsFilter', color: '#617d6b', kinds: ['square', 'intersection'] },
];
const groupByKind = new Map(groups.flatMap(group => group.kinds.map(kind => [kind, group])));
const state = {
  language: 'en', province: null, county: null, city: null, collection: null, category: '', entry: null, limit: 20,
  layers: new Set(groups.map(group => group.label)),
};
let entries = [];
let provinces = [];
let counties = [];
let metroStations = [];
let shown = [];
const regionLayers = new Map();
let iranBounds = L.latLngBounds([24.7, 43.3], [40.1, 64.0]);
const map = L.map('map', { zoomControl: false, zoomSnap: .25, zoomDelta: .75, minZoom: 4, maxZoom: 18 }).fitBounds(iranBounds, { padding: [22, 22] });
L.control.zoom({ position: 'topright' }).addTo(map);
map.attributionControl.addAttribution('<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a> · <a href="https://www.geoboundaries.org/api/current/gbOpen/IRN/ADM1/">geoBoundaries</a>');
const streets = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 });
const markers = L.layerGroup().addTo(map);
const labels = L.layerGroup().addTo(map);

function t(key) {
  return messages[state.language][key] ?? key;
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text != null) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function safeSource(url, text) {
  if (!url) return null;
  const target = new URL(url);
  if (target.protocol !== 'https:') return null;
  const link = element('a', text);
  link.href = target.href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

function name(entry) {
  return state.language === 'fa' ? entry.name : entry.slug;
}

function secondName(entry) {
  return state.language === 'fa' ? entry.slug : entry.name;
}

function changeLanguage() {
  state.language = state.language === 'en' ? 'fa' : 'en';
  document.documentElement.lang = state.language;
  document.documentElement.dir = state.language === 'fa' ? 'rtl' : 'ltr';
  const control = byId('language');
  control.textContent = state.language === 'fa' ? 'English' : 'فارسی';
  control.lang = state.language === 'fa' ? 'en' : 'fa';
  for (const node of document.querySelectorAll('[data-text]')) node.textContent = t(node.dataset.text);
  byId('query').placeholder = t('searchPlaceholder');
  byId('clear-search').setAttribute('aria-label', t('clear'));
  drawLabels();
  render();
}

function paintRegion(id) {
  const active = state.province?.provinceId === id;
  return {
    color: active ? '#27604f' : '#f5f9ec', weight: active ? 2 : 1.2,
    fillColor: active ? '#72ad91' : ['#8cb7a2', '#a1c4ad', '#82ae97', '#b0cbb3'][id % 4],
    fillOpacity: map.hasLayer(streets) ? .12 : .87,
  };
}

function groupFor(entry) {
  return groupByKind.get(entry.kind);
}

function iconKind(entry) {
  if (entry.kind === 'railway_station') return 'metroFilter';
  if (entry.kind === 'bus_station') return 'bus_station';
  return groupFor(entry)?.label;
}

function pill(label, selected, handler) {
  const button = element('button', null, 'pill');
  button.type = 'button';
  button.setAttribute('aria-pressed', String(selected));
  button.append(document.createTextNode(label));
  button.addEventListener('click', handler);
  return button;
}

function resetList() {
  state.limit = 20;
  state.entry = null;
}

function changeCollection(key) {
  resetList();
  state.province = null;
  state.county = null;
  state.city = null;
  state.collection = state.collection === key ? null : key;
  byId('query').value = '';
  if (state.collection) {
    const points = entries.filter(entry => inScope(entry) && !entry.imported
      && !['province', 'county', 'intersection', 'square', 'metro'].includes(entry.kind));
    if (points.length) map.fitBounds(L.latLngBounds(points.map(entry => entry.coordinates)), { maxZoom: 13, padding: [36, 48] });
  } else {
    map.fitBounds(iranBounds, { padding: [22, 22] });
  }
  render();
}

function selectProvince(province) {
  resetList();
  state.province = province;
  state.county = null;
  state.city = null;
  state.collection = null;
  byId('query').value = '';
  const layer = regionLayers.get(province.provinceId);
  if (layer) map.fitBounds(layer.getBounds(), { padding: [40, 52], maxZoom: 10.5 });
  render();
}

function showOverview() {
  resetList();
  state.collection = null;
  state.province = null;
  state.county = null;
  state.city = null;
  state.category = '';
  byId('query').value = '';
  map.fitBounds(iranBounds, { padding: [22, 22] });
  render();
}

function inScope(entry) {
  if (state.province && state.province.provinceId !== entry.provinceId) return false;
  if (state.county && !state.city && entry.id !== state.county.id && entry.countyId !== state.county.recordId) return false;
  if (state.city && distanceKm(state.city.coordinates, entry.coordinates) > cityRadius(state.city)) return false;
  if (state.collection === 'unesco') return Boolean(entry.heritage);
  return !state.collection || entry.collection === state.collection;
}

function selectCounty(county) {
  resetList();
  state.province = provinces.find(province => province.provinceId === county.provinceId);
  state.county = county;
  state.city = null;
  if (state.category === 'countyFilter') state.category = '';
  state.collection = null;
  state.entry = county;
  byId('query').value = '';
  const points = entries.filter(entry => inScope(entry)).map(entry => entry.coordinates);
  map.fitBounds(L.latLngBounds(points), { maxZoom: 12, padding: [35, 40] });
  render();
}

function cityRadius(city) {
  return city.kind === 'city' ? 12 : 6;
}

function selectCity(city) {
  resetList();
  state.province = provinces.find(province => province.provinceId === city.provinceId);
  state.county = counties.find(county => county.recordId === city.countyId) ?? null;
  state.city = city;
  state.collection = null;
  state.entry = city;
  if (['cityFilter', 'townFilter'].includes(state.category)) state.category = '';
  byId('query').value = '';
  map.setView(city.coordinates, 12);
  render();
}

function choose(entry, focusDetail = false) {
  if (entry.kind === 'province') {
    selectProvince(entry);
    return;
  }
  if (entry.kind === 'county') {
    selectCounty(entry);
    return;
  }
  if (entry.kind === 'city' || entry.kind === 'town') {
    selectCity(entry);
    return;
  }
  state.entry = entry;
  const zoom = entry.kind === 'airport' ? 13 : 15;
  map.setView(entry.coordinates, Math.max(zoom, map.getZoom()));
  render();
  if (focusDetail) {
    byId('detail').focus({ preventScroll: true });
    byId('detail').scrollIntoView({ block: 'nearest' });
  }
}

function scopeName() {
  return state.collection ? t(state.collection) : state.city ? name(state.city) : state.county ? name(state.county) : state.province ? name(state.province) : '';
}

function resultButton(entry) {
  const row = element('li');
  const button = element('button', null, 'result');
  button.type = 'button';
  button.setAttribute('aria-current', String(entry.id === state.entry?.id));
  const names = element('span');
  const title = element('strong', name(entry));
  const subtitle = element('small', secondName(entry));
  title.dir = subtitle.dir = 'auto';
  names.append(title);
  if (name(entry) !== secondName(entry)) names.append(subtitle);
  const group = groupFor(entry);
  button.append(layerIcon(iconKind(entry), group?.color ?? '#438769'), names, element('span', t(entry.kind), 'result-kind'));
  button.addEventListener('click', () => choose(entry, true));
  row.append(button);
  return row;
}

function localizedDistance(distance) {
  const formatter = new Intl.NumberFormat(state.language, { maximumFractionDigits: 1, style: 'unit',
    unit: distance < 1 ? 'meter' : 'kilometer', unitDisplay: 'short' });
  return formatter.format(distance < 1 ? Math.round(distance * 1000) : distance);
}

function setDetail() {
  const detail = byId('detail');
  detail.hidden = !state.entry;
  detail.tabIndex = -1;
  detail.replaceChildren();
  if (!state.entry) return;
  const entry = state.entry;
  const heading = element('h2', name(entry));
  heading.dir = 'auto';
  const close = element('button', '×', 'dismiss');
  close.type = 'button';
  close.setAttribute('aria-label', t('close'));
  close.addEventListener('click', () => {
    state.entry = null;
    render();
    byId('query').focus({ preventScroll: true });
  });
  const subtitle = element('p', name(entry) === secondName(entry) ? t(entry.kind) : `${secondName(entry)} · ${t(entry.kind)}`);
  const coordinates = element('p', `${t('exactLocation')} · ${entry.coordinates.map(value => value.toFixed(5)).join(', ')}`, 'coords');
  detail.append(close, heading, subtitle, coordinates);
  const area = counties.find(county => county.recordId === entry.countyId);
  if (area) detail.append(element('p', `${t('county')} · ${name(area)}`));
  if (entry.snapshot) detail.append(element('p', `${t('coverage')} · ${entry.snapshot}`));
  if (entry.kind === 'metro') {
    detail.append(element('p', `${t('line')} ${entry.lines.join(' / ')}${entry.interchange ? ' · ' + t('interchange') : ''}`));
    if (entry.entrances.length) {
      const list = element('ul');
      for (const entrance of entry.entrances) {
        const item = element('li');
        item.append(safeSource(entrance.source_url, (state.language === 'fa' ? entrance.name : entrance.name_en) || t('entrance')));
        list.append(item);
      }
      detail.append(element('p', t('entrances')), list);
    }
  } else if (entry.provinceId === 24 && !['province', 'county', 'intersection', 'square'].includes(entry.kind)) {
    const nearest = nearestStation(entry.coordinates, metroStations);
    if (nearest) {
      const action = element('button', `${name(nearest.station)} · ${localizedDistance(nearest.distance)}`);
      action.type = 'button';
      action.addEventListener('click', () => choose(nearest.station, true));
      detail.append(element('p', `${t('nearest')} · ${t('straightLine')}`), action);
    }
  }
  if (entry.pointType) {
    detail.append(element('p', t(entry.pointType === 'airport_reference_point' ? 'airportPin' : 'sitePin')));
  }
  if (entry.kind === 'metro') detail.append(element('p', t('stopPin')));
  if (entry.verifiedOn) detail.append(element('p', `${t('verified')} · ${entry.verifiedOn}`));
  for (const [url, label] of [[entry.source, t('source')], [entry.heritageSource, 'UNESCO']]) {
    const link = safeSource(url, label);
    if (link) detail.append(link, document.createTextNode(' '));
  }
}

function drawLabels() {
  labels.clearLayers();
  if (map.getZoom() > 7 || map.hasLayer(streets)) return;
  const accepted = [];
  const context = document.createElement('canvas').getContext('2d');
  context.font = '610 11px system-ui';
  for (const province of provinces) {
    if (!map.getBounds().contains(province.coordinates)) continue;
    const point = map.latLngToContainerPoint(province.coordinates);
    const width = context.measureText(name(province)).width + 8;
    const box = { left: point.x - width / 2, right: point.x + width / 2, top: point.y - 7, bottom: point.y + 7 };
    if (accepted.some(other => box.left < other.right && box.right > other.left
      && box.top < other.bottom && box.bottom > other.top)) continue;
    accepted.push(box);
    const caption = element('span', name(province));
    L.marker(province.coordinates, {
      icon: L.divIcon({ className: 'province-label', html: caption, iconSize: [0, 0] }),
      interactive: false, keyboard: false,
    }).addTo(labels);
  }
}

function drawMarkers() {
  markers.clearLayers();
  const zoom = map.getZoom();
  const active = state.entry;
  const bounds = map.getBounds().pad(.1);
  const visible = shown.filter(entry => {
    if (!state.layers.has(groupFor(entry)?.label) || !bounds.contains(entry.coordinates)) return false;
    if (entry.kind === 'intersection' && zoom < 13 && !byId('query').value) return false;
    return true;
  });
  const individual = [];
  const grid = new Map();
  const number = new Intl.NumberFormat(state.language, { notation: 'compact' });
  if (visible.length > 110 || zoom < 10) {
    for (const entry of visible) {
      if (entry.id === active?.id) continue;
      const { x, y } = map.project(entry.coordinates, zoom);
      const key = `${Math.floor(x / 50)}:${Math.floor(y / 50)}`;
      const cell = grid.get(key) ?? [];
      cell.push(entry);
      grid.set(key, cell);
    }
    for (const cell of grid.values()) {
      if (cell.length === 1) {
        individual.push(cell[0]);
        continue;
      }
      const locations = L.latLngBounds(cell.map(entry => entry.coordinates));
      const label = element('span', number.format(cell.length));
      const iconSize = cell.length > 99 ? 36 : 31;
      const title = `${cell.length} ${t('cluster')}`;
      L.marker(locations.getCenter(), {
        title, alt: title, icon: L.divIcon({ className: 'atlas-cluster', html: label, iconSize: [iconSize, iconSize] }),
      }).on('click', () => {
        if (zoom < 17) map.fitBounds(locations, { maxZoom: Math.min(18, zoom + 2), padding: [48, 48] });
        else choose(cell[0], true);
      }).addTo(markers);
    }
    if (active && state.layers.has(groupFor(active)?.label)) individual.push(active);
  } else {
    individual.push(...visible);
    if (active && state.layers.has(groupFor(active)?.label) && !individual.some(entry => entry.id === active.id)) {
      individual.push(active);
    }
  }
  for (const entry of individual) {
    const selected = entry.id === active?.id;
    const size = selected ? 32 : entry.interchange ? 30 : 26;
    const group = groupFor(entry);
    const badge = layerIcon(iconKind(entry));
    const marker = L.marker(entry.coordinates, {
      title: name(entry), alt: name(entry), zIndexOffset: selected ? 1000 : 0,
      icon: L.divIcon({ className: 'atlas-marker' + (selected ? ' is-selected' : ''), html: badge, iconSize: [size, size] }),
    });
    marker.on('add', () => marker.getElement()?.style.setProperty('--swatch', group?.color ?? '#438769'));
    marker.on('click', () => choose(entry, true)).addTo(markers);
  }
  if (active?.kind === 'metro' && state.layers.has('metroFilter')) {
    for (const entrance of active.entrances) {
      const label = element('span', (state.language === 'fa' ? entrance.name : entrance.name_en) || t('entrance'));
      L.circleMarker([entrance.latitude, entrance.longitude], {
        radius: 5, color: '#4d3673', fillColor: '#dfcdf4', fillOpacity: 1,
      }).bindTooltip(label).addTo(markers);
    }
  }
}

function options(select, entries, placeholder, value) {
  const available = [new Option(placeholder, ''), ...entries.map(([id, label]) => new Option(label, id))];
  select.replaceChildren(...available);
  select.value = String(value ?? '');
}

function renderControls() {
  const focused = document.activeElement?.dataset.control;
  const collectionPanel = byId('collection-list');
  const categoryPanel = byId('category-list');
  collectionPanel.replaceChildren(...collections.map(key => {
    const button = pill(t(key), state.collection === key, () => changeCollection(key));
    button.dataset.control = key;
    return button;
  }));
  categoryPanel.replaceChildren(...groups.map(group => {
    const label = element('label', null, 'pill');
    const check = element('input');
    check.type = 'checkbox';
    check.checked = state.layers.has(group.label);
    check.addEventListener('change', () => {
      if (check.checked) state.layers.add(group.label);
      else state.layers.delete(group.label);
      drawMarkers();
    });
    label.append(check, layerIcon(group.label, group.color), document.createTextNode(t(group.label)));
    return label;
  }));
  if (focused) [...collectionPanel.children].find(button => button.dataset.control === focused)?.focus({ preventScroll: true });
  const compare = (a, b) => name(a).localeCompare(name(b), state.language);
  options(byId('province-picker'), [...provinces].sort(compare).map(entry => [entry.id, name(entry)]), t('allProvinces'), state.province?.id);
  const localCounties = counties.filter(entry => entry.provinceId === state.province?.provinceId).sort(compare);
  const picker = byId('county-picker');
  options(picker, localCounties.map(entry => [entry.id, name(entry)]), t('allCounties'), state.county?.id);
  picker.disabled = !state.province;
  const localCities = state.province ? entries.filter(entry => ['city', 'town'].includes(entry.kind)
    && entry.provinceId === state.province.provinceId && (!state.county || entry.countyId === state.county.recordId)) : [];
  const cityPicker = byId('city-picker');
  options(cityPicker, localCities.sort(compare).map(entry => [entry.id, name(entry)]), t('allCities'), state.city?.id);
  cityPicker.disabled = !state.province;
  options(byId('list-category'), groups.map(group => [group.label, t(group.label)]), t('allCategories'), state.category);
}

function setAllLayers(visible) {
  state.layers = new Set(visible ? groups.map(group => group.label) : []);
  renderControls();
  drawMarkers();
}

function render() {
  const query = normalize(byId('query').value);
  renderControls();
  const scope = byId('scope');
  scope.hidden = !scopeName();
  scope.replaceChildren();
  if (!scope.hidden) {
    const clear = element('button', t('removeScope'));
    clear.type = 'button';
    clear.addEventListener('click', showOverview);
    const label = element('strong', scopeName());
    if (state.city) label.append(element('small', ` · ${t('within')} ${localizedDistance(cityRadius(state.city))}`));
    scope.append(label, clear);
  }

  byId('map-title').textContent = scopeName() || t('iran');
  byId('clear-search').hidden = !byId('query').value;
  const scoped = entries.filter(inScope);
  const overview = !query && !state.category && !state.collection && !state.province;
  const categoryEntries = state.category ? scoped.filter(entry => groupFor(entry)?.label === state.category) : scoped;
  const matches = query ? searchEntries(scoped, query) : scoped;
  const browsable = query ? matches.filter(entry => !state.category || groupFor(entry)?.label === state.category)
    : overview ? provinces : categoryEntries.filter(entry => entry.kind !== 'province'
      && entry.id !== state.county?.id && entry.id !== state.city?.id);
  shown = matches.filter(entry => entry.kind !== 'province');
  byId('results-title').textContent = t(query ? 'matches' : overview ? 'provinces'
    : state.province && !state.county ? 'counties' : 'places');
  byId('result-count').textContent = new Intl.NumberFormat(state.language).format(browsable.length);
  byId('status').textContent = entries.length ? t('empty') : t('loading');
  byId('status').hidden = browsable.length > 0;
  byId('results').replaceChildren(...browsable.slice(0, state.limit).map(resultButton));
  byId('more').hidden = state.limit >= browsable.length;
  for (const [id, layer] of regionLayers) layer.setStyle(paintRegion(id));
  setDetail();
  drawMarkers();
}

const files = {
  provinces: '../province.json', counties: '../cities.json', places: '../tehran_pois.json',
  regional: '../regional_pois.json', heritage: '../iran_heritage_pois.json', squares: '../tehran_squares.json',
  streets: '../tehran_intersection.json', alleys: '../tehran_intersection_alley_street.json',
  metro: '../tehran_metro.json', nationwide: '../iran_locations.json', boundaries: './provinces.geojson',
};

async function init() {
  const data = Object.fromEntries(await Promise.all(Object.entries(files).map(async ([key, url]) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url}: ${response.status}`);
    return [key, await response.json()];
  })));
  entries = buildEntries(data);
  provinces = entries.filter(entry => entry.kind === 'province').sort((a, b) => a.slug.localeCompare(b.slug));
  metroStations = entries.filter(entry => entry.kind === 'metro');
  counties = entries.filter(entry => entry.kind === 'county');
  const provinceById = new Map(provinces.map(entry => [entry.provinceId, entry]));
  const boundaries = L.geoJSON(data.boundaries, {
    style: feature => paintRegion(feature.properties.province_id),
    onEachFeature: (feature, layer) => {
      const id = feature.properties.province_id;
      regionLayers.set(id, layer);
      const province = provinceById.get(id);
      layer.bindTooltip(() => element('span', name(province)), { sticky: true });
      layer.on('click', () => selectProvince(province));
    },
  }).addTo(map);
  iranBounds = boundaries.getBounds();
  map.fitBounds(iranBounds, { padding: [42, 42] });
  byId('province-picker').addEventListener('change', event => {
    const province = provinces.find(entry => entry.id === event.target.value);
    if (province) selectProvince(province);
    else showOverview();
  });
  byId('county-picker').addEventListener('change', event => {
    const county = counties.find(entry => entry.id === event.target.value);
    if (county) selectCounty(county);
    else if (state.province) selectProvince(state.province);
  });
  byId('city-picker').addEventListener('change', event => {
    const city = entries.find(entry => entry.id === event.target.value);
    if (city) selectCity(city);
    else if (state.county) selectCounty(state.county);
    else if (state.province) selectProvince(state.province);
  });
  byId('list-category').addEventListener('change', event => {
    state.category = event.target.value;
    state.limit = 20;
    render();
  });
  byId('layers-on').addEventListener('click', () => setAllLayers(true));
  byId('layers-off').addEventListener('click', () => setAllLayers(false));
  byId('language').addEventListener('click', changeLanguage);
  byId('query').addEventListener('input', () => { resetList(); render(); });
  byId('search-form').addEventListener('submit', event => {
    event.preventDefault();
    const first = byId('results').querySelector('button');
    if (byId('query').value && first) first.click();
  });
  byId('clear-search').addEventListener('click', () => {
    byId('query').value = '';
    byId('query').focus();
    resetList();
    render();
  });
  byId('more').addEventListener('click', () => { state.limit += 20; render(); });
  byId('reset').addEventListener('click', showOverview);
  byId('streets').addEventListener('click', () => {
    if (map.hasLayer(streets)) map.removeLayer(streets);
    else map.addLayer(streets);
    byId('streets').setAttribute('aria-pressed', String(map.hasLayer(streets)));
    drawLabels();
    render();
  });
  map.on('moveend', () => { drawLabels(); drawMarkers(); });
  drawLabels();
  render();
}

init().catch(error => {
  console.error(error);
  byId('status').textContent = t('failed');
});
