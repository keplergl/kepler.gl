"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var getStyleClassFromColor = function getStyleClassFromColor(totalColor, colors) {
  return new Array(totalColor).fill(1).reduce(function (accu, c, i) {
    return "".concat(accu, ".cr").concat(i + 1, " {fill:").concat(colors[i % colors.length], ";}");
  }, '');
};

var Base = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Base, _Component);

  var _super = _createSuper(Base);

  function Base() {
    (0, _classCallCheck2["default"])(this, Base);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(Base, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          height = _this$props.height,
          width = _this$props.width,
          viewBox = _this$props.viewBox,
          style = _this$props.style,
          children = _this$props.children,
          predefinedClassName = _this$props.predefinedClassName,
          className = _this$props.className,
          colors = _this$props.colors,
          totalColor = _this$props.totalColor,
          props = (0, _objectWithoutProperties2["default"])(_this$props, ["height", "width", "viewBox", "style", "children", "predefinedClassName", "className", "colors", "totalColor"]);
      var svgHeight = height;
      var svgWidth = width || svgHeight;
      var fillStyle = Array.isArray(colors) && totalColor && getStyleClassFromColor(totalColor, colors);
      return /*#__PURE__*/_react["default"].createElement("svg", (0, _extends2["default"])({
        viewBox: viewBox,
        width: svgWidth,
        height: svgHeight,
        style: style,
        className: "".concat(predefinedClassName, " ").concat(className)
      }, props), fillStyle ? /*#__PURE__*/_react["default"].createElement("style", {
        type: "text/css"
      }, fillStyle) : null, children);
    }
  }]);
  return Base;
}(_react.Component);

exports["default"] = Base;
(0, _defineProperty2["default"])(Base, "displayName", 'Base Icon');
(0, _defineProperty2["default"])(Base, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string,

  /** Set the width of the icon, ex. '16px' */
  width: _propTypes["default"].string,

  /** Set the viewbox of the svg */
  viewBox: _propTypes["default"].string,

  /** Path element */
  children: _propTypes["default"].node,
  predefinedClassName: _propTypes["default"].string,
  className: _propTypes["default"].string
});
(0, _defineProperty2["default"])(Base, "defaultProps", {
  height: null,
  width: null,
  viewBox: '0 0 64 64',
  predefinedClassName: '',
  className: '',
  style: {
    fill: 'currentColor'
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9iYXNlLmpzIl0sIm5hbWVzIjpbImdldFN0eWxlQ2xhc3NGcm9tQ29sb3IiLCJ0b3RhbENvbG9yIiwiY29sb3JzIiwiQXJyYXkiLCJmaWxsIiwicmVkdWNlIiwiYWNjdSIsImMiLCJpIiwibGVuZ3RoIiwiQmFzZSIsInByb3BzIiwiaGVpZ2h0Iiwid2lkdGgiLCJ2aWV3Qm94Iiwic3R5bGUiLCJjaGlsZHJlbiIsInByZWRlZmluZWRDbGFzc05hbWUiLCJjbGFzc05hbWUiLCJzdmdIZWlnaHQiLCJzdmdXaWR0aCIsImZpbGxTdHlsZSIsImlzQXJyYXkiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJub2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLHNCQUFzQixHQUFHLFNBQXpCQSxzQkFBeUIsQ0FBQ0MsVUFBRCxFQUFhQyxNQUFiO0FBQUEsU0FDN0IsSUFBSUMsS0FBSixDQUFVRixVQUFWLEVBQ0dHLElBREgsQ0FDUSxDQURSLEVBRUdDLE1BRkgsQ0FFVSxVQUFDQyxJQUFELEVBQU9DLENBQVAsRUFBVUMsQ0FBVjtBQUFBLHFCQUFtQkYsSUFBbkIsZ0JBQTZCRSxDQUFDLEdBQUcsQ0FBakMsb0JBQTRDTixNQUFNLENBQUNNLENBQUMsR0FBR04sTUFBTSxDQUFDTyxNQUFaLENBQWxEO0FBQUEsR0FGVixFQUVxRixFQUZyRixDQUQ2QjtBQUFBLENBQS9COztJQUtxQkMsSTs7Ozs7Ozs7Ozs7O1dBNEJuQixrQkFBUztBQUFBLHdCQVlILEtBQUtDLEtBWkY7QUFBQSxVQUVMQyxNQUZLLGVBRUxBLE1BRks7QUFBQSxVQUdMQyxLQUhLLGVBR0xBLEtBSEs7QUFBQSxVQUlMQyxPQUpLLGVBSUxBLE9BSks7QUFBQSxVQUtMQyxLQUxLLGVBS0xBLEtBTEs7QUFBQSxVQU1MQyxRQU5LLGVBTUxBLFFBTks7QUFBQSxVQU9MQyxtQkFQSyxlQU9MQSxtQkFQSztBQUFBLFVBUUxDLFNBUkssZUFRTEEsU0FSSztBQUFBLFVBU0xoQixNQVRLLGVBU0xBLE1BVEs7QUFBQSxVQVVMRCxVQVZLLGVBVUxBLFVBVks7QUFBQSxVQVdGVSxLQVhFO0FBYVAsVUFBTVEsU0FBUyxHQUFHUCxNQUFsQjtBQUNBLFVBQU1RLFFBQVEsR0FBR1AsS0FBSyxJQUFJTSxTQUExQjtBQUVBLFVBQU1FLFNBQVMsR0FDYmxCLEtBQUssQ0FBQ21CLE9BQU4sQ0FBY3BCLE1BQWQsS0FBeUJELFVBQXpCLElBQXVDRCxzQkFBc0IsQ0FBQ0MsVUFBRCxFQUFhQyxNQUFiLENBRC9EO0FBR0EsMEJBQ0U7QUFDRSxRQUFBLE9BQU8sRUFBRVksT0FEWDtBQUVFLFFBQUEsS0FBSyxFQUFFTSxRQUZUO0FBR0UsUUFBQSxNQUFNLEVBQUVELFNBSFY7QUFJRSxRQUFBLEtBQUssRUFBRUosS0FKVDtBQUtFLFFBQUEsU0FBUyxZQUFLRSxtQkFBTCxjQUE0QkMsU0FBNUI7QUFMWCxTQU1NUCxLQU5OLEdBUUdVLFNBQVMsZ0JBQUc7QUFBTyxRQUFBLElBQUksRUFBQztBQUFaLFNBQXdCQSxTQUF4QixDQUFILEdBQWdELElBUjVELEVBU0dMLFFBVEgsQ0FERjtBQWFEOzs7RUE1RCtCTyxnQjs7O2lDQUFiYixJLGlCQUNFLFc7aUNBREZBLEksZUFHQTtBQUNqQjtBQUNBRSxFQUFBQSxNQUFNLEVBQUVZLHNCQUFVQyxNQUZEOztBQUdqQjtBQUNBWixFQUFBQSxLQUFLLEVBQUVXLHNCQUFVQyxNQUpBOztBQUtqQjtBQUNBWCxFQUFBQSxPQUFPLEVBQUVVLHNCQUFVQyxNQU5GOztBQU9qQjtBQUNBVCxFQUFBQSxRQUFRLEVBQUVRLHNCQUFVRSxJQVJIO0FBVWpCVCxFQUFBQSxtQkFBbUIsRUFBRU8sc0JBQVVDLE1BVmQ7QUFXakJQLEVBQUFBLFNBQVMsRUFBRU0sc0JBQVVDO0FBWEosQztpQ0FIQWYsSSxrQkFpQkc7QUFDcEJFLEVBQUFBLE1BQU0sRUFBRSxJQURZO0FBRXBCQyxFQUFBQSxLQUFLLEVBQUUsSUFGYTtBQUdwQkMsRUFBQUEsT0FBTyxFQUFFLFdBSFc7QUFJcEJHLEVBQUFBLG1CQUFtQixFQUFFLEVBSkQ7QUFLcEJDLEVBQUFBLFNBQVMsRUFBRSxFQUxTO0FBTXBCSCxFQUFBQSxLQUFLLEVBQUU7QUFDTFgsSUFBQUEsSUFBSSxFQUFFO0FBREQ7QUFOYSxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5jb25zdCBnZXRTdHlsZUNsYXNzRnJvbUNvbG9yID0gKHRvdGFsQ29sb3IsIGNvbG9ycykgPT5cbiAgbmV3IEFycmF5KHRvdGFsQ29sb3IpXG4gICAgLmZpbGwoMSlcbiAgICAucmVkdWNlKChhY2N1LCBjLCBpKSA9PiBgJHthY2N1fS5jciR7aSArIDF9IHtmaWxsOiR7Y29sb3JzW2kgJSBjb2xvcnMubGVuZ3RoXX07fWAsICcnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdCYXNlIEljb24nO1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIC8qKiBTZXQgdGhlIHdpZHRoIG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgd2lkdGg6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgLyoqIFNldCB0aGUgdmlld2JveCBvZiB0aGUgc3ZnICovXG4gICAgdmlld0JveDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAvKiogUGF0aCBlbGVtZW50ICovXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5ub2RlLFxuXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmdcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhlaWdodDogbnVsbCxcbiAgICB3aWR0aDogbnVsbCxcbiAgICB2aWV3Qm94OiAnMCAwIDY0IDY0JyxcbiAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnJyxcbiAgICBjbGFzc05hbWU6ICcnLFxuICAgIHN0eWxlOiB7XG4gICAgICBmaWxsOiAnY3VycmVudENvbG9yJ1xuICAgIH1cbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgaGVpZ2h0LFxuICAgICAgd2lkdGgsXG4gICAgICB2aWV3Qm94LFxuICAgICAgc3R5bGUsXG4gICAgICBjaGlsZHJlbixcbiAgICAgIHByZWRlZmluZWRDbGFzc05hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBjb2xvcnMsXG4gICAgICB0b3RhbENvbG9yLFxuICAgICAgLi4ucHJvcHNcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBzdmdIZWlnaHQgPSBoZWlnaHQ7XG4gICAgY29uc3Qgc3ZnV2lkdGggPSB3aWR0aCB8fCBzdmdIZWlnaHQ7XG5cbiAgICBjb25zdCBmaWxsU3R5bGUgPVxuICAgICAgQXJyYXkuaXNBcnJheShjb2xvcnMpICYmIHRvdGFsQ29sb3IgJiYgZ2V0U3R5bGVDbGFzc0Zyb21Db2xvcih0b3RhbENvbG9yLCBjb2xvcnMpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmdcbiAgICAgICAgdmlld0JveD17dmlld0JveH1cbiAgICAgICAgd2lkdGg9e3N2Z1dpZHRofVxuICAgICAgICBoZWlnaHQ9e3N2Z0hlaWdodH1cbiAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICBjbGFzc05hbWU9e2Ake3ByZWRlZmluZWRDbGFzc05hbWV9ICR7Y2xhc3NOYW1lfWB9XG4gICAgICAgIHsuLi5wcm9wc31cbiAgICAgID5cbiAgICAgICAge2ZpbGxTdHlsZSA/IDxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj57ZmlsbFN0eWxlfTwvc3R5bGU+IDogbnVsbH1cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9zdmc+XG4gICAgKTtcbiAgfVxufVxuIl19