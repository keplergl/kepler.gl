# CLAUDE.md — keplergl Python Package

> Project instructions for Claude Code. This file is automatically loaded when Claude Code operates in this directory.

## Project Overview

`keplergl` is a Python package for creating standalone, interactive HTML map files from geospatial data. The exported HTML loads kepler.gl from CDN — no JavaScript build or server is needed. The resulting `.html` file can be opened directly in any browser.

- **Package:** `keplergl` on PyPI
- **Python:** >= 3.9
- **Dependencies:** `pandas`, `geopandas`, `shapely` (installed automatically)

## Install & Build

```bash
pip install keplergl
```

No build step needed — this is a pure Python package with a bundled Jupyter widget.

## Key API

- `KeplerGl(height, data, config, theme, app_name)` — create a map widget
- `.add_data(data, name)` — add a dataset (DataFrame, GeoDataFrame, CSV string, GeoJSON dict/string, WKT)
- `.save_to_html(file_name, read_only, center_map)` — export to standalone HTML
- `.config` — read or set the map configuration dict

### Constructor Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `height` | int | 400 | Map height in pixels |
| `data` | dict | None | `{"dataset_name": data_object}` |
| `config` | dict | None | Map configuration (layers, filters, map state) |
| `mapbox_token` | str | "" | Mapbox token (only for Mapbox basemap styles) |
| `theme` | str | "" | `"light"`, `"dark"`, `"base"`, or `""` (default dark) |
| `app_name` | str | "kepler.gl" | App name in header and HTML title |

### save_to_html Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `file_name` | str | required | Output file path |
| `read_only` | bool | False | True = hide side panel |
| `center_map` | bool | True | True = auto-fit map to data bounds |

## Conventions

- **`dataId` must match the dataset `name`** — every layer and filter references a dataset by `dataId`; this must match the key in the `data` dict or the `name` passed to `add_data()`.
- **GeoJSON columns use `_geojson`** — when data is loaded as GeoJSON, the geometry column is internally named `_geojson` in configs.
- kepler.gl auto-detects column types: columns named `latitude`/`lat`/`lng`/`longitude` are recognized as coordinates.
- H3 hex IDs are auto-detected if a column contains valid H3 strings.
- Use `center_map=True` in `save_to_html()` to auto-fit map bounds to data.
- Use `read_only=True` to hide the side panel in exported HTML.
- The exported HTML is fully standalone — loads all dependencies from CDN.

## Supported Data Formats

| Format | How to Load |
|--------|-------------|
| pandas DataFrame | Columns with `lat`/`lng` (or similar) for point data |
| geopandas GeoDataFrame | Geometry column auto-detected; re-projected to EPSG:4326 |
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

## Map Type Reference Files

For detailed per-layer-type examples with full config, see files in `skill-references/`:

- [point-map.md](skill-references/point-map.md) — Scatter plot from lat/lng
- [geojson-polygon-map.md](skill-references/geojson-polygon-map.md) — Polygons, lines from GeoJSON or GeoDataFrame
- [h3-hexagon-map.md](skill-references/h3-hexagon-map.md) — H3 spatial index hexagons
- [arc-line-map.md](skill-references/arc-line-map.md) — Origin-destination connections
- [heatmap.md](skill-references/heatmap.md) — Density heatmap from points
- [hexbin-aggregation-map.md](skill-references/hexbin-aggregation-map.md) — Spatial binning into hexagons
- [trip-animation-map.md](skill-references/trip-animation-map.md) — Animated trips along paths

## Common Patterns

### Quick point map from DataFrame

```python
from keplergl import KeplerGl
import pandas as pd

df = pd.DataFrame({
    'lat': [37.7749, 34.0522, 40.7128],
    'lng': [-122.4194, -118.2437, -74.0060],
    'name': ['San Francisco', 'Los Angeles', 'New York']
})
map_1 = KeplerGl(height=600, data={'cities': df})
map_1.save_to_html(file_name='cities_map.html')
```

### GeoDataFrame from shapefile

```python
from keplergl import KeplerGl
import geopandas as gpd

gdf = gpd.read_file('shapefile.shp')
map_1 = KeplerGl(data={'regions': gdf})
map_1.save_to_html(file_name='regions_map.html', read_only=True, center_map=True)
```

### GeoJSON from file

```python
from keplergl import KeplerGl
import json

with open('boundaries.geojson', 'r') as f:
    geojson = json.load(f)
map_1 = KeplerGl(data={'boundaries': geojson})
map_1.save_to_html(file_name='boundaries_map.html', center_map=True)
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
