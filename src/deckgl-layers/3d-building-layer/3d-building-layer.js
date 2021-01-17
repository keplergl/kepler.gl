// Copyright (c) 2021 Uber Technologies, Inc.
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

import {CompositeLayer} from '@deck.gl/core';
import {TileLayer as DeckGLTileLayer} from '@deck.gl/geo-layers';
import {getTileData} from './3d-building-utils';
import {SolidPolygonLayer} from '@deck.gl/layers';

export default class ThreeDBuildingLayer extends CompositeLayer {
  // this layer add its subLayers to the redux store, and push sample data

  renderSubLayers(props) {
    return new SolidPolygonLayer({
      ...props,
      parameter: {
        blendFunc: ['SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA', 'ONE', 'ONE_MINUS_SRC_ALPHA'],
        blendEquation: ['FUNC_ADD', 'FUNC_ADD']
      },
      extruded: true,
      opacity: 1,
      filled: true,
      getElevation: feature => feature.properties.height || 0,
      getPolygon: feature => feature.coordinates,
      getFillColor: this.props.threeDBuildingColor
    });
  }

  renderLayers() {
    return [
      new DeckGLTileLayer({
        getTileData: args =>
          getTileData(this.props.mapboxApiUrl, this.props.mapboxApiAccessToken, args),
        minZoom: 13,
        renderSubLayers: this.renderSubLayers.bind(this),
        updateTriggers: this.props.updateTriggers
      })
    ];
  }
}
