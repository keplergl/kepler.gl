# Contour layer (prototype)

The Contour layer draws smooth, nested regions and outlines from a numeric scalar field.
Values can represent any quantity; the layer does not calculate travel time or point density.

## Layer availability

Contour is enabled in layer type pickers by default. To hide it, set the application
config flag before mounting the map:

```js
import {initApplicationConfig} from '@kepler.gl/utils';

initApplicationConfig({enableContourLayer: false});
```

The demo app also accepts `applicationConfig.enableContourLayer` in its runtime
`config.json`. Setting the flag to `false` hides Contour from the picker; existing
Contour layers in saved maps still load and render, as with other optional layer types.

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

Polygon filters select source samples before smoothing and contour generation. Scalar
samples use their longitude/latitude; GeoJSON rows use the representative points described
above. Filters affect only their selected layers, including when layers share a dataset.
Regular grids retain rejected samples as holes; scattered inputs interpolate only retained
samples. Polygon filters do not clip the generated contours, so interpolation may bridge
excluded areas within the remaining samples' convex hull. Inverting, disabling, or clearing
the filter follows the same behavior as other layers.

## Controls

- **Color by level**: off uses the plain color (the default). Turn on to choose a
  standard or custom palette, including reversed palettes. Colors run from the
  lowest to highest generated contour value, independent of Invert. Palette stops
  are interpolated to the number of levels, so each level has its own sampled color.
  Both fills and outlines use these colors; translucent nested fills blend where
  they overlap. Switching modes preserves both the plain color and selected palette.
- **Input type**: Auto, Regular grid, or Scattered points, as described above.
- **Interpolation resolution**: 32–256 samples along the longer projected axis
  (default 192). Higher resolution gives finer contour geometry, not more measured
  detail. Applies only when interpolating; regular grids keep their native resolution.
- **Smoothing**: Gaussian standard deviation in grid cells; zero preserves the input.
  Smoothing changes the scalar field, so use it deliberately for measured quantities.
- **Number of levels**: 2–20 equally spaced thresholds. Automatic levels exclude the
  field's extrema to avoid outlining the entire rectangular extent. Numerically
  constant surfaces are omitted; roundoff from smoothing or interpolation does not
  create automatic levels.
- **Custom level range**: minimum and maximum thresholds, inclusive, in the original
  value units, selected with a two-handle range slider and read-only endpoint labels.
  Slider bounds use the exact finite minimum and maximum of the selected value
  column across the dataset and refresh when the dataset or column changes. Nulls
  and nonfinite values are ignored; empty or constant columns cannot supply a slider range.
  Enabling custom levels initializes both handles to the column bounds. When data
  changes, thresholds are kept within the new bounds; a disjoint selection resets
  to the full range. There is no manual-input fallback. These controls choose levels;
  they do not normalize or clamp the data.
- **Invert**: off fills regions where value ≤ threshold (the default). Turn on to
  fill regions where value ≥ threshold. Existing maps keep their saved direction.
- **Fill / outline**: enable independently. Each translucent filled region overlaps
  the larger regions below it, so opacity builds toward nested interiors. Outlines
  are rendered afterward, with brighter lines for inner regions.

Contours keep the same geographic shape and thresholds while panning or zooming.
Hover shows the value threshold. Settings are saved with the map.

The legend lists each generated contour level in ascending value order, with its
numeric threshold and ≤ or ≥ direction. The swatches use the outline
shades when outlines are enabled, or the blended color and accumulated opacity of
nested fills in fill-only mode. Each level occupies its own row, with the swatch beside its value.
The level list scrolls within a 156px height by default; the arrow beside the value
field expands or contracts this channel independently. The list, rows, and label
editor are shared with point legends. Click a label to edit it; its reset control
appears on hover or keyboard focus after editing and restores the default threshold.
Custom labels are saved
with the map and follow the value field, threshold, and ≤/≥ direction when colors
or levels change. Exports show the full list without editing controls.
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
