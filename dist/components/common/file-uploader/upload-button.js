'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  display: inline-block;\n  color: ', ';\n  font-size: 12px;\n  text-decoration: underline;\n\n  :hover {\n    cursor: pointer;\n    font-weight: 500;\n  }\n'], ['\n  display: inline-block;\n  color: ', ';\n  font-size: 12px;\n  text-decoration: underline;\n\n  :hover {\n    cursor: pointer;\n    font-weight: 500;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  onUpload: _react2.default.PropTypes.func.isRequired
};

var Wrapper = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.textColorLT;
});
/*
Inspired by https://github.com/okonet/react-dropzone/blob/master/src/index.js
*/

var UploadButton = function (_Component) {
  (0, _inherits3.default)(UploadButton, _Component);

  function UploadButton() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, UploadButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = UploadButton.__proto__ || Object.getPrototypeOf(UploadButton)).call.apply(_ref, [this].concat(args))), _this), _this._onClick = function () {
      _this.refs.fileInput.value = null;
      _this.refs.fileInput.click();
    }, _this._onChange = function (_ref2) {
      var files = _ref2.target.files;

      if (!files) {
        return;
      }

      _this.props.onUpload(files);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(UploadButton, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        Wrapper,
        null,
        _react2.default.createElement('input', {
          type: 'file',
          ref: 'fileInput',
          style: { display: 'none' },
          onChange: this._onChange
        }),
        _react2.default.createElement(
          'span',
          { onClick: this._onClick },
          this.props.children
        )
      );
    }
  }]);
  return UploadButton;
}(_react.Component);

exports.default = UploadButton;


UploadButton.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9maWxlLXVwbG9hZGVyL3VwbG9hZC1idXR0b24uanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwib25VcGxvYWQiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCIsIldyYXBwZXIiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwidGV4dENvbG9yTFQiLCJVcGxvYWRCdXR0b24iLCJfb25DbGljayIsInJlZnMiLCJmaWxlSW5wdXQiLCJ2YWx1ZSIsImNsaWNrIiwiX29uQ2hhbmdlIiwiZmlsZXMiLCJ0YXJnZXQiLCJkaXNwbGF5IiwiY2hpbGRyZW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsWUFBWTtBQUNoQkMsWUFBVSxnQkFBTUMsU0FBTixDQUFnQkMsSUFBaEIsQ0FBcUJDO0FBRGYsQ0FBbEI7O0FBSUEsSUFBTUMsVUFBVSwyQkFBT0MsR0FBakIsa0JBRUs7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlDLFdBQXJCO0FBQUEsQ0FGTCxDQUFOO0FBV0E7Ozs7SUFHcUJDLFk7Ozs7Ozs7Ozs7Ozs7O2dOQUNuQkMsUSxHQUFXLFlBQU07QUFDZixZQUFLQyxJQUFMLENBQVVDLFNBQVYsQ0FBb0JDLEtBQXBCLEdBQTRCLElBQTVCO0FBQ0EsWUFBS0YsSUFBTCxDQUFVQyxTQUFWLENBQW9CRSxLQUFwQjtBQUNELEssUUFFREMsUyxHQUFZLGlCQUF1QjtBQUFBLFVBQVpDLEtBQVksU0FBckJDLE1BQXFCLENBQVpELEtBQVk7O0FBQ2pDLFVBQUksQ0FBQ0EsS0FBTCxFQUFZO0FBQ1Y7QUFDRDs7QUFFRCxZQUFLVixLQUFMLENBQVdOLFFBQVgsQ0FBb0JnQixLQUFwQjtBQUNELEs7Ozs7OzZCQUVRO0FBQ1AsYUFDRTtBQUFDLGVBQUQ7QUFBQTtBQUNFO0FBQ0UsZ0JBQUssTUFEUDtBQUVFLGVBQUksV0FGTjtBQUdFLGlCQUFPLEVBQUNFLFNBQVMsTUFBVixFQUhUO0FBSUUsb0JBQVUsS0FBS0g7QUFKakIsVUFERjtBQU9FO0FBQUE7QUFBQSxZQUFNLFNBQVMsS0FBS0wsUUFBcEI7QUFBK0IsZUFBS0osS0FBTCxDQUFXYTtBQUExQztBQVBGLE9BREY7QUFXRDs7Ozs7a0JBMUJrQlYsWTs7O0FBNkJyQkEsYUFBYVYsU0FBYixHQUF5QkEsU0FBekIiLCJmaWxlIjoidXBsb2FkLWJ1dHRvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgb25VcGxvYWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmNvbnN0IFdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckxUfTtcbiAgZm9udC1zaXplOiAxMnB4O1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICB9XG5gO1xuLypcbkluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9va29uZXQvcmVhY3QtZHJvcHpvbmUvYmxvYi9tYXN0ZXIvc3JjL2luZGV4LmpzXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXBsb2FkQnV0dG9uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgX29uQ2xpY2sgPSAoKSA9PiB7XG4gICAgdGhpcy5yZWZzLmZpbGVJbnB1dC52YWx1ZSA9IG51bGw7XG4gICAgdGhpcy5yZWZzLmZpbGVJbnB1dC5jbGljaygpO1xuICB9O1xuXG4gIF9vbkNoYW5nZSA9ICh7dGFyZ2V0OiB7ZmlsZXN9fSkgPT4ge1xuICAgIGlmICghZmlsZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnByb3BzLm9uVXBsb2FkKGZpbGVzKTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxXcmFwcGVyPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgcmVmPVwiZmlsZUlucHV0XCJcbiAgICAgICAgICBzdHlsZT17e2Rpc3BsYXk6ICdub25lJ319XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuX29uQ2hhbmdlfVxuICAgICAgICAvPlxuICAgICAgICA8c3BhbiBvbkNsaWNrPXt0aGlzLl9vbkNsaWNrfT57dGhpcy5wcm9wcy5jaGlsZHJlbn08L3NwYW4+XG4gICAgICA8L1dyYXBwZXI+XG4gICAgKTtcbiAgfVxufVxuXG5VcGxvYWRCdXR0b24ucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuIl19