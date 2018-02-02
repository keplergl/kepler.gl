'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class, _temp;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Crosshairs = (_temp = _class = function (_React$Component) {
  (0, _inherits3.default)(Crosshairs, _React$Component);

  function Crosshairs() {
    (0, _classCallCheck3.default)(this, Crosshairs);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  Crosshairs.prototype.render = function render() {
    return _react2.default.createElement(
      _base2.default,
      (0, _extends3.default)({ viewBox: '0 0 64 64' }, this.props),
      _react2.default.createElement('path', { d: 'M60.015 30h-4.12c-.961-11.648-10.237-20.932-21.88-21.908V4h-4v4.087C18.343 9.037 9.038 18.332 8.075 30h-4.06v4h4.06c.963 11.668 10.268 20.964 21.94 21.913V60h4v-4.092c11.643-.976 20.919-10.26 21.88-21.908h4.12v-4zm-8.131 0H39.723a8 8 0 0 0-5.708-5.73V12.103c9.42.954 16.928 8.473 17.869 17.897zm-21.87-17.9v12.155A7.999 7.999 0 0 0 24.248 30H12.086c.942-9.444 8.48-16.972 17.929-17.9zM12.087 34h12.161a7.999 7.999 0 0 0 5.768 5.745V51.9c-9.448-.928-16.987-8.456-17.93-17.9zm21.929 17.897V39.73A8 8 0 0 0 39.723 34h12.16c-.94 9.424-8.448 16.943-17.868 17.897z' })
    );
  };

  return Crosshairs;
}(_react2.default.Component), _class.displayName = 'Crosshairs', _class.propTypes = {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes2.default.string
}, _class.defaultProps = {
  height: '16px',
  predefinedClassName: 'data-ex-icons-crosshairs'
}, _temp);
exports.default = Crosshairs;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9jcm9zc2hhaXJzLmpzIl0sIm5hbWVzIjpbIkNyb3NzaGFpcnMiLCJyZW5kZXIiLCJwcm9wcyIsIkNvbXBvbmVudCIsImRpc3BsYXlOYW1lIiwicHJvcFR5cGVzIiwiaGVpZ2h0Iiwic3RyaW5nIiwiZGVmYXVsdFByb3BzIiwicHJlZGVmaW5lZENsYXNzTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7SUFFTUEsVTs7Ozs7Ozs7dUJBYUpDLE0scUJBQVM7QUFDUCxXQUNFO0FBQUE7QUFBQSwrQkFBTSxTQUFRLFdBQWQsSUFBOEIsS0FBS0MsS0FBbkM7QUFDRSw4Q0FBTSxHQUFFLGdqQkFBUjtBQURGLEtBREY7QUFLRCxHOzs7RUFuQnNCLGdCQUFNQyxTLFVBQ3RCQyxXLEdBQWMsWSxTQUVkQyxTLEdBQVk7QUFDakI7QUFDQUMsVUFBUSxvQkFBVUM7QUFGRCxDLFNBS1pDLFksR0FBZTtBQUNwQkYsVUFBUSxNQURZO0FBRXBCRyx1QkFBcUI7QUFGRCxDO2tCQWNUVCxVIiwiZmlsZSI6ImNyb3NzaGFpcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmNsYXNzIENyb3NzaGFpcnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnQ3Jvc3NoYWlycyc7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvKiogU2V0IHRoZSBoZWlnaHQgb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhlaWdodDogJzE2cHgnLFxuICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdkYXRhLWV4LWljb25zLWNyb3NzaGFpcnMnXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB2aWV3Qm94PVwiMCAwIDY0IDY0XCIgey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8cGF0aCBkPVwiTTYwLjAxNSAzMGgtNC4xMmMtLjk2MS0xMS42NDgtMTAuMjM3LTIwLjkzMi0yMS44OC0yMS45MDhWNGgtNHY0LjA4N0MxOC4zNDMgOS4wMzcgOS4wMzggMTguMzMyIDguMDc1IDMwaC00LjA2djRoNC4wNmMuOTYzIDExLjY2OCAxMC4yNjggMjAuOTY0IDIxLjk0IDIxLjkxM1Y2MGg0di00LjA5MmMxMS42NDMtLjk3NiAyMC45MTktMTAuMjYgMjEuODgtMjEuOTA4aDQuMTJ2LTR6bS04LjEzMSAwSDM5LjcyM2E4IDggMCAwIDAtNS43MDgtNS43M1YxMi4xMDNjOS40Mi45NTQgMTYuOTI4IDguNDczIDE3Ljg2OSAxNy44OTd6bS0yMS44Ny0xNy45djEyLjE1NUE3Ljk5OSA3Ljk5OSAwIDAgMCAyNC4yNDggMzBIMTIuMDg2Yy45NDItOS40NDQgOC40OC0xNi45NzIgMTcuOTI5LTE3Ljl6TTEyLjA4NyAzNGgxMi4xNjFhNy45OTkgNy45OTkgMCAwIDAgNS43NjggNS43NDVWNTEuOWMtOS40NDgtLjkyOC0xNi45ODctOC40NTYtMTcuOTMtMTcuOXptMjEuOTI5IDE3Ljg5N1YzOS43M0E4IDggMCAwIDAgMzkuNzIzIDM0aDEyLjE2Yy0uOTQgOS40MjQtOC40NDggMTYuOTQzLTE3Ljg2OCAxNy44OTd6XCIvPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ3Jvc3NoYWlycztcbiJdfQ==