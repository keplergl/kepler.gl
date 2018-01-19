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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvYWdncmVnYXRpb24tbGF5ZXIuanMiXSwibmFtZXMiOlsicG9pbnRQb3NBY2Nlc3NvciIsImxhdCIsImxuZyIsImQiLCJmaWVsZElkeCIsInBvaW50UG9zUmVzb2x2ZXIiLCJnZXRWYWx1ZUFnZ3IiLCJmaWVsZCIsImFnZ3JlZ2F0aW9uIiwicG9pbnRzIiwibWFwIiwicCIsInRhYmxlRmllbGRJbmRleCIsImFnZ3JSZXNvbHZlciIsIm5hbWUiLCJnZXRMYXllckNvbG9yUmFuZ2UiLCJjb2xvclJhbmdlIiwiY29sb3JzIiwiYWdncmVnYXRlUmVxdWlyZWRDb2x1bW5zIiwiQWdncmVnYXRpb25MYXllciIsInByb3BzIiwiZ2V0UG9zaXRpb24iLCJnZXRDb2xvclZhbHVlIiwiZ2V0Q29sb3JSYW5nZSIsImdldEVsZXZhdGlvblZhbHVlIiwiZ2V0SG92ZXJEYXRhIiwib2JqZWN0IiwidXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsIiwiY2hhbm5lbCIsImRhdGEiLCJhbGxEYXRhIiwidmlzdWFsQ2hhbm5lbCIsInZpc3VhbENoYW5uZWxzIiwic2NhbGUiLCJjaGFubmVsU2NhbGVUeXBlIiwiY29uZmlnIiwic2NhbGVPcHRpb25zIiwidHlwZSIsImluY2x1ZGVzIiwidXBkYXRlTGF5ZXJDb25maWciLCJ1cGRhdGVMYXllckRvbWFpbiIsInVwZGF0ZUxheWVyTWV0YSIsImJvdW5kcyIsImdldFBvaW50c0JvdW5kcyIsImxpZ2h0U2V0dGluZ3MiLCJnZXRMaWdodFNldHRpbmdzRnJvbUJvdW5kcyIsInVwZGF0ZU1ldGEiLCJmb3JtYXRMYXllckRhdGEiLCJfIiwiZmlsdGVyZWRJbmRleCIsIm9sZExheWVyRGF0YSIsIm9wdCIsImNvbHVtbnMiLCJjb2xvckZpZWxkIiwidmlzQ29uZmlnIiwiY29sb3JBZ2dyZWdhdGlvbiIsInVuZGVmaW5lZCIsInNpemVGaWVsZCIsInNpemVBZ2dyZWdhdGlvbiIsInNhbWVEYXRhIiwiaSIsImRlZmF1bHRQb2ludENvbHVtblBhaXJzIiwibm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzIiwiY29sb3IiLCJwcm9wZXJ0eSIsImRvbWFpbiIsInJhbmdlIiwia2V5IiwiY29sb3JBZ2dyIiwiZGVmYXVsdE1lYXN1cmUiLCJzaXplIiwic2l6ZUFnZ3IiLCJjb25kaXRpb24iLCJlbmFibGUzZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBRU8sSUFBTUEsOENBQW1CLFNBQW5CQSxnQkFBbUI7QUFBQSxNQUFFQyxHQUFGLFFBQUVBLEdBQUY7QUFBQSxNQUFPQyxHQUFQLFFBQU9BLEdBQVA7QUFBQSxTQUFnQjtBQUFBLFdBQUssQ0FDbkRDLEVBQUVELElBQUlFLFFBQU4sQ0FEbUQsRUFFbkRELEVBQUVGLElBQUlHLFFBQU4sQ0FGbUQsQ0FBTDtBQUFBLEdBQWhCO0FBQUEsQ0FBekI7O0FBS0EsSUFBTUMsOENBQW1CLFNBQW5CQSxnQkFBbUI7QUFBQSxNQUFFSixHQUFGLFNBQUVBLEdBQUY7QUFBQSxNQUFPQyxHQUFQLFNBQU9BLEdBQVA7QUFBQSxTQUMzQkQsSUFBSUcsUUFEdUIsU0FDWEYsSUFBSUUsUUFETztBQUFBLENBQXpCOztBQUdBLElBQU1FLHNDQUFlLFNBQWZBLFlBQWUsQ0FBQ0MsS0FBRCxFQUFRQyxXQUFSO0FBQUEsU0FBd0I7QUFBQSxXQUNsRCwrQkFBVUMsT0FBT0MsR0FBUCxDQUFXO0FBQUEsYUFBS0MsRUFBRUosTUFBTUssZUFBTixHQUF3QixDQUExQixDQUFMO0FBQUEsS0FBWCxDQUFWLEVBQXlESixXQUF6RCxDQURrRDtBQUFBLEdBQXhCO0FBQUEsQ0FBckI7O0FBR1AsSUFBTUssZUFBZSxTQUFmQSxZQUFlLENBQUNOLEtBQUQsRUFBUUMsV0FBUjtBQUFBLFNBQTJCRCxNQUFNTyxJQUFqQyxTQUF5Q04sV0FBekM7QUFBQSxDQUFyQjs7QUFFQSxJQUFNTyxxQkFBcUIsU0FBckJBLGtC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TTtBQUNKTixvQkFBVSxRQUROO0FBRUp6RCxpQkFBTyxXQUZIO0FBR0owQixpQkFBTyxXQUhIO0FBSUpnQyxrQkFBUSxZQUpKO0FBS0pDLGlCQUFPLFdBTEg7QUFNSkMsZUFBSyxNQU5EO0FBT0pqQyw0QkFBa0IsZ0NBQWVxQyxRQVA3QjtBQVFKRiwwQkFBZ0IsYUFSWjtBQVNKRyxxQkFBVztBQUFBLG1CQUFVckMsT0FBT21CLFNBQVAsQ0FBaUJtQixRQUEzQjtBQUFBO0FBVFA7QUFYRCxPQUFQO0FBdUJEOzs7OztrQkEvRGtCdEQsZ0IiLCJmaWxlIjoiYWdncmVnYXRpb24tbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWVtb2l6ZSBmcm9tICdsb2Rhc2gubWVtb2l6ZSc7XG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi9iYXNlLWxheWVyJztcbmltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJy4uL3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCB7YWdncmVnYXRlfSBmcm9tICcuLi91dGlscy9hZ2dyZWdhdGUtdXRpbHMnO1xuaW1wb3J0IHtDSEFOTkVMX1NDQUxFUywgRklFTERfT1BUU30gZnJvbSAnLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5leHBvcnQgY29uc3QgcG9pbnRQb3NBY2Nlc3NvciA9ICh7bGF0LCBsbmd9KSA9PiBkID0+IFtcbiAgZFtsbmcuZmllbGRJZHhdLFxuICBkW2xhdC5maWVsZElkeF1cbl07XG5cbmV4cG9ydCBjb25zdCBwb2ludFBvc1Jlc29sdmVyID0gKHtsYXQsIGxuZ30pID0+XG4gIGAke2xhdC5maWVsZElkeH0tJHtsbmcuZmllbGRJZHh9YDtcblxuZXhwb3J0IGNvbnN0IGdldFZhbHVlQWdnciA9IChmaWVsZCwgYWdncmVnYXRpb24pID0+IHBvaW50cyA9PlxuICBhZ2dyZWdhdGUocG9pbnRzLm1hcChwID0+IHBbZmllbGQudGFibGVGaWVsZEluZGV4IC0gMV0pLCBhZ2dyZWdhdGlvbik7XG5cbmNvbnN0IGFnZ3JSZXNvbHZlciA9IChmaWVsZCwgYWdncmVnYXRpb24pID0+IGAke2ZpZWxkLm5hbWV9LSR7YWdncmVnYXRpb259YDtcblxuY29uc3QgZ2V0TGF5ZXJDb2xvclJhbmdlID0gY29sb3JSYW5nZSA9PiBjb2xvclJhbmdlLmNvbG9ycy5tYXAoaGV4VG9SZ2IpO1xuXG5leHBvcnQgY29uc3QgYWdncmVnYXRlUmVxdWlyZWRDb2x1bW5zID0gWydsYXQnLCAnbG5nJ107XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFnZ3JlZ2F0aW9uTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5nZXRQb3NpdGlvbiA9IG1lbW9pemUocG9pbnRQb3NBY2Nlc3NvciwgcG9pbnRQb3NSZXNvbHZlcik7XG4gICAgdGhpcy5nZXRDb2xvclZhbHVlID0gbWVtb2l6ZShnZXRWYWx1ZUFnZ3IsIGFnZ3JSZXNvbHZlcik7XG4gICAgdGhpcy5nZXRDb2xvclJhbmdlID0gbWVtb2l6ZShnZXRMYXllckNvbG9yUmFuZ2UpO1xuICAgIHRoaXMuZ2V0RWxldmF0aW9uVmFsdWUgPSBtZW1vaXplKGdldFZhbHVlQWdnciwgYWdnclJlc29sdmVyKTtcbiAgfVxuXG4gIGdldCBpc0FnZ3JlZ2F0ZWQoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBnZXQgcmVxdWlyZWRMYXllckNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIGFnZ3JlZ2F0ZVJlcXVpcmVkQ29sdW1ucztcbiAgfVxuXG4gIGdldCBjb2x1bW5QYWlycygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0UG9pbnRDb2x1bW5QYWlycztcbiAgfVxuXG4gIGdldCBub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIC4uLnN1cGVyLm5vbmVMYXllckRhdGFBZmZlY3RpbmdQcm9wcyxcbiAgICAgICdlbmFibGUzZCcsXG4gICAgICAnY29sb3JSYW5nZScsXG4gICAgICAnY29sb3JTY2FsZScsXG4gICAgICAnY29sb3JEb21haW4nLFxuICAgICAgJ3NpemVSYW5nZScsXG4gICAgICAnc2l6ZVNjYWxlJyxcbiAgICAgICdzaXplRG9tYWluJyxcbiAgICAgICdwZXJjZW50aWxlJyxcbiAgICAgICdjb3ZlcmFnZScsXG4gICAgICAnZWxldmF0aW9uUGVyY2VudGlsZScsXG4gICAgICAnZWxldmF0aW9uU2NhbGUnXG4gICAgXTtcbiAgfVxuXG4gIGdldCB2aXN1YWxDaGFubmVscygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6IHtcbiAgICAgICAgcHJvcGVydHk6ICdjb2xvcicsXG4gICAgICAgIGZpZWxkOiAnY29sb3JGaWVsZCcsXG4gICAgICAgIHNjYWxlOiAnY29sb3JTY2FsZScsXG4gICAgICAgIGRvbWFpbjogJ2NvbG9yRG9tYWluJyxcbiAgICAgICAgcmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgICAgICAga2V5OiAnY29sb3InLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiBDSEFOTkVMX1NDQUxFUy5jb2xvckFnZ3IsXG4gICAgICAgIGRlZmF1bHRNZWFzdXJlOiAnUG9pbnQgQ291bnQnXG4gICAgICB9LFxuICAgICAgc2l6ZToge1xuICAgICAgICBwcm9wZXJ0eTogJ2hlaWdodCcsXG4gICAgICAgIGZpZWxkOiAnc2l6ZUZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICdzaXplU2NhbGUnLFxuICAgICAgICBkb21haW46ICdzaXplRG9tYWluJyxcbiAgICAgICAgcmFuZ2U6ICdzaXplUmFuZ2UnLFxuICAgICAgICBrZXk6ICdzaXplJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogQ0hBTk5FTF9TQ0FMRVMuc2l6ZUFnZ3IsXG4gICAgICAgIGRlZmF1bHRNZWFzdXJlOiAnUG9pbnQgQ291bnQnLFxuICAgICAgICBjb25kaXRpb246IGNvbmZpZyA9PiBjb25maWcudmlzQ29uZmlnLmVuYWJsZTNkXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGdldEhvdmVyRGF0YShvYmplY3QpIHtcbiAgICAvLyByZXR1cm4gYWdncmVnYXRlZCBvYmplY3RcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIEFnZ3JlZ2F0aW9uIGxheWVyIGhhbmRsZXMgdmlzdWFsIGNoYW5uZWwgYWdncmVnYXRpb24gaW5zaWRlIGRlY2suZ2wgbGF5ZXJcbiAgICovXG4gIHVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbCh7ZGF0YSwgYWxsRGF0YX0sIGNoYW5uZWwpIHtcbiAgICBjb25zdCB2aXN1YWxDaGFubmVsID0gdGhpcy52aXN1YWxDaGFubmVsc1tjaGFubmVsXTtcbiAgICBjb25zdCB7ZmllbGQsIHNjYWxlLCBjaGFubmVsU2NhbGVUeXBlfSA9IHZpc3VhbENoYW5uZWw7XG5cbiAgICBpZiAodGhpcy5jb25maWdbZmllbGRdKSB7XG4gICAgICAvLyBpZiBmaWVsZCBpcyBzZWxlY3RlZCwgY2hlY2sgaWYgY3VycmVudCBzZWxlY3RlZCBzY2FsZSBpc1xuICAgICAgLy8gc3VwcG9ydGVkLCBpZiBub3QsIHVwZGF0ZSB0byBkZWZhdWx0XG4gICAgICBjb25zdCBzY2FsZU9wdGlvbnMgPVxuICAgICAgICBGSUVMRF9PUFRTW3RoaXMuY29uZmlnW2ZpZWxkXS50eXBlXS5zY2FsZVtjaGFubmVsU2NhbGVUeXBlXTtcbiAgICAgIGlmICghc2NhbGVPcHRpb25zLmluY2x1ZGVzKHRoaXMuY29uZmlnW3NjYWxlXSkpIHtcbiAgICAgICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7W3NjYWxlXTogc2NhbGVPcHRpb25zWzBdfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFnZ3JlZ2F0aW9uIGxheWVyIGhhbmRsZXMgdmlzdWFsIGNoYW5uZWwgYWdncmVnYXRpb24gaW5zaWRlIGRlY2suZ2wgbGF5ZXJcbiAgICovXG4gIHVwZGF0ZUxheWVyRG9tYWluKHtkYXRhLCBhbGxEYXRhfSkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEsIGdldFBvc2l0aW9uKSB7XG4gICAgLy8gZ2V0IGJvdW5kcyBmcm9tIHBvaW50c1xuICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZ2V0UG9pbnRzQm91bmRzKGFsbERhdGEsIGdldFBvc2l0aW9uKTtcblxuICAgIC8vIGdldCBsaWdodFNldHRpbmdzIGZyb20gcG9pbnRzXG4gICAgY29uc3QgbGlnaHRTZXR0aW5ncyA9IHRoaXMuZ2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHMoYm91bmRzKTtcblxuICAgIHRoaXMudXBkYXRlTWV0YSh7Ym91bmRzLCBsaWdodFNldHRpbmdzfSk7XG4gIH1cblxuICBmb3JtYXRMYXllckRhdGEoXywgYWxsRGF0YSwgZmlsdGVyZWRJbmRleCwgb2xkTGF5ZXJEYXRhLCBvcHQgPSB7fSkge1xuICAgIGNvbnN0IGdldFBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbih0aGlzLmNvbmZpZy5jb2x1bW5zKTtcblxuICAgIGlmICghb2xkTGF5ZXJEYXRhIHx8IG9sZExheWVyRGF0YS5nZXRQb3NpdGlvbiAhPT0gZ2V0UG9zaXRpb24pIHtcbiAgICAgIHRoaXMudXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEsIGdldFBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBjb25zdCBnZXRDb2xvclZhbHVlID0gdGhpcy5jb25maWcuY29sb3JGaWVsZFxuICAgICAgPyB0aGlzLmdldENvbG9yVmFsdWUoXG4gICAgICAgICAgdGhpcy5jb25maWcuY29sb3JGaWVsZCxcbiAgICAgICAgICB0aGlzLmNvbmZpZy52aXNDb25maWcuY29sb3JBZ2dyZWdhdGlvblxuICAgICAgICApXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IGdldEVsZXZhdGlvblZhbHVlID0gdGhpcy5jb25maWcuc2l6ZUZpZWxkXG4gICAgICA/IHRoaXMuZ2V0RWxldmF0aW9uVmFsdWUoXG4gICAgICAgICAgdGhpcy5jb25maWcuc2l6ZUZpZWxkLFxuICAgICAgICAgIHRoaXMuY29uZmlnLnZpc0NvbmZpZy5zaXplQWdncmVnYXRpb25cbiAgICAgICAgKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBsZXQgZGF0YTtcbiAgICBpZiAoXG4gICAgICBvbGRMYXllckRhdGEgJiZcbiAgICAgIG9sZExheWVyRGF0YS5kYXRhICYmXG4gICAgICBvcHQuc2FtZURhdGEgJiZcbiAgICAgIG9sZExheWVyRGF0YS5nZXRQb3NpdGlvbiA9PT0gZ2V0UG9zaXRpb25cbiAgICApIHtcbiAgICAgIGRhdGEgPSBvbGRMYXllckRhdGEuZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IGZpbHRlcmVkSW5kZXgubWFwKGkgPT4gYWxsRGF0YVtpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGEsXG4gICAgICBnZXRQb3NpdGlvbixcbiAgICAgIC4uLihnZXRDb2xvclZhbHVlID8ge2dldENvbG9yVmFsdWV9IDoge30pLFxuICAgICAgLi4uKGdldEVsZXZhdGlvblZhbHVlID8ge2dldEVsZXZhdGlvblZhbHVlfSA6IHt9KVxuICAgIH07XG4gIH1cbn1cbiJdfQ==