"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _extensions = require("@deck.gl/extensions");

var _lineLayerIcon = _interopRequireDefault(require("./line-layer-icon"));

var _arcLayer = _interopRequireDefault(require("../arc-layer/arc-layer"));

var _lineLayer = _interopRequireDefault(require("../../deckgl-layers/line-layer/line-layer"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var LineLayer =
/*#__PURE__*/
function (_ArcLayer) {
  (0, _inherits2["default"])(LineLayer, _ArcLayer);

  function LineLayer() {
    (0, _classCallCheck2["default"])(this, LineLayer);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(LineLayer).apply(this, arguments));
  }

  (0, _createClass2["default"])(LineLayer, [{
    key: "renderLayer",
    value: function renderLayer(opts) {
      var data = opts.data,
          gpuFilter = opts.gpuFilter,
          objectHovered = opts.objectHovered,
          interactionConfig = opts.interactionConfig;
      var layerProps = {
        widthScale: this.config.visConfig.thickness
      };
      var colorUpdateTriggers = {
        color: this.config.color,
        colorField: this.config.colorField,
        colorRange: this.config.visConfig.colorRange,
        colorScale: this.config.colorScale,
        targetColor: this.config.visConfig.targetColor
      };
      var defaultLayerProps = this.getDefaultDeckLayerProps(opts);
      return [// base layer
      new _lineLayer["default"](_objectSpread({}, defaultLayerProps, {}, this.getBrushingExtensionProps(interactionConfig, 'source_target'), {}, data, {}, layerProps, {
        getColor: data.getSourceColor,
        updateTriggers: {
          getFilterValue: gpuFilter.filterValueUpdateTriggers,
          getWidth: {
            sizeField: this.config.sizeField,
            sizeRange: this.config.visConfig.sizeRange,
            sizeScale: this.config.sizeScale
          },
          getColor: colorUpdateTriggers,
          getTargetColor: colorUpdateTriggers
        },
        extensions: [].concat((0, _toConsumableArray2["default"])(defaultLayerProps.extensions), [new _extensions.BrushingExtension()])
      }))].concat((0, _toConsumableArray2["default"])(this.isLayerHovered(objectHovered) ? [new _lineLayer["default"](_objectSpread({}, this.getDefaultHoverLayerProps(), {}, layerProps, {
        data: [objectHovered.object],
        getColor: this.config.highlightColor,
        getTargetColor: this.config.highlightColor,
        getWidth: data.getWidth
      }))] : []));
    }
  }, {
    key: "type",
    get: function get() {
      return 'line';
    }
  }, {
    key: "layerIcon",
    get: function get() {
      return _lineLayerIcon["default"];
    }
  }], [{
    key: "findDefaultLayerProps",
    value: function findDefaultLayerProps(_ref) {
      var _ref$fieldPairs = _ref.fieldPairs,
          fieldPairs = _ref$fieldPairs === void 0 ? [] : _ref$fieldPairs;

      if (fieldPairs.length < 2) {
        return {
          props: []
        };
      }

      var props = {}; // connect the first two point layer with arc

      props.columns = {
        lat0: fieldPairs[0].pair.lat,
        lng0: fieldPairs[0].pair.lng,
        lat1: fieldPairs[1].pair.lat,
        lng1: fieldPairs[1].pair.lng
      };
      props.label = "".concat(fieldPairs[0].defaultName, " -> ").concat(fieldPairs[1].defaultName, " line");
      return {
        props: [props]
      };
    }
  }]);
  return LineLayer;
}(_arcLayer["default"]);

exports["default"] = LineLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvbGluZS1sYXllci9saW5lLWxheWVyLmpzIl0sIm5hbWVzIjpbIkxpbmVMYXllciIsIm9wdHMiLCJkYXRhIiwiZ3B1RmlsdGVyIiwib2JqZWN0SG92ZXJlZCIsImludGVyYWN0aW9uQ29uZmlnIiwibGF5ZXJQcm9wcyIsIndpZHRoU2NhbGUiLCJjb25maWciLCJ2aXNDb25maWciLCJ0aGlja25lc3MiLCJjb2xvclVwZGF0ZVRyaWdnZXJzIiwiY29sb3IiLCJjb2xvckZpZWxkIiwiY29sb3JSYW5nZSIsImNvbG9yU2NhbGUiLCJ0YXJnZXRDb2xvciIsImRlZmF1bHRMYXllclByb3BzIiwiZ2V0RGVmYXVsdERlY2tMYXllclByb3BzIiwiRW5oYW5jZWRMaW5lTGF5ZXIiLCJnZXRCcnVzaGluZ0V4dGVuc2lvblByb3BzIiwiZ2V0Q29sb3IiLCJnZXRTb3VyY2VDb2xvciIsInVwZGF0ZVRyaWdnZXJzIiwiZ2V0RmlsdGVyVmFsdWUiLCJmaWx0ZXJWYWx1ZVVwZGF0ZVRyaWdnZXJzIiwiZ2V0V2lkdGgiLCJzaXplRmllbGQiLCJzaXplUmFuZ2UiLCJzaXplU2NhbGUiLCJnZXRUYXJnZXRDb2xvciIsImV4dGVuc2lvbnMiLCJCcnVzaGluZ0V4dGVuc2lvbiIsImlzTGF5ZXJIb3ZlcmVkIiwiZ2V0RGVmYXVsdEhvdmVyTGF5ZXJQcm9wcyIsIm9iamVjdCIsImhpZ2hsaWdodENvbG9yIiwiTGluZUxheWVySWNvbiIsImZpZWxkUGFpcnMiLCJsZW5ndGgiLCJwcm9wcyIsImNvbHVtbnMiLCJsYXQwIiwicGFpciIsImxhdCIsImxuZzAiLCJsbmciLCJsYXQxIiwibG5nMSIsImxhYmVsIiwiZGVmYXVsdE5hbWUiLCJBcmNMYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7OztJQUVxQkEsUzs7Ozs7Ozs7Ozs7O2dDQTJCUEMsSSxFQUFNO0FBQUEsVUFDVEMsSUFE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LENBQVYsQ0FBY0ssSUFBZCxDQUFtQkcsR0FGWDtBQUdkQyxRQUFBQSxJQUFJLEVBQUVULFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY0ssSUFBZCxDQUFtQkMsR0FIWDtBQUlkSSxRQUFBQSxJQUFJLEVBQUVWLFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY0ssSUFBZCxDQUFtQkc7QUFKWCxPQUFoQjtBQU1BTixNQUFBQSxLQUFLLENBQUNTLEtBQU4sYUFBaUJYLFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY1ksV0FBL0IsaUJBQWlEWixVQUFVLENBQUMsQ0FBRCxDQUFWLENBQWNZLFdBQS9EO0FBRUEsYUFBTztBQUFDVixRQUFBQSxLQUFLLEVBQUUsQ0FBQ0EsS0FBRDtBQUFSLE9BQVA7QUFDRDs7O0VBekJvQ1csb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge0JydXNoaW5nRXh0ZW5zaW9ufSBmcm9tICdAZGVjay5nbC9leHRlbnNpb25zJztcblxuaW1wb3J0IExpbmVMYXllckljb24gZnJvbSAnLi9saW5lLWxheWVyLWljb24nO1xuaW1wb3J0IEFyY0xheWVyIGZyb20gJy4uL2FyYy1sYXllci9hcmMtbGF5ZXInO1xuaW1wb3J0IEVuaGFuY2VkTGluZUxheWVyIGZyb20gJ2RlY2tnbC1sYXllcnMvbGluZS1sYXllci9saW5lLWxheWVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZUxheWVyIGV4dGVuZHMgQXJjTGF5ZXIge1xuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gJ2xpbmUnO1xuICB9XG5cbiAgZ2V0IGxheWVySWNvbigpIHtcbiAgICByZXR1cm4gTGluZUxheWVySWNvbjtcbiAgfVxuXG4gIHN0YXRpYyBmaW5kRGVmYXVsdExheWVyUHJvcHMoe2ZpZWxkUGFpcnMgPSBbXX0pIHtcbiAgICBpZiAoZmllbGRQYWlycy5sZW5ndGggPCAyKSB7XG4gICAgICByZXR1cm4ge3Byb3BzOiBbXX07XG4gICAgfVxuICAgIGNvbnN0IHByb3BzID0ge307XG5cbiAgICAvLyBjb25uZWN0IHRoZSBmaXJzdCB0d28gcG9pbnQgbGF5ZXIgd2l0aCBhcmNcbiAgICBwcm9wcy5jb2x1bW5zID0ge1xuICAgICAgbGF0MDogZmllbGRQYWlyc1swXS5wYWlyLmxhdCxcbiAgICAgIGxuZzA6IGZpZWxkUGFpcnNbMF0ucGFpci5sbmcsXG4gICAgICBsYXQxOiBmaWVsZFBhaXJzWzFdLnBhaXIubGF0LFxuICAgICAgbG5nMTogZmllbGRQYWlyc1sxXS5wYWlyLmxuZ1xuICAgIH07XG4gICAgcHJvcHMubGFiZWwgPSBgJHtmaWVsZFBhaXJzWzBdLmRlZmF1bHROYW1lfSAtPiAke2ZpZWxkUGFpcnNbMV0uZGVmYXVsdE5hbWV9IGxpbmVgO1xuXG4gICAgcmV0dXJuIHtwcm9wczogW3Byb3BzXX07XG4gIH1cblxuICByZW5kZXJMYXllcihvcHRzKSB7XG4gICAgY29uc3Qge2RhdGEsIGdwdUZpbHRlciwgb2JqZWN0SG92ZXJlZCwgaW50ZXJhY3Rpb25Db25maWd9ID0gb3B0cztcblxuICAgIGNvbnN0IGxheWVyUHJvcHMgPSB7XG4gICAgICB3aWR0aFNjYWxlOiB0aGlzLmNvbmZpZy52aXNDb25maWcudGhpY2tuZXNzXG4gICAgfTtcblxuICAgIGNvbnN0IGNvbG9yVXBkYXRlVHJpZ2dlcnMgPSB7XG4gICAgICBjb2xvcjogdGhpcy5jb25maWcuY29sb3IsXG4gICAgICBjb2xvckZpZWxkOiB0aGlzLmNvbmZpZy5jb2xvckZpZWxkLFxuICAgICAgY29sb3JSYW5nZTogdGhpcy5jb25maWcudmlzQ29uZmlnLmNvbG9yUmFuZ2UsXG4gICAgICBjb2xvclNjYWxlOiB0aGlzLmNvbmZpZy5jb2xvclNjYWxlLFxuICAgICAgdGFyZ2V0Q29sb3I6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy50YXJnZXRDb2xvclxuICAgIH07XG5cbiAgICBjb25zdCBkZWZhdWx0TGF5ZXJQcm9wcyA9IHRoaXMuZ2V0RGVmYXVsdERlY2tMYXllclByb3BzKG9wdHMpO1xuICAgIHJldHVybiBbXG4gICAgICAvLyBiYXNlIGxheWVyXG4gICAgICBuZXcgRW5oYW5jZWRMaW5lTGF5ZXIoe1xuICAgICAgICAuLi5kZWZhdWx0TGF5ZXJQcm9wcyxcbiAgICAgICAgLi4udGhpcy5nZXRCcnVzaGluZ0V4dGVuc2lvblByb3BzKGludGVyYWN0aW9uQ29uZmlnLCAnc291cmNlX3RhcmdldCcpLFxuICAgICAgICAuLi5kYXRhLFxuICAgICAgICAuLi5sYXllclByb3BzLFxuICAgICAgICBnZXRDb2xvcjogZGF0YS5nZXRTb3VyY2VDb2xvcixcbiAgICAgICAgdXBkYXRlVHJpZ2dlcnM6IHtcbiAgICAgICAgICBnZXRGaWx0ZXJWYWx1ZTogZ3B1RmlsdGVyLmZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnMsXG4gICAgICAgICAgZ2V0V2lkdGg6IHtcbiAgICAgICAgICAgIHNpemVGaWVsZDogdGhpcy5jb25maWcuc2l6ZUZpZWxkLFxuICAgICAgICAgICAgc2l6ZVJhbmdlOiB0aGlzLmNvbmZpZy52aXNDb25maWcuc2l6ZVJhbmdlLFxuICAgICAgICAgICAgc2l6ZVNjYWxlOiB0aGlzLmNvbmZpZy5zaXplU2NhbGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldENvbG9yOiBjb2xvclVwZGF0ZVRyaWdnZXJzLFxuICAgICAgICAgIGdldFRhcmdldENvbG9yOiBjb2xvclVwZGF0ZVRyaWdnZXJzXG4gICAgICAgIH0sXG4gICAgICAgIGV4dGVuc2lvbnM6IFsuLi5kZWZhdWx0TGF5ZXJQcm9wcy5leHRlbnNpb25zLCBuZXcgQnJ1c2hpbmdFeHRlbnNpb24oKV1cbiAgICAgIH0pLFxuICAgICAgLy8gaG92ZXIgbGF5ZXJcbiAgICAgIC4uLih0aGlzLmlzTGF5ZXJIb3ZlcmVkKG9iamVjdEhvdmVyZWQpXG4gICAgICAgID8gW1xuICAgICAgICAgICAgbmV3IEVuaGFuY2VkTGluZUxheWVyKHtcbiAgICAgICAgICAgICAgLi4udGhpcy5nZXREZWZhdWx0SG92ZXJMYXllclByb3BzKCksXG4gICAgICAgICAgICAgIC4uLmxheWVyUHJvcHMsXG4gICAgICAgICAgICAgIGRhdGE6IFtvYmplY3RIb3ZlcmVkLm9iamVjdF0sXG4gICAgICAgICAgICAgIGdldENvbG9yOiB0aGlzLmNvbmZpZy5oaWdobGlnaHRDb2xvcixcbiAgICAgICAgICAgICAgZ2V0VGFyZ2V0Q29sb3I6IHRoaXMuY29uZmlnLmhpZ2hsaWdodENvbG9yLFxuICAgICAgICAgICAgICBnZXRXaWR0aDogZGF0YS5nZXRXaWR0aFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBdXG4gICAgICAgIDogW10pXG4gICAgXTtcbiAgfVxufVxuIl19