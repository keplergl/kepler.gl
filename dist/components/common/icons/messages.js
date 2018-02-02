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

var Messages = (_temp = _class = function (_React$Component) {
  (0, _inherits3.default)(Messages, _React$Component);

  function Messages() {
    (0, _classCallCheck3.default)(this, Messages);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  Messages.prototype.render = function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M52 10H12a8 8 0 0 0-8 8v20a8 8 0 0 0 8 8h4v7c0 .567.455 1 .964 1 .17 0 .345-.031.512-.121L32 46h20a8 8 0 0 0 8-8V18a8 8 0 0 0-8-8zm-8 24H20v-4h24v4zm4-8H16v-4h32v4z' })
    );
  };

  return Messages;
}(_react2.default.Component), _class.displayName = 'Messages', _class.propTypes = {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes2.default.string
}, _class.defaultProps = {
  height: '16px',
  predefinedClassName: 'data-ex-icons-messages'
}, _temp);
exports.default = Messages;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9tZXNzYWdlcy5qcyJdLCJuYW1lcyI6WyJNZXNzYWdlcyIsInJlbmRlciIsInByb3BzIiwiQ29tcG9uZW50IiwiZGlzcGxheU5hbWUiLCJwcm9wVHlwZXMiLCJoZWlnaHQiLCJzdHJpbmciLCJkZWZhdWx0UHJvcHMiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0lBRU1BLFE7Ozs7Ozs7O3FCQWFKQyxNLHFCQUFTO0FBQ1AsV0FDRTtBQUFBO0FBQVUsV0FBS0MsS0FBZjtBQUNFLDhDQUFNLEdBQUUsc0tBQVI7QUFERixLQURGO0FBS0QsRzs7O0VBbkJvQixnQkFBTUMsUyxVQUNwQkMsVyxHQUFjLFUsU0FFZEMsUyxHQUFZO0FBQ2pCO0FBQ0FDLFVBQVEsb0JBQVVDO0FBRkQsQyxTQUtaQyxZLEdBQWU7QUFDcEJGLFVBQVEsTUFEWTtBQUVwQkcsdUJBQXFCO0FBRkQsQztrQkFjVFQsUSIsImZpbGUiOiJtZXNzYWdlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcblxuY2xhc3MgTWVzc2FnZXMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnTWVzc2FnZXMnO1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBoZWlnaHQ6ICcxNnB4JyxcbiAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy1tZXNzYWdlcydcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlIHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgPHBhdGggZD1cIk01MiAxMEgxMmE4IDggMCAwIDAtOCA4djIwYTggOCAwIDAgMCA4IDhoNHY3YzAgLjU2Ny40NTUgMSAuOTY0IDEgLjE3IDAgLjM0NS0uMDMxLjUxMi0uMTIxTDMyIDQ2aDIwYTggOCAwIDAgMCA4LThWMThhOCA4IDAgMCAwLTgtOHptLTggMjRIMjB2LTRoMjR2NHptNC04SDE2di00aDMydjR6XCIvPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWVzc2FnZXM7XG4iXX0=