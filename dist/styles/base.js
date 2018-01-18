'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.theme = exports.modalScrollBar = exports.textTruncate = exports.modalFooterBgd = exports.modalTitleFontSize = exports.modalTitleColor = exports.tooltipColor = exports.tooltipBg = exports.mapPanelHeaderBackgroundColor = exports.mapPanelBackgroundColor = exports.inputFontWeight = exports.inputFontSize = exports.inputPadding = exports.inputBoxHeight = exports.sidePanelBg = exports.sideNavBg = exports.panelBorderLT = exports.panelBorder = exports.panelBorderColor = exports.panelActiveBg = exports.panelBackgroundLT = exports.panelBackground = exports.dropdownListHighlightBg = exports.selectBorder = exports.selectBorderRadius = exports.selectBorderColor = exports.selectBackgroundHoverLT = exports.selectBackgroundLT = exports.selectBackgroundHover = exports.selectBackground = exports.selectColorPlaceHolder = exports.selectFontWeightBold = exports.selectFontWeight = exports.selectFontSize = exports.selectActiveBorderColor = exports.selectColorLT = exports.selectColor = exports.linkBtnActBgdHover = exports.linkBtnActColor = exports.linkBtnColor = exports.linkBtnActBgd = exports.linkBtnBgd = exports.secondaryBtnBgdHover = exports.secondaryBtnActColor = exports.secondaryBtnColor = exports.secondaryBtnActBgd = exports.secondaryBtnBgd = exports.primaryBtnBgdHover = exports.primaryBtnActColor = exports.primaryBtnColor = exports.primaryBtnActBgd = exports.primaryBtnBgd = exports.positiveBgColor = exports.positiveColor = exports.errorBgColor = exports.errorColor = exports.activeColorHover = exports.activeColor = exports.textColorHl = exports.subtextColorLT = exports.subtextColor = exports.titleColorLT = exports.textColorLT = exports.textColor = exports.labelColorLT = exports.labelHoverColor = exports.labelColor = exports.borderColorLight = exports.borderColor = exports.borderRadius = exports.boxSizing = exports.boxShadow = exports.transition = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  align-items: center;\n  background-color: ', ';\n  border: 1px solid\n    ', ';\n  caret-color: ', ';\n  color: ', ';\n  display: flex;\n  font-size: ', ';\n  font-weight: ', ';\n  height: ', ';\n  justify-content: space-between;\n  outline: none;\n  overflow: hidden;\n  padding: ', ';\n  text-overflow: ellipsis;\n  transition: ', ';\n  white-space: nowrap;\n  width: 100%;\n  word-wrap: normal;\n  pointer-events: ', ';\n  opacity: ', ';\n  \n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n'], ['\n  align-items: center;\n  background-color: ', ';\n  border: 1px solid\n    ', ';\n  caret-color: ', ';\n  color: ', ';\n  display: flex;\n  font-size: ', ';\n  font-weight: ', ';\n  height: ', ';\n  justify-content: space-between;\n  outline: none;\n  overflow: hidden;\n  padding: ', ';\n  text-overflow: ellipsis;\n  transition: ', ';\n  white-space: nowrap;\n  width: 100%;\n  word-wrap: normal;\n  pointer-events: ', ';\n  opacity: ', ';\n  \n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ::-webkit-scrollbar {\n    height: 10px;\n    width: 10px;\n  }\n  \n  ::-webkit-scrollbar-corner {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-track {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ', ';\n    border: 3px solid ', ';\n  };\n  \n  :vertical:hover {\n    background: ', ';\n  }\n}'], ['\n  ::-webkit-scrollbar {\n    height: 10px;\n    width: 10px;\n  }\n  \n  ::-webkit-scrollbar-corner {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-track {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ', ';\n    border: 3px solid ', ';\n  };\n  \n  :vertical:hover {\n    background: ', ';\n  }\n}']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n  padding-left: 3px;\n'], ['\n  color: ', ';\n  padding-left: 3px;\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  font-size: 11px;\n  padding: 5px 9px;\n\n  &.hover,\n  &:hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n'], ['\n  font-size: 11px;\n  padding: 5px 9px;\n\n  &.hover,\n  &:hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n  font-size: 11px;\n  padding: 5px 9px;\n  color: ', ';\n'], ['\n  font-size: 11px;\n  padding: 5px 9px;\n  color: ', ';\n']),
    _templateObject6 = (0, _taggedTemplateLiteralLoose3.default)(['\n  padding: 0 0 4px 0;\n  margin-bottom: 4px;\n  border-bottom: 1px solid ', ';\n'], ['\n  padding: 0 0 4px 0;\n  margin-bottom: 4px;\n  border-bottom: 1px solid ', ';\n']),
    _templateObject7 = (0, _taggedTemplateLiteralLoose3.default)(['\n  overflow-y: overlay;\n  max-height: 280px;\n  \n  .list__section {\n    ', '\n  }\n  .list__header {\n    ', '\n  }\n  \n  .list__item {\n    ', '\n  }\n  \n  .list__item__anchor {\n    ', '\n  }\n  \n  ', ';\n'], ['\n  overflow-y: overlay;\n  max-height: 280px;\n  \n  .list__section {\n    ', '\n  }\n  .list__header {\n    ', '\n  }\n  \n  .list__item {\n    ', '\n  }\n  \n  .list__item__anchor {\n    ', '\n  }\n  \n  ', ';\n']),
    _templateObject8 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ::-webkit-scrollbar {\n    width: 14px;\n  }\n  \n  ::-webkit-scrollbar-track {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ', ';\n    border: 3px solid ', '\n\n    \':vertical\': {\n      background: ', ';\n    },\n\n    \':vertical:hover\': {\n      background: ', ';\n    }\n  }\n}'], ['\n  ::-webkit-scrollbar {\n    width: 14px;\n  }\n  \n  ::-webkit-scrollbar-track {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ', ';\n    border: 3px solid ', '\n\n    \':vertical\': {\n      background: ', ';\n    },\n\n    \':vertical:hover\': {\n      background: ', ';\n    }\n  }\n}']),
    _templateObject9 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ::-webkit-scrollbar {\n    width: 14px;\n    height: 16px;\n  }\n\n  ::-webkit-scrollbar-track {\n    background: white;\n  }\n  ::-webkit-scrollbar-track:horizontal {\n    background: ', ';\n  }\n  ::-webkit-scrollbar-thumb {\n    background: ', ';\n    border: 4px solid white\n  }\n\n  ::-webkit-scrollbar-corner {\n    background: ', ';\n  }\n\n  ::-webkit-scrollbar-thumb:hover {\n    background: #969DA9;\n  }\n\n  ::-webkit-scrollbar-thumb:vertical {\n    border-radius: 7px;\n  }\n\n  ::-webkit-scrollbar-thumb:horizontal {\n    border-radius: 9px;\n    border: 4px solid ', ';\n  }\n'], ['\n  ::-webkit-scrollbar {\n    width: 14px;\n    height: 16px;\n  }\n\n  ::-webkit-scrollbar-track {\n    background: white;\n  }\n  ::-webkit-scrollbar-track:horizontal {\n    background: ', ';\n  }\n  ::-webkit-scrollbar-thumb {\n    background: ', ';\n    border: 4px solid white\n  }\n\n  ::-webkit-scrollbar-corner {\n    background: ', ';\n  }\n\n  ::-webkit-scrollbar-thumb:hover {\n    background: #969DA9;\n  }\n\n  ::-webkit-scrollbar-thumb:vertical {\n    border-radius: 7px;\n  }\n\n  ::-webkit-scrollbar-thumb:horizontal {\n    border-radius: 9px;\n    border: 4px solid ', ';\n  }\n']);

var _styledComponents = require('styled-components');

var _defaultSettings = require('../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transition = exports.transition = 'all .4s ease';

var boxShadow = exports.boxShadow = '0 1px 2px 0 rgba(0,0,0,0.10)';
var boxSizing = exports.boxSizing = 'border-box';
var borderRadius = exports.borderRadius = '1px';
var borderColor = exports.borderColor = '#3A414C';
var borderColorLight = exports.borderColorLight = '#F1F1F1';

// TEXT
var labelColor = exports.labelColor = '#747576';
var labelHoverColor = exports.labelHoverColor = '#C6C6C6';
var labelColorLT = exports.labelColorLT = '#6A7485';

var textColor = exports.textColor = '#A0A7B4';
var textColorLT = exports.textColorLT = '#3A414C';
var titleColorLT = exports.titleColorLT = '#29323C';

var subtextColor = exports.subtextColor = '#6A7485';
var subtextColorLT = exports.subtextColorLT = '#A0A7B4';

var textColorHl = exports.textColorHl = '#D3D8E0';
var activeColor = exports.activeColor = '#11939A';
var activeColorHover = exports.activeColorHover = '#108188';
var errorColor = exports.errorColor = '#CA3B27';
var errorBgColor = exports.errorBgColor = '#FEEFEB';
var positiveColor = exports.positiveColor = '#629A41';
var positiveBgColor = exports.positiveBgColor = '#F3F9ED';

// Button
var primaryBtnBgd = exports.primaryBtnBgd = '#0F9668';
var primaryBtnActBgd = exports.primaryBtnActBgd = '#13B17B';
var primaryBtnColor = exports.primaryBtnColor = '#FFFFFF';
var primaryBtnActColor = exports.primaryBtnActColor = '#FFFFFF';
var primaryBtnBgdHover = exports.primaryBtnBgdHover = '#13B17B';

var secondaryBtnBgd = exports.secondaryBtnBgd = '#6A7485';
var secondaryBtnActBgd = exports.secondaryBtnActBgd = '#A0A7B4';
var secondaryBtnColor = exports.secondaryBtnColor = '#FFFFFF';
var secondaryBtnActColor = exports.secondaryBtnActColor = '#FFFFFF';
var secondaryBtnBgdHover = exports.secondaryBtnBgdHover = '#A0A7B4';

var linkBtnBgd = exports.linkBtnBgd = 'transparent';
var linkBtnActBgd = exports.linkBtnActBgd = linkBtnBgd;
var linkBtnColor = exports.linkBtnColor = '#A0A7B4';
var linkBtnActColor = exports.linkBtnActColor = '#3A414C';
var linkBtnActBgdHover = exports.linkBtnActBgdHover = linkBtnBgd;

var selectColor = exports.selectColor = textColor;
var selectColorLT = exports.selectColorLT = titleColorLT;

var selectActiveBorderColor = exports.selectActiveBorderColor = '#A0A7B4';
var selectFontSize = exports.selectFontSize = '11px';
var selectFontWeight = exports.selectFontWeight = '400';
var selectFontWeightBold = exports.selectFontWeightBold = '500';

var selectColorPlaceHolder = exports.selectColorPlaceHolder = '#747576';
var selectBackground = exports.selectBackground = '#494949';
var selectBackgroundHover = exports.selectBackgroundHover = '#3E3E3E';
var selectBackgroundLT = exports.selectBackgroundLT = '#FFFFFF';
var selectBackgroundHoverLT = exports.selectBackgroundHoverLT = '#F8F8F9';
var selectBorderColor = exports.selectBorderColor = '#717171';
var selectBorderRadius = exports.selectBorderRadius = '1px';
var selectBorder = exports.selectBorder = 0;

var dropdownListHighlightBg = exports.dropdownListHighlightBg = '#717171';

var panelBackground = exports.panelBackground = '#2E2E2F';
var panelBackgroundLT = exports.panelBackgroundLT = '#f8f8f9';

var panelActiveBg = exports.panelActiveBg = '#333334';
var panelBorderColor = exports.panelBorderColor = '#3A414C';
var panelBorder = exports.panelBorder = '1px solid ' + borderColor;
var panelBorderLT = exports.panelBorderLT = '1px solid ' + borderColorLight;

var sideNavBg = exports.sideNavBg = '#29292A';
var sidePanelBg = exports.sidePanelBg = '#232324';

var inputBoxHeight = exports.inputBoxHeight = '28px';
var inputPadding = exports.inputPadding = '4px 10px';
var inputFontSize = exports.inputFontSize = '12px';
var inputFontWeight = exports.inputFontWeight = 500;

var mapPanelBackgroundColor = exports.mapPanelBackgroundColor = '#242730';
var mapPanelHeaderBackgroundColor = exports.mapPanelHeaderBackgroundColor = '#29323C';
var tooltipBg = exports.tooltipBg = '#F8F8F9';
var tooltipColor = exports.tooltipColor = '#333334';

// Modal
var modalTitleColor = exports.modalTitleColor = '#3A414C';
var modalTitleFontSize = exports.modalTitleFontSize = '32px';
var modalFooterBgd = exports.modalFooterBgd = '#F8F8F9';

var textTruncate = exports.textTruncate = {
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  wordWrap: 'normal'
};

// theme is passed to kepler.gl when it's mounted,
// it is used by styled-components to pass along to
// all child components
var input = (0, _styledComponents.css)(_templateObject, function (props) {
  return props.theme.selectBackground;
}, function (props) {
  return props.active ? props.theme.selectActiveBorderColor : props.error ? props.theme.errorColor : props.theme.selectBackground;
}, function (props) {
  return props.theme.selectActiveBorderColor;
}, function (props) {
  return props.theme.selectColor;
}, function (props) {
  return props.theme.inputFontSize;
}, function (props) {
  return props.theme.inputFontWeight;
}, function (props) {
  return props.theme.inputBoxHeight;
}, function (props) {
  return props.theme.inputPadding;
}, function (props) {
  return props.theme.transition;
}, function (props) {
  return props.disabled ? 'none' : 'all';
}, function (props) {
  return props.disabled ? 0.5 : 1;
}, function (props) {
  return props.theme.selectBackgroundHover;
});

var dropdownScrollBar = (0, _styledComponents.css)(_templateObject2, function (props) {
  return props.theme.selectBackground;
}, function (props) {
  return props.theme.selectBackground;
}, function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.selectBackground;
}, function (props) {
  return props.theme.selectBackgroundHover;
});

var dropdownListAnchor = (0, _styledComponents.css)(_templateObject3, function (props) {
  return props.theme.selectColor;
});

var dropdownListItem = (0, _styledComponents.css)(_templateObject4, function (props) {
  return props.theme.dropdownListHighlightBg;
});

var dropdownListHeader = (0, _styledComponents.css)(_templateObject5, function (props) {
  return props.theme.labelColor;
});

var dropdownListSection = (0, _styledComponents.css)(_templateObject6, function (props) {
  return props.theme.labelColor;
});

var dropdownList = (0, _styledComponents.css)(_templateObject7, function (props) {
  return props.theme.dropdownListSection;
}, function (props) {
  return props.theme.dropdownListHeader;
}, function (props) {
  return props.theme.dropdownListItem;
}, function (props) {
  return props.theme.dropdownListAnchor;
}, function (props) {
  return props.theme.dropdownScrollBar;
});

var scrollBar = (0, _styledComponents.css)(_templateObject8, function (props) {
  return props.theme.sidePanelBg;
}, function (props) {
  return props.theme.panelBackground;
}, function (props) {
  return props.theme.sidePanelBg;
}, function (props) {
  return props.theme.panelBackground;
}, function (props) {
  return props.theme.selectBackgroundHover;
});

var modalScrollBar = exports.modalScrollBar = (0, _styledComponents.css)(_templateObject9, function (props) {
  return props.theme.textColorHl;
}, function (props) {
  return props.theme.labelColorLT;
}, function (props) {
  return props.theme.textColorHl;
}, function (props) {
  return props.theme.textColorHl;
});

var theme = exports.theme = (0, _extends3.default)({}, _defaultSettings.DIMENSIONS, {
  // templates
  input: input,
  dropdownScrollBar: dropdownScrollBar,
  dropdownList: dropdownList,
  dropdownListItem: dropdownListItem,
  dropdownListAnchor: dropdownListAnchor,
  dropdownListHeader: dropdownListHeader,
  dropdownListSection: dropdownListSection,
  modalScrollBar: modalScrollBar,
  scrollBar: scrollBar,

  // styles
  activeColor: activeColor,
  activeColorHover: activeColorHover,
  borderRadius: borderRadius,
  boxShadow: boxShadow,
  errorColor: errorColor,
  dropdownListHighlightBg: dropdownListHighlightBg,
  inputBoxHeight: inputBoxHeight,
  inputPadding: inputPadding,
  inputFontSize: inputFontSize,
  inputFontWeight: inputFontWeight,
  labelColor: labelColor,
  labelColorLT: labelColorLT,
  labelHoverColor: labelHoverColor,
  mapPanelBackgroundColor: mapPanelBackgroundColor,
  mapPanelHeaderBackgroundColor: mapPanelHeaderBackgroundColor,

  // Panel
  panelActiveBg: panelActiveBg,
  panelBackground: panelBackground,
  panelBackgroundLT: panelBackgroundLT,
  panelBorder: panelBorder,
  panelBorderColor: panelBorderColor,
  panelBorderLT: panelBorderLT,

  // Select
  selectActiveBorderColor: selectActiveBorderColor,
  selectBackground: selectBackground,
  selectBackgroundLT: selectBackgroundLT,
  selectBackgroundHover: selectBackgroundHover,
  selectBackgroundHoverLT: selectBackgroundHoverLT,
  selectBorder: selectBorder,
  selectBorderRadius: selectBorderRadius,
  selectColor: selectColor,
  selectColorPlaceHolder: selectColorPlaceHolder,
  selectFontSize: selectFontSize,
  selectFontWeight: selectFontWeight,
  selectColorLT: selectColorLT,

  // Button
  primaryBtnBgd: primaryBtnBgd,
  primaryBtnActBgd: primaryBtnActBgd,
  primaryBtnColor: primaryBtnColor,
  primaryBtnActColor: primaryBtnActColor,
  primaryBtnBgdHover: primaryBtnBgdHover,
  secondaryBtnBgd: secondaryBtnBgd,
  secondaryBtnActBgd: secondaryBtnActBgd,
  secondaryBtnBgdHover: secondaryBtnBgdHover,
  secondaryBtnColor: secondaryBtnColor,
  secondaryBtnActColor: secondaryBtnActColor,
  linkBtnBgd: linkBtnBgd,
  linkBtnActBgd: linkBtnActBgd,
  linkBtnColor: linkBtnColor,
  linkBtnActColor: linkBtnActColor,
  linkBtnActBgdHover: linkBtnActBgdHover,

  // Modal
  modalTitleColor: modalTitleColor,
  modalTitleFontSize: modalTitleFontSize,
  modalFooterBgd: modalFooterBgd,

  sidePanelBg: sidePanelBg,
  textColor: textColor,
  textColorLT: textColorLT,
  textColorHl: textColorHl,
  subtextColor: subtextColor,
  subtextColorLT: subtextColorLT,
  textTruncate: textTruncate,
  titleColorLT: titleColorLT,
  transition: transition,
  tooltipBg: tooltipBg,
  tooltipColor: tooltipColor
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHlsZXMvYmFzZS5qcyJdLCJuYW1lcyI6WyJ0cmFuc2l0aW9uIiwiYm94U2hhZG93IiwiYm94U2l6aW5nIiwiYm9yZGVyUmFkaXVzIiwiYm9yZGVyQ29sb3IiLCJib3JkZXJDb2xvckxpZ2h0IiwibGFiZWxDb2xvciIsImxhYmVsSG92ZXJDb2xvciIsImxhYmVsQ29sb3JMVCIsInRleHRDb2xvciIsInRleHRDb2xvckxUIiwidGl0bGVDb2xvckxUIiwic3VidGV4dENvbG9yIiwic3VidGV4dENvbG9yTFQiLCJ0ZXh0Q29sb3JIbCIsImFjdGl2ZUNvbG9yIiwiYWN0aXZlQ29sb3JIb3ZlciIsImVycm9yQ29sb3IiLCJlcnJvckJnQ29sb3IiLCJwb3NpdGl2ZUNvbG9yIiwicG9zaXRpdmVCZ0NvbG9yIiwicHJpbWFyeUJ0bkJnZCIsInByaW1hcnlCdG5BY3RCZ2QiLCJwcmltYXJ5QnRuQ29sb3IiLCJwcmltYXJ5QnRuQWN0Q29sb3IiLCJwcmltYXJ5QnRuQmdkSG92ZXIiLCJzZWNvbmRhcnlCdG5CZ2QiLCJzZWNvbmRhcnlCdG5BY3RCZ2QiLCJzZWNvbmRhcnlCdG5Db2xvciIsInNlY29uZGFyeUJ0bkFjdENvbG9yIiwic2Vjb25kYXJ5QnRuQmdkSG92ZXIiLCJsaW5rQnRuQmdkIiwibGlua0J0bkFjdEJnZCIsImxpbmtCdG5Db2xvciIsImxpbmtCdG5BY3RDb2xvciIsImxpbmtCdG5BY3RCZ2RIb3ZlciIsInNlbGVjdENvbG9yIiwic2VsZWN0Q29sb3JMVCIsInNlbGVjdEFjdGl2ZUJvcmRlckNvbG9yIiwic2VsZWN0Rm9udFNpemUiLCJzZWxlY3RGb250V2VpZ2h0Iiwic2VsZWN0Rm9udFdlaWdodEJvbGQiLCJzZWxlY3RDb2xvclBsYWNlSG9sZGVyIiwic2VsZWN0QmFja2dyb3VuZCIsInNlbGVjdEJhY2tncm91bmRIb3ZlciIsInNlbGVjdEJhY2tncm91bmRMVCIsInNlbGVjdEJhY2tncm91bmRIb3ZlckxUIiwic2VsZWN0Qm9yZGVyQ29sb3IiLCJzZWxlY3RCb3JkZXJSYWRpdXMiLCJzZWxlY3RCb3JkZXIiLCJkcm9wZG93bkxpc3RIaWdobGlnaHRCZyIsInBhbmVsQmFja2dyb3VuZCIsInBhbmVsQmFja2dyb3VuZExUIiwicGFuZWxBY3RpdmVCZyIsInBhbmVsQm9yZGVyQ29sb3IiLCJwYW5lbEJvcmRlciIsInBhbmVsQm9yZGVyTFQiLCJzaWRlTmF2QmciLCJzaWRlUGFuZWxCZyIsImlucHV0Qm94SGVpZ2h0IiwiaW5wdXRQYWRkaW5nIiwiaW5wdXRGb250U2l6ZSIsImlucHV0Rm9udFdlaWdodCIsIm1hcFBhbmVsQmFja2dyb3VuZENvbG9yIiwibWFwUGFuZWxIZWFkZXJCYWNrZ3JvdW5kQ29sb3IiLCJ0b29sdGlwQmciLCJ0b29sdGlwQ29sb3IiLCJtb2RhbFRpdGxlQ29sb3IiLCJtb2RhbFRpdGxlRm9udFNpemUiLCJtb2RhbEZvb3RlckJnZCIsInRleHRUcnVuY2F0ZSIsIm1heFdpZHRoIiwib3ZlcmZsb3ciLCJ0ZXh0T3ZlcmZsb3ciLCJ3aGl0ZVNwYWNlIiwid29yZFdyYXAiLCJpbnB1dCIsInByb3BzIiwidGhlbWUiLCJhY3RpdmUiLCJlcnJvciIsImRpc2FibGVkIiwiZHJvcGRvd25TY3JvbGxCYXIiLCJkcm9wZG93bkxpc3RBbmNob3IiLCJkcm9wZG93bkxpc3RJdGVtIiwiZHJvcGRvd25MaXN0SGVhZGVyIiwiZHJvcGRvd25MaXN0U2VjdGlvbiIsImRyb3Bkb3duTGlzdCIsInNjcm9sbEJhciIsIm1vZGFsU2Nyb2xsQmFyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFFTyxJQUFNQSxrQ0FBYSxjQUFuQjs7QUFFQSxJQUFNQyxnQ0FBWSw4QkFBbEI7QUFDQSxJQUFNQyxnQ0FBWSxZQUFsQjtBQUNBLElBQU1DLHNDQUFlLEtBQXJCO0FBQ0EsSUFBTUMsb0NBQWMsU0FBcEI7QUFDQSxJQUFNQyw4Q0FBbUIsU0FBekI7O0FBRVA7QUFDTyxJQUFNQyxrQ0FBYSxTQUFu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QUE2RFhGLHNDQTdEVztBQThEWEMsNENBOURXO0FBK0RYRSx3QkEvRFc7QUFnRVhDLDhCQWhFVztBQWlFWEMsNEJBakVXO0FBa0VYQyxrQ0FsRVc7QUFtRVhDLHdDQW5FVzs7QUFxRVg7QUFDQWdDLGtDQXRFVztBQXVFWEMsd0NBdkVXO0FBd0VYQyxnQ0F4RVc7O0FBMEVYWCwwQkExRVc7QUEyRVhqRCxzQkEzRVc7QUE0RVhDLDBCQTVFVztBQTZFWEksMEJBN0VXO0FBOEVYRiw0QkE5RVc7QUErRVhDLGdDQS9FVztBQWdGWHlELDRCQWhGVztBQWlGWDNELDRCQWpGVztBQWtGWFgsd0JBbEZXO0FBbUZYaUUsc0JBbkZXO0FBb0ZYQztBQXBGVyxFQUFOIiwiZmlsZSI6ImJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Nzc30gZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtESU1FTlNJT05TfSBmcm9tIFwiLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3NcIjtcblxuZXhwb3J0IGNvbnN0IHRyYW5zaXRpb24gPSAnYWxsIC40cyBlYXNlJztcblxuZXhwb3J0IGNvbnN0IGJveFNoYWRvdyA9ICcwIDFweCAycHggMCByZ2JhKDAsMCwwLDAuMTApJztcbmV4cG9ydCBjb25zdCBib3hTaXppbmcgPSAnYm9yZGVyLWJveCc7XG5leHBvcnQgY29uc3QgYm9yZGVyUmFkaXVzID0gJzFweCc7XG5leHBvcnQgY29uc3QgYm9yZGVyQ29sb3IgPSAnIzNBNDE0Qyc7XG5leHBvcnQgY29uc3QgYm9yZGVyQ29sb3JMaWdodCA9ICcjRjFGMUYxJztcblxuLy8gVEVYVFxuZXhwb3J0IGNvbnN0IGxhYmVsQ29sb3IgPSAnIzc0NzU3Nic7XG5leHBvcnQgY29uc3QgbGFiZWxIb3ZlckNvbG9yID0gJyNDNkM2QzYnO1xuZXhwb3J0IGNvbnN0IGxhYmVsQ29sb3JMVCA9ICcjNkE3NDg1JztcblxuZXhwb3J0IGNvbnN0IHRleHRDb2xvciA9ICcjQTBBN0I0JztcbmV4cG9ydCBjb25zdCB0ZXh0Q29sb3JMVCA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCB0aXRsZUNvbG9yTFQgPSAnIzI5MzIzQyc7XG5cbmV4cG9ydCBjb25zdCBzdWJ0ZXh0Q29sb3IgPSAnIzZBNzQ4NSc7XG5leHBvcnQgY29uc3Qgc3VidGV4dENvbG9yTFQgPSAnI0EwQTdCNCc7XG5cbmV4cG9ydCBjb25zdCB0ZXh0Q29sb3JIbCA9ICcjRDNEOEUwJztcbmV4cG9ydCBjb25zdCBhY3RpdmVDb2xvciA9ICcjMTE5MzlBJztcbmV4cG9ydCBjb25zdCBhY3RpdmVDb2xvckhvdmVyID0gJyMxMDgxODgnO1xuZXhwb3J0IGNvbnN0IGVycm9yQ29sb3IgPSAnI0NBM0IyNyc7XG5leHBvcnQgY29uc3QgZXJyb3JCZ0NvbG9yID0gJyNGRUVGRUInO1xuZXhwb3J0IGNvbnN0IHBvc2l0aXZlQ29sb3IgPSAnIzYyOUE0MSc7XG5leHBvcnQgY29uc3QgcG9zaXRpdmVCZ0NvbG9yID0gJyNGM0Y5RUQnO1xuXG4vLyBCdXR0b25cbmV4cG9ydCBjb25zdCBwcmltYXJ5QnRuQmdkID0gJyMwRjk2NjgnO1xuZXhwb3J0IGNvbnN0IHByaW1hcnlCdG5BY3RCZ2QgPSAnIzEzQjE3Qic7XG5leHBvcnQgY29uc3QgcHJpbWFyeUJ0bkNvbG9yID0gJyNGRkZGRkYnO1xuZXhwb3J0IGNvbnN0IHByaW1hcnlCdG5BY3RDb2xvciA9ICcjRkZGRkZGJztcbmV4cG9ydCBjb25zdCBwcmltYXJ5QnRuQmdkSG92ZXIgPSAnIzEzQjE3Qic7XG5cbmV4cG9ydCBjb25zdCBzZWNvbmRhcnlCdG5CZ2QgPSAnIzZBNzQ4NSc7XG5leHBvcnQgY29uc3Qgc2Vjb25kYXJ5QnRuQWN0QmdkID0gJyNBMEE3QjQnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUJ0bkNvbG9yID0gJyNGRkZGRkYnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUJ0bkFjdENvbG9yID0gJyNGRkZGRkYnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUJ0bkJnZEhvdmVyID0gJyNBMEE3QjQnO1xuXG5leHBvcnQgY29uc3QgbGlua0J0bkJnZCA9ICd0cmFuc3BhcmVudCc7XG5leHBvcnQgY29uc3QgbGlua0J0bkFjdEJnZCA9IGxpbmtCdG5CZ2Q7XG5leHBvcnQgY29uc3QgbGlua0J0bkNvbG9yID0gJyNBMEE3QjQnO1xuZXhwb3J0IGNvbnN0IGxpbmtCdG5BY3RDb2xvciA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBsaW5rQnRuQWN0QmdkSG92ZXIgPSBsaW5rQnRuQmdkO1xuXG5leHBvcnQgY29uc3Qgc2VsZWN0Q29sb3IgPSB0ZXh0Q29sb3I7XG5leHBvcnQgY29uc3Qgc2VsZWN0Q29sb3JMVCA9IHRpdGxlQ29sb3JMVDtcblxuZXhwb3J0IGNvbnN0IHNlbGVjdEFjdGl2ZUJvcmRlckNvbG9yID0gJyNBMEE3QjQnO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEZvbnRTaXplID0gJzExcHgnO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEZvbnRXZWlnaHQgPSAnNDAwJztcbmV4cG9ydCBjb25zdCBzZWxlY3RGb250V2VpZ2h0Qm9sZCA9ICc1MDAnO1xuXG5leHBvcnQgY29uc3Qgc2VsZWN0Q29sb3JQbGFjZUhvbGRlciA9ICcjNzQ3NTc2JztcbmV4cG9ydCBjb25zdCBzZWxlY3RCYWNrZ3JvdW5kID0gJyM0OTQ5NDknO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEJhY2tncm91bmRIb3ZlciA9ICcjM0UzRTNFJztcbmV4cG9ydCBjb25zdCBzZWxlY3RCYWNrZ3JvdW5kTFQgPSAnI0ZGRkZGRic7XG5leHBvcnQgY29uc3Qgc2VsZWN0QmFja2dyb3VuZEhvdmVyTFQgPSAnI0Y4RjhGOSc7XG5leHBvcnQgY29uc3Qgc2VsZWN0Qm9yZGVyQ29sb3IgPSAnIzcxNzE3MSc7XG5leHBvcnQgY29uc3Qgc2VsZWN0Qm9yZGVyUmFkaXVzID0gJzFweCc7XG5leHBvcnQgY29uc3Qgc2VsZWN0Qm9yZGVyID0gMDtcblxuZXhwb3J0IGNvbnN0IGRyb3Bkb3duTGlzdEhpZ2hsaWdodEJnID0gJyM3MTcxNzEnO1xuXG5leHBvcnQgY29uc3QgcGFuZWxCYWNrZ3JvdW5kID0gJyMyRTJFMkYnO1xuZXhwb3J0IGNvbnN0IHBhbmVsQmFja2dyb3VuZExUID0gJyNmOGY4ZjknO1xuXG5leHBvcnQgY29uc3QgcGFuZWxBY3RpdmVCZyA9ICcjMzMzMzM0JztcbmV4cG9ydCBjb25zdCBwYW5lbEJvcmRlckNvbG9yID0gJyMzQTQxNEMnO1xuZXhwb3J0IGNvbnN0IHBhbmVsQm9yZGVyID0gYDFweCBzb2xpZCAke2JvcmRlckNvbG9yfWA7XG5leHBvcnQgY29uc3QgcGFuZWxCb3JkZXJMVCA9IGAxcHggc29saWQgJHtib3JkZXJDb2xvckxpZ2h0fWA7XG5cbmV4cG9ydCBjb25zdCBzaWRlTmF2QmcgPSAnIzI5MjkyQSc7XG5leHBvcnQgY29uc3Qgc2lkZVBhbmVsQmcgPSAnIzIzMjMyNCc7XG5cbmV4cG9ydCBjb25zdCBpbnB1dEJveEhlaWdodCA9ICcyOHB4JztcbmV4cG9ydCBjb25zdCBpbnB1dFBhZGRpbmcgPSAnNHB4IDEwcHgnO1xuZXhwb3J0IGNvbnN0IGlucHV0Rm9udFNpemUgPSAnMTJweCc7XG5leHBvcnQgY29uc3QgaW5wdXRGb250V2VpZ2h0ID0gNTAwO1xuXG5leHBvcnQgY29uc3QgbWFwUGFuZWxCYWNrZ3JvdW5kQ29sb3IgPSAnIzI0MjczMCc7XG5leHBvcnQgY29uc3QgbWFwUGFuZWxIZWFkZXJCYWNrZ3JvdW5kQ29sb3IgPSAnIzI5MzIzQyc7XG5leHBvcnQgY29uc3QgdG9vbHRpcEJnID0gJyNGOEY4RjknO1xuZXhwb3J0IGNvbnN0IHRvb2x0aXBDb2xvciA9ICcjMzMzMzM0JztcblxuLy8gTW9kYWxcbmV4cG9ydCBjb25zdCBtb2RhbFRpdGxlQ29sb3IgPSAnIzNBNDE0Qyc7XG5leHBvcnQgY29uc3QgbW9kYWxUaXRsZUZvbnRTaXplID0gJzMycHgnO1xuZXhwb3J0IGNvbnN0IG1vZGFsRm9vdGVyQmdkID0gJyNGOEY4RjknO1xuXG5leHBvcnQgY29uc3QgdGV4dFRydW5jYXRlID0ge1xuICBtYXhXaWR0aDogJzEwMCUnLFxuICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJyxcbiAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gIHdvcmRXcmFwOiAnbm9ybWFsJ1xufTtcblxuLy8gdGhlbWUgaXMgcGFzc2VkIHRvIGtlcGxlci5nbCB3aGVuIGl0J3MgbW91bnRlZCxcbi8vIGl0IGlzIHVzZWQgYnkgc3R5bGVkLWNvbXBvbmVudHMgdG8gcGFzcyBhbG9uZyB0b1xuLy8gYWxsIGNoaWxkIGNvbXBvbmVudHNcbmNvbnN0IGlucHV0ID0gY3NzYFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdEJhY2tncm91bmR9O1xuICBib3JkZXI6IDFweCBzb2xpZFxuICAgICR7cHJvcHMgPT5cbiAgICAgIHByb3BzLmFjdGl2ZVxuICAgICAgICA/IHByb3BzLnRoZW1lLnNlbGVjdEFjdGl2ZUJvcmRlckNvbG9yXG4gICAgICAgIDogcHJvcHMuZXJyb3JcbiAgICAgICAgICA/IHByb3BzLnRoZW1lLmVycm9yQ29sb3JcbiAgICAgICAgICA6IHByb3BzLnRoZW1lLnNlbGVjdEJhY2tncm91bmR9O1xuICBjYXJldC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3RBY3RpdmVCb3JkZXJDb2xvcn07XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdENvbG9yfTtcbiAgZGlzcGxheTogZmxleDtcbiAgZm9udC1zaXplOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0Rm9udFNpemV9O1xuICBmb250LXdlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dEZvbnRXZWlnaHR9O1xuICBoZWlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRCb3hIZWlnaHR9O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIG91dGxpbmU6IG5vbmU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHBhZGRpbmc6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRQYWRkaW5nfTtcbiAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gIHRyYW5zaXRpb246ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudHJhbnNpdGlvbn07XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gIHdpZHRoOiAxMDAlO1xuICB3b3JkLXdyYXA6IG5vcm1hbDtcbiAgcG9pbnRlci1ldmVudHM6ICR7cHJvcHMgPT4gcHJvcHMuZGlzYWJsZWQgPyAnbm9uZScgOiAnYWxsJ307XG4gIG9wYWNpdHk6ICR7cHJvcHMgPT4gcHJvcHMuZGlzYWJsZWQgPyAwLjUgOiAxfTtcbiAgXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2VsZWN0QmFja2dyb3VuZEhvdmVyfTtcbiAgfVxuYDtcblxuY29uc3QgZHJvcGRvd25TY3JvbGxCYXIgPSBjc3NgXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgIGhlaWdodDogMTBweDtcbiAgICB3aWR0aDogMTBweDtcbiAgfVxuICBcbiAgOjotd2Via2l0LXNjcm9sbGJhci1jb3JuZXIge1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2VsZWN0QmFja2dyb3VuZH07XG4gIH1cbiAgXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2VsZWN0QmFja2dyb3VuZH07XG4gIH1cbiAgXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yfTtcbiAgICBib3JkZXI6IDNweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdEJhY2tncm91bmR9O1xuICB9O1xuICBcbiAgOnZlcnRpY2FsOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdEJhY2tncm91bmRIb3Zlcn07XG4gIH1cbn1gO1xuXG5jb25zdCBkcm9wZG93bkxpc3RBbmNob3IgPSBjc3NgXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdENvbG9yfTtcbiAgcGFkZGluZy1sZWZ0OiAzcHg7XG5gO1xuXG5jb25zdCBkcm9wZG93bkxpc3RJdGVtID0gY3NzYFxuICBmb250LXNpemU6IDExcHg7XG4gIHBhZGRpbmc6IDVweCA5cHg7XG5cbiAgJi5ob3ZlcixcbiAgJjpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0SGlnaGxpZ2h0Qmd9O1xuICB9XG5gO1xuXG5jb25zdCBkcm9wZG93bkxpc3RIZWFkZXIgPSBjc3NgXG4gIGZvbnQtc2l6ZTogMTFweDtcbiAgcGFkZGluZzogNXB4IDlweDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG5gO1xuXG5jb25zdCBkcm9wZG93bkxpc3RTZWN0aW9uID0gY3NzYFxuICBwYWRkaW5nOiAwIDAgNHB4IDA7XG4gIG1hcmdpbi1ib3R0b206IDRweDtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG5gO1xuXG5jb25zdCBkcm9wZG93bkxpc3QgPSBjc3NgXG4gIG92ZXJmbG93LXk6IG92ZXJsYXk7XG4gIG1heC1oZWlnaHQ6IDI4MHB4O1xuICBcbiAgLmxpc3RfX3NlY3Rpb24ge1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0U2VjdGlvbn1cbiAgfVxuICAubGlzdF9faGVhZGVyIHtcbiAgICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEhlYWRlcn1cbiAgfVxuICBcbiAgLmxpc3RfX2l0ZW0ge1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0SXRlbX1cbiAgfVxuICBcbiAgLmxpc3RfX2l0ZW1fX2FuY2hvciB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RBbmNob3J9XG4gIH1cbiAgXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25TY3JvbGxCYXJ9O1xuYDtcblxuY29uc3Qgc2Nyb2xsQmFyID0gY3NzYFxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICB3aWR0aDogMTRweDtcbiAgfVxuICBcbiAgOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWxCZ307XG4gIH1cbiAgXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmR9O1xuICAgIGJvcmRlcjogM3B4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsQmd9XG5cbiAgICAnOnZlcnRpY2FsJzoge1xuICAgICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmR9O1xuICAgIH0sXG5cbiAgICAnOnZlcnRpY2FsOmhvdmVyJzoge1xuICAgICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3RCYWNrZ3JvdW5kSG92ZXJ9O1xuICAgIH1cbiAgfVxufWA7XG5cbmV4cG9ydCBjb25zdCBtb2RhbFNjcm9sbEJhciA9IGNzc2BcbiAgOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgd2lkdGg6IDE0cHg7XG4gICAgaGVpZ2h0OiAxNnB4O1xuICB9XG5cbiAgOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gICAgYmFja2dyb3VuZDogd2hpdGU7XG4gIH1cbiAgOjotd2Via2l0LXNjcm9sbGJhci10cmFjazpob3Jpem9udGFsIHtcbiAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgfVxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3JMVH07XG4gICAgYm9yZGVyOiA0cHggc29saWQgd2hpdGVcbiAgfVxuXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItY29ybmVyIHtcbiAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgfVxuXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWI6aG92ZXIge1xuICAgIGJhY2tncm91bmQ6ICM5NjlEQTk7XG4gIH1cblxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOnZlcnRpY2FsIHtcbiAgICBib3JkZXItcmFkaXVzOiA3cHg7XG4gIH1cblxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOmhvcml6b250YWwge1xuICAgIGJvcmRlci1yYWRpdXM6IDlweDtcbiAgICBib3JkZXI6IDRweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgfVxuYDtcblxuZXhwb3J0IGNvbnN0IHRoZW1lID0ge1xuICAuLi5ESU1FTlNJT05TLFxuICAvLyB0ZW1wbGF0ZXNcbiAgaW5wdXQsXG4gIGRyb3Bkb3duU2Nyb2xsQmFyLFxuICBkcm9wZG93bkxpc3QsXG4gIGRyb3Bkb3duTGlzdEl0ZW0sXG4gIGRyb3Bkb3duTGlzdEFuY2hvcixcbiAgZHJvcGRvd25MaXN0SGVhZGVyLFxuICBkcm9wZG93bkxpc3RTZWN0aW9uLFxuICBtb2RhbFNjcm9sbEJhcixcbiAgc2Nyb2xsQmFyLFxuXG4gIC8vIHN0eWxlc1xuICBhY3RpdmVDb2xvcixcbiAgYWN0aXZlQ29sb3JIb3ZlcixcbiAgYm9yZGVyUmFkaXVzLFxuICBib3hTaGFkb3csXG4gIGVycm9yQ29sb3IsXG4gIGRyb3Bkb3duTGlzdEhpZ2hsaWdodEJnLFxuICBpbnB1dEJveEhlaWdodCxcbiAgaW5wdXRQYWRkaW5nLFxuICBpbnB1dEZvbnRTaXplLFxuICBpbnB1dEZvbnRXZWlnaHQsXG4gIGxhYmVsQ29sb3IsXG4gIGxhYmVsQ29sb3JMVCxcbiAgbGFiZWxIb3ZlckNvbG9yLFxuICBtYXBQYW5lbEJhY2tncm91bmRDb2xvcixcbiAgbWFwUGFuZWxIZWFkZXJCYWNrZ3JvdW5kQ29sb3IsXG5cbiAgLy8gUGFuZWxcbiAgcGFuZWxBY3RpdmVCZyxcbiAgcGFuZWxCYWNrZ3JvdW5kLFxuICBwYW5lbEJhY2tncm91bmRMVCxcbiAgcGFuZWxCb3JkZXIsXG4gIHBhbmVsQm9yZGVyQ29sb3IsXG4gIHBhbmVsQm9yZGVyTFQsXG5cbiAgLy8gU2VsZWN0XG4gIHNlbGVjdEFjdGl2ZUJvcmRlckNvbG9yLFxuICBzZWxlY3RCYWNrZ3JvdW5kLFxuICBzZWxlY3RCYWNrZ3JvdW5kTFQsXG4gIHNlbGVjdEJhY2tncm91bmRIb3ZlcixcbiAgc2VsZWN0QmFja2dyb3VuZEhvdmVyTFQsXG4gIHNlbGVjdEJvcmRlcixcbiAgc2VsZWN0Qm9yZGVyUmFkaXVzLFxuICBzZWxlY3RDb2xvcixcbiAgc2VsZWN0Q29sb3JQbGFjZUhvbGRlcixcbiAgc2VsZWN0Rm9udFNpemUsXG4gIHNlbGVjdEZvbnRXZWlnaHQsXG4gIHNlbGVjdENvbG9yTFQsXG5cbiAgLy8gQnV0dG9uXG4gIHByaW1hcnlCdG5CZ2QsXG4gIHByaW1hcnlCdG5BY3RCZ2QsXG4gIHByaW1hcnlCdG5Db2xvcixcbiAgcHJpbWFyeUJ0bkFjdENvbG9yLFxuICBwcmltYXJ5QnRuQmdkSG92ZXIsXG4gIHNlY29uZGFyeUJ0bkJnZCxcbiAgc2Vjb25kYXJ5QnRuQWN0QmdkLFxuICBzZWNvbmRhcnlCdG5CZ2RIb3ZlcixcbiAgc2Vjb25kYXJ5QnRuQ29sb3IsXG4gIHNlY29uZGFyeUJ0bkFjdENvbG9yLFxuICBsaW5rQnRuQmdkLFxuICBsaW5rQnRuQWN0QmdkLFxuICBsaW5rQnRuQ29sb3IsXG4gIGxpbmtCdG5BY3RDb2xvcixcbiAgbGlua0J0bkFjdEJnZEhvdmVyLFxuXG4gIC8vIE1vZGFsXG4gIG1vZGFsVGl0bGVDb2xvcixcbiAgbW9kYWxUaXRsZUZvbnRTaXplLFxuICBtb2RhbEZvb3RlckJnZCxcblxuICBzaWRlUGFuZWxCZyxcbiAgdGV4dENvbG9yLFxuICB0ZXh0Q29sb3JMVCxcbiAgdGV4dENvbG9ySGwsXG4gIHN1YnRleHRDb2xvcixcbiAgc3VidGV4dENvbG9yTFQsXG4gIHRleHRUcnVuY2F0ZSxcbiAgdGl0bGVDb2xvckxULFxuICB0cmFuc2l0aW9uLFxuICB0b29sdGlwQmcsXG4gIHRvb2x0aXBDb2xvclxufTtcbiJdfQ==