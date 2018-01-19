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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2dyaWQtbGF5ZXIvZW5oYW5jZWQtZ3JpZC1sYXllci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UHJvcHMiLCJjb2xvclNjYWxlIiwiRW5oYW5jZWRHcmlkTGF5ZXIiLCJnZXREaW1lbnNpb25VcGRhdGVycyIsImRpbWVuc2lvblVwZGF0ZXJzIiwiZ2V0Q29sb3IiLCJ0cmlnZ2VycyIsInB1c2giLCJnZXRDb2xvclZhbHVlRG9tYWluIiwiZ2V0Q29sb3JTY2FsZSIsImdldFN1YkxheWVyQ2xhc3MiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLDBDQUNELGdCQUFVQSxZQURUO0FBRUpDLGNBQVk7QUFGUixFQUFOOztJQUtxQkMsaUI7Ozs7Ozs7OzhCQUNuQkMsb0IsbUNBQXVCO0FBQ3JCLFFBQU1DLG9CQUFvQixxQkFBTUQsb0JBQU4sV0FBMUI7QUFDQTtBQUNBQyxzQkFBa0JDLFFBQWxCLENBQTJCLENBQTNCLEVBQThCQyxRQUE5QixDQUF1Q0MsSUFBdkMsQ0FBNEMsWUFBNUM7QUFDQSxXQUFPSCxpQkFBUDtBQUNELEc7O0FBRUQ7Ozs7Ozs4QkFJQUksbUIsa0NBQXNCO0FBQ3BCLG9DQUFvQixJQUFwQjtBQUNELEc7OzhCQUVEQyxhLDRCQUFnQjtBQUNkLHNDQUFzQixJQUF0QjtBQUNELEc7O0FBRUQ7Ozs7OzhCQUdBQyxnQiwrQkFBbUI7QUFDakI7QUFDRCxHOzs7OztrQkF6QmtCUixpQjs7O0FBNEJyQkEsa0JBQWtCUyxTQUFsQixHQUE4QixtQkFBOUI7QUFDQVQsa0JBQWtCRixZQUFsQixHQUFpQ0EsWUFBakMiLCJmaWxlIjoiZW5oYW5jZWQtZ3JpZC1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7R3JpZExheWVyfSBmcm9tICdkZWNrLmdsJztcbmltcG9ydCB7Z2V0Q29sb3JWYWx1ZURvbWFpbiwgZ2V0Q29sb3JTY2FsZUZ1bmN0aW9ufSBmcm9tICcuLi9sYXllci11dGlscy91dGlscyc7XG5pbXBvcnQgRW5oYW5jZWRHcmlkQ2VsbExheWVyIGZyb20gJy4vZW5oYW5jZWQtZ3JpZC1jZWxsLWxheWVyJztcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAuLi5HcmlkTGF5ZXIuZGVmYXVsdFByb3BzLFxuICBjb2xvclNjYWxlOiAncXVhbnRpbGUnXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbmhhbmNlZEdyaWRMYXllciBleHRlbmRzIEdyaWRMYXllciB7XG4gIGdldERpbWVuc2lvblVwZGF0ZXJzKCkge1xuICAgIGNvbnN0IGRpbWVuc2lvblVwZGF0ZXJzID0gc3VwZXIuZ2V0RGltZW5zaW9uVXBkYXRlcnMoKTtcbiAgICAvLyBhZGQgY29sb3JTY2FsZSB0byBkaW1lbnNpb24gdXBkYXRlc1xuICAgIGRpbWVuc2lvblVwZGF0ZXJzLmdldENvbG9yWzFdLnRyaWdnZXJzLnB1c2goJ2NvbG9yU2NhbGUnKTtcbiAgICByZXR1cm4gZGltZW5zaW9uVXBkYXRlcnM7XG4gIH1cblxuICAvKlxuICAgKiBvdmVycmlkZSBkZWZhdWx0IGxheWVyIG1ldGhvZCB0byBjYWxjdWxhdGUgY29sb3IgZG9tYWluXG4gICAqIGFuZCBzY2FsZSBmdW5jdGlvbiBiYXNlIG9uIGNvbG9yIHNjYWxlIHR5cGVcbiAgICovXG4gIGdldENvbG9yVmFsdWVEb21haW4oKSB7XG4gICAgZ2V0Q29sb3JWYWx1ZURvbWFpbih0aGlzKTtcbiAgfVxuXG4gIGdldENvbG9yU2NhbGUoKSB7XG4gICAgZ2V0Q29sb3JTY2FsZUZ1bmN0aW9uKHRoaXMpO1xuICB9XG5cbiAgLypcbiAgICogb3ZlcnJpZGUgZGVmYXVsdCBnZXRTdWJMYXllckNsYXNzIHRvIHJldHVybiBjdXN0b21pemVkIGNlbGxMYXllclxuICAgKi9cbiAgZ2V0U3ViTGF5ZXJDbGFzcygpIHtcbiAgICByZXR1cm4gRW5oYW5jZWRHcmlkQ2VsbExheWVyO1xuICB9XG59XG5cbkVuaGFuY2VkR3JpZExheWVyLmxheWVyTmFtZSA9ICdFbmhhbmNlZEdyaWRMYXllcic7XG5FbmhhbmNlZEdyaWRMYXllci5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG4iXX0=