"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

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

/**
 * A wrapper component in modals contain cloud providers.
 * It set default provider by checking which provider has logged in
 * @component
 */
var ProviderModalContainer = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(ProviderModalContainer, _Component);

  var _super = _createSuper(ProviderModalContainer);

  function ProviderModalContainer() {
    (0, _classCallCheck2["default"])(this, ProviderModalContainer);
    return _super.apply(this, arguments);
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
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, this.props.children);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9wcm92aWRlci1tb2RhbC1jb250YWluZXIuanMiXSwibmFtZXMiOlsiUHJvdmlkZXJNb2RhbENvbnRhaW5lciIsIl9zZXREZWZhdWx0UHJvdmlkZXIiLCJwcm9wcyIsImN1cnJlbnRQcm92aWRlciIsImNsb3VkUHJvdmlkZXJzIiwibGVuZ3RoIiwiY29ubmVjdGVkIiwiZmluZCIsInAiLCJnZXRBY2Nlc3NUb2tlbiIsIm9uU2V0Q2xvdWRQcm92aWRlciIsIm5hbWUiLCJjaGlsZHJlbiIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiYXJyYXlPZiIsIm9iamVjdCIsInN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7Ozs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFDcUJBLHNCOzs7Ozs7Ozs7Ozs7V0FZbkIsNkJBQW9CO0FBQ2xCLFdBQUtDLG1CQUFMO0FBQ0Q7OztXQUVELCtCQUFzQjtBQUNwQixVQUFJLENBQUMsS0FBS0MsS0FBTCxDQUFXQyxlQUFaLElBQStCLEtBQUtELEtBQUwsQ0FBV0UsY0FBWCxDQUEwQkMsTUFBN0QsRUFBcUU7QUFDbkUsWUFBTUMsU0FBUyxHQUFHLEtBQUtKLEtBQUwsQ0FBV0UsY0FBWCxDQUEwQkcsSUFBMUIsQ0FDaEIsVUFBQUMsQ0FBQztBQUFBLGlCQUFJLE9BQU9BLENBQUMsQ0FBQ0MsY0FBVCxLQUE0QixVQUE1QixJQUEwQ0QsQ0FBQyxDQUFDQyxjQUFGLEVBQTlDO0FBQUEsU0FEZSxDQUFsQjs7QUFJQSxZQUFJSCxTQUFTLElBQUksT0FBTyxLQUFLSixLQUFMLENBQVdRLGtCQUFsQixLQUF5QyxVQUExRCxFQUFzRTtBQUNwRSxlQUFLUixLQUFMLENBQVdRLGtCQUFYLENBQThCSixTQUFTLENBQUNLLElBQXhDO0FBQ0Q7QUFDRjtBQUNGOzs7V0FFRCxrQkFBUztBQUNQLDBCQUFPLGtFQUFHLEtBQUtULEtBQUwsQ0FBV1UsUUFBZCxDQUFQO0FBQ0Q7OztFQTlCaURDLGdCOzs7aUNBQS9CYixzQixlQUNBO0FBQ2pCVSxFQUFBQSxrQkFBa0IsRUFBRUksc0JBQVVDLElBQVYsQ0FBZUMsVUFEbEI7QUFFakJaLEVBQUFBLGNBQWMsRUFBRVUsc0JBQVVHLE9BQVYsQ0FBa0JILHNCQUFVSSxNQUE1QixDQUZDO0FBR2pCZixFQUFBQSxlQUFlLEVBQUVXLHNCQUFVSztBQUhWLEM7aUNBREFuQixzQixrQkFPRztBQUNwQkksRUFBQUEsY0FBYyxFQUFFLEVBREk7QUFFcEJELEVBQUFBLGVBQWUsRUFBRTtBQUZHLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbi8qKlxuICogQSB3cmFwcGVyIGNvbXBvbmVudCBpbiBtb2RhbHMgY29udGFpbiBjbG91ZCBwcm92aWRlcnMuXG4gKiBJdCBzZXQgZGVmYXVsdCBwcm92aWRlciBieSBjaGVja2luZyB3aGljaCBwcm92aWRlciBoYXMgbG9nZ2VkIGluXG4gKiBAY29tcG9uZW50XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb3ZpZGVyTW9kYWxDb250YWluZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG9uU2V0Q2xvdWRQcm92aWRlcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBjbG91ZFByb3ZpZGVyczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCksXG4gICAgY3VycmVudFByb3ZpZGVyOiBQcm9wVHlwZXMuc3RyaW5nXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBjbG91ZFByb3ZpZGVyczogW10sXG4gICAgY3VycmVudFByb3ZpZGVyOiBudWxsXG4gIH07XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5fc2V0RGVmYXVsdFByb3ZpZGVyKCk7XG4gIH1cblxuICBfc2V0RGVmYXVsdFByb3ZpZGVyKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5jdXJyZW50UHJvdmlkZXIgJiYgdGhpcy5wcm9wcy5jbG91ZFByb3ZpZGVycy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNvbm5lY3RlZCA9IHRoaXMucHJvcHMuY2xvdWRQcm92aWRlcnMuZmluZChcbiAgICAgICAgcCA9PiB0eXBlb2YgcC5nZXRBY2Nlc3NUb2tlbiA9PT0gJ2Z1bmN0aW9uJyAmJiBwLmdldEFjY2Vzc1Rva2VuKClcbiAgICAgICk7XG5cbiAgICAgIGlmIChjb25uZWN0ZWQgJiYgdHlwZW9mIHRoaXMucHJvcHMub25TZXRDbG91ZFByb3ZpZGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25TZXRDbG91ZFByb3ZpZGVyKGNvbm5lY3RlZC5uYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIDw+e3RoaXMucHJvcHMuY2hpbGRyZW59PC8+O1xuICB9XG59XG4iXX0=