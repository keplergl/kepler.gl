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

var _scatterplotIconLayer = require('./scatterplot-icon-layer');

var _scatterplotIconLayer2 = _interopRequireDefault(_scatterplotIconLayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// default icon geometry is a square
var DEFAULT_ICON_GEOMETRY = [1, 1, 0, 1, -1, 0, -1, -1, 0, -1, -1, 0, -1, 1, 0, 1, 1, 0];
var defaultProps = {
  getIconGeometry: function getIconGeometry(iconId) {
    return DEFAULT_ICON_GEOMETRY;
  },
  getIcon: function getIcon(d) {
    return d.icon;
  }
};

var SvgIconLayer = function (_CompositeLayer) {
  (0, _inherits3.default)(SvgIconLayer, _CompositeLayer);

  function SvgIconLayer() {
    (0, _classCallCheck3.default)(this, SvgIconLayer);
    return (0, _possibleConstructorReturn3.default)(this, _CompositeLayer.apply(this, arguments));
  }

  // Must be defined
  SvgIconLayer.prototype.initializeState = function initializeState() {
    this.state = {
      data: {}
    };
  };

  SvgIconLayer.prototype.updateState = function updateState(_ref) {
    var changeFlags = _ref.changeFlags;

    if (changeFlags.dataChanged) {
      this._extractSublayers();
    }
  };

  SvgIconLayer.prototype._extractSublayers = function _extractSublayers() {
    var _props = this.props,
        data = _props.data,
        getIconGeometry = _props.getIconGeometry,
        getIcon = _props.getIcon;


    var iconLayers = data.reduce(function (accu, d) {
      var iconId = getIcon(d);

      if (iconId in accu) {
        accu[iconId].data.push(d);
      } else {
        var geometry = getIconGeometry(iconId) || DEFAULT_ICON_GEOMETRY;
        accu[iconId] = {
          id: iconId,
          geometry: geometry,
          data: [d]
        };
      }

      return accu;
    }, {});

    this.setState({
      data: Object.values(iconLayers)
    });
  };

  SvgIconLayer.prototype.renderLayers = function renderLayers() {
    var _this2 = this;

    var layerId = this.props.id;

    var layers = this.state.data && this.state.data.length && this.state.data.map(function (_ref2) {
      var id = _ref2.id,
          data = _ref2.data,
          geometry = _ref2.geometry;
      return new _scatterplotIconLayer2.default((0, _extends3.default)({}, _this2.props, {
        id: layerId + '-' + id,
        data: data,
        iconGeometry: geometry
      }));
    });

    return layers && layers.length > 0 ? layers : null;
  };

  return SvgIconLayer;
}(_deck.CompositeLayer);

exports.default = SvgIconLayer;


SvgIconLayer.layerName = 'SvgIconLayer';
SvgIconLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL3N2Zy1pY29uLWxheWVyL3N2Zy1pY29uLWxheWVyLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfSUNPTl9HRU9NRVRSWSIsImRlZmF1bHRQcm9wcyIsImdldEljb25HZW9tZXRyeSIsImdldEljb24iLCJkIiwiaWNvbiIsIlN2Z0ljb25MYXllciIsImluaXRpYWxpemVTdGF0ZSIsInN0YXRlIiwiZGF0YSIsInVwZGF0ZVN0YXRlIiwiY2hhbmdlRmxhZ3MiLCJkYXRhQ2hhbmdlZCIsIl9leHRyYWN0U3VibGF5ZXJzIiwicHJvcHMiLCJpY29uTGF5ZXJzIiwicmVkdWNlIiwiYWNjdSIsImljb25JZCIsInB1c2giLCJnZW9tZXRyeSIsImlkIiwic2V0U3RhdGUiLCJPYmplY3QiLCJ2YWx1ZXMiLCJyZW5kZXJMYXllcnMiLCJsYXllcklkIiwibGF5ZXJzIiwibGVuZ3RoIiwibWFwIiwiaWNvbkdlb21ldHJ5IiwibGF5ZXJOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7QUFFQTtBQUNBLElBQU1BLHdCQUF3QixDQUM1QixDQUQ0QixFQUU1QixDQUY0QixFQUc1QixDQUg0QixFQUk1QixDQUo0QixFQUs1QixDQUFDLENBTDJCLEVBTTVCLENBTjRCLEVBTzVCLENBQUMsQ0FQMkIsRUFRNUIsQ0FBQyxDQVIyQixFQVM1QixDQVQ0QixFQVU1QixDQUFDLENBVjJCLEVBVzVCLENBQUMsQ0FYMkIsRUFZNUIsQ0FaNEIsRUFhNUIsQ0FBQyxDQWIyQixFQWM1QixDQWQ0QixFQWU1QixDQWY0QixFQWdCNUIsQ0FoQjRCLEVBaUI1QixDQWpCNEIsRUFrQjVCLENBbEI0QixDQUE5QjtBQW9CQSxJQUFNQyxlQUFlO0FBQ25CQyxtQkFBaUI7QUFBQSxXQUFVRixxQkFBVjtBQUFBLEdBREU7QUFFbkJHLFdBQVM7QUFBQSxXQUFLQyxFQUFFQyxJQUFQO0FBQUE7QUFGVSxDQUFyQjs7SUFLcUJDLFk7Ozs7Ozs7O0FBQ25CO3lCQUNBQyxlLDhCQUFrQjtBQUNoQixTQUFLQyxLQUFMLEdBQWE7QUFDWEMsWUFBTTtBQURLLEtBQWI7QUFHRCxHOzt5QkFFREMsVyw4QkFBMkI7QUFBQSxRQUFkQyxXQUFjLFFBQWRBLFdBQWM7O0FBQ3pCLFFBQUlBLFlBQVlDLFdBQWhCLEVBQTZCO0FBQzNCLFdBQUtDLGlCQUFMO0FBQ0Q7QUFDRixHOzt5QkFFREEsaUIsZ0NBQW9CO0FBQUEsaUJBQ3VCLEtBQUtDLEtBRDVCO0FBQUEsUUFDWEwsSUFEVyxVQUNYQSxJQURXO0FBQUEsUUFDTFAsZUFESyxVQUNMQSxlQURLO0FBQUEsUUFDWUMsT0FEWixVQUNZQSxPQURaOzs7QUFHbEIsUUFBTVksYUFBYU4sS0FBS08sTUFBTCxDQUFZLFVBQUNDLElBQUQsRUFBT2IsQ0FBUCxFQUFhO0FBQzFDLFVBQU1jLFNBQVNmLFFBQVFDLENBQVIsQ0FBZjs7QUFFQSxVQUFJYyxVQUFVRCxJQUFkLEVBQW9CO0FBQ2xCQSxhQUFLQyxNQUFMLEVBQWFULElBQWIsQ0FBa0JVLElBQWxCLENBQXVCZixDQUF2QjtBQUNELE9BRkQsTUFFTztBQUNMLFlBQU1nQixXQUFXbEIsZ0JBQWdCZ0IsTUFBaEIsS0FBMkJsQixxQkFBNUM7QUFDQWlCLGFBQUtDLE1BQUwsSUFBZTtBQUNiRyxjQUFJSCxNQURTO0FBRWJFLDRCQUZhO0FBR2JYLGdCQUFNLENBQUNMLENBQUQ7QUFITyxTQUFmO0FBS0Q7O0FBRUQsYUFBT2EsSUFBUDtBQUNELEtBZmtCLEVBZWhCLEVBZmdCLENBQW5COztBQWlCQSxTQUFLSyxRQUFMLENBQWM7QUFDWmIsWUFBTWMsT0FBT0MsTUFBUCxDQUFjVCxVQUFkO0FBRE0sS0FBZDtBQUdELEc7O3lCQUVEVSxZLDJCQUFlO0FBQUE7O0FBQ2IsUUFBTUMsVUFBVSxLQUFLWixLQUFMLENBQVdPLEVBQTNCOztBQUVBLFFBQU1NLFNBQ0osS0FBS25CLEtBQUwsQ0FBV0MsSUFBWCxJQUNBLEtBQUtELEtBQUwsQ0FBV0MsSUFBWCxDQUFnQm1CLE1BRGhCLElBRUEsS0FBS3BCLEtBQUwsQ0FBV0MsSUFBWCxDQUFnQm9CLEdBQWhCLENBQ0U7QUFBQSxVQUFFUixFQUFGLFNBQUVBLEVBQUY7QUFBQSxVQUFNWixJQUFOLFNBQU1BLElBQU47QUFBQSxVQUFZVyxRQUFaLFNBQVlBLFFBQVo7QUFBQSxhQUNFLDhEQUNLLE9BQUtOLEtBRFY7QUFFRU8sWUFBT0ssT0FBUCxTQUFrQkwsRUFGcEI7QUFHRVosa0JBSEY7QUFJRXFCLHNCQUFjVjtBQUpoQixTQURGO0FBQUEsS0FERixDQUhGOztBQWFBLFdBQU9PLFVBQVVBLE9BQU9DLE1BQVAsR0FBZ0IsQ0FBMUIsR0FBOEJELE1BQTlCLEdBQXVDLElBQTlDO0FBQ0QsRzs7Ozs7a0JBeERrQnJCLFk7OztBQTJEckJBLGFBQWF5QixTQUFiLEdBQXlCLGNBQXpCO0FBQ0F6QixhQUFhTCxZQUFiLEdBQTRCQSxZQUE1QiIsImZpbGUiOiJzdmctaWNvbi1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9zaXRlTGF5ZXJ9IGZyb20gJ2RlY2suZ2wnO1xuaW1wb3J0IFNjYXR0ZXJwbG90SWNvbkxheWVyIGZyb20gJy4vc2NhdHRlcnBsb3QtaWNvbi1sYXllcic7XG5cbi8vIGRlZmF1bHQgaWNvbiBnZW9tZXRyeSBpcyBhIHNxdWFyZVxuY29uc3QgREVGQVVMVF9JQ09OX0dFT01FVFJZID0gW1xuICAxLFxuICAxLFxuICAwLFxuICAxLFxuICAtMSxcbiAgMCxcbiAgLTEsXG4gIC0xLFxuICAwLFxuICAtMSxcbiAgLTEsXG4gIDAsXG4gIC0xLFxuICAxLFxuICAwLFxuICAxLFxuICAxLFxuICAwXG5dO1xuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBnZXRJY29uR2VvbWV0cnk6IGljb25JZCA9PiBERUZBVUxUX0lDT05fR0VPTUVUUlksXG4gIGdldEljb246IGQgPT4gZC5pY29uXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdmdJY29uTGF5ZXIgZXh0ZW5kcyBDb21wb3NpdGVMYXllciB7XG4gIC8vIE11c3QgYmUgZGVmaW5lZFxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGRhdGE6IHt9XG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlKHtjaGFuZ2VGbGFnc30pIHtcbiAgICBpZiAoY2hhbmdlRmxhZ3MuZGF0YUNoYW5nZWQpIHtcbiAgICAgIHRoaXMuX2V4dHJhY3RTdWJsYXllcnMoKTtcbiAgICB9XG4gIH1cblxuICBfZXh0cmFjdFN1YmxheWVycygpIHtcbiAgICBjb25zdCB7ZGF0YSwgZ2V0SWNvbkdlb21ldHJ5LCBnZXRJY29ufSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBpY29uTGF5ZXJzID0gZGF0YS5yZWR1Y2UoKGFjY3UsIGQpID0+IHtcbiAgICAgIGNvbnN0IGljb25JZCA9IGdldEljb24oZCk7XG5cbiAgICAgIGlmIChpY29uSWQgaW4gYWNjdSkge1xuICAgICAgICBhY2N1W2ljb25JZF0uZGF0YS5wdXNoKGQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZ2VvbWV0cnkgPSBnZXRJY29uR2VvbWV0cnkoaWNvbklkKSB8fCBERUZBVUxUX0lDT05fR0VPTUVUUlk7XG4gICAgICAgIGFjY3VbaWNvbklkXSA9IHtcbiAgICAgICAgICBpZDogaWNvbklkLFxuICAgICAgICAgIGdlb21ldHJ5LFxuICAgICAgICAgIGRhdGE6IFtkXVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYWNjdTtcbiAgICB9LCB7fSk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGRhdGE6IE9iamVjdC52YWx1ZXMoaWNvbkxheWVycylcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlckxheWVycygpIHtcbiAgICBjb25zdCBsYXllcklkID0gdGhpcy5wcm9wcy5pZDtcblxuICAgIGNvbnN0IGxheWVycyA9XG4gICAgICB0aGlzLnN0YXRlLmRhdGEgJiZcbiAgICAgIHRoaXMuc3RhdGUuZGF0YS5sZW5ndGggJiZcbiAgICAgIHRoaXMuc3RhdGUuZGF0YS5tYXAoXG4gICAgICAgICh7aWQsIGRhdGEsIGdlb21ldHJ5fSkgPT5cbiAgICAgICAgICBuZXcgU2NhdHRlcnBsb3RJY29uTGF5ZXIoe1xuICAgICAgICAgICAgLi4udGhpcy5wcm9wcyxcbiAgICAgICAgICAgIGlkOiBgJHtsYXllcklkfS0ke2lkfWAsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgaWNvbkdlb21ldHJ5OiBnZW9tZXRyeVxuICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgcmV0dXJuIGxheWVycyAmJiBsYXllcnMubGVuZ3RoID4gMCA/IGxheWVycyA6IG51bGw7XG4gIH1cbn1cblxuU3ZnSWNvbkxheWVyLmxheWVyTmFtZSA9ICdTdmdJY29uTGF5ZXInO1xuU3ZnSWNvbkxheWVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==