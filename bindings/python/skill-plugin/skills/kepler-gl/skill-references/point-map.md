# Point Map

Scatter plot of locations using latitude/longitude columns from a DataFrame.

## Data

A pandas DataFrame with numeric latitude and longitude columns.

```python
import pandas as pd

df = pd.DataFrame({
    'name': ['San Francisco', 'Los Angeles', 'New York', 'Chicago', 'Houston'],
    'lat': [37.7749, 34.0522, 40.7128, 41.8781, 29.7604],
    'lng': [-122.4194, -118.2437, -74.0060, -87.6298, -95.3698],
    'population': [884363, 3979576, 8336817, 2693976, 2320268],
    'category': ['West', 'West', 'East', 'Midwest', 'South']
})
```

## Minimal Export (auto-detected layers)

```python
from keplergl import KeplerGl

map_1 = KeplerGl(data={'cities': df})
map_1.save_to_html(file_name='point_map.html', center_map=True)
```

## Export with Config

```python
config = {
    'version': 'v1',
    'config': {
        'visState': {
            'layers': [{
                'type': 'point',
                'config': {
                    'dataId': 'cities',
                    'label': 'City Locations',
                    'isVisible': True,
                    'columns': {
                        'lat': 'lat',
                        'lng': 'lng',
                        'altitude': None
                    },
                    'visConfig': {
                        'radius': 20,
                        'opacity': 0.8,
                        'filled': True,
                        'colorRange': {
                            'name': 'Global Warming',
                            'type': 'sequential',
                            'category': 'Uber',
                            'colors': ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
                        }
                    }
                },
                'visualChannels': {
                    'colorField': {'name': 'population', 'type': 'integer'},
                    'colorScale': 'quantile',
                    'sizeField': {'name': 'population', 'type': 'integer'},
                    'sizeScale': 'sqrt'
                }
            }],
            'interactionConfig': {
                'tooltip': {
                    'enabled': True,
                    'fieldsToShow': {
                        'cities': ['name', 'population', 'category']
                    }
                }
            }
        },
        'mapState': {
            'latitude': 38.0,
            'longitude': -97.0,
            'zoom': 4
        },
        'mapStyle': {
            'styleType': 'dark-matter'
        }
    }
}

map_1 = KeplerGl(data={'cities': df}, config=config)
map_1.save_to_html(file_name='point_map_styled.html')
```

## Key Config Fields for Point Layer

| Field | Description |
|-------|-------------|
| `columns.lat` | Column name for latitude |
| `columns.lng` | Column name for longitude |
| `visConfig.radius` | Point radius in pixels |
| `visConfig.opacity` | 0.0 to 1.0 |
| `visConfig.filled` | Whether points are filled |
| `visualChannels.colorField` | Column to map to color |
| `visualChannels.sizeField` | Column to map to point size |
| `visualChannels.colorScale` | Common options: `'quantile'`, `'quantize'`, `'ordinal'` (and `'custom'` for color channels in supported contexts) |
