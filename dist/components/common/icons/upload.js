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

var Upload = (_temp = _class = function (_React$Component) {
  (0, _inherits3.default)(Upload, _React$Component);

  function Upload() {
    (0, _classCallCheck3.default)(this, Upload);
    return (0, _possibleConstructorReturn3.default)(this, (Upload.__proto__ || Object.getPrototypeOf(Upload)).apply(this, arguments));
  }

  (0, _createClass3.default)(Upload, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _base2.default,
        this.props,
        _react2.default.createElement('path', { d: 'M52 9v6a1 1 0 0 1-1 1H13a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h38a1 1 0 0 1 1 1zm-4 31L34.426 21.336a3 3 0 0 0-4.852 0L16 40h8v16h16V40h8z' })
      );
    }
  }]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy91cGxvYWQuanMiXSwibmFtZXMiOlsiVXBsb2FkIiwicHJvcHMiLCJDb21wb25lbnQiLCJkaXNwbGF5TmFtZSIsInByb3BUeXBlcyIsImhlaWdodCIsInN0cmluZyIsInByZWRlZmluZWRDbGFzc05hbWUiLCJkZWZhdWx0UHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0lBRU1BLE07Ozs7Ozs7Ozs7NkJBY0s7QUFDUCxhQUNFO0FBQUE7QUFBVSxhQUFLQyxLQUFmO0FBQ0UsZ0RBQU0sR0FBRSxvSUFBUjtBQURGLE9BREY7QUFLRDs7O0VBcEJrQixnQkFBTUMsUyxVQUNsQkMsVyxHQUFjLFEsU0FFZEMsUyxHQUFZO0FBQ2pCO0FBQ0FDLFVBQVEsb0JBQVVDLE1BRkQ7QUFHakJDLHVCQUFxQixvQkFBVUQ7QUFIZCxDLFNBTVpFLFksR0FBZTtBQUNwQkgsVUFBUSxNQURZO0FBRXBCRSx1QkFBcUI7QUFGRCxDO2tCQWNUUCxNIiwiZmlsZSI6InVwbG9hZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcblxuY2xhc3MgVXBsb2FkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIGRpc3BsYXlOYW1lID0gJ1VwbG9hZCc7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvKiogU2V0IHRoZSBoZWlnaHQgb2YgdGhlIGljb24sIGV4LiAnMTZweCcgKi9cbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZ1xuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGVpZ2h0OiAnMTZweCcsXG4gICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtdXBsb2FkJ1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2Ugey4uLnRoaXMucHJvcHN9PlxuICAgICAgICA8cGF0aCBkPVwiTTUyIDl2NmExIDEgMCAwIDEtMSAxSDEzYTEgMSAwIDAgMS0xLTFWOWExIDEgMCAwIDEgMS0xaDM4YTEgMSAwIDAgMSAxIDF6bS00IDMxTDM0LjQyNiAyMS4zMzZhMyAzIDAgMCAwLTQuODUyIDBMMTYgNDBoOHYxNmgxNlY0MGg4elwiLz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFVwbG9hZDtcbiJdfQ==