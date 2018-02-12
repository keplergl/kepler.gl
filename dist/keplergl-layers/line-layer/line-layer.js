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

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _arcLayer = require('../arc-layer/arc-layer');

var _arcLayer2 = _interopRequireDefault(_arcLayer);

var _lineLayer = require('../../deckgl-layers/line-layer/line-layer');

var _lineLayer2 = _interopRequireDefault(_lineLayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LineLayer = function (_ArcLayer) {
  (0, _inherits3.default)(LineLayer, _ArcLayer);

  function LineLayer() {
    (0, _classCallCheck3.default)(this, LineLayer);
    return (0, _possibleConstructorReturn3.default)(this, (LineLayer.__proto__ || Object.getPrototypeOf(LineLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(LineLayer, [{
    key: 'renderLayer',
    value: function renderLayer(_ref) {
      var data = _ref.data,
          idx = _ref.idx,
          layerInteraction = _ref.layerInteraction,
          objectHovered = _ref.objectHovered,
          mapState = _ref.mapState,
          interactionConfig = _ref.interactionConfig;
      var brush = interactionConfig.brush;


      var colorUpdateTriggers = {
        color: this.config.color,
        colorField: this.config.colorField,
        colorRange: this.config.visConfig.colorRange,
        colorScale: this.config.colorScale
      };

      return [
      // base layer
      new _lineLayer2.default((0, _extends3.default)({}, layerInteraction, data, {
        getColor: data.getSourceColor,
        id: this.id,
        idx: idx,
        brushRadius: brush.config.size * 1000,
        brushSource: true,
        brushTarget: true,
        enableBrushing: brush.enabled,
        fp64: this.config.visConfig['hi-precision'],
        opacity: this.config.visConfig.opacity,
        pickable: true,
        pickedColor: this.config.highlightColor,
        strokeScale: this.config.visConfig.thickness,
        updateTriggers: {
          getStrokeWidth: {
            sizeField: this.config.sizeField,
            sizeRange: this.config.visConfig.sizeRange
          },
          getColor: colorUpdateTriggers
        }
      }))];
    }
  }, {
    key: 'type',
    get: function get() {
      return 'line';
    }
  }]);
  return LineLayer;
}(_arcLayer2.default);

exports.default = LineLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvbGluZS1sYXllci9saW5lLWxheWVyLmpzIl0sIm5hbWVzIjpbIkxpbmVMYXllciIsImRhdGEiLCJpZHgiLCJsYXllckludGVyYWN0aW9uIiwib2JqZWN0SG92ZXJlZCIsIm1hcFN0YXRlIiwiaW50ZXJhY3Rpb25Db25maWciLCJicnVzaCIsImNvbG9yVXBkYXRlVHJpZ2dlcnMiLCJjb2xvciIsImNvbmZpZyIsImNvbG9yRmllbGQiLCJjb2xvclJhbmdlIiwidmlzQ29uZmlnIiwiY29sb3JTY2FsZSIsImdldENvbG9yIiwiZ2V0U291cmNlQ29sb3IiLCJpZCIsImJydXNoUmFkaXVzIiwic2l6ZSIsImJydXNoU291cmNlIiwiYnJ1c2hUYXJnZXQiLCJlbmFibGVCcnVzaGluZyIsImVuYWJsZWQiLCJmcDY0Iiwib3BhY2l0eSIsInBpY2thYmxlIiwicGlja2VkQ29sb3IiLCJoaWdobGlnaHRDb2xvciIsInN0cm9rZVNjYWxlIiwidGhpY2tuZXNzIiwidXBkYXRlVHJpZ2dlcnMiLCJnZXRTdHJva2VXaWR0aCIsInNpemVGaWVsZCIsInNpemVSYW5nZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0lBRXFCQSxTOzs7Ozs7Ozs7O3NDQVloQjtBQUFBLFVBTkRDLElBTUMsUUFOREEsSUFNQztBQUFBLFVBTERDLEdBS0MsUUFMREEsR0FLQztBQUFBLFVBSkRDLGdCQUlDLFFBSkRBLGdCQUlDO0FBQUEsVUFIREMsYUFHQyxRQUhEQSxhQUdDO0FBQUEsVUFGREMsUUFFQyxRQUZEQSxRQUVDO0FBQUEsVUFEREMsaUJBQ0MsUUFEREEsaUJBQ0M7QUFBQSxVQUNNQyxLQUROLEdBQ2VELGlCQURmLENBQ01DLEtBRE47OztBQUdELFVBQU1DLHNCQUFzQjtBQUMxQkMsZUFBTyxLQUFLQyxNQUFMLENBQVlELEtBRE87QUFFMUJFLG9CQUFZLEtBQUtELE1BQUwsQ0FBWUMsVUFGRTtBQUcxQkMsb0JBQVksS0FBS0YsTUFBTCxDQUFZRyxTQUFaLENBQXNCRCxVQUhSO0FBSTFCRSxvQkFBWSxLQUFLSixNQUFMLENBQVlJO0FBSkUsT0FBNUI7O0FBT0EsYUFBTztBQUNMO0FBQ0EseURBQ0tYLGdCQURMLEVBRUtGLElBRkw7QUFHRWMsa0JBQVVkLEtBQUtlLGNBSGpCO0FBSUVDLFlBQUksS0FBS0EsRUFKWDtBQUtFZixnQkFMRjtBQU1FZ0IscUJBQWFYLE1BQU1HLE1BQU4sQ0FBYVMsSUFBYixHQUFvQixJQU5uQztBQU9FQyxxQkFBYSxJQVBmO0FBUUVDLHFCQUFhLElBUmY7QUFTRUMsd0JBQWdCZixNQUFNZ0IsT0FUeEI7QUFVRUMsY0FBTSxLQUFLZCxNQUFMLENBQVlHLFNBQVosQ0FBc0IsY0FBdEIsQ0FWUjtBQVdFWSxpQkFBUyxLQUFLZixNQUFMLENBQVlHLFNBQVosQ0FBc0JZLE9BWGpDO0FBWUVDLGtCQUFVLElBWlo7QUFhRUMscUJBQWEsS0FBS2pCLE1BQUwsQ0FBWWtCLGNBYjNCO0FBY0VDLHFCQUFhLEtBQUtuQixNQUFMLENBQVlHLFNBQVosQ0FBc0JpQixTQWRyQztBQWVFQyx3QkFBZ0I7QUFDZEMsMEJBQWdCO0FBQ2RDLHVCQUFXLEtBQUt2QixNQUFMLENBQVl1QixTQURUO0FBRWRDLHVCQUFXLEtBQUt4QixNQUFMLENBQVlHLFNBQVosQ0FBc0JxQjtBQUZuQixXQURGO0FBS2RuQixvQkFBVVA7QUFMSTtBQWZsQixTQUZLLENBQVA7QUEwQkQ7Ozt3QkEvQ1U7QUFDVCxhQUFPLE1BQVA7QUFDRDs7Ozs7a0JBSGtCUixTIiwiZmlsZSI6ImxpbmUtbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXJjTGF5ZXIgZnJvbSAnLi4vYXJjLWxheWVyL2FyYy1sYXllcic7XG5pbXBvcnQgRGVja0dMTGluZUxheWVyIGZyb20gJy4uLy4uL2RlY2tnbC1sYXllcnMvbGluZS1sYXllci9saW5lLWxheWVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZUxheWVyIGV4dGVuZHMgQXJjTGF5ZXIge1xuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gJ2xpbmUnO1xuICB9XG5cbiAgcmVuZGVyTGF5ZXIoe1xuICAgIGRhdGEsXG4gICAgaWR4LFxuICAgIGxheWVySW50ZXJhY3Rpb24sXG4gICAgb2JqZWN0SG92ZXJlZCxcbiAgICBtYXBTdGF0ZSxcbiAgICBpbnRlcmFjdGlvbkNvbmZpZ1xuICB9KSB7XG4gICAgY29uc3Qge2JydXNofSA9IGludGVyYWN0aW9uQ29uZmlnO1xuXG4gICAgY29uc3QgY29sb3JVcGRhdGVUcmlnZ2VycyA9IHtcbiAgICAgIGNvbG9yOiB0aGlzLmNvbmZpZy5jb2xvcixcbiAgICAgIGNvbG9yRmllbGQ6IHRoaXMuY29uZmlnLmNvbG9yRmllbGQsXG4gICAgICBjb2xvclJhbmdlOiB0aGlzLmNvbmZpZy52aXNDb25maWcuY29sb3JSYW5nZSxcbiAgICAgIGNvbG9yU2NhbGU6IHRoaXMuY29uZmlnLmNvbG9yU2NhbGVcbiAgICB9O1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIC8vIGJhc2UgbGF5ZXJcbiAgICAgIG5ldyBEZWNrR0xMaW5lTGF5ZXIoe1xuICAgICAgICAuLi5sYXllckludGVyYWN0aW9uLFxuICAgICAgICAuLi5kYXRhLFxuICAgICAgICBnZXRDb2xvcjogZGF0YS5nZXRTb3VyY2VDb2xvcixcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIGlkeCxcbiAgICAgICAgYnJ1c2hSYWRpdXM6IGJydXNoLmNvbmZpZy5zaXplICogMTAwMCxcbiAgICAgICAgYnJ1c2hTb3VyY2U6IHRydWUsXG4gICAgICAgIGJydXNoVGFyZ2V0OiB0cnVlLFxuICAgICAgICBlbmFibGVCcnVzaGluZzogYnJ1c2guZW5hYmxlZCxcbiAgICAgICAgZnA2NDogdGhpcy5jb25maWcudmlzQ29uZmlnWydoaS1wcmVjaXNpb24nXSxcbiAgICAgICAgb3BhY2l0eTogdGhpcy5jb25maWcudmlzQ29uZmlnLm9wYWNpdHksXG4gICAgICAgIHBpY2thYmxlOiB0cnVlLFxuICAgICAgICBwaWNrZWRDb2xvcjogdGhpcy5jb25maWcuaGlnaGxpZ2h0Q29sb3IsXG4gICAgICAgIHN0cm9rZVNjYWxlOiB0aGlzLmNvbmZpZy52aXNDb25maWcudGhpY2tuZXNzLFxuICAgICAgICB1cGRhdGVUcmlnZ2Vyczoge1xuICAgICAgICAgIGdldFN0cm9rZVdpZHRoOiB7XG4gICAgICAgICAgICBzaXplRmllbGQ6IHRoaXMuY29uZmlnLnNpemVGaWVsZCxcbiAgICAgICAgICAgIHNpemVSYW5nZTogdGhpcy5jb25maWcudmlzQ29uZmlnLnNpemVSYW5nZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0Q29sb3I6IGNvbG9yVXBkYXRlVHJpZ2dlcnNcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICBdO1xuICB9XG59XG4iXX0=