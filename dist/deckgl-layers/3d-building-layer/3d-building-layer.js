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

var _core = require("@deck.gl/core");

var _geoLayers = require("@deck.gl/geo-layers");

var _dBuildingUtils = require("./3d-building-utils");

var _layers = require("@deck.gl/layers");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var ThreeDBuildingLayer =
/*#__PURE__*/
function (_CompositeLayer) {
  (0, _inherits2["default"])(ThreeDBuildingLayer, _CompositeLayer);

  function ThreeDBuildingLayer() {
    (0, _classCallCheck2["default"])(this, ThreeDBuildingLayer);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ThreeDBuildingLayer).apply(this, arguments));
  }

  (0, _createClass2["default"])(ThreeDBuildingLayer, [{
    key: "renderSubLayers",
    // this layer add its subLayers to the redux store, and push sample data
    value: function renderSubLayers(props) {
      return new _layers.SolidPolygonLayer(_objectSpread({}, props, {
        parameter: {
          blendFunc: ['SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA', 'ONE', 'ONE_MINUS_SRC_ALPHA'],
          blendEquation: ['FUNC_ADD', 'FUNC_ADD']
        },
        extruded: true,
        opacity: 1,
        filled: true,
        getElevation: function getElevation(feature) {
          return feature.properties.height || 0;
        },
        getPolygon: function getPolygon(feature) {
          return feature.coordinates;
        },
        getFillColor: this.props.threeDBuildingColor
      }));
    }
  }, {
    key: "renderLayers",
    value: function renderLayers() {
      var _this = this;

      return [new _geoLayers.TileLayer({
        getTileData: function getTileData(args) {
          return (0, _dBuildingUtils.getTileData)(_this.props.mapboxApiUrl, _this.props.mapboxApiAccessToken, args);
        },
        minZoom: 13,
        renderSubLayers: this.renderSubLayers.bind(this),
        updateTriggers: this.props.updateTriggers
      })];
    }
  }]);
  return ThreeDBuildingLayer;
}(_core.CompositeLayer);

exports["default"] = ThreeDBuildingLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzLzNkLWJ1aWxkaW5nLWxheWVyLzNkLWJ1aWxkaW5nLWxheWVyLmpzIl0sIm5hbWVzIjpbIlRocmVlREJ1aWxkaW5nTGF5ZXIiLCJwcm9wcyIsIlNvbGlkUG9seWdvbkxheWVyIiwicGFyYW1ldGVyIiwiYmxlbmRGdW5jIiwiYmxlbmRFcXVhdGlvbiIsImV4dHJ1ZGVkIiwib3BhY2l0eSIsImZpbGxlZCIsImdldEVsZXZhdGlvbiIsImZlYXR1cmUiLCJwcm9wZXJ0aWVzIiwiaGVpZ2h0IiwiZ2V0UG9seWdvbiIsImNvb3JkaW5hdGVzIiwiZ2V0RmlsbENvbG9yIiwidGhyZWVEQnVpbGRpbmdDb2xvciIsIkRlY2tHTFRpbGVMYXllciIsImdldFRpbGVEYXRhIiwiYXJncyIsIm1hcGJveEFwaVVybCIsIm1hcGJveEFwaUFjY2Vzc1Rva2VuIiwibWluWm9vbSIsInJlbmRlclN1YkxheWVycyIsImJpbmQiLCJ1cGRhdGVUcmlnZ2VycyIsIkNvbXBvc2l0ZUxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztJQUVxQkEsbUI7Ozs7Ozs7Ozs7OztBQUNuQjtvQ0FFZ0JDLEssRUFBTztBQUNyQixhQUFPLElBQUlDLHlCQUFKLG1CQUNGRCxLQURFO0FBRUxFLFFBQUFBLFNBQVMsRUFBRTtBQUNUQyxVQUFBQSxTQUFTLEVBQUUsQ0FBQyxXQUFELEVBQWMscUJBQWQsRUFBcUMsS0FBckMsRUFBNEMscUJBQTVDLENBREY7QUFFVEMsVUFBQUEsYUFBYSxFQUFFLENBQUMsVUFBRCxFQUFhLFVBQWI7QUFGTixTQUZOO0FBTUxDLFFBQUFBLFFBQVEsRUFBRSxJQU5MO0FBT0xDLFFBQUFBLE9BQU8sRUFBRSxDQVBKO0FBUUxDLFFBQUFBLE1BQU0sRUFBRSxJQVJIO0FBU0xDLFFBQUFBLFlBQVksRUFBRSxzQkFBQUMsT0FBTztBQUFBLGlCQUFJQSxPQUFPLENBQUNDLFVBQVIsQ0FBbUJDLE1BQW5CLElBQTZCLENBQWpDO0FBQUEsU0FUaEI7QUFVTEMsUUFBQUEsVUFBVSxFQUFFLG9CQUFBSCxPQUFPO0FBQUEsaUJBQUlBLE9BQU8sQ0FBQ0ksV0FBWjtBQUFBLFNBVmQ7QUFXTEMsUUFBQUEsWUFBWSxFQUFFLEtBQUtkLEtBQUwsQ0FBV2U7QUFYcEIsU0FBUDtBQWFEOzs7bUNBRWM7QUFBQTs7QUFDYixhQUFPLENBQ0wsSUFBSUMsb0JBQUosQ0FBb0I7QUFDbEJDLFFBQUFBLFdBQVcsRUFBRSxxQkFBQUMsSUFBSTtBQUFBLGlCQUNmLGlDQUFZLEtBQUksQ0FBQ2xCLEtBQUwsQ0FBV21CLFlBQXZCLEVBQXFDLEtBQUksQ0FBQ25CLEtBQUwsQ0FBV29CLG9CQUFoRCxFQUFzRUYsSUFBdEUsQ0FEZTtBQUFBLFNBREM7QUFHbEJHLFFBQUFBLE9BQU8sRUFBRSxFQUhTO0FBSWxCQyxRQUFBQSxlQUFlLEVBQUUsS0FBS0EsZUFBTCxDQUFxQkMsSUFBckIsQ0FBMEIsSUFBMUIsQ0FKQztBQUtsQkMsUUFBQUEsY0FBYyxFQUFFLEtBQUt4QixLQUFMLENBQVd3QjtBQUxULE9BQXBCLENBREssQ0FBUDtBQVNEOzs7RUE3QjhDQyxvQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7Q29tcG9zaXRlTGF5ZXJ9IGZyb20gJ0BkZWNrLmdsL2NvcmUnO1xuaW1wb3J0IHtUaWxlTGF5ZXIgYXMgRGVja0dMVGlsZUxheWVyfSBmcm9tICdAZGVjay5nbC9nZW8tbGF5ZXJzJztcbmltcG9ydCB7Z2V0VGlsZURhdGF9IGZyb20gJy4vM2QtYnVpbGRpbmctdXRpbHMnO1xuaW1wb3J0IHtTb2xpZFBvbHlnb25MYXllcn0gZnJvbSAnQGRlY2suZ2wvbGF5ZXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGhyZWVEQnVpbGRpbmdMYXllciBleHRlbmRzIENvbXBvc2l0ZUxheWVyIHtcbiAgLy8gdGhpcyBsYXllciBhZGQgaXRzIHN1YkxheWVycyB0byB0aGUgcmVkdXggc3RvcmUsIGFuZCBwdXNoIHNhbXBsZSBkYXRhXG5cbiAgcmVuZGVyU3ViTGF5ZXJzKHByb3BzKSB7XG4gICAgcmV0dXJuIG5ldyBTb2xpZFBvbHlnb25MYXllcih7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIHBhcmFtZXRlcjoge1xuICAgICAgICBibGVuZEZ1bmM6IFsnU1JDX0FMUEhBJywgJ09ORV9NSU5VU19TUkNfQUxQSEEnLCAnT05FJywgJ09ORV9NSU5VU19TUkNfQUxQSEEnXSxcbiAgICAgICAgYmxlbmRFcXVhdGlvbjogWydGVU5DX0FERCcsICdGVU5DX0FERCddXG4gICAgICB9LFxuICAgICAgZXh0cnVkZWQ6IHRydWUsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgZmlsbGVkOiB0cnVlLFxuICAgICAgZ2V0RWxldmF0aW9uOiBmZWF0dXJlID0+IGZlYXR1cmUucHJvcGVydGllcy5oZWlnaHQgfHwgMCxcbiAgICAgIGdldFBvbHlnb246IGZlYXR1cmUgPT4gZmVhdHVyZS5jb29yZGluYXRlcyxcbiAgICAgIGdldEZpbGxDb2xvcjogdGhpcy5wcm9wcy50aHJlZURCdWlsZGluZ0NvbG9yXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJMYXllcnMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIG5ldyBEZWNrR0xUaWxlTGF5ZXIoe1xuICAgICAgICBnZXRUaWxlRGF0YTogYXJncyA9PlxuICAgICAgICAgIGdldFRpbGVEYXRhKHRoaXMucHJvcHMubWFwYm94QXBpVXJsLCB0aGlzLnByb3BzLm1hcGJveEFwaUFjY2Vzc1Rva2VuLCBhcmdzKSxcbiAgICAgICAgbWluWm9vbTogMTMsXG4gICAgICAgIHJlbmRlclN1YkxheWVyczogdGhpcy5yZW5kZXJTdWJMYXllcnMuYmluZCh0aGlzKSxcbiAgICAgICAgdXBkYXRlVHJpZ2dlcnM6IHRoaXMucHJvcHMudXBkYXRlVHJpZ2dlcnNcbiAgICAgIH0pXG4gICAgXTtcbiAgfVxufVxuIl19