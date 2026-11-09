# Contour Map

Use `type: 'contour'`. Set `config.columns.lat`/`lng` for point coordinates,
or `geojson` for representative geometry points; optional `value` names the
weight field. Without weights cells count points; with weights they average
finite values. Zero and negative weights are valid.

Set `config.visConfig` options such as `gridResolution` (32–256), `levels`
(2–20), `smoothing`, `colorByLevel`, `filled`, `stroked`, and `fillOpacity`.
Custom thresholds use `customRange`, `minimum`, and `maximum` in the data's
units. Smoothing affects values as well as outlines.

Use regional 2D data: globe and antimeridian-crossing contours are unsupported.
Filters select samples before aggregation; polygon filters do not clip contour
boundaries. Contours are not travel-time isochrones.
