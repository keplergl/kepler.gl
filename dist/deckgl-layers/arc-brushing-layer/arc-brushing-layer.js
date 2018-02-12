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

var _isPicked = require('../../shaderlib/is-picked');

var _isPicked2 = _interopRequireDefault(_isPicked);

var _isPointInRange = require('../../shaderlib/is-point-in-range');

var _isPointInRange2 = _interopRequireDefault(_isPointInRange);

var _getExtrusionOffset = require('../../shaderlib/get-extrusion-offset.glsl');

var _getExtrusionOffset2 = _interopRequireDefault(_getExtrusionOffset);

var _arcBrushingLayerVertex = require('./arc-brushing-layer-vertex.glsl');

var _arcBrushingLayerVertex2 = _interopRequireDefault(_arcBrushingLayerVertex);

var _arcBrushingLayerVertex3 = require('./arc-brushing-layer-vertex-64.glsl');

var _arcBrushingLayerVertex4 = _interopRequireDefault(_arcBrushingLayerVertex3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright (c) 2015 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var defaultProps = (0, _extends3.default)({}, _deck.ArcLayer.defaultProps, {
  // show arc if source is in brush
  brushSource: true,
  // show arc if target is in brush
  brushTarget: true,
  enableBrushing: true,
  getStrokeWidth: function getStrokeWidth(d) {
    return d.strokeWidth;
  },
  strokeScale: 1,
  // brush radius in meters
  brushRadius: 100000,
  pickedColor: [254, 210, 26, 255],
  mousePosition: [0, 0]
});

var ArcBrushingLayer = function (_ArcLayer) {
  (0, _inherits3.default)(ArcBrushingLayer, _ArcLayer);

  function ArcBrushingLayer() {
    (0, _classCallCheck3.default)(this, ArcBrushingLayer);
    return (0, _possibleConstructorReturn3.default)(this, (ArcBrushingLayer.__proto__ || Object.getPrototypeOf(ArcBrushingLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(ArcBrushingLayer, [{
    key: 'getShaders',
    value: function getShaders() {
      var shaders = (0, _get3.default)(ArcBrushingLayer.prototype.__proto__ || Object.getPrototypeOf(ArcBrushingLayer.prototype), 'getShaders', this).call(this);
      var addons = _getExtrusionOffset2.default + _isPicked2.default + _isPointInRange2.default;

      return (0, _extends3.default)({}, shaders, {
        vs: addons + (this.props.fp64 ? _arcBrushingLayerVertex4.default : _arcBrushingLayerVertex2.default)
      });
    }
  }, {
    key: 'initializeState',
    value: function initializeState() {
      (0, _get3.default)(ArcBrushingLayer.prototype.__proto__ || Object.getPrototypeOf(ArcBrushingLayer.prototype), 'initializeState', this).call(this);
      var attributeManager = this.state.attributeManager;

      attributeManager.addInstanced({
        instanceStrokeWidth: {
          size: 1,
          accessor: ['getStrokeWidth'],
          update: this.calculateInstanceStrokeWidth
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
      (0, _get3.default)(ArcBrushingLayer.prototype.__proto__ || Object.getPrototypeOf(ArcBrushingLayer.prototype), 'draw', this).call(this, {
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
  }]);
  return ArcBrushingLayer;
}(_deck.ArcLayer);

exports.default = ArcBrushingLayer;


ArcBrushingLayer.layerName = 'ArcBrushingLayer';
ArcBrushingLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2FyYy1icnVzaGluZy1sYXllci9hcmMtYnJ1c2hpbmctbGF5ZXIuanMiXSwibmFtZXMiOlsiZGVmYXVsdFByb3BzIiwiYnJ1c2hTb3VyY2UiLCJicnVzaFRhcmdldCIsImVuYWJsZUJydXNoaW5nIiwiZ2V0U3Ryb2tlV2lkdGgiLCJkIiwic3Ryb2tlV2lkdGgiLCJzdHJva2VTY2FsZSIsImJydXNoUmFkaXVzIiwicGlja2VkQ29sb3IiLCJtb3VzZVBvc2l0aW9uIiwiQXJjQnJ1c2hpbmdMYXllciIsInNoYWRlcnMiLCJhZGRvbnMiLCJ2cyIsInByb3BzIiwiZnA2NCIsImF0dHJpYnV0ZU1hbmFnZXIiLCJzdGF0ZSIsImFkZEluc3RhbmNlZCIsImluc3RhbmNlU3Ryb2tlV2lkdGgiLCJzaXplIiwiYWNjZXNzb3IiLCJ1cGRhdGUiLCJjYWxjdWxhdGVJbnN0YW5jZVN0cm9rZVdpZHRoIiwidW5pZm9ybXMiLCJwaWNrZWQiLCJBcnJheSIsImlzQXJyYXkiLCJVaW50OENsYW1wZWRBcnJheSIsIk51bWJlciIsImlzRmluaXRlIiwibW91c2VQb3MiLCJGbG9hdDMyQXJyYXkiLCJ1bnByb2plY3QiLCJhdHRyaWJ1dGUiLCJkYXRhIiwidmFsdWUiLCJpIiwib2JqZWN0Iiwid2lkdGgiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7OztBQTNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFXQSxJQUFNQSwwQ0FDRCxlQUFTQSxZQURSO0FBRUo7QUFDQUMsZUFBYSxJQUhUO0FBSUo7QUFDQUMsZUFBYSxJQUxUO0FBTUpDLGtCQUFnQixJQU5aO0FBT0pD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KSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtBcmNMYXllcn0gZnJvbSAnZGVjay5nbCc7XG5cbmltcG9ydCBpc1BpY2tlZCBmcm9tICcuLi8uLi9zaGFkZXJsaWIvaXMtcGlja2VkJztcbmltcG9ydCBpc1B0SW5SYW5nZSBmcm9tICcuLi8uLi9zaGFkZXJsaWIvaXMtcG9pbnQtaW4tcmFuZ2UnO1xuaW1wb3J0IGdldEV4dHJ1c2lvbiBmcm9tICcuLi8uLi9zaGFkZXJsaWIvZ2V0LWV4dHJ1c2lvbi1vZmZzZXQuZ2xzbCc7XG5cbmltcG9ydCB2cyBmcm9tICcuL2FyYy1icnVzaGluZy1sYXllci12ZXJ0ZXguZ2xzbCc7XG5pbXBvcnQgdnM2NCBmcm9tICcuL2FyYy1icnVzaGluZy1sYXllci12ZXJ0ZXgtNjQuZ2xzbCc7XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgLi4uQXJjTGF5ZXIuZGVmYXVsdFByb3BzLFxuICAvLyBzaG93IGFyYyBpZiBzb3VyY2UgaXMgaW4gYnJ1c2hcbiAgYnJ1c2hTb3VyY2U6IHRydWUsXG4gIC8vIHNob3cgYXJjIGlmIHRhcmdldCBpcyBpbiBicnVzaFxuICBicnVzaFRhcmdldDogdHJ1ZSxcbiAgZW5hYmxlQnJ1c2hpbmc6IHRydWUsXG4gIGdldFN0cm9rZVdpZHRoOiBkID0+IGQuc3Ryb2tlV2lkdGgsXG4gIHN0cm9rZVNjYWxlOiAxLFxuICAvLyBicnVzaCByYWRpdXMgaW4gbWV0ZXJzXG4gIGJydXNoUmFkaXVzOiAxMDAwMDAsXG4gIHBpY2tlZENvbG9yOiBbMjU0LCAyMTAsIDI2LCAyNTVdLFxuICBtb3VzZVBvc2l0aW9uOiBbMCwgMF1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFyY0JydXNoaW5nTGF5ZXIgZXh0ZW5kcyBBcmNMYXllciB7XG4gIGdldFNoYWRlcnMoKSB7XG4gICAgY29uc3Qgc2hhZGVycyA9IHN1cGVyLmdldFNoYWRlcnMoKTtcbiAgICBjb25zdCBhZGRvbnMgPSBnZXRFeHRydXNpb24gKyBpc1BpY2tlZCArIGlzUHRJblJhbmdlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnNoYWRlcnMsXG4gICAgICB2czogYWRkb25zICsgKHRoaXMucHJvcHMuZnA2NCA/IHZzNjQgOiB2cylcbiAgICB9O1xuICB9XG5cbiAgaW5pdGlhbGl6ZVN0YXRlKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemVTdGF0ZSgpO1xuICAgIGNvbnN0IHthdHRyaWJ1dGVNYW5hZ2VyfSA9IHRoaXMuc3RhdGU7XG4gICAgYXR0cmlidXRlTWFuYWdlci5hZGRJbnN0YW5jZWQoe1xuICAgICAgaW5zdGFuY2VTdHJva2VXaWR0aDoge1xuICAgICAgICBzaXplOiAxLFxuICAgICAgICBhY2Nlc3NvcjogWydnZXRTdHJva2VXaWR0aCddLFxuICAgICAgICB1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VTdHJva2VXaWR0aFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZHJhdyh7dW5pZm9ybXN9KSB7XG4gICAgY29uc3Qge1xuICAgICAgYnJ1c2hTb3VyY2UsXG4gICAgICBicnVzaFRhcmdldCxcbiAgICAgIGJydXNoUmFkaXVzLFxuICAgICAgZW5hYmxlQnJ1c2hpbmcsXG4gICAgICBwaWNrZWRDb2xvcixcbiAgICAgIG1vdXNlUG9zaXRpb24sXG4gICAgICBzdHJva2VTY2FsZVxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgcGlja2VkID0gIUFycmF5LmlzQXJyYXkocGlja2VkQ29sb3IpXG4gICAgICA/IGRlZmF1bHRQcm9wcy5waWNrZWRDb2xvclxuICAgICAgOiBwaWNrZWRDb2xvcjtcbiAgICBzdXBlci5kcmF3KHtcbiAgICAgIHVuaWZvcm1zOiB7XG4gICAgICAgIC4uLnVuaWZvcm1zLFxuICAgICAgICBicnVzaFNvdXJjZSxcbiAgICAgICAgYnJ1c2hUYXJnZXQsXG4gICAgICAgIGJydXNoUmFkaXVzLFxuICAgICAgICBlbmFibGVCcnVzaGluZyxcbiAgICAgICAgc3Ryb2tlU2NhbGUsXG4gICAgICAgIHBpY2tlZENvbG9yOiBuZXcgVWludDhDbGFtcGVkQXJyYXkoXG4gICAgICAgICAgIU51bWJlci5pc0Zpbml0ZShwaWNrZWRDb2xvclszXSkgPyBbLi4ucGlja2VkLCAyNTVdIDogcGlja2VkXG4gICAgICAgICksXG4gICAgICAgIG1vdXNlUG9zOiBtb3VzZVBvc2l0aW9uXG4gICAgICAgICAgPyBuZXcgRmxvYXQzMkFycmF5KHRoaXMudW5wcm9qZWN0KG1vdXNlUG9zaXRpb24pKVxuICAgICAgICAgIDogZGVmYXVsdFByb3BzLm1vdXNlUG9zaXRpb25cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNhbGN1bGF0ZUluc3RhbmNlU3Ryb2tlV2lkdGgoYXR0cmlidXRlKSB7XG4gICAgY29uc3Qge2RhdGEsIGdldFN0cm9rZVdpZHRofSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3ZhbHVlLCBzaXplfSA9IGF0dHJpYnV0ZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBvYmplY3Qgb2YgZGF0YSkge1xuICAgICAgY29uc3Qgd2lkdGggPSBnZXRTdHJva2VXaWR0aChvYmplY3QpO1xuICAgICAgdmFsdWVbaV0gPSBOdW1iZXIuaXNGaW5pdGUod2lkdGgpID8gd2lkdGggOiAxO1xuICAgICAgaSArPSBzaXplO1xuICAgIH1cbiAgfVxufVxuXG5BcmNCcnVzaGluZ0xheWVyLmxheWVyTmFtZSA9ICdBcmNCcnVzaGluZ0xheWVyJztcbkFyY0JydXNoaW5nTGF5ZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19