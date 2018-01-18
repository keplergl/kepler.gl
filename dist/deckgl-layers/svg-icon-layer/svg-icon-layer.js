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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNrZ2wtbGF5ZXJzL3N2Zy1pY29uLWxheWVyL3N2Zy1pY29uLWxheWVyLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfSUNPTl9HRU9NRVRSWSIsImRlZmF1bHRQcm9wcyIsImdldEljb25HZW9tZXRyeSIsImdldEljb24iLCJkIiwiaWNvbiIsIlN2Z0ljb25MYXllciIsImluaXRpYWxpemVTdGF0ZSIsInN0YXRlIiwiZGF0YSIsInVwZGF0ZVN0YXRlIiwiY2hhbmdlRmxhZ3MiLCJkYXRhQ2hhbmdlZCIsIl9leHRyYWN0U3VibGF5ZXJzIiwicHJvcHMiLCJpY29uTGF5ZXJzIiwicmVkdWNlIiwiYWNjdSIsImljb25JZCIsInB1c2giLCJnZW9tZXRyeSIsImlkIiwic2V0U3RhdGUiLCJPYmplY3QiLCJ2YWx1ZXMiLCJyZW5kZXJMYXllcnMiLCJsYXllcklkIiwibGF5ZXJzIiwibGVuZ3RoIiwibWFwIiwiaWNvbkdlb21ldHJ5IiwibGF5ZXJOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7QUFFQTtBQUNBLElBQU1BLHdCQUF3QixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFDLENBQWQsRUFBaUIsQ0FBakIsRUFBb0IsQ0FBQyxDQUFyQixFQUF3QixDQUFDLENBQXpCLEVBQTRCLENBQTVCLEVBQStCLENBQUMsQ0FBaEMsRUFBbUMsQ0FBQyxDQUFwQyxFQUF1QyxDQUF2QyxFQUEwQyxDQUFDLENBQTNDLEVBQThDLENBQTlDLEVBQWlELENBQWpELEVBQW9ELENBQXBELEVBQXVELENBQXZELEVBQTBELENBQTFELENBQTlCO0FBQ0EsSUFBTUMsZUFBZTtBQUNuQkMsbUJBQWlCO0FBQUEsV0FBVUYscUJBQVY7QUFBQSxHQURFO0FBRW5CRyxXQUFTO0FBQUEsV0FBS0MsRUFBRUMsSUFBUDtBQUFBO0FBRlUsQ0FBckI7O0lBS3FCQyxZOzs7Ozs7OztBQUVuQjt5QkFDQUMsZSw4QkFBa0I7QUFDaEIsU0FBS0MsS0FBTCxHQUFhO0FBQ1hDLFlBQU07QUFESyxLQUFiO0FBR0QsRzs7eUJBRURDLFcsOEJBQTJCO0FBQUEsUUFBZEMsV0FBYyxRQUFkQSxXQUFjOztBQUN6QixRQUFJQSxZQUFZQyxXQUFoQixFQUE2QjtBQUMzQixXQUFLQyxpQkFBTDtBQUNEO0FBQ0YsRzs7eUJBRURBLGlCLGdDQUFvQjtBQUFBLGlCQUN1QixLQUFLQyxLQUQ1QjtBQUFBLFFBQ1hMLElBRFcsVUFDWEEsSUFEVztBQUFBLFFBQ0xQLGVBREssVUFDTEEsZUFESztBQUFBLFFBQ1lDLE9BRFosVUFDWUEsT0FEWjs7O0FBR2xCLFFBQU1ZLGFBQWFOLEtBQUtPLE1BQUwsQ0FBWSxVQUFDQyxJQUFELEVBQU9iLENBQVAsRUFBYTtBQUMxQyxVQUFNYyxTQUFTZixRQUFRQyxDQUFSLENBQWY7O0FBRUEsVUFBSWMsVUFBVUQsSUFBZCxFQUFvQjtBQUNsQkEsYUFBS0MsTUFBTCxFQUFhVCxJQUFiLENBQWtCVSxJQUFsQixDQUF1QmYsQ0FBdkI7QUFDRCxPQUZELE1BRU87QUFDTCxZQUFNZ0IsV0FBV2xCLGdCQUFnQmdCLE1BQWhCLEtBQTJCbEIscUJBQTVDO0FBQ0FpQixhQUFLQyxNQUFMLElBQWU7QUFDYkcsY0FBSUgsTUFEUztBQUViRSw0QkFGYTtBQUdiWCxnQkFBTSxDQUFDTCxDQUFEO0FBSE8sU0FBZjtBQUtEOztBQUVELGFBQU9hLElBQVA7QUFDRCxLQWZrQixFQWVoQixFQWZnQixDQUFuQjs7QUFpQkEsU0FBS0ssUUFBTCxDQUFjO0FBQ1piLFlBQU1jLE9BQU9DLE1BQVAsQ0FBY1QsVUFBZDtBQURNLEtBQWQ7QUFHRCxHOzt5QkFFRFUsWSwyQkFBZTtBQUFBOztBQUNiLFFBQU1DLFVBQVUsS0FBS1osS0FBTCxDQUFXTyxFQUEzQjs7QUFFQSxRQUFNTSxTQUFTLEtBQUtuQixLQUFMLENBQVdDLElBQVgsSUFBbUIsS0FBS0QsS0FBTCxDQUFXQyxJQUFYLENBQWdCbUIsTUFBbkMsSUFDYixLQUFLcEIsS0FBTCxDQUFXQyxJQUFYLENBQWdCb0IsR0FBaEIsQ0FBb0I7QUFBQSxVQUFFUixFQUFGLFNBQUVBLEVBQUY7QUFBQSxVQUFNWixJQUFOLFNBQU1BLElBQU47QUFBQSxVQUFZVyxRQUFaLFNBQVlBLFFBQVo7QUFBQSxhQUNsQiw4REFDSyxPQUFLTixLQURWO0FBRUVPLFlBQU9LLE9BQVAsU0FBa0JMLEVBRnBCO0FBR0VaLGtCQUhGO0FBSUVxQixzQkFBY1Y7QUFKaEIsU0FEa0I7QUFBQSxLQUFwQixDQURGOztBQVVBLFdBQU9PLFVBQVVBLE9BQU9DLE1BQVAsR0FBZ0IsQ0FBMUIsR0FBOEJELE1BQTlCLEdBQXVDLElBQTlDO0FBQ0QsRzs7Ozs7a0JBdERrQnJCLFk7OztBQXlEckJBLGFBQWF5QixTQUFiLEdBQXlCLGNBQXpCO0FBQ0F6QixhQUFhTCxZQUFiLEdBQTRCQSxZQUE1QiIsImZpbGUiOiJzdmctaWNvbi1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9zaXRlTGF5ZXJ9IGZyb20gJ2RlY2suZ2wnO1xuaW1wb3J0IFNjYXR0ZXJwbG90SWNvbkxheWVyIGZyb20gJy4vc2NhdHRlcnBsb3QtaWNvbi1sYXllcic7XG5cbi8vIGRlZmF1bHQgaWNvbiBnZW9tZXRyeSBpcyBhIHNxdWFyZVxuY29uc3QgREVGQVVMVF9JQ09OX0dFT01FVFJZID0gWzEsIDEsIDAsIDEsIC0xLCAwLCAtMSwgLTEsIDAsIC0xLCAtMSwgMCwgLTEsIDEsIDAsIDEsIDEsIDBdO1xuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBnZXRJY29uR2VvbWV0cnk6IGljb25JZCA9PiBERUZBVUxUX0lDT05fR0VPTUVUUlksXG4gIGdldEljb246IGQgPT4gZC5pY29uXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdmdJY29uTGF5ZXIgZXh0ZW5kcyBDb21wb3NpdGVMYXllciB7XG5cbiAgLy8gTXVzdCBiZSBkZWZpbmVkXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZGF0YToge31cbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlU3RhdGUoe2NoYW5nZUZsYWdzfSkge1xuICAgIGlmIChjaGFuZ2VGbGFncy5kYXRhQ2hhbmdlZCkge1xuICAgICAgdGhpcy5fZXh0cmFjdFN1YmxheWVycygpO1xuICAgIH1cbiAgfVxuXG4gIF9leHRyYWN0U3VibGF5ZXJzKCkge1xuICAgIGNvbnN0IHtkYXRhLCBnZXRJY29uR2VvbWV0cnksIGdldEljb259ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IGljb25MYXllcnMgPSBkYXRhLnJlZHVjZSgoYWNjdSwgZCkgPT4ge1xuICAgICAgY29uc3QgaWNvbklkID0gZ2V0SWNvbihkKTtcblxuICAgICAgaWYgKGljb25JZCBpbiBhY2N1KSB7XG4gICAgICAgIGFjY3VbaWNvbklkXS5kYXRhLnB1c2goZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBnZW9tZXRyeSA9IGdldEljb25HZW9tZXRyeShpY29uSWQpIHx8IERFRkFVTFRfSUNPTl9HRU9NRVRSWTtcbiAgICAgICAgYWNjdVtpY29uSWRdID0ge1xuICAgICAgICAgIGlkOiBpY29uSWQsXG4gICAgICAgICAgZ2VvbWV0cnksXG4gICAgICAgICAgZGF0YTogW2RdXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhY2N1O1xuICAgIH0sIHt9KTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZGF0YTogT2JqZWN0LnZhbHVlcyhpY29uTGF5ZXJzKVxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyTGF5ZXJzKCkge1xuICAgIGNvbnN0IGxheWVySWQgPSB0aGlzLnByb3BzLmlkO1xuXG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5zdGF0ZS5kYXRhICYmIHRoaXMuc3RhdGUuZGF0YS5sZW5ndGggJiZcbiAgICAgIHRoaXMuc3RhdGUuZGF0YS5tYXAoKHtpZCwgZGF0YSwgZ2VvbWV0cnl9KSA9PiAoXG4gICAgICAgIG5ldyBTY2F0dGVycGxvdEljb25MYXllcih7XG4gICAgICAgICAgLi4udGhpcy5wcm9wcyxcbiAgICAgICAgICBpZDogYCR7bGF5ZXJJZH0tJHtpZH1gLFxuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgaWNvbkdlb21ldHJ5OiBnZW9tZXRyeVxuICAgICAgICB9KVxuICAgICAgKSk7XG5cbiAgICByZXR1cm4gbGF5ZXJzICYmIGxheWVycy5sZW5ndGggPiAwID8gbGF5ZXJzIDogbnVsbDtcbiAgfVxufVxuXG5TdmdJY29uTGF5ZXIubGF5ZXJOYW1lID0gJ1N2Z0ljb25MYXllcic7XG5TdmdJY29uTGF5ZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19