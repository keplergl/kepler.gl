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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbW9kYWxzL2xvYWQtZGF0YS1tb2RhbC5qcyJdLCJuYW1lcyI6WyJDb250ZW50V3Jhb29lciIsImRpdiIsInByb3BUeXBlcyIsIm9uQ2xvc2UiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCIsIm9uRmlsZVVwbG9hZCIsIkxvYWREYXRhTW9kYWwiLCJwcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7QUFFQSxJQUFNQSxpQkFBaUIsMkJBQU9DLEdBQXhCLGlCQUFOOztBQUlBLElBQU1DLFlBQVk7QUFDaEJDLFdBQVMsZ0JBQU1DLFNBQU4sQ0FBZ0JDLElBQWhCLENBQXFCQyxVQURkOztBQUdoQjtBQUNBQyxnQkFBYyxnQkFBTUgsU0FBTixDQUFnQkMsSUFBaEIsQ0FBcUJDO0FBSm5CLENBQWxCOztBQU9BLElBQU1FLGdCQUFnQixTQUFoQkEsYUFBZ0I7QUFBQSxTQUNwQjtBQUFDLGtCQUFEO0FBQUE7QUFDRTtBQUFBO0FBQUEsUUFBSyxXQUFVLEVBQWY7QUFDRSw0REFBWSxjQUFjQyxNQUFNRixZQUFoQztBQURGO0FBREYsR0FEb0I7QUFBQSxDQUF0Qjs7QUFRQUMsY0FBY04sU0FBZCxHQUEwQkEsU0FBMUI7O2tCQUVlTSxhIiwiZmlsZSI6ImxvYWQtZGF0YS1tb2RhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IEZpbGVVcGxvYWQgZnJvbSAnY29tcG9uZW50cy9jb21tb24vZmlsZS11cGxvYWRlci9maWxlLXVwbG9hZCc7XG5cbmNvbnN0IENvbnRlbnRXcmFvb2VyID0gc3R5bGVkLmRpdmBcbiAgcGFkZGluZzogMTBweCA5NnB4O1xuYDtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBvbkNsb3NlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gIC8vIGNhbGwgYmFja3NcbiAgb25GaWxlVXBsb2FkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBMb2FkRGF0YU1vZGFsID0gcHJvcHMgPT4gKFxuICA8Q29udGVudFdyYW9vZXI+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJcIj5cbiAgICAgIDxGaWxlVXBsb2FkIG9uRmlsZVVwbG9hZD17cHJvcHMub25GaWxlVXBsb2FkfSAvPlxuICAgIDwvZGl2PlxuICA8L0NvbnRlbnRXcmFvb2VyPlxuKTtcblxuTG9hZERhdGFNb2RhbC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbmV4cG9ydCBkZWZhdWx0IExvYWREYXRhTW9kYWw7XG4iXX0=