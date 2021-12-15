"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.CollapseButtonFactory = void 0;

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

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _icons = require("../common/icons");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var StyledSidePanelContainer = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  z-index: 99;\n  height: 100%;\n  width: ", "px;\n  display: flex;\n  transition: width 250ms;\n  position: absolute;\n  padding-top: ", "px;\n  padding-right: ", "px;\n  padding-bottom: ", "px;\n  padding-left: ", "px;\n"])), function (props) {
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

var SideBarContainer = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n  transition: left 250ms, right 250ms;\n  left: ", "px;\n  align-items: stretch;\n  flex-grow: 1;\n"])), function (props) {
  return props.left;
});

var SideBarInner = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  border-radius: 1px;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  border-left: ", "px solid\n    ", ";\n"])), function (props) {
  return props.theme.sidePanelBg;
}, function (props) {
  return props.theme.sidePanelBorder;
}, function (props) {
  return props.theme.sidePanelBorderColor;
});

var StyledCollapseButton = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: center;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n  justify-content: center;\n  background-color: ", ";\n  border-radius: 1px;\n  color: ", ";\n  display: flex;\n  height: 20px;\n  position: absolute;\n  right: -8px;\n  top: ", "px;\n  width: 20px;\n\n  :hover {\n    cursor: pointer;\n    box-shadow: none;\n    background-color: ", ";\n  }\n"])), function (props) {
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
    return /*#__PURE__*/_react["default"].createElement(StyledCollapseButton, {
      className: "side-bar__close",
      onClick: onClick
    }, /*#__PURE__*/_react["default"].createElement(_icons.ArrowRight, {
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

  return _temp = _class = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(SideBar, _Component);

    var _super = _createSuper(SideBar);

    function SideBar() {
      var _this;

      (0, _classCallCheck2["default"])(this, SideBar);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
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
        return /*#__PURE__*/_react["default"].createElement(StyledSidePanelContainer, {
          width: isOpen ? width : 0,
          className: "side-panel--container"
        }, /*#__PURE__*/_react["default"].createElement(SideBarContainer, {
          className: "side-bar",
          style: {
            width: "".concat(width, "px")
          },
          left: horizontalOffset
        }, isOpen ? /*#__PURE__*/_react["default"].createElement(SideBarInner, {
          className: "side-bar__inner"
        }, this.props.children) : null, /*#__PURE__*/_react["default"].createElement(CollapseButton, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvc2lkZS1iYXIuanMiXSwibmFtZXMiOlsiU3R5bGVkU2lkZVBhbmVsQ29udGFpbmVyIiwic3R5bGVkIiwiZGl2IiwicHJvcHMiLCJ3aWR0aCIsInRoZW1lIiwic2lkZVBhbmVsIiwibWFyZ2luIiwibGVmdCIsInRvcCIsInJpZ2h0IiwiYm90dG9tIiwiU2lkZUJhckNvbnRhaW5lciIsIlNpZGVCYXJJbm5lciIsInNpZGVQYW5lbEJnIiwic2lkZVBhbmVsQm9yZGVyIiwic2lkZVBhbmVsQm9yZGVyQ29sb3IiLCJTdHlsZWRDb2xsYXBzZUJ1dHRvbiIsInNpZGVCYXJDbG9zZUJ0bkJnZCIsInNpZGVCYXJDbG9zZUJ0bkNvbG9yIiwic2lkZUJhckNsb3NlQnRuQmdkSG92ZXIiLCJDb2xsYXBzZUJ1dHRvbkZhY3RvcnkiLCJDb2xsYXBzZUJ1dHRvbiIsIm9uQ2xpY2siLCJpc09wZW4iLCJ0cmFuc2Zvcm0iLCJTaWRlYmFyRmFjdG9yeSIsImRlcHMiLCJvbk9wZW5PckNsb3NlIiwibWluaWZpZWRXaWR0aCIsImhvcml6b250YWxPZmZzZXQiLCJjaGlsZHJlbiIsIl9vbk9wZW5PckNsb3NlIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwibnVtYmVyIiwiYm9vbCIsImZ1bmMiLCJub29wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsd0JBQXdCLEdBQUdDLDZCQUFPQyxHQUFWLHVUQUduQixVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLEdBQWMsSUFBSUQsS0FBSyxDQUFDRSxLQUFOLENBQVlDLFNBQVosQ0FBc0JDLE1BQXRCLENBQTZCQyxJQUFuRDtBQUFBLENBSGMsRUFPYixVQUFBTCxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDRSxLQUFOLENBQVlDLFNBQVosQ0FBc0JDLE1B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R0FBR04sTUFBTSxHQUFHLENBQUgsR0FBT0ssYUFBYSxHQUFHekIsS0FBdEQ7QUFFQSw0QkFDRSxnQ0FBQyx3QkFBRDtBQUEwQixVQUFBLEtBQUssRUFBRW9CLE1BQU0sR0FBR3BCLEtBQUgsR0FBVyxDQUFsRDtBQUFxRCxVQUFBLFNBQVMsRUFBQztBQUEvRCx3QkFDRSxnQ0FBQyxnQkFBRDtBQUNFLFVBQUEsU0FBUyxFQUFDLFVBRFo7QUFFRSxVQUFBLEtBQUssRUFBRTtBQUFDQSxZQUFBQSxLQUFLLFlBQUtBLEtBQUw7QUFBTixXQUZUO0FBR0UsVUFBQSxJQUFJLEVBQUUwQjtBQUhSLFdBS0dOLE1BQU0sZ0JBQ0wsZ0NBQUMsWUFBRDtBQUFjLFVBQUEsU0FBUyxFQUFDO0FBQXhCLFdBQTJDLEtBQUtyQixLQUFMLENBQVc0QixRQUF0RCxDQURLLEdBRUgsSUFQTixlQVFFLGdDQUFDLGNBQUQ7QUFBZ0IsVUFBQSxNQUFNLEVBQUVQLE1BQXhCO0FBQWdDLFVBQUEsT0FBTyxFQUFFLEtBQUtRO0FBQTlDLFVBUkYsQ0FERixDQURGO0FBY0Q7QUFyQ0g7QUFBQTtBQUFBLElBQTZCQyxnQkFBN0IseURBQ3FCO0FBQ2pCN0IsSUFBQUEsS0FBSyxFQUFFOEIsc0JBQVVDLE1BREE7QUFFakJYLElBQUFBLE1BQU0sRUFBRVUsc0JBQVVFLElBRkQ7QUFHakJQLElBQUFBLGFBQWEsRUFBRUssc0JBQVVDLE1BSFI7QUFJakJQLElBQUFBLGFBQWEsRUFBRU0sc0JBQVVHO0FBSlIsR0FEckIsNERBUXdCO0FBQ3BCakMsSUFBQUEsS0FBSyxFQUFFLEdBRGE7QUFFcEJ5QixJQUFBQSxhQUFhLEVBQUUsQ0FGSztBQUdwQkwsSUFBQUEsTUFBTSxFQUFFLElBSFk7QUFJcEJJLElBQUFBLGFBQWEsRUFBRSxTQUFTVSxJQUFULEdBQWdCLENBQUU7QUFKYixHQVJ4QjtBQXVDRDs7ZUFFY1osYyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtBcnJvd1JpZ2h0fSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5cbmNvbnN0IFN0eWxlZFNpZGVQYW5lbENvbnRhaW5lciA9IHN0eWxlZC5kaXZgXG4gIHotaW5kZXg6IDk5O1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiAke3Byb3BzID0+IHByb3BzLndpZHRoICsgMiAqIHByb3BzLnRoZW1lLnNpZGVQYW5lbC5tYXJnaW4ubGVmdH1weDtcbiAgZGlzcGxheTogZmxleDtcbiAgdHJhbnNpdGlvbjogd2lkdGggMjUwbXM7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgcGFkZGluZy10b3A6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsLm1hcmdpbi50b3B9cHg7XG4gIHBhZGRpbmctcmlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsLm1hcmdpbi5yaWdodH1weDtcbiAgcGFkZGluZy1ib3R0b206ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsLm1hcmdpbi5ib3R0b219cHg7XG4gIHBhZGRpbmctbGVmdDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWwubWFyZ2luLmxlZnR9cHg7XG5gO1xuXG5jb25zdCBTaWRlQmFyQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgYm94LXNoYWRvdzogMCAxcHggM3B4IHJnYmEoMCwgMCwgMCwgMC4yKTtcbiAgdHJhbnNpdGlvbjogbGVmdCAyNTBtcywgcmlnaHQgMjUwbXM7XG4gIGxlZnQ6ICR7cHJvcHMgPT4gcHJvcHMubGVmdH1weDtcbiAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XG4gIGZsZXgtZ3JvdzogMTtcbmA7XG5cbmNvbnN0IFNpZGVCYXJJbm5lciA9IHN0eWxlZC5kaXZgXG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsQmd9O1xuICBib3JkZXItcmFkaXVzOiAxcHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGhlaWdodDogMTAwJTtcbiAgYm9yZGVyLWxlZnQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsQm9yZGVyfXB4IHNvbGlkXG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWxCb3JkZXJDb2xvcn07XG5gO1xuXG5jb25zdCBTdHlsZWRDb2xsYXBzZUJ1dHRvbiA9IHN0eWxlZC5kaXZgXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJveC1zaGFkb3c6IDAgMXB4IDNweCByZ2JhKDAsIDAsIDAsIDAuMik7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVCYXJDbG9zZUJ0bkJnZH07XG4gIGJvcmRlci1yYWRpdXM6IDFweDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZUJhckNsb3NlQnRuQ29sb3J9O1xuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6IDIwcHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgcmlnaHQ6IC04cHg7XG4gIHRvcDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWwubWFyZ2luLnRvcH1weDtcbiAgd2lkdGg6IDIwcHg7XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYm94LXNoYWRvdzogbm9uZTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVCYXJDbG9zZUJ0bkJnZEhvdmVyfTtcbiAgfVxuYDtcblxuZXhwb3J0IGNvbnN0IENvbGxhcHNlQnV0dG9uRmFjdG9yeSA9ICgpID0+IHtcbiAgY29uc3QgQ29sbGFwc2VCdXR0b24gPSAoe29uQ2xpY2ssIGlzT3Blbn0pID0+IChcbiAgICA8U3R5bGVkQ29sbGFwc2VCdXR0b24gY2xhc3NOYW1lPVwic2lkZS1iYXJfX2Nsb3NlXCIgb25DbGljaz17b25DbGlja30+XG4gICAgICA8QXJyb3dSaWdodCBoZWlnaHQ9XCIxMnB4XCIgc3R5bGU9e3t0cmFuc2Zvcm06IGByb3RhdGUoJHtpc09wZW4gPyAxODAgOiAwfWRlZylgfX0gLz5cbiAgICA8L1N0eWxlZENvbGxhcHNlQnV0dG9uPlxuICApO1xuICByZXR1cm4gQ29sbGFwc2VCdXR0b247XG59O1xuXG5TaWRlYmFyRmFjdG9yeS5kZXBzID0gW0NvbGxhcHNlQnV0dG9uRmFjdG9yeV07XG5cbmZ1bmN0aW9uIFNpZGViYXJGYWN0b3J5KENvbGxhcHNlQnV0dG9uKSB7XG4gIHJldHVybiBjbGFzcyBTaWRlQmFyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICBpc09wZW46IFByb3BUeXBlcy5ib29sLFxuICAgICAgbWluaWZpZWRXaWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgIG9uT3Blbk9yQ2xvc2U6IFByb3BUeXBlcy5mdW5jXG4gICAgfTtcblxuICAgIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgbWluaWZpZWRXaWR0aDogMCxcbiAgICAgIGlzT3BlbjogdHJ1ZSxcbiAgICAgIG9uT3Blbk9yQ2xvc2U6IGZ1bmN0aW9uIG5vb3AoKSB7fVxuICAgIH07XG5cbiAgICBfb25PcGVuT3JDbG9zZSA9ICgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMub25PcGVuT3JDbG9zZSh7aXNPcGVuOiAhdGhpcy5wcm9wcy5pc09wZW59KTtcbiAgICB9O1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3Qge2lzT3BlbiwgbWluaWZpZWRXaWR0aCwgd2lkdGh9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IGhvcml6b250YWxPZmZzZXQgPSBpc09wZW4gPyAwIDogbWluaWZpZWRXaWR0aCAtIHdpZHRoO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkU2lkZVBhbmVsQ29udGFpbmVyIHdpZHRoPXtpc09wZW4gPyB3aWR0aCA6IDB9IGNsYXNzTmFtZT1cInNpZGUtcGFuZWwtLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxTaWRlQmFyQ29udGFpbmVyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJzaWRlLWJhclwiXG4gICAgICAgICAgICBzdHlsZT17e3dpZHRoOiBgJHt3aWR0aH1weGB9fVxuICAgICAgICAgICAgbGVmdD17aG9yaXpvbnRhbE9mZnNldH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7aXNPcGVuID8gKFxuICAgICAgICAgICAgICA8U2lkZUJhcklubmVyIGNsYXNzTmFtZT1cInNpZGUtYmFyX19pbm5lclwiPnt0aGlzLnByb3BzLmNoaWxkcmVufTwvU2lkZUJhcklubmVyPlxuICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICA8Q29sbGFwc2VCdXR0b24gaXNPcGVuPXtpc09wZW59IG9uQ2xpY2s9e3RoaXMuX29uT3Blbk9yQ2xvc2V9IC8+XG4gICAgICAgICAgPC9TaWRlQmFyQ29udGFpbmVyPlxuICAgICAgICA8L1N0eWxlZFNpZGVQYW5lbENvbnRhaW5lcj5cbiAgICAgICk7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBTaWRlYmFyRmFjdG9yeTtcbiJdfQ==