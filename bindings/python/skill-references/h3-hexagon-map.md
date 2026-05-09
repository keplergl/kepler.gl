# H3 Hexagon Map

Visualize data using [H3 spatial index](https://h3geo.org/) hexagons. Each row has an H3 hex ID and associated values.

## Data

A pandas DataFrame with a column containing H3 hex ID strings and value columns.

```python
import pandas as pd

df = pd.DataFrame({
    'hex_id': [
        '89283082c2fffff', '8928308288fffff', '89283082c07ffff',
        '89283082817ffff', '89283082c3bffff', '89283082883ffff'
    ],
    'value': [64, 73, 65, 74, 66, 50]
})
```

## Minimal Export

```python
from keplergl import KeplerGl

map_1 = KeplerGl(data={'hex_data': df})
map_1.save_to_html(file_name='h3_map.html', center_map=True)
```

kepler.gl auto-detects H3 hex ID columns and creates a hexagonId layer.

## Export with Config (Colored + 3D Extruded)

```python
config = {
    'version': 'v1',
    'config': {
        'visState': {
            'layers': [{
                'type': 'hexagonId',
                'config': {
                    'dataId': 'hex_data',
                    'label': 'H3 Hexagons',
                    'isVisible': True,
                    'columns': {
                        'hex_id': 'hex_id'
                    },
                    'visConfig': {
                        'opacity': 0.8,
                        'coverage': 1,
                        'enable3d': True,
                        'sizeRange': [0, 500],
                        'elevationScale': 5,
                        'colorRange': {
                            'name': 'Sunrise 8',
                            'type': 'sequential',
                            'category': 'Uber',
                            'colors': [
                                '#194266', '#355C7D', '#63617F', '#916681',
                                '#C06C84', '#D28389', '#E59A8F', '#F8B195'
                            ],
                            'reversed': False
                        }
                    }
                },
                'visualChannels': {
                    'colorField': {'name': 'value', 'type': 'integer'},
                    'colorScale': 'quantize',
                    'sizeField': {'name': 'value', 'type': 'integer'},
                    'sizeScale': 'linear',
                    'coverageField': None,
                    'coverageScale': 'linear'
                }
            }],
            'interactionConfig': {
                'tooltip': {
                    'enabled': True,
                    'fieldsToShow': {
                        'hex_data': ['hex_id', 'value']
                    }
                }
            }
        },
        'mapState': {
            'latitude': 37.76,
            'longitude': -122.43,
            'zoom': 12,
            'bearing': 2.6,
            'pitch': 37.4,
            'dragRotate': True
        },
        'mapStyle': {
            'styleType': 'dark-matter'
        }
    }
}

map_1 = KeplerGl(data={'hex_data': df}, config=config)
map_1.save_to_html(file_name='h3_map_3d.html')
```

## Key Config Fields for H3 Layer

| Field | Description |
|-------|-------------|
| `type` | Must be `'hexagonId'` |
| `columns.hex_id` | Column name containing H3 hex ID strings |
| `visConfig.coverage` | 0 to 1, how much of hex cell is filled |
| `visConfig.enable3d` | Extrude hexagons by value |
| `visConfig.sizeRange` | `[min, max]` height range for 3D |
| `visConfig.elevationScale` | Height multiplier |
| `visualChannels.colorField` | Column to map to color |
| `visualChannels.sizeField` | Column to map to extrusion height |
