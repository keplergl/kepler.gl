// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import GL from '@luma.gl/constants';
import {CompositeLayer} from '@deck.gl/core/typed';
import {TileLayer as DeckGLTileLayer} from '@deck.gl/geo-layers/typed';
import {SolidPolygonLayer, SolidPolygonLayerProps} from '@deck.gl/layers/typed';

import {getTileData} from './3d-building-utils';
import {ThreeDBuildingLayerProps, TileDataItem, TileLoadProps} from './types';

export default class ThreeDBuildingLayer extends CompositeLayer<ThreeDBuildingLayerProps> {
  // this layer add its subLayers to the redux store, and push sample data

  renderSubLayers(props: SolidPolygonLayerProps<any>) {
    return new SolidPolygonLayer<TileDataItem>({
      ...props,
      parameters: {
        blendFunc: [GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA, GL.ONE, GL.ONE_MINUS_SRC_ALPHA],
        blendEquation: [GL.FUNC_ADD, GL.FUNC_ADD]
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
