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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Select = (_temp = _class = function (_React$Component) {
  (0, _inherits3.default)(Select, _React$Component);

  function Select() {
    (0, _classCallCheck3.default)(this, Select);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  Select.prototype.render = function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M57,15.36a8.38,8.38,0,0,1-8.32,8.32,8.35,8.35,0,0,1-8.32-8.32A8.38,8.38,0,0,1,48.64,7,8.35,8.35,0,0,1,57,15.36Z' }),
      _react2.default.createElement('path', { d: 'M57,48.64a8.31,8.31,0,0,1-16.35,2.08H23.39A8.31,8.31,0,1,1,13.27,40.61V23.39a8.3,8.3,0,0,1-6.24-8A8.38,8.38,0,0,1,15.36,7a8.3,8.3,0,0,1,8,6.24H36.16v4.16H23.39a7.88,7.88,0,0,1-2.16,3.79,7.88,7.88,0,0,1-3.79,2.16V40.61a8.29,8.29,0,0,1,6,6H40.61a8.29,8.29,0,0,1,6-6V27.84h4.16V40.61A8.3,8.3,0,0,1,57,48.64Z' })
    );
  };

  return Select;
}(_react2.default.Component), _class.displayName = 'Select', _class.propTypes = {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes2.default.string
}, _class.defaultProps = {
  height: '16px',
  predefinedClassName: 'data-ex-icons-select'
}, _temp);
exports.default = Select;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9zZWxlY3QuanMiXSwibmFtZXMiOlsiU2VsZWN0IiwicmVuZGVyIiwicHJvcHMiLCJDb21wb25lbnQiLCJkaXNwbGF5TmFtZSIsInByb3BUeXBlcyIsImhlaWdodCIsInN0cmluZyIsImRlZmF1bHRQcm9wcyIsInByZWRlZmluZWRDbGFzc05hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7SUFFTUEsTTs7Ozs7Ozs7bUJBWUpDLE0scUJBQVM7QUFDUCxXQUNFO0FBQUE7QUFBVSxXQUFLQyxLQUFmO0FBQ0UsOENBQU0sR0FBRSxpSEFBUixHQURGO0FBRUUsOENBQU0sR0FBRSxrVEFBUjtBQUZGLEtBREY7QUFNRCxHOzs7RUFuQmtCLGdCQUFNQyxTLFVBQ2xCQyxXLEdBQWMsUSxTQUNkQyxTLEdBQVk7QUFDakI7QUFDQUMsVUFBUSxvQkFBVUM7QUFGRCxDLFNBS1pDLFksR0FBZTtBQUNwQkYsVUFBUSxNQURZO0FBRXBCRyx1QkFBcUI7QUFGRCxDO2tCQWVUVCxNIiwiZmlsZSI6InNlbGVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcblxuY2xhc3MgU2VsZWN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIGRpc3BsYXlOYW1lID0gJ1NlbGVjdCc7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBoZWlnaHQ6ICcxNnB4JyxcbiAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnZGF0YS1leC1pY29ucy1zZWxlY3QnXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxwYXRoIGQ9XCJNNTcsMTUuMzZhOC4zOCw4LjM4LDAsMCwxLTguMzIsOC4zMiw4LjM1LDguMzUsMCwwLDEtOC4zMi04LjMyQTguMzgsOC4zOCwwLDAsMSw0OC42NCw3LDguMzUsOC4zNSwwLDAsMSw1NywxNS4zNlpcIiAvPlxuICAgICAgICA8cGF0aCBkPVwiTTU3LDQ4LjY0YTguMzEsOC4zMSwwLDAsMS0xNi4zNSwyLjA4SDIzLjM5QTguMzEsOC4zMSwwLDEsMSwxMy4yNyw0MC42MVYyMy4zOWE4LjMsOC4zLDAsMCwxLTYuMjQtOEE4LjM4LDguMzgsMCwwLDEsMTUuMzYsN2E4LjMsOC4zLDAsMCwxLDgsNi4yNEgzNi4xNnY0LjE2SDIzLjM5YTcuODgsNy44OCwwLDAsMS0yLjE2LDMuNzksNy44OCw3Ljg4LDAsMCwxLTMuNzksMi4xNlY0MC42MWE4LjI5LDguMjksMCwwLDEsNiw2SDQwLjYxYTguMjksOC4yOSwwLDAsMSw2LTZWMjcuODRoNC4xNlY0MC42MUE4LjMsOC4zLDAsMCwxLDU3LDQ4LjY0WlwiIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZWxlY3Q7XG4iXX0=