'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

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
    return (0, _possibleConstructorReturn3.default)(this, _HexagonLayer.apply(this, arguments));
  }

  EnhancedHexagonLayer.prototype.getDimensionUpdaters = function getDimensionUpdaters() {
    var dimensionUpdaters = _HexagonLayer.prototype.getDimensionUpdaters.call(this);
    // add colorScale to dimension updates
    dimensionUpdaters.getColor[1].triggers.push('colorScale');
    return dimensionUpdaters;
  };

  /*
   * override default layer method to calculate color domain
   * and scale function base on color scale type
   */


  EnhancedHexagonLayer.prototype.getColorValueDomain = function getColorValueDomain() {
    (0, _utils.getColorValueDomain)(this);
  };

  EnhancedHexagonLayer.prototype.getColorScale = function getColorScale() {
    (0, _utils.getColorScaleFunction)(this);
  };

  /*
   * override default getSubLayerClass to return customized cellLayer
   */


  EnhancedHexagonLayer.prototype.getSubLayerClass = function getSubLayerClass() {
    return _enhancedHexagonCellLayer2.default;
  };

  return EnhancedHexagonLayer;
}(_deck.HexagonLayer);

exports.default = EnhancedHexagonLayer;


EnhancedHexagonLayer.layerName = 'EnhancedHexagonLayer';
EnhancedHexagonLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2hleGFnb24tbGF5ZXIvZW5oYW5jZWQtaGV4YWdvbi1sYXllci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UHJvcHMiLCJoZXhhZ29uQWdncmVnYXRvciIsImNvbG9yU2NhbGUiLCJFbmhhbmNlZEhleGFnb25MYXllciIsImdldERpbWVuc2lvblVwZGF0ZXJzIiwiZGltZW5zaW9uVXBkYXRlcnMiLCJnZXRDb2xvciIsInRyaWdnZXJzIiwicHVzaCIsImdldENvbG9yVmFsdWVEb21haW4iLCJnZXRDb2xvclNjYWxlIiwiZ2V0U3ViTGF5ZXJDbGFzcyIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsMENBQ0QsbUJBQWFBLFlBRFo7QUFFSkMscURBRkk7QUFHSkMsY0FBWTtBQUhSLEVBQU47O0lBTXFCQyxvQjs7Ozs7Ozs7aUNBQ25CQyxvQixtQ0FBdUI7QUFDckIsUUFBTUMsb0JBQW9CLHdCQUFNRCxvQkFBTixXQUExQjtBQUNBO0FBQ0FDLHNCQUFrQkMsUUFBbEIsQ0FBMkIsQ0FBM0IsRUFBOEJDLFFBQTlCLENBQXVDQyxJQUF2QyxDQUE0QyxZQUE1QztBQUNBLFdBQU9ILGlCQUFQO0FBQ0QsRzs7QUFFRDs7Ozs7O2lDQUlBSSxtQixrQ0FBc0I7QUFDcEIsb0NBQW9CLElBQXBCO0FBQ0QsRzs7aUNBRURDLGEsNEJBQWdCO0FBQ2Qsc0NBQXNCLElBQXRCO0FBQ0QsRzs7QUFFRDs7Ozs7aUNBR0FDLGdCLCtCQUFtQjtBQUNqQjtBQUNELEc7Ozs7O2tCQXpCa0JSLG9COzs7QUE0QnJCQSxxQkFBcUJTLFNBQXJCLEdBQWlDLHNCQUFqQztBQUNBVCxxQkFBcUJILFlBQXJCLEdBQW9DQSxZQUFwQyIsImZpbGUiOiJlbmhhbmNlZC1oZXhhZ29uLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtIZXhhZ29uTGF5ZXJ9IGZyb20gJ2RlY2suZ2wnO1xuaW1wb3J0IHtwb2ludFRvSGV4YmlufSBmcm9tICcuL2hleGFnb24tYWdncmVnYXRvcic7XG5cbmltcG9ydCB7Z2V0Q29sb3JWYWx1ZURvbWFpbiwgZ2V0Q29sb3JTY2FsZUZ1bmN0aW9ufSBmcm9tICcuLi9sYXllci11dGlscy91dGlscyc7XG5pbXBvcnQgRW5oYW5jZWRIZXhhZ29uQ2VsbExheWVyIGZyb20gJy4vZW5oYW5jZWQtaGV4YWdvbi1jZWxsLWxheWVyJztcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAuLi5IZXhhZ29uTGF5ZXIuZGVmYXVsdFByb3BzLFxuICBoZXhhZ29uQWdncmVnYXRvcjogcG9pbnRUb0hleGJpbixcbiAgY29sb3JTY2FsZTogJ3F1YW50aWxlJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW5oYW5jZWRIZXhhZ29uTGF5ZXIgZXh0ZW5kcyBIZXhhZ29uTGF5ZXIge1xuICBnZXREaW1lbnNpb25VcGRhdGVycygpIHtcbiAgICBjb25zdCBkaW1lbnNpb25VcGRhdGVycyA9IHN1cGVyLmdldERpbWVuc2lvblVwZGF0ZXJzKCk7XG4gICAgLy8gYWRkIGNvbG9yU2NhbGUgdG8gZGltZW5zaW9uIHVwZGF0ZXNcbiAgICBkaW1lbnNpb25VcGRhdGVycy5nZXRDb2xvclsxXS50cmlnZ2Vycy5wdXNoKCdjb2xvclNjYWxlJyk7XG4gICAgcmV0dXJuIGRpbWVuc2lvblVwZGF0ZXJzO1xuICB9XG5cbiAgLypcbiAgICogb3ZlcnJpZGUgZGVmYXVsdCBsYXllciBtZXRob2QgdG8gY2FsY3VsYXRlIGNvbG9yIGRvbWFpblxuICAgKiBhbmQgc2NhbGUgZnVuY3Rpb24gYmFzZSBvbiBjb2xvciBzY2FsZSB0eXBlXG4gICAqL1xuICBnZXRDb2xvclZhbHVlRG9tYWluKCkge1xuICAgIGdldENvbG9yVmFsdWVEb21haW4odGhpcyk7XG4gIH1cblxuICBnZXRDb2xvclNjYWxlKCkge1xuICAgIGdldENvbG9yU2NhbGVGdW5jdGlvbih0aGlzKTtcbiAgfVxuXG4gIC8qXG4gICAqIG92ZXJyaWRlIGRlZmF1bHQgZ2V0U3ViTGF5ZXJDbGFzcyB0byByZXR1cm4gY3VzdG9taXplZCBjZWxsTGF5ZXJcbiAgICovXG4gIGdldFN1YkxheWVyQ2xhc3MoKSB7XG4gICAgcmV0dXJuIEVuaGFuY2VkSGV4YWdvbkNlbGxMYXllcjtcbiAgfVxufVxuXG5FbmhhbmNlZEhleGFnb25MYXllci5sYXllck5hbWUgPSAnRW5oYW5jZWRIZXhhZ29uTGF5ZXInO1xuRW5oYW5jZWRIZXhhZ29uTGF5ZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19