# Iran Geography

![Map of Iran showing its cat-like outline, provincial boundaries, and Tehran](assets/iran-map.png)

A geographic dataset of Iran’s administrative divisions and Tehran’s neighbourhoods, squares, intersections, and points of interest. Records pair Persian names with Latin-script labels, often called **Finglish**.

## Iran Atlas

Explore the provinces, counties and mapped places in a bilingual browser atlas. Select a province to see its counties, or choose a city or the UNESCO heritage collection. The search accepts Persian, Latin-script names and aliases such as **Rey / Ray** and **Azadi Square / Shahyad Square**.

Run this from the repository root and open [the local atlas](http://127.0.0.1:8000/atlas/).

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

The atlas uses bundled data and Leaflet. Enable **Street map** to load OpenStreetMap tiles over the network.

Use **Browse by area** to choose a province, county, or city. The city view shows places within 12 km of a city centre or 6 km of a town centre, within the selected province. **List category** filters the results. **Map layers** controls the pins independently, with separate switches for counties, cities, and towns.

[Open the live atlas](https://mhndev.github.io/iran-geography/atlas/) on GitHub Pages.

To flag a wrong pin or name, open the place details and select **Report a correction on GitHub**. The draft includes the atlas ID, current coordinates, and source. Use **Suggest a missing place on GitHub** below the search box for an unlisted location. Add a source if you have one, then sign in to GitHub to submit the public issue for review.

## Data files

| File | Coverage | Records | Coordinates |
| --- | --- | ---: | --- |
| [`province.json`](province.json) | Provinces (استان) | 31 | Yes |
| [`cities.json`](cities.json) | County records (شهرستان), including one historical record | 483 | Yes |
| [`sections.json`](sections.json) | Districts (بخش) | 632 | — |
| [`towns.json`](towns.json) | Rural districts (دهستان) and towns | 3,381 | — |
| [`Tehran_Mahalat.json`](Tehran_Mahalat.json) | Tehran neighbourhood and address labels | 2,459 | 5 records |
| [`tehran_squares.json`](tehran_squares.json) | Tehran squares | 67 | Yes |
| [`tehran_intersection.json`](tehran_intersection.json) | Tehran intersections | 766 | Yes |
| [`tehran_intersection_alley_street.json`](tehran_intersection_alley_street.json) | Tehran street and alley junctions | 237 | Yes |
| [`tehran_pois.json`](tehran_pois.json) | Hospitals, transport hubs, landmarks, shopping, and restaurants in Tehran Province | 17 | Yes |
| [`iran_heritage_pois.json`](iran_heritage_pois.json) | Selected heritage landmarks outside Tehran Province | 5 | Yes |
| [`regional_pois.json`](regional_pois.json) | Starter collections for Mashhad, Isfahan, Shiraz, and Tabriz | 20 | Yes |
| [`tehran_metro.json`](tehran_metro.json) | Tehran Metro and commuter rail station records across seven lines | 145 | Yes |
| [`iran_locations.json`](iran_locations.json) | Nationwide mapped cities, towns, and named places across 31 provinces | 40,657 | Yes |

## Quick start

Find Abadan County in the JSON dataset with [jq](https://jqlang.org/).

```sh
jq '.[] | select(.slug == "Abadan")' cities.json
```

```json
{
  "id": 102,
  "title": "آبادان",
  "slug": "Abadan",
  "province_id": 7,
  "latitude": 30.3392,
  "longitude": 48.3043
}
```

The province and county files are top-level arrays. Most other JSON files wrap their arrays under `RECORDS`. The Metro file has separate `lines` and `stations` arrays. Tehran coordinates may be strings, and street and alley junctions use `location.lat` and `location.lon`.

The [MySQL export](cities.sql) recreates the `provinces`, `cities`, `sections`, and `towns` tables. Use an empty database for the import.

```sh
mysql -u YOUR_USER -p YOUR_DATABASE < cities.sql
```

## Points of interest

POI records have a stable string `id`, a Persian `name`, a Latin-script `slug`, a `category`, and a `province_id` referencing `province.json`. Coordinate fields are numeric WGS 84 latitude and longitude. Each row includes a `source_url` and the date it was checked in `verified_on`.

`point_type` describes what the coordinates mark. A `site` is a representative building or site pin. An `airport_reference_point` is the published reference location for an airport. Use a separately verified entrance pin for entrance-specific routing.

## Tehran Metro

Station records include line numbers and interchange status. The dataset contains 62 entrance pins linked by OpenStreetMap stop-area relations at 23 stations. Entrance coverage is partial. Place details in the Tehran collection show the nearest mapped station by straight-line distance.

## Nationwide locations

`iran_locations.json` contains a snapshot of named places in selected categories from the November 24, 2026 Geofabrik Iran extract. The row order is defined by `fields`. The `osm` field gives the object type and ID, such as `node/26038590`. English names and county IDs are nullable. County IDs use the same IDs as `cities.json`.

The atlas displays 482 counties from the reconciled reference data. It retains the former Maneh and Samalqan county record in the underlying JSON for compatibility and shows the successor counties in the atlas. Nationwide POIs reflect the coverage and tags available in the snapshot.

## Data notes

- Province and county coordinates are representative map pins. A county pin may identify its administrative seat.
- Coverage reflects the records in this repository. Some Latin-script labels need review.
- The SQL export uses a separate set of province and county IDs. Some `sections.json` links also need reconciliation before joining them to `cities.json`.

## Sources and map credits

- Administrative divisions reference. [Statistical Centre of Iran](https://www.amar.org.ir/)
- Updated county coordinates. [GeoNames](https://www.geonames.org/export/) and [Open Admin Data](https://github.com/open-admin-data/iran-administrative-divisions), both under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- The Bandar-e Gaz pin, Tehran junctions, Azadi Square, and most Tehran points of interest. [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright) · [Azadi Square map feature](https://www.openstreetmap.org/relation/7790807)
- README map boundary data. [2017 province boundaries from geoBoundaries](https://www.geoboundaries.org/api/current/gbOpen/IRN/ADM1/).
- Airport reference points. [OurAirports open data](https://github.com/davidmegginson/ourairports-data).
- Heritage site coordinates. [UNESCO World Heritage Centre](https://whc.unesco.org/en/list/).
- Atlas boundaries, nationwide locations, and Metro data. The atlas uses simplified OpenStreetMap province boundaries, with geoBoundaries as a fallback for Bushehr. OpenStreetMap-derived data is shared under the ODbL. [Geofabrik Iran extract](https://download.geofabrik.de/asia/iran.html) · [geoBoundaries provinces](https://www.geoboundaries.org/api/current/gbOpen/IRN/ADM1/) · [Tehran Metro network](https://www.openstreetmap.org/relation/21175029) · [OpenStreetMap attribution and license](https://www.openstreetmap.org/copyright)
- Bundled map library. [Leaflet 1.9.4 and its license](atlas/vendor/LICENSE)
