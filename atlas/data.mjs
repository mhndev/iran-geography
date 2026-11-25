const provinceNames = {
  4: 'East Azerbaijan', 5: 'West Azerbaijan', 6: 'Kermanshah', 10: 'Razavi Khorasan',
  11: 'Isfahan', 14: 'Hamadan', 18: 'Kohgiluyeh and Boyer-Ahmad',
};

const countyNames = {
  39: 'Babolsar', 62: 'Heris', 88: 'Eslamabad-e Gharb', 288: 'Selseleh',
  363: 'Shahriar', 369: 'Malard', 372: 'Pardis',
};

const aliasesByPlace = {
  'province-11': ['Esfahan', 'Isfahan'],
  'province-24': ['Teheran', 'Tehran Province', 'استان تهران'],
  'county-88': ['Islamabad-e Gharb', 'اسلام آباد غرب'],
  'county-189': ['Mashad', 'Meshed', 'مشهد مقدس'],
  'county-358': ['Teheran', 'Tehran County', 'شهرستان تهران'],
  'county-34': ['Sari', 'ساری'],
  'county-289': ['Dowreh', 'Doreh', 'دوره', 'Chegeni'],
  'county-433': ['Ray', 'Rey', 'Shahr-e Rey', 'شهر ری', 'شهرری'],
  'county-434': ['Shahr-e Qods', 'Qods', 'شهر قدس', 'قلعه حسن خان'],
  'square-67': ['Shahyad Square', 'میدان شهیاد', 'Meydan-e Azadi'],
  'azadi-tower': ['Shahyad Tower', 'Borj-e Azadi', 'برج شهیاد'],
  'imam-khomeini-hospital-complex': ['Imam Khomeini Hospital', 'بیمارستان امام خمینی'],
  'imam-khomeini-international-airport': ['IKA', 'OIIE', 'فرودگاه امام خمینی'],
  'mehrabad-airport': ['THR', 'OIII', 'فرودگاه مهرآباد'],
  'tehran-railway-station': ['Rahahan', 'Rah Ahan', 'راه آهن'],
  'tehran-grand-bazaar': ['Bazaar-e Bozorg', 'Grand Bazaar', 'بازار تهران'],
  'naqsh-e-jahan-square': ['Naqsh-e Jahan', 'Naghsh-e Jahan', 'Naghshe Jahan', 'Meidan Emam', 'میدان امام'],
  persepolis: ['Takht-e Jamshid', 'تخت‌جمشید', 'پرسپولیس'],
  'shiraz-hafez-tomb': ['Hafezieh', 'آرامگاه حافظ'],
};

export function normalize(value) {
  return String(value ?? '').normalize('NFKD').toLowerCase()
    .replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/[ةۀە]/g, 'ه')
    .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 0x6f0))
    .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 0x660))
    .replace(/\p{M}|[\u0640\u200c\u200d]/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function compact(value) {
  return normalize(value).replaceAll(' ', '');
}

export function indexEntry(entry) {
  return {
    ...entry,
    terms: [...new Set([entry.name, entry.slug, ...(entry.aliases ?? []), ...(aliasesByPlace[entry.id] ?? [])]
      .map(compact).filter(Boolean))],
  };
}

function score(entry, query) {
  let best = Infinity;
  for (const term of entry.terms) {
    if (term === query) return 0;
    if (term.startsWith(query)) best = Math.min(best, 1);
    else if (term.includes(query)) best = Math.min(best, 2);
  }
  return best;
}

export function searchEntries(entries, rawQuery) {
  const query = compact(rawQuery);
  if (!query) return entries;
  return entries.map(entry => ({ entry, rank: score(entry, query) }))
    .filter(result => Number.isFinite(result.rank))
    .sort((a, b) => a.rank - b.rank)
    .map(result => result.entry);
}

function coords(record) {
  const latitude = record.location?.lat ?? record.latitude;
  const longitude = record.location?.lon ?? record.longitude;
  return [latitude, longitude].every(value => value != null && String(value).trim() && Number.isFinite(Number(value)))
    ? [Number(latitude), Number(longitude)]
    : null;
}

function mergeDuplicateJunctions(entries) {
  const groups = new Map();
  return entries.filter(entry => {
    if (!entry.coordinates) return false;
    const key = `${entry.kind}:${compact(entry.name)}`;
    const group = groups.get(key) ?? [];
    const samePlace = group.find(previous => distanceKm(previous.coordinates, entry.coordinates) <= .02);
    if (samePlace) {
      samePlace.aliases = [...(samePlace.aliases ?? []), entry.slug, ...(entry.aliases ?? [])];
      return false;
    }
    group.push(entry);
    groups.set(key, group);
    return true;
  });
}

const repoUrl = 'https://github.com/mhndev/iran-geography/blob/master/';
export function buildEntries({ provinces, counties, places, regional, heritage, squares, streets, alleys, metro, nationwide }) {
  const admin = (record, kind, fallbackNames) => {
    const [mappedName, mappedEnglish] = kind === 'county' ? (nationwide.county_names[record.id] ?? []) : [];
    return {
      id: `${kind}-${record.id}`, recordId: record.id,
      provinceId: kind === 'province' ? record.id : record.province_id,
      name: mappedName || record.title, slug: mappedEnglish || fallbackNames[record.id] || record.slug,
      aliases: [record.title, record.slug], kind, coordinates: coords(record),
      source: record.source_url || (kind === 'county' && nationwide.county_sources[record.id])
        || repoUrl + (kind === 'province' ? 'province.json' : 'cities.json'),
    };
  };
  const place = (record, collection) => ({
    id: record.id, name: record.name, slug: record.slug, kind: record.category,
    provinceId: record.province_id, countyId: nationwide.curated_counties[record.id],
    collection, heritage: new URL(record.source_url).hostname === 'whc.unesco.org' || Boolean(record.heritage_url),
    coordinates: coords(record), source: record.source_url, heritageSource: record.heritage_url,
    verifiedOn: record.verified_on, pointType: record.point_type, aliases: record.aliases,
  });
  const street = (record, index, kind, sourceFile) => ({
    id: `${kind}-${record.id ?? index + 1}-${index}`,
    provinceId: 24, collection: 'tehran', kind: kind === 'square' ? 'square' : 'intersection',
    name: record.name ?? `${record.first.name} × ${record.second.name}`,
    slug: record.slug ?? `${record.first.slug} × ${record.second.slug}`,
    aliases: record.search?.split(','), coordinates: coords(record), source: repoUrl + sourceFile,
  });
  const junctions = mergeDuplicateJunctions([
    ...squares.RECORDS.map((record, i) => ({
      ...street(record, i, 'square', 'tehran_squares.json'), id: `square-${record.id}`,
      countyId: nationwide.curated_counties[`square-${record.id}`],
    })),
    ...streets.RECORDS.map((record, i) => street(record, i, 'street', 'tehran_intersection.json')),
    ...alleys.RECORDS.map((record, i) => street(record, i, 'alley', 'tehran_intersection_alley_street.json')),
  ]);
  const collectionByCounty = new Map(Object.entries(nationwide.collection_counties).map(([collection, id]) => [id, collection]));
  const imported = nationwide.RECORDS.map(([source, kind, name, slug, latitude, longitude, provinceId, countyId, aliases]) => ({
    id: `osm-${source}`, name, slug: slug || name, kind, provinceId, countyId, aliases,
    coordinates: [latitude, longitude], source: `https://www.openstreetmap.org/${source}`,
    collection: collectionByCounty.get(countyId), imported: true, snapshot: nationwide.snapshot.slice(0, 10),
  }));
  return [
    ...provinces.map(record => admin(record, 'province', provinceNames)),
    ...counties.filter(record => !nationwide.historical_county_ids.includes(record.id))
      .map(record => admin(record, 'county', countyNames)),
    ...places.RECORDS.map(record => place(record, 'tehran')),
    ...regional.RECORDS.map(record => place(record, record.collection)),
    ...heritage.RECORDS.map(record => place(record, record.id === 'naqsh-e-jahan-square' ? 'isfahan' : null)),
    ...junctions,
    ...metro.stations.map(station => ({
      ...station, kind: 'metro', collection: 'tehran', provinceId: station.province_id,
      countyId: nationwide.curated_counties[station.id], coordinates: coords(station), source: station.source_url, verifiedOn: metro.verified_on,
      aliases: [...(station.aliases ?? []), ...station.lines.flatMap(line => [`Metro line ${line}`, `خط ${line}`])],
    })),
    ...imported,
  ].filter(entry => entry.coordinates).map(indexEntry);
}

export function distanceKm([latA, lonA], [latB, lonB]) {
  const rad = Math.PI / 180;
  const a = Math.sin((latB - latA) * rad / 2) ** 2
    + Math.cos(latA * rad) * Math.cos(latB * rad) * Math.sin((lonB - lonA) * rad / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(Math.min(a, 1)));
}

export function nearestStation(coordinates, stations) {
  let nearest = null;
  for (const station of stations) {
    const distance = distanceKm(coordinates, station.coordinates);
    if (nearest === null || distance < nearest.distance) nearest = { station, distance };
  }
  return nearest;
}
