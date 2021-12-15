"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _mouseEvent = _interopRequireDefault(require("./mouse-event"));

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var StyledSlider = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  position: relative;\n  background-color: ", ";\n  ", ";\n  border-radius: ", ";\n  :hover {\n    cursor: pointer;\n  }\n"])), function (props) {
  return props.active ? props.theme.sliderBarHoverColor : props.theme.sliderBarColor;
}, function (props) {
  return "".concat(props.vertical ? 'width' : 'height', ": ").concat(props.theme.sliderBarHeight, "px");
}, function (props) {
  return props.theme.sliderBarRadius;
});

function nope() {}

var SliderBarHandle = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(SliderBarHandle, _Component);

  var _super = _createSuper(SliderBarHandle);

  function SliderBarHandle(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, SliderBarHandle);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
      mouseOver: false
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "toggleMouseOver", function () {
      _this.setState({
        mouseOver: !_this.state.mouseOver
      });
    });
    _this.mouseEvent = new _mouseEvent["default"]({
      vertical: props.vertical,
      valueListener: props.sliderBarListener,
      toggleMouseOver: _this.toggleMouseOver,
      track: props.track,
      setAnchor: props.setAnchor
    });
    return _this;
  }

  (0, _createClass2["default"])(SliderBarHandle, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          width = _this$props.width,
          v0Left = _this$props.v0Left;
      var style = this.props.vertical ? {
        height: "".concat(width, "%"),
        bottom: "".concat(-100 + width + v0Left, "%")
      } : {
        width: "".concat(width, "%"),
        left: "".concat(v0Left, "%")
      };
      return /*#__PURE__*/_react["default"].createElement(StyledSlider, {
        active: this.state.mouseOver,
        className: (0, _classnames["default"])('kg-range-slider__bar', {
          'kg-range-slider__bar--active': this.state.mouseOver
        }),
        style: style,
        onMouseDown: this.props.enableBarDrag ? this.mouseEvent.handleMouseDown : nope,
        onTouchStart: this.props.enableBarDrag ? this.mouseEvent.handleTouchStart : nope
      });
    }
  }]);
  return SliderBarHandle;
}(_react.Component);

exports["default"] = SliderBarHandle;
(0, _defineProperty2["default"])(SliderBarHandle, "propTypes", {
  width: _propTypes["default"].number,
  left: _propTypes["default"].string,
  sliderBarListener: _propTypes["default"].func,
  enableBarDrag: _propTypes["default"].bool,
  vertical: _propTypes["default"].bool
});
(0, _defineProperty2["default"])(SliderBarHandle, "defaultProps", {
  sliderBarListener: nope,
  enableBarDrag: false,
  vertical: false
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zbGlkZXIvc2xpZGVyLWJhci1oYW5kbGUuanMiXSwibmFtZXMiOlsiU3R5bGVkU2xpZGVyIiwic3R5bGVkIiwiZGl2IiwicHJvcHMiLCJhY3RpdmUiLCJ0aGVtZSIsInNsaWRlckJhckhvdmVyQ29sb3IiLCJzbGlkZXJCYXJDb2xvciIsInZlcnRpY2FsIiwic2xpZGVyQmFySGVpZ2h0Iiwic2xpZGVyQmFyUmFkaXVzIiwibm9wZSIsIlNsaWRlckJhckhhbmRsZSIsIm1vdXNlT3ZlciIsInNldFN0YXRlIiwic3RhdGUiLCJtb3VzZUV2ZW50IiwiTW91c2VFdmVudEhhbmRsZXIiLCJ2YWx1ZUxpc3RlbmVyIiwic2xpZGVyQmFyTGlzdGVuZXIiLCJ0b2dnbGVNb3VzZU92ZXIiLCJ0cmFjayIsInNldEFuY2hvciIsIndpZHRoIiwidjBMZWZ0Iiwic3R5bGUiLCJoZWlnaHQiLCJib3R0b20iLCJsZWZ0IiwiZW5hYmxlQmFyRHJhZyIsImhhbmRsZU1vdXNlRG93biIsImhhbmRsZVRvdWNoU3RhcnQiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJudW1iZXIiLCJzdHJpbmciLCJmdW5jIiwiYm9vbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVBLElBQU1BLFlBQVksR0FBR0MsNkJBQU9DLEdBQVYsbU5BRUksVUFBQUMsS0FBSztBQUFBLFNBQ3ZCQSxLQUFLLENBQUNDLE1BQU4sR0FBZUQsS0FBSyxDQUFDRSxLQUFOLENBQVlDLG1CQUEzQixHQUFpREgsS0FBSyxDQUFDRSxLQUFOLENBQVlFLGNBRHRDO0FBQUEsQ0FGVCxFQUlkLFVBQUFKLEtBQUs7QUFBQSxtQkFBT0EsS0FBSyxDQUFDSyxRQUFOLEdBQWlCLE9BQWpCLEdBQTJCLFFBQWxDLGVBQStDTCxLQUFLLENBQUNFLEtBQU4sQ0FBWUksZUFBM0Q7QUFBQSxDQUpTLEVBS0MsVUFBQU4sS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0UsS0FBTixDQUFZSyxlQUFoQjtBQUFBLENBTE4sQ0FBbEI7O0FBV0EsU0FBU0MsSUFBVCxHQUFnQixDQUFFOztJQUVHQyxlOzs7OztBQWVuQiwyQkFBWVQsS0FBWixFQUFtQjtBQUFBOztBQUFBO0FBQ2pCLDhCQUFNQSxLQUFOO0FBRGlCLDhGQVdYO0FBQUNVLE1BQUFBLFNBQVMsRUFBRTtBQUFaLEtBWFc7QUFBQSx3R0FhRCxZQUFNO0FBQ3RCLFlBQUtDLFFBQUwsQ0FBYztBQUFDRCxRQUFBQSxTQUFTLEVBQUUsQ0FBQyxNQUFLRSxLQUFMLENBQVdGO0FBQXhCLE9BQWQ7QUFDRCxLQWZrQjtBQUVqQixVQUFLRyxVQUFMLEdBQWtCLElBQUlDLHNCQUFKLENBQXNCO0FBQ3RDVCxNQUFBQSxRQUFRLEVBQUVMLEtBQUssQ0FBQ0ssUUFEc0I7QUFFdENVLE1BQUFBLGFBQWEsRUFBRWYsS0FBSyxDQUFDZ0IsaUJBRmlCO0FBR3RDQyxNQUFBQSxlQUFlLEVBQUUsTUFBS0EsZUFIZ0I7QUFJdENDLE1BQUFBLEtBQUssRUFBRWxCLEtBQUssQ0FBQ2tCLEtBSnlCO0FBS3RDQyxNQUFBQSxTQUFTLEVBQUVuQixLQUFLLENBQUNtQjtBQUxxQixLQUF0QixDQUFsQjtBQUZpQjtBQVNsQjs7OztXQVFELGtCQUFTO0FBQUEsd0JBQ2lCLEtBQUtuQixLQUR0QjtBQUFBLFVBQ0FvQixLQURBLGVBQ0FBLEtBREE7QUFBQSxVQUNPQyxNQURQLGVBQ09BLE1BRFA7QUFHUCxVQUFNQyxLQUFLLEdBQUcsS0FBS3RCLEtBQUwsQ0FBV0ssUUFBWCxHQUNWO0FBQ0VrQixRQUFBQSxNQUFNLFlBQUtILEtBQUwsTUFEUjtBQUVFSSxRQUFBQSxNQUFNLFlBQUssQ0FBQyxHQUFELEdBQU9KLEtBQVAsR0FBZUMsTUFBcEI7QUFGUixPQURVLEdBS1Y7QUFDRUQsUUFBQUEsS0FBSyxZQUFLQSxLQUFMLE1BRFA7QUFFRUssUUFBQUEsSUFBSSxZQUFLSixNQUFMO0FBRk4sT0FMSjtBQVVBLDBCQUNFLGdDQUFDLFlBQUQ7QUFDRSxRQUFBLE1BQU0sRUFBRSxLQUFLVCxLQUFMLENBQVdGLFNBRHJCO0FBRUUsUUFBQSxTQUFTLEVBQUUsNEJBQVcsc0JBQVgsRUFBbUM7QUFDNUMsMENBQWdDLEtBQUtFLEtBQUwsQ0FBV0Y7QUFEQyxTQUFuQyxDQUZiO0FBS0UsUUFBQSxLQUFLLEVBQUVZLEtBTFQ7QUFNRSxRQUFBLFdBQVcsRUFBRSxLQUFLdEIsS0FBTCxDQUFXMEIsYUFBWCxHQUEyQixLQUFLYixVQUFMLENBQWdCYyxlQUEzQyxHQUE2RG5CLElBTjVFO0FBT0UsUUFBQSxZQUFZLEVBQUUsS0FBS1IsS0FBTCxDQUFXMEIsYUFBWCxHQUEyQixLQUFLYixVQUFMLENBQWdCZSxnQkFBM0MsR0FBOERwQjtBQVA5RSxRQURGO0FBV0Q7OztFQXhEMENxQixnQjs7O2lDQUF4QnBCLGUsZUFDQTtBQUNqQlcsRUFBQUEsS0FBSyxFQUFFVSxzQkFBVUMsTUFEQTtBQUVqQk4sRUFBQUEsSUFBSSxFQUFFSyxzQkFBVUUsTUFGQztBQUdqQmhCLEVBQUFBLGlCQUFpQixFQUFFYyxzQkFBVUcsSUFIWjtBQUlqQlAsRUFBQUEsYUFBYSxFQUFFSSxzQkFBVUksSUFKUjtBQUtqQjdCLEVBQUFBLFFBQVEsRUFBRXlCLHNCQUFVSTtBQUxILEM7aUNBREF6QixlLGtCQVNHO0FBQ3BCTyxFQUFBQSxpQkFBaUIsRUFBRVIsSUFEQztBQUVwQmtCLEVBQUFBLGFBQWEsRUFBRSxLQUZLO0FBR3BCckIsRUFBQUEsUUFBUSxFQUFFO0FBSFUsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgTW91c2VFdmVudEhhbmRsZXIgZnJvbSAnLi9tb3VzZS1ldmVudCc7XG5cbmNvbnN0IFN0eWxlZFNsaWRlciA9IHN0eWxlZC5kaXZgXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLmFjdGl2ZSA/IHByb3BzLnRoZW1lLnNsaWRlckJhckhvdmVyQ29sb3IgOiBwcm9wcy50aGVtZS5zbGlkZXJCYXJDb2xvcn07XG4gICR7cHJvcHMgPT4gYCR7cHJvcHMudmVydGljYWwgPyAnd2lkdGgnIDogJ2hlaWdodCd9OiAke3Byb3BzLnRoZW1lLnNsaWRlckJhckhlaWdodH1weGB9O1xuICBib3JkZXItcmFkaXVzOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNsaWRlckJhclJhZGl1c307XG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG5gO1xuXG5mdW5jdGlvbiBub3BlKCkge31cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2xpZGVyQmFySGFuZGxlIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBsZWZ0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHNsaWRlckJhckxpc3RlbmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBlbmFibGVCYXJEcmFnOiBQcm9wVHlwZXMuYm9vbCxcbiAgICB2ZXJ0aWNhbDogUHJvcFR5cGVzLmJvb2xcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHNsaWRlckJhckxpc3RlbmVyOiBub3BlLFxuICAgIGVuYWJsZUJhckRyYWc6IGZhbHNlLFxuICAgIHZlcnRpY2FsOiBmYWxzZVxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMubW91c2VFdmVudCA9IG5ldyBNb3VzZUV2ZW50SGFuZGxlcih7XG4gICAgICB2ZXJ0aWNhbDogcHJvcHMudmVydGljYWwsXG4gICAgICB2YWx1ZUxpc3RlbmVyOiBwcm9wcy5zbGlkZXJCYXJMaXN0ZW5lcixcbiAgICAgIHRvZ2dsZU1vdXNlT3ZlcjogdGhpcy50b2dnbGVNb3VzZU92ZXIsXG4gICAgICB0cmFjazogcHJvcHMudHJhY2ssXG4gICAgICBzZXRBbmNob3I6IHByb3BzLnNldEFuY2hvclxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGUgPSB7bW91c2VPdmVyOiBmYWxzZX07XG5cbiAgdG9nZ2xlTW91c2VPdmVyID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe21vdXNlT3ZlcjogIXRoaXMuc3RhdGUubW91c2VPdmVyfSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHt3aWR0aCwgdjBMZWZ0fSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBzdHlsZSA9IHRoaXMucHJvcHMudmVydGljYWxcbiAgICAgID8ge1xuICAgICAgICAgIGhlaWdodDogYCR7d2lkdGh9JWAsXG4gICAgICAgICAgYm90dG9tOiBgJHstMTAwICsgd2lkdGggKyB2MExlZnR9JWBcbiAgICAgICAgfVxuICAgICAgOiB7XG4gICAgICAgICAgd2lkdGg6IGAke3dpZHRofSVgLFxuICAgICAgICAgIGxlZnQ6IGAke3YwTGVmdH0lYFxuICAgICAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRTbGlkZXJcbiAgICAgICAgYWN0aXZlPXt0aGlzLnN0YXRlLm1vdXNlT3Zlcn1cbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdrZy1yYW5nZS1zbGlkZXJfX2JhcicsIHtcbiAgICAgICAgICAna2ctcmFuZ2Utc2xpZGVyX19iYXItLWFjdGl2ZSc6IHRoaXMuc3RhdGUubW91c2VPdmVyXG4gICAgICAgIH0pfVxuICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgIG9uTW91c2VEb3duPXt0aGlzLnByb3BzLmVuYWJsZUJhckRyYWcgPyB0aGlzLm1vdXNlRXZlbnQuaGFuZGxlTW91c2VEb3duIDogbm9wZX1cbiAgICAgICAgb25Ub3VjaFN0YXJ0PXt0aGlzLnByb3BzLmVuYWJsZUJhckRyYWcgPyB0aGlzLm1vdXNlRXZlbnQuaGFuZGxlVG91Y2hTdGFydCA6IG5vcGV9XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==