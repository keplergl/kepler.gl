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

Do NOT use this skill for analysis beyond map mutation — spatial statistics,
spatial filtering, colocation, boundary fetching, or charts. Those belong to
your host's analysis skills (e.g. a spatial-analysis skill, a filter skill),
not this one.

## Commands at a glance

| command                  | purpose                                                        |
| ------------------------ | -------------------------------------------------------------- |
| `map.add-layer`          | Add a layer (point, h3, arc, trip, hexagon, grid, cluster, heatmap, geojson, line, s2) to the map. |
| `map.add-time-filter`    | Animate a NON-trip layer over a TIMESTAMP/DATE column.         |
| `map.toggle-time-filter` | Show/hide the enlarged time controller at the bottom of the map. |
| `map.split-view`         | Enable/disable dual-map comparison.                            |
| `map.update-layer-color` | Update an existing layer's color palette.                      |
| `map.set-basemap`        | Change the basemap style.                                      |
| `map.load-data`          | Load data from a URL (no layer — call `map.add-layer`).        |
| `map.save-data`          | Save a DuckDB table as a map dataset (no layer — call `map.add-layer`). |
| `map.add-column`         | Add a column to an EXISTING dataset in place (copy or expression). |
| `map.create-table`       | Create a NEW dataset via SQL (original untouched — call `map.add-layer`). |
| `map.get-dataset-context` | List all loaded datasets with their fields and layer configurations. |
| `map.get-boundary`       | Read the current map view's bounding box.                      |

Every command takes a `commandId` (one of the table above) and an `input`
object. Issue commands through your host's map-command dispatcher — the exact
envelope is described in your host's tool listing. In the kepler.gl demo
assistant the dispatcher is the `executeApi` tool with
`apiName: "executeCommand"` and `args: { commandId, input }`.

## Picking a layer type

- Individual locations → `point` (`cluster` for zoom-out density, `heatmap`
  for continuous intensity).
- Density without precomputed cells → `grid` or `hexagon` (auto-binned).
- Pre-aggregated H3 cells → `h3`.
- Origin→destination flows → `arc`.
- Polylines / polygons → `line` / `geojson`. A decoded GEOMETRY `geom`
  column can be rendered directly with `geojson` — do NOT convert it to
  lat/lon columns or build an intermediate table. For geojson datasets use
  geometryColumn `"_geojson"`.
- Time-animated movement → `trip`.

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
