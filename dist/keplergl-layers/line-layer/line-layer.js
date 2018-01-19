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
    return (0, _possibleConstructorReturn3.default)(this, _ArcLayer.apply(this, arguments));
  }

  LineLayer.prototype.renderLayer = function renderLayer(_ref) {
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
  };

  (0, _createClass3.default)(LineLayer, [{
    key: 'type',
    get: function get() {
      return 'line';
    }
  }]);
  return LineLayer;
}(_arcLayer2.default);

exports.default = LineLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXBsZXJnbC1sYXllcnMvbGluZS1sYXllci9saW5lLWxheWVyLmpzIl0sIm5hbWVzIjpbIkxpbmVMYXllciIsInJlbmRlckxheWVyIiwiZGF0YSIsImlkeCIsImxheWVySW50ZXJhY3Rpb24iLCJvYmplY3RIb3ZlcmVkIiwibWFwU3RhdGUiLCJpbnRlcmFjdGlvbkNvbmZpZyIsImJydXNoIiwiY29sb3JVcGRhdGVUcmlnZ2VycyIsImNvbG9yIiwiY29uZmlnIiwiY29sb3JGaWVsZCIsImNvbG9yUmFuZ2UiLCJ2aXNDb25maWciLCJjb2xvclNjYWxlIiwiZ2V0Q29sb3IiLCJnZXRTb3VyY2VDb2xvciIsImlkIiwiYnJ1c2hSYWRpdXMiLCJzaXplIiwiYnJ1c2hTb3VyY2UiLCJicnVzaFRhcmdldCIsImVuYWJsZUJydXNoaW5nIiwiZW5hYmxlZCIsImZwNjQiLCJvcGFjaXR5IiwicGlja2FibGUiLCJwaWNrZWRDb2xvciIsImhpZ2hsaWdodENvbG9yIiwic3Ryb2tlU2NhbGUiLCJ0aGlja25lc3MiLCJ1cGRhdGVUcmlnZ2VycyIsImdldFN0cm9rZVdpZHRoIiwic2l6ZUZpZWxkIiwic2l6ZVJhbmdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7SUFFcUJBLFM7Ozs7Ozs7O3NCQUtuQkMsVyw4QkFPRztBQUFBLFFBTkRDLElBTUMsUUFOREEsSUFNQztBQUFBLFFBTERDLEdBS0MsUUFMREEsR0FLQztBQUFBLFFBSkRDLGdCQUlDLFFBSkRBLGdCQUlDO0FBQUEsUUFIREMsYUFHQyxRQUhEQSxhQUdDO0FBQUEsUUFGREMsUUFFQyxRQUZEQSxRQUVDO0FBQUEsUUFEREMsaUJBQ0MsUUFEREEsaUJBQ0M7QUFBQSxRQUNNQyxLQUROLEdBQ2VELGlCQURmLENBQ01DLEtBRE47OztBQUdELFFBQU1DLHNCQUFzQjtBQUMxQkMsYUFBTyxLQUFLQyxNQUFMLENBQVlELEtBRE87QUFFMUJFLGtCQUFZLEtBQUtELE1BQUwsQ0FBWUMsVUFGRTtBQUcxQkMsa0JBQVksS0FBS0YsTUFBTCxDQUFZRyxTQUFaLENBQXNCRCxVQUhSO0FBSTFCRSxrQkFBWSxLQUFLSixNQUFMLENBQVlJO0FBSkUsS0FBNUI7O0FBT0EsV0FBTztBQUNMO0FBQ0EsdURBQ0tYLGdCQURMLEVBRUtGLElBRkw7QUFHRWMsZ0JBQVVkLEtBQUtlLGNBSGpCO0FBSUVDLFVBQUksS0FBS0EsRUFKWDtBQUtFZixjQUxGO0FBTUVnQixtQkFBYVgsTUFBTUcsTUFBTixDQUFhUyxJQUFiLEdBQW9CLElBTm5DO0FBT0VDLG1CQUFhLElBUGY7QUFRRUMsbUJBQWEsSUFSZjtBQVNFQyxzQkFBZ0JmLE1BQU1nQixPQVR4QjtBQVVFQyxZQUFNLEtBQUtkLE1BQUwsQ0FBWUcsU0FBWixDQUFzQixjQUF0QixDQVZSO0FBV0VZLGVBQVMsS0FBS2YsTUFBTCxDQUFZRyxTQUFaLENBQXNCWSxPQVhqQztBQVlFQyxnQkFBVSxJQVpaO0FBYUVDLG1CQUFhLEtBQUtqQixNQUFMLENBQVlrQixjQWIzQjtBQWNFQyxtQkFBYSxLQUFLbkIsTUFBTCxDQUFZRyxTQUFaLENBQXNCaUIsU0FkckM7QUFlRUMsc0JBQWdCO0FBQ2RDLHdCQUFnQjtBQUNkQyxxQkFBVyxLQUFLdkIsTUFBTCxDQUFZdUIsU0FEVDtBQUVkQyxxQkFBVyxLQUFLeEIsTUFBTCxDQUFZRyxTQUFaLENBQXNCcUI7QUFGbkIsU0FERjtBQUtkbkIsa0JBQVVQO0FBTEk7QUFmbEIsT0FGSyxDQUFQO0FBMEJELEc7Ozs7d0JBL0NVO0FBQ1QsYUFBTyxNQUFQO0FBQ0Q7Ozs7O2tCQUhrQlQsUyIsImZpbGUiOiJsaW5lLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFyY0xheWVyIGZyb20gJy4uL2FyYy1sYXllci9hcmMtbGF5ZXInO1xuaW1wb3J0IERlY2tHTExpbmVMYXllciBmcm9tICcuLi8uLi9kZWNrZ2wtbGF5ZXJzL2xpbmUtbGF5ZXIvbGluZS1sYXllcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmVMYXllciBleHRlbmRzIEFyY0xheWVyIHtcbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICdsaW5lJztcbiAgfVxuXG4gIHJlbmRlckxheWVyKHtcbiAgICBkYXRhLFxuICAgIGlkeCxcbiAgICBsYXllckludGVyYWN0aW9uLFxuICAgIG9iamVjdEhvdmVyZWQsXG4gICAgbWFwU3RhdGUsXG4gICAgaW50ZXJhY3Rpb25Db25maWdcbiAgfSkge1xuICAgIGNvbnN0IHticnVzaH0gPSBpbnRlcmFjdGlvbkNvbmZpZztcblxuICAgIGNvbnN0IGNvbG9yVXBkYXRlVHJpZ2dlcnMgPSB7XG4gICAgICBjb2xvcjogdGhpcy5jb25maWcuY29sb3IsXG4gICAgICBjb2xvckZpZWxkOiB0aGlzLmNvbmZpZy5jb2xvckZpZWxkLFxuICAgICAgY29sb3JSYW5nZTogdGhpcy5jb25maWcudmlzQ29uZmlnLmNvbG9yUmFuZ2UsXG4gICAgICBjb2xvclNjYWxlOiB0aGlzLmNvbmZpZy5jb2xvclNjYWxlXG4gICAgfTtcblxuICAgIHJldHVybiBbXG4gICAgICAvLyBiYXNlIGxheWVyXG4gICAgICBuZXcgRGVja0dMTGluZUxheWVyKHtcbiAgICAgICAgLi4ubGF5ZXJJbnRlcmFjdGlvbixcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgZ2V0Q29sb3I6IGRhdGEuZ2V0U291cmNlQ29sb3IsXG4gICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICBpZHgsXG4gICAgICAgIGJydXNoUmFkaXVzOiBicnVzaC5jb25maWcuc2l6ZSAqIDEwMDAsXG4gICAgICAgIGJydXNoU291cmNlOiB0cnVlLFxuICAgICAgICBicnVzaFRhcmdldDogdHJ1ZSxcbiAgICAgICAgZW5hYmxlQnJ1c2hpbmc6IGJydXNoLmVuYWJsZWQsXG4gICAgICAgIGZwNjQ6IHRoaXMuY29uZmlnLnZpc0NvbmZpZ1snaGktcHJlY2lzaW9uJ10sXG4gICAgICAgIG9wYWNpdHk6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5vcGFjaXR5LFxuICAgICAgICBwaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgcGlja2VkQ29sb3I6IHRoaXMuY29uZmlnLmhpZ2hsaWdodENvbG9yLFxuICAgICAgICBzdHJva2VTY2FsZTogdGhpcy5jb25maWcudmlzQ29uZmlnLnRoaWNrbmVzcyxcbiAgICAgICAgdXBkYXRlVHJpZ2dlcnM6IHtcbiAgICAgICAgICBnZXRTdHJva2VXaWR0aDoge1xuICAgICAgICAgICAgc2l6ZUZpZWxkOiB0aGlzLmNvbmZpZy5zaXplRmllbGQsXG4gICAgICAgICAgICBzaXplUmFuZ2U6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5zaXplUmFuZ2VcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldENvbG9yOiBjb2xvclVwZGF0ZVRyaWdnZXJzXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgXTtcbiAgfVxufVxuIl19