# Arc / Line Map

Show connections between origin and destination points. Arc layers render 3D arcs; line layers render flat lines.

## Data

A pandas DataFrame with origin and destination latitude/longitude columns.

```python
import pandas as pd

df = pd.DataFrame({
    'origin_lat': [37.7749, 40.7128, 41.8781],
    'origin_lng': [-122.4194, -74.0060, -87.6298],
    'dest_lat': [34.0522, 37.7749, 40.7128],
    'dest_lng': [-118.2437, -122.4194, -74.0060],
    'origin_city': ['San Francisco', 'New York', 'Chicago'],
    'dest_city': ['Los Angeles', 'San Francisco', 'New York'],
    'flights': [150, 200, 180]
})
```

## Minimal Export

```python
from keplergl import KeplerGl

map_1 = KeplerGl(data={'routes': df})
map_1.save_to_html(file_name='arc_map.html', center_map=True)
```

## Arc Layer with Config

```python
config = {
    'version': 'v1',
    'config': {
        'visState': {
            'layers': [{
                'type': 'arc',
                'config': {
                    'dataId': 'routes',
                    'label': 'Flight Routes',
                    'isVisible': True,
                    'columns': {
                        'lat0': 'origin_lat',
                        'lng0': 'origin_lng',
                        'lat1': 'dest_lat',
                        'lng1': 'dest_lng'
                    },
                    'visConfig': {
                        'opacity': 0.8,
                        'thickness': 2,
                        'targetColor': [255, 203, 153]
                    },
                    'color': [18, 147, 154]
                },
                'visualChannels': {
                    'sizeField': {'name': 'flights', 'type': 'integer'},
                    'sizeScale': 'linear'
                }
            }],
            'interactionConfig': {
                'tooltip': {
                    'enabled': True,
                    'fieldsToShow': {
                        'routes': ['origin_city', 'dest_city', 'flights']
                    }
                }
            }
        },
        'mapState': {
            'latitude': 38.0,
            'longitude': -97.0,
            'zoom': 4,
            'pitch': 30,
            'bearing': 0,
            'dragRotate': True
        },
        'mapStyle': {
            'styleType': 'dark-matter'
        }
    }
}

map_1 = KeplerGl(data={'routes': df}, config=config)
map_1.save_to_html(file_name='arc_map_styled.html')
```

## Line Layer (Flat)

Replace `'type': 'arc'` with `'type': 'line'` in the config. The columns are the same.

```python
config['config']['visState']['layers'][0]['type'] = 'line'
```

## Key Config Fields

| Field | Description |
|-------|-------------|
| `type` | `'arc'` for 3D arcs, `'line'` for flat lines |
| `columns.lat0` / `columns.lng0` | Origin latitude/longitude column |
| `columns.lat1` / `columns.lng1` | Destination latitude/longitude column |
| `visConfig.thickness` | Line width |
| `visConfig.targetColor` | RGB array for destination end color |
| `color` | RGB array for origin end color |
| `visualChannels.sizeField` | Column to map to line thickness |
