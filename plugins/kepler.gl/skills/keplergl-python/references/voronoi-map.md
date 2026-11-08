# Voronoi Mosaic

Use saved layer `type: 'voronoi'` with a compatible JavaScript renderer.

Choose **Voronoi Mosaic**, then **Point Columns** (latitude/longitude) or
**GeoJSON Centroids** (geometry). Color by a source attribute and adjust
**Cell Bounds → Bounds Padding (%)**. Each cell belongs to the nearest input
site in Web Mercator, not the nearest site by road travel time. Use the flat
map for regional exploration.

Filters rebuild cells from the retained sites, while the outer bounds remain
tied to the full dataset and padding. Coincident sites share a cell assigned
to the first retained row; invalid coordinates are skipped. In saved configs,
use `lat`/`lng` or `geojson` columns and `visConfig.boundsPadding`.
`enableVoronoiLayer` defaults to true and controls picker visibility.

Before exporting, check that the JavaScript bundle supports this layer; see
the export-version guidance in [the Python skill](../SKILL.md).
