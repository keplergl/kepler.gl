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
      instanceTargetColors: { size: 4, type: _luma.GL.UNSIGNED_BYTE, accessor: 'getTargetColor', update: this.calculateInstanceTargetColors }
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

    _LineLayer.prototype.draw.call(this, { uniforms: (0, _extends3.default)({}, uniforms, {
        brushSource: brushSource,
        brushTarget: brushTarget,
        brushRadius: brushRadius,
        enableBrushing: enableBrushing,
        strokeScale: strokeScale,
        pickedColor: new Uint8ClampedArray(!Number.isFinite(pickedColor[3]) ? [].concat(picked, [255]) : picked),
        mousePos: mousePosition ? new Float32Array(this.unproject(mousePosition)) : defaultProps.mousePosition
      }) });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2xpbmUtbGF5ZXIvbGluZS1sYXllci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UHJvcHMiLCJicnVzaFNvdXJjZSIsImJydXNoVGFyZ2V0IiwiZW5hYmxlQnJ1c2hpbmciLCJnZXRTdHJva2VXaWR0aCIsImQiLCJzdHJva2VXaWR0aCIsImdldFRhcmdldENvbG9yIiwieCIsImNvbG9yIiwiYnJ1c2hSYWRpdXMiLCJwaWNrZWRDb2xvciIsIm1vdXNlUG9zaXRpb24iLCJMaW5lQnJ1c2hpbmdMYXllciIsImdldFNoYWRlcnMiLCJzaGFkZXJzIiwiYWRkb25zIiwidnMiLCJwcm9wcyIsImZwNjQiLCJpbml0aWFsaXplU3RhdGUiLCJhdHRyaWJ1dGVNYW5hZ2VyIiwic3RhdGUiLCJhZGRJbnN0YW5jZWQiLCJpbnN0YW5jZVN0cm9rZVdpZHRoIiwic2l6ZSIsImFjY2Vzc29yIiwidXBkYXRlIiwiY2FsY3VsYXRlSW5zdGFuY2VTdHJva2VXaWR0aCIsImluc3RhbmNlVGFyZ2V0Q29sb3JzIiwidHlwZSIsIlVOU0lHTkVEX0JZVEUiLCJjYWxjdWxhdGVJbnN0YW5jZVRhcmdldENvbG9ycyIsImRyYXciLCJ1bmlmb3JtcyIsInN0cm9rZVNjYWxlIiwicGlja2VkIiwiQXJyYXkiLCJpc0FycmF5IiwiVWludDhDbGFtcGVkQXJyYXkiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsIm1vdXNlUG9zIiwiRmxvYXQzMkFycmF5IiwidW5wcm9qZWN0IiwiYXR0cmlidXRlIiwiZGF0YSIsInZhbHVlIiwiaSIsIm9iamVjdCIsIndpZHRoIiwiaXNOYU4iLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsMENBQ0QsZ0JBQVVBLFlBRFQ7QUFFSjtBQUNBQyxlQUFhLElBSFQ7QUFJSjtBQUNB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VUFBTUMsUUFBUTlDLGVBQWU2QyxNQUFmLENBQWQ7QUFDQUYsWUFBTUMsQ0FBTixJQUFXUixPQUFPQyxRQUFQLENBQWdCUyxLQUFoQixJQUF5QkEsS0FBekIsR0FBaUMsQ0FBNUM7QUFDQUYsV0FBS3ZCLElBQUw7QUFDRDtBQUNGLEc7OzhCQUVETyw2QiwwQ0FBOEJhLFMsRUFBVztBQUFBLGtCQUNSLEtBQUszQixLQURHO0FBQUEsUUFDaEM0QixJQURnQyxXQUNoQ0EsSUFEZ0M7QUFBQSxRQUMxQnZDLGNBRDBCLFdBQzFCQSxjQUQwQjtBQUFBLFFBRWhDd0MsS0FGZ0MsR0FFakJGLFNBRmlCLENBRWhDRSxLQUZnQztBQUFBLFFBRXpCdEIsSUFGeUIsR0FFakJvQixTQUZpQixDQUV6QnBCLElBRnlCOztBQUd2QyxRQUFJdUIsSUFBSSxDQUFSO0FBQ0EsMEJBQXFCRixJQUFyQix5SEFBMkI7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBLFVBQWhCRyxNQUFnQjs7QUFDekIsVUFBTXhDLFFBQVFGLGVBQWUwQyxNQUFmLENBQWQ7QUFDQUYsWUFBTUMsSUFBSSxDQUFWLElBQWV2QyxNQUFNLENBQU4sQ0FBZjtBQUNBc0MsWUFBTUMsSUFBSSxDQUFWLElBQWV2QyxNQUFNLENBQU4sQ0FBZjtBQUNBc0MsWUFBTUMsSUFBSSxDQUFWLElBQWV2QyxNQUFNLENBQU4sQ0FBZjtBQUNBc0MsWUFBTUMsSUFBSSxDQUFWLElBQWVHLE1BQU0xQyxNQUFNLENBQU4sQ0FBTixJQUFrQixHQUFsQixHQUF3QkEsTUFBTSxDQUFOLENBQXZDO0FBQ0F1QyxXQUFLdkIsSUFBTDtBQUNEO0FBQ0YsRzs7Ozs7a0JBbkVrQlosaUI7OztBQXNFckJBLGtCQUFrQnVDLFNBQWxCLEdBQThCLG1CQUE5QjtBQUNBdkMsa0JBQWtCYixZQUFsQixHQUFpQ0EsWUFBakMiLCJmaWxlIjoibGluZS1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHtMaW5lTGF5ZXJ9IGZyb20gJ2RlY2suZ2wnO1xuaW1wb3J0IHtHTH0gZnJvbSAnbHVtYS5nbCc7XG5cbmltcG9ydCBpc1BpY2tlZCBmcm9tICcuLi8uLi9zaGFkZXJsaWIvaXMtcGlja2VkJztcbmltcG9ydCBpc1B0SW5SYW5nZSBmcm9tICcuLi8uLi9zaGFkZXJsaWIvaXMtcG9pbnQtaW4tcmFuZ2UnO1xuaW1wb3J0IGdldEV4dHJ1c2lvbiBmcm9tICcuLi8uLi9zaGFkZXJsaWIvZ2V0LWV4dHJ1c2lvbi1vZmZzZXQuZ2xzbCc7XG5pbXBvcnQgdnMgZnJvbSAnLi9saW5lLWJydXNoaW5nLWxheWVyLXZlcnRleC5nbHNsJztcbmltcG9ydCB2czY0IGZyb20gJy4vbGluZS1icnVzaGluZy1sYXllci12ZXJ0ZXgtNjQuZ2xzbCc7XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgLi4uTGluZUxheWVyLmRlZmF1bHRQcm9wcyxcbiAgLy8gc2hvdyBhcmMgaWYgc291cmNlIGlzIGluIGJydXNoXG4gIGJydXNoU291cmNlOiB0cnVlLFxuICAvLyBzaG93IGFyYyBpZiB0YXJnZXQgaXMgaW4gYnJ1c2hcbiAgYnJ1c2hUYXJnZXQ6IHRydWUsXG4gIGVuYWJsZUJydXNoaW5nOiB0cnVlLFxuICBnZXRTdHJva2VXaWR0aDogZCA9PiBkLnN0cm9rZVdpZHRoLFxuICBnZXRUYXJnZXRDb2xvcjogeCA9PiB4LmNvbG9yIHx8IFswLCAwLCAwLCAyNTVdLFxuXG4gIC8vIGJydXNoIHJhZGl1cyBpbiBtZXRlcnNcbiAgYnJ1c2hSYWRpdXM6IDEwMDAwMCxcbiAgcGlja2VkQ29sb3I6IFsyNTQsIDIxMCwgMjYsIDI1NV0sXG4gIG1vdXNlUG9zaXRpb246IFswLCAwXVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZUJydXNoaW5nTGF5ZXIgZXh0ZW5kcyBMaW5lTGF5ZXIge1xuXG4gIGdldFNoYWRlcnMoKSB7XG4gICAgY29uc3Qgc2hhZGVycyA9IHN1cGVyLmdldFNoYWRlcnMoKTtcbiAgICBjb25zdCBhZGRvbnMgPSBnZXRFeHRydXNpb24gKyBpc1BpY2tlZCArIGlzUHRJblJhbmdlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnNoYWRlcnMsXG4gICAgICB2czogdGhpcy5wcm9wcy5mcDY0ID8gYWRkb25zICsgdnM2NCA6IGFkZG9ucyArIHZzXG4gICAgfTtcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplU3RhdGUoKTtcbiAgICBjb25zdCB7YXR0cmlidXRlTWFuYWdlcn0gPSB0aGlzLnN0YXRlO1xuICAgIGF0dHJpYnV0ZU1hbmFnZXIuYWRkSW5zdGFuY2VkKHtcbiAgICAgIGluc3RhbmNlU3Ryb2tlV2lkdGg6IHtcbiAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgYWNjZXNzb3I6IFsnZ2V0U3Ryb2tlV2lkdGgnXSxcbiAgICAgICAgdXBkYXRlOiB0aGlzLmNhbGN1bGF0ZUluc3RhbmNlU3Ryb2tlV2lkdGhcbiAgICAgIH0sXG4gICAgICBpbnN0YW5jZVRhcmdldENvbG9yczoge3NpemU6IDQsIHR5cGU6IEdMLlVOU0lHTkVEX0JZVEUsIGFjY2Vzc29yOiAnZ2V0VGFyZ2V0Q29sb3InLCB1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VUYXJnZXRDb2xvcnN9XG4gICAgfSk7XG4gIH1cblxuICBkcmF3KHt1bmlmb3Jtc30pIHtcbiAgICBjb25zdCB7YnJ1c2hTb3VyY2UsIGJydXNoVGFyZ2V0LCBicnVzaFJhZGl1cyxcbiAgICAgIGVuYWJsZUJydXNoaW5nLCBwaWNrZWRDb2xvciwgbW91c2VQb3NpdGlvbiwgc3Ryb2tlU2NhbGV9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IHBpY2tlZCA9ICFBcnJheS5pc0FycmF5KHBpY2tlZENvbG9yKSA/IGRlZmF1bHRQcm9wcy5waWNrZWRDb2xvciA6IHBpY2tlZENvbG9yO1xuXG4gICAgc3VwZXIuZHJhdyh7dW5pZm9ybXM6IHtcbiAgICAgIC4uLnVuaWZvcm1zLFxuICAgICAgYnJ1c2hTb3VyY2UsXG4gICAgICBicnVzaFRhcmdldCxcbiAgICAgIGJydXNoUmFkaXVzLFxuICAgICAgZW5hYmxlQnJ1c2hpbmcsXG4gICAgICBzdHJva2VTY2FsZSxcbiAgICAgIHBpY2tlZENvbG9yOiBuZXcgVWludDhDbGFtcGVkQXJyYXkoIU51bWJlci5pc0Zpbml0ZShwaWNrZWRDb2xvclszXSkgPyBbLi4ucGlja2VkLCAyNTVdIDogcGlja2VkKSxcbiAgICAgIG1vdXNlUG9zOiBtb3VzZVBvc2l0aW9uID9cbiAgICAgICAgbmV3IEZsb2F0MzJBcnJheSh0aGlzLnVucHJvamVjdChtb3VzZVBvc2l0aW9uKSkgOiBkZWZhdWx0UHJvcHMubW91c2VQb3NpdGlvblxuICAgIH19KTtcbiAgfVxuXG4gIGNhbGN1bGF0ZUluc3RhbmNlU3Ryb2tlV2lkdGgoYXR0cmlidXRlKSB7XG4gICAgY29uc3Qge2RhdGEsIGdldFN0cm9rZVdpZHRofSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3ZhbHVlLCBzaXplfSA9IGF0dHJpYnV0ZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBvYmplY3Qgb2YgZGF0YSkge1xuICAgICAgY29uc3Qgd2lkdGggPSBnZXRTdHJva2VXaWR0aChvYmplY3QpO1xuICAgICAgdmFsdWVbaV0gPSBOdW1iZXIuaXNGaW5pdGUod2lkdGgpID8gd2lkdGggOiAxO1xuICAgICAgaSArPSBzaXplO1xuICAgIH1cbiAgfVxuXG4gIGNhbGN1bGF0ZUluc3RhbmNlVGFyZ2V0Q29sb3JzKGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHtkYXRhLCBnZXRUYXJnZXRDb2xvcn0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHt2YWx1ZSwgc2l6ZX0gPSBhdHRyaWJ1dGU7XG4gICAgbGV0IGkgPSAwO1xuICAgIGZvciAoY29uc3Qgb2JqZWN0IG9mIGRhdGEpIHtcbiAgICAgIGNvbnN0IGNvbG9yID0gZ2V0VGFyZ2V0Q29sb3Iob2JqZWN0KTtcbiAgICAgIHZhbHVlW2kgKyAwXSA9IGNvbG9yWzBdO1xuICAgICAgdmFsdWVbaSArIDFdID0gY29sb3JbMV07XG4gICAgICB2YWx1ZVtpICsgMl0gPSBjb2xvclsyXTtcbiAgICAgIHZhbHVlW2kgKyAzXSA9IGlzTmFOKGNvbG9yWzNdKSA/IDI1NSA6IGNvbG9yWzNdO1xuICAgICAgaSArPSBzaXplO1xuICAgIH1cbiAgfVxufVxuXG5MaW5lQnJ1c2hpbmdMYXllci5sYXllck5hbWUgPSAnTGluZUJydXNoaW5nTGF5ZXInO1xuTGluZUJydXNoaW5nTGF5ZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19