'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('../common/styled-components');

var _decorator = require('react-onclickoutside/decorator');

var _decorator2 = _interopRequireDefault(_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  onClose: _propTypes2.default.func
};

var PanelDropdown = function (_Component) {
  (0, _inherits3.default)(PanelDropdown, _Component);

  function PanelDropdown() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, PanelDropdown);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = PanelDropdown.__proto__ || Object.getPrototypeOf(PanelDropdown)).call.apply(_ref, [this].concat(args))), _this), _this.handleClickOutside = function (e) {
      _this.props.onClose(e);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(PanelDropdown, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _styledComponents.StyledPanelDropdown,
        { className: this.props.className },
        this.props.children
      );
    }
  }]);
  return PanelDropdown;
}(_react.Component);

PanelDropdown.propTypes = propTypes;

exports.default = (0, _decorator2.default)(PanelDropdown);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtZHJvcGRvd24uanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwib25DbG9zZSIsImZ1bmMiLCJQYW5lbERyb3Bkb3duIiwiaGFuZGxlQ2xpY2tPdXRzaWRlIiwiZSIsInByb3BzIiwiY2xhc3NOYW1lIiwiY2hpbGRyZW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLFdBQVMsb0JBQVVDO0FBREgsQ0FBbEI7O0lBSU1DLGE7Ozs7Ozs7Ozs7Ozs7O2tOQUNKQyxrQixHQUFxQixVQUFDQyxDQUFELEVBQU87QUFDMUIsWUFBS0MsS0FBTCxDQUFXTCxPQUFYLENBQW1CSSxDQUFuQjtBQUNELEs7Ozs7OzZCQUVRO0FBQ1AsYUFDRTtBQUFBO0FBQUEsVUFBcUIsV0FBVyxLQUFLQyxLQUFMLENBQVdDLFNBQTNDO0FBQ0csYUFBS0QsS0FBTCxDQUFXRTtBQURkLE9BREY7QUFLRDs7Ozs7QUFHSEwsY0FBY0gsU0FBZCxHQUEwQkEsU0FBMUI7O2tCQUVlLHlCQUFzQkcsYUFBdEIsQyIsImZpbGUiOiJwYW5lbC1kcm9wZG93bi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7U3R5bGVkUGFuZWxEcm9wZG93bn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IGxpc3RlbnNUb0NsaWNrT3V0c2lkZSBmcm9tICdyZWFjdC1vbmNsaWNrb3V0c2lkZS9kZWNvcmF0b3InO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5jbGFzcyBQYW5lbERyb3Bkb3duIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgaGFuZGxlQ2xpY2tPdXRzaWRlID0gKGUpID0+IHtcbiAgICB0aGlzLnByb3BzLm9uQ2xvc2UoZSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkUGFuZWxEcm9wZG93biBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lfT5cbiAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgICA8L1N0eWxlZFBhbmVsRHJvcGRvd24+XG4gICAgKTtcbiAgfVxufVxuXG5QYW5lbERyb3Bkb3duLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuZXhwb3J0IGRlZmF1bHQgbGlzdGVuc1RvQ2xpY2tPdXRzaWRlKFBhbmVsRHJvcGRvd24pO1xuIl19