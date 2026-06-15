// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Globe mode layer adjustments ported from studio-monorepo.
//
// The following globe-specific adjustments from studio-monorepo are NOT ported
// because they are not applicable or feasible in deck.gl 9.x:
//
// 1. Text/Label back-face culling (EnhancedMultiIconLayer):
//    Studio-monorepo used a custom MultiIconLayer subclass that degenerates vertices
//    on the back side of the globe (dot(posDir, cameraDir) < 0.1). In kepler.gl we use
//    deck.gl's built-in TextLayer which doesn't expose per-vertex shader hooks needed
//    for this. Labels will still render but may be visible through the globe.
//    TODO: Implement via a custom TextLayer subclass if this becomes a UX issue.
//
// 2. Grid cell offset inversion (UnfoldedGridCellLayer):
//    Studio-monorepo inverted the grid cell offset in globe mode to correct positioning.
//    This was specific to deck.gl 8.x's GridCellLayer rendering pipeline. In deck.gl 9.x,
//    the GridLayer uses a different GPU-based aggregation approach and the offset bug
//    does not manifest.
//
// 3. Hex tile highPrecision flag:
//    Studio-monorepo forced `highPrecision: true` for H3 hexagons at low resolutions
//    in globe mode. Kepler.gl doesn't have hex-tile layers in the same form.
//
// 4. MVT clipBounds disabled in globe mode:
//    Studio-monorepo's custom MVT layer skipped clipBounds/ClipExtension in globe mode.
//    Deck.gl 9.x's MVTLayer handles globe projection natively without this workaround.

export {AtmosphereLayerRealistic, AtmosphereSkyLayerRealistic, getGlobeAtmosphereLayer, getGlobeAtmosphereSkyLayer} from './atmosphere-layer';
export {GlobeDepthDiskLayer, getGlobeDepthDiskLayer} from './globe-depth-disk-layer';
export {getGlobeBaseLayers, getGlobeTopLayers, getGlobeClearColor, DEFAULT_BASEMAP_COLOR, getBasemapColors, getBasemapColorsForStyle} from './globe-layers';
export {KeplerGlobeView} from './globe-view';
