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
    return (0, _possibleConstructorReturn3.default)(this, (SvgIconLayer.__proto__ || Object.getPrototypeOf(SvgIconLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(SvgIconLayer, [{
    key: 'initializeState',

    // Must be defined
    value: function initializeState() {
      this.state = {
        data: {}
      };
    }
  }, {
    key: 'updateState',
    value: function updateState(_ref) {
      var changeFlags = _ref.changeFlags;

      if (changeFlags.dataChanged) {
        this._extractSublayers();
      }
    }
  }, {
    key: '_extractSublayers',
    value: function _extractSublayers() {
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
    }
  }, {
    key: 'renderLayers',
    value: function renderLayers() {
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
    }
  }]);
  return SvgIconLayer;
}(_deck.CompositeLayer);

exports.default = SvgIconLayer;


SvgIconLayer.layerName = 'SvgIconLayer';
SvgIconLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL3N2Zy1pY29uLWxheWVyL3N2Zy1pY29uLWxheWVyLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfSUNPTl9HRU9NRVRSWSIsImRlZmF1bHRQcm9wcyIsImdldEljb25HZW9tZXRyeSIsImdldEljb24iLCJkIiwiaWNvbiIsIlN2Z0ljb25MYXllciIsInN0YXRlIiwiZGF0YSIsImNoYW5nZUZsYWdzIiwiZGF0YUNoYW5nZWQiLCJfZXh0cmFjdFN1YmxheWVycyIsInByb3BzIiwiaWNvbkxheWVycyIsInJlZHVjZSIsImFjY3UiLCJpY29uSWQiLCJwdXNoIiwiZ2VvbWV0cnkiLCJpZCIsInNldFN0YXRlIiwiT2JqZWN0IiwidmFsdWVzIiwibGF5ZXJJZCIsImxheWVycyIsImxlbmd0aCIsIm1hcCIsImljb25HZW9tZXRyeSIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7OztBQUVBO0FBQ0EsSUFBTUEsd0JBQXdCLENBQzVCLENBRDRCLEVBRTVCLENBRjRCLEVBRzVCLENBSDRCLEVBSTVCLENBSjRCLEVBSzVCLENBQUMsQ0FMMkIsRUFNNUIsQ0FONEIsRUFPNUIsQ0FBQyxDQVAyQixFQVE1QixDQUFDLENBUjJCLEVBUzVCLENBVDRCLEVBVTVCLENBQUMsQ0FWMkIsRUFXNUIsQ0FBQyxDQVgyQixFQVk1QixDQVo0QixFQWE1QixDQUFDLENBYjJCLEVBYzVCLENBZDRCLEVBZTVCLENBZjRCLEVBZ0I1QixDQWhCNEIsRUFpQjVCLENBakI0QixFQWtCNUIsQ0FsQjRCLENBQTlCO0FBb0JBLElBQU1DLGVBQWU7QUFDbkJDLG1CQUFpQjtBQUFBLFdBQVVGLHFCQUFWO0FBQUEsR0FERTtBQUVuQkcsV0FBUztBQUFBLFdBQUtDLEVBQUVDLElBQVA7QUFBQTtBQUZVLENBQXJCOztJQUtxQkMsWTs7Ozs7Ozs7Ozs7QUFDbkI7c0NBQ2tCO0FBQ2hCLFdBQUtDLEtBQUwsR0FBYTtBQUNYQyxjQUFNO0FBREssT0FBYjtBQUdEOzs7c0NBRTBCO0FBQUEsVUFBZEMsV0FBYyxRQUFkQSxXQUFjOztBQUN6QixVQUFJQSxZQUFZQyxXQUFoQixFQUE2QjtBQUMzQixhQUFLQyxpQkFBTDtBQUNEO0FBQ0Y7Ozt3Q0FFbUI7QUFBQSxtQkFDdUIsS0FBS0MsS0FENUI7QUFBQSxVQUNYSixJQURXLFVBQ1hBLElBRFc7QUFBQSxVQUNMTixlQURLLFVBQ0xBLGVBREs7QUFBQSxVQUNZQyxPQURaLFVBQ1lBLE9BRFo7OztBQUdsQixVQUFNVSxhQUFhTCxLQUFLTSxNQUFMLENBQVksVUFBQ0MsSUFBRCxFQUFPWCxDQUFQLEVBQWE7QUFDMUMsWUFBTVksU0FBU2IsUUFBUUMsQ0FBUixDQUFmOztBQUVBLFlBQUlZLFVBQVVELElBQWQsRUFBb0I7QUFDbEJBLGVBQUtDLE1BQUwsRUFBYVIsSUFBYixDQUFrQlMsSUFBbEIsQ0FBdUJiLENBQXZCO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsY0FBTWMsV0FBV2hCLGdCQUFnQmMsTUFBaEIsS0FBMkJoQixxQkFBNUM7QUFDQWUsZUFBS0MsTUFBTCxJQUFlO0FBQ2JHLGdCQUFJSCxNQURTO0FBRWJFLDhCQUZhO0FBR2JWLGtCQUFNLENBQUNKLENBQUQ7QUFITyxXQUFmO0FBS0Q7O0FBRUQsZUFBT1csSUFBUDtBQUNELE9BZmtCLEVBZWhCLEVBZmdCLENBQW5COztBQWlCQSxXQUFLSyxRQUFMLENBQWM7QUFDWlosY0FBTWEsT0FBT0MsTUFBUCxDQUFjVCxVQUFkO0FBRE0sT0FBZDtBQUdEOzs7bUNBRWM7QUFBQTs7QUFDYixVQUFNVSxVQUFVLEtBQUtYLEtBQUwsQ0FBV08sRUFBM0I7O0FBRUEsVUFBTUssU0FDSixLQUFLakIsS0FBTCxDQUFXQyxJQUFYLElBQ0EsS0FBS0QsS0FBTCxDQUFXQyxJQUFYLENBQWdCaUIsTUFEaEIsSUFFQSxLQUFLbEIsS0FBTCxDQUFXQyxJQUFYLENBQWdCa0IsR0FBaEIsQ0FDRTtBQUFBLFlBQUVQLEVBQUYsU0FBRUEsRUFBRjtBQUFBLFlBQU1YLElBQU4sU0FBTUEsSUFBTjtBQUFBLFlBQVlVLFFBQVosU0FBWUEsUUFBWjtBQUFBLGVBQ0UsOERBQ0ssT0FBS04sS0FEVjtBQUVFTyxjQUFPSSxPQUFQLFNBQWtCSixFQUZwQjtBQUdFWCxvQkFIRjtBQUlFbUIsd0JBQWNUO0FBSmhCLFdBREY7QUFBQSxPQURGLENBSEY7O0FBYUEsYUFBT00sVUFBVUEsT0FBT0MsTUFBUCxHQUFnQixDQUExQixHQUE4QkQsTUFBOUIsR0FBdUMsSUFBOUM7QUFDRDs7Ozs7a0JBeERrQmxCLFk7OztBQTJEckJBLGFBQWFzQixTQUFiLEdBQXlCLGNBQXpCO0FBQ0F0QixhQUFhTCxZQUFiLEdBQTRCQSxZQUE1QiIsImZpbGUiOiJzdmctaWNvbi1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9zaXRlTGF5ZXJ9IGZyb20gJ2RlY2suZ2wnO1xuaW1wb3J0IFNjYXR0ZXJwbG90SWNvbkxheWVyIGZyb20gJy4vc2NhdHRlcnBsb3QtaWNvbi1sYXllcic7XG5cbi8vIGRlZmF1bHQgaWNvbiBnZW9tZXRyeSBpcyBhIHNxdWFyZVxuY29uc3QgREVGQVVMVF9JQ09OX0dFT01FVFJZID0gW1xuICAxLFxuICAxLFxuICAwLFxuICAxLFxuICAtMSxcbiAgMCxcbiAgLTEsXG4gIC0xLFxuICAwLFxuICAtMSxcbiAgLTEsXG4gIDAsXG4gIC0xLFxuICAxLFxuICAwLFxuICAxLFxuICAxLFxuICAwXG5dO1xuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBnZXRJY29uR2VvbWV0cnk6IGljb25JZCA9PiBERUZBVUxUX0lDT05fR0VPTUVUUlksXG4gIGdldEljb246IGQgPT4gZC5pY29uXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdmdJY29uTGF5ZXIgZXh0ZW5kcyBDb21wb3NpdGVMYXllciB7XG4gIC8vIE11c3QgYmUgZGVmaW5lZFxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGRhdGE6IHt9XG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlKHtjaGFuZ2VGbGFnc30pIHtcbiAgICBpZiAoY2hhbmdlRmxhZ3MuZGF0YUNoYW5nZWQpIHtcbiAgICAgIHRoaXMuX2V4dHJhY3RTdWJsYXllcnMoKTtcbiAgICB9XG4gIH1cblxuICBfZXh0cmFjdFN1YmxheWVycygpIHtcbiAgICBjb25zdCB7ZGF0YSwgZ2V0SWNvbkdlb21ldHJ5LCBnZXRJY29ufSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBpY29uTGF5ZXJzID0gZGF0YS5yZWR1Y2UoKGFjY3UsIGQpID0+IHtcbiAgICAgIGNvbnN0IGljb25JZCA9IGdldEljb24oZCk7XG5cbiAgICAgIGlmIChpY29uSWQgaW4gYWNjdSkge1xuICAgICAgICBhY2N1W2ljb25JZF0uZGF0YS5wdXNoKGQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZ2VvbWV0cnkgPSBnZXRJY29uR2VvbWV0cnkoaWNvbklkKSB8fCBERUZBVUxUX0lDT05fR0VPTUVUUlk7XG4gICAgICAgIGFjY3VbaWNvbklkXSA9IHtcbiAgICAgICAgICBpZDogaWNvbklkLFxuICAgICAgICAgIGdlb21ldHJ5LFxuICAgICAgICAgIGRhdGE6IFtkXVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYWNjdTtcbiAgICB9LCB7fSk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGRhdGE6IE9iamVjdC52YWx1ZXMoaWNvbkxheWVycylcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlckxheWVycygpIHtcbiAgICBjb25zdCBsYXllcklkID0gdGhpcy5wcm9wcy5pZDtcblxuICAgIGNvbnN0IGxheWVycyA9XG4gICAgICB0aGlzLnN0YXRlLmRhdGEgJiZcbiAgICAgIHRoaXMuc3RhdGUuZGF0YS5sZW5ndGggJiZcbiAgICAgIHRoaXMuc3RhdGUuZGF0YS5tYXAoXG4gICAgICAgICh7aWQsIGRhdGEsIGdlb21ldHJ5fSkgPT5cbiAgICAgICAgICBuZXcgU2NhdHRlcnBsb3RJY29uTGF5ZXIoe1xuICAgICAgICAgICAgLi4udGhpcy5wcm9wcyxcbiAgICAgICAgICAgIGlkOiBgJHtsYXllcklkfS0ke2lkfWAsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgaWNvbkdlb21ldHJ5OiBnZW9tZXRyeVxuICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgcmV0dXJuIGxheWVycyAmJiBsYXllcnMubGVuZ3RoID4gMCA/IGxheWVycyA6IG51bGw7XG4gIH1cbn1cblxuU3ZnSWNvbkxheWVyLmxheWVyTmFtZSA9ICdTdmdJY29uTGF5ZXInO1xuU3ZnSWNvbkxheWVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==