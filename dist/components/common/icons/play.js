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
    return (0, _possibleConstructorReturn3.default)(this, (Play.__proto__ || Object.getPrototypeOf(Play)).apply(this, arguments));
  }

  (0, _createClass3.default)(Play, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _base2.default,
        this.props,
        _react2.default.createElement('path', { d: 'M15.625 7.434l36.738 23.378a2 2 0 0 1 0 3.375L15.625 57.566c-1.997 1.27-4.61-.164-4.61-2.531V9.965c0-2.368 2.613-3.802 4.61-2.531z' })
      );
    }
  }]);
  return Play;
}(_react2.default.Component), _class.displayName = 'Play', _class.propTypes = {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes2.default.string
}, _class.defaultProps = {
  height: '16px',
  predefinedClassName: 'data-ex-icons-play'
}, _temp);
exports.default = Play;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9wbGF5LmpzIl0sIm5hbWVzIjpbIlBsYXkiLCJwcm9wcyIsIkNvbXBvbmVudCIsImRpc3BsYXlOYW1lIiwicHJvcFR5cGVzIiwiaGVpZ2h0Iiwic3RyaW5nIiwiZGVmYXVsdFByb3BzIiwicHJlZGVmaW5lZENsYXNzTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7SUFFTUEsSTs7Ozs7Ozs7Ozs2QkFhSztBQUNQLGFBQ0U7QUFBQTtBQUFVLGFBQUtDLEtBQWY7QUFDRSxnREFBTSxHQUFFLG9JQUFSO0FBREYsT0FERjtBQUtEOzs7RUFuQmdCLGdCQUFNQyxTLFVBQ2hCQyxXLEdBQWMsTSxTQUVkQyxTLEdBQVk7QUFDakI7QUFDQUMsVUFBUSxvQkFBVUM7QUFGRCxDLFNBS1pDLFksR0FBZTtBQUNwQkYsVUFBUSxNQURZO0FBRXBCRyx1QkFBcUI7QUFGRCxDO2tCQWNUUixJIiwiZmlsZSI6InBsYXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmNsYXNzIFBsYXkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnUGxheSc7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvKiogU2V0IHRoZSBoZWlnaHQgb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhlaWdodDogJzE2cHgnLFxuICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdkYXRhLWV4LWljb25zLXBsYXknXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTUuNjI1IDcuNDM0bDM2LjczOCAyMy4zNzhhMiAyIDAgMCAxIDAgMy4zNzVMMTUuNjI1IDU3LjU2NmMtMS45OTcgMS4yNy00LjYxLS4xNjQtNC42MS0yLjUzMVY5Ljk2NWMwLTIuMzY4IDIuNjEzLTMuODAyIDQuNjEtMi41MzF6XCIvPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheTtcbiJdfQ==