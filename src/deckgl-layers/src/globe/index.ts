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
// - Text/Label rendering with back-face culling: globe labels (both the MVTLabelLayer
//   basemap place names and user layer text labels) render through a TextLayer whose
//   glyph and background sublayers are EnhancedMultiIconLayer / EnhancedTextBackgroundLayer.
//   Those degenerate vertices anchored beyond the sphere horizon so labels on the far side
//   don't show through the planet. Implemented as a GLSL inject, see globe-backface-cull.

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
export {default as EnhancedTextBackgroundLayer} from './enhanced-text-background-layer';
export {injectGlobeBackfaceCull} from './globe-backface-cull';
export {KeplerGlobeView} from './globe-view';
export {getStarsBackgroundImage, drawStarsBackground} from './globe-stars-layer';
