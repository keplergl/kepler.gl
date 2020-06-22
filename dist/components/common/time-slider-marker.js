"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _d3Scale = require("d3-scale");

var _d3Selection = require("d3-selection");

var _d3Axis = require("d3-axis");

var _reselect = require("reselect");

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  .axis text {\n    font-size: 9px;\n    fill: ", ";\n  }\n\n  .axis line,\n  .axis path {\n    fill: none;\n    stroke: ", ";\n    shape-rendering: crispEdges;\n    stroke-width: 2;\n  }\n\n  .axis .domain {\n    display: none;\n  }\n\n  .value {\n    fill: ", ";\n    font-size: 10px;\n\n    &.start {\n      text-anchor: start;\n    }\n\n    &.end {\n      text-anchor: end;\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var TimeSliderContainer = _styledComponents["default"].svg(_templateObject(), function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.sliderBarBgd;
}, function (props) {
  return props.theme.textColor;
});

var height = 30;

var TimeSliderMarker =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(TimeSliderMarker, _Component);

  function TimeSliderMarker() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, TimeSliderMarker);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(TimeSliderMarker)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "xAxis", (0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "domainSelector", function (props) {
      return props.domain;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "widthSelector", function (props) {
      return props.width;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "scaleSelector", (0, _reselect.createSelector)(_this.domainSelector, _this.widthSelector, function (domain, width) {
      return Array.isArray(domain) ? (0, _d3Scale.scaleUtc)().domain(domain).range([0, width]) : null;
    }));
    return _this;
  }

  (0, _createClass2["default"])(TimeSliderMarker, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._updateAxis(this.scaleSelector(this.props));
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.scaleSelector(this.props) !== this.scaleSelector(prevProps)) {
        this._updateAxis(this.scaleSelector(this.props));
      }
    }
  }, {
    key: "_updateAxis",
    value: function _updateAxis(scale) {
      if (!scale) {
        return;
      }

      var xAxis = (0, _d3Axis.axisBottom)(scale).ticks(4).tickSize(8).tickPadding(6);
      (0, _d3Selection.select)(this.xAxis.current).call(xAxis);
    }
  }, {
    key: "render",
    value: function render() {
      return _react["default"].createElement(TimeSliderContainer, {
        className: "time-slider-marker",
        width: this.props.width,
        height: height
      }, _react["default"].createElement("g", {
        className: "x axis",
        ref: this.xAxis,
        transform: "translate(0, 0)"
      }));
    }
  }]);
  return TimeSliderMarker;
}(_react.Component);

exports["default"] = TimeSliderMarker;
(0, _defineProperty2["default"])(TimeSliderMarker, "propTypes", {
  domain: _propTypes["default"].arrayOf(_propTypes["default"].any).isRequired,
  width: _propTypes["default"].number.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi90aW1lLXNsaWRlci1tYXJrZXIuanMiXSwibmFtZXMiOlsiVGltZVNsaWRlckNvbnRhaW5lciIsInN0eWxlZCIsInN2ZyIsInByb3BzIiwidGhlbWUiLCJ0ZXh0Q29sb3IiLCJzbGlkZXJCYXJCZ2QiLCJoZWlnaHQiLCJUaW1lU2xpZGVyTWFya2VyIiwiZG9tYWluIiwid2lkdGgiLCJkb21haW5TZWxlY3RvciIsIndpZHRoU2VsZWN0b3IiLCJBcnJheSIsImlzQXJyYXkiLCJyYW5nZSIsIl91cGRhdGVBeGlzIiwic2NhbGVTZWxlY3RvciIsInByZXZQcm9wcyIsInNjYWxlIiwieEF4aXMiLCJ0aWNrcyIsInRpY2tTaXplIiwidGlja1BhZGRpbmciLCJjdXJyZW50IiwiY2FsbCIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsImFycmF5T2YiLCJhbnkiLCJpc1JlcXVpcmVkIiwibnVtYmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLG1CQUFtQixHQUFHQyw2QkFBT0MsR0FBVixvQkFNYixVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFNBQWhCO0FBQUEsQ0FOUSxFQVlYLFVBQUFGLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUUsWUFBaEI7QUFBQSxDQVpNLEVBc0JiLFVBQUFILEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsU0FBaEI7QUFBQSxDQXRCUSxDQUF6Qjs7QUFtQ0EsSUFBTUUsTUFBTSxHQUFHLEVBQWY7O0lBRXFCQyxnQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OEZBZ0JYLHVCO3VHQUVTLFVBQUFMLEtBQUs7QUFBQSxhQUFJQSxLQUFLLENBQUNNLE1BQVY7QUFBQSxLO3NHQUNOLFVBQUFOLEtBQUs7QUFBQSxhQUFJQSxLQUFLLENBQUNPLEtBQVY7QUFBQSxLO3NHQUNMLDhCQUFlLE1BQUtDLGNBQXBCLEVBQW9DLE1BQUtDLGFBQXpDLEVBQXdELFVBQUNILE1BQUQsRUFBU0MsS0FBVDtBQUFBLGFBQ3RFRyxLQUFLLENBQUNDLE9BQU4sQ0FBY0wsTUFBZCxJQUNJLHlCQUNHQSxNQURILENBQ1VBLE1BRFYsRUFFR00sS0FGSCxDQUVTLENBQUMsQ0FBRCxFQUFJTCxLQUFKLENBRlQsQ0FESixHQUlJLElBTGtFO0FBQUEsS0FBeEQsQzs7Ozs7O3dDQWRJO0FBQ2xCLFdBQUtNLFdBQUwsQ0FBaUIsS0FBS0MsYUFBTCxDQUFtQixLQUFLZCxLQUF4QixDQUFqQjtBQUNEOzs7dUNBRWtCZSxTLEVBQVc7QUFDNUIsVUFBSSxLQUFLRCxhQUFMLENBQW1CLEtBQUtkLEtBQXhCLE1BQW1DLEtBQUtjLGFBQUwsQ0FBbUJDLFNBQW5CLENBQXZDLEVBQXNFO0FBQ3BFLGFBQUtGLFdBQUwsQ0FBaUIsS0FBS0MsYUFBTCxDQUFtQixLQUFLZCxLQUF4QixDQUFqQjtBQUNEO0FBQ0Y7OztnQ0FjV2dCLEssRUFBTztBQUNqQixVQUFJLENBQUNBLEtBQUwsRUFBWTtBQUNWO0FBQ0Q7O0FBQ0QsVUFBTUMsS0FBSyxHQUFHLHdCQUFXRCxLQUFYLEVBQ1hFLEtBRFcsQ0FDTCxDQURLLEVBRVhDLFFBRlcsQ0FFRixDQUZFLEVBR1hDLFdBSFcsQ0FHQyxDQUhELENBQWQ7QUFLQSwrQkFBTyxLQUFLSCxLQUFMLENBQVdJLE9BQWxCLEVBQTJCQyxJQUEzQixDQUFnQ0wsS0FBaEM7QUFDRDs7OzZCQUVRO0FBQ1AsYUFDRSxnQ0FBQyxtQkFBRDtBQUFxQixRQUFBLFNBQVMsRUFBQyxvQkFBL0I7QUFBb0QsUUFBQSxLQUFLLEVBQUUsS0FBS2pCLEtBQUwsQ0FBV08sS0FBdEU7QUFBNkUsUUFBQSxNQUFNLEVBQUVIO0FBQXJGLFNBQ0U7QUFBRyxRQUFBLFNBQVMsRUFBQyxRQUFiO0FBQXNCLFFBQUEsR0FBRyxFQUFFLEtBQUthLEtBQWhDO0FBQXVDLFFBQUEsU0FBUyxFQUFDO0FBQWpELFFBREYsQ0FERjtBQUtEOzs7RUE5QzJDTSxnQjs7O2lDQUF6QmxCLGdCLGVBQ0E7QUFDakJDLEVBQUFBLE1BQU0sRUFBRWtCLHNCQUFVQyxPQUFWLENBQWtCRCxzQkFBVUUsR0FBNUIsRUFBaUNDLFVBRHhCO0FBRWpCcEIsRUFBQUEsS0FBSyxFQUFFaUIsc0JBQVVJLE1BQVYsQ0FBaUJEO0FBRlAsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudCwgY3JlYXRlUmVmfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtzY2FsZVV0Y30gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHtzZWxlY3R9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQge2F4aXNCb3R0b219IGZyb20gJ2QzLWF4aXMnO1xuaW1wb3J0IHtjcmVhdGVTZWxlY3Rvcn0gZnJvbSAncmVzZWxlY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmNvbnN0IFRpbWVTbGlkZXJDb250YWluZXIgPSBzdHlsZWQuc3ZnYFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIC5heGlzIHRleHQge1xuICAgIGZvbnQtc2l6ZTogOXB4O1xuICAgIGZpbGw6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgfVxuXG4gIC5heGlzIGxpbmUsXG4gIC5heGlzIHBhdGgge1xuICAgIGZpbGw6IG5vbmU7XG4gICAgc3Ryb2tlOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNsaWRlckJhckJnZH07XG4gICAgc2hhcGUtcmVuZGVyaW5nOiBjcmlzcEVkZ2VzO1xuICAgIHN0cm9rZS13aWR0aDogMjtcbiAgfVxuXG4gIC5heGlzIC5kb21haW4ge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cblxuICAudmFsdWUge1xuICAgIGZpbGw6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgICBmb250LXNpemU6IDEwcHg7XG5cbiAgICAmLnN0YXJ0IHtcbiAgICAgIHRleHQtYW5jaG9yOiBzdGFydDtcbiAgICB9XG5cbiAgICAmLmVuZCB7XG4gICAgICB0ZXh0LWFuY2hvcjogZW5kO1xuICAgIH1cbiAgfVxuYDtcblxuY29uc3QgaGVpZ2h0ID0gMzA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVTbGlkZXJNYXJrZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGRvbWFpbjogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSkuaXNSZXF1aXJlZCxcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG4gIH07XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5fdXBkYXRlQXhpcyh0aGlzLnNjYWxlU2VsZWN0b3IodGhpcy5wcm9wcykpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIGlmICh0aGlzLnNjYWxlU2VsZWN0b3IodGhpcy5wcm9wcykgIT09IHRoaXMuc2NhbGVTZWxlY3RvcihwcmV2UHJvcHMpKSB7XG4gICAgICB0aGlzLl91cGRhdGVBeGlzKHRoaXMuc2NhbGVTZWxlY3Rvcih0aGlzLnByb3BzKSk7XG4gICAgfVxuICB9XG5cbiAgeEF4aXMgPSBjcmVhdGVSZWYoKTtcblxuICBkb21haW5TZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmRvbWFpbjtcbiAgd2lkdGhTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLndpZHRoO1xuICBzY2FsZVNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IodGhpcy5kb21haW5TZWxlY3RvciwgdGhpcy53aWR0aFNlbGVjdG9yLCAoZG9tYWluLCB3aWR0aCkgPT5cbiAgICBBcnJheS5pc0FycmF5KGRvbWFpbilcbiAgICAgID8gc2NhbGVVdGMoKVxuICAgICAgICAgIC5kb21haW4oZG9tYWluKVxuICAgICAgICAgIC5yYW5nZShbMCwgd2lkdGhdKVxuICAgICAgOiBudWxsXG4gICk7XG5cbiAgX3VwZGF0ZUF4aXMoc2NhbGUpIHtcbiAgICBpZiAoIXNjYWxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHhBeGlzID0gYXhpc0JvdHRvbShzY2FsZSlcbiAgICAgIC50aWNrcyg0KVxuICAgICAgLnRpY2tTaXplKDgpXG4gICAgICAudGlja1BhZGRpbmcoNik7XG5cbiAgICBzZWxlY3QodGhpcy54QXhpcy5jdXJyZW50KS5jYWxsKHhBeGlzKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFRpbWVTbGlkZXJDb250YWluZXIgY2xhc3NOYW1lPVwidGltZS1zbGlkZXItbWFya2VyXCIgd2lkdGg9e3RoaXMucHJvcHMud2lkdGh9IGhlaWdodD17aGVpZ2h0fT5cbiAgICAgICAgPGcgY2xhc3NOYW1lPVwieCBheGlzXCIgcmVmPXt0aGlzLnhBeGlzfSB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMCwgMClcIiAvPlxuICAgICAgPC9UaW1lU2xpZGVyQ29udGFpbmVyPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==