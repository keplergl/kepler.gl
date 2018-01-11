import {ScatterplotLayer} from 'deck.gl';

import scatterplotVertex from './scatterplot-brushing-layer-vertex.glsl';
import isPtInRange from '../../shaderlib/is-point-in-range';
import scatterplotFragment from './scatterplot-brushing-layer-fragment.glsl';

const defaultProps = {
  ...ScatterplotLayer.defaultProps,
  enableBrushing: true,
  // brush radius in meters
  brushRadius: 100000,
  mousePosition: [0, 0],
  outsideBrushRadius: 0
};

export default class ScatterplotBrushingLayer extends ScatterplotLayer {

  getShaders() {
    // get customized shaders
    return {
      vs: isPtInRange + scatterplotVertex,
      fs: scatterplotFragment,
      shaderCache: this.context.shaderCache
    };
  }

  draw({uniforms}) {
    // add uniforms
    super.draw({uniforms: {
      ...uniforms,
      brushRadius: this.props.brushRadius,
      outsideBrushRadius: this.props.outsideBrushRadius,
      mousePos: this.props.mousePosition ?
        new Float32Array(this.unproject(this.props.mousePosition)) : defaultProps.mousePosition,
      enableBrushing: this.props.enableBrushing
    }});
  }
}

ScatterplotBrushingLayer.layerName = 'ScatterplotBrushingLayer';
ScatterplotBrushingLayer.defaultProps = defaultProps;
