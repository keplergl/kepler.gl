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

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  .axis text {\n    font-size: 9px;\n    fill: ', ';\n  }\n\n  .axis line,\n  .axis path {\n    fill: none;\n    stroke: ', ';\n    shape-rendering: crispEdges;\n    stroke-width: 2;\n  }\n\n  .axis .domain {\n    display: none;\n  }\n\n  .value {\n    fill: ', ';\n    font-size: 10px;\n\n    &.start {\n      text-anchor: start;\n    }\n\n    &.end {\n      text-anchor: end;\n    }\n  }\n'], ['\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  .axis text {\n    font-size: 9px;\n    fill: ', ';\n  }\n\n  .axis line,\n  .axis path {\n    fill: none;\n    stroke: ', ';\n    shape-rendering: crispEdges;\n    stroke-width: 2;\n  }\n\n  .axis .domain {\n    display: none;\n  }\n\n  .value {\n    fill: ', ';\n    font-size: 10px;\n\n    &.start {\n      text-anchor: start;\n    }\n\n    &.end {\n      text-anchor: end;\n    }\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d3Scale = require('d3-scale');

var _d3Selection = require('d3-selection');

var _d3Axis = require('d3-axis');

var _reselect = require('reselect');

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TimeSliderContainer = _styledComponents2.default.svg(_templateObject, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.sliderBarBgd;
}, function (props) {
  return props.theme.textColor;
});

var propTypes = {
  domain: _react2.default.PropTypes.array.isRequired,
  width: _react2.default.PropTypes.number.isRequired
};

var height = 30;

var TimeSliderMarker = function (_Component) {
  (0, _inherits3.default)(TimeSliderMarker, _Component);

  function TimeSliderMarker() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, TimeSliderMarker);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.domainSelector = function (props) {
      return props.domain;
    }, _this.widthSelector = function (props) {
      return props.width;
    }, _this.scaleSelector = (0, _reselect.createSelector)(_this.domainSelector, _this.widthSelector, function (domain, width) {
      return Array.isArray(domain) ? (0, _d3Scale.scaleUtc)().domain(domain).range([0, width]) : null;
    }), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  TimeSliderMarker.prototype.componentDidMount = function componentDidMount() {
    this._updateAxis(this.scaleSelector(this.props));
  };

  TimeSliderMarker.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (this.scaleSelector(this.props) !== this.scaleSelector(nextProps)) {
      this._updateAxis(this.scaleSelector(nextProps));
    }
  };

  TimeSliderMarker.prototype._updateAxis = function _updateAxis(scale) {
    if (!scale) {
      return;
    }
    var xAxis = (0, _d3Axis.axisBottom)(scale).ticks(4).tickSize(8).tickPadding(6);

    var svg = (0, _d3Selection.select)(this.svgContainer);

    svg.select('.x.axis').call(xAxis).selectAll('text');
  };

  TimeSliderMarker.prototype.render = function render() {
    var _this2 = this;

    return _react2.default.createElement(
      TimeSliderContainer,
      {
        className: 'time-slider-marker',
        width: this.props.width,
        height: height,
        innerRef: function innerRef(comp) {
          _this2.svgContainer = comp;
        }
      },
      _react2.default.createElement('g', { className: 'x axis', transform: 'translate(0, 0)' })
    );
  };

  return TimeSliderMarker;
}(_react.Component);

exports.default = TimeSliderMarker;


TimeSliderMarker.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi90aW1lLXNsaWRlci1tYXJrZXIuanMiXSwibmFtZXMiOlsiVGltZVNsaWRlckNvbnRhaW5lciIsInN2ZyIsInByb3BzIiwidGhlbWUiLCJ0ZXh0Q29sb3IiLCJzbGlkZXJCYXJCZ2QiLCJwcm9wVHlwZXMiLCJkb21haW4iLCJQcm9wVHlwZXMiLCJhcnJheSIsImlzUmVxdWlyZWQiLCJ3aWR0aCIsIm51bWJlciIsImhlaWdodCIsIlRpbWVTbGlkZXJNYXJrZXIiLCJkb21haW5TZWxlY3RvciIsIndpZHRoU2VsZWN0b3IiLCJzY2FsZVNlbGVjdG9yIiwiQXJyYXkiLCJpc0FycmF5IiwicmFuZ2UiLCJjb21wb25lbnREaWRNb3VudCIsIl91cGRhdGVBeGlzIiwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5leHRQcm9wcyIsInNjYWxlIiwieEF4aXMiLCJ0aWNrcyIsInRpY2tTaXplIiwidGlja1BhZGRpbmciLCJzdmdDb250YWluZXIiLCJzZWxlY3QiLCJjYWxsIiwic2VsZWN0QWxsIiwicmVuZGVyIiwiY29tcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLHNCQUFzQiwyQkFBT0MsR0FBN0Isa0JBTU07QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlDLFNBQXJCO0FBQUEsQ0FOTixFQVlRO0FBQUEsU0FBU0YsTUFBTUMsS0FBTixDQUFZRSxZQUFyQjtBQUFBLENBWlIsRUFzQk07QUFBQSxTQUFTSCxNQUFNQyxLQUFOLENBQVlDLFNBQXJCO0FBQUEsQ0F0Qk4sQ0FBTjs7QUFtQ0EsSUFBTUUsWUFBWTtBQUNoQkMsVUFBUSxnQkFBTUMsU0FBTixDQUFnQkMsS0FBaEIsQ0FBc0JDLFVBRGQ7QUFFaEJDLFNBQU8sZ0JBQU1ILFNBQU4sQ0FBZ0JJLE1BQWhCLENBQXVCRjtBQUZkLENBQWxCOztBQUtBLElBQU1HLFNBQVMsRUFBZjs7SUFFcUJDLGdCOzs7Ozs7Ozs7Ozs7MEpBV25CQyxjLEdBQWlCO0FBQUEsYUFBU2IsTUFBTUssTUFBZjtBQUFBLEssUUFDakJTLGEsR0FBZ0I7QUFBQSxhQUFTZCxNQUFNUyxLQUFmO0FBQUEsSyxRQUNoQk0sYSxHQUFnQiw4QkFDZCxNQUFLRixjQURTLEVBRWQsTUFBS0MsYUFGUyxFQUdkLFVBQUNULE1BQUQsRUFBU0ksS0FBVDtBQUFBLGFBQ0VPLE1BQU1DLE9BQU4sQ0FBY1osTUFBZCxJQUNJLHlCQUNHQSxNQURILENBQ1VBLE1BRFYsRUFFR2EsS0FGSCxDQUVTLENBQUMsQ0FBRCxFQUFJVCxLQUFKLENBRlQsQ0FESixHQUlJLElBTE47QUFBQSxLQUhjLEM7Ozs2QkFaaEJVLGlCLGdDQUFvQjtBQUNsQixTQUFLQyxXQUFMLENBQWlCLEtBQUtMLGFBQUwsQ0FBbUIsS0FBS2YsS0FBeEIsQ0FBakI7QUFDRCxHOzs2QkFFRHFCLHlCLHNDQUEwQkMsUyxFQUFXO0FBQ25DLFFBQUksS0FBS1AsYUFBTCxDQUFtQixLQUFLZixLQUF4QixNQUFtQyxLQUFLZSxhQUFMLENBQW1CTyxTQUFuQixDQUF2QyxFQUFzRTtBQUNwRSxXQUFLRixXQUFMLENBQWlCLEtBQUtMLGFBQUwsQ0FBbUJPLFNBQW5CLENBQWpCO0FBQ0Q7QUFDRixHOzs2QkFlREYsVyx3QkFBWUcsSyxFQUFPO0FBQ2pCLFFBQUksQ0FBQ0EsS0FBTCxFQUFZO0FBQ1Y7QUFDRDtBQUNELFFBQU1DLFFBQVEsd0JBQVdELEtBQVgsRUFDWEUsS0FEVyxDQUNMLENBREssRUFFWEMsUUFGVyxDQUVGLENBRkUsRUFHWEMsV0FIVyxDQUdDLENBSEQsQ0FBZDs7QUFLQSxRQUFNNUIsTUFBTSx5QkFBTyxLQUFLNkIsWUFBWixDQUFaOztBQUVBN0IsUUFDRzhCLE1BREgsQ0FDVSxTQURWLEVBRUdDLElBRkgsQ0FFUU4sS0FGUixFQUdHTyxTQUhILENBR2EsTUFIYjtBQUlELEc7OzZCQUVEQyxNLHFCQUFTO0FBQUE7O0FBQ1AsV0FDRTtBQUFDLHlCQUFEO0FBQUE7QUFDRSxtQkFBVSxvQkFEWjtBQUVFLGVBQU8sS0FBS2hDLEtBQUwsQ0FBV1MsS0FGcEI7QUFHRSxnQkFBUUUsTUFIVjtBQUlFLGtCQUFVLHdCQUFRO0FBQ2hCLGlCQUFLaUIsWUFBTCxHQUFvQkssSUFBcEI7QUFDRDtBQU5IO0FBUUUsMkNBQUcsV0FBVSxRQUFiLEVBQXNCLFdBQVUsaUJBQWhDO0FBUkYsS0FERjtBQVlELEc7Ozs7O2tCQXREa0JyQixnQjs7O0FBeURyQkEsaUJBQWlCUixTQUFqQixHQUE2QkEsU0FBN0IiLCJmaWxlIjoidGltZS1zbGlkZXItbWFya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge3NjYWxlVXRjfSBmcm9tICdkMy1zY2FsZSc7XG5pbXBvcnQge3NlbGVjdH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7YXhpc0JvdHRvbX0gZnJvbSAnZDMtYXhpcyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgVGltZVNsaWRlckNvbnRhaW5lciA9IHN0eWxlZC5zdmdgXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgLmF4aXMgdGV4dCB7XG4gICAgZm9udC1zaXplOiA5cHg7XG4gICAgZmlsbDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICB9XG5cbiAgLmF4aXMgbGluZSxcbiAgLmF4aXMgcGF0aCB7XG4gICAgZmlsbDogbm9uZTtcbiAgICBzdHJva2U6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2xpZGVyQmFyQmdkfTtcbiAgICBzaGFwZS1yZW5kZXJpbmc6IGNyaXNwRWRnZXM7XG4gICAgc3Ryb2tlLXdpZHRoOiAyO1xuICB9XG5cbiAgLmF4aXMgLmRvbWFpbiB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuXG4gIC52YWx1ZSB7XG4gICAgZmlsbDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICAgIGZvbnQtc2l6ZTogMTBweDtcblxuICAgICYuc3RhcnQge1xuICAgICAgdGV4dC1hbmNob3I6IHN0YXJ0O1xuICAgIH1cblxuICAgICYuZW5kIHtcbiAgICAgIHRleHQtYW5jaG9yOiBlbmQ7XG4gICAgfVxuICB9XG5gO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIGRvbWFpbjogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcbn07XG5cbmNvbnN0IGhlaWdodCA9IDMwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lU2xpZGVyTWFya2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5fdXBkYXRlQXhpcyh0aGlzLnNjYWxlU2VsZWN0b3IodGhpcy5wcm9wcykpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBpZiAodGhpcy5zY2FsZVNlbGVjdG9yKHRoaXMucHJvcHMpICE9PSB0aGlzLnNjYWxlU2VsZWN0b3IobmV4dFByb3BzKSkge1xuICAgICAgdGhpcy5fdXBkYXRlQXhpcyh0aGlzLnNjYWxlU2VsZWN0b3IobmV4dFByb3BzKSk7XG4gICAgfVxuICB9XG5cbiAgZG9tYWluU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5kb21haW47XG4gIHdpZHRoU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy53aWR0aDtcbiAgc2NhbGVTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHRoaXMuZG9tYWluU2VsZWN0b3IsXG4gICAgdGhpcy53aWR0aFNlbGVjdG9yLFxuICAgIChkb21haW4sIHdpZHRoKSA9PlxuICAgICAgQXJyYXkuaXNBcnJheShkb21haW4pXG4gICAgICAgID8gc2NhbGVVdGMoKVxuICAgICAgICAgICAgLmRvbWFpbihkb21haW4pXG4gICAgICAgICAgICAucmFuZ2UoWzAsIHdpZHRoXSlcbiAgICAgICAgOiBudWxsXG4gICk7XG5cbiAgX3VwZGF0ZUF4aXMoc2NhbGUpIHtcbiAgICBpZiAoIXNjYWxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHhBeGlzID0gYXhpc0JvdHRvbShzY2FsZSlcbiAgICAgIC50aWNrcyg0KVxuICAgICAgLnRpY2tTaXplKDgpXG4gICAgICAudGlja1BhZGRpbmcoNik7XG5cbiAgICBjb25zdCBzdmcgPSBzZWxlY3QodGhpcy5zdmdDb250YWluZXIpO1xuXG4gICAgc3ZnXG4gICAgICAuc2VsZWN0KCcueC5heGlzJylcbiAgICAgIC5jYWxsKHhBeGlzKVxuICAgICAgLnNlbGVjdEFsbCgndGV4dCcpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8VGltZVNsaWRlckNvbnRhaW5lclxuICAgICAgICBjbGFzc05hbWU9XCJ0aW1lLXNsaWRlci1tYXJrZXJcIlxuICAgICAgICB3aWR0aD17dGhpcy5wcm9wcy53aWR0aH1cbiAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgIGlubmVyUmVmPXtjb21wID0+IHtcbiAgICAgICAgICB0aGlzLnN2Z0NvbnRhaW5lciA9IGNvbXA7XG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxnIGNsYXNzTmFtZT1cInggYXhpc1wiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgwLCAwKVwiIC8+XG4gICAgICA8L1RpbWVTbGlkZXJDb250YWluZXI+XG4gICAgKTtcbiAgfVxufVxuXG5UaW1lU2xpZGVyTWFya2VyLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbiJdfQ==