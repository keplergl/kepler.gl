import {GridLayer} from 'deck.gl';
import {getColorValueDomain, getColorScaleFunction} from '../layer-utils/utils';
import EnhancedGridCellLayer from './enhanced-grid-cell-layer';

const defaultProps = {
  ...GridLayer.defaultProps,
  colorScale: 'quantile'
};

export default class EnhancedGridLayer extends GridLayer {
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
    return EnhancedGridCellLayer;
  }
}

EnhancedGridLayer.layerName = 'EnhancedGridLayer';
EnhancedGridLayer.defaultProps = defaultProps;
