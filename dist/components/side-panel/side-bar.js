"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.CollapseButtonFactory = void 0;

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

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _icons = require("../common/icons");

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: center;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n  justify-content: center;\n  background-color: ", ";\n  border-radius: 1px;\n  color: ", ";\n  display: flex;\n  height: 20px;\n  position: absolute;\n  right: -8px;\n  top: ", "px;\n  width: 20px;\n\n  :hover {\n    cursor: pointer;\n    box-shadow: none;\n    background-color: ", ";\n  }\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  border-radius: 1px;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n  transition: left 250ms, right 250ms;\n  left: ", "px;\n  align-items: stretch;\n  flex-grow: 1;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  z-index: 99;\n  height: 100%;\n  width: ", "px;\n  display: flex;\n  transition: width 250ms;\n  position: absolute;\n  padding-top: ", "px;\n  padding-right: ", "px;\n  padding-bottom: ", "px;\n  padding-left: ", "px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledSidePanelContainer = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.width + 2 * props.theme.sidePanel.margin.left;
}, function (props) {
  return props.theme.sidePanel.margin.top;
}, function (props) {
  return props.theme.sidePanel.margin.right;
}, function (props) {
  return props.theme.sidePanel.margin.bottom;
}, function (props) {
  return props.theme.sidePanel.margin.left;
});

var SideBarContainer = _styledComponents["default"].div(_templateObject2(), function (props) {
  return props.left;
});

var SideBarInner = _styledComponents["default"].div(_templateObject3(), function (props) {
  return props.theme.sidePanelBg;
});

var StyledCollapseButton = _styledComponents["default"].div(_templateObject4(), function (props) {
  return props.theme.sideBarCloseBtnBgd;
}, function (props) {
  return props.theme.sideBarCloseBtnColor;
}, function (props) {
  return props.theme.sidePanel.margin.top;
}, function (props) {
  return props.theme.sideBarCloseBtnBgdHover;
});

var CollapseButtonFactory = function CollapseButtonFactory() {
  var CollapseButton = function CollapseButton(_ref) {
    var onClick = _ref.onClick,
        isOpen = _ref.isOpen;
    return _react["default"].createElement(StyledCollapseButton, {
      className: "side-bar__close",
      onClick: onClick
    }, _react["default"].createElement(_icons.ArrowRight, {
      height: "12px",
      style: {
        transform: "rotate(".concat(isOpen ? 180 : 0, "deg)")
      }
    }));
  };

  return CollapseButton;
};

exports.CollapseButtonFactory = CollapseButtonFactory;
SidebarFactory.deps = [CollapseButtonFactory];

function SidebarFactory(CollapseButton) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(SideBar, _Component);

    function SideBar() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, SideBar);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(SideBar)).call.apply(_getPrototypeOf2, [this].concat(args)));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onOpenOrClose", function () {
        _this.props.onOpenOrClose({
          isOpen: !_this.props.isOpen
        });
      });
      return _this;
    }

    (0, _createClass2["default"])(SideBar, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            isOpen = _this$props.isOpen,
            minifiedWidth = _this$props.minifiedWidth,
            width = _this$props.width;
        var horizontalOffset = isOpen ? 0 : minifiedWidth - width;
        return _react["default"].createElement(StyledSidePanelContainer, {
          width: isOpen ? width : 0,
          className: "side-panel--container"
        }, _react["default"].createElement(SideBarContainer, {
          className: "side-bar",
          style: {
            width: "".concat(width, "px")
          },
          left: horizontalOffset
        }, isOpen ? _react["default"].createElement(SideBarInner, {
          className: "side-bar__inner"
        }, this.props.children) : null, _react["default"].createElement(CollapseButton, {
          isOpen: isOpen,
          onClick: this._onOpenOrClose
        })));
      }
    }]);
    return SideBar;
  }(_react.Component), (0, _defineProperty2["default"])(_class, "propTypes", {
    width: _propTypes["default"].number,
    isOpen: _propTypes["default"].bool,
    minifiedWidth: _propTypes["default"].number,
    onOpenOrClose: _propTypes["default"].func
  }), (0, _defineProperty2["default"])(_class, "defaultProps", {
    width: 300,
    minifiedWidth: 0,
    isOpen: true,
    onOpenOrClose: function noop() {}
  }), _temp;
}

var _default = SidebarFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvc2lkZS1iYXIuanMiXSwibmFtZXMiOlsiU3R5bGVkU2lkZVBhbmVsQ29udGFpbmVyIiwic3R5bGVkIiwiZGl2IiwicHJvcHMiLCJ3aWR0aCIsInRoZW1lIiwic2lkZVBhbmVsIiwibWFyZ2luIiwibGVmdCIsInRvcCIsInJpZ2h0IiwiYm90dG9tIiwiU2lkZUJhckNvbnRhaW5lciIsIlNpZGVCYXJJbm5lciIsInNpZGVQYW5lbEJnIiwiU3R5bGVkQ29sbGFwc2VCdXR0b24iLCJzaWRlQmFyQ2xvc2VCdG5CZ2QiLCJzaWRlQmFyQ2xvc2VCdG5Db2xvciIsInNpZGVCYXJDbG9zZUJ0bkJnZEhvdmVyIiwiQ29sbGFwc2VCdXR0b25GYWN0b3J5IiwiQ29sbGFwc2VCdXR0b24iLCJvbkNsaWNrIiwiaXNPcGVuIiwidHJhbnNmb3JtIiwiU2lkZWJhckZhY3RvcnkiLCJkZXBzIiwib25PcGVuT3JDbG9zZSIsIm1pbmlmaWVkV2lkdGgiLCJob3Jpem9udGFsT2Zmc2V0IiwiY2hpbGRyZW4iLCJfb25PcGVuT3JDbG9zZSIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsIm51bWJlciIsImJvb2wiLCJmdW5jIiwibm9vcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSx3QkFBd0IsR0FBR0MsNkJBQU9DLEdBQVYsb0JBR25CLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sR0FBYyxJQUFJRCxLQUFLLENBQUNFLEtBQU4sQ0FBWUMsU0FBWixDQUFzQkMsTUFBdEIsQ0FBNkJDLElBQW5EO0FBQUEsQ0FIYyxFQU9iLFVBQUFMLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNFLEtBQU4sQ0FBWUMsU0FBWixDQUFzQkMsTUFBdEIsQ0FB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QztBQUEvRCxXQUNFLGdDQUFDLGdCQUFEO0FBQ0UsVUFBQSxTQUFTLEVBQUMsVUFEWjtBQUVFLFVBQUEsS0FBSyxFQUFFO0FBQUNBLFlBQUFBLEtBQUssWUFBS0EsS0FBTDtBQUFOLFdBRlQ7QUFHRSxVQUFBLElBQUksRUFBRXdCO0FBSFIsV0FLR04sTUFBTSxHQUNMLGdDQUFDLFlBQUQ7QUFBYyxVQUFBLFNBQVMsRUFBQztBQUF4QixXQUEyQyxLQUFLbkIsS0FBTCxDQUFXMEIsUUFBdEQsQ0FESyxHQUVILElBUE4sRUFRRSxnQ0FBQyxjQUFEO0FBQWdCLFVBQUEsTUFBTSxFQUFFUCxNQUF4QjtBQUFnQyxVQUFBLE9BQU8sRUFBRSxLQUFLUTtBQUE5QyxVQVJGLENBREYsQ0FERjtBQWNEO0FBckNIO0FBQUE7QUFBQSxJQUE2QkMsZ0JBQTdCLHlEQUNxQjtBQUNqQjNCLElBQUFBLEtBQUssRUFBRTRCLHNCQUFVQyxNQURBO0FBRWpCWCxJQUFBQSxNQUFNLEVBQUVVLHNCQUFVRSxJQUZEO0FBR2pCUCxJQUFBQSxhQUFhLEVBQUVLLHNCQUFVQyxNQUhSO0FBSWpCUCxJQUFBQSxhQUFhLEVBQUVNLHNCQUFVRztBQUpSLEdBRHJCLDREQVF3QjtBQUNwQi9CLElBQUFBLEtBQUssRUFBRSxHQURhO0FBRXBCdUIsSUFBQUEsYUFBYSxFQUFFLENBRks7QUFHcEJMLElBQUFBLE1BQU0sRUFBRSxJQUhZO0FBSXBCSSxJQUFBQSxhQUFhLEVBQUUsU0FBU1UsSUFBVCxHQUFnQixDQUFFO0FBSmIsR0FSeEI7QUF1Q0Q7O2VBRWNaLGMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7QXJyb3dSaWdodH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuXG5jb25zdCBTdHlsZWRTaWRlUGFuZWxDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICB6LWluZGV4OiA5OTtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogJHtwcm9wcyA9PiBwcm9wcy53aWR0aCArIDIgKiBwcm9wcy50aGVtZS5zaWRlUGFuZWwubWFyZ2luLmxlZnR9cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHRyYW5zaXRpb246IHdpZHRoIDI1MG1zO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHBhZGRpbmctdG9wOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVQYW5lbC5tYXJnaW4udG9wfXB4O1xuICBwYWRkaW5nLXJpZ2h0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVQYW5lbC5tYXJnaW4ucmlnaHR9cHg7XG4gIHBhZGRpbmctYm90dG9tOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVQYW5lbC5tYXJnaW4uYm90dG9tfXB4O1xuICBwYWRkaW5nLWxlZnQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsLm1hcmdpbi5sZWZ0fXB4O1xuYDtcblxuY29uc3QgU2lkZUJhckNvbnRhaW5lciA9IHN0eWxlZC5kaXZgXG4gIGJveC1zaGFkb3c6IDAgMXB4IDNweCByZ2JhKDAsIDAsIDAsIDAuMik7XG4gIHRyYW5zaXRpb246IGxlZnQgMjUwbXMsIHJpZ2h0IDI1MG1zO1xuICBsZWZ0OiAke3Byb3BzID0+IHByb3BzLmxlZnR9cHg7XG4gIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xuICBmbGV4LWdyb3c6IDE7XG5gO1xuXG5jb25zdCBTaWRlQmFySW5uZXIgPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVQYW5lbEJnfTtcbiAgYm9yZGVyLXJhZGl1czogMXB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBoZWlnaHQ6IDEwMCU7XG5gO1xuXG5jb25zdCBTdHlsZWRDb2xsYXBzZUJ1dHRvbiA9IHN0eWxlZC5kaXZgXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJveC1zaGFkb3c6IDAgMXB4IDNweCByZ2JhKDAsIDAsIDAsIDAuMik7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVCYXJDbG9zZUJ0bkJnZH07XG4gIGJvcmRlci1yYWRpdXM6IDFweDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZUJhckNsb3NlQnRuQ29sb3J9O1xuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6IDIwcHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgcmlnaHQ6IC04cHg7XG4gIHRvcDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWwubWFyZ2luLnRvcH1weDtcbiAgd2lkdGg6IDIwcHg7XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYm94LXNoYWRvdzogbm9uZTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVCYXJDbG9zZUJ0bkJnZEhvdmVyfTtcbiAgfVxuYDtcblxuZXhwb3J0IGNvbnN0IENvbGxhcHNlQnV0dG9uRmFjdG9yeSA9ICgpID0+IHtcbiAgY29uc3QgQ29sbGFwc2VCdXR0b24gPSAoe29uQ2xpY2ssIGlzT3Blbn0pID0+IChcbiAgICA8U3R5bGVkQ29sbGFwc2VCdXR0b24gY2xhc3NOYW1lPVwic2lkZS1iYXJfX2Nsb3NlXCIgb25DbGljaz17b25DbGlja30+XG4gICAgICA8QXJyb3dSaWdodCBoZWlnaHQ9XCIxMnB4XCIgc3R5bGU9e3t0cmFuc2Zvcm06IGByb3RhdGUoJHtpc09wZW4gPyAxODAgOiAwfWRlZylgfX0gLz5cbiAgICA8L1N0eWxlZENvbGxhcHNlQnV0dG9uPlxuICApO1xuICByZXR1cm4gQ29sbGFwc2VCdXR0b247XG59O1xuXG5TaWRlYmFyRmFjdG9yeS5kZXBzID0gW0NvbGxhcHNlQnV0dG9uRmFjdG9yeV07XG5cbmZ1bmN0aW9uIFNpZGViYXJGYWN0b3J5KENvbGxhcHNlQnV0dG9uKSB7XG4gIHJldHVybiBjbGFzcyBTaWRlQmFyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICBpc09wZW46IFByb3BUeXBlcy5ib29sLFxuICAgICAgbWluaWZpZWRXaWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgIG9uT3Blbk9yQ2xvc2U6IFByb3BUeXBlcy5mdW5jXG4gICAgfTtcblxuICAgIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgbWluaWZpZWRXaWR0aDogMCxcbiAgICAgIGlzT3BlbjogdHJ1ZSxcbiAgICAgIG9uT3Blbk9yQ2xvc2U6IGZ1bmN0aW9uIG5vb3AoKSB7fVxuICAgIH07XG5cbiAgICBfb25PcGVuT3JDbG9zZSA9ICgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMub25PcGVuT3JDbG9zZSh7aXNPcGVuOiAhdGhpcy5wcm9wcy5pc09wZW59KTtcbiAgICB9O1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3Qge2lzT3BlbiwgbWluaWZpZWRXaWR0aCwgd2lkdGh9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IGhvcml6b250YWxPZmZzZXQgPSBpc09wZW4gPyAwIDogbWluaWZpZWRXaWR0aCAtIHdpZHRoO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkU2lkZVBhbmVsQ29udGFpbmVyIHdpZHRoPXtpc09wZW4gPyB3aWR0aCA6IDB9IGNsYXNzTmFtZT1cInNpZGUtcGFuZWwtLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxTaWRlQmFyQ29udGFpbmVyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJzaWRlLWJhclwiXG4gICAgICAgICAgICBzdHlsZT17e3dpZHRoOiBgJHt3aWR0aH1weGB9fVxuICAgICAgICAgICAgbGVmdD17aG9yaXpvbnRhbE9mZnNldH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7aXNPcGVuID8gKFxuICAgICAgICAgICAgICA8U2lkZUJhcklubmVyIGNsYXNzTmFtZT1cInNpZGUtYmFyX19pbm5lclwiPnt0aGlzLnByb3BzLmNoaWxkcmVufTwvU2lkZUJhcklubmVyPlxuICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICA8Q29sbGFwc2VCdXR0b24gaXNPcGVuPXtpc09wZW59IG9uQ2xpY2s9e3RoaXMuX29uT3Blbk9yQ2xvc2V9IC8+XG4gICAgICAgICAgPC9TaWRlQmFyQ29udGFpbmVyPlxuICAgICAgICA8L1N0eWxlZFNpZGVQYW5lbENvbnRhaW5lcj5cbiAgICAgICk7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBTaWRlYmFyRmFjdG9yeTtcbiJdfQ==