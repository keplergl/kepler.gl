'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Button = exports.Tooltip = exports.SidePanelDivider = exports.SidePanelSection = exports.PanelLabel = exports.StyledSwitch = exports.IconRoundSmall = exports.SelectTextBold = exports.SelectText = undefined;

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n  font-size: ', ';\n  font-weight: ', ';\n\n  i {\n    font-size: 13px;\n    margin-right: 6px;\n  }\n'], ['\n  color: ', ';\n  font-size: ', ';\n  font-weight: ', ';\n\n  i {\n    font-size: 13px;\n    margin-right: 6px;\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  font-weight: ', ';\n'], ['\n  font-weight: ', ';\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  width: 18px;\n  height: 18px;\n  border-radius: 9px;\n  background-color: ', '; // updated after checking sketch file\n  color: ', ';\n  align-items: center;\n  justify-content: center;\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n'], ['\n  display: flex;\n  width: 18px;\n  height: 18px;\n  border-radius: 9px;\n  background-color: ', '; // updated after checking sketch file\n  color: ', ';\n  align-items: center;\n  justify-content: center;\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  margin-bottom: 0 !important;\n  label {\n    color: ', ' !important;\n    \n    &:before {\n      background: #282727 !important;\n      border: 1px solid #232324 !important;  \n    }\n  }\n  input {\n    outline: none;\n    :focus {\n      outline: none;\n  }\n'], ['\n  margin-bottom: 0 !important;\n  label {\n    color: ', ' !important;\n    \n    &:before {\n      background: #282727 !important;\n      border: 1px solid #232324 !important;  \n    }\n  }\n  input {\n    outline: none;\n    :focus {\n      outline: none;\n  }\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n  font-size: 11px;\n  font-weight: 400;\n'], ['\n  color: ', ';\n  font-size: 11px;\n  font-weight: 400;\n']),
    _templateObject6 = (0, _taggedTemplateLiteralLoose3.default)(['\n  margin-bottom: 12px;\n  opacity: ', ';\n  pointer-events: ', ';\n'], ['\n  margin-bottom: 12px;\n  opacity: ', ';\n  pointer-events: ', ';\n']),
    _templateObject7 = (0, _taggedTemplateLiteralLoose3.default)(['\n  border-bottom: 1px solid ', ';\n  height: 12px;\n  margin-bottom: 12px;\n'], ['\n  border-bottom: 1px solid ', ';\n  height: 12px;\n  margin-bottom: 12px;\n']),
    _templateObject8 = (0, _taggedTemplateLiteralLoose3.default)(['\n  &.__react_component_tooltip {\n    font-size: 9.5px;\n    font-weight: 500;\n    padding: 7px 18px;\n\n    &.type-dark {\n      background-color: ', ';\n      color: ', ';\n\n      &.place-top {\n        :after {\n          border-top-color: ', ';\n        }\n      }\n\n      &.place-right {\n        :after {\n          border-right-color: ', ';\n        }\n      }\n\n      &.place-left {\n        :after {\n          border-left-color: ', ';\n        }\n      }\n    }\n  }\n'], ['\n  &.__react_component_tooltip {\n    font-size: 9.5px;\n    font-weight: 500;\n    padding: 7px 18px;\n\n    &.type-dark {\n      background-color: ', ';\n      color: ', ';\n\n      &.place-top {\n        :after {\n          border-top-color: ', ';\n        }\n      }\n\n      &.place-right {\n        :after {\n          border-right-color: ', ';\n        }\n      }\n\n      &.place-left {\n        :after {\n          border-left-color: ', ';\n        }\n      }\n    }\n  }\n']),
    _templateObject9 = (0, _taggedTemplateLiteralLoose3.default)(['\n  align-items: center;\n  background-color: ', ';\n  border-radius: 2px;\n  color: ', ';\n  cursor: pointer;\n  display: inline-flex;\n  font-size: ', ';\n  font-weight: 500;\n  justify-content: center;\n  outline: 0;\n  text-align: center;\n  transition: ', ';\n  vertical-align: middle;\n  line-height: 14px;\n  padding: ', ';\n  width: ', ';\n\n  :hover,\n  :focus,\n  :active {\n    background-color: ', ';\n    color: ', ';\n  }\n\n  svg {\n    margin-right: 8px;\n  }\n'], ['\n  align-items: center;\n  background-color: ', ';\n  border-radius: 2px;\n  color: ', ';\n  cursor: pointer;\n  display: inline-flex;\n  font-size: ', ';\n  font-weight: 500;\n  justify-content: center;\n  outline: 0;\n  text-align: center;\n  transition: ', ';\n  vertical-align: middle;\n  line-height: 14px;\n  padding: ', ';\n  width: ', ';\n\n  :hover,\n  :focus,\n  :active {\n    background-color: ', ';\n    color: ', ';\n  }\n\n  svg {\n    margin-right: 8px;\n  }\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reactTooltip = require('react-tooltip');

var _reactTooltip2 = _interopRequireDefault(_reactTooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectText = exports.SelectText = _styledComponents2.default.span(_templateObject, function (props) {
  return props.theme.selectColor;
}, function (props) {
  return props.theme.selectFontSize;
}, function (props) {
  return props.theme.selectFontWeight;
});

var SelectTextBold = exports.SelectTextBold = SelectText.extend(_templateObject2, function (props) {
  return props.theme.selectFontWeightBold;
});

var IconRoundSmall = exports.IconRoundSmall = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.theme.secondaryBtnBgdHover;
}, function (props) {
  return props.theme.secondaryBtnColor;
}, function (props) {
  return props.theme.secondaryBtnBgdHover;
});

var StyledSwitch = exports.StyledSwitch = _styledComponents2.default.div(_templateObject4, function (props) {
  return props.theme.secondaryBtnColor;
});

var PanelLabel = exports.PanelLabel = _styledComponents2.default.label(_templateObject5, function (props) {
  return props.theme.labelColor;
});

var SidePanelSection = exports.SidePanelSection = _styledComponents2.default.div(_templateObject6, function (props) {
  return props.disabled ? 0.4 : 1;
}, function (props) {
  return props.disabled ? 'none' : 'all';
});

var SidePanelDivider = exports.SidePanelDivider = _styledComponents2.default.div(_templateObject7, function (props) {
  return props.theme.panelBorderColor;
});

var Tooltip = exports.Tooltip = (0, _styledComponents2.default)(_reactTooltip2.default)(_templateObject8, function (props) {
  return props.theme.tooltipBg;
}, function (props) {
  return props.theme.tooltipColor;
}, function (props) {
  return props.theme.tooltipBg;
}, function (props) {
  return props.theme.tooltipBg;
}, function (props) {
  return props.theme.tooltipBg;
});

var Button = exports.Button = _styledComponents2.default.div(_templateObject9, function (props) {
  return props.secondary ? props.theme.secondaryBtnBgd : props.link ? props.theme.linkBtnBgd : props.theme.primaryBtnBgd;
}, function (props) {
  return props.secondary ? props.theme.secondaryBtnColor : props.link ? props.theme.linkBtnColor : props.theme.primaryBtnColor;
}, function (props) {
  return props.large ? '14px' : '11px';
}, function (props) {
  return props.theme.transition;
}, function (props) {
  return props.large ? '14px 32px' : '9px 12px';
}, function (props) {
  return props.width || 'auto';
}, function (props) {
  return props.secondary ? props.theme.secondaryBtnBgdHover : props.link ? props.theme.linkBtnActBgdHover : props.theme.primaryBtnBgdHover;
}, function (props) {
  return props.secondary ? props.theme.secondaryBtnActColor : props.link ? props.theme.linkBtnActColor : props.theme.primaryBtnActColor;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cy5qcyJdLCJuYW1lcyI6WyJTZWxlY3RUZXh0Iiwic3BhbiIsInByb3BzIiwidGhlbWUiLCJzZWxlY3RDb2xvciIsInNlbGVjdEZvbnRTaXplIiwic2VsZWN0Rm9udFdlaWdodCIsIlNlbGVjdFRleHRCb2xkIiwiZXh0ZW5kIiwic2VsZWN0Rm9udFdlaWdodEJvbGQiLCJJY29uUm91bmRTbWFsbCIsImRpdiIsInNlY29uZGFyeUJ0bkJnZEhvdmVyIiwic2Vjb25kYXJ5QnRuQ29sb3IiLCJTdHlsZWRTd2l0Y2giLCJQYW5lbExhYmVsIiwibGFiZWwiLCJsYWJlbENvbG9yIiwiU2lkZVBhbmVsU2VjdGlvbiIsImRpc2FibGVkIiwiU2lkZVBhbmVsRGl2aWRlciIsInBhbmVsQm9yZGVyQ29sb3IiLCJUb29sdGlwIiwidG9vbHRpcEJnIiwidG9vbHRpcENvbG9yIiwiQnV0dG9uIiwic2Vjb25kYXJ5Iiwic2Vjb25kYXJ5QnRuQmdkIiwibGluayIsImxpbmtCdG5CZ2QiLCJwcmltYXJ5QnRuQmdkIiwibGlua0J0bkNvbG9yIiwicHJpbWFyeUJ0bkNvbG9yIiwibGFyZ2UiLCJ0cmFuc2l0aW9uIiwid2lkdGgiLCJsaW5rQnRuQWN0QmdkSG92ZXIiLCJwcmltYXJ5QnRuQmdkSG92ZXIiLCJzZWNvbmRhcnlCdG5BY3RDb2xvciIsImxpbmtCdG5BY3RDb2xvciIsInByaW1hcnlCdG5BY3RDb2xvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRU8sSUFBTUEsa0NBQWEsMkJBQU9DLElBQXBCLGtCQUNGO0FBQUEsU0FBU0MsTUFBTUMsS0FBTixDQUFZQyxXQUFyQjtBQUFBLENBREUsRUFFRTtBQUFBLFNBQVNGLE1BQU1DLEtBQU4sQ0FBWUUsY0FBckI7QUFBQSxDQUZGLEVBR0k7QUFBQSxTQUFTSCxNQUFNQyxLQUFOLENBQVlHLGdC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R0FFSXBDLE1BQU0wQixJQUFOLEdBQ0UxQixNQUFNQyxLQUFOLENBQVlvQyxlQURkLEdBRUVyQyxNQUFNQyxLQUFOLENBQVlxQyxrQkFMWDtBQUFBLENBakNBLENBQU4iLCJmaWxlIjoic3R5bGVkLWNvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBSZWFjdFRvb2x0aXAgZnJvbSAncmVhY3QtdG9vbHRpcCc7XG5cbmV4cG9ydCBjb25zdCBTZWxlY3RUZXh0ID0gc3R5bGVkLnNwYW5gXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdENvbG9yfTtcbiAgZm9udC1zaXplOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdEZvbnRTaXplfTtcbiAgZm9udC13ZWlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2VsZWN0Rm9udFdlaWdodH07XG5cbiAgaSB7XG4gICAgZm9udC1zaXplOiAxM3B4O1xuICAgIG1hcmdpbi1yaWdodDogNnB4O1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgU2VsZWN0VGV4dEJvbGQgPSBTZWxlY3RUZXh0LmV4dGVuZGBcbiAgZm9udC13ZWlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2VsZWN0Rm9udFdlaWdodEJvbGR9O1xuYDtcblxuZXhwb3J0IGNvbnN0IEljb25Sb3VuZFNtYWxsID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgd2lkdGg6IDE4cHg7XG4gIGhlaWdodDogMThweDtcbiAgYm9yZGVyLXJhZGl1czogOXB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQmdkSG92ZXJ9OyAvLyB1cGRhdGVkIGFmdGVyIGNoZWNraW5nIHNrZXRjaCBmaWxlXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkNvbG9yfTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlCdG5CZ2RIb3Zlcn07XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWRTd2l0Y2ggPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tYm90dG9tOiAwICFpbXBvcnRhbnQ7XG4gIGxhYmVsIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlCdG5Db2xvcn0gIWltcG9ydGFudDtcbiAgICBcbiAgICAmOmJlZm9yZSB7XG4gICAgICBiYWNrZ3JvdW5kOiAjMjgyNzI3ICFpbXBvcnRhbnQ7XG4gICAgICBib3JkZXI6IDFweCBzb2xpZCAjMjMyMzI0ICFpbXBvcnRhbnQ7ICBcbiAgICB9XG4gIH1cbiAgaW5wdXQge1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgOmZvY3VzIHtcbiAgICAgIG91dGxpbmU6IG5vbmU7XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBQYW5lbExhYmVsID0gc3R5bGVkLmxhYmVsYFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yfTtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBmb250LXdlaWdodDogNDAwO1xuYDtcblxuZXhwb3J0IGNvbnN0IFNpZGVQYW5lbFNlY3Rpb24gPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tYm90dG9tOiAxMnB4O1xuICBvcGFjaXR5OiAke3Byb3BzID0+IChwcm9wcy5kaXNhYmxlZCA/IDAuNCA6IDEpfTtcbiAgcG9pbnRlci1ldmVudHM6ICR7cHJvcHMgPT4gKHByb3BzLmRpc2FibGVkID8gJ25vbmUnIDogJ2FsbCcpfTtcbmA7XG5cbmV4cG9ydCBjb25zdCBTaWRlUGFuZWxEaXZpZGVyID0gc3R5bGVkLmRpdmBcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCb3JkZXJDb2xvcn07XG4gIGhlaWdodDogMTJweDtcbiAgbWFyZ2luLWJvdHRvbTogMTJweDtcbmA7XG5cbmV4cG9ydCBjb25zdCBUb29sdGlwID0gc3R5bGVkKFJlYWN0VG9vbHRpcClgXG4gICYuX19yZWFjdF9jb21wb25lbnRfdG9vbHRpcCB7XG4gICAgZm9udC1zaXplOiA5LjVweDtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIHBhZGRpbmc6IDdweCAxOHB4O1xuXG4gICAgJi50eXBlLWRhcmsge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50b29sdGlwQmd9O1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudG9vbHRpcENvbG9yfTtcblxuICAgICAgJi5wbGFjZS10b3Age1xuICAgICAgICA6YWZ0ZXIge1xuICAgICAgICAgIGJvcmRlci10b3AtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudG9vbHRpcEJnfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAmLnBsYWNlLXJpZ2h0IHtcbiAgICAgICAgOmFmdGVyIHtcbiAgICAgICAgICBib3JkZXItcmlnaHQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudG9vbHRpcEJnfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAmLnBsYWNlLWxlZnQge1xuICAgICAgICA6YWZ0ZXIge1xuICAgICAgICAgIGJvcmRlci1sZWZ0LWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRvb2x0aXBCZ307XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBCdXR0b24gPSBzdHlsZWQuZGl2YFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuc2Vjb25kYXJ5XG4gICAgICA/IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkJnZFxuICAgICAgOiBwcm9wcy5saW5rID8gcHJvcHMudGhlbWUubGlua0J0bkJnZCA6IHByb3BzLnRoZW1lLnByaW1hcnlCdG5CZ2R9O1xuICBib3JkZXItcmFkaXVzOiAycHg7XG4gIGNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuc2Vjb25kYXJ5XG4gICAgICA/IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkNvbG9yXG4gICAgICA6IHByb3BzLmxpbmsgPyBwcm9wcy50aGVtZS5saW5rQnRuQ29sb3IgOiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuQ29sb3J9O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICBmb250LXNpemU6ICR7cHJvcHMgPT4gKHByb3BzLmxhcmdlID8gJzE0cHgnIDogJzExcHgnKX07XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBvdXRsaW5lOiAwO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHRyYW5zaXRpb246ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudHJhbnNpdGlvbn07XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gIGxpbmUtaGVpZ2h0OiAxNHB4O1xuICBwYWRkaW5nOiAke3Byb3BzID0+IChwcm9wcy5sYXJnZSA/ICcxNHB4IDMycHgnIDogJzlweCAxMnB4Jyl9O1xuICB3aWR0aDogJHtwcm9wcyA9PiBwcm9wcy53aWR0aCB8fCAnYXV0byd9O1xuXG4gIDpob3ZlcixcbiAgOmZvY3VzLFxuICA6YWN0aXZlIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+XG4gICAgICBwcm9wcy5zZWNvbmRhcnlcbiAgICAgICAgPyBwcm9wcy50aGVtZS5zZWNvbmRhcnlCdG5CZ2RIb3ZlclxuICAgICAgICA6IHByb3BzLmxpbmtcbiAgICAgICAgICA/IHByb3BzLnRoZW1lLmxpbmtCdG5BY3RCZ2RIb3ZlclxuICAgICAgICAgIDogcHJvcHMudGhlbWUucHJpbWFyeUJ0bkJnZEhvdmVyfTtcbiAgICBjb2xvcjogJHtwcm9wcyA9PlxuICAgICAgcHJvcHMuc2Vjb25kYXJ5XG4gICAgICAgID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQWN0Q29sb3JcbiAgICAgICAgOiBwcm9wcy5saW5rXG4gICAgICAgICAgPyBwcm9wcy50aGVtZS5saW5rQnRuQWN0Q29sb3JcbiAgICAgICAgICA6IHByb3BzLnRoZW1lLnByaW1hcnlCdG5BY3RDb2xvcn07XG4gIH1cblxuICBzdmcge1xuICAgIG1hcmdpbi1yaWdodDogOHB4O1xuICB9XG5gO1xuIl19