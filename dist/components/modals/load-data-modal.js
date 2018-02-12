'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  padding: 10px 0;\n'], ['\n  padding: 10px 0;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _fileUpload = require('../common/file-uploader/file-upload');

var _fileUpload2 = _interopRequireDefault(_fileUpload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StyledLoadDataModal = _styledComponents2.default.div(_templateObject);

var propTypes = {
  onClose: _react2.default.PropTypes.func.isRequired,

  // call backs
  onFileUpload: _react2.default.PropTypes.func.isRequired
};

var LoadDataModal = function LoadDataModal(props) {
  return _react2.default.createElement(
    StyledLoadDataModal,
    null,
    _react2.default.createElement(
      'div',
      { className: 'load-data-modal' },
      _react2.default.createElement(_fileUpload2.default, { onFileUpload: props.onFileUpload })
    )
  );
};

LoadDataModal.propTypes = propTypes;

exports.default = LoadDataModal;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9sb2FkLWRhdGEtbW9kYWwuanMiXSwibmFtZXMiOlsiU3R5bGVkTG9hZERhdGFNb2RhbCIsImRpdiIsInByb3BUeXBlcyIsIm9uQ2xvc2UiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCIsIm9uRmlsZVVwbG9hZCIsIkxvYWREYXRhTW9kYWwiLCJwcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7QUFFQSxJQUFNQSxzQkFBc0IsMkJBQU9DLEdBQTdCLGlCQUFOOztBQUlBLElBQU1DLFlBQVk7QUFDaEJDLFdBQVMsZ0JBQU1DLFNBQU4sQ0FBZ0JDLElBQWhCLENBQXFCQyxVQURkOztBQUdoQjtBQUNBQyxnQkFBYyxnQkFBTUgsU0FBTixDQUFnQkMsSUFBaEIsQ0FBcUJDO0FBSm5CLENBQWxCOztBQU9BLElBQU1FLGdCQUFnQixTQUFoQkEsYUFBZ0I7QUFBQSxTQUNwQjtBQUFDLHVCQUFEO0FBQUE7QUFDRTtBQUFBO0FBQUEsUUFBSyxXQUFVLGlCQUFmO0FBQ0UsNERBQVksY0FBY0MsTUFBTUYsWUFBaEM7QUFERjtBQURGLEdBRG9CO0FBQUEsQ0FBdEI7O0FBUUFDLGNBQWNOLFNBQWQsR0FBMEJBLFNBQTFCOztrQkFFZU0sYSIsImZpbGUiOiJsb2FkLWRhdGEtbW9kYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCBGaWxlVXBsb2FkIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ZpbGUtdXBsb2FkZXIvZmlsZS11cGxvYWQnO1xuXG5jb25zdCBTdHlsZWRMb2FkRGF0YU1vZGFsID0gc3R5bGVkLmRpdmBcbiAgcGFkZGluZzogMTBweCAwO1xuYDtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBvbkNsb3NlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gIC8vIGNhbGwgYmFja3NcbiAgb25GaWxlVXBsb2FkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBMb2FkRGF0YU1vZGFsID0gcHJvcHMgPT4gKFxuICA8U3R5bGVkTG9hZERhdGFNb2RhbD5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImxvYWQtZGF0YS1tb2RhbFwiPlxuICAgICAgPEZpbGVVcGxvYWQgb25GaWxlVXBsb2FkPXtwcm9wcy5vbkZpbGVVcGxvYWR9IC8+XG4gICAgPC9kaXY+XG4gIDwvU3R5bGVkTG9hZERhdGFNb2RhbD5cbik7XG5cbkxvYWREYXRhTW9kYWwucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuXG5leHBvcnQgZGVmYXVsdCBMb2FkRGF0YU1vZGFsO1xuIl19