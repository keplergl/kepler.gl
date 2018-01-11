import {HexagonLayer} from 'deck.gl';
import {pointToHexbin} from './hexagon-aggregator';

import {
  getColorValueDomain,
  getColorScaleFunction
} from '../layer-utils/utils';
import EnhancedHexagonCellLayer from './enhanced-hexagon-cell-layer';

const defaultProps = {
  ...HexagonLayer.defaultProps,
  hexagonAggregator: pointToHexbin,
  colorScale: 'quantile'
};

export default class EnhancedHexagonLayer extends HexagonLayer {
  getDimensionUpdaters() {

    const dimensionUpdaters = super.getDimensionUpdaters();
    // add colorScale to dimension updates
    dimensionUpdaters.getColor[1].triggers.push('colorScale');
    return dimensionUpdaters;
  }

  /*
   * override default layer method to calculate color domain
   * and scale function base on color scale type
   */
  getColorValueDomain() {
    getColorValueDomain(this);
  }

  getColorScale() {
    getColorScaleFunction(this);
  }

  /*
   * override default getSubLayerClass to return customized cellLayer
   */
  getSubLayerClass() {
    return EnhancedHexagonCellLayer;
  }
}

EnhancedHexagonLayer.layerName = 'EnhancedHexagonLayer';
EnhancedHexagonLayer.defaultProps = defaultProps;
