'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.pointVisConfigs = exports.pointOptionalColumns = exports.pointRequiredColumns = exports.pointPosResolver = exports.pointPosAccessor = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _baseLayer = require('../base-layer');

var _baseLayer2 = _interopRequireDefault(_baseLayer);

var _lodash = require('lodash.memoize');

var _lodash2 = _interopRequireDefault(_lodash);

var _deck = require('deck.gl');

var _scatterplotBrushingLayer = require('../../deckgl-layers/scatterplot-brushing-layer/scatterplot-brushing-layer');

var _scatterplotBrushingLayer2 = _interopRequireDefault(_scatterplotBrushingLayer);

var _colorUtils = require('../../utils/color-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pointPosAccessor = exports.pointPosAccessor = function pointPosAccessor(_ref) {
  var lat = _ref.lat,
      lng = _ref.lng,
      altitude = _ref.altitude;
  return function (d) {
    return [d.data[lng.fieldIdx], d.data[lat.fieldIdx], altitude && altitude.fieldIdx > -1 ? d.data[altitude.fieldIdx] : 0];
  };
};

var pointPosResolver = exports.pointPosResolver = function pointPosResolver(_ref2) {
  var lat = _ref2.lat,
      lng = _ref2.lng,
      altitude = _ref2.altitude;
  return lat.fieldIdx + '-' + lng.fieldIdx + '-' + (altitude ? altitude.fieldIdx : 'z');
};
var pointRequiredColumns = exports.pointRequiredColumns = ['lat', 'lng'];
var pointOptionalColumns = exports.pointOptionalColumns = ['altitude'];

var pointVisConfigs = exports.pointVisConfigs = {
  radius: 'radius',
  fixedRadius: 'fixedRadius',
  opacity: 'opacity',
  outline: 'outline',
  thickness: 'thickness',
  colorRange: 'colorRange',
  radiusRange: 'radiusRange',
  'hi-precision': 'hi-precision'
};

var PointLayer = function (_Layer) {
  (0, _inherits3.default)(PointLayer, _Layer);

  function PointLayer(props) {
    (0, _classCallCheck3.default)(this, PointLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, _Layer.call(this, props));

    _this.registerVisConfig(pointVisConfigs);
    _this.getPosition = (0, _lodash2.default)(pointPosAccessor, pointPosResolver);
    return _this;
  }

  PointLayer.prototype.formatLayerData = function formatLayerData(_, allData, filteredIndex, oldLayerData) {
    var _this2 = this;

    var opt = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var _config = this.config,
        colorScale = _config.colorScale,
        colorDomain = _config.colorDomain,
        colorField = _config.colorField,
        color = _config.color,
        columns = _config.columns,
        sizeField = _config.sizeField,
        sizeScale = _config.sizeScale,
        sizeDomain = _config.sizeDomain,
        _config$visConfig = _config.visConfig,
        radiusRange = _config$visConfig.radiusRange,
        fixedRadius = _config$visConfig.fixedRadius,
        colorRange = _config$visConfig.colorRange;

    // point color

    var cScale = colorField && this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(_colorUtils.hexToRgb));

    // point radius
    var rScale = sizeField && this.getVisChannelScale(sizeScale, sizeDomain, radiusRange, fixedRadius);

    var getPosition = this.getPosition(columns);

    if (!oldLayerData || oldLayerData.getPosition !== getPosition) {
      this.updateLayerMeta(allData, getPosition);
    }

    var data = void 0;
    if (oldLayerData && oldLayerData.data && opt.sameData && oldLayerData.getPosition === getPosition) {
      data = oldLayerData.data;
    } else {
      data = filteredIndex.reduce(function (accu, index) {
        var pos = getPosition({ data: allData[index] });

        // if doesn't have point lat or lng, do not add the point
        // deck.gl can't handle position = null
        if (!pos.every(Number.isFinite)) {
          return accu;
        }

        accu.push({
          data: allData[index]
        });

        return accu;
      }, []);
    }

    var getRadius = function getRadius(d) {
      return rScale ? _this2.getEncodedChannelValue(rScale, d.data, sizeField) : 1;
    };

    var getColor = function getColor(d) {
      return cScale ? _this2.getEncodedChannelValue(cScale, d.data, colorField) : color;
    };

    return {
      data: data,
      getPosition: getPosition,
      getColor: getColor,
      getRadius: getRadius
    };
  };

  PointLayer.prototype.updateLayerMeta = function updateLayerMeta(allData, getPosition) {
    var bounds = this.getPointsBounds(allData, function (d) {
      return getPosition({ data: d });
    });
    this.updateMeta({ bounds: bounds });
  };

  PointLayer.prototype.renderLayer = function renderLayer(_ref3) {
    var data = _ref3.data,
        idx = _ref3.idx,
        layerInteraction = _ref3.layerInteraction,
        objectHovered = _ref3.objectHovered,
        mapState = _ref3.mapState,
        interactionConfig = _ref3.interactionConfig;


    var layerProps = (0, _extends3.default)({
      outline: this.config.visConfig.outline,
      radiusMinPixels: 1,
      fp64: this.config.visConfig['hi-precision'],
      strokeWidth: this.config.visConfig.thickness,
      radiusScale: this.getRadiusScaleByZoom(mapState.zoom)
    }, this.config.visConfig.fixedRadius ? {} : { radiusMaxPixels: 500 });

    var baseLayerProp = (0, _extends3.default)({}, layerProps, layerInteraction, data, {
      idx: idx,
      opacity: this.config.visConfig.opacity,
      pickable: true,
      updateTriggers: {
        getRadius: {
          sizeField: this.config.colorField,
          radiusRange: this.config.visConfig.radiusRange,
          fixedRadius: this.config.visConfig.fixedRadius,
          sizeScale: this.config.sizeScale
        },
        getColor: {
          color: this.config.color,
          colorField: this.config.colorField,
          colorRange: this.config.visConfig.colorRange,
          colorScale: this.config.colorScale
        }
      }
    });

    return [
    // base layer
    interactionConfig.brush.enabled ? new _scatterplotBrushingLayer2.default((0, _extends3.default)({}, baseLayerProp, {
      id: this.id + '-brush',
      enableBrushing: true,
      brushRadius: interactionConfig.brush.config.size * 1000
    })) : new _deck.ScatterplotLayer((0, _extends3.default)({
      id: this.id
    }, baseLayerProp))].concat(this.isLayerHovered(objectHovered) ? [new _deck.ScatterplotLayer((0, _extends3.default)({}, layerProps, {
      id: this.id + '-hovered',
      data: [{
        color: this.config.highlightColor,
        position: data.getPosition(objectHovered.object),
        radius: data.getRadius(objectHovered.object)
      }],
      pickable: false
    }))] : []);
  };

  (0, _createClass3.default)(PointLayer, [{
    key: 'type',
    get: function get() {
      return 'point';
    }
  }, {
    key: 'isAggregated',
    get: function get() {
      return false;
    }
  }, {
    key: 'requiredLayerColumns',
    get: function get() {
      return pointRequiredColumns;
    }
  }, {
    key: 'optionalColumns',
    get: function get() {
      return pointOptionalColumns;
    }
  }, {
    key: 'columnPairs',
    get: function get() {
      return this.defaultPointColumnPairs;
    }
  }, {
    key: 'noneLayerDataAffectingProps',
    get: function get() {
      return [].concat(_Layer.prototype.noneLayerDataAffectingProps, ['radius']);
    }
  }, {
    key: 'visualChannels',
    get: function get() {
      return (0, _extends3.default)({}, _Layer.prototype.visualChannels, {
        size: (0, _extends3.default)({}, _Layer.prototype.visualChannels.size, {
          range: 'radiusRange',
          property: 'radius',
          channelScaleType: 'radius'
        })
      });
    }
  }]);
  return PointLayer;
}(_baseLayer2.default);

exports.default = PointLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvcG9pbnQtbGF5ZXIvcG9pbnQtbGF5ZXIuanMiXSwibmFtZXMiOlsicG9pbnRQb3NBY2Nlc3NvciIsImxhdCIsImxuZyIsImFsdGl0dWRlIiwiZCIsImRhdGEiLCJmaWVsZElkeCIsInBvaW50UG9zUmVzb2x2ZXIiLCJwb2ludFJlcXVpcmVkQ29sdW1ucyIsInBvaW50T3B0aW9uYWxDb2x1bW5zIiwicG9pbnRWaXNDb25maWdzIiwicmFkaXVzIiwiZml4ZWRSYWRpdXMiLCJvcGFjaXR5Iiwib3V0bGluZSIsInRoaWNrbmVzcyIsImNvbG9yUmFuZ2UiLCJyYWRpdXNSYW5nZSIsIlBvaW50TGF5ZXIiLCJwcm9wcyIsInJlZ2lzdGVyVmlzQ29uZmlnIiwiZ2V0UG9zaXRpb24iLCJmb3JtYXRMYXllckRhdGEiLCJfIiwiYWxsRGF0YSIsImZpbHRlcmVkSW5kZXgiLCJvbGRMYXllckRhdGEiLCJvcHQiLCJjb25maWciLCJjb2xvclNjYWxlIiwiY29sb3JEb21haW4iLCJjb2xvckZpZWxkIiwiY29sb3IiLCJjb2x1bW5zIiwic2l6ZUZpZWxkIiwic2l6ZVNjYWxlIiwic2l6ZURvbWFpbiIsInZpc0NvbmZpZyIsImNTY2FsZSIsImdldFZpc0NoYW5uZWxTY2FsZSIsImNvbG9ycyIsIm1hcCIsInJTY2FsZSIsInVwZGF0ZUxheWVyTWV0YSIsInNhbWVEYXRhIiwicmVkdWNlIiwiYWNjdSIsImluZGV4IiwicG9zIiwiZXZlcnkiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsInB1c2giLCJnZXRSYWRpdXMiLCJnZXRFbmNvZGVkQ2hhbm5lbFZhbHVlIiwiZ2V0Q29sb3IiLCJib3VuZHMiLCJnZXRQb2ludHNCb3VuZHMiLCJ1cGRhdGVNZXRhIiwicmVuZGVyTGF5ZXIiLCJpZHgiLCJsYXllckludGVyYWN0aW9uIiwib2JqZWN0SG92ZXJlZCIsIm1hcFN0YXRlIiwiaW50ZXJhY3Rpb25Db25maWciLCJsYXllclByb3BzIiwicmFkaXVzTWluUGl4ZWxzIiwiZnA2NCIsInN0cm9rZVdpZHRoIiwicmFkaXVzU2NhbGUiLCJnZXRSYWRpdXNTY2FsZUJ5Wm9vbSIsInpvb20iLCJyYWRpdXNNYXhQaXhlbHMiLCJiYXNlTGF5ZXJQcm9wIiwicGlja2FibGUiLCJ1cGRhdGVUcmlnZ2VycyIsImJydXNoIiwiZW5hYmxlZCIsImlkIiwiZW5hYmxlQnJ1c2hpbmciLCJicnVzaFJhZGl1cyIsInNpemUiLCJpc0xheWVySG92ZXJlZCIsImhpZ2hsaWdodENvbG9yIiwicG9zaXRpb24iLCJvYmplY3QiLCJkZWZhdWx0UG9pbnRDb2x1bW5QYWlycyIsIm5vbmVMYXllckRhdGFBZmZlY3RpbmdQcm9wcyIsInZpc3VhbENoYW5uZWxzIiwicmFuZ2UiLCJwcm9wZXJ0eSIsImNoYW5uZWxTY2FsZVR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBRU8sSUFBTUEsOENBQW1CLFNBQW5CQSxnQkFBbUI7QUFBQSxNQUFFQyxHQUFGLFFBQUVBLEdBQUY7QUFBQSxNQUFPQyxHQUFQLFFBQU9BLEdBQVA7QUFBQSxNQUFZQyxRQUFaLFFBQVlBLFFBQVo7QUFBQSxTQUEwQjtBQUFBLFdBQUssQ0FDN0RDLEVBQUVDLElBQUYsQ0FBT0gsSUFBSUksUUFBWCxDQUQ2RCxFQUU3REYsRUFBRUMsSUFBRixDQUFPSixJQUFJSyxRQUFYLENBRjZELEVBRzdESCxZQUFZQSxTQUFTRyxRQUFULEdBQW9CLENBQUMsQ0FBakMsR0FBcUNGLEVBQUVDLElBQUYsQ0FBT0YsU0FBU0csUUFBaEIsQ0FBckMsR0FBaUUsQ0FISixDQUFMO0FBQUEsR0FBMUI7QUFBQSxDQUF6Qjs7QUFNQSxJQUFNQyw4Q0FBbUIsU0FBbkJBLGdCQUFtQjtBQUFBLE1BQUVOLEdBQUYsU0FBRUEsR0FBRjtBQUFBLE1BQU9DLEdBQVAsU0FBT0EsR0FBUDtBQUFBLE1BQVlDLFFBQVosU0FBWUEsUUFBWjtBQUFB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U0FlSyxLQUFLUyxjQUFMLENBQW9CcEIsYUFBcEIsSUFDRCxDQUFDLHNEQUNJRyxVQURKO0FBRUNhLFVBQU8sS0FBS0EsRUFBWixhQUZEO0FBR0N6RSxZQUFNLENBQUM7QUFDTDJCLGVBQU8sS0FBS0osTUFBTCxDQUFZdUQsY0FEZDtBQUVMQyxrQkFBVS9FLEtBQUtnQixXQUFMLENBQWlCeUMsY0FBY3VCLE1BQS9CLENBRkw7QUFHTDFFLGdCQUFRTixLQUFLZ0QsU0FBTCxDQUFlUyxjQUFjdUIsTUFBN0I7QUFISCxPQUFELENBSFA7QUFRQ1gsZ0JBQVU7QUFSWCxPQUFELENBREMsR0FVSyxFQXpCVjtBQTJCRCxHOzs7O3dCQW5LVTtBQUNULGFBQU8sT0FBUDtBQUNEOzs7d0JBRWtCO0FBQ2pCLGFBQU8sS0FBUDtBQUNEOzs7d0JBRTBCO0FBQ3pCLGFBQU9sRSxvQkFBUDtBQUNEOzs7d0JBRXFCO0FBQ3BCLGFBQU9DLG9CQUFQO0FBQ0Q7Ozt3QkFFaUI7QUFDaEIsYUFBTyxLQUFLNkUsdUJBQVo7QUFDRDs7O3dCQUVpQztBQUNoQyx1QkFBVyxpQkFBTUMsMkJBQWpCLEdBQThDLFFBQTlDO0FBQ0Q7Ozt3QkFFb0I7QUFDbkIsd0NBQ0ssaUJBQU1DLGNBRFg7QUFFRVAseUNBQ0ssaUJBQU1PLGNBQU4sQ0FBcUJQLElBRDFCO0FBRUVRLGlCQUFPLGFBRlQ7QUFHRUMsb0JBQVUsUUFIWjtBQUlFQyw0QkFBa0I7QUFKcEI7QUFGRjtBQVNEOzs7OztrQkExQ2tCekUsVSIsImZpbGUiOiJwb2ludC1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXllciBmcm9tICcuLi9iYXNlLWxheWVyJztcbmltcG9ydCBtZW1vaXplIGZyb20gJ2xvZGFzaC5tZW1vaXplJztcbmltcG9ydCB7U2NhdHRlcnBsb3RMYXllcn0gZnJvbSAnZGVjay5nbCc7XG5pbXBvcnQgU2NhdHRlcnBsb3RCcnVzaGluZ0xheWVyIGZyb20gJ2RlY2tnbC1sYXllcnMvc2NhdHRlcnBsb3QtYnJ1c2hpbmctbGF5ZXIvc2NhdHRlcnBsb3QtYnJ1c2hpbmctbGF5ZXInO1xuaW1wb3J0IHtoZXhUb1JnYn0gZnJvbSAndXRpbHMvY29sb3ItdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgcG9pbnRQb3NBY2Nlc3NvciA9ICh7bGF0LCBsbmcsIGFsdGl0dWRlfSkgPT4gZCA9PiBbXG4gIGQuZGF0YVtsbmcuZmllbGRJZHhdLFxuICBkLmRhdGFbbGF0LmZpZWxkSWR4XSxcbiAgYWx0aXR1ZGUgJiYgYWx0aXR1ZGUuZmllbGRJZHggPiAtMSA/IGQuZGF0YVthbHRpdHVkZS5maWVsZElkeF0gOiAwXG5dO1xuXG5leHBvcnQgY29uc3QgcG9pbnRQb3NSZXNvbHZlciA9ICh7bGF0LCBsbmcsIGFsdGl0dWRlfSkgPT4gYCR7bGF0LmZpZWxkSWR4fS0ke2xuZy5maWVsZElkeH0tJHthbHRpdHVkZSA/IGFsdGl0dWRlLmZpZWxkSWR4IDogJ3onfWA7XG5leHBvcnQgY29uc3QgcG9pbnRSZXF1aXJlZENvbHVtbnMgPSBbJ2xhdCcsICdsbmcnXTtcbmV4cG9ydCBjb25zdCBwb2ludE9wdGlvbmFsQ29sdW1ucyA9IFsnYWx0aXR1ZGUnXTtcblxuZXhwb3J0IGNvbnN0IHBvaW50VmlzQ29uZmlncyA9IHtcbiAgcmFkaXVzOiAncmFkaXVzJyxcbiAgZml4ZWRSYWRpdXM6ICdmaXhlZFJhZGl1cycsXG4gIG9wYWNpdHk6ICdvcGFjaXR5JyxcbiAgb3V0bGluZTogJ291dGxpbmUnLFxuICB0aGlja25lc3M6ICd0aGlja25lc3MnLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIHJhZGl1c1JhbmdlOiAncmFkaXVzUmFuZ2UnLFxuICAnaGktcHJlY2lzaW9uJzogJ2hpLXByZWNpc2lvbidcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvaW50TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yZWdpc3RlclZpc0NvbmZpZyhwb2ludFZpc0NvbmZpZ3MpO1xuICAgIHRoaXMuZ2V0UG9zaXRpb24gPSBtZW1vaXplKHBvaW50UG9zQWNjZXNzb3IsIHBvaW50UG9zUmVzb2x2ZXIpO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICdwb2ludCc7XG4gIH1cblxuICBnZXQgaXNBZ2dyZWdhdGVkKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldCByZXF1aXJlZExheWVyQ29sdW1ucygpIHtcbiAgICByZXR1cm4gcG9pbnRSZXF1aXJlZENvbHVtbnM7XG4gIH1cblxuICBnZXQgb3B0aW9uYWxDb2x1bW5zKCkge1xuICAgIHJldHVybiBwb2ludE9wdGlvbmFsQ29sdW1ucztcbiAgfVxuXG4gIGdldCBjb2x1bW5QYWlycygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0UG9pbnRDb2x1bW5QYWlycztcbiAgfVxuXG4gIGdldCBub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMoKSB7XG4gICAgcmV0dXJuIFsuLi5zdXBlci5ub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMsICdyYWRpdXMnXTtcbiAgfVxuXG4gIGdldCB2aXN1YWxDaGFubmVscygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMsXG4gICAgICBzaXplOiB7XG4gICAgICAgIC4uLnN1cGVyLnZpc3VhbENoYW5uZWxzLnNpemUsXG4gICAgICAgIHJhbmdlOiAncmFkaXVzUmFuZ2UnLFxuICAgICAgICBwcm9wZXJ0eTogJ3JhZGl1cycsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGU6ICdyYWRpdXMnXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGZvcm1hdExheWVyRGF0YShfLCBhbGxEYXRhLCBmaWx0ZXJlZEluZGV4LCBvbGRMYXllckRhdGEsIG9wdCA9IHt9KSB7XG4gICAgY29uc3Qge2NvbG9yU2NhbGUsIGNvbG9yRG9tYWluLCBjb2xvckZpZWxkLCBjb2xvciwgY29sdW1ucywgc2l6ZUZpZWxkLCBzaXplU2NhbGUsIHNpemVEb21haW4sXG4gICAgICB2aXNDb25maWc6IHtyYWRpdXNSYW5nZSwgZml4ZWRSYWRpdXMsIGNvbG9yUmFuZ2V9fSA9IHRoaXMuY29uZmlnO1xuXG4gICAgLy8gcG9pbnQgY29sb3JcbiAgICBjb25zdCBjU2NhbGUgPSBjb2xvckZpZWxkICYmIHRoaXMuZ2V0VmlzQ2hhbm5lbFNjYWxlKFxuICAgICAgY29sb3JTY2FsZSxcbiAgICAgIGNvbG9yRG9tYWluLFxuICAgICAgY29sb3JSYW5nZS5jb2xvcnMubWFwKGhleFRvUmdiKVxuICAgICk7XG5cbiAgICAvLyBwb2ludCByYWRpdXNcbiAgICBjb25zdCByU2NhbGUgPSBzaXplRmllbGQgJiYgdGhpcy5nZXRWaXNDaGFubmVsU2NhbGUoXG4gICAgICBzaXplU2NhbGUsXG4gICAgICBzaXplRG9tYWluLFxuICAgICAgcmFkaXVzUmFuZ2UsXG4gICAgICBmaXhlZFJhZGl1c1xuICAgICk7XG5cbiAgICBjb25zdCBnZXRQb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb24oY29sdW1ucyk7XG5cbiAgICBpZiAoIW9sZExheWVyRGF0YSB8fCBvbGRMYXllckRhdGEuZ2V0UG9zaXRpb24gIT09IGdldFBvc2l0aW9uKSB7XG4gICAgICB0aGlzLnVwZGF0ZUxheWVyTWV0YShhbGxEYXRhLCBnZXRQb3NpdGlvbik7XG4gICAgfVxuXG4gICAgbGV0IGRhdGE7XG4gICAgaWYgKG9sZExheWVyRGF0YSAmJiBvbGRMYXllckRhdGEuZGF0YSAmJiBvcHQuc2FtZURhdGFcbiAgICAgICYmIG9sZExheWVyRGF0YS5nZXRQb3NpdGlvbiA9PT0gZ2V0UG9zaXRpb24pIHtcbiAgICAgIGRhdGEgPSBvbGRMYXllckRhdGEuZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IGZpbHRlcmVkSW5kZXgucmVkdWNlKChhY2N1LCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBwb3MgPSBnZXRQb3NpdGlvbih7ZGF0YTogYWxsRGF0YVtpbmRleF19KTtcblxuICAgICAgICAvLyBpZiBkb2Vzbid0IGhhdmUgcG9pbnQgbGF0IG9yIGxuZywgZG8gbm90IGFkZCB0aGUgcG9pbnRcbiAgICAgICAgLy8gZGVjay5nbCBjYW4ndCBoYW5kbGUgcG9zaXRpb24gPSBudWxsXG4gICAgICAgIGlmICghcG9zLmV2ZXJ5KE51bWJlci5pc0Zpbml0ZSkpIHtcbiAgICAgICAgICByZXR1cm4gYWNjdTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFjY3UucHVzaCh7XG4gICAgICAgICAgZGF0YTogYWxsRGF0YVtpbmRleF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGFjY3U7XG4gICAgICB9LCBbXSk7XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0UmFkaXVzID0gZCA9PiByU2NhbGUgP1xuICAgICAgdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKHJTY2FsZSwgZC5kYXRhLCBzaXplRmllbGQpIDogMTtcblxuICAgIGNvbnN0IGdldENvbG9yID0gZCA9PiBjU2NhbGUgP1xuICAgICAgdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKGNTY2FsZSwgZC5kYXRhLCBjb2xvckZpZWxkKSA6IGNvbG9yO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGEsXG4gICAgICBnZXRQb3NpdGlvbixcbiAgICAgIGdldENvbG9yLFxuICAgICAgZ2V0UmFkaXVzXG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVyTWV0YShhbGxEYXRhLCBnZXRQb3NpdGlvbikge1xuICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZ2V0UG9pbnRzQm91bmRzKGFsbERhdGEsIGQgPT4gZ2V0UG9zaXRpb24oe2RhdGE6IGR9KSk7XG4gICAgdGhpcy51cGRhdGVNZXRhKHtib3VuZHN9KTtcbiAgfVxuXG4gIHJlbmRlckxheWVyKHtkYXRhLCBpZHgsIGxheWVySW50ZXJhY3Rpb24sIG9iamVjdEhvdmVyZWQsIG1hcFN0YXRlLCBpbnRlcmFjdGlvbkNvbmZpZ30pIHtcblxuICAgIGNvbnN0IGxheWVyUHJvcHMgPSB7XG4gICAgICBvdXRsaW5lOiB0aGlzLmNvbmZpZy52aXNDb25maWcub3V0bGluZSxcbiAgICAgIHJhZGl1c01pblBpeGVsczogMSxcbiAgICAgIGZwNjQ6IHRoaXMuY29uZmlnLnZpc0NvbmZpZ1snaGktcHJlY2lzaW9uJ10sXG4gICAgICBzdHJva2VXaWR0aDogdGhpcy5jb25maWcudmlzQ29uZmlnLnRoaWNrbmVzcyxcbiAgICAgIHJhZGl1c1NjYWxlOiB0aGlzLmdldFJhZGl1c1NjYWxlQnlab29tKG1hcFN0YXRlLnpvb20pLFxuICAgICAgLi4uKHRoaXMuY29uZmlnLnZpc0NvbmZpZy5maXhlZFJhZGl1cyA/IHt9IDoge3JhZGl1c01heFBpeGVsczogNTAwfSlcbiAgICB9O1xuXG4gICAgY29uc3QgYmFzZUxheWVyUHJvcCA9IHtcbiAgICAgIC4uLmxheWVyUHJvcHMsXG4gICAgICAuLi5sYXllckludGVyYWN0aW9uLFxuICAgICAgLi4uZGF0YSxcbiAgICAgIGlkeCxcbiAgICAgIG9wYWNpdHk6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5vcGFjaXR5LFxuICAgICAgcGlja2FibGU6IHRydWUsXG4gICAgICB1cGRhdGVUcmlnZ2Vyczoge1xuICAgICAgICBnZXRSYWRpdXM6IHtcbiAgICAgICAgICBzaXplRmllbGQ6IHRoaXMuY29uZmlnLmNvbG9yRmllbGQsXG4gICAgICAgICAgcmFkaXVzUmFuZ2U6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5yYWRpdXNSYW5nZSxcbiAgICAgICAgICBmaXhlZFJhZGl1czogdGhpcy5jb25maWcudmlzQ29uZmlnLmZpeGVkUmFkaXVzLFxuICAgICAgICAgIHNpemVTY2FsZTogdGhpcy5jb25maWcuc2l6ZVNjYWxlXG4gICAgICAgIH0sXG4gICAgICAgIGdldENvbG9yOiB7XG4gICAgICAgICAgY29sb3I6IHRoaXMuY29uZmlnLmNvbG9yLFxuICAgICAgICAgIGNvbG9yRmllbGQ6IHRoaXMuY29uZmlnLmNvbG9yRmllbGQsXG4gICAgICAgICAgY29sb3JSYW5nZTogdGhpcy5jb25maWcudmlzQ29uZmlnLmNvbG9yUmFuZ2UsXG4gICAgICAgICAgY29sb3JTY2FsZTogdGhpcy5jb25maWcuY29sb3JTY2FsZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBbXG4gICAgICAvLyBiYXNlIGxheWVyXG4gICAgICBpbnRlcmFjdGlvbkNvbmZpZy5icnVzaC5lbmFibGVkID9cbiAgICAgICAgbmV3IFNjYXR0ZXJwbG90QnJ1c2hpbmdMYXllcih7XG4gICAgICAgICAgLi4uYmFzZUxheWVyUHJvcCxcbiAgICAgICAgICBpZDogYCR7dGhpcy5pZH0tYnJ1c2hgLFxuICAgICAgICAgIGVuYWJsZUJydXNoaW5nOiB0cnVlLFxuICAgICAgICAgIGJydXNoUmFkaXVzOiBpbnRlcmFjdGlvbkNvbmZpZy5icnVzaC5jb25maWcuc2l6ZSAqIDEwMDBcbiAgICAgICAgfSkgOlxuICAgICAgICBuZXcgU2NhdHRlcnBsb3RMYXllcih7XG4gICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgLi4uYmFzZUxheWVyUHJvcFxuICAgICAgICB9KSxcblxuICAgICAgLy8gaG92ZXIgbGF5ZXJcbiAgICAgIC4uLnRoaXMuaXNMYXllckhvdmVyZWQob2JqZWN0SG92ZXJlZCkgP1xuICAgICAgICBbbmV3IFNjYXR0ZXJwbG90TGF5ZXIoe1xuICAgICAgICAgIC4uLmxheWVyUHJvcHMsXG4gICAgICAgICAgaWQ6IGAke3RoaXMuaWR9LWhvdmVyZWRgLFxuICAgICAgICAgIGRhdGE6IFt7XG4gICAgICAgICAgICBjb2xvcjogdGhpcy5jb25maWcuaGlnaGxpZ2h0Q29sb3IsXG4gICAgICAgICAgICBwb3NpdGlvbjogZGF0YS5nZXRQb3NpdGlvbihvYmplY3RIb3ZlcmVkLm9iamVjdCksXG4gICAgICAgICAgICByYWRpdXM6IGRhdGEuZ2V0UmFkaXVzKG9iamVjdEhvdmVyZWQub2JqZWN0KVxuICAgICAgICAgIH1dLFxuICAgICAgICAgIHBpY2thYmxlOiBmYWxzZVxuICAgICAgICB9KV0gOiBbXVxuICAgIF07XG4gIH1cbn1cbiJdfQ==