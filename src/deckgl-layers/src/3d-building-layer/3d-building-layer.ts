// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck - This file needs significant refactoring for deck.gl 9.x APIs
// TODO: Update layer patterns for deck.gl 9.x

import {CompositeLayer} from '@deck.gl/core';
import type {CompositeLayerProps} from '@deck.gl/core';
import {TileLayer as DeckGLTileLayer} from '@deck.gl/geo-layers';
import {SolidPolygonLayer, SolidPolygonLayerProps} from '@deck.gl/layers';

import {getTileData} from './3d-building-utils';
import {ThreeDBuildingLayerProps, TileDataItem, TileLoadProps} from './types';

type ThreeDBuildingLayerPropsWithDefaults = ThreeDBuildingLayerProps & CompositeLayerProps;

export default class ThreeDBuildingLayer extends CompositeLayer<ThreeDBuildingLayerPropsWithDefaults> {
  // this layer add its subLayers to the redux store, and push sample data

  renderSubLayers(props: SolidPolygonLayerProps<any>) {
    const layerProps = this.props as ThreeDBuildingLayerPropsWithDefaults;
    return new SolidPolygonLayer<TileDataItem>({
      ...props,
      parameters: {
        blendColorSrcFactor: 'src-alpha',
        blendColorDstFactor: 'one-minus-src-alpha',
        blendAlphaSrcFactor: 'one',
        blendAlphaDstFactor: 'one-minus-src-alpha'
      },
      extruded: true,
      opacity: 1,
      filled: true,
      getElevation: (feature: TileDataItem) => feature.properties.height || 0,
      getPolygon: (feature: TileDataItem) => feature.coordinates,
      getFillColor: layerProps.threeDBuildingColor
    });
  }

  renderLayers() {
    const layerProps = this.props as ThreeDBuildingLayerPropsWithDefaults;
    return [
      new DeckGLTileLayer({
        id: `${this.id}-deck-3d-building` as string,
        getTileData: (tile: TileLoadProps) =>
          getTileData(layerProps.mapboxApiUrl, layerProps.mapboxApiAccessToken, tile),
        minZoom: 13,
        renderSubLayers: this.renderSubLayers.bind(this),
        updateTriggers: layerProps.updateTriggers
      })
    ];
  }
}
