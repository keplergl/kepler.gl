'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

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
    return (0, _possibleConstructorReturn3.default)(this, (Crosshairs.__proto__ || Object.getPrototypeOf(Crosshairs)).apply(this, arguments));
  }

  (0, _createClass3.default)(Crosshairs, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _base2.default,
        (0, _extends3.default)({ viewBox: '0 0 64 64' }, this.props),
        _react2.default.createElement('path', { d: 'M60.015 30h-4.12c-.961-11.648-10.237-20.932-21.88-21.908V4h-4v4.087C18.343 9.037 9.038 18.332 8.075 30h-4.06v4h4.06c.963 11.668 10.268 20.964 21.94 21.913V60h4v-4.092c11.643-.976 20.919-10.26 21.88-21.908h4.12v-4zm-8.131 0H39.723a8 8 0 0 0-5.708-5.73V12.103c9.42.954 16.928 8.473 17.869 17.897zm-21.87-17.9v12.155A7.999 7.999 0 0 0 24.248 30H12.086c.942-9.444 8.48-16.972 17.929-17.9zM12.087 34h12.161a7.999 7.999 0 0 0 5.768 5.745V51.9c-9.448-.928-16.987-8.456-17.93-17.9zm21.929 17.897V39.73A8 8 0 0 0 39.723 34h12.16c-.94 9.424-8.448 16.943-17.868 17.897z' })
      );
    }
  }]);
  return Crosshairs;
}(_react2.default.Component), _class.displayName = 'Crosshairs', _class.propTypes = {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes2.default.string
}, _class.defaultProps = {
  height: '16px',
  predefinedClassName: 'data-ex-icons-crosshairs'
}, _temp);
exports.default = Crosshairs;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9jcm9zc2hhaXJzLmpzIl0sIm5hbWVzIjpbIkNyb3NzaGFpcnMiLCJwcm9wcyIsIkNvbXBvbmVudCIsImRpc3BsYXlOYW1lIiwicHJvcFR5cGVzIiwiaGVpZ2h0Iiwic3RyaW5nIiwiZGVmYXVsdFByb3BzIiwicHJlZGVmaW5lZENsYXNzTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0lBRU1BLFU7Ozs7Ozs7Ozs7NkJBYUs7QUFDUCxhQUNFO0FBQUE7QUFBQSxpQ0FBTSxTQUFRLFdBQWQsSUFBOEIsS0FBS0MsS0FBbkM7QUFDRSxnREFBTSxHQUFFLGdqQkFBUjtBQURGLE9BREY7QUFLRDs7O0VBbkJzQixnQkFBTUMsUyxVQUN0QkMsVyxHQUFjLFksU0FFZEMsUyxHQUFZO0FBQ2pCO0FBQ0FDLFVBQVEsb0JBQVVDO0FBRkQsQyxTQUtaQyxZLEdBQWU7QUFDcEJGLFVBQVEsTUFEWTtBQUVwQkcsdUJBQXFCO0FBRkQsQztrQkFjVFIsVSIsImZpbGUiOiJjcm9zc2hhaXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5jbGFzcyBDcm9zc2hhaXJzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIGRpc3BsYXlOYW1lID0gJ0Nyb3NzaGFpcnMnO1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBoZWlnaHQ6ICcxNnB4JyxcbiAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy1jcm9zc2hhaXJzJ1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugdmlld0JveD1cIjAgMCA2NCA2NFwiIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPHBhdGggZD1cIk02MC4wMTUgMzBoLTQuMTJjLS45NjEtMTEuNjQ4LTEwLjIzNy0yMC45MzItMjEuODgtMjEuOTA4VjRoLTR2NC4wODdDMTguMzQzIDkuMDM3IDkuMDM4IDE4LjMzMiA4LjA3NSAzMGgtNC4wNnY0aDQuMDZjLjk2MyAxMS42NjggMTAuMjY4IDIwLjk2NCAyMS45NCAyMS45MTNWNjBoNHYtNC4wOTJjMTEuNjQzLS45NzYgMjAuOTE5LTEwLjI2IDIxLjg4LTIxLjkwOGg0LjEydi00em0tOC4xMzEgMEgzOS43MjNhOCA4IDAgMCAwLTUuNzA4LTUuNzNWMTIuMTAzYzkuNDIuOTU0IDE2LjkyOCA4LjQ3MyAxNy44NjkgMTcuODk3em0tMjEuODctMTcuOXYxMi4xNTVBNy45OTkgNy45OTkgMCAwIDAgMjQuMjQ4IDMwSDEyLjA4NmMuOTQyLTkuNDQ0IDguNDgtMTYuOTcyIDE3LjkyOS0xNy45ek0xMi4wODcgMzRoMTIuMTYxYTcuOTk5IDcuOTk5IDAgMCAwIDUuNzY4IDUuNzQ1VjUxLjljLTkuNDQ4LS45MjgtMTYuOTg3LTguNDU2LTE3LjkzLTE3Ljl6bTIxLjkyOSAxNy44OTdWMzkuNzNBOCA4IDAgMCAwIDM5LjcyMyAzNGgxMi4xNmMtLjk0IDkuNDI0LTguNDQ4IDE2Ljk0My0xNy44NjggMTcuODk3elwiLz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENyb3NzaGFpcnM7XG4iXX0=