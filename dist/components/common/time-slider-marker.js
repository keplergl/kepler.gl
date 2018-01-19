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
  return props.theme.panelBorderColor;
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
    var xAxis = (0, _d3Axis.axisBottom)(scale).ticks(6).tickSize(10).tickPadding(6);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi90aW1lLXNsaWRlci1tYXJrZXIuanMiXSwibmFtZXMiOlsiVGltZVNsaWRlckNvbnRhaW5lciIsInN2ZyIsInByb3BzIiwidGhlbWUiLCJ0ZXh0Q29sb3IiLCJwYW5lbEJvcmRlckNvbG9yIiwicHJvcFR5cGVzIiwiZG9tYWluIiwiUHJvcFR5cGVzIiwiYXJyYXkiLCJpc1JlcXVpcmVkIiwid2lkdGgiLCJudW1iZXIiLCJoZWlnaHQiLCJUaW1lU2xpZGVyTWFya2VyIiwiZG9tYWluU2VsZWN0b3IiLCJ3aWR0aFNlbGVjdG9yIiwic2NhbGVTZWxlY3RvciIsIkFycmF5IiwiaXNBcnJheSIsInJhbmdlIiwiY29tcG9uZW50RGlkTW91bnQiLCJfdXBkYXRlQXhpcyIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJzY2FsZSIsInhBeGlzIiwidGlja3MiLCJ0aWNrU2l6ZSIsInRpY2tQYWRkaW5nIiwic3ZnQ29udGFpbmVyIiwic2VsZWN0IiwiY2FsbCIsInNlbGVjdEFsbCIsInJlbmRlciIsImNvbXAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxzQkFBc0IsMkJBQU9DLEdBQTdCLGtCQU1NO0FBQUEsU0FBU0MsTUFBTUMsS0FBTixDQUFZQyxTQUFyQjtBQUFBLENBTk4sRUFZUTtBQUFBLFNBQVNGLE1BQU1DLEtBQU4sQ0FBWUUsZ0JBQXJCO0FBQUEsQ0FaUixFQXNCTTtBQUFBLFNBQVNILE1BQU1DLEtBQU4sQ0FBWUMsU0FBckI7QUFBQSxDQXRCTixDQUFOOztBQW1DQSxJQUFNRSxZQUFZO0FBQ2hCQyxVQUFRLGdCQUFNQyxTQUFOLENBQWdCQyxLQUFoQixDQUFzQkMsVUFEZDtBQUVoQkMsU0FBTyxnQkFBTUgsU0FBTixDQUFnQkksTUFBaEIsQ0FBdUJGO0FBRmQsQ0FBbEI7O0FBS0EsSUFBTUcsU0FBUyxFQUFmOztJQUVxQkMsZ0I7Ozs7Ozs7Ozs7OzswSkFXbkJDLGMsR0FBaUI7QUFBQSxhQUFTYixNQUFNSyxNQUFmO0FBQUEsSyxRQUNqQlMsYSxHQUFnQjtBQUFBLGFBQVNkLE1BQU1TLEtBQWY7QUFBQSxLLFFBQ2hCTSxhLEdBQWdCLDhCQUNkLE1BQUtGLGNBRFMsRUFFZCxNQUFLQyxhQUZTLEVBR2QsVUFBQ1QsTUFBRCxFQUFTSSxLQUFUO0FBQUEsYUFDRU8sTUFBTUMsT0FBTixDQUFjWixNQUFkLElBQ0kseUJBQ0dBLE1BREgsQ0FDVUEsTUFEVixFQUVHYSxLQUZILENBRVMsQ0FBQyxDQUFELEVBQUlULEtBQUosQ0FGVCxDQURKLEdBSUksSUFMTjtBQUFBLEtBSGMsQzs7OzZCQVpoQlUsaUIsZ0NBQW9CO0FBQ2xCLFNBQUtDLFdBQUwsQ0FBaUIsS0FBS0wsYUFBTCxDQUFtQixLQUFLZixLQUF4QixDQUFqQjtBQUNELEc7OzZCQUVEcUIseUIsc0NBQTBCQyxTLEVBQVc7QUFDbkMsUUFBSSxLQUFLUCxhQUFMLENBQW1CLEtBQUtmLEtBQXhCLE1BQW1DLEtBQUtlLGFBQUwsQ0FBbUJPLFNBQW5CLENBQXZDLEVBQXNFO0FBQ3BFLFdBQUtGLFdBQUwsQ0FBaUIsS0FBS0wsYUFBTCxDQUFtQk8sU0FBbkIsQ0FBakI7QUFDRDtBQUNGLEc7OzZCQWVERixXLHdCQUFZRyxLLEVBQU87QUFDakIsUUFBSSxDQUFDQSxLQUFMLEVBQVk7QUFDVjtBQUNEO0FBQ0QsUUFBTUMsUUFBUSx3QkFBV0QsS0FBWCxFQUNYRSxLQURXLENBQ0wsQ0FESyxFQUVYQyxRQUZXLENBRUYsRUFGRSxFQUdYQyxXQUhXLENBR0MsQ0FIRCxDQUFkOztBQUtBLFFBQU01QixNQUFNLHlCQUFPLEtBQUs2QixZQUFaLENBQVo7O0FBRUE3QixRQUNHOEIsTUFESCxDQUNVLFNBRFYsRUFFR0MsSUFGSCxDQUVRTixLQUZSLEVBR0dPLFNBSEgsQ0FHYSxNQUhiO0FBSUQsRzs7NkJBRURDLE0scUJBQVM7QUFBQTs7QUFDUCxXQUNFO0FBQUMseUJBQUQ7QUFBQTtBQUNFLG1CQUFVLG9CQURaO0FBRUUsZUFBTyxLQUFLaEMsS0FBTCxDQUFXUyxLQUZwQjtBQUdFLGdCQUFRRSxNQUhWO0FBSUUsa0JBQVUsd0JBQVE7QUFDaEIsaUJBQUtpQixZQUFMLEdBQW9CSyxJQUFwQjtBQUNEO0FBTkg7QUFRRSwyQ0FBRyxXQUFVLFFBQWIsRUFBc0IsV0FBVSxpQkFBaEM7QUFSRixLQURGO0FBWUQsRzs7Ozs7a0JBdERrQnJCLGdCOzs7QUF5RHJCQSxpQkFBaUJSLFNBQWpCLEdBQTZCQSxTQUE3QiIsImZpbGUiOiJ0aW1lLXNsaWRlci1tYXJrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7c2NhbGVVdGN9IGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCB7c2VsZWN0fSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHtheGlzQm90dG9tfSBmcm9tICdkMy1heGlzJztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5jb25zdCBUaW1lU2xpZGVyQ29udGFpbmVyID0gc3R5bGVkLnN2Z2BcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICAuYXhpcyB0ZXh0IHtcbiAgICBmb250LXNpemU6IDlweDtcbiAgICBmaWxsOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gIH1cblxuICAuYXhpcyBsaW5lLFxuICAuYXhpcyBwYXRoIHtcbiAgICBmaWxsOiBub25lO1xuICAgIHN0cm9rZTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJvcmRlckNvbG9yfTtcbiAgICBzaGFwZS1yZW5kZXJpbmc6IGNyaXNwRWRnZXM7XG4gICAgc3Ryb2tlLXdpZHRoOiAyO1xuICB9XG5cbiAgLmF4aXMgLmRvbWFpbiB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuXG4gIC52YWx1ZSB7XG4gICAgZmlsbDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICAgIGZvbnQtc2l6ZTogMTBweDtcblxuICAgICYuc3RhcnQge1xuICAgICAgdGV4dC1hbmNob3I6IHN0YXJ0O1xuICAgIH1cblxuICAgICYuZW5kIHtcbiAgICAgIHRleHQtYW5jaG9yOiBlbmQ7XG4gICAgfVxuICB9XG5gO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIGRvbWFpbjogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcbn07XG5cbmNvbnN0IGhlaWdodCA9IDMwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lU2xpZGVyTWFya2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5fdXBkYXRlQXhpcyh0aGlzLnNjYWxlU2VsZWN0b3IodGhpcy5wcm9wcykpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBpZiAodGhpcy5zY2FsZVNlbGVjdG9yKHRoaXMucHJvcHMpICE9PSB0aGlzLnNjYWxlU2VsZWN0b3IobmV4dFByb3BzKSkge1xuICAgICAgdGhpcy5fdXBkYXRlQXhpcyh0aGlzLnNjYWxlU2VsZWN0b3IobmV4dFByb3BzKSk7XG4gICAgfVxuICB9XG5cbiAgZG9tYWluU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5kb21haW47XG4gIHdpZHRoU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy53aWR0aDtcbiAgc2NhbGVTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHRoaXMuZG9tYWluU2VsZWN0b3IsXG4gICAgdGhpcy53aWR0aFNlbGVjdG9yLFxuICAgIChkb21haW4sIHdpZHRoKSA9PlxuICAgICAgQXJyYXkuaXNBcnJheShkb21haW4pXG4gICAgICAgID8gc2NhbGVVdGMoKVxuICAgICAgICAgICAgLmRvbWFpbihkb21haW4pXG4gICAgICAgICAgICAucmFuZ2UoWzAsIHdpZHRoXSlcbiAgICAgICAgOiBudWxsXG4gICk7XG5cbiAgX3VwZGF0ZUF4aXMoc2NhbGUpIHtcbiAgICBpZiAoIXNjYWxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHhBeGlzID0gYXhpc0JvdHRvbShzY2FsZSlcbiAgICAgIC50aWNrcyg2KVxuICAgICAgLnRpY2tTaXplKDEwKVxuICAgICAgLnRpY2tQYWRkaW5nKDYpO1xuXG4gICAgY29uc3Qgc3ZnID0gc2VsZWN0KHRoaXMuc3ZnQ29udGFpbmVyKTtcblxuICAgIHN2Z1xuICAgICAgLnNlbGVjdCgnLnguYXhpcycpXG4gICAgICAuY2FsbCh4QXhpcylcbiAgICAgIC5zZWxlY3RBbGwoJ3RleHQnKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFRpbWVTbGlkZXJDb250YWluZXJcbiAgICAgICAgY2xhc3NOYW1lPVwidGltZS1zbGlkZXItbWFya2VyXCJcbiAgICAgICAgd2lkdGg9e3RoaXMucHJvcHMud2lkdGh9XG4gICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICBpbm5lclJlZj17Y29tcCA9PiB7XG4gICAgICAgICAgdGhpcy5zdmdDb250YWluZXIgPSBjb21wO1xuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8ZyBjbGFzc05hbWU9XCJ4IGF4aXNcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMCwgMClcIiAvPlxuICAgICAgPC9UaW1lU2xpZGVyQ29udGFpbmVyPlxuICAgICk7XG4gIH1cbn1cblxuVGltZVNsaWRlck1hcmtlci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG4iXX0=