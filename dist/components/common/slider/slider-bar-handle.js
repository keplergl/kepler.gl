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

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _mouseEvent = _interopRequireDefault(require("./mouse-event"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  position: relative;\n  background-color: ", ";\n  ", ";\n  border-radius: ", ";\n\n  :hover {\n    cursor: pointer;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledSlider = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.active ? props.theme.sliderBarHoverColor : props.theme.sliderBarColor;
}, function (props) {
  return "".concat(props.vertical ? 'width' : 'height', ": ").concat(props.theme.sliderBarHeight, "px");
}, function (props) {
  return props.theme.sliderBarRadius;
});

function nope() {}

var SliderBarHandle =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(SliderBarHandle, _Component);

  function SliderBarHandle(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, SliderBarHandle);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(SliderBarHandle).call(this, props));
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
      toggleMouseOver: _this.toggleMouseOver
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
      return _react["default"].createElement(StyledSlider, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zbGlkZXIvc2xpZGVyLWJhci1oYW5kbGUuanMiXSwibmFtZXMiOlsiU3R5bGVkU2xpZGVyIiwic3R5bGVkIiwiZGl2IiwicHJvcHMiLCJhY3RpdmUiLCJ0aGVtZSIsInNsaWRlckJhckhvdmVyQ29sb3IiLCJzbGlkZXJCYXJDb2xvciIsInZlcnRpY2FsIiwic2xpZGVyQmFySGVpZ2h0Iiwic2xpZGVyQmFyUmFkaXVzIiwibm9wZSIsIlNsaWRlckJhckhhbmRsZSIsIm1vdXNlT3ZlciIsInNldFN0YXRlIiwic3RhdGUiLCJtb3VzZUV2ZW50IiwiTW91c2VFdmVudEhhbmRsZXIiLCJ2YWx1ZUxpc3RlbmVyIiwic2xpZGVyQmFyTGlzdGVuZXIiLCJ0b2dnbGVNb3VzZU92ZXIiLCJ3aWR0aCIsInYwTGVmdCIsInN0eWxlIiwiaGVpZ2h0IiwiYm90dG9tIiwibGVmdCIsImVuYWJsZUJhckRyYWciLCJoYW5kbGVNb3VzZURvd24iLCJoYW5kbGVUb3VjaFN0YXJ0IiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwibnVtYmVyIiwic3RyaW5nIiwiZnVuYyIsImJvb2wiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsWUFBWSxHQUFHQyw2QkFBT0MsR0FBVixvQkFFSSxVQUFBQyxLQUFLO0FBQUEsU0FDdkJBLEtBQUssQ0FBQ0MsTUFBTixHQUFlRCxLQUFLLENBQUNFLEtBQU4sQ0FBWUMsbUJBQTNCLEdBQWlESCxLQUFLLENBQUNFLEtBQU4sQ0FBWUUsY0FEdEM7QUFBQSxDQUZULEVBSWQsVUFBQUosS0FBSztBQUFBLG1CQUFPQSxLQUFLLENBQUNLLFFBQU4sR0FBaUIsT0FBakIsR0FBMkIsUUFBbEMsZUFBK0NMLEtBQUssQ0FBQ0UsS0FBTixDQUFZSSxlQUEzRDtBQUFBLENBSlMsRUFLQyxVQUFBTixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDRSxLQUFOLENBQVlLLGVBQWhCO0FBQUEsQ0FMTixDQUFsQjs7QUFZQSxTQUFTQyxJQUFULEdBQWdCLENBQUU7O0lBRUdDLGU7Ozs7O0FBZW5CLDJCQUFZVCxLQUFaLEVBQW1CO0FBQUE7O0FBQUE7QUFDakIsMkhBQU1BLEtBQU47QUFEaUIsOEZBU1g7QUFBQ1UsTUFBQUEsU0FBUyxFQUFFO0FBQVosS0FUVztBQUFBLHdHQVdELFlBQU07QUFDdEIsWUFBS0MsUUFBTCxDQUFjO0FBQUNELFFBQUFBLFNBQVMsRUFBRSxDQUFDLE1BQUtFLEtBQUwsQ0FBV0Y7QUFBeEIsT0FBZDtBQUNELEtBYmtCO0FBRWpCLFVBQUtHLFVBQUwsR0FBa0IsSUFBSUMsc0JBQUosQ0FBc0I7QUFDdENULE1BQUFBLFFBQVEsRUFBRUwsS0FBSyxDQUFDSyxRQURzQjtBQUV0Q1UsTUFBQUEsYUFBYSxFQUFFZixLQUFLLENBQUNnQixpQkFGaUI7QUFHdENDLE1BQUFBLGVBQWUsRUFBRSxNQUFLQTtBQUhnQixLQUF0QixDQUFsQjtBQUZpQjtBQU9sQjs7Ozs2QkFRUTtBQUFBLHdCQUNpQixLQUFLakIsS0FEdEI7QUFBQSxVQUNBa0IsS0FEQSxlQUNBQSxLQURBO0FBQUEsVUFDT0MsTUFEUCxlQUNPQSxNQURQO0FBR1AsVUFBTUMsS0FBSyxHQUFHLEtBQUtwQixLQUFMLENBQVdLLFFBQVgsR0FDVjtBQUNFZ0IsUUFBQUEsTUFBTSxZQUFLSCxLQUFMLE1BRFI7QUFFRUksUUFBQUEsTUFBTSxZQUFLLENBQUMsR0FBRCxHQUFPSixLQUFQLEdBQWVDLE1BQXBCO0FBRlIsT0FEVSxHQUtWO0FBQ0VELFFBQUFBLEtBQUssWUFBS0EsS0FBTCxNQURQO0FBRUVLLFFBQUFBLElBQUksWUFBS0osTUFBTDtBQUZOLE9BTEo7QUFVQSxhQUNFLGdDQUFDLFlBQUQ7QUFDRSxRQUFBLE1BQU0sRUFBRSxLQUFLUCxLQUFMLENBQVdGLFNBRHJCO0FBRUUsUUFBQSxTQUFTLEVBQUUsNEJBQVcsc0JBQVgsRUFBbUM7QUFDNUMsMENBQWdDLEtBQUtFLEtBQUwsQ0FBV0Y7QUFEQyxTQUFuQyxDQUZiO0FBS0UsUUFBQSxLQUFLLEVBQUVVLEtBTFQ7QUFNRSxRQUFBLFdBQVcsRUFBRSxLQUFLcEIsS0FBTCxDQUFXd0IsYUFBWCxHQUEyQixLQUFLWCxVQUFMLENBQWdCWSxlQUEzQyxHQUE2RGpCLElBTjVFO0FBT0UsUUFBQSxZQUFZLEVBQUUsS0FBS1IsS0FBTCxDQUFXd0IsYUFBWCxHQUEyQixLQUFLWCxVQUFMLENBQWdCYSxnQkFBM0MsR0FBOERsQjtBQVA5RSxRQURGO0FBV0Q7OztFQXREMENtQixnQjs7O2lDQUF4QmxCLGUsZUFDQTtBQUNqQlMsRUFBQUEsS0FBSyxFQUFFVSxzQkFBVUMsTUFEQTtBQUVqQk4sRUFBQUEsSUFBSSxFQUFFSyxzQkFBVUUsTUFGQztBQUdqQmQsRUFBQUEsaUJBQWlCLEVBQUVZLHNCQUFVRyxJQUhaO0FBSWpCUCxFQUFBQSxhQUFhLEVBQUVJLHNCQUFVSSxJQUpSO0FBS2pCM0IsRUFBQUEsUUFBUSxFQUFFdUIsc0JBQVVJO0FBTEgsQztpQ0FEQXZCLGUsa0JBU0c7QUFDcEJPLEVBQUFBLGlCQUFpQixFQUFFUixJQURDO0FBRXBCZ0IsRUFBQUEsYUFBYSxFQUFFLEtBRks7QUFHcEJuQixFQUFBQSxRQUFRLEVBQUU7QUFIVSxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBNb3VzZUV2ZW50SGFuZGxlciBmcm9tICcuL21vdXNlLWV2ZW50JztcblxuY29uc3QgU3R5bGVkU2xpZGVyID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUuc2xpZGVyQmFySG92ZXJDb2xvciA6IHByb3BzLnRoZW1lLnNsaWRlckJhckNvbG9yfTtcbiAgJHtwcm9wcyA9PiBgJHtwcm9wcy52ZXJ0aWNhbCA/ICd3aWR0aCcgOiAnaGVpZ2h0J306ICR7cHJvcHMudGhlbWUuc2xpZGVyQmFySGVpZ2h0fXB4YH07XG4gIGJvcmRlci1yYWRpdXM6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2xpZGVyQmFyUmFkaXVzfTtcblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgfVxuYDtcblxuZnVuY3Rpb24gbm9wZSgpIHt9XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNsaWRlckJhckhhbmRsZSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgbGVmdDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBzbGlkZXJCYXJMaXN0ZW5lcjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgZW5hYmxlQmFyRHJhZzogUHJvcFR5cGVzLmJvb2wsXG4gICAgdmVydGljYWw6IFByb3BUeXBlcy5ib29sXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBzbGlkZXJCYXJMaXN0ZW5lcjogbm9wZSxcbiAgICBlbmFibGVCYXJEcmFnOiBmYWxzZSxcbiAgICB2ZXJ0aWNhbDogZmFsc2VcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLm1vdXNlRXZlbnQgPSBuZXcgTW91c2VFdmVudEhhbmRsZXIoe1xuICAgICAgdmVydGljYWw6IHByb3BzLnZlcnRpY2FsLFxuICAgICAgdmFsdWVMaXN0ZW5lcjogcHJvcHMuc2xpZGVyQmFyTGlzdGVuZXIsXG4gICAgICB0b2dnbGVNb3VzZU92ZXI6IHRoaXMudG9nZ2xlTW91c2VPdmVyXG4gICAgfSk7XG4gIH1cblxuICBzdGF0ZSA9IHttb3VzZU92ZXI6IGZhbHNlfTtcblxuICB0b2dnbGVNb3VzZU92ZXIgPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7bW91c2VPdmVyOiAhdGhpcy5zdGF0ZS5tb3VzZU92ZXJ9KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge3dpZHRoLCB2MExlZnR9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5wcm9wcy52ZXJ0aWNhbFxuICAgICAgPyB7XG4gICAgICAgICAgaGVpZ2h0OiBgJHt3aWR0aH0lYCxcbiAgICAgICAgICBib3R0b206IGAkey0xMDAgKyB3aWR0aCArIHYwTGVmdH0lYFxuICAgICAgICB9XG4gICAgICA6IHtcbiAgICAgICAgICB3aWR0aDogYCR7d2lkdGh9JWAsXG4gICAgICAgICAgbGVmdDogYCR7djBMZWZ0fSVgXG4gICAgICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZFNsaWRlclxuICAgICAgICBhY3RpdmU9e3RoaXMuc3RhdGUubW91c2VPdmVyfVxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ2tnLXJhbmdlLXNsaWRlcl9fYmFyJywge1xuICAgICAgICAgICdrZy1yYW5nZS1zbGlkZXJfX2Jhci0tYWN0aXZlJzogdGhpcy5zdGF0ZS5tb3VzZU92ZXJcbiAgICAgICAgfSl9XG4gICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICAgb25Nb3VzZURvd249e3RoaXMucHJvcHMuZW5hYmxlQmFyRHJhZyA/IHRoaXMubW91c2VFdmVudC5oYW5kbGVNb3VzZURvd24gOiBub3BlfVxuICAgICAgICBvblRvdWNoU3RhcnQ9e3RoaXMucHJvcHMuZW5hYmxlQmFyRHJhZyA/IHRoaXMubW91c2VFdmVudC5oYW5kbGVUb3VjaFN0YXJ0IDogbm9wZX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxufVxuIl19