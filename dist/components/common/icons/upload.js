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

var Upload = (_temp = _class = function (_React$Component) {
  (0, _inherits3.default)(Upload, _React$Component);

  function Upload() {
    (0, _classCallCheck3.default)(this, Upload);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  Upload.prototype.render = function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M52 9v6a1 1 0 0 1-1 1H13a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h38a1 1 0 0 1 1 1zm-4 31L34.426 21.336a3 3 0 0 0-4.852 0L16 40h8v16h16V40h8z' })
    );
  };

  return Upload;
}(_react2.default.Component), _class.displayName = 'Upload', _class.propTypes = {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes2.default.string,
  predefinedClassName: _propTypes2.default.string
}, _class.defaultProps = {
  height: '16px',
  predefinedClassName: 'data-ex-icons-upload'
}, _temp);
exports.default = Upload;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy91cGxvYWQuanMiXSwibmFtZXMiOlsiVXBsb2FkIiwicmVuZGVyIiwicHJvcHMiLCJDb21wb25lbnQiLCJkaXNwbGF5TmFtZSIsInByb3BUeXBlcyIsImhlaWdodCIsInN0cmluZyIsInByZWRlZmluZWRDbGFzc05hbWUiLCJkZWZhdWx0UHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7SUFFTUEsTTs7Ozs7Ozs7bUJBY0pDLE0scUJBQVM7QUFDUCxXQUNFO0FBQUE7QUFBVSxXQUFLQyxLQUFmO0FBQ0UsOENBQU0sR0FBRSxvSUFBUjtBQURGLEtBREY7QUFLRCxHOzs7RUFwQmtCLGdCQUFNQyxTLFVBQ2xCQyxXLEdBQWMsUSxTQUVkQyxTLEdBQVk7QUFDakI7QUFDQUMsVUFBUSxvQkFBVUMsTUFGRDtBQUdqQkMsdUJBQXFCLG9CQUFVRDtBQUhkLEMsU0FNWkUsWSxHQUFlO0FBQ3BCSCxVQUFRLE1BRFk7QUFFcEJFLHVCQUFxQjtBQUZELEM7a0JBY1RSLE0iLCJmaWxlIjoidXBsb2FkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5jbGFzcyBVcGxvYWQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnVXBsb2FkJztcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8qKiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBoZWlnaHQ6ICcxNnB4JyxcbiAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy11cGxvYWQnXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxwYXRoIGQ9XCJNNTIgOXY2YTEgMSAwIDAgMS0xIDFIMTNhMSAxIDAgMCAxLTEtMVY5YTEgMSAwIDAgMSAxLTFoMzhhMSAxIDAgMCAxIDEgMXptLTQgMzFMMzQuNDI2IDIxLjMzNmEzIDMgMCAwIDAtNC44NTIgMEwxNiA0MGg4djE2aDE2VjQwaDh6XCIvPlxuICAgICAgPC9CYXNlPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVXBsb2FkO1xuIl19