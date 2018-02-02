'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ButtonGroup = exports.StyledPanelDropdown = exports.StyledPanelHeader = exports.InlineInput = exports.Input = exports.Button = exports.Tooltip = exports.SidePanelDivider = exports.SidePanelSection = exports.PanelContent = exports.PanelHeaderContent = exports.PanelHeaderTitle = exports.PanelLabelBold = exports.PanelLabelWrapper = exports.PanelLabel = exports.CenterFlexbox = exports.IconRoundSmall = exports.SelectTextBold = exports.SelectText = undefined;

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n  font-size: ', ';\n  font-weight: 400;\n\n  i {\n    font-size: 13px;\n    margin-right: 6px;\n  }\n'], ['\n  color: ', ';\n  font-size: ', ';\n  font-weight: 400;\n\n  i {\n    font-size: 13px;\n    margin-right: 6px;\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n  font-weight: 500;\n'], ['\n  color: ', ';\n  font-weight: 500;\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  width: 18px;\n  height: 18px;\n  border-radius: 9px;\n  background-color: ', '; // updated after checking sketch file\n  color: ', ';\n  align-items: center;\n  justify-content: center;\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n'], ['\n  display: flex;\n  width: 18px;\n  height: 18px;\n  border-radius: 9px;\n  background-color: ', '; // updated after checking sketch file\n  color: ', ';\n  align-items: center;\n  justify-content: center;\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  align-items: center;\n'], ['\n  display: flex;\n  align-items: center;\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n  display: inline-block;\n  font-size: 11px;\n  font-weight: 400;\n  margin-bottom: 4px;\n  text-transform: capitalize;\n'], ['\n  color: ', ';\n  display: inline-block;\n  font-size: 11px;\n  font-weight: 400;\n  margin-bottom: 4px;\n  text-transform: capitalize;\n']),
    _templateObject6 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  align-items: self-start;\n'], ['\n  display: flex;\n  align-items: self-start;\n']),
    _templateObject7 = (0, _taggedTemplateLiteralLoose3.default)(['\n  font-weight: 500;\n'], ['\n  font-weight: 500;\n']),
    _templateObject8 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';;\n  font-size: 13px;\n  letter-spacing: 0.43px;\n  text-transform: capitalize;\n'], ['\n  color: ', ';;\n  font-size: 13px;\n  letter-spacing: 0.43px;\n  text-transform: capitalize;\n']),
    _templateObject9 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  align-items: center;\n  color: ', ';\n  padding-left: 12px;\n  \n  .icon {\n    color: ', ';\n    display: flex;\n    align-items: center;\n    margin-right: 12px;\n  }\n'], ['\n  display: flex;\n  align-items: center;\n  color: ', ';\n  padding-left: 12px;\n  \n  .icon {\n    color: ', ';\n    display: flex;\n    align-items: center;\n    margin-right: 12px;\n  }\n']),
    _templateObject10 = (0, _taggedTemplateLiteralLoose3.default)(['\n  background-color: ', ';\n  padding: 12px;\n'], ['\n  background-color: ', ';\n  padding: 12px;\n']),
    _templateObject11 = (0, _taggedTemplateLiteralLoose3.default)(['\n  margin-bottom: 12px;\n  opacity: ', ';\n  pointer-events: ', ';\n'], ['\n  margin-bottom: 12px;\n  opacity: ', ';\n  pointer-events: ', ';\n']),
    _templateObject12 = (0, _taggedTemplateLiteralLoose3.default)(['\n  border-bottom: 1px solid ', ';\n  height: 12px;\n  margin-bottom: 12px;\n'], ['\n  border-bottom: 1px solid ', ';\n  height: 12px;\n  margin-bottom: 12px;\n']),
    _templateObject13 = (0, _taggedTemplateLiteralLoose3.default)(['\n  &.__react_component_tooltip {\n    font-size: 9.5px;\n    font-weight: 500;\n    padding: 7px 18px;\n\n    &.type-dark {\n      background-color: ', ';\n      color: ', ';\n      &.place-bottom {\n        :after {\n          border-bottom-color: ', ';\n        }\n      }\n\n      &.place-top {\n        :after {\n          border-top-color: ', ';\n        }\n      }\n\n      &.place-right {\n        :after {\n          border-right-color: ', ';\n        }\n      }\n\n      &.place-left {\n        :after {\n          border-left-color: ', ';\n        }\n      }\n    }\n  }\n'], ['\n  &.__react_component_tooltip {\n    font-size: 9.5px;\n    font-weight: 500;\n    padding: 7px 18px;\n\n    &.type-dark {\n      background-color: ', ';\n      color: ', ';\n      &.place-bottom {\n        :after {\n          border-bottom-color: ', ';\n        }\n      }\n\n      &.place-top {\n        :after {\n          border-top-color: ', ';\n        }\n      }\n\n      &.place-right {\n        :after {\n          border-right-color: ', ';\n        }\n      }\n\n      &.place-left {\n        :after {\n          border-left-color: ', ';\n        }\n      }\n    }\n  }\n']),
    _templateObject14 = (0, _taggedTemplateLiteralLoose3.default)(['\n  align-items: center;\n  background-color: ', ';\n  border-radius: ', ';\n  color: ', ';\n  cursor: pointer;\n  display: inline-flex;\n  font-size: ', ';\n  font-weight: 500;\n  justify-content: center;\n  letter-spacing: 0.3px;\n  line-height: 14px;\n  outline: 0;\n  padding: ', ';\n  text-align: center;\n  transition: ', ';\n  vertical-align: middle;\n  width: ', ';\n\n  :hover,\n  :focus,\n  :active,\n  &.active {\n    background-color: ', ';\n    color: ', ';\n  }\n\n  svg {\n    margin-right: 8px;\n  }\n'], ['\n  align-items: center;\n  background-color: ', ';\n  border-radius: ', ';\n  color: ', ';\n  cursor: pointer;\n  display: inline-flex;\n  font-size: ', ';\n  font-weight: 500;\n  justify-content: center;\n  letter-spacing: 0.3px;\n  line-height: 14px;\n  outline: 0;\n  padding: ', ';\n  text-align: center;\n  transition: ', ';\n  vertical-align: middle;\n  width: ', ';\n\n  :hover,\n  :focus,\n  :active,\n  &.active {\n    background-color: ', ';\n    color: ', ';\n  }\n\n  svg {\n    margin-right: 8px;\n  }\n']),
    _templateObject15 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', ';\n'], ['\n  ', ';\n']),
    _templateObject16 = (0, _taggedTemplateLiteralLoose3.default)(['\n  background-color: ', ';\n  border-left: 3px solid\n    rgb(\n      ', '\n    );\n  padding: 0 10px 0 0;\n  height: ', 'px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  transition: ', ';\n'], ['\n  background-color: ', ';\n  border-left: 3px solid\n    rgb(\n      ', '\n    );\n  padding: 0 10px 0 0;\n  height: ', 'px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  transition: ', ';\n']),
    _templateObject17 = (0, _taggedTemplateLiteralLoose3.default)(['\n  background-color: ', ';\n  overflow-y: overlay;\n  box-shadow: ', ';\n  border-radius: ', ';\n  margin-top: 2px;\n  max-height: 500px;\n'], ['\n  background-color: ', ';\n  overflow-y: overlay;\n  box-shadow: ', ';\n  border-radius: ', ';\n  margin-top: 2px;\n  max-height: 500px;\n']),
    _templateObject18 = (0, _taggedTemplateLiteralLoose3.default)(['\n  .button {\n    border-radius: 0;\n    margin-left: 2px;\n  }\n  .button:first-child {\n    border-bottom-left-radius: ', ';\n    border-top-left-radius: ', ';\n    margin-left: 0;\n  }\n  .button:last-child {\n    border-bottom-right-radius: ', ';\n    border-top-right-radius: ', ';\n  }\n'], ['\n  .button {\n    border-radius: 0;\n    margin-left: 2px;\n  }\n  .button:first-child {\n    border-bottom-left-radius: ', ';\n    border-top-left-radius: ', ';\n    margin-left: 0;\n  }\n  .button:last-child {\n    border-bottom-right-radius: ', ';\n    border-top-right-radius: ', ';\n  }\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reactTooltip = require('react-tooltip');

var _reactTooltip2 = _interopRequireDefault(_reactTooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectText = exports.SelectText = _styledComponents2.default.span(_templateObject, function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.selectFontSize;
});

var SelectTextBold = exports.SelectTextBold = SelectText.extend(_templateObject2, function (props) {
  return props.theme.textColor;
});

var IconRoundSmall = exports.IconRoundSmall = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.theme.secondaryBtnBgdHover;
}, function (props) {
  return props.theme.secondaryBtnColor;
}, function (props) {
  return props.theme.secondaryBtnBgdHover;
});

var CenterFlexbox = exports.CenterFlexbox = _styledComponents2.default.div(_templateObject4);

var PanelLabel = exports.PanelLabel = _styledComponents2.default.label.attrs({
  className: 'side-panel-panel__label'
})(_templateObject5, function (props) {
  return props.theme.labelColor;
});

var PanelLabelWrapper = exports.PanelLabelWrapper = _styledComponents2.default.div.attrs({
  className: 'side-panel-panel__label-wrapper'
})(_templateObject6);

var PanelLabelBold = exports.PanelLabelBold = PanelLabel.extend(_templateObject7);

var PanelHeaderTitle = exports.PanelHeaderTitle = _styledComponents2.default.span.attrs({
  className: 'side-panel-panel__header__title'
})(_templateObject8, function (props) {
  return props.theme.textColor;
});

var PanelHeaderContent = exports.PanelHeaderContent = _styledComponents2.default.div(_templateObject9, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.labelColor;
});

var PanelContent = exports.PanelContent = _styledComponents2.default.div.attrs({
  className: 'side-panel-panel__content'
})(_templateObject10, function (props) {
  return props.theme.panelBackground;
});

var SidePanelSection = exports.SidePanelSection = _styledComponents2.default.div.attrs({
  className: 'side-panel-section'
})(_templateObject11, function (props) {
  return props.disabled ? 0.4 : 1;
}, function (props) {
  return props.disabled ? 'none' : 'all';
});

var SidePanelDivider = exports.SidePanelDivider = _styledComponents2.default.div.attrs({
  className: 'side-panel-divider'
})(_templateObject12, function (props) {
  return props.theme.panelBorderColor;
});

var Tooltip = exports.Tooltip = (0, _styledComponents2.default)(_reactTooltip2.default)(_templateObject13, function (props) {
  return props.theme.tooltipBg;
}, function (props) {
  return props.theme.tooltipColor;
}, function (props) {
  return props.theme.tooltipBg;
}, function (props) {
  return props.theme.tooltipBg;
}, function (props) {
  return props.theme.tooltipBg;
}, function (props) {
  return props.theme.tooltipBg;
});

var Button = exports.Button = _styledComponents2.default.div.attrs({
  className: 'button'
})(_templateObject14, function (props) {
  return props.secondary ? props.theme.secondaryBtnBgd : props.link ? props.theme.linkBtnBgd : props.theme.primaryBtnBgd;
}, function (props) {
  return props.theme.primaryBtnRadius;
}, function (props) {
  return props.secondary ? props.theme.secondaryBtnColor : props.link ? props.theme.linkBtnColor : props.theme.primaryBtnColor;
}, function (props) {
  return props.large ? '14px' : '11px';
}, function (props) {
  return props.large ? '14px 32px' : '9px 12px';
}, function (props) {
  return props.theme.transition;
}, function (props) {
  return props.width || 'auto';
}, function (props) {
  return props.secondary ? props.theme.secondaryBtnBgdHover : props.link ? props.theme.linkBtnActBgdHover : props.theme.primaryBtnBgdHover;
}, function (props) {
  return props.secondary ? props.theme.secondaryBtnActColor : props.link ? props.theme.linkBtnActColor : props.theme.primaryBtnActColor;
});

var Input = exports.Input = _styledComponents2.default.input(_templateObject15, function (props) {
  return props.secondary ? props.theme.secondaryInput : props.theme.input;
});

var InlineInput = exports.InlineInput = Input.extend(_templateObject15, function (props) {
  return props.theme.inlineInput;
});

var StyledPanelHeader = exports.StyledPanelHeader = _styledComponents2.default.div(_templateObject16, function (props) {
  return props.active ? props.theme.panelBackgroundHover : props.theme.panelBackground;
}, function (props) {
  return props.labelRCGColorValues ? props.labelRCGColorValues.join(',') : 'transparent';
}, function (props) {
  return props.theme.panelHeaderHeight;
}, function (props) {
  return props.theme.transition;
});

var StyledPanelDropdown = exports.StyledPanelDropdown = _styledComponents2.default.div(_templateObject17, function (props) {
  return props.theme.panelBackground;
}, function (props) {
  return props.theme.panelBoxShadow;
}, function (props) {
  return props.theme.panelBorderRadius;
});

var ButtonGroup = exports.ButtonGroup = _styledComponents2.default.div(_templateObject18, function (props) {
  return props.theme.primaryBtnRadius;
}, function (props) {
  return props.theme.primaryBtnRadius;
}, function (props) {
  return props.theme.primaryBtnRadius;
}, function (props) {
  return props.theme.primaryBtnRadius;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cy5qcyJdLCJuYW1lcyI6WyJTZWxlY3RUZXh0Iiwic3BhbiIsInByb3BzIiwidGhlbWUiLCJsYWJlbENvbG9yIiwic2VsZWN0Rm9udFNpemUiLCJTZWxlY3RUZXh0Qm9sZCIsImV4dGVuZCIsInRleHRDb2xvciIsIkljb25Sb3VuZFNtYWxsIiwiZGl2Iiwic2Vjb25kYXJ5QnRuQmdkSG92ZXIiLCJzZWNvbmRhcnlCdG5Db2xvciIsIkNlbnRlckZsZXhib3giLCJQYW5lbExhYmVsIiwibGFiZWwiLCJhdHRycyIsImNsYXNzTmFtZSIsIlBhbmVsTGFiZWxXcmFwcGVyIiwiUGFuZWxMYWJlbEJvbGQiLCJQYW5lbEhlYWRlclRpdGxlIiwiUGFuZWxIZWFkZXJDb250ZW50IiwiUGFuZWxDb250ZW50IiwicGFuZWxCYWNrZ3JvdW5kIiwiU2lkZVBhbmVsU2VjdGlvbiIsImRpc2FibGVkIiwiU2lkZVBhbmVsRGl2aWRlciIsInBhbmVsQm9yZGVyQ29sb3IiLCJUb29sdGlwIiwidG9vbHRpcEJnIiwidG9vbHRpcENvbG9yIiwiQnV0dG9uIiwic2Vjb25kYXJ5Iiwic2Vjb25kYXJ5QnRuQmdkIiwibGluayIsImxpbmtCdG5CZ2QiLCJwcmltYXJ5QnRuQmdkIiwicHJpbWFyeUJ0blJhZGl1cyIsImxpbmtCdG5Db2xvciIsInByaW1hcnlCdG5Db2xvciIsImxhcmdlIiwidHJhbnNpdGlvbiIsIndpZHRoIiwibGlua0J0bkFjdEJnZEhvdmVyIiwicHJpbWFyeUJ0bkJnZEhvdmVyIiwic2Vjb25kYXJ5QnRuQWN0Q29sb3IiLCJsaW5rQnRuQWN0Q29sb3IiLCJwcmltYXJ5QnRuQWN0Q29sb3IiLCJJbnB1dCIsImlucHV0Iiwic2Vjb25kYXJ5SW5wdXQiLCJJbmxpbmVJbnB1dCIsImlubGluZUlucHV0IiwiU3R5bGVkUGFuZWxIZWFkZXIiLCJhY3RpdmUiLCJwYW5lbEJhY2tncm91bmRIb3ZlciIsImxhYmVsUkNHQ29sb3JWYWx1ZXMiLCJqb2luIiwicGFuZWxIZWFkZXJIZWlnaHQiLCJTdHlsZWRQYW5lbERyb3Bkb3duIiwicGFuZWxCb3hTaGFkb3ciLCJwYW5lbEJvcmRlclJhZGl1cyIsIkJ1dHRvbkdyb3VwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFTyxJQUFNQSxrQ0FBYSwyQkFBT0MsSUFBcEIsa0JBQ0Y7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlDLFVBQXJCO0FBQUEsQ0FERSxFQUVFO0FBQUEsU0FBU0YsTUFBTUMsS0FBTixDQUFZRSxjQUFyQjtBQUFBLENBRkYsQ0FBTjs7QUFXQSxJQUFNQywwQ0FBaUJOLFdBQVdPLE1BQTVCLG1CQUNGO0FBQUEsU0FBU0wsTUFBTUMsS0FBTixDQUFZSyxTQUFyQjtBQUFBLENBREUsQ0FBTjs7QUFLQSxJQUFNQywwQ0FBaUIsMkJBQU9DLEdBQXhCLG1CQUtTO0FBQUEsU0FDbEJSLE1BQU1DLEtBQU4sQ0FBWVEsb0JBRE07QUFBQSxDQUxULEVBT0Y7QUFBQSxTQUFTVCxNQUFNQyxLQUFOLENBQVlTLGlCQUFyQjtBQUFBLENBUEUsRUFhVztBQUFBLFNBQVNWLE1BQU1DLEtBQU4sQ0FBWVEsb0JBQXJCO0FBQUEsQ0FiWCxDQUFOOztBQWlCQSxJQUFNRSx3Q0FBZ0IsMkJBQU9ILEdBQXZCLGtCQUFOOztBQUtBLElBQU1JLGtDQUFhLDJCQUFPQyxLQUFQLENBQWFDLEtBQWIsQ0FBbUI7QUFDM0NDLGFBQVc7QUFEZ0MsQ0FBbkIsQ0FBYixtQkFHRjtBQUFBLFNBQVNmLE1BQU1DLEtBQU4sQ0FBWUMsVUFBckI7QUFBQSxDQUhFLENBQU47O0FBV0EsSUFBTWMsZ0RBQW9CLDJCQUFPUixHQUFQLENBQVdNLEtBQVgsQ0FBaUI7QUFDaERDLGFBQVc7QUFEcUMsQ0FBakIsQ0FBcEIsa0JBQU47O0FBT0EsSUFBTUUsMENBQWlCTCxXQUFXUCxNQUE1QixrQkFBTjs7QUFJQSxJQUFNYSw4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WW9CLGVBQXJCO0FBQUEsQ0FEVCxFQUdHO0FBQUEsU0FBU3JCLE1BQU1DLEtBQU4sQ0FBWXlELGNBQXJCO0FBQUEsQ0FISCxFQUlNO0FBQUEsU0FBUzFELE1BQU1DLEtBQU4sQ0FBWTBELGlCQUFyQjtBQUFBLENBSk4sQ0FBTjs7QUFTQSxJQUFNQyxvQ0FBYywyQkFBT3BELEdBQXJCLG9CQU1vQjtBQUFBLFNBQVNSLE1BQU1DLEtBQU4sQ0FBWWtDLGdCQUFyQjtBQUFBLENBTnBCLEVBT2lCO0FBQUEsU0FBU25DLE1BQU1DLEtBQU4sQ0FBWWtDLGdCQUFyQjtBQUFBLENBUGpCLEVBV3FCO0FBQUEsU0FBU25DLE1BQU1DLEtBQU4sQ0FBWWtDLGdCQUFyQjtBQUFBLENBWHJCLEVBWWtCO0FBQUEsU0FBU25DLE1BQU1DLEtBQU4sQ0FBWWtDLGdCQUFyQjtBQUFBLENBWmxCLENBQU4iLCJmaWxlIjoic3R5bGVkLWNvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBSZWFjdFRvb2x0aXAgZnJvbSAncmVhY3QtdG9vbHRpcCc7XG5cbmV4cG9ydCBjb25zdCBTZWxlY3RUZXh0ID0gc3R5bGVkLnNwYW5gXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuICBmb250LXNpemU6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2VsZWN0Rm9udFNpemV9O1xuICBmb250LXdlaWdodDogNDAwO1xuXG4gIGkge1xuICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICBtYXJnaW4tcmlnaHQ6IDZweDtcbiAgfVxuYDtcblxuZXhwb3J0IGNvbnN0IFNlbGVjdFRleHRCb2xkID0gU2VsZWN0VGV4dC5leHRlbmRgXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG5gO1xuXG5leHBvcnQgY29uc3QgSWNvblJvdW5kU21hbGwgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICB3aWR0aDogMThweDtcbiAgaGVpZ2h0OiAxOHB4O1xuICBib3JkZXItcmFkaXVzOiA5cHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy50aGVtZS5zZWNvbmRhcnlCdG5CZ2RIb3Zlcn07IC8vIHVwZGF0ZWQgYWZ0ZXIgY2hlY2tpbmcgc2tldGNoIGZpbGVcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQ29sb3J9O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkJnZEhvdmVyfTtcbiAgfVxuYDtcblxuZXhwb3J0IGNvbnN0IENlbnRlckZsZXhib3ggPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuYDtcblxuZXhwb3J0IGNvbnN0IFBhbmVsTGFiZWwgPSBzdHlsZWQubGFiZWwuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzaWRlLXBhbmVsLXBhbmVsX19sYWJlbCdcbn0pYFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yfTtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBmb250LXNpemU6IDExcHg7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIG1hcmdpbi1ib3R0b206IDRweDtcbiAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XG5gO1xuXG5leHBvcnQgY29uc3QgUGFuZWxMYWJlbFdyYXBwZXIgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnc2lkZS1wYW5lbC1wYW5lbF9fbGFiZWwtd3JhcHBlcidcbn0pYFxuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogc2VsZi1zdGFydDtcbmA7XG5cbmV4cG9ydCBjb25zdCBQYW5lbExhYmVsQm9sZCA9IFBhbmVsTGFiZWwuZXh0ZW5kYFxuICBmb250LXdlaWdodDogNTAwO1xuYDtcblxuZXhwb3J0IGNvbnN0IFBhbmVsSGVhZGVyVGl0bGUgPSBzdHlsZWQuc3Bhbi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3NpZGUtcGFuZWwtcGFuZWxfX2hlYWRlcl9fdGl0bGUnXG59KWBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTs7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuNDNweDtcbiAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XG5gO1xuXG5leHBvcnQgY29uc3QgUGFuZWxIZWFkZXJDb250ZW50ID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgcGFkZGluZy1sZWZ0OiAxMnB4O1xuICBcbiAgLmljb24ge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBtYXJnaW4tcmlnaHQ6IDEycHg7XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBQYW5lbENvbnRlbnQgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnc2lkZS1wYW5lbC1wYW5lbF9fY29udGVudCdcbn0pYFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZH07XG4gIHBhZGRpbmc6IDEycHg7XG5gO1xuXG5leHBvcnQgY29uc3QgU2lkZVBhbmVsU2VjdGlvbiA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzaWRlLXBhbmVsLXNlY3Rpb24nXG59KWBcbiAgbWFyZ2luLWJvdHRvbTogMTJweDtcbiAgb3BhY2l0eTogJHtwcm9wcyA9PiAocHJvcHMuZGlzYWJsZWQgPyAwLjQgOiAxKX07XG4gIHBvaW50ZXItZXZlbnRzOiAke3Byb3BzID0+IChwcm9wcy5kaXNhYmxlZCA/ICdub25lJyA6ICdhbGwnKX07XG5gO1xuXG5leHBvcnQgY29uc3QgU2lkZVBhbmVsRGl2aWRlciA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzaWRlLXBhbmVsLWRpdmlkZXInXG59KWBcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCb3JkZXJDb2xvcn07XG4gIGhlaWdodDogMTJweDtcbiAgbWFyZ2luLWJvdHRvbTogMTJweDtcbmA7XG5cbmV4cG9ydCBjb25zdCBUb29sdGlwID0gc3R5bGVkKFJlYWN0VG9vbHRpcClgXG4gICYuX19yZWFjdF9jb21wb25lbnRfdG9vbHRpcCB7XG4gICAgZm9udC1zaXplOiA5LjVweDtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIHBhZGRpbmc6IDdweCAxOHB4O1xuXG4gICAgJi50eXBlLWRhcmsge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50b29sdGlwQmd9O1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudG9vbHRpcENvbG9yfTtcbiAgICAgICYucGxhY2UtYm90dG9tIHtcbiAgICAgICAgOmFmdGVyIHtcbiAgICAgICAgICBib3JkZXItYm90dG9tLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRvb2x0aXBCZ307XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJi5wbGFjZS10b3Age1xuICAgICAgICA6YWZ0ZXIge1xuICAgICAgICAgIGJvcmRlci10b3AtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudG9vbHRpcEJnfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAmLnBsYWNlLXJpZ2h0IHtcbiAgICAgICAgOmFmdGVyIHtcbiAgICAgICAgICBib3JkZXItcmlnaHQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudG9vbHRpcEJnfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAmLnBsYWNlLWxlZnQge1xuICAgICAgICA6YWZ0ZXIge1xuICAgICAgICAgIGJvcmRlci1sZWZ0LWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRvb2x0aXBCZ307XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBCdXR0b24gPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnYnV0dG9uJ1xufSlgXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5zZWNvbmRhcnlcbiAgICAgID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQmdkXG4gICAgICA6IHByb3BzLmxpbmsgPyBwcm9wcy50aGVtZS5saW5rQnRuQmdkIDogcHJvcHMudGhlbWUucHJpbWFyeUJ0bkJnZH07XG4gIGJvcmRlci1yYWRpdXM6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucHJpbWFyeUJ0blJhZGl1c307XG4gIGNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuc2Vjb25kYXJ5XG4gICAgICA/IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkNvbG9yXG4gICAgICA6IHByb3BzLmxpbmsgPyBwcm9wcy50aGVtZS5saW5rQnRuQ29sb3IgOiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuQ29sb3J9O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICBmb250LXNpemU6ICR7cHJvcHMgPT4gKHByb3BzLmxhcmdlID8gJzE0cHgnIDogJzExcHgnKX07XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBsZXR0ZXItc3BhY2luZzogMC4zcHg7XG4gIGxpbmUtaGVpZ2h0OiAxNHB4O1xuICBvdXRsaW5lOiAwO1xuICBwYWRkaW5nOiAke3Byb3BzID0+IChwcm9wcy5sYXJnZSA/ICcxNHB4IDMycHgnIDogJzlweCAxMnB4Jyl9O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHRyYW5zaXRpb246ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudHJhbnNpdGlvbn07XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gIHdpZHRoOiAke3Byb3BzID0+IHByb3BzLndpZHRoIHx8ICdhdXRvJ307XG5cbiAgOmhvdmVyLFxuICA6Zm9jdXMsXG4gIDphY3RpdmUsXG4gICYuYWN0aXZlIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+XG4gICAgICBwcm9wcy5zZWNvbmRhcnlcbiAgICAgICAgPyBwcm9wcy50aGVtZS5zZWNvbmRhcnlCdG5CZ2RIb3ZlclxuICAgICAgICA6IHByb3BzLmxpbmtcbiAgICAgICAgICA/IHByb3BzLnRoZW1lLmxpbmtCdG5BY3RCZ2RIb3ZlclxuICAgICAgICAgIDogcHJvcHMudGhlbWUucHJpbWFyeUJ0bkJnZEhvdmVyfTtcbiAgICBjb2xvcjogJHtwcm9wcyA9PlxuICAgICAgcHJvcHMuc2Vjb25kYXJ5XG4gICAgICAgID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQWN0Q29sb3JcbiAgICAgICAgOiBwcm9wcy5saW5rXG4gICAgICAgICAgPyBwcm9wcy50aGVtZS5saW5rQnRuQWN0Q29sb3JcbiAgICAgICAgICA6IHByb3BzLnRoZW1lLnByaW1hcnlCdG5BY3RDb2xvcn07XG4gIH1cblxuICBzdmcge1xuICAgIG1hcmdpbi1yaWdodDogOHB4O1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgSW5wdXQgPSBzdHlsZWQuaW5wdXRgXG4gICR7cHJvcHMgPT5cbiAgICBwcm9wcy5zZWNvbmRhcnkgPyBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dCA6IHByb3BzLnRoZW1lLmlucHV0fTtcbmA7XG5cbmV4cG9ydCBjb25zdCBJbmxpbmVJbnB1dCA9IElucHV0LmV4dGVuZGBcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbmxpbmVJbnB1dH07XG5gO1xuXG5leHBvcnQgY29uc3QgU3R5bGVkUGFuZWxIZWFkZXIgPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuYWN0aXZlXG4gICAgICA/IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZEhvdmVyXG4gICAgICA6IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZH07XG4gIGJvcmRlci1sZWZ0OiAzcHggc29saWRcbiAgICByZ2IoXG4gICAgICAke3Byb3BzID0+XG4gICAgICAgIHByb3BzLmxhYmVsUkNHQ29sb3JWYWx1ZXNcbiAgICAgICAgICA/IHByb3BzLmxhYmVsUkNHQ29sb3JWYWx1ZXMuam9pbignLCcpXG4gICAgICAgICAgOiAndHJhbnNwYXJlbnQnfVxuICAgICk7XG4gIHBhZGRpbmc6IDAgMTBweCAwIDA7XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEhlYWRlckhlaWdodH1weDtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB0cmFuc2l0aW9uOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRyYW5zaXRpb259O1xuYDtcblxuZXhwb3J0IGNvbnN0IFN0eWxlZFBhbmVsRHJvcGRvd24gPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZH07XG4gIG92ZXJmbG93LXk6IG92ZXJsYXk7XG4gIGJveC1zaGFkb3c6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCb3hTaGFkb3d9O1xuICBib3JkZXItcmFkaXVzOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQm9yZGVyUmFkaXVzfTtcbiAgbWFyZ2luLXRvcDogMnB4O1xuICBtYXgtaGVpZ2h0OiA1MDBweDtcbmA7XG5cbmV4cG9ydCBjb25zdCBCdXR0b25Hcm91cCA9IHN0eWxlZC5kaXZgXG4gIC5idXR0b24ge1xuICAgIGJvcmRlci1yYWRpdXM6IDA7XG4gICAgbWFyZ2luLWxlZnQ6IDJweDtcbiAgfVxuICAuYnV0dG9uOmZpcnN0LWNoaWxkIHtcbiAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnByaW1hcnlCdG5SYWRpdXN9O1xuICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucHJpbWFyeUJ0blJhZGl1c307XG4gICAgbWFyZ2luLWxlZnQ6IDA7XG4gIH1cbiAgLmJ1dHRvbjpsYXN0LWNoaWxkIHtcbiAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuUmFkaXVzfTtcbiAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuUmFkaXVzfTtcbiAgfVxuYDtcbiJdfQ==