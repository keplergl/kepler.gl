// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Layer, LayersList} from '@deck.gl/core/typed';
import {ClipExtension} from '@deck.gl/extensions/typed';
import {
  MVTLayer as _MVTLayer,
  TileLayer,
  _getURLFromTemplate,
  _TileLoadProps,
  _Tile2DHeader
} from '@deck.gl/geo-layers/typed';

/*
  Custom MVT layer that works with MVTSource and PMTileSource.
  Changes:
    - getTileData: handles props.getTileData.
    - renderSubLayers: removed coordinates logic present in original MVTLayer:renderSubLayers.
    - renderSubLayers: set clipBounds.
    - loaders.gl & older deck.gl: geojson-table: data = data.features
*/

// @ts-expect-error need to patch private methods because of newer loaders.gl
export class MVTLayer<ExtraProps> extends _MVTLayer<ExtraProps> {
  getTileData(tile: _TileLoadProps): any {
    const {getTileData} = this.props;
    const {data} = this.state;

    tile.url =
      typeof data === 'string' || Array.isArray(data) ? _getURLFromTemplate(data, tile) : null;
    if (getTileData) {
      return getTileData(tile);
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

    if (boundingBox) {
      props.clipBounds = [...boundingBox[0], ...boundingBox[1]];
      props.extensions = [...(props.extensions || []), new ClipExtension()];
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
