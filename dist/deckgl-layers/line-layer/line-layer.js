'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

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
    return (0, _possibleConstructorReturn3.default)(this, (LineBrushingLayer.__proto__ || Object.getPrototypeOf(LineBrushingLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(LineBrushingLayer, [{
    key: 'getShaders',
    value: function getShaders() {
      var shaders = (0, _get3.default)(LineBrushingLayer.prototype.__proto__ || Object.getPrototypeOf(LineBrushingLayer.prototype), 'getShaders', this).call(this);
      var addons = _getExtrusionOffset2.default + _isPicked2.default + _isPointInRange2.default;

      return (0, _extends3.default)({}, shaders, {
        vs: this.props.fp64 ? addons + _lineBrushingLayerVertex4.default : addons + _lineBrushingLayerVertex2.default
      });
    }
  }, {
    key: 'initializeState',
    value: function initializeState() {
      (0, _get3.default)(LineBrushingLayer.prototype.__proto__ || Object.getPrototypeOf(LineBrushingLayer.prototype), 'initializeState', this).call(this);
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
    }
  }, {
    key: 'draw',
    value: function draw(_ref) {
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

      (0, _get3.default)(LineBrushingLayer.prototype.__proto__ || Object.getPrototypeOf(LineBrushingLayer.prototype), 'draw', this).call(this, {
        uniforms: (0, _extends3.default)({}, uniforms, {
          brushSource: brushSource,
          brushTarget: brushTarget,
          brushRadius: brushRadius,
          enableBrushing: enableBrushing,
          strokeScale: strokeScale,
          pickedColor: new Uint8ClampedArray(!Number.isFinite(pickedColor[3]) ? [].concat((0, _toConsumableArray3.default)(picked), [255]) : picked),
          mousePos: mousePosition ? new Float32Array(this.unproject(mousePosition)) : defaultProps.mousePosition
        })
      });
    }
  }, {
    key: 'calculateInstanceStrokeWidth',
    value: function calculateInstanceStrokeWidth(attribute) {
      var _props2 = this.props,
          data = _props2.data,
          getStrokeWidth = _props2.getStrokeWidth;
      var value = attribute.value,
          size = attribute.size;

      var i = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var object = _step.value;

          var width = getStrokeWidth(object);
          value[i] = Number.isFinite(width) ? width : 1;
          i += size;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'calculateInstanceTargetColors',
    value: function calculateInstanceTargetColors(attribute) {
      var _props3 = this.props,
          data = _props3.data,
          getTargetColor = _props3.getTargetColor;
      var value = attribute.value,
          size = attribute.size;

      var i = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var object = _step2.value;

          var color = getTargetColor(object);
          value[i + 0] = color[0];
          value[i + 1] = color[1];
          value[i + 2] = color[2];
          value[i + 3] = isNaN(color[3]) ? 255 : color[3];
          i += size;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);
  return LineBrushingLayer;
}(_deck.LineLayer);

exports.default = LineBrushingLayer;


LineBrushingLayer.layerName = 'LineBrushingLayer';
LineBrushingLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2xpbmUtbGF5ZXIvbGluZS1sYXllci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UHJvcHMiLCJicnVzaFNvdXJjZSIsImJydXNoVGFyZ2V0IiwiZW5hYmxlQnJ1c2hpbmciLCJnZXRTdHJva2VXaWR0aCIsImQiLCJzdHJva2VXaWR0aCIsImdldFRhcmdldENvbG9yIiwieCIsImNvbG9yIiwiYnJ1c2hSYWRpdXMiLCJwaWNrZWRDb2xvciIsIm1vdXNlUG9zaXRpb24iLCJMaW5lQnJ1c2hpbmdMYXllciIsInNoYWRlcnMiLCJhZGRvbnMiLCJ2cyIsInByb3BzIiwiZnA2NCIsImF0dHJpYnV0ZU1hbmFnZXIiLCJzdGF0ZSIsImFkZEluc3RhbmNlZCIsImluc3RhbmNlU3Ryb2tlV2lkdGgiLCJzaXplIiwiYWNjZXNzb3IiLCJ1cGRhdGUiLCJjYWxjdWxhdGVJbnN0YW5jZVN0cm9rZVdpZHRoIiwiaW5zdGFuY2VUYXJnZXRDb2xvcnMiLCJ0eXBlIiwiVU5TSUdORURfQllURSIsImNhbGN1bGF0ZUluc3RhbmNlVGFyZ2V0Q29sb3JzIiwidW5pZm9ybXMiLCJzdHJva2VTY2FsZSIsInBpY2tlZCIsIkFycmF5IiwiaXNBcnJheSIsIlVpbnQ4Q2xhbXBlZEFycmF5IiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJtb3VzZVBvcyIsIkZsb2F0MzJBcnJheSIsInVucHJvamVjdCIsImF0dHJpYnV0ZSIsImRhdGEiLCJ2YWx1ZSIsImkiLCJvYmplY3QiLCJ3aWR0aCIsImlzTmFOIiwibGF5ZXJOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLDBDQUNELGdCQUFVQSxZQURUO0FBRUo7QUFDQUMsZUFBYSxJQUhUO0FBSUo7QUFDQUMsZUFBYSxJQUxUO0FBTUpDLGtCQUFnQixJ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O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFTdkM7OztrREFFNkJtQixTLEVBQVc7QUFBQSxvQkFDUixLQUFLekIsS0FERztBQUFBLFVBQ2hDMEIsSUFEZ0MsV0FDaENBLElBRGdDO0FBQUEsVUFDMUJwQyxjQUQwQixXQUMxQkEsY0FEMEI7QUFBQSxVQUVoQ3FDLEtBRmdDLEdBRWpCRixTQUZpQixDQUVoQ0UsS0FGZ0M7QUFBQSxVQUV6QnJCLElBRnlCLEdBRWpCbUIsU0FGaUIsQ0FFekJuQixJQUZ5Qjs7QUFHdkMsVUFBSXNCLElBQUksQ0FBUjtBQUh1QztBQUFBO0FBQUE7O0FBQUE7QUFJdkMsOEJBQXFCRixJQUFyQixtSUFBMkI7QUFBQSxjQUFoQkcsTUFBZ0I7O0FBQ3pCLGNBQU1yQyxRQUFRRixlQUFldUMsTUFBZixDQUFkO0FBQ0FGLGdCQUFNQyxJQUFJLENBQVYsSUFBZXBDLE1BQU0sQ0FBTixDQUFmO0FBQ0FtQyxnQkFBTUMsSUFBSSxDQUFWLElBQWVwQyxNQUFNLENBQU4sQ0FBZjtBQUNBbUMsZ0JBQU1DLElBQUksQ0FBVixJQUFlcEMsTUFBTSxDQUFOLENBQWY7QUFDQW1DLGdCQUFNQyxJQUFJLENBQVYsSUFBZUcsTUFBTXZDLE1BQU0sQ0FBTixDQUFOLElBQWtCLEdBQWxCLEdBQXdCQSxNQUFNLENBQU4sQ0FBdkM7QUFDQW9DLGVBQUt0QixJQUFMO0FBQ0Q7QUFYc0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVl4Qzs7Ozs7a0JBckZrQlYsaUI7OztBQXdGckJBLGtCQUFrQm9DLFNBQWxCLEdBQThCLG1CQUE5QjtBQUNBcEMsa0JBQWtCYixZQUFsQixHQUFpQ0EsWUFBakMiLCJmaWxlIjoibGluZS1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TGluZUxheWVyfSBmcm9tICdkZWNrLmdsJztcbmltcG9ydCB7R0x9IGZyb20gJ2x1bWEuZ2wnO1xuXG5pbXBvcnQgaXNQaWNrZWQgZnJvbSAnLi4vLi4vc2hhZGVybGliL2lzLXBpY2tlZCc7XG5pbXBvcnQgaXNQdEluUmFuZ2UgZnJvbSAnLi4vLi4vc2hhZGVybGliL2lzLXBvaW50LWluLXJhbmdlJztcbmltcG9ydCBnZXRFeHRydXNpb24gZnJvbSAnLi4vLi4vc2hhZGVybGliL2dldC1leHRydXNpb24tb2Zmc2V0Lmdsc2wnO1xuaW1wb3J0IHZzIGZyb20gJy4vbGluZS1icnVzaGluZy1sYXllci12ZXJ0ZXguZ2xzbCc7XG5pbXBvcnQgdnM2NCBmcm9tICcuL2xpbmUtYnJ1c2hpbmctbGF5ZXItdmVydGV4LTY0Lmdsc2wnO1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIC4uLkxpbmVMYXllci5kZWZhdWx0UHJvcHMsXG4gIC8vIHNob3cgYXJjIGlmIHNvdXJjZSBpcyBpbiBicnVzaFxuICBicnVzaFNvdXJjZTogdHJ1ZSxcbiAgLy8gc2hvdyBhcmMgaWYgdGFyZ2V0IGlzIGluIGJydXNoXG4gIGJydXNoVGFyZ2V0OiB0cnVlLFxuICBlbmFibGVCcnVzaGluZzogdHJ1ZSxcbiAgZ2V0U3Ryb2tlV2lkdGg6IGQgPT4gZC5zdHJva2VXaWR0aCxcbiAgZ2V0VGFyZ2V0Q29sb3I6IHggPT4geC5jb2xvciB8fCBbMCwgMCwgMCwgMjU1XSxcblxuICAvLyBicnVzaCByYWRpdXMgaW4gbWV0ZXJzXG4gIGJydXNoUmFkaXVzOiAxMDAwMDAsXG4gIHBpY2tlZENvbG9yOiBbMjU0LCAyMTAsIDI2LCAyNTVdLFxuICBtb3VzZVBvc2l0aW9uOiBbMCwgMF1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmVCcnVzaGluZ0xheWVyIGV4dGVuZHMgTGluZUxheWVyIHtcbiAgZ2V0U2hhZGVycygpIHtcbiAgICBjb25zdCBzaGFkZXJzID0gc3VwZXIuZ2V0U2hhZGVycygpO1xuICAgIGNvbnN0IGFkZG9ucyA9IGdldEV4dHJ1c2lvbiArIGlzUGlja2VkICsgaXNQdEluUmFuZ2U7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc2hhZGVycyxcbiAgICAgIHZzOiB0aGlzLnByb3BzLmZwNjQgPyBhZGRvbnMgKyB2czY0IDogYWRkb25zICsgdnNcbiAgICB9O1xuICB9XG5cbiAgaW5pdGlhbGl6ZVN0YXRlKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemVTdGF0ZSgpO1xuICAgIGNvbnN0IHthdHRyaWJ1dGVNYW5hZ2VyfSA9IHRoaXMuc3RhdGU7XG4gICAgYXR0cmlidXRlTWFuYWdlci5hZGRJbnN0YW5jZWQoe1xuICAgICAgaW5zdGFuY2VTdHJva2VXaWR0aDoge1xuICAgICAgICBzaXplOiAxLFxuICAgICAgICBhY2Nlc3NvcjogWydnZXRTdHJva2VXaWR0aCddLFxuICAgICAgICB1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VTdHJva2VXaWR0aFxuICAgICAgfSxcbiAgICAgIGluc3RhbmNlVGFyZ2V0Q29sb3JzOiB7XG4gICAgICAgIHNpemU6IDQsXG4gICAgICAgIHR5cGU6IEdMLlVOU0lHTkVEX0JZVEUsXG4gICAgICAgIGFjY2Vzc29yOiAnZ2V0VGFyZ2V0Q29sb3InLFxuICAgICAgICB1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VUYXJnZXRDb2xvcnNcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGRyYXcoe3VuaWZvcm1zfSkge1xuICAgIGNvbnN0IHtcbiAgICAgIGJydXNoU291cmNlLFxuICAgICAgYnJ1c2hUYXJnZXQsXG4gICAgICBicnVzaFJhZGl1cyxcbiAgICAgIGVuYWJsZUJydXNoaW5nLFxuICAgICAgcGlja2VkQ29sb3IsXG4gICAgICBtb3VzZVBvc2l0aW9uLFxuICAgICAgc3Ryb2tlU2NhbGVcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IHBpY2tlZCA9ICFBcnJheS5pc0FycmF5KHBpY2tlZENvbG9yKVxuICAgICAgPyBkZWZhdWx0UHJvcHMucGlja2VkQ29sb3JcbiAgICAgIDogcGlja2VkQ29sb3I7XG5cbiAgICBzdXBlci5kcmF3KHtcbiAgICAgIHVuaWZvcm1zOiB7XG4gICAgICAgIC4uLnVuaWZvcm1zLFxuICAgICAgICBicnVzaFNvdXJjZSxcbiAgICAgICAgYnJ1c2hUYXJnZXQsXG4gICAgICAgIGJydXNoUmFkaXVzLFxuICAgICAgICBlbmFibGVCcnVzaGluZyxcbiAgICAgICAgc3Ryb2tlU2NhbGUsXG4gICAgICAgIHBpY2tlZENvbG9yOiBuZXcgVWludDhDbGFtcGVkQXJyYXkoXG4gICAgICAgICAgIU51bWJlci5pc0Zpbml0ZShwaWNrZWRDb2xvclszXSkgPyBbLi4ucGlja2VkLCAyNTVdIDogcGlja2VkXG4gICAgICAgICksXG4gICAgICAgIG1vdXNlUG9zOiBtb3VzZVBvc2l0aW9uXG4gICAgICAgICAgPyBuZXcgRmxvYXQzMkFycmF5KHRoaXMudW5wcm9qZWN0KG1vdXNlUG9zaXRpb24pKVxuICAgICAgICAgIDogZGVmYXVsdFByb3BzLm1vdXNlUG9zaXRpb25cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNhbGN1bGF0ZUluc3RhbmNlU3Ryb2tlV2lkdGgoYXR0cmlidXRlKSB7XG4gICAgY29uc3Qge2RhdGEsIGdldFN0cm9rZVdpZHRofSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3ZhbHVlLCBzaXplfSA9IGF0dHJpYnV0ZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBvYmplY3Qgb2YgZGF0YSkge1xuICAgICAgY29uc3Qgd2lkdGggPSBnZXRTdHJva2VXaWR0aChvYmplY3QpO1xuICAgICAgdmFsdWVbaV0gPSBOdW1iZXIuaXNGaW5pdGUod2lkdGgpID8gd2lkdGggOiAxO1xuICAgICAgaSArPSBzaXplO1xuICAgIH1cbiAgfVxuXG4gIGNhbGN1bGF0ZUluc3RhbmNlVGFyZ2V0Q29sb3JzKGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHtkYXRhLCBnZXRUYXJnZXRDb2xvcn0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHt2YWx1ZSwgc2l6ZX0gPSBhdHRyaWJ1dGU7XG4gICAgbGV0IGkgPSAwO1xuICAgIGZvciAoY29uc3Qgb2JqZWN0IG9mIGRhdGEpIHtcbiAgICAgIGNvbnN0IGNvbG9yID0gZ2V0VGFyZ2V0Q29sb3Iob2JqZWN0KTtcbiAgICAgIHZhbHVlW2kgKyAwXSA9IGNvbG9yWzBdO1xuICAgICAgdmFsdWVbaSArIDFdID0gY29sb3JbMV07XG4gICAgICB2YWx1ZVtpICsgMl0gPSBjb2xvclsyXTtcbiAgICAgIHZhbHVlW2kgKyAzXSA9IGlzTmFOKGNvbG9yWzNdKSA/IDI1NSA6IGNvbG9yWzNdO1xuICAgICAgaSArPSBzaXplO1xuICAgIH1cbiAgfVxufVxuXG5MaW5lQnJ1c2hpbmdMYXllci5sYXllck5hbWUgPSAnTGluZUJydXNoaW5nTGF5ZXInO1xuTGluZUJydXNoaW5nTGF5ZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19