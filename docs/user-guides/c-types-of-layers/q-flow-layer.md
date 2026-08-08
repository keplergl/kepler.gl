# Flow Layer (experimental)

Flow layers visualize movement between locations as aggregated origin-destination flows. They are useful for displaying migration patterns, commute data, trade routes, supply chains, and any dataset that represents movement between geographic points.

The layer automatically clusters nearby locations at different zoom levels, draws flow lines proportional to magnitude, and renders location totals as circles sized by incoming/outgoing volume.

Flow layers are powered by [flowmap.gl](https://github.com/FlowmapBlue/flowmap.gl).

## Enabling the layer

The flow layer is experimental and enabled by default. You can disable the layer by setting `enableFlowLayer: false` in the application configuration:

```js
import KeplerGl from '@kepler.gl/components';
import {initApplicationConfig} from '@kepler.gl/utils';

initApplicationConfig({enableFlowLayer: false});
```

## Data format

Your dataset must contain origin and destination coordinates for each flow. The layer supports two column modes:

### Lat/Lng mode

Requires four columns for source and target coordinates:

| Column       | Required | Description                    |
| ------------ | -------- | ------------------------------ |
| source lat   | Yes      | Latitude of the origin         |
| source lng   | Yes      | Longitude of the origin        |
| target lat   | Yes      | Latitude of the destination    |
| target lng   | Yes      | Longitude of the destination   |
| count        | No       | Flow magnitude (defaults to 1) |
| source name  | No       | Label for the origin location  |
| target name  | No       | Label for the destination      |

### H3 mode

Uses H3 hexagonal indices instead of explicit coordinates:

| Column    | Required | Description                           |
| --------- | -------- | ------------------------------------- |
| source H3 | Yes      | H3 index of the origin hexagon        |
| target H3 | Yes      | H3 index of the destination hexagon   |
| count     | No       | Flow magnitude (defaults to 1)        |
| source name | No     | Label for the origin location         |
| target name | No     | Label for the destination             |

### Sample CSV (Lat/Lng)

```csv
source_lat,source_lng,target_lat,target_lng,count,source_name,target_name
37.7749,-122.4194,34.0522,-118.2437,150,San Francisco,Los Angeles
34.0522,-118.2437,37.7749,-122.4194,90,Los Angeles,San Francisco
37.7749,-122.4194,47.6062,-122.3321,200,San Francisco,Seattle
47.6062,-122.3321,34.0522,-118.2437,75,Seattle,Los Angeles
```

## Layer attributes

- **Color Range** — color scheme applied to flows based on magnitude.

- **Opacity** — overall layer opacity.

- **Line Style** — controls how flow lines are rendered. Options:
  - *Straight* (default) — simple straight lines between origin and destination.
  - *Curved* — renders flows as curved arcs.
  - *Animated* — animates flow lines to show direction of movement.

- **Line Thickness** — scales the width of all flow lines (0.1–5×).

- **Curviness** — controls the arc curvature of curved flow lines (0–2). Only visible when Line Style is set to Curved.

- **Adaptive Scales** — automatically adjusts flow line widths relative to the current zoom level and visible data range.

- **Fade** — reduces visual prominence of smaller flows. The fade amount slider (0–100) controls how aggressively minor flows are dimmed.

- **Clustering** — groups nearby locations into clusters at lower zoom levels and expands them as you zoom in.

- **Location Totals** — shows circles at each location sized by total incoming and outgoing flow volume.

- **Max Top Flows** — limits the number of rendered flow lines to the N largest flows (up to 10,000) for performance.

- **Dark Base Map** — toggles the color scheme between light and dark map backgrounds.

## Tooltips

Hovering over a **location** shows:
- Location name
- Incoming count
- Outgoing count
- Internal count

Hovering over a **flow line** shows:
- Origin name
- Destination name
- Flow count

[Back to layer overview](./README.md)
