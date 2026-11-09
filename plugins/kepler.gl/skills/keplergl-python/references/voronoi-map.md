# Voronoi Mosaic

Use `type: 'voronoi'` with `config.columns.lat`/`lng` or `geojson` (geometry
centroids). Color by source attributes; `config.visConfig.boundsPadding`
controls outer padding as a percentage.

Cells represent nearest sites in Web Mercator, not road travel time; use
regional flat-map data. Filters rebuild cells from retained sites while outer
bounds remain tied to the full dataset and padding. Coincident sites share a
cell assigned to the first retained row.
