"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

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

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = require("../common/styled-components");

var _reactOnclickoutside = _interopRequireDefault(require("react-onclickoutside"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ClickOutsideCloseDropdown = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(ClickOutsideCloseDropdown, _Component);

  var _super = _createSuper(ClickOutsideCloseDropdown);

  function ClickOutsideCloseDropdown() {
    var _this;

    (0, _classCallCheck2["default"])(this, ClickOutsideCloseDropdown);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleClickOutside", function (e) {
      if (typeof _this.props.onClose === 'function' && _this.props.show) {
        _this.props.onClose(e);
      }
    });
    return _this;
  }

  (0, _createClass2["default"])(ClickOutsideCloseDropdown, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_styledComponents.StyledPanelDropdown, {
        type: this.props.type,
        className: this.props.className
      }, this.props.children);
    }
  }]);
  return ClickOutsideCloseDropdown;
}(_react.Component);

(0, _defineProperty2["default"])(ClickOutsideCloseDropdown, "propTypes", {
  onClose: _propTypes["default"].func,
  show: _propTypes["default"].bool,
  type: _propTypes["default"].string
});
(0, _defineProperty2["default"])(ClickOutsideCloseDropdown, "defaultProps", {
  show: true,
  type: 'dark'
});

var _default = (0, _reactOnclickoutside["default"])(ClickOutsideCloseDropdown);

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtZHJvcGRvd24uanMiXSwibmFtZXMiOlsiQ2xpY2tPdXRzaWRlQ2xvc2VEcm9wZG93biIsImUiLCJwcm9wcyIsIm9uQ2xvc2UiLCJzaG93IiwidHlwZSIsImNsYXNzTmFtZSIsImNoaWxkcmVuIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwiZnVuYyIsImJvb2wiLCJzdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztJQUVNQSx5Qjs7Ozs7Ozs7Ozs7Ozs7OzJHQVlpQixVQUFBQyxDQUFDLEVBQUk7QUFDeEIsVUFBSSxPQUFPLE1BQUtDLEtBQUwsQ0FBV0MsT0FBbEIsS0FBOEIsVUFBOUIsSUFBNEMsTUFBS0QsS0FBTCxDQUFXRSxJQUEzRCxFQUFpRTtBQUMvRCxjQUFLRixLQUFMLENBQVdDLE9BQVgsQ0FBbUJGLENBQW5CO0FBQ0Q7QUFDRixLOzs7Ozs7V0FFRCxrQkFBUztBQUNQLDBCQUNFLGdDQUFDLHFDQUFEO0FBQXFCLFFBQUEsSUFBSSxFQUFFLEtBQUtDLEtBQUwsQ0FBV0csSUFBdEM7QUFBNEMsUUFBQSxTQUFTLEVBQUUsS0FBS0gsS0FBTCxDQUFXSTtBQUFsRSxTQUNHLEtBQUtKLEtBQUwsQ0FBV0ssUUFEZCxDQURGO0FBS0Q7OztFQXhCcUNDLGdCOztpQ0FBbENSLHlCLGVBQ2U7QUFDakJHLEVBQUFBLE9BQU8sRUFBRU0sc0JBQVVDLElBREY7QUFFakJOLEVBQUFBLElBQUksRUFBRUssc0JBQVVFLElBRkM7QUFHakJOLEVBQUFBLElBQUksRUFBRUksc0JBQVVHO0FBSEMsQztpQ0FEZloseUIsa0JBT2tCO0FBQ3BCSSxFQUFBQSxJQUFJLEVBQUUsSUFEYztBQUVwQkMsRUFBQUEsSUFBSSxFQUFFO0FBRmMsQzs7ZUFvQlQscUNBQXNCTCx5QkFBdEIsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7U3R5bGVkUGFuZWxEcm9wZG93bn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IGxpc3RlbnNUb0NsaWNrT3V0c2lkZSBmcm9tICdyZWFjdC1vbmNsaWNrb3V0c2lkZSc7XG5cbmNsYXNzIENsaWNrT3V0c2lkZUNsb3NlRHJvcGRvd24gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIHNob3c6IFByb3BUeXBlcy5ib29sLFxuICAgIHR5cGU6IFByb3BUeXBlcy5zdHJpbmdcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHNob3c6IHRydWUsXG4gICAgdHlwZTogJ2RhcmsnXG4gIH07XG5cbiAgaGFuZGxlQ2xpY2tPdXRzaWRlID0gZSA9PiB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzLm9uQ2xvc2UgPT09ICdmdW5jdGlvbicgJiYgdGhpcy5wcm9wcy5zaG93KSB7XG4gICAgICB0aGlzLnByb3BzLm9uQ2xvc2UoZSk7XG4gICAgfVxuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZFBhbmVsRHJvcGRvd24gdHlwZT17dGhpcy5wcm9wcy50eXBlfSBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lfT5cbiAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgICA8L1N0eWxlZFBhbmVsRHJvcGRvd24+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0ZW5zVG9DbGlja091dHNpZGUoQ2xpY2tPdXRzaWRlQ2xvc2VEcm9wZG93bik7XG4iXX0=