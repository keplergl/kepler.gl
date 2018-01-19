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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvcG9pbnQtbGF5ZXIvcG9pbnQtbGF5ZXIuanMiXSwibmFtZXMiOlsicG9pbnRQb3NBY2Nlc3NvciIsImxhdCIsImxuZyIsImFsdGl0dWRlIiwiZCIsImRhdGEiLCJmaWVsZElkeCIsInBvaW50UG9zUmVzb2x2ZXIiLCJwb2ludFJlcXVpcmVkQ29sdW1ucyIsInBvaW50T3B0aW9uYWxDb2x1bW5zIiwicG9pbnRWaXNDb25maWdzIiwicmFkaXVzIiwiZml4ZWRSYWRpdXMiLCJvcGFjaXR5Iiwib3V0bGluZSIsInRoaWNrbmVzcyIsImNvbG9yUmFuZ2UiLCJyYWRpdXNSYW5nZSIsIlBvaW50TGF5ZXIiLCJwcm9wcyIsInJlZ2lzdGVyVmlzQ29uZmlnIiwiZ2V0UG9zaXRpb24iLCJmb3JtYXRMYXllckRhdGEiLCJfIiwiYWxsRGF0YSIsImZpbHRlcmVkSW5kZXgiLCJvbGRMYXllckRhdGEiLCJvcHQiLCJjb25maWciLCJjb2xvclNjYWxlIiwiY29sb3JEb21haW4iLCJjb2xvckZpZWxkIiwiY29sb3IiLCJjb2x1bW5zIiwic2l6ZUZpZWxkIiwic2l6ZVNjYWxlIiwic2l6ZURvbWFpbiIsInZpc0NvbmZpZyIsImNTY2FsZSIsImdldFZpc0NoYW5uZWxTY2FsZSIsImNvbG9ycyIsIm1hcCIsInJTY2FsZSIsInVwZGF0ZUxheWVyTWV0YSIsInNhbWVEYXRhIiwicmVkdWNlIiwiYWNjdSIsImluZGV4IiwicG9zIiwiZXZlcnkiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsInB1c2giLCJnZXRSYWRpdXMiLCJnZXRFbmNvZGVkQ2hhbm5lbFZhbHVlIiwiZ2V0Q29sb3IiLCJib3VuZHMiLCJnZXRQb2ludHNCb3VuZHMiLCJ1cGRhdGVNZXRhIiwicmVuZGVyTGF5ZXIiLCJpZHgiLCJsYXllckludGVyYWN0aW9uIiwib2JqZWN0SG92ZXJlZCIsIm1hcFN0YXRlIiwiaW50ZXJhY3Rpb25Db25maWciLCJsYXllclByb3BzIiwicmFkaXVzTWluUGl4ZWxzIiwiZnA2NCIsInN0cm9rZVdpZHRoIiwicmFkaXVzU2NhbGUiLCJnZXRSYWRpdXNTY2FsZUJ5Wm9vbSIsInpvb20iLCJyYWRpdXNNYXhQaXhlbHMiLCJiYXNlTGF5ZXJQcm9wIiwicGlja2FibGUiLCJ1cGRhdGVUcmlnZ2VycyIsImJydXNoIiwiZW5hYmxlZCIsImlkIiwiZW5hYmxlQnJ1c2hpbmciLCJicnVzaFJhZGl1cyIsInNpemUiLCJpc0xheWVySG92ZXJlZCIsImhpZ2hsaWdodENvbG9yIiwicG9zaXRpb24iLCJvYmplY3QiLCJkZWZhdWx0UG9pbnRDb2x1bW5QYWlycyIsIm5vbmVMYXllckRhdGFBZmZlY3RpbmdQcm9wcyIsInZpc3VhbENoYW5uZWxzIiwicmFuZ2UiLCJwcm9wZXJ0eSIsImNoYW5uZWxTY2FsZVR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBRU8sSUFBTUEsOENBQW1CLFNBQW5CQSxnQkFBbUI7QUFBQSxNQUFFQyxHQUFGLFFBQUVBLEdBQUY7QUFBQSxNQUFPQyxHQUFQLFFBQU9BLEdBQVA7QUFBQSxNQUFZQyxRQUFaLFFBQVlBLFFBQVo7QUFBQSxTQUEwQjtBQUFBLFdBQUssQ0FDN0RDLEVBQUVDLElBQUYsQ0FBT0gsSUFBSUksUUFBWCxDQUQ2RCxFQUU3REYsRUFBRUMsSUFBRixDQUFPSixJQUFJSyxRQUFYLENBRjZELEVBRzdESCxZQUFZQSxTQUFTRyxRQUFULEdBQW9CLENBQUMsQ0FBakMsR0FBcUNGLEVBQUVDLElBQUYsQ0FBT0YsU0FBU0csUUFBaEIsQ0FBckMsR0FBaUUsQ0FISixDQUFMO0FBQUEsR0FBMUI7QUFBQSxDQUF6Qjs7QUFNQSxJQUFNQyw4Q0FBbUIsU0FBbkJBLGdCQUFtQjtBQUFBLE1BQUVOLEdBQUYsU0FBRUEsR0FBRjtBQUFBLE1BQU9DLEdBQVAsU0FBT0EsR0FBUDtBQUFBLE1BQVlDLFFBQVosU0FBWUEsUUFBWjtBQUFB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QSxDQUNFLHNEQUNLRyxVQURMO0FBRUVhLFVBQU8sS0FBS0EsRUFBWixhQUZGO0FBR0V6RSxZQUFNLENBQ0o7QUFDRTJCLGVBQU8sS0FBS0osTUFBTCxDQUFZdUQsY0FEckI7QUFFRUMsa0JBQVUvRSxLQUFLZ0IsV0FBTCxDQUFpQnlDLGNBQWN1QixNQUEvQixDQUZaO0FBR0UxRSxnQkFBUU4sS0FBS2dELFNBQUwsQ0FBZVMsY0FBY3VCLE1BQTdCO0FBSFYsT0FESSxDQUhSO0FBVUVYLGdCQUFVO0FBVlosT0FERixDQURBLEdBZUEsRUE5Qk47QUFnQ0QsRzs7Ozt3QkExTFU7QUFDVCxhQUFPLE9BQVA7QUFDRDs7O3dCQUVrQjtBQUNqQixhQUFPLEtBQVA7QUFDRDs7O3dCQUUwQjtBQUN6QixhQUFPbEUsb0JBQVA7QUFDRDs7O3dCQUVxQjtBQUNwQixhQUFPQyxvQkFBUDtBQUNEOzs7d0JBRWlCO0FBQ2hCLGFBQU8sS0FBSzZFLHVCQUFaO0FBQ0Q7Ozt3QkFFaUM7QUFDaEMsdUJBQVcsaUJBQU1DLDJCQUFqQixHQUE4QyxRQUE5QztBQUNEOzs7d0JBRW9CO0FBQ25CLHdDQUNLLGlCQUFNQyxjQURYO0FBRUVQLHlDQUNLLGlCQUFNTyxjQUFOLENBQXFCUCxJQUQxQjtBQUVFUSxpQkFBTyxhQUZUO0FBR0VDLG9CQUFVLFFBSFo7QUFJRUMsNEJBQWtCO0FBSnBCO0FBRkY7QUFTRDs7Ozs7a0JBMUNrQnpFLFUiLCJmaWxlIjoicG9pbnQtbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vYmFzZS1sYXllcic7XG5pbXBvcnQgbWVtb2l6ZSBmcm9tICdsb2Rhc2gubWVtb2l6ZSc7XG5pbXBvcnQge1NjYXR0ZXJwbG90TGF5ZXJ9IGZyb20gJ2RlY2suZ2wnO1xuaW1wb3J0IFNjYXR0ZXJwbG90QnJ1c2hpbmdMYXllciBmcm9tICdkZWNrZ2wtbGF5ZXJzL3NjYXR0ZXJwbG90LWJydXNoaW5nLWxheWVyL3NjYXR0ZXJwbG90LWJydXNoaW5nLWxheWVyJztcbmltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJ3V0aWxzL2NvbG9yLXV0aWxzJztcblxuZXhwb3J0IGNvbnN0IHBvaW50UG9zQWNjZXNzb3IgPSAoe2xhdCwgbG5nLCBhbHRpdHVkZX0pID0+IGQgPT4gW1xuICBkLmRhdGFbbG5nLmZpZWxkSWR4XSxcbiAgZC5kYXRhW2xhdC5maWVsZElkeF0sXG4gIGFsdGl0dWRlICYmIGFsdGl0dWRlLmZpZWxkSWR4ID4gLTEgPyBkLmRhdGFbYWx0aXR1ZGUuZmllbGRJZHhdIDogMFxuXTtcblxuZXhwb3J0IGNvbnN0IHBvaW50UG9zUmVzb2x2ZXIgPSAoe2xhdCwgbG5nLCBhbHRpdHVkZX0pID0+XG4gIGAke2xhdC5maWVsZElkeH0tJHtsbmcuZmllbGRJZHh9LSR7YWx0aXR1ZGUgPyBhbHRpdHVkZS5maWVsZElkeCA6ICd6J31gO1xuZXhwb3J0IGNvbnN0IHBvaW50UmVxdWlyZWRDb2x1bW5zID0gWydsYXQnLCAnbG5nJ107XG5leHBvcnQgY29uc3QgcG9pbnRPcHRpb25hbENvbHVtbnMgPSBbJ2FsdGl0dWRlJ107XG5cbmV4cG9ydCBjb25zdCBwb2ludFZpc0NvbmZpZ3MgPSB7XG4gIHJhZGl1czogJ3JhZGl1cycsXG4gIGZpeGVkUmFkaXVzOiAnZml4ZWRSYWRpdXMnLFxuICBvcGFjaXR5OiAnb3BhY2l0eScsXG4gIG91dGxpbmU6ICdvdXRsaW5lJyxcbiAgdGhpY2tuZXNzOiAndGhpY2tuZXNzJyxcbiAgY29sb3JSYW5nZTogJ2NvbG9yUmFuZ2UnLFxuICByYWRpdXNSYW5nZTogJ3JhZGl1c1JhbmdlJyxcbiAgJ2hpLXByZWNpc2lvbic6ICdoaS1wcmVjaXNpb24nXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb2ludExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcocG9pbnRWaXNDb25maWdzKTtcbiAgICB0aGlzLmdldFBvc2l0aW9uID0gbWVtb2l6ZShwb2ludFBvc0FjY2Vzc29yLCBwb2ludFBvc1Jlc29sdmVyKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAncG9pbnQnO1xuICB9XG5cbiAgZ2V0IGlzQWdncmVnYXRlZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXQgcmVxdWlyZWRMYXllckNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIHBvaW50UmVxdWlyZWRDb2x1bW5zO1xuICB9XG5cbiAgZ2V0IG9wdGlvbmFsQ29sdW1ucygpIHtcbiAgICByZXR1cm4gcG9pbnRPcHRpb25hbENvbHVtbnM7XG4gIH1cblxuICBnZXQgY29sdW1uUGFpcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdFBvaW50Q29sdW1uUGFpcnM7XG4gIH1cblxuICBnZXQgbm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzKCkge1xuICAgIHJldHVybiBbLi4uc3VwZXIubm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzLCAncmFkaXVzJ107XG4gIH1cblxuICBnZXQgdmlzdWFsQ2hhbm5lbHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN1cGVyLnZpc3VhbENoYW5uZWxzLFxuICAgICAgc2l6ZToge1xuICAgICAgICAuLi5zdXBlci52aXN1YWxDaGFubmVscy5zaXplLFxuICAgICAgICByYW5nZTogJ3JhZGl1c1JhbmdlJyxcbiAgICAgICAgcHJvcGVydHk6ICdyYWRpdXMnLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiAncmFkaXVzJ1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBmb3JtYXRMYXllckRhdGEoXywgYWxsRGF0YSwgZmlsdGVyZWRJbmRleCwgb2xkTGF5ZXJEYXRhLCBvcHQgPSB7fSkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNvbG9yU2NhbGUsXG4gICAgICBjb2xvckRvbWFpbixcbiAgICAgIGNvbG9yRmllbGQsXG4gICAgICBjb2xvcixcbiAgICAgIGNvbHVtbnMsXG4gICAgICBzaXplRmllbGQsXG4gICAgICBzaXplU2NhbGUsXG4gICAgICBzaXplRG9tYWluLFxuICAgICAgdmlzQ29uZmlnOiB7cmFkaXVzUmFuZ2UsIGZpeGVkUmFkaXVzLCBjb2xvclJhbmdlfVxuICAgIH0gPSB0aGlzLmNvbmZpZztcblxuICAgIC8vIHBvaW50IGNvbG9yXG4gICAgY29uc3QgY1NjYWxlID1cbiAgICAgIGNvbG9yRmllbGQgJiZcbiAgICAgIHRoaXMuZ2V0VmlzQ2hhbm5lbFNjYWxlKFxuICAgICAgICBjb2xvclNjYWxlLFxuICAgICAgICBjb2xvckRvbWFpbixcbiAgICAgICAgY29sb3JSYW5nZS5jb2xvcnMubWFwKGhleFRvUmdiKVxuICAgICAgKTtcblxuICAgIC8vIHBvaW50IHJhZGl1c1xuICAgIGNvbnN0IHJTY2FsZSA9XG4gICAgICBzaXplRmllbGQgJiZcbiAgICAgIHRoaXMuZ2V0VmlzQ2hhbm5lbFNjYWxlKHNpemVTY2FsZSwgc2l6ZURvbWFpbiwgcmFkaXVzUmFuZ2UsIGZpeGVkUmFkaXVzKTtcblxuICAgIGNvbnN0IGdldFBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbihjb2x1bW5zKTtcblxuICAgIGlmICghb2xkTGF5ZXJEYXRhIHx8IG9sZExheWVyRGF0YS5nZXRQb3NpdGlvbiAhPT0gZ2V0UG9zaXRpb24pIHtcbiAgICAgIHRoaXMudXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEsIGdldFBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBsZXQgZGF0YTtcbiAgICBpZiAoXG4gICAgICBvbGRMYXllckRhdGEgJiZcbiAgICAgIG9sZExheWVyRGF0YS5kYXRhICYmXG4gICAgICBvcHQuc2FtZURhdGEgJiZcbiAgICAgIG9sZExheWVyRGF0YS5nZXRQb3NpdGlvbiA9PT0gZ2V0UG9zaXRpb25cbiAgICApIHtcbiAgICAgIGRhdGEgPSBvbGRMYXllckRhdGEuZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IGZpbHRlcmVkSW5kZXgucmVkdWNlKChhY2N1LCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBwb3MgPSBnZXRQb3NpdGlvbih7ZGF0YTogYWxsRGF0YVtpbmRleF19KTtcblxuICAgICAgICAvLyBpZiBkb2Vzbid0IGhhdmUgcG9pbnQgbGF0IG9yIGxuZywgZG8gbm90IGFkZCB0aGUgcG9pbnRcbiAgICAgICAgLy8gZGVjay5nbCBjYW4ndCBoYW5kbGUgcG9zaXRpb24gPSBudWxsXG4gICAgICAgIGlmICghcG9zLmV2ZXJ5KE51bWJlci5pc0Zpbml0ZSkpIHtcbiAgICAgICAgICByZXR1cm4gYWNjdTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFjY3UucHVzaCh7XG4gICAgICAgICAgZGF0YTogYWxsRGF0YVtpbmRleF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGFjY3U7XG4gICAgICB9LCBbXSk7XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0UmFkaXVzID0gZCA9PlxuICAgICAgclNjYWxlID8gdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKHJTY2FsZSwgZC5kYXRhLCBzaXplRmllbGQpIDogMTtcblxuICAgIGNvbnN0IGdldENvbG9yID0gZCA9PlxuICAgICAgY1NjYWxlID8gdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKGNTY2FsZSwgZC5kYXRhLCBjb2xvckZpZWxkKSA6IGNvbG9yO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGEsXG4gICAgICBnZXRQb3NpdGlvbixcbiAgICAgIGdldENvbG9yLFxuICAgICAgZ2V0UmFkaXVzXG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVyTWV0YShhbGxEYXRhLCBnZXRQb3NpdGlvbikge1xuICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZ2V0UG9pbnRzQm91bmRzKGFsbERhdGEsIGQgPT4gZ2V0UG9zaXRpb24oe2RhdGE6IGR9KSk7XG4gICAgdGhpcy51cGRhdGVNZXRhKHtib3VuZHN9KTtcbiAgfVxuXG4gIHJlbmRlckxheWVyKHtcbiAgICBkYXRhLFxuICAgIGlkeCxcbiAgICBsYXllckludGVyYWN0aW9uLFxuICAgIG9iamVjdEhvdmVyZWQsXG4gICAgbWFwU3RhdGUsXG4gICAgaW50ZXJhY3Rpb25Db25maWdcbiAgfSkge1xuICAgIGNvbnN0IGxheWVyUHJvcHMgPSB7XG4gICAgICBvdXRsaW5lOiB0aGlzLmNvbmZpZy52aXNDb25maWcub3V0bGluZSxcbiAgICAgIHJhZGl1c01pblBpeGVsczogMSxcbiAgICAgIGZwNjQ6IHRoaXMuY29uZmlnLnZpc0NvbmZpZ1snaGktcHJlY2lzaW9uJ10sXG4gICAgICBzdHJva2VXaWR0aDogdGhpcy5jb25maWcudmlzQ29uZmlnLnRoaWNrbmVzcyxcbiAgICAgIHJhZGl1c1NjYWxlOiB0aGlzLmdldFJhZGl1c1NjYWxlQnlab29tKG1hcFN0YXRlLnpvb20pLFxuICAgICAgLi4uKHRoaXMuY29uZmlnLnZpc0NvbmZpZy5maXhlZFJhZGl1cyA/IHt9IDoge3JhZGl1c01heFBpeGVsczogNTAwfSlcbiAgICB9O1xuXG4gICAgY29uc3QgYmFzZUxheWVyUHJvcCA9IHtcbiAgICAgIC4uLmxheWVyUHJvcHMsXG4gICAgICAuLi5sYXllckludGVyYWN0aW9uLFxuICAgICAgLi4uZGF0YSxcbiAgICAgIGlkeCxcbiAgICAgIG9wYWNpdHk6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5vcGFjaXR5LFxuICAgICAgcGlja2FibGU6IHRydWUsXG4gICAgICB1cGRhdGVUcmlnZ2Vyczoge1xuICAgICAgICBnZXRSYWRpdXM6IHtcbiAgICAgICAgICBzaXplRmllbGQ6IHRoaXMuY29uZmlnLmNvbG9yRmllbGQsXG4gICAgICAgICAgcmFkaXVzUmFuZ2U6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5yYWRpdXNSYW5nZSxcbiAgICAgICAgICBmaXhlZFJhZGl1czogdGhpcy5jb25maWcudmlzQ29uZmlnLmZpeGVkUmFkaXVzLFxuICAgICAgICAgIHNpemVTY2FsZTogdGhpcy5jb25maWcuc2l6ZVNjYWxlXG4gICAgICAgIH0sXG4gICAgICAgIGdldENvbG9yOiB7XG4gICAgICAgICAgY29sb3I6IHRoaXMuY29uZmlnLmNvbG9yLFxuICAgICAgICAgIGNvbG9yRmllbGQ6IHRoaXMuY29uZmlnLmNvbG9yRmllbGQsXG4gICAgICAgICAgY29sb3JSYW5nZTogdGhpcy5jb25maWcudmlzQ29uZmlnLmNvbG9yUmFuZ2UsXG4gICAgICAgICAgY29sb3JTY2FsZTogdGhpcy5jb25maWcuY29sb3JTY2FsZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBbXG4gICAgICAvLyBiYXNlIGxheWVyXG4gICAgICBpbnRlcmFjdGlvbkNvbmZpZy5icnVzaC5lbmFibGVkXG4gICAgICAgID8gbmV3IFNjYXR0ZXJwbG90QnJ1c2hpbmdMYXllcih7XG4gICAgICAgICAgICAuLi5iYXNlTGF5ZXJQcm9wLFxuICAgICAgICAgICAgaWQ6IGAke3RoaXMuaWR9LWJydXNoYCxcbiAgICAgICAgICAgIGVuYWJsZUJydXNoaW5nOiB0cnVlLFxuICAgICAgICAgICAgYnJ1c2hSYWRpdXM6IGludGVyYWN0aW9uQ29uZmlnLmJydXNoLmNvbmZpZy5zaXplICogMTAwMFxuICAgICAgICAgIH0pXG4gICAgICAgIDogbmV3IFNjYXR0ZXJwbG90TGF5ZXIoe1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICAuLi5iYXNlTGF5ZXJQcm9wXG4gICAgICAgICAgfSksXG5cbiAgICAgIC8vIGhvdmVyIGxheWVyXG4gICAgICAuLi4odGhpcy5pc0xheWVySG92ZXJlZChvYmplY3RIb3ZlcmVkKVxuICAgICAgICA/IFtcbiAgICAgICAgICAgIG5ldyBTY2F0dGVycGxvdExheWVyKHtcbiAgICAgICAgICAgICAgLi4ubGF5ZXJQcm9wcyxcbiAgICAgICAgICAgICAgaWQ6IGAke3RoaXMuaWR9LWhvdmVyZWRgLFxuICAgICAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgY29sb3I6IHRoaXMuY29uZmlnLmhpZ2hsaWdodENvbG9yLFxuICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGRhdGEuZ2V0UG9zaXRpb24ob2JqZWN0SG92ZXJlZC5vYmplY3QpLFxuICAgICAgICAgICAgICAgICAgcmFkaXVzOiBkYXRhLmdldFJhZGl1cyhvYmplY3RIb3ZlcmVkLm9iamVjdClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIHBpY2thYmxlOiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBdXG4gICAgICAgIDogW10pXG4gICAgXTtcbiAgfVxufVxuIl19