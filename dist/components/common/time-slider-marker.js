'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  .axis text {\n    font-size: 9px;\n    fill: ', ';\n  }\n\n  .axis line,\n  .axis path {\n    fill: none;\n    stroke: ', ';\n    shape-rendering: crispEdges;\n    stroke-width: 2;\n  }\n\n  .axis .domain {\n    display: none;\n  }\n\n  .value {\n    fill: ', ';\n    font-size: 10px;\n\n    &.start {\n      text-anchor: start;\n    }\n\n    &.end {\n      text-anchor: end;\n    }\n  }\n'], ['\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  .axis text {\n    font-size: 9px;\n    fill: ', ';\n  }\n\n  .axis line,\n  .axis path {\n    fill: none;\n    stroke: ', ';\n    shape-rendering: crispEdges;\n    stroke-width: 2;\n  }\n\n  .axis .domain {\n    display: none;\n  }\n\n  .value {\n    fill: ', ';\n    font-size: 10px;\n\n    &.start {\n      text-anchor: start;\n    }\n\n    &.end {\n      text-anchor: end;\n    }\n  }\n']);

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
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, TimeSliderMarker);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = TimeSliderMarker.__proto__ || Object.getPrototypeOf(TimeSliderMarker)).call.apply(_ref, [this].concat(args))), _this), _this.domainSelector = function (props) {
      return props.domain;
    }, _this.widthSelector = function (props) {
      return props.width;
    }, _this.scaleSelector = (0, _reselect.createSelector)(_this.domainSelector, _this.widthSelector, function (domain, width) {
      return Array.isArray(domain) ? (0, _d3Scale.scaleUtc)().domain(domain).range([0, width]) : null;
    }), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(TimeSliderMarker, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._updateAxis(this.scaleSelector(this.props));
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.scaleSelector(this.props) !== this.scaleSelector(nextProps)) {
        this._updateAxis(this.scaleSelector(nextProps));
      }
    }
  }, {
    key: '_updateAxis',
    value: function _updateAxis(scale) {
      if (!scale) {
        return;
      }
      var xAxis = (0, _d3Axis.axisBottom)(scale).ticks(4).tickSize(8).tickPadding(6);

      var svg = (0, _d3Selection.select)(this.svgContainer);

      svg.select('.x.axis').call(xAxis).selectAll('text');
    }
  }, {
    key: 'render',
    value: function render() {
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
    }
  }]);
  return TimeSliderMarker;
}(_react.Component);

exports.default = TimeSliderMarker;


TimeSliderMarker.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi90aW1lLXNsaWRlci1tYXJrZXIuanMiXSwibmFtZXMiOlsiVGltZVNsaWRlckNvbnRhaW5lciIsInN2ZyIsInByb3BzIiwidGhlbWUiLCJ0ZXh0Q29sb3IiLCJzbGlkZXJCYXJCZ2QiLCJwcm9wVHlwZXMiLCJkb21haW4iLCJQcm9wVHlwZXMiLCJhcnJheSIsImlzUmVxdWlyZWQiLCJ3aWR0aCIsIm51bWJlciIsImhlaWdodCIsIlRpbWVTbGlkZXJNYXJrZXIiLCJkb21haW5TZWxlY3RvciIsIndpZHRoU2VsZWN0b3IiLCJzY2FsZVNlbGVjdG9yIiwiQXJyYXkiLCJpc0FycmF5IiwicmFuZ2UiLCJfdXBkYXRlQXhpcyIsIm5leHRQcm9wcyIsInNjYWxlIiwieEF4aXMiLCJ0aWNrcyIsInRpY2tTaXplIiwidGlja1BhZGRpbmciLCJzdmdDb250YWluZXIiLCJzZWxlY3QiLCJjYWxsIiwic2VsZWN0QWxsIiwiY29tcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxzQkFBc0IsMkJBQU9DLEdBQTdCLGtCQU1NO0FBQUEsU0FBU0MsTUFBTUMsS0FBTixDQUFZQyxTQUFyQjtBQUFBLENBTk4sRUFZUTtBQUFBLFNBQVNGLE1BQU1DLEtBQU4sQ0FBWUUsWUFBckI7QUFBQSxDQVpSLEVBc0JNO0FBQUEsU0FBU0gsTUFBTUMsS0FBTixDQUFZQyxTQUFyQjtBQUFBLENBdEJOLENBQU47O0FBbUNBLElBQU1FLFlBQVk7QUFDaEJDLFVBQVEsZ0JBQU1DLFNBQU4sQ0FBZ0JDLEtBQWhCLENBQXNCQyxVQURkO0FBRWhCQyxTQUFPLGdCQUFNSCxTQUFOLENBQWdCSSxNQUFoQixDQUF1QkY7QUFGZCxDQUFsQjs7QUFLQSxJQUFNRyxTQUFTLEVBQWY7O0lBRXFCQyxnQjs7Ozs7Ozs7Ozs7Ozs7d05BV25CQyxjLEdBQWlCO0FBQUEsYUFBU2IsTUFBTUssTUFBZjtBQUFBLEssUUFDakJTLGEsR0FBZ0I7QUFBQSxhQUFTZCxNQUFNUyxLQUFmO0FBQUEsSyxRQUNoQk0sYSxHQUFnQiw4QkFDZCxNQUFLRixjQURTLEVBRWQsTUFBS0MsYUFGUyxFQUdkLFVBQUNULE1BQUQsRUFBU0ksS0FBVDtBQUFBLGFBQ0VPLE1BQU1DLE9BQU4sQ0FBY1osTUFBZCxJQUNJLHlCQUNHQSxNQURILENBQ1VBLE1BRFYsRUFFR2EsS0FGSCxDQUVTLENBQUMsQ0FBRCxFQUFJVCxLQUFKLENBRlQsQ0FESixHQUlJLElBTE47QUFBQSxLQUhjLEM7Ozs7O3dDQVpJO0FBQ2xCLFdBQUtVLFdBQUwsQ0FBaUIsS0FBS0osYUFBTCxDQUFtQixLQUFLZixLQUF4QixDQUFqQjtBQUNEOzs7OENBRXlCb0IsUyxFQUFXO0FBQ25DLFVBQUksS0FBS0wsYUFBTCxDQUFtQixLQUFLZixLQUF4QixNQUFtQyxLQUFLZSxhQUFMLENBQW1CSyxTQUFuQixDQUF2QyxFQUFzRTtBQUNwRSxhQUFLRCxXQUFMLENBQWlCLEtBQUtKLGFBQUwsQ0FBbUJLLFNBQW5CLENBQWpCO0FBQ0Q7QUFDRjs7O2dDQWVXQyxLLEVBQU87QUFDakIsVUFBSSxDQUFDQSxLQUFMLEVBQVk7QUFDVjtBQUNEO0FBQ0QsVUFBTUMsUUFBUSx3QkFBV0QsS0FBWCxFQUNYRSxLQURXLENBQ0wsQ0FESyxFQUVYQyxRQUZXLENBRUYsQ0FGRSxFQUdYQyxXQUhXLENBR0MsQ0FIRCxDQUFkOztBQUtBLFVBQU0xQixNQUFNLHlCQUFPLEtBQUsyQixZQUFaLENBQVo7O0FBRUEzQixVQUNHNEIsTUFESCxDQUNVLFNBRFYsRUFFR0MsSUFGSCxDQUVRTixLQUZSLEVBR0dPLFNBSEgsQ0FHYSxNQUhiO0FBSUQ7Ozs2QkFFUTtBQUFBOztBQUNQLGFBQ0U7QUFBQywyQkFBRDtBQUFBO0FBQ0UscUJBQVUsb0JBRFo7QUFFRSxpQkFBTyxLQUFLN0IsS0FBTCxDQUFXUyxLQUZwQjtBQUdFLGtCQUFRRSxNQUhWO0FBSUUsb0JBQVUsd0JBQVE7QUFDaEIsbUJBQUtlLFlBQUwsR0FBb0JJLElBQXBCO0FBQ0Q7QUFOSDtBQVFFLDZDQUFHLFdBQVUsUUFBYixFQUFzQixXQUFVLGlCQUFoQztBQVJGLE9BREY7QUFZRDs7Ozs7a0JBdERrQmxCLGdCOzs7QUF5RHJCQSxpQkFBaUJSLFNBQWpCLEdBQTZCQSxTQUE3QiIsImZpbGUiOiJ0aW1lLXNsaWRlci1tYXJrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7c2NhbGVVdGN9IGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCB7c2VsZWN0fSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHtheGlzQm90dG9tfSBmcm9tICdkMy1heGlzJztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5jb25zdCBUaW1lU2xpZGVyQ29udGFpbmVyID0gc3R5bGVkLnN2Z2BcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICAuYXhpcyB0ZXh0IHtcbiAgICBmb250LXNpemU6IDlweDtcbiAgICBmaWxsOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gIH1cblxuICAuYXhpcyBsaW5lLFxuICAuYXhpcyBwYXRoIHtcbiAgICBmaWxsOiBub25lO1xuICAgIHN0cm9rZTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zbGlkZXJCYXJCZ2R9O1xuICAgIHNoYXBlLXJlbmRlcmluZzogY3Jpc3BFZGdlcztcbiAgICBzdHJva2Utd2lkdGg6IDI7XG4gIH1cblxuICAuYXhpcyAuZG9tYWluIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG5cbiAgLnZhbHVlIHtcbiAgICBmaWxsOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gICAgZm9udC1zaXplOiAxMHB4O1xuXG4gICAgJi5zdGFydCB7XG4gICAgICB0ZXh0LWFuY2hvcjogc3RhcnQ7XG4gICAgfVxuXG4gICAgJi5lbmQge1xuICAgICAgdGV4dC1hbmNob3I6IGVuZDtcbiAgICB9XG4gIH1cbmA7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgZG9tYWluOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgd2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZFxufTtcblxuY29uc3QgaGVpZ2h0ID0gMzA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVTbGlkZXJNYXJrZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl91cGRhdGVBeGlzKHRoaXMuc2NhbGVTZWxlY3Rvcih0aGlzLnByb3BzKSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGlmICh0aGlzLnNjYWxlU2VsZWN0b3IodGhpcy5wcm9wcykgIT09IHRoaXMuc2NhbGVTZWxlY3RvcihuZXh0UHJvcHMpKSB7XG4gICAgICB0aGlzLl91cGRhdGVBeGlzKHRoaXMuc2NhbGVTZWxlY3RvcihuZXh0UHJvcHMpKTtcbiAgICB9XG4gIH1cblxuICBkb21haW5TZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmRvbWFpbjtcbiAgd2lkdGhTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLndpZHRoO1xuICBzY2FsZVNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgdGhpcy5kb21haW5TZWxlY3RvcixcbiAgICB0aGlzLndpZHRoU2VsZWN0b3IsXG4gICAgKGRvbWFpbiwgd2lkdGgpID0+XG4gICAgICBBcnJheS5pc0FycmF5KGRvbWFpbilcbiAgICAgICAgPyBzY2FsZVV0YygpXG4gICAgICAgICAgICAuZG9tYWluKGRvbWFpbilcbiAgICAgICAgICAgIC5yYW5nZShbMCwgd2lkdGhdKVxuICAgICAgICA6IG51bGxcbiAgKTtcblxuICBfdXBkYXRlQXhpcyhzY2FsZSkge1xuICAgIGlmICghc2NhbGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgeEF4aXMgPSBheGlzQm90dG9tKHNjYWxlKVxuICAgICAgLnRpY2tzKDQpXG4gICAgICAudGlja1NpemUoOClcbiAgICAgIC50aWNrUGFkZGluZyg2KTtcblxuICAgIGNvbnN0IHN2ZyA9IHNlbGVjdCh0aGlzLnN2Z0NvbnRhaW5lcik7XG5cbiAgICBzdmdcbiAgICAgIC5zZWxlY3QoJy54LmF4aXMnKVxuICAgICAgLmNhbGwoeEF4aXMpXG4gICAgICAuc2VsZWN0QWxsKCd0ZXh0Jyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUaW1lU2xpZGVyQ29udGFpbmVyXG4gICAgICAgIGNsYXNzTmFtZT1cInRpbWUtc2xpZGVyLW1hcmtlclwiXG4gICAgICAgIHdpZHRoPXt0aGlzLnByb3BzLndpZHRofVxuICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgaW5uZXJSZWY9e2NvbXAgPT4ge1xuICAgICAgICAgIHRoaXMuc3ZnQ29udGFpbmVyID0gY29tcDtcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPGcgY2xhc3NOYW1lPVwieCBheGlzXCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDAsIDApXCIgLz5cbiAgICAgIDwvVGltZVNsaWRlckNvbnRhaW5lcj5cbiAgICApO1xuICB9XG59XG5cblRpbWVTbGlkZXJNYXJrZXIucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuIl19