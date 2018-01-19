import {LineLayer} from 'deck.gl';
import {GL} from 'luma.gl';

import isPicked from '../../shaderlib/is-picked';
import isPtInRange from '../../shaderlib/is-point-in-range';
import getExtrusion from '../../shaderlib/get-extrusion-offset.glsl';
import vs from './line-brushing-layer-vertex.glsl';
import vs64 from './line-brushing-layer-vertex-64.glsl';

const defaultProps = {
  ...LineLayer.defaultProps,
  // show arc if source is in brush
  brushSource: true,
  // show arc if target is in brush
  brushTarget: true,
  enableBrushing: true,
  getStrokeWidth: d => d.strokeWidth,
  getTargetColor: x => x.color || [0, 0, 0, 255],

  // brush radius in meters
  brushRadius: 100000,
  pickedColor: [254, 210, 26, 255],
  mousePosition: [0, 0]
};

export default class LineBrushingLayer extends LineLayer {
  getShaders() {
    const shaders = super.getShaders();
    const addons = getExtrusion + isPicked + isPtInRange;

    return {
      ...shaders,
      vs: this.props.fp64 ? addons + vs64 : addons + vs
    };
  }

  initializeState() {
    super.initializeState();
    const {attributeManager} = this.state;
    attributeManager.addInstanced({
      instanceStrokeWidth: {
        size: 1,
        accessor: ['getStrokeWidth'],
        update: this.calculateInstanceStrokeWidth
      },
      instanceTargetColors: {
        size: 4,
        type: GL.UNSIGNED_BYTE,
        accessor: 'getTargetColor',
        update: this.calculateInstanceTargetColors
      }
    });
  }

  draw({uniforms}) {
    const {
      brushSource,
      brushTarget,
      brushRadius,
      enableBrushing,
      pickedColor,
      mousePosition,
      strokeScale
    } = this.props;

    const picked = !Array.isArray(pickedColor)
      ? defaultProps.pickedColor
      : pickedColor;

    super.draw({
      uniforms: {
        ...uniforms,
        brushSource,
        brushTarget,
        brushRadius,
        enableBrushing,
        strokeScale,
        pickedColor: new Uint8ClampedArray(
          !Number.isFinite(pickedColor[3]) ? [...picked, 255] : picked
        ),
        mousePos: mousePosition
          ? new Float32Array(this.unproject(mousePosition))
          : defaultProps.mousePosition
      }
    });
  }

  calculateInstanceStrokeWidth(attribute) {
    const {data, getStrokeWidth} = this.props;
    const {value, size} = attribute;
    let i = 0;
    for (const object of data) {
      const width = getStrokeWidth(object);
      value[i] = Number.isFinite(width) ? width : 1;
      i += size;
    }
  }

  calculateInstanceTargetColors(attribute) {
    const {data, getTargetColor} = this.props;
    const {value, size} = attribute;
    let i = 0;
    for (const object of data) {
      const color = getTargetColor(object);
      value[i + 0] = color[0];
      value[i + 1] = color[1];
      value[i + 2] = color[2];
      value[i + 3] = isNaN(color[3]) ? 255 : color[3];
      i += size;
    }
  }
}

LineBrushingLayer.layerName = 'LineBrushingLayer';
LineBrushingLayer.defaultProps = defaultProps;
