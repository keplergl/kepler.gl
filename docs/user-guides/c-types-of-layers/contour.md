# Contour layer (prototype)

The Contour layer draws smooth, nested regions and outlines from a numeric scalar field.
Values can represent any quantity; the layer does not calculate travel time or point density.

## Try the sample

Start the demo app with `yarn start` and append `?sample=contour` to its URL. The sample
loads an abstract scalar field around Frankfurt with turquoise fills and outlines.
Use `?sample=contour-scattered` for scattered measurements of the same field.
It is synthetic data, not a travel-time map. The generator is in
`examples/demo-app/src/data/sample-contour-data.ts`.

## Input

Select **Contour** in the layer selector, then choose a column mode:

- **Scalar samples**: assign numeric longitude, latitude, and value columns.
- **GeoJSON**: assign a geometry column and a numeric value column. Each row produces
  one sample at the geometry's representative point, using the same centroid helper
  as Grid, Hexbin, and Heatmap. Points use their coordinates; lines, polygons, multi-
  geometries, and geometry collections use the average of their vertices (including
  closing ring vertices). This is not an area-weighted polygon centroid and can lie
  outside a concave feature. GeoJSON geometry/Feature objects and JSON strings are
  accepted. Missing, empty, or malformed geometries are skipped. The selected value
  column supplies the scalar; polygon boundaries do not clip the resulting contours.

Duplicate measurements at the same position are averaged; values remain in their
original units. Both column modes use the following surface settings:

- **Auto** (default): preserves supported regular grids, including missing cells. If
  the coordinates cannot form a supported grid, it interpolates scattered points.
  Quantized scattered coordinates can resemble an incomplete grid; choose
  **Scattered points** explicitly when those gaps should be interpolated.
- **Regular grid**: requires regularly spaced coordinates with at least two distinct
  coordinates per axis. Positions describe sample centers. Blank/nonfinite values,
  filtered-out samples, and missing cells remain holes, even after smoothing. A
  completely absent row or column can be inferred when other samples establish spacing.
- **Scattered points**: requires at least three distinct, non-collinear samples with
  finite values. Linear interpolation over Delaunay triangles creates a regular
  surface before smoothing and contour generation. It uses a regional projection
  with longitude scaled at the samples' central latitude. Cells outside the convex
  hull of valid samples stay empty. Null/nonfinite values and filtered-out samples
  are omitted; interpolation can bridge gaps between remaining points inside the hull.
  Filtering boundary points can therefore shrink the surface. No distance cutoff,
  barrier, or uncertainty model is applied across large unsampled gaps.

## Controls

- **Input type**: Auto, Regular grid, or Scattered points, as described above.
- **Interpolation resolution**: 32–256 samples along the longer projected axis
  (default 192). Higher resolution gives finer contour geometry, not more measured
  detail. Applies only when interpolating; regular grids keep their native resolution.
- **Smoothing**: Gaussian standard deviation in grid cells; zero preserves the input.
  Smoothing changes the scalar field, so use it deliberately for measured quantities.
- **Number of levels**: 2–20 equally spaced thresholds. Automatic levels exclude the
  field's extrema to avoid outlining the entire rectangular extent.
- **Custom level range**: minimum and maximum thresholds, inclusive, in the original
  value units. These controls choose levels; they do not normalize or clamp the data.
- **Fill below each level**: regions where value ≤ threshold. Turn off for value ≥ threshold.
- **Fill / outline**: enable independently. Each translucent filled region overlaps
  the larger regions below it, so opacity builds toward nested interiors. Outlines
  are rendered afterward, with brighter lines for inner regions.

Contours keep the same geographic shape and thresholds while panning or zooming.
Hover shows the value threshold. Settings are saved with the map.

The legend lists each generated contour level in ascending value order, with its
numeric threshold and ≤ or ≥ direction. The swatches use the outline
shades when outlines are enabled, or the accumulated opacity of nested fills in
fill-only mode. Each level occupies its own row, with the swatch beside its value.
Long labels show their full value on hover. The legend updates after
filtering, smoothing, or level changes and clears when no contours are generated.

## Prototype limits

This version supports regional 2D data, native grids up to 512 samples per axis, and
scattered-point interpolation onto grids up to 256 samples per axis. It does not support
globe mode, antimeridian-crossing data, routing, or dedicated contour export.
Geometry is calculated on the CPU when data or contour
settings change. Color, opacity, camera movement, and outline width do not regenerate it.
Smoothing is specified in cells, so its physical footprint depends on grid spacing or
interpolation resolution. The convex-hull boundary is approximated at grid resolution.
