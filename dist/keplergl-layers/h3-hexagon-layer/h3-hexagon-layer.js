'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.HexagonIdVisConfigs = exports.hexIdResolver = exports.hexIdAccessor = exports.hexIdRequiredColumns = undefined;

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

var _baseLayer = require('../base-layer');

var _baseLayer2 = _interopRequireDefault(_baseLayer);

var _deck = require('deck.gl');

var _colorUtils = require('../../utils/color-utils');

var _h3Utils = require('./h3-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hexIdRequiredColumns = exports.hexIdRequiredColumns = ['hex_id'];
var hexIdAccessor = exports.hexIdAccessor = function hexIdAccessor(_ref) {
  var hex_id = _ref.hex_id;
  return function (d) {
    return d[hex_id.fieldIdx];
  };
};
var hexIdResolver = exports.hexIdResolver = function hexIdResolver(_ref2) {
  var hex_id = _ref2.hex_id;
  return hex_id.fieldIdx;
};

var HexagonIdVisConfigs = exports.HexagonIdVisConfigs = {
  opacity: 'opacity',
  colorRange: 'colorRange',
  sizeRange: 'elevationRange',
  elevationScale: 'elevationScale',
  'hi-precision': 'hi-precision'
};

var HexagonIdLayer = function (_Layer) {
  (0, _inherits3.default)(HexagonIdLayer, _Layer);

  function HexagonIdLayer(props) {
    (0, _classCallCheck3.default)(this, HexagonIdLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, _Layer.call(this, props));

    _this.registerVisConfig(HexagonIdVisConfigs);
    _this.getHexId = (0, _lodash2.default)(hexIdAccessor, hexIdResolver);
    return _this;
  }

  HexagonIdLayer.prototype.formatLayerData = function formatLayerData(_, allData, filteredIndex, oldLayerData) {
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
        sizeRange = _config$visConfig.sizeRange,
        colorRange = _config$visConfig.colorRange;

    // color

    var cScale = colorField && this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(_colorUtils.hexToRgb));

    // height
    var sScale = sizeField && this.getVisChannelScale(sizeScale, sizeDomain, sizeRange);

    var getHexId = this.getHexId(columns);

    if (!oldLayerData || oldLayerData.getHexId !== getHexId) {
      this.updateLayerMeta(allData, getHexId);
    }

    var data = void 0;
    if (oldLayerData && oldLayerData.data && opt.sameData && oldLayerData.getHexId === getHexId) {
      data = oldLayerData.data;
    } else {
      data = filteredIndex.reduce(function (accu, index, i) {
        var id = getHexId(allData[index]);
        var centroid = _this2.dataToFeature.centroids[index];

        if (centroid) {
          accu.push({
            // keep a reference to the original data index
            index: i,
            data: allData[index],
            id: id,
            centroid: centroid
          });
        }

        return accu;
      }, []);
    }

    var getElevation = function getElevation(d) {
      return sScale ? _this2.getEncodedChannelValue(sScale, d.data, sizeField, 0) : 0;
    };

    var getColor = function getColor(d) {
      return cScale ? _this2.getEncodedChannelValue(cScale, d.data, colorField) : color;
    };

    // const layerData = {
    return {
      data: data,
      getElevation: getElevation,
      getColor: getColor,
      getHexId: getHexId,
      hexagonVertices: this.dataToFeature.vertices
    };

    // return {layerData, layer: this};
  };

  HexagonIdLayer.prototype.updateLayerMeta = function updateLayerMeta(allData, getHexId) {
    var vertices = void 0;
    var centroids = {};

    allData.forEach(function (d, index) {
      var id = getHexId(d);
      if (typeof id !== 'string' || !id.length) {
        return;
      }
      // find vertices
      // only need 1 instance of vertices
      if (!vertices) {
        vertices = id && (0, _h3Utils.getVertices)({ id: id });
      }

      // save a reference of centroids to dataToFeature
      // so we don't have to re calculate it again
      centroids[index] = (0, _h3Utils.getCentroid)({ id: id });
    });

    var bounds = this.getPointsBounds(Object.values(centroids), function (d) {
      return d;
    });
    var lightSettings = this.getLightSettingsFromBounds(bounds);

    this.dataToFeature = { vertices: vertices, centroids: centroids };
    this.updateMeta({ bounds: bounds, lightSettings: lightSettings });
  };

  HexagonIdLayer.prototype.renderLayer = function renderLayer(_ref3) {
    var data = _ref3.data,
        idx = _ref3.idx,
        layerInteraction = _ref3.layerInteraction,
        objectHovered = _ref3.objectHovered,
        mapState = _ref3.mapState,
        interactionConfig = _ref3.interactionConfig;

    var zoomFactor = this.getZoomFactor(mapState.zoom);
    var eleZoomFactor = this.getElevationZoomFactor(mapState.zoom);
    var config = this.config,
        meta = this.meta;
    var visConfig = config.visConfig;


    var updateTriggers = {
      getColor: {
        color: config.color,
        colorField: config.colorField,
        colorRange: config.visConfig.colorRange,
        colorScale: config.colorScale
      },
      getElevation: {
        sizeField: config.sizeField,
        sizeRange: config.visConfig.sizeRange
      }
    };

    return [new _deck.HexagonCellLayer((0, _extends3.default)({}, layerInteraction, data, {
      id: this.id,
      idx: idx,
      pickable: true,
      extruded: Boolean(config.sizeField),
      elevationScale: visConfig.elevationScale * eleZoomFactor,
      opacity: visConfig.opacity,
      lightSettings: meta.lightSettings,
      updateTriggers: updateTriggers
    }))].concat(this.isLayerHovered(objectHovered) && !config.sizeField ? [new _deck.GeoJsonLayer({
      id: this.id + '-hovered',
      data: [(0, _h3Utils.idToPolygonGeo)(objectHovered, {
        lineColor: config.highlightColor
      })],
      lineWidthScale: 8 * zoomFactor
    })] : []);
  };

  (0, _createClass3.default)(HexagonIdLayer, [{
    key: 'type',
    get: function get() {
      return 'hexagonId';
    }
  }, {
    key: 'requiredLayerColumns',
    get: function get() {
      return hexIdRequiredColumns;
    }
  }, {
    key: 'visualChannels',
    get: function get() {
      return (0, _extends3.default)({}, _Layer.prototype.visualChannels, {
        size: (0, _extends3.default)({}, _Layer.prototype.visualChannels.size, {
          property: 'height'
        })
      });
    }
  }]);
  return HexagonIdLayer;
}(_baseLayer2.default);

exports.default = HexagonIdLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvaDMtaGV4YWdvbi1sYXllci9oMy1oZXhhZ29uLWxheWVyLmpzIl0sIm5hbWVzIjpbImhleElkUmVxdWlyZWRDb2x1bW5zIiwiaGV4SWRBY2Nlc3NvciIsImhleF9pZCIsImQiLCJmaWVsZElkeCIsImhleElkUmVzb2x2ZXIiLCJIZXhhZ29uSWRWaXNDb25maWdzIiwib3BhY2l0eSIsImNvbG9yUmFuZ2UiLCJzaXplUmFuZ2UiLCJlbGV2YXRpb25TY2FsZSIsIkhleGFnb25JZExheWVyIiwicHJvcHMiLCJyZWdpc3RlclZpc0NvbmZpZyIsImdldEhleElkIiwiZm9ybWF0TGF5ZXJEYXRhIiwiXyIsImFsbERhdGEiLCJmaWx0ZXJlZEluZGV4Iiwib2xkTGF5ZXJEYXRhIiwib3B0IiwiY29uZmlnIiwiY29sb3JTY2FsZSIsImNvbG9yRG9tYWluIiwiY29sb3JGaWVsZCIsImNvbG9yIiwiY29sdW1ucyIsInNpemVGaWVsZCIsInNpemVTY2FsZSIsInNpemVEb21haW4iLCJ2aXNDb25maWciLCJjU2NhbGUiLCJnZXRWaXNDaGFubmVsU2NhbGUiLCJjb2xvcnMiLCJtYXAiLCJzU2NhbGUiLCJ1cGRhdGVMYXllck1ldGEiLCJkYXRhIiwic2FtZURhdGEiLCJyZWR1Y2UiLCJhY2N1IiwiaW5kZXgiLCJpIiwiaWQiLCJjZW50cm9pZCIsImRhdGFUb0ZlYXR1cmUiLCJjZW50cm9pZHMiLCJwdXNoIiwiZ2V0RWxldmF0aW9uIiwiZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZSIsImdldENvbG9yIiwiaGV4YWdvblZlcnRpY2VzIiwidmVydGljZXMiLCJmb3JFYWNoIiwibGVuZ3RoIiwiYm91bmRzIiwiZ2V0UG9pbnRzQm91bmRzIiwiT2JqZWN0IiwidmFsdWVzIiwibGlnaHRTZXR0aW5ncyIsImdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzIiwidXBkYXRlTWV0YSIsInJlbmRlckxheWVyIiwiaWR4IiwibGF5ZXJJbnRlcmFjdGlvbiIsIm9iamVjdEhvdmVyZWQiLCJtYXBTdGF0ZSIsImludGVyYWN0aW9uQ29uZmlnIiwiem9vbUZhY3RvciIsImdldFpvb21GYWN0b3IiLCJ6b29tIiwiZWxlWm9vbUZhY3RvciIsImdldEVsZXZhdGlvblpvb21GYWN0b3IiLCJtZXRhIiwidXBkYXRlVHJpZ2dlcnMiLCJwaWNrYWJsZSIsImV4dHJ1ZGVkIiwiQm9vbGVhbiIsImlzTGF5ZXJIb3ZlcmVkIiwibGluZUNvbG9yIiwiaGlnaGxpZ2h0Q29sb3IiLCJsaW5lV2lkdGhTY2FsZSIsInZpc3VhbENoYW5uZWxzIiwic2l6ZSIsInByb3BlcnR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFTyxJQUFNQSxzREFBdUIsQ0FBQyxRQUFELENBQTdCO0FBQ0EsSUFBTUMsd0NBQWdCLFNBQWhCQSxhQUFnQjtBQUFBLE1BQUVDLE1BQUYsUUFBRUEsTUFBRjtBQUFBLFNBQWM7QUFBQSxXQUFLQyxFQUFFRCxPQUFPRSxRQUFULENBQUw7QUFBQSxHQUFkO0FBQUEsQ0FBdEI7QUFDQSxJQUFNQyx3Q0FBZ0IsU0FBaEJBLGFBQWdCO0FBQUEsTUFBRUgsTUFBRixTQUFFQSxNQUFGO0FBQUEsU0FBY0EsT0FBT0UsUUFBckI7QUFBQSxDQUF0Qjs7QUFFQSxJQUFNRSxvREFBc0I7QUFDakNDLFdBQVMsU0FEd0I7QUFFakNDLGNBQVksWUFGcUI7QUFHakNDLGFBQVcsZ0JBSHNCO0FBSWpDQyxrQkFBZ0IsZ0JBSmlCO0FBS2pDLGtCQUFnQjtBQUxpQixDQUE1Qjs7SUFRY0MsYzs7O0FBQ25CLDBCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsK0RBQ2pCLGtCQUFNQSxLQUFOLENBRGlCOztBQUVqQixVQUFLQyxpQkFBTCxDQUF1QlAsbUJBQXZCO0FBQ0EsVUFBS1EsUUFBTCxHQUFnQixzQkFBUWIsYUFBUixFQUF1QkksYUFBdkIsQ0FBaEI7QUFIaUI7QUFJbEI7OzJC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SUFEMUI7QUFFRUMsb0JBQVU7QUFGWjtBQUZGO0FBT0Q7Ozs7O2tCQXZCa0J6RSxjIiwiZmlsZSI6ImgzLWhleGFnb24tbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWVtb2l6ZSBmcm9tICdsb2Rhc2gubWVtb2l6ZSc7XG5cbmltcG9ydCBMYXllciBmcm9tICcuLi9iYXNlLWxheWVyJztcbmltcG9ydCB7SGV4YWdvbkNlbGxMYXllciwgR2VvSnNvbkxheWVyfSBmcm9tICdkZWNrLmdsJztcbmltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJ3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCB7Z2V0VmVydGljZXMsIGdldENlbnRyb2lkLCBpZFRvUG9seWdvbkdlb30gZnJvbSAnLi9oMy11dGlscyc7XG5cbmV4cG9ydCBjb25zdCBoZXhJZFJlcXVpcmVkQ29sdW1ucyA9IFsnaGV4X2lkJ107XG5leHBvcnQgY29uc3QgaGV4SWRBY2Nlc3NvciA9ICh7aGV4X2lkfSkgPT4gZCA9PiBkW2hleF9pZC5maWVsZElkeF07XG5leHBvcnQgY29uc3QgaGV4SWRSZXNvbHZlciA9ICh7aGV4X2lkfSkgPT4gaGV4X2lkLmZpZWxkSWR4O1xuXG5leHBvcnQgY29uc3QgSGV4YWdvbklkVmlzQ29uZmlncyA9IHtcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIHNpemVSYW5nZTogJ2VsZXZhdGlvblJhbmdlJyxcbiAgZWxldmF0aW9uU2NhbGU6ICdlbGV2YXRpb25TY2FsZScsXG4gICdoaS1wcmVjaXNpb24nOiAnaGktcHJlY2lzaW9uJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGV4YWdvbklkTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcoSGV4YWdvbklkVmlzQ29uZmlncyk7XG4gICAgdGhpcy5nZXRIZXhJZCA9IG1lbW9pemUoaGV4SWRBY2Nlc3NvciwgaGV4SWRSZXNvbHZlcik7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gJ2hleGFnb25JZCc7XG4gIH1cblxuICBnZXQgcmVxdWlyZWRMYXllckNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIGhleElkUmVxdWlyZWRDb2x1bW5zO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci52aXN1YWxDaGFubmVscyxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZSxcbiAgICAgICAgcHJvcGVydHk6ICdoZWlnaHQnXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGZvcm1hdExheWVyRGF0YShfLCBhbGxEYXRhLCBmaWx0ZXJlZEluZGV4LCBvbGRMYXllckRhdGEsIG9wdCA9IHt9KSB7XG4gICAgY29uc3Qge1xuICAgICAgY29sb3JTY2FsZSxcbiAgICAgIGNvbG9yRG9tYWluLFxuICAgICAgY29sb3JGaWVsZCxcbiAgICAgIGNvbG9yLFxuICAgICAgY29sdW1ucyxcbiAgICAgIHNpemVGaWVsZCxcbiAgICAgIHNpemVTY2FsZSxcbiAgICAgIHNpemVEb21haW4sXG4gICAgICB2aXNDb25maWc6IHtzaXplUmFuZ2UsIGNvbG9yUmFuZ2V9XG4gICAgfSA9IHRoaXMuY29uZmlnO1xuXG4gICAgLy8gY29sb3JcbiAgICBjb25zdCBjU2NhbGUgPVxuICAgICAgY29sb3JGaWVsZCAmJlxuICAgICAgdGhpcy5nZXRWaXNDaGFubmVsU2NhbGUoXG4gICAgICAgIGNvbG9yU2NhbGUsXG4gICAgICAgIGNvbG9yRG9tYWluLFxuICAgICAgICBjb2xvclJhbmdlLmNvbG9ycy5tYXAoaGV4VG9SZ2IpXG4gICAgICApO1xuXG4gICAgLy8gaGVpZ2h0XG4gICAgY29uc3Qgc1NjYWxlID1cbiAgICAgIHNpemVGaWVsZCAmJiB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShzaXplU2NhbGUsIHNpemVEb21haW4sIHNpemVSYW5nZSk7XG5cbiAgICBjb25zdCBnZXRIZXhJZCA9IHRoaXMuZ2V0SGV4SWQoY29sdW1ucyk7XG5cbiAgICBpZiAoIW9sZExheWVyRGF0YSB8fCBvbGRMYXllckRhdGEuZ2V0SGV4SWQgIT09IGdldEhleElkKSB7XG4gICAgICB0aGlzLnVwZGF0ZUxheWVyTWV0YShhbGxEYXRhLCBnZXRIZXhJZCk7XG4gICAgfVxuXG4gICAgbGV0IGRhdGE7XG4gICAgaWYgKFxuICAgICAgb2xkTGF5ZXJEYXRhICYmXG4gICAgICBvbGRMYXllckRhdGEuZGF0YSAmJlxuICAgICAgb3B0LnNhbWVEYXRhICYmXG4gICAgICBvbGRMYXllckRhdGEuZ2V0SGV4SWQgPT09IGdldEhleElkXG4gICAgKSB7XG4gICAgICBkYXRhID0gb2xkTGF5ZXJEYXRhLmRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSBmaWx0ZXJlZEluZGV4LnJlZHVjZSgoYWNjdSwgaW5kZXgsIGkpID0+IHtcbiAgICAgICAgY29uc3QgaWQgPSBnZXRIZXhJZChhbGxEYXRhW2luZGV4XSk7XG4gICAgICAgIGNvbnN0IGNlbnRyb2lkID0gdGhpcy5kYXRhVG9GZWF0dXJlLmNlbnRyb2lkc1tpbmRleF07XG5cbiAgICAgICAgaWYgKGNlbnRyb2lkKSB7XG4gICAgICAgICAgYWNjdS5wdXNoKHtcbiAgICAgICAgICAgIC8vIGtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIG9yaWdpbmFsIGRhdGEgaW5kZXhcbiAgICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgICAgZGF0YTogYWxsRGF0YVtpbmRleF0sXG4gICAgICAgICAgICBpZCxcbiAgICAgICAgICAgIGNlbnRyb2lkXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWNjdTtcbiAgICAgIH0sIFtdKTtcbiAgICB9XG5cbiAgICBjb25zdCBnZXRFbGV2YXRpb24gPSBkID0+XG4gICAgICBzU2NhbGUgPyB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoc1NjYWxlLCBkLmRhdGEsIHNpemVGaWVsZCwgMCkgOiAwO1xuXG4gICAgY29uc3QgZ2V0Q29sb3IgPSBkID0+XG4gICAgICBjU2NhbGUgPyB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoY1NjYWxlLCBkLmRhdGEsIGNvbG9yRmllbGQpIDogY29sb3I7XG5cbiAgICAvLyBjb25zdCBsYXllckRhdGEgPSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGEsXG4gICAgICBnZXRFbGV2YXRpb24sXG4gICAgICBnZXRDb2xvcixcbiAgICAgIGdldEhleElkLFxuICAgICAgaGV4YWdvblZlcnRpY2VzOiB0aGlzLmRhdGFUb0ZlYXR1cmUudmVydGljZXNcbiAgICB9O1xuXG4gICAgLy8gcmV0dXJuIHtsYXllckRhdGEsIGxheWVyOiB0aGlzfTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVyTWV0YShhbGxEYXRhLCBnZXRIZXhJZCkge1xuICAgIGxldCB2ZXJ0aWNlcztcbiAgICBjb25zdCBjZW50cm9pZHMgPSB7fTtcblxuICAgIGFsbERhdGEuZm9yRWFjaCgoZCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGlkID0gZ2V0SGV4SWQoZCk7XG4gICAgICBpZiAodHlwZW9mIGlkICE9PSAnc3RyaW5nJyB8fCAhaWQubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIGZpbmQgdmVydGljZXNcbiAgICAgIC8vIG9ubHkgbmVlZCAxIGluc3RhbmNlIG9mIHZlcnRpY2VzXG4gICAgICBpZiAoIXZlcnRpY2VzKSB7XG4gICAgICAgIHZlcnRpY2VzID0gaWQgJiYgZ2V0VmVydGljZXMoe2lkfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNhdmUgYSByZWZlcmVuY2Ugb2YgY2VudHJvaWRzIHRvIGRhdGFUb0ZlYXR1cmVcbiAgICAgIC8vIHNvIHdlIGRvbid0IGhhdmUgdG8gcmUgY2FsY3VsYXRlIGl0IGFnYWluXG4gICAgICBjZW50cm9pZHNbaW5kZXhdID0gZ2V0Q2VudHJvaWQoe2lkfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldFBvaW50c0JvdW5kcyhPYmplY3QudmFsdWVzKGNlbnRyb2lkcyksIGQgPT4gZCk7XG4gICAgY29uc3QgbGlnaHRTZXR0aW5ncyA9IHRoaXMuZ2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHMoYm91bmRzKTtcblxuICAgIHRoaXMuZGF0YVRvRmVhdHVyZSA9IHt2ZXJ0aWNlcywgY2VudHJvaWRzfTtcbiAgICB0aGlzLnVwZGF0ZU1ldGEoe2JvdW5kcywgbGlnaHRTZXR0aW5nc30pO1xuICB9XG5cbiAgcmVuZGVyTGF5ZXIoe1xuICAgIGRhdGEsXG4gICAgaWR4LFxuICAgIGxheWVySW50ZXJhY3Rpb24sXG4gICAgb2JqZWN0SG92ZXJlZCxcbiAgICBtYXBTdGF0ZSxcbiAgICBpbnRlcmFjdGlvbkNvbmZpZ1xuICB9KSB7XG4gICAgY29uc3Qgem9vbUZhY3RvciA9IHRoaXMuZ2V0Wm9vbUZhY3RvcihtYXBTdGF0ZS56b29tKTtcbiAgICBjb25zdCBlbGVab29tRmFjdG9yID0gdGhpcy5nZXRFbGV2YXRpb25ab29tRmFjdG9yKG1hcFN0YXRlLnpvb20pO1xuICAgIGNvbnN0IHtjb25maWcsIG1ldGF9ID0gdGhpcztcbiAgICBjb25zdCB7dmlzQ29uZmlnfSA9IGNvbmZpZztcblxuICAgIGNvbnN0IHVwZGF0ZVRyaWdnZXJzID0ge1xuICAgICAgZ2V0Q29sb3I6IHtcbiAgICAgICAgY29sb3I6IGNvbmZpZy5jb2xvcixcbiAgICAgICAgY29sb3JGaWVsZDogY29uZmlnLmNvbG9yRmllbGQsXG4gICAgICAgIGNvbG9yUmFuZ2U6IGNvbmZpZy52aXNDb25maWcuY29sb3JSYW5nZSxcbiAgICAgICAgY29sb3JTY2FsZTogY29uZmlnLmNvbG9yU2NhbGVcbiAgICAgIH0sXG4gICAgICBnZXRFbGV2YXRpb246IHtcbiAgICAgICAgc2l6ZUZpZWxkOiBjb25maWcuc2l6ZUZpZWxkLFxuICAgICAgICBzaXplUmFuZ2U6IGNvbmZpZy52aXNDb25maWcuc2l6ZVJhbmdlXG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBbXG4gICAgICBuZXcgSGV4YWdvbkNlbGxMYXllcih7XG4gICAgICAgIC4uLmxheWVySW50ZXJhY3Rpb24sXG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICBpZHgsXG4gICAgICAgIHBpY2thYmxlOiB0cnVlLFxuICAgICAgICBleHRydWRlZDogQm9vbGVhbihjb25maWcuc2l6ZUZpZWxkKSxcbiAgICAgICAgZWxldmF0aW9uU2NhbGU6IHZpc0NvbmZpZy5lbGV2YXRpb25TY2FsZSAqIGVsZVpvb21GYWN0b3IsXG4gICAgICAgIG9wYWNpdHk6IHZpc0NvbmZpZy5vcGFjaXR5LFxuICAgICAgICBsaWdodFNldHRpbmdzOiBtZXRhLmxpZ2h0U2V0dGluZ3MsXG4gICAgICAgIHVwZGF0ZVRyaWdnZXJzXG4gICAgICB9KSxcbiAgICAgIC4uLih0aGlzLmlzTGF5ZXJIb3ZlcmVkKG9iamVjdEhvdmVyZWQpICYmICFjb25maWcuc2l6ZUZpZWxkXG4gICAgICAgID8gW1xuICAgICAgICAgICAgbmV3IEdlb0pzb25MYXllcih7XG4gICAgICAgICAgICAgIGlkOiBgJHt0aGlzLmlkfS1ob3ZlcmVkYCxcbiAgICAgICAgICAgICAgZGF0YTogW1xuICAgICAgICAgICAgICAgIGlkVG9Qb2x5Z29uR2VvKG9iamVjdEhvdmVyZWQsIHtcbiAgICAgICAgICAgICAgICAgIGxpbmVDb2xvcjogY29uZmlnLmhpZ2hsaWdodENvbG9yXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgbGluZVdpZHRoU2NhbGU6IDggKiB6b29tRmFjdG9yXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIF1cbiAgICAgICAgOiBbXSlcbiAgICBdO1xuICB9XG59XG4iXX0=