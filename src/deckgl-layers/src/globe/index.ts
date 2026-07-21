// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Globe mode layer adjustments ported from studio-monorepo.
//
// The following globe-specific adjustments from studio-monorepo are NOT ported
// because they are not applicable or feasible in deck.gl 9.x:
//
// 1. Hex tile highPrecision flag:
//    Studio-monorepo forced `highPrecision: true` for H3 hexagons at low resolutions
//    in globe mode. Kepler.gl doesn't have hex-tile layers in the same form.
//
// 2. MVT clipBounds disabled in globe mode:
//    Studio-monorepo's custom MVT layer skipped clipBounds/ClipExtension in globe mode.
//    Deck.gl 9.x's MVTLayer handles globe projection natively without this workaround.
//
// Ported adjustments:
// - Grid / Hexagon aggregation cells on the globe: deck.gl 9.x's GridCellLayer /
//   HexagonCellLayer position cells in flat mercator common space and draw them with
//   project_common_position_to_clipspace, which leaves them on the XY plane through the
//   globe center rather than on its surface. ScaleEnhancedGridLayer /
//   ScaleEnhancedHexagonLayer swap in a globe-aware cell subclass (see
//   layer-utils/globe-cell-utils) that remaps each cell vertex from common space back to
//   lng/lat and onto the sphere (equivalent to studio-monorepo's UnfoldedGridCellLayer
//   globe offset handling, adapted to deck.gl 9.x's aggregation pipeline).
// - Text/Label rendering with back-face culling: MVTLabelLayer renders place labels via a
//   TextLayer whose glyph sublayer is EnhancedMultiIconLayer, which degenerates glyph
//   vertices on the far side of the globe (dot(surfaceNormal, toCamera) < 0.1) so labels
//   don't show through the planet. Implemented as a GLSL inject rather than the deck.gl
//   8.x per-vertex hook studio relied on.

export {
  AtmosphereLayerRealistic,
  AtmosphereSkyLayerRealistic,
  getGlobeAtmosphereLayer,
  getGlobeAtmosphereSkyLayer
} from './atmosphere-layer';
export {GlobeDepthDiskLayer, getGlobeDepthDiskLayer} from './globe-depth-disk-layer';
export {
  getGlobeBaseLayers,
  getGlobeTopLayers,
  getGlobeClearColor,
  getGlobeBasemapAttributions,
  resolveGlobeBasemapProvider,
  DEFAULT_BASEMAP_COLOR,
  getBasemapColors,
  getBasemapColorsForStyle
} from './globe-layers';
export type {GlobeBasemapProvider, GlobeAttribution} from './globe-layers';
export {MVTLabelLayer} from './mvt-label-layer';
export {default as EnhancedMultiIconLayer} from './enhanced-multi-icon-layer';
export {KeplerGlobeView} from './globe-view';
