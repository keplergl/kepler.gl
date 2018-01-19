'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: inline-block;\n  color: ', ';\n  font-size: 12px;\n  text-decoration: underline;\n\n  :hover {\n    cursor: pointer;\n    font-weight: 500;\n  }\n'], ['\n  display: inline-block;\n  color: ', ';\n  font-size: 12px;\n  text-decoration: underline;\n\n  :hover {\n    cursor: pointer;\n    font-weight: 500;\n  }\n']);

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
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, UploadButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this._onClick = function () {
      _this.refs.fileInput.value = null;
      _this.refs.fileInput.click();
    }, _this._onChange = function (_ref) {
      var files = _ref.target.files;

      if (!files) {
        return;
      }

      _this.props.onUpload(files);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  UploadButton.prototype.render = function render() {
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
  };

  return UploadButton;
}(_react.Component);

exports.default = UploadButton;


UploadButton.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9maWxlLXVwbG9hZGVyL3VwbG9hZC1idXR0b24uanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwib25VcGxvYWQiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCIsIldyYXBwZXIiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwidGV4dENvbG9yTFQiLCJVcGxvYWRCdXR0b24iLCJfb25DbGljayIsInJlZnMiLCJmaWxlSW5wdXQiLCJ2YWx1ZSIsImNsaWNrIiwiX29uQ2hhbmdlIiwiZmlsZXMiLCJ0YXJnZXQiLCJyZW5kZXIiLCJkaXNwbGF5IiwiY2hpbGRyZW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxZQUFZO0FBQ2hCQyxZQUFVLGdCQUFNQyxTQUFOLENBQWdCQyxJQUFoQixDQUFxQkM7QUFEZixDQUFsQjs7QUFJQSxJQUFNQyxVQUFVLDJCQUFPQyxHQUFqQixrQkFFSztBQUFBLFNBQVNDLE1BQU1DLEtBQU4sQ0FBWUMsV0FBckI7QUFBQSxDQUZMLENBQU47QUFXQTs7OztJQUdxQkMsWTs7Ozs7Ozs7Ozs7OzBKQUNuQkMsUSxHQUFXLFlBQU07QUFDZixZQUFLQyxJQUFMLENBQVVDLFNBQVYsQ0FBb0JDLEtBQXBCLEdBQTRCLElBQTVCO0FBQ0EsWUFBS0YsSUFBTCxDQUFVQyxTQUFWLENBQW9CRSxLQUFwQjtBQUNELEssUUFFREMsUyxHQUFZLGdCQUF1QjtBQUFBLFVBQVpDLEtBQVksUUFBckJDLE1BQXFCLENBQVpELEtBQVk7O0FBQ2pDLFVBQUksQ0FBQ0EsS0FBTCxFQUFZO0FBQ1Y7QUFDRDs7QUFFRCxZQUFLVixLQUFMLENBQVdOLFFBQVgsQ0FBb0JnQixLQUFwQjtBQUNELEs7Ozt5QkFFREUsTSxxQkFBUztBQUNQLFdBQ0U7QUFBQyxhQUFEO0FBQUE7QUFDRTtBQUNFLGNBQUssTUFEUDtBQUVFLGFBQUksV0FGTjtBQUdFLGVBQU8sRUFBQ0MsU0FBUyxNQUFWLEVBSFQ7QUFJRSxrQkFBVSxLQUFLSjtBQUpqQixRQURGO0FBT0U7QUFBQTtBQUFBLFVBQU0sU0FBUyxLQUFLTCxRQUFwQjtBQUErQixhQUFLSixLQUFMLENBQVdjO0FBQTFDO0FBUEYsS0FERjtBQVdELEc7Ozs7O2tCQTFCa0JYLFk7OztBQTZCckJBLGFBQWFWLFNBQWIsR0FBeUJBLFNBQXpCIiwiZmlsZSI6InVwbG9hZC1idXR0b24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIG9uVXBsb2FkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JMVH07XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgfVxuYDtcbi8qXG5JbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vb2tvbmV0L3JlYWN0LWRyb3B6b25lL2Jsb2IvbWFzdGVyL3NyYy9pbmRleC5qc1xuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVwbG9hZEJ1dHRvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIF9vbkNsaWNrID0gKCkgPT4ge1xuICAgIHRoaXMucmVmcy5maWxlSW5wdXQudmFsdWUgPSBudWxsO1xuICAgIHRoaXMucmVmcy5maWxlSW5wdXQuY2xpY2soKTtcbiAgfTtcblxuICBfb25DaGFuZ2UgPSAoe3RhcmdldDoge2ZpbGVzfX0pID0+IHtcbiAgICBpZiAoIWZpbGVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wcy5vblVwbG9hZChmaWxlcyk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8V3JhcHBlcj5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgIHJlZj1cImZpbGVJbnB1dFwiXG4gICAgICAgICAgc3R5bGU9e3tkaXNwbGF5OiAnbm9uZSd9fVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLl9vbkNoYW5nZX1cbiAgICAgICAgLz5cbiAgICAgICAgPHNwYW4gb25DbGljaz17dGhpcy5fb25DbGlja30+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9zcGFuPlxuICAgICAgPC9XcmFwcGVyPlxuICAgICk7XG4gIH1cbn1cblxuVXBsb2FkQnV0dG9uLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbiJdfQ==