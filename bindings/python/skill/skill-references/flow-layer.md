# Flow Layer

Detailed column requirements and config knobs for the `flow` layer type.
Read this before building a flow map.

The flow layer visualizes origin→destination movement as **aggregated
flows**: it clusters nearby locations at different zoom levels, draws flow
lines with thickness proportional to magnitude, and renders location totals
as circles sized by in/out volume. Use it for migration, commute, trade,
supply-chain, or any O-D dataset.

> **The flow layer is never auto-created.** Unlike point/arc/trip layers,
> it has no field auto-detection — kepler.gl will not create it from
> lat/lng columns alone. If your dataset has origin/destination columns
> and you don't pass an explicit config, kepler.gl creates an *arc* layer
> instead, which looks similar but is not a flow map. Always pass a full
> layer config (below) with `'type': 'flow'`.

## When to use `flow` vs `arc`

| Property                     | `flow`                  | `arc`                |
| ---------------------------- | ----------------------- | -------------------- |
| Aggregates / clusters O-D    | yes                     | no                   |
| Magnitude-proportional lines | yes (via `count`)       | no                   |
| Location totals (circles)    | yes                     | no                   |
| Animated direction lines     | yes (`animated-straight`) | no                 |
| H3 mode                      | yes                     | no                   |
| Per-row coloring             | no (`colorRange` only)  | yes (`targetColor`)  |
| Best for                     | migration, commute, trade, supply chain | simple point-to-point connections |

## Column modes

The flow layer supports two column modes, set via the layer-level
`columnMode` (`'LAT_LNG'` default, `'H3'`).

Columns are assigned explicitly in the layer config — auto-detection does
not apply.

### Lat/Lng mode (`columnMode: 'LAT_LNG'`, default)

| Config column | Required | DataFrame column                |
| ------------- | -------- | ------------------------------- |
| `lat0`        | yes      | origin/source latitude (float)  |
| `lng0`        | yes      | origin/source longitude (float) |
| `lat1`        | yes      | target/dest latitude (float)    |
| `lng1`        | yes      | target/dest longitude (float)   |
| `count`       | no       | flow magnitude (numeric; defaults to 1) |
| `sourceName`  | no       | origin label shown in tooltips and location totals |
| `targetName`  | no       | destination label shown in tooltips and location totals |

When a coordinate is missing in a row, that row's flow line is skipped
(rows render as `NaN` positions otherwise) — filter out nulls in pandas
first with `df.dropna(subset=[...])`.

### H3 mode (`columnMode: 'H3'`)

| Config column | Required | DataFrame column                         |
| ------------- | -------- | ---------------------------------------- |
| `sourceH3`    | yes      | origin H3 index (hex string or integer)  |
| `targetH3`    | yes      | destination H3 index (hex string or integer) |
| `count`, `sourceName`, `targetName` | no | same as Lat/Lng mode |

The H3 column must be the first one listed in the mode's required columns
when both modes could match — pass `columnMode: 'H3'` explicitly for H3
data.

## Worked Example — 10 airports + flights (curved animated flows)

```python
import random
import pandas as pd
from keplergl import KeplerGl

random.seed(42)

airports = []
for i in range(10):
    airports.append({
        'name': f'Airport {i + 1}',
        'iata': f'AP{i + 1:02d}',
        'lat': random.uniform(28.0, 48.0),
        'lng': random.uniform(-122.0, -72.0),
    })

flights = []
for _ in range(18):
    o, d = random.sample(airports, 2)
    flights.append({
        'lat0': o['lat'], 'lng0': o['lng'],
        'lat1': d['lat'], 'lng1': d['lng'],
        'count': random.randint(1, 12),
        'sourceName': o['name'], 'targetName': d['name'],
    })

flight_df = pd.DataFrame(flights)

config = {
    'version': 'v1',
    'config': {
        'visState': {
            'layers': [{
                'type': 'flow',
                'config': {
                    'dataId': 'flights',
                    'label': 'Flight Flows',
                    'isVisible': True,
                    'columnMode': 'LAT_LNG',
                    'columns': {
                        'lat0': 'lat0',
                        'lng0': 'lng0',
                        'lat1': 'lat1',
                        'lng1': 'lng1',
                        'count': 'count',
                        'sourceName': 'sourceName',
                        'targetName': 'targetName'
                    },
                    'visConfig': {
                        'colorRange': {
                            'name': 'Global Warming',
                            'type': 'sequential',
                            'category': 'Uber',
                            'colors': ['#5A1846', '#900C3F', '#C7001B', '#E15A17', '#FFC300']
                        },
                        'opacity': 1.0,
                        'flowLinesRenderingMode': 'animated-straight',
                        'flowLineThicknessScale': 1.0,
                        'flowLineCurviness': 1.0,
                        'flowAdaptiveScalesEnabled': True,
                        'flowFadeEnabled': True,
                        'flowFadeAmount': 50,
                        'flowClusteringEnabled': True,
                        'flowLocationTotalsEnabled': True,
                        'maxTopFlowsDisplayNum': 5000
                    }
                }
            }],
            'interactionConfig': {
                'tooltip': {
                    'enabled': True,
                    'fieldsToShow': {
                        'flights': ['sourceName', 'targetName', 'count']
                    }
                }
            }
        },
        'mapState': {
            'latitude': 38.5,
            'longitude': -97.0,
            'zoom': 3.8,
            'bearing': 0,
            'pitch': 0,
            'dragRotate': False
        },
        'mapStyle': {'styleType': 'dark-matter'}
    }
}

map_1 = KeplerGl(data={'flights': flight_df}, config=config)
map_1.save_to_html(file_name='flight_flow_map.html')
```

## Worked Example — H3 mode

```python
flow_df = pd.DataFrame({
    'sourceH3': ['882a1072e9fffff', ...],
    'targetH3': ['882a1072ffffffff', ...],
    'count': [50, 500],
})

layer = {
    'type': 'flow',
    'config': {
        'dataId': 'flows',
        'label': 'Trade flows (H3)',
        'isVisible': True,
        'columnMode': 'H3',
        'columns': {
            'sourceH3': 'sourceH3',
            'targetH3': 'targetH3',
            'count': 'count'
        },
        'visConfig': {
            'flowLinesRenderingMode': 'animated-straight',
            'flowClusteringEnabled': False,
            'flowLocationTotalsEnabled': True
        }
    }
}
```

## Color

FlowLayer has **no `colorField`/`colorScale` visual channel** — like
`heatmap`, only `visConfig.colorRange` applies at render time. Do not set
`visualChannels` on a flow layer.

For a magnitude palette, pass a full `colorRange` object with explicit
`name`, `type`, `category` and `colors` (as in the worked example) — the
layer maps flow magnitude across that range automatically.

## visConfig knobs

All optional; defaults shown.

| Field                        | Type      | Options / Range     | Default  | Purpose                                       |
| ---------------------------- | --------- | ------------------- | -------- | --------------------------------------------- |
| `flowLinesRenderingMode`     | enum      | `straight` / `curved` / `animated-straight` | `straight` | How flow lines are drawn; `animated-straight` animates direction |
| `flowLineThicknessScale`     | number    | 0.1–5               | 1        | Line thickness multiplier                      |
| `flowLineCurviness`          | number    | 0–2                 | 1        | Arc curvature (only visible with `curved`)     |
| `flowAdaptiveScalesEnabled`  | boolean   | —                   | true     | Auto-adjust widths to zoom + visible data range |
| `flowFadeEnabled`            | boolean   | —                   | true     | Fade smaller flows so larger ones stand out    |
| `flowFadeAmount`             | number    | 0–100               | 50       | Aggressiveness of the fade                     |
| `flowClusteringEnabled`      | boolean   | —                   | true     | Group nearby locations into clusters at low zoom; disable for small pre-aggregated O-D tables |
| `flowLocationTotalsEnabled`  | boolean   | —                   | true     | Show circles at each location sized by total in/out volume |
| `maxTopFlowsDisplayNum`      | number    | 0–10000             | 5000     | Limit rendering to the N largest flows (performance) |
| `darkBaseMapEnabled`         | boolean   | —                   | (base map) | Toggle light/dark background scheme          |

## Pitfalls

- **Getting an arc layer instead of flow** — the flow layer is never
  auto-created (see warning above); pass the full config with
  `'type': 'flow'`.
- **Blank flows** — rows with null coordinates break the accessor; drop
  them in pandas before exporting.
- **Clustered blobs at low zoom** — that's clustering doing its job; zoom
  in, or set `'flowClusteringEnabled': False` for small datasets.
- **Tooltip fields not appearing** — `fieldsToShow` names must match the
  DataFrame columns, and the `dataId` key must match the dataset name.