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
    return (0, _possibleConstructorReturn3.default)(this, (EnhancedGridLayer.__proto__ || Object.getPrototypeOf(EnhancedGridLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(EnhancedGridLayer, [{
    key: 'getDimensionUpdaters',
    value: function getDimensionUpdaters() {
      var dimensionUpdaters = (0, _get3.default)(EnhancedGridLayer.prototype.__proto__ || Object.getPrototypeOf(EnhancedGridLayer.prototype), 'getDimensionUpdaters', this).call(this);
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
      return _enhancedGridCellLayer2.default;
    }
  }]);
  return EnhancedGridLayer;
}(_deck.GridLayer);

exports.default = EnhancedGridLayer;


EnhancedGridLayer.layerName = 'EnhancedGridLayer';
EnhancedGridLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2dyaWQtbGF5ZXIvZW5oYW5jZWQtZ3JpZC1sYXllci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UHJvcHMiLCJjb2xvclNjYWxlIiwiRW5oYW5jZWRHcmlkTGF5ZXIiLCJkaW1lbnNpb25VcGRhdGVycyIsImdldENvbG9yIiwidHJpZ2dlcnMiLCJwdXNoIiwibGF5ZXJOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLDBDQUNELGdCQUFVQSxZQURUO0FBRUpDLGNBQVk7QUFGUixFQUFOOztJQUtxQkMsaUI7Ozs7Ozs7Ozs7MkNBQ0k7QUFDckIsVUFBTUMsNEtBQU47QUFDQTtBQUNBQSx3QkFBa0JDLFFBQWxCLENBQTJCLENBQTNCLEVBQThCQyxRQUE5QixDQUF1Q0MsSUFBdkMsQ0FBNEMsWUFBNUM7QUFDQSxhQUFPSCxpQkFBUDtBQUNEOztBQUVEOzs7Ozs7OzBDQUlzQjtBQUNwQixzQ0FBb0IsSUFBcEI7QUFDRDs7O29DQUVlO0FBQ2Qsd0NBQXNCLElBQXRCO0FBQ0Q7O0FBRUQ7Ozs7Ozt1Q0FHbUI7QUFDakI7QUFDRDs7Ozs7a0JBekJrQkQsaUI7OztBQTRCckJBLGtCQUFrQkssU0FBbEIsR0FBOEIsbUJBQTlCO0FBQ0FMLGtCQUFrQkYsWUFBbEIsR0FBaUNBLFlBQWpDIiwiZmlsZSI6ImVuaGFuY2VkLWdyaWQtbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0dyaWRMYXllcn0gZnJvbSAnZGVjay5nbCc7XG5pbXBvcnQge2dldENvbG9yVmFsdWVEb21haW4sIGdldENvbG9yU2NhbGVGdW5jdGlvbn0gZnJvbSAnLi4vbGF5ZXItdXRpbHMvdXRpbHMnO1xuaW1wb3J0IEVuaGFuY2VkR3JpZENlbGxMYXllciBmcm9tICcuL2VuaGFuY2VkLWdyaWQtY2VsbC1sYXllcic7XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgLi4uR3JpZExheWVyLmRlZmF1bHRQcm9wcyxcbiAgY29sb3JTY2FsZTogJ3F1YW50aWxlJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW5oYW5jZWRHcmlkTGF5ZXIgZXh0ZW5kcyBHcmlkTGF5ZXIge1xuICBnZXREaW1lbnNpb25VcGRhdGVycygpIHtcbiAgICBjb25zdCBkaW1lbnNpb25VcGRhdGVycyA9IHN1cGVyLmdldERpbWVuc2lvblVwZGF0ZXJzKCk7XG4gICAgLy8gYWRkIGNvbG9yU2NhbGUgdG8gZGltZW5zaW9uIHVwZGF0ZXNcbiAgICBkaW1lbnNpb25VcGRhdGVycy5nZXRDb2xvclsxXS50cmlnZ2Vycy5wdXNoKCdjb2xvclNjYWxlJyk7XG4gICAgcmV0dXJuIGRpbWVuc2lvblVwZGF0ZXJzO1xuICB9XG5cbiAgLypcbiAgICogb3ZlcnJpZGUgZGVmYXVsdCBsYXllciBtZXRob2QgdG8gY2FsY3VsYXRlIGNvbG9yIGRvbWFpblxuICAgKiBhbmQgc2NhbGUgZnVuY3Rpb24gYmFzZSBvbiBjb2xvciBzY2FsZSB0eXBlXG4gICAqL1xuICBnZXRDb2xvclZhbHVlRG9tYWluKCkge1xuICAgIGdldENvbG9yVmFsdWVEb21haW4odGhpcyk7XG4gIH1cblxuICBnZXRDb2xvclNjYWxlKCkge1xuICAgIGdldENvbG9yU2NhbGVGdW5jdGlvbih0aGlzKTtcbiAgfVxuXG4gIC8qXG4gICAqIG92ZXJyaWRlIGRlZmF1bHQgZ2V0U3ViTGF5ZXJDbGFzcyB0byByZXR1cm4gY3VzdG9taXplZCBjZWxsTGF5ZXJcbiAgICovXG4gIGdldFN1YkxheWVyQ2xhc3MoKSB7XG4gICAgcmV0dXJuIEVuaGFuY2VkR3JpZENlbGxMYXllcjtcbiAgfVxufVxuXG5FbmhhbmNlZEdyaWRMYXllci5sYXllck5hbWUgPSAnRW5oYW5jZWRHcmlkTGF5ZXInO1xuRW5oYW5jZWRHcmlkTGF5ZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19