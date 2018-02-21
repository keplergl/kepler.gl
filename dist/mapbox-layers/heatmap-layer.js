'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heatmapRequiredColumns = exports.heatmapVisConfigs = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _reselect = require('reselect');

var _defaultSettings = require('../constants/default-settings');

var _mapboxUtils = require('./mapbox-utils');

var _colorUtils = require('../utils/color-utils');

var _baseLayer = require('../keplergl-layers/base-layer');

var _baseLayer2 = _interopRequireDefault(_baseLayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MAX_ZOOM_LEVEL = 18;
var DEFAULT_OPACITY = .8;

var heatmapVisConfigs = exports.heatmapVisConfigs = {
  opacity: 'opacity',
  width: 'width',
  colorRange: 'colorRange'
};

var heatmapRequiredColumns = exports.heatmapRequiredColumns = ['lat', 'lng'];

var heatmapDensity = function heatmapDensity(config) {
  var colorDomain = config.colorDomain,
      colorScale = config.colorScale,
      visConfig = config.visConfig;
  // const domain = this.config.visConfig.colorRange.colors;

  var scaleFunction = _defaultSettings.SCALE_FUNC[colorScale];
  // color scale can only be quantize, quantile or ordinal

  // this is for the quantile case
  var scale = scaleFunction().domain(colorDomain).range(visConfig.colorRange.colors);

  return scale.range().reduce(function (bands, level) {
    var invert = scale.invertExtent(level);
    return [].concat((0, _toConsumableArray3.default)(bands), [invert[0], // first value in the range
    'rgb(' + (0, _colorUtils.hexToRgb)(level).join(',') + ')' // color
    ]);
  }, []);
};

var computeHeatmapConfiguration = function computeHeatmapConfiguration(id, config) {
  var datasetId = config.dataId,
      isVisible = config.isVisible,
      visConfig = config.visConfig,
      widthField = config.widthField;


  var maxZoomLevel = MAX_ZOOM_LEVEL;

  return {
    id: id,
    type: 'heatmap',
    source: datasetId,
    layout: {
      visibility: isVisible ? 'visible' : 'none'
    },
    maxzoom: maxZoomLevel,
    paint: {
      'heatmap-weight': widthField ? ['interpolate', ['linear'], ['get', widthField.name], 0, 0, maxZoomLevel, visConfig.width] : 1,
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, maxZoomLevel, 3],
      'heatmap-color': ['interpolate', ['linear'], ['heatmap-density']].concat((0, _toConsumableArray3.default)(heatmapDensity(config))),
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, maxZoomLevel, 20 // radius
      ],
      'heatmap-opacity': visConfig.opacity || DEFAULT_OPACITY
    }
  };
};

var HeatmapLayer = function (_Layer) {
  (0, _inherits3.default)(HeatmapLayer, _Layer);

  function HeatmapLayer(props) {
    (0, _classCallCheck3.default)(this, HeatmapLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (HeatmapLayer.__proto__ || Object.getPrototypeOf(HeatmapLayer)).call(this, props));

    _this.sameDataSelector = function (_ref) {
      var allData = _ref.allData,
          filteredIndex = _ref.filteredIndex,
          oldLayerData = _ref.oldLayerData,
          _ref$opt = _ref.opt,
          opt = _ref$opt === undefined ? {} : _ref$opt;

      return Boolean(oldLayerData && oldLayerData.data && oldLayerData.columns && opt.sameData);
    };

    _this.sameConfigSelector = function (_ref2) {
      var oldLayerData = _ref2.oldLayerData,
          config = _ref2.config;

      // columns must use the same filedIdx
      // this is a fast way to compare columns object
      var columns = config.columns,
          widthField = config.widthField;

      var sameColumns = true;
      if (oldLayerData.columns) {
        sameColumns = Object.keys(oldLayerData.columns).reduce(function (equal, property) {
          return equal && columns[property] && columns[property].fieldIdx === oldLayerData.columns[property].fieldIdx;
        }, sameColumns);
      } else {
        sameColumns = false;
      }

      var sameWidthField = true;

      if (!oldLayerData.widthField && !widthField) {
        sameWidthField = true;
      } else {
        sameWidthField = Boolean(oldLayerData.widthField && widthField && oldLayerData.widthField.name !== widthField.name);
      }

      return sameColumns && sameWidthField;
    };

    _this.rebuildSelector = (0, _reselect.createSelector)(_this.sameDataSelector, _this.sameConfigSelector, function (sameData, sameColumns) {
      return !(sameData && sameColumns);
    });


    _this.registerVisConfig(heatmapVisConfigs);
    return _this;
  }

  (0, _createClass3.default)(HeatmapLayer, [{
    key: 'shouldRenderLayer',


    // this layer is rendered at mapbox level
    // todo: maybe need to find a better solution for this one
    value: function shouldRenderLayer() {
      return false;
    }
  }, {
    key: 'formatLayerData',
    value: function formatLayerData(_, allData, filteredIndex, oldLayerData) {
      var opt = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

      var shouldRebuild = this.rebuildSelector({
        allData: allData,
        filteredIndex: filteredIndex,
        oldLayerData: oldLayerData,
        opt: opt,
        config: this.config
      });

      var widthField = this.config.widthField;


      var data = !shouldRebuild ? oldLayerData.data : (0, _mapboxUtils.geojsonFromPoints)(filteredIndex.map(function (index) {
        return allData[index];
      }), this.config.columns, widthField ? [widthField] : []);

      var newConfig = computeHeatmapConfiguration(this.id, this.config);

      return {
        columns: this.config.columns,
        config: newConfig,
        data: data
      };
    }
  }, {
    key: 'overlayType',
    get: function get() {
      return 'mapboxgl';
    }
  }, {
    key: 'type',
    get: function get() {
      return 'heatmap';
    }
  }, {
    key: 'isAggregated',
    get: function get() {
      return true;
    }
  }, {
    key: 'requiredLayerColumns',
    get: function get() {
      return heatmapRequiredColumns;
    }
  }, {
    key: 'columnPairs',
    get: function get() {
      return this.defaultPointColumnPairs;
    }
  }, {
    key: 'noneLayerDataAffectingProps',
    get: function get() {
      return ['label', 'thickness'];
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
        width: {
          property: 'width',
          field: 'widthField',
          scale: 'widthScale',
          domain: 'widthDomain',
          range: 'widthRange',
          key: 'width',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.width,
          defaultMeasure: 'Width'
        }
      };
    }
  }]);
  return HeatmapLayer;
}(_baseLayer2.default);

exports.default = HeatmapLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYXBib3gtbGF5ZXJzL2hlYXRtYXAtbGF5ZXIuanMiXSwibmFtZXMiOlsiTUFYX1pPT01fTEVWRUwiLCJERUZBVUxUX09QQUNJVFkiLCJoZWF0bWFwVmlzQ29uZmlncyIsIm9wYWNpdHkiLCJ3aWR0aCIsImNvbG9yUmFuZ2UiLCJoZWF0bWFwUmVxdWlyZWRDb2x1bW5zIiwiaGVhdG1hcERlbnNpdHkiLCJjb2xvckRvbWFpbiIsImNvbmZpZyIsImNvbG9yU2NhbGUiLCJ2aXNDb25maWciLCJzY2FsZUZ1bmN0aW9uIiwic2NhbGUiLCJkb21haW4iLCJyYW5nZSIsImNvbG9ycyIsInJlZHVjZSIsImJhbmRzIiwibGV2ZWwiLCJpbnZlcnQiLCJpbnZlcnRFeHRlbnQiLCJqb2luIiwiY29tcHV0ZUhlYXRtYXBDb25maWd1cmF0aW9uIiwiaWQiLCJkYXRhc2V0SWQiLCJkYXRhSWQiLCJpc1Zpc2libGUiLCJ3aWR0aEZpZWxkIiwibWF4Wm9vbUxldmVsIiwidHlwZSIsInNvdXJjZSIsImxheW91dCIsInZpc2liaWxpdHkiLCJtYXh6b29tIiwicGFpbnQiLCJuYW1lIiwiSGVhdG1hcExheWVyIiwicHJvcHMiLCJzYW1lRGF0YVNlbGVjdG9yIiwiYWxsRGF0YSIsImZpbHRlcmVkSW5kZXgiLCJvbGRMYXllckRhdGEiLCJvcHQiLCJCb29sZWFuIiwiZGF0YSIsImNvbHVtbnMiLCJzYW1lRGF0YSIsInNhbWVDb25maWdTZWxlY3RvciIsInNhbWVDb2x1bW5zIiwiT2JqZWN0Iiwia2V5cyIsImVxdWFsIiwicHJvcGVydHkiLCJmaWVsZElkeCIsInNhbWVXaWR0aEZpZWxkIiwicmVidWlsZFNlbGVjdG9yIiwicmVnaXN0ZXJWaXNDb25maWciLCJfIiwic2hvdWxkUmVidWlsZCIsIm1hcCIsImluZGV4IiwibmV3Q29uZmlnIiwiZGVmYXVsdFBvaW50Q29sdW1uUGFpcnMiLCJjb2xvciIsImZpZWxkIiwia2V5IiwiY2hhbm5lbFNjYWxlVHlwZSIsImNvbG9y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LFVBQU1rQyxZQUFZdkMsNEJBQTRCLEtBQUtDLEVBQWpDLEVBQXFDLEtBQUtmLE1BQTFDLENBQWxCOztBQUVBLGFBQU87QUFDTHFDLGlCQUFTLEtBQUtyQyxNQUFMLENBQVlxQyxPQURoQjtBQUVMckMsZ0JBQVFxRCxTQUZIO0FBR0xqQjtBQUhLLE9BQVA7QUFLRDs7O3dCQWxGaUI7QUFDaEIsYUFBTyxVQUFQO0FBQ0Q7Ozt3QkFFVTtBQUNULGFBQU8sU0FBUDtBQUNEOzs7d0JBRWtCO0FBQ2pCLGFBQU8sSUFBUDtBQUNEOzs7d0JBRTBCO0FBQ3pCLGFBQU92QyxzQkFBUDtBQUNEOzs7d0JBRWlCO0FBQ2hCLGFBQU8sS0FBS3lELHVCQUFaO0FBQ0Q7Ozt3QkFFaUM7QUFDaEMsYUFBTyxDQUNMLE9BREssRUFFTCxXQUZLLENBQVA7QUFJRDs7O3dCQUVvQjtBQUNuQixhQUFPO0FBQ0xDLGVBQU87QUFDTFgsb0JBQVUsT0FETDtBQUVMWSxpQkFBTyxZQUZGO0FBR0xwRCxpQkFBTyxZQUhGO0FBSUxDLGtCQUFRLGFBSkg7QUFLTEMsaUJBQU8sWUFMRjtBQU1MbUQsZUFBSyxPQU5BO0FBT0xDLDRCQUFrQixnQ0FBZUMsU0FQNUI7QUFRTEMsMEJBQWdCO0FBUlgsU0FERjtBQVdMakUsZUFBTztBQUNMaUQsb0JBQVUsT0FETDtBQUVMWSxpQkFBTyxZQUZGO0FBR0xwRCxpQkFBTyxZQUhGO0FBSUxDLGtCQUFRLGFBSkg7QUFLTEMsaUJBQU8sWUFMRjtBQU1MbUQsZUFBSyxPQU5BO0FBT0xDLDRCQUFrQixnQ0FBZS9ELEtBUDVCO0FBUUxpRSwwQkFBZ0I7QUFSWDtBQVhGLE9BQVA7QUFzQkQ7Ozs7O2tCQW1DWWhDLFkiLCJmaWxlIjoiaGVhdG1hcC1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcbmltcG9ydCB7Q0hBTk5FTF9TQ0FMRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7Z2VvanNvbkZyb21Qb2ludHN9IGZyb20gJy4vbWFwYm94LXV0aWxzJztcbmltcG9ydCB7U0NBTEVfRlVOQ30gZnJvbSBcIi4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzXCI7XG5pbXBvcnQge2hleFRvUmdifSBmcm9tICd1dGlscy9jb2xvci11dGlscyc7XG5pbXBvcnQgTGF5ZXIgZnJvbSBcIi4uL2tlcGxlcmdsLWxheWVycy9iYXNlLWxheWVyXCI7XG5cbmNvbnN0IE1BWF9aT09NX0xFVkVMID0gMTg7XG5jb25zdCBERUZBVUxUX09QQUNJVFkgPSAuODtcblxuZXhwb3J0IGNvbnN0IGhlYXRtYXBWaXNDb25maWdzID0ge1xuICBvcGFjaXR5OiAnb3BhY2l0eScsXG4gIHdpZHRoOiAnd2lkdGgnLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZSdcbn07XG5cbmV4cG9ydCBjb25zdCBoZWF0bWFwUmVxdWlyZWRDb2x1bW5zID0gWydsYXQnLCAnbG5nJ107XG5cbmNvbnN0IGhlYXRtYXBEZW5zaXR5ID0gY29uZmlnID0+IHtcbiAgY29uc3Qge1xuICAgIGNvbG9yRG9tYWluLFxuICAgIGNvbG9yU2NhbGUsXG4gICAgdmlzQ29uZmlnXG4gIH0gPSBjb25maWc7XG4gIC8vIGNvbnN0IGRvbWFpbiA9IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5jb2xvclJhbmdlLmNvbG9ycztcbiAgY29uc3Qgc2NhbGVGdW5jdGlvbiA9IFNDQUxFX0ZVTkNbY29sb3JTY2FsZV07XG4gIC8vIGNvbG9yIHNjYWxlIGNhbiBvbmx5IGJlIHF1YW50aXplLCBxdWFudGlsZSBvciBvcmRpbmFsXG5cbiAgLy8gdGhpcyBpcyBmb3IgdGhlIHF1YW50aWxlIGNhc2VcbiAgY29uc3Qgc2NhbGUgPSBzY2FsZUZ1bmN0aW9uKClcbiAgICAuZG9tYWluKGNvbG9yRG9tYWluKVxuICAgIC5yYW5nZSh2aXNDb25maWcuY29sb3JSYW5nZS5jb2xvcnMpO1xuXG4gIHJldHVybiBzY2FsZS5yYW5nZSgpLnJlZHVjZSgoYmFuZHMsIGxldmVsKSA9PiB7XG4gICAgY29uc3QgaW52ZXJ0ID0gc2NhbGUuaW52ZXJ0RXh0ZW50KGxldmVsKTtcbiAgICByZXR1cm4gW1xuICAgICAgLi4uYmFuZHMsXG4gICAgICBpbnZlcnRbMF0sIC8vIGZpcnN0IHZhbHVlIGluIHRoZSByYW5nZVxuICAgICAgYHJnYigke2hleFRvUmdiKGxldmVsKS5qb2luKCcsJyl9KWAgLy8gY29sb3JcbiAgICBdXG4gIH0sIFtdKTtcbn07XG5cbmNvbnN0IGNvbXB1dGVIZWF0bWFwQ29uZmlndXJhdGlvbiA9IChpZCwgY29uZmlnKSA9PiB7XG4gIGNvbnN0IHtcbiAgICBkYXRhSWQ6IGRhdGFzZXRJZCxcbiAgICBpc1Zpc2libGUsXG4gICAgdmlzQ29uZmlnLFxuICAgIHdpZHRoRmllbGRcbiAgfSA9IGNvbmZpZztcblxuICBjb25zdCBtYXhab29tTGV2ZWwgPSBNQVhfWk9PTV9MRVZFTDtcblxuICByZXR1cm4ge1xuICAgIGlkLFxuICAgIHR5cGU6ICdoZWF0bWFwJyxcbiAgICBzb3VyY2U6IGRhdGFzZXRJZCxcbiAgICBsYXlvdXQ6IHtcbiAgICAgIHZpc2liaWxpdHk6IGlzVmlzaWJsZSA/ICd2aXNpYmxlJyA6ICdub25lJ1xuICAgIH0sXG4gICAgbWF4em9vbTogbWF4Wm9vbUxldmVsLFxuICAgIHBhaW50OiB7XG4gICAgICAnaGVhdG1hcC13ZWlnaHQnOiB3aWR0aEZpZWxkID8gW1xuICAgICAgICAnaW50ZXJwb2xhdGUnLFxuICAgICAgICBbJ2xpbmVhciddLFxuICAgICAgICBbJ2dldCcsIHdpZHRoRmllbGQubmFtZV0sXG4gICAgICAgIDAsIDAsXG4gICAgICAgIG1heFpvb21MZXZlbCwgdmlzQ29uZmlnLndpZHRoXG4gICAgICBdIDogMSxcbiAgICAgICdoZWF0bWFwLWludGVuc2l0eSc6IFtcbiAgICAgICAgJ2ludGVycG9sYXRlJyxcbiAgICAgICAgWydsaW5lYXInXSxcbiAgICAgICAgWyd6b29tJ10sXG4gICAgICAgIDAsIDEsXG4gICAgICAgIG1heFpvb21MZXZlbCwgM1xuICAgICAgXSxcbiAgICAgICdoZWF0bWFwLWNvbG9yJzogW1xuICAgICAgICAnaW50ZXJwb2xhdGUnLFxuICAgICAgICBbJ2xpbmVhciddLFxuICAgICAgICBbJ2hlYXRtYXAtZGVuc2l0eSddLFxuICAgICAgICAuLi5oZWF0bWFwRGVuc2l0eShjb25maWcpXG4gICAgICBdLFxuICAgICAgJ2hlYXRtYXAtcmFkaXVzJzogW1xuICAgICAgICAnaW50ZXJwb2xhdGUnLFxuICAgICAgICBbJ2xpbmVhciddLFxuICAgICAgICBbJ3pvb20nXSxcbiAgICAgICAgMCwgMixcbiAgICAgICAgbWF4Wm9vbUxldmVsLCAyMCAvLyByYWRpdXNcbiAgICAgIF0sXG4gICAgICAnaGVhdG1hcC1vcGFjaXR5JzogdmlzQ29uZmlnLm9wYWNpdHkgfHwgREVGQVVMVF9PUEFDSVRZXG4gICAgfVxuICB9O1xufTtcblxuY2xhc3MgSGVhdG1hcExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBzYW1lRGF0YVNlbGVjdG9yID0gKHthbGxEYXRhLCBmaWx0ZXJlZEluZGV4LCBvbGRMYXllckRhdGEsIG9wdCA9IHt9fSkgPT4ge1xuICAgIHJldHVybiBCb29sZWFuKG9sZExheWVyRGF0YSAmJlxuICAgICAgb2xkTGF5ZXJEYXRhLmRhdGEgJiYgb2xkTGF5ZXJEYXRhLmNvbHVtbnMgJiZcbiAgICAgIG9wdC5zYW1lRGF0YVxuICAgICk7XG4gIH07XG4gIHNhbWVDb25maWdTZWxlY3RvciA9ICh7b2xkTGF5ZXJEYXRhLCBjb25maWd9KSA9PiB7XG4gICAgLy8gY29sdW1ucyBtdXN0IHVzZSB0aGUgc2FtZSBmaWxlZElkeFxuICAgIC8vIHRoaXMgaXMgYSBmYXN0IHdheSB0byBjb21wYXJlIGNvbHVtbnMgb2JqZWN0XG4gICAgY29uc3Qge1xuICAgICAgY29sdW1ucyxcbiAgICAgIHdpZHRoRmllbGRcbiAgICB9ID0gY29uZmlnO1xuICAgIGxldCBzYW1lQ29sdW1ucyA9IHRydWU7XG4gICAgaWYgKG9sZExheWVyRGF0YS5jb2x1bW5zKSB7XG4gICAgICBzYW1lQ29sdW1ucyA9IE9iamVjdC5rZXlzKG9sZExheWVyRGF0YS5jb2x1bW5zKS5yZWR1Y2UoKGVxdWFsLCBwcm9wZXJ0eSkgPT4ge1xuICAgICAgICByZXR1cm4gZXF1YWwgJiYgY29sdW1uc1twcm9wZXJ0eV0gJiZcbiAgICAgICAgICBjb2x1bW5zW3Byb3BlcnR5XS5maWVsZElkeCA9PT0gb2xkTGF5ZXJEYXRhLmNvbHVtbnNbcHJvcGVydHldLmZpZWxkSWR4XG4gICAgICB9LCBzYW1lQ29sdW1ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNhbWVDb2x1bW5zID0gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IHNhbWVXaWR0aEZpZWxkID0gdHJ1ZVxuXG4gICAgaWYgKCFvbGRMYXllckRhdGEud2lkdGhGaWVsZCAmJiAhd2lkdGhGaWVsZCkge1xuICAgICAgc2FtZVdpZHRoRmllbGQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzYW1lV2lkdGhGaWVsZCA9IEJvb2xlYW4oXG4gICAgICAgIG9sZExheWVyRGF0YS53aWR0aEZpZWxkICYmIHdpZHRoRmllbGQgJiZcbiAgICAgICAgb2xkTGF5ZXJEYXRhLndpZHRoRmllbGQubmFtZSAhPT0gd2lkdGhGaWVsZC5uYW1lXG4gICAgICApXG4gICAgfVxuXG4gICAgcmV0dXJuIHNhbWVDb2x1bW5zICYmIHNhbWVXaWR0aEZpZWxkO1xuICB9O1xuICByZWJ1aWxkU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgICB0aGlzLnNhbWVEYXRhU2VsZWN0b3IsXG4gICAgdGhpcy5zYW1lQ29uZmlnU2VsZWN0b3IsXG4gICAgKHNhbWVEYXRhLCBzYW1lQ29sdW1ucykgPT4gIShzYW1lRGF0YSAmJiBzYW1lQ29sdW1ucylcbiAgKTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcoaGVhdG1hcFZpc0NvbmZpZ3MpO1xuICB9XG5cbiAgZ2V0IG92ZXJsYXlUeXBlKCkge1xuICAgIHJldHVybiAnbWFwYm94Z2wnO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICdoZWF0bWFwJztcbiAgfVxuXG4gIGdldCBpc0FnZ3JlZ2F0ZWQoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBnZXQgcmVxdWlyZWRMYXllckNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIGhlYXRtYXBSZXF1aXJlZENvbHVtbnM7XG4gIH1cblxuICBnZXQgY29sdW1uUGFpcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdFBvaW50Q29sdW1uUGFpcnM7XG4gIH1cblxuICBnZXQgbm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzKCkge1xuICAgIHJldHVybiBbXG4gICAgICAnbGFiZWwnLFxuICAgICAgJ3RoaWNrbmVzcydcbiAgICBdO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb2xvcjoge1xuICAgICAgICBwcm9wZXJ0eTogJ2NvbG9yJyxcbiAgICAgICAgZmllbGQ6ICdjb2xvckZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICdjb2xvclNjYWxlJyxcbiAgICAgICAgZG9tYWluOiAnY29sb3JEb21haW4nLFxuICAgICAgICByYW5nZTogJ2NvbG9yUmFuZ2UnLFxuICAgICAgICBrZXk6ICdjb2xvcicsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGU6IENIQU5ORUxfU0NBTEVTLmNvbG9yQWdncixcbiAgICAgICAgZGVmYXVsdE1lYXN1cmU6ICdQb2ludCBDb3VudCdcbiAgICAgIH0sXG4gICAgICB3aWR0aDoge1xuICAgICAgICBwcm9wZXJ0eTogJ3dpZHRoJyxcbiAgICAgICAgZmllbGQ6ICd3aWR0aEZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICd3aWR0aFNjYWxlJyxcbiAgICAgICAgZG9tYWluOiAnd2lkdGhEb21haW4nLFxuICAgICAgICByYW5nZTogJ3dpZHRoUmFuZ2UnLFxuICAgICAgICBrZXk6ICd3aWR0aCcsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGU6IENIQU5ORUxfU0NBTEVTLndpZHRoLFxuICAgICAgICBkZWZhdWx0TWVhc3VyZTogJ1dpZHRoJ1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyB0aGlzIGxheWVyIGlzIHJlbmRlcmVkIGF0IG1hcGJveCBsZXZlbFxuICAvLyB0b2RvOiBtYXliZSBuZWVkIHRvIGZpbmQgYSBiZXR0ZXIgc29sdXRpb24gZm9yIHRoaXMgb25lXG4gIHNob3VsZFJlbmRlckxheWVyKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZvcm1hdExheWVyRGF0YShfLCBhbGxEYXRhLCBmaWx0ZXJlZEluZGV4LCBvbGRMYXllckRhdGEsIG9wdCA9IHt9KSB7XG4gICAgY29uc3Qgc2hvdWxkUmVidWlsZCA9IHRoaXMucmVidWlsZFNlbGVjdG9yKHtcbiAgICAgIGFsbERhdGEsXG4gICAgICBmaWx0ZXJlZEluZGV4LFxuICAgICAgb2xkTGF5ZXJEYXRhLFxuICAgICAgb3B0LFxuICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZ1xuICAgIH0pO1xuXG4gICAgY29uc3Qge3dpZHRoRmllbGR9ID0gdGhpcy5jb25maWc7XG5cbiAgICBjb25zdCBkYXRhID0gIXNob3VsZFJlYnVpbGQgPyBvbGRMYXllckRhdGEuZGF0YSA6IGdlb2pzb25Gcm9tUG9pbnRzKFxuICAgICAgZmlsdGVyZWRJbmRleC5tYXAoaW5kZXggPT4gYWxsRGF0YVtpbmRleF0pLFxuICAgICAgdGhpcy5jb25maWcuY29sdW1ucyxcbiAgICAgIHdpZHRoRmllbGQgPyBbd2lkdGhGaWVsZF0gOiBbXVxuICAgICk7XG5cbiAgICBjb25zdCBuZXdDb25maWcgPSBjb21wdXRlSGVhdG1hcENvbmZpZ3VyYXRpb24odGhpcy5pZCwgdGhpcy5jb25maWcpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbHVtbnM6IHRoaXMuY29uZmlnLmNvbHVtbnMsXG4gICAgICBjb25maWc6IG5ld0NvbmZpZyxcbiAgICAgIGRhdGFcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEhlYXRtYXBMYXllcjsiXX0=