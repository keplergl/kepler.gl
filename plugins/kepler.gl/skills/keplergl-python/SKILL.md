---
name: keplergl-python
description: Create interactive map visualizations and export to standalone HTML using the keplergl Python package. Use when the user wants to create maps, visualize geospatial data, plot locations on a map, or generate HTML map files from DataFrames, GeoDataFrames, GeoJSON, or CSV data with coordinates.
---

# Create Maps with keplergl

Use the `keplergl` Python package to create standalone, interactive HTML map files from geospatial data. The exported HTML loads kepler.gl from CDN — no JavaScript build or server is needed. The resulting `.html` file can be opened directly in any browser.

## Two surfaces

kepler.gl reaches an AI assistant two ways, and this plugin ships a skill for
each:

| Surface | What it does | Skill |
|---------|--------------|-------|
| `keplergl` Python package | Builds a map from data and exports standalone HTML | this skill (`keplergl-python`) |
| Live kepler.gl app over `map.*` commands | Mutates a map that is already open in the app | `kepler-gl-app` |

Use this skill when the deliverable is an HTML file or a Python script. Use
`kepler-gl-app` when the user is looking at a running map and asks you to change
it. The two are not interchangeable — the same layer can need a different type
string on each surface (see [Layer Types](#layer-types)).

## Installation

```bash
pip install keplergl
```

Requires `keplergl >= 0.4.0`. Earlier versions use a different widget/serialization API and the examples in this skill will not work. Requirements: Python >= 3.9. Dependencies (`pandas`, `geopandas`, `shapely`) are installed automatically.

## Instructions

1. Import `KeplerGl` from `keplergl`
2. Load data as a DataFrame, GeoDataFrame, GeoJSON dict, or CSV string
3. Create a map with `KeplerGl(data={'name': data_object})`
4. Optionally configure layers, colors, and map state via a `config` dict (default to quantile color scale and a vibrant palette for quantitative color encoding when the user does not specify)
5. Export with `map.save_to_html(file_name='output.html', center_map=True)`
6. The output HTML is fully standalone — open it in any browser

## API Reference

### `KeplerGl(data=None, config=None, height=400, mapbox_token="", use_arrow=False, show_docs=False, theme="", app_name="kepler.gl", **kwargs)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `height` | int | 400 | Map height in pixels |
| `data` | dict | None | `{"dataset_name": data_object}` |
| `config` | dict | None | Map configuration (layers, filters, map state) |
| `mapbox_token` | str | "" | Mapbox token (only for Mapbox basemap styles) |
| `use_arrow` | bool | False | Serialize DataFrames as Arrow IPC (more compact, preserves types) |
| `show_docs` | bool | False | Deprecated (kept for compatibility) |
| `theme` | str | "" | `"light"`, `"dark"`, `"base"`, or `""` (default dark) |
| `app_name` | str | "kepler.gl" | App name in header and HTML title |

### `.add_data(data, name="data", use_arrow=None)`

- `data`: DataFrame, GeoDataFrame, CSV string, GeoJSON dict, or GeoJSON string
- `name`: Dataset identifier (default: `"data"`) — must match `dataId` in config if using a config
- `use_arrow`: If `True`, serialize this DataFrame as Arrow IPC. If `None` (default), falls back to the widget-level `use_arrow` setting. Has no effect on GeoDataFrames.

### `.save_to_html(file_name="keplergl_map.html", data=None, config=None, read_only=False, center_map=True, mapbox_token="", json_encoder=str, app_name=None, theme=None)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `file_name` | str | `"keplergl_map.html"` | Output file path |
| `data` | dict | None | Data override for export (uses current widget data when None) |
| `config` | dict | None | Config override for export (uses current widget config when None) |
| `read_only` | bool | False | True = hide side panel |
| `center_map` | bool | True | True = auto-fit map to data bounds |
| `mapbox_token` | str | "" | Mapbox token override for export |
| `json_encoder` | callable | str | Fallback encoder for non-JSON-native values in GeoDataFrames |
| `app_name` | str | None | App name override for export title/header |
| `theme` | str | None | Theme override for export (`"light"`, `"dark"`, `"base"`, or `""`) |

### `.config`

Read or set the map configuration dict. Use `map.config` after customizing in Jupyter UI, then save and reuse.

## Key Rules

- **`dataId` must match the dataset `name`** — every layer and filter references a dataset by `dataId`; this must match the key in the `data` dict or the `name` passed to `add_data()`.
- **GeoJSON columns use `_geojson`** — when data is loaded as GeoJSON, the geometry column is internally named `_geojson` in configs.
- **`colorField` / `colorScale` / `sizeField` / `heightField` etc. belong under `visualChannels`, NOT under `config`.** Putting them under `config` is silently ignored — the layer will render but the "Color Based On (field)" input shows empty. The layer object must have two siblings: `config` (for `dataId`, `columns`, `visConfig`, …) and `visualChannels` (for all field-to-channel mappings).
- Columns named `latitude`/`lat`/`lng`/`longitude` are auto-detected as coordinates.
- H3 hex IDs are auto-detected if a column contains valid H3 strings.
- Use `center_map=True` to auto-fit map bounds. Use `read_only=True` to hide the side panel.
- For numeric color encoding, if the user does not specify a color scale, use `visualChannels.colorScale: 'quantile'`.
- For numeric color encoding, if the user does not specify a palette, use a vibrant sequential/diverging palette (for example, `colorRange.name: 'Global Warming'`).
- If the user asks for custom class breaks, compute breakpoints in Python first (for example with `pygeoda`), add a derived classified/bin column to the dataset, and map colors using that derived field.
- **No `SampleMapPanel` in standalone exports.** The `SampleMapPanel` React component lives in the kepler.gl demo app, not in the UMD bundle used by `save_to_html()`. To show a summary/legend overlay, inject an HTML+CSS `<div>` into the exported file (position it at `right: 56px` or `left: 66px` so it doesn't block map controls). See [Summary Panel Overlay](references/summary-panel.md).

## Color Encoding

Numeric fields are colored with `visualChannels.colorScale` (`quantile` when
the user does not ask for a scale) and a `visConfig.colorRange`. Categorical
fields use `colorScale: 'ordinal'`.

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

`colorRange` is an object (`name`, `type`, `category`, `colors`), not a list of
hex strings — see [Point Map](references/point-map.md) for a complete example.

## Supported Data Formats

| Format | How to Load |
|--------|-------------|
| pandas DataFrame | Columns with `lat`/`lng` (or similar) for point data |
| geopandas GeoDataFrame | Geometry column auto-detected. Interactive widget serialization uses GeoArrow (no CRS reprojection); HTML export path re-projects to EPSG:4326 when needed. |
| CSV string | Raw CSV text with lat/lng or geometry columns |
| GeoJSON dict | `Feature` or `FeatureCollection` as Python dict |
| GeoJSON string | JSON string of GeoJSON |
| WKT in DataFrame | DataFrame column containing WKT geometry strings |

## Layer Types

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

- **`hexagonId` is not `hexagon`.** In a Python config, `hexagonId` is H3 and
  `hexagon` is hexbin. Over MCP, H3 is `h3` and `hexagon` is still hexbin.
  Writing `hexagon` for H3 ids gives an empty or wrong layer on both surfaces.
- `—` means the surface has no layer type for that concept; do not substitute
  another one silently.
- MCP layer types are validated against an enum, so an unknown string is
  rejected rather than silently guessed.
- **`flow` is not `flowField`.** `flow` joins an origin point pair to a
  destination point pair; `flowField` draws animated streamlines through one
  vector per sample point (wind, currents, downhill terrain).
<!-- /shared:layer-types -->

In a Python config, `columns` carries the field names each layer type needs
(`hex_id` for `hexagonId`, `geojson: '_geojson'` for `geojson`, …) and
`visualChannels` carries the field-to-channel mappings (`colorField`,
`sizeField`, `heightField`, …). The per-layer references below show both.

## Time animation and trips

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

See [Trip Animation Map](references/trip-animation-map.md) for a full config.

## Config Structure

```python
config = {
    'version': 'v1',
    'config': {
        'visState': {
            'layers': [...],          # Layer definitions
            'filters': [...],         # Data filters
            'interactionConfig': {},  # Tooltips, brush, geocoder
            'splitMaps': [],          # Split map views
            'layerBlending': 'normal' # 'normal', 'additive', 'subtractive'
        },
        'mapState': {
            'latitude': 37.76,
            'longitude': -122.4,
            'zoom': 11,
            'bearing': 0,
            'pitch': 0,
            'dragRotate': False,
            'isSplit': False
        },
        'mapStyle': {
            'styleType': 'dark-matter'
        }
    }
}
```

## Basemap Styles

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

For the Mapbox styles, pass `mapbox_token=` to `KeplerGl(...)` or to
`save_to_html(...)`; the token is embedded in the exported HTML.

## Additional Resources

For detailed per-layer-type examples with full config, see supporting files:

- [Point Map](references/point-map.md) — Scatter plot from lat/lng
- [GeoJSON / Polygon Map](references/geojson-polygon-map.md) — Polygons, lines from GeoJSON or GeoDataFrame
- [H3 Hexagon Map](references/h3-hexagon-map.md) — H3 spatial index hexagons
- [Arc / Line Map](references/arc-line-map.md) — Origin-destination connections
- [Heatmap](references/heatmap.md) — Density heatmap from points
- [Hexbin Aggregation Map](references/hexbin-aggregation-map.md) — Spatial binning into hexagons
- [Trip Animation Map](references/trip-animation-map.md) — Animated trips along paths
- [Summary Panel Overlay](references/summary-panel.md) — Inject a SampleMapPanel-style info overlay into the exported HTML (for LISA/cluster counts, model summaries, custom legends)

## Examples

For full config examples per layer type, see:
- [Point Map](references/point-map.md) — includes quantile color + vibrant palette config
- [GeoJSON / Polygon Map](references/geojson-polygon-map.md) — includes choropleth config with `visualChannels`

### Quick start (auto-detected layers, no config needed)

```python
from keplergl import KeplerGl
import pandas as pd

df = pd.DataFrame({
    'lat': [37.7749, 34.0522, 40.7128],
    'lng': [-122.4194, -118.2437, -74.0060],
    'name': ['San Francisco', 'Los Angeles', 'New York'],
    'value': [15, 42, 27]
})

map_1 = KeplerGl(data={'cities': df})
map_1.save_to_html(file_name='cities_map.html', center_map=True)
```

### GeoDataFrame from shapefile

```python
from keplergl import KeplerGl
import geopandas as gpd

gdf = gpd.read_file('shapefile.shp')
map_1 = KeplerGl(data={'regions': gdf})
map_1.save_to_html(file_name='regions_map.html', read_only=True, center_map=True)
```

### Multiple datasets

```python
map_1 = KeplerGl(data={
    'locations': points_df,
    'routes': routes_df
})
map_1.save_to_html(file_name='combined_map.html', center_map=True)
```

### Save and reuse config

```python
import json
# Save
with open('my_config.json', 'w') as f:
    json.dump(map_1.config, f)
# Load
with open('my_config.json', 'r') as f:
    config = json.load(f)
map_2 = KeplerGl(data={'data_1': df}, config=config)
map_2.save_to_html(file_name='map.html')
```
