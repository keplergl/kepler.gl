# Live remotely hosted data

Loads a CORS CSV of points orbiting San Francisco as a remotely hosted dataset
and **polls it every 300 ms**. The right sidebar switches between four host-app
update styles:

- **Poll URL** — HTTP snapshot replace (`refreshDataset` /
  `metadata.refreshIntervalMs`) on `DatasetType.EXTERNALLY_HOSTED`. Positions
  come from wall-clock time; one full loop takes **2 minutes**.
- **Host rows** — pauses the poll, then the example dispatches `addToDataset` /
  `removeFromDataset` so rows change in place without tearing down the point
  layer. Switching back to Poll URL resumes fetching and **replaces** the table
  (injected rows disappear).
- **WebSocket** — pauses the poll. The **host app** (not Kepler) opens
  `ws://localhost:4010/vehicles.ws` and maps each JSON upsert to
  `addToDataset(..., {upsertBy: 'id'})`. Kepler has no websocket client and
  still rebuilds layer data on every message.
- **Arrow rows** — pauses polling and opens a separate local Arrow dataset.
  The same host controls append, upsert and delete through the public actions.
  Mode changes hide the inactive dataset's layers; Arrow rows and layer/filter
  settings remain available when you return.

This bundles local monorepo `src/` (not a published npm package). Host-row
and websocket edits use in-memory CSV (`RowDataContainer`); **Arrow rows**
uses an explicitly typed Arrow table (`ArrowDataContainer`).
The same actions support primitive Arrow columns; nested, binary, and GeoArrow
columns cannot be appended or upserted. DuckDB tables remain a warned no-op.
The **Keyed by id** controls exercise `addToDataset(id, rows, {upsertBy: 'id'})` and
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

- Orbit **freezes** (interval set to 0).
- **Add 1 / Add 5** drop points on outer rings (4–6), same layer id.
- **Remove last / Remove random** delete by row index.
- **Keyed by id** — **Insert/Move tracker** upserts `track-01` (`upsertBy: 'id'`).
  First click adds a ring-7 point; later clicks move that same row (ids list
  and row count stay put). **Remove tracker** / **Remove veh-01** /
  **Remove last host** delete with `{field: 'id', values}`.
- **Auto trail** appends a point every 800ms and drops the oldest host row
  after 20 so the cloud stays bounded.
- Switch back to Poll URL: next CSV fetch restores the 3 orbiting vehicles.

### WebSocket

- Orbit **freezes**. The example host connects to
  `ws://localhost:4010/vehicles.ws` (same process as the CSV server).
- Server sends `{op: 'upsert', upsertBy: 'id', rows}` every 400ms. Three
  `ws-01`…`ws-03` points (rings 8–10) complete a loop every **20 seconds**.
  Row count grows by 3, then stays put while those ids move.
- Sidebar shows socket status and message count. If the socket drops, the host
  retries after 1s.
- This is the [#322](https://github.com/keplergl/kepler.gl/issues/322) *transport*
  pattern: `ws → addToDataset`. It is **not** a Kepler websocket layer and does
  **not** skip a full layer-data rebuild.

### Arrow rows

- Select **Arrow rows**. It starts with 3 local points and requires no CSV or
  WebSocket connection. Storage should read **ArrowDataContainer · 1 batch(es)**.
  The first visit fits the map to include the outer rings used by new points.
- **Add 1 / Add 5** append rows. **Insert tracker**, then **Move tracker**
  repeatedly: its coordinates and speed change while the row count stays put.
  **Remove tracker / Remove veh-01 / Remove last host** delete by id;
  **Remove last / Remove random** delete by index.
- Change the **Live Arrow** layer radius/color or add a numeric **speed** filter.
  Repeat the edits and check that the layer id, styling and filter selection
  remain. The revision counter advances after each successful edit.
- **Auto trail** adds every 800ms and keeps at most 20 host points. Switching
  modes turns it off; returning to Arrow keeps the edited rows without restarting
  the timer. The original CSV dataset keeps its existing mode behavior.
- The Arrow table is initialized once. Edit controls never call `addDataToMap`
  or replace its full snapshot. Sample columns are Utf8, Float64 and Int32;
  nested/binary/GeoArrow append/upsert is deliberately outside this example.

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
