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

var _utils = require('../layer-utils/utils');

var _enhancedGridCellLayer = require('./enhanced-grid-cell-layer');

var _enhancedGridCellLayer2 = _interopRequireDefault(_enhancedGridCellLayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultProps = (0, _extends3.default)({}, _deck.GridLayer.defaultProps, {
  colorScale: 'quantile'
});

var EnhancedGridLayer = function (_GridLayer) {
  (0, _inherits3.default)(EnhancedGridLayer, _GridLayer);

  function EnhancedGridLayer() {
    (0, _classCallCheck3.default)(this, EnhancedGridLayer);
    return (0, _possibleConstructorReturn3.default)(this, _GridLayer.apply(this, arguments));
  }

  EnhancedGridLayer.prototype.getDimensionUpdaters = function getDimensionUpdaters() {

    var dimensionUpdaters = _GridLayer.prototype.getDimensionUpdaters.call(this);
    // add colorScale to dimension updates
    dimensionUpdaters.getColor[1].triggers.push('colorScale');
    return dimensionUpdaters;
  };

  /*
   * override default layer method to calculate color domain
   * and scale function base on color scale type
   */


  EnhancedGridLayer.prototype.getColorValueDomain = function getColorValueDomain() {
    (0, _utils.getColorValueDomain)(this);
  };

  EnhancedGridLayer.prototype.getColorScale = function getColorScale() {
    (0, _utils.getColorScaleFunction)(this);
  };

  /*
   * override default getSubLayerClass to return customized cellLayer
   */


  EnhancedGridLayer.prototype.getSubLayerClass = function getSubLayerClass() {
    return _enhancedGridCellLayer2.default;
  };

  return EnhancedGridLayer;
}(_deck.GridLayer);

exports.default = EnhancedGridLayer;


EnhancedGridLayer.layerName = 'EnhancedGridLayer';
EnhancedGridLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2dyaWQtbGF5ZXIvZW5oYW5jZWQtZ3JpZC1sYXllci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UHJvcHMiLCJjb2xvclNjYWxlIiwiRW5oYW5jZWRHcmlkTGF5ZXIiLCJnZXREaW1lbnNpb25VcGRhdGVycyIsImRpbWVuc2lvblVwZGF0ZXJzIiwiZ2V0Q29sb3IiLCJ0cmlnZ2VycyIsInB1c2giLCJnZXRDb2xvclZhbHVlRG9tYWluIiwiZ2V0Q29sb3JTY2FsZSIsImdldFN1YkxheWVyQ2xhc3MiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBSUE7Ozs7OztBQUVBLElBQU1BLDBDQUNELGdCQUFVQSxZQURUO0FBRUpDLGNBQVk7QUFGUixFQUFOOztJQUtxQkMsaUI7Ozs7Ozs7OzhCQUVuQkMsb0IsbUNBQXVCOztBQUVyQixRQUFNQyxvQkFBb0IscUJBQU1ELG9CQUFOLFdBQTFCO0FBQ0E7QUFDQUMsc0JBQWtCQyxRQUFsQixDQUEyQixDQUEzQixFQUE4QkMsUUFBOUIsQ0FBdUNDLElBQXZDLENBQTRDLFlBQTVDO0FBQ0EsV0FBT0gsaUJBQVA7QUFDRCxHOztBQUVEOzs7Ozs7OEJBSUFJLG1CLGtDQUFzQjtBQUNwQixvQ0FBb0IsSUFBcEI7QUFDRCxHOzs4QkFFREMsYSw0QkFBZ0I7QUFDZCxzQ0FBc0IsSUFBdEI7QUFDRCxHOztBQUVEOzs7Ozs4QkFHQUMsZ0IsK0JBQW1CO0FBQ2pCO0FBQ0QsRzs7Ozs7a0JBM0JrQlIsaUI7OztBQThCckJBLGtCQUFrQlMsU0FBbEIsR0FBOEIsbUJBQTlCO0FBQ0FULGtCQUFrQkYsWUFBbEIsR0FBaUNBLFlBQWpDIiwiZmlsZSI6ImVuaGFuY2VkLWdyaWQtbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0dyaWRMYXllcn0gZnJvbSAnZGVjay5nbCc7XG5pbXBvcnQge1xuICBnZXRDb2xvclZhbHVlRG9tYWluLFxuICBnZXRDb2xvclNjYWxlRnVuY3Rpb25cbn0gZnJvbSAnLi4vbGF5ZXItdXRpbHMvdXRpbHMnO1xuaW1wb3J0IEVuaGFuY2VkR3JpZENlbGxMYXllciBmcm9tICcuL2VuaGFuY2VkLWdyaWQtY2VsbC1sYXllcic7XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgLi4uR3JpZExheWVyLmRlZmF1bHRQcm9wcyxcbiAgY29sb3JTY2FsZTogJ3F1YW50aWxlJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW5oYW5jZWRHcmlkTGF5ZXIgZXh0ZW5kcyBHcmlkTGF5ZXIge1xuXG4gIGdldERpbWVuc2lvblVwZGF0ZXJzKCkge1xuXG4gICAgY29uc3QgZGltZW5zaW9uVXBkYXRlcnMgPSBzdXBlci5nZXREaW1lbnNpb25VcGRhdGVycygpO1xuICAgIC8vIGFkZCBjb2xvclNjYWxlIHRvIGRpbWVuc2lvbiB1cGRhdGVzXG4gICAgZGltZW5zaW9uVXBkYXRlcnMuZ2V0Q29sb3JbMV0udHJpZ2dlcnMucHVzaCgnY29sb3JTY2FsZScpO1xuICAgIHJldHVybiBkaW1lbnNpb25VcGRhdGVycztcbiAgfVxuXG4gIC8qXG4gICAqIG92ZXJyaWRlIGRlZmF1bHQgbGF5ZXIgbWV0aG9kIHRvIGNhbGN1bGF0ZSBjb2xvciBkb21haW5cbiAgICogYW5kIHNjYWxlIGZ1bmN0aW9uIGJhc2Ugb24gY29sb3Igc2NhbGUgdHlwZVxuICAgKi9cbiAgZ2V0Q29sb3JWYWx1ZURvbWFpbigpIHtcbiAgICBnZXRDb2xvclZhbHVlRG9tYWluKHRoaXMpO1xuICB9XG5cbiAgZ2V0Q29sb3JTY2FsZSgpIHtcbiAgICBnZXRDb2xvclNjYWxlRnVuY3Rpb24odGhpcyk7XG4gIH1cblxuICAvKlxuICAgKiBvdmVycmlkZSBkZWZhdWx0IGdldFN1YkxheWVyQ2xhc3MgdG8gcmV0dXJuIGN1c3RvbWl6ZWQgY2VsbExheWVyXG4gICAqL1xuICBnZXRTdWJMYXllckNsYXNzKCkge1xuICAgIHJldHVybiBFbmhhbmNlZEdyaWRDZWxsTGF5ZXI7XG4gIH1cbn1cblxuRW5oYW5jZWRHcmlkTGF5ZXIubGF5ZXJOYW1lID0gJ0VuaGFuY2VkR3JpZExheWVyJztcbkVuaGFuY2VkR3JpZExheWVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==