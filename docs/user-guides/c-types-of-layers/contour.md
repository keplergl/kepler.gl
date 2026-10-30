# Contour layer (prototype)

The Contour layer draws smooth, nested regions and outlines from a numeric scalar field.
Values can represent any quantity; the layer does not calculate travel time or point density.

## Try the sample

Start the demo app with `yarn start` and append `?sample=contour` to its URL. The sample
loads an abstract scalar field around Frankfurt with turquoise fills and outlines.
It is synthetic data, not a travel-time map. The generator is in
`examples/demo-app/src/data/sample-contour-data.ts`.

## Input

Supply a table with numeric longitude, latitude, and value columns, and select **Contour**
in the layer selector. Assign all three columns. Samples must lie on a regularly spaced
longitude/latitude grid, with at least two distinct coordinates on each axis. Grid
coordinates describe sample centers. Duplicate measurements at a cell are averaged.

Blank/nonfinite values and filtered-out samples remain holes. Missing grid cells are
not filled by interpolation. A completely absent row or column can be inferred when
other adjacent samples establish the spacing. Do not use scattered points without
first interpolating them onto a regular grid.

## Controls

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

## Prototype limits

This version supports regional 2D grids up to 512 samples per axis. It does not support
globe mode, antimeridian-crossing grids, routing, irregular-point interpolation, or
dedicated contour export. Geometry is calculated on the CPU when data or contour
settings change. Color, opacity, camera movement, and outline width do not regenerate it.
Smoothing is specified in cells, so its physical footprint depends on grid spacing.
