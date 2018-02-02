'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var Play = (_temp = _class = function (_React$Component) {
  (0, _inherits3.default)(Play, _React$Component);

  function Play() {
    (0, _classCallCheck3.default)(this, Play);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  Play.prototype.render = function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M15.625 7.434l36.738 23.378a2 2 0 0 1 0 3.375L15.625 57.566c-1.997 1.27-4.61-.164-4.61-2.531V9.965c0-2.368 2.613-3.802 4.61-2.531z' })
    );
  };

  return Play;
}(_react2.default.Component), _class.displayName = 'Play', _class.propTypes = {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes2.default.string
}, _class.defaultProps = {
  height: '16px',
  predefinedClassName: 'data-ex-icons-play'
}, _temp);
exports.default = Play;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9wbGF5LmpzIl0sIm5hbWVzIjpbIlBsYXkiLCJyZW5kZXIiLCJwcm9wcyIsIkNvbXBvbmVudCIsImRpc3BsYXlOYW1lIiwicHJvcFR5cGVzIiwiaGVpZ2h0Iiwic3RyaW5nIiwiZGVmYXVsdFByb3BzIiwicHJlZGVmaW5lZENsYXNzTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztJQUVNQSxJOzs7Ozs7OztpQkFhSkMsTSxxQkFBUztBQUNQLFdBQ0U7QUFBQTtBQUFVLFdBQUtDLEtBQWY7QUFDRSw4Q0FBTSxHQUFFLG9JQUFSO0FBREYsS0FERjtBQUtELEc7OztFQW5CZ0IsZ0JBQU1DLFMsVUFDaEJDLFcsR0FBYyxNLFNBRWRDLFMsR0FBWTtBQUNqQjtBQUNBQyxVQUFRLG9CQUFVQztBQUZELEMsU0FLWkMsWSxHQUFlO0FBQ3BCRixVQUFRLE1BRFk7QUFFcEJHLHVCQUFxQjtBQUZELEM7a0JBY1RULEkiLCJmaWxlIjoicGxheS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcblxuY2xhc3MgUGxheSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdQbGF5JztcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8qKiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZ1xuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtcGxheSdcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPHBhdGggZD1cIk0xNS42MjUgNy40MzRsMzYuNzM4IDIzLjM3OGEyIDIgMCAwIDEgMCAzLjM3NUwxNS42MjUgNTcuNTY2Yy0xLjk5NyAxLjI3LTQuNjEtLjE2NC00LjYxLTIuNTMxVjkuOTY1YzAtMi4zNjggMi42MTMtMy44MDIgNC42MS0yLjUzMXpcIi8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5O1xuIl19