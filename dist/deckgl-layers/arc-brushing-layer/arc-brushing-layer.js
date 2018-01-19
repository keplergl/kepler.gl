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
    return (0, _possibleConstructorReturn3.default)(this, _ArcLayer.apply(this, arguments));
  }

  ArcBrushingLayer.prototype.getShaders = function getShaders() {
    var shaders = _ArcLayer.prototype.getShaders.call(this);
    var addons = _getExtrusionOffset2.default + _isPicked2.default + _isPointInRange2.default;

    return (0, _extends3.default)({}, shaders, {
      vs: addons + (this.props.fp64 ? _arcBrushingLayerVertex4.default : _arcBrushingLayerVertex2.default)
    });
  };

  ArcBrushingLayer.prototype.initializeState = function initializeState() {
    _ArcLayer.prototype.initializeState.call(this);
    var attributeManager = this.state.attributeManager;

    attributeManager.addInstanced({
      instanceStrokeWidth: {
        size: 1,
        accessor: ['getStrokeWidth'],
        update: this.calculateInstanceStrokeWidth
      }
    });
  };

  ArcBrushingLayer.prototype.draw = function draw(_ref) {
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
    _ArcLayer.prototype.draw.call(this, {
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

  ArcBrushingLayer.prototype.calculateInstanceStrokeWidth = function calculateInstanceStrokeWidth(attribute) {
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

  return ArcBrushingLayer;
}(_deck.ArcLayer);

exports.default = ArcBrushingLayer;


ArcBrushingLayer.layerName = 'ArcBrushingLayer';
ArcBrushingLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2FyYy1icnVzaGluZy1sYXllci9hcmMtYnJ1c2hpbmctbGF5ZXIuanMiXSwibmFtZXMiOlsiZGVmYXVsdFByb3BzIiwiYnJ1c2hTb3VyY2UiLCJicnVzaFRhcmdldCIsImVuYWJsZUJydXNoaW5nIiwiZ2V0U3Ryb2tlV2lkdGgiLCJkIiwic3Ryb2tlV2lkdGgiLCJzdHJva2VTY2FsZSIsImJydXNoUmFkaXVzIiwicGlja2VkQ29sb3IiLCJtb3VzZVBvc2l0aW9uIiwiQXJjQnJ1c2hpbmdMYXllciIsImdldFNoYWRlcnMiLCJzaGFkZXJzIiwiYWRkb25zIiwidnMiLCJwcm9wcyIsImZwNjQiLCJpbml0aWFsaXplU3RhdGUiLCJhdHRyaWJ1dGVNYW5hZ2VyIiwic3RhdGUiLCJhZGRJbnN0YW5jZWQiLCJpbnN0YW5jZVN0cm9rZVdpZHRoIiwic2l6ZSIsImFjY2Vzc29yIiwidXBkYXRlIiwiY2FsY3VsYXRlSW5zdGFuY2VTdHJva2VXaWR0aCIsImRyYXciLCJ1bmlmb3JtcyIsInBpY2tlZCIsIkFycmF5IiwiaXNBcnJheSIsIlVpbnQ4Q2xhbXBlZEFycmF5IiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJtb3VzZVBvcyIsIkZsb2F0MzJBcnJheSIsInVucHJvamVjdCIsImF0dHJpYnV0ZSIsImRhdGEiLCJ2YWx1ZSIsImkiLCJvYmplY3QiLCJ3aWR0aCIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7Ozs7O0FBM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQVdBLElBQU1BLDBDQUNELGVBQVNBLFlBRFI7QUFFSjtBQUNBQyxlQUFhLElBSFQ7QUFJSjtBQUNBQyxlQUFhLElBTFQ7QUFNSkMsa0JBQWdCLElBTlo7QUFPSkMsa0JBQWdCO0FBQUEsV0FBS0MsRUFBRUMsV0FBUDtBQUFBLEdBUFo7QUFRSkMsZUFBYSxDQVJUO0FBU0o7QUFDQUMsZUFBYSxNQVZUO0FBV0pDLGVBQWEsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEVBQVgsRUFBZSxHQUFmLENBWFQ7QUFZSkMsaUJBQWUsQ0FBQyxDQUFELEVBQUksQ0FBSjtBQVpYLEVBQU47O0lBZXFCQyxnQjs7Ozs7Ozs7NkJBQ25CQyxVLHlCQUFhO0FBQ1gsUUFBTUMsVUFBVSxvQkFBTUQsVUFBTixXQUFoQjtBQUNBLFFBQU1FLFNBQVMsNEVBQWY7O0FBRUEsc0NBQ0tELE9BREw7QUFFRUUsVUFBSUQsVUFBVSxLQUFLRSxLQUFMLENBQVdDLElBQVgsc0VBQVY7QUFGTjtBQUlELEc7OzZCQUVEQyxlLDhCQUFrQjtBQUNoQix3QkFBTUEsZUFBTjtBQURnQixRQUVUQyxnQkFGUyxHQUVXLEtBQUtDLEtBRmhCLENBRVRELGdCQUZTOztBQUdoQkEscUJBQWlCRSxZQUFqQixDQUE4QjtBQUM1QkMsMkJBQXFCO0FBQ25CQyxjQUFNLENBRGE7QUFFbkJDLGtCQUFVLENBQUMsZ0JBQUQsQ0FGUztBQUduQkMsZ0JBQVEsS0FBS0M7QUFITTtBQURPLEtBQTlCO0FBT0QsRzs7NkJBRURDLEksdUJBQWlCO0FBQUEsUUFBWEMsUUFBVyxRQUFYQSxRQUFXO0FBQUEsaUJBU1gsS0FBS1osS0FUTTtBQUFBLFFBRWJmLFdBRmEsVUFFYkEsV0FGYTtBQUFBLFFBR2JDLFdBSGEsVUFHYkEsV0FIYTtBQUFBLFFBSWJNLFdBSmEsVUFJYkEsV0FKYTtBQUFBLFFBS2JMLGNBTGEsVUFLYkEsY0FMYTtBQUFBLFFBTWJNLFdBTmEsVUFNYkEsV0FOYTtBQUFBLFFBT2JDLGFBUGEsVUFPYkEsYUFQYTtBQUFBLFFBUWJILFdBUmEsVUFRYkEsV0FSYTs7O0FBV2YsUUFBTXNCLFNBQVMsQ0FBQ0MsTUFBTUMsT0FBTixDQUFjdEIsV0FBZCxDQUFELEdBQ1hULGFBQWFTLFdBREYsR0FFWEEsV0FGSjtBQUdBLHdCQUFNa0IsSUFBTixZQUFXO0FBQ1RDLDJDQUNLQSxRQURMO0FBRUUzQixnQ0FGRjtBQUdFQyxnQ0FIRjtBQUlFTSxnQ0FKRjtBQUtFTCxzQ0FMRjtBQU1FSSxnQ0FORjtBQU9FRSxxQkFBYSxJQUFJdUIsaUJBQUosQ0FDWCxDQUFDQyxPQUFPQyxRQUFQLENBQWdCekIsWUFBWSxDQUFaLENBQWhCLENBQUQsYUFBdUNvQixNQUF2QyxHQUErQyxHQUEvQyxLQUFzREEsTUFEM0MsQ0FQZjtBQVVFTSxrQkFBVXpCLGdCQUNOLElBQUkwQixZQUFKLENBQWlCLEtBQUtDLFNBQUwsQ0FBZTNCLGFBQWYsQ0FBakIsQ0FETSxHQUVOVixhQUFhVTtBQVpuQjtBQURTLEtBQVg7QUFnQkQsRzs7NkJBRURnQiw0Qix5Q0FBNkJZLFMsRUFBVztBQUFBLGtCQUNQLEtBQUt0QixLQURFO0FBQUEsUUFDL0J1QixJQUQrQixXQUMvQkEsSUFEK0I7QUFBQSxRQUN6Qm5DLGNBRHlCLFdBQ3pCQSxjQUR5QjtBQUFBLFFBRS9Cb0MsS0FGK0IsR0FFaEJGLFNBRmdCLENBRS9CRSxLQUYrQjtBQUFBLFFBRXhCakIsSUFGd0IsR0FFaEJlLFNBRmdCLENBRXhCZixJQUZ3Qjs7QUFHdEMsUUFBSWtCLElBQUksQ0FBUjtBQUNBLHlCQUFxQkYsSUFBckIsa0hBQTJCO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQSxVQUFoQkcsTUFBZ0I7O0FBQ3pCLFVBQU1DLFFBQVF2QyxlQUFlc0MsTUFBZixDQUFkO0FBQ0FGLFlBQU1DLENBQU4sSUFBV1IsT0FBT0MsUUFBUCxDQUFnQlMsS0FBaEIsSUFBeUJBLEtBQXpCLEdBQWlDLENBQTVDO0FBQ0FGLFdBQUtsQixJQUFMO0FBQ0Q7QUFDRixHOzs7OztrQkFoRWtCWixnQjs7O0FBbUVyQkEsaUJBQWlCaUMsU0FBakIsR0FBNkIsa0JBQTdCO0FBQ0FqQyxpQkFBaUJYLFlBQWpCLEdBQWdDQSxZQUFoQyIsImZpbGUiOiJhcmMtYnJ1c2hpbmctbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge0FyY0xheWVyfSBmcm9tICdkZWNrLmdsJztcblxuaW1wb3J0IGlzUGlja2VkIGZyb20gJy4uLy4uL3NoYWRlcmxpYi9pcy1waWNrZWQnO1xuaW1wb3J0IGlzUHRJblJhbmdlIGZyb20gJy4uLy4uL3NoYWRlcmxpYi9pcy1wb2ludC1pbi1yYW5nZSc7XG5pbXBvcnQgZ2V0RXh0cnVzaW9uIGZyb20gJy4uLy4uL3NoYWRlcmxpYi9nZXQtZXh0cnVzaW9uLW9mZnNldC5nbHNsJztcblxuaW1wb3J0IHZzIGZyb20gJy4vYXJjLWJydXNoaW5nLWxheWVyLXZlcnRleC5nbHNsJztcbmltcG9ydCB2czY0IGZyb20gJy4vYXJjLWJydXNoaW5nLWxheWVyLXZlcnRleC02NC5nbHNsJztcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAuLi5BcmNMYXllci5kZWZhdWx0UHJvcHMsXG4gIC8vIHNob3cgYXJjIGlmIHNvdXJjZSBpcyBpbiBicnVzaFxuICBicnVzaFNvdXJjZTogdHJ1ZSxcbiAgLy8gc2hvdyBhcmMgaWYgdGFyZ2V0IGlzIGluIGJydXNoXG4gIGJydXNoVGFyZ2V0OiB0cnVlLFxuICBlbmFibGVCcnVzaGluZzogdHJ1ZSxcbiAgZ2V0U3Ryb2tlV2lkdGg6IGQgPT4gZC5zdHJva2VXaWR0aCxcbiAgc3Ryb2tlU2NhbGU6IDEsXG4gIC8vIGJydXNoIHJhZGl1cyBpbiBtZXRlcnNcbiAgYnJ1c2hSYWRpdXM6IDEwMDAwMCxcbiAgcGlja2VkQ29sb3I6IFsyNTQsIDIxMCwgMjYsIDI1NV0sXG4gIG1vdXNlUG9zaXRpb246IFswLCAwXVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXJjQnJ1c2hpbmdMYXllciBleHRlbmRzIEFyY0xheWVyIHtcbiAgZ2V0U2hhZGVycygpIHtcbiAgICBjb25zdCBzaGFkZXJzID0gc3VwZXIuZ2V0U2hhZGVycygpO1xuICAgIGNvbnN0IGFkZG9ucyA9IGdldEV4dHJ1c2lvbiArIGlzUGlja2VkICsgaXNQdEluUmFuZ2U7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc2hhZGVycyxcbiAgICAgIHZzOiBhZGRvbnMgKyAodGhpcy5wcm9wcy5mcDY0ID8gdnM2NCA6IHZzKVxuICAgIH07XG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZVN0YXRlKCk7XG4gICAgY29uc3Qge2F0dHJpYnV0ZU1hbmFnZXJ9ID0gdGhpcy5zdGF0ZTtcbiAgICBhdHRyaWJ1dGVNYW5hZ2VyLmFkZEluc3RhbmNlZCh7XG4gICAgICBpbnN0YW5jZVN0cm9rZVdpZHRoOiB7XG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIGFjY2Vzc29yOiBbJ2dldFN0cm9rZVdpZHRoJ10sXG4gICAgICAgIHVwZGF0ZTogdGhpcy5jYWxjdWxhdGVJbnN0YW5jZVN0cm9rZVdpZHRoXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBkcmF3KHt1bmlmb3Jtc30pIHtcbiAgICBjb25zdCB7XG4gICAgICBicnVzaFNvdXJjZSxcbiAgICAgIGJydXNoVGFyZ2V0LFxuICAgICAgYnJ1c2hSYWRpdXMsXG4gICAgICBlbmFibGVCcnVzaGluZyxcbiAgICAgIHBpY2tlZENvbG9yLFxuICAgICAgbW91c2VQb3NpdGlvbixcbiAgICAgIHN0cm9rZVNjYWxlXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBwaWNrZWQgPSAhQXJyYXkuaXNBcnJheShwaWNrZWRDb2xvcilcbiAgICAgID8gZGVmYXVsdFByb3BzLnBpY2tlZENvbG9yXG4gICAgICA6IHBpY2tlZENvbG9yO1xuICAgIHN1cGVyLmRyYXcoe1xuICAgICAgdW5pZm9ybXM6IHtcbiAgICAgICAgLi4udW5pZm9ybXMsXG4gICAgICAgIGJydXNoU291cmNlLFxuICAgICAgICBicnVzaFRhcmdldCxcbiAgICAgICAgYnJ1c2hSYWRpdXMsXG4gICAgICAgIGVuYWJsZUJydXNoaW5nLFxuICAgICAgICBzdHJva2VTY2FsZSxcbiAgICAgICAgcGlja2VkQ29sb3I6IG5ldyBVaW50OENsYW1wZWRBcnJheShcbiAgICAgICAgICAhTnVtYmVyLmlzRmluaXRlKHBpY2tlZENvbG9yWzNdKSA/IFsuLi5waWNrZWQsIDI1NV0gOiBwaWNrZWRcbiAgICAgICAgKSxcbiAgICAgICAgbW91c2VQb3M6IG1vdXNlUG9zaXRpb25cbiAgICAgICAgICA/IG5ldyBGbG9hdDMyQXJyYXkodGhpcy51bnByb2plY3QobW91c2VQb3NpdGlvbikpXG4gICAgICAgICAgOiBkZWZhdWx0UHJvcHMubW91c2VQb3NpdGlvblxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgY2FsY3VsYXRlSW5zdGFuY2VTdHJva2VXaWR0aChhdHRyaWJ1dGUpIHtcbiAgICBjb25zdCB7ZGF0YSwgZ2V0U3Ryb2tlV2lkdGh9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7dmFsdWUsIHNpemV9ID0gYXR0cmlidXRlO1xuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKGNvbnN0IG9iamVjdCBvZiBkYXRhKSB7XG4gICAgICBjb25zdCB3aWR0aCA9IGdldFN0cm9rZVdpZHRoKG9iamVjdCk7XG4gICAgICB2YWx1ZVtpXSA9IE51bWJlci5pc0Zpbml0ZSh3aWR0aCkgPyB3aWR0aCA6IDE7XG4gICAgICBpICs9IHNpemU7XG4gICAgfVxuICB9XG59XG5cbkFyY0JydXNoaW5nTGF5ZXIubGF5ZXJOYW1lID0gJ0FyY0JydXNoaW5nTGF5ZXInO1xuQXJjQnJ1c2hpbmdMYXllci5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG4iXX0=