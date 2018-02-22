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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Share = function (_React$Component) {
  (0, _inherits3.default)(Share, _React$Component);

  function Share() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Share);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Share.__proto__ || Object.getPrototypeOf(Share)).call.apply(_ref, [this].concat(args))), _this), _this.defaultProps = {
      height: '16px',
      predefinedClassName: 'data-ex-icons-share'
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Share, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _base2.default,
        this.props,
        _react2.default.createElement('path', { d: 'M58 50c0 5.523-4.477 10-10 10s-10-4.477-10-10c0-.432.037-.854.09-1.272L22.236 39.81A9.95 9.95 0 0 1 16 42c-5.523 0-10-4.477-10-10s4.477-10 10-10a9.95 9.95 0 0 1 6.236 2.19l15.854-8.918A10.03 10.03 0 0 1 38 14c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10a9.95 9.95 0 0 1-6.236-2.19L25.91 30.728c.053.418.09.84.09 1.272s-.037.854-.09 1.272l15.854 8.918A9.95 9.95 0 0 1 48 40c5.523 0 10 4.477 10 10z' })
      );
    }
  }]);
  return Share;
}(_react2.default.Component);

exports.default = Share;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9zaGFyZS5qcyJdLCJuYW1lcyI6WyJTaGFyZSIsImRlZmF1bHRQcm9wcyIsImhlaWdodCIsInByZWRlZmluZWRDbGFzc05hbWUiLCJwcm9wcyIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0lBRU1BLEs7Ozs7Ozs7Ozs7Ozs7O2tNQVFKQyxZLEdBQWU7QUFDYkMsY0FBUSxNQURLO0FBRWJDLDJCQUFxQjtBQUZSLEs7Ozs7OzZCQUtOO0FBQ1AsYUFDRTtBQUFBO0FBQVUsYUFBS0MsS0FBZjtBQUNFLGdEQUFNLEdBQUUsc1pBQVI7QUFERixPQURGO0FBS0Q7OztFQW5CaUIsZ0JBQU1DLFM7O2tCQXNCWEwsSyIsImZpbGUiOiJzaGFyZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcblxuY2xhc3MgU2hhcmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBkaXNwbGF5TmFtZTogJ1NoYXJlJztcblxuICBwcm9wVHlwZXM6IHtcbiAgICAvKiogU2V0IHRoZSBoZWlnaHQgb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgfTtcblxuICBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtc2hhcmUnXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxwYXRoIGQ9XCJNNTggNTBjMCA1LjUyMy00LjQ3NyAxMC0xMCAxMHMtMTAtNC40NzctMTAtMTBjMC0uNDMyLjAzNy0uODU0LjA5LTEuMjcyTDIyLjIzNiAzOS44MUE5Ljk1IDkuOTUgMCAwIDEgMTYgNDJjLTUuNTIzIDAtMTAtNC40NzctMTAtMTBzNC40NzctMTAgMTAtMTBhOS45NSA5Ljk1IDAgMCAxIDYuMjM2IDIuMTlsMTUuODU0LTguOTE4QTEwLjAzIDEwLjAzIDAgMCAxIDM4IDE0YzAtNS41MjMgNC40NzctMTAgMTAtMTBzMTAgNC40NzcgMTAgMTAtNC40NzcgMTAtMTAgMTBhOS45NSA5Ljk1IDAgMCAxLTYuMjM2LTIuMTlMMjUuOTEgMzAuNzI4Yy4wNTMuNDE4LjA5Ljg0LjA5IDEuMjcycy0uMDM3Ljg1NC0uMDkgMS4yNzJsMTUuODU0IDguOTE4QTkuOTUgOS45NSAwIDAgMSA0OCA0MGM1LjUyMyAwIDEwIDQuNDc3IDEwIDEwelwiIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGFyZTtcbiJdfQ==