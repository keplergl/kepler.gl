// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Globe mode layer adjustments ported from studio-monorepo.
//
// The following globe-specific adjustments from studio-monorepo are NOT ported
// because they are not applicable or feasible in deck.gl 9.x:
//
// 1. Grid cell offset inversion (UnfoldedGridCellLayer):
//    Studio-monorepo inverted the grid cell offset in globe mode to correct positioning.
//    This was specific to deck.gl 8.x's GridCellLayer rendering pipeline. In deck.gl 9.x,
//    the GridLayer uses a different GPU-based aggregation approach and the offset bug
//    does not manifest.
//
// 2. Hex tile highPrecision flag:
//    Studio-monorepo forced `highPrecision: true` for H3 hexagons at low resolutions
//    in globe mode. Kepler.gl doesn't have hex-tile layers in the same form.
//
// 3. MVT clipBounds disabled in globe mode:
//    Studio-monorepo's custom MVT layer skipped clipBounds/ClipExtension in globe mode.
//    Deck.gl 9.x's MVTLayer handles globe projection natively without this workaround.
//
// Ported adjustments:
// - Text/Label rendering with back-face culling: MVTLabelLayer renders place labels via a
//   TextLayer whose glyph sublayer is EnhancedMultiIconLayer, which degenerates glyph
//   vertices on the far side of the globe (dot(surfaceNormal, toCamera) < 0.1) so labels
//   don't show through the planet. Implemented as a GLSL inject rather than the deck.gl
//   8.x per-vertex hook studio relied on.

export {AtmosphereLayerRealistic, AtmosphereSkyLayerRealistic, getGlobeAtmosphereLayer, getGlobeAtmosphereSkyLayer} from './atmosphere-layer';
export {GlobeDepthDiskLayer, getGlobeDepthDiskLayer} from './globe-depth-disk-layer';
export {getGlobeBaseLayers, getGlobeTopLayers, getGlobeClearColor, DEFAULT_BASEMAP_COLOR, getBasemapColors, getBasemapColorsForStyle} from './globe-layers';
export {MVTLabelLayer} from './mvt-label-layer';
export {default as EnhancedMultiIconLayer} from './enhanced-multi-icon-layer';
export {KeplerGlobeView} from './globe-view';
