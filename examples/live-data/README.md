# Live remotely hosted data

Loads a CORS CSV of points orbiting San Francisco as a remotely hosted dataset
and **polls it every 1 second**. Positions are computed from wall-clock time:
each point completes one full loop in **2 minutes**. A fetch returns the
positions at that moment (there is no server-side snapshot timer).

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

- Three points on three rings around San Francisco. Adjacent rings move in
  opposite directions. One full orbit takes 2 minutes.
- The right sidebar **orbit** percent advances with each poll (`progress` /
  `orbit_s` in the table).
- Layers panel → one **Point** layer (trip is not auto-created). Refresh is
  set on the dataset row; the reload icon samples the current time immediately.
- Field names stay the same, so the point layer is kept (not rebuilt from
  scratch).

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

Fetch, then set **Refresh** to 1s (or Custom) on the dataset in the Layers panel.

[yarn-install]: https://yarnpkg.com/getting-started/install
