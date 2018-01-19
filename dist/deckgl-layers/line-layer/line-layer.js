'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _deck = require('deck.gl');

var _luma = require('luma.gl');

var _isPicked = require('../../shaderlib/is-picked');

var _isPicked2 = _interopRequireDefault(_isPicked);

var _isPointInRange = require('../../shaderlib/is-point-in-range');

var _isPointInRange2 = _interopRequireDefault(_isPointInRange);

var _getExtrusionOffset = require('../../shaderlib/get-extrusion-offset.glsl');

var _getExtrusionOffset2 = _interopRequireDefault(_getExtrusionOffset);

var _lineBrushingLayerVertex = require('./line-brushing-layer-vertex.glsl');

var _lineBrushingLayerVertex2 = _interopRequireDefault(_lineBrushingLayerVertex);

var _lineBrushingLayerVertex3 = require('./line-brushing-layer-vertex-64.glsl');

var _lineBrushingLayerVertex4 = _interopRequireDefault(_lineBrushingLayerVertex3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultProps = (0, _extends3.default)({}, _deck.LineLayer.defaultProps, {
  // show arc if source is in brush
  brushSource: true,
  // show arc if target is in brush
  brushTarget: true,
  enableBrushing: true,
  getStrokeWidth: function getStrokeWidth(d) {
    return d.strokeWidth;
  },
  getTargetColor: function getTargetColor(x) {
    return x.color || [0, 0, 0, 255];
  },

  // brush radius in meters
  brushRadius: 100000,
  pickedColor: [254, 210, 26, 255],
  mousePosition: [0, 0]
});

var LineBrushingLayer = function (_LineLayer) {
  (0, _inherits3.default)(LineBrushingLayer, _LineLayer);

  function LineBrushingLayer() {
    (0, _classCallCheck3.default)(this, LineBrushingLayer);
    return (0, _possibleConstructorReturn3.default)(this, _LineLayer.apply(this, arguments));
  }

  LineBrushingLayer.prototype.getShaders = function getShaders() {
    var shaders = _LineLayer.prototype.getShaders.call(this);
    var addons = _getExtrusionOffset2.default + _isPicked2.default + _isPointInRange2.default;

    return (0, _extends3.default)({}, shaders, {
      vs: this.props.fp64 ? addons + _lineBrushingLayerVertex4.default : addons + _lineBrushingLayerVertex2.default
    });
  };

  LineBrushingLayer.prototype.initializeState = function initializeState() {
    _LineLayer.prototype.initializeState.call(this);
    var attributeManager = this.state.attributeManager;

    attributeManager.addInstanced({
      instanceStrokeWidth: {
        size: 1,
        accessor: ['getStrokeWidth'],
        update: this.calculateInstanceStrokeWidth
      },
      instanceTargetColors: {
        size: 4,
        type: _luma.GL.UNSIGNED_BYTE,
        accessor: 'getTargetColor',
        update: this.calculateInstanceTargetColors
      }
    });
  };

  LineBrushingLayer.prototype.draw = function draw(_ref) {
    var uniforms = _ref.uniforms;
    var _props = this.props,
        brushSource = _props.brushSource,
        brushTarget = _props.brushTarget,
        brushRadius = _props.brushRadius,
        enableBrushing = _props.enableBrushing,
        pickedColor = _props.pickedColor,
        mousePosition = _props.mousePosition,
        strokeScale = _props.strokeScale;


    var picked = !Array.isArray(pickedColor) ? defaultProps.pickedColor : pickedColor;

    _LineLayer.prototype.draw.call(this, {
      uniforms: (0, _extends3.default)({}, uniforms, {
        brushSource: brushSource,
        brushTarget: brushTarget,
        brushRadius: brushRadius,
        enableBrushing: enableBrushing,
        strokeScale: strokeScale,
        pickedColor: new Uint8ClampedArray(!Number.isFinite(pickedColor[3]) ? [].concat(picked, [255]) : picked),
        mousePos: mousePosition ? new Float32Array(this.unproject(mousePosition)) : defaultProps.mousePosition
      })
    });
  };

  LineBrushingLayer.prototype.calculateInstanceStrokeWidth = function calculateInstanceStrokeWidth(attribute) {
    var _props2 = this.props,
        data = _props2.data,
        getStrokeWidth = _props2.getStrokeWidth;
    var value = attribute.value,
        size = attribute.size;

    var i = 0;
    for (var _iterator = data, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref2 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref2 = _i.value;
      }

      var object = _ref2;

      var width = getStrokeWidth(object);
      value[i] = Number.isFinite(width) ? width : 1;
      i += size;
    }
  };

  LineBrushingLayer.prototype.calculateInstanceTargetColors = function calculateInstanceTargetColors(attribute) {
    var _props3 = this.props,
        data = _props3.data,
        getTargetColor = _props3.getTargetColor;
    var value = attribute.value,
        size = attribute.size;

    var i = 0;
    for (var _iterator2 = data, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref3 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref3 = _i2.value;
      }

      var object = _ref3;

      var color = getTargetColor(object);
      value[i + 0] = color[0];
      value[i + 1] = color[1];
      value[i + 2] = color[2];
      value[i + 3] = isNaN(color[3]) ? 255 : color[3];
      i += size;
    }
  };

  return LineBrushingLayer;
}(_deck.LineLayer);

exports.default = LineBrushingLayer;


LineBrushingLayer.layerName = 'LineBrushingLayer';
LineBrushingLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2xpbmUtbGF5ZXIvbGluZS1sYXllci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UHJvcHMiLCJicnVzaFNvdXJjZSIsImJydXNoVGFyZ2V0IiwiZW5hYmxlQnJ1c2hpbmciLCJnZXRTdHJva2VXaWR0aCIsImQiLCJzdHJva2VXaWR0aCIsImdldFRhcmdldENvbG9yIiwieCIsImNvbG9yIiwiYnJ1c2hSYWRpdXMiLCJwaWNrZWRDb2xvciIsIm1vdXNlUG9zaXRpb24iLCJMaW5lQnJ1c2hpbmdMYXllciIsImdldFNoYWRlcnMiLCJzaGFkZXJzIiwiYWRkb25zIiwidnMiLCJwcm9wcyIsImZwNjQiLCJpbml0aWFsaXplU3RhdGUiLCJhdHRyaWJ1dGVNYW5hZ2VyIiwic3RhdGUiLCJhZGRJbnN0YW5jZWQiLCJpbnN0YW5jZVN0cm9rZVdpZHRoIiwic2l6ZSIsImFjY2Vzc29yIiwidXBkYXRlIiwiY2FsY3VsYXRlSW5zdGFuY2VTdHJva2VXaWR0aCIsImluc3RhbmNlVGFyZ2V0Q29sb3JzIiwidHlwZSIsIlVOU0lHTkVEX0JZVEUiLCJjYWxjdWxhdGVJbnN0YW5jZVRhcmdldENvbG9ycyIsImRyYXciLCJ1bmlmb3JtcyIsInN0cm9rZVNjYWxlIiwicGlja2VkIiwiQXJyYXkiLCJpc0FycmF5IiwiVWludDhDbGFtcGVkQXJyYXkiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsIm1vdXNlUG9zIiwiRmxvYXQzMkFycmF5IiwidW5wcm9qZWN0IiwiYXR0cmlidXRlIiwiZGF0YSIsInZhbHVlIiwiaSIsIm9iamVjdCIsIndpZHRoIiwiaXNOYU4iLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsMENBQ0QsZ0JBQVVBLFlBRFQ7QUFFSjtBQUNBQyxlQUFhLElBSFQ7QUFJSjtBQUNBQyxlQUFhLElBTFQ7QUFNSkMsa0JBQWdCLElBTlo7QUFPSkMsa0JBQWdCO0FBQUEsV0FBS0MsRUFBRUMsV0FBUDtBQUFBLEdBUFo7QUFRSkMsa0JBQWdCO0FBQUEsV0FBS0MsRUFBRUMsS0FBRixJQUFXLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsR0FBVixDQUFoQjtBQUFBLEdBUlo7O0FBVUo7QUFDQUMsZUFBYSxNQVhUO0FBWUpDLGVBQWEsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEVBQVgsRUFBZSxHQUFmLENBWlQ7QUFhSkMsaUJBQWUsQ0FBQyxDQUFELEVBQUksQ0FBSjtBQWJYLEVBQU47O0lBZ0JxQkMsaUI7Ozs7Ozs7OzhCQUNuQkMsVSx5QkFBYTtBQUNYLFFBQU1DLFVBQVUscUJBQU1ELFVBQU4sV0FBaEI7QUFDQSxRQUFNRSxTQUFTLDRFQUFmOztBQUVBLHNDQUNLRCxPQURMO0FBRUVFLFVBQUksS0FBS0MsS0FBTCxDQUFXQyxJQUFYLEdBQWtCSCwwQ0FBbEIsR0FBa0NBO0FBRnhDO0FBSUQsRzs7OEJBRURJLGUsOEJBQWtCO0FBQ2hCLHlCQUFNQSxlQUFOO0FBRGdCLFFBRVRDLGdCQUZTLEdBRVcsS0FBS0MsS0FGaEIsQ0FFVEQsZ0JBRlM7O0FBR2hCQSxxQkFBaUJFLFlBQWpCLENBQThCO0FBQzVCQywyQkFBcUI7QUFDbkJDLGNBQU0sQ0FEYTtBQUVuQkMsa0JBQVUsQ0FBQyxnQkFBRCxDQUZTO0FBR25CQyxnQkFBUSxLQUFLQztBQUhNLE9BRE87QUFNNUJDLDRCQUFzQjtBQUNwQkosY0FBTSxDQURjO0FBRXBCSyxjQUFNLFNBQUdDLGFBRlc7QUFHcEJMLGtCQUFVLGdCQUhVO0FBSXBCQyxnQkFBUSxLQUFLSztBQUpPO0FBTk0sS0FBOUI7QUFhRCxHOzs4QkFFREMsSSx1QkFBaUI7QUFBQSxRQUFYQyxRQUFXLFFBQVhBLFFBQVc7QUFBQSxpQkFTWCxLQUFLaEIsS0FUTTtBQUFBLFFBRWJqQixXQUZhLFVBRWJBLFdBRmE7QUFBQSxRQUdiQyxXQUhhLFVBR2JBLFdBSGE7QUFBQSxRQUliUSxXQUphLFVBSWJBLFdBSmE7QUFBQSxRQUtiUCxjQUxhLFVBS2JBLGNBTGE7QUFBQSxRQU1iUSxXQU5hLFVBTWJBLFdBTmE7QUFBQSxRQU9iQyxhQVBhLFVBT2JBLGFBUGE7QUFBQSxRQVFidUIsV0FSYSxVQVFiQSxXQVJhOzs7QUFXZixRQUFNQyxTQUFTLENBQUNDLE1BQU1DLE9BQU4sQ0FBYzNCLFdBQWQsQ0FBRCxHQUNYWCxhQUFhVyxXQURGLEdBRVhBLFdBRko7O0FBSUEseUJBQU1zQixJQUFOLFlBQVc7QUFDVEMsMkNBQ0tBLFFBREw7QUFFRWpDLGdDQUZGO0FBR0VDLGdDQUhGO0FBSUVRLGdDQUpGO0FBS0VQLHNDQUxGO0FBTUVnQyxnQ0FORjtBQU9FeEIscUJBQWEsSUFBSTRCLGlCQUFKLENBQ1gsQ0FBQ0MsT0FBT0MsUUFBUCxDQUFnQjlCLFlBQVksQ0FBWixDQUFoQixDQUFELGFBQXVDeUIsTUFBdkMsR0FBK0MsR0FBL0MsS0FBc0RBLE1BRDNDLENBUGY7QUFVRU0sa0JBQVU5QixnQkFDTixJQUFJK0IsWUFBSixDQUFpQixLQUFLQyxTQUFMLENBQWVoQyxhQUFmLENBQWpCLENBRE0sR0FFTlosYUFBYVk7QUFabkI7QUFEUyxLQUFYO0FBZ0JELEc7OzhCQUVEZ0IsNEIseUNBQTZCaUIsUyxFQUFXO0FBQUEsa0JBQ1AsS0FBSzNCLEtBREU7QUFBQSxRQUMvQjRCLElBRCtCLFdBQy9CQSxJQUQrQjtBQUFBLFFBQ3pCMUMsY0FEeUIsV0FDekJBLGNBRHlCO0FBQUEsUUFFL0IyQyxLQUYrQixHQUVoQkYsU0FGZ0IsQ0FFL0JFLEtBRitCO0FBQUEsUUFFeEJ0QixJQUZ3QixHQUVoQm9CLFNBRmdCLENBRXhCcEIsSUFGd0I7O0FBR3RDLFFBQUl1QixJQUFJLENBQVI7QUFDQSx5QkFBcUJGLElBQXJCLGtIQUEyQjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUEsVUFBaEJHLE1BQWdCOztBQUN6QixVQUFNQyxRQUFROUMsZUFBZTZDLE1BQWYsQ0FBZDtBQUNBRixZQUFNQyxDQUFOLElBQVdSLE9BQU9DLFFBQVAsQ0FBZ0JTLEtBQWhCLElBQXlCQSxLQUF6QixHQUFpQyxDQUE1QztBQUNBRixXQUFLdkIsSUFBTDtBQUNEO0FBQ0YsRzs7OEJBRURPLDZCLDBDQUE4QmEsUyxFQUFXO0FBQUEsa0JBQ1IsS0FBSzNCLEtBREc7QUFBQSxRQUNoQzRCLElBRGdDLFdBQ2hDQSxJQURnQztBQUFBLFFBQzFCdkMsY0FEMEIsV0FDMUJBLGNBRDBCO0FBQUEsUUFFaEN3QyxLQUZnQyxHQUVqQkYsU0FGaUIsQ0FFaENFLEtBRmdDO0FBQUEsUUFFekJ0QixJQUZ5QixHQUVqQm9CLFNBRmlCLENBRXpCcEIsSUFGeUI7O0FBR3ZDLFFBQUl1QixJQUFJLENBQVI7QUFDQSwwQkFBcUJGLElBQXJCLHlIQUEyQjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUEsVUFBaEJHLE1BQWdCOztBQUN6QixVQUFNeEMsUUFBUUYsZUFBZTBDLE1BQWYsQ0FBZDtBQUNBRixZQUFNQyxJQUFJLENBQVYsSUFBZXZDLE1BQU0sQ0FBTixDQUFmO0FBQ0FzQyxZQUFNQyxJQUFJLENBQVYsSUFBZXZDLE1BQU0sQ0FBTixDQUFmO0FBQ0FzQyxZQUFNQyxJQUFJLENBQVYsSUFBZXZDLE1BQU0sQ0FBTixDQUFmO0FBQ0FzQyxZQUFNQyxJQUFJLENBQVYsSUFBZUcsTUFBTTFDLE1BQU0sQ0FBTixDQUFOLElBQWtCLEdBQWxCLEdBQXdCQSxNQUFNLENBQU4sQ0FBdkM7QUFDQXVDLFdBQUt2QixJQUFMO0FBQ0Q7QUFDRixHOzs7OztrQkFyRmtCWixpQjs7O0FBd0ZyQkEsa0JBQWtCdUMsU0FBbEIsR0FBOEIsbUJBQTlCO0FBQ0F2QyxrQkFBa0JiLFlBQWxCLEdBQWlDQSxZQUFqQyIsImZpbGUiOiJsaW5lLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtMaW5lTGF5ZXJ9IGZyb20gJ2RlY2suZ2wnO1xuaW1wb3J0IHtHTH0gZnJvbSAnbHVtYS5nbCc7XG5cbmltcG9ydCBpc1BpY2tlZCBmcm9tICcuLi8uLi9zaGFkZXJsaWIvaXMtcGlja2VkJztcbmltcG9ydCBpc1B0SW5SYW5nZSBmcm9tICcuLi8uLi9zaGFkZXJsaWIvaXMtcG9pbnQtaW4tcmFuZ2UnO1xuaW1wb3J0IGdldEV4dHJ1c2lvbiBmcm9tICcuLi8uLi9zaGFkZXJsaWIvZ2V0LWV4dHJ1c2lvbi1vZmZzZXQuZ2xzbCc7XG5pbXBvcnQgdnMgZnJvbSAnLi9saW5lLWJydXNoaW5nLWxheWVyLXZlcnRleC5nbHNsJztcbmltcG9ydCB2czY0IGZyb20gJy4vbGluZS1icnVzaGluZy1sYXllci12ZXJ0ZXgtNjQuZ2xzbCc7XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgLi4uTGluZUxheWVyLmRlZmF1bHRQcm9wcyxcbiAgLy8gc2hvdyBhcmMgaWYgc291cmNlIGlzIGluIGJydXNoXG4gIGJydXNoU291cmNlOiB0cnVlLFxuICAvLyBzaG93IGFyYyBpZiB0YXJnZXQgaXMgaW4gYnJ1c2hcbiAgYnJ1c2hUYXJnZXQ6IHRydWUsXG4gIGVuYWJsZUJydXNoaW5nOiB0cnVlLFxuICBnZXRTdHJva2VXaWR0aDogZCA9PiBkLnN0cm9rZVdpZHRoLFxuICBnZXRUYXJnZXRDb2xvcjogeCA9PiB4LmNvbG9yIHx8IFswLCAwLCAwLCAyNTVdLFxuXG4gIC8vIGJydXNoIHJhZGl1cyBpbiBtZXRlcnNcbiAgYnJ1c2hSYWRpdXM6IDEwMDAwMCxcbiAgcGlja2VkQ29sb3I6IFsyNTQsIDIxMCwgMjYsIDI1NV0sXG4gIG1vdXNlUG9zaXRpb246IFswLCAwXVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZUJydXNoaW5nTGF5ZXIgZXh0ZW5kcyBMaW5lTGF5ZXIge1xuICBnZXRTaGFkZXJzKCkge1xuICAgIGNvbnN0IHNoYWRlcnMgPSBzdXBlci5nZXRTaGFkZXJzKCk7XG4gICAgY29uc3QgYWRkb25zID0gZ2V0RXh0cnVzaW9uICsgaXNQaWNrZWQgKyBpc1B0SW5SYW5nZTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zaGFkZXJzLFxuICAgICAgdnM6IHRoaXMucHJvcHMuZnA2NCA/IGFkZG9ucyArIHZzNjQgOiBhZGRvbnMgKyB2c1xuICAgIH07XG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZVN0YXRlKCk7XG4gICAgY29uc3Qge2F0dHJpYnV0ZU1hbmFnZXJ9ID0gdGhpcy5zdGF0ZTtcbiAgICBhdHRyaWJ1dGVNYW5hZ2VyLmFkZEluc3RhbmNlZCh7XG4gICAgICBpbnN0YW5jZVN0cm9rZVdpZHRoOiB7XG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIGFjY2Vzc29yOiBbJ2dldFN0cm9rZVdpZHRoJ10sXG4gICAgICAgIHVwZGF0ZTogdGhpcy5jYWxjdWxhdGVJbnN0YW5jZVN0cm9rZVdpZHRoXG4gICAgICB9LFxuICAgICAgaW5zdGFuY2VUYXJnZXRDb2xvcnM6IHtcbiAgICAgICAgc2l6ZTogNCxcbiAgICAgICAgdHlwZTogR0wuVU5TSUdORURfQllURSxcbiAgICAgICAgYWNjZXNzb3I6ICdnZXRUYXJnZXRDb2xvcicsXG4gICAgICAgIHVwZGF0ZTogdGhpcy5jYWxjdWxhdGVJbnN0YW5jZVRhcmdldENvbG9yc1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZHJhdyh7dW5pZm9ybXN9KSB7XG4gICAgY29uc3Qge1xuICAgICAgYnJ1c2hTb3VyY2UsXG4gICAgICBicnVzaFRhcmdldCxcbiAgICAgIGJydXNoUmFkaXVzLFxuICAgICAgZW5hYmxlQnJ1c2hpbmcsXG4gICAgICBwaWNrZWRDb2xvcixcbiAgICAgIG1vdXNlUG9zaXRpb24sXG4gICAgICBzdHJva2VTY2FsZVxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgcGlja2VkID0gIUFycmF5LmlzQXJyYXkocGlja2VkQ29sb3IpXG4gICAgICA/IGRlZmF1bHRQcm9wcy5waWNrZWRDb2xvclxuICAgICAgOiBwaWNrZWRDb2xvcjtcblxuICAgIHN1cGVyLmRyYXcoe1xuICAgICAgdW5pZm9ybXM6IHtcbiAgICAgICAgLi4udW5pZm9ybXMsXG4gICAgICAgIGJydXNoU291cmNlLFxuICAgICAgICBicnVzaFRhcmdldCxcbiAgICAgICAgYnJ1c2hSYWRpdXMsXG4gICAgICAgIGVuYWJsZUJydXNoaW5nLFxuICAgICAgICBzdHJva2VTY2FsZSxcbiAgICAgICAgcGlja2VkQ29sb3I6IG5ldyBVaW50OENsYW1wZWRBcnJheShcbiAgICAgICAgICAhTnVtYmVyLmlzRmluaXRlKHBpY2tlZENvbG9yWzNdKSA/IFsuLi5waWNrZWQsIDI1NV0gOiBwaWNrZWRcbiAgICAgICAgKSxcbiAgICAgICAgbW91c2VQb3M6IG1vdXNlUG9zaXRpb25cbiAgICAgICAgICA/IG5ldyBGbG9hdDMyQXJyYXkodGhpcy51bnByb2plY3QobW91c2VQb3NpdGlvbikpXG4gICAgICAgICAgOiBkZWZhdWx0UHJvcHMubW91c2VQb3NpdGlvblxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgY2FsY3VsYXRlSW5zdGFuY2VTdHJva2VXaWR0aChhdHRyaWJ1dGUpIHtcbiAgICBjb25zdCB7ZGF0YSwgZ2V0U3Ryb2tlV2lkdGh9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7dmFsdWUsIHNpemV9ID0gYXR0cmlidXRlO1xuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKGNvbnN0IG9iamVjdCBvZiBkYXRhKSB7XG4gICAgICBjb25zdCB3aWR0aCA9IGdldFN0cm9rZVdpZHRoKG9iamVjdCk7XG4gICAgICB2YWx1ZVtpXSA9IE51bWJlci5pc0Zpbml0ZSh3aWR0aCkgPyB3aWR0aCA6IDE7XG4gICAgICBpICs9IHNpemU7XG4gICAgfVxuICB9XG5cbiAgY2FsY3VsYXRlSW5zdGFuY2VUYXJnZXRDb2xvcnMoYXR0cmlidXRlKSB7XG4gICAgY29uc3Qge2RhdGEsIGdldFRhcmdldENvbG9yfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3ZhbHVlLCBzaXplfSA9IGF0dHJpYnV0ZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBvYmplY3Qgb2YgZGF0YSkge1xuICAgICAgY29uc3QgY29sb3IgPSBnZXRUYXJnZXRDb2xvcihvYmplY3QpO1xuICAgICAgdmFsdWVbaSArIDBdID0gY29sb3JbMF07XG4gICAgICB2YWx1ZVtpICsgMV0gPSBjb2xvclsxXTtcbiAgICAgIHZhbHVlW2kgKyAyXSA9IGNvbG9yWzJdO1xuICAgICAgdmFsdWVbaSArIDNdID0gaXNOYU4oY29sb3JbM10pID8gMjU1IDogY29sb3JbM107XG4gICAgICBpICs9IHNpemU7XG4gICAgfVxuICB9XG59XG5cbkxpbmVCcnVzaGluZ0xheWVyLmxheWVyTmFtZSA9ICdMaW5lQnJ1c2hpbmdMYXllcic7XG5MaW5lQnJ1c2hpbmdMYXllci5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG4iXX0=