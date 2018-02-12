'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

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

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _deck = require('deck.gl');

var _hexagonAggregator = require('./hexagon-aggregator');

var _utils = require('../layer-utils/utils');

var _enhancedHexagonCellLayer = require('./enhanced-hexagon-cell-layer');

var _enhancedHexagonCellLayer2 = _interopRequireDefault(_enhancedHexagonCellLayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultProps = (0, _extends3.default)({}, _deck.HexagonLayer.defaultProps, {
  hexagonAggregator: _hexagonAggregator.pointToHexbin,
  colorScale: 'quantile'
});

var EnhancedHexagonLayer = function (_HexagonLayer) {
  (0, _inherits3.default)(EnhancedHexagonLayer, _HexagonLayer);

  function EnhancedHexagonLayer() {
    (0, _classCallCheck3.default)(this, EnhancedHexagonLayer);
    return (0, _possibleConstructorReturn3.default)(this, (EnhancedHexagonLayer.__proto__ || Object.getPrototypeOf(EnhancedHexagonLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(EnhancedHexagonLayer, [{
    key: 'getDimensionUpdaters',
    value: function getDimensionUpdaters() {
      var dimensionUpdaters = (0, _get3.default)(EnhancedHexagonLayer.prototype.__proto__ || Object.getPrototypeOf(EnhancedHexagonLayer.prototype), 'getDimensionUpdaters', this).call(this);
      // add colorScale to dimension updates
      dimensionUpdaters.getColor[1].triggers.push('colorScale');
      return dimensionUpdaters;
    }

    /*
     * override default layer method to calculate color domain
     * and scale function base on color scale type
     */

  }, {
    key: 'getColorValueDomain',
    value: function getColorValueDomain() {
      (0, _utils.getColorValueDomain)(this);
    }
  }, {
    key: 'getColorScale',
    value: function getColorScale() {
      (0, _utils.getColorScaleFunction)(this);
    }

    /*
     * override default getSubLayerClass to return customized cellLayer
     */

  }, {
    key: 'getSubLayerClass',
    value: function getSubLayerClass() {
      return _enhancedHexagonCellLayer2.default;
    }
  }]);
  return EnhancedHexagonLayer;
}(_deck.HexagonLayer);

exports.default = EnhancedHexagonLayer;


EnhancedHexagonLayer.layerName = 'EnhancedHexagonLayer';
EnhancedHexagonLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2hleGFnb24tbGF5ZXIvZW5oYW5jZWQtaGV4YWdvbi1sYXllci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UHJvcHMiLCJoZXhhZ29uQWdncmVnYXRvciIsImNvbG9yU2NhbGUiLCJFbmhhbmNlZEhleGFnb25MYXllciIsImRpbWVuc2lvblVwZGF0ZXJzIiwiZ2V0Q29sb3IiLCJ0cmlnZ2VycyIsInB1c2giLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsMENBQ0QsbUJBQWFBLFlBRFo7QUFFSkMscURBRkk7QUFHSkMsY0FBWTtBQUhSLEVBQU47O0lBTXFCQyxvQjs7Ozs7Ozs7OzsyQ0FDSTtBQUNyQixVQUFNQyxrTEFBTjtBQUNBO0FBQ0FBLHdCQUFrQkMsUUFBbEIsQ0FBMkIsQ0FBM0IsRUFBOEJDLFFBQTlCLENBQXVDQyxJQUF2QyxDQUE0QyxZQUE1QztBQUNBLGFBQU9ILGlCQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7MENBSXNCO0FBQ3BCLHNDQUFvQixJQUFwQjtBQUNEOzs7b0NBRWU7QUFDZCx3Q0FBc0IsSUFBdEI7QUFDRDs7QUFFRDs7Ozs7O3VDQUdtQjtBQUNqQjtBQUNEOzs7OztrQkF6QmtCRCxvQjs7O0FBNEJyQkEscUJBQXFCSyxTQUFyQixHQUFpQyxzQkFBakM7QUFDQUwscUJBQXFCSCxZQUFyQixHQUFvQ0EsWUFBcEMiLCJmaWxlIjoiZW5oYW5jZWQtaGV4YWdvbi1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SGV4YWdvbkxheWVyfSBmcm9tICdkZWNrLmdsJztcbmltcG9ydCB7cG9pbnRUb0hleGJpbn0gZnJvbSAnLi9oZXhhZ29uLWFnZ3JlZ2F0b3InO1xuXG5pbXBvcnQge2dldENvbG9yVmFsdWVEb21haW4sIGdldENvbG9yU2NhbGVGdW5jdGlvbn0gZnJvbSAnLi4vbGF5ZXItdXRpbHMvdXRpbHMnO1xuaW1wb3J0IEVuaGFuY2VkSGV4YWdvbkNlbGxMYXllciBmcm9tICcuL2VuaGFuY2VkLWhleGFnb24tY2VsbC1sYXllcic7XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgLi4uSGV4YWdvbkxheWVyLmRlZmF1bHRQcm9wcyxcbiAgaGV4YWdvbkFnZ3JlZ2F0b3I6IHBvaW50VG9IZXhiaW4sXG4gIGNvbG9yU2NhbGU6ICdxdWFudGlsZSdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVuaGFuY2VkSGV4YWdvbkxheWVyIGV4dGVuZHMgSGV4YWdvbkxheWVyIHtcbiAgZ2V0RGltZW5zaW9uVXBkYXRlcnMoKSB7XG4gICAgY29uc3QgZGltZW5zaW9uVXBkYXRlcnMgPSBzdXBlci5nZXREaW1lbnNpb25VcGRhdGVycygpO1xuICAgIC8vIGFkZCBjb2xvclNjYWxlIHRvIGRpbWVuc2lvbiB1cGRhdGVzXG4gICAgZGltZW5zaW9uVXBkYXRlcnMuZ2V0Q29sb3JbMV0udHJpZ2dlcnMucHVzaCgnY29sb3JTY2FsZScpO1xuICAgIHJldHVybiBkaW1lbnNpb25VcGRhdGVycztcbiAgfVxuXG4gIC8qXG4gICAqIG92ZXJyaWRlIGRlZmF1bHQgbGF5ZXIgbWV0aG9kIHRvIGNhbGN1bGF0ZSBjb2xvciBkb21haW5cbiAgICogYW5kIHNjYWxlIGZ1bmN0aW9uIGJhc2Ugb24gY29sb3Igc2NhbGUgdHlwZVxuICAgKi9cbiAgZ2V0Q29sb3JWYWx1ZURvbWFpbigpIHtcbiAgICBnZXRDb2xvclZhbHVlRG9tYWluKHRoaXMpO1xuICB9XG5cbiAgZ2V0Q29sb3JTY2FsZSgpIHtcbiAgICBnZXRDb2xvclNjYWxlRnVuY3Rpb24odGhpcyk7XG4gIH1cblxuICAvKlxuICAgKiBvdmVycmlkZSBkZWZhdWx0IGdldFN1YkxheWVyQ2xhc3MgdG8gcmV0dXJuIGN1c3RvbWl6ZWQgY2VsbExheWVyXG4gICAqL1xuICBnZXRTdWJMYXllckNsYXNzKCkge1xuICAgIHJldHVybiBFbmhhbmNlZEhleGFnb25DZWxsTGF5ZXI7XG4gIH1cbn1cblxuRW5oYW5jZWRIZXhhZ29uTGF5ZXIubGF5ZXJOYW1lID0gJ0VuaGFuY2VkSGV4YWdvbkxheWVyJztcbkVuaGFuY2VkSGV4YWdvbkxheWVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==