---
name: kepler-gl-app
description: Create and configure kepler.gl map layers (point, flow, flowField, arc, line, grid, hexagon, geojson, cluster, heatmap, h3, trip, s2) from datasets, animate them over time, compare them side by side, change the basemap, switch between the 2D, 3D and globe views, update layer colors, load data from a URL, add columns to existing datasets, and read the current map boundary.
---

# Kepler map management

Create and configure kepler.gl map layers from datasets, animate them over
time, compare them side by side, change the basemap, update layer colors,
load data from a URL, add columns to existing datasets, and read the current
map boundary. These are direct map-mutation operations on the kepler.gl map
surface.

## When to use

Use this skill when the user wants to create or reconfigure map layers, change
the appearance or configuration of the map itself, animate data over time, or
compare layers side by side. Examples:
- "Show the shops as points colored by visits"
- "Create a heatmap of the pickup locations"
- "Animate the trips over time"
- "Compare the 2019 and 2024 layers side by side"
- "Change the basemap to dark/satellite/positron"
- "Update the color of the layer to blue"
- "Load data from this URL"
- "Add a new variable / column to an existing dataset"
- "Change a column's type (e.g. make NOSOUTH a string)"
- "Rename a column on the existing dataset"
- "What's the current map boundary/extent?"
- "Save this view as a bookmark and animate a tour between locations"
- "Fade these layers or annotations as I zoom"
- "Show contours, a Zarr forecast, or a Voronoi mosaic"

Do NOT use this skill for analysis beyond map mutation — spatial statistics,
spatial filtering, colocation, boundary fetching, or charts. Those belong to
your host's analysis skills (e.g. a spatial-analysis skill, a filter skill),
not this one.

## Commands at a glance

| command                  | purpose                                                        |
| ------------------------ | -------------------------------------------------------------- |
| `map.add-layer`          | Add a layer (point, flow, flowField, h3, arc, trip, hexagon, grid, cluster, heatmap, geojson, line, s2) to the map. |
| `map.add-time-filter`    | Animate a NON-trip layer over a TIMESTAMP/DATE column.         |
| `map.toggle-time-filter` | Show/hide the enlarged time controller at the bottom of the map. |
| `map.split-view`         | Enable/disable dual-map comparison.                            |
| `map.update-layer-color` | Update an existing layer's color palette.                      |
| `map.set-basemap`        | Change the basemap style.                                      |
| `map.set-view-mode`      | Switch between the flat 2D map, the tilted 3D map and the 3D globe. |
| `map.load-data`          | Load data from a URL (no layer — call `map.add-layer`).        |
| `map.save-data`          | Save a DuckDB table as a map dataset (no layer — call `map.add-layer`). |
| `map.add-column`         | Add a column to an EXISTING dataset in place (copy or expression). |
| `map.create-table`       | Create a NEW dataset via SQL (original untouched — call `map.add-layer`). |
| `map.get-dataset-context` | List all loaded datasets with their fields and layer configurations. |
| `map.get-boundary`       | Read the current map view's bounding box.                      |
| `map.load-zarr`          | Import a remote Zarr store's metadata (then call `map.add-layer`). |
| `map.camera-bookmarks`   | List, save, remove, or go to a saved camera view.               |
| `map.camera-tour`        | Get/set location-animation stops or seek the camera along the tour. |
| `map.set-zoom-fade`      | Enable zoom fades and configure layer/annotation controllers. |

Every command takes a `commandId` (one of the table above) and an `input`
object. Issue commands through your host's map-command dispatcher — the exact
envelope is described in your host's tool listing. In the kepler.gl demo
assistant the dispatcher is the `executeApi` tool with
`apiName: "executeCommand"` and `args: { commandId, input }`.

`map.add-layer` also accepts `contour`, `voronoi`, and `zarr`, with their
options described below. The stdio bridge replaces the namespace dot with
an underscore: for example, `map.camera-bookmarks` becomes
`map_camera-bookmarks`. Dispatchers use the dotted command IDs.

When editing saved config, merge into the existing `config.visState` and
preserve unrelated layers, filters, and interactions. Layer definitions use
`{id, type, config, visualChannels}`; `type` is not MCP's `layerType`.
Use real dataset and layer IDs, and check that the running JavaScript bundle
supports the requested feature. Installing a skill does not upgrade the app.

## Picking a layer type

- Individual locations → `point` (`cluster` for zoom-out density, `heatmap`
  for continuous intensity).
- Density without precomputed cells → `grid` or `hexagon` (auto-binned).
- Pre-aggregated H3 cells → `h3`.
- Origin→destination flows → `flow` (a dedicated flow layer with locations, clustering and weighted edges; requires two point lat/lng pairs — source + destination). Fall back to `arc` only when you want straight great-circle lines between points. For weighted flows optionally pass the magnitude column as `countColumn`.
- Vector fields — wind, currents, downhill terrain flow → `flowField`, animated streamlines over one vector per sample point. This is **not** `flow`: `flow` joins an origin pair to a destination pair, `flowField` draws many short lines through a field of vectors.

- Polylines / polygons → `line` / `geojson`. A decoded GEOMETRY `geom`
  column can be rendered directly with `geojson` — do NOT convert it to
  lat/lon columns or build an intermediate table. For geojson datasets use
  geometryColumn `"_geojson"`.
- Time-animated movement → `trip`.
- Scalar levels or point-count contours → `contour` with optional `contour.weightColumn`.
- Nearest-site cells → `voronoi` with optional `voronoi.boundsPadding`.
- Multidimensional raster slices → `map.load-zarr`, then a `zarr` layer.

## Color configuration

- `colorBy` is case-sensitive and must match the column name exactly.
- `simpleColor` is the string `"[r, g, b]"` (e.g. `"[255, 64, 0]"`), not an array.
  It is a single static color for ALL features — NEVER use it for data-driven
  coloring; use `colorBy` + `colorType` + `colorMap` for that.
- For continuous data use `colorType: "breaks"` with a `colorMap` whose last
  entry has `value: null` (the color for the highest bucket):
  `[{value: 0, color: "#fee5d9"}, {value: 50, color: "#fcae91"}, {value: 100, color: "#fb6a4a"}, {value: null, color: "#de2d26"}]`
- For categorical data use `colorType: "unique"`:
  `[{value: "retail", color: "#1f77b4"}, {value: "restaurant", color: "#ff7f0e"}]`
  HARD RULE: the `value`s MUST be the actual unique values in the column.
  Classify the variable with your host's classification tool first and use the
  returned unique values verbatim. NEVER guess category labels from the column
  name — `map.add-layer` rejects values that do not exist in the data.
- For `heatmap`, only `colorRange` (from `colorMap`) takes effect.
- To compute the break values, classify the variable with your host's
  classification tool first and pass the returned breaks as the `colorMap`
  values.
- Generate ColorBrewer-style palettes automatically when the user does not
  specify colors.

### Suggested palettes

- Sequential green: `#ffffcc #c2e699 #78c679 #31a354 #006837 #004529`
- Sequential red: `#fee5d9 #fcae91 #fb6a4a #de2d26 #a50f15`
- Categorical (Tableau 10): `#1f77b4 #ff7f0e #2ca02c #d62728 #9467bd #8c564b`

## Workflow

### 1. Create a layer (`map.add-layer`)

Point layer colored by a continuous variable:

```json
{
  "datasetName": "shops",
  "layerType": "point",
  "layerName": "Shops by visits",
  "colorBy": "visits",
  "colorType": "breaks",
  "colorMap": [
    {"value": 3, "color": "#ffffcc"},
    {"value": 10, "color": "#c2e699"},
    {"value": 25, "color": "#78c679"},
    {"value": 50, "color": "#31a354"},
    {"value": 100, "color": "#006837"},
    {"value": null, "color": "#004529"}
  ]
}
```

Point layer with a uniform color:

```json
{
  "datasetName": "pizza_stores",
  "layerType": "point",
  "layerName": "Pizza stores",
  "simpleColor": "[255, 64, 0]"
}
```

H3 layer:

```json
{
  "datasetName": "visits_h3_r9",
  "layerType": "h3",
  "layerName": "Visits density (h3 r9)",
  "colorBy": "visit_count",
  "colorType": "breaks",
  "colorMap": [
    {"value": 100, "color": "#fee5d9"},
    {"value": 500, "color": "#fcae91"},
    {"value": 2000, "color": "#fb6a4a"},
    {"value": 10000, "color": "#de2d26"},
    {"value": null, "color": "#a50f15"}
  ]
}
```

`map.add-layer` returns `dateTimeColumns` when the dataset has TIMESTAMP/DATE
fields — see "Time animation" below for the follow-up.

### Point Glow and Pulse / Ripple

- **Point → Visual → Glow** adds a static halo. **Pulse / Ripple** animates
  points in place; continuous mode needs no timestamp or time filter. Both
  are off by default and can be enabled independently.
- For **Trigger → At event time**, select an **Event timestamp** and a
  **Duration (timeline seconds)**, and add/enable a time filter for the same
  dataset and timestamp field. The first matching enabled filter drives the
  effect. Without it, ordinary points remain but the event effect is inactive.
  Missing timestamps produce no effect. The filter window's end is the current
  time; pausing freezes effects and scrubbing/replay updates them. Filters can
  cut effects short; coarse time steps can skip short events.

These visual options require the Point layer panel or a supported config
editor. Standard MCP can create the Point layer and its event time filter.

### Heatmap 3D Surface

**Heatmap → 3D Surface** raises density into a continuous surface. Enable
it and tilt the map; **Maximum height (m)** controls height, while shading
and surface contours are optional. Height represents density, not terrain.
It uses the existing weights/filters and works on the map and globe.
Surface contours are a heatmap option, distinct from the Contour layer.

Standard MCP can create the Heatmap layer; enable these options in the layer
panel or through a supported config editor.

### 2. Time animation (NON-trip layers)

When the user asks how something changed/evolved/trended over time and the
source dataset has a TIMESTAMP/DATE column, build a SINGLE layer and animate
it with `map.add-time-filter` — do NOT create a separate static layer per
time step. A stack of snapshot layers does not convey motion and clutters the
map; the animated layer is the deliverable.

- BEFORE creating any layer for a temporal request, DECLARE the expected
  layer count: a change-over-time request ⇒ exactly **1** layer. If you find
  yourself about to issue a 2nd `map.add-layer`, STOP — you have erred.
- `map.add-layer` returns `dateTimeColumns` when timestamp/date fields are
  detected. Pass the first one to `map.add-time-filter`.
- If the column is an integer/string epoch, build a real TIMESTAMP column
  first (Kepler.gl cannot handle negative epochs) — NEVER pass an
  integer/string column directly.
- `map.add-time-filter` input: `{ datasetName, dateTimeColumn, interval? }`.
  `interval` is auto-detected from the data when omitted.
- **Do not retry `map.add-time-filter` more than once.** If it fails, report
  the error and continue — do not loop.
- LAYER ORDERING: create the time-filtered layer LAST so its animation is
  not hidden behind later layers.

```json
{
  "datasetName": "earthquakes",
  "dateTimeColumn": "time"
}
```

### Trip layers (`layerType: "trip"`)

- Trip layers have **built-in** time animation. Do NOT add a
  `map.add-time-filter` for a trip layer — it is unnecessary and can break the
  animation. After creating a trip layer, STOP.
- Strict columns: `id` (shared across a trip's waypoints), `latitude` /
  `longitude` (DOUBLE), `timestamp` (epoch milliseconds). If your epoch is in
  seconds, multiply by 1000.
- Densify sparse O-D data (interpolate lon/lat AND timestamp) or trips
  teleport.

### Flow field layer (`layerType: "flowField"`)

Animated streamlines over a vector field — wind, ocean currents, or downhill
terrain flow. Each row of the dataset is one sample point: a position plus a
direction. It is not the origin→destination `flow` layer — `flow` joins two
point pairs, `flowField` draws many short, continuously moving lines through a
field of vectors.

Pick the mode from the columns the dataset has; `map.add-layer` auto-detects
them in this order and names them in `flowField.*Column` when they differ:

| `flowField.mode` | Columns | Direction comes from |
|------------------|---------|----------------------|
| `UV` (default) | `u`, `v` (+ optional `altitude`) | east/north vector components |
| `SPEED_DIR` | `speed`, `direction` | speed plus compass direction (from) |
| `ELEVATION` | `altitude` | the downhill gradient of a height surface |

Position comes from lat/lng columns — auto-detected, or `latitudeColumn` /
`longitudeColumn` — or from a GeoJSON geometry column when the dataset has one.

Wind encoded as `u`/`v` (no extra parameters needed):

```json
{
  "datasetName": "wind_grid",
  "layerType": "flowField",
  "layerName": "Wind field",
  "flowField": {"colorBySpeed": true}
}
```

Wind encoded as speed + direction under different column names:

```json
{
  "datasetName": "wind_grid",
  "layerType": "flowField",
  "layerName": "Wind field",
  "flowField": {
    "mode": "SPEED_DIR",
    "speedColumn": "wind_speed",
    "directionColumn": "wind_dir"
  }
}
```

- `colorBySpeed: true` colors each streamline by its local speed (using the
  layer's color range); without it the streamlines use `color`. `colorBy` /
  `colorMap` do not apply to this layer.
- Do **not** add `map.add-time-filter` — the flow field animates continuously on
  its own, like a trip layer.
- Streamline density (`linesPerScreen`), `strokeWidth`, `trailLength`,
  `cycleSeconds`, `lineLifetime` and `smoothing` use tuned defaults; they are
  adjusted in the layer panel, not through `map.add-layer`.
- A field layer over a very large grid is expensive: one row per sample point is
  fine, but downsample rasters to roughly 10k–100k points before loading.

### Contour layer (`type: "contour"`, prototype)

Call `map.add-layer` with numeric coordinate columns (or `geometryColumn`):

```json
{
  "datasetName": "observations",
  "layerType": "contour",
  "latitudeColumn": "lat",
  "longitudeColumn": "lng",
  "contour": {"weightColumn": "temperature", "levels": 7, "smoothing": 3}
}
```

Omit `weightColumn` for point counts. Omit position columns to use the first
detected coordinate pair or geometry field. The `contour` options also accept
`gridResolution`, `filled`, `stroked`, `colorByLevel`, and `fillOpacity`.
Use `colorByLevel: false` with `simpleColor` for a single color; tabular
`colorBy`, `colorType`, and `colorMap` do not apply to contour surfaces.

Select **Contour** in the layer picker. Choose numeric latitude/longitude
columns, or GeoJSON representative points, then optionally select **Weight**.
With a weight, occupied cells contain the mean of finite values; without it,
they contain point counts. Null/nonfinite weights are skipped; zero and
negative weights are valid. Empty cells contain zero and affect smoothing.

For saved config, point columns are `config.columns.lat`, `lng`, and optional
`value` (the Weight field). In GeoJSON mode use `geojson`. Layer appearance
lives in `config.visConfig`: `gridResolution` (32–256, default 64), `smoothing`
(default 3 grid cells), `levels` (2–20), `colorByLevel`, `filled`, `stroked`,
and `fillOpacity`. A custom threshold range uses `customRange`, `minimum`, and
`maximum`. Use thresholds in the data's units; smoothing changes values as
well as outlines.

Contours show scalar levels or point density, not travel-time isochrones.
Filters select samples before aggregation; polygons do not clip contour
boundaries. Use regional 2D data: globe and antimeridian-crossing data are not
supported. `enableContourLayer` controls picker visibility and defaults to
true. It does not disable rendering saved contour layers.

### Zarr layer (`type: "zarr"`, experimental)

Call `map.load-zarr` with `{"url": "https://example.org/forecast.zarr",
"datasetName": "Forecast"}` using the actual store URL. Its result includes
`datasetId`, variable paths, and non-spatial dimension names/sizes. Then call
`map.add-layer` with the returned dataset ID:

```json
{
  "datasetName": "<returned datasetId>",
  "layerType": "zarr",
  "zarr": {
    "variable": "temperature",
    "dimensionIndexes": {"level": 0},
    "axis": {"kind": "dimension", "dimension": "time"},
    "frame": 0,
    "rescale": [250, 310],
    "opacity": 0.8
  }
}
```

Use variable paths and dimensions returned by the loader, and a rescale range
in the variable's units. `axis` also accepts `{"kind": "auto"}`,
`{"kind": "off"}`, or `{"kind": "forecast", "referenceTime": "run",
"leadTime": "lead"}` for compatible forecast dimensions. `frame` requires an
explicit dimension/forecast axis. Dimension indexes and frames are zero-based.
Omit `zarr` options to use the store's default variable and automatic time axis.
Zarr uses a raster palette and `rescale`, not tabular `colorBy`/`colorMap`.

The equivalent UI workflow is:

1. Open **Add Data → Tilesets → Zarr** and enter a public store URL.
2. Wait for metadata, then choose **Add Tileset**.
3. Select the variable and pinned dimensions in the layer panel; adjust its
   color range and opacity.
4. Select a timeline axis to step through a dimension. Numeric/categorical
   coordinates work; recognized time coordinates can use the shared timeline.
   Forecast reference time and lead time can combine into valid time.

Use the Zarr axis controls rather than `map.add-time-filter` on an invented
table column. `map.load-data` is not the Zarr tileset-import workflow. The
store must allow browser requests through CORS. Changing the URL or closing
the Add Data modal cancels its metadata load; tool cancellation also stops
`map.load-zarr` before it adds the dataset.

JSON/HTML exports retain the store URL, default variable, attribution, and
layer settings (selected variable, axis, frame, pinned dimensions, colors).
They do not embed the remote raster data; metadata is fetched again on load.
Preserve an exported tileset descriptor instead of fabricating CSV rows or
full variable metadata in a Python DataFrame. `enableZarrLayer` defaults to
true and controls the adding UI, not rendering saved layers.

### Voronoi Mosaic layer (`type: "voronoi"`)

Call `map.add-layer` with `layerType: "voronoi"`, a dataset name, optional
`latitudeColumn`/`longitudeColumn` or `geometryColumn`, and
`voronoi: {"boundsPadding": 10}`. Without explicit columns, the first detected
coordinate pair or geometry field is used. Standard `colorBy`/`colorMap`
options color cells by their source attributes. `voronoi` also accepts
`filled`, `stroked`, and `opacity`.

Choose **Voronoi Mosaic**, then **Point Columns** (latitude/longitude) or
**GeoJSON Centroids** (geometry). Color by a source attribute and adjust
**Cell Bounds → Bounds Padding (%)**. Each cell belongs to the nearest input
site in Web Mercator, not the nearest site by road travel time. Use the flat
map for regional exploration.

Filters rebuild cells from the retained sites, while the outer bounds remain
tied to the full dataset and padding. Coincident sites share a cell assigned
to the first retained row; invalid coordinates are skipped. In saved configs,
use `lat`/`lng` or `geojson` columns and `visConfig.boundsPadding`.
`enableVoronoiLayer` defaults to true and controls picker visibility.

### Tile, cell, model, and image layers

Use the layer picker/config for A5 (`a5`), Geohash (`geohash`), icons (`icon`),
3D models (`3D`), and image overlays (`bitmap`). Use **Add Data → Tilesets** for
vector tiles (`vectorTile`), raster tiles (`rasterTile`), WMS (`wms`), and
3D tiles (`tile3d`). Keep exported source descriptors and their remote URLs;
do not treat these sources as ordinary point tables. A 3D model layer (`3D`)
is different from a 3D tileset (`tile3d`).

### 3. Split map comparison (`map.split-view`)

- `action: "enable"` with `layerIdsForMap0` / `layerIdsForMap1`. Without the
  layer-id arrays all layers show on both panels (no comparison). Use the SAME
  `colorBy` / `colorType` for a fair comparison. `action: "disable"` returns
  to one map.

```json
{
  "action": "enable",
  "layerIdsForMap0": ["layer_2019"],
  "layerIdsForMap1": ["layer_2024"]
}
```

### 4. Toggle the time controller

`map.toggle-time-filter` with `action: "show"` enlarges the time controller
at the bottom of the map; `action: "hide"` collapses it back to the side
panel. A time filter must already exist (created via `map.add-time-filter`).

### 5. Basemap style

```json
{ "styleType": "dark" }
```

Valid `styleType` values: `"no_map"`, `"dark-matter"`, `"positron"`,
`"voyager"`, `"satellite"`, `"dark"`, `"light"`, `"muted"`, `"muted_night"`.
If the user uses a descriptive name, map it to the closest valid `styleType`.
If the request is ambiguous, ask the user to clarify.

### 6. Layer color

```json
{
  "layerId": "layer_xxx",
  "numberOfColors": 5,
  "customColors": ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"]
}
```

`customColors` is an array of hex color strings; `numberOfColors` must equal
its length. If the user describes colors qualitatively (e.g. "van gogh
starry night", "watercolor"), generate an appropriate palette from the
description. If the user refers to a layer by name rather than id, find the
matching `layerId` from the dataset context.

### 7. Load data from URL

```json
{ "url": "https://..." }
```

This fetches the data, parses it, and adds it to the map as a dataset. It
does NOT create a layer — call `map.add-layer` afterward to visualize the
data (with the layer type, color, and styling you want).

The dataset is named after the URL filename (e.g. `nyc.geojson`). If the
user wants a specific dataset name, pass it as `datasetName`:

```json
{ "url": "https://.../nyc.geojson", "datasetName": "NYC Neighborhoods" }
```

Local files: a local file must be served over http(s) — the browser cannot
fetch `file://` paths. Copy the file into the demo app's served directory
(e.g. `examples/demo-app/dist/`) and pass `/filename.csv`, or serve it with
a CORS-enabled local server (`npx serve --cors -l 8000`) and pass
`http://localhost:8000/filename.csv`. If you have the file content but
cannot serve it (e.g. a remote browser context), pass it as a data URL —
`data:text/csv;base64,<base64 content>` (encode with `base64 -i file.csv`).
This works for small files (up to ~2MB).

For large files (over a few MB), prefer Parquet (`.parquet`) over
GeoJSON/CSV — it loads much faster and is less likely to time out. Convert
GeoJSON to GeoParquet with geopandas (`gdf.to_parquet("data.parquet")`);
kepler reads GeoParquet geometry (WKB) natively, so the map renders the
same lines.

Do NOT create a duplicate dataset just to rename it — never run
`map.create-table` with a plain `SELECT *` (or any copy) to give the loaded
data a friendlier name. `map.create-table` creates a SEPARATE new dataset and
is only for real column transformations; the rename belongs in
`map.load-data`'s `datasetName` (or in the user's hands). Use the loaded
dataset as-is and add the layer to it.

### 8. Map boundary

```json
{}
```

Returns the northwest and southeast coordinates of the current map view:
`{ boundary: { nw: [lon, lat], se: [lon, lat] } }`. When the user says
"current map view", call this to scope spatial queries to the visible area.

### 9. Add / rename / retype a column in an EXISTING dataset (`map.add-column`)

`map.add-column` adds a NEW column to an existing dataset **in place** — the
dataset keeps its name, id, color and layers, and existing columns are
untouched. The new column's values come from exactly ONE of two sources:

- `copyFromColumn` — copy an existing column's values. This is how you rename a
  column in place: to rename `fare` to `fare_amount`, add `fare_amount` copying
  `fare` (the original column stays — the command never removes columns).
- `expression` — an SQL expression computed per row, for a derived variable
  (z-score, ratio, concatenation) OR a type change:
  - z-score: `{ datasetName, newColumnName: "HR60_Z", expression: "(HR60 - AVG(HR60) OVER()) / STDDEV(HR60) OVER()" }`
  - type change: `{ datasetName, newColumnName: "NOSOUTH_str", expression: "NOSOUTH::VARCHAR" }`
    (or `CAST(NOSOUTH AS VARCHAR)`). The new column holds the cast values; the
    original column stays.

```json
{
  "datasetName": "natregimes.geojson",
  "newColumnName": "NOSOUTH_str",
  "expression": "NOSOUTH::VARCHAR"
}
```

`map.create-table` is NOT for this — it builds a separate NEW dataset and leaves
the original untouched. Prefer `map.add-column` whenever the user wants the
change to land in the existing dataset.

### View mode: 2D map, 3D map, or globe (`map.set-view-mode`)

```json
{ "mode": "globe" }
```

- `2d` — flat map, no tilt. The default for city- and region-scale data.
- `3d` — the flat map tilted (pitch 50). For extruded buildings, 3D layers and a
  more dramatic camera; it is **not** a globe.
- `globe` — the 3D globe with atmosphere. Use it when the data spans the world
  (global trips, arcs, lines, points, clusters, hexagons, grids, GeoJSON), so
  the user sees the whole planet instead of a distorted flat world.

Switching to `globe` clamps zoom into the globe's range; switching back to
`2d`/`3d` restores the normal range. The camera mode is independent of the
basemap, so set both when the user asks for a "dark globe" and the like.

- **Keep `flow` and `flowField` layers off the globe.** Neither is supported
  there yet — flow arrows collapse when seen edge-on, and the flow field's
  clipping is mercator-only. Create a global flow field on the 2d map; if the
  user wants a globe view of global movement, use `arc`, `line` or `trip`
  instead, or tell them the field layer needs the flat map.
- Do not switch modes unless the user asks for it or the data's global extent
  makes it clearly better; a map that suddenly becomes a globe is surprising.

### Bookmarks

Save the current view with `map.camera-bookmarks`:

```json
{"action": "save", "id": "view-downtown", "name": "Downtown", "showControl": true}
```

Use `{"action": "list"}`, `{"action": "go-to", "id": "view-downtown"}`,
or `{"action": "remove", "id": "view-downtown"}`. Saving an existing ID
updates it in place and preserves all other bookmarks. Pass an explicit
`camera` snapshot to save coordinates without first moving the map.
Current-view capture and navigation use the host's `getMapState` accessor,
which is wired into the demo's MCP and WebMCP surfaces. Go-to moves immediately.

1. In **Interactions → Bookmarks**, compose a view and choose **Add Bookmark**.
2. Rename or reorder bookmarks; **Update view** replaces the saved camera.
3. Enable the **Bookmarks** switch for **Go to** and the floating panel.
   Disabling the switch hides the panel without deleting the saved views.

Bookmarks store longitude, latitude, zoom, bearing, and pitch, independently
of datasets. They do not restore layers or filters. Editing/navigation require
a single Mercator map (2D or tilted 3D), not globe or split-map mode.

Saved config stores an array at `config.visState.cameraBookmarks`:

```json
[
  {
    "id": "view-downtown",
    "name": "Downtown",
    "camera": {"longitude": -122.4, "latitude": 37.78, "zoom": 12, "bearing": 0, "pitch": 45}
  }
]
```

The switch is a separate UI preference; importing bookmarks does not turn it
on.

### Camera tours

Use `map.camera-tour` with `action: "set"` and ordered `stops`:

```json
{
  "action": "set",
  "stops": [
    {"id": "start", "name": "Downtown", "camera": {"longitude": -122.4, "latitude": 37.78, "zoom": 12, "bearing": 0, "pitch": 45}, "holdDurationMs": 1000, "travelDurationMs": 3000},
    {"id": "end", "name": "Harbor", "camera": {"longitude": -122.39, "latitude": 37.8, "zoom": 13, "bearing": 20, "pitch": 45}, "holdDurationMs": 1000, "travelDurationMs": 0}
  ]
}
```

`{"action": "get"}` returns the tour and total duration. To inspect its camera
at a time, use `{"action": "seek", "elapsedMs": 2500}`; this applies the same
interpolation as playback and clamps at the end. `{"action": "set", "stops": []}`
clears the tour. Set replaces the complete ordered stop list; get it first
when extending an existing tour. Play/Pause remains in the camera-animation
panel; set and seek do not start playback.

For a fly-through between places, use **Interactions → Camera animation**.
**Add stop** captures the current view, or offers a saved bookmark when one
exists. Rename and reorder stops, use **Pick current location** to update a
stop, set hold/travel durations, then enable playback and use Play/Pause or the
time scrubber. Stops copied from bookmarks own their camera snapshots; later
bookmark edits do not update them.

`config.visState.cameraTour` contains a `stops` array. Each stop has `id`,
`name`, `camera` (the same five fields as a bookmark), `holdDurationMs`, and
`travelDurationMs`. The UI shows seconds; saved durations are milliseconds.
Travel is to the next stop and the final stop's travel duration is ignored.
Use finite, nonnegative durations. Playback ends at the last stop; Play at the
end restarts it. Manual map navigation pauses playback. Tour stops persist,
but playback position/state is transient. Tours require a single Mercator map.

A camera tour moves the view, not dataset features. For vehicles moving along
timestamped paths use a Trip layer. For events appearing over time use a time
filter; for points pulsing in place use the Point layer's Pulse / Ripple
controls. Do not create a time filter merely to move the camera.

### Fade on Zoom

Call `map.set-zoom-fade` with existing layer IDs (returned by `map.add-layer`
or listed by `map.get-dataset-context`):

```json
{
  "enabled": true,
  "controllers": [
    {"id": "detail", "layerIds": ["observations-layer"], "stops": {"appear": 2, "full": 4, "fade": 8, "gone": 10}}
  ]
}
```

For annotations, pass their real IDs in a controller's `annotationIds` array;
the command converts them to saved fade targets. Controllers replace the
complete fade list. Omit `controllers` to only toggle the effect, or pass `[]`
to clear it. Other interactions and layer opacity settings are preserved.

In **Interactions → Fade on zoom**, add a controller, select its layers and/or
annotations, set the four zoom handles, and enable the switch. Each target can
belong to only one controller. The fade multiplies normal opacity and does not
make a hidden layer visible.

The handles are **Appear**, **Full start**, **Full end**, and **Disappear**,
corresponding to saved keys `appear`, `full`, `fade`, and `gone`. Keep them
ordered within zoom 0–24. For `[2, 4, 8, 10]`, opacity is zero at/below 2,
half at 3, full from 4 through 8, half at 9, and zero at/above 10. Coincident
inner/outer handles make an immediate transition; all four equal means always
invisible.

Example value of `config.visState.interactionConfig.zoomOpacity` (replace
`observations-layer` with an existing layer ID):

```json
{
  "id": "zoomOpacity",
  "enabled": true,
  "config": {
    "controllers": [
      {
        "id": "fade-observations",
        "layerIds": ["observations-layer"],
        "stops": {"appear": 2, "full": 4, "fade": 8, "gone": 10}
      }
    ]
  }
}
```

For annotations, select targets in the UI or preserve their exported target
IDs; do not substitute annotation names for IDs. Disabling the effect preserves
controllers. Controllers and enabled state are saved with the map.

## Rules

- Commands that add datasets to the map — `map.load-data`, `map.save-data`,
  `map.create-table` — do NOT auto-create layers. Always call `map.add-layer`
  afterward to visualize the result.
- To add a variable to, rename a column in, or change a column type in an
  EXISTING dataset, use `map.add-column` (copy or expression) — do NOT create a
  new dataset. `map.create-table` only when the user wants a SEPARATE new
  dataset.
- A dataset loaded from a URL keeps the URL filename (or the `datasetName` you
  pass to `map.load-data`). NEVER create a duplicate dataset via
  `map.create-table` just to rename it — use the loaded dataset as-is.
- For change-over-time requests, create exactly ONE animated layer — never
  a separate static layer per time step.
- Do not add a `map.add-time-filter` to a trip layer — trips animate
  themselves.
- If a basemap style name is ambiguous, ask the user to clarify rather than
  guessing.
- For layer color updates, the `layerId` must match an existing layer on the
  map. If the user refers to a layer by name rather than id, use the layer
  name to find the matching layer id from the dataset context.

## Before your final message

- If you created a layer, confirm the layer type, name, and (if any) the
  color field/colorType applied.
- If you added a time filter, confirm the animated column and interval.
- If you enabled split view, confirm which layers are on each panel.
- If you changed the basemap, confirm the new `styleType`.
- If you updated layer colors, confirm the layer id and colors applied.
- If you loaded data, confirm the dataset was loaded and a layer was created.
- If you read the map boundary, report the northwest and southeast
  coordinates.
- If `map.add-layer` returned `dateTimeColumns` and the user asked about
  change over time, you MUST follow up with `map.add-time-filter` on the first
  returned column — do not leave the temporal hint unactioned.

## Cross-surface reference

This plugin also ships the `keplergl-python` skill, which builds standalone HTML
maps from Python. When a request crosses over — the Python script and the open
app must agree on a layer type, a basemap, or a palette — use the shared tables
below, not the Python-side names.

### Layer types

<!-- shared:layer-types -->
**Layer types differ between the two surfaces.** A `keplergl` Python `config`
names the layer in `type`; an MCP `map.add-layer` call names it in `layerType`.
The same spatial concept often uses a different string, and the H3/hexbin pair
is the classic trap:

| Concept | Python config `type` | MCP `layerType` |
|---------|----------------------|-----------------|
| Point | `point` | `point` |
| Cluster | `cluster` | `cluster` |
| Heatmap | `heatmap` | `heatmap` |
| Hexbin (binned from points) | `hexagon` | `hexagon` |
| H3 hexagon (precomputed H3 ids) | `hexagonId` | `h3` |
| Grid (binned from points) | — | `grid` |
| S2 | `s2` | `s2` |
| Arc (great-circle origin→destination) | `arc` | `arc` |
| Flow (weighted origin→destination) | — | `flow` |
| Flow field (streamlines over a vector field) | — | `flowField` |
| Line (polylines) | `line` | `line` |
| GeoJSON / polygon | `geojson` | `geojson` |
| Trip (path + timestamp animation) | `trip` | `trip` |
| Icon | `icon` | — |
| Contour (scalar levels or point counts) | `contour` | `contour` |
| Voronoi Mosaic (nearest-site cells) | `voronoi` | `voronoi` |
| Zarr (remote multidimensional raster) | `zarr` | `zarr` |
| A5 / Geohash cells | `a5` / `geohash` | — |
| Vector / raster tiles | `vectorTile` / `rasterTile` | — |
| WMS | `wms` | — |
| 3D tiles | `tile3d` | — |
| 3D models | `3D` | — |
| Image overlay | `bitmap` | — |

- **`hexagonId` is not `hexagon`.** In a Python config, `hexagonId` is H3 and
  `hexagon` is hexbin. Over MCP, H3 is `h3` and `hexagon` is still hexbin.
  Writing `hexagon` for H3 ids gives an empty or wrong layer on both surfaces.
- Config types describe the current JavaScript renderer. A Python export needs
  a bundle that implements that type; these are not all available in the
  minimum Python version's default bundle. Tilesets also require their source
  descriptors, not just a layer `type` and a DataFrame.
- `—` means the surface has no layer type for that concept; do not substitute
  another one silently.
- MCP layer types are validated against an enum, so an unknown string is
  rejected rather than silently guessed.
- **`flow` is not `flowField`.** `flow` joins an origin point pair to a
  destination point pair; `flowField` draws animated streamlines through one
  vector per sample point (wind, currents, downhill terrain).
<!-- /shared:layer-types -->

### Basemaps

<!-- shared:basemaps -->
Basemap ids are the same on both surfaces, but each surface takes them
differently. Python sets `config.config.mapStyle.styleType`; MCP calls
`map.set-basemap` with `{"styleType": ...}`.

| `styleType` | Needs a Mapbox token |
|-------------|:--------------------:|
| `dark-matter` | no |
| `positron` | no |
| `voyager` | no |
| `no_map` | no |
| `satellite` | yes |
| `dark` | yes |
| `light` | yes |
| `muted` | yes |
| `muted_night` | yes |

- Without a Mapbox token only `dark-matter`, `positron`, `voyager`, and
  `no_map` render.
- `map.set-basemap` rejects any id outside this table (its schema is an enum).
  A Python `mapStyle.styleType` is passed straight to kepler.gl, so it also
  accepts custom styles declared in `mapStyle.mapStyles`.
- The `dark-matter-nolabels`, `positron-nolabels`, and `voyager-nolabels` ids no
  longer exist in kepler.gl; hide basemap labels with
  `mapStyle.visibleLayerGroups.label` instead.
- If a requested style name is ambiguous, ask the user rather than guessing.
<!-- /shared:basemaps -->

### Trips

<!-- shared:trip -->
Trip layers animate themselves. A trip needs an `id` shared across its
waypoints, `latitude` / `longitude`, and a `timestamp`.

- **Never attach a separate time filter to a trip layer** — `map.add-time-filter`
  over MCP, or a `timeRange` filter in a Python config. The trip animation and
  the filter fight over the same clock.
- MCP `map.add-layer` expects epoch **milliseconds** in `timestamp`. A Python
  trip GeoJSON carries the timestamp as the fourth coordinate value,
  `[lng, lat, altitude, timestamp]` (epoch seconds or milliseconds); convert the
  same data to milliseconds before handing it to MCP `map.add-layer`.
- Densify sparse origin→destination data — interpolate longitude, latitude, and
  timestamp together — or the trips teleport between waypoints.
<!-- /shared:trip -->

### Palettes

<!-- shared:palettes -->
Use these palettes when the user does not specify colors. The hex values work
unchanged on both surfaces.

- Sequential green: `#ffffcc #c2e699 #78c679 #31a354 #006837 #004529`
- Sequential red: `#fee5d9 #fcae91 #fb6a4a #de2d26 #a50f15`
- Categorical (Tableau 10): `#1f77b4 #ff7f0e #2ca02c #d62728 #9467bd #8c564b`
- Vibrant (the built-in `Global Warming` range): `#5A1846 #900C3F #C70039 #E3611C #F1920E #FFC300`

For continuous data use a sequential or diverging palette; for categorical data
use distinct hues. Do not reuse one palette for two encodings on the same map.
<!-- /shared:palettes -->
