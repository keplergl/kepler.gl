import {ScatterplotLayer} from 'deck.gl';
import {GL, Geometry, Model} from 'luma.gl';

export default class ScatterplotIconLayer extends ScatterplotLayer {

  _getModel(gl) {
    // use default scatterplot shaders
    const shaders = this.getShaders();
    const defaultPos = [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0];
    const {iconGeometry} = this.props;

    const geometry = iconGeometry ?
      new Geometry({
        drawMode: GL.TRIANGLES,
        positions: new Float32Array(iconGeometry)
      }) :
      new Geometry({
        drawMode: GL.TRIANGLE_FAN,
        positions: new Float32Array(defaultPos)
      });

    return new Model(gl, {
      ...shaders,
      id: this.props.id,
      geometry,
      isInstanced: true,
      shaderCache: this.context.shaderCache
    });
  }
}

ScatterplotIconLayer.layerName = 'ScatterplotIconLayer';
