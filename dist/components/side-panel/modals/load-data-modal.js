'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  padding: 10px 96px;\n'], ['\n  padding: 10px 96px;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _fileUpload = require('../../common/file-uploader/file-upload');

var _fileUpload2 = _interopRequireDefault(_fileUpload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContentWraooer = _styledComponents2.default.div(_templateObject);

var propTypes = {
  onClose: _react2.default.PropTypes.func.isRequired,

  // call backs
  onFileUpload: _react2.default.PropTypes.func.isRequired
};

var LoadDataModal = function LoadDataModal(props) {
  return _react2.default.createElement(
    ContentWraooer,
    null,
    _react2.default.createElement(
      'div',
      { className: '' },
      _react2.default.createElement(_fileUpload2.default, { onFileUpload: props.onFileUpload })
    )
  );
};

LoadDataModal.propTypes = propTypes;

exports.default = LoadDataModal;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbW9kYWxzL2xvYWQtZGF0YS1tb2RhbC5qcyJdLCJuYW1lcyI6WyJDb250ZW50V3Jhb29lciIsImRpdiIsInByb3BUeXBlcyIsIm9uQ2xvc2UiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCIsIm9uRmlsZVVwbG9hZCIsIkxvYWREYXRhTW9kYWwiLCJwcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7QUFFQSxJQUFNQSxpQkFBaUIsMkJBQU9DLEdBQXhCLGlCQUFOOztBQUlBLElBQU1DLFlBQVk7QUFDaEJDLFdBQVMsZ0JBQU1DLFNBQU4sQ0FBZ0JDLElBQWhCLENBQXFCQyxVQURkOztBQUdoQjtBQUNBQyxnQkFBYyxnQkFBTUgsU0FBTixDQUFnQkMsSUFBaEIsQ0FBcUJDO0FBSm5CLENBQWxCOztBQU9BLElBQU1FLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBQ0MsS0FBRDtBQUFBLFNBQ3BCO0FBQUMsa0JBQUQ7QUFBQTtBQUNFO0FBQUE7QUFBQSxRQUFLLFdBQVUsRUFBZjtBQUNFLDREQUFZLGNBQWNBLE1BQU1GLFlBQWhDO0FBREY7QUFERixHQURvQjtBQUFBLENBQXRCOztBQVFBQyxjQUFjTixTQUFkLEdBQTBCQSxTQUExQjs7a0JBRWVNLGEiLCJmaWxlIjoibG9hZC1kYXRhLW1vZGFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgRmlsZVVwbG9hZCBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9maWxlLXVwbG9hZGVyL2ZpbGUtdXBsb2FkJztcblxuY29uc3QgQ29udGVudFdyYW9vZXIgPSBzdHlsZWQuZGl2YFxuICBwYWRkaW5nOiAxMHB4IDk2cHg7XG5gO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIG9uQ2xvc2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgLy8gY2FsbCBiYWNrc1xuICBvbkZpbGVVcGxvYWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmNvbnN0IExvYWREYXRhTW9kYWwgPSAocHJvcHMpID0+IChcbiAgPENvbnRlbnRXcmFvb2VyPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiXCI+XG4gICAgICA8RmlsZVVwbG9hZCBvbkZpbGVVcGxvYWQ9e3Byb3BzLm9uRmlsZVVwbG9hZH0vPlxuICAgIDwvZGl2PlxuICA8L0NvbnRlbnRXcmFvb2VyPlxuKTtcblxuTG9hZERhdGFNb2RhbC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbmV4cG9ydCBkZWZhdWx0IExvYWREYXRhTW9kYWw7XG4iXX0=