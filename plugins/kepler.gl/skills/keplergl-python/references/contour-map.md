# Contour Map

Use saved layer `type: 'contour'` with a compatible JavaScript renderer.

Select **Contour** in the layer picker. Choose numeric latitude/longitude
columns, or GeoJSON representative points, then optionally select **Weight**.
With a weight, occupied cells contain the mean of finite values; without it,
they contain point counts. Null/nonfinite weights are skipped; zero and
negative weights are valid. Empty cells contain zero and affect smoothing.

For saved config, point columns are `config.columns.lat`, `lng`, and optional
`value` (the Weight field). In GeoJSON mode use `geojson`. Layer appearance
lives in `config.visConfig`: `gridResolution` (32–256, default 64), `smoothing`
(default 3 grid cells), `levels` (2–20), `colorByLevel`, `filled`, `stroked`,
and `fillOpacity`. A custom threshold range uses `customRange`, `minimum`, and
`maximum`. Use thresholds in the data's units; smoothing changes values as
well as outlines.

Contours show scalar levels or point density, not travel-time isochrones.
Filters select samples before aggregation; polygons do not clip contour
boundaries. Use regional 2D data: globe and antimeridian-crossing data are not
supported. `enableContourLayer` controls picker visibility and defaults to
true. It does not disable rendering saved contour layers.

Before exporting, check that the JavaScript bundle supports this layer; see
the export-version guidance in [the Python skill](../SKILL.md).
