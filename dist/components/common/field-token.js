'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  background-color: rgba(', ', .2);\n  border-radius: 2px;\n  border: 1px solid rgb(', ');\n  color: rgb(', ');\n  display: inline-block;\n  font-size: 10px;\n  font-weight: 400;\n  padding: 0 5px;\n  text-align: center;\n  width: 40px;\n'], ['\n  background-color: rgba(', ', .2);\n  border-radius: 2px;\n  border: 1px solid rgb(', ');\n  color: rgb(', ');\n  display: inline-block;\n  font-size: 10px;\n  font-weight: 400;\n  padding: 0 5px;\n  text-align: center;\n  width: 40px;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _defaultSettings = require('../../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FieldTag = _styledComponents2.default.div(_templateObject, function (props) {
  return props.color;
}, function (props) {
  return props.color;
}, function (props) {
  return props.color;
});

var FieldToken = function FieldToken(_ref) {
  var type = _ref.type;
  return _react2.default.createElement(
    FieldTag,
    { color: _defaultSettings.FILED_TYPE_DISPLAY[type] && _defaultSettings.FILED_TYPE_DISPLAY[type].color || _defaultSettings.FIELD_COLORS.default },
    _defaultSettings.FILED_TYPE_DISPLAY[type].label
  );
};

exports.default = FieldToken;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9maWVsZC10b2tlbi5qcyJdLCJuYW1lcyI6WyJGaWVsZFRhZyIsImRpdiIsInByb3BzIiwiY29sb3IiLCJGaWVsZFRva2VuIiwidHlwZSIsImRlZmF1bHQiLCJsYWJlbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBOzs7O0FBRUEsSUFBTUEsV0FBVywyQkFBT0MsR0FBbEIsa0JBQ3FCO0FBQUEsU0FBU0MsTUFBTUMsS0FBZjtBQUFBLENBRHJCLEVBR29CO0FBQUEsU0FBU0QsTUFBTUMsS0FBZjtBQUFBLENBSHBCLEVBSVM7QUFBQSxTQUFTRCxNQUFNQyxLQUFmO0FBQUEsQ0FKVCxDQUFOOztBQWFBLElBQU1DLGFBQWEsU0FBYkEsVUFBYTtBQUFBLE1BQUVDLElBQUYsUUFBRUEsSUFBRjtBQUFBLFNBQ2pCO0FBQUMsWUFBRDtBQUFBLE1BQVUsT0FBUSxvQ0FBbUJBLElBQW5CLEtBQTRCLG9DQUFtQkEsSUFBbkIsRUFBeUJGLEtBQXRELElBQWdFLDhCQUFhRyxPQUE5RjtBQUNHLHdDQUFtQkQsSUFBbkIsRUFBeUJFO0FBRDVCLEdBRGlCO0FBQUEsQ0FBbkI7O2tCQU1lSCxVIiwiZmlsZSI6ImZpZWxkLXRva2VuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQge0ZJTEVEX1RZUEVfRElTUExBWSwgRklFTERfQ09MT1JTfSBmcm9tICcuLi8uLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmNvbnN0IEZpZWxkVGFnID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgke3Byb3BzID0+IHByb3BzLmNvbG9yfSwgLjIpO1xuICBib3JkZXItcmFkaXVzOiAycHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYigke3Byb3BzID0+IHByb3BzLmNvbG9yfSk7XG4gIGNvbG9yOiByZ2IoJHtwcm9wcyA9PiBwcm9wcy5jb2xvcn0pO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGZvbnQtc2l6ZTogMTBweDtcbiAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgcGFkZGluZzogMCA1cHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgd2lkdGg6IDQwcHg7XG5gO1xuXG5jb25zdCBGaWVsZFRva2VuID0gKHt0eXBlfSkgPT4gKFxuICA8RmllbGRUYWcgY29sb3I9eyhGSUxFRF9UWVBFX0RJU1BMQVlbdHlwZV0gJiYgRklMRURfVFlQRV9ESVNQTEFZW3R5cGVdLmNvbG9yKSB8fCBGSUVMRF9DT0xPUlMuZGVmYXVsdH0+XG4gICAge0ZJTEVEX1RZUEVfRElTUExBWVt0eXBlXS5sYWJlbH1cbiAgPC9GaWVsZFRhZz5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IEZpZWxkVG9rZW47XG4iXX0=