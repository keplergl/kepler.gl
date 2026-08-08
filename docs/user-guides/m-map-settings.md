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

### Enabling globe view

The globe view option is enabled by default. Application developers can hide the
globe entry in the map view mode control (leaving only Top/3D) by setting
`enableGlobeView: false` in the application configuration:

```js
import KeplerGl from '@kepler.gl/components';
import {initApplicationConfig} from '@kepler.gl/utils';

initApplicationConfig({enableGlobeView: false});
```

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
- Heatmap (see caveat below)

> **Heatmap in globe view.** The heatmap layer is supported in globe view, but
> works differently than on the flat map. Because a heatmap cannot be draped
> directly onto the sphere, the density is computed offscreen for the current
> data/view bounds and projected back onto the globe. As a result the effective
> radius adapts with zoom, and very large `Radius` values or extreme zoom levels
> can look different than on the flat map.

### Unsupported layers

These layers are hidden or disabled in globe view because their geometry does
not project onto the sphere correctly:

- __Flow__ — flow arrows are flat quads in the equatorial plane and collapse to
  nothing when viewed edge-on on the globe.
- __S2__
- __3D Tiles__ (Tile3D)

If a layer is unsupported, kepler.gl will indicate that it is not available in
globe view and keep it hidden until you return to the flat map.

### Globe appearance settings

When globe view is enabled, the __Base map__ side panel shows a set of
globe-specific appearance controls (in addition to the usual base map style
picker). Each row has a visibility toggle, and some rows add a color swatch or a
slider:

- __Atmosphere__ — the glowing halo rendered around the globe. Turning it off
  also hides its sub-settings:
  - __Day/Night (terminator)__ — shades the night side of the globe. The slider
    controls the shading opacity.
  - __Sun azimuth__ — direction of the sun used for the day/night shading. The
    slider sets the angle (0–360°).
- __Base map__ — the reference basemap draped on the sphere. Turning it off also
  hides its sub-layers:
  - __Labels__ — place/road labels, with a color picker.
  - __Admin borders__ — administrative boundary lines, with a color picker.
  - __Water__ — water fill, with a color picker.
- __Surface__ — the color of the globe's land surface.
- __Background__ — the color of the empty space rendered around the globe. This
  color is also used as the background in image and video export.

### Known issues and limitations

- __Basemap breakdown at high zoom.__ At high globe zoom the mapbox vector
  basemap tileset can stop loading and render as empty rectangles. Zoom is capped
  to avoid this. Satellite/raster basemaps generally hold up better at closer
  zoom.
- __Panning/zoom drift at high zoom.__ Near the zoom cap the camera may drift
  while interacting. This is the primary reason for the zoom cap.
- __Zoom-to-cursor behaves differently for zoom-in vs zoom-out.__ Zooming in
  keeps the point under the cursor fixed. Zooming out does not anchor to the
  cursor (exact anchoring is unstable near the globe's edge and tends to drift
  toward the poles); instead it zooms out while gently recentering toward the
  cursor location.
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
