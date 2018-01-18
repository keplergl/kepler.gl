'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.aggregateRequiredColumns = exports.getValueAggr = exports.pointPosResolver = exports.pointPosAccessor = undefined;

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

var _lodash = require('lodash.memoize');

var _lodash2 = _interopRequireDefault(_lodash);

var _baseLayer = require('./base-layer');

var _baseLayer2 = _interopRequireDefault(_baseLayer);

var _colorUtils = require('../utils/color-utils');

var _aggregateUtils = require('../utils/aggregate-utils');

var _defaultSettings = require('../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pointPosAccessor = exports.pointPosAccessor = function pointPosAccessor(_ref) {
  var lat = _ref.lat,
      lng = _ref.lng;
  return function (d) {
    return [d[lng.fieldIdx], d[lat.fieldIdx]];
  };
};

var pointPosResolver = exports.pointPosResolver = function pointPosResolver(_ref2) {
  var lat = _ref2.lat,
      lng = _ref2.lng;
  return lat.fieldIdx + '-' + lng.fieldIdx;
};

var getValueAggr = exports.getValueAggr = function getValueAggr(field, aggregation) {
  return function (points) {
    return (0, _aggregateUtils.aggregate)(points.map(function (p) {
      return p[field.tableFieldIndex - 1];
    }), aggregation);
  };
};

var aggrResolver = function aggrResolver(field, aggregation) {
  return field.name + '-' + aggregation;
};

var getLayerColorRange = function getLayerColorRange(colorRange) {
  return colorRange.colors.map(_colorUtils.hexToRgb);
};

var aggregateRequiredColumns = exports.aggregateRequiredColumns = ['lat', 'lng'];

var AggregationLayer = function (_Layer) {
  (0, _inherits3.default)(AggregationLayer, _Layer);

  function AggregationLayer(props) {
    (0, _classCallCheck3.default)(this, AggregationLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, _Layer.call(this, props));

    _this.getPosition = (0, _lodash2.default)(pointPosAccessor, pointPosResolver);
    _this.getColorValue = (0, _lodash2.default)(getValueAggr, aggrResolver);
    _this.getColorRange = (0, _lodash2.default)(getLayerColorRange);
    _this.getElevationValue = (0, _lodash2.default)(getValueAggr, aggrResolver);
    return _this;
  }

  AggregationLayer.prototype.getHoverData = function getHoverData(object) {
    // return aggregated object
    return object;
  };

  /**
   * Aggregation layer handles visual channel aggregation inside deck.gl layer
   */


  AggregationLayer.prototype.updateLayerVisualChannel = function updateLayerVisualChannel(_ref3, channel) {
    var data = _ref3.data,
        allData = _ref3.allData;

    var visualChannel = this.visualChannels[channel];
    var field = visualChannel.field,
        scale = visualChannel.scale,
        channelScaleType = visualChannel.channelScaleType;


    if (this.config[field]) {
      // if field is selected, check if current selected scale is
      // supported, if not, update to default
      var scaleOptions = _defaultSettings.FIELD_OPTS[this.config[field].type].scale[channelScaleType];
      if (!scaleOptions.includes(this.config[scale])) {
        var _updateLayerConfig;

        this.updateLayerConfig((_updateLayerConfig = {}, _updateLayerConfig[scale] = scaleOptions[0], _updateLayerConfig));
      }
    }
  };

  /**
   * Aggregation layer handles visual channel aggregation inside deck.gl layer
   */


  AggregationLayer.prototype.updateLayerDomain = function updateLayerDomain(_ref4) {
    var data = _ref4.data,
        allData = _ref4.allData;

    return this;
  };

  AggregationLayer.prototype.updateLayerMeta = function updateLayerMeta(allData, getPosition) {
    // get bounds from points
    var bounds = this.getPointsBounds(allData, getPosition);

    // get lightSettings from points
    var lightSettings = this.getLightSettingsFromBounds(bounds);

    this.updateMeta({ bounds: bounds, lightSettings: lightSettings });
  };

  AggregationLayer.prototype.formatLayerData = function formatLayerData(_, allData, filteredIndex, oldLayerData) {
    var opt = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    var getPosition = this.getPosition(this.config.columns);

    if (!oldLayerData || oldLayerData.getPosition !== getPosition) {
      this.updateLayerMeta(allData, getPosition);
    }

    var getColorValue = this.config.colorField ? this.getColorValue(this.config.colorField, this.config.visConfig.colorAggregation) : undefined;

    var getElevationValue = this.config.sizeField ? this.getElevationValue(this.config.sizeField, this.config.visConfig.sizeAggregation) : undefined;

    var data = void 0;
    if (oldLayerData && oldLayerData.data && opt.sameData && oldLayerData.getPosition === getPosition) {

      data = oldLayerData.data;
    } else {

      data = filteredIndex.map(function (i) {
        return allData[i];
      });
    }

    return (0, _extends3.default)({
      data: data,
      getPosition: getPosition
    }, getColorValue ? { getColorValue: getColorValue } : {}, getElevationValue ? { getElevationValue: getElevationValue } : {});
  };

  (0, _createClass3.default)(AggregationLayer, [{
    key: 'isAggregated',
    get: function get() {
      return true;
    }
  }, {
    key: 'requiredLayerColumns',
    get: function get() {
      return aggregateRequiredColumns;
    }
  }, {
    key: 'columnPairs',
    get: function get() {
      return this.defaultPointColumnPairs;
    }
  }, {
    key: 'noneLayerDataAffectingProps',
    get: function get() {
      return [].concat(_Layer.prototype.noneLayerDataAffectingProps, ['enable3d', 'colorRange', 'colorScale', 'colorDomain', 'sizeRange', 'sizeScale', 'sizeDomain', 'percentile', 'coverage', 'elevationPercentile', 'elevationScale']);
    }
  }, {
    key: 'visualChannels',
    get: function get() {
      return {
        color: {
          property: 'color',
          field: 'colorField',
          scale: 'colorScale',
          domain: 'colorDomain',
          range: 'colorRange',
          key: 'color',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.colorAggr,
          defaultMeasure: 'Point Count'
        },
        size: {
          property: 'height',
          field: 'sizeField',
          scale: 'sizeScale',
          domain: 'sizeDomain',
          range: 'sizeRange',
          key: 'size',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.sizeAggr,
          defaultMeasure: 'Point Count',
          condition: function condition(config) {
            return config.visConfig.enable3d;
          }
        }
      };
    }
  }]);
  return AggregationLayer;
}(_baseLayer2.default);

exports.default = AggregationLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvYWdncmVnYXRpb24tbGF5ZXIuanMiXSwibmFtZXMiOlsicG9pbnRQb3NBY2Nlc3NvciIsImxhdCIsImxuZyIsImQiLCJmaWVsZElkeCIsInBvaW50UG9zUmVzb2x2ZXIiLCJnZXRWYWx1ZUFnZ3IiLCJmaWVsZCIsImFnZ3JlZ2F0aW9uIiwicG9pbnRzIiwibWFwIiwicCIsInRhYmxlRmllbGRJbmRleCIsImFnZ3JSZXNvbHZlciIsIm5hbWUiLCJnZXRMYXllckNvbG9yUmFuZ2UiLCJjb2xvclJhbmdlIiwiY29sb3JzIiwiYWdncmVnYXRlUmVxdWlyZWRDb2x1bW5zIiwiQWdncmVnYXRpb25MYXllciIsInByb3BzIiwiZ2V0UG9zaXRpb24iLCJnZXRDb2xvclZhbHVlIiwiZ2V0Q29sb3JSYW5nZSIsImdldEVsZXZhdGlvblZhbHVlIiwiZ2V0SG92ZXJEYXRhIiwib2JqZWN0IiwidXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsIiwiY2hhbm5lbCIsImRhdGEiLCJhbGxEYXRhIiwidmlzdWFsQ2hhbm5lbCIsInZpc3VhbENoYW5uZWxzIiwic2NhbGUiLCJjaGFubmVsU2NhbGVUeXBlIiwiY29uZmlnIiwic2NhbGVPcHRpb25zIiwidHlwZSIsImluY2x1ZGVzIiwidXBkYXRlTGF5ZXJDb25maWciLCJ1cGRhdGVMYXllckRvbWFpbiIsInVwZGF0ZUxheWVyTWV0YSIsImJvdW5kcyIsImdldFBvaW50c0JvdW5kcyIsImxpZ2h0U2V0dGluZ3MiLCJnZXRMaWdodFNldHRpbmdzRnJvbUJvdW5kcyIsInVwZGF0ZU1ldGEiLCJmb3JtYXRMYXllckRhdGEiLCJfIiwiZmlsdGVyZWRJbmRleCIsIm9sZExheWVyRGF0YSIsIm9wdCIsImNvbHVtbnMiLCJjb2xvckZpZWxkIiwidmlzQ29uZmlnIiwiY29sb3JBZ2dyZWdhdGlvbiIsInVuZGVmaW5lZCIsInNpemVGaWVsZCIsInNpemVBZ2dyZWdhdGlvbiIsInNhbWVEYXRhIiwiaSIsImRlZmF1bHRQb2ludENvbHVtblBhaXJzIiwibm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzIiwiY29sb3IiLCJwcm9wZXJ0eSIsImRvbWFpbiIsInJhbmdlIiwia2V5IiwiY29sb3JBZ2dyIiwiZGVmYXVsdE1lYXN1cmUiLCJzaXplIiwic2l6ZUFnZ3IiLCJjb25kaXRpb24iLCJlbmFibGUzZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBRU8sSUFBTUEsOENBQW1CLFNBQW5CQSxnQkFBbUI7QUFBQSxNQUFFQyxHQUFGLFFBQUVBLEdBQUY7QUFBQSxNQUFPQyxHQUFQLFFBQU9BLEdBQVA7QUFBQSxTQUFnQjtBQUFBLFdBQUssQ0FDbkRDLEVBQUVELElBQUlFLFFBQU4sQ0FEbUQsRUFFbkRELEVBQUVGLElBQUlHLFFBQU4sQ0FGbUQsQ0FBTDtBQUFBLEdBQWhCO0FBQUEsQ0FBekI7O0FBS0EsSUFBTUMsOENBQW1CLFNBQW5CQSxnQkFBbUI7QUFBQSxNQUFFSixHQUFGLFNBQUVBLEdBQUY7QUFBQSxNQUFPQyxHQUFQLFNBQU9BLEdBQVA7QUFBQSxTQUFtQkQsSUFBSUcsUUFBdkIsU0FBbUNGLElBQUlFLFFBQXZDO0FBQUEsQ0FBekI7O0FBRUEsSUFBTUUsc0NBQWUsU0FBZkEsWUFBZSxDQUFDQyxLQUFELEVBQVFDLFdBQVI7QUFBQSxTQUF3QjtBQUFBLFdBQ2xELCtCQUFVQyxPQUFPQyxHQUFQLENBQVc7QUFBQSxhQUFLQyxFQUFFSixNQUFNSyxlQUFOLEdBQXdCLENBQTFCLENBQUw7QUFBQSxLQUFYLENBQVYsRUFBeURKLFdBQXpELENBRGtEO0FBQUEsR0FBeEI7QUFBQSxDQUFyQjs7QUFHUCxJQUFNSyxlQUFlLFNBQWZBLFlBQWUsQ0FBQ04sS0FBRCxFQUFRQyxXQUFSO0FBQUEsU0FBMkJELE1BQU1PLElBQWpDLFNBQXlDTixXQUF6QztBQUFBLENBQXJCOztBQUVBLElBQU1PLHFCQUFxQixTQUFyQkEs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QUFSWCxTQURGO0FBV0xDLGNBQU07QUFDSk4sb0JBQVUsUUFETjtBQUVKekQsaUJBQU8sV0FGSDtBQUdKMEIsaUJBQU8sV0FISDtBQUlKZ0Msa0JBQVEsWUFKSjtBQUtKQyxpQkFBTyxXQUxIO0FBTUpDLGVBQUssTUFORDtBQU9KakMsNEJBQWtCLGdDQUFlcUMsUUFQN0I7QUFRSkYsMEJBQWdCLGFBUlo7QUFTSkcscUJBQVc7QUFBQSxtQkFBVXJDLE9BQU9tQixTQUFQLENBQWlCbUIsUUFBM0I7QUFBQTtBQVRQO0FBWEQsT0FBUDtBQXVCRDs7Ozs7a0JBL0RrQnRELGdCIiwiZmlsZSI6ImFnZ3JlZ2F0aW9uLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1lbW9pemUgZnJvbSAnbG9kYXNoLm1lbW9pemUnO1xuaW1wb3J0IExheWVyIGZyb20gJy4vYmFzZS1sYXllcic7XG5pbXBvcnQge2hleFRvUmdifSBmcm9tICcuLi91dGlscy9jb2xvci11dGlscyc7XG5pbXBvcnQge2FnZ3JlZ2F0ZX0gZnJvbSAnLi4vdXRpbHMvYWdncmVnYXRlLXV0aWxzJztcbmltcG9ydCB7Q0hBTk5FTF9TQ0FMRVMsIEZJRUxEX09QVFN9IGZyb20gJy4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuZXhwb3J0IGNvbnN0IHBvaW50UG9zQWNjZXNzb3IgPSAoe2xhdCwgbG5nfSkgPT4gZCA9PiBbXG4gIGRbbG5nLmZpZWxkSWR4XSxcbiAgZFtsYXQuZmllbGRJZHhdXG5dO1xuXG5leHBvcnQgY29uc3QgcG9pbnRQb3NSZXNvbHZlciA9ICh7bGF0LCBsbmd9KSA9PiBgJHtsYXQuZmllbGRJZHh9LSR7bG5nLmZpZWxkSWR4fWA7XG5cbmV4cG9ydCBjb25zdCBnZXRWYWx1ZUFnZ3IgPSAoZmllbGQsIGFnZ3JlZ2F0aW9uKSA9PiBwb2ludHMgPT5cbiAgYWdncmVnYXRlKHBvaW50cy5tYXAocCA9PiBwW2ZpZWxkLnRhYmxlRmllbGRJbmRleCAtIDFdKSwgYWdncmVnYXRpb24pO1xuXG5jb25zdCBhZ2dyUmVzb2x2ZXIgPSAoZmllbGQsIGFnZ3JlZ2F0aW9uKSA9PiBgJHtmaWVsZC5uYW1lfS0ke2FnZ3JlZ2F0aW9ufWA7XG5cbmNvbnN0IGdldExheWVyQ29sb3JSYW5nZSA9IGNvbG9yUmFuZ2UgPT4gY29sb3JSYW5nZS5jb2xvcnMubWFwKGhleFRvUmdiKTtcblxuZXhwb3J0IGNvbnN0IGFnZ3JlZ2F0ZVJlcXVpcmVkQ29sdW1ucyA9IFsnbGF0JywgJ2xuZyddO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBZ2dyZWdhdGlvbkxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuZ2V0UG9zaXRpb24gPSBtZW1vaXplKHBvaW50UG9zQWNjZXNzb3IsIHBvaW50UG9zUmVzb2x2ZXIpO1xuICAgIHRoaXMuZ2V0Q29sb3JWYWx1ZSA9IG1lbW9pemUoZ2V0VmFsdWVBZ2dyLCBhZ2dyUmVzb2x2ZXIpO1xuICAgIHRoaXMuZ2V0Q29sb3JSYW5nZSA9IG1lbW9pemUoZ2V0TGF5ZXJDb2xvclJhbmdlKTtcbiAgICB0aGlzLmdldEVsZXZhdGlvblZhbHVlID0gbWVtb2l6ZShnZXRWYWx1ZUFnZ3IsIGFnZ3JSZXNvbHZlcik7XG4gIH1cblxuICBnZXQgaXNBZ2dyZWdhdGVkKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZ2V0IHJlcXVpcmVkTGF5ZXJDb2x1bW5zKCkge1xuICAgIHJldHVybiBhZ2dyZWdhdGVSZXF1aXJlZENvbHVtbnM7XG4gIH1cblxuICBnZXQgY29sdW1uUGFpcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdFBvaW50Q29sdW1uUGFpcnM7XG4gIH1cblxuICBnZXQgbm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzKCkge1xuICAgIHJldHVybiBbXG4gICAgICAuLi5zdXBlci5ub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMsXG4gICAgICAnZW5hYmxlM2QnLFxuICAgICAgJ2NvbG9yUmFuZ2UnLFxuICAgICAgJ2NvbG9yU2NhbGUnLFxuICAgICAgJ2NvbG9yRG9tYWluJyxcbiAgICAgICdzaXplUmFuZ2UnLFxuICAgICAgJ3NpemVTY2FsZScsXG4gICAgICAnc2l6ZURvbWFpbicsXG4gICAgICAncGVyY2VudGlsZScsXG4gICAgICAnY292ZXJhZ2UnLFxuICAgICAgJ2VsZXZhdGlvblBlcmNlbnRpbGUnLFxuICAgICAgJ2VsZXZhdGlvblNjYWxlJ1xuICAgIF07XG4gIH1cblxuICBnZXQgdmlzdWFsQ2hhbm5lbHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiB7XG4gICAgICAgIHByb3BlcnR5OiAnY29sb3InLFxuICAgICAgICBmaWVsZDogJ2NvbG9yRmllbGQnLFxuICAgICAgICBzY2FsZTogJ2NvbG9yU2NhbGUnLFxuICAgICAgICBkb21haW46ICdjb2xvckRvbWFpbicsXG4gICAgICAgIHJhbmdlOiAnY29sb3JSYW5nZScsXG4gICAgICAgIGtleTogJ2NvbG9yJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuY29sb3JBZ2dyLFxuICAgICAgICBkZWZhdWx0TWVhc3VyZTogJ1BvaW50IENvdW50J1xuICAgICAgfSxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgcHJvcGVydHk6ICdoZWlnaHQnLFxuICAgICAgICBmaWVsZDogJ3NpemVGaWVsZCcsXG4gICAgICAgIHNjYWxlOiAnc2l6ZVNjYWxlJyxcbiAgICAgICAgZG9tYWluOiAnc2l6ZURvbWFpbicsXG4gICAgICAgIHJhbmdlOiAnc2l6ZVJhbmdlJyxcbiAgICAgICAga2V5OiAnc2l6ZScsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGU6IENIQU5ORUxfU0NBTEVTLnNpemVBZ2dyLFxuICAgICAgICBkZWZhdWx0TWVhc3VyZTogJ1BvaW50IENvdW50JyxcbiAgICAgICAgY29uZGl0aW9uOiBjb25maWcgPT4gY29uZmlnLnZpc0NvbmZpZy5lbmFibGUzZFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldEhvdmVyRGF0YShvYmplY3QpIHtcbiAgICAvLyByZXR1cm4gYWdncmVnYXRlZCBvYmplY3RcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIEFnZ3JlZ2F0aW9uIGxheWVyIGhhbmRsZXMgdmlzdWFsIGNoYW5uZWwgYWdncmVnYXRpb24gaW5zaWRlIGRlY2suZ2wgbGF5ZXJcbiAgICovXG4gIHVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbCh7ZGF0YSwgYWxsRGF0YX0sIGNoYW5uZWwpIHtcbiAgICBjb25zdCB2aXN1YWxDaGFubmVsID0gdGhpcy52aXN1YWxDaGFubmVsc1tjaGFubmVsXTtcbiAgICBjb25zdCB7ZmllbGQsIHNjYWxlLCBjaGFubmVsU2NhbGVUeXBlfSA9IHZpc3VhbENoYW5uZWw7XG5cbiAgICBpZiAodGhpcy5jb25maWdbZmllbGRdKSB7XG4gICAgICAvLyBpZiBmaWVsZCBpcyBzZWxlY3RlZCwgY2hlY2sgaWYgY3VycmVudCBzZWxlY3RlZCBzY2FsZSBpc1xuICAgICAgLy8gc3VwcG9ydGVkLCBpZiBub3QsIHVwZGF0ZSB0byBkZWZhdWx0XG4gICAgICBjb25zdCBzY2FsZU9wdGlvbnMgPSBGSUVMRF9PUFRTW3RoaXMuY29uZmlnW2ZpZWxkXS50eXBlXS5zY2FsZVtjaGFubmVsU2NhbGVUeXBlXTtcbiAgICAgIGlmICghc2NhbGVPcHRpb25zLmluY2x1ZGVzKHRoaXMuY29uZmlnW3NjYWxlXSkpIHtcbiAgICAgICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7W3NjYWxlXTogc2NhbGVPcHRpb25zWzBdfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWdncmVnYXRpb24gbGF5ZXIgaGFuZGxlcyB2aXN1YWwgY2hhbm5lbCBhZ2dyZWdhdGlvbiBpbnNpZGUgZGVjay5nbCBsYXllclxuICAgKi9cbiAgdXBkYXRlTGF5ZXJEb21haW4oe2RhdGEsIGFsbERhdGF9KSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1cGRhdGVMYXllck1ldGEoYWxsRGF0YSwgZ2V0UG9zaXRpb24pIHtcbiAgICAvLyBnZXQgYm91bmRzIGZyb20gcG9pbnRzXG4gICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRQb2ludHNCb3VuZHMoYWxsRGF0YSwgZ2V0UG9zaXRpb24pO1xuXG4gICAgLy8gZ2V0IGxpZ2h0U2V0dGluZ3MgZnJvbSBwb2ludHNcbiAgICBjb25zdCBsaWdodFNldHRpbmdzID0gdGhpcy5nZXRMaWdodFNldHRpbmdzRnJvbUJvdW5kcyhib3VuZHMpO1xuXG4gICAgdGhpcy51cGRhdGVNZXRhKHtib3VuZHMsIGxpZ2h0U2V0dGluZ3N9KTtcbiAgfVxuXG4gIGZvcm1hdExheWVyRGF0YShfLCBhbGxEYXRhLCBmaWx0ZXJlZEluZGV4LCBvbGRMYXllckRhdGEsIG9wdCA9IHt9KSB7XG4gICAgY29uc3QgZ2V0UG9zaXRpb24gPSB0aGlzLmdldFBvc2l0aW9uKHRoaXMuY29uZmlnLmNvbHVtbnMpO1xuXG4gICAgaWYgKCFvbGRMYXllckRhdGEgfHwgb2xkTGF5ZXJEYXRhLmdldFBvc2l0aW9uICE9PSBnZXRQb3NpdGlvbikge1xuICAgICAgdGhpcy51cGRhdGVMYXllck1ldGEoYWxsRGF0YSwgZ2V0UG9zaXRpb24pO1xuICAgIH1cblxuICAgIGNvbnN0IGdldENvbG9yVmFsdWUgPSB0aGlzLmNvbmZpZy5jb2xvckZpZWxkID9cbiAgICAgIHRoaXMuZ2V0Q29sb3JWYWx1ZSh0aGlzLmNvbmZpZy5jb2xvckZpZWxkLCB0aGlzLmNvbmZpZy52aXNDb25maWcuY29sb3JBZ2dyZWdhdGlvbikgOiB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBnZXRFbGV2YXRpb25WYWx1ZSA9IHRoaXMuY29uZmlnLnNpemVGaWVsZCA/XG4gICAgICB0aGlzLmdldEVsZXZhdGlvblZhbHVlKHRoaXMuY29uZmlnLnNpemVGaWVsZCwgdGhpcy5jb25maWcudmlzQ29uZmlnLnNpemVBZ2dyZWdhdGlvbikgOiB1bmRlZmluZWQ7XG5cbiAgICBsZXQgZGF0YTtcbiAgICBpZiAob2xkTGF5ZXJEYXRhICYmIG9sZExheWVyRGF0YS5kYXRhICYmIG9wdC5zYW1lRGF0YVxuICAgICAgJiYgb2xkTGF5ZXJEYXRhLmdldFBvc2l0aW9uID09PSBnZXRQb3NpdGlvbikge1xuXG4gICAgICBkYXRhID0gb2xkTGF5ZXJEYXRhLmRhdGE7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICBkYXRhID0gZmlsdGVyZWRJbmRleC5tYXAoaSA9PiBhbGxEYXRhW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YSxcbiAgICAgIGdldFBvc2l0aW9uLFxuICAgICAgLi4uKGdldENvbG9yVmFsdWUgPyB7Z2V0Q29sb3JWYWx1ZX0gOiB7fSksXG4gICAgICAuLi4oZ2V0RWxldmF0aW9uVmFsdWUgPyB7Z2V0RWxldmF0aW9uVmFsdWV9IDoge30pXG4gICAgfTtcbiAgfVxufVxuIl19