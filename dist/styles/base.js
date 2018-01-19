'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.theme = exports.modalScrollBar = exports.textTruncate = exports.modalFooterBgd = exports.modalTitleFontSize = exports.modalTitleColor = exports.tooltipColor = exports.tooltipBg = exports.mapPanelHeaderBackgroundColor = exports.mapPanelBackgroundColor = exports.inputFontWeight = exports.inputFontSize = exports.inputPadding = exports.inputBoxHeight = exports.sidePanelBg = exports.sideNavBg = exports.panelBorderLT = exports.panelBorder = exports.panelBorderColor = exports.panelActiveBg = exports.panelBackgroundLT = exports.panelBackground = exports.dropdownListHighlightBg = exports.selectBorder = exports.selectBorderRadius = exports.selectBorderColor = exports.selectBackgroundHoverLT = exports.selectBackgroundLT = exports.selectBackgroundHover = exports.selectBackground = exports.selectColorPlaceHolder = exports.selectFontWeightBold = exports.selectFontWeight = exports.selectFontSize = exports.selectActiveBorderColor = exports.selectColorLT = exports.selectColor = exports.linkBtnActBgdHover = exports.linkBtnActColor = exports.linkBtnColor = exports.linkBtnActBgd = exports.linkBtnBgd = exports.secondaryBtnBgdHover = exports.secondaryBtnActColor = exports.secondaryBtnColor = exports.secondaryBtnActBgd = exports.secondaryBtnBgd = exports.primaryBtnBgdHover = exports.primaryBtnActColor = exports.primaryBtnColor = exports.primaryBtnActBgd = exports.primaryBtnBgd = exports.positiveBgColor = exports.positiveColor = exports.errorBgColor = exports.errorColor = exports.activeColorHover = exports.activeColor = exports.textColorHl = exports.subtextColorLT = exports.subtextColor = exports.titleColorLT = exports.textColorLT = exports.textColor = exports.labelColorLT = exports.labelHoverColor = exports.labelColor = exports.borderColorLight = exports.borderColor = exports.borderRadius = exports.boxSizing = exports.boxShadow = exports.transition = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  align-items: center;\n  background-color: ', ';\n  border: 1px solid\n    ', ';\n  caret-color: ', ';\n  color: ', ';\n  display: flex;\n  font-size: ', ';\n  font-weight: ', ';\n  height: ', ';\n  justify-content: space-between;\n  outline: none;\n  overflow: hidden;\n  padding: ', ';\n  text-overflow: ellipsis;\n  transition: ', ';\n  white-space: nowrap;\n  width: 100%;\n  word-wrap: normal;\n  pointer-events: ', ';\n  opacity: ', ';\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n'], ['\n  align-items: center;\n  background-color: ', ';\n  border: 1px solid\n    ', ';\n  caret-color: ', ';\n  color: ', ';\n  display: flex;\n  font-size: ', ';\n  font-weight: ', ';\n  height: ', ';\n  justify-content: space-between;\n  outline: none;\n  overflow: hidden;\n  padding: ', ';\n  text-overflow: ellipsis;\n  transition: ', ';\n  white-space: nowrap;\n  width: 100%;\n  word-wrap: normal;\n  pointer-events: ', ';\n  opacity: ', ';\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ::-webkit-scrollbar {\n    height: 10px;\n    width: 10px;\n  }\n  \n  ::-webkit-scrollbar-corner {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-track {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ', ';\n    border: 3px solid ', ';\n  };\n  \n  :vertical:hover {\n    background: ', ';\n  }\n}'], ['\n  ::-webkit-scrollbar {\n    height: 10px;\n    width: 10px;\n  }\n  \n  ::-webkit-scrollbar-corner {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-track {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ', ';\n    border: 3px solid ', ';\n  };\n  \n  :vertical:hover {\n    background: ', ';\n  }\n}']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n  padding-left: 3px;\n'], ['\n  color: ', ';\n  padding-left: 3px;\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  font-size: 11px;\n  padding: 5px 9px;\n\n  &.hover,\n  &:hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n'], ['\n  font-size: 11px;\n  padding: 5px 9px;\n\n  &.hover,\n  &:hover {\n    cursor: pointer;\n    background-color: ', ';\n  }\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n  font-size: 11px;\n  padding: 5px 9px;\n  color: ', ';\n'], ['\n  font-size: 11px;\n  padding: 5px 9px;\n  color: ', ';\n']),
    _templateObject6 = (0, _taggedTemplateLiteralLoose3.default)(['\n  padding: 0 0 4px 0;\n  margin-bottom: 4px;\n  border-bottom: 1px solid ', ';\n'], ['\n  padding: 0 0 4px 0;\n  margin-bottom: 4px;\n  border-bottom: 1px solid ', ';\n']),
    _templateObject7 = (0, _taggedTemplateLiteralLoose3.default)(['\n  overflow-y: overlay;\n  max-height: 280px;\n\n  .list__section {\n    ', ';\n  }\n  .list__header {\n    ', ';\n  }\n\n  .list__item {\n    ', ';\n  }\n\n  .list__item__anchor {\n    ', ';\n  }\n\n  ', ';\n'], ['\n  overflow-y: overlay;\n  max-height: 280px;\n\n  .list__section {\n    ', ';\n  }\n  .list__header {\n    ', ';\n  }\n\n  .list__item {\n    ', ';\n  }\n\n  .list__item__anchor {\n    ', ';\n  }\n\n  ', ';\n']),
    _templateObject8 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ::-webkit-scrollbar {\n    width: 14px;\n  }\n  \n  ::-webkit-scrollbar-track {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ', ';\n    border: 3px solid ', '\n\n    \':vertical\': {\n      background: ', ';\n    },\n\n    \':vertical:hover\': {\n      background: ', ';\n    }\n  }\n}'], ['\n  ::-webkit-scrollbar {\n    width: 14px;\n  }\n  \n  ::-webkit-scrollbar-track {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ', ';\n    border: 3px solid ', '\n\n    \':vertical\': {\n      background: ', ';\n    },\n\n    \':vertical:hover\': {\n      background: ', ';\n    }\n  }\n}']),
    _templateObject9 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ::-webkit-scrollbar {\n    width: 14px;\n    height: 16px;\n  }\n\n  ::-webkit-scrollbar-track {\n    background: white;\n  }\n  ::-webkit-scrollbar-track:horizontal {\n    background: ', ';\n  }\n  ::-webkit-scrollbar-thumb {\n    background: ', ';\n    border: 4px solid white;\n  }\n\n  ::-webkit-scrollbar-corner {\n    background: ', ';\n  }\n\n  ::-webkit-scrollbar-thumb:hover {\n    background: #969da9;\n  }\n\n  ::-webkit-scrollbar-thumb:vertical {\n    border-radius: 7px;\n  }\n\n  ::-webkit-scrollbar-thumb:horizontal {\n    border-radius: 9px;\n    border: 4px solid ', ';\n  }\n'], ['\n  ::-webkit-scrollbar {\n    width: 14px;\n    height: 16px;\n  }\n\n  ::-webkit-scrollbar-track {\n    background: white;\n  }\n  ::-webkit-scrollbar-track:horizontal {\n    background: ', ';\n  }\n  ::-webkit-scrollbar-thumb {\n    background: ', ';\n    border: 4px solid white;\n  }\n\n  ::-webkit-scrollbar-corner {\n    background: ', ';\n  }\n\n  ::-webkit-scrollbar-thumb:hover {\n    background: #969da9;\n  }\n\n  ::-webkit-scrollbar-thumb:vertical {\n    border-radius: 7px;\n  }\n\n  ::-webkit-scrollbar-thumb:horizontal {\n    border-radius: 9px;\n    border: 4px solid ', ';\n  }\n']);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHlsZXMvYmFzZS5qcyJdLCJuYW1lcyI6WyJ0cmFuc2l0aW9uIiwiYm94U2hhZG93IiwiYm94U2l6aW5nIiwiYm9yZGVyUmFkaXVzIiwiYm9yZGVyQ29sb3IiLCJib3JkZXJDb2xvckxpZ2h0IiwibGFiZWxDb2xvciIsImxhYmVsSG92ZXJDb2xvciIsImxhYmVsQ29sb3JMVCIsInRleHRDb2xvciIsInRleHRDb2xvckxUIiwidGl0bGVDb2xvckxUIiwic3VidGV4dENvbG9yIiwic3VidGV4dENvbG9yTFQiLCJ0ZXh0Q29sb3JIbCIsImFjdGl2ZUNvbG9yIiwiYWN0aXZlQ29sb3JIb3ZlciIsImVycm9yQ29sb3IiLCJlcnJvckJnQ29sb3IiLCJwb3NpdGl2ZUNvbG9yIiwicG9zaXRpdmVCZ0NvbG9yIiwicHJpbWFyeUJ0bkJnZCIsInByaW1hcnlCdG5BY3RCZ2QiLCJwcmltYXJ5QnRuQ29sb3IiLCJwcmltYXJ5QnRuQWN0Q29sb3IiLCJwcmltYXJ5QnRuQmdkSG92ZXIiLCJzZWNvbmRhcnlCdG5CZ2QiLCJzZWNvbmRhcnlCdG5BY3RCZ2QiLCJzZWNvbmRhcnlCdG5Db2xvciIsInNlY29uZGFyeUJ0bkFjdENvbG9yIiwic2Vjb25kYXJ5QnRuQmdkSG92ZXIiLCJsaW5rQnRuQmdkIiwibGlua0J0bkFjdEJnZCIsImxpbmtCdG5Db2xvciIsImxpbmtCdG5BY3RDb2xvciIsImxpbmtCdG5BY3RCZ2RIb3ZlciIsInNlbGVjdENvbG9yIiwic2VsZWN0Q29sb3JMVCIsInNlbGVjdEFjdGl2ZUJvcmRlckNvbG9yIiwic2VsZWN0Rm9udFNpemUiLCJzZWxlY3RGb250V2VpZ2h0Iiwic2VsZWN0Rm9udFdlaWdodEJvbGQiLCJzZWxlY3RDb2xvclBsYWNlSG9sZGVyIiwic2VsZWN0QmFja2dyb3VuZCIsInNlbGVjdEJhY2tncm91bmRIb3ZlciIsInNlbGVjdEJhY2tncm91bmRMVCIsInNlbGVjdEJhY2tncm91bmRIb3ZlckxUIiwic2VsZWN0Qm9yZGVyQ29sb3IiLCJzZWxlY3RCb3JkZXJSYWRpdXMiLCJzZWxlY3RCb3JkZXIiLCJkcm9wZG93bkxpc3RIaWdobGlnaHRCZyIsInBhbmVsQmFja2dyb3VuZCIsInBhbmVsQmFja2dyb3VuZExUIiwicGFuZWxBY3RpdmVCZyIsInBhbmVsQm9yZGVyQ29sb3IiLCJwYW5lbEJvcmRlciIsInBhbmVsQm9yZGVyTFQiLCJzaWRlTmF2QmciLCJzaWRlUGFuZWxCZyIsImlucHV0Qm94SGVpZ2h0IiwiaW5wdXRQYWRkaW5nIiwiaW5wdXRGb250U2l6ZSIsImlucHV0Rm9udFdlaWdodCIsIm1hcFBhbmVsQmFja2dyb3VuZENvbG9yIiwibWFwUGFuZWxIZWFkZXJCYWNrZ3JvdW5kQ29sb3IiLCJ0b29sdGlwQmciLCJ0b29sdGlwQ29sb3IiLCJtb2RhbFRpdGxlQ29sb3IiLCJtb2RhbFRpdGxlRm9udFNpemUiLCJtb2RhbEZvb3RlckJnZCIsInRleHRUcnVuY2F0ZSIsIm1heFdpZHRoIiwib3ZlcmZsb3ciLCJ0ZXh0T3ZlcmZsb3ciLCJ3aGl0ZVNwYWNlIiwid29yZFdyYXAiLCJpbnB1dCIsInByb3BzIiwidGhlbWUiLCJhY3RpdmUiLCJlcnJvciIsImRpc2FibGVkIiwiZHJvcGRvd25TY3JvbGxCYXIiLCJkcm9wZG93bkxpc3RBbmNob3IiLCJkcm9wZG93bkxpc3RJdGVtIiwiZHJvcGRvd25MaXN0SGVhZGVyIiwiZHJvcGRvd25MaXN0U2VjdGlvbiIsImRyb3Bkb3duTGlzdCIsInNjcm9sbEJhciIsIm1vZGFsU2Nyb2xsQmFyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFFTyxJQUFNQSxrQ0FBYSxjQUFuQjs7QUFFQSxJQUFNQyxnQ0FBWSw4QkFBbEI7QUFDQSxJQUFNQyxnQ0FBWSxZQUFsQjtBQUNBLElBQU1DLHNDQUFlLEtBQXJCO0FBQ0EsSUFBTUMsb0NBQWMsU0FBcEI7QUFDQSxJQUFNQyw4Q0FBbUIsU0FBekI7O0FBRVA7QUFDTyxJQUFNQyxrQ0FBYSxTQUFu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VztBQTZEWEYsc0NBN0RXO0FBOERYQyw0Q0E5RFc7QUErRFhFLHdCQS9EVztBQWdFWEMsOEJBaEVXO0FBaUVYQyw0QkFqRVc7QUFrRVhDLGtDQWxFVztBQW1FWEMsd0NBbkVXOztBQXFFWDtBQUNBZ0Msa0NBdEVXO0FBdUVYQyx3Q0F2RVc7QUF3RVhDLGdDQXhFVzs7QUEwRVhYLDBCQTFFVztBQTJFWGpELHNCQTNFVztBQTRFWEMsMEJBNUVXO0FBNkVYSSwwQkE3RVc7QUE4RVhGLDRCQTlFVztBQStFWEMsZ0NBL0VXO0FBZ0ZYeUQsNEJBaEZXO0FBaUZYM0QsNEJBakZXO0FBa0ZYWCx3QkFsRlc7QUFtRlhpRSxzQkFuRlc7QUFvRlhDO0FBcEZXLEVBQU4iLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y3NzfSBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0RJTUVOU0lPTlN9IGZyb20gJy4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuZXhwb3J0IGNvbnN0IHRyYW5zaXRpb24gPSAnYWxsIC40cyBlYXNlJztcblxuZXhwb3J0IGNvbnN0IGJveFNoYWRvdyA9ICcwIDFweCAycHggMCByZ2JhKDAsMCwwLDAuMTApJztcbmV4cG9ydCBjb25zdCBib3hTaXppbmcgPSAnYm9yZGVyLWJveCc7XG5leHBvcnQgY29uc3QgYm9yZGVyUmFkaXVzID0gJzFweCc7XG5leHBvcnQgY29uc3QgYm9yZGVyQ29sb3IgPSAnIzNBNDE0Qyc7XG5leHBvcnQgY29uc3QgYm9yZGVyQ29sb3JMaWdodCA9ICcjRjFGMUYxJztcblxuLy8gVEVYVFxuZXhwb3J0IGNvbnN0IGxhYmVsQ29sb3IgPSAnIzc0NzU3Nic7XG5leHBvcnQgY29uc3QgbGFiZWxIb3ZlckNvbG9yID0gJyNDNkM2QzYnO1xuZXhwb3J0IGNvbnN0IGxhYmVsQ29sb3JMVCA9ICcjNkE3NDg1JztcblxuZXhwb3J0IGNvbnN0IHRleHRDb2xvciA9ICcjQTBBN0I0JztcbmV4cG9ydCBjb25zdCB0ZXh0Q29sb3JMVCA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCB0aXRsZUNvbG9yTFQgPSAnIzI5MzIzQyc7XG5cbmV4cG9ydCBjb25zdCBzdWJ0ZXh0Q29sb3IgPSAnIzZBNzQ4NSc7XG5leHBvcnQgY29uc3Qgc3VidGV4dENvbG9yTFQgPSAnI0EwQTdCNCc7XG5cbmV4cG9ydCBjb25zdCB0ZXh0Q29sb3JIbCA9ICcjRDNEOEUwJztcbmV4cG9ydCBjb25zdCBhY3RpdmVDb2xvciA9ICcjMTE5MzlBJztcbmV4cG9ydCBjb25zdCBhY3RpdmVDb2xvckhvdmVyID0gJyMxMDgxODgnO1xuZXhwb3J0IGNvbnN0IGVycm9yQ29sb3IgPSAnI0NBM0IyNyc7XG5leHBvcnQgY29uc3QgZXJyb3JCZ0NvbG9yID0gJyNGRUVGRUInO1xuZXhwb3J0IGNvbnN0IHBvc2l0aXZlQ29sb3IgPSAnIzYyOUE0MSc7XG5leHBvcnQgY29uc3QgcG9zaXRpdmVCZ0NvbG9yID0gJyNGM0Y5RUQnO1xuXG4vLyBCdXR0b25cbmV4cG9ydCBjb25zdCBwcmltYXJ5QnRuQmdkID0gJyMwRjk2NjgnO1xuZXhwb3J0IGNvbnN0IHByaW1hcnlCdG5BY3RCZ2QgPSAnIzEzQjE3Qic7XG5leHBvcnQgY29uc3QgcHJpbWFyeUJ0bkNvbG9yID0gJyNGRkZGRkYnO1xuZXhwb3J0IGNvbnN0IHByaW1hcnlCdG5BY3RDb2xvciA9ICcjRkZGRkZGJztcbmV4cG9ydCBjb25zdCBwcmltYXJ5QnRuQmdkSG92ZXIgPSAnIzEzQjE3Qic7XG5cbmV4cG9ydCBjb25zdCBzZWNvbmRhcnlCdG5CZ2QgPSAnIzZBNzQ4NSc7XG5leHBvcnQgY29uc3Qgc2Vjb25kYXJ5QnRuQWN0QmdkID0gJyNBMEE3QjQnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUJ0bkNvbG9yID0gJyNGRkZGRkYnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUJ0bkFjdENvbG9yID0gJyNGRkZGRkYnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUJ0bkJnZEhvdmVyID0gJyNBMEE3QjQnO1xuXG5leHBvcnQgY29uc3QgbGlua0J0bkJnZCA9ICd0cmFuc3BhcmVudCc7XG5leHBvcnQgY29uc3QgbGlua0J0bkFjdEJnZCA9IGxpbmtCdG5CZ2Q7XG5leHBvcnQgY29uc3QgbGlua0J0bkNvbG9yID0gJyNBMEE3QjQnO1xuZXhwb3J0IGNvbnN0IGxpbmtCdG5BY3RDb2xvciA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBsaW5rQnRuQWN0QmdkSG92ZXIgPSBsaW5rQnRuQmdkO1xuXG5leHBvcnQgY29uc3Qgc2VsZWN0Q29sb3IgPSB0ZXh0Q29sb3I7XG5leHBvcnQgY29uc3Qgc2VsZWN0Q29sb3JMVCA9IHRpdGxlQ29sb3JMVDtcblxuZXhwb3J0IGNvbnN0IHNlbGVjdEFjdGl2ZUJvcmRlckNvbG9yID0gJyNBMEE3QjQnO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEZvbnRTaXplID0gJzExcHgnO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEZvbnRXZWlnaHQgPSAnNDAwJztcbmV4cG9ydCBjb25zdCBzZWxlY3RGb250V2VpZ2h0Qm9sZCA9ICc1MDAnO1xuXG5leHBvcnQgY29uc3Qgc2VsZWN0Q29sb3JQbGFjZUhvbGRlciA9ICcjNzQ3NTc2JztcbmV4cG9ydCBjb25zdCBzZWxlY3RCYWNrZ3JvdW5kID0gJyM0OTQ5NDknO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEJhY2tncm91bmRIb3ZlciA9ICcjM0UzRTNFJztcbmV4cG9ydCBjb25zdCBzZWxlY3RCYWNrZ3JvdW5kTFQgPSAnI0ZGRkZGRic7XG5leHBvcnQgY29uc3Qgc2VsZWN0QmFja2dyb3VuZEhvdmVyTFQgPSAnI0Y4RjhGOSc7XG5leHBvcnQgY29uc3Qgc2VsZWN0Qm9yZGVyQ29sb3IgPSAnIzcxNzE3MSc7XG5leHBvcnQgY29uc3Qgc2VsZWN0Qm9yZGVyUmFkaXVzID0gJzFweCc7XG5leHBvcnQgY29uc3Qgc2VsZWN0Qm9yZGVyID0gMDtcblxuZXhwb3J0IGNvbnN0IGRyb3Bkb3duTGlzdEhpZ2hsaWdodEJnID0gJyM3MTcxNzEnO1xuXG5leHBvcnQgY29uc3QgcGFuZWxCYWNrZ3JvdW5kID0gJyMyRTJFMkYnO1xuZXhwb3J0IGNvbnN0IHBhbmVsQmFja2dyb3VuZExUID0gJyNmOGY4ZjknO1xuXG5leHBvcnQgY29uc3QgcGFuZWxBY3RpdmVCZyA9ICcjMzMzMzM0JztcbmV4cG9ydCBjb25zdCBwYW5lbEJvcmRlckNvbG9yID0gJyMzQTQxNEMnO1xuZXhwb3J0IGNvbnN0IHBhbmVsQm9yZGVyID0gYDFweCBzb2xpZCAke2JvcmRlckNvbG9yfWA7XG5leHBvcnQgY29uc3QgcGFuZWxCb3JkZXJMVCA9IGAxcHggc29saWQgJHtib3JkZXJDb2xvckxpZ2h0fWA7XG5cbmV4cG9ydCBjb25zdCBzaWRlTmF2QmcgPSAnIzI5MjkyQSc7XG5leHBvcnQgY29uc3Qgc2lkZVBhbmVsQmcgPSAnIzIzMjMyNCc7XG5cbmV4cG9ydCBjb25zdCBpbnB1dEJveEhlaWdodCA9ICcyOHB4JztcbmV4cG9ydCBjb25zdCBpbnB1dFBhZGRpbmcgPSAnNHB4IDEwcHgnO1xuZXhwb3J0IGNvbnN0IGlucHV0Rm9udFNpemUgPSAnMTJweCc7XG5leHBvcnQgY29uc3QgaW5wdXRGb250V2VpZ2h0ID0gNTAwO1xuXG5leHBvcnQgY29uc3QgbWFwUGFuZWxCYWNrZ3JvdW5kQ29sb3IgPSAnIzI0MjczMCc7XG5leHBvcnQgY29uc3QgbWFwUGFuZWxIZWFkZXJCYWNrZ3JvdW5kQ29sb3IgPSAnIzI5MzIzQyc7XG5leHBvcnQgY29uc3QgdG9vbHRpcEJnID0gJyNGOEY4RjknO1xuZXhwb3J0IGNvbnN0IHRvb2x0aXBDb2xvciA9ICcjMzMzMzM0JztcblxuLy8gTW9kYWxcbmV4cG9ydCBjb25zdCBtb2RhbFRpdGxlQ29sb3IgPSAnIzNBNDE0Qyc7XG5leHBvcnQgY29uc3QgbW9kYWxUaXRsZUZvbnRTaXplID0gJzMycHgnO1xuZXhwb3J0IGNvbnN0IG1vZGFsRm9vdGVyQmdkID0gJyNGOEY4RjknO1xuXG5leHBvcnQgY29uc3QgdGV4dFRydW5jYXRlID0ge1xuICBtYXhXaWR0aDogJzEwMCUnLFxuICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJyxcbiAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gIHdvcmRXcmFwOiAnbm9ybWFsJ1xufTtcblxuLy8gdGhlbWUgaXMgcGFzc2VkIHRvIGtlcGxlci5nbCB3aGVuIGl0J3MgbW91bnRlZCxcbi8vIGl0IGlzIHVzZWQgYnkgc3R5bGVkLWNvbXBvbmVudHMgdG8gcGFzcyBhbG9uZyB0b1xuLy8gYWxsIGNoaWxkIGNvbXBvbmVudHNcbmNvbnN0IGlucHV0ID0gY3NzYFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdEJhY2tncm91bmR9O1xuICBib3JkZXI6IDFweCBzb2xpZFxuICAgICR7cHJvcHMgPT5cbiAgICAgIHByb3BzLmFjdGl2ZVxuICAgICAgICA/IHByb3BzLnRoZW1lLnNlbGVjdEFjdGl2ZUJvcmRlckNvbG9yXG4gICAgICAgIDogcHJvcHMuZXJyb3IgPyBwcm9wcy50aGVtZS5lcnJvckNvbG9yIDogcHJvcHMudGhlbWUuc2VsZWN0QmFja2dyb3VuZH07XG4gIGNhcmV0LWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdEFjdGl2ZUJvcmRlckNvbG9yfTtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2VsZWN0Q29sb3J9O1xuICBkaXNwbGF5OiBmbGV4O1xuICBmb250LXNpemU6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRGb250U2l6ZX07XG4gIGZvbnQtd2VpZ2h0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0Rm9udFdlaWdodH07XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dEJveEhlaWdodH07XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgb3V0bGluZTogbm9uZTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgcGFkZGluZzogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dFBhZGRpbmd9O1xuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgdHJhbnNpdGlvbjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50cmFuc2l0aW9ufTtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgd2lkdGg6IDEwMCU7XG4gIHdvcmQtd3JhcDogbm9ybWFsO1xuICBwb2ludGVyLWV2ZW50czogJHtwcm9wcyA9PiAocHJvcHMuZGlzYWJsZWQgPyAnbm9uZScgOiAnYWxsJyl9O1xuICBvcGFjaXR5OiAke3Byb3BzID0+IChwcm9wcy5kaXNhYmxlZCA/IDAuNSA6IDEpfTtcblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdEJhY2tncm91bmRIb3Zlcn07XG4gIH1cbmA7XG5cbmNvbnN0IGRyb3Bkb3duU2Nyb2xsQmFyID0gY3NzYFxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICBoZWlnaHQ6IDEwcHg7XG4gICAgd2lkdGg6IDEwcHg7XG4gIH1cbiAgXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItY29ybmVyIHtcbiAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdEJhY2tncm91bmR9O1xuICB9XG4gIFxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNrIHtcbiAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdEJhY2tncm91bmR9O1xuICB9XG4gIFxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gICAgYm9yZGVyOiAzcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3RCYWNrZ3JvdW5kfTtcbiAgfTtcbiAgXG4gIDp2ZXJ0aWNhbDpob3ZlciB7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3RCYWNrZ3JvdW5kSG92ZXJ9O1xuICB9XG59YDtcblxuY29uc3QgZHJvcGRvd25MaXN0QW5jaG9yID0gY3NzYFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3RDb2xvcn07XG4gIHBhZGRpbmctbGVmdDogM3B4O1xuYDtcblxuY29uc3QgZHJvcGRvd25MaXN0SXRlbSA9IGNzc2BcbiAgZm9udC1zaXplOiAxMXB4O1xuICBwYWRkaW5nOiA1cHggOXB4O1xuXG4gICYuaG92ZXIsXG4gICY6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEhpZ2hsaWdodEJnfTtcbiAgfVxuYDtcblxuY29uc3QgZHJvcGRvd25MaXN0SGVhZGVyID0gY3NzYFxuICBmb250LXNpemU6IDExcHg7XG4gIHBhZGRpbmc6IDVweCA5cHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuYDtcblxuY29uc3QgZHJvcGRvd25MaXN0U2VjdGlvbiA9IGNzc2BcbiAgcGFkZGluZzogMCAwIDRweCAwO1xuICBtYXJnaW4tYm90dG9tOiA0cHg7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuYDtcblxuY29uc3QgZHJvcGRvd25MaXN0ID0gY3NzYFxuICBvdmVyZmxvdy15OiBvdmVybGF5O1xuICBtYXgtaGVpZ2h0OiAyODBweDtcblxuICAubGlzdF9fc2VjdGlvbiB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RTZWN0aW9ufTtcbiAgfVxuICAubGlzdF9faGVhZGVyIHtcbiAgICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEhlYWRlcn07XG4gIH1cblxuICAubGlzdF9faXRlbSB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RJdGVtfTtcbiAgfVxuXG4gIC5saXN0X19pdGVtX19hbmNob3Ige1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0QW5jaG9yfTtcbiAgfVxuXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25TY3JvbGxCYXJ9O1xuYDtcblxuY29uc3Qgc2Nyb2xsQmFyID0gY3NzYFxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICB3aWR0aDogMTRweDtcbiAgfVxuICBcbiAgOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWxCZ307XG4gIH1cbiAgXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmR9O1xuICAgIGJvcmRlcjogM3B4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsQmd9XG5cbiAgICAnOnZlcnRpY2FsJzoge1xuICAgICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmR9O1xuICAgIH0sXG5cbiAgICAnOnZlcnRpY2FsOmhvdmVyJzoge1xuICAgICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3RCYWNrZ3JvdW5kSG92ZXJ9O1xuICAgIH1cbiAgfVxufWA7XG5cbmV4cG9ydCBjb25zdCBtb2RhbFNjcm9sbEJhciA9IGNzc2BcbiAgOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgd2lkdGg6IDE0cHg7XG4gICAgaGVpZ2h0OiAxNnB4O1xuICB9XG5cbiAgOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gICAgYmFja2dyb3VuZDogd2hpdGU7XG4gIH1cbiAgOjotd2Via2l0LXNjcm9sbGJhci10cmFjazpob3Jpem9udGFsIHtcbiAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgfVxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3JMVH07XG4gICAgYm9yZGVyOiA0cHggc29saWQgd2hpdGU7XG4gIH1cblxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLWNvcm5lciB7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gIH1cblxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kOiAjOTY5ZGE5O1xuICB9XG5cbiAgOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjp2ZXJ0aWNhbCB7XG4gICAgYm9yZGVyLXJhZGl1czogN3B4O1xuICB9XG5cbiAgOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3Jpem9udGFsIHtcbiAgICBib3JkZXItcmFkaXVzOiA5cHg7XG4gICAgYm9yZGVyOiA0cHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCB0aGVtZSA9IHtcbiAgLi4uRElNRU5TSU9OUyxcbiAgLy8gdGVtcGxhdGVzXG4gIGlucHV0LFxuICBkcm9wZG93blNjcm9sbEJhcixcbiAgZHJvcGRvd25MaXN0LFxuICBkcm9wZG93bkxpc3RJdGVtLFxuICBkcm9wZG93bkxpc3RBbmNob3IsXG4gIGRyb3Bkb3duTGlzdEhlYWRlcixcbiAgZHJvcGRvd25MaXN0U2VjdGlvbixcbiAgbW9kYWxTY3JvbGxCYXIsXG4gIHNjcm9sbEJhcixcblxuICAvLyBzdHlsZXNcbiAgYWN0aXZlQ29sb3IsXG4gIGFjdGl2ZUNvbG9ySG92ZXIsXG4gIGJvcmRlclJhZGl1cyxcbiAgYm94U2hhZG93LFxuICBlcnJvckNvbG9yLFxuICBkcm9wZG93bkxpc3RIaWdobGlnaHRCZyxcbiAgaW5wdXRCb3hIZWlnaHQsXG4gIGlucHV0UGFkZGluZyxcbiAgaW5wdXRGb250U2l6ZSxcbiAgaW5wdXRGb250V2VpZ2h0LFxuICBsYWJlbENvbG9yLFxuICBsYWJlbENvbG9yTFQsXG4gIGxhYmVsSG92ZXJDb2xvcixcbiAgbWFwUGFuZWxCYWNrZ3JvdW5kQ29sb3IsXG4gIG1hcFBhbmVsSGVhZGVyQmFja2dyb3VuZENvbG9yLFxuXG4gIC8vIFBhbmVsXG4gIHBhbmVsQWN0aXZlQmcsXG4gIHBhbmVsQmFja2dyb3VuZCxcbiAgcGFuZWxCYWNrZ3JvdW5kTFQsXG4gIHBhbmVsQm9yZGVyLFxuICBwYW5lbEJvcmRlckNvbG9yLFxuICBwYW5lbEJvcmRlckxULFxuXG4gIC8vIFNlbGVjdFxuICBzZWxlY3RBY3RpdmVCb3JkZXJDb2xvcixcbiAgc2VsZWN0QmFja2dyb3VuZCxcbiAgc2VsZWN0QmFja2dyb3VuZExULFxuICBzZWxlY3RCYWNrZ3JvdW5kSG92ZXIsXG4gIHNlbGVjdEJhY2tncm91bmRIb3ZlckxULFxuICBzZWxlY3RCb3JkZXIsXG4gIHNlbGVjdEJvcmRlclJhZGl1cyxcbiAgc2VsZWN0Q29sb3IsXG4gIHNlbGVjdENvbG9yUGxhY2VIb2xkZXIsXG4gIHNlbGVjdEZvbnRTaXplLFxuICBzZWxlY3RGb250V2VpZ2h0LFxuICBzZWxlY3RDb2xvckxULFxuXG4gIC8vIEJ1dHRvblxuICBwcmltYXJ5QnRuQmdkLFxuICBwcmltYXJ5QnRuQWN0QmdkLFxuICBwcmltYXJ5QnRuQ29sb3IsXG4gIHByaW1hcnlCdG5BY3RDb2xvcixcbiAgcHJpbWFyeUJ0bkJnZEhvdmVyLFxuICBzZWNvbmRhcnlCdG5CZ2QsXG4gIHNlY29uZGFyeUJ0bkFjdEJnZCxcbiAgc2Vjb25kYXJ5QnRuQmdkSG92ZXIsXG4gIHNlY29uZGFyeUJ0bkNvbG9yLFxuICBzZWNvbmRhcnlCdG5BY3RDb2xvcixcbiAgbGlua0J0bkJnZCxcbiAgbGlua0J0bkFjdEJnZCxcbiAgbGlua0J0bkNvbG9yLFxuICBsaW5rQnRuQWN0Q29sb3IsXG4gIGxpbmtCdG5BY3RCZ2RIb3ZlcixcblxuICAvLyBNb2RhbFxuICBtb2RhbFRpdGxlQ29sb3IsXG4gIG1vZGFsVGl0bGVGb250U2l6ZSxcbiAgbW9kYWxGb290ZXJCZ2QsXG5cbiAgc2lkZVBhbmVsQmcsXG4gIHRleHRDb2xvcixcbiAgdGV4dENvbG9yTFQsXG4gIHRleHRDb2xvckhsLFxuICBzdWJ0ZXh0Q29sb3IsXG4gIHN1YnRleHRDb2xvckxULFxuICB0ZXh0VHJ1bmNhdGUsXG4gIHRpdGxlQ29sb3JMVCxcbiAgdHJhbnNpdGlvbixcbiAgdG9vbHRpcEJnLFxuICB0b29sdGlwQ29sb3Jcbn07XG4iXX0=