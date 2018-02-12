'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Table = exports.DatasetSquare = exports.ButtonGroup = exports.StyledPanelDropdown = exports.StyledPanelHeader = exports.InlineInput = exports.Input = exports.Button = exports.Tooltip = exports.SidePanelDivider = exports.SidePanelSection = exports.PanelContent = exports.PanelHeaderContent = exports.PanelHeaderTitle = exports.PanelLabelBold = exports.PanelLabelWrapper = exports.PanelLabel = exports.CenterFlexbox = exports.IconRoundSmall = exports.SelectTextBold = exports.SelectText = undefined;

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  color: ', ';\n  font-size: ', ';\n  font-weight: 400;\n\n  i {\n    font-size: 13px;\n    margin-right: 6px;\n  }\n'], ['\n  color: ', ';\n  font-size: ', ';\n  font-weight: 400;\n\n  i {\n    font-size: 13px;\n    margin-right: 6px;\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  color: ', ';\n  font-weight: 500;\n'], ['\n  color: ', ';\n  font-weight: 500;\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  width: 18px;\n  height: 18px;\n  border-radius: 9px;\n  background-color: ', '; // updated after checking sketch file\n  color: ', ';\n  align-items: center;\n  justify-content: center;\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n'], ['\n  display: flex;\n  width: 18px;\n  height: 18px;\n  border-radius: 9px;\n  background-color: ', '; // updated after checking sketch file\n  color: ', ';\n  align-items: center;\n  justify-content: center;\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n']),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  align-items: center;\n'], ['\n  display: flex;\n  align-items: center;\n']),
    _templateObject5 = (0, _taggedTemplateLiteral3.default)(['\n  color: ', ';\n  display: inline-block;\n  font-size: 11px;\n  font-weight: 400;\n  margin-bottom: 4px;\n  text-transform: capitalize;\n'], ['\n  color: ', ';\n  display: inline-block;\n  font-size: 11px;\n  font-weight: 400;\n  margin-bottom: 4px;\n  text-transform: capitalize;\n']),
    _templateObject6 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  align-items: self-start;\n'], ['\n  display: flex;\n  align-items: self-start;\n']),
    _templateObject7 = (0, _taggedTemplateLiteral3.default)(['\n  font-weight: 500;\n'], ['\n  font-weight: 500;\n']),
    _templateObject8 = (0, _taggedTemplateLiteral3.default)(['\n  color: ', ';\n  font-size: 13px;\n  letter-spacing: 0.43px;\n  text-transform: capitalize;\n'], ['\n  color: ', ';\n  font-size: 13px;\n  letter-spacing: 0.43px;\n  text-transform: capitalize;\n']),
    _templateObject9 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  align-items: center;\n  color: ', ';\n  padding-left: 12px;\n\n  .icon {\n    color: ', ';\n    display: flex;\n    align-items: center;\n    margin-right: 12px;\n  }\n'], ['\n  display: flex;\n  align-items: center;\n  color: ', ';\n  padding-left: 12px;\n\n  .icon {\n    color: ', ';\n    display: flex;\n    align-items: center;\n    margin-right: 12px;\n  }\n']),
    _templateObject10 = (0, _taggedTemplateLiteral3.default)(['\n  background-color: ', ';\n  padding: 12px;\n'], ['\n  background-color: ', ';\n  padding: 12px;\n']),
    _templateObject11 = (0, _taggedTemplateLiteral3.default)(['\n  margin-bottom: 12px;\n  opacity: ', ';\n  pointer-events: ', ';\n'], ['\n  margin-bottom: 12px;\n  opacity: ', ';\n  pointer-events: ', ';\n']),
    _templateObject12 = (0, _taggedTemplateLiteral3.default)(['\n  border-bottom: 1px solid ', ';\n  height: 12px;\n  margin-bottom: 12px;\n'], ['\n  border-bottom: 1px solid ', ';\n  height: 12px;\n  margin-bottom: 12px;\n']),
    _templateObject13 = (0, _taggedTemplateLiteral3.default)(['\n  &.__react_component_tooltip {\n    font-size: 9.5px;\n    font-weight: 500;\n    padding: 7px 18px;\n\n    &.type-dark {\n      background-color: ', ';\n      color: ', ';\n      &.place-bottom {\n        :after {\n          border-bottom-color: ', ';\n        }\n      }\n\n      &.place-top {\n        :after {\n          border-top-color: ', ';\n        }\n      }\n\n      &.place-right {\n        :after {\n          border-right-color: ', ';\n        }\n      }\n\n      &.place-left {\n        :after {\n          border-left-color: ', ';\n        }\n      }\n    }\n  }\n'], ['\n  &.__react_component_tooltip {\n    font-size: 9.5px;\n    font-weight: 500;\n    padding: 7px 18px;\n\n    &.type-dark {\n      background-color: ', ';\n      color: ', ';\n      &.place-bottom {\n        :after {\n          border-bottom-color: ', ';\n        }\n      }\n\n      &.place-top {\n        :after {\n          border-top-color: ', ';\n        }\n      }\n\n      &.place-right {\n        :after {\n          border-right-color: ', ';\n        }\n      }\n\n      &.place-left {\n        :after {\n          border-left-color: ', ';\n        }\n      }\n    }\n  }\n']),
    _templateObject14 = (0, _taggedTemplateLiteral3.default)(['\n  align-items: center;\n  background-color: ', ';\n  border-radius: ', ';\n  color: ', ';\n  cursor: pointer;\n  display: inline-flex;\n  font-size: ', ';\n  font-weight: 500;\n  justify-content: center;\n  letter-spacing: 0.3px;\n  line-height: 14px;\n  outline: 0;\n  padding: ', ';\n  text-align: center;\n  transition: ', ';\n  vertical-align: middle;\n  width: ', ';\n\n  :hover,\n  :focus,\n  :active,\n  &.active {\n    background-color: ', ';\n    color: ', ';\n  }\n\n  svg {\n    margin-right: 8px;\n  }\n'], ['\n  align-items: center;\n  background-color: ', ';\n  border-radius: ', ';\n  color: ', ';\n  cursor: pointer;\n  display: inline-flex;\n  font-size: ', ';\n  font-weight: 500;\n  justify-content: center;\n  letter-spacing: 0.3px;\n  line-height: 14px;\n  outline: 0;\n  padding: ', ';\n  text-align: center;\n  transition: ', ';\n  vertical-align: middle;\n  width: ', ';\n\n  :hover,\n  :focus,\n  :active,\n  &.active {\n    background-color: ', ';\n    color: ', ';\n  }\n\n  svg {\n    margin-right: 8px;\n  }\n']),
    _templateObject15 = (0, _taggedTemplateLiteral3.default)(['\n  ', ';\n'], ['\n  ', ';\n']),
    _templateObject16 = (0, _taggedTemplateLiteral3.default)(['\n  background-color: ', ';\n  border-left: 3px solid\n    rgb(\n      ', '\n    );\n  padding: 0 10px 0 0;\n  height: ', 'px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  transition: ', ';\n'], ['\n  background-color: ', ';\n  border-left: 3px solid\n    rgb(\n      ', '\n    );\n  padding: 0 10px 0 0;\n  height: ', 'px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  transition: ', ';\n']),
    _templateObject17 = (0, _taggedTemplateLiteral3.default)(['\n  background-color: ', ';\n  overflow-y: overlay;\n  box-shadow: ', ';\n  border-radius: ', ';\n  margin-top: 2px;\n  max-height: 500px;\n'], ['\n  background-color: ', ';\n  overflow-y: overlay;\n  box-shadow: ', ';\n  border-radius: ', ';\n  margin-top: 2px;\n  max-height: 500px;\n']),
    _templateObject18 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  .button {\n    border-radius: 0;\n    margin-left: 2px;\n  }\n  .button:first-child {\n    border-bottom-left-radius: ', ';\n    border-top-left-radius: ', ';\n    margin-left: 0;\n  }\n  .button:last-child {\n    border-bottom-right-radius: ', ';\n    border-top-right-radius: ', ';\n  }\n'], ['\n  display: flex;\n  .button {\n    border-radius: 0;\n    margin-left: 2px;\n  }\n  .button:first-child {\n    border-bottom-left-radius: ', ';\n    border-top-left-radius: ', ';\n    margin-left: 0;\n  }\n  .button:last-child {\n    border-bottom-right-radius: ', ';\n    border-top-right-radius: ', ';\n  }\n']),
    _templateObject19 = (0, _taggedTemplateLiteral3.default)(['\n  display: inline-block;\n  width: 8px;\n  height: 8px;\n  background-color: rgb(', ');\n  margin-right: 12px\n'], ['\n  display: inline-block;\n  width: 8px;\n  height: 8px;\n  background-color: rgb(', ');\n  margin-right: 12px\n']),
    _templateObject20 = (0, _taggedTemplateLiteral3.default)(['\n  width: 100%;\n  border-spacing: 0;\n  \n  thead {\n    tr th {\n      background: ', ';\n      color: ', ';\n      padding: 18px 12px;\n      text-align: start;\n    }\n  }\n  \n  tbody {\n   tr td {\n     border-bottom: ', ';\n     padding: 12px;\n   }\n  }\n'], ['\n  width: 100%;\n  border-spacing: 0;\n  \n  thead {\n    tr th {\n      background: ', ';\n      color: ', ';\n      padding: 18px 12px;\n      text-align: start;\n    }\n  }\n  \n  tbody {\n   tr td {\n     border-bottom: ', ';\n     padding: 12px;\n   }\n  }\n']);

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
  return props.negative ? props.theme.negativeBtnBgd : props.secondary ? props.theme.secondaryBtnBgd : props.link ? props.theme.linkBtnBgd : props.theme.primaryBtnBgd;
}, function (props) {
  return props.theme.primaryBtnRadius;
}, function (props) {
  return props.negative ? props.theme.negativeBtnColor : props.secondary ? props.theme.secondaryBtnColor : props.link ? props.theme.linkBtnColor : props.theme.primaryBtnColor;
}, function (props) {
  return props.large ? '14px' : '11px';
}, function (props) {
  return props.large ? '14px 32px' : '9px 12px';
}, function (props) {
  return props.theme.transition;
}, function (props) {
  return props.width || 'auto';
}, function (props) {
  return props.negative ? props.theme.negativeBtnBgdHover : props.secondary ? props.theme.secondaryBtnBgdHover : props.link ? props.theme.linkBtnActBgdHover : props.theme.primaryBtnBgdHover;
}, function (props) {
  return props.negative ? props.theme.negativeBtnActColor : props.secondary ? props.theme.secondaryBtnActColor : props.link ? props.theme.linkBtnActColor : props.theme.primaryBtnActColor;
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

var DatasetSquare = exports.DatasetSquare = _styledComponents2.default.div(_templateObject19, function (props) {
  return props.color.join(',');
});

var Table = exports.Table = _styledComponents2.default.table(_templateObject20, function (props) {
  return props.theme.panelBackgroundLT;
}, function (props) {
  return props.theme.titleColorLT;
}, function (props) {
  return props.theme.panelBorderLT;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cy5qcyJdLCJuYW1lcyI6WyJTZWxlY3RUZXh0Iiwic3BhbiIsInByb3BzIiwidGhlbWUiLCJsYWJlbENvbG9yIiwic2VsZWN0Rm9udFNpemUiLCJTZWxlY3RUZXh0Qm9sZCIsImV4dGVuZCIsInRleHRDb2xvciIsIkljb25Sb3VuZFNtYWxsIiwiZGl2Iiwic2Vjb25kYXJ5QnRuQmdkSG92ZXIiLCJzZWNvbmRhcnlCdG5Db2xvciIsIkNlbnRlckZsZXhib3giLCJQYW5lbExhYmVsIiwibGFiZWwiLCJhdHRycyIsImNsYXNzTmFtZSIsIlBhbmVsTGFiZWxXcmFwcGVyIiwiUGFuZWxMYWJlbEJvbGQiLCJQYW5lbEhlYWRlclRpdGxlIiwiUGFuZWxIZWFkZXJDb250ZW50IiwiUGFuZWxDb250ZW50IiwicGFuZWxCYWNrZ3JvdW5kIiwiU2lkZVBhbmVsU2VjdGlvbiIsImRpc2FibGVkIiwiU2lkZVBhbmVsRGl2aWRlciIsInBhbmVsQm9yZGVyQ29sb3IiLCJUb29sdGlwIiwidG9vbHRpcEJnIiwidG9vbHRpcENvbG9yIiwiQnV0dG9uIiwibmVnYXRpdmUiLCJuZWdhdGl2ZUJ0bkJnZCIsInNlY29uZGFyeSIsInNlY29uZGFyeUJ0bkJnZCIsImxpbmsiLCJsaW5rQnRuQmdkIiwicHJpbWFyeUJ0bkJnZCIsInByaW1hcnlCdG5SYWRpdXMiLCJuZWdhdGl2ZUJ0bkNvbG9yIiwibGlua0J0bkNvbG9yIiwicHJpbWFyeUJ0bkNvbG9yIiwibGFyZ2UiLCJ0cmFuc2l0aW9uIiwid2lkdGgiLCJuZWdhdGl2ZUJ0bkJnZEhvdmVyIiwibGlua0J0bkFjdEJnZEhvdmVyIiwicHJpbWFyeUJ0bkJnZEhvdmVyIiwibmVnYXRpdmVCdG5BY3RDb2xvciIsInNlY29uZGFyeUJ0bkFjdENvbG9yIiwibGlua0J0bkFjdENvbG9yIiwicHJpbWFyeUJ0bkFjdENvbG9yIiwiSW5wdXQiLCJpbnB1dCIsInNlY29uZGFyeUlucHV0IiwiSW5saW5lSW5wdXQiLCJpbmxpbmVJbnB1dCIsIlN0eWxlZFBhbmVsSGVhZGVyIiwiYWN0aXZlIiwicGFuZWxCYWNrZ3JvdW5kSG92ZXIiLCJsYWJlbFJDR0NvbG9yVmFsdWVzIiwiam9pbiIsInBhbmVsSGVhZGVySGVpZ2h0IiwiU3R5bGVkUGFuZWxEcm9wZG93biIsInBhbmVsQm94U2hhZG93IiwicGFuZWxCb3JkZXJSYWRpdXMiLCJCdXR0b25Hcm91cCIsIkRhdGFzZXRTcXVhcmUiLCJjb2xvciIsIlRhYmxlIiwidGFibGUiLCJwYW5lbEJhY2tncm91bmRMVCIsInRpdGxlQ29sb3JMVCIsInBhbmVsQm9yZGVyTFQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRU8sSUFBTUEsa0NBQWEsMkJBQU9DLElBQXBCLGtCQUNGO0FBQUEsU0FBU0MsTUFBTUMsS0FBTixDQUFZQyxVQUFyQjtBQUFBLENBREUsRUFFRTtBQUFBLFNBQVNGLE1BQU1DLEtBQU4sQ0FBWUUsY0FBckI7QUFBQSxDQUZGLENBQU47O0FBV0EsSUFBTUMsMENBQWlCTixXQUFXTyxNQUE1QixtQkFDRjtBQUFBLFNBQVNMLE1BQU1DLEtBQU4sQ0FBWUssU0FBckI7QUFBQSxDQURFLENBQU47O0FBS0EsSUFBTUMsMENBQWlCLDJCQUFPQyxHQUF4QixtQkFLUztBQUFBLFNBQ2xCUixNQUFNQyxLQUFOLENBQVlRLG9CQURNO0FBQUEsQ0FMVCxFQU9GO0FBQUEsU0FBU1QsTUFBTUMsS0FBTixDQUFZUyxpQkFBckI7QUFBQSxDQVBFLEVBYVc7QUFBQSxTQUFTVixNQUFNQyxLQUFOLENBQVlRLG9CQUFyQjtBQUFBLENBYlgsQ0FBTjs7QUFpQkEsSUFBTUUsd0NBQWdCLDJCQUFPSCxHQUF2QixrQkFBTjs7QUFLQSxJQUFNSSxrQ0FBYSwyQkFBT0MsS0FBUCxDQUFhQyxLQUFiLENBQW1CO0FBQzNDQyxhQUFXO0FBRGdDLENBQW5CLENBQWIsbUJBR0Y7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QWYsb0JBTU87QUFBQSxTQUFTckUsTUFBTUMsS0FBTixDQUFZcUUsaUJBQXJCO0FBQUEsQ0FOUCxFQU9FO0FBQUEsU0FBU3RFLE1BQU1DLEtBQU4sQ0FBWXNFLFlBQXJCO0FBQUEsQ0FQRixFQWVTO0FBQUEsU0FBU3ZFLE1BQU1DLEtBQU4sQ0FBWXVFLGFBQXJCO0FBQUEsQ0FmVCxDQUFOIiwiZmlsZSI6InN0eWxlZC1jb21wb25lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgUmVhY3RUb29sdGlwIGZyb20gJ3JlYWN0LXRvb2x0aXAnO1xuXG5leHBvcnQgY29uc3QgU2VsZWN0VGV4dCA9IHN0eWxlZC5zcGFuYFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yfTtcbiAgZm9udC1zaXplOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdEZvbnRTaXplfTtcbiAgZm9udC13ZWlnaHQ6IDQwMDtcblxuICBpIHtcbiAgICBmb250LXNpemU6IDEzcHg7XG4gICAgbWFyZ2luLXJpZ2h0OiA2cHg7XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBTZWxlY3RUZXh0Qm9sZCA9IFNlbGVjdFRleHQuZXh0ZW5kYFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICBmb250LXdlaWdodDogNTAwO1xuYDtcblxuZXhwb3J0IGNvbnN0IEljb25Sb3VuZFNtYWxsID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgd2lkdGg6IDE4cHg7XG4gIGhlaWdodDogMThweDtcbiAgYm9yZGVyLXJhZGl1czogOXB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQmdkSG92ZXJ9OyAvLyB1cGRhdGVkIGFmdGVyIGNoZWNraW5nIHNrZXRjaCBmaWxlXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkNvbG9yfTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlCdG5CZ2RIb3Zlcn07XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBDZW50ZXJGbGV4Ym94ID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbmA7XG5cbmV4cG9ydCBjb25zdCBQYW5lbExhYmVsID0gc3R5bGVkLmxhYmVsLmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnc2lkZS1wYW5lbC1wYW5lbF9fbGFiZWwnXG59KWBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgZm9udC1zaXplOiAxMXB4O1xuICBmb250LXdlaWdodDogNDAwO1xuICBtYXJnaW4tYm90dG9tOiA0cHg7XG4gIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xuYDtcblxuZXhwb3J0IGNvbnN0IFBhbmVsTGFiZWxXcmFwcGVyID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3NpZGUtcGFuZWwtcGFuZWxfX2xhYmVsLXdyYXBwZXInXG59KWBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IHNlbGYtc3RhcnQ7XG5gO1xuXG5leHBvcnQgY29uc3QgUGFuZWxMYWJlbEJvbGQgPSBQYW5lbExhYmVsLmV4dGVuZGBcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbmA7XG5cbmV4cG9ydCBjb25zdCBQYW5lbEhlYWRlclRpdGxlID0gc3R5bGVkLnNwYW4uYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzaWRlLXBhbmVsLXBhbmVsX19oZWFkZXJfX3RpdGxlJ1xufSlgXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuNDNweDtcbiAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XG5gO1xuXG5leHBvcnQgY29uc3QgUGFuZWxIZWFkZXJDb250ZW50ID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgcGFkZGluZy1sZWZ0OiAxMnB4O1xuXG4gIC5pY29uIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yfTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgbWFyZ2luLXJpZ2h0OiAxMnB4O1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgUGFuZWxDb250ZW50ID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3NpZGUtcGFuZWwtcGFuZWxfX2NvbnRlbnQnXG59KWBcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmR9O1xuICBwYWRkaW5nOiAxMnB4O1xuYDtcblxuZXhwb3J0IGNvbnN0IFNpZGVQYW5lbFNlY3Rpb24gPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnc2lkZS1wYW5lbC1zZWN0aW9uJ1xufSlgXG4gIG1hcmdpbi1ib3R0b206IDEycHg7XG4gIG9wYWNpdHk6ICR7cHJvcHMgPT4gKHByb3BzLmRpc2FibGVkID8gMC40IDogMSl9O1xuICBwb2ludGVyLWV2ZW50czogJHtwcm9wcyA9PiAocHJvcHMuZGlzYWJsZWQgPyAnbm9uZScgOiAnYWxsJyl9O1xuYDtcblxuZXhwb3J0IGNvbnN0IFNpZGVQYW5lbERpdmlkZXIgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnc2lkZS1wYW5lbC1kaXZpZGVyJ1xufSlgXG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQm9yZGVyQ29sb3J9O1xuICBoZWlnaHQ6IDEycHg7XG4gIG1hcmdpbi1ib3R0b206IDEycHg7XG5gO1xuXG5leHBvcnQgY29uc3QgVG9vbHRpcCA9IHN0eWxlZChSZWFjdFRvb2x0aXApYFxuICAmLl9fcmVhY3RfY29tcG9uZW50X3Rvb2x0aXAge1xuICAgIGZvbnQtc2l6ZTogOS41cHg7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBwYWRkaW5nOiA3cHggMThweDtcblxuICAgICYudHlwZS1kYXJrIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudG9vbHRpcEJnfTtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRvb2x0aXBDb2xvcn07XG4gICAgICAmLnBsYWNlLWJvdHRvbSB7XG4gICAgICAgIDphZnRlciB7XG4gICAgICAgICAgYm9yZGVyLWJvdHRvbS1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50b29sdGlwQmd9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgICYucGxhY2UtdG9wIHtcbiAgICAgICAgOmFmdGVyIHtcbiAgICAgICAgICBib3JkZXItdG9wLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRvb2x0aXBCZ307XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJi5wbGFjZS1yaWdodCB7XG4gICAgICAgIDphZnRlciB7XG4gICAgICAgICAgYm9yZGVyLXJpZ2h0LWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRvb2x0aXBCZ307XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJi5wbGFjZS1sZWZ0IHtcbiAgICAgICAgOmFmdGVyIHtcbiAgICAgICAgICBib3JkZXItbGVmdC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50b29sdGlwQmd9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgQnV0dG9uID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ2J1dHRvbidcbn0pYFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMubmVnYXRpdmVcbiAgICAgID8gcHJvcHMudGhlbWUubmVnYXRpdmVCdG5CZ2RcbiAgICAgIDogcHJvcHMuc2Vjb25kYXJ5XG4gICAgICAgID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQmdkXG4gICAgICAgIDogcHJvcHMubGluayA/IHByb3BzLnRoZW1lLmxpbmtCdG5CZ2QgOiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuQmdkfTtcbiAgYm9yZGVyLXJhZGl1czogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuUmFkaXVzfTtcbiAgY29sb3I6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5uZWdhdGl2ZVxuICAgICAgPyBwcm9wcy50aGVtZS5uZWdhdGl2ZUJ0bkNvbG9yXG4gICAgICA6IHByb3BzLnNlY29uZGFyeVxuICAgICAgICA/IHByb3BzLnRoZW1lLnNlY29uZGFyeUJ0bkNvbG9yXG4gICAgICAgIDogcHJvcHMubGluayA/IHByb3BzLnRoZW1lLmxpbmtCdG5Db2xvciA6IHByb3BzLnRoZW1lLnByaW1hcnlCdG5Db2xvcn07XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gIGZvbnQtc2l6ZTogJHtwcm9wcyA9PiAocHJvcHMubGFyZ2UgPyAnMTRweCcgOiAnMTFweCcpfTtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGxldHRlci1zcGFjaW5nOiAwLjNweDtcbiAgbGluZS1oZWlnaHQ6IDE0cHg7XG4gIG91dGxpbmU6IDA7XG4gIHBhZGRpbmc6ICR7cHJvcHMgPT4gKHByb3BzLmxhcmdlID8gJzE0cHggMzJweCcgOiAnOXB4IDEycHgnKX07XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdHJhbnNpdGlvbjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50cmFuc2l0aW9ufTtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgd2lkdGg6ICR7cHJvcHMgPT4gcHJvcHMud2lkdGggfHwgJ2F1dG8nfTtcblxuICA6aG92ZXIsXG4gIDpmb2N1cyxcbiAgOmFjdGl2ZSxcbiAgJi5hY3RpdmUge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT5cbiAgICAgIHByb3BzLm5lZ2F0aXZlXG4gICAgICAgID8gcHJvcHMudGhlbWUubmVnYXRpdmVCdG5CZ2RIb3ZlclxuICAgICAgICA6IHByb3BzLnNlY29uZGFyeVxuICAgICAgICAgID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQmdkSG92ZXJcbiAgICAgICAgICA6IHByb3BzLmxpbmtcbiAgICAgICAgICAgID8gcHJvcHMudGhlbWUubGlua0J0bkFjdEJnZEhvdmVyXG4gICAgICAgICAgICA6IHByb3BzLnRoZW1lLnByaW1hcnlCdG5CZ2RIb3Zlcn07XG4gICAgY29sb3I6ICR7cHJvcHMgPT5cbiAgICAgIHByb3BzLm5lZ2F0aXZlXG4gICAgICAgID8gcHJvcHMudGhlbWUubmVnYXRpdmVCdG5BY3RDb2xvclxuICAgICAgICA6IHByb3BzLnNlY29uZGFyeVxuICAgICAgICAgID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQWN0Q29sb3JcbiAgICAgICAgICA6IHByb3BzLmxpbmtcbiAgICAgICAgICAgID8gcHJvcHMudGhlbWUubGlua0J0bkFjdENvbG9yXG4gICAgICAgICAgICA6IHByb3BzLnRoZW1lLnByaW1hcnlCdG5BY3RDb2xvcn07XG4gIH1cblxuICBzdmcge1xuICAgIG1hcmdpbi1yaWdodDogOHB4O1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgSW5wdXQgPSBzdHlsZWQuaW5wdXRgXG4gICR7cHJvcHMgPT5cbiAgICBwcm9wcy5zZWNvbmRhcnkgPyBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dCA6IHByb3BzLnRoZW1lLmlucHV0fTtcbmA7XG5cbmV4cG9ydCBjb25zdCBJbmxpbmVJbnB1dCA9IElucHV0LmV4dGVuZGBcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbmxpbmVJbnB1dH07XG5gO1xuXG5leHBvcnQgY29uc3QgU3R5bGVkUGFuZWxIZWFkZXIgPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuYWN0aXZlXG4gICAgICA/IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZEhvdmVyXG4gICAgICA6IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZH07XG4gIGJvcmRlci1sZWZ0OiAzcHggc29saWRcbiAgICByZ2IoXG4gICAgICAke3Byb3BzID0+XG4gICAgICAgIHByb3BzLmxhYmVsUkNHQ29sb3JWYWx1ZXNcbiAgICAgICAgICA/IHByb3BzLmxhYmVsUkNHQ29sb3JWYWx1ZXMuam9pbignLCcpXG4gICAgICAgICAgOiAndHJhbnNwYXJlbnQnfVxuICAgICk7XG4gIHBhZGRpbmc6IDAgMTBweCAwIDA7XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEhlYWRlckhlaWdodH1weDtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB0cmFuc2l0aW9uOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRyYW5zaXRpb259O1xuYDtcblxuZXhwb3J0IGNvbnN0IFN0eWxlZFBhbmVsRHJvcGRvd24gPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZH07XG4gIG92ZXJmbG93LXk6IG92ZXJsYXk7XG4gIGJveC1zaGFkb3c6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCb3hTaGFkb3d9O1xuICBib3JkZXItcmFkaXVzOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQm9yZGVyUmFkaXVzfTtcbiAgbWFyZ2luLXRvcDogMnB4O1xuICBtYXgtaGVpZ2h0OiA1MDBweDtcbmA7XG5cbmV4cG9ydCBjb25zdCBCdXR0b25Hcm91cCA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIC5idXR0b24ge1xuICAgIGJvcmRlci1yYWRpdXM6IDA7XG4gICAgbWFyZ2luLWxlZnQ6IDJweDtcbiAgfVxuICAuYnV0dG9uOmZpcnN0LWNoaWxkIHtcbiAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnByaW1hcnlCdG5SYWRpdXN9O1xuICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucHJpbWFyeUJ0blJhZGl1c307XG4gICAgbWFyZ2luLWxlZnQ6IDA7XG4gIH1cbiAgLmJ1dHRvbjpsYXN0LWNoaWxkIHtcbiAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuUmFkaXVzfTtcbiAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuUmFkaXVzfTtcbiAgfVxuYDtcblxuZXhwb3J0IGNvbnN0IERhdGFzZXRTcXVhcmUgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHdpZHRoOiA4cHg7XG4gIGhlaWdodDogOHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoJHtwcm9wcyA9PiBwcm9wcy5jb2xvci5qb2luKCcsJyl9KTtcbiAgbWFyZ2luLXJpZ2h0OiAxMnB4XG5gO1xuXG5leHBvcnQgY29uc3QgVGFibGUgPSBzdHlsZWQudGFibGVgXG4gIHdpZHRoOiAxMDAlO1xuICBib3JkZXItc3BhY2luZzogMDtcbiAgXG4gIHRoZWFkIHtcbiAgICB0ciB0aCB7XG4gICAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZExUfTtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRpdGxlQ29sb3JMVH07XG4gICAgICBwYWRkaW5nOiAxOHB4IDEycHg7XG4gICAgICB0ZXh0LWFsaWduOiBzdGFydDtcbiAgICB9XG4gIH1cbiAgXG4gIHRib2R5IHtcbiAgIHRyIHRkIHtcbiAgICAgYm9yZGVyLWJvdHRvbTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJvcmRlckxUfTtcbiAgICAgcGFkZGluZzogMTJweDtcbiAgIH1cbiAgfVxuYDtcbiJdfQ==