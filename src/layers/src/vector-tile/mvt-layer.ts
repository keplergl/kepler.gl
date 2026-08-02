// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Layer, LayersList, LayerExtension} from '@deck.gl/core';
import {ClipExtension} from '@deck.gl/extensions';
import {
  MVTLayer as _MVTLayer,
  TileLayer,
  // @ts-expect-error deck.gl 9 internal
  _getURLFromTemplate,
  // @ts-expect-error deck.gl 9 internal
  _TileLoadProps,
  _Tile2DHeader
} from '@deck.gl/geo-layers';
import {incrementVectorTileLoading, decrementVectorTileLoading} from './loading-counter';

/*
  Custom MVT layer that works with MVTSource and PMTileSource.
  Changes:
    - getTileData: handles props.getTileData.
    - renderSubLayers: removed coordinates logic present in original MVTLayer:renderSubLayers.
    - renderSubLayers: set clipBounds.
    - loaders.gl & older deck.gl: geojson-table: data = data.features
*/

/**
 * Globe-safe rectangular clip.
 *
 * deck.gl's stock `ClipExtension` clips polygon fragments against a min/max box in
 * the layer's *common space*. On a globe viewport, common space is the 3D sphere
 * (projectPosition returns x/y/z on the sphere and the extension only keeps x/y), so
 * a flat rectangle no longer matches the curved tile boundary and slices diagonally
 * through the geometry (visible as diagonal stripes).
 *
 * This extension instead clips against the *world position* (lng/lat), which is the
 * same space the tile `clipBounds` are expressed in. Longitude/latitude are viewport
 * independent, so tile edges are trimmed correctly on the globe (and would match flat
 * too). We only use it in globe mode; 2D keeps the stock ClipExtension.
 */
const globeClipShaderFunction = /* glsl */ `
layout(std140) uniform globeClipUniforms {
  vec4 bounds;
} globeClip;

bool globeClip_isInBounds(vec2 lngLat) {
  return lngLat.x >= globeClip.bounds[0] && lngLat.y >= globeClip.bounds[1] &&
         lngLat.x < globeClip.bounds[2] && lngLat.y < globeClip.bounds[3];
}
`;

const globeClipShaderModule = {
  name: 'globeClip',
  vs: globeClipShaderFunction,
  fs: globeClipShaderFunction,
  uniformTypes: {
    bounds: 'vec4<f32>'
  }
};

const globeClipInjection = {
  'vs:#decl': /* glsl */ `
out vec2 globeClip_worldPosition;
`,
  'vs:DECKGL_FILTER_GL_POSITION': /* glsl */ `
  globeClip_worldPosition = geometry.worldPosition.xy;
`,
  'fs:#decl': /* glsl */ `
in vec2 globeClip_worldPosition;
`,
  'fs:DECKGL_FILTER_COLOR': /* glsl */ `
  if (!globeClip_isInBounds(globeClip_worldPosition)) discard;
`
};

export class GlobeClipExtension extends LayerExtension {
  static extensionName = 'GlobeClipExtension';

  // Declaring `clipBounds` here is required so that when this extension is attached to
  // a CompositeLayer (GeoJsonLayer), LayerExtension.getSubLayerProps forwards
  // `clipBounds` down to the primitive sublayers (SolidPolygonLayer/PathLayer) where
  // the shader + draw() actually run. Without this the uniform stays [0,0,0,0].
  static defaultProps = {
    clipBounds: [0, 0, 1, 1]
  };

  getShaders(): any {
    return {
      modules: [globeClipShaderModule],
      inject: globeClipInjection
    };
  }

  draw(this: any): void {
    const {clipBounds} = this.props as {clipBounds?: number[]};
    if (!clipBounds) {
      return;
    }
    // clipBounds are [minLng, minLat, maxLng, maxLat] (tile boundingBox in lng/lat).
    this.setShaderModuleProps({globeClip: {bounds: clipBounds}});
  }
}

// @ts-expect-error need to patch private methods because of newer loaders.gl
export class MVTLayer<ExtraProps> extends _MVTLayer<ExtraProps> {
  static layerName = 'MVTLayer';

  async getTileData(tile: _TileLoadProps): Promise<any> {
    const {getTileData} = this.props;
    const {data} = this.state;

    tile.url =
      typeof data === 'string' || Array.isArray(data) ? _getURLFromTemplate(data, tile) : null;
    if (getTileData) {
      incrementVectorTileLoading();
      try {
        return await getTileData(tile);
      } finally {
        decrementVectorTileLoading();
      }
    }
    return null;
  }

  renderSubLayers(
    props: TileLayer['props'] & {
      id: string;
      data: any;
      _offset: number;
      tile: any;
      clipBounds?: number[];
    }
  ): Layer | null | LayersList {
    const {boundingBox} = props.tile;

    props.autoHighlight = true;

    // The globe viewport is identified by having a `resolution` (set by GlobeViewport).
    const isGlobeMode = Boolean((this.context.viewport as any)?.resolution);

    if (boundingBox) {
      props.clipBounds = [...boundingBox[0], ...boundingBox[1]];
      // In globe mode the stock ClipExtension clips in common (sphere) space, which
      // slices diagonally through geometry. Use the lng/lat-based GlobeClipExtension
      // so tile edges are trimmed correctly (prevents doubled/overlapping geometry at
      // tile seams). In 2D keep the stock ClipExtension.
      props.extensions = [
        ...(props.extensions || []),
        isGlobeMode ? new GlobeClipExtension() : new ClipExtension()
      ];
    }

    return this.props.renderSubLayers(props);
  }

  getHighlightedObjectIndex(tile: _Tile2DHeader): number {
    const {hoveredFeatureId, hoveredFeatureLayerName} = this.state;
    const {uniqueIdProperty, highlightedFeatureId} = this.props;
    let data = tile.content;
    data = data?.shape === 'geojson-table' ? data.features : data;

    const isHighlighted = isFeatureIdDefined(highlightedFeatureId);
    const isFeatureIdPresent = isFeatureIdDefined(hoveredFeatureId) || isHighlighted;

    if (!isFeatureIdPresent) {
      return -1;
    }

    const featureIdToHighlight = isHighlighted ? highlightedFeatureId : hoveredFeatureId;

    // Iterable data
    if (Array.isArray(data)) {
      return data.findIndex(feature => {
        const isMatchingId = getFeatureUniqueId(feature, uniqueIdProperty) === featureIdToHighlight;
        const isMatchingLayer =
          isHighlighted || getFeatureLayerName(feature) === hoveredFeatureLayerName;
        return isMatchingId && isMatchingLayer;
      });
    }

    return -1;
  }
}

function getFeatureUniqueId(feature, uniqueIdProperty: string | undefined) {
  if (feature.properties && uniqueIdProperty) {
    return feature.properties[uniqueIdProperty];
  }

  if ('id' in feature) {
    return feature.id;
  }

  return undefined;
}

function getFeatureLayerName(feature): string | null {
  return feature.properties?.layerName || null;
}

function isFeatureIdDefined(value: unknown): boolean {
  return value !== undefined && value !== null && value !== '';
}
