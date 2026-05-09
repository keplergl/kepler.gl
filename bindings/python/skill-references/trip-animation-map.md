# Trip Animation Map

Animate movement along paths over time. Trip layers render GeoJSON LineString geometries with timestamps to create animated visualizations.

## Data

Trip data must be GeoJSON with `LineString` or `MultiLineString` geometry where each coordinate has a timestamp. The timestamp is provided as a fourth value in each coordinate `[lng, lat, altitude, timestamp]` or via a properties field.

```python
trip_geojson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "vendor": "A",
                "trip_id": 1
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [-122.4194, 37.7749, 0, 1564184363],
                    [-122.4180, 37.7760, 0, 1564184400],
                    [-122.4160, 37.7770, 0, 1564184440],
                    [-122.4140, 37.7780, 0, 1564184480],
                    [-122.4120, 37.7790, 0, 1564184520]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vendor": "B",
                "trip_id": 2
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [-122.4100, 37.7800, 0, 1564184363],
                    [-122.4120, 37.7810, 0, 1564184400],
                    [-122.4140, 37.7820, 0, 1564184440],
                    [-122.4160, 37.7830, 0, 1564184480]
                ]
            }
        }
    ]
}
```

Timestamps are Unix epoch seconds (or milliseconds). The coordinates format is `[longitude, latitude, altitude, timestamp]`.

## Minimal Export

```python
from keplergl import KeplerGl

map_1 = KeplerGl(data={'trips': trip_geojson})
map_1.save_to_html(file_name='trip_map.html', center_map=True)
```

## Export with Config

```python
config = {
    'version': 'v1',
    'config': {
        'visState': {
            'layers': [{
                'type': 'trip',
                'config': {
                    'dataId': 'trips',
                    'label': 'Vehicle Trips',
                    'isVisible': True,
                    'columns': {
                        'geojson': '_geojson'
                    },
                    'color': [18, 147, 154],
                    'visConfig': {
                        'opacity': 0.8,
                        'thickness': 3,
                        'trailLength': 180,
                        'colorRange': {
                            'name': 'Global Warming',
                            'type': 'sequential',
                            'category': 'Uber',
                            'colors': ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
                        }
                    }
                },
                'visualChannels': {
                    'colorField': {'name': 'vendor', 'type': 'string'},
                    'colorScale': 'ordinal'
                }
            }],
            'animationConfig': {
                'currentTime': None,
                'speed': 1
            }
        },
        'mapState': {
            'latitude': 37.78,
            'longitude': -122.42,
            'zoom': 13
        },
        'mapStyle': {
            'styleType': 'dark-matter'
        }
    }
}

map_1 = KeplerGl(data={'trips': trip_geojson}, config=config)
map_1.save_to_html(file_name='trip_map_styled.html')
```

## Key Config Fields for Trip Layer

| Field | Description |
|-------|-------------|
| `type` | Must be `'trip'` |
| `columns.geojson` | Must be `'_geojson'` for GeoJSON data |
| `visConfig.trailLength` | Trail length in seconds |
| `visConfig.thickness` | Line width |
| `animationConfig.speed` | Playback speed multiplier |
| `visualChannels.colorField` | Property to map to color |

## Notes

- The animation will auto-play when the HTML is opened in a browser.
- `trailLength` controls how many seconds of trail are visible behind the moving point.
- Coordinates must include timestamps as the 4th value: `[lng, lat, alt, timestamp]`.
