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

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

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

/**
 * A wrapper component in modals contain cloud providers.
 * It set default provider by checking which provider has logged in
 * @component
 */
var ProviderModalContainer =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(ProviderModalContainer, _Component);

  function ProviderModalContainer() {
    (0, _classCallCheck2["default"])(this, ProviderModalContainer);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ProviderModalContainer).apply(this, arguments));
  }

  (0, _createClass2["default"])(ProviderModalContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._setDefaultProvider();
    }
  }, {
    key: "_setDefaultProvider",
    value: function _setDefaultProvider() {
      if (!this.props.currentProvider && this.props.cloudProviders.length) {
        var connected = this.props.cloudProviders.find(function (p) {
          return typeof p.getAccessToken === 'function' && p.getAccessToken();
        });

        if (connected && typeof this.props.onSetCloudProvider === 'function') {
          this.props.onSetCloudProvider(connected.name);
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _react["default"].createElement(_react["default"].Fragment, null, this.props.children);
    }
  }]);
  return ProviderModalContainer;
}(_react.Component);

exports["default"] = ProviderModalContainer;
(0, _defineProperty2["default"])(ProviderModalContainer, "propTypes", {
  onSetCloudProvider: _propTypes["default"].func.isRequired,
  cloudProviders: _propTypes["default"].arrayOf(_propTypes["default"].object),
  currentProvider: _propTypes["default"].string
});
(0, _defineProperty2["default"])(ProviderModalContainer, "defaultProps", {
  cloudProviders: [],
  currentProvider: null
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9wcm92aWRlci1tb2RhbC1jb250YWluZXIuanMiXSwibmFtZXMiOlsiUHJvdmlkZXJNb2RhbENvbnRhaW5lciIsIl9zZXREZWZhdWx0UHJvdmlkZXIiLCJwcm9wcyIsImN1cnJlbnRQcm92aWRlciIsImNsb3VkUHJvdmlkZXJzIiwibGVuZ3RoIiwiY29ubmVjdGVkIiwiZmluZCIsInAiLCJnZXRBY2Nlc3NUb2tlbiIsIm9uU2V0Q2xvdWRQcm92aWRlciIsIm5hbWUiLCJjaGlsZHJlbiIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiYXJyYXlPZiIsIm9iamVjdCIsInN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUtBOzs7OztJQUtxQkEsc0I7Ozs7Ozs7Ozs7Ozt3Q0FZQztBQUNsQixXQUFLQyxtQkFBTDtBQUNEOzs7MENBRXFCO0FBQ3BCLFVBQUksQ0FBQyxLQUFLQyxLQUFMLENBQVdDLGVBQVosSUFBK0IsS0FBS0QsS0FBTCxDQUFXRSxjQUFYLENBQTBCQyxNQUE3RCxFQUFxRTtBQUNuRSxZQUFNQyxTQUFTLEdBQUcsS0FBS0osS0FBTCxDQUFXRSxjQUFYLENBQTBCRyxJQUExQixDQUNoQixVQUFBQyxDQUFDO0FBQUEsaUJBQUksT0FBT0EsQ0FBQyxDQUFDQyxjQUFULEtBQTRCLFVBQTVCLElBQTBDRCxDQUFDLENBQUNDLGNBQUYsRUFBOUM7QUFBQSxTQURlLENBQWxCOztBQUlBLFlBQUlILFNBQVMsSUFBSSxPQUFPLEtBQUtKLEtBQUwsQ0FBV1Esa0JBQWxCLEtBQXlDLFVBQTFELEVBQXNFO0FBQ3BFLGVBQUtSLEtBQUwsQ0FBV1Esa0JBQVgsQ0FBOEJKLFNBQVMsQ0FBQ0ssSUFBeEM7QUFDRDtBQUNGO0FBQ0Y7Ozs2QkFFUTtBQUNQLGFBQU8sa0VBQUcsS0FBS1QsS0FBTCxDQUFXVSxRQUFkLENBQVA7QUFDRDs7O0VBOUJpREMsZ0I7OztpQ0FBL0JiLHNCLGVBQ0E7QUFDakJVLEVBQUFBLGtCQUFrQixFQUFFSSxzQkFBVUMsSUFBVixDQUFlQyxVQURsQjtBQUVqQlosRUFBQUEsY0FBYyxFQUFFVSxzQkFBVUcsT0FBVixDQUFrQkgsc0JBQVVJLE1BQTVCLENBRkM7QUFHakJmLEVBQUFBLGVBQWUsRUFBRVcsc0JBQVVLO0FBSFYsQztpQ0FEQW5CLHNCLGtCQU9HO0FBQ3BCSSxFQUFBQSxjQUFjLEVBQUUsRUFESTtBQUVwQkQsRUFBQUEsZUFBZSxFQUFFO0FBRkcsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuLyoqXG4gKiBBIHdyYXBwZXIgY29tcG9uZW50IGluIG1vZGFscyBjb250YWluIGNsb3VkIHByb3ZpZGVycy5cbiAqIEl0IHNldCBkZWZhdWx0IHByb3ZpZGVyIGJ5IGNoZWNraW5nIHdoaWNoIHByb3ZpZGVyIGhhcyBsb2dnZWQgaW5cbiAqIEBjb21wb25lbnRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvdmlkZXJNb2RhbENvbnRhaW5lciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgb25TZXRDbG91ZFByb3ZpZGVyOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNsb3VkUHJvdmlkZXJzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KSxcbiAgICBjdXJyZW50UHJvdmlkZXI6IFByb3BUeXBlcy5zdHJpbmdcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGNsb3VkUHJvdmlkZXJzOiBbXSxcbiAgICBjdXJyZW50UHJvdmlkZXI6IG51bGxcbiAgfTtcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9zZXREZWZhdWx0UHJvdmlkZXIoKTtcbiAgfVxuXG4gIF9zZXREZWZhdWx0UHJvdmlkZXIoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmN1cnJlbnRQcm92aWRlciAmJiB0aGlzLnByb3BzLmNsb3VkUHJvdmlkZXJzLmxlbmd0aCkge1xuICAgICAgY29uc3QgY29ubmVjdGVkID0gdGhpcy5wcm9wcy5jbG91ZFByb3ZpZGVycy5maW5kKFxuICAgICAgICBwID0+IHR5cGVvZiBwLmdldEFjY2Vzc1Rva2VuID09PSAnZnVuY3Rpb24nICYmIHAuZ2V0QWNjZXNzVG9rZW4oKVxuICAgICAgKTtcblxuICAgICAgaWYgKGNvbm5lY3RlZCAmJiB0eXBlb2YgdGhpcy5wcm9wcy5vblNldENsb3VkUHJvdmlkZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5vblNldENsb3VkUHJvdmlkZXIoY29ubmVjdGVkLm5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gPD57dGhpcy5wcm9wcy5jaGlsZHJlbn08Lz47XG4gIH1cbn1cbiJdfQ==