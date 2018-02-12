'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _deck = require('deck.gl');

var _getCellLayerVertext = require('../layer-utils/get-cell-layer-vertext');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EnhancedGridCellLayer = function (_GridCellLayer) {
  (0, _inherits3.default)(EnhancedGridCellLayer, _GridCellLayer);

  function EnhancedGridCellLayer() {
    (0, _classCallCheck3.default)(this, EnhancedGridCellLayer);
    return (0, _possibleConstructorReturn3.default)(this, (EnhancedGridCellLayer.__proto__ || Object.getPrototypeOf(EnhancedGridCellLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(EnhancedGridCellLayer, [{
    key: 'getShaders',
    value: function getShaders() {
      var shaders = (0, _get3.default)(EnhancedGridCellLayer.prototype.__proto__ || Object.getPrototypeOf(EnhancedGridCellLayer.prototype), 'getShaders', this).call(this);
      var vs = (0, _getCellLayerVertext.getCellLayerVertex)(shaders.vs, { highlightPicked: true });
      return (0, _extends3.default)({}, shaders, { vs: vs });
    }
  }]);
  return EnhancedGridCellLayer;
}(_deck.GridCellLayer);

exports.default = EnhancedGridCellLayer;


EnhancedGridCellLayer.layerName = 'EnhancedGridCellLayer';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2dyaWQtbGF5ZXIvZW5oYW5jZWQtZ3JpZC1jZWxsLWxheWVyLmpzIl0sIm5hbWVzIjpbIkVuaGFuY2VkR3JpZENlbGxMYXllciIsInNoYWRlcnMiLCJ2cyIsImhpZ2hsaWdodFBpY2tlZCIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0lBRXFCQSxxQjs7Ozs7Ozs7OztpQ0FDTjtBQUNYLFVBQU1DLGdLQUFOO0FBQ0EsVUFBTUMsS0FBSyw2Q0FBbUJELFFBQVFDLEVBQTNCLEVBQStCLEVBQUNDLGlCQUFpQixJQUFsQixFQUEvQixDQUFYO0FBQ0Esd0NBQVdGLE9BQVgsSUFBb0JDLE1BQXBCO0FBQ0Q7Ozs7O2tCQUxrQkYscUI7OztBQVFyQkEsc0JBQXNCSSxTQUF0QixHQUFrQyx1QkFBbEMiLCJmaWxlIjoiZW5oYW5jZWQtZ3JpZC1jZWxsLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtHcmlkQ2VsbExheWVyfSBmcm9tICdkZWNrLmdsJztcbmltcG9ydCB7Z2V0Q2VsbExheWVyVmVydGV4fSBmcm9tICcuLi9sYXllci11dGlscy9nZXQtY2VsbC1sYXllci12ZXJ0ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW5oYW5jZWRHcmlkQ2VsbExheWVyIGV4dGVuZHMgR3JpZENlbGxMYXllciB7XG4gIGdldFNoYWRlcnMoKSB7XG4gICAgY29uc3Qgc2hhZGVycyA9IHN1cGVyLmdldFNoYWRlcnMoKTtcbiAgICBjb25zdCB2cyA9IGdldENlbGxMYXllclZlcnRleChzaGFkZXJzLnZzLCB7aGlnaGxpZ2h0UGlja2VkOiB0cnVlfSk7XG4gICAgcmV0dXJuIHsuLi5zaGFkZXJzLCB2c307XG4gIH1cbn1cblxuRW5oYW5jZWRHcmlkQ2VsbExheWVyLmxheWVyTmFtZSA9ICdFbmhhbmNlZEdyaWRDZWxsTGF5ZXInO1xuIl19