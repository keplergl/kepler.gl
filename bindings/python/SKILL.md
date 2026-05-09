---
name: keplergl-map
description: Create interactive map visualizations and export to standalone HTML using the keplergl Python package. Use when the user wants to create maps, visualize geospatial data, plot locations on a map, or generate HTML map files from DataFrames, GeoDataFrames, GeoJSON, or CSV data with coordinates.
---

# Create Maps with keplergl

Use the `keplergl` Python package to create standalone, interactive HTML map files from geospatial data. The exported HTML loads kepler.gl from CDN — no JavaScript build or server is needed. The resulting `.html` file can be opened directly in any browser.

## Installation

```bash
pip install keplergl
```

Requires `kepler.gl-jupyter >= 0.4.0`. Earlier versions use a different widget/serialization API and the examples in this skill will not work. Requirements: Python >= 3.9. Dependencies (`pandas`, `geopandas`, `shapely`) are installed automatically.

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

### `.add_data(data, name)`

- `data`: DataFrame, GeoDataFrame, CSV string, GeoJSON dict, or GeoJSON string
- `name`: Dataset identifier — must match `dataId` in config if using a config

### `.save_to_html(file_name="keplergl_map.html", data=None, config=None, read_only=True, center_map=True, mapbox_token="", json_encoder=str, app_name=None, theme=None)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `file_name` | str | required | Output file path |
| `data` | dict | None | Data override for export (uses current widget data when None) |
| `config` | dict | None | Config override for export (uses current widget config when None) |
| `read_only` | bool | True | True = hide side panel |
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
- **No `SampleMapPanel` in standalone exports.** The `SampleMapPanel` React component lives in the kepler.gl demo app, not in the UMD bundle used by `save_to_html()`. To show a summary/legend overlay, inject an HTML+CSS `<div>` into the exported file (position it at `right: 56px` or `left: 66px` so it doesn't block map controls). See [Summary Panel Overlay](skill-references/summary-panel.md).

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

| Layer Type | Config `type` | Typical Data |
|------------|---------------|--------------|
| Point | `"point"` | DataFrame with lat/lng columns |
| Arc | `"arc"` | DataFrame with origin/destination lat/lng |
| Line | `"line"` | DataFrame with origin/destination lat/lng |
| Hexbin | `"hexagon"` | DataFrame with lat/lng (aggregated spatially) |
| Heatmap | `"heatmap"` | DataFrame with lat/lng |
| H3 Hexagon | `"hexagonId"` | DataFrame with H3 hex ID column |
| GeoJSON / Polygon | `"geojson"` | GeoJSON or GeoDataFrame with polygon/line geometries |
| Cluster | `"cluster"` | DataFrame with lat/lng |
| Icon | `"icon"` | DataFrame with lat/lng |
| Trip | `"trip"` | GeoJSON with LineString + timestamps |
| S2 | `"s2"` | DataFrame with S2 token column |

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

Free (no token needed): `dark-matter`, `positron`, `voyager`, `dark-matter-nolabels`, `positron-nolabels`, `voyager-nolabels`

Mapbox (require `mapbox_token`): `dark`, `light`, `muted`, `muted_night`

## Additional Resources

For detailed per-layer-type examples with full config, see supporting files:

- [Point Map](skill-references/point-map.md) — Scatter plot from lat/lng
- [GeoJSON / Polygon Map](skill-references/geojson-polygon-map.md) — Polygons, lines from GeoJSON or GeoDataFrame
- [H3 Hexagon Map](skill-references/h3-hexagon-map.md) — H3 spatial index hexagons
- [Arc / Line Map](skill-references/arc-line-map.md) — Origin-destination connections
- [Heatmap](skill-references/heatmap.md) — Density heatmap from points
- [Hexbin Aggregation Map](skill-references/hexbin-aggregation-map.md) — Spatial binning into hexagons
- [Trip Animation Map](skill-references/trip-animation-map.md) — Animated trips along paths
- [Summary Panel Overlay](skill-references/summary-panel.md) — Inject a SampleMapPanel-style info overlay into the exported HTML (for LISA/cluster counts, model summaries, custom legends)

## Examples

For full config examples per layer type, see:
- [Point Map](skill-references/point-map.md) — includes quantile color + vibrant palette config
- [GeoJSON / Polygon Map](skill-references/geojson-polygon-map.md) — includes choropleth config with `visualChannels`

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
