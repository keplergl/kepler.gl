"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: row;\n  background-color: ", ";\n  box-shadow: ", ";\n  font-size: 11px;\n  padding: 16px 0;\n  transition: ", ";\n  margin-top: ", ";\n  opacity: ", ";\n  transform: translateX(calc(-50% + 20px));\n  pointer-events: ", ";\n  z-index: 1000;\n\n  .panel-header-dropdown__inner {\n    box-shadow: none;\n    background-color: transparent;\n    display: flex;\n  }\n\n  .toolbar-item {\n    align-items: center;\n    border-right: 1px solid ", ";\n    padding: 0 22px;\n    display: flex;\n    flex-direction: column;\n\n    .toolbar-item__title {\n      white-space: nowrap;\n      margin-top: 4px;\n    }\n\n    :hover {\n      cursor: pointer;\n      color: ", ";\n    }\n\n    &:last-child {\n      border-right: 0;\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var Toolbar = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.dropdownListBgd;
}, function (props) {
  return props.theme.dropdownListShadow;
}, function (props) {
  return props.theme.transitionSlow;
}, function (props) {
  return props.show ? '6px' : '20px';
}, function (props) {
  return props.show ? 1 : 0;
}, function (props) {
  return props.show ? 'all' : 'none';
}, function (props) {
  return props.theme.panelHeaderIcon;
}, function (props) {
  return props.theme.textColorHl;
});

Toolbar.displayName = 'Toolbar';
var _default = Toolbar;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi90b29sYmFyLmpzIl0sIm5hbWVzIjpbIlRvb2xiYXIiLCJzdHlsZWQiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwiZHJvcGRvd25MaXN0QmdkIiwiZHJvcGRvd25MaXN0U2hhZG93IiwidHJhbnNpdGlvblNsb3ciLCJzaG93IiwicGFuZWxIZWFkZXJJY29uIiwidGV4dENvbG9ySGwiLCJkaXNwbGF5TmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLE9BQU8sR0FBR0MsNkJBQU9DLEdBQVYsb0JBR1MsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxlQUFoQjtBQUFBLENBSGQsRUFJRyxVQUFBRixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlFLGtCQUFoQjtBQUFBLENBSlIsRUFPRyxVQUFBSCxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlHLGNBQWhCO0FBQUEsQ0FQUixFQVFHLFVBQUFKLEtBQUs7QUFBQSxTQUFLQSxLQUFLLENBQUNLLElBQU4sR0FBYSxLQUFiLEdBQXFCLE1BQTFCO0FBQUEsQ0FSUixFQVNBLFVBQUFMLEtBQUs7QUFBQSxTQUFLQSxLQUFLLENBQUNLLElBQU4sR0FBYSxDQUFiLEdBQWlCLENBQXRCO0FBQUEsQ0FUTCxFQVdPLFVBQUFMLEtBQUs7QUFBQSxTQUFLQSxLQUFLLENBQUNLLElBQU4sR0FBYSxLQUFiLEdBQXFCLE1BQTFCO0FBQUEsQ0FYWixFQXNCaUIsVUFBQUwsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZSyxlQUFoQjtBQUFBLENBdEJ0QixFQWtDRSxVQUFBTixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlNLFdBQWhCO0FBQUEsQ0FsQ1AsQ0FBYjs7QUEyQ0FWLE9BQU8sQ0FBQ1csV0FBUixHQUFzQixTQUF0QjtlQUVlWCxPIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmNvbnN0IFRvb2xiYXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEJnZH07XG4gIGJveC1zaGFkb3c6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0U2hhZG93fTtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBwYWRkaW5nOiAxNnB4IDA7XG4gIHRyYW5zaXRpb246ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudHJhbnNpdGlvblNsb3d9O1xuICBtYXJnaW4tdG9wOiAke3Byb3BzID0+IChwcm9wcy5zaG93ID8gJzZweCcgOiAnMjBweCcpfTtcbiAgb3BhY2l0eTogJHtwcm9wcyA9PiAocHJvcHMuc2hvdyA/IDEgOiAwKX07XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWChjYWxjKC01MCUgKyAyMHB4KSk7XG4gIHBvaW50ZXItZXZlbnRzOiAke3Byb3BzID0+IChwcm9wcy5zaG93ID8gJ2FsbCcgOiAnbm9uZScpfTtcbiAgei1pbmRleDogMTAwMDtcblxuICAucGFuZWwtaGVhZGVyLWRyb3Bkb3duX19pbm5lciB7XG4gICAgYm94LXNoYWRvdzogbm9uZTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICB9XG5cbiAgLnRvb2xiYXItaXRlbSB7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsSGVhZGVySWNvbn07XG4gICAgcGFkZGluZzogMCAyMnB4O1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblxuICAgIC50b29sYmFyLWl0ZW1fX3RpdGxlIHtcbiAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICBtYXJnaW4tdG9wOiA0cHg7XG4gICAgfVxuXG4gICAgOmhvdmVyIHtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgICB9XG5cbiAgICAmOmxhc3QtY2hpbGQge1xuICAgICAgYm9yZGVyLXJpZ2h0OiAwO1xuICAgIH1cbiAgfVxuYDtcblxuVG9vbGJhci5kaXNwbGF5TmFtZSA9ICdUb29sYmFyJztcblxuZXhwb3J0IGRlZmF1bHQgVG9vbGJhcjtcbiJdfQ==