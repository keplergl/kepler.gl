// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {CompositeLayer} from '@deck.gl/core';
import {CompositeLayerProps} from '@deck.gl/core/lib/composite-layer';
import {Position, RGBAColor} from 'deck.gl';
import {RGBColor} from '@kepler.gl/types';
import ScatterplotIconLayer from './scatterplot-icon-layer';

// default icon geometry is a square
const DEFAULT_ICON_GEOMETRY = [1, 1, 0, 1, -1, 0, -1, -1, 0, -1, -1, 0, -1, 1, 0, 1, 1, 0];

const defaultProps = {
  getIconGeometry: () => DEFAULT_ICON_GEOMETRY,
  getIcon: (d: {icon: string}) => d.icon
};

export interface SvgIconLayerProps extends CompositeLayerProps<any> {
  getIconGeometry: (i: string) => number[];
  getIcon: (d: {icon: string}) => string;
  getPosition: (d: any) => Position;
  getRadius: ((d: any) => number) | number;
  getFillColor: RGBColor | RGBAColor;
}

export default class SvgIconLayer extends CompositeLayer<any, SvgIconLayerProps> {
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

  _updateAutoHighlight(info) {
    info?.sourceLayer?.updateAutoHighlight(info);
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
