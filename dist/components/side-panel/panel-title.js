"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _templateObject;

var PanelTitleFactory = function PanelTitleFactory() {
  return _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  font-size: ", ";\n  line-height: ", ";\n  font-weight: 400;\n  letter-spacing: 1.25px;\n  margin-bottom: 14px;\n"])), function (props) {
    return props.theme.titleTextColor;
  }, function (props) {
    return props.theme.sidePanelTitleFontsize;
  }, function (props) {
    return props.theme.sidePanelTitleLineHeight;
  });
};

var _default = PanelTitleFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtdGl0bGUuanMiXSwibmFtZXMiOlsiUGFuZWxUaXRsZUZhY3RvcnkiLCJzdHlsZWQiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwidGl0bGVUZXh0Q29sb3IiLCJzaWRlUGFuZWxUaXRsZUZvbnRzaXplIiwic2lkZVBhbmVsVGl0bGVMaW5lSGVpZ2h0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7O0FBRUEsSUFBTUEsaUJBQWlCLEdBQUcsU0FBcEJBLGlCQUFvQjtBQUFBLFNBQU1DLDZCQUFPQyxHQUFiLDJOQUNmLFVBQUFDLEtBQUs7QUFBQSxXQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsY0FBaEI7QUFBQSxHQURVLEVBRVgsVUFBQUYsS0FBSztBQUFBLFdBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRSxzQkFBaEI7QUFBQSxHQUZNLEVBR1QsVUFBQUgsS0FBSztBQUFBLFdBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRyx3QkFBaEI7QUFBQSxHQUhJO0FBQUEsQ0FBMUI7O2VBU2VQLGlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmNvbnN0IFBhbmVsVGl0bGVGYWN0b3J5ID0gKCkgPT4gc3R5bGVkLmRpdmBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGl0bGVUZXh0Q29sb3J9O1xuICBmb250LXNpemU6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsVGl0bGVGb250c2l6ZX07XG4gIGxpbmUtaGVpZ2h0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVQYW5lbFRpdGxlTGluZUhlaWdodH07XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIGxldHRlci1zcGFjaW5nOiAxLjI1cHg7XG4gIG1hcmdpbi1ib3R0b206IDE0cHg7XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBQYW5lbFRpdGxlRmFjdG9yeTtcbiJdfQ==