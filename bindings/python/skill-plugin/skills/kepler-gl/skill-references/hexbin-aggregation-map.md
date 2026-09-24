# Hexbin Aggregation Map

Aggregate point data into hexagonal bins. Unlike H3 maps (which use pre-computed H3 IDs), hexbin layers take raw lat/lng points and aggregate them spatially.

## Data

A pandas DataFrame with latitude and longitude columns.

```python
import pandas as pd
import numpy as np

np.random.seed(42)
n = 5000
df = pd.DataFrame({
    'lat': np.random.normal(37.76, 0.05, n),
    'lng': np.random.normal(-122.42, 0.05, n),
    'value': np.random.randint(1, 100, n)
})
```

## Minimal Export

```python
from keplergl import KeplerGl

map_1 = KeplerGl(data={'points': df})
map_1.save_to_html(file_name='hexbin_map.html', center_map=True)
```

Note: kepler.gl may create a point layer by default. Use a config to specify a hexagon aggregation layer.

## Export with Config

```python
config = {
    'version': 'v1',
    'config': {
        'visState': {
            'layers': [{
                'type': 'hexagon',
                'config': {
                    'dataId': 'points',
                    'label': 'Hexbin Density',
                    'isVisible': True,
                    'columns': {
                        'lat': 'lat',
                        'lng': 'lng'
                    },
                    'visConfig': {
                        'opacity': 0.8,
                        'worldUnitSize': 0.5,
                        'resolution': 8,
                        'coverage': 1,
                        'enable3d': True,
                        'sizeRange': [0, 500],
                        'elevationScale': 5,
                        'colorRange': {
                            'name': 'Global Warming',
                            'type': 'sequential',
                            'category': 'Uber',
                            'colors': ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
                        },
                        'colorAggregation': 'average'
                    }
                },
                'visualChannels': {
                    'colorField': {'name': 'value', 'type': 'integer'},
                    'colorScale': 'quantile',
                    'sizeField': {'name': 'value', 'type': 'integer'},
                    'sizeScale': 'linear'
                }
            }]
        },
        'mapState': {
            'latitude': 37.76,
            'longitude': -122.42,
            'zoom': 12,
            'pitch': 40,
            'bearing': 0,
            'dragRotate': True
        },
        'mapStyle': {
            'styleType': 'dark-matter'
        }
    }
}

map_1 = KeplerGl(data={'points': df}, config=config)
map_1.save_to_html(file_name='hexbin_map_3d.html')
```

## Key Config Fields for Hexbin Layer

| Field | Description |
|-------|-------------|
| `type` | Must be `'hexagon'` |
| `columns.lat` | Latitude column name |
| `columns.lng` | Longitude column name |
| `visConfig.worldUnitSize` | Hexagon bin radius in km |
| `visConfig.coverage` | 0 to 1, fill ratio of each hex |
| `visConfig.enable3d` | Extrude hexagons by aggregated value |
| `visConfig.sizeRange` | `[min, max]` height range for 3D |
| `visConfig.elevationScale` | Height multiplier |
| `visConfig.colorAggregation` | `'average'`, `'sum'`, `'min'`, `'max'`, `'count'` |
| `visualChannels.colorField` | Column to aggregate for color |
| `visualChannels.sizeField` | Column to aggregate for height |
