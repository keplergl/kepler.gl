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

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reselect = require("reselect");

var _context = _interopRequireDefault(require("../components/context"));

// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
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
  var WithConnectSelector =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(WithConnectSelector, _Component);

    function WithConnectSelector() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, WithConnectSelector);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(WithConnectSelector)).call.apply(_getPrototypeOf2, [this].concat(args)));
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
        return _react["default"].createElement(_context["default"].Provider, {
          value: computedContext
        }, _react["default"].createElement(ParentComponent, (0, _extends2["default"])({}, this.props, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25uZWN0L3dpdGgtbG9jYWwtc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiaWRlbnRpdHkiLCJzdGF0ZSIsIm1lcmdlU2VsZWN0b3JzIiwicGFyZW50U2VsZWN0b3IiLCJjaGlsZFNlbGVjdG9yIiwid2l0aExvY2FsU2VsZWN0b3IiLCJQYXJlbnRDb21wb25lbnQiLCJXaXRoQ29ubmVjdFNlbGVjdG9yIiwiXyIsImN0eCIsInNlbGVjdG9yIiwicHJvcHMiLCJpZCIsInNlbGVjdG9yRnJvbUNvbnRleHQiLCJzZWxlY3RvckZyb21Qcm9wcyIsImNvbXB1dGVkU2VsZWN0b3IiLCJpZEZyb21Qcm9wcyIsImNvbXB1dGVkQ29udGV4dCIsImNvbnRleHRTZWxlY3RvciIsImNvbnRleHQiLCJDb21wb25lbnQiLCJLZXBsZXJHbENvbnRleHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUF0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQSxJQUFNQSxRQUFRLEdBQUcsU0FBWEEsUUFBVyxDQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSjtBQUFBLENBQXRCOztBQUVBLElBQU1DLGNBQWMsR0FBRyxTQUFqQkEsY0FBaUIsQ0FBQ0MsY0FBRCxFQUFpQkMsYUFBakI7QUFBQSxTQUFtQyxVQUFBSCxLQUFLO0FBQUEsV0FDN0RHLGFBQWEsQ0FBQ0QsY0FBYyxDQUFDRixLQUFELENBQWYsQ0FEZ0Q7QUFBQSxHQUF4QztBQUFBLENBQXZCLEMsQ0FHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNSSxpQkFBaUIsR0FBRyxTQUFwQkEsaUJBQW9CLENBQUFDLGVBQWUsRUFBSTtBQUFBLE1BQ3JDQyxtQkFEcUM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSw4R0FJbkIsVUFBQ0MsQ0FBRCxFQUFJQyxHQUFKO0FBQUEsZUFBYUEsR0FBRyxDQUFDQyxRQUFKLEdBQWVELEdBQUcsQ0FBQ0MsUUFBbkIsR0FBOEJWLFFBQTNDO0FBQUEsT0FKbUI7QUFBQSw0R0FLckIsVUFBQ1csS0FBRCxFQUFRSCxDQUFSO0FBQUEsZUFBZUcsS0FBSyxDQUFDRCxRQUFOLEdBQWlCQyxLQUFLLENBQUNELFFBQXZCLEdBQWtDVixRQUFqRDtBQUFBLE9BTHFCO0FBQUEsc0dBTTNCLFVBQUNXLEtBQUQsRUFBUUgsQ0FBUjtBQUFBLGVBQWNHLEtBQUssQ0FBQ0MsRUFBcEI7QUFBQSxPQU4yQjtBQUFBLDJHQU90Qiw4QkFDakIsTUFBS0MsbUJBRFksRUFFakIsTUFBS0MsaUJBRlksRUFHakIsVUFBQ0wsR0FBRCxFQUFNRSxLQUFOO0FBQUEsZUFBZ0JULGNBQWMsQ0FBQ08sR0FBRCxFQUFNRSxLQUFOLENBQTlCO0FBQUEsT0FIaUIsQ0FQc0I7QUFBQSwwR0FZdkIsOEJBQWUsTUFBS0ksZ0JBQXBCLEVBQXNDLE1BQUtDLFdBQTNDLEVBQXdELFVBQUNOLFFBQUQsRUFBV0UsRUFBWDtBQUFBLGVBQW1CO0FBQzNGRixVQUFBQSxRQUFRLEVBQVJBLFFBRDJGO0FBRTNGRSxVQUFBQSxFQUFFLEVBQUZBO0FBRjJGLFNBQW5CO0FBQUEsT0FBeEQsQ0FadUI7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSwrQkFpQmhDO0FBQ1AsWUFBTUssZUFBZSxHQUFHLEtBQUtDLGVBQUwsQ0FBcUIsS0FBS1AsS0FBMUIsRUFBaUMsS0FBS1EsT0FBdEMsQ0FBeEI7QUFDQSxlQUNFLGdDQUFDLG1CQUFELENBQWlCLFFBQWpCO0FBQTBCLFVBQUEsS0FBSyxFQUFFRjtBQUFqQyxXQUNFLGdDQUFDLGVBQUQsZ0NBQXFCLEtBQUtOLEtBQTFCO0FBQWlDLFVBQUEsUUFBUSxFQUFFTSxlQUFlLENBQUNQO0FBQTNELFdBREYsQ0FERjtBQUtEO0FBeEJ3QztBQUFBO0FBQUEsSUFDVFUsZ0JBRFM7O0FBQUEsbUNBQ3JDYixtQkFEcUMsaUJBRXBCYyxtQkFGb0I7QUEyQjNDLFNBQU9kLG1CQUFQO0FBQ0QsQ0E1QkQ7O2VBOEJlRixpQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjcmVhdGVTZWxlY3Rvcn0gZnJvbSAncmVzZWxlY3QnO1xuaW1wb3J0IEtlcGxlckdsQ29udGV4dCBmcm9tICdjb21wb25lbnRzL2NvbnRleHQnO1xuXG5jb25zdCBpZGVudGl0eSA9IHN0YXRlID0+IHN0YXRlO1xuXG5jb25zdCBtZXJnZVNlbGVjdG9ycyA9IChwYXJlbnRTZWxlY3RvciwgY2hpbGRTZWxlY3RvcikgPT4gc3RhdGUgPT5cbiAgY2hpbGRTZWxlY3RvcihwYXJlbnRTZWxlY3RvcihzdGF0ZSkpO1xuXG4vLyBzdG9yZSB0aGUgcGFyZW50IHNlbGVjdG9yIGluIHRoZSBwYXJlbnQgY29udGV4dFxuLy8gYW5kIHJldHVybiB0aGUgcGFyZW50IGNvbXBvbmVudFxuLy8gd2hlbiBhIHNlbGVjdG9yIGlzIHBhc3NlZCB0byBhIGNvbnRhaW5lciBjb21wb25lbnQsXG4vLyBpdCB3aWxsIGJlIHN0b3JlZCBpbiB0aGUgY29udGV4dCBhbmQgcGFzc2VkIGRvd24gdG8gY2hpbGQgY29tcG9uZW50cyxcbi8vIGFzIHdlbGwgYXMgcHJvcCB0byB0aGUgZ2l2ZW4gY29tcG9uZW50XG5jb25zdCB3aXRoTG9jYWxTZWxlY3RvciA9IFBhcmVudENvbXBvbmVudCA9PiB7XG4gIGNsYXNzIFdpdGhDb25uZWN0U2VsZWN0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRpYyBjb250ZXh0VHlwZSA9IEtlcGxlckdsQ29udGV4dDtcblxuICAgIHNlbGVjdG9yRnJvbUNvbnRleHQgPSAoXywgY3R4KSA9PiAoY3R4LnNlbGVjdG9yID8gY3R4LnNlbGVjdG9yIDogaWRlbnRpdHkpO1xuICAgIHNlbGVjdG9yRnJvbVByb3BzID0gKHByb3BzLCBfKSA9PiAocHJvcHMuc2VsZWN0b3IgPyBwcm9wcy5zZWxlY3RvciA6IGlkZW50aXR5KTtcbiAgICBpZEZyb21Qcm9wcyA9IChwcm9wcywgXykgPT4gcHJvcHMuaWQ7XG4gICAgY29tcHV0ZWRTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgICAgdGhpcy5zZWxlY3RvckZyb21Db250ZXh0LFxuICAgICAgdGhpcy5zZWxlY3RvckZyb21Qcm9wcyxcbiAgICAgIChjdHgsIHByb3BzKSA9PiBtZXJnZVNlbGVjdG9ycyhjdHgsIHByb3BzKVxuICAgICk7XG4gICAgY29udGV4dFNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IodGhpcy5jb21wdXRlZFNlbGVjdG9yLCB0aGlzLmlkRnJvbVByb3BzLCAoc2VsZWN0b3IsIGlkKSA9PiAoe1xuICAgICAgc2VsZWN0b3IsXG4gICAgICBpZFxuICAgIH0pKTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IGNvbXB1dGVkQ29udGV4dCA9IHRoaXMuY29udGV4dFNlbGVjdG9yKHRoaXMucHJvcHMsIHRoaXMuY29udGV4dCk7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8S2VwbGVyR2xDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtjb21wdXRlZENvbnRleHR9PlxuICAgICAgICAgIDxQYXJlbnRDb21wb25lbnQgey4uLnRoaXMucHJvcHN9IHNlbGVjdG9yPXtjb21wdXRlZENvbnRleHQuc2VsZWN0b3J9IC8+XG4gICAgICAgIDwvS2VwbGVyR2xDb250ZXh0LlByb3ZpZGVyPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gV2l0aENvbm5lY3RTZWxlY3Rvcjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHdpdGhMb2NhbFNlbGVjdG9yO1xuIl19