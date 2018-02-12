'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.aggregateRequiredColumns = exports.getValueAggr = exports.pointPosResolver = exports.pointPosAccessor = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

    var _this = (0, _possibleConstructorReturn3.default)(this, (AggregationLayer.__proto__ || Object.getPrototypeOf(AggregationLayer)).call(this, props));

    _this.getPosition = (0, _lodash2.default)(pointPosAccessor, pointPosResolver);
    _this.getColorValue = (0, _lodash2.default)(getValueAggr, aggrResolver);
    _this.getColorRange = (0, _lodash2.default)(getLayerColorRange);
    _this.getElevationValue = (0, _lodash2.default)(getValueAggr, aggrResolver);
    return _this;
  }

  (0, _createClass3.default)(AggregationLayer, [{
    key: 'getHoverData',
    value: function getHoverData(object) {
      // return aggregated object
      return object;
    }

    /**
     * Aggregation layer handles visual channel aggregation inside deck.gl layer
     */

  }, {
    key: 'updateLayerVisualChannel',
    value: function updateLayerVisualChannel(_ref3, channel) {
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
          this.updateLayerConfig((0, _defineProperty3.default)({}, scale, scaleOptions[0]));
        }
      }
    }

    /**
     * Aggregation layer handles visual channel aggregation inside deck.gl layer
     */

  }, {
    key: 'updateLayerDomain',
    value: function updateLayerDomain(_ref4) {
      var data = _ref4.data,
          allData = _ref4.allData;

      return this;
    }
  }, {
    key: 'updateLayerMeta',
    value: function updateLayerMeta(allData, getPosition) {
      // get bounds from points
      var bounds = this.getPointsBounds(allData, getPosition);

      // get lightSettings from points
      var lightSettings = this.getLightSettingsFromBounds(bounds);

      this.updateMeta({ bounds: bounds, lightSettings: lightSettings });
    }
  }, {
    key: 'formatLayerData',
    value: function formatLayerData(_, allData, filteredIndex, oldLayerData) {
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
    }
  }, {
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
      return [].concat((0, _toConsumableArray3.default)((0, _get3.default)(AggregationLayer.prototype.__proto__ || Object.getPrototypeOf(AggregationLayer.prototype), 'noneLayerDataAffectingProps', this)), ['enable3d', 'colorRange', 'colorScale', 'colorDomain', 'sizeRange', 'sizeScale', 'sizeDomain', 'percentile', 'coverage', 'elevationPercentile', 'elevationScale']);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvYWdncmVnYXRpb24tbGF5ZXIuanMiXSwibmFtZXMiOlsicG9pbnRQb3NBY2Nlc3NvciIsImxhdCIsImxuZyIsImQiLCJmaWVsZElkeCIsInBvaW50UG9zUmVzb2x2ZXIiLCJnZXRWYWx1ZUFnZ3IiLCJmaWVsZCIsImFnZ3JlZ2F0aW9uIiwicG9pbnRzIiwibWFwIiwicCIsInRhYmxlRmllbGRJbmRleCIsImFnZ3JSZXNvbHZlciIsIm5hbWUiLCJnZXRMYXllckNvbG9yUmFuZ2UiLCJjb2xvclJhbmdlIiwiY29sb3JzIiwiYWdncmVnYXRlUmVxdWlyZWRDb2x1bW5zIiwiQWdncmVnYXRpb25MYXllciIsInByb3BzIiwiZ2V0UG9zaXRpb24iLCJnZXRDb2xvclZhbHVlIiwiZ2V0Q29sb3JSYW5nZSIsImdldEVsZXZhdGlvblZhbHVlIiwib2JqZWN0IiwiY2hhbm5lbCIsImRhdGEiLCJhbGxEYXRhIiwidmlzdWFsQ2hhbm5lbCIsInZpc3VhbENoYW5uZWxzIiwic2NhbGUiLCJjaGFubmVsU2NhbGVUeXBlIiwiY29uZmlnIiwic2NhbGVPcHRpb25zIiwidHlwZSIsImluY2x1ZGVzIiwidXBkYXRlTGF5ZXJDb25maWciLCJib3VuZHMiLCJnZXRQb2ludHNCb3VuZHMiLCJsaWdodFNldHRpbmdzIiwiZ2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHMiLCJ1cGRhdGVNZXRhIiwiXyIsImZpbHRlcmVkSW5kZXgiLCJvbGRMYXllckRhdGEiLCJvcHQiLCJjb2x1bW5zIiwidXBkYXRlTGF5ZXJNZXRhIiwiY29sb3JGaWVsZCIsInZpc0NvbmZpZyIsImNvbG9yQWdncmVnYXRpb24iLCJ1bmRlZmluZWQiLCJzaXplRmllbGQiLCJzaXplQWdncmVnYXRpb24iLCJzYW1lRGF0YSIsImkiLCJkZWZhdWx0UG9pbnRDb2x1bW5QYWlycyIsImNvbG9yIiwicHJvcGVydHkiLCJkb21haW4iLCJyYW5nZSIsImtleSIsImNvbG9yQWdnciIs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Q0FBaUJrQixRQUEzQjtBQUFBO0FBVFA7QUFYRCxPQUFQO0FBdUJEOzs7OztrQkEvRGtCakQsZ0IiLCJmaWxlIjoiYWdncmVnYXRpb24tbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWVtb2l6ZSBmcm9tICdsb2Rhc2gubWVtb2l6ZSc7XG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi9iYXNlLWxheWVyJztcbmltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJy4uL3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCB7YWdncmVnYXRlfSBmcm9tICcuLi91dGlscy9hZ2dyZWdhdGUtdXRpbHMnO1xuaW1wb3J0IHtDSEFOTkVMX1NDQUxFUywgRklFTERfT1BUU30gZnJvbSAnLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5leHBvcnQgY29uc3QgcG9pbnRQb3NBY2Nlc3NvciA9ICh7bGF0LCBsbmd9KSA9PiBkID0+IFtcbiAgZFtsbmcuZmllbGRJZHhdLFxuICBkW2xhdC5maWVsZElkeF1cbl07XG5cbmV4cG9ydCBjb25zdCBwb2ludFBvc1Jlc29sdmVyID0gKHtsYXQsIGxuZ30pID0+XG4gIGAke2xhdC5maWVsZElkeH0tJHtsbmcuZmllbGRJZHh9YDtcblxuZXhwb3J0IGNvbnN0IGdldFZhbHVlQWdnciA9IChmaWVsZCwgYWdncmVnYXRpb24pID0+IHBvaW50cyA9PlxuICBhZ2dyZWdhdGUocG9pbnRzLm1hcChwID0+IHBbZmllbGQudGFibGVGaWVsZEluZGV4IC0gMV0pLCBhZ2dyZWdhdGlvbik7XG5cbmNvbnN0IGFnZ3JSZXNvbHZlciA9IChmaWVsZCwgYWdncmVnYXRpb24pID0+IGAke2ZpZWxkLm5hbWV9LSR7YWdncmVnYXRpb259YDtcblxuY29uc3QgZ2V0TGF5ZXJDb2xvclJhbmdlID0gY29sb3JSYW5nZSA9PiBjb2xvclJhbmdlLmNvbG9ycy5tYXAoaGV4VG9SZ2IpO1xuXG5leHBvcnQgY29uc3QgYWdncmVnYXRlUmVxdWlyZWRDb2x1bW5zID0gWydsYXQnLCAnbG5nJ107XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFnZ3JlZ2F0aW9uTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5nZXRQb3NpdGlvbiA9IG1lbW9pemUocG9pbnRQb3NBY2Nlc3NvciwgcG9pbnRQb3NSZXNvbHZlcik7XG4gICAgdGhpcy5nZXRDb2xvclZhbHVlID0gbWVtb2l6ZShnZXRWYWx1ZUFnZ3IsIGFnZ3JSZXNvbHZlcik7XG4gICAgdGhpcy5nZXRDb2xvclJhbmdlID0gbWVtb2l6ZShnZXRMYXllckNvbG9yUmFuZ2UpO1xuICAgIHRoaXMuZ2V0RWxldmF0aW9uVmFsdWUgPSBtZW1vaXplKGdldFZhbHVlQWdnciwgYWdnclJlc29sdmVyKTtcbiAgfVxuXG4gIGdldCBpc0FnZ3JlZ2F0ZWQoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBnZXQgcmVxdWlyZWRMYXllckNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIGFnZ3JlZ2F0ZVJlcXVpcmVkQ29sdW1ucztcbiAgfVxuXG4gIGdldCBjb2x1bW5QYWlycygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0UG9pbnRDb2x1bW5QYWlycztcbiAgfVxuXG4gIGdldCBub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIC4uLnN1cGVyLm5vbmVMYXllckRhdGFBZmZlY3RpbmdQcm9wcyxcbiAgICAgICdlbmFibGUzZCcsXG4gICAgICAnY29sb3JSYW5nZScsXG4gICAgICAnY29sb3JTY2FsZScsXG4gICAgICAnY29sb3JEb21haW4nLFxuICAgICAgJ3NpemVSYW5nZScsXG4gICAgICAnc2l6ZVNjYWxlJyxcbiAgICAgICdzaXplRG9tYWluJyxcbiAgICAgICdwZXJjZW50aWxlJyxcbiAgICAgICdjb3ZlcmFnZScsXG4gICAgICAnZWxldmF0aW9uUGVyY2VudGlsZScsXG4gICAgICAnZWxldmF0aW9uU2NhbGUnXG4gICAgXTtcbiAgfVxuXG4gIGdldCB2aXN1YWxDaGFubmVscygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6IHtcbiAgICAgICAgcHJvcGVydHk6ICdjb2xvcicsXG4gICAgICAgIGZpZWxkOiAnY29sb3JGaWVsZCcsXG4gICAgICAgIHNjYWxlOiAnY29sb3JTY2FsZScsXG4gICAgICAgIGRvbWFpbjogJ2NvbG9yRG9tYWluJyxcbiAgICAgICAgcmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgICAgICAga2V5OiAnY29sb3InLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiBDSEFOTkVMX1NDQUxFUy5jb2xvckFnZ3IsXG4gICAgICAgIGRlZmF1bHRNZWFzdXJlOiAnUG9pbnQgQ291bnQnXG4gICAgICB9LFxuICAgICAgc2l6ZToge1xuICAgICAgICBwcm9wZXJ0eTogJ2hlaWdodCcsXG4gICAgICAgIGZpZWxkOiAnc2l6ZUZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICdzaXplU2NhbGUnLFxuICAgICAgICBkb21haW46ICdzaXplRG9tYWluJyxcbiAgICAgICAgcmFuZ2U6ICdzaXplUmFuZ2UnLFxuICAgICAgICBrZXk6ICdzaXplJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuc2l6ZUFnZ3IsXG4gICAgICAgIGRlZmF1bHRNZWFzdXJlOiAnUG9pbnQgQ291bnQnLFxuICAgICAgICBjb25kaXRpb246IGNvbmZpZyA9PiBjb25maWcudmlzQ29uZmlnLmVuYWJsZTNkXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGdldEhvdmVyRGF0YShvYmplY3QpIHtcbiAgICAvLyByZXR1cm4gYWdncmVnYXRlZCBvYmplY3RcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIEFnZ3JlZ2F0aW9uIGxheWVyIGhhbmRsZXMgdmlzdWFsIGNoYW5uZWwgYWdncmVnYXRpb24gaW5zaWRlIGRlY2suZ2wgbGF5ZXJcbiAgICovXG4gIHVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbCh7ZGF0YSwgYWxsRGF0YX0sIGNoYW5uZWwpIHtcbiAgICBjb25zdCB2aXN1YWxDaGFubmVsID0gdGhpcy52aXN1YWxDaGFubmVsc1tjaGFubmVsXTtcbiAgICBjb25zdCB7ZmllbGQsIHNjYWxlLCBjaGFubmVsU2NhbGVUeXBlfSA9IHZpc3VhbENoYW5uZWw7XG5cbiAgICBpZiAodGhpcy5jb25maWdbZmllbGRdKSB7XG4gICAgICAvLyBpZiBmaWVsZCBpcyBzZWxlY3RlZCwgY2hlY2sgaWYgY3VycmVudCBzZWxlY3RlZCBzY2FsZSBpc1xuICAgICAgLy8gc3VwcG9ydGVkLCBpZiBub3QsIHVwZGF0ZSB0byBkZWZhdWx0XG4gICAgICBjb25zdCBzY2FsZU9wdGlvbnMgPVxuICAgICAgICBGSUVMRF9PUFRTW3RoaXMuY29uZmlnW2ZpZWxkXS50eXBlXS5zY2FsZVtjaGFubmVsU2NhbGVUeXBlXTtcbiAgICAgIGlmICghc2NhbGVPcHRpb25zLmluY2x1ZGVzKHRoaXMuY29uZmlnW3NjYWxlXSkpIHtcbiAgICAgICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7W3NjYWxlXTogc2NhbGVPcHRpb25zWzBdfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFnZ3JlZ2F0aW9uIGxheWVyIGhhbmRsZXMgdmlzdWFsIGNoYW5uZWwgYWdncmVnYXRpb24gaW5zaWRlIGRlY2suZ2wgbGF5ZXJcbiAgICovXG4gIHVwZGF0ZUxheWVyRG9tYWluKHtkYXRhLCBhbGxEYXRhfSkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEsIGdldFBvc2l0aW9uKSB7XG4gICAgLy8gZ2V0IGJvdW5kcyBmcm9tIHBvaW50c1xuICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZ2V0UG9pbnRzQm91bmRzKGFsbERhdGEsIGdldFBvc2l0aW9uKTtcblxuICAgIC8vIGdldCBsaWdodFNldHRpbmdzIGZyb20gcG9pbnRzXG4gICAgY29uc3QgbGlnaHRTZXR0aW5ncyA9IHRoaXMuZ2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHMoYm91bmRzKTtcblxuICAgIHRoaXMudXBkYXRlTWV0YSh7Ym91bmRzLCBsaWdodFNldHRpbmdzfSk7XG4gIH1cblxuICBmb3JtYXRMYXllckRhdGEoXywgYWxsRGF0YSwgZmlsdGVyZWRJbmRleCwgb2xkTGF5ZXJEYXRhLCBvcHQgPSB7fSkge1xuICAgIGNvbnN0IGdldFBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbih0aGlzLmNvbmZpZy5jb2x1bW5zKTtcblxuICAgIGlmICghb2xkTGF5ZXJEYXRhIHx8IG9sZExheWVyRGF0YS5nZXRQb3NpdGlvbiAhPT0gZ2V0UG9zaXRpb24pIHtcbiAgICAgIHRoaXMudXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEsIGdldFBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBjb25zdCBnZXRDb2xvclZhbHVlID0gdGhpcy5jb25maWcuY29sb3JGaWVsZFxuICAgICAgPyB0aGlzLmdldENvbG9yVmFsdWUoXG4gICAgICAgICAgdGhpcy5jb25maWcuY29sb3JGaWVsZCxcbiAgICAgICAgICB0aGlzLmNvbmZpZy52aXNDb25maWcuY29sb3JBZ2dyZWdhdGlvblxuICAgICAgICApXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IGdldEVsZXZhdGlvblZhbHVlID0gdGhpcy5jb25maWcuc2l6ZUZpZWxkXG4gICAgICA/IHRoaXMuZ2V0RWxldmF0aW9uVmFsdWUoXG4gICAgICAgICAgdGhpcy5jb25maWcuc2l6ZUZpZWxkLFxuICAgICAgICAgIHRoaXMuY29uZmlnLnZpc0NvbmZpZy5zaXplQWdncmVnYXRpb25cbiAgICAgICAgKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBsZXQgZGF0YTtcbiAgICBpZiAoXG4gICAgICBvbGRMYXllckRhdGEgJiZcbiAgICAgIG9sZExheWVyRGF0YS5kYXRhICYmXG4gICAgICBvcHQuc2FtZURhdGEgJiZcbiAgICAgIG9sZExheWVyRGF0YS5nZXRQb3NpdGlvbiA9PT0gZ2V0UG9zaXRpb25cbiAgICApIHtcbiAgICAgIGRhdGEgPSBvbGRMYXllckRhdGEuZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IGZpbHRlcmVkSW5kZXgubWFwKGkgPT4gYWxsRGF0YVtpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGEsXG4gICAgICBnZXRQb3NpdGlvbixcbiAgICAgIC4uLihnZXRDb2xvclZhbHVlID8ge2dldENvbG9yVmFsdWV9IDoge30pLFxuICAgICAgLi4uKGdldEVsZXZhdGlvblZhbHVlID8ge2dldEVsZXZhdGlvblZhbHVlfSA6IHt9KVxuICAgIH07XG4gIH1cbn1cbiJdfQ==