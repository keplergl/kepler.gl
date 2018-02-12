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

var Pin = (_temp = _class = function (_React$Component) {
  (0, _inherits3.default)(Pin, _React$Component);

  function Pin() {
    (0, _classCallCheck3.default)(this, Pin);
    return (0, _possibleConstructorReturn3.default)(this, (Pin.__proto__ || Object.getPrototypeOf(Pin)).apply(this, arguments));
  }

  (0, _createClass3.default)(Pin, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _base2.default,
        this.props,
        _react2.default.createElement('path', { d: 'M36 35.476V59a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V35.476C21.103 33.696 16 27.453 16 20c0-8.836 7.163-16 16-16s16 7.164 16 16c0 7.453-5.103 13.697-12 15.476z' })
      );
    }
  }]);
  return Pin;
}(_react2.default.Component), _class.displayName = 'Pin', _class.propTypes = {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes2.default.string
}, _class.defaultProps = {
  size: 'tiny',
  predefinedClassName: 'data-ex-icons-pin'

}, _temp);
exports.default = Pin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9waW4uanMiXSwibmFtZXMiOlsiUGluIiwicHJvcHMiLCJDb21wb25lbnQiLCJkaXNwbGF5TmFtZSIsInByb3BUeXBlcyIsImhlaWdodCIsInN0cmluZyIsImRlZmF1bHRQcm9wcyIsInNpemUiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztJQUVNQSxHOzs7Ozs7Ozs7OzZCQWNLO0FBQ1AsYUFDRTtBQUFBO0FBQVUsYUFBS0MsS0FBZjtBQUNFLGdEQUFNLEdBQUUseUpBQVI7QUFERixPQURGO0FBS0Q7OztFQXBCZSxnQkFBTUMsUyxVQUNmQyxXLEdBQWMsSyxTQUVkQyxTLEdBQVk7QUFDakI7QUFDQUMsVUFBUSxvQkFBVUM7QUFGRCxDLFNBS1pDLFksR0FBZTtBQUNwQkMsUUFBTSxNQURjO0FBRXBCQyx1QkFBcUI7O0FBRkQsQztrQkFlVFQsRyIsImZpbGUiOiJwaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmNsYXNzIFBpbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdQaW4nO1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBzaXplOiAndGlueScsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtcGluJ1xuXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxwYXRoIGQ9XCJNMzYgMzUuNDc2VjU5YTEgMSAwIDAgMS0xIDFoLTZhMSAxIDAgMCAxLTEtMVYzNS40NzZDMjEuMTAzIDMzLjY5NiAxNiAyNy40NTMgMTYgMjBjMC04LjgzNiA3LjE2My0xNiAxNi0xNnMxNiA3LjE2NCAxNiAxNmMwIDcuNDUzLTUuMTAzIDEzLjY5Ny0xMiAxNS40NzZ6XCIvPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGluO1xuIl19