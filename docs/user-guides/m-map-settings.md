# Map Settings

<!-- TOC -->
  - [Split Maps](#split-maps)
  - [View Maps in 3D](#view-maps-in-3d)
  - [Globe View](#globe-view)
  - [Display Legend](#display-legend)
<!-- /TOC -->


![Map Settings](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/m-map-settings-0.png "Split Maps")

## Split Maps

You can display a side-by-side comparison of the same map area with different layers with the Split Map functionality.

![Split Maps](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image36.png "Split Maps")

1. Enable this by clicking the Split Map icon in the top right corner of your map:

![Split Maps Icon](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/m-map-settings-split.png "Split Maps Icon")

2. Toggle the layers visible in each map with the layer icon in the top right corner of each map.

![Split Maps Icon](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/m-map-settings-layer.png "Split Maps Icon")

![Toggle Layers](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image35.png "Toggle Layers")

3. Zoom in and out on each map and the other will automatically mimic.


## View Maps in 3D
View your map in 3D by clicking the 3D icon in the top right corner of your map

![View Maps in 3D](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/m-map-settings-3d.png "View Maps in 3D")

- __drag__:  pan
- __cmd + drag__ (mac) or __ctrl + drag__ (win): rotate

![Map in 3D](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/f-map-styles-7.png "Map in 3D")


## Globe View

Switch from the flat (web-mercator) map to a 3D globe projection to view your
data wrapped onto a sphere. Toggle Globe view from the map view mode control in
the top right corner of the map.

- __drag__: rotate the globe
- __scroll / pinch__: zoom in and out

Globe view is well suited to global-scale datasets and flows, and to
presentation-style maps. It is built on deck.gl's globe projection and is still
evolving, so a number of layers and interactions behave differently than in the
flat map.

### Camera and zoom constraints

To keep the basemap and interactions coherent, globe view applies a few
constraints that do not exist in the flat map:

- __Zoom range is limited__ (roughly zoom `2`–`12`). You can pull the globe
  further back than the flat map so the whole planet fits on screen, but
  __zooming in past zoom level `12` is currently disabled.__ This cap is in place
  because, past that level in the current deck.gl 9.x globe projection, the
  vector basemap tileset (Mapbox Streets vector tiles) stops loading and renders
  as empty rectangles, and the camera becomes unstable — it drifts while panning
  and zooming, and zoom-to-cursor becomes inaccurate. Capping the zoom keeps the
  basemap and interactions coherent until the underlying tile/controller issue is
  resolved upstream. Satellite/raster basemaps hold up better at closer zoom, so
  the cap may be relaxed as globe support matures.
- __The camera can't be centered on the poles.__ The center latitude is
  constrained to a band around the equator (about ±75°) so you can't stare
  straight down at a pole.
- __Reset bearing/pitch__ recenters the view toward the equator.

### Supported layers

The following layers render correctly in globe view:

- Point
- Arc
- Line
- Grid
- Hexbin (Hexagon)
- H3 (Hexagon ID)
- Cluster
- Icon
- GeoJSON / Polygon
- 3D / Point (elevation)
- Trip
- Vector Tile
- Raster Tile
- Hex Tile

### Unsupported layers

These layers are hidden or disabled in globe view because their geometry does
not project onto the sphere correctly:

- __Heatmap__ — the density is rendered into a flat screen-aligned quad, which
  cannot be draped onto the sphere.
- __Flow__ — flow arrows are flat quads in the equatorial plane and collapse to
  nothing when viewed edge-on on the globe.
- __S2__
- __3D Tiles__ (Tile3D)

If a layer is unsupported, kepler.gl will indicate that it is not available in
globe view and keep it hidden until you return to the flat map.

### Known issues and limitations

- __Basemap breakdown at high zoom.__ At high globe zoom the mapbox vector
  basemap tileset can stop loading and render as empty rectangles. Zoom is capped
  to avoid this. Satellite/raster basemaps generally hold up better at closer
  zoom.
- __Panning/zoom drift at high zoom.__ Near the zoom cap the camera may drift
  while interacting. This is the primary reason for the zoom cap.
- __Zoom-to-cursor is approximate.__ When continuously zooming from far out to
  close in, the final center can be shifted from the point originally under the
  cursor.
- __Arcs and lines on the far side.__ Depending on depth handling, geometry on
  the back of the globe may be partially visible through the sphere.
- __Basemap differences.__ Mapbox and MapLibre basemaps can look different in
  globe mode; some basemap styles are better tuned for the sphere than others.

> **Combining globe with swipe, video export, and effects:** Globe view,
> [swipe/split comparison](#split-maps), [video export](./k-save-and-export.md#export-video),
> and post-processing [effects](./effects.md) each work on their own, but their
> combinations (for example globe + swipe + video recording with effects active
> at the same time) have **limited support** and may not render or export
> exactly as expected. When you hit an issue, try disabling one of the features
> (e.g. turn off effects, exit swipe mode, or switch back to the flat map)
> before recording. Support for these combinations is expected to improve as
> globe support matures.

These limitations stem from the underlying deck.gl globe projection and are
expected to improve as that support matures.


## Display Legend
Display a legend for visible layers on the map.

![Display Legend](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/m-map-settings-legend.png "Display Legend")

![Sample Legend](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image14.png "Sample Legend")

[Back to table of contents](README.md)
