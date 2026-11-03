# Voronoi Mosaic

Voronoi Mosaic turns point locations into adjoining, irregular cells. Each cell belongs to
the nearest input location in the map's Web Mercator projection. Color cells by a source
attribute to compare stores, stations, sensors, or facilities.

These are nearest-site areas, **not travel-time or routing catchments**. Distances are
measured in the map projection, so this layer is intended for regional exploration rather
than precise geographic distance analysis. It is available in the flat map view.

## Create a mosaic

1. Load a table with numeric latitude and longitude columns. Arrow-backed tables are supported.
2. Add a layer or change a Point layer's type to **Voronoi Mosaic**.
3. Choose the latitude and longitude columns.
4. Under **Fill Color**, choose an attribute and a color palette. Hover over a cell to see
   the original point's values.

## Appearance and bounds

- **Fill Color** controls the cell fill, attribute-based colors, and opacity.
- **Stroke Color** controls outlines and their width in pixels.
- **Cell Bounds → Bounds Padding (%)** extends the dataset's bounding rectangle on each
  side. Padding is measured in the map projection. It clips the otherwise unbounded outer
  cells; it does not change internal nearest-site boundaries.

Cells stay fixed while panning, zooming, or filtering. Filters hide the cells belonging to
excluded rows, leaving gaps; the remaining cells do not expand to occupy them. Drawn polygon
filters select source point locations. Changing the input coordinates or padding rebuilds
the mosaic. Settings are saved with the map.

Missing, nonfinite, and out-of-range coordinates are skipped. Latitude must be within the
Web Mercator range, approximately ±85.05°. Coincident locations share one cell, assigned to
the first row in the dataset. A single point receives a finite display rectangle; a
collinear set also receives a nonzero display extent.

The first version accepts latitude/longitude columns and renders flat cells. It does not
read geometry columns directly or calculate road-network service areas.

[Back to layers](README.md)
