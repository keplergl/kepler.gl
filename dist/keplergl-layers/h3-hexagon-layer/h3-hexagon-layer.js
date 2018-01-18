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
      data: [(0, _h3Utils.idToPolygonGeo)(objectHovered, { lineColor: config.highlightColor })],
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvaDMtaGV4YWdvbi1sYXllci9oMy1oZXhhZ29uLWxheWVyLmpzIl0sIm5hbWVzIjpbImhleElkUmVxdWlyZWRDb2x1bW5zIiwiaGV4SWRBY2Nlc3NvciIsImhleF9pZCIsImQiLCJmaWVsZElkeCIsImhleElkUmVzb2x2ZXIiLCJIZXhhZ29uSWRWaXNDb25maWdzIiwib3BhY2l0eSIsImNvbG9yUmFuZ2UiLCJzaXplUmFuZ2UiLCJlbGV2YXRpb25TY2FsZSIsIkhleGFnb25JZExheWVyIiwicHJvcHMiLCJyZWdpc3RlclZpc0NvbmZpZyIsImdldEhleElkIiwiZm9ybWF0TGF5ZXJEYXRhIiwiXyIsImFsbERhdGEiLCJmaWx0ZXJlZEluZGV4Iiwib2xkTGF5ZXJEYXRhIiwib3B0IiwiY29uZmlnIiwiY29sb3JTY2FsZSIsImNvbG9yRG9tYWluIiwiY29sb3JGaWVsZCIsImNvbG9yIiwiY29sdW1ucyIsInNpemVGaWVsZCIsInNpemVTY2FsZSIsInNpemVEb21haW4iLCJ2aXNDb25maWciLCJjU2NhbGUiLCJnZXRWaXNDaGFubmVsU2NhbGUiLCJjb2xvcnMiLCJtYXAiLCJzU2NhbGUiLCJ1cGRhdGVMYXllck1ldGEiLCJkYXRhIiwic2FtZURhdGEiLCJyZWR1Y2UiLCJhY2N1IiwiaW5kZXgiLCJpIiwiaWQiLCJjZW50cm9pZCIsImRhdGFUb0ZlYXR1cmUiLCJjZW50cm9pZHMiLCJwdXNoIiwiZ2V0RWxldmF0aW9uIiwiZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZSIsImdldENvbG9yIiwiaGV4YWdvblZlcnRpY2VzIiwidmVydGljZXMiLCJmb3JFYWNoIiwibGVuZ3RoIiwiYm91bmRzIiwiZ2V0UG9pbnRzQm91bmRzIiwiT2JqZWN0IiwidmFsdWVzIiwibGlnaHRTZXR0aW5ncyIsImdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzIiwidXBkYXRlTWV0YSIsInJlbmRlckxheWVyIiwiaWR4IiwibGF5ZXJJbnRlcmFjdGlvbiIsIm9iamVjdEhvdmVyZWQiLCJtYXBTdGF0ZSIsImludGVyYWN0aW9uQ29uZmlnIiwiem9vbUZhY3RvciIsImdldFpvb21GYWN0b3IiLCJ6b29tIiwiZWxlWm9vbUZhY3RvciIsImdldEVsZXZhdGlvblpvb21GYWN0b3IiLCJtZXRhIiwidXBkYXRlVHJpZ2dlcnMiLCJwaWNrYWJsZSIsImV4dHJ1ZGVkIiwiQm9vbGVhbiIsImlzTGF5ZXJIb3ZlcmVkIiwibGluZUNvbG9yIiwiaGlnaGxpZ2h0Q29sb3IiLCJsaW5lV2lkdGhTY2FsZSIsInZpc3VhbENoYW5uZWxzIiwic2l6ZSIsInByb3BlcnR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFTyxJQUFNQSxzREFBdUIsQ0FBQyxRQUFELENBQTdCO0FBQ0EsSUFBTUMsd0NBQWdCLFNBQWhCQSxhQUFnQjtBQUFBLE1BQUVDLE1BQUYsUUFBRUEsTUFBRjtBQUFBLFNBQWM7QUFBQSxXQUFLQyxFQUFFRCxPQUFPRSxRQUFULENBQUw7QUFBQSxHQUFkO0FBQUEsQ0FBdEI7QUFDQSxJQUFNQyx3Q0FBZ0IsU0FBaEJBLGFBQWdCO0FBQUEsTUFBRUgsTUFBRixTQUFFQSxNQUFGO0FBQUEsU0FBY0EsT0FBT0UsUUFBckI7QUFBQSxDQUF0Qjs7QUFFQSxJQUFNRSxvREFBc0I7QUFDakNDLFdBQVMsU0FEd0I7QUFFakNDLGNBQVksWUFGcUI7QUFHakNDLGFBQVcsZ0JBSHNCO0FBSWpDQyxrQkFBZ0IsZ0JBSmlCO0FBS2pDLGtCQUFnQjtBQUxpQixDQUE1Qjs7SUFRY0MsYzs7O0FBQ25CLDBCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsK0RBQ2pCLGtCQUFNQSxLQUFOLENBRGlCOztBQUVqQixVQUFLQyxpQkFBTCxDQUF1QlAsbUJBQXZCO0FBQ0EsVUFBS1EsUUFBTCxHQUFnQixzQkFBUWIsYUFBUixFQUF1QkksYUFBdkIsQ0FBaEI7QUFIaUI7QUFJbEI7OzJCQW9CRFUsZSw0QkFBZ0JDLEMsRUFBR0MsTyxFQUFTQyxhLEVBQWVDLFksRUFBd0I7QUFBQTs7QUFBQSxRQUFWQyxHQUFVLHVFQUFKLEVBQUk7QUFBQSxrQkFFekIsS0FBS0MsTUFGb0I7QUFBQSxRQUMxREMsVUFEMEQsV0FDMURBLFVBRDBEO0FBQUEsUUFDOUNDLFdBRDhDLFdBQzlDQSxXQUQ4QztBQUFBLFFBQ2pDQyxVQURpQyxXQUNqQ0EsVUFEaUM7QUFBQSxRQUNyQkMsS0FEcUIsV0FDckJBLEtBRHFCO0FBQUEsUUFDZEMsT0FEYyxXQUNkQSxPQURjO0FBQUEsUUFDTEMsU0FESyxXQUNMQSxTQURLO0FBQUEsUUFDTUMsU0FETixXQUNNQSxTQUROO0FBQUEsUUFDaUJDLFVBRGpCLFdBQ2lCQSxVQURqQjtBQUFBLG9DQUUvREMsU0FGK0Q7QUFBQSxRQUVuRHJCLFNBRm1ELHFCQUVuREEsU0FGbUQ7QUFBQSxRQUV4Q0QsVUFGd0MscUJBRXhDQSxVQUZ3Qzs7QUFJakU7O0FBQ0EsUUFBTXVCLFNBQVNQLGNBQWMsS0FBS1Esa0JBQUwsQ0FDM0JWLFVBRDJCLEVBRTNCQyxXQUYyQixFQUczQmYsV0FBV3lCLE1BQVgsQ0FBa0JDLEdBQWxCLHNCQUgyQixDQUE3Qjs7QUFNQTtBQUNBLFFBQU1DLFNBQVNSLGFBQWEsS0FBS0ssa0JBQUwsQ0FDMUJKLFNBRDBCLEVBRTFCQyxVQUYwQixFQUcxQnBCLFNBSDBCLENBQTVCOztBQU1BLFFBQU1LLFdBQVcsS0FBS0EsUUFBTCxDQUFjWSxPQUFkLENBQWpCOztBQUVBLFFBQUksQ0FBQ1AsWUFBRCxJQUFpQkEsYUFBYUwsUUFBYixLQUEwQkEsUUFBL0MsRUFBeUQ7QUFDdkQsV0FBS3NCLGVBQUwsQ0FBcUJuQixPQUFyQixFQUE4QkgsUUFBOUI7QUFDRDs7QUFFRCxRQUFJdUIsYUFBSjtBQUNBLFFBQUlsQixnQkFBZ0JBLGFBQWFrQixJQUE3QixJQUFxQ2pCLElBQUlrQixRQUF6QyxJQUNDbkIsYUFBYUwsUUFBYixLQUEwQkEsUUFEL0IsRUFDeUM7QUFDdkN1QixhQUFPbEIsYUFBYWtCLElBQXBCO0FBRUQsS0FKRCxNQUlPOztBQUVMQSxhQUFPbkIsY0FBY3FCLE1BQWQsQ0FBcUIsVUFBQ0MsSUFBRCxFQUFPQyxLQUFQLEVBQWNDLENBQWQsRUFBb0I7O0FBRTlDLFlBQU1DLEtBQUs3QixTQUFTRyxRQUFRd0IsS0FBUixDQUFULENBQVg7QUFDQSxZQUFNRyxXQUFXLE9BQUtDLGFBQUwsQ0FBbUJDLFNBQW5CLENBQTZCTCxLQUE3QixDQUFqQjs7QUFFQSxZQUFJRyxRQUFKLEVBQWM7QUFDWkosZUFBS08sSUFBTCxDQUFVO0FBQ1I7QUFDQU4sbUJBQU9DLENBRkM7QUFHUkwsa0JBQU1wQixRQUFRd0IsS0FBUixDQUhFO0FBSVJFLGtCQUpRO0FBS1JDO0FBTFEsV0FBVjtBQU9EOztBQUVELGVBQU9KLElBQVA7QUFDRCxPQWhCTSxFQWdCSixFQWhCSSxDQUFQO0FBaUJEOztBQUVELFFBQU1RLGVBQWUsU0FBZkEsWUFBZTtBQUFBLGFBQUtiLFNBQ3hCLE9BQUtjLHNCQUFMLENBQTRCZCxNQUE1QixFQUFvQ2hDLEVBQUVrQyxJQUF0QyxFQUE0Q1YsU0FBNUMsRUFBdUQsQ0FBdkQsQ0FEd0IsR0FDb0MsQ0FEekM7QUFBQSxLQUFyQjs7QUFHQSxRQUFNdUIsV0FBVyxTQUFYQSxRQUFXO0FBQUEsYUFBS25CLFNBQ3BCLE9BQUtrQixzQkFBTCxDQUE0QmxCLE1BQTVCLEVBQW9DNUIsRUFBRWtDLElBQXRDLEVBQTRDYixVQUE1QyxDQURvQixHQUNzQ0MsS0FEM0M7QUFBQSxLQUFqQjs7QUFHQTtBQUNBLFdBQU87QUFDTFksZ0JBREs7QUFFTFcsZ0NBRks7QUFHTEUsd0JBSEs7QUFJTHBDLHdCQUpLO0FBS0xxQyx1QkFBaUIsS0FBS04sYUFBTCxDQUFtQk87QUFML0IsS0FBUDs7QUFRQTtBQUNELEc7OzJCQUVEaEIsZSw0QkFBZ0JuQixPLEVBQVNILFEsRUFBVTtBQUNqQyxRQUFJc0MsaUJBQUo7QUFDQSxRQUFNTixZQUFZLEVBQWxCOztBQUVBN0IsWUFBUW9DLE9BQVIsQ0FBZ0IsVUFBQ2xELENBQUQsRUFBSXNDLEtBQUosRUFBYzs7QUFFNUIsVUFBTUUsS0FBSzdCLFNBQVNYLENBQVQsQ0FBWDtBQUNBLFVBQUksT0FBT3dDLEVBQVAsS0FBYyxRQUFkLElBQTBCLENBQUNBLEdBQUdXLE1BQWxDLEVBQTBDO0FBQ3hDO0FBQ0Q7QUFDRDtBQUNBO0FBQ0EsVUFBSSxDQUFDRixRQUFMLEVBQWU7QUFDYkEsbUJBQVdULE1BQU0sMEJBQVksRUFBQ0EsTUFBRCxFQUFaLENBQWpCO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBRyxnQkFBVUwsS0FBVixJQUFtQiwwQkFBWSxFQUFDRSxNQUFELEVBQVosQ0FBbkI7QUFDRCxLQWZEOztBQWlCQSxRQUFNWSxTQUFTLEtBQUtDLGVBQUwsQ0FBcUJDLE9BQU9DLE1BQVAsQ0FBY1osU0FBZCxDQUFyQixFQUErQztBQUFBLGFBQUszQyxDQUFMO0FBQUEsS0FBL0MsQ0FBZjtBQUNBLFFBQU13RCxnQkFBZ0IsS0FBS0MsMEJBQUwsQ0FBZ0NMLE1BQWhDLENBQXRCOztBQUVBLFNBQUtWLGFBQUwsR0FBcUIsRUFBQ08sa0JBQUQsRUFBV04sb0JBQVgsRUFBckI7QUFDQSxTQUFLZSxVQUFMLENBQWdCLEVBQUNOLGNBQUQsRUFBU0ksNEJBQVQsRUFBaEI7QUFDRCxHOzsyQkFFREcsVywrQkFBdUY7QUFBQSxRQUExRXpCLElBQTBFLFNBQTFFQSxJQUEwRTtBQUFBLFFBQXBFMEIsR0FBb0UsU0FBcEVBLEdBQW9FO0FBQUEsUUFBL0RDLGdCQUErRCxTQUEvREEsZ0JBQStEO0FBQUEsUUFBN0NDLGFBQTZDLFNBQTdDQSxhQUE2QztBQUFBLFFBQTlCQyxRQUE4QixTQUE5QkEsUUFBOEI7QUFBQSxRQUFwQkMsaUJBQW9CLFNBQXBCQSxpQkFBb0I7O0FBQ3JGLFFBQU1DLGFBQWEsS0FBS0MsYUFBTCxDQUFtQkgsU0FBU0ksSUFBNUIsQ0FBbkI7QUFDQSxRQUFNQyxnQkFBZ0IsS0FBS0Msc0JBQUwsQ0FBNEJOLFNBQVNJLElBQXJDLENBQXRCO0FBRnFGLFFBRzlFakQsTUFIOEUsR0FHOUQsSUFIOEQsQ0FHOUVBLE1BSDhFO0FBQUEsUUFHdEVvRCxJQUhzRSxHQUc5RCxJQUg4RCxDQUd0RUEsSUFIc0U7QUFBQSxRQUk5RTNDLFNBSjhFLEdBSWpFVCxNQUppRSxDQUk5RVMsU0FKOEU7OztBQU1yRixRQUFNNEMsaUJBQWlCO0FBQ3JCeEIsZ0JBQVU7QUFDUnpCLGVBQU9KLE9BQU9JLEtBRE47QUFFUkQsb0JBQVlILE9BQU9HLFVBRlg7QUFHUmhCLG9CQUFZYSxPQUFPUyxTQUFQLENBQWlCdEIsVUFIckI7QUFJUmMsb0JBQVlELE9BQU9DO0FBSlgsT0FEVztBQU9yQjBCLG9CQUFjO0FBQ1pyQixtQkFBV04sT0FBT00sU0FETjtBQUVabEIsbUJBQVdZLE9BQU9TLFNBQVAsQ0FBaUJyQjtBQUZoQjtBQVBPLEtBQXZCOztBQWFBLFlBQ0Usc0RBQ0t1RCxnQkFETCxFQUVLM0IsSUFGTDtBQUdFTSxVQUFJLEtBQUtBLEVBSFg7QUFJRW9CLGNBSkY7QUFLRVksZ0JBQVUsSUFMWjtBQU1FQyxnQkFBVUMsUUFBUXhELE9BQU9NLFNBQWYsQ0FOWjtBQU9FakIsc0JBQWdCb0IsVUFBVXBCLGNBQVYsR0FBMkI2RCxhQVA3QztBQVFFaEUsZUFBU3VCLFVBQVV2QixPQVJyQjtBQVNFb0QscUJBQWVjLEtBQUtkLGFBVHRCO0FBVUVlO0FBVkYsT0FERixTQWFLLEtBQUtJLGNBQUwsQ0FBb0JiLGFBQXBCLEtBQXNDLENBQUM1QyxPQUFPTSxTQUE5QyxHQUNELENBQUMsdUJBQWlCO0FBQ2hCZ0IsVUFBTyxLQUFLQSxFQUFaLGFBRGdCO0FBRWhCTixZQUFNLENBQ0osNkJBQWU0QixhQUFmLEVBQThCLEVBQUNjLFdBQVcxRCxPQUFPMkQsY0FBbkIsRUFBOUIsQ0FESSxDQUZVO0FBS2hCQyxzQkFBZ0IsSUFBSWI7QUFMSixLQUFqQixDQUFELENBREMsR0FPSyxFQXBCVjtBQXNCRCxHOzs7O3dCQTNKVTtBQUNULGFBQU8sV0FBUDtBQUNEOzs7d0JBRTBCO0FBQ3pCLGFBQU9wRSxvQkFBUDtBQUNEOzs7d0JBRW9CO0FBQ25CLHdDQUNLLGlCQUFNa0YsY0FEWDtBQUVFQyx5Q0FDSyxpQkFBTUQsY0FBTixDQUFxQkMsSUFEMUI7QUFFRUMsb0JBQVU7QUFGWjtBQUZGO0FBT0Q7Ozs7O2tCQXZCa0J6RSxjIiwiZmlsZSI6ImgzLWhleGFnb24tbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWVtb2l6ZSBmcm9tICdsb2Rhc2gubWVtb2l6ZSc7XG5cbmltcG9ydCBMYXllciBmcm9tICcuLi9iYXNlLWxheWVyJztcbmltcG9ydCB7SGV4YWdvbkNlbGxMYXllciwgR2VvSnNvbkxheWVyfSBmcm9tICdkZWNrLmdsJztcbmltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJ3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCB7Z2V0VmVydGljZXMsIGdldENlbnRyb2lkLCBpZFRvUG9seWdvbkdlb30gZnJvbSAnLi9oMy11dGlscyc7XG5cbmV4cG9ydCBjb25zdCBoZXhJZFJlcXVpcmVkQ29sdW1ucyA9IFsnaGV4X2lkJ107XG5leHBvcnQgY29uc3QgaGV4SWRBY2Nlc3NvciA9ICh7aGV4X2lkfSkgPT4gZCA9PiBkW2hleF9pZC5maWVsZElkeF07XG5leHBvcnQgY29uc3QgaGV4SWRSZXNvbHZlciA9ICh7aGV4X2lkfSkgPT4gaGV4X2lkLmZpZWxkSWR4O1xuXG5leHBvcnQgY29uc3QgSGV4YWdvbklkVmlzQ29uZmlncyA9IHtcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIHNpemVSYW5nZTogJ2VsZXZhdGlvblJhbmdlJyxcbiAgZWxldmF0aW9uU2NhbGU6ICdlbGV2YXRpb25TY2FsZScsXG4gICdoaS1wcmVjaXNpb24nOiAnaGktcHJlY2lzaW9uJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGV4YWdvbklkTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMucmVnaXN0ZXJWaXNDb25maWcoSGV4YWdvbklkVmlzQ29uZmlncyk7XG4gICAgdGhpcy5nZXRIZXhJZCA9IG1lbW9pemUoaGV4SWRBY2Nlc3NvciwgaGV4SWRSZXNvbHZlcik7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gJ2hleGFnb25JZCc7XG4gIH1cblxuICBnZXQgcmVxdWlyZWRMYXllckNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIGhleElkUmVxdWlyZWRDb2x1bW5zO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci52aXN1YWxDaGFubmVscyxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZSxcbiAgICAgICAgcHJvcGVydHk6ICdoZWlnaHQnXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGZvcm1hdExheWVyRGF0YShfLCBhbGxEYXRhLCBmaWx0ZXJlZEluZGV4LCBvbGRMYXllckRhdGEsIG9wdCA9IHt9KSB7XG4gICAgY29uc3Qge2NvbG9yU2NhbGUsIGNvbG9yRG9tYWluLCBjb2xvckZpZWxkLCBjb2xvciwgY29sdW1ucywgc2l6ZUZpZWxkLCBzaXplU2NhbGUsIHNpemVEb21haW4sXG4gICAgICB2aXNDb25maWc6IHtzaXplUmFuZ2UsIGNvbG9yUmFuZ2V9fSA9IHRoaXMuY29uZmlnO1xuXG4gICAgLy8gY29sb3JcbiAgICBjb25zdCBjU2NhbGUgPSBjb2xvckZpZWxkICYmIHRoaXMuZ2V0VmlzQ2hhbm5lbFNjYWxlKFxuICAgICAgY29sb3JTY2FsZSxcbiAgICAgIGNvbG9yRG9tYWluLFxuICAgICAgY29sb3JSYW5nZS5jb2xvcnMubWFwKGhleFRvUmdiKVxuICAgICk7XG5cbiAgICAvLyBoZWlnaHRcbiAgICBjb25zdCBzU2NhbGUgPSBzaXplRmllbGQgJiYgdGhpcy5nZXRWaXNDaGFubmVsU2NhbGUoXG4gICAgICBzaXplU2NhbGUsXG4gICAgICBzaXplRG9tYWluLFxuICAgICAgc2l6ZVJhbmdlXG4gICAgKTtcblxuICAgIGNvbnN0IGdldEhleElkID0gdGhpcy5nZXRIZXhJZChjb2x1bW5zKTtcblxuICAgIGlmICghb2xkTGF5ZXJEYXRhIHx8IG9sZExheWVyRGF0YS5nZXRIZXhJZCAhPT0gZ2V0SGV4SWQpIHtcbiAgICAgIHRoaXMudXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEsIGdldEhleElkKTtcbiAgICB9XG5cbiAgICBsZXQgZGF0YTtcbiAgICBpZiAob2xkTGF5ZXJEYXRhICYmIG9sZExheWVyRGF0YS5kYXRhICYmIG9wdC5zYW1lRGF0YVxuICAgICAgJiYgb2xkTGF5ZXJEYXRhLmdldEhleElkID09PSBnZXRIZXhJZCkge1xuICAgICAgZGF0YSA9IG9sZExheWVyRGF0YS5kYXRhO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgZGF0YSA9IGZpbHRlcmVkSW5kZXgucmVkdWNlKChhY2N1LCBpbmRleCwgaSkgPT4ge1xuXG4gICAgICAgIGNvbnN0IGlkID0gZ2V0SGV4SWQoYWxsRGF0YVtpbmRleF0pO1xuICAgICAgICBjb25zdCBjZW50cm9pZCA9IHRoaXMuZGF0YVRvRmVhdHVyZS5jZW50cm9pZHNbaW5kZXhdO1xuXG4gICAgICAgIGlmIChjZW50cm9pZCkge1xuICAgICAgICAgIGFjY3UucHVzaCh7XG4gICAgICAgICAgICAvLyBrZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSBvcmlnaW5hbCBkYXRhIGluZGV4XG4gICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgIGRhdGE6IGFsbERhdGFbaW5kZXhdLFxuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBjZW50cm9pZFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFjY3U7XG4gICAgICB9LCBbXSk7XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0RWxldmF0aW9uID0gZCA9PiBzU2NhbGUgP1xuICAgICAgdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKHNTY2FsZSwgZC5kYXRhLCBzaXplRmllbGQsIDApIDogMDtcblxuICAgIGNvbnN0IGdldENvbG9yID0gZCA9PiBjU2NhbGUgP1xuICAgICAgdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKGNTY2FsZSwgZC5kYXRhLCBjb2xvckZpZWxkKSA6IGNvbG9yO1xuXG4gICAgLy8gY29uc3QgbGF5ZXJEYXRhID0ge1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhLFxuICAgICAgZ2V0RWxldmF0aW9uLFxuICAgICAgZ2V0Q29sb3IsXG4gICAgICBnZXRIZXhJZCxcbiAgICAgIGhleGFnb25WZXJ0aWNlczogdGhpcy5kYXRhVG9GZWF0dXJlLnZlcnRpY2VzXG4gICAgfTtcblxuICAgIC8vIHJldHVybiB7bGF5ZXJEYXRhLCBsYXllcjogdGhpc307XG4gIH1cblxuICB1cGRhdGVMYXllck1ldGEoYWxsRGF0YSwgZ2V0SGV4SWQpIHtcbiAgICBsZXQgdmVydGljZXM7XG4gICAgY29uc3QgY2VudHJvaWRzID0ge307XG5cbiAgICBhbGxEYXRhLmZvckVhY2goKGQsIGluZGV4KSA9PiB7XG5cbiAgICAgIGNvbnN0IGlkID0gZ2V0SGV4SWQoZCk7XG4gICAgICBpZiAodHlwZW9mIGlkICE9PSAnc3RyaW5nJyB8fCAhaWQubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIGZpbmQgdmVydGljZXNcbiAgICAgIC8vIG9ubHkgbmVlZCAxIGluc3RhbmNlIG9mIHZlcnRpY2VzXG4gICAgICBpZiAoIXZlcnRpY2VzKSB7XG4gICAgICAgIHZlcnRpY2VzID0gaWQgJiYgZ2V0VmVydGljZXMoe2lkfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNhdmUgYSByZWZlcmVuY2Ugb2YgY2VudHJvaWRzIHRvIGRhdGFUb0ZlYXR1cmVcbiAgICAgIC8vIHNvIHdlIGRvbid0IGhhdmUgdG8gcmUgY2FsY3VsYXRlIGl0IGFnYWluXG4gICAgICBjZW50cm9pZHNbaW5kZXhdID0gZ2V0Q2VudHJvaWQoe2lkfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldFBvaW50c0JvdW5kcyhPYmplY3QudmFsdWVzKGNlbnRyb2lkcyksIGQgPT4gZCk7XG4gICAgY29uc3QgbGlnaHRTZXR0aW5ncyA9IHRoaXMuZ2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHMoYm91bmRzKTtcblxuICAgIHRoaXMuZGF0YVRvRmVhdHVyZSA9IHt2ZXJ0aWNlcywgY2VudHJvaWRzfTtcbiAgICB0aGlzLnVwZGF0ZU1ldGEoe2JvdW5kcywgbGlnaHRTZXR0aW5nc30pO1xuICB9XG5cbiAgcmVuZGVyTGF5ZXIoe2RhdGEsIGlkeCwgbGF5ZXJJbnRlcmFjdGlvbiwgb2JqZWN0SG92ZXJlZCwgbWFwU3RhdGUsIGludGVyYWN0aW9uQ29uZmlnfSkge1xuICAgIGNvbnN0IHpvb21GYWN0b3IgPSB0aGlzLmdldFpvb21GYWN0b3IobWFwU3RhdGUuem9vbSk7XG4gICAgY29uc3QgZWxlWm9vbUZhY3RvciA9IHRoaXMuZ2V0RWxldmF0aW9uWm9vbUZhY3RvcihtYXBTdGF0ZS56b29tKTtcbiAgICBjb25zdCB7Y29uZmlnLCBtZXRhfSA9IHRoaXM7XG4gICAgY29uc3Qge3Zpc0NvbmZpZ30gPSBjb25maWc7XG5cbiAgICBjb25zdCB1cGRhdGVUcmlnZ2VycyA9IHtcbiAgICAgIGdldENvbG9yOiB7XG4gICAgICAgIGNvbG9yOiBjb25maWcuY29sb3IsXG4gICAgICAgIGNvbG9yRmllbGQ6IGNvbmZpZy5jb2xvckZpZWxkLFxuICAgICAgICBjb2xvclJhbmdlOiBjb25maWcudmlzQ29uZmlnLmNvbG9yUmFuZ2UsXG4gICAgICAgIGNvbG9yU2NhbGU6IGNvbmZpZy5jb2xvclNjYWxlXG4gICAgICB9LFxuICAgICAgZ2V0RWxldmF0aW9uOiB7XG4gICAgICAgIHNpemVGaWVsZDogY29uZmlnLnNpemVGaWVsZCxcbiAgICAgICAgc2l6ZVJhbmdlOiBjb25maWcudmlzQ29uZmlnLnNpemVSYW5nZVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gW1xuICAgICAgbmV3IEhleGFnb25DZWxsTGF5ZXIoe1xuICAgICAgICAuLi5sYXllckludGVyYWN0aW9uLFxuICAgICAgICAuLi5kYXRhLFxuICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAgaWR4LFxuICAgICAgICBwaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgZXh0cnVkZWQ6IEJvb2xlYW4oY29uZmlnLnNpemVGaWVsZCksXG4gICAgICAgIGVsZXZhdGlvblNjYWxlOiB2aXNDb25maWcuZWxldmF0aW9uU2NhbGUgKiBlbGVab29tRmFjdG9yLFxuICAgICAgICBvcGFjaXR5OiB2aXNDb25maWcub3BhY2l0eSxcbiAgICAgICAgbGlnaHRTZXR0aW5nczogbWV0YS5saWdodFNldHRpbmdzLFxuICAgICAgICB1cGRhdGVUcmlnZ2Vyc1xuICAgICAgfSksXG4gICAgICAuLi50aGlzLmlzTGF5ZXJIb3ZlcmVkKG9iamVjdEhvdmVyZWQpICYmICFjb25maWcuc2l6ZUZpZWxkID9cbiAgICAgICAgW25ldyBHZW9Kc29uTGF5ZXIoe1xuICAgICAgICAgIGlkOiBgJHt0aGlzLmlkfS1ob3ZlcmVkYCxcbiAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICBpZFRvUG9seWdvbkdlbyhvYmplY3RIb3ZlcmVkLCB7bGluZUNvbG9yOiBjb25maWcuaGlnaGxpZ2h0Q29sb3J9KVxuICAgICAgICAgIF0sXG4gICAgICAgICAgbGluZVdpZHRoU2NhbGU6IDggKiB6b29tRmFjdG9yXG4gICAgICAgIH0pXSA6IFtdXG4gICAgXTtcbiAgfVxufVxuIl19