# Kepler map management

Create and configure kepler.gl map layers from datasets, animate them over
time, compare them side by side, change the basemap, update layer colors,
load data from a URL, and read the current map boundary. These are direct
map-mutation operations that go through `executeApi`.

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
- "What's the current map boundary/extent?"

Do NOT use this skill for:
- Classifying data into bins → use the `data-classify` skill.
- LISA clustering → use the `lisa-clustering` skill.
- Spatial filtering → use the `spatial-filter` skill.
- Colocation analysis → use the `colocation` skill.
- Standardizing variables → use the `standardize-variables` skill.

## Commands at a glance

| command                  | purpose                                                        |
| ------------------------ | -------------------------------------------------------------- |
| `map.add-layer`          | Add a layer (point, h3, arc, trip, hexagon, grid, cluster, heatmap, geojson, line, s2) to the map. |
| `map.add-time-filter`    | Animate a NON-trip layer over a TIMESTAMP/DATE column.         |
| `map.toggle-time-filter` | Show/hide the enlarged time controller at the bottom of the map. |
| `map.split-view`         | Enable/disable dual-map comparison.                            |
| `map.update-layer-color` | Update an existing layer's color palette.                      |
| `map.set-basemap`        | Change the basemap style.                                      |
| `map.load-data`          | Load data from a URL (auto-creates a layer).                  |
| `map.save-data`          | Save a DuckDB table as a map dataset (auto-creates a layer).   |
| `map.create-table`       | Create a dataset via SQL (auto-creates a layer).               |
| `map.get-boundary`       | Read the current map view's bounding box.                      |

All operations go through `executeApi` with `apiName: "executeCommand"`. See the executeApi tool description for the envelope shape.

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
- For `heatmap`, only `colorRange` (from `colorMap`) takes effect.
- To compute the break values, call `data.classify` (in the `data-classify`
  skill) first and pass the returned `breaks` as the `colorMap` values.
- Generate ColorBrewer-style palettes automatically when the user does not
  specify colors.

### Suggested palettes

- Sequential green: `#ffffcc #c2e699 #78c679 #31a354 #006837 #004529`
- Sequential red: `#fee5d9 #fcae91 #fb6a4a #de2d26 #a50f15`
- Categorical (Tableau 10): `#1f77b4 #ff7f0e #2ca02c #d62728 #9467bd #8c564b`

## Workflow

### 1. Create a layer

```json
{
  "call": {
    "apiName": "executeCommand",
    "args": {
      "commandId": "map.add-layer",
      "input": {
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
    }
  },
  "reasoning": "Render shops as points colored by visit count."
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
  "call": {
    "apiName": "executeCommand",
    "args": {
      "commandId": "map.add-time-filter",
      "input": {
        "datasetName": "earthquakes",
        "dateTimeColumn": "time"
      }
    }
  },
  "reasoning": "Animate earthquakes over the time column."
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
  "call": {
    "apiName": "executeCommand",
    "args": {
      "commandId": "map.split-view",
      "input": {
        "action": "enable",
        "layerIdsForMap0": ["layer_2019"],
        "layerIdsForMap1": ["layer_2024"]
      }
    }
  },
  "reasoning": "Compare 2019 and 2024 layers side by side."
}
```

### 4. Toggle the time controller

`map.toggle-time-filter` with `action: "show"` enlarges the time controller
at the bottom of the map; `action: "hide"` collapses it back to the side
panel. A time filter must already exist (created via `map.add-time-filter`).

### 5. Basemap style

```json
{
  "call": {
    "apiName": "executeCommand",
    "args": {
      "commandId": "map.set-basemap",
      "input": { "styleType": "dark" }
    }
  },
  "reasoning": "Switching basemap to dark."
}
```

Valid `styleType` values: `"no_map"`, `"dark-matter"`, `"positron"`,
`"voyager"`, `"satellite"`, `"dark"`, `"light"`, `"muted"`, `"muted_night"`.
If the user uses a descriptive name, map it to the closest valid `styleType`.
If the request is ambiguous, ask the user to clarify.

### 6. Layer color

```json
{
  "call": {
    "apiName": "executeCommand",
    "args": {
      "commandId": "map.update-layer-color",
      "input": {
        "layerId": "layer_xxx",
        "numberOfColors": 5,
        "customColors": ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"]
      }
    }
  },
  "reasoning": "Updating layer colors."
}
```

`customColors` is an array of hex color strings; `numberOfColors` must equal
its length. If the user describes colors qualitatively (e.g. "van gogh
starry night", "watercolor"), generate an appropriate palette from the
description. If the user refers to a layer by name rather than id, find the
matching `layerId` from the dataset context.

### 7. Load data from URL

```json
{
  "call": {
    "apiName": "executeCommand",
    "args": { "commandId": "map.load-data", "input": { "url": "https://..." } }
  },
  "reasoning": "Loading data from <url>."
}
```

This fetches the data, parses it, adds it to the map, and auto-creates a
layer. Do NOT call `map.add-layer` afterward — the layer is created
automatically.

### 8. Map boundary

```json
{
  "call": {
    "apiName": "executeCommand",
    "args": { "commandId": "map.get-boundary", "input": {} }
  },
  "reasoning": "Reading the current map viewport boundary."
}
```

Returns the northwest and southeast coordinates of the current map view:
`{ boundary: { nw: [lon, lat], se: [lon, lat] } }`. When the user says
"current map view", call this to scope spatial queries to the visible area.

## Rules

- Use the `executeApi` tool for all operations in this skill — do not call
  `queryDuckDB` or `geoda` directly (they are not available; everything goes
  through `executeApi`).
- Do not call `map.add-layer` after `map.load-data` / `map.save-data` /
  `map.create-table` — those auto-create a layer.
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