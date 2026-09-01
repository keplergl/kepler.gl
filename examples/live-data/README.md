# Live remotely hosted data

Loads a CORS CSV of points orbiting San Francisco as a remotely hosted dataset
and **polls it every 300 ms**. The right sidebar switches between host-app
update styles. **CSV / Arrow / GeoJSON** each get their own Kepler instance
(the map is remounted). Formats are not converted in place on the same dataset.

- **Poll URL** — HTTP snapshot replace (`refreshDataset` /
  `metadata.refreshIntervalMs`) on `DatasetType.EXTERNALLY_HOSTED`. Positions
  come from wall-clock time; one full loop takes **2 minutes**. CSV only.
- **Host rows** — pauses the poll (CSV) or starts a fresh in-memory table
  (Arrow / GeoJSON), then dispatches `addToDataset` / `removeFromDataset` so
  rows change in place without tearing down that instance's layer.
- **CSV / Arrow / GeoJSON** — remounts Kepler with a matching table and layer.
  Arrow is a primitive `ArrowDataContainer` (point layer). GeoJSON fetches
  [buildings-australia.geojson](https://raw.githubusercontent.com/keplergl/kepler.gl-data/refs/heads/master/datasets/buildings-australia.geojson)
  from GitHub at runtime (not bundled) onto a GeoJSON layer. Switching back to
  CSV starts a new poll instance.

This bundles local monorepo `src/` (not a published npm package). Host-row
edits work for in-memory CSV (`RowDataContainer`) and Arrow tables with
primitive columns. DuckDB tables log a warning and leave the data unchanged
(INSERT is not implemented yet). Nested, binary, and geoarrow Arrow columns
are also left unchanged. The **Keyed by id** controls
exercise `addToDataset(id, rows, {upsertBy: 'id'})` and
`removeFromDataset(id, {field: 'id', values})`.

## Pre-requirements

- [Node.js ^20.x](http://nodejs.org)
- Repo root already installed (`yarn` in kepler.gl)

## Start

From the **repo root**:

```sh
yarn start:live-data
```

The app opens at [http://localhost:8083](http://localhost:8083) (8083 so it can
run next to `yarn start` on 8080). The CSV server listens at
[http://localhost:4010/vehicles.csv](http://localhost:4010/vehicles.csv).

## What to look for

### Poll URL

- Three points on three rings around San Francisco. Adjacent rings move in
  opposite directions. Color is `ring`. One full orbit takes 2 minutes.
- The sidebar **orbit** percent advances with each poll (`progress` /
  `orbit_s` in the table).
- Layers panel → one **Point** layer. Refresh is set on the dataset row; the
  reload icon samples the current time immediately.

### Host rows

- On the CSV poll instance, orbit **freezes** (interval set to 0). Arrow and
  GeoJSON always start in Host rows with a new Kepler instance.
- **Add 1 / Add 5** drop points on outer rings (4–6), same layer id.
- **Remove last / Remove random** delete by row index.
- **Keyed by id** — **Insert/Move tracker** upserts `track-01` (`upsertBy: 'id'`).
  First click adds a ring-7 point; later clicks **replace** that same row (ids list
  and row count stay put). On an Arrow table that concat-replaces one row. On
  GeoJSON **Move tracker** swaps in another building footprint from the file.
  **Remove tracker** / **Remove veh-01** /
  **Remove last host** delete with `{field: 'id', values}`.
- **Auto trail** appends a point every 800ms and drops the oldest host row
  after 20 so the cloud stays bounded.
- **Poll URL** remounts (or resumes) the CSV poll instance.

### Arrow table

- Click **Arrow**. Kepler remounts with a seed Arrow table and a point layer
  (Host rows). Sidebar **table** should read `ArrowDataContainer`.
- **Insert tracker**, then **Move tracker** — row count stays the same, `track-01`
  jumps. That is Arrow `replace` (concat left + new row + right), not a full
  `addDataToMap` replace.
- **Add 1** / **Remove last** exercise append and slice-remove on the same table.

### GeoJSON features

- Click **GeoJSON**. Kepler remounts over Monash, Victoria and **fetches**
  building MultiPolygons from
  [buildings-australia.geojson](https://raw.githubusercontent.com/keplergl/kepler.gl-data/refs/heads/master/datasets/buildings-australia.geojson)
  (~597 footprints). Seed shows 8 buildings; color is `land_use`.
- **Add 1 / Add 5** append the next footprints from that file (`host-*` ids).
  **Remove last** drops one. **Insert tracker** adds `track-01`; **Move tracker**
  replaces that row with another building (`upsertBy: 'id'`) — row count stays
  the same, a different footprint appears.

## CSV server only (Add Data URL)

From this folder, or the repo root:

```sh
node examples/live-data/server.mjs
```

Then in any Kepler.gl that already has remotely hosted datasets: **Add Data →
URL**

```
http://localhost:4010/vehicles.csv
```

Fetch, then set **Refresh** to Custom (0.3s) on the dataset in the Layers panel.

[yarn-install]: https://yarnpkg.com/getting-started/install
