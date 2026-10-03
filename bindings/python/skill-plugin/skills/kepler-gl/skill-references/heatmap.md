# Heatmap

Density heatmap visualization from point data. Points are aggregated into a continuous density surface.

## Data

A pandas DataFrame with latitude and longitude columns. Optionally a weight column.

```python
import pandas as pd
import numpy as np

np.random.seed(42)
n = 1000
df = pd.DataFrame({
    'lat': np.random.normal(37.76, 0.02, n),
    'lng': np.random.normal(-122.42, 0.02, n),
    'magnitude': np.random.uniform(1, 10, n)
})
```

## Minimal Export

```python
from keplergl import KeplerGl

map_1 = KeplerGl(data={'events': df})
map_1.save_to_html(file_name='heatmap.html', center_map=True)
```

Note: kepler.gl will auto-detect lat/lng columns but may create a point layer by default. Use a config to force a heatmap layer.

## Export with Heatmap Config

```python
config = {
    'version': 'v1',
    'config': {
        'visState': {
            'layers': [{
                'type': 'heatmap',
                'config': {
                    'dataId': 'events',
                    'label': 'Event Density',
                    'isVisible': True,
                    'columns': {
                        'lat': 'lat',
                        'lng': 'lng'
                    },
                    'visConfig': {
                        'opacity': 0.8,
                        'radius': 20,
                        'intensity': 1,
                        'colorRange': {
                            'name': 'Global Warming',
                            'type': 'sequential',
                            'category': 'Uber',
                            'colors': ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
                        }
                    }
                },
                'visualChannels': {
                    'weightField': {'name': 'magnitude', 'type': 'real'},
                    'weightScale': 'linear'
                }
            }]
        },
        'mapState': {
            'latitude': 37.76,
            'longitude': -122.42,
            'zoom': 13
        },
        'mapStyle': {
            'styleType': 'dark-matter'
        }
    }
}

map_1 = KeplerGl(data={'events': df}, config=config)
map_1.save_to_html(file_name='heatmap_styled.html')
```

## Key Config Fields for Heatmap Layer

| Field | Description |
|-------|-------------|
| `type` | Must be `'heatmap'` |
| `columns.lat` | Latitude column name |
| `columns.lng` | Longitude column name |
| `visConfig.radius` | Influence radius of each point |
| `visConfig.intensity` | Heat intensity multiplier |
| `visConfig.opacity` | 0.0 to 1.0 |
| `visualChannels.weightField` | Column to use as weight (optional) |
