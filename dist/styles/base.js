'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.theme = exports.modalScrollBar = exports.textTruncate = exports.rangeBrushBgd = exports.sliderHandleShadow = exports.sliderHandleHoverColor = exports.sliderHandleColor = exports.sliderHandleWidth = exports.sliderHandleHeight = exports.sliderBarHeight = exports.sliderBarRadius = exports.sliderBarHoverColor = exports.sliderBarBgd = exports.sliderBarColor = exports.modalFooterBgd = exports.modalTitleFontSize = exports.modalTitleColor = exports.tooltipColor = exports.tooltipBg = exports.mapPanelHeaderBackgroundColor = exports.mapPanelBackgroundColor = exports.panelBorderLT = exports.panelBorder = exports.panelBorderColor = exports.panelBackgroundLT = exports.panelBorderRadius = exports.panelBoxShadow = exports.panelHeaderHeight = exports.panelHeaderIconActive = exports.panelHeaderIcon = exports.panelActiveBg = exports.panelBackgroundHover = undefined;
exports.panelBackground = exports.sideBarCloseBtnBgdHover = exports.sideBarCloseBtnColor = exports.sideBarCloseBtnBgd = exports.sidePanelBg = exports.sidePanelHeaderBg = exports.dropdownListBorderTop = exports.dropdownListBgd = exports.dropdownListShadow = exports.dropdownListHighlightBg = exports.selectBorder = exports.selectBorderRadius = exports.selectBorderColor = exports.selectBackgroundHoverLT = exports.selectBackgroundLT = exports.selectBackgroundHover = exports.selectBackground = exports.selectColorPlaceHolder = exports.selectFontWeightBold = exports.selectFontWeight = exports.selectFontSize = exports.selectActiveBorderColor = exports.selectColorLT = exports.selectColor = exports.secondarySwitchBtnBgd = exports.secondarySwitchTrackBgd = exports.switchBtnHeight = exports.switchBtnWidth = exports.switchBtnBorderRadius = exports.switchBtnBoxShadow = exports.switchBtnBgdActive = exports.switchBtnBgd = exports.switchTrackBorderRadius = exports.switchTrackBgdActive = exports.switchTrackBgd = exports.switchLabelMargin = exports.switchHeight = exports.switchWidth = exports.secondaryInputBorderActiveColor = exports.secondaryInputBorderColor = exports.secondaryInputColor = exports.secondaryInputBgdActive = exports.secondaryInputBgdHover = exports.secondaryInputBgd = exports.secondaryInputHeight = exports.inputPlaceholderFontWeight = exports.inputPlaceholderColor = exports.inputBorderRadius = exports.inputColor = exports.inputBorderActiveColor = exports.inputBorderHoverColor = exports.inputBorderColor = exports.inputBgdActive = exports.inputBgdHover = exports.inputBgd = exports.inputFontWeight = exports.inputFontSize = exports.inputPadding = exports.inputBoxHeight = exports.linkBtnActBgdHover = exports.linkBtnActColor = exports.linkBtnColor = exports.linkBtnActBgd = exports.linkBtnBgd = exports.secondaryBtnBgdHover = exports.secondaryBtnActColor = exports.secondaryBtnColor = exports.secondaryBtnActBgd = exports.secondaryBtnBgd = exports.primaryBtnRadius = exports.primaryBtnBgdHover = exports.primaryBtnActColor = exports.primaryBtnColor = exports.primaryBtnActBgd = exports.primaryBtnBgd = exports.positiveBgColor = exports.positiveColor = exports.errorBgColor = exports.errorColor = exports.activeColorHover = exports.activeColor = exports.textColorHl = exports.titleTextColor = exports.subtextColorActive = exports.subtextColorLT = exports.subtextColor = exports.titleColorLT = exports.textColorLT = exports.textColor = exports.labelColorLT = exports.labelHoverColor = exports.labelColor = exports.borderColorLight = exports.borderColor = exports.borderRadius = exports.boxSizing = exports.boxShadow = exports.transitionSlow = exports.transitionFast = exports.transition = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  align-items: center;\n  background-color: ', ';\n  border: 1px solid\n    ', ';\n  caret-color: ', ';\n  color: ', ';\n  display: flex;\n  font-size: ', ';\n  font-weight: ', ';\n  height: ', ';\n  justify-content: space-between;\n  outline: none;\n  overflow: hidden;\n  padding: ', ';\n  text-overflow: ellipsis;\n  transition: ', ';\n  white-space: nowrap;\n  width: 100%;\n  word-wrap: normal;\n  pointer-events: ', ';\n  opacity: ', ';\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n    border-color: ', ';\n  }\n\n  :active,\n  &.active {\n    background-color: ', ';\n    border-color: ', ';\n  }\n\n  ::placeholder {\n    color: ', ';\n    font-weight: ', ';\n  }\n\n  /* Disable Arrows on Number Inputs */\n  ::-webkit-inner-spin-button,\n  ::-webkit-outer-spin-button {\n    -webkit-appearance: none;\n    margin: 0;\n  }\n'], ['\n  align-items: center;\n  background-color: ', ';\n  border: 1px solid\n    ', ';\n  caret-color: ', ';\n  color: ', ';\n  display: flex;\n  font-size: ', ';\n  font-weight: ', ';\n  height: ', ';\n  justify-content: space-between;\n  outline: none;\n  overflow: hidden;\n  padding: ', ';\n  text-overflow: ellipsis;\n  transition: ', ';\n  white-space: nowrap;\n  width: 100%;\n  word-wrap: normal;\n  pointer-events: ', ';\n  opacity: ', ';\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n    border-color: ', ';\n  }\n\n  :active,\n  &.active {\n    background-color: ', ';\n    border-color: ', ';\n  }\n\n  ::placeholder {\n    color: ', ';\n    font-weight: ', ';\n  }\n\n  /* Disable Arrows on Number Inputs */\n  ::-webkit-inner-spin-button,\n  ::-webkit-outer-spin-button {\n    -webkit-appearance: none;\n    margin: 0;\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', ' \n  color: ', ';\n  background-color: ', ';\n  height: ', ';\n  border: 1px solid\n    ', ';\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n    border-color: ', ';\n  }\n\n  :active,\n  &.active {\n    background-color: ', ';\n    border-color: ', ';\n  }\n'], ['\n  ', ' \n  color: ', ';\n  background-color: ', ';\n  height: ', ';\n  border: 1px solid\n    ', ';\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n    border-color: ', ';\n  }\n\n  :active,\n  &.active {\n    background-color: ', ';\n    border-color: ', ';\n  }\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', ' \n  cursor: pointer;\n  flex-wrap: wrap;\n  height: auto;\n  justify-content: start;\n  margin-bottom: 2px;\n  padding: 4px 7px 4px 4px;\n  white-space: normal;\n'], ['\n  ', ' \n  cursor: pointer;\n  flex-wrap: wrap;\n  height: auto;\n  justify-content: start;\n  margin-bottom: 2px;\n  padding: 4px 7px 4px 4px;\n  white-space: normal;\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', ' color: ', ';\n  font-size: 13px;\n  letter-spacing: 0.43px;\n  line-height: 18px;\n  height: 24px;\n  font-weight: 400;\n  padding-left: 4px;\n  margin-left: -4px;\n  background-color: transparent;\n  border: 1px solid transparent;\n\n  :hover {\n    height: 24px;\n    cursor: text;\n    background-color: transparent;\n    border: 1px solid ', ';\n  }\n\n  :active,\n  .active,\n  :focus {\n    background-color: transparent;\n    border: 1px solid ', ';\n  }\n'], ['\n  ', ' color: ', ';\n  font-size: 13px;\n  letter-spacing: 0.43px;\n  line-height: 18px;\n  height: 24px;\n  font-weight: 400;\n  padding-left: 4px;\n  margin-left: -4px;\n  background-color: transparent;\n  border: 1px solid transparent;\n\n  :hover {\n    height: 24px;\n    cursor: text;\n    background-color: transparent;\n    border: 1px solid ', ';\n  }\n\n  :active,\n  .active,\n  :focus {\n    background-color: transparent;\n    border: 1px solid ', ';\n  }\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n  background: ', ';\n  position: absolute;\n  top: 0;\n  left: ', 'px;\n  content: \'\';\n  display: block;\n  width: ', 'px;\n  height: ', 'px;\n  border-radius: ', ';\n'], ['\n  background: ', ';\n  position: absolute;\n  top: 0;\n  left: ', 'px;\n  content: \'\';\n  display: block;\n  width: ', 'px;\n  height: ', 'px;\n  border-radius: ', ';\n']),
    _templateObject6 = (0, _taggedTemplateLiteralLoose3.default)(['\n  transition: ', ';\n  position: absolute;\n  top: 0;\n  left: ', 'px;\n  content: \'\';\n  display: block;\n  height: ', ';\n  width: ', ';\n  background: ', ';\n  box-shadow: ', ';\n'], ['\n  transition: ', ';\n  position: absolute;\n  top: 0;\n  left: ', 'px;\n  content: \'\';\n  display: block;\n  height: ', ';\n  width: ', ';\n  background: ', ';\n  box-shadow: ', ';\n']),
    _templateObject7 = (0, _taggedTemplateLiteralLoose3.default)(['\n  user-select: none;\n  cursor: pointer;\n  line-height: 0;\n  font-weight: 500;\n  font-size: 12px;\n  color: ', ';\n  position: relative;\n  display: inline-block;\n  padding-top: ', 'px;\n  padding-right: 0;\n  padding-bottom: 0;\n  padding-left: ', 'px;\n\n  :before {\n    ', ';\n  }\n\n  :after {\n    ', ';\n  }\n'], ['\n  user-select: none;\n  cursor: pointer;\n  line-height: 0;\n  font-weight: 500;\n  font-size: 12px;\n  color: ', ';\n  position: relative;\n  display: inline-block;\n  padding-top: ', 'px;\n  padding-right: 0;\n  padding-bottom: 0;\n  padding-left: ', 'px;\n\n  :before {\n    ', ';\n  }\n\n  :after {\n    ', ';\n  }\n']),
    _templateObject8 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', ' \n  :before {\n    ', ' background: ', ';\n  }\n\n  :after {\n    ', ' background: ', ';\n  }\n'], ['\n  ', ' \n  :before {\n    ', ' background: ', ';\n  }\n\n  :after {\n    ', ' background: ', ';\n  }\n']),
    _templateObject9 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ::-webkit-scrollbar {\n    height: 10px;\n    width: 10px;\n  }\n  \n  ::-webkit-scrollbar-corner {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-track {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ', ';\n    border: 3px solid ', ';\n  };\n  \n  :vertical:hover {\n    background: ', ';\n  }\n}'], ['\n  ::-webkit-scrollbar {\n    height: 10px;\n    width: 10px;\n  }\n  \n  ::-webkit-scrollbar-corner {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-track {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ', ';\n    border: 3px solid ', ';\n  };\n  \n  :vertical:hover {\n    background: ', ';\n  }\n}']),
    _templateObject10 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n  padding-left: 3px;\n'], ['\n  color: ', ';\n  padding-left: 3px;\n']),
    _templateObject11 = (0, _taggedTemplateLiteralLoose3.default)(['\n  font-size: 11px;\n  padding: 3px 9px;\n  font-weight: 500;\n\n  &.hover,\n  &:hover {\n    cursor: pointer;\n    background-color: ', ';\n\n    .list__item__anchor {\n      color: ', ';\n    }\n  }\n'], ['\n  font-size: 11px;\n  padding: 3px 9px;\n  font-weight: 500;\n\n  &.hover,\n  &:hover {\n    cursor: pointer;\n    background-color: ', ';\n\n    .list__item__anchor {\n      color: ', ';\n    }\n  }\n']),
    _templateObject12 = (0, _taggedTemplateLiteralLoose3.default)(['\n  font-size: 11px;\n  padding: 5px 9px;\n  color: ', ';\n'], ['\n  font-size: 11px;\n  padding: 5px 9px;\n  color: ', ';\n']),
    _templateObject13 = (0, _taggedTemplateLiteralLoose3.default)(['\n  padding: 0 0 4px 0;\n  margin-bottom: 4px;\n  border-bottom: 1px solid ', ';\n'], ['\n  padding: 0 0 4px 0;\n  margin-bottom: 4px;\n  border-bottom: 1px solid ', ';\n']),
    _templateObject14 = (0, _taggedTemplateLiteralLoose3.default)(['\n  overflow-y: overlay;\n  max-height: 280px;\n  box-shadow: ', ';\n  border-radius: 2px;\n\n  .list__section {\n    ', ';\n  }\n  .list__header {\n    ', ';\n  }\n\n  .list__item {\n    ', ';\n  }\n\n  .list__item__anchor {\n    ', ';\n  }\n\n  ', ';\n'], ['\n  overflow-y: overlay;\n  max-height: 280px;\n  box-shadow: ', ';\n  border-radius: 2px;\n\n  .list__section {\n    ', ';\n  }\n  .list__header {\n    ', ';\n  }\n\n  .list__item {\n    ', ';\n  }\n\n  .list__item__anchor {\n    ', ';\n  }\n\n  ', ';\n']),
    _templateObject15 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ::-webkit-scrollbar {\n    width: 14px;\n  }\n  \n  ::-webkit-scrollbar-track {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ', ';\n    border: 3px solid ', '\n\n    \':vertical\': {\n      background: ', ';\n    },\n\n    \':vertical:hover\': {\n      background: ', ';\n    }\n  }\n}'], ['\n  ::-webkit-scrollbar {\n    width: 14px;\n  }\n  \n  ::-webkit-scrollbar-track {\n    background: ', ';\n  }\n  \n  ::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: ', ';\n    border: 3px solid ', '\n\n    \':vertical\': {\n      background: ', ';\n    },\n\n    \':vertical:hover\': {\n      background: ', ';\n    }\n  }\n}']),
    _templateObject16 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ::-webkit-scrollbar {\n    width: 14px;\n    height: 16px;\n  }\n\n  ::-webkit-scrollbar-track {\n    background: white;\n  }\n  ::-webkit-scrollbar-track:horizontal {\n    background: ', ';\n  }\n  ::-webkit-scrollbar-thumb {\n    background: ', ';\n    border: 4px solid white;\n  }\n\n  ::-webkit-scrollbar-corner {\n    background: ', ';\n  }\n\n  ::-webkit-scrollbar-thumb:hover {\n    background: #969da9;\n  }\n\n  ::-webkit-scrollbar-thumb:vertical {\n    border-radius: 7px;\n  }\n\n  ::-webkit-scrollbar-thumb:horizontal {\n    border-radius: 9px;\n    border: 4px solid ', ';\n  }\n'], ['\n  ::-webkit-scrollbar {\n    width: 14px;\n    height: 16px;\n  }\n\n  ::-webkit-scrollbar-track {\n    background: white;\n  }\n  ::-webkit-scrollbar-track:horizontal {\n    background: ', ';\n  }\n  ::-webkit-scrollbar-thumb {\n    background: ', ';\n    border: 4px solid white;\n  }\n\n  ::-webkit-scrollbar-corner {\n    background: ', ';\n  }\n\n  ::-webkit-scrollbar-thumb:hover {\n    background: #969da9;\n  }\n\n  ::-webkit-scrollbar-thumb:vertical {\n    border-radius: 7px;\n  }\n\n  ::-webkit-scrollbar-thumb:horizontal {\n    border-radius: 9px;\n    border: 4px solid ', ';\n  }\n']);

var _styledComponents = require('styled-components');

var _defaultSettings = require('../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transition = exports.transition = 'all .4s ease';
var transitionFast = exports.transitionFast = 'all .2s ease';
var transitionSlow = exports.transitionSlow = 'all .8s ease';

var boxShadow = exports.boxShadow = '0 1px 2px 0 rgba(0,0,0,0.10)';
var boxSizing = exports.boxSizing = 'border-box';
var borderRadius = exports.borderRadius = '1px';
var borderColor = exports.borderColor = '#3A414C';
var borderColorLight = exports.borderColorLight = '#F1F1F1';

// TEXT
var labelColor = exports.labelColor = '#6A7485';
var labelHoverColor = exports.labelHoverColor = '#C6C6C6';
var labelColorLT = exports.labelColorLT = '#6A7485';

var textColor = exports.textColor = '#A0A7B4';
var textColorLT = exports.textColorLT = '#3A414C';
var titleColorLT = exports.titleColorLT = '#29323C';

var subtextColor = exports.subtextColor = '#6A7485';
var subtextColorLT = exports.subtextColorLT = '#A0A7B4';
var subtextColorActive = exports.subtextColorActive = '#FFFFFF';

var titleTextColor = exports.titleTextColor = '#FFFFFF';
var textColorHl = exports.textColorHl = '#D3D8E0';
var activeColor = exports.activeColor = '#1FBAD6';
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
var primaryBtnRadius = exports.primaryBtnRadius = '2px';

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

// Input
var inputBoxHeight = exports.inputBoxHeight = '34px';
var inputPadding = exports.inputPadding = '4px 10px';
var inputFontSize = exports.inputFontSize = '11px';
var inputFontWeight = exports.inputFontWeight = 500;
var inputBgd = exports.inputBgd = '#29323C';
var inputBgdHover = exports.inputBgdHover = '#3A414C';
var inputBgdActive = exports.inputBgdActive = '#3A414C';
var inputBorderColor = exports.inputBorderColor = '#29323C';
var inputBorderHoverColor = exports.inputBorderHoverColor = '#3A414C';
var inputBorderActiveColor = exports.inputBorderActiveColor = '#D3D8E0';
var inputColor = exports.inputColor = '#A0A7B4';
var inputBorderRadius = exports.inputBorderRadius = '1px';
var inputPlaceholderColor = exports.inputPlaceholderColor = '#6A7485';
var inputPlaceholderFontWeight = exports.inputPlaceholderFontWeight = 400;

var secondaryInputHeight = exports.secondaryInputHeight = '28px';
var secondaryInputBgd = exports.secondaryInputBgd = '#242730';
var secondaryInputBgdHover = exports.secondaryInputBgdHover = '#3A414C';
var secondaryInputBgdActive = exports.secondaryInputBgdActive = '#3A414C';
var secondaryInputColor = exports.secondaryInputColor = '#A0A7B4';
var secondaryInputBorderColor = exports.secondaryInputBorderColor = '#242730';
var secondaryInputBorderActiveColor = exports.secondaryInputBorderActiveColor = '#D3D8E0';

var switchWidth = exports.switchWidth = 24;
var switchHeight = exports.switchHeight = 12;
var switchLabelMargin = exports.switchLabelMargin = 12;

var switchTrackBgd = exports.switchTrackBgd = '#29323C';
var switchTrackBgdActive = exports.switchTrackBgdActive = activeColor;
var switchTrackBorderRadius = exports.switchTrackBorderRadius = '1px';
var switchBtnBgd = exports.switchBtnBgd = '#6A7485';
var switchBtnBgdActive = exports.switchBtnBgdActive = '#D3D8E0';
var switchBtnBoxShadow = exports.switchBtnBoxShadow = '0 2px 4px 0 rgba(0,0,0,0.40)';
var switchBtnBorderRadius = exports.switchBtnBorderRadius = '1px';
var switchBtnWidth = exports.switchBtnWidth = '12px';
var switchBtnHeight = exports.switchBtnHeight = '12px';

var secondarySwitchTrackBgd = exports.secondarySwitchTrackBgd = '#242730';
var secondarySwitchBtnBgd = exports.secondarySwitchBtnBgd = '#3A414C';

// Select
var selectColor = exports.selectColor = inputColor;
var selectColorLT = exports.selectColorLT = titleColorLT;

var selectActiveBorderColor = exports.selectActiveBorderColor = '#D3D8E0';
var selectFontSize = exports.selectFontSize = '11px';
var selectFontWeight = exports.selectFontWeight = '400';
var selectFontWeightBold = exports.selectFontWeightBold = '500';

var selectColorPlaceHolder = exports.selectColorPlaceHolder = '#6A7485';
var selectBackground = exports.selectBackground = inputBgd;
var selectBackgroundHover = exports.selectBackgroundHover = inputBgdHover;
var selectBackgroundLT = exports.selectBackgroundLT = '#FFFFFF';
var selectBackgroundHoverLT = exports.selectBackgroundHoverLT = '#F8F8F9';
var selectBorderColor = exports.selectBorderColor = '#D3D8E0';
var selectBorderRadius = exports.selectBorderRadius = '1px';
var selectBorder = exports.selectBorder = 0;

var dropdownListHighlightBg = exports.dropdownListHighlightBg = '#6A7485';
var dropdownListShadow = exports.dropdownListShadow = '0 6px 12px 0 rgba(0,0,0,0.16)';
var dropdownListBgd = exports.dropdownListBgd = '#3A414C';
var dropdownListBorderTop = exports.dropdownListBorderTop = '#242730';

// Side Panel
var sidePanelHeaderBg = exports.sidePanelHeaderBg = '#29323C';
var sidePanelBg = exports.sidePanelBg = '#242730';
var sideBarCloseBtnBgd = exports.sideBarCloseBtnBgd = secondaryBtnBgd;
var sideBarCloseBtnColor = exports.sideBarCloseBtnColor = '#29323C';
var sideBarCloseBtnBgdHover = exports.sideBarCloseBtnBgdHover = secondaryBtnActBgd;

var panelBackground = exports.panelBackground = '#29323C';
var panelBackgroundHover = exports.panelBackgroundHover = '#3A4552';
var panelActiveBg = exports.panelActiveBg = '#3A4552';
var panelHeaderIcon = exports.panelHeaderIcon = '#6A7485';
var panelHeaderIconActive = exports.panelHeaderIconActive = '#A0A7B4';
var panelHeaderHeight = exports.panelHeaderHeight = 48;
var panelBoxShadow = exports.panelBoxShadow = '0 6px 12px 0 rgba(0,0,0,0.16)';
var panelBorderRadius = exports.panelBorderRadius = '2px';
var panelBackgroundLT = exports.panelBackgroundLT = '#f8f8f9';

var panelBorderColor = exports.panelBorderColor = '#3A414C';
var panelBorder = exports.panelBorder = '1px solid ' + borderColor;
var panelBorderLT = exports.panelBorderLT = '1px solid ' + borderColorLight;

var mapPanelBackgroundColor = exports.mapPanelBackgroundColor = '#242730';
var mapPanelHeaderBackgroundColor = exports.mapPanelHeaderBackgroundColor = '#29323C';
var tooltipBg = exports.tooltipBg = '#F8F8F9';
var tooltipColor = exports.tooltipColor = '#333334';

// Modal
var modalTitleColor = exports.modalTitleColor = '#3A414C';
var modalTitleFontSize = exports.modalTitleFontSize = '32px';
var modalFooterBgd = exports.modalFooterBgd = '#F8F8F9';

var sliderBarColor = exports.sliderBarColor = '#6A7485';
var sliderBarBgd = exports.sliderBarBgd = '#3A414C';
var sliderBarHoverColor = exports.sliderBarHoverColor = '#D3D8E0';
var sliderBarRadius = exports.sliderBarRadius = '1px';
var sliderBarHeight = exports.sliderBarHeight = '4px';
var sliderHandleHeight = exports.sliderHandleHeight = '12px';
var sliderHandleWidth = exports.sliderHandleWidth = '12px';
var sliderHandleColor = exports.sliderHandleColor = '#D3D8E0';
var sliderHandleHoverColor = exports.sliderHandleHoverColor = '#FFFFFF';
var sliderHandleShadow = exports.sliderHandleShadow = '0 2px 4px 0 rgba(0,0,0,0.40)';

// Plot
var rangeBrushBgd = exports.rangeBrushBgd = '#3A414C';

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
  return props.theme.inputBgd;
}, function (props) {
  return props.active ? props.theme.inputBorderActiveColor : props.error ? props.theme.errorColor : props.theme.inputBgd;
}, function (props) {
  return props.theme.inputBorderActiveColor;
}, function (props) {
  return props.theme.inputColor;
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
  return props.active ? props.theme.inputBgdActive : props.theme.inputBgdHover;
}, function (props) {
  return props.active ? props.theme.inputBorderActiveColor : props.theme.inputBorderHoverColor;
}, function (props) {
  return props.theme.inputBgdActive;
}, function (props) {
  return props.theme.inputBorderActiveColor;
}, function (props) {
  return props.theme.inputPlaceholderColor;
}, function (props) {
  return props.theme.inputPlaceholderFontWeight;
});

var secondaryInput = (0, _styledComponents.css)(_templateObject2, function (props) {
  return props.theme.input;
}, function (props) {
  return props.theme.secondaryInputColor;
}, function (props) {
  return props.theme.secondaryInputBgd;
}, function (props) {
  return props.theme.secondaryInputHeight;
}, function (props) {
  return props.error ? props.theme.errorColor : props.theme.secondaryInputBorderColor;
}, function (props) {
  return props.theme.secondaryInputBgdHover;
}, function (props) {
  return props.theme.secondaryInputBgdHover;
}, function (props) {
  return props.theme.secondaryInputBgdActive;
}, function (props) {
  return props.theme.secondaryInputBorderActiveColor;
});

var chickletedInput = (0, _styledComponents.css)(_templateObject3, function (props) {
  return props.theme.secondaryInput;
});

var inlineInput = (0, _styledComponents.css)(_templateObject4, function (props) {
  return props.theme.input;
}, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.inputBorderActiveColor;
});

var switchTrack = (0, _styledComponents.css)(_templateObject5, function (props) {
  return props.checked ? props.theme.switchTrackBgdActive : props.theme.switchTrackBgd;
}, function (props) {
  return -props.theme.switchLabelMargin;
}, function (props) {
  return props.theme.switchWidth;
}, function (props) {
  return props.theme.switchHeight;
}, function (props) {
  return props.theme.switchTrackBorderRadius;
});

var switchButton = (0, _styledComponents.css)(_templateObject6, function (props) {
  return props.theme.transition;
}, function (props) {
  return (props.checked ? props.theme.switchWidth / 2 : -1) - props.theme.switchLabelMargin;
}, function (props) {
  return props.theme.switchBtnHeight;
}, function (props) {
  return props.theme.switchBtnWidth;
}, function (props) {
  return function (props) {
    return props.checked ? props.theme.switchBtnBgdActive : props.theme.switchBtnBgd;
  };
}, function (props) {
  return props.theme.switchBtnBoxShadow;
});

var inputSwitch = (0, _styledComponents.css)(_templateObject7, function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.switchHeight / 2;
}, function (props) {
  return props.theme.switchWidth;
}, function (props) {
  return props.theme.switchTrack;
}, function (props) {
  return props.theme.switchButton;
});

var secondarySwitch = (0, _styledComponents.css)(_templateObject8, function (props) {
  return props.theme.inputSwitch;
}, function (props) {
  return props.theme.switchTrack;
}, function (props) {
  return props.checked ? props.theme.switchTrackBgdActive : props.theme.secondarySwitchTrackBgd;
}, function (props) {
  return props.theme.switchButton;
}, function (props) {
  return function (props) {
    return props.checked ? props.theme.switchBtnBgdActive : props.theme.secondarySwitchBtnBgd;
  };
});

var dropdownScrollBar = (0, _styledComponents.css)(_templateObject9, function (props) {
  return props.theme.dropdownListBgd;
}, function (props) {
  return props.theme.dropdownListBgd;
}, function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.dropdownListBgd;
}, function (props) {
  return props.theme.textColorHl;
});

var sidePanelScrollBar = (0, _styledComponents.css)(_templateObject9, function (props) {
  return props.theme.sidePanelBg;
}, function (props) {
  return props.theme.sidePanelBg;
}, function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.sidePanelBg;
}, function (props) {
  return props.theme.textColorHl;
});

var dropdownListAnchor = (0, _styledComponents.css)(_templateObject10, function (props) {
  return props.theme.selectColor;
});

var dropdownListItem = (0, _styledComponents.css)(_templateObject11, function (props) {
  return props.theme.dropdownListHighlightBg;
}, function (props) {
  return props.theme.textColorHl;
});

var dropdownListHeader = (0, _styledComponents.css)(_templateObject12, function (props) {
  return props.theme.labelColor;
});

var dropdownListSection = (0, _styledComponents.css)(_templateObject13, function (props) {
  return props.theme.labelColor;
});

var dropdownList = (0, _styledComponents.css)(_templateObject14, function (props) {
  return props.theme.dropdownListShadow;
}, function (props) {
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

var scrollBar = (0, _styledComponents.css)(_templateObject15, function (props) {
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

var modalScrollBar = exports.modalScrollBar = (0, _styledComponents.css)(_templateObject16, function (props) {
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
  inlineInput: inlineInput,
  chickletedInput: chickletedInput,
  secondaryInput: secondaryInput,
  dropdownScrollBar: dropdownScrollBar,
  dropdownList: dropdownList,
  dropdownListItem: dropdownListItem,
  dropdownListAnchor: dropdownListAnchor,
  dropdownListHeader: dropdownListHeader,
  dropdownListSection: dropdownListSection,
  dropdownListShadow: dropdownListShadow,
  modalScrollBar: modalScrollBar,
  scrollBar: scrollBar,
  sidePanelScrollBar: sidePanelScrollBar,
  inputSwitch: inputSwitch,
  secondarySwitch: secondarySwitch,
  switchTrack: switchTrack,
  switchButton: switchButton,

  // Transitions
  transition: transition,
  transitionFast: transitionFast,
  transitionSlow: transitionSlow,

  // styles
  activeColor: activeColor,
  activeColorHover: activeColorHover,
  borderRadius: borderRadius,
  boxShadow: boxShadow,
  errorColor: errorColor,
  dropdownListHighlightBg: dropdownListHighlightBg,
  dropdownListBgd: dropdownListBgd,
  dropdownListBorderTop: dropdownListBorderTop,

  labelColor: labelColor,
  labelColorLT: labelColorLT,
  labelHoverColor: labelHoverColor,
  mapPanelBackgroundColor: mapPanelBackgroundColor,
  mapPanelHeaderBackgroundColor: mapPanelHeaderBackgroundColor,

  // Select
  selectActiveBorderColor: selectActiveBorderColor,
  selectBackground: selectBackground,
  selectBackgroundLT: selectBackgroundLT,
  selectBackgroundHover: selectBackgroundHover,
  selectBackgroundHoverLT: selectBackgroundHoverLT,
  selectBorder: selectBorder,
  selectBorderColor: selectBorderColor,
  selectBorderRadius: selectBorderRadius,
  selectColor: selectColor,
  selectColorPlaceHolder: selectColorPlaceHolder,
  selectFontSize: selectFontSize,
  selectFontWeight: selectFontWeight,
  selectColorLT: selectColorLT,

  // Input
  inputBgd: inputBgd,
  inputBgdHover: inputBgdHover,
  inputBgdActive: inputBgdActive,
  inputBoxHeight: inputBoxHeight,
  inputBorderColor: inputBorderColor,
  inputBorderActiveColor: inputBorderActiveColor,
  inputBorderHoverColor: inputBorderHoverColor,
  inputBorderRadius: inputBorderRadius,
  inputColor: inputColor,
  inputPadding: inputPadding,
  inputFontSize: inputFontSize,
  inputFontWeight: inputFontWeight,
  inputPlaceholderColor: inputPlaceholderColor,
  inputPlaceholderFontWeight: inputPlaceholderFontWeight,

  secondaryInputBgd: secondaryInputBgd,
  secondaryInputBgdHover: secondaryInputBgdHover,
  secondaryInputBgdActive: secondaryInputBgdActive,
  secondaryInputHeight: secondaryInputHeight,
  secondaryInputColor: secondaryInputColor,
  secondaryInputBorderColor: secondaryInputBorderColor,
  secondaryInputBorderActiveColor: secondaryInputBorderActiveColor,

  switchWidth: switchWidth,
  switchHeight: switchHeight,
  switchTrackBgd: switchTrackBgd,
  switchTrackBgdActive: switchTrackBgdActive,
  switchTrackBorderRadius: switchTrackBorderRadius,
  switchBtnBgd: switchBtnBgd,
  switchBtnBgdActive: switchBtnBgdActive,
  switchBtnBoxShadow: switchBtnBoxShadow,
  switchBtnBorderRadius: switchBtnBorderRadius,
  switchBtnWidth: switchBtnWidth,
  switchBtnHeight: switchBtnHeight,
  switchLabelMargin: switchLabelMargin,

  secondarySwitchTrackBgd: secondarySwitchTrackBgd,
  secondarySwitchBtnBgd: secondarySwitchBtnBgd,

  // Button
  primaryBtnBgd: primaryBtnBgd,
  primaryBtnActBgd: primaryBtnActBgd,
  primaryBtnColor: primaryBtnColor,
  primaryBtnActColor: primaryBtnActColor,
  primaryBtnBgdHover: primaryBtnBgdHover,
  primaryBtnRadius: primaryBtnRadius,
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

  // Side Panel
  sidePanelBg: sidePanelBg,

  sideBarCloseBtnBgd: sideBarCloseBtnBgd,
  sideBarCloseBtnColor: sideBarCloseBtnColor,
  sideBarCloseBtnBgdHover: sideBarCloseBtnBgdHover,
  sidePanelHeaderBg: sidePanelHeaderBg,

  // Side Panel Panel
  panelActiveBg: panelActiveBg,
  panelBackground: panelBackground,
  panelBackgroundHover: panelBackgroundHover,
  panelBackgroundLT: panelBackgroundLT,
  panelBoxShadow: panelBoxShadow,
  panelBorderRadius: panelBorderRadius,
  panelBorder: panelBorder,
  panelBorderColor: panelBorderColor,
  panelBorderLT: panelBorderLT,
  panelHeaderIcon: panelHeaderIcon,
  panelHeaderIconActive: panelHeaderIconActive,
  panelHeaderHeight: panelHeaderHeight,

  // Text
  textColor: textColor,
  textColorLT: textColorLT,
  textColorHl: textColorHl,
  titleTextColor: titleTextColor,
  subtextColor: subtextColor,
  subtextColorLT: subtextColorLT,
  subtextColorActive: subtextColorActive,
  textTruncate: textTruncate,
  titleColorLT: titleColorLT,
  tooltipBg: tooltipBg,
  tooltipColor: tooltipColor,

  // Slider
  sliderBarColor: sliderBarColor,
  sliderBarBgd: sliderBarBgd,
  sliderBarHoverColor: sliderBarHoverColor,
  sliderBarRadius: sliderBarRadius,
  sliderBarHeight: sliderBarHeight,
  sliderHandleHeight: sliderHandleHeight,
  sliderHandleWidth: sliderHandleWidth,
  sliderHandleColor: sliderHandleColor,
  sliderHandleHoverColor: sliderHandleHoverColor,
  sliderHandleShadow: sliderHandleShadow,

  // Plot
  rangeBrushBgd: rangeBrushBgd
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHlsZXMvYmFzZS5qcyJdLCJuYW1lcyI6WyJ0cmFuc2l0aW9uIiwidHJhbnNpdGlvbkZhc3QiLCJ0cmFuc2l0aW9uU2xvdyIsImJveFNoYWRvdyIsImJveFNpemluZyIsImJvcmRlclJhZGl1cyIsImJvcmRlckNvbG9yIiwiYm9yZGVyQ29sb3JMaWdodCIsImxhYmVsQ29sb3IiLCJsYWJlbEhvdmVyQ29sb3IiLCJsYWJlbENvbG9yTFQiLCJ0ZXh0Q29sb3IiLCJ0ZXh0Q29sb3JMVCIsInRpdGxlQ29sb3JMVCIsInN1YnRleHRDb2xvciIsInN1YnRleHRDb2xvckxUIiwic3VidGV4dENvbG9yQWN0aXZlIiwidGl0bGVUZXh0Q29sb3IiLCJ0ZXh0Q29sb3JIbCIsImFjdGl2ZUNvbG9yIiwiYWN0aXZlQ29sb3JIb3ZlciIsImVycm9yQ29sb3IiLCJlcnJvckJnQ29sb3IiLCJwb3NpdGl2ZUNvbG9yIiwicG9zaXRpdmVCZ0NvbG9yIiwicHJpbWFyeUJ0bkJnZCIsInByaW1hcnlCdG5BY3RCZ2QiLCJwcmltYXJ5QnRuQ29sb3IiLCJwcmltYXJ5QnRuQWN0Q29sb3IiLCJwcmltYXJ5QnRuQmdkSG92ZXIiLCJwcmltYXJ5QnRuUmFkaXVzIiwic2Vjb25kYXJ5QnRuQmdkIiwic2Vjb25kYXJ5QnRuQWN0QmdkIiwic2Vjb25kYXJ5QnRuQ29sb3IiLCJzZWNvbmRhcnlCdG5BY3RDb2xvciIsInNlY29uZGFyeUJ0bkJnZEhvdmVyIiwibGlua0J0bkJnZCIsImxpbmtCdG5BY3RCZ2QiLCJsaW5rQnRuQ29sb3IiLCJsaW5rQnRuQWN0Q29sb3IiLCJsaW5rQnRuQWN0QmdkSG92ZXIiLCJpbnB1dEJveEhlaWdodCIsImlucHV0UGFkZGluZyIsImlucHV0Rm9udFNpemUiLCJpbnB1dEZvbnRXZWlnaHQiLCJpbnB1dEJnZCIsImlucHV0QmdkSG92ZXIiLCJpbnB1dEJnZEFjdGl2ZSIsImlucHV0Qm9yZGVyQ29sb3IiLCJpbnB1dEJvcmRlckhvdmVyQ29sb3IiLCJpbnB1dEJvcmRlckFjdGl2ZUNvbG9yIiwiaW5wdXRDb2xvciIsImlucHV0Qm9yZGVyUmFkaXVzIiwiaW5wdXRQbGFjZWhvbGRlckNvbG9yIiwiaW5wdXRQbGFjZWhvbGRlckZvbnRXZWlnaHQiLCJzZWNvbmRhcnlJbnB1dEhlaWdodCIsInNlY29uZGFyeUlucHV0QmdkIiwic2Vjb25kYXJ5SW5wdXRCZ2RIb3ZlciIsInNlY29uZGFyeUlucHV0QmdkQWN0aXZlIiwic2Vjb25kYXJ5SW5wdXRDb2xvciIsInNlY29uZGFyeUlucHV0Qm9yZGVyQ29sb3IiLCJzZWNvbmRhcnlJbnB1dEJvcmRlckFjdGl2ZUNvbG9yIiwic3dpdGNoV2lkdGgiLCJzd2l0Y2hIZWlnaHQiLCJzd2l0Y2hMYWJlbE1hcmdpbiIsInN3aXRjaFRyYWNrQmdkIiwic3dpdGNoVHJhY2tCZ2RBY3RpdmUiLCJzd2l0Y2hUcmFja0JvcmRlclJhZGl1cyIsInN3aXRjaEJ0bkJnZCIsInN3aXRjaEJ0bkJnZEFjdGl2ZSIsInN3aXRjaEJ0bkJveFNoYWRvdyIsInN3aXRjaEJ0bkJvcmRlclJhZGl1cyIsInN3aXRjaEJ0bldpZHRoIiwic3dpdGNoQnRuSGVpZ2h0Iiwic2Vjb25kYXJ5U3dpdGNoVHJhY2tCZ2QiLCJzZWNvbmRhcnlTd2l0Y2hCdG5CZ2QiLCJzZWxlY3RDb2xvciIsInNlbGVjdENvbG9yTFQiLCJzZWxlY3RBY3RpdmVCb3JkZXJDb2xvciIsInNlbGVjdEZvbnRTaXplIiwic2VsZWN0Rm9udFdlaWdodCIsInNlbGVjdEZvbnRXZWlnaHRCb2xkIiwic2VsZWN0Q29sb3JQbGFjZUhvbGRlciIsInNlbGVjdEJhY2tncm91bmQiLCJzZWxlY3RCYWNrZ3JvdW5kSG92ZXIiLCJzZWxlY3RCYWNrZ3JvdW5kTFQiLCJzZWxlY3RCYWNrZ3JvdW5kSG92ZXJMVCIsInNlbGVjdEJvcmRlckNvbG9yIiwic2VsZWN0Qm9yZGVyUmFkaXVzIiwic2VsZWN0Qm9yZGVyIiwiZHJvcGRvd25MaXN0SGlnaGxpZ2h0QmciLCJkcm9wZG93bkxpc3RTaGFkb3ciLCJkcm9wZG93bkxpc3RCZ2QiLCJkcm9wZG93bkxpc3RCb3JkZXJUb3AiLCJzaWRlUGFuZWxIZWFkZXJCZyIsInNpZGVQYW5lbEJnIiwic2lkZUJhckNsb3NlQnRuQmdkIiwic2lkZUJhckNsb3NlQnRuQ29sb3IiLCJzaWRlQmFyQ2xvc2VCdG5CZ2RIb3ZlciIsInBhbmVsQmFja2dyb3VuZCIsInBhbmVsQmFja2dyb3VuZEhvdmVyIiwicGFuZWxBY3RpdmVCZyIsInBhbmVsSGVhZGVySWNvbiIsInBhbmVsSGVhZGVySWNvbkFjdGl2ZSIsInBhbmVsSGVhZGVySGVpZ2h0IiwicGFuZWxCb3hTaGFkb3ciLCJwYW5lbEJvcmRlclJhZGl1cyIsInBhbmVsQmFja2dyb3VuZExUIiwicGFuZWxCb3JkZXJDb2xvciIsInBhbmVsQm9yZGVyIiwicGFuZWxCb3JkZXJMVCIsIm1hcFBhbmVsQmFja2dyb3VuZENvbG9yIiwibWFwUGFuZWxIZWFkZXJCYWNrZ3JvdW5kQ29sb3IiLCJ0b29sdGlwQmciLCJ0b29sdGlwQ29sb3IiLCJtb2RhbFRpdGxlQ29sb3IiLCJtb2RhbFRpdGxlRm9udFNpemUiLCJtb2RhbEZvb3RlckJnZCIsInNsaWRlckJhckNvbG9yIiwic2xpZGVyQmFyQmdkIiwic2xpZGVyQmFySG92ZXJDb2xvciIsInNsaWRlckJhclJhZGl1cyIsInNsaWRlckJhckhlaWdodCIsInNsaWRlckhhbmRsZUhlaWdodCIsInNsaWRlckhhbmRsZVdpZHRoIiwic2xpZGVySGFuZGxlQ29sb3IiLCJzbGlkZXJIYW5kbGVIb3ZlckNvbG9yIiwic2xpZGVySGFuZGxlU2hhZG93IiwicmFuZ2VCcnVzaEJnZCIsInRleHRUcnVuY2F0ZSIsIm1heFdpZHRoIiwib3ZlcmZsb3ciLCJ0ZXh0T3ZlcmZsb3ciLCJ3aGl0ZVNwYWNlIiwid29yZFdyYXAiLCJpbnB1dCIsInByb3BzIiwidGhlbWUiLCJhY3RpdmUiLCJlcnJvciIsImRpc2FibGVkIiwic2Vjb25kYXJ5SW5wdXQiLCJjaGlja2xldGVkSW5wdXQiLCJpbmxpbmVJbnB1dCIsInN3aXRjaFRyYWNrIiwiY2hlY2tlZCIsInN3aXRjaEJ1dHRvbiIsImlucHV0U3dpdGNoIiwic2Vjb25kYXJ5U3dpdGNoIiwiZHJvcGRvd25TY3JvbGxCYXIiLCJzaWRlUGFuZWxTY3JvbGxCYXIiLCJkcm9wZG93bkxpc3RBbmNob3IiLCJkcm9wZG93bkxpc3RJdGVtIiwiZHJvcGRvd25MaXN0SGVhZGVyIiwiZHJvcGRvd25MaXN0U2VjdGlvbiIsImRyb3Bkb3duTGlzdCIsInNjcm9sbEJhciIsIm1vZGFsU2Nyb2xsQmFyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUVPLElBQU1BLGtDQUFhLGNBQW5CO0FBQ0EsSUFBTUMsMENBQWlCLGNBQXZCO0FBQ0EsSUFBTUMsMENBQWlCLGNBQXZCOztBQUVBLElBQU1DLGdDQUFZLDhCQUFsQjtBQUNBLElBQU1DLGdDQUFZLFlBQWxCO0FBQ0EsSUFBTUMsc0NBQWUsS0FBckI7QUFDQSxJQUFNQyxvQ0FBYyxTQUFwQjtBQUNBLElBQU1DLDhDQUFtQixTQUF6Qjs7QUFFUDtBQUNPLElBQU1DLGtDQUFhLFNBQW5CO0FBQ0EsSUFBTUMsNENBQWtCLFNBQXhCO0FBQ0EsSUFBTUMsc0NBQWUsU0FBckI7O0FBRUEsSUFBTUMsZ0NBQVksU0FBbEI7QUFDQSxJQUFNQyxvQ0FBYyxTQUFwQjtBQUNBLElBQU1DLHNDQUFlLFNBQXJCOztBQUVBLElBQU1DLHNDQUFlLFNBQXJCO0FBQ0EsSUFBTUMsMENBQWlCLFNBQXZCO0FBQ0EsSUFBTUMsa0RBQXFCLFNBQTNCOztBQUVBLElBQU1DLDBDQUFpQixTQUF2QjtBQUNBLElBQU1DLG9DQUFjLFNBQXBCO0FBQ0EsSUFBTUMsb0NBQWMsU0FBcEI7QUFDQSxJQUFNQyw4Q0FBbUIsU0FBekI7QUFDQSxJQUFNQyxrQ0FBYSxTQUFuQjtBQUNBLElBQU1DLHNDQUFlLFNBQXJCO0FBQ0EsSUFBTUMsd0NBQWdCLFNBQXRCO0FBQ0EsSUFBTUMsNENBQWtCLFNBQXhC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c0tYQyx3Q0F0S1c7O0FBd0tYO0FBQ0FDO0FBektXLEVBQU4iLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y3NzfSBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0RJTUVOU0lPTlN9IGZyb20gJy4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuZXhwb3J0IGNvbnN0IHRyYW5zaXRpb24gPSAnYWxsIC40cyBlYXNlJztcbmV4cG9ydCBjb25zdCB0cmFuc2l0aW9uRmFzdCA9ICdhbGwgLjJzIGVhc2UnO1xuZXhwb3J0IGNvbnN0IHRyYW5zaXRpb25TbG93ID0gJ2FsbCAuOHMgZWFzZSc7XG5cbmV4cG9ydCBjb25zdCBib3hTaGFkb3cgPSAnMCAxcHggMnB4IDAgcmdiYSgwLDAsMCwwLjEwKSc7XG5leHBvcnQgY29uc3QgYm94U2l6aW5nID0gJ2JvcmRlci1ib3gnO1xuZXhwb3J0IGNvbnN0IGJvcmRlclJhZGl1cyA9ICcxcHgnO1xuZXhwb3J0IGNvbnN0IGJvcmRlckNvbG9yID0gJyMzQTQxNEMnO1xuZXhwb3J0IGNvbnN0IGJvcmRlckNvbG9yTGlnaHQgPSAnI0YxRjFGMSc7XG5cbi8vIFRFWFRcbmV4cG9ydCBjb25zdCBsYWJlbENvbG9yID0gJyM2QTc0ODUnO1xuZXhwb3J0IGNvbnN0IGxhYmVsSG92ZXJDb2xvciA9ICcjQzZDNkM2JztcbmV4cG9ydCBjb25zdCBsYWJlbENvbG9yTFQgPSAnIzZBNzQ4NSc7XG5cbmV4cG9ydCBjb25zdCB0ZXh0Q29sb3IgPSAnI0EwQTdCNCc7XG5leHBvcnQgY29uc3QgdGV4dENvbG9yTFQgPSAnIzNBNDE0Qyc7XG5leHBvcnQgY29uc3QgdGl0bGVDb2xvckxUID0gJyMyOTMyM0MnO1xuXG5leHBvcnQgY29uc3Qgc3VidGV4dENvbG9yID0gJyM2QTc0ODUnO1xuZXhwb3J0IGNvbnN0IHN1YnRleHRDb2xvckxUID0gJyNBMEE3QjQnO1xuZXhwb3J0IGNvbnN0IHN1YnRleHRDb2xvckFjdGl2ZSA9ICcjRkZGRkZGJztcblxuZXhwb3J0IGNvbnN0IHRpdGxlVGV4dENvbG9yID0gJyNGRkZGRkYnO1xuZXhwb3J0IGNvbnN0IHRleHRDb2xvckhsID0gJyNEM0Q4RTAnO1xuZXhwb3J0IGNvbnN0IGFjdGl2ZUNvbG9yID0gJyMxRkJBRDYnO1xuZXhwb3J0IGNvbnN0IGFjdGl2ZUNvbG9ySG92ZXIgPSAnIzEwODE4OCc7XG5leHBvcnQgY29uc3QgZXJyb3JDb2xvciA9ICcjQ0EzQjI3JztcbmV4cG9ydCBjb25zdCBlcnJvckJnQ29sb3IgPSAnI0ZFRUZFQic7XG5leHBvcnQgY29uc3QgcG9zaXRpdmVDb2xvciA9ICcjNjI5QTQxJztcbmV4cG9ydCBjb25zdCBwb3NpdGl2ZUJnQ29sb3IgPSAnI0YzRjlFRCc7XG5cbi8vIEJ1dHRvblxuZXhwb3J0IGNvbnN0IHByaW1hcnlCdG5CZ2QgPSAnIzBGOTY2OCc7XG5leHBvcnQgY29uc3QgcHJpbWFyeUJ0bkFjdEJnZCA9ICcjMTNCMTdCJztcbmV4cG9ydCBjb25zdCBwcmltYXJ5QnRuQ29sb3IgPSAnI0ZGRkZGRic7XG5leHBvcnQgY29uc3QgcHJpbWFyeUJ0bkFjdENvbG9yID0gJyNGRkZGRkYnO1xuZXhwb3J0IGNvbnN0IHByaW1hcnlCdG5CZ2RIb3ZlciA9ICcjMTNCMTdCJztcbmV4cG9ydCBjb25zdCBwcmltYXJ5QnRuUmFkaXVzID0gJzJweCc7XG5cbmV4cG9ydCBjb25zdCBzZWNvbmRhcnlCdG5CZ2QgPSAnIzZBNzQ4NSc7XG5leHBvcnQgY29uc3Qgc2Vjb25kYXJ5QnRuQWN0QmdkID0gJyNBMEE3QjQnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUJ0bkNvbG9yID0gJyNGRkZGRkYnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUJ0bkFjdENvbG9yID0gJyNGRkZGRkYnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUJ0bkJnZEhvdmVyID0gJyNBMEE3QjQnO1xuXG5leHBvcnQgY29uc3QgbGlua0J0bkJnZCA9ICd0cmFuc3BhcmVudCc7XG5leHBvcnQgY29uc3QgbGlua0J0bkFjdEJnZCA9IGxpbmtCdG5CZ2Q7XG5leHBvcnQgY29uc3QgbGlua0J0bkNvbG9yID0gJyNBMEE3QjQnO1xuZXhwb3J0IGNvbnN0IGxpbmtCdG5BY3RDb2xvciA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBsaW5rQnRuQWN0QmdkSG92ZXIgPSBsaW5rQnRuQmdkO1xuXG4vLyBJbnB1dFxuZXhwb3J0IGNvbnN0IGlucHV0Qm94SGVpZ2h0ID0gJzM0cHgnO1xuZXhwb3J0IGNvbnN0IGlucHV0UGFkZGluZyA9ICc0cHggMTBweCc7XG5leHBvcnQgY29uc3QgaW5wdXRGb250U2l6ZSA9ICcxMXB4JztcbmV4cG9ydCBjb25zdCBpbnB1dEZvbnRXZWlnaHQgPSA1MDA7XG5leHBvcnQgY29uc3QgaW5wdXRCZ2QgPSAnIzI5MzIzQyc7XG5leHBvcnQgY29uc3QgaW5wdXRCZ2RIb3ZlciA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBpbnB1dEJnZEFjdGl2ZSA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBpbnB1dEJvcmRlckNvbG9yID0gJyMyOTMyM0MnO1xuZXhwb3J0IGNvbnN0IGlucHV0Qm9yZGVySG92ZXJDb2xvciA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBpbnB1dEJvcmRlckFjdGl2ZUNvbG9yID0gJyNEM0Q4RTAnO1xuZXhwb3J0IGNvbnN0IGlucHV0Q29sb3IgPSAnI0EwQTdCNCc7XG5leHBvcnQgY29uc3QgaW5wdXRCb3JkZXJSYWRpdXMgPSAnMXB4JztcbmV4cG9ydCBjb25zdCBpbnB1dFBsYWNlaG9sZGVyQ29sb3IgPSAnIzZBNzQ4NSc7XG5leHBvcnQgY29uc3QgaW5wdXRQbGFjZWhvbGRlckZvbnRXZWlnaHQgPSA0MDA7XG5cbmV4cG9ydCBjb25zdCBzZWNvbmRhcnlJbnB1dEhlaWdodCA9ICcyOHB4JztcbmV4cG9ydCBjb25zdCBzZWNvbmRhcnlJbnB1dEJnZCA9ICcjMjQyNzMwJztcbmV4cG9ydCBjb25zdCBzZWNvbmRhcnlJbnB1dEJnZEhvdmVyID0gJyMzQTQxNEMnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUlucHV0QmdkQWN0aXZlID0gJyMzQTQxNEMnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUlucHV0Q29sb3IgPSAnI0EwQTdCNCc7XG5leHBvcnQgY29uc3Qgc2Vjb25kYXJ5SW5wdXRCb3JkZXJDb2xvciA9ICcjMjQyNzMwJztcbmV4cG9ydCBjb25zdCBzZWNvbmRhcnlJbnB1dEJvcmRlckFjdGl2ZUNvbG9yID0gJyNEM0Q4RTAnO1xuXG5leHBvcnQgY29uc3Qgc3dpdGNoV2lkdGggPSAyNDtcbmV4cG9ydCBjb25zdCBzd2l0Y2hIZWlnaHQgPSAxMjtcbmV4cG9ydCBjb25zdCBzd2l0Y2hMYWJlbE1hcmdpbiA9IDEyO1xuXG5leHBvcnQgY29uc3Qgc3dpdGNoVHJhY2tCZ2QgPSAnIzI5MzIzQyc7XG5leHBvcnQgY29uc3Qgc3dpdGNoVHJhY2tCZ2RBY3RpdmUgPSBhY3RpdmVDb2xvcjtcbmV4cG9ydCBjb25zdCBzd2l0Y2hUcmFja0JvcmRlclJhZGl1cyA9ICcxcHgnO1xuZXhwb3J0IGNvbnN0IHN3aXRjaEJ0bkJnZCA9ICcjNkE3NDg1JztcbmV4cG9ydCBjb25zdCBzd2l0Y2hCdG5CZ2RBY3RpdmUgPSAnI0QzRDhFMCc7XG5leHBvcnQgY29uc3Qgc3dpdGNoQnRuQm94U2hhZG93ID0gJzAgMnB4IDRweCAwIHJnYmEoMCwwLDAsMC40MCknO1xuZXhwb3J0IGNvbnN0IHN3aXRjaEJ0bkJvcmRlclJhZGl1cyA9ICcxcHgnO1xuZXhwb3J0IGNvbnN0IHN3aXRjaEJ0bldpZHRoID0gJzEycHgnO1xuZXhwb3J0IGNvbnN0IHN3aXRjaEJ0bkhlaWdodCA9ICcxMnB4JztcblxuZXhwb3J0IGNvbnN0IHNlY29uZGFyeVN3aXRjaFRyYWNrQmdkID0gJyMyNDI3MzAnO1xuZXhwb3J0IGNvbnN0IHNlY29uZGFyeVN3aXRjaEJ0bkJnZCA9ICcjM0E0MTRDJztcblxuLy8gU2VsZWN0XG5leHBvcnQgY29uc3Qgc2VsZWN0Q29sb3IgPSBpbnB1dENvbG9yO1xuZXhwb3J0IGNvbnN0IHNlbGVjdENvbG9yTFQgPSB0aXRsZUNvbG9yTFQ7XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RBY3RpdmVCb3JkZXJDb2xvciA9ICcjRDNEOEUwJztcbmV4cG9ydCBjb25zdCBzZWxlY3RGb250U2l6ZSA9ICcxMXB4JztcbmV4cG9ydCBjb25zdCBzZWxlY3RGb250V2VpZ2h0ID0gJzQwMCc7XG5leHBvcnQgY29uc3Qgc2VsZWN0Rm9udFdlaWdodEJvbGQgPSAnNTAwJztcblxuZXhwb3J0IGNvbnN0IHNlbGVjdENvbG9yUGxhY2VIb2xkZXIgPSAnIzZBNzQ4NSc7XG5leHBvcnQgY29uc3Qgc2VsZWN0QmFja2dyb3VuZCA9IGlucHV0QmdkO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEJhY2tncm91bmRIb3ZlciA9IGlucHV0QmdkSG92ZXI7XG5leHBvcnQgY29uc3Qgc2VsZWN0QmFja2dyb3VuZExUID0gJyNGRkZGRkYnO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEJhY2tncm91bmRIb3ZlckxUID0gJyNGOEY4RjknO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEJvcmRlckNvbG9yID0gJyNEM0Q4RTAnO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEJvcmRlclJhZGl1cyA9ICcxcHgnO1xuZXhwb3J0IGNvbnN0IHNlbGVjdEJvcmRlciA9IDA7XG5cbmV4cG9ydCBjb25zdCBkcm9wZG93bkxpc3RIaWdobGlnaHRCZyA9ICcjNkE3NDg1JztcbmV4cG9ydCBjb25zdCBkcm9wZG93bkxpc3RTaGFkb3cgPSAnMCA2cHggMTJweCAwIHJnYmEoMCwwLDAsMC4xNiknO1xuZXhwb3J0IGNvbnN0IGRyb3Bkb3duTGlzdEJnZCA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBkcm9wZG93bkxpc3RCb3JkZXJUb3AgPSAnIzI0MjczMCc7XG5cbi8vIFNpZGUgUGFuZWxcbmV4cG9ydCBjb25zdCBzaWRlUGFuZWxIZWFkZXJCZyA9ICcjMjkzMjNDJztcbmV4cG9ydCBjb25zdCBzaWRlUGFuZWxCZyA9ICcjMjQyNzMwJztcbmV4cG9ydCBjb25zdCBzaWRlQmFyQ2xvc2VCdG5CZ2QgPSBzZWNvbmRhcnlCdG5CZ2Q7XG5leHBvcnQgY29uc3Qgc2lkZUJhckNsb3NlQnRuQ29sb3IgPSAnIzI5MzIzQyc7XG5leHBvcnQgY29uc3Qgc2lkZUJhckNsb3NlQnRuQmdkSG92ZXIgPSBzZWNvbmRhcnlCdG5BY3RCZ2Q7XG5cbmV4cG9ydCBjb25zdCBwYW5lbEJhY2tncm91bmQgPSAnIzI5MzIzQyc7XG5leHBvcnQgY29uc3QgcGFuZWxCYWNrZ3JvdW5kSG92ZXIgPSAnIzNBNDU1Mic7XG5leHBvcnQgY29uc3QgcGFuZWxBY3RpdmVCZyA9ICcjM0E0NTUyJztcbmV4cG9ydCBjb25zdCBwYW5lbEhlYWRlckljb24gPSAnIzZBNzQ4NSc7XG5leHBvcnQgY29uc3QgcGFuZWxIZWFkZXJJY29uQWN0aXZlID0gJyNBMEE3QjQnO1xuZXhwb3J0IGNvbnN0IHBhbmVsSGVhZGVySGVpZ2h0ID0gNDg7XG5leHBvcnQgY29uc3QgcGFuZWxCb3hTaGFkb3cgPSAnMCA2cHggMTJweCAwIHJnYmEoMCwwLDAsMC4xNiknO1xuZXhwb3J0IGNvbnN0IHBhbmVsQm9yZGVyUmFkaXVzID0gJzJweCc7XG5leHBvcnQgY29uc3QgcGFuZWxCYWNrZ3JvdW5kTFQgPSAnI2Y4ZjhmOSc7XG5cbmV4cG9ydCBjb25zdCBwYW5lbEJvcmRlckNvbG9yID0gJyMzQTQxNEMnO1xuZXhwb3J0IGNvbnN0IHBhbmVsQm9yZGVyID0gYDFweCBzb2xpZCAke2JvcmRlckNvbG9yfWA7XG5leHBvcnQgY29uc3QgcGFuZWxCb3JkZXJMVCA9IGAxcHggc29saWQgJHtib3JkZXJDb2xvckxpZ2h0fWA7XG5cbmV4cG9ydCBjb25zdCBtYXBQYW5lbEJhY2tncm91bmRDb2xvciA9ICcjMjQyNzMwJztcbmV4cG9ydCBjb25zdCBtYXBQYW5lbEhlYWRlckJhY2tncm91bmRDb2xvciA9ICcjMjkzMjNDJztcbmV4cG9ydCBjb25zdCB0b29sdGlwQmcgPSAnI0Y4RjhGOSc7XG5leHBvcnQgY29uc3QgdG9vbHRpcENvbG9yID0gJyMzMzMzMzQnO1xuXG4vLyBNb2RhbFxuZXhwb3J0IGNvbnN0IG1vZGFsVGl0bGVDb2xvciA9ICcjM0E0MTRDJztcbmV4cG9ydCBjb25zdCBtb2RhbFRpdGxlRm9udFNpemUgPSAnMzJweCc7XG5leHBvcnQgY29uc3QgbW9kYWxGb290ZXJCZ2QgPSAnI0Y4RjhGOSc7XG5cbmV4cG9ydCBjb25zdCBzbGlkZXJCYXJDb2xvciA9ICcjNkE3NDg1JztcbmV4cG9ydCBjb25zdCBzbGlkZXJCYXJCZ2QgPSAnIzNBNDE0Qyc7XG5leHBvcnQgY29uc3Qgc2xpZGVyQmFySG92ZXJDb2xvciA9ICcjRDNEOEUwJztcbmV4cG9ydCBjb25zdCBzbGlkZXJCYXJSYWRpdXMgPSAnMXB4JztcbmV4cG9ydCBjb25zdCBzbGlkZXJCYXJIZWlnaHQgPSAnNHB4JztcbmV4cG9ydCBjb25zdCBzbGlkZXJIYW5kbGVIZWlnaHQgPSAnMTJweCc7XG5leHBvcnQgY29uc3Qgc2xpZGVySGFuZGxlV2lkdGggPSAnMTJweCc7XG5leHBvcnQgY29uc3Qgc2xpZGVySGFuZGxlQ29sb3IgPSAnI0QzRDhFMCc7XG5leHBvcnQgY29uc3Qgc2xpZGVySGFuZGxlSG92ZXJDb2xvciA9ICcjRkZGRkZGJztcbmV4cG9ydCBjb25zdCBzbGlkZXJIYW5kbGVTaGFkb3cgPSAnMCAycHggNHB4IDAgcmdiYSgwLDAsMCwwLjQwKSc7XG5cbi8vIFBsb3RcbmV4cG9ydCBjb25zdCByYW5nZUJydXNoQmdkID0gJyMzQTQxNEMnO1xuXG5leHBvcnQgY29uc3QgdGV4dFRydW5jYXRlID0ge1xuICBtYXhXaWR0aDogJzEwMCUnLFxuICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJyxcbiAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gIHdvcmRXcmFwOiAnbm9ybWFsJ1xufTtcblxuLy8gdGhlbWUgaXMgcGFzc2VkIHRvIGtlcGxlci5nbCB3aGVuIGl0J3MgbW91bnRlZCxcbi8vIGl0IGlzIHVzZWQgYnkgc3R5bGVkLWNvbXBvbmVudHMgdG8gcGFzcyBhbG9uZyB0b1xuLy8gYWxsIGNoaWxkIGNvbXBvbmVudHNcblxuY29uc3QgaW5wdXQgPSBjc3NgXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRCZ2R9O1xuICBib3JkZXI6IDFweCBzb2xpZFxuICAgICR7cHJvcHMgPT5cbiAgICAgIHByb3BzLmFjdGl2ZVxuICAgICAgICA/IHByb3BzLnRoZW1lLmlucHV0Qm9yZGVyQWN0aXZlQ29sb3JcbiAgICAgICAgOiBwcm9wcy5lcnJvciA/IHByb3BzLnRoZW1lLmVycm9yQ29sb3IgOiBwcm9wcy50aGVtZS5pbnB1dEJnZH07XG4gIGNhcmV0LWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0Qm9yZGVyQWN0aXZlQ29sb3J9O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dENvbG9yfTtcbiAgZGlzcGxheTogZmxleDtcbiAgZm9udC1zaXplOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0Rm9udFNpemV9O1xuICBmb250LXdlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dEZvbnRXZWlnaHR9O1xuICBoZWlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRCb3hIZWlnaHR9O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIG91dGxpbmU6IG5vbmU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHBhZGRpbmc6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRQYWRkaW5nfTtcbiAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gIHRyYW5zaXRpb246ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudHJhbnNpdGlvbn07XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gIHdpZHRoOiAxMDAlO1xuICB3b3JkLXdyYXA6IG5vcm1hbDtcbiAgcG9pbnRlci1ldmVudHM6ICR7cHJvcHMgPT4gKHByb3BzLmRpc2FibGVkID8gJ25vbmUnIDogJ2FsbCcpfTtcbiAgb3BhY2l0eTogJHtwcm9wcyA9PiAocHJvcHMuZGlzYWJsZWQgPyAwLjUgOiAxKX07XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PlxuICAgICAgcHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUuaW5wdXRCZ2RBY3RpdmUgOiBwcm9wcy50aGVtZS5pbnB1dEJnZEhvdmVyfTtcbiAgICBib3JkZXItY29sb3I6ICR7cHJvcHMgPT5cbiAgICAgIHByb3BzLmFjdGl2ZVxuICAgICAgICA/IHByb3BzLnRoZW1lLmlucHV0Qm9yZGVyQWN0aXZlQ29sb3JcbiAgICAgICAgOiBwcm9wcy50aGVtZS5pbnB1dEJvcmRlckhvdmVyQ29sb3J9O1xuICB9XG5cbiAgOmFjdGl2ZSxcbiAgJi5hY3RpdmUge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRCZ2RBY3RpdmV9O1xuICAgIGJvcmRlci1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dEJvcmRlckFjdGl2ZUNvbG9yfTtcbiAgfVxuXG4gIDo6cGxhY2Vob2xkZXIge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0UGxhY2Vob2xkZXJDb2xvcn07XG4gICAgZm9udC13ZWlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRQbGFjZWhvbGRlckZvbnRXZWlnaHR9O1xuICB9XG5cbiAgLyogRGlzYWJsZSBBcnJvd3Mgb24gTnVtYmVyIElucHV0cyAqL1xuICA6Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXG4gIDo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xuICAgIG1hcmdpbjogMDtcbiAgfVxuYDtcblxuY29uc3Qgc2Vjb25kYXJ5SW5wdXQgPSBjc3NgXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXR9IFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dENvbG9yfTtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dEJnZH07XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dEhlaWdodH07XG4gIGJvcmRlcjogMXB4IHNvbGlkXG4gICAgJHtwcm9wcyA9PiBwcm9wcy5lcnJvclxuICAgICAgICAgID8gcHJvcHMudGhlbWUuZXJyb3JDb2xvclxuICAgICAgICAgIDogcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXRCb3JkZXJDb2xvcn07XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dEJnZEhvdmVyfTtcbiAgICBib3JkZXItY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXRCZ2RIb3Zlcn07XG4gIH1cblxuICA6YWN0aXZlLFxuICAmLmFjdGl2ZSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dEJnZEFjdGl2ZX07XG4gICAgYm9yZGVyLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlY29uZGFyeUlucHV0Qm9yZGVyQWN0aXZlQ29sb3J9O1xuICB9XG5gO1xuXG5jb25zdCBjaGlja2xldGVkSW5wdXQgPSBjc3NgXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXR9IFxuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAgaGVpZ2h0OiBhdXRvO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHN0YXJ0O1xuICBtYXJnaW4tYm90dG9tOiAycHg7XG4gIHBhZGRpbmc6IDRweCA3cHggNHB4IDRweDtcbiAgd2hpdGUtc3BhY2U6IG5vcm1hbDtcbmA7XG5cbmNvbnN0IGlubGluZUlucHV0ID0gY3NzYFxuICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0fSBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICBmb250LXNpemU6IDEzcHg7XG4gIGxldHRlci1zcGFjaW5nOiAwLjQzcHg7XG4gIGxpbmUtaGVpZ2h0OiAxOHB4O1xuICBoZWlnaHQ6IDI0cHg7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIHBhZGRpbmctbGVmdDogNHB4O1xuICBtYXJnaW4tbGVmdDogLTRweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHRyYW5zcGFyZW50O1xuXG4gIDpob3ZlciB7XG4gICAgaGVpZ2h0OiAyNHB4O1xuICAgIGN1cnNvcjogdGV4dDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuICB9XG5cbiAgOmFjdGl2ZSxcbiAgLmFjdGl2ZSxcbiAgOmZvY3VzIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0Qm9yZGVyQWN0aXZlQ29sb3J9O1xuICB9XG5gO1xuXG5jb25zdCBzd2l0Y2hUcmFjayA9IGNzc2BcbiAgYmFja2dyb3VuZDogJHtwcm9wcyA9PlxuICAgIHByb3BzLmNoZWNrZWRcbiAgICAgID8gcHJvcHMudGhlbWUuc3dpdGNoVHJhY2tCZ2RBY3RpdmVcbiAgICAgIDogcHJvcHMudGhlbWUuc3dpdGNoVHJhY2tCZ2R9O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogJHtwcm9wcyA9PiAtcHJvcHMudGhlbWUuc3dpdGNoTGFiZWxNYXJnaW59cHg7XG4gIGNvbnRlbnQ6ICcnO1xuICBkaXNwbGF5OiBibG9jaztcbiAgd2lkdGg6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3dpdGNoV2lkdGh9cHg7XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zd2l0Y2hIZWlnaHR9cHg7XG4gIGJvcmRlci1yYWRpdXM6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3dpdGNoVHJhY2tCb3JkZXJSYWRpdXN9O1xuYDtcblxuY29uc3Qgc3dpdGNoQnV0dG9uID0gY3NzYFxuICB0cmFuc2l0aW9uOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRyYW5zaXRpb259O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogJHtwcm9wcyA9PiAocHJvcHMuY2hlY2tlZCA/IHByb3BzLnRoZW1lLnN3aXRjaFdpZHRoIC8gMiA6IC0xKSAtIHByb3BzLnRoZW1lLnN3aXRjaExhYmVsTWFyZ2lufXB4O1xuICBjb250ZW50OiAnJztcbiAgZGlzcGxheTogYmxvY2s7XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zd2l0Y2hCdG5IZWlnaHR9O1xuICB3aWR0aDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zd2l0Y2hCdG5XaWR0aH07XG4gIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMgPT5cbiAgICBwcm9wcy5jaGVja2VkID8gcHJvcHMudGhlbWUuc3dpdGNoQnRuQmdkQWN0aXZlIDogcHJvcHMudGhlbWUuc3dpdGNoQnRuQmdkfTtcbiAgYm94LXNoYWRvdzogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zd2l0Y2hCdG5Cb3hTaGFkb3d9O1xuYDtcblxuY29uc3QgaW5wdXRTd2l0Y2ggPSBjc3NgXG4gIHVzZXItc2VsZWN0OiBub25lO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGxpbmUtaGVpZ2h0OiAwO1xuICBmb250LXdlaWdodDogNTAwO1xuICBmb250LXNpemU6IDEycHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgcGFkZGluZy10b3A6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3dpdGNoSGVpZ2h0IC8gMn1weDtcbiAgcGFkZGluZy1yaWdodDogMDtcbiAgcGFkZGluZy1ib3R0b206IDA7XG4gIHBhZGRpbmctbGVmdDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zd2l0Y2hXaWR0aH1weDtcblxuICA6YmVmb3JlIHtcbiAgICAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN3aXRjaFRyYWNrfTtcbiAgfVxuXG4gIDphZnRlciB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zd2l0Y2hCdXR0b259O1xuICB9XG5gO1xuXG5jb25zdCBzZWNvbmRhcnlTd2l0Y2ggPSBjc3NgXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRTd2l0Y2h9IFxuICA6YmVmb3JlIHtcbiAgICAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN3aXRjaFRyYWNrfSBiYWNrZ3JvdW5kOiAke3Byb3BzID0+XG4gICAgICAgIHByb3BzLmNoZWNrZWRcbiAgICAgICAgICA/IHByb3BzLnRoZW1lLnN3aXRjaFRyYWNrQmdkQWN0aXZlXG4gICAgICAgICAgOiBwcm9wcy50aGVtZS5zZWNvbmRhcnlTd2l0Y2hUcmFja0JnZH07XG4gIH1cblxuICA6YWZ0ZXIge1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3dpdGNoQnV0dG9ufSBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzID0+XG4gICAgICAgIHByb3BzLmNoZWNrZWRcbiAgICAgICAgICA/IHByb3BzLnRoZW1lLnN3aXRjaEJ0bkJnZEFjdGl2ZVxuICAgICAgICAgIDogcHJvcHMudGhlbWUuc2Vjb25kYXJ5U3dpdGNoQnRuQmdkfTtcbiAgfVxuYDtcblxuY29uc3QgZHJvcGRvd25TY3JvbGxCYXIgPSBjc3NgXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgIGhlaWdodDogMTBweDtcbiAgICB3aWR0aDogMTBweDtcbiAgfVxuICBcbiAgOjotd2Via2l0LXNjcm9sbGJhci1jb3JuZXIge1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0QmdkfTtcbiAgfVxuICBcbiAgOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RCZ2R9O1xuICB9XG4gIFxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gICAgYm9yZGVyOiAzcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RCZ2R9O1xuICB9O1xuICBcbiAgOnZlcnRpY2FsOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgfVxufWA7XG5cbmNvbnN0IHNpZGVQYW5lbFNjcm9sbEJhciA9IGNzc2BcbiAgOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgaGVpZ2h0OiAxMHB4O1xuICAgIHdpZHRoOiAxMHB4O1xuICB9XG4gIFxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLWNvcm5lciB7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWxCZ307XG4gIH1cbiAgXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsQmd9O1xuICB9XG4gIFxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gICAgYm9yZGVyOiAzcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWxCZ307XG4gIH07XG4gIFxuICA6dmVydGljYWw6aG92ZXIge1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICB9XG59YDtcblxuY29uc3QgZHJvcGRvd25MaXN0QW5jaG9yID0gY3NzYFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3RDb2xvcn07XG4gIHBhZGRpbmctbGVmdDogM3B4O1xuYDtcblxuY29uc3QgZHJvcGRvd25MaXN0SXRlbSA9IGNzc2BcbiAgZm9udC1zaXplOiAxMXB4O1xuICBwYWRkaW5nOiAzcHggOXB4O1xuICBmb250LXdlaWdodDogNTAwO1xuXG4gICYuaG92ZXIsXG4gICY6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEhpZ2hsaWdodEJnfTtcblxuICAgIC5saXN0X19pdGVtX19hbmNob3Ige1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICAgIH1cbiAgfVxuYDtcblxuY29uc3QgZHJvcGRvd25MaXN0SGVhZGVyID0gY3NzYFxuICBmb250LXNpemU6IDExcHg7XG4gIHBhZGRpbmc6IDVweCA5cHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuYDtcblxuY29uc3QgZHJvcGRvd25MaXN0U2VjdGlvbiA9IGNzc2BcbiAgcGFkZGluZzogMCAwIDRweCAwO1xuICBtYXJnaW4tYm90dG9tOiA0cHg7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuYDtcblxuY29uc3QgZHJvcGRvd25MaXN0ID0gY3NzYFxuICBvdmVyZmxvdy15OiBvdmVybGF5O1xuICBtYXgtaGVpZ2h0OiAyODBweDtcbiAgYm94LXNoYWRvdzogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RTaGFkb3d9O1xuICBib3JkZXItcmFkaXVzOiAycHg7XG5cbiAgLmxpc3RfX3NlY3Rpb24ge1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0U2VjdGlvbn07XG4gIH1cbiAgLmxpc3RfX2hlYWRlciB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RIZWFkZXJ9O1xuICB9XG5cbiAgLmxpc3RfX2l0ZW0ge1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0SXRlbX07XG4gIH1cblxuICAubGlzdF9faXRlbV9fYW5jaG9yIHtcbiAgICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEFuY2hvcn07XG4gIH1cblxuICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duU2Nyb2xsQmFyfTtcbmA7XG5cbmNvbnN0IHNjcm9sbEJhciA9IGNzc2BcbiAgOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgd2lkdGg6IDE0cHg7XG4gIH1cbiAgXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsQmd9O1xuICB9XG4gIFxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCYWNrZ3JvdW5kfTtcbiAgICBib3JkZXI6IDNweCBzb2xpZCAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVQYW5lbEJnfVxuXG4gICAgJzp2ZXJ0aWNhbCc6IHtcbiAgICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCYWNrZ3JvdW5kfTtcbiAgICB9LFxuXG4gICAgJzp2ZXJ0aWNhbDpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2VsZWN0QmFja2dyb3VuZEhvdmVyfTtcbiAgICB9XG4gIH1cbn1gO1xuXG5leHBvcnQgY29uc3QgbW9kYWxTY3JvbGxCYXIgPSBjc3NgXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgIHdpZHRoOiAxNHB4O1xuICAgIGhlaWdodDogMTZweDtcbiAgfVxuXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICB9XG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2s6aG9yaXpvbnRhbCB7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gIH1cbiAgOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gICAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yTFR9O1xuICAgIGJvcmRlcjogNHB4IHNvbGlkIHdoaXRlO1xuICB9XG5cbiAgOjotd2Via2l0LXNjcm9sbGJhci1jb3JuZXIge1xuICAgIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICB9XG5cbiAgOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlciB7XG4gICAgYmFja2dyb3VuZDogIzk2OWRhOTtcbiAgfVxuXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWI6dmVydGljYWwge1xuICAgIGJvcmRlci1yYWRpdXM6IDdweDtcbiAgfVxuXG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWI6aG9yaXpvbnRhbCB7XG4gICAgYm9yZGVyLXJhZGl1czogOXB4O1xuICAgIGJvcmRlcjogNHB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgdGhlbWUgPSB7XG4gIC4uLkRJTUVOU0lPTlMsXG4gIC8vIHRlbXBsYXRlc1xuICBpbnB1dCxcbiAgaW5saW5lSW5wdXQsXG4gIGNoaWNrbGV0ZWRJbnB1dCxcbiAgc2Vjb25kYXJ5SW5wdXQsXG4gIGRyb3Bkb3duU2Nyb2xsQmFyLFxuICBkcm9wZG93bkxpc3QsXG4gIGRyb3Bkb3duTGlzdEl0ZW0sXG4gIGRyb3Bkb3duTGlzdEFuY2hvcixcbiAgZHJvcGRvd25MaXN0SGVhZGVyLFxuICBkcm9wZG93bkxpc3RTZWN0aW9uLFxuICBkcm9wZG93bkxpc3RTaGFkb3csXG4gIG1vZGFsU2Nyb2xsQmFyLFxuICBzY3JvbGxCYXIsXG4gIHNpZGVQYW5lbFNjcm9sbEJhcixcbiAgaW5wdXRTd2l0Y2gsXG4gIHNlY29uZGFyeVN3aXRjaCxcbiAgc3dpdGNoVHJhY2ssXG4gIHN3aXRjaEJ1dHRvbixcblxuICAvLyBUcmFuc2l0aW9uc1xuICB0cmFuc2l0aW9uLFxuICB0cmFuc2l0aW9uRmFzdCxcbiAgdHJhbnNpdGlvblNsb3csXG5cbiAgLy8gc3R5bGVzXG4gIGFjdGl2ZUNvbG9yLFxuICBhY3RpdmVDb2xvckhvdmVyLFxuICBib3JkZXJSYWRpdXMsXG4gIGJveFNoYWRvdyxcbiAgZXJyb3JDb2xvcixcbiAgZHJvcGRvd25MaXN0SGlnaGxpZ2h0QmcsXG4gIGRyb3Bkb3duTGlzdEJnZCxcbiAgZHJvcGRvd25MaXN0Qm9yZGVyVG9wLFxuXG4gIGxhYmVsQ29sb3IsXG4gIGxhYmVsQ29sb3JMVCxcbiAgbGFiZWxIb3ZlckNvbG9yLFxuICBtYXBQYW5lbEJhY2tncm91bmRDb2xvcixcbiAgbWFwUGFuZWxIZWFkZXJCYWNrZ3JvdW5kQ29sb3IsXG5cbiAgLy8gU2VsZWN0XG4gIHNlbGVjdEFjdGl2ZUJvcmRlckNvbG9yLFxuICBzZWxlY3RCYWNrZ3JvdW5kLFxuICBzZWxlY3RCYWNrZ3JvdW5kTFQsXG4gIHNlbGVjdEJhY2tncm91bmRIb3ZlcixcbiAgc2VsZWN0QmFja2dyb3VuZEhvdmVyTFQsXG4gIHNlbGVjdEJvcmRlcixcbiAgc2VsZWN0Qm9yZGVyQ29sb3IsXG4gIHNlbGVjdEJvcmRlclJhZGl1cyxcbiAgc2VsZWN0Q29sb3IsXG4gIHNlbGVjdENvbG9yUGxhY2VIb2xkZXIsXG4gIHNlbGVjdEZvbnRTaXplLFxuICBzZWxlY3RGb250V2VpZ2h0LFxuICBzZWxlY3RDb2xvckxULFxuXG4gIC8vIElucHV0XG4gIGlucHV0QmdkLFxuICBpbnB1dEJnZEhvdmVyLFxuICBpbnB1dEJnZEFjdGl2ZSxcbiAgaW5wdXRCb3hIZWlnaHQsXG4gIGlucHV0Qm9yZGVyQ29sb3IsXG4gIGlucHV0Qm9yZGVyQWN0aXZlQ29sb3IsXG4gIGlucHV0Qm9yZGVySG92ZXJDb2xvcixcbiAgaW5wdXRCb3JkZXJSYWRpdXMsXG4gIGlucHV0Q29sb3IsXG4gIGlucHV0UGFkZGluZyxcbiAgaW5wdXRGb250U2l6ZSxcbiAgaW5wdXRGb250V2VpZ2h0LFxuICBpbnB1dFBsYWNlaG9sZGVyQ29sb3IsXG4gIGlucHV0UGxhY2Vob2xkZXJGb250V2VpZ2h0LFxuXG4gIHNlY29uZGFyeUlucHV0QmdkLFxuICBzZWNvbmRhcnlJbnB1dEJnZEhvdmVyLFxuICBzZWNvbmRhcnlJbnB1dEJnZEFjdGl2ZSxcbiAgc2Vjb25kYXJ5SW5wdXRIZWlnaHQsXG4gIHNlY29uZGFyeUlucHV0Q29sb3IsXG4gIHNlY29uZGFyeUlucHV0Qm9yZGVyQ29sb3IsXG4gIHNlY29uZGFyeUlucHV0Qm9yZGVyQWN0aXZlQ29sb3IsXG5cbiAgc3dpdGNoV2lkdGgsXG4gIHN3aXRjaEhlaWdodCxcbiAgc3dpdGNoVHJhY2tCZ2QsXG4gIHN3aXRjaFRyYWNrQmdkQWN0aXZlLFxuICBzd2l0Y2hUcmFja0JvcmRlclJhZGl1cyxcbiAgc3dpdGNoQnRuQmdkLFxuICBzd2l0Y2hCdG5CZ2RBY3RpdmUsXG4gIHN3aXRjaEJ0bkJveFNoYWRvdyxcbiAgc3dpdGNoQnRuQm9yZGVyUmFkaXVzLFxuICBzd2l0Y2hCdG5XaWR0aCxcbiAgc3dpdGNoQnRuSGVpZ2h0LFxuICBzd2l0Y2hMYWJlbE1hcmdpbixcblxuICBzZWNvbmRhcnlTd2l0Y2hUcmFja0JnZCxcbiAgc2Vjb25kYXJ5U3dpdGNoQnRuQmdkLFxuXG4gIC8vIEJ1dHRvblxuICBwcmltYXJ5QnRuQmdkLFxuICBwcmltYXJ5QnRuQWN0QmdkLFxuICBwcmltYXJ5QnRuQ29sb3IsXG4gIHByaW1hcnlCdG5BY3RDb2xvcixcbiAgcHJpbWFyeUJ0bkJnZEhvdmVyLFxuICBwcmltYXJ5QnRuUmFkaXVzLFxuICBzZWNvbmRhcnlCdG5CZ2QsXG4gIHNlY29uZGFyeUJ0bkFjdEJnZCxcbiAgc2Vjb25kYXJ5QnRuQmdkSG92ZXIsXG4gIHNlY29uZGFyeUJ0bkNvbG9yLFxuICBzZWNvbmRhcnlCdG5BY3RDb2xvcixcbiAgbGlua0J0bkJnZCxcbiAgbGlua0J0bkFjdEJnZCxcbiAgbGlua0J0bkNvbG9yLFxuICBsaW5rQnRuQWN0Q29sb3IsXG4gIGxpbmtCdG5BY3RCZ2RIb3ZlcixcblxuICAvLyBNb2RhbFxuICBtb2RhbFRpdGxlQ29sb3IsXG4gIG1vZGFsVGl0bGVGb250U2l6ZSxcbiAgbW9kYWxGb290ZXJCZ2QsXG5cbiAgLy8gU2lkZSBQYW5lbFxuICBzaWRlUGFuZWxCZyxcblxuICBzaWRlQmFyQ2xvc2VCdG5CZ2QsXG4gIHNpZGVCYXJDbG9zZUJ0bkNvbG9yLFxuICBzaWRlQmFyQ2xvc2VCdG5CZ2RIb3ZlcixcbiAgc2lkZVBhbmVsSGVhZGVyQmcsXG5cbiAgLy8gU2lkZSBQYW5lbCBQYW5lbFxuICBwYW5lbEFjdGl2ZUJnLFxuICBwYW5lbEJhY2tncm91bmQsXG4gIHBhbmVsQmFja2dyb3VuZEhvdmVyLFxuICBwYW5lbEJhY2tncm91bmRMVCxcbiAgcGFuZWxCb3hTaGFkb3csXG4gIHBhbmVsQm9yZGVyUmFkaXVzLFxuICBwYW5lbEJvcmRlcixcbiAgcGFuZWxCb3JkZXJDb2xvcixcbiAgcGFuZWxCb3JkZXJMVCxcbiAgcGFuZWxIZWFkZXJJY29uLFxuICBwYW5lbEhlYWRlckljb25BY3RpdmUsXG4gIHBhbmVsSGVhZGVySGVpZ2h0LFxuXG4gIC8vIFRleHRcbiAgdGV4dENvbG9yLFxuICB0ZXh0Q29sb3JMVCxcbiAgdGV4dENvbG9ySGwsXG4gIHRpdGxlVGV4dENvbG9yLFxuICBzdWJ0ZXh0Q29sb3IsXG4gIHN1YnRleHRDb2xvckxULFxuICBzdWJ0ZXh0Q29sb3JBY3RpdmUsXG4gIHRleHRUcnVuY2F0ZSxcbiAgdGl0bGVDb2xvckxULFxuICB0b29sdGlwQmcsXG4gIHRvb2x0aXBDb2xvcixcblxuICAvLyBTbGlkZXJcbiAgc2xpZGVyQmFyQ29sb3IsXG4gIHNsaWRlckJhckJnZCxcbiAgc2xpZGVyQmFySG92ZXJDb2xvcixcbiAgc2xpZGVyQmFyUmFkaXVzLFxuICBzbGlkZXJCYXJIZWlnaHQsXG4gIHNsaWRlckhhbmRsZUhlaWdodCxcbiAgc2xpZGVySGFuZGxlV2lkdGgsXG4gIHNsaWRlckhhbmRsZUNvbG9yLFxuICBzbGlkZXJIYW5kbGVIb3ZlckNvbG9yLFxuICBzbGlkZXJIYW5kbGVTaGFkb3csXG5cbiAgLy8gUGxvdFxuICByYW5nZUJydXNoQmdkXG59O1xuIl19