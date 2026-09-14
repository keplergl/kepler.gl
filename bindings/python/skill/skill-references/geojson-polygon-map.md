# GeoJSON / Polygon Map

Display polygon, line, or point geometries from GeoJSON or GeoDataFrame data.

## Data Options

### Option 1: GeoJSON dict or string

```python
import json

with open('boundaries.geojson', 'r') as f:
    geojson = json.load(f)

# geojson can be a FeatureCollection or a single Feature
```

### Option 2: GeoDataFrame

```python
import geopandas as gpd

gdf = gpd.read_file('shapefile.shp')
# or from a GeoJSON file:
gdf = gpd.read_file('boundaries.geojson')
```

### Option 3: Inline GeoJSON

```python
geojson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {"name": "Area A", "value": 100},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-122.4, 37.8], [-122.4, 37.7],
                    [-122.3, 37.7], [-122.3, 37.8],
                    [-122.4, 37.8]
                ]]
            }
        }
    ]
}
```

## Minimal Export

```python
from keplergl import KeplerGl

# From GeoJSON
map_1 = KeplerGl(data={'zones': geojson})
map_1.save_to_html(file_name='polygon_map.html', center_map=True)

# From GeoDataFrame
map_1 = KeplerGl(data={'zones': gdf})
map_1.save_to_html(file_name='polygon_map.html', center_map=True)
```

## Export with Config

**Important:** When data is loaded as GeoJSON, the geometry column in config must be `_geojson`.

```python
config = {
    'version': 'v1',
    'config': {
        'visState': {
            'layers': [{
                'type': 'geojson',
                'config': {
                    'dataId': 'zones',
                    'label': 'Zone Boundaries',
                    'isVisible': True,
                    'columns': {
                        'geojson': '_geojson'
                    },
                    'visConfig': {
                        'opacity': 0.8,
                        'filled': True,
                        'stroked': True,
                        'thickness': 1.5,
                        'strokeColor': [255, 255, 255],
                        'colorRange': {
                            'name': 'Sunrise 8',
                            'type': 'sequential',
                            'category': 'Uber',
                            'colors': [
                                '#194266', '#355C7D', '#63617F', '#916681',
                                '#C06C84', '#D28389', '#E59A8F', '#F8B195'
                            ]
                        },
                        'enable3d': False,
                        'elevationScale': 5
                    }
                },
                'visualChannels': {
                    'colorField': {'name': 'value', 'type': 'integer'},
                    'colorScale': 'quantize'
                }
            }],
            'interactionConfig': {
                'tooltip': {
                    'enabled': True,
                    'fieldsToShow': {
                        'zones': ['name', 'value']
                    }
                }
            }
        },
        'mapStyle': {
            'styleType': 'positron'
        }
    }
}

map_1 = KeplerGl(data={'zones': geojson}, config=config, theme='light')
map_1.save_to_html(file_name='polygon_map_styled.html')
```

## 3D Extruded Polygons

Set `enable3d: True` and map a `heightField` to extrude polygons:

```python
config['config']['visState']['layers'][0]['config']['visConfig']['enable3d'] = True
config['config']['visState']['layers'][0]['config']['visConfig']['elevationScale'] = 10
config['config']['visState']['layers'][0]['visualChannels']['heightField'] = {
    'name': 'value', 'type': 'integer'
}
config['config']['visState']['layers'][0]['visualChannels']['heightScale'] = 'linear'
```

## Key Config Fields for GeoJSON Layer

| Field | Description |
|-------|-------------|
| `columns.geojson` | Must be `'_geojson'` for GeoJSON data |
| `visConfig.filled` | Fill polygons with color |
| `visConfig.stroked` | Show polygon outlines |
| `visConfig.thickness` | Outline stroke width |
| `visConfig.strokeColor` | RGB array for outline color |
| `visConfig.enable3d` | Extrude polygons in 3D |
| `visConfig.elevationScale` | Height multiplier for 3D |
| `visualChannels.colorField` | Property to map to fill color |
| `visualChannels.heightField` | Property to map to extrusion height |
