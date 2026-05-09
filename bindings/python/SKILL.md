# Skill: Create Static HTML Maps with keplergl-Jupyter

## Purpose

Use the `keplergl` Python package to create standalone, interactive HTML map files from geospatial data. The exported HTML loads kepler.gl from CDN — no JavaScript build or server is needed. The resulting `.html` file can be opened directly in any browser.

## Installation

```bash
pip install keplergl
```

**Requirements:** Python >= 3.9

**Optional dependencies** (installed automatically with keplergl):
- `pandas` — for DataFrames
- `geopandas` — for GeoDataFrames and reading geospatial files
- `shapely` — for geometry operations (comes with geopandas)

## Quick Start — Minimal Static Map

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

This creates `cities_map.html` — a fully self-contained interactive map.

## Core API

### `KeplerGl()` — Create a Map Widget

```python
KeplerGl(
    height=400,            # Map height in pixels
    data=None,             # Dict of {"dataset_name": data_object}
    config=None,           # Map configuration dict (layers, filters, map state)
    mapbox_token="",       # Mapbox token (needed only for Mapbox basemap styles)
    theme="",              # "light", "dark", "base", or "" (default dark)
    app_name="kepler.gl",  # App name shown in header and HTML <title>
)
```

### `.add_data()` — Add a Dataset

```python
map_1.add_data(data=df, name='my_dataset')
```

- `data`: DataFrame, GeoDataFrame, CSV string, GeoJSON dict, or GeoJSON string
- `name`: Dataset identifier — must match `dataId` in config if using a config

### `.save_to_html()` — Export to Static HTML

```python
map_1.save_to_html(
    file_name='keplergl_map.html',  # Output file path
    read_only=False,                # True = hide side panel
    center_map=True,                # True = auto-fit map to data bounds
    mapbox_token="",                # Mapbox token for Mapbox styles
    config=None,                    # Override config (uses current if None)
    data=None,                      # Override data (uses current if None)
    theme=None,                     # Override theme
    app_name=None,                  # Override app name
)
```

### `.config` — Get/Set Map Configuration

```python
# Read current config (after interacting with map in Jupyter)
current_config = map_1.config

# Apply a config
map_1.config = my_config_dict
```

## Supported Data Formats

| Format | How to Load |
|--------|-------------|
| **pandas DataFrame** | Columns with `latitude`/`longitude` (or similar) for point data |
| **geopandas GeoDataFrame** | Geometry column auto-detected; re-projected to EPSG:4326 |
| **CSV string** | Raw CSV text with lat/lng or geometry columns |
| **GeoJSON dict** | `Feature` or `FeatureCollection` as Python dict |
| **GeoJSON string** | JSON string of GeoJSON |
| **WKT in DataFrame** | DataFrame column containing WKT geometry strings |

## Layer Types and Config

kepler.gl automatically detects data types and creates layers. You can also provide a `config` dict to control layer types, colors, and visual settings. The most commonly used layer types are:

| Layer Type | Config `type` Value | Typical Data |
|------------|-------------------|--------------|
| Point | `"point"` | DataFrame with lat/lng columns |
| Arc | `"arc"` | DataFrame with origin/destination lat/lng |
| Line | `"line"` | DataFrame with origin/destination lat/lng |
| Hexbin (aggregation) | `"hexagon"` | DataFrame with lat/lng (aggregated spatially) |
| Heatmap | `"heatmap"` | DataFrame with lat/lng |
| H3 Hexagon | `"hexagonId"` | DataFrame with H3 hex ID column |
| GeoJSON / Polygon | `"geojson"` | GeoJSON or GeoDataFrame with polygon/line geometries |
| Cluster | `"cluster"` | DataFrame with lat/lng |
| Icon | `"icon"` | DataFrame with lat/lng |
| Trip | `"trip"` | GeoJSON with LineString + timestamps |
| S2 | `"s2"` | DataFrame with S2 token column |

## Map Type Reference Files

For detailed examples of creating specific map types with full config, see:

- [Point Map](skill-references/point-map.md) — Scatter plot of locations from lat/lng
- [GeoJSON / Polygon Map](skill-references/geojson-polygon-map.md) — Polygons, lines from GeoJSON or GeoDataFrame
- [H3 Hexagon Map](skill-references/h3-hexagon-map.md) — H3 spatial index hexagons
- [Arc / Line Map](skill-references/arc-line-map.md) — Origin-destination connections
- [Heatmap](skill-references/heatmap.md) — Density heatmap from points
- [Hexbin Aggregation Map](skill-references/hexbin-aggregation-map.md) — Spatial binning into hexagons
- [Trip Animation Map](skill-references/trip-animation-map.md) — Animated trips along paths

## Config Structure

A config dict has this structure:

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
            'styleType': 'dark-matter'  # 'dark-matter', 'positron', 'dark-matter-nolabels', 'positron-nolabels', 'voyager', 'voyager-nolabels'
        }
    }
}
```

### Key Rules for Config

1. **`dataId` must match the dataset `name`** — Every layer and filter references a dataset by `dataId`. This must match the `name` passed to `add_data()` or the key in the `data` dict.
2. **GeoJSON columns use `_geojson`** — When data is loaded as GeoJSON, the geometry column is internally named `_geojson` in configs.
3. **Save and reuse configs** — Call `map_1.config` after customizing in the UI, then save and reuse:

```python
# Save config to file
import json
with open('my_config.json', 'w') as f:
    json.dump(map_1.config, f)

# Load config from file
with open('my_config.json', 'r') as f:
    config = json.load(f)

map_2 = KeplerGl(data={'data_1': df}, config=config)
map_2.save_to_html(file_name='map.html')
```

## Common Patterns

### Load GeoJSON from file and export

```python
from keplergl import KeplerGl
import json

with open('boundaries.geojson', 'r') as f:
    geojson = json.load(f)

map_1 = KeplerGl(data={'boundaries': geojson})
map_1.save_to_html(file_name='boundaries_map.html', center_map=True)
```

### Load GeoDataFrame and export with read-only mode

```python
from keplergl import KeplerGl
import geopandas as gpd

gdf = gpd.read_file('shapefile.shp')

map_1 = KeplerGl(data={'regions': gdf})
map_1.save_to_html(file_name='regions_map.html', read_only=True, center_map=True)
```

### Multiple datasets on one map

```python
from keplergl import KeplerGl
import pandas as pd

points_df = pd.read_csv('locations.csv')
routes_df = pd.read_csv('routes.csv')

map_1 = KeplerGl(data={
    'locations': points_df,
    'routes': routes_df
})
map_1.save_to_html(file_name='combined_map.html', center_map=True)
```

### Light theme with custom app name

```python
map_1 = KeplerGl(
    data={'data': df},
    theme='light',
    app_name='My Dashboard'
)
map_1.save_to_html(file_name='dashboard.html')
```

## Basemap Styles

Free basemap styles (no token needed):
- `dark-matter` — Dark background (default)
- `positron` — Light background
- `voyager` — Colorful with labels
- `dark-matter-nolabels`, `positron-nolabels`, `voyager-nolabels` — Without labels

Mapbox styles (require `mapbox_token`):
- `dark` — Mapbox Dark
- `light` — Mapbox Light
- `muted` — Mapbox Muted Light
- `muted_night` — Mapbox Muted Night

## Tips

- Use `center_map=True` in `save_to_html()` to auto-fit the map bounds to your data.
- Use `read_only=True` to hide the side panel in exported HTML for clean presentations.
- kepler.gl auto-detects column types: columns named `latitude`/`lat`/`lng`/`longitude` are recognized as coordinates.
- H3 hex IDs are auto-detected if a column contains valid H3 strings.
- For large datasets, use `use_arrow=True` when creating the widget for faster serialization.
- The exported HTML is fully standalone — it loads all dependencies from CDN.
