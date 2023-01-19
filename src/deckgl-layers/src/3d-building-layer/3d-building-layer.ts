// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
          getTileData(this.props.mapboxApiUrl, this.props.mapboxApiAccessToken, tile.index),
        minZoom: 13,
        renderSubLayers: this.renderSubLayers.bind(this),
        updateTriggers: this.props.updateTriggers
      })
    ];
  }
}
