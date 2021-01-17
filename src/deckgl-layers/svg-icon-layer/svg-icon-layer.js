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
import ScatterplotIconLayer from './scatterplot-icon-layer';

// default icon geometry is a square
const DEFAULT_ICON_GEOMETRY = [1, 1, 0, 1, -1, 0, -1, -1, 0, -1, -1, 0, -1, 1, 0, 1, 1, 0];

const defaultProps = {
  getIconGeometry: iconId => DEFAULT_ICON_GEOMETRY,
  getIcon: d => d.icon
};

export default class SvgIconLayer extends CompositeLayer {
  // Must be defined
  initializeState() {
    this.state = {
      data: {}
    };
  }

  updateState({changeFlags}) {
    if (changeFlags.dataChanged) {
      this._extractSublayers();
    }
  }

  _extractSublayers() {
    const {data, getIconGeometry, getIcon} = this.props;

    const iconLayers = {};
    for (let i = 0; i < data.length; i++) {
      const iconId = getIcon(data[i]);
      iconLayers[iconId] = iconLayers[iconId] || {
        id: iconId,
        geometry: getIconGeometry(iconId) || DEFAULT_ICON_GEOMETRY,
        data: []
      };
      iconLayers[iconId].data.push(data[i]);
    }
    this.setState({
      data: Object.values(iconLayers)
    });
  }

  renderLayers() {
    const layerId = this.props.id;

    const layers =
      this.state.data &&
      this.state.data.length &&
      this.state.data.map(
        ({id, data, geometry}) =>
          new ScatterplotIconLayer({
            ...this.props,
            id: `${layerId}-${id}`,
            data,
            iconGeometry: geometry
          })
      );

    return layers && layers.length > 0 ? layers : null;
  }
}

SvgIconLayer.layerName = 'SvgIconLayer';
SvgIconLayer.defaultProps = defaultProps;
