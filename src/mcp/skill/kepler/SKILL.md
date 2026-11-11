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
| `map.get-layer-options` | Inspect editable visual settings, values, ranges and choices. |
| `map.set-layer-options` | Patch visual settings or Zarr variable/dimension/axis selections. |
| `map.update-layer-color` | Update an existing layer's color palette.                      |
| `map.set-basemap`        | Change the basemap style.                                      |
| `map.set-view-mode`      | Switch between the flat 2D map, the tilted 3D map and the 3D globe. |
| `map.load-data`          | Load data from a URL (no layer — call `map.add-layer`).        |
| `map.save-data`          | Save a DuckDB table as a map dataset (no layer — call `map.add-layer`). |
| `map.add-column`         | Add a column to an EXISTING dataset in place (copy or expression). |
| `map.create-table`       | Create a NEW dataset via SQL (original untouched — call `map.add-layer`). |
| `map.get-dataset-context` | List all loaded datasets with their fields and layer configurations. |
| `map.get-boundary`       | Read the current map view's bounding box.                      |
| `map.load-tileset`       | Import vector/raster tiles, WMS, 3D tiles or a bitmap (then call `map.add-layer`). |
| `map.load-zarr`          | Import a remote Zarr store's metadata (then call `map.add-layer`). |
| `map.camera-bookmarks`   | List, save, remove, or go to a saved camera view.               |
| `map.camera-tour`        | Get/set location-animation stops, seek, play or pause. |
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

Use `map.set-layer-options` with `layerId` and `options`, for example
`{"glowEnabled": true, "pulseEnabled": true, "pulseMode": "ripple"}`.
Continuous mode needs no time filter. Event pulses use `pulseTrigger: "event"`,
`pulseTimeField`, and `pulseDurationMs`, plus an enabled time filter on that
same dataset/field. Missing timestamps produce no effect. Discover settings
and ranges with `map.get-layer-options`; `map.add-layer.options` accepts the
same visual settings when creating a layer.

### Heatmap 3D Surface

Set `options: {"surfaceEnabled": true, "surfaceHeight": 1000}` with
`map.set-layer-options` and use `map.set-view-mode` to tilt the map.
`surfaceLighting`, `surfaceContours`, and `surfaceContourStep` control shading
and contours. Height represents density, not terrain; these contours are
separate from the Contour layer.

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
  editable through `map.set-layer-options` (or `map.add-layer.options`).
- A field layer over a very large grid is expensive: one row per sample point is
  fine, but downsample rasters to roughly 10k–100k points before loading.

### Contour layer (`layerType: "contour"`)

Use numeric `latitudeColumn`/`longitudeColumn` or `geometryColumn`; omit them
to use detected columns. For example, call `map.add-layer` with:

```json
{"datasetName": "observations", "layerType": "contour", "contour": {"weightColumn": "temperature", "levels": 7}}
```

Omit `weightColumn` for point counts; weighted cells average finite values.
`colorByLevel` colors thresholds; set it false with `simpleColor` for one color.
Tabular `colorBy`/`colorMap` do not apply. Use regional 2D data: globe and
antimeridian-crossing contours are unsupported. These are not travel-time isochrones.

### Zarr layer (`layerType: "zarr"`)

1. Call `map.load-zarr` with `url` (the HTTP(S) store URL) and `datasetName`.
   Read its returned dataset ID, variable paths, and dimension names/sizes.
2. Call `map.add-layer` using that dataset ID, for example:

```json
{
  "datasetName": "<returned datasetId>", "layerType": "zarr",
  "zarr": {"variable": "temperature", "dimensionIndexes": {"level": 0},
    "axis": {"kind": "dimension", "dimension": "time"}, "frame": 0, "rescale": [250, 310]}
}
```

Use actual metadata names and a rescale range in the variable's units. Indexes
are zero-based; `frame` requires an explicit dimension/forecast axis. Use this
axis rather than a table time filter. To revise a layer, use
`map.set-layer-options` with its `layerId` and the same `zarr` options.
The store must allow browser access
(CORS); exports retain its URL and settings, not the remote raster data.

### Voronoi Mosaic layer (`layerType: "voronoi"`)

Call `map.add-layer` with `layerType: "voronoi"`, optional
`latitudeColumn`/`longitudeColumn` or `geometryColumn`, and
`voronoi: {"boundsPadding": 10}`. Standard color options map source attributes
to cells. Cells represent nearest sites in Web Mercator, not road travel time;
use regional flat-map data. Filters rebuild cells from retained sites.

### Tile, cell, model, and image layers

Use `map.add-layer` with `layerType: "a5"` or `"geohash"` and
`columns: {"token": "cell_column"}`. Icons use `"icon"` with `lat`, `lng`,
and `icon` column mappings. Models use `"3D"` with `lat`/`lng` (optional
`altitude`) or `geojson`, and `options.scenegraph` for a glTF/GLB URL.

For remote layers, call `map.load-tileset` with `datasetName`, `type`, and
`url`, then `map.add-layer` with the returned `datasetId` and `layerType`.
Types are `vectorTile` (MVT/PMTiles), `rasterTile` (STAC/PMTiles), `wms`,
`tile3d` (tileset JSON), and `bitmap` (also requires `[west,south,east,north]`
`bounds`). Vector tiles optionally take `metadataUrl`; STAC rasters require
`rasterTileServerUrls` unless the host configures a TiTiler server. For WMS, select a returned service-layer name using
`map.set-layer-options.wmsLayer`. Preserve source URLs when exporting.

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

### Bookmarks (`map.camera-bookmarks`)

Save the current view with:

```json
{"action": "save", "id": "downtown", "name": "Downtown", "showControl": true}
```

Use `action: "list"`, or `"go-to"`/`"remove"` with the bookmark ID. Saving an
existing ID updates it in place. Supply `camera` to save explicit longitude,
latitude, zoom, bearing, and pitch. Bookmarks restore only the camera;
navigation requires a single Mercator map. Use `action: "show-control"` with
`showControl` to change control visibility without resaving bookmarks.

### Camera tours (`map.camera-tour`)

Use `action: "set"` with ordered `stops`, each containing `id`, `name`,
`camera` (longitude, latitude, zoom, bearing, pitch), `holdDurationMs`, and
`travelDurationMs`. Durations are nonnegative milliseconds; hold precedes
travel to the next stop, and the last travel duration is ignored.

Use `action: "get"` before extending a tour: set replaces all stops, and `[]`
clears it. `action: "seek"` with `elapsedMs` pauses and moves along the tour.
`action: "play"` resumes (or restarts at the end); `"pause"` stops the clock.
Playback works with the side panel closed and pauses on manual navigation.
Tours require a single Mercator map and animate the view, not dataset
features; do not add a time filter for camera movement.

### Fade on Zoom (`map.set-zoom-fade`)

Use existing layer IDs from `map.add-layer` or `map.get-dataset-context`:

```json
{"enabled": true, "controllers": [{"id": "detail", "layerIds": ["observations-layer"], "stops": {"appear": 2, "full": 4, "fade": 8, "gone": 10}}]}
```

Keep `0 <= appear <= full <= fade <= gone <= 24`. Each layer/annotation belongs
to one controller; pass annotation IDs in `annotationIds`. Controllers replace
the complete list; omit them to only toggle, or pass `[]` to clear. The fade
multiplies normal opacity and does not make hidden layers visible.

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

## Loading and readiness checks

- Do not infer basemap loading from generic `Loading...` text or a progress
  bar's dimensions. The loading indicator is shared across data and layer
  operations and remains mounted while visually hidden.
- A successful `map.set-basemap` changes the selected style; it does not
  establish that all basemap tiles have finished loading.
- Investigate loading only when it blocks the requested result or the user
  asks. If using the UI, check actual visibility and identify the source of
  the loading state before attributing it to the basemap. If that source
  cannot be established, report the uncertainty rather than claiming the
  basemap is still loading.
- Do not change basemaps merely to clear an unverified loading signal.

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
