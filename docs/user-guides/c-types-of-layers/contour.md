# Contour layer (prototype)

The Contour layer draws smooth, nested regions and outlines from point observations.
Select a numeric weight column to contour the mean weight in each geographic cell.
Leave the weight column empty to contour point density (the number of points per cell,
not points per square kilometer). The layer does not calculate travel time.

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
loads an abstract scalar field around Frankfurt with nested fills and outlines.
Use `?sample=contour-scattered` for scattered measurements of the same field.
It is synthetic data, not a travel-time map. The generator is in
`examples/demo-app/src/data/sample-contour-data.ts`.

## Input

Select **Contour** in the layer selector, then choose a column mode:

- **Points**: assign numeric longitude and latitude columns, and optionally a numeric weight column.
- **GeoJSON**: assign a geometry column and an optional numeric weight column. Each row produces
  one sample at the geometry's representative point, using the same centroid helper
  as Grid, Hexbin, and Heatmap. Points use their coordinates; lines, polygons, multi-
  geometries, and geometry collections use the average of their vertices (including
  closing ring vertices). This is not an area-weighted polygon centroid and can lie
  outside a concave feature. GeoJSON geometry/Feature objects and JSON strings are
  accepted. Missing, empty, or malformed geometries are skipped. Polygon boundaries do
  not clip the resulting contours.

All points use the same aggregation; there is no regular-grid/scattered-points choice.
Points are assigned to the nearest cell center on a grid anchored at the westernmost
longitude and northernmost latitude. Cell size is derived from the valid retained samples'
bounds and the selected maximum axis resolution, correcting longitude spacing at the region's central latitude. The longer
axis uses the selected number of cells; the shorter axis scales proportionally. Coincident
points use a 2×2 grid with one-meter spacing because they have no geographic extent.

- **With weights**: each occupied cell contains the arithmetic mean of its finite numeric
  weights. Null/nonfinite weights are skipped, including in the mean's denominator.
  Zero and negative weights are valid. If all weights are missing, no contours are drawn.
- **Without weights**: every valid point contributes one count, including repeated
  coordinates. Clearing the weight selection switches to this density calculation.
- **Empty cells**: contain zero and participate in smoothing. This can pull weighted values
  toward zero in sparse areas. Smoothing zero displays the unsmoothed cell means or counts.

Numeric and polygon filters select observations before aggregation. GeoJSON rows use
representative points as described above. Filters affect only their selected layers,
including when layers share a dataset. Removing points changes cell means/counts and may
change the grid's extent and alignment. Polygon filters do not clip the generated contours;
smoothing can extend into cells with no retained observations. Inverting, disabling, or
clearing a filter follows the same behavior as other layers.

Existing contour maps retain their selected value column as the weight and retain their
style settings. They use the new cell aggregation, so contour geometry and automatic levels
can change. Saved Input type, Interpolation resolution, and kilometer Cell size settings
no longer affect the surface; maps without Grid resolution use the default of 64 cells.

## Controls

- **Weight**: select a numeric column for cell averages, or leave empty for point counts.
  The tooltip beside the label explains both choices.
- **Color by level**: enabled by default with the first blue/teal-to-red palette,
  **Uber Viz Diverging**. Choose a standard or custom palette, including reversed palettes,
  or turn it off to use a plain color. Colors run from the
  lowest to highest generated contour value, independent of the saved fill direction. Palette stops
  are interpolated to the number of levels, so each level has its own sampled color.
  Both fills and outlines use these colors; translucent nested fills blend where
  they overlap. Switching modes preserves both the plain color and selected palette.
- **Grid resolution**: 32–256 cells along the longer geographic axis
  (default 64). Cell size adapts to the data bounds, so small datasets also use the
  selected resolution. Higher resolution gives smaller cells; lower resolution combines
  more observations. Each axis is capped at 256 cells. Changing the dataset extent or
  filtering boundary points changes physical cell size and can change means/counts.
- **Smoothing**: Gaussian standard deviation in grid cells; zero preserves the cell means
  or counts. Smoothing changes values, not just the visual outline. Empty cells contribute
  zero. The default is 3 cells.
- **3D surface**: drape the existing fills and outlines over that same smoothed grid.
  Contour boundaries, levels, colors, legends, and tooltip values are shared with 2D.
  Tilt the map to see the relief. Fill and Outline remain independently configurable.
  Surface fills use slope normals and the scene's lighting; palette colors remain
  the base colors, while outlines and the legend retain their original colors.
  This is off by default, including when opening maps saved without this setting.
- **Elevation multiplier**: scales only the surface height. At 1×, the smoothed
  minimum-to-maximum range spans 10% of the grid's longest geographic dimension,
  with its minimum at ground level. This works for signed weights and point counts;
  it does not interpret values as meters. Zero flattens the surface. The chosen
  multiplier is retained when switching back to 2D and when saving the map.
- **Number of levels**: 2–20 equally spaced thresholds. Automatic levels exclude the
  field's extrema to avoid outlining the entire rectangular extent. Numerically
  constant surfaces are omitted; roundoff from smoothing or interpolation does not
  create automatic levels.
- **Custom level range**: minimum and maximum thresholds, inclusive, in the original
  value units, selected with a two-handle range slider and read-only endpoint labels.
  Slider bounds use the exact finite minimum and maximum of the selected value
  column across the dataset and refresh when the dataset or column changes. In density
  mode the bounds come from the current unsmoothed cell counts. Nulls and nonfinite
  weights are ignored; empty or constant ranges cannot supply a slider range.
  Enabling custom levels initializes both handles to the column bounds. When data
  changes, thresholds are kept within the new bounds; a disjoint selection resets
  to the full range. There is no manual-input fallback. These controls choose levels;
  they do not normalize or clamp the data.
- **Fill / outline**: enable independently. Each translucent filled region overlaps
  the larger regions below it, so opacity builds toward nested interiors. Outlines
  are rendered afterward, with brighter lines for inner regions. Fill opacity ranges
  from 0 to 1, with a default of 0.3.

New contours fill regions where value ≥ threshold, enclosing peaks in weights or point
counts. There is no Invert control. Existing maps retain their explicitly saved fill direction.

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

This version supports regional 2D data and aggregation grids of up to 65,536 cells.
It does not support globe mode, antimeridian-crossing data, routing, or dedicated contour
export. Geometry is calculated on the CPU when data or contour settings change.
Color, opacity, camera movement, and outline width do not regenerate it.
Smoothing is specified in cells, so its physical footprint depends on cell size.
