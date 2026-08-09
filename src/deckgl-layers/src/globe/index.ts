// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Globe mode layer adjustments.
//
// Globe-specific adjustments handled here:
// - Grid / Hexagon aggregation cells on the globe: deck.gl 9.x's GridCellLayer /
//   HexagonCellLayer position cells in flat mercator common space and draw them with
//   project_common_position_to_clipspace, which leaves them on the XY plane through the
//   globe center rather than on its surface. ScaleEnhancedGridLayer /
//   ScaleEnhancedHexagonLayer swap in a globe-aware cell subclass (see
//   layer-utils/globe-cell-utils) that remaps each cell vertex from common space back to
//   lng/lat and onto the sphere.
// - Text/Label rendering with back-face culling: MVTLabelLayer renders place labels via a
//   TextLayer whose glyph sublayer is EnhancedMultiIconLayer, which degenerates glyph
//   vertices on the far side of the globe (dot(surfaceNormal, toCamera) < 0.1) so labels
//   don't show through the planet. Implemented as a GLSL inject.

export {
  AtmosphereLayerRealistic,
  AtmosphereSkyLayerRealistic,
  AtmosphereHugeHaloLayer,
  getGlobeAtmosphereLayer,
  getGlobeAtmosphereSkyLayer,
  getGlobeHugeHaloLayer
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
export {getStarsBackgroundImage} from './globe-stars-layer';
