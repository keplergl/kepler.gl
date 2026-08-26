# Live remotely hosted data

Loads a CORS CSV of vehicles around San Francisco as a remotely hosted dataset
and **polls it every 10 seconds**. The CSV file itself is rewritten on that same
interval, so points drift on the map and the `snapshot` column increments.

This is a manual test harness for snapshot refresh (`refreshDataset` /
`metadata.refreshIntervalMs`) on `DatasetType.EXTERNALLY_HOSTED`. It bundles
local monorepo `src/` (not a published npm package).

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

- Twelve points around San Francisco, moving every ~10 seconds.
- The right sidebar `snapshot` number increments with each poll.
- Layers panel → dataset row: **Refresh** is set to **10s**, and the reload
  icon refetches immediately.
- Opening the data table shows `updated_at` changing. Field names stay the same,
  so the point layer is kept (not rebuilt from scratch).

`GET /vehicles.csv?fresh=1` steps the snapshot on every request, which is useful
if you want the reload icon to always show new rows.

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

Fetch, then set **Refresh** to 10s on the dataset in the Layers panel.

[yarn-install]: https://yarnpkg.com/getting-started/install
