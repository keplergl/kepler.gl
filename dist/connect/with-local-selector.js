"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reselect = require("reselect");

var _context = _interopRequireDefault(require("../components/context"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var identity = function identity(state) {
  return state;
};

var mergeSelectors = function mergeSelectors(parentSelector, childSelector) {
  return function (state) {
    return childSelector(parentSelector(state));
  };
}; // store the parent selector in the parent context
// and return the parent component
// when a selector is passed to a container component,
// it will be stored in the context and passed down to child components,
// as well as prop to the given component


var withLocalSelector = function withLocalSelector(ParentComponent) {
  var WithConnectSelector = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(WithConnectSelector, _Component);

    var _super = _createSuper(WithConnectSelector);

    function WithConnectSelector() {
      var _this;

      (0, _classCallCheck2["default"])(this, WithConnectSelector);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "selectorFromContext", function (_, ctx) {
        return ctx.selector ? ctx.selector : identity;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "selectorFromProps", function (props, _) {
        return props.selector ? props.selector : identity;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "idFromProps", function (props, _) {
        return props.id;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "computedSelector", (0, _reselect.createSelector)(_this.selectorFromContext, _this.selectorFromProps, function (ctx, props) {
        return mergeSelectors(ctx, props);
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "contextSelector", (0, _reselect.createSelector)(_this.computedSelector, _this.idFromProps, function (selector, id) {
        return {
          selector: selector,
          id: id
        };
      }));
      return _this;
    }

    (0, _createClass2["default"])(WithConnectSelector, [{
      key: "render",
      value: function render() {
        var computedContext = this.contextSelector(this.props, this.context);
        return /*#__PURE__*/_react["default"].createElement(_context["default"].Provider, {
          value: computedContext
        }, /*#__PURE__*/_react["default"].createElement(ParentComponent, (0, _extends2["default"])({}, this.props, {
          selector: computedContext.selector
        })));
      }
    }]);
    return WithConnectSelector;
  }(_react.Component);

  (0, _defineProperty2["default"])(WithConnectSelector, "contextType", _context["default"]);
  return WithConnectSelector;
};

var _default = withLocalSelector;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25uZWN0L3dpdGgtbG9jYWwtc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiaWRlbnRpdHkiLCJzdGF0ZSIsIm1lcmdlU2VsZWN0b3JzIiwicGFyZW50U2VsZWN0b3IiLCJjaGlsZFNlbGVjdG9yIiwid2l0aExvY2FsU2VsZWN0b3IiLCJQYXJlbnRDb21wb25lbnQiLCJXaXRoQ29ubmVjdFNlbGVjdG9yIiwiXyIsImN0eCIsInNlbGVjdG9yIiwicHJvcHMiLCJpZCIsInNlbGVjdG9yRnJvbUNvbnRleHQiLCJzZWxlY3RvckZyb21Qcm9wcyIsImNvbXB1dGVkU2VsZWN0b3IiLCJpZEZyb21Qcm9wcyIsImNvbXB1dGVkQ29udGV4dCIsImNvbnRleHRTZWxlY3RvciIsImNvbnRleHQiLCJDb21wb25lbnQiLCJLZXBsZXJHbENvbnRleHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUo7QUFBQSxDQUF0Qjs7QUFFQSxJQUFNQyxjQUFjLEdBQUcsU0FBakJBLGNBQWlCLENBQUNDLGNBQUQsRUFBaUJDLGFBQWpCO0FBQUEsU0FBbUMsVUFBQUgsS0FBSztBQUFBLFdBQzdERyxhQUFhLENBQUNELGNBQWMsQ0FBQ0YsS0FBRCxDQUFmLENBRGdEO0FBQUEsR0FBeEM7QUFBQSxDQUF2QixDLENBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTUksaUJBQWlCLEdBQUcsU0FBcEJBLGlCQUFvQixDQUFBQyxlQUFlLEVBQUk7QUFBQSxNQUNyQ0MsbUJBRHFDO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSw4R0FJbkIsVUFBQ0MsQ0FBRCxFQUFJQyxHQUFKO0FBQUEsZUFBYUEsR0FBRyxDQUFDQyxRQUFKLEdBQWVELEdBQUcsQ0FBQ0MsUUFBbkIsR0FBOEJWLFFBQTNDO0FBQUEsT0FKbUI7QUFBQSw0R0FLckIsVUFBQ1csS0FBRCxFQUFRSCxDQUFSO0FBQUEsZUFBZUcsS0FBSyxDQUFDRCxRQUFOLEdBQWlCQyxLQUFLLENBQUNELFFBQXZCLEdBQWtDVixRQUFqRDtBQUFBLE9BTHFCO0FBQUEsc0dBTTNCLFVBQUNXLEtBQUQsRUFBUUgsQ0FBUjtBQUFBLGVBQWNHLEtBQUssQ0FBQ0MsRUFBcEI7QUFBQSxPQU4yQjtBQUFBLDJHQU90Qiw4QkFDakIsTUFBS0MsbUJBRFksRUFFakIsTUFBS0MsaUJBRlksRUFHakIsVUFBQ0wsR0FBRCxFQUFNRSxLQUFOO0FBQUEsZUFBZ0JULGNBQWMsQ0FBQ08sR0FBRCxFQUFNRSxLQUFOLENBQTlCO0FBQUEsT0FIaUIsQ0FQc0I7QUFBQSwwR0FjdkIsOEJBQWUsTUFBS0ksZ0JBQXBCLEVBQXNDLE1BQUtDLFdBQTNDLEVBQXdELFVBQUNOLFFBQUQsRUFBV0UsRUFBWDtBQUFBLGVBQW1CO0FBQzNGRixVQUFBQSxRQUFRLEVBQVJBLFFBRDJGO0FBRTNGRSxVQUFBQSxFQUFFLEVBQUZBO0FBRjJGLFNBQW5CO0FBQUEsT0FBeEQsQ0FkdUI7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxhQW1CekMsa0JBQVM7QUFDUCxZQUFNSyxlQUFlLEdBQUcsS0FBS0MsZUFBTCxDQUFxQixLQUFLUCxLQUExQixFQUFpQyxLQUFLUSxPQUF0QyxDQUF4QjtBQUNBLDRCQUNFLGdDQUFDLG1CQUFELENBQWlCLFFBQWpCO0FBQTBCLFVBQUEsS0FBSyxFQUFFRjtBQUFqQyx3QkFDRSxnQ0FBQyxlQUFELGdDQUFxQixLQUFLTixLQUExQjtBQUFpQyxVQUFBLFFBQVEsRUFBRU0sZUFBZSxDQUFDUDtBQUEzRCxXQURGLENBREY7QUFLRDtBQTFCd0M7QUFBQTtBQUFBLElBQ1RVLGdCQURTOztBQUFBLG1DQUNyQ2IsbUJBRHFDLGlCQUVwQmMsbUJBRm9CO0FBNkIzQyxTQUFPZCxtQkFBUDtBQUNELENBOUJEOztlQWdDZUYsaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcbmltcG9ydCBLZXBsZXJHbENvbnRleHQgZnJvbSAnY29tcG9uZW50cy9jb250ZXh0JztcblxuY29uc3QgaWRlbnRpdHkgPSBzdGF0ZSA9PiBzdGF0ZTtcblxuY29uc3QgbWVyZ2VTZWxlY3RvcnMgPSAocGFyZW50U2VsZWN0b3IsIGNoaWxkU2VsZWN0b3IpID0+IHN0YXRlID0+XG4gIGNoaWxkU2VsZWN0b3IocGFyZW50U2VsZWN0b3Ioc3RhdGUpKTtcblxuLy8gc3RvcmUgdGhlIHBhcmVudCBzZWxlY3RvciBpbiB0aGUgcGFyZW50IGNvbnRleHRcbi8vIGFuZCByZXR1cm4gdGhlIHBhcmVudCBjb21wb25lbnRcbi8vIHdoZW4gYSBzZWxlY3RvciBpcyBwYXNzZWQgdG8gYSBjb250YWluZXIgY29tcG9uZW50LFxuLy8gaXQgd2lsbCBiZSBzdG9yZWQgaW4gdGhlIGNvbnRleHQgYW5kIHBhc3NlZCBkb3duIHRvIGNoaWxkIGNvbXBvbmVudHMsXG4vLyBhcyB3ZWxsIGFzIHByb3AgdG8gdGhlIGdpdmVuIGNvbXBvbmVudFxuY29uc3Qgd2l0aExvY2FsU2VsZWN0b3IgPSBQYXJlbnRDb21wb25lbnQgPT4ge1xuICBjbGFzcyBXaXRoQ29ubmVjdFNlbGVjdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgY29udGV4dFR5cGUgPSBLZXBsZXJHbENvbnRleHQ7XG5cbiAgICBzZWxlY3RvckZyb21Db250ZXh0ID0gKF8sIGN0eCkgPT4gKGN0eC5zZWxlY3RvciA/IGN0eC5zZWxlY3RvciA6IGlkZW50aXR5KTtcbiAgICBzZWxlY3RvckZyb21Qcm9wcyA9IChwcm9wcywgXykgPT4gKHByb3BzLnNlbGVjdG9yID8gcHJvcHMuc2VsZWN0b3IgOiBpZGVudGl0eSk7XG4gICAgaWRGcm9tUHJvcHMgPSAocHJvcHMsIF8pID0+IHByb3BzLmlkO1xuICAgIGNvbXB1dGVkU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgICAgIHRoaXMuc2VsZWN0b3JGcm9tQ29udGV4dCxcbiAgICAgIHRoaXMuc2VsZWN0b3JGcm9tUHJvcHMsXG4gICAgICAoY3R4LCBwcm9wcykgPT4gbWVyZ2VTZWxlY3RvcnMoY3R4LCBwcm9wcylcbiAgICApO1xuICAgIC8vIFRPRE86IFRoaXMgaXMgdHJpY2t5IHRvIHR5cGUsIHJldmlzaXRcbiAgICAvKiogQHR5cGUgaW1wb3J0KCcuL3dpdGgtbG9jYWwtc2VsZWN0b3InKS5Db250ZXh0U2VsZWN0b3IgKi9cbiAgICBjb250ZXh0U2VsZWN0b3IgPSBjcmVhdGVTZWxlY3Rvcih0aGlzLmNvbXB1dGVkU2VsZWN0b3IsIHRoaXMuaWRGcm9tUHJvcHMsIChzZWxlY3RvciwgaWQpID0+ICh7XG4gICAgICBzZWxlY3RvcixcbiAgICAgIGlkXG4gICAgfSkpO1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3QgY29tcHV0ZWRDb250ZXh0ID0gdGhpcy5jb250ZXh0U2VsZWN0b3IodGhpcy5wcm9wcywgdGhpcy5jb250ZXh0KTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxLZXBsZXJHbENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e2NvbXB1dGVkQ29udGV4dH0+XG4gICAgICAgICAgPFBhcmVudENvbXBvbmVudCB7Li4udGhpcy5wcm9wc30gc2VsZWN0b3I9e2NvbXB1dGVkQ29udGV4dC5zZWxlY3Rvcn0gLz5cbiAgICAgICAgPC9LZXBsZXJHbENvbnRleHQuUHJvdmlkZXI+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBXaXRoQ29ubmVjdFNlbGVjdG9yO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgd2l0aExvY2FsU2VsZWN0b3I7XG4iXX0=