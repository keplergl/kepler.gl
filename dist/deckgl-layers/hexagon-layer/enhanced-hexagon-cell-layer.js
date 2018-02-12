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

var EnhancedHexagonCellLayer = function (_HexagonCellLayer) {
  (0, _inherits3.default)(EnhancedHexagonCellLayer, _HexagonCellLayer);

  function EnhancedHexagonCellLayer() {
    (0, _classCallCheck3.default)(this, EnhancedHexagonCellLayer);
    return (0, _possibleConstructorReturn3.default)(this, (EnhancedHexagonCellLayer.__proto__ || Object.getPrototypeOf(EnhancedHexagonCellLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(EnhancedHexagonCellLayer, [{
    key: 'getShaders',
    value: function getShaders() {
      var shaders = (0, _get3.default)(EnhancedHexagonCellLayer.prototype.__proto__ || Object.getPrototypeOf(EnhancedHexagonCellLayer.prototype), 'getShaders', this).call(this);
      var vs = (0, _getCellLayerVertext.getCellLayerVertex)(shaders.vs, { highlightPicked: true });
      return (0, _extends3.default)({}, shaders, { vs: vs });
    }
  }]);
  return EnhancedHexagonCellLayer;
}(_deck.HexagonCellLayer);

exports.default = EnhancedHexagonCellLayer;


EnhancedHexagonCellLayer.layerName = 'EnhancedHexagonCellLayer';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2hleGFnb24tbGF5ZXIvZW5oYW5jZWQtaGV4YWdvbi1jZWxsLWxheWVyLmpzIl0sIm5hbWVzIjpbIkVuaGFuY2VkSGV4YWdvbkNlbGxMYXllciIsInNoYWRlcnMiLCJ2cyIsImhpZ2hsaWdodFBpY2tlZCIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0lBRXFCQSx3Qjs7Ozs7Ozs7OztpQ0FDTjtBQUNYLFVBQU1DLHNLQUFOO0FBQ0EsVUFBTUMsS0FBSyw2Q0FBbUJELFFBQVFDLEVBQTNCLEVBQStCLEVBQUNDLGlCQUFpQixJQUFsQixFQUEvQixDQUFYO0FBQ0Esd0NBQVdGLE9BQVgsSUFBb0JDLE1BQXBCO0FBQ0Q7Ozs7O2tCQUxrQkYsd0I7OztBQVFyQkEseUJBQXlCSSxTQUF6QixHQUFxQywwQkFBckMiLCJmaWxlIjoiZW5oYW5jZWQtaGV4YWdvbi1jZWxsLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtIZXhhZ29uQ2VsbExheWVyfSBmcm9tICdkZWNrLmdsJztcbmltcG9ydCB7Z2V0Q2VsbExheWVyVmVydGV4fSBmcm9tICcuLi9sYXllci11dGlscy9nZXQtY2VsbC1sYXllci12ZXJ0ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW5oYW5jZWRIZXhhZ29uQ2VsbExheWVyIGV4dGVuZHMgSGV4YWdvbkNlbGxMYXllciB7XG4gIGdldFNoYWRlcnMoKSB7XG4gICAgY29uc3Qgc2hhZGVycyA9IHN1cGVyLmdldFNoYWRlcnMoKTtcbiAgICBjb25zdCB2cyA9IGdldENlbGxMYXllclZlcnRleChzaGFkZXJzLnZzLCB7aGlnaGxpZ2h0UGlja2VkOiB0cnVlfSk7XG4gICAgcmV0dXJuIHsuLi5zaGFkZXJzLCB2c307XG4gIH1cbn1cblxuRW5oYW5jZWRIZXhhZ29uQ2VsbExheWVyLmxheWVyTmFtZSA9ICdFbmhhbmNlZEhleGFnb25DZWxsTGF5ZXInO1xuIl19