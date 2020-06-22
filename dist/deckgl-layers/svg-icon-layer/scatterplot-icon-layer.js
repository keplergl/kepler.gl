"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _layers = require("@deck.gl/layers");

var _core = require("@luma.gl/core");

var _constants = _interopRequireDefault(require("@luma.gl/constants"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var DEFAULT_POS = [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0];

var ScatterplotIconLayer =
/*#__PURE__*/
function (_ScatterplotLayer) {
  (0, _inherits2["default"])(ScatterplotIconLayer, _ScatterplotLayer);

  function ScatterplotIconLayer() {
    (0, _classCallCheck2["default"])(this, ScatterplotIconLayer);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ScatterplotIconLayer).apply(this, arguments));
  }

  (0, _createClass2["default"])(ScatterplotIconLayer, [{
    key: "_getModel",
    value: function _getModel(gl) {
      // use default scatterplot shaders
      var shaders = this.getShaders();
      var iconGeometry = this.props.iconGeometry;
      var geometry = iconGeometry ? new _core.Geometry({
        drawMode: _constants["default"].TRIANGLES,
        attributes: {
          positions: new Float32Array(iconGeometry)
        }
      }) : new _core.Geometry({
        drawMode: _constants["default"].TRIANGLE_FAN,
        attributes: {
          positions: new Float32Array(DEFAULT_POS)
        }
      });
      return new _core.Model(gl, _objectSpread({}, shaders, {
        id: this.props.id,
        geometry: geometry,
        isInstanced: true,
        shaderCache: this.context.shaderCache
      }));
    }
  }]);
  return ScatterplotIconLayer;
}(_layers.ScatterplotLayer);

exports["default"] = ScatterplotIconLayer;
ScatterplotIconLayer.layerName = 'ScatterplotIconLayer';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL3N2Zy1pY29uLWxheWVyL3NjYXR0ZXJwbG90LWljb24tbGF5ZXIuanMiXSwibmFtZXMiOlsiREVGQVVMVF9QT1MiLCJTY2F0dGVycGxvdEljb25MYXllciIsImdsIiwic2hhZGVycyIsImdldFNoYWRlcnMiLCJpY29uR2VvbWV0cnkiLCJwcm9wcyIsImdlb21ldHJ5IiwiR2VvbWV0cnkiLCJkcmF3TW9kZSIsIkdMIiwiVFJJQU5HTEVTIiwiYXR0cmlidXRlcyIsInBvc2l0aW9ucyIsIkZsb2F0MzJBcnJheSIsIlRSSUFOR0xFX0ZBTiIsIk1vZGVsIiwiaWQiLCJpc0luc3RhbmNlZCIsInNoYWRlckNhY2hlIiwiY29udGV4dCIsIlNjYXR0ZXJwbG90TGF5ZXIiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFGLEVBQUssQ0FBQyxDQUFOLEVBQVMsQ0FBVCxFQUFZLENBQUMsQ0FBYixFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQixDQUEvQixFQUFrQyxDQUFDLENBQW5DLEVBQXNDLENBQXRDLENBQXBCOztJQUNxQkMsb0I7Ozs7Ozs7Ozs7Ozs4QkFDVEMsRSxFQUFJO0FBQ1o7QUFDQSxVQUFNQyxPQUFPLEdBQUcsS0FBS0MsVUFBTCxFQUFoQjtBQUZZLFVBSUxDLFlBSkssR0FJVyxLQUFLQyxLQUpoQixDQUlMRCxZQUpLO0FBTVosVUFBTUUsUUFBUSxHQUFHRixZQUFZLEdBQ3pCLElBQUlHLGNBQUosQ0FBYTtBQUNYQyxRQUFBQSxRQUFRLEVBQUVDLHNCQUFHQyxTQURGO0FBRVhDLFFBQUFBLFVBQVUsRUFBRTtBQUNWQyxVQUFBQSxTQUFTLEVBQUUsSUFBSUMsWUFBSixDQUFpQlQsWUFBakI7QUFERDtBQUZELE9BQWIsQ0FEeUIsR0FPekIsSUFBSUcsY0FBSixDQUFhO0FBQ1hDLFFBQUFBLFFBQVEsRUFBRUMsc0JBQUdLLFlBREY7QUFFWEgsUUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLFVBQUFBLFNBQVMsRUFBRSxJQUFJQyxZQUFKLENBQWlCZCxXQUFqQjtBQUREO0FBRkQsT0FBYixDQVBKO0FBY0EsYUFBTyxJQUFJZ0IsV0FBSixDQUFVZCxFQUFWLG9CQUNGQyxPQURFO0FBRUxjLFFBQUFBLEVBQUUsRUFBRSxLQUFLWCxLQUFMLENBQVdXLEVBRlY7QUFHTFYsUUFBQUEsUUFBUSxFQUFSQSxRQUhLO0FBSUxXLFFBQUFBLFdBQVcsRUFBRSxJQUpSO0FBS0xDLFFBQUFBLFdBQVcsRUFBRSxLQUFLQyxPQUFMLENBQWFEO0FBTHJCLFNBQVA7QUFPRDs7O0VBNUIrQ0Usd0I7OztBQStCbERwQixvQkFBb0IsQ0FBQ3FCLFNBQXJCLEdBQWlDLHNCQUFqQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7U2NhdHRlcnBsb3RMYXllcn0gZnJvbSAnQGRlY2suZ2wvbGF5ZXJzJztcbmltcG9ydCB7R2VvbWV0cnksIE1vZGVsfSBmcm9tICdAbHVtYS5nbC9jb3JlJztcbmltcG9ydCBHTCBmcm9tICdAbHVtYS5nbC9jb25zdGFudHMnO1xuXG5jb25zdCBERUZBVUxUX1BPUyA9IFstMSwgLTEsIDAsIC0xLCAxLCAwLCAxLCAxLCAwLCAxLCAtMSwgMF07XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2F0dGVycGxvdEljb25MYXllciBleHRlbmRzIFNjYXR0ZXJwbG90TGF5ZXIge1xuICBfZ2V0TW9kZWwoZ2wpIHtcbiAgICAvLyB1c2UgZGVmYXVsdCBzY2F0dGVycGxvdCBzaGFkZXJzXG4gICAgY29uc3Qgc2hhZGVycyA9IHRoaXMuZ2V0U2hhZGVycygpO1xuXG4gICAgY29uc3Qge2ljb25HZW9tZXRyeX0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBpY29uR2VvbWV0cnlcbiAgICAgID8gbmV3IEdlb21ldHJ5KHtcbiAgICAgICAgICBkcmF3TW9kZTogR0wuVFJJQU5HTEVTLFxuICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIHBvc2l0aW9uczogbmV3IEZsb2F0MzJBcnJheShpY29uR2VvbWV0cnkpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgOiBuZXcgR2VvbWV0cnkoe1xuICAgICAgICAgIGRyYXdNb2RlOiBHTC5UUklBTkdMRV9GQU4sXG4gICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgcG9zaXRpb25zOiBuZXcgRmxvYXQzMkFycmF5KERFRkFVTFRfUE9TKVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IE1vZGVsKGdsLCB7XG4gICAgICAuLi5zaGFkZXJzLFxuICAgICAgaWQ6IHRoaXMucHJvcHMuaWQsXG4gICAgICBnZW9tZXRyeSxcbiAgICAgIGlzSW5zdGFuY2VkOiB0cnVlLFxuICAgICAgc2hhZGVyQ2FjaGU6IHRoaXMuY29udGV4dC5zaGFkZXJDYWNoZVxuICAgIH0pO1xuICB9XG59XG5cblNjYXR0ZXJwbG90SWNvbkxheWVyLmxheWVyTmFtZSA9ICdTY2F0dGVycGxvdEljb25MYXllcic7XG4iXX0=