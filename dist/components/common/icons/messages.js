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

var Messages = (_temp = _class = function (_React$Component) {
  (0, _inherits3.default)(Messages, _React$Component);

  function Messages() {
    (0, _classCallCheck3.default)(this, Messages);
    return (0, _possibleConstructorReturn3.default)(this, (Messages.__proto__ || Object.getPrototypeOf(Messages)).apply(this, arguments));
  }

  (0, _createClass3.default)(Messages, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _base2.default,
        this.props,
        _react2.default.createElement('path', { d: 'M52 10H12a8 8 0 0 0-8 8v20a8 8 0 0 0 8 8h4v7c0 .567.455 1 .964 1 .17 0 .345-.031.512-.121L32 46h20a8 8 0 0 0 8-8V18a8 8 0 0 0-8-8zm-8 24H20v-4h24v4zm4-8H16v-4h32v4z' })
      );
    }
  }]);
  return Messages;
}(_react2.default.Component), _class.displayName = 'Messages', _class.propTypes = {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes2.default.string
}, _class.defaultProps = {
  height: '16px',
  predefinedClassName: 'data-ex-icons-messages'
}, _temp);
exports.default = Messages;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9tZXNzYWdlcy5qcyJdLCJuYW1lcyI6WyJNZXNzYWdlcyIsInByb3BzIiwiQ29tcG9uZW50IiwiZGlzcGxheU5hbWUiLCJwcm9wVHlwZXMiLCJoZWlnaHQiLCJzdHJpbmciLCJkZWZhdWx0UHJvcHMiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztJQUVNQSxROzs7Ozs7Ozs7OzZCQWFLO0FBQ1AsYUFDRTtBQUFBO0FBQVUsYUFBS0MsS0FBZjtBQUNFLGdEQUFNLEdBQUUsc0tBQVI7QUFERixPQURGO0FBS0Q7OztFQW5Cb0IsZ0JBQU1DLFMsVUFDcEJDLFcsR0FBYyxVLFNBRWRDLFMsR0FBWTtBQUNqQjtBQUNBQyxVQUFRLG9CQUFVQztBQUZELEMsU0FLWkMsWSxHQUFlO0FBQ3BCRixVQUFRLE1BRFk7QUFFcEJHLHVCQUFxQjtBQUZELEM7a0JBY1RSLFEiLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBCYXNlIGZyb20gJy4vYmFzZSc7XG5cbmNsYXNzIE1lc3NhZ2VzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIGRpc3BsYXlOYW1lID0gJ01lc3NhZ2VzJztcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8qKiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZ1xuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtbWVzc2FnZXMnXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxwYXRoIGQ9XCJNNTIgMTBIMTJhOCA4IDAgMCAwLTggOHYyMGE4IDggMCAwIDAgOCA4aDR2N2MwIC41NjcuNDU1IDEgLjk2NCAxIC4xNyAwIC4zNDUtLjAzMS41MTItLjEyMUwzMiA0NmgyMGE4IDggMCAwIDAgOC04VjE4YTggOCAwIDAgMC04LTh6bS04IDI0SDIwdi00aDI0djR6bTQtOEgxNnYtNGgzMnY0elwiLz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1lc3NhZ2VzO1xuIl19