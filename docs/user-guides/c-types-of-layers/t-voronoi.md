# Voronoi Mosaic

Voronoi Mosaic turns point locations into adjoining, irregular cells. Each cell belongs to
the nearest input location in the map's Web Mercator projection. Color cells by a source
attribute to compare stores, stations, sensors, or facilities.

These are nearest-site areas, **not travel-time or routing catchments**. Distances are
measured in the map projection, so this layer is intended for regional exploration rather
than precise geographic distance analysis. It is available in the flat map view.

## Create a mosaic

1. Load a table with numeric latitude and longitude columns, or a GeoJSON geometry column.
   Arrow-backed tables are supported.
2. Add a layer or change a Point layer's type to **Voronoi Mosaic**.
3. Choose **Point Columns** and select latitude/longitude, or choose **GeoJSON Centroids**
   and select the geometry column. Each geometry produces one site: its point coordinate
   or the average of its vertices, using the same centroid calculation as the Heatmap layer.
4. Under **Fill Color**, choose an attribute and a color palette. Hover over a cell to see
   the original point's values.

## Appearance and bounds

- **Fill Color** controls the cell fill, attribute-based colors, and opacity.
- **Stroke Color** controls outlines and their width in pixels.
- **Cell Bounds → Bounds Padding (%)** extends the dataset's bounding rectangle on each
  side. Padding is measured in the map projection. It clips the otherwise unbounded outer
  cells; it does not change internal nearest-site boundaries.

Cells stay fixed while panning and zooming. Filters rebuild the mosaic from the remaining
points, allowing their cells to expand into the areas of excluded points. This includes
numeric and time filters, as well as drawn polygon filters that select source point
locations (centroids in GeoJSON mode). The outer clipping rectangle stays tied to all
source sites in the full dataset and its padding.
An empty selection draws no cells; clearing filters restores the original mosaic.
Changing the input coordinates or padding also rebuilds the mosaic. Settings are saved
with the map.

Missing, nonfinite, and out-of-range coordinates are skipped. Latitude must be within the
Web Mercator range, approximately ±85.05°. Coincident locations share one cell, assigned to
the first remaining row in the dataset. A single input point receives a finite display rectangle; a
collinear set also receives a nonzero display extent.

The layer renders flat cells and does not calculate road-network service areas.

## Application configuration

Voronoi Mosaic is enabled by default. Applications embedding kepler.gl can hide it
from layer type pickers with:

```js
import {initApplicationConfig} from '@kepler.gl/utils';

initApplicationConfig({enableVoronoiLayer: false});
```

Existing Voronoi layers in saved maps remain available for rendering and configuration.

[Back to layers](README.md)
