/* global document */
import {CompositeLayer, IconLayer} from 'deck.gl';
import {GL, Texture2D} from 'luma.gl';

const MAX_CANVAS_WIDTH = 1024;

// helper for textMatrixToTexture
function setTextStyle(ctx, fontSize) {
  ctx.font = `bold ${fontSize}px ff-clan-web-pro,Helvetica Neue,Helvetica,sans-serif`;
  ctx.fillStyle = '#000';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
}

/*
 * renders a matrix of text labels to texture2D.
 * @param {WebGLRenderingContext} glContext
 * @param {[[String]]} data: text to render, in array of columns (array of strings)
 * @param {Number} fontSize: size to render with
 * @returns {object} {texture, columnWidths}
 */
export function makeTextureAtlasFromLabels(
  gl,
  {data, getLabel = x => x, fontSize = 48}
) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  setTextStyle(ctx, fontSize);

  // measure texts
  let row = 0;
  let x = 0;
  const mapping = data.map((object, index) => {
    const string = getLabel(object);
    const {width} = ctx.measureText(string);
    if (x + width > MAX_CANVAS_WIDTH) {
      x = 0;
      row++;
    }
    const iconMap = {
      object,
      index,
      string,
      x,
      y: row * fontSize,
      width: Math.min(width, MAX_CANVAS_WIDTH),
      height: fontSize,
      mask: true
    };
    x += width;
    return iconMap;
  });

  canvas.width = MAX_CANVAS_WIDTH;
  canvas.height = (row + 1) * fontSize;

  // changing canvas size will reset context
  setTextStyle(ctx, fontSize);

  /*
   *  +---------------------+----------+
   *  | elt1 | elt2-------- | elt3     |
   *  +----------+----------+----------+
   *  | elt4---------------   | elt5   |
   *  +----------+----------+----------+
   *  | ...      | ...      | ...      |
   */
  for (const label of mapping) {
    ctx.fillText(label.string, label.x, label.y);
  }

  return {
    mapping,
    texture: new Texture2D(gl, {
      pixels: canvas,
      magFilter: GL.LINEAR
    })
  };
}


/* Constants */
const defaultProps = {
  id: 'label-layer',
  getLabel: x => x.label,
  getAngle: x => 0,
  fontSize: 24,
  fp64: false
};

/*
 * A layer that plots a surface based on a z=f(x,y) equation.
 *
 * @class
 * @param {Object} [props]
 * @param {Number} [props.axesOffset] - amount to set back grids from the plot,
      relative to the size of the bounding box
 * @param {Number} [props.fontSize] - size of the labels
 * @param {Array} [props.axesColor] - color of the gridlines, in [r,g,b,a]
 */
export default class TextLayer extends CompositeLayer {
  shouldUpdateState({changeFlags}) {
    return changeFlags.dataChanged || changeFlags.propsChanged;
  }

  updateState({props, oldProps, changeFlags}) {
    super.updateState({props, oldProps, changeFlags});
    if (changeFlags.dataChanged) {
      this.updateLabelAtlas(props);
    }
  }

  updateLabelAtlas() {
    const {gl} = this.context;
    const {data, getLabel, fontSize} = this.props;

    const {texture, mapping} = makeTextureAtlasFromLabels(gl, {
      data,
      getLabel,
      fontSize
    });
    this.setState({texture, mapping});
  }

  renderLayers() {
    const {
      projectionMode,
      fontSize,
      getAngle,
      getColor,
      getPosition,
      getSize,
      id,
      updateTriggers
    } = this.props;
    const {mapping, texture} = this.state;

    return new IconLayer({
      id: `${id}-icons`,
      iconAtlas: texture,
      iconMapping: mapping,
      data: mapping,
      sizeScale: fontSize,
      getIcon: d => d.index,
      getPosition: d => getPosition(d.object),
      getColor: d => getColor(d.object),
      getSize: d => getSize(d.object),
      getAngle: d => getAngle(d.object),
      projectionMode,
      updateTriggers: {
        getIcon: updateTriggers.getLabel,
        getPosition: updateTriggers.getPosition,
        getColor: updateTriggers.getColor,
        getSize: updateTriggers.getSize,
        getAngle: updateTriggers.getAngle
      }
    });
  }
}

TextLayer.layerName = 'TextLayer';
TextLayer.defaultProps = defaultProps;
