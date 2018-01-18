'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _deck = require('deck.gl');

var _getCellLayerVertext = require('../layer-utils/get-cell-layer-vertext');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EnhancedGridCellLayer = function (_GridCellLayer) {
  (0, _inherits3.default)(EnhancedGridCellLayer, _GridCellLayer);

  function EnhancedGridCellLayer() {
    (0, _classCallCheck3.default)(this, EnhancedGridCellLayer);
    return (0, _possibleConstructorReturn3.default)(this, _GridCellLayer.apply(this, arguments));
  }

  EnhancedGridCellLayer.prototype.getShaders = function getShaders() {
    var shaders = _GridCellLayer.prototype.getShaders.call(this);
    var vs = (0, _getCellLayerVertext.getCellLayerVertex)(shaders.vs, { highlightPicked: true });
    return (0, _extends3.default)({}, shaders, { vs: vs });
  };

  return EnhancedGridCellLayer;
}(_deck.GridCellLayer);

exports.default = EnhancedGridCellLayer;


EnhancedGridCellLayer.layerName = 'EnhancedGridCellLayer';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL2dyaWQtbGF5ZXIvZW5oYW5jZWQtZ3JpZC1jZWxsLWxheWVyLmpzIl0sIm5hbWVzIjpbIkVuaGFuY2VkR3JpZENlbGxMYXllciIsImdldFNoYWRlcnMiLCJzaGFkZXJzIiwidnMiLCJoaWdobGlnaHRQaWNrZWQiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7SUFFcUJBLHFCOzs7Ozs7OztrQ0FDbkJDLFUseUJBQWE7QUFDWCxRQUFNQyxVQUFVLHlCQUFNRCxVQUFOLFdBQWhCO0FBQ0EsUUFBTUUsS0FBSyw2Q0FBbUJELFFBQVFDLEVBQTNCLEVBQStCLEVBQUNDLGlCQUFpQixJQUFsQixFQUEvQixDQUFYO0FBQ0Esc0NBQVdGLE9BQVgsSUFBb0JDLE1BQXBCO0FBQ0QsRzs7Ozs7a0JBTGtCSCxxQjs7O0FBUXJCQSxzQkFBc0JLLFNBQXRCLEdBQWtDLHVCQUFsQyIsImZpbGUiOiJlbmhhbmNlZC1ncmlkLWNlbGwtbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0dyaWRDZWxsTGF5ZXJ9IGZyb20gJ2RlY2suZ2wnO1xuaW1wb3J0IHtnZXRDZWxsTGF5ZXJWZXJ0ZXh9IGZyb20gJy4uL2xheWVyLXV0aWxzL2dldC1jZWxsLWxheWVyLXZlcnRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbmhhbmNlZEdyaWRDZWxsTGF5ZXIgZXh0ZW5kcyBHcmlkQ2VsbExheWVyIHtcbiAgZ2V0U2hhZGVycygpIHtcbiAgICBjb25zdCBzaGFkZXJzID0gc3VwZXIuZ2V0U2hhZGVycygpO1xuICAgIGNvbnN0IHZzID0gZ2V0Q2VsbExheWVyVmVydGV4KHNoYWRlcnMudnMsIHtoaWdobGlnaHRQaWNrZWQ6IHRydWV9KTtcbiAgICByZXR1cm4gey4uLnNoYWRlcnMsIHZzfTtcbiAgfVxufVxuXG5FbmhhbmNlZEdyaWRDZWxsTGF5ZXIubGF5ZXJOYW1lID0gJ0VuaGFuY2VkR3JpZENlbGxMYXllcic7XG4iXX0=