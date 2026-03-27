// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {CompositeLayer} from '@deck.gl/core';
import {TileLayer as DeckGLTileLayer} from '@deck.gl/geo-layers';
import {SolidPolygonLayer, SolidPolygonLayerProps} from '@deck.gl/layers';

import {getTileData} from './3d-building-utils';
import {ThreeDBuildingLayerProps, TileDataItem, TileLoadProps} from './types';

export default class ThreeDBuildingLayer extends CompositeLayer<ThreeDBuildingLayerProps> {
  // this layer add its subLayers to the redux store, and push sample data

  renderSubLayers(props: SolidPolygonLayerProps<any>) {
    return new SolidPolygonLayer<TileDataItem>({
      ...props,
      parameters: {
        blendColorSrcFactor: 'src-alpha',
        blendColorDstFactor: 'one-minus-src-alpha',
        blendAlphaSrcFactor: 'one',
        blendAlphaDstFactor: 'one-minus-src-alpha',
        blendColorOperation: 'add',
        blendAlphaOperation: 'add'
      },
      extruded: true,
      opacity: 1,
      filled: true,
      getElevation: (feature: TileDataItem) => feature.properties.height || 0,
      getPolygon: (feature: TileDataItem) => feature.coordinates,
      getFillColor: this.props.threeDBuildingColor
    });
  }

  renderLayers() {
    return [
      new DeckGLTileLayer({
        id: `${this.id}-deck-3d-building` as string,
        getTileData: (tile: TileLoadProps) =>
          getTileData(this.props.mapboxApiUrl, this.props.mapboxApiAccessToken, tile),
        minZoom: 13,
        renderSubLayers: this.renderSubLayers.bind(this),
        updateTriggers: this.props.updateTriggers
      })
    ];
  }
}
